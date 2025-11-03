"use client";
import React, { useState, useEffect, Fragment, useCallback, useRef } from "react";
import Galleries, { Author } from "../Galleries";
import InfiniteScroll from "react-infinite-scroll-component";
import WinnersList from "../WinnersList/WinnersList";
import ParticipantsList from "../ParticipantsList/ParticipantsList";
import { useAppSelector } from "@/store/hooks";
import { useGalleryAutoExpand } from "../hooks/useGalleryAutoExpand";

type AuthorsState = {
  allAuthors: Author[];
  authors: Author[];
  step: number;
  scrollEnded: boolean;
};

type PersistedState = {
  edition: number;
  lang: string;
  winnersCount: number;
  participantsCount: number;
  guestsCount: number;
  scrollY: number;
};

type Props = {
  edition: number | string;
  lang?: string;
  onAuthorNavigate?: (slug: string) => void;
};

const STORAGE_KEY_PREFIX = "edition_state";

const GalleriesList: React.FC<Props> = ({ edition, lang = "en", onAuthorNavigate }) => {
  const itemsCount = 2;
  const storageKey = `${STORAGE_KEY_PREFIX}_${lang}`;
  const initialEdition = Number(edition) || 0;
  const resolvedEditionRef = useRef<number>(initialEdition);
  const [winners, setWinners] = useState<AuthorsState>({
    allAuthors: [],
    authors: [],
    step: 0,
    scrollEnded: false,
  });
  const [participants, setParticipants] = useState<AuthorsState>({
    allAuthors: [],
    authors: [],
    step: 0,
    scrollEnded: false,
  });
  const [guests, setGuests] = useState<AuthorsState>({
    allAuthors: [],
    authors: [],
    step: 0,
    scrollEnded: false,
  });

  const { winnersFinished, participantsFinished, participantsIndex } = useAppSelector(
    (state) => state.galleryProgress
  );

  useGalleryAutoExpand({
    itemsCount,
    winnersFinished,
    participantsFinished,
    participantsIndex,
    winnersState: [winners, setWinners],
    participantsState: [participants, setParticipants],
  });

  const winnersCount = winners.authors.length;
  const participantsCount = participants.authors.length;
  const guestsCount = guests.authors.length;

  const persistState = useCallback(() => {
    if (typeof window === "undefined") return;
    const payload: PersistedState = {
      edition: resolvedEditionRef.current,
      lang,
      winnersCount,
      participantsCount,
      guestsCount,
      scrollY: window.scrollY,
    };
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch (error) {
      // ignore storage errors (private mode, etc.)
    }
  }, [guestsCount, lang, participantsCount, storageKey, winnersCount]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const globalObj = window as unknown as { __persistEditionState?: () => void };
    globalObj.__persistEditionState = persistState;
    return () => {
      if (globalObj.__persistEditionState === persistState) {
        delete globalObj.__persistEditionState;
      }
    };
  }, [persistState]);

  const fetchAuthors = (
    type: "winners" | "participants" | "guests",
    setState: React.Dispatch<React.SetStateAction<AuthorsState>>,
    state: AuthorsState
  ) => {
    if (state.scrollEnded) return;
    const count = type === "winners" ? itemsCount : itemsCount * 2;
    const start = count * (state.step + 1);
    const nextStep = start + count;
    const end = nextStep < state.allAuthors.length ? nextStep : state.allAuthors.length;

    setState((prev) => ({
      ...prev,
      authors: prev.authors.concat(prev.allAuthors.slice(start, end)),
      step: prev.step + 1,
      scrollEnded: end === prev.allAuthors.length,
    }));
  };

  const clampCount = (count: number, max: number) => Math.min(count, max);
  const computeStep = (count: number, chunk: number) => (count <= 0 ? 0 : Math.max(Math.ceil(count / chunk) - 1, 0));

  const getDataForEdition = (persisted?: PersistedState) => {
    const allEditions = Galleries.map((e) => e.year);
    const currentYear = allEditions.includes(+edition) ? +edition : Galleries[Galleries.length - 1].year;
    resolvedEditionRef.current = currentYear;
    const currentEdition = Galleries.find((ed) => +currentYear === ed.year);
    if (!currentEdition) {
      setWinners({ allAuthors: [], authors: [], step: 0, scrollEnded: true });
      setParticipants({ allAuthors: [], authors: [], step: 0, scrollEnded: true });
      setGuests({ allAuthors: [], authors: [], step: 0, scrollEnded: true });
      return { currentYear, appliedPersisted: false };
    }

    const persistedMatch = Boolean(persisted && persisted.edition === currentYear && persisted.lang === lang);

    const winnersArr: Author[] = [];
    const participantsArr: Author[] = [];
    const guestsArr: Author[] = [];
    currentEdition.authors
      .slice()
      .sort((a, b) => a.level - b.level)
      .forEach((author) => {
        const isWinner = !!author.award;
        const isGuest = author.guest;
        const isParticipant = !author.award && !isGuest;

        if (isWinner) winnersArr.push(author);
        else if (isParticipant) participantsArr.push(author);
        else if (isGuest) guestsArr.push(author);
      });

    const defaultWinnersChunk = Math.min(itemsCount, winnersArr.length);
    const defaultParticipantsChunk = Math.min(itemsCount * 2, participantsArr.length);
    const defaultGuestsChunk = Math.min(itemsCount * 2, guestsArr.length);

    const winnersInitial = persistedMatch
      ? clampCount(persisted!.winnersCount, winnersArr.length)
      : defaultWinnersChunk;
    const participantsInitial = persistedMatch
      ? clampCount(persisted!.participantsCount, participantsArr.length)
      : defaultParticipantsChunk;
    const guestsInitial = persistedMatch ? clampCount(persisted!.guestsCount, guestsArr.length) : defaultGuestsChunk;

    const winnersCountToShow = winnersInitial || defaultWinnersChunk;
    setWinners({
      allAuthors: winnersArr,
      authors: winnersArr.slice(0, winnersCountToShow),
      step: computeStep(winnersCountToShow, itemsCount),
      scrollEnded: winnersArr.length === 0 || winnersCountToShow >= winnersArr.length,
    });
    const participantsCountToShow = participantsInitial || defaultParticipantsChunk;
    setParticipants({
      allAuthors: participantsArr,
      authors: participantsArr.slice(0, participantsCountToShow),
      step: computeStep(participantsCountToShow, itemsCount * 2),
      scrollEnded: participantsArr.length === 0 || participantsCountToShow >= participantsArr.length,
    });
    const guestsCountToShow = guestsInitial || defaultGuestsChunk;
    setGuests({
      allAuthors: guestsArr,
      authors: guestsArr.slice(0, guestsCountToShow),
      step: computeStep(guestsCountToShow, itemsCount * 2),
      scrollEnded: guestsArr.length === 0 || guestsCountToShow >= guestsArr.length,
    });

    return { currentYear, appliedPersisted: persistedMatch && (persisted?.scrollY ?? 0) >= 0 };
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      getDataForEdition();
      return;
    }

    let persisted: PersistedState | undefined;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        persisted = JSON.parse(raw) as PersistedState;
      }
    } catch (error) {
      persisted = undefined;
    }
    const result = getDataForEdition(persisted);
    if (persisted && (!result || !result.appliedPersisted)) {
      window.localStorage.removeItem(storageKey);
    }
    if (persisted && result?.appliedPersisted) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: persisted!.scrollY ?? 0 });
      });
      window.localStorage.removeItem(storageKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edition, lang]);

  const handleAuthorNavigate = useCallback((slug: string) => {
    persistState();
    onAuthorNavigate?.(slug);
  }, [onAuthorNavigate, persistState]);

  return (
    <Fragment>
      <div className="allSeries">
        <div className="winners">
          <h2>
            <span>Series winners</span> {edition}
          </h2>
          <InfiniteScroll
            next={() => fetchAuthors("winners", setWinners, winners)}
            hasMore={!winners.scrollEnded}
            loader={<div className="loader">Loading...</div>}
            dataLength={winners.authors.length}
          >
            <WinnersList
              winners={winners.authors}
              allWinnersLength={winners.allAuthors.length}
              edition={String(edition)}
              lang={lang}
              onAuthorNavigate={handleAuthorNavigate}
            />
          </InfiniteScroll>
        </div>
      </div>

      {participants.authors.length > 0 && winners.scrollEnded === true && (
        <div className="jury">
          <h2>Selected</h2>
          <InfiniteScroll
            next={() => fetchAuthors("participants", setParticipants, participants)}
            hasMore={!participants.scrollEnded}
            loader={<div className="loader">Loading...</div>}
            dataLength={participants.authors.length}
          >
            <ParticipantsList
              participants={participants.authors}
              allParticipantsLength={participants.allAuthors.length}
              edition={String(edition)}
              lang={lang}
              onAuthorNavigate={handleAuthorNavigate}
            />
          </InfiniteScroll>
        </div>
      )}

      {guests.authors.length > 0 && (
        <div className="jury">
          <h2>Concomitant exhibitions</h2>
          <InfiniteScroll
            next={() => fetchAuthors("guests", setGuests, guests)}
            hasMore={!guests.scrollEnded}
            loader={<div className="loader">Loading...</div>}
            dataLength={guests.authors.length}
          >
            <ParticipantsList
              participants={guests.authors}
              allParticipantsLength={guests.allAuthors.length}
              edition={String(edition)}
              lang={lang}
              onAuthorNavigate={handleAuthorNavigate}
            />
          </InfiniteScroll>
        </div>
      )}
    </Fragment>
  );
};

export default GalleriesList;




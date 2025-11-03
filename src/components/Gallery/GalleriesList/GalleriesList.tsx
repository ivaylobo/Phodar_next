"use client";
import React, { useState, useEffect, Fragment } from "react";
import Galleries, { Author } from "../Galleries";
import InfiniteScroll from "react-infinite-scroll-component";
import WinnersList from "../WinnersList/WinnersList";
import ParticipantsList from "../ParticipantsList/ParticipantsList";

type AuthorsState = {
  allAuthors: Author[];
  authors: Author[];
  step: number;
  scrollEnded: boolean;
};

type Props = {
  edition: number | string;
  lang?: string;
};

const GalleriesList: React.FC<Props> = ({ edition, lang = "en" }) => {
  const itemsCount = 2;
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

  const getDataForEdition = () => {
    const allEditions = Galleries.map((e) => e.year);
    const currentYear = allEditions.includes(+edition) ? +edition : Galleries[Galleries.length - 1].year;
    const currentEdition = Galleries.find((ed) => +currentYear === ed.year);
    if (!currentEdition) return;

    const winnersArr: Author[] = [];
    const participantsArr: Author[] = [];
    const guestsArr: Author[] = [];
    currentEdition.authors
      .slice()
      .sort((a, b) => a.level - b.level)
      .forEach((author) => {
        const hasUrls = author.urls && author.urls.length > 0;
        const isWinner = !!author.award && hasUrls;
        const isParticipant = !author.award && author.level <= 10 && hasUrls;
        const isGuest = !author.award && author.level > 10 && hasUrls;

        if (isWinner) winnersArr.push(author);
        else if (isParticipant) participantsArr.push(author);
        else if (isGuest) guestsArr.push(author);
      });

    setWinners({ allAuthors: winnersArr, authors: winnersArr.slice(0, itemsCount), step: 0, scrollEnded: false });
    setParticipants({
      allAuthors: participantsArr,
      authors: participantsArr.slice(0, itemsCount * 2),
      step: 0,
      scrollEnded: false,
    });
    setGuests({ allAuthors: guestsArr, authors: guestsArr.slice(0, itemsCount * 2), step: 0, scrollEnded: false });
  };

  useEffect(() => {
    getDataForEdition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edition]);

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
            <WinnersList winners={winners.authors} allWinnersLength={winners.allAuthors.length} edition={String(edition)} lang={lang} />
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
            />
          </InfiniteScroll>
        </div>
      )}
    </Fragment>
  );
};

export default GalleriesList;

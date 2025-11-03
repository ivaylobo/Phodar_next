import { useEffect, Dispatch, SetStateAction } from "react";

type AuthorsState<T> = {
  allAuthors: T[];
  authors: T[];
  step: number;
  scrollEnded: boolean;
};

type UseGalleryAutoExpandParams<T> = {
  itemsCount: number;
  winnersFinished: boolean;
  participantsFinished: boolean;
  participantsIndex: number;
  winnersState: [AuthorsState<T>, Dispatch<SetStateAction<AuthorsState<T>>>];
  participantsState: [AuthorsState<T>, Dispatch<SetStateAction<AuthorsState<T>>>];
};

export function useGalleryAutoExpand<T>({
  itemsCount,
  winnersFinished,
  participantsFinished,
  participantsIndex,
  winnersState,
  participantsState,
}: UseGalleryAutoExpandParams<T>) {
  const [winners, setWinners] = winnersState;
  const [participants, setParticipants] = participantsState;

  useEffect(() => {
    setWinners((prev) => {
      if (prev.allAuthors.length === 0) return prev;

      if (winnersFinished) {
        if (prev.authors.length === prev.allAuthors.length && prev.scrollEnded) {
          return prev;
        }
        const totalSteps = Math.max(Math.ceil(prev.allAuthors.length / itemsCount) - 1, 0);
        return {
          ...prev,
          authors: prev.allAuthors,
          scrollEnded: true,
          step: totalSteps,
        };
      }

      const desiredCount = Math.min(itemsCount, prev.allAuthors.length);
      const scrollEnded = desiredCount >= prev.allAuthors.length;
      if (prev.authors.length === desiredCount && prev.scrollEnded === scrollEnded) {
        return prev;
      }

      return {
        ...prev,
        authors: prev.allAuthors.slice(0, desiredCount),
        scrollEnded,
        step: 0,
      };
    });
  }, [winnersFinished, itemsCount, winners.allAuthors.length, setWinners]);

  useEffect(() => {
    setParticipants((prev) => {
      if (prev.allAuthors.length === 0) return prev;

      const chunkSize = itemsCount * 2;

      if (participantsFinished) {
        if (prev.authors.length === prev.allAuthors.length && prev.scrollEnded) {
          return prev;
        }
        const totalSteps = Math.max(Math.ceil(prev.allAuthors.length / chunkSize) - 1, 0);
        return {
          ...prev,
          authors: prev.allAuthors,
          scrollEnded: true,
          step: totalSteps,
        };
      }

      const desiredCountFromIndex = participantsIndex > 0
        ? Math.min(participantsIndex, prev.allAuthors.length)
        : Math.min(chunkSize, prev.allAuthors.length);

      const scrollEnded = desiredCountFromIndex >= prev.allAuthors.length;
      if (prev.authors.length === desiredCountFromIndex && prev.scrollEnded === scrollEnded) {
        return prev;
      }

      const newStep = Math.max(Math.ceil(desiredCountFromIndex / chunkSize) - 1, 0);

      return {
        ...prev,
        authors: prev.allAuthors.slice(0, desiredCountFromIndex),
        scrollEnded,
        step: newStep,
      };
    });
  }, [participantsFinished, participantsIndex, itemsCount, participants.allAuthors.length, setParticipants]);
}

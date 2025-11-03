"use client";
import React from "react";
import Link from "next/link";
import classes from "./ParticipantsList.module.css";
import type { Author } from "../Galleries";

type Props = {
  participants: Author[];
  allParticipantsLength: number;
  edition: string;
  lang?: string;
};

const ParticipantsList: React.FC<Props> = ({ participants, edition, lang = "en" }) => {
  const participantsHTML = participants.map((author) => {
    const addHistory = () => {
      if (typeof window !== "undefined") localStorage.setItem("hasHistory", "1");
    };
    return author.urls.length ? (
      <div className={`col-md-6 ${classes.singleImg}`} key={`${author.name}_${edition}`}>
        <div className={classes.imgContainer} id={author.name.replace(/ /g, "_")}> 
          <Link onClick={addHistory} href={`/${lang}/editions/${edition}?author=${author.name.replace(/ /g, "_")}`}>
            <img src={`/${author.urlsMedium[0]}`} alt="" />
          </Link>
        </div>
        <Link onClick={addHistory} href={`/${lang}/editions/${edition}?author=${author.name.replace(/ /g, "_")}`}>
          <p className={classes.authorName}>{author.name}</p>
        </Link>
        <p className={classes.authorCountry}>{author.country}</p>
      </div>
    ) : null;
  });
  return (
    <div className="container">
      <div className="row">{participantsHTML}</div>
    </div>
  );
};

export default ParticipantsList;

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
  onAuthorNavigate?: (authorSlug: string) => void;
};

const ParticipantsList: React.FC<Props> = ({ participants, edition, lang = "en", onAuthorNavigate }) => {
  const participantsHTML = participants.map((author) => {
    const slug = author.name.replace(/ /g, "_");
    const handleNavigate = () => {
      if (typeof window !== "undefined") {
        localStorage.setItem("hasHistory", "1");
      }
      onAuthorNavigate?.(slug);
    };
    return author.urls.length ? (
      <div className={`col-md-6 ${classes.singleImg}`} key={`${author.name}_${edition}`}>
        <div className={classes.imgContainer} id={author.name.replace(/ /g, "_")}> 
          <Link onClick={handleNavigate} href={`/${lang}/editions/${edition}/${slug}`}>
            <img src={`/${author.urlsMedium[0]}`} alt="" />
          </Link>
        </div>
        <Link onClick={handleNavigate} href={`/${lang}/editions/${edition}/${slug}`}>
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

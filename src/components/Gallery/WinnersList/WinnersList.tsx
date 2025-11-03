"use client";
import React from "react";
import Link from "next/link";
import classes from "./WinnersList.module.css";
import type { Author } from "../Galleries";

type Props = {
  winners: Author[];
  allWinnersLength: number;
  edition: string;
  lang?: string;
};

const WinnersList: React.FC<Props> = ({ winners, allWinnersLength, edition, lang = "en" }) => {
  const addHistory = () => {
    if (typeof window !== "undefined") localStorage.setItem("hasHistory", "1");
  };

  const winnersHTML = winners.map((author, index) => {
    const single = author.urls.length === 1;
    const containerClass = classes["container" + ((allWinnersLength - index) % 3) as keyof typeof classes] || "";

    return (
      <div className={`${classes.authorShort} ${single ? classes.single : ""}`} key={`${author.name.replace(/ /g, "_")}_${edition}`}>
        <div className="container">
          <div className="row">
            <div className={`col-md-12 ${classes.authorContent}`} id={author.name.replace(/ /g, "_")}> 
              <p className={classes.authorAward}>{author.award || ""}</p>
              <ul className={`${classes.authorImages} ${containerClass}`}>
                {author.urlsThumb.slice(0, 3).map((_, i) => {
                  const liClass = (classes as any)[`image-li-${i}`] as string | undefined;
                  return (
                    <li key={i} className={`${classes.infoContainer} ${liClass || ""}`}>
                      <div className={classes.authorInfo}>
                        <Link onClick={addHistory} href={`/${lang}/editions/${edition}?author=${author.name.replace(/ /g, "_")}`}>
                          <p className={classes.authorName}>{author.name}</p>
                        </Link>
                        <p className={classes.authorCountry}>{author.country}</p>
                      </div>
                      <Link onClick={addHistory} href={`/${lang}/editions/${edition}?author=${author.name.replace(/ /g, "_")}`}>
                        {i === 1 || single ? (
                          <img className="big-img" src={`/${author.urlsMedium[i]}`} alt={author.name} />
                        ) : (
                          <img className="small-img" src={`/${author.urlsThumb[i]}`} alt={author.name} />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  });

  return <>{winnersHTML}</>;
};

export default WinnersList;

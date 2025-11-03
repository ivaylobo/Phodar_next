"use client";
import React from "react";
import Galleries from "../Galleries";
import Link from "next/link";
import Slider from "../Slider/Slider";
import classes from "./EditionGallery.module.css";

type Props = { editionYear: number | string; lang?: string };

const EditionGallery: React.FC<Props> = ({ editionYear, lang = "en" }) => {
  const currentEdition = Galleries.find((edition) => +editionYear === edition.year);
  if (!currentEdition) return null;
  const winners = currentEdition.authors.filter((author) => author.award && author.award !== "");

  const winnersHTML = winners.map((winner) => {
    return (
      <li key={winner.name}>
        <Link
          href={`/${lang}/editions/${editionYear}?author=${winner.name.replace(/ /g, "_")}`}
          className="my-active"
        >
          <span>{winner.award}</span> <strong>{winner.name} </strong>
          <span>{winner.country}</span>
        </Link>
      </li>
    );
  });

  const sliderImages = currentEdition.galleryUrls.map((url) => {
    return (
      <Link href={`/${lang}/editions/${editionYear}?author=${url[1].replace(/ /g, "_")}`} key={url[0]}>
        <img src={`/${url[0]}`} alt="product" />
      </Link>
    );
  });

  return (
    <div className={`col-md-12 ${classes.menuBar}`}>
      <p>winners</p>
      <div className={classes.sectionContainer}>
        <div className={classes.leftPart}>
          <h2>{currentEdition.year}</h2>
          <h3>{currentEdition.edition}</h3>
          <h3>
            <span className="active">motto:</span>
            <span>{currentEdition.motto}</span>
          </h3>
        </div>

        <ul className={classes.awards}>{winnersHTML}</ul>
      </div>

      <div className="carouselHolder">
        <Slider sliderImages={sliderImages} thumbs={false} selectedItem={0} />
      </div>
    </div>
  );
};

export default EditionGallery;

"use client";

import React, { useState, useEffect } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Slider from "../Slider/Slider";
import { useRouter } from "next/navigation";
import classes from "./AuthorGallery.module.css";
import type { Author } from "../Galleries";
import BodyClassEffect from "./BodyClassEffect";

type Props = {
  author: Author;
  editionYear: number;
  lang: string;
};

const hasHighResolution = ():
  boolean => typeof window !== "undefined" && window.devicePixelRatio >= 2 && window.innerWidth < 510;

const nameToId = (name: string) => name.replace(/ /g, "_");

const extractText = (author: Author) => {
  const translated = typeof author.translatedText === "string" ? author.translatedText.trim() : "";
  if (translated.length > 0) return translated;
  return (author.text || "").trim();
};

const AuthorGalleryClient: React.FC<Props> = ({ author, editionYear, lang }) => {
  const [showSlider, setShowSlider] = useState(false);
  const [selectedItem, setSelectedItem] = useState(0);
  const [blackBg, setBlackBg] = useState(false);
  const [preferMedium, setPreferMedium] = useState<boolean>(hasHighResolution());
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const syncResolution = () => setPreferMedium(hasHighResolution());
    window.addEventListener("resize", syncResolution);
    return () => window.removeEventListener("resize", syncResolution);
  }, []);

  const goBack = () => {
    setShowSlider(false);
    setSelectedItem(0);
    router.push(`/${lang}/editions/${editionYear}`);
    if (typeof window !== "undefined") {
      localStorage.removeItem("hasHistory");
    }
  };

  const toggleView = () => setShowSlider((prev) => !prev);
  const toggleBg = () => setBlackBg((prev) => !prev);
  const slideToImage = (index: number) => {
    setShowSlider(true);
    setSelectedItem(index);
  };

  const sliderSources =
    author.urls.length > 0
      ? author.urls
      : author.urlsMedium.length > 0
      ? author.urlsMedium
      : author.urlsThumb;

  const sliderImages = sliderSources.map((image, index) => <img key={index} src={`/${image}`} alt="" />);

  const thumbImages = author.urlsThumb.map((image, index) => (
    <img key={`thumb-${index}`} src={`/${image}`} alt="" onClick={() => slideToImage(index)} />
  ));

  const mediumImages = author.urlsMedium.map((image, index) => (
    <img key={`medium-${index}`} src={`/${image}`} alt="" width="230px" onClick={() => slideToImage(index)} />
  ));

  const gridImages = preferMedium && author.urlsMedium.length > 0 ? mediumImages : thumbImages;

  const id = nameToId(author.name);
  const collectionText = extractText(author);

  return (
    <>
      <BodyClassEffect />
      <div className={`popup author ${blackBg ? "black" : ""}`}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className={classes.information}>
                <h2>{author.name}</h2>
                <h4>{author.title}</h4>
              </div>
              <div className={classes.rightMenu}>
                <a
                  href={`#${id}`}
                  className={classes.close}
                  onClick={(event) => {
                    event.preventDefault();
                    goBack();
                  }}
                ></a>
                <div className={`${classes.countSwitch} ${showSlider ? "active" : ""}`} onClick={toggleView}></div>
                <div className={`${classes.colored} ${classes.desktop}`} onClick={toggleBg}></div>
              </div>
              <div className={`${classes.colored} ${classes.mobile}`} onClick={toggleBg}></div>
              {showSlider ? (
                <div className="carouselHolder">
                  <Slider sliderImages={sliderImages} thumbs={false} selectedItem={selectedItem} />
                </div>
              ) : (
                <ResponsiveMasonry columnsCountBreakPoints={{ 480: 1, 600: 2, 800: 3 }}>
                  <Masonry className={"my-gallery-class"} gutter="10px">
                    {gridImages}
                  </Masonry>
                </ResponsiveMasonry>
              )}

              {collectionText && <p className={classes.collectionText}>{collectionText}</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthorGalleryClient;

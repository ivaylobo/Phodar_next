"use client";
import React, { useState, useMemo, Fragment } from "react";
import galleryObj from "../../Gallery/Galleries";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Slider from "../Slider/Slider";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import classes from "./AuthorGallery.module.css";

type Props = { editionYear: number | string; lang?: string };

const AuthorGallery: React.FC<Props> = ({ editionYear, lang = "en" }) => {
  const [showSlider, setShowSlider] = useState(false);
  const [selectedItem, setSelectedItem] = useState(0);
  const [blackBg, setBlackBg] = useState(false);
  const router = useRouter();
  const search = useSearchParams();
  const pathname = usePathname();

  const goBack = (year: number | string) => {
    setShowSlider(false);
    setSelectedItem(0);
    router.push(`/${lang}/editions/${year}`);
    if (typeof window !== "undefined") localStorage.removeItem("hasHistory");
  };

  const toggleView = () => setShowSlider((prev) => !prev);
  const toggleBg = () => setBlackBg((prev) => !prev);
  const slideToImage = (num: number) => {
    setShowSlider(true);
    setSelectedItem(num);
  };

  const highResolution = typeof window !== "undefined" && window.devicePixelRatio >= 2 && window.innerWidth < 510;

  const { currentAuthor } = useMemo(() => {
    const authorParam = search?.get("author") || "";
    if (!authorParam) return { currentAuthor: undefined } as any;
    const edition = galleryObj.find((e) => e.year === +editionYear);
    if (!edition) return { currentAuthor: undefined } as any;
    const clean = authorParam.split("&fbclid")[0];
    const author = edition.authors.find((a) => a.name === clean.replace(/_/g, " "));
    return { currentAuthor: author } as any;
  }, [editionYear, search, pathname]);

  const imagesThumb = currentAuthor?.urlsThumb.map((image, id) => (
    <img key={id} src={`/${image}`} alt="" onClick={() => slideToImage(id)} />
  ));

  const imagesMedium = currentAuthor?.urlsMedium.map((image, id) => (
    <img key={id} src={`/${image}`} alt="" width="230px" onClick={() => slideToImage(id)} />
  ));

  const images = currentAuthor?.urls.map((image, id) => <img key={id} src={`/${image}`} alt="" />);

  return (
    <Fragment>
      {currentAuthor ? (
        <div className={`popup author ${blackBg ? "black" : ""}`}>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className={classes.information}>
                  <h2>{currentAuthor.name}</h2>
                  <h4>{currentAuthor.title}</h4>
                </div>
                <div className={classes.rightMenu}>
                  <a
                    href={`#${currentAuthor.name.replace(/ /g, "_")}`}
                    className={classes.close}
                    onClick={(e) => {
                      e.preventDefault();
                      goBack(editionYear);
                    }}
                  ></a>
                  <div className={`${classes.countSwitch} ${showSlider ? classes.active : ""}`} onClick={toggleView}></div>
                  <div className={`${classes.colored} ${classes.desktop}`} onClick={toggleBg}></div>
                </div>
                <div className={`${classes.colored} ${classes.mobile}`} onClick={toggleBg}></div>
                {showSlider ? (
                  <div className="carouselHolder">
                    <Slider sliderImages={images as any} thumbs={false} selectedItem={selectedItem} />
                  </div>
                ) : (
                  <ResponsiveMasonry columnsCountBreakPoints={{ 480: 1, 600: 2, 800: 3 }}>
                    <Masonry className={"my-gallery-class"} gutter="10px">
                      {highResolution ? imagesMedium : imagesThumb}
                    </Masonry>
                  </ResponsiveMasonry>
                )}

                <p className={classes.collectionText}>{currentAuthor.text}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </Fragment>
  );
};

export default AuthorGallery;

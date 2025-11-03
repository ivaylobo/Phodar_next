"use client";
import Link from "next/link";
import { FC } from "react";

type YearsMenuProps = {
  years: number[];
  currentYear: number | string;
  lang?: string;
};

const YearsMenu: FC<YearsMenuProps> = ({ years, currentYear, lang = "en" }) => {
  const list = [...years].reverse();
  return (
    <>
      {list.map((year) => (
        <li key={year}>
          <Link className={+year === +currentYear ? "active" : ""} href={`/${lang}/editions/${year}`}>
            <h4>{year}</h4>
          </Link>
        </li>
      ))}
    </>
  );
};

export default YearsMenu;

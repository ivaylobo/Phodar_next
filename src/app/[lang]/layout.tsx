import type {ReactNode} from 'react';
import {notFound} from 'next/navigation';
import Header from '@/components/Header/Header';
import type {SupportedLanguage} from '@/store/slices/languageSlice';
import Footer from "@/components/Footer/Footer";
import CookiesPopup from "@/components/CookiesPopup/CookiesPopup";
import Galleries from '@/components/Gallery/Galleries';
import englishMenu from '@/content/menu.en.json';
import bulgarianMenu from '@/content/menu.bg.json';

export const dynamic = 'error';
export const dynamicParams = false;

type LangLayoutProps = {
    children: ReactNode;
    params: Promise<{ lang: string }>; // 👈 params вече е Promise
};

const isSupportedLanguage = (value: string): value is SupportedLanguage =>
    value === 'en' || value === 'bg';

export default async function LangLayout({children, params}: LangLayoutProps) {
    const {lang: rawLang} = await params;
    if (!isSupportedLanguage(rawLang)) notFound();

    const lang = rawLang;
    const menu = lang === 'en' ? englishMenu : bulgarianMenu;
    const latestYear = Math.max(...Galleries.map((edition) => edition.year));
    const navigationMenu = menu.map((item) => ({
        ...item,
        path: /^\/(en|bg)\/editions\/?$/.test(item.path)
            ? `/${lang}/editions/${latestYear}`
            : item.path,
    }));


    return (
        <div className="wrap">
            <Header currentLang={lang} menu={navigationMenu}/>
            <main>{children}</main>
            <Footer />
            <CookiesPopup lang={lang} />
        </div>
    );
}

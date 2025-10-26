import type {ReactNode} from 'react';
import Header from '@/components/Header/Header';
import type {SupportedLanguage} from '@/store/slices/languageSlice';
import {getMenu} from "@/graphql/queries/getMenu";

type LangLayoutProps = {
    children: ReactNode;
    params: Promise<{ lang: string }>; // 👈 params вече е Promise
};

const isSupportedLanguage = (value: string): value is SupportedLanguage =>
    value === 'en' || value === 'bg';

export default async function LangLayout({children, params}: LangLayoutProps) {
    const {lang: rawLang} = await params;
    const lang = isSupportedLanguage(rawLang) ? rawLang : 'en';
    const menu = await getMenu(lang.toUpperCase() as 'EN' | 'BG');


    return (
        <div className="wrap">
            <Header currentLang={lang} menu={menu}/>
            <main>{children}</main>
        </div>
    );
}

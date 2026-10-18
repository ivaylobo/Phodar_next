import HomeTemplate from '@/templates/Home/Home';
import { notFound } from 'next/navigation';
import englishHome from '@/content/home/en.json';
import bulgarianHome from '@/content/home/bg.json';

type LangPageParams = {
  params: Promise<{ lang: string }>;
};

export default async function LangHome({ params }: LangPageParams) {
  const { lang } = await params;
  if (lang !== 'en' && lang !== 'bg') notFound();

  return <HomeTemplate homeTemplate={lang === 'en' ? englishHome : bulgarianHome} />;
}

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'bg' }];
}

import type { SupportedLanguage } from '@/store/slices/languageSlice';
import styles from '@/styles/internal-page.module.css';

const isSupportedLanguage = (value: string): value is SupportedLanguage => value === 'en' || value === 'bg';

const COOKIES_CONTENT: Record<SupportedLanguage, { title: string; paragraphs: string[] }> = {
  en: {
    title: 'cookies policy',
    paragraphs: [
      'We use cookies on phodar.net. By using the Service, you consent to the use of cookies.',
      'We use both session and persistent cookies and the purposes for which they are used are as follows: to recognize a computer when a user visits this website, to track users as they navigate the website, to personalize the website for each user and to target advertisements which may be of particular interest to specific users. Persistent cookies - these files stay in one of your browser\'s subfolders until you delete them manually or your browser deletes them based on the duration period contained within the persistent cookie\'s file. Session cookies, on the other hand are temporary cookie files and will expire at the end of the user session, when the web browser is closed.',
      'If you\'d like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser.',
      'We use Google Analytics to analyse the use of this website. Our analytics service provider generates statistical and other information about website use by means of cookies.',
    ],
  },
  bg: {
    title: 'Politika za biskvitkite',
    paragraphs: [
      'Nie izpolzvame biskvitki na nashiyat sait, za da podobrim negovoto predstaviane. Biskvitkite sa malki tekstovi failove, koito se zapazvat na vashiya kompyutar ili mobilno ustroistvo, kogato poseshtavate daden uebsait. Biskvitkite izpulnyavat mnogo razlichni funktsii. Naprimer, te ni pomaghat da analizirame kolko dobre se predstavya nashiyat sait.',
      'Nashiyat sait izpolzva postoyanni i biskvitki na sesii. Biskvitki na sesii – tozi tip "biskvitki" trayat do zatvaryane na brauzura i ne se zapazvat na hard-diska na vashiya kompyutar. Postoyanni biskvitki – tozi tip "biskvitki" se suhranyavat na vashiya hard-disk, dokato budat premahanti (iztriti) ot vas ili dokato izteche srokut im.',
      'Biskvitkite na nashiyat sait imat za tsel suhranyavane na predpochitaniyata na posetitelyte, osiguryavane na funktsioniraneto na nashiyat uebsait, sabirane na analitichni danni (otnosno povedenieto na potrebitelite).',
      'Mozhete da kontrolirate i/ili iztrivate biskvitkite kakto zhelaete. Mozhete da iztriete vsichki biskvitki, koito veche sa zapazeni na vasheto ustroistvo, a sushto taka mozhete da nastroite povecheto brauzuri da gi blokirat. Ako napravite tova obache, mozhe da se nalozhi rachno da nastroivate nyakoi parametri vseki put, kogato poseshtavate saita, a osven tova e vazmozhno nyakoi uslugi i funktsii da ne rabotyat.',
    ],
  },
};

export default async function CookiesPage({ params }: { params: { lang: string } }) {
  const { lang: rawLang } = await params;
  const lang = isSupportedLanguage(rawLang) ? rawLang : 'en';
  const content = COOKIES_CONTENT[lang];

  return (
    <div className={styles.internal}>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1>
              <strong>{content.title}</strong>
            </h1>
            {content.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

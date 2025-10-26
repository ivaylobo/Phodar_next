import type { WordPressPage } from '@/graphql/queries/getPageBySlug';
import styles from './Informational.module.css';

type InformationalTemplateProps = {
    page: WordPressPage;
};

export default function InformationalTemplate({ page }: InformationalTemplateProps) {
    return (

            <div className={styles.internal}>
                <div className={`${styles.container} container`}>
                    <div className="row">
                        <div className="col-md-12">
                            <h1 className={styles.title} dangerouslySetInnerHTML={{__html: page.title}}/>
                            <div className={styles.content} dangerouslySetInnerHTML={{__html: page.content}}/>
                        </div>
                    </div>
                </div>
            </div>
);
}

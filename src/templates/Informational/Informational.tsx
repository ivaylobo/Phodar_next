import type { WordPressPage } from '@/graphql/queries/getPageBySlug';
import styles from './Informational.module.css';
import homeStyles from '@/templates/Home/Home.module.css';
import parse, { Element } from 'html-react-parser';

type InformationalTemplateProps = {
    page: WordPressPage;
};

export default function InformationalTemplate({ page }: InformationalTemplateProps) {
    const content = parse(page.content, {
        replace(node) {
            if (
                node instanceof Element &&
                node.name === 'a' &&
                node.attribs.class?.split(/\s+/).includes('wp-block-button__link')
            ) {
                node.attribs.class = `${node.attribs.class} ${homeStyles.buttonLink}`;
            }
        },
    });

    return (

            <div className={styles.internal}>
                <div className={`${styles.container} container`}>
                    <div className="row">
                        <div className="col-md-12">
                            <h1 className={styles.title} dangerouslySetInnerHTML={{__html: page.title}}/>
                            <div className={styles.content}>{content}</div>
                        </div>
                    </div>
                </div>
            </div>
);
}

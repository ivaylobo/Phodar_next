import { htmlToDOM } from 'html-react-parser';

type TitleNode = { type: string; data?: string; children?: TitleNode[] };

/** Convert CMS headings to plain text, including HTML entities. */
export function plainTitle(value: string): string {
  const readText = (nodes: TitleNode[]): string => nodes.map((node) => {
    if (node.type === 'text') return node.data ?? '';
    if (node.type === 'script' || node.type === 'style') return '';
    return node.children ? readText(node.children) : '';
  }).join('');

  return readText(htmlToDOM(value)).replace(/\s+/g, ' ').trim();
}

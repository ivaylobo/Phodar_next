import { createElement, ReactElement, CSSProperties } from "react";
import parse, {
  domToReact,
  Element,
  DOMNode,
  HTMLReactParserOptions,
} from "html-react-parser";

type ElementHandler = (
    node: Element,
    options: HTMLReactParserOptions,
) => ReactElement | null;

const VOID_ELEMENTS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
  "meta", "param", "source", "track", "wbr",
]);

const STANDARD_ELEMENTS = new Set([
  "a","abbr","address","article","aside","audio","b","blockquote","body","button",
  "canvas","caption","cite","code","colgroup","data","datalist","dd","del","details",
  "dfn","dialog","dir","div","dl","dt","em","fieldset","figure","figcaption","footer",
  "form","h1","h2","h3","h4","h5","h6","header","hgroup","i","iframe","ins","kbd",
  "label","legend","li","main","mark","meter","nav","noscript","object","ol","optgroup",
  "option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp",
  "section","select","small","span","strong","sub","summary","sup","table","tbody",
  "td","template","textarea","tfoot","th","thead","time","tr","u","ul","var","video",
]);

const SVG_ELEMENTS = new Set([
  "svg","animate","animateMotion","animateTransform","circle","clipPath","defs","desc",
  "ellipse","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix",
  "feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA",
  "feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode",
  "feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile",
  "feTurbulence","filter","foreignObject","g","image","line","linearGradient","marker","mask",
  "metadata","mpath","path","pattern","polygon","polyline","radialGradient","rect","set",
  "stop","switch","symbol","text","textPath","tspan","use","view",
]);

/** Convert inline style string (from WP) â†’ React style object */
function parseStyleAttribute(styleString?: string): CSSProperties | undefined {
  if (!styleString) return undefined;
  const styleObject: Record<string, string> = {};
  styleString.split(";").forEach((declaration) => {
    const [prop, value] = declaration.split(":").map((s) => s.trim());
    if (!prop || !value) return;
    const camelProp = prop.replace(/-([a-z])/g, (_, l) => l.toUpperCase());
    styleObject[camelProp] = value;
  });
  return styleObject as CSSProperties;
}

/** Normalize HTML attributes so React can understand them */
function normalizeAttributes(
    attribs?: Record<string, string>
): Record<string, string | number | boolean | CSSProperties> | undefined {
  if (!attribs) return undefined;

  const { style, ...rest } = attribs;
  const parsedStyle = parseStyleAttribute(style);

  const normalized: Record<string, string | number | boolean | CSSProperties> = {};

  for (const [key, value] of Object.entries(rest)) {
    switch (key) {
      case "class":
        normalized.className = value;
        break;
      case "for":
        normalized.htmlFor = value;
        break;
      default:
        normalized[key] = value;
    }
  }

  if (parsedStyle) normalized.style = parsedStyle;

  return normalized;
}


const createElementWithChildren: ElementHandler = (node, options) =>{

  return  createElement(
        node.name,
        normalizeAttributes(node.attribs),
        domToReact(node.children as DOMNode[], options),
    );
}
const createVoidElement: ElementHandler = (node) =>
    createElement(node.name, normalizeAttributes(node.attribs));

export function renderWPContent(html: string) {
  if (!html) return null;

  const options: HTMLReactParserOptions = {
    replace(domNode) {
      if (!(domNode instanceof Element)) return undefined;

      const handler = getHandler(domNode);
      if (handler) return handler(domNode, options);

      console.warn(`element <${domNode.name}> is missing in WYSIWYG functionality`);

      if (STANDARD_ELEMENTS.has(domNode.name) || SVG_ELEMENTS.has(domNode.name)) {
        return createElementWithChildren(domNode, options);
      }

      if (VOID_ELEMENTS.has(domNode.name)) {
        return createVoidElement(domNode, options);
      }

      return createElement(
          domNode.name,
          normalizeAttributes(domNode.attribs),
          domToReact(domNode.children as DOMNode[], options),
      );
    },
  };

  return parse(html, options);
}

function getHandler(node: Element): ElementHandler | undefined {
  if (VOID_ELEMENTS.has(node.name)) return createVoidElement;
  if (STANDARD_ELEMENTS.has(node.name) || SVG_ELEMENTS.has(node.name)) {
    return createElementWithChildren;
  }
  return undefined;
}


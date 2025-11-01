import { createElement } from "react";
import parse, {
  domToReact,
  Element,
  HTMLReactParserOptions,
} from "html-react-parser";
import type { ReactNode } from "react";

type ElementHandler = (
  node: Element,
  options: HTMLReactParserOptions,
) => ReactNode;

const VOID_ELEMENTS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

const STANDARD_ELEMENTS = new Set([
  "a",
  "abbr",
  "address",
  "article",
  "aside",
  "audio",
  "b",
  "blockquote",
  "body",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "em",
  "fieldset",
  "figure",
  "figcaption",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hgroup",
  "i",
  "iframe",
  "ins",
  "kbd",
  "label",
  "legend",
  "li",
  "main",
  "mark",
  "meter",
  "nav",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "picture",
  "pre",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "section",
  "select",
  "small",
  "span",
  "strong",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "tr",
  "u",
  "ul",
  "var",
  "video",
]);

const SVG_ELEMENTS = new Set([
  "svg",
  "animate",
  "animateMotion",
  "animateTransform",
  "circle",
  "clipPath",
  "defs",
  "desc",
  "ellipse",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feDropShadow",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence",
  "filter",
  "foreignObject",
  "g",
  "image",
  "line",
  "linearGradient",
  "marker",
  "mask",
  "metadata",
  "mpath",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialGradient",
  "rect",
  "set",
  "stop",
  "switch",
  "symbol",
  "text",
  "textPath",
  "tspan",
  "use",
  "view",
]);

const createElementWithChildren: ElementHandler = (node, options) =>
  createElement(
    node.name,
    node.attribs ?? undefined,
    domToReact(node.children, options),
  );

const createVoidElement: ElementHandler = (node) =>
  createElement(node.name, node.attribs ?? undefined);

export function renderWPContent(html: string) {
  if (!html) {
    return null;
  }

  const options: HTMLReactParserOptions = {
    replace: (node) => {
      if (!(node instanceof Element)) {
        return undefined;
      }

      const handler = getHandler(node);

      if (handler) {
        return handler(node, options);
      }

      console.log(`element ${node.name} is missing in WYSIWYG functionallity`);

      if (STANDARD_ELEMENTS.has(node.name) || SVG_ELEMENTS.has(node.name)) {
        return createElementWithChildren(node, options);
      }

      if (VOID_ELEMENTS.has(node.name)) {
        return createVoidElement(node);
      }

      return createElement(
        node.name,
        node.attribs ?? undefined,
        domToReact(node.children, options),
      );
    },
  };

  return parse(html, options);
}

function getHandler(node: Element): ElementHandler | undefined {
  if (VOID_ELEMENTS.has(node.name)) {
    return createVoidElement;
  }

  if (STANDARD_ELEMENTS.has(node.name) || SVG_ELEMENTS.has(node.name)) {
    return createElementWithChildren;
  }

  return undefined;
}

/**
 * Minimal renderer for Strapi "Blocks" rich text (used by shared.faq answers), so no extra
 * dependency is needed. Unknown node types are skipped.
 */
import type { ReactNode } from "react";
import type { BlockInline, BlockNode, Blocks } from "@/types/strapi";
import SmartLink from "@/components/ui/SmartLink";

function renderInline(nodes: BlockInline[] = [], keyPrefix = ""): ReactNode[] {
  return nodes.map((node, i) => {
    const key = `${keyPrefix}${i}`;
    if (node.type === "link") {
      return (
        <SmartLink key={key} href={node.url}>
          {renderInline(node.children, `${key}-`)}
        </SmartLink>
      );
    }
    let out: ReactNode = node.text;
    if (node.code) out = <code>{out}</code>;
    if (node.bold) out = <strong>{out}</strong>;
    if (node.italic) out = <em>{out}</em>;
    if (node.underline) out = <u>{out}</u>;
    if (node.strikethrough) out = <s>{out}</s>;
    return <span key={key}>{out}</span>;
  });
}

function renderNode(node: BlockNode, i: number): ReactNode {
  switch (node.type) {
    case "paragraph":
      return <p key={i}>{renderInline(node.children)}</p>;
    case "heading": {
      // Inside sections the page already has h1/h2; keep block headings at h3/h4.
      const Tag = node.level <= 3 ? "h3" : "h4";
      return <Tag key={i}>{renderInline(node.children)}</Tag>;
    }
    case "list": {
      const Tag = node.format === "ordered" ? "ol" : "ul";
      return (
        <Tag key={i}>
          {node.children.map((item, j) => (
            <li key={j}>{renderInline(item.children)}</li>
          ))}
        </Tag>
      );
    }
    case "quote":
      return <blockquote key={i}>{renderInline(node.children)}</blockquote>;
    case "code":
      return (
        <pre key={i}>
          <code>{renderInline(node.children)}</code>
        </pre>
      );
    default:
      return null;
  }
}

export function BlocksContent({ content }: { content: Blocks | null | undefined }) {
  if (!Array.isArray(content)) return null;
  return <>{content.map(renderNode)}</>;
}

function inlineText(nodes: BlockInline[] = []): string {
  return nodes.map((n) => (n.type === "link" ? inlineText(n.children) : n.text)).join("");
}

/** Plain text of a Blocks value (for JSON-LD and meta descriptions). */
export function blocksToText(content: Blocks | null | undefined): string {
  if (!Array.isArray(content)) return "";
  return content
    .map((node) => {
      if (node.type === "list") return node.children.map((item) => inlineText(item.children)).join(" ");
      if (node.type === "image") return "";
      return inlineText(node.children);
    })
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

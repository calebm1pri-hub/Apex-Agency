import React from "react";

/**
 * Minimal, dependency-free markdown renderer for blog bodies.
 * Supports ## headings, - lists, and **bold**. Swap for MDX/react-markdown
 * when the content model grows.
 */
function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${keyPrefix}-${i}`} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={`${keyPrefix}-${i}`}>{part}</React.Fragment>;
  });
}

export function Markdown({ content }: { content: string }) {
  const blocks = content.trim().split(/\n\n+/);
  return (
    <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) {
          return (
            <h2 key={i} className="font-display text-2xl font-semibold text-foreground">
              {block.replace(/^##\s+/, "")}
            </h2>
          );
        }
        if (/^[-*]\s+/m.test(block)) {
          const items = block.split("\n").filter((l) => /^[-*]\s+/.test(l));
          return (
            <ul key={i} className="list-disc space-y-1.5 pl-5">
              {items.map((item, j) => (
                <li key={j}>{renderInline(item.replace(/^[-*]\s+/, ""), `${i}-${j}`)}</li>
              ))}
            </ul>
          );
        }
        if (/^\d+\.\s+/m.test(block)) {
          const items = block.split("\n").filter((l) => /^\d+\.\s+/.test(l));
          return (
            <ol key={i} className="list-decimal space-y-1.5 pl-5">
              {items.map((item, j) => (
                <li key={j}>{renderInline(item.replace(/^\d+\.\s+/, ""), `${i}-${j}`)}</li>
              ))}
            </ol>
          );
        }
        return <p key={i}>{renderInline(block, `${i}`)}</p>;
      })}
    </div>
  );
}

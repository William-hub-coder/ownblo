"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check } from "lucide-react";

type ArticleMarkdownProps = {
  content: string;
  copyLabel: string;
  copiedLabel: string;
};

export function ArticleMarkdown({
  content,
  copyLabel,
  copiedLabel,
}: ArticleMarkdownProps) {
  return (
    <article className="prose-custom border-t border-[var(--cyber-border)] pt-8">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children, ...props }) => (
            <h2
              className="text-xl font-bold text-[var(--cyber-text)] mt-10 mb-4"
              id={children?.toString().toLowerCase().replace(/\s+/g, "-")}
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-lg font-semibold text-[var(--cyber-text)] mt-8 mb-3" {...props}>
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-[var(--cyber-text)]/90 leading-relaxed mb-4">{children}</p>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--cyber-primary)] hover:underline"
            >
              {children}
            </a>
          ),
          code: function CodeBlock({ className, children, ...props }) {
            const [copied, setCopied] = useState(false);
            const isInline = !className;

            if (isInline) {
              return (
                <code
                  className="bg-[var(--cyber-primary)]/10 text-[var(--cyber-primary)] px-1.5 py-0.5 rounded text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <div className="relative group my-4">
                <pre className="bg-[#0d1117] border border-[var(--cyber-border)] rounded-lg p-4 overflow-x-auto text-sm">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(children?.toString() || "");
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-md bg-[var(--cyber-surface)]/80 text-[var(--cyber-muted)] opacity-0 group-hover:opacity-100 hover:text-[var(--cyber-primary)] transition-all duration-200"
                  aria-label={copyLabel}
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            );
          },
          ul: ({ children }) => (
            <ul className="list-disc pl-6 mb-4 space-y-1 text-[var(--cyber-text)]/90">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 mb-4 space-y-1 text-[var(--cyber-text)]/90">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-[var(--cyber-text)]/90">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-3 border-[var(--cyber-primary)] pl-4 my-4 text-[var(--cyber-muted)] italic">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="w-full border-collapse border border-[var(--cyber-border)] rounded-lg overflow-hidden">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-[var(--cyber-border)] bg-[var(--cyber-surface)]/50 px-4 py-2 text-left text-sm font-semibold text-[var(--cyber-text)]">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-[var(--cyber-border)] px-4 py-2 text-sm text-[var(--cyber-text)]/90">
              {children}
            </td>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-[var(--cyber-text)]">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-[var(--cyber-accent)]">{children}</em>
          ),
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={alt || ""}
              loading="lazy"
              className="rounded-lg max-w-full h-auto my-4"
              onError={(e) => {
                // Replace broken images with a placeholder
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}

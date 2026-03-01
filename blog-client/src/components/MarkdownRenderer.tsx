'use client';

import React, { useState, useCallback, ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';

interface MarkdownRendererProps {
  content: string;
}

/* ── Extract plain text from a React node tree (for copy) ── */
function extractText(node: ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (!node) return '';
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (React.isValidElement(node)) {
    return extractText((node.props as { children?: ReactNode }).children);
  }
  return '';
}

/* ── Language metadata ── */
const LANG_CONFIG: Record<string, string> = {
  rust: 'Rust', javascript: 'JavaScript', js: 'JavaScript',
  typescript: 'TypeScript', ts: 'TypeScript', python: 'Python', py: 'Python',
  html: 'HTML', css: 'CSS', json: 'JSON', bash: 'Bash', shell: 'Shell',
  sh: 'Shell', zsh: 'Zsh', go: 'Go', java: 'Java', c: 'C', cpp: 'C++',
  csharp: 'C#', cs: 'C#', sql: 'SQL', yaml: 'YAML', yml: 'YAML',
  markdown: 'Markdown', md: 'Markdown', dockerfile: 'Dockerfile',
  docker: 'Docker', ruby: 'Ruby', rb: 'Ruby', swift: 'Swift',
  kotlin: 'Kotlin', php: 'PHP', toml: 'TOML', xml: 'XML',
  graphql: 'GraphQL', lua: 'Lua', zig: 'Zig', elixir: 'Elixir',
  haskell: 'Haskell', scala: 'Scala', r: 'R', dart: 'Dart', jsx: 'JSX',
  tsx: 'TSX', scss: 'SCSS', sass: 'Sass', less: 'Less', makefile: 'Makefile',
  cmake: 'CMake', nginx: 'Nginx', ini: 'INI', powershell: 'PowerShell',
  ps1: 'PowerShell', fish: 'Fish', vim: 'Vim', diff: 'Diff',
};

/* ── Language-specific SVG icons (16×16, stroke-based) ── */
function LanguageIcon({ lang }: { lang: string }) {
  const s = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none' as const };
  const k = { stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  switch (lang) {
    case 'rust':
      return (
        <svg {...s} {...k}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3" />
          <line x1="12" y1="1" x2="12" y2="4" />
          <line x1="12" y1="20" x2="12" y2="23" />
          <line x1="1" y1="12" x2="4" y2="12" />
          <line x1="20" y1="12" x2="23" y2="12" />
          <line x1="4.2" y1="4.2" x2="6.3" y2="6.3" />
          <line x1="17.7" y1="17.7" x2="19.8" y2="19.8" />
          <line x1="4.2" y1="19.8" x2="6.3" y2="17.7" />
          <line x1="17.7" y1="6.3" x2="19.8" y2="4.2" />
        </svg>
      );
    case 'javascript': case 'js': case 'jsx':
      return (
        <svg {...s}>
          <rect x="3" y="3" width="18" height="18" rx="2" fill="#F7DF1E" opacity=".82" />
          <text x="7.5" y="17" fontSize="10" fontWeight="700" fontFamily="monospace" fill="#1a1a1a">JS</text>
        </svg>
      );
    case 'typescript': case 'ts': case 'tsx':
      return (
        <svg {...s}>
          <rect x="3" y="3" width="18" height="18" rx="2" fill="#3178C6" opacity=".82" />
          <text x="6" y="17" fontSize="10" fontWeight="700" fontFamily="monospace" fill="#fff">TS</text>
        </svg>
      );
    case 'python': case 'py':
      return (
        <svg {...s} {...k}>
          <path d="M12 2c-4 0-5 2-5 4v3h5.5v1h-8C3 10 2 12 2 14.5S3 19 4.5 19H7v-3.5c0-2 1.5-3.5 3.5-3.5h5c1.5 0 2.5-1 2.5-2.5V6c0-2-1-4-6-4z" />
          <circle cx="9" cy="5.5" r="1" fill="currentColor" />
        </svg>
      );
    case 'bash': case 'shell': case 'sh': case 'zsh': case 'fish': case 'powershell': case 'ps1':
      return (
        <svg {...s} {...k}>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <polyline points="8 10 11 13 8 16" />
          <line x1="13" y1="16" x2="17" y2="16" />
        </svg>
      );
    case 'go':
      return (
        <svg {...s}>
          <text x="3" y="17" fontSize="14" fontWeight="700" fontFamily="monospace" fill="#00ADD8">Go</text>
        </svg>
      );
    case 'html': case 'xml':
      return (
        <svg {...s} {...k}>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    case 'css': case 'scss': case 'sass': case 'less':
      return (
        <svg {...s} {...k}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M8 8h8M8 12h5M8 16h3" />
        </svg>
      );
    case 'json': case 'yaml': case 'yml': case 'toml': case 'ini':
      return (
        <svg {...s} {...k}>
          <path d="M7 4a3 3 0 0 0-3 3v2a2 2 0 0 1-2 2 2 2 0 0 1 2 2v2a3 3 0 0 0 3 3" />
          <path d="M17 4a3 3 0 0 1 3 3v2a2 2 0 0 0 2 2 2 2 0 0 0-2 2v2a3 3 0 0 1-3 3" />
        </svg>
      );
    case 'sql':
      return (
        <svg {...s} {...k}>
          <ellipse cx="12" cy="6" rx="8" ry="3" />
          <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
          <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
        </svg>
      );
    case 'docker': case 'dockerfile':
      return (
        <svg {...s} {...k}>
          <rect x="1" y="10" width="22" height="8" rx="2" />
          <rect x="4" y="6" width="4" height="4" />
          <rect x="10" y="6" width="4" height="4" />
          <rect x="10" y="2" width="4" height="4" />
        </svg>
      );
    case 'ruby': case 'rb':
      return (
        <svg {...s} {...k}>
          <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" />
          <line x1="12" y1="2" x2="12" y2="22" />
        </svg>
      );
    case 'java': case 'kotlin':
      return (
        <svg {...s} {...k}>
          <path d="M8 22s2-1 2-4c0-3-2-4-2-7s2-4 2-7c0-3-2-4-2-4" />
          <path d="M16 22s-2-1-2-4c0-3 2-4 2-7s-2-4-2-7c0-3 2-4 2-4" />
        </svg>
      );
    case 'swift':
      return (
        <svg {...s} {...k}>
          <path d="M20 5s-5 6-12 10c3-1 6-1 9 1-4 3-10 3-14 0C-1 12 4 5 4 5c4 5 9 7 9 7C10 9 6 5 6 5c5 4 10 7 14 0z" />
        </svg>
      );
    case 'c': case 'cpp': case 'csharp': case 'cs':
      return (
        <svg {...s} {...k}>
          <path d="M18 12a6 6 0 1 1-6-6c2.2 0 4.2 1.2 5.2 3" />
          {(lang === 'cpp' || lang === 'csharp' || lang === 'cs') && (
            <>
              <line x1="18" y1="10" x2="18" y2="14" />
              <line x1="16" y1="12" x2="20" y2="12" />
            </>
          )}
          {(lang === 'csharp' || lang === 'cs') && (
            <>
              <line x1="21" y1="10" x2="21" y2="14" />
              <line x1="19" y1="12" x2="23" y2="12" />
            </>
          )}
        </svg>
      );
    case 'diff':
      return (
        <svg {...s} {...k}>
          <line x1="5" y1="8" x2="19" y2="8" />
          <line x1="12" y1="4" x2="12" y2="12" />
          <line x1="5" y1="18" x2="19" y2="18" />
        </svg>
      );
    default:
      return (
        <svg {...s} {...k}>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
  }
}

/* ── Copy button ── */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button onClick={handleCopy} className="code-copy-btn" aria-label={copied ? 'Copied' : 'Copy code'}>
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
      <span>{copied ? 'Copied!' : 'Copy'}</span>
    </button>
  );
}

/* ── Main renderer ── */
export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          /* ─ Code blocks ─ */
          pre({ children, node, ...props }) {
            const codeChild = React.Children.toArray(children).find(
              (child): child is React.ReactElement =>
                React.isValidElement(child) &&
                ((child.type as string) === 'code' ||
                  (typeof (child.props as Record<string, unknown>)?.className === 'string' &&
                    ((child.props as Record<string, unknown>).className as string).includes('hljs')))
            );

            if (!codeChild || !React.isValidElement(codeChild)) {
              return <pre {...props}>{children}</pre>;
            }

            const className = ((codeChild.props as Record<string, unknown>)?.className as string) || '';
            const match = /language-(\w[\w+#-]*)/.exec(className);
            const lang = match ? match[1].toLowerCase() : '';
            const rawText = extractText(
              (codeChild.props as { children?: ReactNode }).children
            ).replace(/\n$/, '');
            const label = (lang && LANG_CONFIG[lang]) || lang || 'Code';

            return (
              <div className="code-block-wrapper">
                <div className="code-block-header">
                  <div className="code-block-lang">
                    <LanguageIcon lang={lang || 'default'} />
                    <span>{label}</span>
                  </div>
                  <CopyButton text={rawText} />
                </div>
                <pre {...props}>{children}</pre>
              </div>
            );
          },

          /* ─ Images with optional captions ─ */
          img({ src, alt, node, ...props }) {
            return (
              <span className="markdown-image-wrapper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={alt || ''} loading="lazy" {...props} />
                {alt && alt !== '' && (
                  <span className="markdown-image-caption">{alt}</span>
                )}
              </span>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
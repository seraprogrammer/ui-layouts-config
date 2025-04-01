import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // Import a dark theme for code highlighting

interface FormattedMessageProps {
  content: string;
  isAssistant: boolean;
}

const FormattedMessage: React.FC<FormattedMessageProps> = ({
  content,
  isAssistant,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Only apply markdown formatting to assistant messages
  if (!isAssistant) {
    return <div className="whitespace-pre-wrap break-words">{content}</div>;
  }

  // Function to handle code copying
  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code.replace(/\n$/, ""));
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Track code block indices
  let codeBlockIndex = 0;

  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          // Style code blocks
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const code = String(children).replace(/\n$/, "");

            if (!inline && match) {
              const currentIndex = codeBlockIndex++;
              return (
                <div className="my-4 rounded-md overflow-hidden border border-gray-700">
                  <div className="bg-gray-800/80 px-4 py-2 text-xs text-gray-400 flex items-center justify-between">
                    <span className="font-medium">{match[1]}</span>
                    <button
                      className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                      onClick={() => handleCopyCode(code, currentIndex)}
                    >
                      {copiedIndex === currentIndex ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-green-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-green-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                            />
                          </svg>
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <pre className="p-4 bg-gray-900/50 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                    {code.length > 500 && (
                      <div className="absolute bottom-2 right-2">
                        <button
                          className="bg-gray-800 hover:bg-gray-700 text-xs px-2 py-1 rounded text-gray-300 transition-colors"
                          onClick={() => handleCopyCode(code, currentIndex)}
                        >
                          Copy
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            return (
              <code
                className="bg-gray-800/70 px-1.5 py-0.5 rounded text-sm text-blue-300"
                {...props}
              >
                {children}
              </code>
            );
          },
          // Style links
          a: ({ node, children, ...props }) => (
            <a
              className="text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          ),
          // Style headings
          h1: ({ node, children, ...props }) => (
            <h1 className="text-2xl font-bold my-4" {...props}>
              {children}
            </h1>
          ),
          h2: ({ node, children, ...props }) => (
            <h2 className="text-xl font-bold my-3" {...props}>
              {children}
            </h2>
          ),
          h3: ({ node, children, ...props }) => (
            <h3 className="text-lg font-bold my-2" {...props}>
              {children}
            </h3>
          ),
          // Style lists
          ul: ({ node, children, ...props }) => (
            <ul className="list-disc pl-6 my-2" {...props}>
              {children}
            </ul>
          ),
          ol: ({ node, children, ...props }) => (
            <ol className="list-decimal pl-6 my-2" {...props}>
              {children}
            </ol>
          ),
          // Style blockquotes
          blockquote: ({ node, children, ...props }) => (
            <blockquote
              className="border-l-4 border-gray-600 pl-4 py-1 my-2 text-gray-300 bg-gray-800/30 rounded-r-md"
              {...props}
            >
              {children}
            </blockquote>
          ),
          // Style tables
          table: ({ node, children, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table
                className="min-w-full divide-y divide-gray-700 border border-gray-700 rounded"
                {...props}
              >
                {children}
              </table>
            </div>
          ),
          thead: ({ node, children, ...props }) => (
            <thead className="bg-gray-800" {...props}>
              {children}
            </thead>
          ),
          tbody: ({ node, children, ...props }) => (
            <tbody className="divide-y divide-gray-700 bg-gray-900" {...props}>
              {children}
            </tbody>
          ),
          tr: ({ node, children, ...props }) => (
            <tr className="hover:bg-gray-800" {...props}>
              {children}
            </tr>
          ),
          th: ({ node, children, ...props }) => (
            <th
              className="px-4 py-2 text-left text-sm font-medium text-gray-300"
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ node, children, ...props }) => (
            <td className="px-4 py-2 text-sm" {...props}>
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default FormattedMessage;

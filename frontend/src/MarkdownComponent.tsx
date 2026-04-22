import { useState } from 'react'

const CopyButton = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 px-2 py-1 text-xs rounded
        bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
    >
      {copied ? 'Kopiert ✓' : 'Kopieren'}
    </button>
  )
}

export const markdownComponents = {
  code({ node, inline, className, children, ...props }: any) {
    const code = String(children).replace(/\n$/, '')
    if (inline) {
      return (
        <code className="bg-gray-200 px-1 py-0.5 rounded text-gray-900 text-xs font-mono" {...props}>
          {children}
        </code>
      )
    }
    return (
      <div className="relative my-2">
        <CopyButton code={code} />
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs font-mono">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      </div>
    )
  },
  h1: ({ children }: any) => <h1 className="text-base font-semibold text-gray-900 mt-3 mb-1">{children}</h1>,
  h2: ({ children }: any) => <h2 className="text-sm font-semibold text-gray-900 mt-3 mb-1">{children}</h2>,
  h3: ({ children }: any) => <h3 className="text-sm font-medium text-gray-900 mt-2 mb-1">{children}</h3>,
  p: ({ children }: any) => <p className="text-gray-800 my-1">{children}</p>,
  li: ({ children }: any) => <li className="text-gray-800">{children}</li>,
  table: ({ children }: any) => (
    <div className="overflow-x-auto my-2">
      <table className="text-xs border-collapse w-full">{children}</table>
    </div>
  ),
  th: ({ children }: any) => <th className="border border-gray-300 bg-gray-200 px-2 py-1 text-left text-gray-900">{children}</th>,
  td: ({ children }: any) => <td className="border border-gray-300 px-2 py-1 text-gray-800">{children}</td>,
  pre: ({ children }: any) => <pre className="bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs font-mono my-2">{children}</pre>
}

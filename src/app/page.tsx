'use client';

import { useState } from 'react';

type OutputFormat = 'twitter' | 'linkedin' | 'email' | 'instagram';

const templates: Record<OutputFormat, (content: string) => string> = {
  twitter: (content) => {
    const points = content.split(/[.!?\n]/).filter(p => p.trim().length > 20);
    const tweets: string[] = points.slice(0, 5).map((point, i) => {
      const num = i + 1;
      const text = point.trim();
      if (i === 0) return `🧵 ${text}${text.endsWith('.') ? '' : '.'}`;
      if (i === tweets.length - 1) return `${num}/${tweets.length} ${text} 👇`;
      return `${num}/${tweets.length} ${text}`;
    });
    return tweets.join('\n\n');
  },
  
  linkedin: (content) => {
    const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 10);
    const intro = sentences[0]?.trim() || '';
    const body = sentences.slice(1, 4).map(s => `• ${s.trim()}`).join('\n');
    const outro = '\n\n👇 What are your thoughts on this?';
    return `${intro}.\n\n${body}${outro}`;
  },
  
  email: (content) => {
    const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 10);
    const subject = sentences[0]?.slice(0, 50).trim() || 'Quick thought';
    const body = sentences.slice(1, 4).join('. ').trim();
    return `Subject: ${subject}\n\n${body}.`;
  },
  
  instagram: (content) => {
    const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 10);
    const hashtags = '#content #marketing #growth #startup';
    const caption = sentences.slice(0, 3).map(s => `• ${s.trim()}`).join('\n');
    return `${caption}\n\n${hashtags}`;
  },
};

const formatLabels: Record<OutputFormat, string> = {
  twitter: '🐦 Twitter Thread',
  linkedin: '💼 LinkedIn Post',
  email: '📧 Cold Email',
  instagram: '📸 Instagram',
};

export default function Home() {
  const [input, setInput] = useState('');
  const [format, setFormat] = useState<OutputFormat>('twitter');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    if (!input.trim()) return;
    const result = templates[format](input);
    setOutput(result);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🔄 Content Repurpose
          </h1>
          <p className="text-lg text-slate-300">
            Turn long content into viral posts in seconds
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input */}
          <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Paste your content
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste article, blog post, or any long content here..."
              className="w-full h-64 bg-slate-900/50 border border-slate-600 rounded-xl p-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Output */}
          <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Output format
            </label>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {(Object.keys(formatLabels) as OutputFormat[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`p-3 rounded-xl text-sm font-medium transition-all ${
                    format === f
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {formatLabels[f]}
                </button>
              ))}
            </div>

            <div className="relative">
              <textarea
                value={output}
                readOnly
                placeholder="Converted content will appear here..."
                className="w-full h-40 bg-slate-900/50 border border-slate-600 rounded-xl p-4 text-white placeholder-slate-500 resize-none"
              />
              {output && (
                <button
                  onClick={handleCopy}
                  className="absolute top-2 right-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={handleConvert}
            disabled={!input.trim()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-12 rounded-2xl text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25"
          >
            ✨ Convert Content
          </button>
        </div>

        <div className="mt-12 text-center text-slate-500 text-sm">
          <p>Built by Nova • Autonomous Revenue Agent</p>
        </div>
      </div>
    </div>
  );
}

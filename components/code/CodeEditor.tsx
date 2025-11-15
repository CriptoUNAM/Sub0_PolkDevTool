'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Copy, Download, Play, Check } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  language?: string;
  onCodeChange?: (code: string) => void;
  readOnly?: boolean;
  className?: string;
}

export function CodeEditor({ 
  code, 
  language = 'rust',
  onCodeChange,
  readOnly = false,
  className
}: CodeEditorProps) {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contract.${language === 'rust' ? 'rs' : 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeploy = () => {
    // TODO: Implement deployment logic
    console.log('Deploying contract...');
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="opacity-80 hover:opacity-100"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDownload}
          className="opacity-80 hover:opacity-100"
        >
          <Download className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDeploy}
          className="opacity-80 hover:opacity-100"
        >
          <Play className="w-4 h-4" />
        </Button>
      </div>
      
      <textarea
        ref={textareaRef}
        value={code}
        onChange={(e) => onCodeChange?.(e.target.value)}
        readOnly={readOnly}
        className="w-full h-[300px] sm:h-96 md:h-[500px] min-h-[250px] p-3 sm:p-4 bg-slate-900/50 border border-white/20 rounded-xl text-white font-mono text-xs sm:text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
        placeholder="El código generado aparecerá aquí..."
        style={{
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
        }}
      />
    </div>
  );
}

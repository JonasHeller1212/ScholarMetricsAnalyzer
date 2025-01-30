import React, { useState } from 'react';
import { Search, ExternalLink, Loader2, AlertCircle } from 'lucide-react';

interface SearchBarProps {
  onSearch: (url: string) => void;
  isLoading?: boolean;
}

export function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateUrl = (url: string): boolean => {
    const scholarUrlPattern = /^https:\/\/scholar\.google\.com\/citations\?user=[\w-]+/;
    return scholarUrlPattern.test(url.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUrl = url.trim();
    
    if (!trimmedUrl) {
      setError('Please enter a Google Scholar profile URL');
      return;
    }

    if (!validateUrl(trimmedUrl)) {
      setError('Invalid URL format. Please enter a valid Google Scholar profile URL');
      return;
    }

    setError(null);
    onSearch(trimmedUrl);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setError(null); // Clear error when user starts typing
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={url}
          onChange={handleUrlChange}
          placeholder="Enter Google Scholar profile URL..."
          className={`w-full px-4 py-3 pl-12 text-gray-700 bg-white border ${
            error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-primary-start focus:ring-primary-start/20'
          } rounded-xl focus:outline-none focus:ring-2 transition-all`}
          disabled={isLoading}
        />
        <ExternalLink className={`absolute left-4 top-3.5 h-5 w-5 ${
          error ? 'text-red-400' : 'gradient-icon'
        }`} />
        <button
          type="submit"
          disabled={!url.trim() || isLoading}
          className="absolute right-2 top-2 px-4 py-1.5 bg-gradient-to-r from-primary-start to-primary-end text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <span>Analyze</span>
          )}
        </button>
      </div>
      
      <div className="mt-2 flex items-start space-x-1">
        {error ? (
          <div className="flex items-center space-x-1 text-red-600 text-xs">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        ) : (
          <div className="text-xs text-gray-500 flex items-center space-x-1">
            <Search className="h-3.5 w-3.5 gradient-icon" />
            <span>Example: https://scholar.google.com/citations?user=NOSPtp8AAAAJ</span>
          </div>
        )}
      </div>
    </form>
  );
}
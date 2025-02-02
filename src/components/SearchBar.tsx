import React, { useState } from 'react';
import { Search, ExternalLink, Loader2, AlertCircle, BookOpen } from 'lucide-react';

interface SearchBarProps {
  onSearch: (url: string) => void;
  isLoading?: boolean;
  compact?: boolean;
}

export function SearchBar({ onSearch, isLoading = false, compact = false }: SearchBarProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateUrl = (url: string): boolean => {
    const scholarUrlPattern = /^https:\/\/scholar\.google\.com\/citations\?(?:hl=\w+&)?user=[\w-]+/;
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

    // Normalize the URL format to ensure consistent handling
    const urlObj = new URL(trimmedUrl);
    const userId = urlObj.searchParams.get('user');
    const normalizedUrl = `https://scholar.google.com/citations?user=${userId}`;

    setError(null);
    onSearch(normalizedUrl);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setError(null);
  };

  const handleSampleLink = () => {
    const sampleUrl = 'https://scholar.google.com/citations?user=NOSPtp8AAAAJ&hl=en';
    setUrl(sampleUrl);
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={url}
          onChange={handleUrlChange}
          placeholder="Enter Google Scholar profile URL..."
          className={`w-full ${
            compact 
              ? 'py-1.5 pl-9 pr-16 text-xs' 
              : 'py-3 pl-12 pr-24 text-sm'
          } text-gray-700 bg-white border ${
            error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-primary-start focus:ring-primary-start/20'
          } rounded-lg focus:outline-none focus:ring-2 transition-all`}
          disabled={isLoading}
        />
        <ExternalLink className={`absolute ${
          compact ? 'left-3 top-2 h-4 w-4' : 'left-4 top-3.5 h-5 w-5'
        } ${error ? 'text-red-400' : 'gradient-icon'}`} />
        <button
          type="submit"
          disabled={!url.trim() || isLoading}
          className={`absolute ${
            compact ? 'right-2 top-1 px-2 py-1' : 'right-2 top-2 px-3 py-1.5'
          } bg-gradient-to-r from-primary-start to-primary-end text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-xs`}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <span>Analyze</span>
          )}
        </button>
      </div>
      
      {error && !compact && (
        <div className="mt-2 flex items-start space-x-1">
          <div className="flex items-center space-x-1 text-red-600 text-xs">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}
      
      {!error && !compact && (
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Search className="h-3.5 w-3.5 gradient-icon" />
            <span>Enter a Google Scholar profile URL to analyze metrics</span>
          </div>
          <button
            type="button"
            onClick={handleSampleLink}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Try a sample profile</span>
          </button>
        </div>
      )}
    </form>
  );
}
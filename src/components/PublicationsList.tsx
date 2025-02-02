import React, { useState } from 'react';
import { ArrowUpDown, BookOpen, Presentation as Citation, Calendar } from 'lucide-react';
import type { Publication } from '../types/scholar';

interface PublicationsListProps {
  publications: Publication[];
}

type SortField = 'year' | 'citations' | 'title';

export function PublicationsList({ publications }: PublicationsListProps) {
  const [sortField, setSortField] = useState<SortField>('citations');
  
  const handleSort = (field: SortField) => {
    setSortField(field);
  };

  const sortedPublications = [...publications].sort((a, b) => {
    switch (sortField) {
      case 'year':
        return b.year - a.year;
      case 'citations':
        return b.citations - a.citations;
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  if (!publications.length) {
    return (
      <div className="bg-white rounded-lg p-6 text-center">
        <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600">No publications found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
          Publications ({publications.length})
        </h3>
        
        <div className="flex space-x-2">
          <button
            onClick={() => handleSort('citations')}
            className={`text-xs px-2 py-1 rounded ${
              sortField === 'citations'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Citations
            <ArrowUpDown className="h-3 w-3 ml-1 inline" />
          </button>
          <button
            onClick={() => handleSort('year')}
            className={`text-xs px-2 py-1 rounded ${
              sortField === 'year'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Year
            <ArrowUpDown className="h-3 w-3 ml-1 inline" />
          </button>
          <button
            onClick={() => handleSort('title')}
            className={`text-xs px-2 py-1 rounded ${
              sortField === 'title'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Title
            <ArrowUpDown className="h-3 w-3 ml-1 inline" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {sortedPublications.map((pub, index) => (
          <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
            <a
              href={pub.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:bg-gray-50 rounded p-2 -mx-2 transition-colors"
            >
              <h4 className="text-sm font-medium text-gray-900 hover:text-blue-600 mb-1">
                {pub.title}
              </h4>
              <p className="text-xs text-gray-600 mb-2">
                {pub.authors.join(', ')}
              </p>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {pub.year}
                </span>
                <span className="flex items-center">
                  <Citation className="h-3 w-3 mr-1" />
                  {pub.citations.toLocaleString()} citations
                </span>
                {pub.venue && (
                  <span className="text-gray-400">{pub.venue}</span>
                )}
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
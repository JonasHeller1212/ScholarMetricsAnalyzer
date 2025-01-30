import React, { useState } from 'react';
import { ArrowUpDown, BookOpen, Presentation as Citation } from 'lucide-react';
import type { Publication } from '../types/scholar';

interface PublicationsListProps {
  publications: Publication[];
}

type SortField = 'year' | 'citations' | 'title';
type SortDirection = 'asc' | 'desc';

export function PublicationsList({ publications }: PublicationsListProps) {
  const [sortField, setSortField] = useState<SortField>('year');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedPublications = [...publications].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case 'year':
        comparison = b.year - a.year;
        break;
      case 'citations':
        comparison = b.citations - a.citations;
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
    }
    return sortDirection === 'asc' ? -comparison : comparison;
  });

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-primary-start/10 p-6 hover:shadow-lg transition-all">
      <h3 className="text-lg font-semibold gradient-text mb-4 flex items-center">
        <BookOpen className="h-5 w-5 mr-2 gradient-icon" />
        Publications
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-primary-start/10">
              <th className="pb-2">
                <button
                  onClick={() => handleSort('title')}
                  className="text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center"
                >
                  Title
                  <ArrowUpDown className="h-3 w-3 ml-1" />
                </button>
              </th>
              <th className="pb-2">
                <button
                  onClick={() => handleSort('year')}
                  className="text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center justify-end"
                >
                  Year
                  <ArrowUpDown className="h-3 w-3 ml-1" />
                </button>
              </th>
              <th className="pb-2">
                <button
                  onClick={() => handleSort('citations')}
                  className="text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center justify-end"
                >
                  Citations
                  <ArrowUpDown className="h-3 w-3 ml-1" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPublications.map((pub, index) => (
              <tr key={index} className="border-b border-gray-100 last:border-0 hover:bg-primary-start/5">
                <td className="py-2">
                  <a
                    href={pub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs gradient-text hover:opacity-80"
                  >
                    {pub.title}
                  </a>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {pub.authors.join(', ')}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{pub.venue}</p>
                </td>
                <td className="py-2 text-right">
                  <span className="text-xs text-gray-600">{pub.year}</span>
                </td>
                <td className="py-2 text-right">
                  <span className="text-xs text-gray-600 flex items-center justify-end">
                    <Citation className="h-3 w-3 mr-1 gradient-icon" />
                    {pub.citations.toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
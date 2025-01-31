import React, { useState, useEffect } from 'react';
import { ArrowUpDown, BookOpen, Presentation as Citation, Award, Info, AlertCircle } from 'lucide-react';
import type { Publication, JournalRanking } from '../types/scholar';
import { Tooltip } from './Tooltip';

interface PublicationsListProps {
  publications: Publication[];
}

type SortField = 'year' | 'citations' | 'title' | 'ranking';
type SortDirection = 'asc' | 'desc';

function RankingBadge({ ranking }: { ranking?: JournalRanking }) {
  if (!ranking) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {ranking.absRanking && (
        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
          ranking.absRanking === '4*' ? 'bg-purple-100 text-purple-700' :
          ranking.absRanking === '4' ? 'bg-indigo-100 text-indigo-700' :
          ranking.absRanking === '3' ? 'bg-blue-100 text-blue-700' :
          ranking.absRanking === '2' ? 'bg-sky-100 text-sky-700' :
          'bg-slate-100 text-slate-700'
        }`}>
          <Award className="h-3 w-3 mr-0.5" />
          ABS {ranking.absRanking}
        </span>
      )}
      
      {ranking.jcrQuartile && (
        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
          ranking.jcrQuartile === 1 ? 'bg-green-100 text-green-700' :
          ranking.jcrQuartile === 2 ? 'bg-teal-100 text-teal-700' :
          ranking.jcrQuartile === 3 ? 'bg-yellow-100 text-yellow-700' :
          'bg-orange-100 text-orange-700'
        }`}>
          <Award className="h-3 w-3 mr-0.5" />
          JCR Q{ranking.jcrQuartile}
        </span>
      )}
    </div>
  );
}

export function PublicationsList({ publications }: PublicationsListProps) {
  const [sortField, setSortField] = useState<SortField>('year');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

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
      case 'ranking':
        const getRankingScore = (pub: Publication) => {
          if (!pub.journalRanking) return 0;
          let score = 0;
          if (pub.journalRanking.absRanking) {
            score += pub.journalRanking.absRanking === '4*' ? 5 :
                    pub.journalRanking.absRanking === '4' ? 4 :
                    pub.journalRanking.absRanking === '3' ? 3 :
                    pub.journalRanking.absRanking === '2' ? 2 : 1;
          }
          if (pub.journalRanking.jcrQuartile) {
            score += 5 - pub.journalRanking.jcrQuartile;
          }
          return score;
        };
        comparison = getRankingScore(b) - getRankingScore(a);
        break;
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  if (!publications.length) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-primary-start/10 p-6 text-center">
        <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600">No publications found</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-primary-start/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold gradient-text flex items-center">
          <BookOpen className="h-5 w-5 mr-2 gradient-icon" />
          Publications ({publications.length})
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-primary-start/10">
              <th className="pb-2">
                <button
                  onClick={() => handleSort('ranking')}
                  className="text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center"
                >
                  Rankings
                  <ArrowUpDown className="h-3 w-3 ml-1" />
                </button>
              </th>
              <th className="pb-2">
                <button
                  onClick={() => handleSort('title')}
                  className="text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center"
                >
                  Title
                  <ArrowUpDown className="h-3 w-3 ml-1" />
                </button>
              </th>
              <th className="pb-2 text-right">
                <button
                  onClick={() => handleSort('year')}
                  className="text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center justify-end"
                >
                  Year
                  <ArrowUpDown className="h-3 w-3 ml-1" />
                </button>
              </th>
              <th className="pb-2 text-right">
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
                <td className="py-2 pr-4">
                  {isLoading ? (
                    <div className="animate-pulse bg-gray-200 h-5 w-20 rounded" />
                  ) : !pub.journalRanking ? (
                    <Tooltip content={{
                      description: "Damn, we are working on this",
                      pros: "We're actively expanding our journal rankings database",
                      cons: "Some journals might not be recognized yet",
                      link: "https://en.wikipedia.org/wiki/Journal_ranking"
                    }} position="bottom">
                      <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-600">
                        <AlertCircle className="h-3 w-3 mr-0.5" />
                        <span>Processing...</span>
                      </span>
                    </Tooltip>
                  ) : (
                    <RankingBadge ranking={pub.journalRanking} />
                  )}
                </td>
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
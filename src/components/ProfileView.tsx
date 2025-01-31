import React from 'react';
import { GraduationCap, Search, ArrowLeft, BookOpen, ExternalLink, Users, Presentation as Citation, Award, LineChart } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { TopicsList } from './TopicsList';
import { PublicationsList } from './PublicationsList';
import { CitationsChart } from './CitationsChart';
import { MetricsCard } from './MetricsCard';
import type { Author } from '../types/scholar';

interface ProfileViewProps {
  data: Author;
  loading: boolean;
  error: string | null;
  onSearch: (url: string) => void;
  onReset: () => void;
  socialLinks: React.ReactNode;
}

export default function ProfileView({ data, loading, error, onSearch, onReset, socialLinks }: ProfileViewProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-sm text-gray-600">Analyzing profile data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-2xl mx-auto">
        <div className="p-4 bg-red-100/50 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
          <Search className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-red-900 mb-2">Analysis Failed</h2>
        <p className="text-sm text-red-600 mb-4">{error}</p>
        <p className="text-xs text-red-500">Please check the URL and try again</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <header className="bg-white/90 backdrop-blur-xl border-b border-primary-start/10 sticky top-0 z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-primary-start to-primary-end rounded-xl">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Scholar Metrics Analyzer</h1>
                <p className="text-sm text-gray-600">Advanced analytics for Google Scholar profiles</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              {socialLinks}
              <button
                onClick={onReset}
                className="flex items-center space-x-2 px-4 py-2 text-sm gradient-text hover:opacity-80 rounded-lg transition-opacity"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Landing Page</span>
              </button>
            </div>
          </div>
          <SearchBar onSearch={onSearch} isLoading={loading} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-primary-start/10 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  {data.imageUrl ? (
                    <img
                      src={data.imageUrl}
                      alt={data.name}
                      className="w-24 h-24 rounded-lg object-cover bg-blue-50"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXVzZXIiPjxwYXRoIGQ9Ik0xOSAyMXYtMmE0IDQgMCAwIDAtNC00SDlhNCA0IDAgMCAwLTQgNHYyIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSI3IiByPSI0Ii8+PC9zdmc+';
                        target.className = 'w-24 h-24 rounded-lg p-6 bg-blue-50 text-blue-600';
                      }}
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Search className="w-12 h-12 text-blue-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">{data.name}</h2>
                  <p className="text-sm text-gray-600 mt-1">{data.affiliation}</p>
                  <div className="mt-4">
                    <TopicsList topics={data.topics} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <h3 className="col-span-full text-sm font-medium text-gray-700 mt-2 first:mt-0 flex items-center">
                  <Citation className="h-4 w-4 text-blue-600 mr-2" />
                  Impact Metrics
                </h3>
                <MetricsCard
                  title="h-index"
                  value={data.metrics.hIndex}
                  subtitle="Core researcher impact"
                  icon="hIndex"
                />
                <MetricsCard
                  title="g-index"
                  value={data.metrics.gIndex}
                  subtitle="Depth of impact"
                  icon="gIndex"
                />
                <MetricsCard
                  title="i10-index"
                  value={data.metrics.i10Index}
                  subtitle="Broad impact"
                  icon="i10Index"
                />
                <MetricsCard
                  title="Total Citations"
                  value={data.totalCitations.toLocaleString()}
                  subtitle="citations"
                  icon="citations"
                />

                <h3 className="col-span-full text-sm font-medium text-gray-700 mt-4 flex items-center">
                  <LineChart className="h-4 w-4 text-blue-600 mr-2" />
                  Career Trends
                </h3>
                <MetricsCard
                  title="h5-index"
                  value={data.metrics.h5Index}
                  subtitle="Recent 5-year impact"
                  icon="h5Index"
                />
                <MetricsCard
                  title="Citations/Year"
                  value={(data.totalCitations / Math.max(1, Object.keys(data.metrics.citationsPerYear).length)).toFixed(1)}
                  subtitle="Annual impact"
                  icon="citationsPerYear"
                />
                <MetricsCard
                  title="ACC5"
                  value={data.metrics.acc5.toLocaleString()}
                  subtitle="5-year citations"
                  icon="acc5"
                />
                <MetricsCard
                  title="Pubs/Year"
                  value={data.metrics.publicationsPerYear}
                  subtitle="Annual productivity"
                  icon="pubsPerYear"
                />

                <h3 className="col-span-full text-sm font-medium text-gray-700 mt-4 flex items-center">
                  <Users className="h-4 w-4 text-blue-600 mr-2" />
                  Collaboration
                </h3>
                <MetricsCard
                  title="Collaboration"
                  value={data.metrics.collaborationScore + '%'}
                  subtitle="Team research"
                  icon="network"
                />
                <MetricsCard
                  title="Co-Authors"
                  value={data.metrics.totalCoAuthors.toLocaleString()}
                  subtitle="Unique collaborators"
                  icon="coAuthors"
                />
                <MetricsCard
                  title="Avg. Authors"
                  value={data.metrics.averageAuthors}
                  subtitle="Per publication"
                  icon="avgAuthors"
                />
                <MetricsCard
                  title="Solo Papers"
                  value={data.metrics.soloAuthorScore + '%'}
                  subtitle="Single author"
                  icon="soloAuthor"
                />
              </div>
            </div>

            <PublicationsList publications={data.publications} />
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-primary-start/10 p-6">
              <CitationsChart citationsPerYear={data.metrics.citationsPerYear} />
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-primary-start/10 p-6">
              <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                <BookOpen className="h-4 w-4 text-blue-600 mr-2" />
                Most Recent Publication
              </h4>
              {data.publications[0] && (
                <div className="space-y-4">
                  <a
                    href={data.publications[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 block"
                  >
                    {data.publications[0].title}
                  </a>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Citation className="h-4 w-4 text-blue-600 mr-2" />
                      {data.publications[0].citations.toLocaleString()} citations
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-blue-600 mr-2" />
                      {data.publications[0].authors.length} authors
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    <div className="font-medium mb-1">Full Reference:</div>
                    <p className="leading-relaxed">
                      {data.publications[0].authors.join(', ')}
                      {'. '}
                      <span className="italic">{data.publications[0].title}</span>
                      {'. '}
                      {data.publications[0].venue}
                      {' '}
                      ({data.publications[0].year})
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-primary-start/10 p-6">
              <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                <Award className="h-4 w-4 text-blue-600 mr-2" />
                Most Cited Paper
              </h4>
              <div className="space-y-4">
                <a
                  href={data.metrics.topPaperUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 block"
                >
                  {data.metrics.topPaperTitle}
                </a>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <Citation className="h-4 w-4 text-blue-600 mr-2" />
                    {data.metrics.topPaperCitations.toLocaleString()} citations
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-blue-600 mr-2" />
                    {data.publications.find(p => p.title === data.metrics.topPaperTitle)?.authors.length || 0} authors
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  <div className="font-medium mb-1">Full Reference:</div>
                  <p className="leading-relaxed">
                    {data.publications.find(p => p.title === data.metrics.topPaperTitle)?.authors.join(', ')}
                    {'. '}
                    <span className="italic">{data.metrics.topPaperTitle}</span>
                    {'. '}
                    {data.publications.find(p => p.title === data.metrics.topPaperTitle)?.venue}
                    {' '}
                    ({data.publications.find(p => p.title === data.metrics.topPaperTitle)?.year})
                  </p>
                </div>
              </div>
            </div>

            {data.metrics.topCoAuthor && (
              <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-primary-start/10 p-6">
                <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                  <Users className="h-4 w-4 text-blue-600 mr-2" />
                  Most Common Co-author
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    {data.metrics.topCoAuthorImage ? (
                      <img
                        src={data.metrics.topCoAuthorImage}
                        alt={data.metrics.topCoAuthor}
                        className="w-12 h-12 rounded-lg object-cover bg-blue-50"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXVzZXIiPjxwYXRoIGQ9Ik0xOSAyMXYtMmE0IDQgMCAwIDAtNC00SDlhNCA0IDAgMCAwLTQgNHYyIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSI3IiByPSI0Ii8+PC9zdmc+';
                          target.className = 'w-12 h-12 rounded-lg p-3 bg-blue-50 text-blue-600';
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Search className="w-6 h-6 text-blue-600" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm font-medium text-gray-900">{data.metrics.topCoAuthor}</span>
                        {data.metrics.topCoAuthorUrl && (
                          <a
                            href={data.metrics.topCoAuthorUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-gray-600">{data.metrics.topCoAuthorAffiliation}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Joint Papers</div>
                      <div className="font-medium text-gray-900">{data.metrics.topCoAuthorPapers}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">First Collaboration</div>
                      <div className="font-medium text-gray-900">{data.metrics.topCoAuthorFirstYear}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    <div className="font-medium mb-1">Latest Joint Paper:</div>
                    <a
                      href={data.metrics.topCoAuthorLatestPaperUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {data.metrics.topCoAuthorLatestPaper}
                    </a>
                    <div className="mt-1 text-gray-400">
                      {data.metrics.topCoAuthorLatestPaperYear}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
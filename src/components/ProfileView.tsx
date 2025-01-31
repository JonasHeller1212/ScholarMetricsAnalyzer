import React, { useState } from 'react';
import { GraduationCap, Search, ArrowLeft, BookOpen, ExternalLink, Users, Presentation as Citation, LineChart, Network, BarChart as ChartBar } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { TopicsList } from './TopicsList';
import { PublicationsList } from './PublicationsList';
import { CitationsChart } from './CitationsChart';
import { MetricsCard } from './MetricsCard';
import { CitationNetwork } from './CitationNetwork';
import type { Author } from '../types/scholar';

type Tab = 'metrics' | 'trends' | 'network' | 'publications';

interface ProfileViewProps {
  data: Author;
  loading: boolean;
  error: string | null;
  onSearch: (url: string) => void;
  onReset: () => void;
  socialLinks: React.ReactNode;
}

export default function ProfileView({ data, loading, error, onSearch, onReset, socialLinks }: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>('metrics');

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

  const tabs = [
    { id: 'metrics', label: 'Metrics', icon: ChartBar },
    { id: 'trends', label: 'Citation Trends', icon: LineChart },
    { id: 'network', label: 'Network Analysis', icon: Network },
    { id: 'publications', label: 'Publications', icon: BookOpen }
  ] as const;

  const renderContent = () => {
    switch (activeTab) {
      case 'network':
        return (
          <div className="h-[calc(100vh-2rem)]">
            <CitationNetwork publications={data.publications} fullScreen />
          </div>
        );
      case 'publications':
        return <PublicationsList publications={data.publications} />;
      case 'trends':
        return (
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-primary-start/10 p-6">
              <CitationsChart citationsPerYear={data.metrics.citationsPerYear} />
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-primary-start/10 p-6 hover:shadow-lg transition-shadow">
              {/* Profile info */}
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
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-gray-900">{data.name}</h2>
                  <p className="text-sm text-gray-600 mt-1">{data.affiliation}</p>
                  <div className="mt-4">
                    <TopicsList topics={data.topics} />
                  </div>
                </div>
              </div>
            </div>

            {/* All Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricsCard
                title="h-index"
                value={data.metrics.hIndex}
                subtitle="Core impact"
                icon="hIndex"
              />
              <MetricsCard
                title="g-index"
                value={data.metrics.gIndex}
                subtitle="High-impact papers"
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
                subtitle="Overall impact"
                icon="citations"
              />
              <MetricsCard
                title="Citations/Year"
                value={(data.totalCitations / Object.keys(data.metrics.citationsPerYear).length).toFixed(1)}
                subtitle="Impact rate"
                icon="citationsPerYear"
              />
              <MetricsCard
                title="h5-index"
                value={data.metrics.h5Index}
                subtitle="Recent impact"
                icon="h5Index"
              />
              <MetricsCard
                title="ACC5"
                value={data.metrics.acc5.toLocaleString()}
                subtitle="5-year citations"
                icon="acc5"
              />
              <MetricsCard
                title="Publications/Year"
                value={data.metrics.publicationsPerYear}
                subtitle="Productivity rate"
                icon="pubsPerYear"
              />
              <MetricsCard
                title="Network Size"
                value={data.metrics.totalCoAuthors}
                subtitle="Unique co-authors"
                icon="network"
              />
              <MetricsCard
                title="Avg. Authors"
                value={data.metrics.averageAuthors}
                subtitle="Per publication"
                icon="avgAuthors"
              />
              <MetricsCard
                title="Solo Author"
                value={`${data.metrics.soloAuthorScore}%`}
                subtitle="Single author papers"
                icon="soloAuthor"
              />
              <MetricsCard
                title="Collaboration"
                value={`${data.metrics.collaborationScore}%`}
                subtitle="Multi-author papers"
                icon="coAuthors"
              />
            </div>

            {/* Most Cited & Recent Papers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-primary-start/10 p-6">
                <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                  <Citation className="h-4 w-4 text-blue-600 mr-2" />
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
                </div>
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
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex">
      {/* Sidebar */}
      <aside className="w-48 bg-white border-r border-primary-start/10 flex-shrink-0">
        <div className="p-4 border-b border-primary-start/10">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-gradient-to-br from-primary-start to-primary-end rounded-lg">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-sm font-bold gradient-text">Scholar Metrics</h1>
          </div>
          <div className="mt-2">
            <SearchBar onSearch={onSearch} isLoading={loading} compact />
          </div>
        </div>
        <nav className="p-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                activeTab === id
                  ? 'bg-gradient-to-r from-primary-start to-primary-end text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="p-2 mt-auto border-t border-primary-start/10">
          <div className="flex items-center justify-between px-2">
            {socialLinks}
            <button
              onClick={onReset}
              className="flex items-center space-x-1 text-xs gradient-text hover:opacity-80 rounded-lg transition-opacity"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Back</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
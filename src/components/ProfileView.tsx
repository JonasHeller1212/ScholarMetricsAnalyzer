import React, { useState } from 'react';
import { GraduationCap, Search, ArrowLeft, BookOpen, ExternalLink, Users, Presentation as Citation, LineChart, Network, BarChart as ChartBar } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { TopicsList } from './TopicsList';
import { PublicationsList } from './PublicationsList';
import { CitationsChart } from './CitationsChart';
import { MetricsCard } from './MetricsCard';
import { CitationNetwork } from './CitationNetwork';
import { CareerAnalysis } from './CareerAnalysis';
import type { Author } from '../types/scholar';
import packageJson from '../../package.json';

interface ProfileViewProps {
  data: Author | null;
  loading: boolean;
  error: string | null;
  onSearch: (url: string) => void;
  onReset: () => void;
  socialLinks: React.ReactNode;
}

export function ProfileView({ 
  data, 
  loading, 
  error, 
  onSearch, 
  onReset, 
  socialLinks 
}: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState<'metrics' | 'trends' | 'network' | 'publications'>('metrics');

  if (!data) return null;

  return (
    <div className="relative">
      <header className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center">
              <button 
                onClick={onReset}
                className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              
              <div className="flex flex-col">
                <h1 className="text-xl font-semibold gradient-text flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 gradient-icon" />
                  Scholar Metrics Analyzer
                  <span className="ml-2 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                    v{packageJson.version}
                  </span>
                </h1>
              </div>
            </div>
            
            <div className="flex-1 max-w-xl">
              <SearchBar 
                onSearch={onSearch} 
                isLoading={loading} 
                error={error} 
                compact={true} 
              />
            </div>

            <div>
              {socialLinks}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-primary-start/10 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 gradient-text mb-2">
                  {data.name}
                </h2>
                <p className="text-gray-600 mb-3">
                  {data.affiliation}
                </p>
                {data.topics && data.topics.length > 0 && (
                  <div className="mt-3">
                    <TopicsList topics={data.topics} />
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text">{data.totalCitations.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Citations</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text">{data.hIndex}</div>
                  <div className="text-sm text-gray-500">h-index</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text">{data.publications.length}</div>
                  <div className="text-sm text-gray-500">Publications</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('metrics')}
                className={`py-3 px-1 font-medium text-sm border-b-2 ${
                  activeTab === 'metrics'
                    ? 'border-primary-start text-primary-start'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors`}
              >
                <ChartBar className="h-4 w-4 inline mr-1" />
                Impact Metrics
              </button>
              <button
                onClick={() => setActiveTab('trends')}
                className={`py-3 px-1 font-medium text-sm border-b-2 ${
                  activeTab === 'trends'
                    ? 'border-primary-start text-primary-start'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors`}
              >
                <LineChart className="h-4 w-4 inline mr-1" />
                Citation Trends
              </button>
              <button
                onClick={() => setActiveTab('network')}
                className={`py-3 px-1 font-medium text-sm border-b-2 ${
                  activeTab === 'network'
                    ? 'border-primary-start text-primary-start'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors`}
              >
                <Network className="h-4 w-4 inline mr-1" />
                Co-author Network
              </button>
              <button
                onClick={() => setActiveTab('publications')}
                className={`py-3 px-1 font-medium text-sm border-b-2 ${
                  activeTab === 'publications'
                    ? 'border-primary-start text-primary-start'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors`}
              >
                <BookOpen className="h-4 w-4 inline mr-1" />
                Publications
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'metrics' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact Metrics</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <MetricsCard
                  title="Total Citations"
                  value={data.totalCitations.toLocaleString()}
                  icon="citations"
                />
                <MetricsCard
                  title="h-index"
                  value={data.metrics.hIndex}
                  icon="hIndex"
                />
                <MetricsCard
                  title="g-index"
                  value={data.metrics.gIndex}
                  icon="gIndex"
                />
                <MetricsCard
                  title="i10-index"
                  value={data.metrics.i10Index}
                  icon="i10Index"
                />
                <MetricsCard
                  title="h5-index"
                  value={data.metrics.h5Index}
                  subtitle="Last 5 years"
                  icon="h5Index"
                />
                <MetricsCard
                  title="Publications"
                  value={data.metrics.totalPublications}
                  icon="publications"
                />
                <MetricsCard
                  title="Pubs Per Year"
                  value={data.metrics.publicationsPerYear}
                  icon="pubsPerYear"
                />
                <MetricsCard
                  title="Citations/Paper"
                  value={data.metrics.avgCitationsPerPaper}
                  icon="avgCitationsPerPaper"
                />
                <MetricsCard
                  title="Citations/Year"
                  value={data.metrics.avgCitationsPerYear}
                  icon="citationsPerYear"
                />
                <MetricsCard
                  title="Citation Growth"
                  value={`${data.metrics.citationGrowthRate > 0 ? '+' : ''}${data.metrics.citationGrowthRate}%`}
                  subtitle="3-year avg. growth rate"
                  icon="citationGrowth"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Collaboration Metrics</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <MetricsCard
                  title="Co-authors"
                  value={data.metrics.totalCoAuthors}
                  icon="coAuthors"
                />
                <MetricsCard
                  title="Avg Authors/Paper"
                  value={data.metrics.averageAuthors}
                  icon="avgAuthors"
                />
                <MetricsCard
                  title="Solo Author Rate"
                  value={`${data.metrics.soloAuthorScore}%`}
                  icon="soloAuthor"
                />
                <MetricsCard
                  title="Collaboration Rate"
                  value={`${data.metrics.collaborationScore}%`}
                  icon="network"
                />
                <MetricsCard
                  title="Top Co-author"
                  value={data.metrics.topCoAuthor.split(' ').pop() || 'N/A'}
                  subtitle={`${data.metrics.topCoAuthorPapers} papers`}
                  icon="topCoAuthor"
                />
              </div>
            </div>

            <CareerAnalysis />
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <CitationsChart citationsPerYear={data.metrics.citationsPerYear} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'network' && (
          <div className="grid gap-6 lg:grid-cols-2">
            <CitationNetwork publications={data.publications} />
          </div>
        )}

        {activeTab === 'publications' && (
          <PublicationsList publications={data.publications} />
        )}
      </main>
    </div>
  );
}
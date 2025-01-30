import React from 'react';
import { GraduationCap, CheckCircle } from 'lucide-react';
import { SearchBar } from './SearchBar';

interface LandingPageProps {
  onSearch: (url: string) => void;
  loading: boolean;
}

export function LandingPage({ onSearch, loading }: LandingPageProps) {
  return (
    <main>
      <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-start/5 to-primary-end/5" />
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.1) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        
        <div className="max-w-7xl mx-auto relative py-20">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Unlock the Full Potential of Your
              <div className="mt-2">
                <span className="gradient-text">Academic</span>
                {' '}
                <span className="text-gray-800">Impact</span>
              </div>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
              Transform your Google Scholar profile into comprehensive analytics and insights. Discover your
              true academic influence with advanced metrics and visualizations.
            </p>

            <div className="w-full max-w-2xl">
              <SearchBar onSearch={onSearch} isLoading={loading} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-start to-primary-end rounded-xl mb-4">
                  <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Citation Analysis</h3>
                <p className="text-gray-600">
                  Get deep insights with comprehensive metrics including h-index, g-index, and more.
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-start to-primary-end rounded-xl mb-4">
                  <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Collaboration Analysis</h3>
                <p className="text-gray-600">
                  Understand your research network with co-authorship patterns and collaboration metrics.
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-start to-primary-end rounded-xl mb-4">
                  <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20V10" />
                    <path d="M18 20V4" />
                    <path d="M6 20v-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Research Impact</h3>
                <p className="text-gray-600">
                  Visualize your research impact with citation trends and publication analysis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-start/5 to-primary-end/5" />
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.1) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-primary-start/10 p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Analyze Your
              <span className="gradient-text"> Research Impact?</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Get comprehensive insights into your academic influence with our advanced metrics analysis.
              Start by entering your Google Scholar profile URL below.
            </p>
            
            <div className="max-w-2xl mx-auto">
              <SearchBar onSearch={onSearch} isLoading={loading} />
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-primary-start mr-2" />
                Instant Analysis
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-primary-start mr-2" />
                Comprehensive Metrics
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-primary-start mr-2" />
                Visual Insights
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
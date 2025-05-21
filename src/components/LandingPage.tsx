import React, { useState } from 'react';
import { GraduationCap, CheckCircle, Search, TrendingUp, Network, BarChart, Presentation as Citation, Users, Award, BookOpen, ArrowRight, Sparkles, Zap, Computer } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { ScholarSearchModal } from './ScholarSearchModal';

interface LandingPageProps {
  onSearch: (url: string) => void;
  loading: boolean;
  error?: string | null;
}

export function LandingPage({ onSearch, loading, error }: LandingPageProps) {
  const [showScholarSearch, setShowScholarSearch] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <main className="flex-1">
      <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-start/5 to-primary-end/5" />
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.1) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center space-x-2 mb-6">
              <Sparkles className="h-6 w-6 text-[#E84E10]" />
              <span className="text-sm font-medium text-gray-600">Find & Analyze Your Scholar Profile</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Discover Your Research Impact with
              <div className="gradient-text mt-2">Advanced Analytics</div>
            </h1>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
              Enter your Google Scholar profile URL or search by name to get instant insights into your research impact, collaboration network, and publication metrics.
            </p>

            <div className="flex items-center justify-center space-x-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg mb-8">
              <Computer className="h-4 w-4" />
              <p className="text-sm">
                Note: This application is optimized for desktop computers only
              </p>
            </div>

            <div className="w-full max-w-2xl mb-12 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-start to-primary-end rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative">
                <SearchBar onSearch={onSearch} isLoading={loading} error={error} />
                <button
                  onClick={() => setShowScholarSearch(true)}
                  className="mt-3 text-sm text-gray-600 hover:text-[#E84E10] flex items-center justify-center space-x-2 mx-auto transition-colors group bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-100 hover:border-[#E84E10]/20"
                >
                  <Search className="h-4 w-4 transition-transform group-hover:scale-110" />
                  <span>Search by author name instead</span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all" />
                </button>
              </div>
            </div>

            <div id="metrics" className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Citation,
                  title: "Citation Analytics",
                  description: "Comprehensive impact metrics and citation analysis",
                  features: ["h-index & g-index", "Citation growth trends", "Impact trajectory"],
                  gradient: "from-blue-500 to-indigo-500"
                },
                {
                  icon: Network,
                  title: "Network Analysis",
                  description: "Visualize your research collaborations",
                  features: ["Co-authorship patterns", "Network visualization", "Collaboration trends"],
                  gradient: "from-[#019DD4] to-[#E84E10]"
                },
                {
                  icon: BookOpen,
                  title: "Publication Insights",
                  description: "Deep dive into your research output",
                  features: ["Journal rankings", "Publication patterns", "Citation distribution"],
                  gradient: "from-purple-500 to-pink-500"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="relative group"
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-lg blur opacity-0 group-hover:opacity-25 transition duration-500`} />
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-100 hover:border-transparent transition-all duration-300">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-start to-primary-end rounded-xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.features.map((item, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                          <CheckCircle className={`h-4 w-4 mr-2 ${hoveredFeature === index ? 'text-[#E84E10]' : 'text-gray-400'} transition-colors`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-12 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-start/5 to-primary-end/5" />
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.1) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-primary-start/10 p-8 text-center group hover:border-transparent transition-all duration-300 relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-start to-primary-end rounded-2xl blur opacity-0 group-hover:opacity-25 transition duration-500" />
            <div className="relative">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Zap className="h-6 w-6 text-[#E84E10]" />
                <span className="text-sm font-medium text-gray-600">Ready to get started?</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Analyze Your
                <span className="gradient-text ml-2">Research Impact</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Enter your Google Scholar profile URL below to get instant insights into your academic influence.
              </p>
              
              <div className="max-w-2xl mx-auto">
                <SearchBar onSearch={onSearch} isLoading={loading} />
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-[#019DD4]" />
                  <span>Instant Analysis</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-[#019DD4]" />
                  <span>Visual Insights</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-[#019DD4]" />
                  <span>Free to Use</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ScholarSearchModal 
        isOpen={showScholarSearch} 
        onClose={() => setShowScholarSearch(false)} 
      />
    </main>
  );
}
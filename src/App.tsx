import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { LandingPage } from './components/LandingPage';
import { ProfileView } from './components/ProfileView';
import { PrivacyModal } from './components/PrivacyModal';
import { TermsModal } from './components/TermsModal';
import { fetchScholarProfile } from './utils/scholarApi';
import type { Author } from './types/scholar';

function App() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Author | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleSearch = async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const profileData = await fetchScholarProfile(url);
      setData(profileData);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'An unexpected error occurred while analyzing the profile';
      console.error('Error fetching scholar profile:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setData(null);
    setError(null);
  };

  if (data) {
    return (
      <ProfileView
        data={data}
        loading={loading}
        error={error}
        onSearch={handleSearch}
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col">
      <header className="bg-white/90 backdrop-blur-xl border-b border-primary-start/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-primary-start to-primary-end rounded-xl">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">Scholar Metrics Analyzer</h1>
                <p className="text-sm text-gray-600">Advanced academic analytics</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center">
              <a href="#metrics" className="text-sm gradient-text hover:opacity-80 transition-opacity">Metrics</a>
            </nav>
          </div>
        </div>
      </header>

      <LandingPage onSearch={handleSearch} loading={loading} />

      <footer className="mt-auto border-t border-gray-100 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Scholar Metrics Analyzer. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setShowPrivacy(true)}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setShowTerms(true)}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>

      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
    </div>
  );
}

export default App;
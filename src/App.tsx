import React, { useState, useCallback } from 'react';
import { GraduationCap, Linkedin, Github } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { LandingPage } from './components/LandingPage';
import ProfileView from './components/ProfileView';
import { PrivacyModal } from './components/PrivacyModal';
import { TermsModal } from './components/TermsModal';
import { scholarService } from './services/scholar';
import { ErrorBoundary } from './components/ErrorBoundary';
import type { Author } from './types/scholar';
import packageJson from '../package.json';

const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/in/hellerjonas/',
  github: 'https://github.com/JonasHeller1212'
};

function App() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Author | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleSearch = useCallback(async (url: string) => {
    let timeoutId: number;

    try {
      setLoading(true);
      setError(null);
      setData(null);

      // Set a timeout for the request
      timeoutId = window.setTimeout(() => {
        setLoading(false);
        setError('Request timed out. Please try again.');
      }, 30000);

      // Validate URL format
      const { isValid } = scholarService.validateProfileUrl(url);
      if (!isValid) {
        throw new Error('Invalid Google Scholar URL format. Please enter a valid profile URL.');
      }

      // Fetch profile data
      const profileData = await scholarService.fetchProfile(url);
      if (!profileData) {
        throw new Error('Failed to fetch profile data. Please try again.');
      }

      window.clearTimeout(timeoutId);
      setData(profileData);
    } catch (err) {
      window.clearTimeout(timeoutId);
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'An unexpected error occurred while analyzing the profile';
      console.error('Error fetching scholar profile:', err);
      setError(errorMessage);
    } finally {
      window.clearTimeout(timeoutId);
      setLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  const SocialLinks = () => (
    <div className="flex items-center space-x-4">
      <a
        href={SOCIAL_LINKS.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-blue-600 transition-colors"
        title="LinkedIn Profile"
      >
        <Linkedin className="h-5 w-5" />
      </a>
      <a
        href={SOCIAL_LINKS.github}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-gray-900 transition-colors"
        title="GitHub Profile"
      >
        <Github className="h-5 w-5" />
      </a>
    </div>
  );

  const Header = () => (
    <header className="bg-white/90 backdrop-blur-xl border-b border-primary-start/10 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-primary-start to-primary-end rounded-xl">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold gradient-text">Scholar Metrics Analyzer</h1>
                <span className="text-xs text-gray-400 px-2 py-0.5 bg-gray-100 rounded-full">v{packageJson.version}</span>
              </div>
              <p className="text-sm text-gray-600">Advanced academic analytics</p>
            </div>
          </div>
          <div className="flex items-center space-x-8">
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#metrics" className="text-sm gradient-text hover:opacity-80 transition-opacity">Metrics</a>
            </nav>
            <SocialLinks />
          </div>
        </div>
      </div>
    </header>
  );

  const Footer = () => (
    <footer className="mt-auto border-t border-gray-100 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Scholar Metrics Analyzer. All rights reserved.
          </p>
          <SocialLinks />
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
  );

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col">
        <Header />
        {data ? (
          <ProfileView
            data={data}
            loading={loading}
            error={error}
            onSearch={handleSearch}
            onReset={handleReset}
            socialLinks={<SocialLinks />}
          />
        ) : (
          <LandingPage onSearch={handleSearch} loading={loading} />
        )}
        <Footer />
        <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
        <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
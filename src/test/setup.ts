import '@testing-library/jest-dom';
import { vi } from 'vitest';

// The Supabase client is created at module-import time, so any test that
// transitively imports src/lib/supabase fails on a missing URL before a single
// assertion runs. Placeholder values keep unit tests independent of .env — no
// test may talk to a real project.
vi.stubEnv('VITE_SUPABASE_URL', 'https://test.supabase.co');
vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-anon-key');

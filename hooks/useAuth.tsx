import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import type { Subject, User, UserRole } from '../types';
import {
  authenticateUser,
  loadSupabaseUser,
  registerUser,
  signInWithProvider,
} from '../services/authService';
import type { OAuthProvider } from '../services/authService';
import { hasSupabaseConfig, supabase } from '../lib/supabase';

const SESSION_REQUEST_TIMEOUT_MS = 8000;
const USER_CACHE_KEY = 'novalab:user';

const memoryCache = {
  store: {} as Record<string, string>,
  getItem(key: string) {
    return this.store[key] ?? null;
  },
  setItem(key: string, value: string) {
    this.store[key] = String(value);
  },
  removeItem(key: string) {
    delete this.store[key];
  },
};

const getPersistentStorage = (): Storage | null => {
  try {
    return typeof globalThis !== 'undefined' && 'localStorage' in globalThis && globalThis.localStorage
      ? globalThis.localStorage
      : null;
  } catch {
    return null;
  }
};

const getSessionStorage = (): Storage | null => {
  try {
    return typeof globalThis !== 'undefined' && 'sessionStorage' in globalThis && globalThis.sessionStorage
      ? globalThis.sessionStorage
      : null;
  } catch {
    return null;
  }
};

const readCachedUser = (): string | null => {
  try {
    return getPersistentStorage()?.getItem(USER_CACHE_KEY) ??
      getSessionStorage()?.getItem(USER_CACHE_KEY) ??
      memoryCache.getItem(USER_CACHE_KEY);
  } catch {
    return memoryCache.getItem(USER_CACHE_KEY);
  }
};

const writeCachedUser = (value: string) => {
  try {
    getPersistentStorage()?.setItem(USER_CACHE_KEY, value);
    getSessionStorage()?.setItem(USER_CACHE_KEY, value);
  } catch {
    memoryCache.setItem(USER_CACHE_KEY, value);
    return;
  }
  memoryCache.setItem(USER_CACHE_KEY, value);
};

const clearCachedUser = () => {
  try {
    getPersistentStorage()?.removeItem(USER_CACHE_KEY);
    getSessionStorage()?.removeItem(USER_CACHE_KEY);
  } catch {
    memoryCache.removeItem(USER_CACHE_KEY);
    return;
  }
  memoryCache.removeItem(USER_CACHE_KEY);
};

async function getSessionWithTimeout() {
  if (!supabase) return null;

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<null>((resolve) => {
    timeoutId = setTimeout(() => resolve(null), SESSION_REQUEST_TIMEOUT_MS);
  });

  try {
    const result = await Promise.race([supabase.auth.getSession(), timeout]);
    return result && 'data' in result ? result : null;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithProvider: (provider: OAuthProvider) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole, subjects?: Subject[]) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        if (hasSupabaseConfig && supabase) {
          const sessionResult = await getSessionWithTimeout();
          const session = sessionResult?.data.session;

          if (session?.user) {
            const hydratedUser = await loadSupabaseUser(session.user);
            if (hydratedUser) {
              setUser(hydratedUser);
              writeCachedUser(JSON.stringify(hydratedUser));
            }
          }

          return;
        }

        const cachedUser = readCachedUser();
        if (cachedUser) {
          try {
            setUser(JSON.parse(cachedUser) as User);
          } catch (error) {
            console.error('Failed to parse cached user:', error);
            clearCachedUser();
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    void restoreSession();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const authenticatedUser = await authenticateUser(email, password);
      if (!authenticatedUser) {
        throw new Error('Invalid email or password');
      }

      setUser(authenticatedUser);
      writeCachedUser(JSON.stringify(authenticatedUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, []);

  const loginWithProvider = useCallback(async (provider: OAuthProvider) => {
    try {
      await signInWithProvider(provider);
    } catch (error) {
      console.error('Social sign-in failed:', error);
      throw error;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, role: UserRole, subjects: Subject[] = []) => {
    try {
      const registeredUser = await registerUser(name, email, password, role, subjects);
      setUser(registeredUser);
      writeCachedUser(JSON.stringify(registeredUser));
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    clearCachedUser();

    if (hasSupabaseConfig && supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out failed:', error);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, loginWithProvider, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

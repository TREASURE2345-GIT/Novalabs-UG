const memoryStore = new Map<string, string>();

const memoryStorage: Storage = {
  get length() {
    return memoryStore.size;
  },
  clear: () => {
    memoryStore.clear();
  },
  getItem: (key: string) => memoryStore.get(key) ?? null,
  key: (index: number) => Array.from(memoryStore.keys())[index] ?? null,
  removeItem: (key: string) => {
    memoryStore.delete(key);
  },
  setItem: (key: string, value: string) => {
    memoryStore.set(key, String(value));
  },
};

const resolveStorage = (kind: 'local' | 'session'): Storage => {
  try {
    if (typeof globalThis !== 'undefined') {
      const candidate =
        kind === 'local'
          ? (globalThis as { localStorage?: Storage }).localStorage
          : (globalThis as { sessionStorage?: Storage }).sessionStorage;

      if (candidate) {
        return candidate;
      }
    }
  } catch {
    // Accessing storage can throw in restricted browser contexts (for example
    // private mode or sandboxed iframes). Fall back to in-memory storage.
  }

  return memoryStorage;
};

export const safeStorage = {
  get length() {
    return resolveStorage('local').length;
  },
  clear: () => resolveStorage('local').clear(),
  getItem: (key: string) => resolveStorage('local').getItem(key),
  key: (index: number) => resolveStorage('local').key(index),
  removeItem: (key: string) => resolveStorage('local').removeItem(key),
  setItem: (key: string, value: string) => resolveStorage('local').setItem(key, value),
};

export const safeSessionStorage = {
  get length() {
    return resolveStorage('session').length;
  },
  clear: () => resolveStorage('session').clear(),
  getItem: (key: string) => resolveStorage('session').getItem(key),
  key: (index: number) => resolveStorage('session').key(index),
  removeItem: (key: string) => resolveStorage('session').removeItem(key),
  setItem: (key: string, value: string) => resolveStorage('session').setItem(key, value),
};

export const isStorageAvailable = (): boolean => {
  try {
    const storage = resolveStorage('local');
    const probe = '__novalab_probe__';
    storage.setItem(probe, '1');
    const available = storage.getItem(probe) === '1';
    storage.removeItem(probe);
    return available;
  } catch {
    return false;
  }
};

export { memoryStorage };

export function createLocalStorageMock() {
  let store = {};

  return {
    get length() {
      return Object.keys(store).length;
    },

    clear() {
      store = {};
    },

    getItem(key) {
      return store[key] ?? null;
    },

    removeItem(key) {
      delete store[key];
    },

    setItem(key, value) {
      store[key] = String(value);
    },

    getAllForTesting() {
      return { ...store };
    }
  };
}
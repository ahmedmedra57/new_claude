import { createStore } from './storeUtils';

const useAppStore = createStore('appInfo', (set) => ({
  isLoading: false,

  setIsLoading: (isLoading) => set({ isLoading }),
}));

export default useAppStore;

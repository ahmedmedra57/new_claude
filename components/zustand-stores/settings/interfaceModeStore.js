import { createStore } from '../storeUtils';

const useInterfaceModeStore = createStore('interfaceMode', (set) => ({
  interfaceMode: false,

  setInterfaceMode: (interfaceMode) => set({ interfaceMode }),
}));

export default useInterfaceModeStore;

import { createStore } from '../../storeUtils';

const useAddElementToBankAndSystemIdentificationStore = createStore(
  'addElementToBankAndSystemIdentification',
  (set) => ({
    addElementToBankInfo: [],

    addElementToBank: (element) => set((state) => {
      state.addElementToBankInfo.push(element);
    }),
  })
);

export default useAddElementToBankAndSystemIdentificationStore;

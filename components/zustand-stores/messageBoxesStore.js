import { createStore } from './storeUtils';

const useMessageBoxesStore = createStore('messageBoxes', (set) => ({
  editButton: false,
  applyButton: false,

  setEditMessageBox: (editButton) => set({ editButton }),
  setApplyMessageBox: (applyButton) => set({ applyButton }),
}));

export default useMessageBoxesStore;

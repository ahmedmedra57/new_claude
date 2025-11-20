import { createStore } from '../storeUtils';

const useEditCancelApplyButtonsStore = createStore('editCancelApplyButtons', (set) => ({
  isEdit: false,
  isApply: false,
  isCancel: false,

  resetButtons: () => set({
    isEdit: false,
    isApply: false,
    isCancel: false,
  }),

  setButtonClicked: (buttonKey) => set({ [buttonKey]: true }),
}));

export default useEditCancelApplyButtonsStore;

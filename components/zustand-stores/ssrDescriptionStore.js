import { createStore } from './storeUtils';

const elementsOptions = [];
const partNumberSuggestions = [];

const useSsrDescriptionStore = createStore('ssrDescription', (set) => ({
  partNumberSuggestions,
  elementsOptions,

  addNewElement: (element) => set((state) => {
    state.elementsOptions = [...state.elementsOptions, element];
    state.partNumberSuggestions = [
      ...state.partNumberSuggestions,
      element.partNumber,
    ];
  }),

  addNewElements: (elements) => set((state) => {
    state.elementsOptions = elements.reduce((result, item) => {
      if (
        state.elementsOptions.find((spec) => spec.partNumber === item.partNumber) === undefined
      ) {
        return [item, ...result];
      }
      return result;
    }, state.elementsOptions);

    state.partNumberSuggestions = [
      ...new Set([
        ...state.partNumberSuggestions,
        ...elements.map((element) => element.partNumber),
      ]),
    ];
  }),
}));

export default useSsrDescriptionStore;

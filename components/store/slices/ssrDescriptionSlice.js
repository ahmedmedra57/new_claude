import { createSlice } from '@reduxjs/toolkit';

const elementsOptions = [
  // {
  //   elementName: 'RS-CRIB RAIL HEATER',
  //   partNumber: 'TRSC-7L-2S-A24-P1',
  //   current: 5.9,
  //   wattage: 1400,
  //   voltage: 240,
  //   lengths: 7,
  // },
];

const partNumberSuggestions = [
  // 'TRSC-7L-2S-A24-P1',
];

// This is for admin  TES/ESS-add element to bank
const ssrDescriptionSlice = createSlice({
  name: 'ssrDescription',
  initialState: {
    partNumberSuggestions,
    elementsOptions,
  },
  reducers: {
    handleAddNewElement: (state, action) => {
     
      state.elementsOptions = [...state.elementsOptions, action.payload];
      state.partNumberSuggestions = [
        ...state.partNumberSuggestions,
        action.payload.partNumber,
      ];
    },
    handleAddNewElements: (state, action) => {
      state.elementsOptions = action.payload.reduce((result, item) => {
        if (elementsOptions.find(spec => spec.partNumber === item.partNumber) === undefined) {
          return [item, ...result];
        } else {
          return result;
        }
      }, elementsOptions);
      state.partNumberSuggestions = [...new Set([
        ...state.partNumberSuggestions,
        ...action.payload.map((element) => element.partNumber),
      ])];
    },
  },
});

export default ssrDescriptionSlice;
export const selectDescription = (state) => state.ssrDescription;
export const { handleAddNewElement, handleAddNewElements } = ssrDescriptionSlice.actions;

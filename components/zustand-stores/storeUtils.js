import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';

/**
 * Creates a Zustand store with Immer and DevTools middleware
 * @param {string} name - Store name for DevTools
 * @param {function} storeCreator - Store creator function
 * @returns {function} - Zustand store hook
 */
export const createStore = (name, storeCreator) => {
  return create(
    devtools(
      immer(storeCreator),
      { name }
    )
  );
};

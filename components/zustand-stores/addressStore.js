import { createStore } from './storeUtils';

const useAddressStore = createStore('address', (set) => ({
  ess: {
    'bet-east': { lat: 42.36997, lng: -71.070647 },
    'bet-west': { lat: 42.6401202007634, lng: -71.3167128644639 },
    's.coast': { lat: 42, lng: -71.121607 },
    'n-Mountain': { lat: 41, lng: 70 },
  },
  tgs: {
    'mtl-east': { lat: 42.404989, lng: -71.114076 },
    'mtl-west': { lat: 42.267997, lng: -71.121607 },
  },
  tes: {
    'bet-north': { lat: 41.890592, lng: -70.537424 },
    'bet-south': { lat: 42.576356, lng: -71.165586 },
    'n.coast': { lat: 42.12631, lng: -71.18566 },
  },
}));

export default useAddressStore;

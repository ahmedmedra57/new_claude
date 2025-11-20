import { createStore } from './storeUtils';
import { tabsSrc } from '../../constants';

const useMobileMasterControlStore = createStore('mobileMasterControl', (set) => ({
  selectedSwt: null,
  swtSrc: [
    tabsSrc.ess.src,
    tabsSrc.tgs.src,
    tabsSrc.tes.src,
    tabsSrc.heatingPlatform.inactiveSrc,
  ],
  electricSrc: '/images/bg-electric-initial.png',
  gasSrc: '/images/bg-gas-initial.png',
  isOpenSelectLocation: false,
  isProgramSelected: [false, false, false, false, false, false, false],
  isExpanded: true,
  isReadyToSelectLocation: false,
  isReadyToSelectProgram: false,

  setIsReadyToSelectProgram: (isReadyToSelectProgram) => set({ isReadyToSelectProgram }),

  toggleOpenSelectLocation: () => set((state) => {
    state.isOpenSelectLocation = !state.isOpenSelectLocation;
  }),

  setOpenSelectLocation: (isOpenSelectLocation) => set({ isOpenSelectLocation }),

  toggleExpand: () => set((state) => {
    state.isExpanded = !state.isExpanded;
  }),

  unselectSwitch: () => set({
    selectedSwt: null,
    swtSrc: [
      tabsSrc.ess.src,
      tabsSrc.tgs.src,
      tabsSrc.tes.src,
      tabsSrc.heatingPlatform.inactiveSrc,
    ],
    isProgramSelected: [false, false, false, false, false, false, false],
  }),

  selectSwitch: (switchName, idx) => set((state) => {
    state.isProgramSelected = [false, false, false, false, false, false, false];
    state.gasSrc = '/images/bg-gas-initial.png';
    state.electricSrc = '/images/bg-electric-initial.png';
    state.selectedSwt = switchName;
    state.swtSrc = [
      tabsSrc.ess.src,
      tabsSrc.tgs.src,
      tabsSrc.tes.src,
      tabsSrc.heatingPlatform.inactiveSrc,
    ];
    state.swtSrc[idx] = `/images/sidebar-${switchName}-active.svg`;
  }),

  unselectProgram: () => set({
    isProgramSelected: [false, false, false, false, false, false, false],
    gasSrc: '/images/bg-gas-initial.png',
    electricSrc: '/images/bg-electric-initial.png',
  }),

  selectMobileProgram: (programIdx) => set((state) => {
    state.isProgramSelected = [false, false, false, false, false, false, false];
    state.isProgramSelected[programIdx] = true;

    if (state.selectedSwt === 'tgs') {
      switch (programIdx) {
        case 0:
          state.gasSrc = '/images/bg-gas-instantHeat.png';
          break;
        case 1:
          state.gasSrc = '/images/bg-gas-fanOnly.png';
          break;
        case 2:
          state.gasSrc = '/images/bg-gas-snowSensor.png';
          break;
        case 3:
          state.gasSrc = '/images/bg-gas-heatingSchedule.png';
          break;
        case 4:
          state.gasSrc = '/images/bg-gas-windFactor.png';
          break;
        default:
          state.gasSrc = '/images/bg-gas-initial.png';
          break;
      }
    } else {
      switch (programIdx) {
        case 0:
          state.electricSrc = '/images/bg-electric-instantHeat.png';
          break;
        case 1:
          state.electricSrc = '/images/bg-electric-snowSensor.png';
          break;
        case 2:
          state.electricSrc = '/images/bg-electric-optionalTemp.png';
          break;
        case 3:
          state.electricSrc = '/images/bg-electric-heatingSchedule.png';
          break;
        case 4:
          state.electricSrc = '/images/bg-electric-windFactor.png';
          break;
        default:
          state.electricSrc = '/images/bg-electric-initial.png';
          break;
      }
    }
  }),
}));

export default useMobileMasterControlStore;

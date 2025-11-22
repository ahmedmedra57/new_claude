import { createSlice } from '@reduxjs/toolkit';
import { tabsSrc } from '../../../constants';

const initialState = {
  selectedSwt: null,
  swtSrc: [
    tabsSrc.ess.src,
    tabsSrc.tgs.src,
    tabsSrc.tes.src,
    tabsSrc.heatingPlatform.inactiveSrc,
  ],
  // swtSrc: [
  //   '/images/sidebar-ess.svg',
  //   '/images/sidebar-tgs.svg',
  //   '/images/sidebar-tes.svg',
  //   '/images/sidebar-hp-disabled.svg',
  // ],
  electricSrc: '/images/bg-electric-initial.png',
  gasSrc: '/images/bg-gas-initial.png',
  isOpenSelectLocation: false,
  isProgramSelected: [false, false, false, false, false, false, false],
  isExpanded: true,
  isReadyToSelectLocation: false,
  isReadyToSelectProgram: false,
};

const mobileMasterControlSlice = createSlice({
  name: 'mobileMasterControl',
  initialState,
  reducers: {
    handleIsReadyToSelectProgram: (state, action) => {
      state.isReadyToSelectProgram = action.payload;
    },
    handleOpenSelectLocation: (state, action) => {
      if (action.payload === false) {
        state.isOpenSelectLocation = action.payload;
      } else {
        state.isOpenSelectLocation = !state.isOpenSelectLocation;
      }
    },
    handleExpand: (state) => {
      state.isExpanded = !state.isExpanded;
    },
    handleUnSelectSwitch: (state) => {
      state.selectedSwt = null;
      state.swtSrc = initialState.swtSrc;
      state.isProgramSelected = [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ];
    },
    handleSelectSwitch: (state, action) => {
      const { switchName, idx } = action.payload;
      state.isProgramSelected = [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ];
      state.gasSrc = '/images/bg-gas-initial.png';
      state.electricSrc = '/images/bg-electric-initial.png';

      state.selectedSwt = switchName;

      state.swtSrc = [
        tabsSrc.ess.src,
        tabsSrc.tgs.src,
        tabsSrc.tes.src,
        tabsSrc.heatingPlatform.inactiveSrc,
      ];
      // state.swtSrc = [
      //   '/images/sidebar-ess.svg',
      //   '/images/sidebar-tgs.svg',
      //   '/images/sidebar-tes.svg',
      //   '/images/sidebar-hp-disabled.svg',
      // ];
      state.swtSrc[idx] = `/images/sidebar-${switchName}-active.svg`;

      // switch (switchName) {
      //   case 'ess':
      //     state.swtSrc = [
      //       '/images/sidebar-ess-active.svg',
      //       '/images/sidebar-tgs.svg',
      //       '/images/sidebar-tes.svg',
      //       '/images/sidebar-hp-disabled.svg',
      //     ];
      //     break;

      //   case 'tgs':
      //     state.swtSrc = [
      //       '/images/sidebar-ess.svg',
      //       '/images/sidebar-tgs-active.svg',
      //       '/images/sidebar-tes.svg',
      //       '/images/sidebar-hp-disabled.svg',
      //     ];
      //     break;
      //   case 'tes':
      //     state.swtSrc = [
      //       '/images/sidebar-ess.svg',
      //       '/images/sidebar-tgs.svg',
      //       '/images/sidebar-tes-active.svg',
      //       '/images/sidebar-hp-disabled.svg',
      //     ];
      //     break;
      //   default:
      //     break;
      // }
    },
    handleUnselectProgram: (state) => {
      state.isProgramSelected = [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ];
      state.gasSrc = '/images/bg-gas-initial.png';
      state.electricSrc = '/images/bg-electric-initial.png';
    },
    handleSelectMobileProgram: (state, action) => {
      state.isProgramSelected = [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ];
      state.isProgramSelected[action.payload] = true;
      if (state.selectedSwt === 'tgs') {
        // change gasSrc
        switch (action.payload) {
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
            state.gasSrc = initialState.gasSrc;
            break;
        }
      } else {
        // change electricSrc
        switch (action.payload) {
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
            state.electricSrc = initialState.electricSrc;
            break;
        }
      }
    },
  },
});

export default mobileMasterControlSlice;
export const selectMobileMC = (state) => state.mobileMasterControl;
export const {
  handleSelectSwitch,
  handleExpand,
  handleSelectMobileProgram,
  handleUnselectProgram,
  handleUnSelectSwitch,
  handleOpenSelectLocation,
  handleIsReadyToSelectProgram,
} = mobileMasterControlSlice.actions;

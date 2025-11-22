import { essResetMachinesState } from '../../components/store/slices/essSwitchSlice';
import { tesResetMachinesState } from '../../components/store/slices/tesSwitchSlice';
import { tgsResetMachinesState } from '../../components/store/slices/tgsSwitchSlice';

export const shutOffHandler = (
  dispatch,
  state,
  scope,
  type,
  location,
  machine,
  specificLocation,
  isF,
  zones,
  swt,
  messageBoxHandler
) => {
  console.log({
    specificLocation,
    machine,
    essZones: zones,
    isF},"shutOffHandler");
  if (state === 'on') {
    if (swt === 'ESS') {
      dispatch(
        essResetMachinesState({
          location,
          specificLocation,
          machine,
          essZones: zones,
          isF,
        })
      );
    } else if (swt === 'TGS') {
      tgsResetMachinesState({
        location,
        specificLocation,
        machine,
        tgsZones: zones,
        isF,
      });
    } else if (swt === 'TES') {
      tesResetMachinesState({
        location,
        specificLocation,
        machine,
        tesZones: zones,
        isF,
      });
    }
  } else {
    messageBoxHandler(state, scope, type, 'deactivate');
  }
};

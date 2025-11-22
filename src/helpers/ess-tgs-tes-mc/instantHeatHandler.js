import { handleInstantHeatReady } from '../../components/store/slices/essSwitchSlice';
import { tesHandleInstantHeatIsReady } from '../../components/store/slices/tesSwitchSlice';
import { tgsHandleInstantHeatIsReady } from '../../components/store/slices/tgsSwitchSlice';

export const instantHeatHandler = (
  dispatch,
  state,
  scope,
  temp,
  type,
  location,
  machine,
  specificLocation,
  isF,
  swt,
  messageBoxHandler
) => {
  if (state === 'on') {
    const dispatchData = {
      location,
      specificLocation,
      machine,
      temp,
      isF,
    };
    if (swt === 'ESS') {
      dispatch(handleInstantHeatReady(dispatchData));
    } else if (swt === 'TGS') {
      dispatch(tgsHandleInstantHeatIsReady(dispatchData));
    } else if (swt === 'TES') {
      dispatch(tesHandleInstantHeatIsReady(dispatchData));
    }
  } else {
    messageBoxHandler(
      state,
      scope,
      type,
      'instant heat program',
      specificLocation
    );
  }
};

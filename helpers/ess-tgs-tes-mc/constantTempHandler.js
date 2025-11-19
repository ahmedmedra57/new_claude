import { handleOptionalConstantTempReady } from '../../components/store/slices/essSwitchSlice';
import { tesHandleOptionalConstantTempIsReady } from '../../components/store/slices/tesSwitchSlice';

export const constantTempHandler = (
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
      isF,
      temp,
    };
    if (swt === 'ESS') {
      dispatch(handleOptionalConstantTempReady(dispatchData));
    } else if (swt === 'TES') {
      tesHandleOptionalConstantTempIsReady(dispatchData);
    }
  } else {
    messageBoxHandler(state, scope, type, 'optional constant temp');
  }
};

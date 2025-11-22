import { handleWindFactor } from '../../components/store/slices/essSwitchSlice';
import { tesHandleWindFactor } from '../../components/store/slices/tesSwitchSlice';
import { tgsHandleWindFactor } from '../../components/store/slices/tgsSwitchSlice';

export const windFactorHandler = (
  dispatch,
  state,
  scope,
  type,
  location,
  machine,
  specificLocation,
  swt,
  messageBoxHandler
) => {
  if (state === 'on') {
    const dispatchData = { location, specificLocation, machine };
    if (swt === 'ESS') {
      dispatch(handleWindFactor(dispatchData));
    } else if (swt === 'TGS') {
      tgsHandleWindFactor(dispatchData);
    } else if (swt === 'TES') {
      tesHandleWindFactor(dispatchData);
    }
  } else {
    messageBoxHandler(state, scope, type, 'wind factor program');
  }
};

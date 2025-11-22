import { handleSnowSensor } from '../../components/store/slices/essSwitchSlice';
import { tesHandleSnowSensor } from '../../components/store/slices/tesSwitchSlice';
import { tgsHandleSnowSensor } from '../../components/store/slices/tgsSwitchSlice';

export const snowSensorHandler = (
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
      dispatch(handleSnowSensor(dispatchData));
    } else if (swt === 'TGS') {
      tgsHandleSnowSensor(dispatchData);
    } else if (swt === 'TES') {
      tesHandleSnowSensor(dispatchData);
    }
  } else {
    messageBoxHandler(state, scope, type, 'snow sensor program');
  }
};

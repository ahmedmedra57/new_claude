import { handleAddHeatingSchedule } from '../../components/store/slices/essSwitchSlice';
import { tesHandleAddHeatingSchedule } from '../../components/store/slices/tesSwitchSlice';
import { tgsHandleAddHeatingSchedule } from '../../components/store/slices/tgsSwitchSlice';

export const heatingScheduleHandler = (
  dispatch,
  state,
  scope,
  data,
  type,
  location,
  machine,
  specificLocation,
  swt,
  messageBoxHandler
) => {
  if (state === 'on') {
    const dispatchData = {
      location,
      specificLocation,
      machine,
      start: data.start,
      end: data.end,
      inputTemp: data.inputTemp,
      isF: data.isF,
      index: 0,
    };
    if (swt === 'ESS') {
      dispatch(handleAddHeatingSchedule(dispatchData));
    } else if (swt === 'TGS') {
      tgsHandleAddHeatingSchedule(dispatchData);
    } else if (swt === 'TES') {
      tesHandleAddHeatingSchedule(dispatchData);
    }
  } else {
    messageBoxHandler(state, scope, type, 'heating schedule program');
  }
};

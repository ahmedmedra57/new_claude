import { handleAtsSelection } from '../../components/store/slices/essSwitchSlice';
import { tesHandleAtsSelection } from '../../components/store/slices/tesSwitchSlice';
import { tgsHandleAtsSelection } from '../../components/store/slices/tgsSwitchSlice';

export const atsHandler = (
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
    let EBP = data.indexOf(true);
    if (EBP || EBP === 0) {
      const dispatchData = {
        location,
        specificLocation,
        machine,
        selection: data,
      };
      if (swt === 'ESS') {
        dispatch(handleAtsSelection(dispatchData));
      } else if (swt === 'TGS') {
        tgsHandleAtsSelection(dispatchData);
      } else if (swt === 'TES') {
        tesHandleAtsSelection(dispatchData);
      }
    }
  } else {
    messageBoxHandler(state, scope, type, 'ats');
  }
};

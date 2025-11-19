import { tgsHandleFanOnly } from '../../components/store/slices/tgsSwitchSlice';

export const fanOnlyHandler = (
  dispatch,
  state,
  scope,
  type,
  location,
  machine,
  specificLocation,
  messageBoxHandler
) => {
  if (state === 'on') {
    dispatch(
      tgsHandleFanOnly({ location, specificLocation, machine, state: true })
    );
  } else {
    messageBoxHandler(state, scope, type, 'fan only program');
  }
};

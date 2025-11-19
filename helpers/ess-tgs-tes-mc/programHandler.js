import { atsHandler } from './atsHandler';
import { constantTempHandler } from './constantTempHandler';
import { fanOnlyHandler } from './fanOnlyHandler';
import { heatingScheduleHandler } from './heatingScheduleHandler';
import { instantHeatHandler } from './instantHeatHandler';
import { shutOffHandler } from './shutOffHandler';
import { snowSensorHandler } from './snowSensorHandler';
import { windFactorHandler } from './windFactorHandler';

export const programHandler = (
  dispatch,
  program,
  state,
  scope,
  type,
  temp,
  data,
  location,
  machine,
  specificLocation,
  isF,
  zones,
  swt,
  messageBoxHandler
) => {
  switch (program) {
    case 'instantHeat':
      instantHeatHandler(
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
      );
      break;
    case 'snowSensor':
      snowSensorHandler(
        dispatch,
        state,
        scope,
        type,
        location,
        machine,
        specificLocation,
        swt,
        messageBoxHandler
      );
      break;
    case 'constantTemp':
      constantTempHandler(
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
      );
      break;
    case 'windFactor':
      windFactorHandler(
        dispatch,
        state,
        scope,
        type,
        location,
        machine,
        specificLocation,
        swt,
        messageBoxHandler
      );
      break;
    case 'heatingSchedule':
      heatingScheduleHandler(
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
      );
      break;
    case 'ats':
      atsHandler(
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
      );
      break;
    case 'shutOff':
      shutOffHandler(
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
      );
      break;
    case 'fanOnly':
      fanOnlyHandler(
        dispatch,
        state,
        scope,
        type,
        location,
        machine,
        specificLocation,
        messageBoxHandler
      );
      break;
    default:
      break;
  }
};

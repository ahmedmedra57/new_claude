import {
  getCommandNumberService,
  updateBlowersMasterControlService,
  updateSwitchesMasterControlService,
} from "../../services";
import { convertFahrenheitToCelsius, formatTime } from "../helpers";

export const backendDispatches = (
  MCControlName,
  program,
  machineIds,
  temp,
  data,
  swt,
  isF
) => {
  const isEss = swt === "ESS";
  switch (program) {
    case "instantHeat":
      getCommandNumberService(MCControlName).then((commandNumber) => {
        const updatedData = {
          commandNumber: commandNumber,
          instant_temp: isF ? convertFahrenheitToCelsius(temp) : temp,
          on_switch: 1,
          actionType: MCControlName,
        };
        if (!isEss) {
          updateBlowersMasterControlService(machineIds, swt, updatedData);
        } else {
          updateSwitchesMasterControlService(machineIds, swt, updatedData);
        }
      });
      break;
    case "fanOnly":
      getCommandNumberService(MCControlName).then((commandNumber) => {
        updateBlowersMasterControlService(machineIds, swt, {
          actionType: MCControlName,
          commandNumber: commandNumber,
          fan: 1,
        });
      });
      break;
    case "snowSensor":
      getCommandNumberService(MCControlName).then((commandNumber) => {
        const updatedData = {
          commandNumber: commandNumber,
          snow_enabled: 1,
          actionType: MCControlName,
        };
        if (!isEss) {
          updateBlowersMasterControlService(machineIds, swt, updatedData);
        } else {
          updateSwitchesMasterControlService(machineIds, swt, updatedData);
        }
      });
      break;
    case "constantTemp":
      getCommandNumberService(MCControlName).then((commandNumber) => {
        if (!isEss) {
          updateBlowersMasterControlService(machineIds, swt, {
            commandNumber: commandNumber,
            on_constant: 1,
            constant_temp: temp,
            actionType: MCControlName,
          });
        } else {
          updateSwitchesMasterControlService(machineIds, swt, {
            commandNumber: commandNumber,
            on_constant: 1,
            constant_temp: temp,
            actionType: MCControlName,
          });
        }
      });
      break;
    case "windFactor":
      getCommandNumberService(MCControlName).then((commandNumber) => {
        const updatedData = {
          commandNumber: commandNumber,
          wind: 1,
          actionType: MCControlName,
        };
        if (!isEss) {
          updateBlowersMasterControlService(machineIds, swt, updatedData);
        } else {
          updateSwitchesMasterControlService(machineIds, swt, updatedData);
        }
      });
      break;
    case "heatingSchedule":
      getCommandNumberService(MCControlName).then((commandNumber) => {
        const updatedData = {
          commandNumber: commandNumber,
          actionType: MCControlName,
          schedule: {
            startDate: formatTime(data.start),
            endDate: formatTime(data.end),
            threshold: data.inputTemp,
          },
        };
        if (!isEss) {
          updateBlowersMasterControlService(machineIds, swt, updatedData);
        } else {
          updateSwitchesMasterControlService(machineIds, swt, updatedData);
        }
      });
      break;
    case "ats":
      let EBP = data.indexOf(true);
      if (EBP || EBP === 0) {
        getCommandNumberService(MCControlName).then((commandNumber) => {
          const updatedData = {
            commandNumber: commandNumber,
            EBP: EBP,
            actionType: MCControlName,
          };
          if (!isEss) {
            updateBlowersMasterControlService(machineIds, swt, updatedData);
          } else {
            updateSwitchesMasterControlService(machineIds, swt, updatedData);
          }
        });
      }
      break;
    case "shutOff":
      getCommandNumberService(MCControlName).then((commandNumber) => {
        if (!isEss) {
          updateBlowersMasterControlService(machineIds, swt, {
            commandNumber: commandNumber,
            on_switch: 0,
            fan: 0,
            wind: 0,
            snow_enabled: 0,
            on_constant: 0,
            deleteCurrentSchedule: true,
            actionType: MCControlName,
          });
        } else {
          updateSwitchesMasterControlService(machineIds, swt, {
            commandNumber: commandNumber,
            on_switch: 0,
            on_constant: 0,
            wind: 0,
            on_constant: 0,
            snow_enabled: 0,
            deleteCurrentSchedule: true,
            actionType: MCControlName,
          });
        }
      });
      break;
    default:
      break;
  }
};

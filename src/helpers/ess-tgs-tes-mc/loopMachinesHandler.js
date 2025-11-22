import { backendDispatches } from "./backendDispatches";
import { programHandler } from "./programHandler";

export const loopMachinesHandler = (
  program,
  state,
  scope,
  type,
  temp,
  data,
  isF,
  zones,
  swt,
  switchData,
  dispatch,
  unSelectedIndividualMachineHandler,
  unselectSpecificLocationMachinesHandler,
  handleResetAllSelectBySwitch,
  handleResetAllSelectByLocation,
  messageBoxHandler,
  switchDataE
) => {
  let machineIds = [];
  if (scope === "switch") {

    Object.keys(switchData).forEach((location) => {
      Object.keys(switchData[location]).forEach((el) => {
        if (switchData[location][el]?.deviceMac) {
    

          // no specific location
          if (switchData[location][el].isSelected) {
            machineIds.push(switchData[location][el].deviceMac);
            // unSelect individual machine as false
            if (state === "on") {
              dispatch(
                unSelectedIndividualMachineHandler({ location, machine: el })
              );
            }
            programHandler(
              dispatch,
              program,
              state,
              scope,
              type,
              temp,
              data,
              location,
              el,
              null,
              isF,
              zones,
              swt,
              messageBoxHandler
            );
          }
        } else {

          // with specific location
          Object.keys(switchData[location][el]).forEach((machine) => {
            if (switchData[location][el][machine].isSelected) {
              machineIds.push(switchData[location][el][machine].deviceMac);
              // unSelect individual machine as false
              dispatch(
                unselectSpecificLocationMachinesHandler({
                  location,
                  machine,
                })
              );
              programHandler(
                dispatch,
                program,
                state,
                scope,
                type,
                temp,
                data,
                location,
                machine,
                el,
                isF,
                zones,
                swt,
                messageBoxHandler
              );
            }
          });
        }
      });
    });
    if (machineIds.length !== 0 && state === "on") {
      dispatch(handleResetAllSelectBySwitch());
      backendDispatches(
        "MASTER_CONTROL",
        program,
        machineIds,
        temp,
        data,
        swt,
        isF
      );
    } else {
      messageBoxHandler(state, scope, type, program);
    }
  } else {
    if (switchDataE[scope]?.isSpecificLocation) {
      Object.keys(switchDataE[scope]?.subLocations).forEach((subLocation) => {
        Object.keys(switchData[subLocation]).forEach((el) => {
          // no specific location
          if (switchData[subLocation][el]?.deviceMac) {
            if (switchData[subLocation][el].isSelected) {
              machineIds.push(switchData[subLocation][el].deviceMac);
              // unSelect individual machine as false
              if (state === "on") {
                dispatch(
                  unSelectedIndividualMachineHandler({
                    location: subLocation,
                    machine: el,
                  })
                );
            }
              
              programHandler(
                dispatch,
                program,
                state,
                subLocation,
                type,
                temp,
                data,
                subLocation,
                el,
                null,
                isF,
                zones,
                swt,
                messageBoxHandler
              );
            }
          }
        });
      });
    } else {
      Object.keys(switchData[scope]).forEach((el) => {
        // no specific location
        if (switchData[scope][el]?.deviceMac) {
          if (switchData[scope][el].isSelected) {
            machineIds.push(switchData[scope][el].deviceMac);
            // unSelect individual machine as false
            if (state === "on") {
              dispatch(
                unSelectedIndividualMachineHandler({ location: scope, machine: el })
              );
            }
            programHandler(
              dispatch,
              program,
              state,
              scope,
              type,
              temp,
              data,
              scope,
              el,
              null,
              isF,
              zones,
              swt,
              messageBoxHandler
            );
          }
        }
        // else {
        //   // with specific location

        //   Object.keys(switchData[scope][el]).forEach((machine) => {
        //     if (switchData[scope][el][machine].isSelected) {
        //       machineIds.push(switchData[scope][el][machine].deviceMac);
        //       // unSelect specific location individual machine as false
        //       dispatch(
        //         unselectSpecificLocationMachinesHandler({
        //           location: scope,
        //           machine,
        //         })
        //       );
        //       programHandler(
        //         dispatch,
        //         program,
        //         state,
        //         scope,
        //         type,
        //         temp,
        //         data,
        //         scope,
        //         machine,
        //         el,
        //         isF,
        //         zones,
        //         swt,
        //         messageBoxHandler
        //       );
        //     }
        //   });
        // }
      });
    }

    if (machineIds.length !== 0 && state === "on") {
      dispatch(handleResetAllSelectByLocation());
      backendDispatches(
        "LOCAL_MASTER_CONTROL",
        program,
        machineIds,
        temp,
        data,
        swt,
        isF
      );
    } else {
      messageBoxHandler(state, scope, type, program);
    }
  }
};

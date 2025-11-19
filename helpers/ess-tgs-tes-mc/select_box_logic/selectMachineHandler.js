export const selectMachineHandler = (
  option,
  machine,
  extraOption,
  data,
  selectedMachines
) => {
  // ======= select machine logic =====
  // 4. select individually
  console.log(
    { option, machine, extraOption, data, selectedMachines },
    "selectMachineHandler1"
  );
  const locationIdx = Object.keys(data).indexOf(option);
  const newSelectedMachine = [...selectedMachines];
  // 4.1 update isMachineSelected that has a specific location
  let specLocationIdx;
  let machineIdx;
  if (extraOption) {
    specLocationIdx = Object.keys(data[option].subLocations).indexOf(extraOption);
    machineIdx = Object.keys(data[option].subLocations[extraOption].devices).indexOf(machine);

    newSelectedMachine.push([option, extraOption, machine]);
  } else {
    // 4.2 update isMachineSelected that doesn't have a specific location
    machineIdx = Object.keys(data[option].devices).indexOf(machine);

    newSelectedMachine.push([option, machine]);
  }

  return { locationIdx, specLocationIdx, machineIdx, newSelectedMachine };
};

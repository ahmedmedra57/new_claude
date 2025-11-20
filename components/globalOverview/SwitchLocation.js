import { useEffect, useMemo, useState } from "react";
import { useGlobalOverviewStore, useLocationsStore, useUnitsStore } from '../zustand-stores';
import { justifyContentSpaceBetween, layerA } from "../styles/commonStyles";

import styled from "styled-components";

import IndividualMachine from "./IndividualMachine";
import { calculateTotalEnergyConsumption } from "../../helpers/helpers";
import SwitchSpecificLocation from "./SwitchSpecificLocation";

const SwitchLocation = ({
  location,
  id,
  system,
  mapCenter,
  zoomNum,
  setCenter,
  setZoomNum,
  isExpanded,
  index,
  isSpecificLocationExpanded,
  selectedLocation,setSelectedLocation
}) => {
  const locations = useLocationsStore();
  const { selectedSystem } = useGlobalOverviewStore();
  const [src, setSrc] = useState("/images/IS-arrow.svg");
   
  


  const unitsStatus = useUnitsStore();
  const { isF } = unitsStatus;
  const gas = isF ? "FT³" : "M³";
  const unit = id === "tgs" ? gas : "kw";
  let switchNumber=0;
  if (system[location].isSpecificLocation) {
    Object.keys(system[location].subLocations).forEach((subLocation) => {
     Object.keys(system[location].subLocations[subLocation].devices).forEach((deviceKey) => {
  const device = system[location].subLocations[subLocation].devices[deviceKey];
  const numberofSwitchesinDevice = device.device_name.split("/").length;
  switchNumber += numberofSwitchesinDevice;
});
  }) 
}
else {
    Object.keys(system[location].devices).forEach((deviceKey) => {
  const device = system[location].devices[deviceKey];
  const numberofSwitchesinDevice = device.device_name.split("/").length;
  switchNumber += numberofSwitchesinDevice;
});
     
  }
//   let switchNumber = 0;

// if (system[location].isSpecificLocation) {
//   // لو اللوكيشن فيه subLocations
//   Object.keys(system[location].subLocations || {}).forEach((subLocation) => {
//     const devices = system[location].subLocations[subLocation].devices || {};

//     Object.keys(devices).forEach((deviceKey) => {
//       const device = devices[deviceKey];

//       if (device) {
//         if (device.switch_panels && device.switch_panels.length > 0) {
//           // لو فيه switchpanels نستخدم طولها
//           switchNumber += device.switch_panels.length;
//         } else {
//           // لو مفيش نعتبر عدد السويتشات = 1
//           switchNumber += 1;
//         }
//       }
//     });
//   });
// } else {
//   // لو مفيش subLocations
//   const devices = system[location].devices || {};

//   Object.keys(devices).forEach((deviceKey) => {
//     const device = devices[deviceKey];

//     if (device) {
//       if (device.switch_panels && device.switch_panels.length > 0) {
//         switchNumber += device.switch_panels.length;
//       } else {
//         switchNumber += 1;
//       }
//     }
//   });
// }
    // const previous = usePrevious(isExpand);

  useEffect(() => {
    isExpanded
      ? setSrc("/images/IS-arrow-expanded.svg")
      : setSrc("/images/IS-arrow.svg");
  }, [isExpanded]);

  const handleExpand = () => {
    if (isExpanded) {
      useLocationsStore().openLocation({ swtName: id, index, status: false });
    } else {
      useLocationsStore().openLocation({ swtName: id, index, status: true });
    }
  };

  let isMachineAvailable;
  if (!system[location].isSpecificLocation) {
    isMachineAvailable = Object.values(system[location]?.devices).some(
      (el) => el.machineType
    );
  } else {
    isMachineAvailable = Object.values(system[location]?.subLocations).some(
      (subLocation) =>
        Object.values(subLocation.devices).some((el) => el.machineType);
  }

const hoursOfUsage = useMemo(() => {
  if (!isMachineAvailable) return "--";

  const total = system[location].isSpecificLocation
    ? Object.values(system[location].subLocations).reduce((sum, subLoc) => {
        const subTotal = Object.values(subLoc.devices || {}).reduce(
          (s, device) => s + (device?.hoursOfUsage || 0),
          0
        );
        return sum + subTotal;
      }, 0)
    : Object.values(system[location].devices || {}).reduce(
        (sum, device) => sum + (device?.hoursOfUsage || 0),
        0
      );

  return total === 0 ? "--" : total;
}, [system, location, isMachineAvailable]);

  const reading = useMemo(() => {
    if (isMachineAvailable) {
      let total = 0;
      if (!system[location].isSpecificLocation) {
        Object.keys(system[location].devices).forEach((machine) => {
          total +=
            +calculateTotalEnergyConsumption(
              system[location].devices[machine]?.reading,
              id,
              isF
            ) || 0;
        });
      } else {
        Object.keys(system[location].subLocations).forEach((subLocation) => {
          Object.keys(
            system[location].subLocations[subLocation].devices
          ).forEach((machine) => {
            total +=
              +calculateTotalEnergyConsumption(
                system[location].subLocations[subLocation].devices[machine]
                  ?.reading,
                id,
                isF
              ) || 0;
          });
        });
      }
      return total === 0 ? "--" : total;
    }
  }, [system, location, isMachineAvailable, isF, id]);

  const handleOnClick = () => {
    dispatch(handleSelectDisplaySystem(selectedSystem || "all");
    setCenter(locations[id][location]?.address);
    setZoomNum(17);
    setSelectedLocation(location);
  };
  

   
  return (
    <>
      <Wrapper onClick={handleOnClick}>
        <IconAndLocationWrapper>
          <Icon onClick={handleExpand} src={src} />
          <Info>{locations[id][location].locationName}</Info>
        </IconAndLocationWrapper>
        <Info>{switchNumber} {id === "ess" ? "switches" : "blowers"}</Info>
        <Info>{hoursOfUsage ? hoursOfUsage : "--"} Hrs</Info>
        <Info>
          {reading} {unit}
        </Info>
      </Wrapper>
      {isExpanded &&
        (!system[location].isSpecificLocation
          ? Object.keys(system[location]?.devices).map((machine) => (
              <IndividualMachine
                key={Math.random() * 1000}
                location={location}
                machine={machine}
                swtName={id}
                setCenter={setCenter}
                setZoomNum={setZoomNum}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
              />
            ))
          : Object.keys(system[location]?.subLocations).map(
              (specificLocation, idx) => {
                return (
                  <SwitchSpecificLocation
                    key={Math.random() * 1000}
                    handleOnClick={handleOnClick}
                    switchNumber={
                      Object.keys(system[location]?.subLocations[specificLocation]?.devices || {})
                      .reduce((total, deviceKey) => {
                        const device = system[location].subLocations[specificLocation].devices[deviceKey];
                        const numberOfSwitches = device.device_name.split("/").length;
                        return total + numberOfSwitches;
                      }, 0)
                    }
                    unit={unit}
                    location={location}
                    allSystemLocations={locations}
                    specificLocation={specificLocation}
                    systemType={id}
                    setCenter={setCenter}
                    setZoomNum={setZoomNum}
                    isExpanded={isSpecificLocationExpanded[idx]}
                    system={system}
                    openSpecificLocationIdx={idx}
                    openLocationIdx={index}
                    isF={isF}
                    selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                  />
                );
              }
            ))}
    </>
  );
};
export default SwitchLocation;

const Wrapper = styled.div`
  width: 99.6%;
  min-height: 16px;
  border-radius: 13px;

  border: 1px solid #233a54;

  ${justifyContentSpaceBetween}
  padding: 0 8rem;
  margin-bottom: 2rem;

  :last-child {
    margin-bottom: 0;
  }
  :hover {
    ${layerA}
  }
`;
const IconAndLocationWrapper = styled.div`
  width: 40%;
  display: flex;
  align-items: center;
`;
const Icon = styled.img`
  margin-right: 4rem;
  cursor: pointer;
`;
const Info = styled.span`
  font-size: 8rem;
`;

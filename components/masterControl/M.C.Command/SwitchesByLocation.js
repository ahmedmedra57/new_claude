import { useEffect, useState } from 'react';
import { useESSSwitchStore, useLocationsStore, useMCCommandStore, useMCStore, useTESSwitchStore, useTGSSwitchStore } from '../../zustand-stores';
import styled, { css } from 'styled-components';
import {
  borderBlue,
  flexBoxCenter,
  justifyContentSpaceBetween,
} from '../../styles/commonStyles';
import SingleSwitch from './SingleSwitch';
import { selectEssSwitch } from '../../store/slices/essSwitchSlice';
import { selectTgsSwitch } from '../../store/slices/tgsSwitchSlice';
import { selectTesSwitch } from '../../store/slices/tesSwitchSlice';
import { selectMC } from '../../store/slices/mCSlice';
import { selectMCCommand } from '../../store/slices/mCCommandSlice';
import SpecificLocation from './SpecificLocation';
import testData from '../../../test_data/testData';

function SwitchesByLocation({ selectedSwitches, setSelectedSwitches }) {
  const buttonArrowDown = './images/whiteArrowDown.svg';
  const buttonArrowRight = './images/whiteArrowRight.svg';

  // redux
  const { flatEssSwitch: essState } = useESSSwitchStore();
  const { flatTgsSwitch: tgsState } = useTGSSwitchStore();
  const { flatTesSwitch: tesState } = useTESSwitchStore();
  const mCState = useMCStore();
  const { ess, tgs, tes } = mCState.selectSystem;
  const { commandNumber, isNewCommandCreated } = useMCCommandStore();
  const locations = useLocationsStore();

  // useState
  // toggles the opening and closing of each location
  const [displaySwitches, setDisplaySwitches] = useState([]);
  // toggles the opening and closing of each specific location
  const [displaySpecificLocations, setDisplaySpecificLocations] = useState([]);

  // convert object to array. used in useEffect
  const essData = Object.entries(essState);
  const tgsData = Object.entries(tgsState);
  const tesData = Object.entries(tesState);

  // !!TEST DATA!!

  // const {
  //   testEssLocationsAll,
  //   testEssSwitch,
  //   testTgsLocationsAll,
  //   testTgsSwitch,
  // } = testData(essState, tgsState, locations);

  // const newTestTgsSwitch = Object.entries(testTgsSwitch);
  // const newTestEssSwitch = Object.entries(testEssSwitch);

  // !! END OF TEST!!

  const getSwitchesData = (switchData) => {
    const newArrSwitches = [];
    switchData?.forEach((value) => {
      const newArr = Object.entries(value[1]);

      let names = {};
      let allValues = {};
      newArr?.forEach((el) => {
        const elKey = Object.keys(el[1]);
        const elValue = Object.values(el[1]);

        if (el[1]?.isSelected || elValue.every((el) => el?.isSelected)) {
          //without specific location && every machine selected in this specific location
          allValues = { ...allValues, [el[0]]: el[1] };
          names = { [value[0]]: allValues };
        } else if (elValue.length > 0) {
          // if single machines selected in specific location
          elValue.forEach((newEl, index) => {
            if (newEl?.isSelected) {
              allValues = {
                ...allValues,
                [el[0]]: { ...allValues[el[0]], [elKey[index]]: newEl },
              };

              names = { [value[0]]: allValues };
            }
          });
        }
      });
      newArrSwitches.push(names);
      
      const results = newArrSwitches.filter(
        (element) => Object.keys(element).length !== 0
      );
      setSelectedSwitches(results);

      const displayArr = [];
      if (results?.length > 0) {
        results?.forEach((_) => displayArr.push(false));
        setDisplaySwitches(displayArr);

        // array to display specific locations
        const specificLocationArr = [];
        results.forEach((el, index) => {
          const elValue = Object.values(el);
          if (!elValue[0]?.machineType) {
            elValue.forEach((newEl) => {
              specificLocationArr.push(false);
            });
          }
        });
        setDisplaySpecificLocations(specificLocationArr);
      } else {
        setDisplaySwitches([]);
        setDisplaySpecificLocations([]);
      }
    });
  };

  useEffect(() => {
    if (ess) {
      getSwitchesData(essData);
      // !!TEST DATA!!
      // getSwitchesData(newTestEssSwitch);
    } else if (tgs) {
      getSwitchesData(tgsData);
      // !!TEST DATA!!
      // getSwitchesData(newTestTgsSwitch);
    } else if (tes) {
      getSwitchesData(tesData);
      // let newArrSwitches = [];
      // tesData?.forEach((value) => {
      //   const newArr = Object.entries(value[1]);

      //   let names = {};
      //   let allValues = {};
      //   newArr?.forEach((el) => {
      //     if (el[1].isSelected) {
      //       allValues = { ...allValues, [el[0]]: el[1] };

      //       names = { [value[0]]: allValues };
      //     }
      //   });
      //   newArrSwitches.push(names);

      //   const results = newArrSwitches.filter((element) => {
      //     if (Object.keys(element).length !== 0) {
      //       return true;
      //     }
      //     return false;
      //   });

      //   setSelectedSwitches(results);

      //   const displayArr = {};
      //   if (results.length > 0) {
      //     results?.forEach((value, index) => {
      //       Object.assign(displayArr, {
      //         ...displayArr,
      //         [index]: false,
      //       });
      //     });
      //     setDisplaySwitches(displayArr);
      //   } else {
      //     setDisplaySwitches(false);
      //   }
      // });
    } else {
      setDisplaySwitches([]);
    }
  }, [commandNumber, essState, tgsState, tesState, ess, tgs, tes]);

  // this function is responsible for opening and closing of each locations. upon opening, it will show the selected switches
  const openSwitchesSelections = (index) => {
    if (isNewCommandCreated) {
      let copySwitches = [...displaySwitches];
      if (copySwitches[index] === false) {
        copySwitches[index] = true;
        return setDisplaySwitches(copySwitches);
      } else {
        copySwitches[index] = false;
        return setDisplaySwitches(copySwitches);
      }
    }
  };

  const openSpecificLocationHandler = (index) => {
    const copyDisplaySpecificLocations = [...displaySpecificLocations];
    copyDisplaySpecificLocations[index] = !copyDisplaySpecificLocations[index];
    setDisplaySpecificLocations(copyDisplaySpecificLocations);
  };

  const getApplicationAbrHandler = (switchEl) => {
    const applicationSystem = switchEl?.heatingSystem;
    const applicationAbr = applicationSystem
      ?.replace(/[\d\W]/g, '')
      .match(/[A-Z]/g)
      .join('.');

    const applicationNum = applicationSystem?.match(/\d+/g)[0];
    const application = `${applicationNum} ${applicationAbr}.`;
    return application;
  };

  return (
    <>
      {displaySwitches.length > 0 ? (
        selectedSwitches?.map((value, index) => {
          let locationKey;
          let locationName;
          let specificLocationKey;
          let specificLocationArray = [];

          let switchesData = [];
          let noSpecificLocations;
          for (let objKey in value) {
            locationKey = objKey;
            const value2 = value[objKey];
            for (let objKey2 in value2) {
              const switchData = value2[objKey2];
              if (switchData?.machineType) {
                noSpecificLocations = true;
                switchesData.push(switchData);
              } else {
                switchesData.push(switchData);
                specificLocationKey = objKey2;
                specificLocationArray.push(objKey2);
              }
            }
          }
          let totalSwitches = 0;

          if (noSpecificLocations) {
            locationName = locations.all[locationKey]?.locationName;
            switchesData.forEach((el) => (totalSwitches += 1));
          } else {
            locationName =
              locations.all[locationKey][specificLocationKey]?.locationName;
            switchesData.forEach((specificLocation) =>
              Object.keys(specificLocation).forEach(
                (switchEl) => (totalSwitches += 1)
              )
            );
          }

          {
            /* TODO: !!TEST DATA ESS*/
          }
          {
            /* if (noSpecificLocations) {
            locationName = testEssLocationsAll[locationKey]?.locationName;
            switchesData.forEach((el) => (totalSwitches += 1));
          } else {
            locationName =
              testEssLocationsAll[locationKey][specificLocationKey]
                ?.locationName;
            switchesData.forEach((specificLocation) =>
              Object.keys(specificLocation).forEach(
                (switchEl) => (totalSwitches += 1)
              )
            );
          } */
          }
          {
            /* TODO: !!TEST DATA TGS*/
          }
          {
            /* if (noSpecificLocations) {
            locationName = testTgsLocationsAll[locationKey]?.locationName;
            switchesData.forEach((el) => (totalSwitches += 1));
          } else {
            locationName =
              testTgsLocationsAll[locationKey][specificLocationKey]
                ?.locationName;
            switchesData.forEach((specificLocation) =>
              Object.keys(specificLocation).forEach(
                (switchEl) => (totalSwitches += 1)
              )
            );
          } */
          }

          return (
            <Wrapper key={locationKey}>
              <Wrapper1>
                <Div
                  onClick={() => {
                    openSwitchesSelections(index);
                  }}
                >
                  <Img
                    src={
                      displaySwitches[index]
                        ? buttonArrowDown
                        : buttonArrowRight
                    }
                  />
                  <Location>{locationName}</Location>
                </Div>
                <NbSwitches>{totalSwitches} swt</NbSwitches>
              </Wrapper1>
              {noSpecificLocations
                ? displaySwitches[index] &&
                  switchesData.map((switchEl) => {
                    const application = getApplicationAbrHandler(switchEl);

                    return (
                      <WrapperSingleSwitch key={switchEl.deviceMac}>
                        <SingleSwitch
                          location={locationName}
                          machineName={switchEl?.machineName}
                          application={application}
                        />
                      </WrapperSingleSwitch>
                    );
                  })
                : displaySwitches[index] &&
                  specificLocationArray.map((specificLocation, idx) => {
                    const switchesKeysValues = Object.entries(switchesData[0]);

                    totalSwitches += switchesKeysValues
                      ? switchesKeysValues.length
                      : 0;
                    return (
                      <SpecificLocation
                        specificLocationKey={specificLocationKey}
                        locationName={locationName}
                        specificLocationIdx={idx}
                        specificLocationName={specificLocation}
                        switchesData={switchesKeysValues}
                        displaySpecificLocations={displaySpecificLocations}
                        openSpecificLocationHandler={
                          openSpecificLocationHandler
                        }
                        getApplicationAbrHandler={getApplicationAbrHandler}
                      />
                    );
                  })}

              {/* {displaySwitches[index] && (
                <WrapperSingleSwitch>
                  <SingleSwitch
                    location={locationName}
                    switches={Object.values(value)}
                    displaySwitches={displaySwitches}
                  />
                </WrapperSingleSwitch>
              )} */}
            </Wrapper>
          );
        })
      ) : (
        <Wrapper>
          <Wrapper1>
            <Div>
              <Img src={buttonArrowDown} />
              <Location>------------------</Location>
            </Div>
            <NbSwitches>----------------------</NbSwitches>
          </Wrapper1>
          <WrapperSingleSwitch>
            {new Array(3).fill('').map((_, idx) => {
              return (
                <div key={idx * 741}>
                  <SingleSwitch
                    location={'------------------'}
                    machineName={''}
                    application={'----------------------'}
                  />
                </div>
              );
            })}
          </WrapperSingleSwitch>
          <Wrapper1>
            <Div>
              <Img src={buttonArrowRight} />
              <Location>------------------</Location>
            </Div>
            <NbSwitches>----------------------</NbSwitches>
          </Wrapper1>
          <Wrapper1>
            <Div>
              <Img src={buttonArrowRight} />
              <Location>------------------</Location>
            </Div>
            <NbSwitches>----------------------</NbSwitches>
          </Wrapper1>
        </Wrapper>
      )}
    </>
  );
}

export default SwitchesByLocation;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Wrapper1 = styled.div`
  width: 274px;
  height: 24px;

  ${borderBlue}
  border-radius: 16px;
  opacity: 1;
  ${justifyContentSpaceBetween}
`;

const Div = styled.div`
  width: auto;
  margin-left: 6px;
  ${flexBoxCenter}
`;

const Img = styled.img``;

const Location = styled.p`
  font-size: 8px;
  margin-left: 6px;
  letter-spacing: 0.8px;
  color: #ffffff;
  opacity: 1;
`;

const NbSwitches = styled.p`
  font-size: 8px;
  margin-right: 6px;
  letter-spacing: 0.8px;
  color: #ffffff;
  opacity: 1;
`;

const WrapperSingleSwitch = styled.div`
  width: 100%;
  height: 100%;
`;

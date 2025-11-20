


import { useMediaQuery } from 'react-responsive';
import styled, { css } from 'styled-components';

import SSRInfoContainer from './SSRInfoContainer';
// import SwitchNameSelector from './SwitchNameSelector';
import SSRToggleSWitch from './SSRToggleSwitch';
import SSRSelect from './SSRSelect';
import {
  alignItemsFlexStart,
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentFlexEnd,
  justifyContentSpaceBetween,
} from '../styles/commonStyles';
import SSRInfoCommonContainer from './SSRInfoCommonCopntainer';
import { useState } from 'react';
import { useUnitsStore, useUserStore } from '../zustand-stores';
import { useEffect } from 'react';
import {
  updateBlowerSettingService,
  updateSwitchSettingService,
} from '../../services';
import SwitchNameSelector from './SwitchNameSelector';

const SSRDetail = ({
  swtName,
  data,
  id,
  location,
  machine,
  indivLocationName,
  isUpdating,
  setIsUpdating,
  localActivatedHeaters,
  setLocalActivatedHeaters
}) => {
  const unitsStatus = useUnitsStore();
  const { isF } = unitsStatus;
  const { permissions } = useUserStore();
  const disable = !permissions.WRITE;
  
  const { essSwitch, tesSwitch,flatEssSwitch,flatTesSwitch } = useSelector(
    swtName === 'ess' ? selectEssSwitch : selectTesSwitch
  );
  const switchData = swtName === 'ess' ? flatEssSwitch : flatTesSwitch;
  const switchStatus = switchData[location][machine];

  const { deviceMac, heaterThermocoupleMap, activeThermocouples } = switchStatus;

  const {
    current = 0,
    currentCurrent = 0,
    elementName = '',
    partNumber = '',
    voltage = 0,
    wattage = 0,
    lengths = 0,
  } = data?.specs?.[0] || {};
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });
  const { isSettingOpen, buttonStatus } = data;
  
  const [isOverAmp, setIsOverAmp] = useState(false);
  const [mobileBg, setMobileBg] = useState(null);
  const [SSRSwitchName, setSSRSwitchName] = useState('');

  const disabled = buttonStatus === 'flt' || buttonStatus === 'off';

  // check current amp
  useEffect(() => {
    const maxTemp = data?.specs[0]?.current * 0.2 + data?.specs[0]?.current;
    const minTemp = -data?.specs[0]?.current * 0.2 + data?.specs[0]?.current;

    const check =
      data?.specs[0]?.currentCurrent > maxTemp ||
      data?.specs[0]?.currentCurrent < minTemp;

    check ? setIsOverAmp(true) : setIsOverAmp(false);
  }, [data?.specs[0]]);

  // const mobileBgSrc = buttonStatus ===
  useEffect(() => {
    if (buttonStatus === 'on') {
      if (isOverAmp) {
        setMobileBg('/images/BG-ssr-details-overAmp.svg');
      } else {
        setMobileBg('/images/BG-ssr-details.svg');
      }
    } else if (buttonStatus === 'flt') {
      setMobileBg('/images/BG-ssr-details-flt.svg');
    } else if (buttonStatus === 'off') {
      setMobileBg('/images/BG-ssr-details-off.svg');
    }
  }, [buttonStatus, isOverAmp]);
useEffect(() => {

}, [localActivatedHeaters]);
  const integratedButtonHandler = (data) => {
    switch (data.button) {
      case 'SSRSelect':
        const newHeaterThermocoupleMap = {
          heater_thermocouple_map: heaterThermocoupleMap.map(
            (select, index) => {
              if (index === id - 1) {
                return Number(data.data.slice(-2);
              } else {
                return select;
              }
            }
          ),
        };
        swtName === 'ess'
          ? updateSwitchSettingService(
              [deviceMac],
              newHeaterThermocoupleMap
            ).then(() => {
              dispatch(
                handleSelector({
                  location,
                  machine,
                  id: data.id,
                  data: data.data,
                });
            })
          : updateBlowerSettingService(
              [deviceMac],
              newHeaterThermocoupleMap
            ).then(() => {
              dispatch(
                tesHandleSelector({
                  location,
                  machine,
                  id: data.id,
                  data: data.data,
                });
            });
        break;
      case 'toggle':
        if (isUpdating) return; 
  setIsUpdating(true); 
        const newActivatedHeaters = {
          activated_heaters: localActivatedHeaters.map((value, index) => {
            if (index === id - 1) {
              return Number(data.buttonStatus === 'on' ? 1 : 0);
            } else {
              return value;
            }
          }),
        };
     const serverResponse =
  swtName === 'ess'
    ? updateSwitchSettingService([deviceMac], newActivatedHeaters).then(
        (serverData) => {
        

        
        const isDifferent = serverData[0]?.activated_heaters?.some(
  (val, idx) => val !== newActivatedHeaters.activated_heaters[idx]
) ?? true;
              
              
          if (!isDifferent) {
            dispatch(
              handleToggleSSR({
                location,
                machine,
                id: data.id,
                buttonStatus: data.buttonStatus,
              });
            setLocalActivatedHeaters(serverData[0]?.activated_heaters);
            
            setIsUpdating(false);
          }
        }
      )
    : updateBlowerSettingService([deviceMac], newActivatedHeaters).then(
        (serverData) => {
          

        const isDifferent = serverData[0]?.activated_heaters?.some(
  (val, idx) => val !== newActivatedHeaters.activated_heaters[idx]
) ?? true;


          if (!isDifferent ) {
            dispatch(
              tesHandleToggleSSR({
                location,
                machine,
                id: data.id,
                buttonStatus: data.buttonStatus,
              });
            setIsUpdating(false);
          }
        }
      );


        break;
      default:
        break;
    }
  };

  return (
    <>
      {isMobile ? (
        <Wrapper isMobile={isMobile} imgSrc={mobileBg} isOverAmp={isOverAmp}>
          <ToggleSWitchContainer isMobile={true}>
            <SSRToggleSWitch
              isMobile={true}
              data={data}
              id={id}
              buttonHandler={integratedButtonHandler}
              disabled={disable}
              switch_panels={switchStatus?.switch_panels}
            />
          </ToggleSWitchContainer>

          <SectionContainer isFirst={true}>
            <SSRSelect
              isMobile={true}
              data={data.select}
              status={data.buttonStatus}
              id={id}
              buttonHandler={integratedButtonHandler}
              activeThermocouples={activeThermocouples}
            />
            <SSRInfoCommonContainer
              data={{ t: current, a: currentCurrent }}
              title='current'
              unit='a'
              disabled={disable}
            />
          </SectionContainer>

          <SectionContainer>
            <SSRInfoCommonContainer
              data={wattage}
              title='wattage'
              unit='w'
              disabled={disabled}
            />
            <SSRInfoCommonContainer
              data={voltage}
              title='voltage'
              unit='v'
              disabled={disabled}
            />
            <SSRInfoCommonContainer
              data={lengths}
              title='length'
              unit={'ft'}
              disabled={disabled}
            />
          </SectionContainer>

          <SectionContainer isLast={true}>
            <SSRInfoCommonContainer
              disabled={disabled}
              data={{
                a: `${elementName} - ${partNumber}`,
                b: `${current} a / ${wattage} w / ${voltage} v / ${lengths} ft`,
              }}
              title='description'
              unit={null}
            />
          </SectionContainer>
        </Wrapper>
      ) : (
        <Wrapper>
          <FlexContainer>
            <SSRSelect
              isMobile={false}
              data={data.select}
              status={data.buttonStatus}
              id={id}
              buttonHandler={integratedButtonHandler}
              activeThermocouples={activeThermocouples}
            />

            <ToggleSWitchContainer>
              <SSRToggleSWitch
                isMobile={false}
                data={data}
                id={id}
                buttonHandler={integratedButtonHandler}
                disable={disable}
                switch_panels={switchStatus?.switch_panels}
                isUpdating={isUpdating}
                setIsUpdating={setIsUpdating}
              />
            </ToggleSWitchContainer>

            <SSRInfoContainer
              swtName={swtName}
              data={data}
              id={id}
              location={location}
              machine={machine}
              isSettingOpen={isSettingOpen}
              isOverAmp={isOverAmp}
              SSRSwitchName={SSRSwitchName}
              setSSRSwitchName={setSSRSwitchName}
            />
          </FlexContainer>
          <SwitchNameSelectorWrapper>
            {isSettingOpen && (
              <>
                <SwitchNameSelector
                  data={data}
                  SSRSwitchName={SSRSwitchName}
                  setSSRSwitchName={setSSRSwitchName}
                  ssrId={id - 1}
                  swtName={swtName}
                  location={location}
                  machine={machine}
                />
              </>
            )}
          </SwitchNameSelectorWrapper>
        </Wrapper>
      )}
    </>
  );
};

export default SSRDetail;
const SectionContainer = styled.section`
  width: 100%;
  ${justifyContentSpaceBetween}

  ${(p) =>
    p.isFirst &&
    css`
      ${justifyContentFlexEnd};
    `};

  ${(p) =>
    p.isLast &&
    css`
      ${flexBoxCenter};
    `}
`;

// for desktop
const Wrapper = styled.div`
  ${(p) =>
    p.isMobile
      ? css`
          width: 289px;
          height: 151px;
          background-image: url(${(p) => p.imgSrc});
          margin-bottom: 8px;
          ${flexDirectionColumn};
          padding: 8px 4px 6px 4px;
          position: relative;
        `
      : css`
          width: 100%;

          display: flex;
          flex-direction: column;
          padding: 0 5px;

          margin-bottom: 5px;

          transition: all 200ms ease-in-out;

          /* For the switch name selection box*/
          position: relative;
        `}
`;

const FlexContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-between;

  /* transition: all 200ms ease-in-out; */
`;

const ToggleSWitchContainer = styled.div`
  ${(p) =>
    p.isMobile &&
    css`
      position: absolute;
      top: -10px;
      left: 0px;
    `}
`;

const SwitchNameSelectorWrapper = styled.div`
  position: absolute;
  top: 62px;
  width: 183px;
  height: auto;
  ${alignItemsFlexStart};
  flex-direction: column;
  gap: 6px;
`;

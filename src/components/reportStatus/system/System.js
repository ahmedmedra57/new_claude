import React, { memo, useEffect, useState } from 'react';
import { useMemo } from 'react';
import { useCallback } from 'react';
import styled, { css } from 'styled-components';
import {
  alignItemsFlexStart,
  flexBoxCenter,
  justifyContentFlexStart,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerADark,
  layerB,
  layerC,
  scrollbarY,
} from '../../styles/commonStyles';
import FaultsReport from '../../userMessages/FaultsReport';
import DisplayControllersOverview from './DisplayControllersOverview';
import DisplaySystemControllers from './DisplaySystemControllers';
import ExpandButton from './ExpandButton';
import Switch from './Switch';
import { tabsSrc } from '../../../constants';

const System = ({
  systemIndex,
  switchMachines,
  isFault,
  systemEbp,
  systemGp,
  locationId,
  specificLocationId,
  withSpecificLocations,
}) => {
  const systemIsEnabled =
    Object.values(switchMachines[1]).length > 0 &&
    Object.values(switchMachines[1][0])[0].isSystemEnabled;

  // const systemControllersStatus =
  //   Object.values(switchMachines[1]).length > 0 &&
  //   Object.values(switchMachines[1][0])[0].machineControllersStatus;
  const systemEnergyConsump =
    Object.values(switchMachines[1]).length > 0
      ? Object.values(switchMachines[1][0])[0].systemEnergyConsump.split(' ')
      : ['total energy consumption 0 kw'][0].split(' ');
 
  const systemEnergy =
    Object.values(switchMachines[1]).length > 0
      ? Object.values(switchMachines[1][0])[0].energy_reading
      : 0;
  // const [expandBtnName, setExpandBtnName] = useState([
  //   'expand',
  //   'expand',
  //   'expand',
  // ]);
  const [isExpanded, setIsExpanded] = useState([false, false, false]);
  const [numOfGp, setNumOfGp] = useState(0);
  const [numOfEbp, setNumOfEbp] = useState(0);
  const [displayHoverMessage, setDisplayHoverMessage] = useState(false);
  const [isFaults, setFaults] = useState(false);
  // const {
  //   switchIsExpand,
  //   // switchExpandBtnName,
  //   setSwitchIsExpand,
  //   // setSwitchExpandBtnName,
  // } = useContext(ReportStatusContext);

  const essLogoSrc =
    systemIndex === 0 && isExpanded[0]
      ? tabsSrc.ess.activeSrc
      : tabsSrc.ess.src;
  // const essLogoSrc =
  //   systemIndex === 0 && isExpanded[0]
  //     ? "/images/sidebar-ess-active.svg"
  //     : "/images/sidebar-ess.svg";

  const tgsLogoSrc =
    (systemIndex === 0 && isExpanded[0]) || isExpanded[1]
      ? tabsSrc.tgs.activeSrc
      : tabsSrc.tgs.src;
  // const tgsLogoSrc =
  //   (systemIndex === 0 && isExpanded[0]) || isExpanded[1]
  //     ? '/images/sidebar-tgs-active.svg'
  //     : '/images/sidebar-tgs.svg';

  const tesLogoSrc =
    (systemIndex === 0 && isExpanded[0]) ||
    (systemIndex === 1 && isExpanded[1]) ||
    isExpanded[2]
      ? tabsSrc.tes.activeSrc
      : tabsSrc.tes.src;
  // const tesLogoSrc =
  //   (systemIndex === 0 && isExpanded[0]) ||
  //   (systemIndex === 1 && isExpanded[1]) ||
  //   isExpanded[2]
  //     ? '/images/sidebar-tes-active.svg'
  //     : '/images/sidebar-tes.svg';

  const faultSrc = isFaults ? tabsSrc.faults.redSrc : tabsSrc.faults.src;
  // const faultSrc = isFaults
  //   ? '/images/sidebar-faults-red.svg'
  //   : '/images/sidebar-faults.svg';

  const expandBtnName = isExpanded[systemIndex] ? 'close' : 'expand';

  const swt =
    switchMachines[0] === 'essSwitches'
      ? 'ess'
      : switchMachines[0] === 'tgsSwitches'
      ? 'tgs'
      : 'tes';

  const srcPath =
    switchMachines[0] === 'essSwitches'
      ? essLogoSrc
      : switchMachines[0] === 'tgsSwitches'
      ? tgsLogoSrc
      : tesLogoSrc;

  const locationData = useMemo(() => {
    const result = {};
    switchMachines[1].forEach((machineValue) => {
      const machineId = Object.keys(machineValue)[0];
      const machineData = Object.values(machineValue)[0];
      result[machineId] = machineData;
    });
    return result;
  }, [switchMachines]);

  // calculate the number of machines on Gp and Ebp
  useEffect(() => {
    let totalOfGp = 0;
    let totalOfEbp = 0;
    switchMachines[1].forEach((machineValue) => {
      const powerStates = Object.values(machineValue)[0].gpEbpWifiAlertStatus;
      if (powerStates.isGp) {
        totalOfGp++;
      }
      if (powerStates.isEbp) {
        totalOfEbp++;
      }
    });
    setNumOfEbp(totalOfEbp);
    setNumOfGp(totalOfGp);
  }, [switchMachines[1]]);

  // sets the names of each button
  const handleExpandButton = useCallback(() => {
    if (isExpanded[systemIndex]) {
      const copyExpand = isExpanded;
      copyExpand[systemIndex] = false;

      setIsExpanded([...copyExpand]);

      // const copyName = expandBtnName;
      // copyName[systemIndex] = 'expand';

      // setExpandBtnName([...copyName]);
    } else {
      const copyExpand1 = isExpanded;
      copyExpand1[systemIndex] = true;
      setIsExpanded([...copyExpand1]);
      // const copyName1 = expandBtnName;
      // copyName1[systemIndex] = 'close';
      // setExpandBtnName([...copyName1]);
    }
  }, [isExpanded]);

  // sets the state(boolean) of each button
  // const handleExpandButtonSwitches = useCallback(
  //   (mainIndex, systemIndex, switchIndex) => {
  //     if (switchIsExpand[mainIndex][systemIndex][switchIndex]) {
  //       const copyExpand = switchIsExpand;
  //       copyExpand[mainIndex][systemIndex][switchIndex] = false;

  //       setSwitchIsExpand([...copyExpand]);

  //       // const copyName = switchExpandBtnName;
  //       // copyName[mainIndex][systemIndex][switchIndex] = 'expand';

  //       // setSwitchExpandBtnName([...copyName]);
  //     } else {
  //       const copyExpand1 = switchIsExpand;
  //       copyExpand1[mainIndex][systemIndex][switchIndex] = true;
  //       setSwitchIsExpand([...copyExpand1]);
  //       // const copyName1 = switchExpandBtnName;
  //       // copyName1[mainIndex][systemIndex][switchIndex] = 'close';
  //       // setSwitchExpandBtnName([...copyName1]);
  //     }
  //   },
  //   [switchIsExpand]
  // );

  const displayHoverMessageHandler = () => {
    setDisplayHoverMessage((prev) => !prev);
  };

  return (
    <Wrapper>
      <SystemWrapper>
        <SwitchIconWrapper
          onClick={withSpecificLocations || handleExpandButton}
        >
          <Img src={srcPath} />
        </SwitchIconWrapper>
        <SectionConsumption>
          <ImgWrapper>
            <ConsumptionImg src='./images/RS-machine-energyConsumptionLogoBig.svg' />
          </ImgWrapper>
          <ConsumptionTitle first={true}>
            {systemEnergyConsump[0]}
          </ConsumptionTitle>
          <ConsumptionTitle>{systemEnergyConsump[1]}</ConsumptionTitle>
          <ConsumptionTitle bigFont={true}>
            {systemEnergyConsump[2]}
          </ConsumptionTitle>
          <TitleWrapper>
            <ConsumptionUnit marginLeft={true}>
              {systemEnergy ? systemEnergy : systemEnergyConsump[3]}
            </ConsumptionUnit>
            <ConsumptionUnit>{systemEnergyConsump[4]}</ConsumptionUnit>
          </TitleWrapper>
        </SectionConsumption>

        <SwitchDisplay>
          <DisplayControllersOverview
            machinesCount={switchMachines[1].length}
            machines={switchMachines[1]}
            systemIndex={systemIndex}
            setFaults={setFaults}
          />
          <DisplaySystemControllers
            machines={switchMachines[1]}
            systemEbp={systemEbp}
            systemGp={systemGp}
            swt={swt}
            systemIndex={systemIndex}
            numOfGp={numOfGp}
            numOfEbp={numOfEbp}
          />

          <SwitchIconWrapper fault={isFault && isFault[0][systemIndex]}>
            <Img
              src={faultSrc}
              onMouseEnter={() => displayHoverMessageHandler()}
              onMouseLeave={() => displayHoverMessageHandler()}
              // onMouseEnter={() =>
              //   isFault[0][systemIndex] && displayHoverMessageHandler()
              // }
              // onMouseLeave={() =>
              //   isFault[0][systemIndex] && displayHoverMessageHandler()
              // }
            />
            {displayHoverMessage && (
              <FaultsReport
                isReportStatus={true}
                locationData={{ [locationId]: locationData }}
                specificLocation={specificLocationId}
                swt={swt}
              />
            )}
            {/* <Img
              src={faultSrc}
              onMouseEnter={() =>
                isFault[0][systemIndex] &&
                handleHover(mainIndex, systemIndex, true)
              }
              onMouseLeave={() =>
                isFault[0][systemIndex] &&
                handleHover(mainIndex, systemIndex, false)
              }
            />
            {isHover.length > 0 && isHover[mainIndex][systemIndex] && (
              <FaultsReport
                isReportStatus={true}
                locationData={{ [locationId]: locationData }}
                swt={
                  switchMachines[0] === 'essSwitches'
                    ? 'ess'
                    : switchMachines[0] === 'tgsSwitches'
                    ? 'tgs'
                    : 'tes'
                }
              />
            )} */}
          </SwitchIconWrapper>
        </SwitchDisplay>
        {withSpecificLocations ? (
          <InvisibleBox></InvisibleBox>
        ) : (
          <SectionExpand>
            <ExpandButton
              expandBtnName={expandBtnName}
              handleExpandButton={systemIsEnabled && handleExpandButton}
              index={systemIndex}
              systemIsEnabled={systemIsEnabled}
            />
          </SectionExpand>
        )}
      </SystemWrapper>
      {isExpanded[systemIndex] && (
        <SwitchesWrapper1>
          <SwitchesWrapper2>
            <ScrollbarWrapper>
              <SwitchesWrapper3>
                {switchMachines[1].map((machine, index) => (
                  <Switch
                    key={index}
                    machine={machine}
                    systemIndex={systemIndex}
                    isFaults={isFaults}
                    // switchIndex={index}
                    // mainIndex={mainIndex}
                    // specificLocationIdx={specificLocationIdx}
                    // handleExpandButton={handleExpandButtonSwitches}
                    // switchExpandBtnName={switchExpandBtnName}
                    // switchIsExpand={switchIsExpand}
                  />
                ))}
              </SwitchesWrapper3>
            </ScrollbarWrapper>
          </SwitchesWrapper2>
        </SwitchesWrapper1>
      )}
    </Wrapper>
  );
};

export default memo(System);

const Wrapper = styled.section`
  width: 100%;
  height: 100%;
  /* padding: 5px;

  background: transparent linear-gradient(180deg, #233a54 0%, #060d19 100%) 0%
    0%;
  box-shadow: inset 0px 0.5px 1px #ffffff29, 0px 0px 1px #000000;
  border: 0.5px solid #000000;
  border-radius: 11px 11px 35px 35px; */

  ${flexBoxCenter}
  flex-direction: column;
`;

const SystemWrapper = styled.div`
  width: 1188px;
  min-height: 71px;
  border-radius: 36px;
  /* margin-bottom: 6px;
  &:last-child {
    margin-bottom: 0px;
  } */

  ${layerA180Deg}

  ${justifyContentSpaceBetween};

  padding: 0 5px 0 12px;
`;

const SwitchIconWrapper = styled.button`
  border-radius: 50%;

  width: 50px;
  height: 50px;

  ${({ fault }) =>
    fault
      ? css`
          border: 2px solid #ff0000;
        `
      : css``}

  ${layerC}

  border-radius: 30px;
  position: relative;
  ${flexBoxCenter}
`;

const Img = styled.img``;

const SectionConsumption = styled.section`
  width: 93px;
  margin-right: 6px;
  margin-top: -6px;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
`;

const ImgWrapper = styled.div`
  width: 86%;
  margin-top: 4px;
  text-align: right;
  padding-right: 2px;
`;

const ConsumptionImg = styled.img``;

const ConsumptionTitle = styled.span`
  margin-left: 12px;
  font-size: 7px;
  letter-spacing: 0.4px;
  color: #fcff01;
  ${(p) =>
    p.first &&
    css`
      margin-top: -14px;
    `}

  ${({ bigFont }) =>
    bigFont &&
    css`
      font-size: 8px;
      letter-spacing: 1.2px;
      margin-right: 4px;
    `}
`;
const TitleWrapper = styled.div`
  ${justifyContentFlexStart};
  margin-top: -2px;
`;

const ConsumptionUnit = styled.span`
  ${({ marginLeft }) =>
    marginLeft &&
    css`
      margin-left: 12px;
    `}

  text-transform: capitalize;
  color: #fcff01;
  font-size: 10px;
  letter-spacing: 1.2px;
`;

const SwitchDisplay = styled.div`
  width: 881px;
  height: 58px;
  border-radius: 30px;

  ${layerA};
  ${justifyContentSpaceBetween};
  padding-right: 4px;
`;

const SectionExpand = styled.section`
  margin-right: 14px;
  width: 97px;
  height: 34px;
  border-radius: 27px;
  ${layerB};
  ${flexBoxCenter}
`;

const InvisibleBox = styled.div`
  margin-right: 14px;
  width: 97px;
  height: 34px;
  ${flexBoxCenter}
`;

const SwitchesWrapper1 = styled.div`
  /* width: 1208px; */
  width: 1184px;
  height: auto;
  padding-top: 4px;
  padding-bottom: 4px;
  margin-bottom: 1px;
  margin-top: 8px;

  border-radius: 14px 14px 28px 28px;

  ${layerB};
  ${flexBoxCenter};
`;

const SwitchesWrapper2 = styled.div`
  width: 1174px;
  /* width: 1200px; */
  height: auto;
  padding: 4px;
  border-radius: 10px 10px 24px 24px;
  ${layerA180Deg};
  ${alignItemsFlexStart};
  padding-bottom: 36px;
`;

const ScrollbarWrapper = styled.div`
  width: 1164px;
  /* min-height: 490px; */
  min-height: fit-content;
  max-height: 710px;
  /* padding-bottom: 2px; */
  padding: 4px;
  border-radius: 6px 6px 6px 28px;
  ${layerADark}
  ${flexBoxCenter}
`;

const SwitchesWrapper3 = styled.div`
  width: 100%;
  /* min-height: 482px; */
  min-height: fit-content;
  max-height: 702px;
  border-radius: 6px 6px 6px 28px;

  /* padding-bottom: 2px; */

  /* border-radius: 6px 6px 4px 28px; */
  /* 
  display: flex;
  flex-direction: column; */

  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;

  ${scrollbarY}
`;

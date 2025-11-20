import { memo } from "react";
import { useTESSwitchStore, useUnitsStore } from '../../zustand-stores';
import { selectEssSwitch } from "../../store/slices/essSwitchSlice";
import { selectTgsSwitch } from "../../store/slices/tgsSwitchSlice";
import { selectTesSwitch } from "../../store/slices/tesSwitchSlice";
import styled, { css } from "styled-components";
import {
import { useESSSwitchStore, useTESSwitchStore, useTGSSwitchStore } from '../../zustand-stores';
  alignItemsFlexStart,
  borderC,
  borderDisabled,
  flexBoxCenter,
  fontColorA,
  justifyContentSpaceEvenly,
  layerA,
  layerA180Deg,
  layerADisabled180Deg,
  layerB,
  layerBDisabled,
} from "../../styles/commonStyles";
import ExpandButton from "./ExpandButton";
import RSHeaterStatus from "./RSHeaterStatus";
import { useState, useMemo } from "react";

const Switch = ({
  machine,
  systemIndex,
  isFaults
  // switchIndex,
  // mainIndex,
  // specificLocationIdx,
  // handleExpandButton,
  // switchIsExpand,
}) => {
  // const switchExpandState = switchIsExpand[mainIndex][systemIndex][switchIndex];
  // const buttonName = switchExpandState ? 'close' : 'expand';
  const swtName = useMemo(
    () => Object.values(machine)[0].machineType,
    [machine]
  );
  const {
    essSwitch,
    tgsSwitch,
    tesSwitch,
    flatEssSwitch,
    flatTgsSwitch,
  } = swtName === "ess"
      ? useESSSwitchStore()
      : swtName === "tgs"
      ? useTGSSwitchStore()
      : useTESSwitchStore();
  const {flatTesSwitch} = useTESSwitchStore();
  
  const machineValues = Object.values(machine)[0];
  const switchData =
    machineValues.deviceType === "switches"
      ? flatEssSwitch
      : machineValues.deviceType == "blowers"  && swtName === "ess"
      ? flatTesSwitch
      : flatTgsSwitch;
  let heatingOptions;

  if (switchData[machineValues.zone_id]) {
    heatingOptions = switchData[machineValues.zone_id][machineValues.deviceMac];
  }

  const machineIsEnabled = machineValues.isMachineEnabled;
  const machineIsFault = machineValues.gpEbpWifiAlertStatus.isFault;
  const machineInstantHeatStatus = heatingOptions?.instantHeat;
  const machineSnowSensorStatus =
    heatingOptions?.snowSensor;
  const machineWindFactorStatus =
    heatingOptions?.windFactor;
  const machineHeatingScheduleStatus =
    heatingOptions?.heatingSchedule;
  const machineConstantTemp =
    heatingOptions?.optionalConstantTemp;
  const machineFanOnlyStatus = {
    isActivated: heatingOptions?.fanOnly,
  };
  const energyConsumption = machineValues.totalEnergyConsump.split(" ");
  const machineType = Object.values(machine)[0].machineType;
  const systemEnergy = machineValues.energy_reading;
  const controllersIcons = [
    {
      icon: "./images/logo-instantHeat.svg",
      disabledIcon: "./images/RS-machine-instantHeat-disabled.svg",
      status: machineInstantHeatStatus,
    },
    {
      icon: "./images/logo-snowSensor.svg",
      disabledIcon: "./images/RS-machine-snowSensor-disabled.svg",
      status: machineSnowSensorStatus,
    },
    {
      icon:
        machineType === "tgs"
          ? "./images/tgs-fanOnly.svg"
          : "./images/logo-constantTemp.svg",
      disabledIcon:
        machineType === "tgs"
          ? "./images/logo-fanOnly-disabled.svg"
          : "./images/RS-machine-constantTemp-disabled.svg",
      status:
        machineType === "tgs" ? machineFanOnlyStatus : machineConstantTemp,
    },
    {
      icon: "./images/logo-schedule.svg",
      disabledIcon: "./images/RS-machine-scheduler-disabled.svg",
      status: machineHeatingScheduleStatus,
    },
    {
      icon: "./images/logo-windFactor.svg",
      disabledIcon: "./images/RS-machine-windFactor-disabled.svg",
      status: machineWindFactorStatus,
    },
  ];

  const keyValue = Object.entries(machine)[0];
  const locationTitle = keyValue[1].specificLocationName
    ? keyValue[1].zone_id
    : keyValue[1].location;
  const machineTitle = keyValue[0];
  const combinedName = `${keyValue[1].locationName} - ${keyValue[1].machineName}`;
  // sets the hats of each UOS (format:SVG)
  const hatImg = !machineIsEnabled
    ? combinedName.length < 29
      ? "/images/MC-machine-header1-off.svg"
      : combinedName.length < 46
      ? "/images/MC-machine-header-mediumSize-off.svg"
      : "/images/MC-machine-header-largeSize-off.svg"
    : machineIsFault
    ? combinedName.length < 29
      ? "/images/MC-machine-header1-faults.svg"
      : combinedName.length < 46
      ? "/images/MC-machine-header-mediumSize-faults.svg"
      : "/images/MC-machine-header-largeSize-faults.svg"
    : combinedName.length < 29
    ? "/images/MC-machine-header1.svg"
    : combinedName.length < 46
    ? "/images/MC-machine-header-medium-size.svg"
    : "/images/MC-machine-header-long-size.svg";

  const energyIconPath = machineIsEnabled
    ? "./images/RS-machine-energyConsumptionLogoBig.svg"
    : "./images/RS-machine-energyConsump-disabled.svg";

  const yellowBarIconPath = machineIsEnabled
    ? "./images/RS-machine-energyConsump-small-enabled.svg"
    : "./images/RS-machine-energyConsump-small-disabled.svg";

  const generalStatus = machineIsEnabled && machineValues.gpEbpWifiAlertStatus;

  const gpStatus = heatingOptions?.isGp;

  const gpIconPath = gpStatus
    ? "./images/gp-battery.svg"
    : "./images/battery-none.svg";

  const ebpStatus = heatingOptions?.isEbp;

  const ebpIconPath = ebpStatus
    ? "./images/ebp-battery.svg"
    : "./images/battery-none.svg";

  const wifiIconPath = heatingOptions?.isWifi
    ? "./images/wifi-active.svg"
    : "./images/wifi-none.svg";

  const alertIconPath = machineIsEnabled
    ? isFaults
      ? "./images/fault-sm-active.svg"
      : "./images/fault-sm.svg"
    : "./images/fault-sm-disabled.svg";

  // const expandStateOfSwitches = switchExpandState === true;

  const [switchExpand, setSwitchExpand] = useState(false);
  const buttonName = switchExpand ? "close" : "expand";

  const unitsState = useUnitsStore();
  const { isF } = unitsState;

  const handleExpandButton = () => {
    setSwitchExpand((prev) => !prev);
  };

  return (
    <Wrapper>
      {/* 2 hats on top of machine wrapper */}
      <SvgHatsWrapper>
        <HatTitle titleLength={combinedName.length} img={hatImg}>
          {combinedName}
        </HatTitle>
        <HatAteTitle>ate</HatAteTitle>
      </SvgHatsWrapper>
      {/* machine Wrapper */}
      <SmallWrapper
        enable={machineIsEnabled}
        fault={machineIsFault}
        changeRadius={switchExpand}
        // changeRadius={switchExpandState}
      >
        <FlexColumn padding={switchExpand}>
          <Inset enable={machineIsEnabled}>
            <TotalEnergyWrapper enable={machineIsEnabled}>
              <EnergyIcon src={energyIconPath} />
              <EnergyConsumptionWrapper>
                <TotalEnergy1 enable={machineIsEnabled}>
                  {energyConsumption[0]}
                </TotalEnergy1>
                <TotalEnergy1 enable={machineIsEnabled}>
                  {energyConsumption[1]}
                </TotalEnergy1>
                <TotalEnergy2 enable={machineIsEnabled} isSmallerFont={true}>
                  {energyConsumption[2]}
                </TotalEnergy2>
                <TotalEnergy2 enable={machineIsEnabled}>
                  {systemEnergy
                    ? systemEnergy
                    : energyConsumption[3].concat(energyConsumption[4])}
                </TotalEnergy2>
              </EnergyConsumptionWrapper>
            </TotalEnergyWrapper>
            {/* 6 small data info 'ex: set temp, current temp' */}
            <DisplayDataWrapper>
              {machineValues.data.map((value, index) => {
                return (
                  <DisplayBar key={index} enable={machineIsEnabled}>
                    {value.map((el, idx) => {
                      const [key, value] = Object.entries(el)[0];
                      const temperatureMeasureUnit = isF
                        ? (idx === 0 || idx === 1) && "°f"
                        : (idx === 0 || idx === 1) && "°c";
                      const timeUnit =
                        idx === 2 && index === 0
                          ? "kw/hr"
                          : idx === 2 && index === 1 && "hrs";
                      return (
                        <DisplayBarInset key={key} enable={machineIsEnabled}>
                          <DataDescription enable={machineIsEnabled}>
                            {key}
                          </DataDescription>
                          {idx === 2 && index === 0 && (
                            <img
                              src={yellowBarIconPath}
                              alt="energy consumption icon"
                            />
                          )}
                          <Data enable={machineIsEnabled}>
                            {value ?? "---"}
                          </Data>
                          <DataDescription enable={machineIsEnabled}>
                            {temperatureMeasureUnit}
                            {timeUnit}
                          </DataDescription>
                        </DisplayBarInset>
                      );
                    })}
                  </DisplayBar>
                );
              })}
            </DisplayDataWrapper>
            {/* 5 logos and status. 'ex:constant temp, snow sensor' */}
            <ControllersWrapper enable={machineIsEnabled}>
              {controllersIcons.map(({ icon, status, disabledIcon }, idx) => {
                return (
                  <ControllersAndStatus key={idx} enable={machineIsEnabled}>
                    <ControllersIcons
                      src={machineIsEnabled ? icon : disabledIcon}
                    />
                    <Status status={machineIsEnabled && status}></Status>
                  </ControllersAndStatus>
                );
              })}
            </ControllersWrapper>
            {/* gp, ebp, wifi and alert */}
            <EbpGpWifiAlertWrapper enable={machineIsEnabled}>
              <FlexWrapper>
                <Gp enable={gpStatus}>gp</Gp>
                <ControllersIcons src={gpIconPath} />
              </FlexWrapper>

              <FlexWrapper>
                <Ebp enable={ebpStatus}>ebp</Ebp>
                <ControllersIcons src={ebpIconPath} />
              </FlexWrapper>
              <div>
                <Wifi src={wifiIconPath} />
              </div>
              <div>
                <Alert src={alertIconPath} />
              </div>
            </EbpGpWifiAlertWrapper>
          </Inset>
          {machineType !== "tgs" && (
            <ButtonWrapper enable={machineIsEnabled}>
              <ExpandButton
                expandBtnName={buttonName}
                handleExpandButton={machineIsEnabled && handleExpandButton}
                // switchIndex={switchIndex}
                // mainIndex={mainIndex}
                // systemIndex={systemIndex}
                systemIsEnabled={machineIsEnabled}
              />
            </ButtonWrapper>
          )}
        </FlexColumn>
        {/* shows or hide on click of button above. details info of each machine 'ex:SSR'*/}
        <FlexColumn paddingBottom={switchExpand}>
          {switchExpand && (
            <RSHeaterStatus
              swtName={systemIndex === 0 && "ess"}
              location={locationTitle}
              machine={machineTitle}
              expandBtnName={buttonName}
              handleExpandButton={handleExpandButton}
              // switchIndex={switchIndex}
              // mainIndex={mainIndex}
              // systemIndex={systemIndex}
              machineIsEnabled={machineIsEnabled}
            />
          )}
        </FlexColumn>
      </SmallWrapper>
    </Wrapper>
  );
};

export default memo(Switch);

const Wrapper = styled.div`
  width: auto;
  height: auto;
  /* position: relative; */
`;

const SvgHatsWrapper = styled.div`
  width: auto;
  margin-left: 34px;
  display: flex;
  flex-direction: row;
`;

const HatTitle = styled.div`
  height: 24px;
  width: 370px;
  margin-top: 12px;
  padding-left: 4px;
  padding-top: 4px;
  background: url(${({ img }) => img}) no-repeat;
  text-align: left;
  font-size: 14px;
  letter-spacing: 1.4px;
  color: #ffffff;

  /* !!!!!set width depending on the hat size */
  ${({ titleLength }) =>
    titleLength < 28
      ? css`
          width: 396px;
        `
      : titleLength < 46
      ? css`
          width: 624px;
        `
      : css`
          width: 844px;
        `}
`;

const HatAteTitle = styled.span`
  height: 24px;
  width: 95px;
  margin-top: 12px;

  padding-right: 10px;
  padding-top: 4px;
  background-image: url("./images/reportStatus-hat-ate-disabled.svg");
  text-align: center;
  font-size: 14px;
  letter-spacing: 1.4px;
  color: #ffffff;
`;

const SmallWrapper = styled.div`
  width: 1152px;
  /* width: 1166px; */
  min-height: 62px;
  margin-left: 2px;

  ${({ enable }) =>
    enable
      ? css`
          ${layerA180Deg}
        `
      : css`
          ${layerADisabled180Deg}
        `}

  ${({ fault, enable }) =>
    fault &&
    enable &&
    css`
      border: 1px solid #ff0000;
    `}

  
  border-radius: 31px;
  ${({ changeRadius }) =>
    changeRadius &&
    css`
      border-radius: 26px;
    `}

  opacity: 1;
  ${alignItemsFlexStart}

  flex-direction: column;
`;

const FlexColumn = styled.div`
  ${({ padding, paddingBottom }) =>
    padding
      ? css`
          padding-top: 5px;
          padding-bottom: 5px;
        `
      : paddingBottom &&
        css`
          padding-bottom: 4px;
        `}
  ${flexBoxCenter}
`;

const Inset = styled.div`
  width: 1024px;
  height: 50px;
  margin-left: 7px;

  ${({ enable }) =>
    enable
      ? css`
          ${layerA}

          ${borderC}
        `
      : css`
          ${layerBDisabled}
          /* background: #3b3b3b; */
          ${borderDisabled}
        `}

  border-radius: 25px;
  opacity: 1;
  ${justifyContentSpaceEvenly}
`;

const TotalEnergyWrapper = styled.div`
  width: 181px;
  height: 46px;
  margin-left: -13px;

  ${({ enable }) =>
    enable
      ? css`
          ${layerB}
        `
      : css`
          ${layerBDisabled}/* background: #3b3b3b; */
        `}

  border-radius: 23px 8px 8px 23px;
  opacity: 1;
  ${flexBoxCenter}
`;
const EnergyIcon = styled.img``;

const EnergyConsumptionWrapper = styled.div`
  height: fit-content;
  margin-left: 6px;
  ${alignItemsFlexStart}
  flex-direction: column;
`;

const TotalEnergy1 = styled.span`
  height: 7px;
  text-align: left;
  font-size: 7px;
  letter-spacing: 0.7px;
  ${({ enable }) =>
    enable
      ? css`
          color: #fcff01;
        `
      : css`
          color: #808080;
        `}
`;

const TotalEnergy2 = styled.span`
  height: 10px;
  text-align: center;
  font-size: 10px;
  letter-spacing: 1px;

  ${({ isSmallerFont }) =>
    isSmallerFont &&
    css`
      height: 8px;
      font-size: 8px;
    `}

  ${({ enable }) =>
    enable
      ? css`
          color: #fcff01;
        `
      : css`
          color: #808080;
        `}
  opacity: 1;
`;

const DisplayDataWrapper = styled.div``;

const DisplayBar = styled.div`
  width: 432px;
  height: 19px;

  ${({ enable }) =>
    enable
      ? css`
          background: transparent
            linear-gradient(180deg, #ffd500 0%, #6a4e00 100%);
          box-shadow: inset 0px 1px 2px #ffffff29, 0px 0px 1px #000000;
          border: 0.5px solid #000000;
        `
      : css`
          ${layerADisabled180Deg}
        `};

  border-radius: 14px;
  opacity: 1;
  ${justifyContentSpaceEvenly}
  flex-direction: row;
`;

const DisplayBarInset = styled.div`
  width: 140px;
  height: 13px;

  ${({ enable }) =>
    enable
      ? css`
          background: #d9b600;
          box-shadow: inset 0px 0.5px 2px #000000;
        `
      : css`
          ${layerBDisabled}
        `};

  border-radius: 12px;
  opacity: 1;
  ${justifyContentSpaceEvenly}
`;

const DataDescription = styled.span`
  text-align: center;
  font-size: 7px;
  letter-spacing: 0.7px;
  ${({ enable }) =>
    enable
      ? css`
          ${fontColorA}/* color: #1b2b44; */
        `
      : css`
          color: #808080;
        `}

  opacity: 1;
`;

const Data = styled.span`
  height: 100%;
  text-align: center;
  font-size: 10px;
  letter-spacing: 1.2px;
  ${({ enable }) =>
    enable
      ? css`
          ${fontColorA}/* color: #1b2b44; */
        `
      : css`
          color: #808080;
        `}

  opacity: 1;
`;

const ControllersWrapper = styled.div`
  width: 208px;
  height: 46px;

  ${({ enable }) =>
    enable
      ? css`
          ${layerB}
        `
      : css`
          color: #3b3b3b;
          border: 0.5px solid #232323;
        `}

  border-radius: 25px;
  opacity: 1;
  ${flexBoxCenter}
  gap:4px;
`;

const ControllersAndStatus = styled.span`
  width: fit-content;
  ${flexBoxCenter};
  flex-direction: column;
`;

const ControllersIcons = styled.img`
  width: fit-content;
`;

const Status = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ status }) =>
    status?.isActivated ? css`#95ff45` : status?.isReady ? "#83FFFF" : "#707070"};
  opacity: 1;
`;

const EbpGpWifiAlertWrapper = styled.div`
  width: 140px;
  height: 23px;

  ${({ enable }) =>
    enable
      ? css`
          ${layerB}
        `
      : css`
          color: #3b3b3b;
          border: 0.5px solid #232323;
          box-shadow: inset 0px 0px 3px #000000;
        `}

  border-radius: 24px;
  opacity: 1;
  ${justifyContentSpaceEvenly};
  flex-direction: row;
`;

const FlexWrapper = styled.div`
  width: fit-content;
  ${flexBoxCenter};
  flex-direction: row;
  gap: 4px;
`;

const Gp = styled.p`
  text-align: center;
  font-size: 10px;
  letter-spacing: 0.5px;
  ${({ enable }) =>
    enable
      ? css`
          color: #95ff45;
        `
      : css`
          color: #808080;
        `}

  opacity: 1;
`;

const Ebp = styled.p`
  text-align: center;
  font-size: 10px;
  letter-spacing: 0.5px;
  ${({ enable }) =>
    enable
      ? css`
          color: #ff7800;
        `
      : css`
          color: #808080;
        `}

  opacity: 1;
`;

const Wifi = styled.img``;

const Alert = styled.img``;

const ButtonWrapper = styled.div`
  width: 98px;
  height: 34px;
  margin-left: 10px;
  /* margin-left: 20px; */

  ${({ enable }) =>
    enable
      ? css`
          ${layerB}
        `
      : css`
          ${layerBDisabled}
        `}

  border-radius: 27px;
  opacity: 1;
  ${flexBoxCenter}
`;

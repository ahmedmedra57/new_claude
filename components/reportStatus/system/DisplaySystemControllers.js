import { useEffect, useMemo, useState } from "react";
import { selectEssSwitch } from "../../store/slices/essSwitchSlice";
import { selectTgsSwitch } from "../../store/slices/tgsSwitchSlice";
import { selectTesSwitch } from "../../store/slices/tesSwitchSlice";
import styled, { css } from "styled-components";
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA,
  layerCLighter,
} from "../../styles/commonStyles";

const DisplaySystemControllers = ({
  machines,
  swt,
  systemEbp,
  systemGp,
  systemIndex,
}) => {
  const [totals, setTotals] = useState({});
  const swtName = useMemo(
    () => Object.values(machines[0])[0].machineType,
    [machines]
  );
  const {
    essSwitch,
    tgsSwitch,
    tesSwitch,
    flatEssSwitch,
    flatTgsSwitch,
    flatTesSwitch,
  } = useSelector(
    swt === "ess"
      ? selectEssSwitch
      : swt === "tgs"
      ? selectTgsSwitch
      : selectTesSwitch
  );

  useEffect(() => {
    let instantHeatIsActive = 0;
    let instantHeatIsReady = 0;
    let snowSensorIsActive = 0;
    let windFactoIsActive = 0;
    let heatingScheduleIsActive = 0;
    let constantTempIsActive = 0;
    let snowSensorIsReady = 0;
    let windFactorIsReady = 0;
    let heatingScheduleIsReady = 0;
    let constantTempIsReady = 0;
    let fanOnly = 0;
    let numOfGp = 0;
    let numOfEbp = 0;
    machines.forEach((value) => {
      const machineValue = Object.values(value)[0];
      const switchData =
        swt === "ess"
          ? flatEssSwitch
          : swt === "tgs"
          ? flatTgsSwitch
          : flatTesSwitch;
      let heatingOptions;
      if (switchData[machineValue.zone_id]) {
        heatingOptions =
          switchData[machineValue.zone_id][machineValue.deviceMac];
        
      }
      if (heatingOptions?.isGp) {
        numOfGp = numOfGp + 1;
      }
      if (heatingOptions?.isEbp) {
        numOfEbp = numOfEbp + 1;
      }
      if (heatingOptions?.instantHeat?.isActivated) {
        instantHeatIsActive++;
      }
      if (
        heatingOptions?.instantHeat?.isReady &&
        heatingOptions?.instantHeat?.isActivated === false
      ) {
        instantHeatIsReady++;
      }
      if (heatingOptions?.snowSensor?.isActivated) {
        snowSensorIsActive++;
      }
      if (heatingOptions?.windFactor?.isActivated) {
        windFactoIsActive++;
      }
      if (heatingOptions?.heatingSchedule?.isActivated) {
        heatingScheduleIsActive++;
      }
      if (heatingOptions?.optionalConstantTemp?.isActivated) {
        constantTempIsActive++;
      }

      if (
        heatingOptions?.snowSensor?.isReady &&
        heatingOptions?.snowSensor?.isActivated === false
      ) {
        snowSensorIsReady++;
      }
      if (
        heatingOptions?.windFactor?.isReady &&
        heatingOptions?.windFactor?.isActivated === false
      ) {
        windFactorIsReady++;
      }
      if (
        heatingOptions?.heatingSchedule?.isReady &&
        heatingOptions?.heatingSchedule?.isActivated === false
      ) {
        heatingScheduleIsReady++;
      }
      if (
        heatingOptions?.optionalConstantTemp?.isReady &&
        heatingOptions?.optionalConstantTemp?.isActivated === false
      ) {
        constantTempIsReady++;
      }
      if (heatingOptions?.fanOnly) {
        fanOnly++;
      }
    });

    setTotals({
      instantHeatIsActive,
      snowSensorIsActive,
      windFactoIsActive,
      heatingScheduleIsActive,
      constantTempIsActive,
      instantHeatIsReady,
      snowSensorIsReady,
      windFactorIsReady,
      heatingScheduleIsReady,
      constantTempIsReady,
      fanOnly,
      numOfGp,
      numOfEbp,
    });
    // instantHeatIsActive = 0;
    // instantHeatIsReady = 0;
    // snowSensorIsActive = 0;
    // windFactoIsActive = 0;
    // heatingScheduleIsActive = 0;
    // constantTempIsActive = 0;
    // snowSensorIsReady = 0;
    // windFactorIsReady = 0;
    // heatingScheduleIsReady = 0;
    // constantTempIsReady = 0;
    // fanOnly = 0;
  }, [flatEssSwitch, flatTgsSwitch, flatTesSwitch, machines, swtName]);

  return (
    <Wrapper>
      {/* <SectionController>
        <ControllerWrapper type='a'>
          <Img src='images/logo-instantHeat.svg' />

          <StatusInfoWrapper type={1}>
            <StatusContainer>
              <Indicator type='active'></Indicator>
              <Info>{totals.instantHeatIsActive}</Info>
            </StatusContainer>
            
          </StatusInfoWrapper>
        </ControllerWrapper>
      </SectionController> */}
      {/* instant heat */}
      <SectionController>
        <ControllerWrapper type="a">
          <Img src="images/logo-instantHeat.svg" />

          <StatusInfoWrapper>
            <StatusContainer>
              <Indicator type="active"></Indicator>
              <Info>{totals.instantHeatIsActive}</Info>
            </StatusContainer>
            <StatusContainer>
              <Indicator></Indicator>
              <Info>{totals.instantHeatIsReady}</Info>
            </StatusContainer>
          </StatusInfoWrapper>
        </ControllerWrapper>
      </SectionController>
      {/* fan only */}
      {swtName === "tgs" && (
        <SectionController>
          <ControllerWrapper>
            <Img src="images/tgs-fanOnly.svg" />
            <StatusInfoWrapper type={1}>
              <StatusContainer>
                <Indicator type="active"></Indicator>
                <Info>{totals.fanOnly}</Info>
              </StatusContainer>
            </StatusInfoWrapper>
          </ControllerWrapper>
        </SectionController>
      )}

      {/* snow sensor */}
      <SectionController>
        <ControllerWrapper>
          <Img src="images/logo-snowSensor.svg" />
          <StatusInfoWrapper>
            <StatusContainer>
              <Indicator type="active"></Indicator>
              <Info>{totals.snowSensorIsActive}</Info>
            </StatusContainer>
            <StatusContainer>
              <Indicator></Indicator>
              <Info>{totals.snowSensorIsReady}</Info>
            </StatusContainer>
          </StatusInfoWrapper>
        </ControllerWrapper>
      </SectionController>
      {/* constant temp */}
      {swtName !== "tgs" && (
        <SectionController>
          <ControllerWrapper>
            <Img src="images/logo-constantTemp.svg" />
            <StatusInfoWrapper>
              <StatusContainer>
                <Indicator type="active"></Indicator>
                <Info>{totals.constantTempIsActive}</Info>
              </StatusContainer>
              <StatusContainer>
                <Indicator></Indicator>
                <Info>{totals.constantTempIsReady}</Info>
              </StatusContainer>
            </StatusInfoWrapper>
          </ControllerWrapper>
        </SectionController>
      )}

      {/* <SectionController>
        <ControllerWrapper>
          <Img src='images/logo-constantTemp.svg' />
          <StatusInfoWrapper>
            <StatusContainer>
              <Indicator type='active'></Indicator>
              <Info>{totals.constantTempIsActive}</Info>
            </StatusContainer>
            <StatusContainer>
              <Indicator></Indicator>
              <Info>{totals.constantTempIsReady}</Info>
            </StatusContainer>
          </StatusInfoWrapper>
        </ControllerWrapper>
      </SectionController> */}

      {/* heating schedule */}
      <SectionController>
        <ControllerWrapper>
          <Img src="images/logo-schedule.svg" />
          <StatusInfoWrapper>
            <StatusContainer>
              <Indicator type="active"></Indicator>
              <Info>{totals.heatingScheduleIsActive}</Info>
            </StatusContainer>
            <StatusContainer>
              <Indicator></Indicator>
              <Info>{totals.heatingScheduleIsReady}</Info>
            </StatusContainer>
          </StatusInfoWrapper>
        </ControllerWrapper>
      </SectionController>
      {/* wind factor */}
      <SectionController>
        <ControllerWrapper>
          <Img src="images/logo-windFactor.svg" />
          <StatusInfoWrapper>
            <StatusContainer>
              <Indicator type="active"></Indicator>
              <Info>{totals.windFactoIsActive}</Info>
            </StatusContainer>
            <StatusContainer>
              <Indicator></Indicator>
              <Info>{totals.windFactorIsReady}</Info>
            </StatusContainer>
          </StatusInfoWrapper>
        </ControllerWrapper>
      </SectionController>
      {/* Gp Ebp */}
      <SectionController>
        <ControllerWrapper type="long">
          <StatusInfoWrapper type="long">
            <StatusContainer type="long">
              <StatusTitle
                title="gp"
                state={
                  (machines && systemGp[systemIndex]) || totals.numOfGp > 0
                }
              >
                {totals.numOfGp !== 0 && totals.numOfGp}
                {"  "}gp
              </StatusTitle>
              <Img
                isBattery={true}
                src={
                  machines && systemGp[systemIndex]
                    ? "/images/gp-battery.svg"
                    : "/images/battery-none.svg"
                }
              />
            </StatusContainer>
            <StatusContainer type="long">
              {/* <StatusTitle state={systemEbp[systemIndex]}>ebp</StatusTitle>
              <Img
                src={
                  systemEbp[systemIndex]
                    ? '/images/ebp-battery.svg'
                    : '/images/battery-none.svg'
                }
              /> */}
              <StatusTitle state={systemEbp[systemIndex] || totals.numOfEbp}>
                {totals.numOfEbp !== 0 && totals.numOfEbp}
                {"  "}ebp
              </StatusTitle>
              <Img
                isBattery={true}
                src={
                  systemEbp[systemIndex]
                    ? "/images/ebp-battery.svg"
                    : "/images/battery-none.svg"
                }
              />
            </StatusContainer>
          </StatusInfoWrapper>
        </ControllerWrapper>
      </SectionController>
    </Wrapper>
  );
};

export default DisplaySystemControllers;

const Wrapper = styled.div`
  width: 654px;
  height: 100%;
  ${justifyContentSpaceBetween}
`;
const SectionController = styled.section`
  ${flexBoxCenter}
`;

const ControllerWrapper = styled.div`
  width: 96px;
  height: 38px;
  border-radius: 8px;

  ${layerCLighter};
  ${justifyContentSpaceBetween};

  ${(p) =>
    p.type === "a" &&
    css`
      border-radius: 20px 8px 8px 20px;
    `}

  padding-left:4px;

  ${(p) =>
    p.type === "long" &&
    css`
      padding: 0;
    `}
`;

const Img = styled.img`
  height: 100%;
  ${({ isBattery }) =>
    isBattery &&
    css`
      height: 70%;
    `}
`;

const StatusInfoWrapper = styled.div`
  height: 100%;
  width: 50%;

  ${flexDirectionColumn};
  padding: 3px 0;

  ${(p) =>
    p.type === 1 &&
    css`
      padding: 0;
      justify-content: center;
    `}
  ${(p) =>
    p.type === "long" &&
    css`
      width: 100%;
    `}
`;

const StatusContainer = styled.div`
  width: 40px;
  height: 12px;
  border-radius: 6px;
  ${layerA};
  ${justifyContentSpaceBetween};

  ${(p) =>
    p.type === "long" &&
    css`
      width: 92px;
      padding: 0 4px;
    `}
`;
const Indicator = styled.div`
  width: 10px;
  height: 10px;
  margin-left: 1px;
  border-radius: 50%;

  ${(p) =>
    p.type === "active"
      ? css`
          background: #95ff45;
        `
      : css`
          background: #82ffff;
        `}
`;

const Info = styled.span`
  margin-right: 2px;
  font-size: 10px;
  letter-spacing: 1.1px;
`;

const StatusTitle = styled.span`
  font-size: 10px;

  ${(p) =>
    p.title === "gp"
      ? css`
          color: #95ff45;
        `
      : css`
          color: #ff7800;
        `}

  ${(p) =>
    p.state ||
    css`
      color: #808080;
    `}
`;

import { sum } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useTESSwitchStore } from '../../zustand-stores';
import { selectEssSwitch } from "../../store/slices/essSwitchSlice";
import { selectTgsSwitch } from "../../store/slices/tgsSwitchSlice";
import { selectTesSwitch } from "../../store/slices/tesSwitchSlice";
import styled, { css } from "styled-components";
import {
  justifyContentFlexStart,
  justifyContentSpaceBetween,
} from "../../styles/commonStyles";

const DisplayControllersOverview = ({ machinesCount, machines, setFaults }) => {
  let [totals, setTotals] = useState({});
  const swtName = useMemo(
    () => Object.values(machines[0])[0].machineType,
    [machines]
  );
  const { essSwitch, tgsSwitch, tesSwitch, flatEssSwitch, flatTgsSwitch } =
    useSelector(
      swtName === "ess"
        ? selectEssSwitch
        : swtName === "tgs"
        ? selectTgsSwitch
        : selectTesSwitch
    );
  const { flatTesSwitch } = useTESSwitchStore();

  useEffect(() => {
    let totalIsDisabled = 0;
    let totalIsFaults = 0;
    let totalIsActive = 0;
    let totalIsReady = 0;
    machines.forEach((value) => {
      const machineValue = Object.values(value)[0];
      const switchData =
        machineValue.deviceType === "switches"
          ? flatEssSwitch
          : machineValue.deviceType == "blowers" && swtName === "ess"
          ? flatTesSwitch
          : flatTgsSwitch;
      let heatingOptions;
      if (switchData[machineValue.zone_id]) {
        heatingOptions =
          switchData[machineValue.zone_id][machineValue.deviceMac];
        const isFaults = Object.keys(switchData[machineValue.zone_id]).some(
          (machine) => {
            return switchData[machineValue.zone_id][machine].isFaults === true;
          }
        );
       

        setFaults(isFaults);
      }
      if (machineValue.isMachineEnabled === false) {
        totalIsDisabled++;
      }
      if (machineValue.isFault) {
        totalIsFaults++;
      }
      if (
        heatingOptions?.instantHeat?.isActivated ||
        heatingOptions?.snowSensor?.isActivated ||
        heatingOptions?.windFactor?.isActivated ||
        heatingOptions?.heatingSchedule?.isActivated ||
        heatingOptions?.optionalConstantTemp?.isActivated ||
        heatingOptions?.fanOnly
      ) {
        const total = sum(
          Object.values(heatingOptions)
            .filter((el) => el)
            .map((el) => el.isActivated)
        );
        totalIsActive += heatingOptions?.fanOnly ? total + 1 : total;
      }
      if (
        (heatingOptions?.instantHeat?.isReady &&
          heatingOptions?.instantHeat?.isActivated === false) ||
        (heatingOptions?.snowSensor?.isReady &&
          heatingOptions?.snowSensor?.isActivated === false) ||
        (heatingOptions?.windFactor?.isReady &&
          heatingOptions?.windFactor?.isActivated === false) ||
        (heatingOptions?.heatingSchedule?.isReady &&
          heatingOptions?.heatingSchedule?.isActivated === false) ||
        (heatingOptions?.optionalConstantTemp?.isReady &&
          heatingOptions?.optionalConstantTemp?.isActivated === false)
      ) {
        totalIsReady += sum(
          Object.values(heatingOptions)
            .filter((el) => el)
            .map((el) => el.isReady)
        );
      }
    });
    setTotals({ totalIsDisabled, totalIsFaults, totalIsActive, totalIsReady });

    // totalIsDisabled = 0;
    // totalIsFaults = 0;
    // totalIsActive = 0;
    // totalIsReady = 0;
  }, [flatEssSwitch, flatTgsSwitch, flatTesSwitch, machines, swtName]);

  // const checkMachinesFaultsDisabled =
  //   machinesCount === totals.totalIsFaults ||
  //   machinesCount === totals.totalIsDisabled ||
  //   machinesCount === totals.totalIsFaults + totals.totalIsDisabled;

  return (
    <Wrapper>
      <Switches>{machinesCount}</Switches>
      <IndicatorGroupWrapper>
        {/* # of controllers activated  */}
        <IndicatorWrapper>
          <Indicator id={0}></Indicator>
          <SwitchStatus>{totals.totalIsActive}</SwitchStatus>
        </IndicatorWrapper>

        {/* # of controllers isReady  */}
        <IndicatorWrapper>
          <Indicator id={1}></Indicator>
          <SwitchStatus>{totals.totalIsReady}</SwitchStatus>
        </IndicatorWrapper>

        {/* # of switches not in use                    */}
        <IndicatorWrapper>
          <Indicator id={2}></Indicator>
          <SwitchStatus>{totals.totalIsDisabled}</SwitchStatus>
        </IndicatorWrapper>

        {/* # of switches with faults */}
        <IndicatorWrapper>
          <Indicator id={3}></Indicator>
          <SwitchStatus>{totals.totalIsFaults}</SwitchStatus>
        </IndicatorWrapper>
      </IndicatorGroupWrapper>
    </Wrapper>
  );
};

export default DisplayControllersOverview;

const Wrapper = styled.div`
  height: 100%;
  width: 140px;

  ${justifyContentSpaceBetween};
  padding: 0 20px 0 30px;
`;
const Switches = styled.div`
  width: 25px;
  height: 37px;

  font-size: 30px;
  letter-spacing: 1.5px;
`;
const IndicatorGroupWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-evenly;
`;
const IndicatorWrapper = styled.div`
  ${justifyContentFlexStart}
`;

const Indicator = styled.div`
  width: 9px;
  height: 9px;
  margin-right: 6px;

  border-radius: 50%;
  ${(p) =>
    p.id === 0 &&
    css`
      background-color: #95ff45;
    `}
  ${(p) =>
    p.id === 1 &&
    css`
      background-color: #82ffff;
    `}
    ${(p) =>
    p.id === 2 &&
    css`
      background-color: #969696;
    `}
    ${(p) =>
    p.id === 3 &&
    css`
      background-color: #ff0000;
    `}
`;

const SwitchStatus = styled.span`
  font-size: 10px;
  letter-spacing: 0.8px;
`;

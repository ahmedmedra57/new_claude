import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { selectEssSwitch } from '../../store/slices/essSwitchSlice';
import { selectTesSwitch } from '../../store/slices/tesSwitchSlice';
import { selectTgsSwitch } from '../../store/slices/tgsSwitchSlice';
import {
  flexBoxCenter,
  justifyContentSpaceBetween,
  layerA180Deg,
  layerA,
  layerADark,
} from '../../styles/commonStyles';

import DisplayBox from './DisplayBox';
import { selectUnits } from '../../store/slices/settings/unitsSlice';
import { useMemo } from 'react';
import { useUnitsStore } from '../../zustand-stores';
import { convertCelsiusToFahrenheit } from '../../../helpers/helpers';

const DetailDisplayBoxWrapper = ({ swtName, location, machine }) => {
  const unitsStatus = useUnitsStore();
  const { isF } = unitsStatus;
  const { essSwitch, tgsSwitch,flatTgsSwitch, tesSwitch,flatEssSwitch,flatTesSwitch } = useSelector(
    swtName === 'ess'
      ? selectEssSwitch
      : swtName === 'tgs'
      ? selectTgsSwitch
      : selectTesSwitch
  );

  const switchStatus = swtName === 'ess' ? flatEssSwitch : swtName === 'tgs' ? flatTgsSwitch : flatTesSwitch;

  const deviceData = switchStatus[location][machine];

  const instantHeatReady = useMemo(() => {
    return deviceData.instantHeat.isReady;
  }, [deviceData.instantHeat.isReady]);

  const optionalConstantReady = useMemo(() => {
    return deviceData.optionalConstantTemp.isReady;
  }, [deviceData.optionalConstantTemp.isReady]);

  const heatingScheduleActivated = useMemo(() => {
    return deviceData.heatingSchedule.isActivated;
  }, [deviceData.heatingSchedule.isActivated]);

  const snowSensorReady = useMemo(() => {
    return deviceData.snowSensor.isReady;
  }, [deviceData.snowSensor.isReady]);

  const snowSensorActivated = useMemo(() => {
    return deviceData.snowSensor.isActivated;
  }, [deviceData.snowSensor.isActivated]);

  const windFactorReady = useMemo(() => {
    return deviceData.windFactor.isReady;
  }, [deviceData.windFactor.isReady]);

  const windFactorActivated = useMemo(() => {
    return deviceData.windFactor.isActivated;
  }, [deviceData.windFactor.isActivated]);

  const consumption = useMemo(() => {
    const consumption = swtName === 'tgs' ?
      (instantHeatReady || heatingScheduleActivated || (snowSensorReady && snowSensorActivated) || (windFactorReady && windFactorActivated)) ?
        Math.round((isF ? deviceData.consumption : deviceData.consumption * 0.0283168) * 10) / 10
        : '--'
      : (instantHeatReady || optionalConstantReady || heatingScheduleActivated || (snowSensorReady && snowSensorActivated) || (windFactorReady && windFactorActivated)) ?
        Math.round(deviceData.consumption * 10) / 10
        : '--';
    return consumption;
  }, [
    instantHeatReady,
    optionalConstantReady,
    heatingScheduleActivated,
    snowSensorReady,
    snowSensorActivated,
    windFactorReady,
    windFactorActivated,
    isF,
    deviceData.consumption
  ]);

  const enclosureTemp = useMemo(() => {
    const enclosureTemp = isF ? convertCelsiusToFahrenheit(deviceData.enclosureTemp) : deviceData.enclosureTemp;
    return enclosureTemp ?? '--';
  }, [isF, deviceData.enclosureTemp]);

  const outSideTemp = useMemo(() => {
    const outSideTemp = isF ? convertCelsiusToFahrenheit(deviceData.outSideTemp) : deviceData.outSideTemp;
    return outSideTemp ?? '--';
  }, [isF, deviceData.outSideTemp]);

  const hoursOfUsage = useMemo(() => {
    return deviceData.hoursOfUsage ?? '--';
  }, [deviceData.hoursOfUsage]);

  return (
    <Wrapper>
      <Hole>
        <Top>
          <DisplayBox
            title={swtName !== 'tgs' ? 'energy consumption' : 'gas consumption'}
            data={consumption}
            unit={swtName === 'tgs'?(isF ? 'FT³/H' : 'M³/H'):'KW/H'}
            size='sm'
          />
          <DisplayBox
            title={'enclosure temperature'}
            data={enclosureTemp}
            unit={isF ? '°F' : '°C'}
            size='sm'
          />
          <DisplayBox
            title={'outside temperature'}
            data={outSideTemp}
            unit={isF ? '°F' : '°C'}
            size='sm'
          />
          <DisplayBox
            title={'hours of usage'}
            data={hoursOfUsage}
            unit='hrs'
            size='sm'
          />
        </Top>
      </Hole>
    </Wrapper>
  );
};

export default DetailDisplayBoxWrapper;

const Wrapper = styled.div`
  width: 742px;
  height: 68px;
  border-radius: 8px;

  ${layerADark}
  ${flexBoxCenter}
`;
const Hole = styled.div`
  width: 738px;
  height: 64px;
  border-radius: 6px;
  ${layerA180Deg}
  ${flexBoxCenter}
`;
const Top = styled.div`
  width: 729px;
  height: 54px;
  border-radius: 8px;

  ${layerA}
  ${justifyContentSpaceBetween}

  padding: 0 3px;
`;

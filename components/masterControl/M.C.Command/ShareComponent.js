import {
import { useSelectedMachinesStore } from '../zustand-stores';
  handleCommandNumber,
  selectMCCommand,
} from '../../store/slices/mCCommandSlice';
import AllSwitches from './AllSwitches';
import SelectAutomaticTransferSys from './SelectAutomaticTransferSys';
import SelectedSystem from './SelectedSystem';
import UserProfile from './UserProfile';
import { selectedMachinesState } from '../../store/slices/selectedMachinesSlice';
import { selectMC } from '../../store/slices/mCSlice';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useMCCommandStore, useMCStore, useUnitsStore, useUserStore } from '../../zustand-stores';
import { getTitle } from '../../../helpers/helpers';
import { getCommandNumberService } from '../../../services/auditTrail.service';
function ShareComponent({ selectedSwitches, setSelectedSwitches }) {
    // moment library
  const date = moment().format('DDMMYY');

  // !backend: find the user by filtering the userId and grab the index of the obj in the array

  // all ATS options in array
  const EssAtsMessages = [
    'reactivates ess when powered by ebp (emergency backup power)',
    'block and  do not allow ess to operate when on  ebp (emergency backup power',
  ];
  const TgsAtsMessages = [
    'reactivate tgs (typhoon gas power heating system) when on ebp (emergency backup power)',
    'block and do not allow tgs to operate when on ebp (emergency backup power)',
  ];

  const TesAtsMessages = [
    'switch to tgs (typhoon gas power heating system) when on ebp (emergency backup power)',
    'reactivate tes when powered by ebp (emergency backup power)',
    'tes to remain off when powered by ebp (emergency backup power)',
  ];

  // redux
  const selectedMachines = useSelectedMachinesStore();
  const mCCommandState = useMCCommandStore();
  const mCState = useMCStore();
  const UserState = useUserStore();
  const { isF } = useUnitsStore();
  const { tgs, hp } = mCState.selectSystem;
  const number = mCCommandState.commandNumber;
  const { commandDate, commandsInfo } = mCCommandState;
  const instantHeatTempTemp = selectedMachines.instantHeat.temp;
  const instantHeatTempState = selectedMachines.instantHeat.ready;
  const { ready, defaultTemp } = selectedMachines.snowSensor;
  const constantTempState = selectedMachines.optionalConstantTemp.ready;
  const constantTempTemp = selectedMachines.optionalConstantTemp.temp;
  const { swt, selections } = selectedMachines.atsState;
  const heatingScheduleState = selectedMachines.heatingSchedule.ready;
  const heatingScheduleTemp = selectedMachines.heatingScheduleList[0].inputTemp;
  const scheduleDates = selectedMachines.heatingScheduleList[0];
  const isWindFactorState = selectedMachines.windFactor.ready;
  const fanOnly = selectedMachines.isFanOnly;
  const {
    isFanOnly,
    heatingSchedule,
    instantHeat,
    optionalConstantTemp,
    snowSensor,
    windFactor,
  } = selectedMachines.mCOff;
  const { user } = UserState;

  // useState
  const [selectedAtsMessage, setSelectedAtsMessage] = useState(null);

  useEffect(() => {
    getCommandNumberService('GLOBAL_MASTER_CONTROL').then((res) => {
      dispatch(handleCommandNumber(res);
    });
  }, [swt, mCState.selectSystem]);

  useEffect(() => {
    let idx = null;
    switch (swt) {
      case 'ess':
        idx = selections.indexOf(true);

        setSelectedAtsMessage(EssAtsMessages[idx]);
        break;
      case 'tgs':
        idx = selections.indexOf(true);
        setSelectedAtsMessage(TgsAtsMessages[idx]);
        break;
      case 'tes':
        idx = selections.indexOf(true);
        setSelectedAtsMessage(TesAtsMessages[idx]);
        break;
      default:
        break;
    }

    return () => {
      setSelectedAtsMessage('');
    };
  }, [swt, selections, mCState.selectSystem]);

  const instantHeatProp = instantHeatTempState
    ? 'active' + ' ' + instantHeatTempTemp
    : instantHeat
    ? 'off'
    : '------';

  const snowSensorProp = ready
    ? 'ready' + ' ' + defaultTemp
    : snowSensor
    ? 'off'
    : '------';

  const constantTempProp = constantTempState
    ? 'active' + ' ' + constantTempTemp
    : optionalConstantTemp
    ? 'off'
    : '------';

  // const heatingScheduleProp =
  //   heatingScheduleState !== 0
  //     ? 'ready' + ' ' + heatingScheduleState
  //     : heatingSchedule
  //     ? 'off'
  //     : '------';

  const heatingScheduleProp = heatingScheduleState
    ? 'ready' + ' ' + heatingScheduleTemp
    : heatingSchedule
    ? 'off'
    : '------';

  const windFactorProp = isWindFactorState
    ? 'ready'
    : windFactor
    ? 'off'
    : '------';

  const fanOnlyProp = fanOnly ? 'active' : isFanOnly ? 'off' : '------';

  return (
    <>
      <UserProfile
        avatar={user.avatar}
        nickName={user.user_id}
        honorificTitle={getTitle(user.gender)}
        name={`${user.firstname} ${user.lastname}`}
        workTitle={user.title}
        commandReference={`mca-${user.user_code}-${date}-${
          number < 10 ? `${'0' + number} ` : number
        }`}
      />
      <SelectedSystem />
      <AllSwitches
        selectedSwitches={selectedSwitches}
        setSelectedSwitches={setSelectedSwitches}
      />
      <SelectAutomaticTransferSys
        atsMessage={selectedAtsMessage}
        instantHeatTemp={instantHeatProp}
        snowSensorTemp={snowSensorProp}
        constantTemp={constantTempProp}
        schedule={heatingScheduleProp}
        isWindFactor={windFactorProp}
        fanOnly={fanOnlyProp}
        tgs={tgs}
        isF={isF}
        scheduleDates={scheduleDates}
        hp={hp}
      />
    </>
  );
}

export default ShareComponent;

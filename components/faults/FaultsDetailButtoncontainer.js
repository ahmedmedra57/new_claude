import { useState } from 'react';
import { useFaultsStore } from '../zustand-stores';
import { useMediaQuery } from 'react-responsive';
import styled from 'styled-components';
import {
  essCommandService,
  tesCommandService,
  tgsCommandService,
} from '../../services/sendCommand.service';

import {
  ELECTRIC_FAULTS_TYPES,
  GAS_FAULTS_TYPES,
} from '../DUMMY/DUMMY_FAULTS_MESSAGES';
import { justifyContentFlexEnd } from '../styles/commonStyles';

import FaultsDetailButton from './FaultsDetailButton';

const FaultsDetailButtonContainer = ({
  name,
  location,
  specificLocation,
  machine,
  faultType,
  faultNumber,
  column,
}) => {
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  // Global states
  const faultsState = useFaultsStore();
  const verifiedFaultsState = specificLocation
    ? faultsState[name][location][specificLocation][machine]
    : faultsState[name][location][machine];
  const { activatedResetButton } = verifiedFaultsState;

  // useState

  // Local states
  const buttonNames = isMobile
    ? ['expand']
    : name === 'tgs'
    ? ['reset', 'attend']
    : ['force', 'reset', 'attend'];
  const faultsTypes = name === 'tgs' ? GAS_FAULTS_TYPES : ELECTRIC_FAULTS_TYPES;

  const faultsNumber = faultsTypes.indexOf(faultType);
  
  const handleButtonClick = (buttonName, setResetBtnActivated) => {
    switch (buttonName) {
      case 'force':
        // 1. force button clicked
        dispatch(
          handleForceButtonClick({
            swtName: name,
            specificLocation,
            location,
            machine,
            state: true,
          });
        // 2.open force selection box
        useSettingsOptionsStore().toggleDisplayForceSelectionBox({
            swtName: name,
            location,
            specificLocation,
            machine,
            state: true,
          });

        break;
      case 'reset':
        // TO BE : need to add conditions : maximum 3 times
        // only for the button styling
        setResetBtnActivated(true);
        if (name === 'ess' || name === 'tes') {
          const commandService =
            name === 'ess' ? essCommandService : tesCommandService;
          switch (faultType) {
            case 'ssr fault':
              commandService(machine, {
                ssr_no: faultNumber - 1,
                ssr_reset: 0,
              });
              break;
            case 'ssr load exceed':
              commandService(machine, {
                ssr_no: faultNumber - 1,
                Load_exceeded_reset: 0,
              });
              break;
            case 'thermocouple fault':
              commandService(machine, {
                tc_no: faultNumber - 1,
                thermocouple_reset: 0,
              });
              break;
            case 'ground fault':
              commandService(machine, {
                fault_reset: 1,
                fault_reset_type: 'GROUND_RESET',
              });
              break;
          }
        } else {
          if (faultType === 'thermocouple fault') {
            tgsCommandService(machine, { thermocouple_fault_reset: 0 });
          } else {
            switch (faultType) {
              case 'bms fault':
                tgsCommandService(machine, {
                  fault_reset: 1,
                  fault_reset_type: 'BMS_RESET',
                });
                break;
              case 'hp/lp fault':
                tgsCommandService(machine, {
                  fault_reset: 1,
                  fault_reset_type: 'HPLP_RESET',
                });
                break;
              case 'timeout fault':
                tgsCommandService(machine, {
                  fault_reset: 1,
                  fault_reset_type: 'TIMEOUT_RESET',
                });
                break;
            }
          }
        }
        dispatch(
          handleFaultsReset({
            swtName: name,
            location,
            specificLocation,
            machine,
            faultType,
            faultNumber,
          });
        break;
      case 'attend':
        useMCCommandStore().setAttendButtonClick({
            swtName: name,
            location,
            specificLocation,
            machine,
            faultType,
            state: true,
            column: column,
          });
        break;
      default:
        throw new Error('unknown error', buttonName);
        break;
    }
  };

  return (
    <Wrapper>
      {buttonNames.map((title, index) => (
        <FaultsDetailButton
          // swtName (ess || tes || tgs)
          name={name}
          // button title
          title={title}
          faultsNumber={faultsNumber}
          faultType={faultType}
          handleButtonClick={handleButtonClick}
          key={`${index}${column} ${faultNumber}`}
          buttonNum={isMobile ? 2 : index}
          location={location}
          specificLocation={specificLocation}
          machine={machine}
          faultId={faultNumber - 1}
        />
      ))}
    </Wrapper>
  );
};

export default FaultsDetailButtonContainer;

const Wrapper = styled.div`
  ${justifyContentFlexEnd};
`;

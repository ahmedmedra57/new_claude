import { useMemo, useState } from 'react';
import { useFaultsStore, useMCStore, useSettingsOptionsStore } from '../zustand-stores';
import styled, { css } from 'styled-components';
import { updateDeviceThermocoupleService } from '../../services/faults.service';

import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA,
  layerB,
  messageBoxBackground,
} from '../styles/commonStyles';
import MessageBoxButton from '../userMessages/MessageBoxButton';

const SelectForce = ({
  title,
  handleClose,
  location,
  specificLocation,
  machine,
  swtName,
  faultType,
  faultId,
}) => {
  // !! TODO: implement specific location for dispatches
  const faultsState = useFaultsStore();
  const verifiedFaultsState = faultsState[swtName][location][machine];
  const { receivedThermocoupleSetting } = verifiedFaultsState;
  
  const options = useMemo(() => {
    const result = [];
    const selectedThermocouple = receivedThermocoupleSetting?.find(
      (item) => item.tc_no === faultId
    );
    if (Array.isArray(selectedThermocouple?.force)) {
      if (selectedThermocouple?.force.includes(1)) {
        result.push('max heat for 12 hours');
      }
      if (selectedThermocouple?.force.includes(2)) {
        result.push('max heat for 3 days');
      }
      if (selectedThermocouple?.force.includes(3)) {
        result.push('turn off all electric heater');
      }
      return result;
    }
    return [
      'max heat for 12 hours',
      'max heat for 3 days',
      'turn off all electric heater',
    ];
  }, [receivedThermocoupleSetting]);

  const [selectedOne, setSelectedOne] = useState(options[0]);

  const handleClick = (option) => {
    setSelectedOne(option);
  };

  const handleConfirm = () => {
    useSettingsOptionsStore().setForceSelection({
        swtName,
        location,
        specificLocation,
        machine,
        selectedOne,
      });

    switch (selectedOne) {
      case options[0]: {
        // Max heat for 3 days => max heat display box
        // 2. call the timer with 72 hours (setTime)
        useMCStore().setTimer({
            swtName,
            location,
            specificLocation,
            machine,
            time: 72,
          });
        break;
      }
      case options[1]: {
        // Max heat with 12 hrs timer
        // display the box, timer on with time set
        useMCStore().setTimer({
            swtName,
            location,
            specificLocation,
            machine,
            time: 12,
          });
        break;
      }
      case options[2]: {
        // turn off all electric heater and show the message
        if (swtName === 'ess') {
          useMCStore().setShutOff({ location, specificLocation, machine });
        } else {
          setShutOff({ location, specificLocation, machine });
        }
        // Display force status box
        useSettingsOptionsStore().toggleDisplayForceStatusBox({
            swtName,
            location,
            specificLocation,
            machine,
          });
        break;
      }
      default: {
        break;
      }
    }

    updateDeviceThermocoupleService(machine, {
      tc_no: faultId,
      fault_mode:
        selectedOne == 'max heat for 12 hours'
          ? 1
          : selectedOne == 'max heat for 3 days'
          ? 2
          : 3,
      deviceType: swtName.toUpperCase(),
    });

    // force button activated and close the select force box
    useSettingsOptionsStore().setForceButtonActivated({
        swtName,
        location,
        specificLocation,
        machine,
        state: true,
      });
    handleClose();
  };

  return (
    <Wrapper>
      <MessageInner>
        <HeaderWrapper>
          <HeaderTitle>{title}</HeaderTitle>
          <Logo src='/images/messageBox-logo.svg' />
        </HeaderWrapper>

        <TitleWrapper>
          <Title>select force</Title>
        </TitleWrapper>

        <SelectionsWrapper>
          {options.map((option, index) => (
            <SelectionItemWrapper
              onClick={() => handleClick(option)}
              key={index}
            >
              <SelectRadioButton>
                <SelectionIndicator
                  isSelected={selectedOne === option}
                ></SelectionIndicator>
              </SelectRadioButton>
              <Selection>{option}</Selection>
            </SelectionItemWrapper>
          ))}
        </SelectionsWrapper>

        <ButtonWrapper>
          <MessageBoxButton name='confirm' buttonHandler={handleConfirm} />
        </ButtonWrapper>
      </MessageInner>
    </Wrapper>
  );
};

export default SelectForce;

const Wrapper = styled.div`
  width: 402px;
  height: 218px;
  border-radius: 16px;

  ${messageBoxBackground}
  ${flexBoxCenter}
`;
const MessageInner = styled.div`
  width: 384px;
  height: 201px;
  border-radius: 9px;

  ${layerB}
  border: 0.5px solid #000000;

  ${flexDirectionColumn}
  padding: 5px;
`;
const HeaderWrapper = styled.div`
  width: 98%;
  height: 12%;
  border-bottom: 1px solid #fff;

  ${justifyContentSpaceBetween}
`;
const HeaderTitle = styled.span`
  font-size: 12px;
  letter-spacing: 1.2px;
`;

const Logo = styled.img``;

const TitleWrapper = styled.div`
  width: 371px;
  height: 32px;
  border-radius: 16px;
  ${layerA}

  ${flexBoxCenter}
`;
const Title = styled.div`
  width: 365px;
  height: 26px;
  border-radius: 13px;

  border: 1px solid #142033;

  font-size: 9px;
  letter-spacing: 1px;

  ${flexBoxCenter}
`;

const SelectionsWrapper = styled.div`
  width: 371px;
  height: 92px;
  border-radius: 16px;
  ${layerA}

  ${flexDirectionColumn}
  
  padding: 4px 0;
`;
const SelectionItemWrapper = styled.button`
  width: 100%;

  ${justifyContentSpaceBetween}
  padding: 0 3px 0 5px;
`;
const Selection = styled.div`
  width: 337px;
  height: 26px;
  font-size: 9px;
  border: 1px solid #142033;
  border-radius: 13px;

  display: flex;
  align-items: center;
  padding-left: 8px;
`;
const SelectRadioButton = styled.div`
  width: 22px;
  height: 22px;
  border: 1px solid #95ff45;
  border-radius: 50%;

  ${flexBoxCenter}
`;
const SelectionIndicator = styled.div`
  width: 14px;
  height: 14px;
  ${(p) =>
    p.isSelected &&
    css`
      background: #95ff45;
    `}

  border-radius: 50%;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

import { NavLink } from 'react-router-dom';
import { useContext, useState, memo } from 'react';
import { import { useESSSwitchStore, useLocationsStore, useTESSwitchStore, useTGSSwitchStore } from '../zustand-stores';

import styled, { css } from 'styled-components';

  alignItemsFlexStart,
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentFlexStart,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerADark,
  layerADisabled180Deg,
  layerB,
  layerC,
  layerCLighter,
} from '../styles/commonStyles';
import testData from '../../test_data/testData';
import { GeneralContext } from '../context/contextOfGeneral';
import { PERMISSIONS } from '../../constants';
import { useCheckControlPermsission } from '../../hooks';

const SearchBox = ({ handleClose, isMobile }) => {
  const switchButtonNames = ['ess', 'tgs', 'tes', 'hp'];
  const links = ['/ess', '/tgs', '/tes', '/hp'];
  const initialButtonState = [false, false, false, false];
  const [isSelected, setIsSelected] = useState(initialButtonState);
  const [selectedSwitch, setSelectedSwitch] = useState(null);

  const locations = useLocationsStore();
  const { flatEssSwitch, flatTgsSwitch, flatTesSwitch } = selectedSwitch && selectedSwitch === 'ess'
      ? useESSSwitchStore()
      : selectedSwitch === 'tgs'
      ? useTGSSwitchStore()
      : useTESSwitchStore();

  const switches =
    selectedSwitch && selectedSwitch === 'ess'
      ? flatEssSwitch
      : selectedSwitch === 'tgs'
      ? flatTgsSwitch
      : flatTesSwitch;

  
  // useContext
  const { handleOnClick } = useContext(GeneralContext);

  const handleSelectSwitch = (id) => {
    const arr = [...initialButtonState];
    arr[id] = true;
    setIsSelected(arr);
    setSelectedSwitch(switchButtonNames[id]);
    handleOnClick('groupD', id);
  };

  const machineControlHandler = (
    initialStateCallback,
    openMachineCallback,
    swtName,
    location,
    locationIdx,
    el,
    elIdx,
    machine
  ) => {
    const locationArr = Object.keys(switches).map((location) => false);
    initialStateCallback(locationArr);

    Object.keys(switches).forEach((location) =>
      Object.keys(switches[location]).forEach((newEl) => {
        if (switches[location][newEl]?.deviceMac) {
          openMachineCallback({ location, machine: newEl, status: false });
        } else {
          Object.keys(switches[location][newEl]).forEach((newMachine) =>
            openMachineCallback({
                location,
                specificLocation: newEl,
                machine: newMachine,
                status: false,
              })
          );
        }
      })
    );

    if (machine) {
      useLocationsStore().openLocation({
          swtName,
          index: locationIdx,
          status: true,
        });
      useLocationsStore().openSpecificLocation({
          swtName,
          openSpecificLocationIdx: elIdx,
          status: true,
        });

      openMachineCallback({
          location,
          specificLocation: el,
          machine,
          status: true,
        });
    } else {
      useLocationsStore().openLocation({
          swtName,
          index: locationIdx,
          status: true,
        });
      openMachineCallback({
          location,
          machine: el,
          status: true,
        });
    }
  };

  const handleGoTo = (location, locationIndex, el, elIdx, machine) => {
    // 1. close masterControl by using selectedSwitch
    // 2. open location by using location index
    // 3. open selected machine by using location, machine

    if (selectedSwitch === 'ess') {
      machineControlHandler(
        (arr) => useESSSwitchStore().resetMachinesState(arr),
        (args) => useESSSwitchStore().setOpenMachineController(args),
        'ess',
        location,
        locationIndex,
        el,
        elIdx,
        machine
      );
    } else if (selectedSwitch === 'tgs') {
      machineControlHandler(
        (arr) => useTGSSwitchStore().resetMachinesState(arr),
        (args) => useTGSSwitchStore().setOpenMachineController(args),
        'tgs',
        location,
        locationIndex,
        el,
        elIdx,
        machine
      );
    } else if (selectedSwitch === 'tes') {
      machineControlHandler(
        (arr) => useTESSwitchStore().resetMachinesState(arr),
        (args) => useTESSwitchStore().setOpenMachineController(args),
        'tes',
        location,
        locationIndex,
        el,
        elIdx,
        machine
      );
    }
    handleClose();
  };

  const selectListDisplay = Object.keys(switches).map(
    (location, locationIndex) =>
      Object.keys(switches[location]).map((el, elIdx) => {
        if (switches[location][el]?.deviceMac) {
          const machineData = locations.all[location];
          const formattedName = `${machineData.locationName} -
          ${machineData.devices[el]?.machineName} - 
          ${switches[location][el]?.heatingSystem}`;
          return (
            <SwitchSelectWrapper
              key={Math.random() * 100000}
              isMobile={isMobile}
            >
              <DotAndTitleWrapper isMobile={isMobile}>
                <GreenDot />
                <SwitchName isMobile={isMobile}>
                  {formattedName}
                </SwitchName>
              </DotAndTitleWrapper>
              <GoToButton
                isMobile={isMobile}
                onClick={() => handleGoTo(location, locationIndex, el)}
              >
                go to
              </GoToButton>
            </SwitchSelectWrapper>
          );
        } else {
          return Object.keys(switches[location][el])?.map(
            (machine, machineIdx) => {
              const machineData = locations.all[location][el];
              const formattedName = `${machineData?.locationName} - ${machineData?.specificLocationName} -
              ${machineData?.devices[machine]?.machineName} -
              ${switches[location][el][machine]?.heatingSystem}`;
              return (
                <SwitchSelectWrapper
                  key={Math.random() * 100000}
                  isMobile={isMobile}
                >
                  <DotAndTitleWrapper isMobile={isMobile}>
                    <GreenDot />
                    <SwitchName isMobile={isMobile}>
                      {formattedName}
                    </SwitchName>
                  </DotAndTitleWrapper>
                  <GoToButton
                    isMobile={isMobile}
                    onClick={() =>
                      handleGoTo(
                        location,
                        locationIndex,
                        el,
                        elIdx,
                        machine,
                        machineIdx
                      )
                    }
                  >
                    go to
                  </GoToButton>
                </SwitchSelectWrapper>
              );
            }
          );
        }
      });

  const checkControlPermsission = useCheckControlPermsission();
  return (
    <Wrapper selectedSwitch={selectedSwitch} isMobile={isMobile}>
      <SectionHeaderButton isMobile={isMobile}>
        {switchButtonNames.map((swt, index) => {
          const isDisabled = !checkControlPermsission(swt);
          return (
            <NavLinkButton to={links[index]} key={Math.random() * 10000}>
              <SwitchButton
                isMobile={isMobile}
                disabled={isDisabled}
                isSelected={isSelected[index]}
                onClick={() => !isDisabled || handleSelectSwitch(index)}
              >
                {swt}
              </SwitchButton>
            </NavLinkButton>
          );
        })}
      </SectionHeaderButton>
      {selectedSwitch && (
        <ScrollWrapper isMobile={isMobile}>
          <SectionSwitches isMobile={isMobile}>
            {selectListDisplay}
          </SectionSwitches>
        </ScrollWrapper>
      )}
    </Wrapper>
  );
};
export default memo(SearchBox);

const Wrapper = styled.div`
  width: 100%;
  ${flexDirectionColumn};
  gap: 4px;
  padding: 2px 0 4px 0;
  ${(p) =>
    p.selectedSwitch &&
    css`
      height: auto;
    `}

  ${(p) => p.isMobile && css``}
`;

const SectionHeaderButton = styled.section`
  width: 510px;
  height: 36px;
  border-radius: 18px;
  ${layerADark};
  ${justifyContentSpaceBetween};
  padding: 0 1px;

  ${(p) =>
    p.isMobile &&
    css`
      width: 319px;
      height: 36px;
      ${layerADark}
      padding: 1px  4px 0 4px;
    `}
`;
const NavLinkButton = styled(NavLink)``;
const SwitchButton = styled.button`
  width: 124px;
  height: 34px;
  border-radius: 25px;
  font-size: 14px;
  letter-spacing: 1.4px;

  ${layerA180Deg};

  ${(p) =>
    p.isSelected &&
    css`
      border: 1px solid #95ff45;
    `}

  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg}
      border: 1px solid #000000;
      cursor: not-allowed;
    `}

    ${(p) =>
    p.isMobile &&
    css`
      width: 74px;
      height: 28px;
    `}
`;

const ScrollWrapper = styled.div`
  width: 514px;

  min-height: 36px;

  border-radius: 18px 8px 8px 18px;

  ${layerC};
  ${flexBoxCenter};
  padding: 4px;
  ${(p) =>
    p.isMobile &&
    css`
      width: 319px;
      height: 141px;
      border-radius: 18px;
      ${layerC};
      ${alignItemsFlexStart}
      ::-webkit-scrollbar {
        display: none;
      }
    `}
`;
const SectionSwitches = styled.section`
  width: 100%;
  min-height: 36px;
  max-height: 144px;
  ${flexDirectionColumn}

  /* scroll bar */
  scroll-behavior: smooth;
  overflow-y: auto;

  ::-webkit-scrollbar {
    width: 10px;
    border: 1px solid #ffffff;
    border-radius: 13px;
  }
  ::-webkit-scrollbar-track {
  }

  ::-webkit-scrollbar-thumb {
    background-color: #ffffff;
    border-radius: 13px;
    border: 1.5px solid transparent;
    background-clip: padding-box;
    height: 40%;
  }

  ::-webkit-scrollbar-button:start:decrement {
    background-repeat: no-repeat;
    background-size: 70%;
    background-position: center;
    height: 10px;

    background-image: url('/images/scrollbar-button-start.svg');
  }
  ::-webkit-scrollbar-button:end:increment {
    background-repeat: no-repeat;
    background-size: 70%;
    background-position: center;
    height: 10px;

    background-image: url('/images/scrollbar-button-end.svg');
  }

  ${(p) =>
    p.isMobile &&
    css`
      max-height: 138px;
      ::-webkit-scrollbar {
        display: none;
      }
    `}
`;
const SwitchSelectWrapper = styled.div`
  width: 491px;
  height: 30px;
  border: 1px solid #233a54;
  border-radius: 16px;
  padding: 0 0 0 10px;

  margin-bottom: 3px;
  &:last-child {
    margin-bottom: 0;
  }

  ${justifyContentSpaceBetween}

  &:hover {
    ${layerB}
  }

  ${(p) =>
    p.isMobile &&
    css`
      width: 310px;
      min-height: 32px;
    `}
`;
const DotAndTitleWrapper = styled.div`
  ${justifyContentFlexStart}

  ${(p) =>
    p.isMobile &&
    css`
      width: 70%;
    `}
`;

const GreenDot = styled.div`
  min-width: 12px;
  max-height: 12px;
  height: 12px;
  border-radius: 50%;
  background: #95ff45;
  margin-right: 10px;
`;

const SwitchName = styled.span`
  ${(p) =>
    p.isMobile
      ? css`
          font-size: 8px;
        `
      : css`
          font-size: 10px;
          width: 320px;
        `}
`;
const GoToButton = styled.button`
  width: 118px;
  height: 28px;
  border-radius: 25px;
  font-size: 16px;
  letter-spacing: 1.6px;
  ${layerA180Deg}

  ${(p) =>
    p.isSelected &&
    css`
      border: 1px solid #233a54;
    `}

    ${(p) =>
    p.isMobile &&
    css`
      width: 83px;
      height: 28px;
    `}
`;

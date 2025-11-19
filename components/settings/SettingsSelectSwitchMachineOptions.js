import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import {
  selectForceCommandAndAdminSelect,
} from '../store/slices/settings/force&CommandAndAdminSelectSlice';
import {
  flexBoxCenter,
  justifyContentFlexEnd,
  justifyContentFlexStart,
  layerA,
  scrollbarY,
} from '../styles/commonStyles';
import SelectIndividualOptions from '../telemetry/theSelections/SelectIndividualOptions';
import ClearApplyButton from './ForceAndCommand/selectArts/ClearApplyButton';
import { useMediaQuery } from 'react-responsive';
import { useSelectBoxArrowsState } from '../../hooks/useSelectBoxArrowsState';
import { mainSelectIndicatorHandler } from '../../helpers/setting/select_box_indicator';
import { useGetSpecificLocationList } from '../../hooks';
import { buttonsHandler } from '../../helpers/setting/select_box_buttons_dispatchers';

const SettingsSelectSwitchMachineOptions = ({
  handleClose,
  data,
  sysIndex,
  system,
  setSelectSearchMethod,
  isValueSettings,
  isMobileTC,
  isMobileGasType,
  isMobileSelectTC,
  isMobileValveSettings,
  program,
}) => {
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });
  const locations = Object.keys(data);
  const buttons = ['clear', 'select'];

  const { trackArrowState, trackSpecLocationArrowState, specificLocations } =
    useSelectBoxArrowsState(data);

  const [isArrowDown, setIsArrowDown] = useState(trackArrowState);
  const [isSpecLocationArrowDown, setIsSpecLocationArrowDown] = useState(
    trackSpecLocationArrowState
  );

  const specificLocationsNameList = useGetSpecificLocationList(data);

  const FCAndAdminSelectState = useSelector(selectForceCommandAndAdminSelect);
  const {
    ess,
    tgs,
    tes,
    sys,
    gasType,
    forceGasAndElectricSys,
    valveSettings,
    outsideTemp,
    burningChamber,
    encloseTemp,
    currEss,
    currTgs,
    currTes,
  } = FCAndAdminSelectState;

  const swt =
    sysIndex === 0
      ? 'ess'
      : sysIndex === 1
      ? 'tgs'
      : sysIndex === 2
      ? 'tes'
      : sysIndex === 5
      ? 'sys'
      : sysIndex;

  const isSelectedSys =
    sysIndex === 'outsideTemp'
      ? 'isOutsideTempSelected'
      : sysIndex === 'burningChamber'
      ? 'isBurningChamberSelected'
      : sysIndex === 'encloseTemp'
      ? 'isEncloseTempSelected'
      : sysIndex === 'currEss'
      ? 'isCurrEssSelected'
      : sysIndex === 'currTgs'
      ? 'isCurrTgsSelected'
      : sysIndex === 'currTes'
      ? 'isCurrTesSelected'
      : sysIndex === 'valveSettings'
      ? 'isSelectedValveSettings'
      : sysIndex === 'gasType'
      ? 'isSelectedGasType'
      : null;

  const {
    isAllSelected,
    isLocationSelected,
    isSpecificLocationSelected,
    isMachineSelected,
    selectedLocations,
    selectedSpecificLocations,
    selectedMachines,
  } =
    sysIndex === 0
      ? ess
      : sysIndex === 1
      ? tgs
      : sysIndex === 2
      ? tes
      : sysIndex === 5
      ? sys
      : sysIndex === 'gasType'
      ? gasType
      : sysIndex === 'forceGasAndElectricSys'
      ? forceGasAndElectricSys
      : sysIndex === 'outsideTemp'
      ? outsideTemp
      : sysIndex === 'burningChamber'
      ? burningChamber
      : sysIndex === 'encloseTemp'
      ? encloseTemp
      : sysIndex === 'currEss'
      ? currEss
      : sysIndex === 'currTgs'
      ? currTgs
      : sysIndex === 'currTes'
      ? currTes
      : sysIndex === 'valveSettings' && valveSettings;

  const [isSelected, setIsSelected] = useState(false);

  const dispatch = useDispatch();

  const handleOnClick = (...props) => {
    const propsObj = {
      button: props[1],
      isAllSelected,
      isLocationSelected,
      isSpecificLocationSelected,
      isMachineSelected,
      selectedLocations,
      selectedSpecificLocations,
      selectedMachines,
      swtName: swt,
      dispatch,
      data,
      locations,
      handleClose,
      isSelected,
      isSelectedSys,
      system,
      program,
    };
    buttonsHandler(propsObj,setSelectSearchMethod,isValueSettings);
  };

  const handleSelect = (option, machine, extraOption, machineIndex) => {
    setIsSelected(true);
    const propObj = {
      dispatch,
      data,
      locations,
      swtName: swt,
      specificLocations,
      isLocationSelected,
      isSpecificLocationSelected,
      isMachineSelected,
      selectedLocations,
      selectedSpecificLocations,
      selectedMachines,
      option,
      machine,
      extraOption,
      machineIndex,
    };
    mainSelectIndicatorHandler(propObj);
  };

  return (
    <>
      {swt && (
        <Wrapper>
          <ScrollBarWrapper
            isMobile={isMobile}
            isForceGasElectric={sysIndex === 'forceGasAndElectricSys'}
          >
            <SectionOptions
              isMobile={isMobile}
              isMobileTC={isMobileTC}
              isForceGasElectric={sysIndex === 'forceGasAndElectricSys'}
            >
              <SelectIndividualOptions
                option='all'
                handleSelect={handleSelect}
                isSelected={isAllSelected}
                isMobileTC={isMobileTC}
                isMobileGasType={isMobileGasType}
                isFirst={true}
                isMobileSelectTC={isMobileSelectTC}
                isMobileValveSettings={isMobileValveSettings}
              />

              {locations.map((location, index) => (
                <SelectIndividualOptions
                key={index}
                index={index}
                option={location}
                data={data[location]}
                handleSelect={handleSelect}
                isSelected={isLocationSelected[index]}
                isMachineSelected={
                  isMachineSelected[index] && isMachineSelected[index]
                }
                isSpecificLocationSelected={
                  isSpecificLocationSelected
                }
                isSpecLocationArrowDown={isSpecLocationArrowDown}
                setIsSpecLocationArrowDown={setIsSpecLocationArrowDown}
                isArrowDown={isArrowDown}
                setIsArrowDown={setIsArrowDown}
                allSpecificLocationsName={
                  specificLocationsNameList
                }
                  isMobileTC={isMobileTC}
                  isMobileGasType={isMobileGasType}
                  isMobileSelectTC={isMobileSelectTC}
                  isMobileValveSettings={isMobileValveSettings}
                />
              ))}
            </SectionOptions>
          </ScrollBarWrapper>
          <SectionButtons isMobile={isMobile}>
            {buttons.map((button, index) => (
              <div key={index}>
                <ClearApplyButton
                  name={button}
                  handleClick={handleOnClick}
                  index={index}
                  isMobile={isMobile}
                />
              </div>
            ))}
          </SectionButtons>
        </Wrapper>
      )}
    </>
  );
};

export default SettingsSelectSwitchMachineOptions;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  ${flexBoxCenter}
  flex-direction: column;
`;

const ScrollBarWrapper = styled.div`
  ${({ isMobile, isForceGasElectric }) =>
    isMobile
      ? css`
          width: 98%;
          height: 100%;
          ${flexBoxCenter}
        `
      : css`
          width: 98%;
          min-height: 118px;
          max-height: 184px;
          padding: 4px;
          margin-bottom: 4px;
          border-radius: 14px 8px 8px 14px;
          ${layerA}
          ${justifyContentFlexStart}
        `}

  ${({ isForceGasElectric }) =>
    isForceGasElectric &&
    css`
      max-height: 133px;
    `}
`;

const SectionOptions = styled.div`
  ${scrollbarY}

  border-radius: 14px 8px 8px 14px;

  ${({ isMobile }) =>
    isMobile
      ? css`
          height: 184px;
          width: 100%;
          padding: 2px;
          margin-bottom: 4px;
          ::-webkit-scrollbar {
            display: none;
          }
          ${({ isMobileTC }) =>
            isMobileTC &&
            css`
              width: 96%;
            `}
          ${layerA}
          ${flexBoxCenter}
          justify-content: flex-start;
        `
      : css`
          min-height: 110px;
          max-height: 176px;
          width: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
        `};

  ${({ isForceGasElectric }) =>
    isForceGasElectric &&
    css`
      max-height: 124px;
    `}

  flex-direction: column;
`;

const SectionButtons = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 98%;
          height: 52px;
          margin-bottom: 4px;
          margin-top: 4px;

          ${flexBoxCenter}
        `
      : css`
          width: 98%;
          margin-bottom: 2px;
          ${justifyContentFlexEnd};
          gap: 8px;
        `}
`;

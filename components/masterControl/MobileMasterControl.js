import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerADark,
  layerB,
} from '../styles/commonStyles';

import MobileSelectLocation from './MobileSelectLocation';

import {
  handleExpand,
  handleSelectSwitch,
  selectMobileMC,
  handleSelectMobileProgram,
  handleUnselectProgram,
  handleUnSelectSwitch,
  handleOpenSelectLocation,
  handleIsReadyToSelectProgram,
} from '../store/slices/mobileMasterControlSlice';

import { handleSelectProgram } from '../store/slices/mobileSelectProgramSlice';
import ProgramsComponent from './ProgramsComponent';
import EssMain from '../ess/EssMain';
import TgsMain from '../tgs/TgsMain';
import TesMain from '../tes/TesMain';
import { selectEssSwitch } from '../store/slices/essSwitchSlice';
import { selectTgsSwitch } from '../store/slices/tgsSwitchSlice';
import { selectTesSwitch } from '../store/slices/tesSwitchSlice';
import {
  handleLocationSelect,
  handleMachineSelect,
  handleResetAllSelect,
  handleSelectAll,
  handleSpecificLocationSelect,
  selectMasterControls,
} from '../store/slices/masterControlSelectSlice';
import { setInitialStateSelectBoxHandler } from '../../helpers/ess-tgs-tes-mc/setInitialStateSelectBoxHandler';

const MobileMasterControl = () => {
  // global states
  const MCStatus = useSelector(selectMobileMC);
  const {
    selectedSwt,
    swtSrc,
    electricSrc,
    gasSrc,
    isExpanded,
    isProgramSelected,
    isReadyToSelectProgram,
  } = MCStatus;

  const { essSwitch: essSwt } = useSelector(selectEssSwitch);
  const { tgsSwitch: tgsSwt } = useSelector(selectTgsSwitch);
  const { tesSwitch: tesSwt } = useSelector(selectTesSwitch);

  // states for selection
  const selectLocationStatus = useSelector(selectMasterControls);
  const { ess, tgs, tes } = selectLocationStatus;

  // used for apply buttons of ProgramsComponent
  const [isApply, setIsApply] = useState(false);

  // local States
  const [height, setHeight] = useState(false);
  const dispatch = useDispatch();
  const switchNames = ['ess', 'tgs', 'tes', 'hp'];
  const [isReadyToRenderProgram, setIsReadyToRenderProgram] = useState(false);

  useEffect(() => {
    dispatch(handleUnSelectSwitch());
    dispatch(handleOpenSelectLocation(false));
  }, []);

  useEffect(() => {
    isProgramSelected.includes(true)
      ? setIsReadyToRenderProgram(true)
      : setIsReadyToRenderProgram(false);
  }, [isProgramSelected]);

  // ******************initialize selections to use*******************

  const selectionDispatchHandler = (swt, swtData) => {
    // transform data to be dispatch
    const { locationArr, specificLocationArr, machineArr } =
      setInitialStateSelectBoxHandler(swtData);

    // dispatches
    dispatch(handleSelectAll({ switch: swt, status: false }));
    dispatch(handleLocationSelect({ arr: locationArr, switch: swt }));
    dispatch(
      handleSpecificLocationSelect({
        arr: specificLocationArr,
        switch: swt,
      })
    );
    dispatch(handleMachineSelect({ arr: machineArr, switch: swt }));
  };

  useEffect(() => {
    if (selectedSwt === 'ess') {
      if (!ess.selectedOne) {
        selectionDispatchHandler(selectedSwt, essSwt);
      }
    } else if (selectedSwt === 'tes') {
      if (!tes.selectedOne) {
        selectionDispatchHandler(selectedSwt, tesSwt);
      }
    } else if (selectedSwt === 'tgs') {
      if (!tgs.selectedOne) {
        selectionDispatchHandler(selectedSwt, tgsSwt);
      }
    }
  }, [selectedSwt]);

  // useEffect(() => {
  //   if (selectedSwt === 'ess') {
  //     if (!ess.selectedOne) {
  //       dispatch(handleSelectAll({ switch: 'ess', status: false }));

  //       const essLocations = Object.keys(essSwt);
  //       const locationArr = essLocations.map((location) => false);
  //       dispatch(handleLocationSelect({ arr: locationArr, switch: 'ess' }));

  //       const machineArr = Object.values(essSwt).map((location) =>
  //         Object.keys(location).map((machine) => false)
  //       );
  //       dispatch(handleMachineSelect({ arr: machineArr, switch: 'ess' }));
  //     }
  //     // setAtsSrc('/images/select-ats-disabled.svg');
  //   } else if (selectedSwt === 'tes') {
  //     if (!tes.selectedOne) {
  //       const tesLocations = Object.keys(tesSwt);
  //       dispatch(handleSelectAll({ status: false, switch: 'tes' }));
  //       const locationArr = tesLocations.map((location) => false);
  //       dispatch(handleLocationSelect({ arr: locationArr, switch: 'tes' }));

  //       const machineArr = Object.values(tesSwt).map((location) =>
  //         Object.keys(location).map((machine) => false)
  //       );
  //       dispatch(handleMachineSelect({ arr: machineArr, switch: 'tes' }));
  //     }
  //     // setAtsSrc('/images/select-ats-disabled.svg');
  //   } else if (selectedSwt === 'tgs') {
  //     if (!tgs.selectedOne) {
  //       // setAtsSrc('/images/select-ats-active.svg');
  //       const tgsLocations = Object.keys(tgsSwt);
  //       dispatch(handleSelectAll({ status: false, switch: 'ess' }));
  //       const locationArr = tgsLocations.map((location) => false);
  //       dispatch(handleLocationSelect({ arr: locationArr, switch: 'tgs' }));

  //       const machineArr = Object.values(tgsSwt).map((location) =>
  //         Object.keys(location).map((machine) => false)
  //       );
  //       dispatch(handleMachineSelect({ arr: machineArr, switch: 'tgs' }));
  //     }
  //   }
  // }, [selectedSwt]);

  // event handlers
  // open || close component
  const handleExpandButtonClick = () => {
    dispatch(handleExpand());
  };
  // select swt ess || tgs || tes
  const handleSelectSwt = (switchName, idx) => {
    setIsApply(false);
    if (switchName === 'hp') {
      dispatch(handleOpenSelectLocation(false));
      dispatch(handleUnSelectSwitch());
    } else {
      dispatch(handleSelectSwitch({ switchName, idx }));
    }
  };

  // select program
  const handleClickSelectProgram = (index) => {
    setIsApply(false);
    dispatch(handleSelectMobileProgram(index));
    if (index === 1 || index === 3) {
      setHeight(true);
    } else {
      setHeight(false);
    }
  };

  return (
    <Wrapper>
      <MCWrapper isExpanded={isExpanded}>
        <InnerHole isExpanded={isExpanded}>
          <Top isExpanded={isExpanded}>
            <SectionHeader isExpanded={isExpanded}>
              <HeaderTop>
                <HeaderTitle>master control</HeaderTitle>
                <HeaderButton onClick={handleExpandButtonClick}>
                  <HeaderButtonHole>
                    <HeaderButtonTop>
                      {isExpanded ? 'close' : 'expand'}
                    </HeaderButtonTop>
                  </HeaderButtonHole>
                </HeaderButton>
              </HeaderTop>
            </SectionHeader>

            {isExpanded && (
              <SectionMasterController
                isReadyToRenderProgram={isReadyToRenderProgram}
              >
                <MasterControllerHole>
                  <MasterControllerTop>
                    <SectionSelectSwitches>
                      <SelectSwitchesHole>
                        <SelectSwitchesTop>
                          {switchNames.map((swtName, index) => (
                            <SelectButton
                              onClick={() => handleSelectSwt(swtName, index)}
                              key={index}
                            >
                              <SelectIcon src={swtSrc[index]} />
                            </SelectButton>
                          ))}
                        </SelectSwitchesTop>
                      </SelectSwitchesHole>
                    </SectionSelectSwitches>

                    <SectionSelectLocation>
                      <MobileSelectLocation setIsApply={setIsApply} />
                    </SectionSelectLocation>

                    <SectionSubPrograms>
                      <Button
                        onClick={() =>
                          isReadyToSelectProgram && handleClickSelectProgram(5)
                        }
                      >
                        <ButtonOuter isSelected={isProgramSelected[5]}>
                          <ButtonHole>
                            <ButtonTop isAts={true}>
                              <ButtonName isGp={true}>gp</ButtonName>
                              <Logo src='/images/mc-mobile-ats.svg' />
                              <ButtonName isEbp={true}>ebp</ButtonName>
                            </ButtonTop>
                          </ButtonHole>
                        </ButtonOuter>
                      </Button>

                      <Button
                        onClick={() =>
                          isReadyToSelectProgram && handleClickSelectProgram(6)
                        }
                      >
                        <ButtonOuter isSelected={isProgramSelected[6]}>
                          <ButtonHole>
                            <ButtonTop>
                              <ButtonName>m.c off</ButtonName>
                            </ButtonTop>
                          </ButtonHole>
                        </ButtonOuter>
                      </Button>
                    </SectionSubPrograms>

                    <SectionKnob
                      isHeight={height}
                      isReadyToRender={selectedSwt}
                    >
                      {selectedSwt && (
                        <>
                          <BGImage
                            src={selectedSwt === 'tgs' ? gasSrc : electricSrc}
                          />
                          {isProgramSelected.map((selected, index) => (
                            <ProgramButton
                              key={index}
                              index={index}
                              onClick={() =>
                                isReadyToSelectProgram &&
                                handleClickSelectProgram(index)
                              }
                            ></ProgramButton>
                          ))}
                        </>
                      )}
                    </SectionKnob>
                  </MasterControllerTop>
                </MasterControllerHole>
              </SectionMasterController>
            )}
            {isReadyToRenderProgram && (
              <ProgramsComponent
                isApply={isApply}
                setIsApply={setIsApply}
                selectionDispatchHandler={selectionDispatchHandler}
              />
            )}
          </Top>
        </InnerHole>
      </MCWrapper>

      {selectedSwt === 'ess' && <EssMain isMasterControl={true} />}
      {selectedSwt === 'tgs' && <TgsMain isMasterControl={true} />}
      {selectedSwt === 'tes' && <TesMain isMasterControl={true} />}
    </Wrapper>
  );
};

export default MobileMasterControl;

const Wrapper = styled.div`
  width: 332px;
  ${flexDirectionColumn};
`;

const MCWrapper = styled.div`
  width: 332px;
  ${layerA};
  ${flexBoxCenter};

  ${(p) =>
    p.isExpanded
      ? css`
          min-height: 565px;
          border-radius: 39px 39px 10px 10px;
          padding: 1.5px 0;
        `
      : css`
          height: 78px;
          border-radius: 37px;
        `};

  margin-bottom: 8px;
`;

const InnerHole = styled.div`
  width: 328px;
  ${layerA180Deg};
  ${flexBoxCenter};

  ${(p) =>
    p.isExpanded
      ? css`
          min-height: 562px;
          border-radius: 37px 37px 8px 8px;
          padding: 5px 0;
        `
      : css`
          height: 74px;
          border-radius: 37px;
        `}
`;
const Top = styled.div`
  width: 318px;
  ${layerA};

  ${(p) =>
    p.isExpanded
      ? css`
          min-height: 552px;
          border-radius: 32px 32px 4px 4px;
          ${flexDirectionColumn};
          justify-content: flex-start;
          padding: 2px 0;
          ${p.isReadyToRenderProgram ? css`` : css``}
        `
      : css`
          height: 64px;
          border-radius: 32px;
          ${flexBoxCenter};
        `}
`;

const SectionHeader = styled.section`
  width: 314px;
  height: 60px;
  border-radius: 30px;
  ${layerA180Deg};
  ${flexBoxCenter};

  ${(p) =>
    p.isExpanded &&
    css`
      margin-bottom: 8px;
    `}
`;

const HeaderTop = styled.div`
  width: 299px;
  height: 44px;
  border-radius: 33px;
  ${layerADark}
  ${justifyContentSpaceBetween};
  padding: 0 2px 0 14px;
`;

const HeaderTitle = styled.div`
  width: 190px;
  height: 40%;
  font-size: 12px;
  letter-spacing: 1.2px;
  text-align: left;
  border-bottom: 1px solid #fff;
`;

const HeaderButton = styled.button`
  width: 89px;
  height: 40px;
  border-radius: 25px;
  ${layerA180Deg};
  ${flexBoxCenter};
`;

const HeaderButtonHole = styled.div`
  width: 79px;
  height: 30px;
  border-radius: 20px;
  ${layerA};
  ${flexBoxCenter};
`;
const HeaderButtonTop = styled.div`
  width: 77px;
  height: 28px;
  border-radius: 25px;
  ${layerA180Deg};
  ${flexBoxCenter};
`;

const SectionMasterController = styled.section`
  width: 312px;
  ${(p) =>
    p.isReadyToRenderProgram
      ? css`
          height: auto;
        `
      : css`
          min-height: 479px;
        `}

  border-radius: 2px;
  ${layerA180Deg};
  ${flexDirectionColumn};
  padding: 9px 0;
  /* padding-bottom: 60px; */
`;

const MasterControllerHole = styled.div`
  width: 294px;
  min-height: 402px;
  border-radius: 12px 12px 147px 147px;
  ${layerA};
  ${flexBoxCenter};
  padding: 7px 0;
`;

const MasterControllerTop = styled.div`
  width: 278px;
  min-height: 388px;
  border-radius: 8px 8px 139px 139px;

  ${layerA180Deg};
  ${flexDirectionColumn};
  justify-content: flex-start;
  padding: 14px 0 16px 0;
`;

const SectionSelectSwitches = styled.section`
  width: 248px;
  height: 67px;
  border-radius: 38px;
  ${layerA};
  ${flexBoxCenter};
  margin-bottom: 6px;
`;

const SelectSwitchesHole = styled.div`
  width: 244px;
  height: 63px;
  border-radius: 36px;
  ${layerA180Deg};
  ${flexBoxCenter};
`;
const SelectSwitchesTop = styled.div`
  width: 236px;
  height: 56px;
  border-radius: 48px;
  ${layerADark};
  ${justifyContentSpaceBetween};
  padding: 0 3px;
`;

const SelectButton = styled.button`
  height: 50px;
  width: 50px;
  ${flexBoxCenter};

  &:hover {
    ${(p) =>
      css`
        transform: scale(102%);
        img:last-child {
          filter: invert(5%);
        }
      `}
  }

  ${(p) =>
    p.disabled &&
    css`
      cursor: not-allowed;
    `}
`;
const SelectIcon = styled.img`
  height: 100%;
`;

const SectionSelectLocation = styled.section`
  margin-bottom: 6px;
`;

const SectionSubPrograms = styled.section`
  width: 248px;
  height: 41px;
  border-radius: 24px;
  ${layerA};
  ${justifyContentSpaceBetween};
  padding: 0 3px;
  margin-bottom: 6px;
`;

const SectionKnob = styled.section`
  width: 248px;
  height: 178px;
  border-radius: 4px 4px 124px 124px;

  ${flexBoxCenter};
  position: relative;

  ${(p) =>
    p.isHeight
      ? css`
          /* padding-bottom: 20px; */
        `
      : css`
          /* padding-bottom: 16px; */
        `};

  ${(p) =>
    p.isReadyToRender ||
    css`
      ${layerADark};
    `}
`;

const ProgramButton = styled.button`
  height: 60px;
  width: 65px;
  position: absolute;

  ${(p) =>
    p.index === 0 &&
    css`
      top: 24px;
      left: 0px;
    `};

  ${(p) =>
    p.index === 1 &&
    css`
      top: 90px;
      left: 22px;
    `};
  ${(p) =>
    p.index === 2 &&
    css`
      bottom: 6px;
      left: 90px;
    `};
  ${(p) =>
    p.index === 3 &&
    css`
      top: 90px;
      left: 160px;
    `};
  ${(p) =>
    p.index === 4 &&
    css`
      top: 24px;
      right: 0px;
    `};
`;

const BGImage = styled.img`
  height: 100%;
`;

const Button = styled.button`
  width: 115px;
  height: 36px;
  border-radius: 18px;
  ${layerB};
  ${flexBoxCenter};
`;

const ButtonOuter = styled.div`
  width: 113px;
  height: 34px;
  border-radius: 25px;
  ${layerA180Deg};
  ${flexBoxCenter};

  ${(p) =>
    p.isSelected &&
    css`
      border: 1px solid #95ff45;
    `}
`;
const ButtonHole = styled.div`
  width: 105px;
  height: 26px;
  border-radius: 18px;
  ${layerA};
  ${flexBoxCenter};
`;
const ButtonTop = styled.div`
  width: 103px;
  height: 24px;
  border-radius: 25px;
  ${layerA180Deg};
  ${flexBoxCenter};

  ${(p) =>
    p.isAts &&
    css`
      ${justifyContentSpaceBetween};
      padding: 0 4px;
    `}
`;

const ButtonName = styled.span`
  font-size: 14px;

  ${(p) =>
    p.isGp &&
    css`
      color: #95ff45;
    `};

  ${(p) =>
    p.isEbp &&
    css`
      color: #ff7800;
    `};
`;

const Logo = styled.img``;

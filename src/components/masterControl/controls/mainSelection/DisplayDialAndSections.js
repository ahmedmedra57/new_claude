import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components';

import { selectMasterControls } from '../../../store/slices/masterControlSelectSlice';
import { selectMCCommand } from '../../../store/slices/mCCommandSlice';
import { selectMC } from '../../../store/slices/mCSlice';
import {
  handleSelectAController,
  selectedMachinesState,
} from '../../../store/slices/selectedMachinesSlice';

import {
  flexBoxCenter,
  justifyContentSpaceBetween,
  layerA180Deg,
  layerADark,
} from '../../../styles/commonStyles';

import SectionControllers from '../SectionController';
import MainSelects from './MainSelects';
import InputTempMessage from '../../../userMessages/inputTempMessage';
import { MasterControlContext } from '../../MaterControlContext';

const DisplayDialAndSections = ({
  // controllersStatus,
  // commandConfirmed,
  handleCreateNewCommandMessageBox,
  messageBoxOfCreateNewCommand,
}) => {
  const selectedSwitch = useSelector(selectMC);
  const { ess, tgs, tes, hp } = selectedSwitch.selectSystem;

  const selectsState = useSelector(selectMasterControls);
  const { selectedOne } = ess
    ? selectsState.ess
    : tes
    ? selectsState.tes
    : tgs
    ? selectsState.tgs
    : selectsState.hp;

  const controllerState = useSelector(selectedMachinesState);
  const { selectedController } = controllerState;

  // mcCommandSlice
  const { controlResetInitialState } = useSelector(selectMCCommand);

  const {
    isFanOnly,
    heatingSchedule,
    instantHeat,
    optionalConstantTemp,
    snowSensor,
    windFactor,
  } = controllerState.mCOff;

  const dispatch = useDispatch();

  // useState
  const [isReady, setIsReady] = useState(false);
  const [displayMessageBox, setDisplayMessageBox] = useState(false);
  const [message, setMessage] = useState('');
  const [messageTitle, setMessageTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [isDialSysDisabled, setIsDialSysDisabled] = useState(false);

  // useContext
  const { resetDialControl } = useContext(MasterControlContext);

  useEffect(() => {
    if (!controlResetInitialState) {
      setDialDeg(null);
      setSelectSrc('/images/section-image-none.svg');
      setSrc(ready);
    }
    // for visibility
    if ((ess || tgs || tes || hp) && messageBoxOfCreateNewCommand) {
      setIsReady(true);
    } else {
      setIsReady(false);
    }
  }, [ess, tgs, tes, hp, selectedOne]);

  useEffect(() => {
    if (resetDialControl) {
      setDialDeg(null);
      setSelectSrc('/images/section-image-none.svg');
      setSrc(ready);
    }
  }, [resetDialControl]);

  useEffect(() => {
    if (
      isFanOnly ||
      heatingSchedule ||
      instantHeat ||
      optionalConstantTemp ||
      snowSensor ||
      windFactor
    ) {
      setIsDialSysDisabled(true);
    } else {
      setIsDialSysDisabled(false);
    }
  }, [
    isFanOnly,
    heatingSchedule,
    instantHeat,
    optionalConstantTemp,
    snowSensor,
    windFactor,
  ]);

  const ready = [
    '/images/button-instantHeat.svg',
    '/images/button-snowSensor.svg',
    '/images/button-constantTemp.svg',
    '/images/button-heatingSchedule.svg',
    '/images/button-windFactor.svg',
  ];
  const instantHeatImg = [
    '/images/button-instantHeat-active.svg',
    '/images/button-snowSensor.svg',
    '/images/button-constantTemp.svg',
    '/images/button-heatingSchedule.svg',
    '/images/button-windFactor.svg',
  ];
  const snowSensorImg = [
    '/images/button-instantHeat.svg',
    '/images/button-snowSensor-active.svg',
    '/images/button-constantTemp.svg',
    '/images/button-heatingSchedule.svg',
    '/images/button-windFactor.svg',
  ];
  const constantTempImg = [
    '/images/button-instantHeat.svg',
    '/images/button-snowSensor.svg',
    '/images/button-constantTemp-active.svg',
    '/images/button-heatingSchedule.svg',
    '/images/button-windFactor.svg',
  ];
  const windFactorImg = [
    '/images/button-instantHeat.svg',
    '/images/button-snowSensor.svg',
    '/images/button-constantTemp.svg',
    '/images/button-heatingSchedule.svg',
    '/images/button-windFactor-active.svg',
  ];
  const heatingScheduleImg = [
    '/images/button-instantHeat.svg',
    '/images/button-snowSensor.svg',
    '/images/button-constantTemp.svg',
    '/images/button-heatingSchedule-active.svg',
    '/images/button-windFactor.svg',
  ];
  const [src, setSrc] = useState(ready);
  const [selectSrc, setSelectSrc] = useState('/images/section-image-none.svg');
  const [dialDeg, setDialDeg] = useState(null);

  const handleSelectController = (id) => {
    if (selectedOne && selectedOne !== '0 switches') {
      switch (id) {
        case 1: {
          // 1. change icons
          setSrc(instantHeatImg);
          // 2. change select effect panel
          setSelectSrc('/images/section-image-1.svg');
          // change selected controller as true
          dispatch(handleSelectAController([true, false, false, false, false]));
          // turn dial dgree
          setDialDeg(1);
          break;
        }
        case 2: {
          // 1. change icons
          setSrc(snowSensorImg);
          // 2. change select effect panel
          setSelectSrc('/images/section-image-2.svg');
          // change selected controller as true
          dispatch(handleSelectAController([false, true, false, false, false]));
          // turn dial degree
          setDialDeg(2);
          break;
        }
        case 3: {
          // 1. change icons
          setSrc(constantTempImg);
          // 2. change select effect panel
          setSelectSrc('/images/section-image-3.svg');
          // change selected controller as true
          dispatch(handleSelectAController([false, false, true, false, false]));
          // turn dial degree
          setDialDeg(3);
          break;
        }
        case 4: {
          // 1. change icons
          setSrc(heatingScheduleImg);
          // 2. change select effect panel
          setSelectSrc('/images/section-image-4.svg');
          // change selected controller as true
          dispatch(handleSelectAController([false, false, false, true, false]));
          // turn dial degree
          setDialDeg(4);
          break;
        }
        case 5: {
          // 1. change icons
          setSrc(windFactorImg);
          // 2. change select effect panel
          setSelectSrc('/images/section-image-5.svg');
          // change selected controller as true
          dispatch(handleSelectAController([false, false, false, false, true]));
          // turn dial degree
          setDialDeg(5);
          break;
        }
        default: {
          break;
        }
      }
    }
  };

  const handleMessageBox = (e, swtName, message, subTitle) => {
    e.stopPropagation();
    setMessage(message);
    setMessageTitle(swtName);
    setDisplayMessageBox(true);
    setSubtitle(subTitle);
  };

  return (
    <Wrapper isReady={isReady}>
      {/* {messageBoxOfCreateNewCommand && ( */}
      <>
        <SectionMainSelect isReady={isReady}>
          <img src='/images/metal-logo-masterCtr.svg' alt='logo' />
          <SelectionHole>
            <MainSelects
              // commandConfirmed={commandConfirmed}
              handleCreateNewCommandMessageBox={
                handleCreateNewCommandMessageBox
              }
            />
          </SelectionHole>
        </SectionMainSelect>

        <div
          onClick={(e) =>
            (!selectedOne || selectedOne === '0 switches') &&
            handleMessageBox(
              e,
              'master control',
              [
                'select switches',
                'please select location/locations to continue.',
              ],
              'controls'
            )
          }
        >
          <SectionControllers
            isReady={isReady}
            handleSelectController={handleSelectController}
            // for dispatch
            selectedController={selectedController}
            // for styling
            // controllersStatus={controllersStatus}
            // for prevent editing after confirm all changes
            // commandConfirmed={commandConfirmed}
            handleCreateNewCommandMessageBox={handleCreateNewCommandMessageBox}
            // for controlling the system enabled or disabled
            isDialSysDisabled={isDialSysDisabled}
          />

          <SectionForSVGs>
            <SvgDial src={'/images/dial.svg'} dialDeg={dialDeg} />
            <SvgSelection src={selectSrc} />
            <IconWrapper
              id={1}
              isReady={isReady}
              onClick={(e) =>
                isDialSysDisabled
                  ? handleMessageBox(
                      e,
                      'master control',
                      [
                        'm.c. shut off',
                        "can't be used another action with deactivate",
                      ],
                      'deactivate'
                    )
                  : handleSelectController(1)
              }
            >
              <Img src={src[0]} />
            </IconWrapper>
            <IconWrapper
              id={2}
              isReady={isReady}
              onClick={(e) =>
                isDialSysDisabled
                  ? handleMessageBox(
                      e,
                      'master control',
                      [
                        'm.c. shut off',
                        "can't be used another action with deactivate",
                      ],
                      'deactivate'
                    )
                  : handleSelectController(2)
              }
            >
              <Img src={src[1]} />
            </IconWrapper>
            <IconWrapper
              id={3}
              isReady={isReady}
              onClick={(e) =>
                tgs
                  ? ''
                  : isDialSysDisabled
                  ? handleMessageBox(
                      e,
                      'master control',
                      [
                        'm.c. shut off',
                        "can't be used another action with deactivate",
                      ],
                      'deactivate'
                    )
                  : handleSelectController(3)
              }
            >
              <Img src={src[2]} />
            </IconWrapper>
            <IconWrapper
              id={4}
              isReady={isReady}
              onClick={(e) =>
                isDialSysDisabled
                  ? handleMessageBox(
                      e,
                      'master control',
                      [
                        'm.c. shut off',
                        "can't be used another action with deactivate",
                      ],
                      'deactivate'
                    )
                  : handleSelectController(4)
              }
            >
              <Img src={src[3]} />
            </IconWrapper>
            <IconWrapper
              id={5}
              isReady={isReady}
              onClick={(e) =>
                isDialSysDisabled
                  ? handleMessageBox(
                      e,
                      'master control',
                      [
                        'm.c. shut off',
                        "can't be used another action with deactivate",
                      ],
                      'deactivate'
                    )
                  : handleSelectController(5)
              }
            >
              <Img src={src[4]} />
            </IconWrapper>
          </SectionForSVGs>
        </div>
      </>
      {/* )} */}
      {displayMessageBox && (
        <MessageBoxWrapper>
          <InputTempMessage
            onClose={() => setDisplayMessageBox(false)}
            title={messageTitle}
            messages={message}
            subtitle={subtitle}
          />
        </MessageBoxWrapper>
      )}
    </Wrapper>
  );
};

export default DisplayDialAndSections;

const Wrapper = styled.div`
  width: 670px;
  height: 100%;

  position: relative;

  ${(p) =>
    p.isReady ||
    css`
      visibility: hidden;
    `}
`;

const SectionMainSelect = styled.div`
  width: 588px;
  height: 78px;
  border-radius: 50px 92px 12px 50px;

  ${layerA180Deg}
  ${justifyContentSpaceBetween}  

  padding: 0 22rem 0 15rem;

  ${(p) =>
    p.isReady ||
    css`
      visibility: hidden;
    `};
`;

const SelectionHole = styled.div`
  width: 505px;
  height: 63px;

  ${layerADark}
  border-radius: 32px;
`;
const SectionForSVGs = styled.div`
  width: 40%;
  height: 60%;
  display: flex;
  align-items: center;

  position: absolute;
  top: 140rem;
  left: -16rem;
`;
const SvgDial = styled.img`
  margin-right: -117rem;
  margin-top: 2rem;
  margin-left: -20rem;

  /* default degree  */
  transform: rotate(-34deg);

  /* instant heat */
  ${(p) =>
    p.dialDeg === 1 &&
    css`
      transform: rotate(0deg);
    `}
  /* snow sensor */
  ${(p) =>
    p.dialDeg === 2 &&
    css`
      transform: rotate(25deg);
    `}

  /* optional constant temp */
  ${(p) =>
    p.dialDeg === 3 &&
    css`
      transform: rotate(55deg);
    `}
  
  /* heating scheduler */
  ${(p) =>
    p.dialDeg === 4 &&
    css`
      transform: rotate(82deg);
    `}
  /*wind factor */
  ${(p) =>
    p.dialDeg === 5 &&
    css`
      transform: rotate(110deg);
    `}
`;

const SvgSelection = styled.img`
  margin-top: 22rem;
`;

const IconWrapper = styled.button`
  position: absolute;
  transition: all 300 ease-in;
  &:hover {
    transform: scale(1.2);
  }

  ${(p) =>
    p.isReady ||
    css`
      visibility: hidden;
    `}

  ${(p) =>
    p.id === 1 &&
    css`
      border: 1px solid transparent;
      top: 20rem;
      left: 145rem;
    `}
  ${(p) =>
    p.id === 2 &&
    css`
      border: 1px solid red;
      top: 77rem;
      left: 190rem;
    `}
    ${(p) =>
    p.id === 3 &&
    css`
      border: 1px solid red;
      top: 145rem;
      left: 210rem;
    `}
    ${(p) =>
    p.id === 4 &&
    css`
      border: 1px solid red;
      top: 213rem;
      left: 190rem;
    `}
    ${(p) =>
    p.id === 5 &&
    css`
      border: 1px solid red;
      top: 270rem;
      left: 145rem;
    `}
`;
const Img = styled.img``;

const MessageBoxWrapper = styled.div`
  width: 1216px;
  height: 300px;

  ${flexBoxCenter}
  padding-right: 300rem;

  position: absolute;
  top: 0;
  z-index: 100;
`;

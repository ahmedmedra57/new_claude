import { useEffect, useState } from 'react';
import { useFaultsStore } from '../zustand-stores';

import {
  flexBoxCenter,
  layerA180Deg,
  layerADisabled180Deg,
  layerB,
  layerBDisabled,
  layerC,
} from '../styles/commonStyles';
import styled, { css } from 'styled-components';
import { useMediaQuery } from 'react-responsive';
import { useMemo } from 'react';
import { countdownTimer } from '../../helpers/helpers';

const FaultsDetailButton = ({
  name,
  title,
  handleButtonClick,
  faultsNumber,
  faultType,
  buttonNum,
  location,
  specificLocation,
  machine,
  faultId,
}) => {
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });
  const { flatEssSwitch, flatTgsSwitch, flatTesSwitch } = useSelector(
    name === 'ess'
      ? selectEssSwitch
      : name === 'tgs'
      ? selectTgsSwitch
      : selectTesSwitch
  );
  const swtStatus =
    name === 'ess' ? flatEssSwitch : name === 'tgs' ? flatTgsSwitch : flatTesSwitch;
  const verifiedSwtStatus = specificLocation
    ? swtStatus[location][specificLocation][machine]
    : swtStatus[location][machine];
  const { ssrState } = verifiedSwtStatus;

  const faultsState = useFaultsStore();
  const verifiedFaultsState = specificLocation
    ? faultsState[name][location][specificLocation][machine]
    : faultsState[name][location][machine];
  const {
    isForceButtonClicked,
    isForceButtonActivated,
    selectedForce,
    activatedResetButton,
    resetCounter,
    attendButtonClicked,
    receivedThermocoupleSetting,
  } = verifiedFaultsState;

  // ********************* timer *********************
  const [countdown, setCountdown] = useState(null);
  const [activeForceButton, setActiveForceButton] = useState(false);
  const [resetBtnActivated, setResetBtnActivated] = useState(false);
  // *********************

  const ssrFault = useMemo(() => {
    if (faultType === 'ssr fault' || faultType === 'ssr load exceed') {
      return ssrState
        ? Object.values(ssrState).find((item) => item.No === faultId)
        : null;
    }
    return null;
  }, [ssrState]);

  useEffect(() => {
    // faults number -1 means that there is a fault in the thermocouple
    if (faultsNumber === -1) {
      const currentThermocouple = receivedThermocoupleSetting.find(
        (item) => item.tc_no === faultId
      );
      setActiveForceButton(currentThermocouple);
    }
  }, [receivedThermocoupleSetting]);

  useEffect(() => {
    setCountdown(activeForceButton?.count_down_time);

    let setTimer;
    clearInterval(setTimer);
    const timer = () => {
      clearInterval(setTimer);
      setTimer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    };

    activeForceButton?.paused !== 1 && timer();

    return () => {
      clearInterval(setTimer);
    };
  }, [activeForceButton]);

  // Make button disabled depending on tgs fault types
  // Make button disabled depending on ess and tes fault types (more conditions than tgs)

  // const tgsDisable =
  //   faultType === 'bms fault' && buttonNum === 0 ? true : false;

  // const essDisable =
  //   faultType === 'ground fault' || faultType === 'ssr load exceed'
  //     ? true
  //     : false;

  // const essDisableMoreCondition = essDisable && buttonNum === 1;

  // const disable = name === 'tgs' ? tgsDisable : essDisableMoreCondition;
  const disable =
    title === 'reset' &&
    (faultType === 'BMS FAULT!' ||
      faultType === 'GROUND FAULT' ||
      ssrFault?.reset === 0);

  // Make some buttons invisible depending on ess, tes fault types
  const inVisible =
    name !== 'tgs' && buttonNum == 0 && faultsNumber !== -1 ? true : false;

  // ***************for styling in force button **************
  const forceBtnClicked = isForceButtonClicked && title === 'force';
  const forceBtnActivated = activeForceButton && title === 'force';
  // ******************************************

  // ***************for styling in reset button **************
  // const resetBtnActivated =
  //   activatedResetButton.faultType === faultType && title === 'reset';
  // ******************************************

  // ***************for styling in reset button **************
  const attendBtnClicked =
    attendButtonClicked.faultType === faultType &&
    title === 'attend' &&
    attendButtonClicked.faultNumber === faultId;
  // ******************************************

  const forceTypeTitle =
    activeForceButton?.fault_mode === 3 ? 'system off' : 'remaining';

  return (
    <WrapperHole
      onClick={() =>
        handleButtonClick(
          title === 'expand' ? 'attend' : title,
          setResetBtnActivated
        )
      }
      inVisible={inVisible}
      disable={disable}
      forceBtnClicked={forceBtnClicked}
      attendBtnClicked={attendBtnClicked}
      forceBtnActivated={forceBtnActivated}
    >
      <ButtonInner
        disable={disable}
        forceBtnActivated={forceBtnActivated}
        resetBtnActivated={resetBtnActivated}
      >
        <ButtonInnerHole
          disable={disable}
          forceBtnActivated={forceBtnActivated}
          resetBtnActivated={resetBtnActivated}
        >
          <ButtonTop
            disable={disable}
            forceBtnActivated={forceBtnActivated}
            resetBtnActivated={resetBtnActivated}
          >
            <Title
              forceBtnActivated={forceBtnActivated}
              resetBtnActivated={resetBtnActivated}
            >
              {title}
            </Title>
            {forceBtnActivated && (
              <ForceTop>
                {forceTypeTitle === 'system off' ? (
                  <ForceTitle>{forceTypeTitle}</ForceTitle>
                ) : (
                  <ForceTitle>
                    {forceTypeTitle}
                    {countdown ? ` ${countdownTimer(countdown)}` : ' 00:00:00'}
                  </ForceTitle>
                )}
              </ForceTop>
            )}
          </ButtonTop>
        </ButtonInnerHole>
      </ButtonInner>
    </WrapperHole>
  );
};

export default FaultsDetailButton;

const WrapperHole = styled.button`
  cursor: pointer;
  ${flexBoxCenter};

  width: 88px;
  height: 28px;
  border-radius: 27px;

  ${layerB}
  margin-left: 3px;

  ${(p) =>
    p.inVisible &&
    css`
      display: none;
    `};

  ${(p) =>
    p.disable &&
    css`
      pointer-events: none;
    `};

  ${(p) =>
    p.forceBtnClicked &&
    css`
      border: 1px solid #95ff45;
    `};

  ${(p) =>
    p.attendBtnClicked &&
    css`
      border: 1px solid #95ff45;
    `}

  ${(p) =>
    p.forceBtnActivated &&
    css`
      width: 183px;
      height: 28px;
    `}
`;
const ButtonInner = styled.div`
  ${flexBoxCenter};

  width: 86px;
  height: 26px;
  border-radius: 25px;

  ${layerA180Deg}

  ${(p) =>
    p.disable &&
    css`
      ${layerADisabled180Deg}/* border: 0.5px solid #000000; */
    `}

  ${(p) =>
    p.forceBtnActivated &&
    css`
      width: 181px;
      height: 26px;
      background: transparent linear-gradient(180deg, #db9d0c 0%, #946f18 100%);
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid #000000;
    `}

    ${(p) =>
    p.resetBtnActivated &&
    css`
      background: transparent linear-gradient(180deg, #db9d0c 0%, #946f18 100%);
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid #000000;
    `}
`;
const ButtonInnerHole = styled.div`
  ${flexBoxCenter};

  width: 80px;
  height: 20px;
  border-radius: 20px;

  ${layerB}

  ${(p) =>
    p.disable &&
    css`
      ${layerBDisabled}
      box-shadow: inset 0px 0px 1px #000000;
    `}

  ${(p) =>
    p.forceBtnActivated &&
    css`
      width: 175px;
      height: 20px;
      background: #946f18;
      box-shadow: inset 0px 0px 1px #000000;
    `}

    ${(p) =>
    p.resetBtnActivated &&
    css`
      background: #946f18;
      box-shadow: inset 0px 0px 1px #000000;
    `}
`;
const ButtonTop = styled.div`
  ${flexBoxCenter};

  width: 78px;
  height: 18px;
  border-radius: 25px;

  ${layerA180Deg}

  ${(p) =>
    p.disable &&
    css`
      ${layerADisabled180Deg}
      border: 0.5px solid #000000;
    `}

  ${(p) =>
    p.forceBtnActivated &&
    css`
      width: 173px;
      height: 18px;

      background: transparent linear-gradient(180deg, #db9d0c 0%, #946f18 100%);
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid #000000;

      justify-content: space-between;
      padding: 0 0.8px 0 3.2px;
      cursor: default;
    `}

    
    ${(p) =>
    p.resetBtnActivated &&
    css`
      background: transparent linear-gradient(180deg, #db9d0c 0%, #946f18 100%);
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid #000000;
    `}
`;

const Title = styled.span`
  font-size: 10px;
  text-align: center;

  ${(p) =>
    p.forceBtnActivated &&
    css`
      color: #233a54;
      font-size: 9px;
    `}

  ${(p) =>
    p.resetBtnActivated &&
    css`
      color: #233a54;
    `}
`;

const ForceTop = styled.div`
  width: 127px;
  height: 14px;
  border-radius: 20px;

  background: #db9d0c;
  box-shadow: inset 0px 0px 1px #000000;

  ${flexBoxCenter}
`;
const ForceTitle = styled.span`
  color: #233a54;
  font-size: 9px;
`;

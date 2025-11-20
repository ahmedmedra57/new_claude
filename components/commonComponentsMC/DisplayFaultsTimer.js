import styled, { css } from 'styled-components';
import { import { useESSSwitchStore, useFaultsStore, useTESSwitchStore, useTGSSwitchStore } from '../zustand-stores';

  flexBoxCenter,
  justifyContentSpaceBetween,
  layerA0Deg,
  layerA180Deg,
} from '../styles/commonStyles';
import { useState } from 'react';

import { useEffect } from 'react';
import { countdownTimer } from '../../helpers/helpers';

const DisplayFaultsTimer = ({ swtName, location, machine }) => {
  const { essSwitch, tgsSwitch, tesSwitch,flatEssSwitch,flatTgsSwitch,flatTesSwitch } = swtName === 'ess'
      ? useESSSwitchStore()
      : swtName === 'tgs'
      ? useTGSSwitchStore()
      : useTESSwitchStore();

  const swtStatus =
    swtName === 'ess' ? flatEssSwitch : swtName === 'tgs' ? flatTgsSwitch : flatTesSwitch;
  const { isWifi, thermocoupleFault } = swtStatus[location][machine];
  const faultsState = useFaultsStore();
  const { receivedThermocoupleSetting } = faultsState[swtName][location][machine];
  // console.log(faultsState[swtName][location][machine],'faultsState');

  const [failureInfo, setFailureInfo] = useState([]);
  const [failureInfoId, setFailureInfoId] = useState(0);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    if (receivedThermocoupleSetting.length > 0) {
      setFailureInfo(
        receivedThermocoupleSetting
          .filter(fault => thermocoupleFault[fault.tc_no] === 1)
          .map(fault => {
            return {
              ...fault,
              title: fault.fault_mode === 1
                ? '12:00:00'
                : fault.fault_mode === 2
                  ? '72:00:00'
                  : 'system off',
              message: fault.fault_mode === 1
                ? 'max heat 12 hours'
                : fault.fault_mode === 2
                  ? 'max heat for 3 days'
                  : 'change and replace t/c',
            }
          })
      );
    }
  }, [receivedThermocoupleSetting, thermocoupleFault]);

  useEffect(() => {
    let setTimer;

    if (
      typeof failureInfo[failureInfoId]?.count_down_time === 'number' &&
      failureInfo[failureInfoId]?.count_down_time > 0
    ) {
      setCountdown(failureInfo[failureInfoId]?.count_down_time);

      clearInterval(setTimer);
      const timer = () => {
        clearInterval(setTimer);
        setTimer = setInterval(() => {
          setCountdown((prev) => prev > 0 ? prev - 1 : 0);
        }, 1000);
      };
      
      failureInfo[failureInfoId]?.paused !== 1 && timer();
    } else {
      setCountdown(null);
    }

    return () => {
      clearInterval(setTimer);
    };
  }, [failureInfo, failureInfoId]);

  const handleButtonClick = () => {
    if (failureInfoId === +failureInfo.length - 1) {
      setFailureInfoId(0);
    } else {
      setFailureInfoId((prev) => prev + 1);
    }
  };

  return (
    <Wrapper isVisible={failureInfo.length > 0 && isWifi}>
      <InnerWrapper>
        {swtName !== 'tgs' && (
          <TitleWrapper>
            <Flex>
              <Title
                size={'big'}
                isSystemOff={failureInfo[failureInfoId]?.title === 'system off'}
              >
                {failureInfo[failureInfoId]?.title === 'system off' && 'system off'}
                {
                  failureInfo[failureInfoId]?.title !== 'system off' && countdown
                    ? ` ${countdownTimer(countdown)}`
                    : '00:00:00'
                }
              </Title>
              {failureInfo.length > 1 && (
                <Button onClick={handleButtonClick}></Button>
              )}
            </Flex>
            <Title
              size={'sm'}
              isSystemOff={failureInfo[failureInfoId]?.title === 'system off'}
            >
              {failureInfo[failureInfoId]?.message}
            </Title>
          </TitleWrapper>
        )}
      </InnerWrapper>
    </Wrapper>
  );
};

export default DisplayFaultsTimer;

const Wrapper = styled.div`
  width: 189px;
  height: 53px;
  border-radius: 6px;

  ${layerA180Deg};
  ${flexBoxCenter}

  ${(p) =>
    p.isVisible ||
    css`
      visibility: hidden;
    `}
`;
const InnerWrapper = styled.div`
  width: 183px;
  height: 47px;
  border-radius: 4px;

  ${layerA0Deg};

  ${justifyContentSpaceBetween};
`;

const TitleWrapper = styled.div`
  height: 100%;
  width: 100%;

  ${flexBoxCenter}
  flex-direction: column;
`;
const Title = styled.span`
  color: #ff920c;

  ${({ size, isSystemOff }) =>
    isSystemOff && size === 'big'
      ? css`
          font-size: 20px;
        `
      : isSystemOff
        ? css`
          font-size: 10px;
        `
        : size === 'big'
          ? css`
          font-size: 26px;
        `
          : css`
          font-size: 12px;
        `}
`;

const Flex = styled.div`
  width: 100%;
  ${flexBoxCenter}
`;

const Button = styled.button`
  width: 16px;
  height: 20px;
  margin-left: 6px;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 16px solid #ff920c;
  background-color: transparent;
`;

import sum from 'lodash/sum';
import { useMemo } from 'react';
import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  justifyContentFlexStart,
  justifyContentSpaceBetween,
} from '../styles/commonStyles';

const DisplaySum = ({ machineNumber, isMobile, states }) => {
  const activatedSwtNumbers = useMemo(() => {
    const total = sum(
      Object.values(states)
        .filter((el) => el)
        .map((el) => el.isActivated)
    );
    return total + states.fanOnly;
  }, [states]);

  const readySwtNumbers = useMemo(() => {
    return sum(
      Object.values(states)
        .filter((el) => el)
        .map((el) => el.isReady)
    );
  }, [states]);

  const offSwtNumbers = states.systemOff;

  const faultsSwtNumbers = states.systemFaults;
  

  return (
    <>
      {isMobile ? (
        <Wrapper isMobile={isMobile}>
          <IndicatorGroupWrapper>
            <IndicatorWrapper>
              <Indicator id={0} isMobile={isMobile}></Indicator>
              <SwitchStatus isMobile={isMobile}>
                {activatedSwtNumbers} active
              </SwitchStatus>
            </IndicatorWrapper>

            <IndicatorWrapper>
              <Indicator id={1} isMobile={isMobile}></Indicator>
              <SwitchStatus isMobile={isMobile}>
                {readySwtNumbers} ready
              </SwitchStatus>
            </IndicatorWrapper>

            <IndicatorWrapper>
              <Indicator id={2} isMobile={isMobile}></Indicator>
              <SwitchStatus isMobile={isMobile}>
                {offSwtNumbers} off
              </SwitchStatus>
            </IndicatorWrapper>

            <IndicatorWrapper>
              <Indicator id={3} isMobile={isMobile}></Indicator>
              <SwitchStatus isMobile={isMobile}>
                {faultsSwtNumbers} faults
              </SwitchStatus>
            </IndicatorWrapper>
          </IndicatorGroupWrapper>
        </Wrapper>
      ) : (
        <Wrapper>
          <Switches>{machineNumber}</Switches>
          <IndicatorGroupWrapper>
            <IndicatorWrapper>
              <Indicator id={0}></Indicator>
              <SwitchStatus>{activatedSwtNumbers} switches active</SwitchStatus>
            </IndicatorWrapper>

            <IndicatorWrapper>
              <Indicator id={1}></Indicator>
              <SwitchStatus>{readySwtNumbers} switches ready</SwitchStatus>
            </IndicatorWrapper>

            <IndicatorWrapper>
              <Indicator id={2}></Indicator>
              <SwitchStatus>{offSwtNumbers} switches off</SwitchStatus>
            </IndicatorWrapper>

            <IndicatorWrapper>
              <Indicator id={3}></Indicator>
              <SwitchStatus>{faultsSwtNumbers} faults</SwitchStatus>
            </IndicatorWrapper>
          </IndicatorGroupWrapper>
        </Wrapper>
      )}
    </>
  );
};

export default DisplaySum;

const Wrapper = styled.div`
  ${(p) =>
    p.isMobile
      ? css`
          height: 100%;
          width: 100%;
        `
      : css`
          height: 100%;
          gap: 10px;
          ${justifyContentSpaceBetween};
          padding: 0 20px 0 30px;
        `}
`;
const Switches = styled.div`
  height: 37px;

  font-size: 30px;
  letter-spacing: 1.5px;
`;
const IndicatorGroupWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-evenly;
`;
const IndicatorWrapper = styled.div`
  ${justifyContentFlexStart}
`;

const Indicator = styled.div`
  ${(p) =>
    p.isMobile
      ? css`
          width: 6px;
          height: 6px;
          margin-right: 2px;
        `
      : css`
          width: 9px;
          height: 9px;
          margin-right: 6px;
        `}

  border-radius: 50%;
  ${(p) =>
    p.id === 0 &&
    css`
      background-color: #95ff45;
    `}
  ${(p) =>
    p.id === 1 &&
    css`
      background-color: #82ffff;
    `}
    ${(p) =>
    p.id === 2 &&
    css`
      background-color: #969696;
    `}
    ${(p) =>
    p.id === 3 &&
    css`
      background-color: #ff0000;
    `}
`;

const SwitchStatus = styled.span`
  font-size: 8px;
  letter-spacing: 0.8px;

  ${(p) =>
    p.isMobile &&
    css`
      font-size: 7px;
      letter-spacing: 0.7px;
    `}
`;

import { useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceAround,
  justifyContentSpaceBetween,
  justifyContentSpaceEvenly,
  layerA180Deg,
  layerADark,
  layerC,
} from '../../../styles/commonStyles';

import Clock from './Clock';

const TimePicker = ({ time, setTime, id, noTimePicker }) => {
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  const [isSelected, setIsSelected] = useState([false, false]);
  const inputHourRef = useRef(null);
  const inputMinuteRef = useRef(null);

  const handleSetTime = (title, data) => {
    switch (title) {
      case 'division': {
        setTime({ ...time, division: data }, id);
        return;
      }
      case 'hour': {
        if (data > 12) {
          if (data < 25) {
            setTime({ ...time, hour: data - 12, division: 'pm' }, id);
          } else {
            setTime({ ...time, hour: '00', division: 'pm' }, id);
          }
        } else {
          setTime({ ...time, hour: data }, id);
        }
        return;
      }
      case 'minute': {
        if (data < 60) {
          setTime({ ...time, minute: data }, id);
        } else {
          setTime({ ...time, minute: '' }, id);
        }

        return;
      }
      default:
        return;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSelected[0]) {
      setIsSelected([false, true]);
      if (time.hour.length === 0) {
        setTime({ hour: '00', minute: '', division: 'am' }, id);
      } else {
        setTime({ ...time, minute: '' }, id);
      }
      setIsSelected([false, true]);
      inputMinuteRef.current.focus();
    } else {
      if (time.minute.length === 0) {
        setTime({ ...time, minute: '00' }, id);
      }
      setIsSelected([false, false]);
    }
  };

  const handleButton = (comp) => {
    if (comp === 'hour') {
      setTime({ ...time, hour: '', division: 'am' }, id);
      setIsSelected([true, false]);
      inputHourRef.current.focus();
    } else {
      setTime({ ...time, minute: '' }, id);
      setIsSelected([false, true]);
      inputMinuteRef.current.focus();
    }
  };

  return (
    <>
      <Wrapper isMobile={isMobile}>
        <TimeAndDivisionWrapper isMobile={isMobile}>
          <TimeOuter isMobile={isMobile}>
            <TimeInner isMobile={isMobile}>
              <TimeInputButton
                onClick={() => handleButton('hour')}
                isSelected={isSelected[0]}
              >
                <TimeInputButtonTop>hour</TimeInputButtonTop>
              </TimeInputButton>

              <InputWrapper>
                <InvisibleButton onClick={handleSubmit} />
                <HourAndMinute
                  isMobile={isMobile}
                  value={time.hour}
                  type='number'
                  ref={inputHourRef}
                  onChange={(e) => {
                    isSelected[0] && handleSetTime('hour', e.target.value);
                  }}
                  placeholder='00'
                />

                <Divider>:</Divider>

                <HourAndMinute
                  isMobile={isMobile}
                  value={time.minute}
                  type='number'
                  ref={inputMinuteRef}
                  onChange={(e) => {
                    isSelected[1] && handleSetTime('minute', e.target.value);
                  }}
                  placeholder='00'
                />
              </InputWrapper>

              <TimeInputButton
                onClick={() => handleButton('minutes')}
                isSelected={isSelected[1]}
              >
                <TimeInputButtonTop isMinute={true}>minutes</TimeInputButtonTop>
              </TimeInputButton>
            </TimeInner>
          </TimeOuter>

          {isMobile ? (
            <DivisionWrapper isMobile={isMobile}>
              <DivisionOuter isMobile={isMobile}>
                <DivisionInner isMobile={isMobile}>
                  <Division
                    isMobile={isMobile}
                    isSelected={time.division === 'am' ? true : false}
                    onClick={() =>
                      handleSetTime('division', 'am')
                    }
                  >
                    a.m
                  </Division>
                </DivisionInner>

                <DivisionInner isMobile={isMobile}>
                  <Division
                    isMobile={isMobile}
                    isSelected={time.division === 'pm' ? true : false}
                    onClick={() =>
                      handleSetTime('division', 'pm')
                    }
                  >
                    p.m
                  </Division>
                </DivisionInner>
              </DivisionOuter>
            </DivisionWrapper>
          ) : (
            <DivisionWrapper>
              <DivisionOuter>
                <DivisionInner>
                  <Division
                    isSelected={time.division === 'am' ? true : false}
                    onClick={() =>
                      handleSetTime('division', 'am')
                    }
                  >
                    a.m
                  </Division>
                </DivisionInner>
              </DivisionOuter>

              <DivisionOuter>
                <DivisionInner>
                  <Division
                    isSelected={time.division === 'pm' ? true : false}
                    onClick={() =>
                      handleSetTime('division', 'pm')
                    }
                  >
                    p.m
                  </Division>
                </DivisionInner>
              </DivisionOuter>
            </DivisionWrapper>
          )}
        </TimeAndDivisionWrapper>
        <WatchWrapper isMobile={isMobile}>
          <Clock time={time} isMobile={isMobile} />
        </WatchWrapper>
      </Wrapper>
    </>
  );
};

export default TimePicker;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  ${(p) =>
    p.isMobile &&
    css`
      padding: 2px 2px 25px 2px;
    `}
`;

const TimeAndDivisionWrapper = styled.div`
  ${justifyContentSpaceBetween}

  ${(p) => p.isMobile && css``}
`;
const TimeOuter = styled.div`
  width: 61px;
  height: 83px;
  border-radius: 10px;
  ${layerA180Deg};
  ${flexBoxCenter}
  position: relative;

  ${(p) =>
    p.isMobile &&
    css`
      width: 46px;
      height: 63px;
    `}
`;
const TimeInner = styled.div`
  width: 53px;
  height: 77px;
  border-radius: 8px;

  ${layerC};
  ${flexDirectionColumn};

  ${(p) =>
    p.isMobile &&
    css`
      width: 40px;
      height: 57px;
    `}
`;

const TimeInputButton = styled.button`
  width: 51px;
  height: 28px;
  border-radius: 7px;
  ${layerA180Deg};
  ${flexBoxCenter};

  ${(p) =>
    p.isSelected &&
    css`
      border: 1px solid red;
    `}
`;
const TimeInputButtonTop = styled.div`
  width: 44px;
  height: 23px;
  border-radius: 4px;
  ${layerADark};

  font-size: 9px;
  ${(p) =>
    p.isMinute &&
    css`
      font-size: 8px;
    `}
  ${flexBoxCenter}
`;

const InputWrapper = styled.form`
  width: 100%;
  ${flexBoxCenter};
`;

const InvisibleButton = styled.button`
  display: none;
`;

const HourAndMinute = styled.input`
  width: 40%;
  font-size: 14px;
  background: transparent;
  text-align: center;

  ${(p) =>
    p.isMobile &&
    css`
      font-size: 10px;
    `}
`;
const Divider = styled.span`
  font-size: 12px;
  ${(p) =>
    p.isMobile &&
    css`
      font-size: 10px;
    `}
`;
const Minute = styled.button`
  font-size: 14px;
  ${(p) =>
    p.isMobile &&
    css`
      font-size: 10px;
    `}/* letter-spacing: 1.4px; */
`;

const OptionAndTitleWrapper = styled.div`
  width: 61px;
  height: 83px;
  border-radius: 12px;

  ${layerA180Deg}
  ${flexDirectionColumn};

  position: absolute;
  z-index: 1000;
  overflow: hidden;
  padding: 2px 0;

  ${(p) =>
    p.isMobile &&
    css`
      width: 46px;
      height: 83px;
      top: 0;
    `}
`;

const OptionWrapper = styled.div`
  width: 53px;
  height: 60px;
  border-radius: 8px;

  ${layerADark};
  display: flex;
  flex-direction: column;

  overflow: auto;
  scroll-behavior: smooth;

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
    height: 60%;
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
      width: 38px;
      height: 60px;
      border-radius: 8px;
      ::-webkit-scrollbar {
        display: none;
      }
    `}
`;

const Title = styled.div`
  width: 53px;
  height: 14px;
  border-radius: 8px;

  ${layerADark};
  ${flexBoxCenter}
  font-size: 8px;
  text-align: center;
  color: #fff;

  ${(p) =>
    p.isMobile &&
    css`
      width: 38px;
      height: 14px;
    `}
`;

const DivisionWrapper = styled.div`
  height: 100%;

  ${flexDirectionColumn};

  ${(p) => p.isMobile && css``}
`;
const DivisionOuter = styled.div`
  width: 61px;
  height: 39px;

  border-radius: 12px;
  ${layerA180Deg};
  ${flexBoxCenter};

  ${(p) =>
    p.isMobile &&
    css`
      width: 43px;
      height: 63px;
      border-radius: 11px;
      ${flexDirectionColumn}
      padding: 2px 0;
    `}
`;
const DivisionInner = styled.div`
  width: 53px;
  height: 31px;
  border-radius: 8px;
  ${layerC};
  ${flexBoxCenter}

  ${(p) =>
    p.isMobile &&
    css`
      width: 37px;
      height: 24px;
      border-radius: 8px;
      ${layerADark}
    `}
`;

const Division = styled.button`
  font-size: 14px;
  letter-spacing: 1.4px;
  color: ${(p) => (p.isSelected ? '#ffff' : '#808080')};

  ${(p) =>
    p.isMobile &&
    css`
      font-size: 10px;
      letter-spacing: 1px;
    `}
`;

const WatchWrapper = styled.div`
  width: 100%;
  height: 180px;

  ${(p) =>
    p.isMobile &&
    css`
      height: 84px;
    `}
`;

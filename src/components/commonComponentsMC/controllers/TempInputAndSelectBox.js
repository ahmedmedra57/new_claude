import { useEffect } from 'react';

import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  justifyContentSpaceBetween,
  layerA180Deg,
  layerB,
  layerC,
} from '../../styles/commonStyles';

const TempInputAndSelectBox = ({
  unit,
  tempInput,
  setTempInput,
  currSchedule,
  setCurrSchedule,
  isFirstSchedule,
  scheduleNumber,
  scheduleList,
  editable,
}) => {
  // setTempInput to display saved temperature
  useEffect(() => {
    if (scheduleList[currSchedule].inputTemp) {
      if (unit) {
        setTempInput(`${scheduleList[currSchedule].inputTemp} °F`);
      } else {
        setTempInput(`${scheduleList[currSchedule].inputTemp} °C`);
      }
    } else {
      setTempInput('');
    }
  }, [currSchedule, scheduleList]);

  const handleSchedulerNumber = (id) => {
    if (id === 1) {
      // id '1'  move to previous schedule
      if (currSchedule > 0) {
        setCurrSchedule(currSchedule - 1);
      } else {
        return;
      }
    } else {
      // id '2' move to previous schedule
      if (currSchedule + 1 < scheduleNumber) {
        setCurrSchedule(currSchedule + 1);
      } else {
        return;
      }
    }
  };

  const leftArrowSrc = isFirstSchedule
    ? '/images/schedule-arrow-left-active.svg'
    : '/images/schedule-arrow-left.svg';

  const rightArrowSrc = isFirstSchedule
    ? '/images/schedule-arrow-right-active.svg'
    : '/images/schedule-arrow-right.svg';

  return (
    <Wrapper>
      <SectionInput>
        <InputWrapper>
          <Title>
            set<br></br>temp.
          </Title>
          <InputDegree
            type='text'
            placeholder={unit ? '0 °F' : '0 °C'}
            value={tempInput}
            onChange={(e) => editable && setTempInput(Number(e.target.value))}
          />
        </InputWrapper>
      </SectionInput>
      <SectionSelect>
        <SelectHole>
          <SelectTop>
            <ArrowButton
              isActivated={isFirstSchedule}
              onClick={() => handleSchedulerNumber(1)}
            >
              <Img src={leftArrowSrc} />
            </ArrowButton>
            <Title>schedule {currSchedule + 1}</Title>
            <ArrowButton
              isActivated={isFirstSchedule}
              onClick={() => handleSchedulerNumber(2)}
            >
              <Img src={rightArrowSrc} />
            </ArrowButton>
          </SelectTop>
        </SelectHole>
      </SectionSelect>
    </Wrapper>
  );
};

export default TempInputAndSelectBox;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  ${justifyContentSpaceBetween};
`;
const SectionInput = styled.section`
  width: 165px;
  height: 54px;
  border-radius: 27px;
  ${layerB};
  ${flexBoxCenter}
`;

const InputWrapper = styled.div`
  width: 161px;
  height: 50px;
  border-radius: 26px;

  ${layerA180Deg};
  ${justifyContentSpaceBetween};
  padding: 0 8px 0 10px;
`;
const Title = styled.span`
  font-size: 12px;
  letter-spacing: 1.2;
  text-align: left;
  color: #fcff01;
  /* line-height: 70%; */
`;
const InputDegree = styled.input`
  width: 86px;
  height: 36px;
  ${layerC}
  border-radius: 20px;
  text-align: center;
  font-size: 14px;
  letter-spacing: 1.4px;
  color: #fcff01;
  &::placeholder {
    color: #fcff01;
  }
`;
const SectionSelect = styled.section`
  width: 240px;
  height: 54px;
  border-radius: 27px;

  ${layerB};
  ${flexBoxCenter}
`;

const SelectHole = styled.div`
  width: 236px;
  height: 50px;
  border-radius: 26px;

  ${layerA180Deg};
  ${flexBoxCenter};
`;

const SelectTop = styled.div`
  width: 220px;
  height: 34px;
  background: #1b2b44;
  border: 1px solid #233a54;
  border-radius: 17px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px;
`;

const ArrowButton = styled.button`
  height: 100%;
  ${flexBoxCenter}

  ${(p) =>
    p.isActivated ||
    css`
      cursor: not-allowed;
    `}
`;
const Img = styled.img`
  height: 80%;
`;

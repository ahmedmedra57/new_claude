import styled, { css } from 'styled-components';
import { useEffect, useState } from 'react';
import GreenInfoBox from '../../../../common/GreenInfoBox';
import {
  flexBoxCenter,
  justifyContentSpaceBetween,
  justifyContentSpaceEvenly,
} from '../../../../../styles/commonStyles';
import ThermocoupleDropBox from '../ThermocoupleDropBox.js';

const SegmentContent = ({
  idx,
  id,
  title,
  consumption,
  usage,
  isOn,
  trackOpeningsHandler,
  isSection,
  isSegment,
  isZone,
}) => {
  const [arrowButtonImg, setArrowButtonImg] = useState(
    '/images/hp-ArrowRight-button.svg'
  );
  const [onOffButtonImg, setOnOffButtonImg] = useState(
    '/images/hp-off-button.svg'
  );

  useEffect(() => {
    if (isOn) {
      setOnOffButtonImg('/images/hp-on-button.svg');
    } else {
      setOnOffButtonImg('/images/hp-off-button.svg');
    }
  }, [isOn]);

  const onOffButtonHandler = () => {
    if (onOffButtonImg === '/images/hp-off-button.svg') {
      setOnOffButtonImg('/images/hp-on-button.svg');
    } else {
      setOnOffButtonImg('/images/hp-off-button.svg');
    }
  };
  const arrowButtonHandler = () => {
    if (arrowButtonImg === '/images/hp-ArrowRight-button.svg') {
      setArrowButtonImg('/images/hp-ArrowDown-button.svg');
      trackOpeningsHandler(idx);
    } else {
      setArrowButtonImg('/images/hp-ArrowRight-button.svg');
      trackOpeningsHandler(idx);
    }
  };

  const consumptionAndUsageData = [
    { id: 'energyConsumption', energyConsumption: consumption },
    { id: 'usageTime', usageTime: usage },
  ];

  return (
    <Wrapper>
      <MainFlexWrapper isZone={isZone} isSection={isSection}>
        <FlexWrapper first={'first'} isSection={isSection} isZone={isZone}>
          {isSection ? (
            <Dot></Dot>
          ) : (
            <Button onClick={arrowButtonHandler} id='arrow'>
              <Img src={arrowButtonImg} alt='arrow button' />
            </Button>
          )}
          {id && <Text>{id}</Text>}
          {isSegment ? (
            <Text>{title}</Text>
          ) : (
            <Text>
              <span>({title})</span>
            </Text>
          )}
          {isSection && <Dash>--------------------</Dash>}
        </FlexWrapper>
        {id && <ThermocoupleDropBox />}
        <FlexWrapper isSection={isSection}>
          {consumptionAndUsageData.map((el) => {
            if (el.id === 'energyConsumption') {
              return (
                <GreenInfoBox
                  key={el.id}
                  data={el.energyConsumption.energy}
                  energyType={el.energyConsumption.type}
                  energyUnit={el.energyConsumption.measurement}
                />
              );
            } else {
              return <GreenInfoBox key={el.id} data={el.usageTime} />;
            }
          })}
        </FlexWrapper>
      </MainFlexWrapper>
      <Button onClick={onOffButtonHandler} id='on-off' isOnOffButton={true}>
        <Img src={onOffButtonImg} alt='on-off button' />
      </Button>
    </Wrapper>
  );
};

export default SegmentContent;

const Wrapper = styled.section`
  width: 100%;
  height: 100%;
  ${justifyContentSpaceBetween}
`;

const MainFlexWrapper = styled.div`
  ${justifyContentSpaceEvenly}
  height: 100%;
  margin-left: 8px;
  ${({ isZone, isSection }) =>
    isZone
      ? css`
          width: 58%;
        `
      : isSection
      ? css`
          width: 60%;
          ${flexBoxCenter}
        `
      : css`
          width: 42%;
        `}
`;
const FlexWrapper = styled(MainFlexWrapper)`
  ${({ first }) =>
    first
      ? css`
          ${({ isSection, isZone }) =>
            isSection
              ? css`
                  width: 24%;
                `
              : isZone
              ? css`
                  width: 40%;
                `
              : css`
                  width: 32%;
                `}
        `
      : css`
          ${({ isSection }) =>
            isSection
              ? css`
                  width: 46%;
                `
              : css`
                  width: 70%;
                `}
        `}
`;

const Dot = styled.div`
  height: 8px;
  width: 8px;
  margin-right: 8px;
  border-radius: 50%;
  background-color: #fff;
`;

const Button = styled.button`
  ${({ isOnOffButton }) =>
    isOnOffButton &&
    css`
      margin-right: 4px;
    `}

  ${flexBoxCenter}
`;

const Img = styled.img``;

const Text = styled.span`
  /* ${({ isMainTitle }) =>
    isMainTitle
      ? css`
          font-size: 12px;
          letter-spacing: 1.2px;
        `
      : css`
          font-size: 8px;
          letter-spacing: 0.8px;
          min-width: 64px;
        `} */
  font-size: 8px;
  letter-spacing: 0.8px;
  min-width: 64px;
`;

const Dash = styled.p`
  font-size: 8px;
  margin-left: 4px;
`;

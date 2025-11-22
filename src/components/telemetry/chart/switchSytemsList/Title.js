import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  justifyContentSpaceBetween,
  layerADark,
} from '../../../styles/commonStyles';

const Title = ({ image, system, consumption, time, numUnits }) => {
  const splittedConsumption = consumption && consumption.split('vs');
  return (
    <Wrapper>
      <ImgPWrapper>
        <Img src={image ? image : undefined} />
        <P1>{system && system}</P1>
      </ImgPWrapper>
      <EnergyConsumption>
        <Span>{splittedConsumption[0] ?? ''}</Span>
        <Span>{splittedConsumption && 'vs'}</Span>
        <Span>{splittedConsumption[1] ?? ''}</Span>
      </EnergyConsumption>
      <P>{time && time}</P>
      <P>{numUnits && numUnits}</P>
    </Wrapper>
  );
};

export default Title;

const Wrapper = styled.div`
  width: 1192px;
  height: 30px;
  margin-top: 8px;

  ${layerADark}

  border-radius: 14px;
  opacity: 1;
  ${justifyContentSpaceBetween}
`;

const ImgPWrapper = styled.div`
  ${flexBoxCenter};
  flex-direction: row;
`;

const Img = styled.img`
  margin-left: 6px;
  margin-right: 4px;
`;

const EnergyConsumption = styled.div`
  width: fit-content;
  height: 12px;
`;

const Span = styled.span`
  text-align: left;
  font-size: 12px;
  letter-spacing: 1.2px;
  color: #ffff;
  opacity: 1;

  :nth-child(2) {
    text-transform: lowercase;
    margin: 0 4px 0 4px;
  }
`;

const P = styled.p`
  text-align: center;
  font-size: 12px;
  letter-spacing: 1.2px;
  color: #ffffff;
  opacity: 1;
  &:last-child {
    margin-right: 12px;
  }
`;

const P1 = styled.p`
  text-align: center;
  font-size: 12px;
  letter-spacing: 1.2px;
  color: #ffffff;
  opacity: 1;
`;

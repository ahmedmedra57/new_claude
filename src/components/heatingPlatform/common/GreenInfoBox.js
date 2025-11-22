import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  justifyContentSpaceAround,
  layerE,
} from '../../styles/commonStyles';

const GreenInfoBox = ({ energyType, data, energyUnit }) => {
  return (
    <Wrapper isEnergy={energyType}>
      {energyType ? (
        <FlexWrapper>
          <Text>{energyType} consumption</Text>
          <>
            <DisplayData>{data}</DisplayData>
            <MeasurementUnit>{energyUnit}</MeasurementUnit>
          </>
        </FlexWrapper>
      ) : (
        <FlexWrapper>
          <Text>hours of usage</Text>
          <>
            <DisplayData>{data}</DisplayData>
            <MeasurementUnit>hrs</MeasurementUnit>
          </>
        </FlexWrapper>
      )}
    </Wrapper>
  );
};

export default GreenInfoBox;

const Wrapper = styled.div`
  ${({ isEnergy }) =>
    isEnergy
      ? css`
          max-width: 200px;
          min-width: 164px;
        `
      : css`
          max-width: 200px;
          min-width: 136px;
        `}

  height: 20px;

  ${layerE}
  /* background-color: rgba(149, 255, 69, 0.2);
  box-shadow: 0px 0px 4px #000000; */
  border-radius: 12px;
  /* opacity: 0.2; */
`;

const FlexWrapper = styled.div`
  width: 100%;
  width: 100%;
  ${flexBoxCenter}
`;

const Text = styled.span`
  width: 60%;
  font-size: 8px;
  letter-spacing: 0.8px;

  color: #95ff45;
`;

const DisplayData = styled.span`
  font-size: 10px;
  color: #95ff45;
  letter-spacing: 1px;
`;

const MeasurementUnit = styled.span`
  font-size: 10px;
  color: #95ff45;
  letter-spacing: 1px;
`;

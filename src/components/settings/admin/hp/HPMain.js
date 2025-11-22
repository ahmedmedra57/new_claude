import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  justifyContentFlexStart,
  justifyContentSpaceAround,
  justifyContentSpaceEvenly,
  layerA,
  layerA180Deg,
  layerB,
} from '../../../styles/commonStyles';
import HPDropBox from './hpDropBox';
import SetTempBox from './temperatureBox/SetTempBox';
import WindFactorMain from './windFactor/WindFactorMain';

const HPMain = () => {
  const tempBoxesTitles = [
    'hp instant heat temperature',
    'ehp snow sensor trigger',
  ];

  return (
    <Wrapper>
      <WrapperTitle>
        <Title>set station temperature</Title>
      </WrapperTitle>
      <DropBoxWrapper>
        <HPDropBox />
      </DropBoxWrapper>
      {/* <ContentBaseLayer> */}
      <ContentWrapper>
        <Flex>
          {tempBoxesTitles.map((title, idx) => (
            <SetTempBoxWrapper key={idx}>
              <SetTempBox title={title} />
            </SetTempBoxWrapper>
          ))}
        </Flex>
        <WindFactorWrapper>
          <WindFactorMain />
        </WindFactorWrapper>
        <Flex singleBox={true}>
          <SetTempBoxWrapper>
            <SetTempBox title={'set heating schedule temperature'} />
          </SetTempBoxWrapper>
        </Flex>
      </ContentWrapper>
      {/* </ContentBaseLayer> */}
    </Wrapper>
  );
};

export default HPMain;

const Wrapper = styled.section`
  width: 851px;
  height: 582px;

  ${justifyContentSpaceEvenly}
  flex-direction: column;
`;

const DropBoxWrapper = styled.div`
  width: 100%;
  margin-left: 12px;
  ${justifyContentFlexStart}
`;

const WrapperTitle = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 271px;
          height: 32px;
          border-radius: 24px;
        `
      : css`
          width: 831px;
          height: 32px;
          border-radius: 16px;
        `}

  ${layerA}

  ${flexBoxCenter}
`;

const Title = styled.p`
  ${({ isMobile }) =>
    isMobile
      ? css``
      : css`
          margin-left: 8px;
        `}
  text-align: center;
  letter-spacing: 1.2px;
  font-size: 12px;
`;

const ContentBaseLayer = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          /* width: 281px;
          height: 788px; */
        `
      : css`
          width: 840x;
          height: 524px;
        `}

  ${layerB}

  border-radius: 9px;

  ${flexBoxCenter}
`;
const ContentWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          /* width: 279px;
          height: 786px; */
        `
      : css`
          width: 838px;
          height: 478px;
        `}

  /* ${layerA180Deg}
  border-radius: 8px; */

  border-radius: 7px;
  background: #233a54;
  box-shadow: 0px 0px 2px 0px #000 inset;

  ${justifyContentSpaceEvenly}
  flex-direction: column;
`;

const Flex = styled.div`
  width: 100%;

  ${({ singleBox }) =>
    singleBox
      ? css`
          ${justifyContentFlexStart}
        `
      : css`
          ${justifyContentSpaceAround}
        `}
`;

const SetTempBoxWrapper = styled.div`
  width: 414px;
  /* width: 415px; */
  height: 115px;

  :last-child {
    margin-left: 2px;
  }
`;
const WindFactorWrapper = styled.div``;

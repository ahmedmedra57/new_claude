import styled, { css } from 'styled-components';
import { useSelector } from 'react-redux';
import {
  borderABlue,
  borderC,
  flexBoxCenter,
  fontColorA,
  justifyContentFlexStart,
  justifyContentSpaceAround,
  justifyContentSpaceBetween,
  justifyContentSpaceEvenly,
  layerA,
  layerA180Deg,
  layerB,
} from '../../styles/commonStyles';
import { selectInterfaceMode } from '../../store/slices/settings/interfaceModeSlice';
import { useMediaQuery } from 'react-responsive';

function ImperialMetricMeasurementReader({
  value,
  index,
  metricImperialToggle,
  handleClick,
}) {
  // media query
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  const { title, temp, energy, measure, gas, backgroundColor } = value;

  const interfaceModeState = useSelector(selectInterfaceMode);
  const mode = interfaceModeState.InterfaceMode;

  return (
    <>
      {isMobile ? (
        <BaseLayer isMobile={true}>
          <Wrapper backgroundColor={backgroundColor} isMobile={true}>
            <ContainerOfTitle isMobile={true}>
              <OutsideRingGreenCircle
                onClick={() => handleClick(index)}
                isMobile={true}
              >
                <InsideFilledGreenCircle
                  isColor={index === metricImperialToggle}
                  isMobile={true}
                ></InsideFilledGreenCircle>
              </OutsideRingGreenCircle>

              <Span>{title}</Span>
            </ContainerOfTitle>
            <ContainerOfMeasurements isMobile={true}>
              <MeasurementsContainer isMobile={true}>
                <Container>
                  <Measurements isMobile={true}>temperature:</Measurements>
                  <IndividualContainer isMobile={true}>
                    <MeasureUnits isMobile={true}>{temp}</MeasureUnits>
                  </IndividualContainer>
                </Container>
                <Container>
                  <Measurements isMobile={true}>energy:</Measurements>
                  <IndividualContainer isMobile={true}>
                    <MeasureUnits isMobile={true}>{energy}</MeasureUnits>
                  </IndividualContainer>
                </Container>
                <Container>
                  <Measurements isMobile={true}>measurement:</Measurements>
                  <IndividualContainer isMobile={true}>
                    <MeasureUnits isMobile={true}>{measure}</MeasureUnits>
                  </IndividualContainer>
                </Container>
                <Container>
                  <Measurements isMobile={true}>
                    gas <br></br>consumption:
                  </Measurements>
                  <IndividualContainer isMobile={true}>
                    <MeasureUnits isMobile={true}>{gas}</MeasureUnits>
                  </IndividualContainer>
                </Container>
              </MeasurementsContainer>
            </ContainerOfMeasurements>
          </Wrapper>
        </BaseLayer>
      ) : (
        <BaseLayer>
          <Wrapper backgroundColor={backgroundColor}>
            <ContainerOfTitle>
              <OutsideRingGreenCircle onClick={() => handleClick(index)}>
                <InsideFilledGreenCircle
                  isColor={index === metricImperialToggle}
                ></InsideFilledGreenCircle>
              </OutsideRingGreenCircle>

              <Span>{title}</Span>
            </ContainerOfTitle>
            <ContainerOfMeasurements>
              <MeasurementsContainer>
                <Container>
                  <Measurements>temperature:</Measurements>
                  <IndividualContainer>
                    <MeasureUnits>{temp}</MeasureUnits>
                  </IndividualContainer>
                </Container>
                <Container>
                  <Measurements>energy:</Measurements>
                  <IndividualContainer>
                    <MeasureUnits>{energy}</MeasureUnits>
                  </IndividualContainer>
                </Container>
                <Container>
                  <Measurements>measurement:</Measurements>
                  <IndividualContainer>
                    <MeasureUnits>{measure}</MeasureUnits>
                  </IndividualContainer>
                </Container>
                <Container>
                  <Measurements>
                    GAS <br></br>consumption:
                  </Measurements>
                  <IndividualContainer>
                    <MeasureUnits>{gas}</MeasureUnits>
                  </IndividualContainer>
                </Container>
              </MeasurementsContainer>
            </ContainerOfMeasurements>
          </Wrapper>
        </BaseLayer>
      )}
    </>
  );
}

export default ImperialMetricMeasurementReader;

const BaseLayer = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 302px;
          height: 214px;
          border-radius: 22px;
        `
      : css`
          width: 418px;
          height: 191px;
          border-radius: 23px;
        `}

  ${layerB}

 

  ${flexBoxCenter};
`;

const Wrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 298px;
          height: 210px;
          border-radius: 20px;
          ${justifyContentSpaceEvenly}
        `
      : css`
          width: 414px;
          height: 187px;
          border-radius: 21px;
          ${justifyContentSpaceAround}
        `}

  ${layerA180Deg}


  flex-direction: column;
`;

const ContainerOfTitle = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 290px;
          height: 32px;
        `
      : css`
          width: 404px;
          height: 32px;
        `}

  ${layerA}
  ${borderABlue}

  border-radius: 16px;

  ${justifyContentFlexStart}
`;
const OutsideRingGreenCircle = styled.span`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 22px;
          height: 22px;
          margin-left: 5px;
        `
      : css`
          width: 28px;
          height: 28px;
          margin-left: 2px;
        `}
  cursor: pointer;

  border: 1px solid #95ff45;
  border-radius: 50%;
  ${flexBoxCenter}
`;

const InsideFilledGreenCircle = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 14px;
          height: 14px;
        `
      : css`
          width: 18px;
          height: 18px;
        `}

  background-color: ${({ isColor }) => (isColor ? '#95ff45' : 'none')};
  border-radius: 50%;
`;

const Span = styled.span`
  ${({ isMobile }) => (isMobile ? css`` : css``)}
  margin-left: 6px;
  font-size: 12rem;
  /* ${fontColorA} */
`;

const ContainerOfMeasurements = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 290px;
          height: 166px;
          ${borderC}
        `
      : css`
          width: 404px;
          height: 137px;
        `}

  ${layerA}

 

  border-radius: 16px;

  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const MeasurementsContainer = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 96.5%;
          height: 98%;

          justify-content: space-around;
        `
      : css`
          width: 98%;
          height: 98%;
          margin-top: 3px;
          margin-left: 4px;
          justify-content: space-between;
        `}

  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const Container = styled.div`
  ${justifyContentSpaceBetween}
`;

const Measurements = styled.p`
  ${({ isMobile }) => (isMobile ? css`` : css``)}
  font-size: 10px;
  margin-top: 4px;
  margin-bottom: 4px;
  margin-left: 2px;
  margin-right: 2px;
  /* ${fontColorA} */
`;

const IndividualContainer = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 140px;
          height: 32px;
          /* margin-right: 2px; */
        `
      : css`
          width: 311px;
          height: 28px;
        `}

  ${borderABlue}
  border-radius: 16px;

  display: flex;
  align-items: center;
`;

const MeasureUnits = styled.p`
  ${({ isMobile }) => (isMobile ? css`` : css``)}
  font-size: 10px;
  margin-left: 8px;
  /* ${fontColorA} */
`;

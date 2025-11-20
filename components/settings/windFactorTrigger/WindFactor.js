import { useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import { selectUnits } from '../../store/slices/settings/unitsSlice';
import {
  borderABlue,
  flexBoxCenter,
  justifyContentSpaceAround,
  justifyContentSpaceBetween,
  justifyContentSpaceEvenly,
  layerA,
  layerA180Deg,
  layerA90Deg,
} from '../../styles/commonStyles';
import { useMediaQuery } from 'react-responsive';

function WindFactor({
  contents,
  index,
  inputRef,
  handleOpenPasswordBox,
  isSignedIn,
}) {
  // media query
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  const unitsState = useUnitsStore();
  const { isF } = unitsState;

  return (
    <>
      {isMobile ? (
        <BaseLayer>
          <Wrapper isMobile={true}>
            <TitleContainer isMobile={true}>
              <Title isMobile={true}>{contents.title}</Title>
            </TitleContainer>

            <Container isMobile={true}>
              <SmallContainer isMobile={true}>
                <Wind isMobile={true}>
                  {isF ? contents.windMiles : contents.windKilo}{' '}
                  {isF ? 'miles/h' : 'km/h'}
                </Wind>
                <InputWrapper isMobile={true}>
                  {isSignedIn ? (
                    <Input
                      type='number'
                      placeholder='temp'
                      ref={inputRef}
                      isMobile={true}
                    ></Input>
                  ) : (
                    <FakeInput onClick={handleOpenPasswordBox}>temp</FakeInput>
                  )}
                  {isF ? '°f' : '°c'}
                </InputWrapper>
              </SmallContainer>
            </Container>
          </Wrapper>
        </BaseLayer>
      ) : (
        <Wrapper gradient={index === 0 ? true : index === 1 ? true : false}>
          <TitleContainer>
            <Title>{contents.title}</Title>
          </TitleContainer>

          <Container>
            <SmallContainer>
              <Wind>
                {isF ? contents.windMiles : contents.windKilo}{' '}
                {isF ? 'miles/h' : 'kilometers/h'}
              </Wind>
              <InputWrapper>
                {isSignedIn ? (
                  <Input type='number' placeholder='temp' ref={inputRef} />
                ) : (
                  <FakeInput onClick={handleOpenPasswordBox}>temp</FakeInput>
                )}
                {isF ? '°f' : '°c'}
              </InputWrapper>
            </SmallContainer>
          </Container>
        </Wrapper>
      )}
    </>
  );
}

export default WindFactor;

const BaseLayer = styled.div`
  width: 302px;
  height: 93px;
  ${layerA}

  border-radius: 22px;
  ${flexBoxCenter}
`;

const Wrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 298px;
          height: 89px;
          border-radius: 20px;
          ${layerA90Deg}
          ${justifyContentSpaceAround}
        `
      : css`
          width: 423px;
          height: 100px;
          border-radius: 5px;
          ${layerA180Deg}
          ${justifyContentSpaceEvenly}
        `}

  flex-direction: column;
`;

const TitleContainer = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 290px;
          height: 32px;
        `
      : css`
          width: 413px;
          height: 32px;
        `}

  border-radius: 16px;

  ${layerA}

  ${flexBoxCenter}
`;

const Title = styled.p`
  font-size: 12px;
  letter-spacing: 1.2px;
`;

const Container = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 290px;
          height: 38px;
          border-radius: 20px;
        `
      : css`
          width: 413px;
          height: 32px;
          border-radius: 21px;
        `}

  ${layerA}

  ${flexBoxCenter}
`;

const SmallContainer = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 284px;
          height: 32px;
          border-radius: 16px;
        `
      : css`
          width: 409px;
          height: 28px;
          border-radius: 19px;
        `}

  ${borderABlue}

  ${justifyContentSpaceBetween}
`;

const Wind = styled.span`
  ${({ isMobile }) =>
    isMobile
      ? css`
          font-size: 10px;
          margin-left: 6px;
          letter-spacing: 1px;
        `
      : css`
          font-size: 12px;
          margin-left: 6px;
        `}
`;

const InputWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 100px;

          font-size: 10px;
          /* ${flexBoxCenter} */
        `
      : css`
          height: 15px;
          font-size: 12px;
          margin-right: 6px;
          text-align: center;
          /* display: flex;
          justify-content: center;
          align-items: baseline; */
        `}
  ${flexBoxCenter}
`;

const Input = styled.input`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 70%;
        `
      : css`
          width: 44px;
          height: 15px;
          margin-right: 4px;

          &::-webkit-outer-spin-button,
          ::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
        `}
  background-color: transparent;
`;

const FakeInput = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 70%;
          color: #a9a9a9;
        `
      : css`
          width: 44px;
          height: 15px;
          margin-right: 4px;

          color: #a9a9a9;

          &::-webkit-outer-spin-button,
          ::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
        `}
  background-color: transparent;
`;

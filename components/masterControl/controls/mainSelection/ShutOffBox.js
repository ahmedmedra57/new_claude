import { useState } from 'react';
import { useMCStore } from '../../../zustand-stores';
import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentFlexEnd,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerB,
  messageBoxBackground,
} from '../../../styles/commonStyles';

import MessageButton from '../../userMessages/MessageButton';

function ShutOffBox({
  // handleOnClose,
  swt,
  tgsPrograms,
  essTesPrograms,
  clearSelectButtonHandler,
  buttons,
  selectPrograms,
  handleSelectionOfPrograms,
}) {
  // redux
  const mCState = useMCStore();
  const { tgs } = mCState.selectSystem;

  return (
    <Wrapper>
      <Wrapper1>
        <WrapperHeader>
          <TitleWrapper>
            <Title>shut off</Title>
          </TitleWrapper>
          <WrapperLogoAndEscButton>
            <WrapperEscButton>
              <EscButton onClick={(e) => clearSelectButtonHandler(e, 1)}>
                <IndentButton>
                  <ButtonTop>x</ButtonTop>
                </IndentButton>
              </EscButton>
            </WrapperEscButton>
          </WrapperLogoAndEscButton>
        </WrapperHeader>

        <WrapperAllPrograms>
          {tgs
            ? tgsPrograms?.map((value, index) => {
                return (
                  <WrapperEachProgram key={index} swt={swt} index={index}>
                    <WrapperImgName>
                      <ImageWrapper>
                        <Img src={value.img} />
                      </ImageWrapper>
                      <ProgramName>{value.title}</ProgramName>
                    </WrapperImgName>
                    <OutsideCircle
                      onClick={(e) =>
                        handleSelectionOfPrograms(e, value.title, swt)
                      }
                      swt={swt}
                      index={index}
                    >
                      <InsideCircle
                        greenCircle={selectPrograms}
                        index={index}
                      ></InsideCircle>
                    </OutsideCircle>
                  </WrapperEachProgram>
                );
              })
            : essTesPrograms?.map((value, index) => {
                return (
                  <WrapperEachProgram key={index}>
                    <WrapperImgName>
                      <ImageWrapper>
                        <Img src={value.img} />
                      </ImageWrapper>
                      <ProgramName>{value.title}</ProgramName>
                    </WrapperImgName>
                    <OutsideCircle
                      onClick={(e) =>
                        handleSelectionOfPrograms(e, value.title, swt)
                      }
                      swt={swt}
                      index={index}
                    >
                      <InsideCircle1
                        greenCircle={selectPrograms}
                        index={index}
                      ></InsideCircle1>
                    </OutsideCircle>
                  </WrapperEachProgram>
                );
              })}
        </WrapperAllPrograms>

        <WrapperButtons>
          {buttons?.map((value, index) => {
            return (
              <WrapperButton key={index}>
                <MessageButton
                  name={value}
                  buttonHandler={clearSelectButtonHandler}
                  index={index}
                />
              </WrapperButton>
            );
          })}
        </WrapperButtons>
      </Wrapper1>
    </Wrapper>
  );
}

export default ShutOffBox;

const Wrapper = styled.div`
  width: 402rem;
  height: auto;
  padding-top: 9rem;
  padding-bottom: 9rem;
  border-radius: 16rem;

  ${messageBoxBackground}
  ${flexBoxCenter}

  position: absolute;
  z-index: 100;
  top: 20rem;
`;
const Wrapper1 = styled.div`
  width: 384rem;
  height: auto;
  border-radius: 9rem;
  border: 0.5rem solid #000000;
  ${layerB}
  ${flexDirectionColumn}
  padding: 2px 0 5PX 0;
`;

const WrapperHeader = styled.div`
  width: 100%;
  padding: 0 5px;
  ${justifyContentSpaceBetween}
`;

const TitleWrapper = styled.div`
  width: 95%;
  border-bottom: 1rem solid #ffff;
  padding: 0 0 2px 2px;
`;

const Title = styled.p`
  text-align: left;
  font-size: 12rem;
  letter-spacing: 1.2rem;

  color: #ffffff;
`;

const WrapperLogoAndEscButton = styled.div`
  display: flex;
  flex-direction: row;
`;

const Logo = styled.img`
  padding: 2rem 0;
  margin-bottom: 4rem;
`;

const WrapperEscButton = styled.div`
  width: 26rem;
  height: 26rem;
  border-radius: 6rem;

  ${layerB}

  ${flexBoxCenter}
  margin-left: 6rem;
  margin-top: 4px;
`;

const EscButton = styled.button`
  width: 24rem;
  height: 24rem;
  border-radius: 5rem;

  ${layerA180Deg}
  ${flexBoxCenter}
`;

const IndentButton = styled.div`
  width: 20rem;
  height: 20rem;
  border-radius: 3rem;

  ${layerB}
  ${flexBoxCenter}
`;

const ButtonTop = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 2px;

  ${layerA180Deg}
  ${flexBoxCenter}
`;

const WrapperAllPrograms = styled.div`
  width: 97%;
  height: auto;
  margin-top: 16rem;
`;

const WrapperEachProgram = styled.div`
  width: 100%;
  height: 24rem;
  margin-bottom: 4rem;
  border-radius: 16rem;
  ${({ index, swt }) =>
    swt === 'tgs' && index === 3
      ? css`
          border: 1rem solid #3b3b3b;
        `
      : css`
          border: 1rem solid #233a54;
        `}

  ${justifyContentSpaceBetween}

  &:hover {
    ${layerA}
  }
`;

const WrapperImgName = styled.div`
  ${flexBoxCenter}
`;

const ImageWrapper = styled.div`
  height: 100%;
  width: 20px;
  ${flexBoxCenter}
  margin: 0 10px 0 4px;
`;
const Img = styled.img``;

const ProgramName = styled.p`
  text-align: left;
  font-size: 12rem;
  letter-spacing: 1.2rem;
  color: #ffffff;
`;

const OutsideCircle = styled.div`
  width: 18rem;
  height: 18rem;
  border-radius: 50%;
  margin-right: 3rem;

  ${({ index, swt }) =>
    swt === 'tgs' && index === 3
      ? css`
          border: 1rem solid #3b3b3b;
        `
      : css`
          border: 1rem solid #95ff45;
        `}

  ${flexBoxCenter}
  cursor: pointer;
`;

const InsideCircle = styled.div`
  width: 12rem;
  height: 12rem;
  border-radius: 50%;
  ${({ greenCircle, index }) =>
    greenCircle.instantHeat && index === 0
      ? css`
          background-color: #95ff45;
        `
      : greenCircle.isFanOnly && index === 1
      ? css`
          background-color: #95ff45;
        `
      : greenCircle.snowSensor && index === 2
      ? css`
          background-color: #95ff45;
        `
      : greenCircle.heatingSchedule && index === 4
      ? css`
          background-color: #95ff45;
        `
      : greenCircle.windFactor &&
        index === 5 &&
        css`
          background-color: #95ff45;
        `};
`;

const InsideCircle1 = styled.div`
  width: 12rem;
  height: 12rem;
  border-radius: 50%;
  ${({ greenCircle, index }) =>
    greenCircle.instantHeat && index === 0
      ? css`
          background-color: #95ff45;
        `
      : greenCircle.snowSensor && index === 1
      ? css`
          background-color: #95ff45;
        `
      : greenCircle.optionalConstantTemp && index === 2
      ? css`
          background-color: #95ff45;
        `
      : greenCircle.heatingSchedule && index === 3
      ? css`
          background-color: #95ff45;
        `
      : greenCircle.windFactor &&
        index === 4 &&
        css`
          background-color: #95ff45;
        `};
`;

const WrapperButtons = styled.div`
  width: 97%;
  height: auto;

  ${justifyContentFlexEnd}
  margin-top: 8px;
  margin-bottom: 4px;
`;

const WrapperButton = styled.div`
  margin-left: 6rem;
`;

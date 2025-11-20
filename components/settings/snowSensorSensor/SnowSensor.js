import styled, { css } from 'styled-components';
import {
  borderABlue,
  borderADisabled,
  flexBoxCenter,
  justifyContentSpaceAround,
  layerA,
  layerA180Deg,
  layerA90Deg,
  layerADisabled180Deg,
  layerBDisabled,
} from '../../styles/commonStyles';
import { useMediaQuery } from 'react-responsive';
import { useState } from 'react';
import { useUnitsStore } from '../../zustand-stores';

function SnowSensor({ title, inputRef, isActive, index }) {
  // media query
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  const unitsState = useUnitsStore();
  const { isF } = unitsState;

  const [width, setWidth] = useState([false, false, false]);

  return (
    <>
      {isMobile ? (
        <BaseLayer>
          <Wrapper isActive={isActive} isMobile={true}>
            <TitleContainer isActive={isActive} isMobile={true}>
              <Title isActive={isActive} isMobile={true}>
                {title}
              </Title>
            </TitleContainer>
            <ValueContainer isActive={isActive} isMobile={true}>
              <SmallContainer isActive={isActive} isMobile={true}>
                <Temperature isActive={isActive} isMobile={true}>
                  {isActive ? (
                    <Input
                      isActive={isActive}
                      ref={inputRef}
                      index={0}
                      type='number'
                      placeholder='enter temperature'
                      isMobile={true}
                    ></Input>
                  ) : (
                    <FakeInput>0</FakeInput>
                  )}
                  {isF ? '°f' : '°c'}
                </Temperature>
              </SmallContainer>
            </ValueContainer>
          </Wrapper>
        </BaseLayer>
      ) : (
        <Wrapper isActive={isActive}>
          <TitleContainer isActive={isActive}>
            <Title isActive={isActive}>{title}</Title>
          </TitleContainer>
          <ValueContainer isActive={isActive}>
            <SmallContainer isActive={isActive}>
              <Temperature isActive={isActive}>
                {isActive ? (
                  <Input
                    isActive={isActive}
                    ref={inputRef}
                    index={0}
                    type='number'
                    placeholder='enter temperature'
                    onFocus={() => {
                      const copyWidth = [...width];
                      copyWidth[index] = true;
                      setWidth(copyWidth);
                    }}
                    isWidth={width[index]}
                    isRef={inputRef.current && inputRef.current.value && true}
                  ></Input>
                ) : (
                  <FakeInput>0</FakeInput>
                )}
                {isF ? '°f' : '°c'}
              </Temperature>
            </SmallContainer>
          </ValueContainer>
        </Wrapper>
      )}
    </>
  );
}

export default SnowSensor;

const BaseLayer = styled.div`
  width: 302px;
  height: 93px;
  ${layerA}

  border-radius: 22px;
  ${flexBoxCenter}
`;

const Wrapper = styled.div`
  ${layerADisabled180Deg}
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 298px;
          height: 89px;
          border-radius: 20px;
          ${({ isActive }) =>
            isActive &&
            css`
              ${layerA90Deg}
            `}
        `
      : css`
          width: 423px;
          height: 100px;
          border-radius: 5px;
          flex-wrap: wrap;
          ${({ isActive }) =>
            isActive &&
            css`
              ${layerA180Deg}
            `}
        `}

          
          ${justifyContentSpaceAround}
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

  ${({ isActive }) =>
    isActive
      ? css`
          ${layerA}
        `
      : css`
          ${layerBDisabled}
        `}

  ${flexBoxCenter}
`;

const Title = styled.p`
  font-size: 12rem;
  letter-spacing: 1.2px;

  ${({ isActive }) =>
    isActive &&
    css`
      color: #ffffff;
    `}
`;

const ValueContainer = styled.div`
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
          border-radius: 16px;
        `}

  ${({ isActive }) =>
    isActive
      ? css`
          ${layerA}
        `
      : css`
          ${layerBDisabled}
        `}
        ${flexBoxCenter}
`;

const SmallContainer = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 284px;
          height: 32px;
        `
      : css`
          width: 409px;
          height: 28px;
        `}
  border-radius: 16px;

  ${({ isActive }) =>
    isActive
      ? css`
          ${borderABlue}
        `
      : css`
          ${borderADisabled}
        `}
  ${flexBoxCenter}
`;

const Temperature = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          font-size: 10px;
          margin-left: 6px;
          letter-spacing: 1px;
        `
      : css`
          font-size: 12px;
          ${flexBoxCenter}
        `}

  ${({ isActive }) =>
    isActive
      ? css`
          color: #ffffff;
        `
      : css`
          /* ${layerBDisabled}
          color: #ffffff; */
        `}
`;

const Input = styled.input`
  ${({ isWidth, isRef }) =>
    (isWidth || isRef) &&
    css`
      &::-webkit-input-placeholder {
        color: transparent;
      }
      max-width: 34px;
    `}

  &::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  background: transparent;
`;

const FakeInput = styled.span`
  width: auto;
  height: auto;
  margin-right: 2rem;

  background: transparent;
`;

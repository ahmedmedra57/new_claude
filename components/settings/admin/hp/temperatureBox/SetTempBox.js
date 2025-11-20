import { useRef } from 'react';
import { useUnitsStore } from '../../../../zustand-stores';
import styled, { css } from 'styled-components';
import {
  borderABlue,
  flexBoxCenter,
  justifyContentSpaceAround,
  justifyContentSpaceEvenly,
  layerDegHPD,
  layerHPA,
} from '../../../../styles/commonStyles';
import { useSelector } from 'react-redux';
import { selectUnits } from '../../../../store/slices/settings/unitsSlice';

const SetTempBox = ({ isWindFactor, title, windSpeed }) => {
  const tempRef = useRef('');

  const unitsState = useUnitsStore();
  const { isF } = unitsState;

  return (
    <Wrapper>
      <TitleBox isWindFactor={isWindFactor}>
        <Title>{title}</Title>
      </TitleBox>
      <TempBoxBaseWrapper isWindFactor={isWindFactor}>
        <TempBoxWrapper isWindFactor={isWindFactor}>
          <InputBaseWrapper isWindFactor={isWindFactor}>
            <InputBox isWindFactor={isWindFactor}>
              {isWindFactor && <WindSpeedText>{windSpeed}</WindSpeedText>}
              <Label>
                <Input name='myTemperature' ref={tempRef} />
                <LabelText>{isF ? '°f' : '°c'}</LabelText>
              </Label>
            </InputBox>
          </InputBaseWrapper>
        </TempBoxWrapper>
      </TempBoxBaseWrapper>
    </Wrapper>
  );
};

export default SetTempBox;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  border-radius: 5px;
  ${layerDegHPD}
  /* border: 0.5px solid #000;
  background: var(
    --Gradiente-umbrella,
    linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
    linear-gradient(180deg, #233a54 0%, #233a54 44%, #060d19 100%)
  ); */

  ${justifyContentSpaceEvenly}
  flex-direction: column;
`;

const TitleBox = styled.div`
  width: 397px;
  height: 26px;

  border-radius: 13px;
  ${layerHPA}
  /* background: #233a54;
  box-shadow: 0px 0px 2px 0px #000 inset; */
  ${flexBoxCenter}

  ${({ isWindFactor }) =>
    isWindFactor &&
    css`
      width: 392px;
      height: 24px;
    `}
`;

const Title = styled.p`
  font-size: 14px;
`;

const TempBoxBaseWrapper = styled.div`
  width: 395px;
  height: 59px;

  border-radius: 7px;
  ${layerHPA}
  /* background: #233a54;
  box-shadow: 0px 0px 2px 0px #000 inset; */
  ${flexBoxCenter}

  ${({ isWindFactor }) =>
    isWindFactor &&
    css`
      width: 391px;
      height: 56px;
    `}
`;

const TempBoxWrapper = styled.div`
  width: 387px;
  height: 51px;

  border-radius: 4px;
  ${layerDegHPD}
  /* border: 0.5px solid #000;
  background: var(
    --Gradiente-umbrella,
    linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
    linear-gradient(180deg, #233a54 0%, #233a54 44%, #060d19 100%)
  );
 */
  box-shadow: 0px 0px 2px 0px #000;
  ${flexBoxCenter}

  ${({ isWindFactor }) =>
    isWindFactor &&
    css`
      width: 383px;
      height: 48px;
    `}
`;

const InputBaseWrapper = styled.div`
  width: 371px;
  height: 35px;

  border-radius: 18px;
  ${layerHPA}
  /* background: #233a54;
  box-shadow: 0px 0px 2px 0px #000 inset; */
  ${flexBoxCenter}

  ${({ isWindFactor }) =>
    isWindFactor &&
    css`
      width: 368px;
      height: 32px;
    `}
`;

const InputBox = styled.div`
  width: 363px;
  height: 27px;

  border-radius: 14px;
  ${borderABlue}
  /* border: 1px solid var(--DARK-BLUE, #142033); */

  ${({ isWindFactor }) =>
    isWindFactor
      ? css`
          width: 355px;
          height: 22px;

          ${justifyContentSpaceAround}
        `
      : css`
          ${flexBoxCenter}
        `}
`;

const WindSpeedText = styled.span`
  width: 50%;
  font-size: 12px;
  ${flexBoxCenter}
`;

const Label = styled.label`
  ${flexBoxCenter}
`;

const Input = styled.input`
  width: 50%;
  font-size: 12px;
  background-color: transparent;
  text-align: right;
`;

const LabelText = styled.span`
  width: 50%;
  font-size: 12px;
`;

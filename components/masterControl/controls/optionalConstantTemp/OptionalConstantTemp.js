import { useState, useEffect } from 'react';
import { useUnitsStore } from '../../../zustand-stores';

import styled, { css } from 'styled-components';
import {
  MC_SELECTED,
  MC_SELECTED_READY,
  activeInput,
  activeLayer180Deg,
  flexBoxCenter,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerADark,
  layerADisabled180Deg,
  layerBDisabled,
  readyTop180Deg,
} from '../../../styles/commonStyles';
import { selectUnits } from '../../../store/slices/settings/unitsSlice';

const OptionalConstantTemp = ({
  isSelected,
  isTgs,
  handleSelect,
  buttonHandler,
  tempInput,
  setTempInput,
  isActivated,
  isReadyToDispatch,
  isEditable,
  handleCreateNewCommandMessageBox,
  setDisplayMessageBox,
  setMessage,
  setMessageTitle,
  isDialSysDisabled,
  isInstantHeatActive,
  setSubtitle,
}) => {
  const unitsStatus = useUnitsStore();
  const { isF } = unitsStatus;
  const unit = isF ? `°F` : `°C`;

  // const [selected, setSelected] = useState(isSelected);
  const [title, setTitle] = useState('select');

  const [src, setSrc] = useState('');

  useEffect(() => {
    // '/images/bg-optionalConstantTemp-blue-focus.svg'
    // '/images/bg-optionalConstantTemp-ready.svg'

    if (isTgs) {
      setSrc('/images/bg-optionalConstantTemp-disabled.svg');
    } else if (isInstantHeatActive && isActivated) {
      setSrc('/images/bg-optionalConstantTemp-ready.svg');
    } else if (isInstantHeatActive && isReadyToDispatch) {
      setTitle('selected');
      setSrc('/images/bg-optionalConstantTemp-focus.svg');
    } else if (isActivated) {
      setSrc('/images/bg-optionalConstantTemp-active.svg');
    } else if (isReadyToDispatch) {
      setTitle('selected');
      setSrc('/images/bg-optionalConstantTemp-green-focus.svg');
    } else {
      setSrc('/images/bg-optionalConstantTemp-none.svg');
      setTitle('select');
    }
  }, [isReadyToDispatch, isActivated, isTgs, isInstantHeatActive]);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (isSelected) {
      if (isReadyToDispatch) {
        setTempInput(``);
        buttonHandler('constantTemp', 'off');
      } else {
        const temp = Number(tempInput);
        if (tempInput) {
          if (isF) {
            if (temp > 76 && temp < 249) {
              buttonHandler('constantTemp', 'on');

              setTempInput(`${temp} °F`);
            } else {
              setTempInput('');
              // message logic
              buttonHandler('constantTemp', 'message');
              handleMessageBox(
                'master control',
                [
                  'wrong temperature',
                  'please input temperature between 76°F and 249°F  ',
                ],
                'controls'
              );
            }
          } else {
            if (temp > 24 && temp < 121) {
              setTempInput(`${temp} °C`);
              // id === instantHeat, state, scope, temp
              buttonHandler('constantTemp', 'on');

              setTempInput(`${temp} °C`);
            } else {
              setTempInput('');
              buttonHandler('constantTemp', 'message');
              handleMessageBox(
                'master control',
                [
                  'wrong temperature',
                  'please input temperature between 24°C and 121°C  ',
                ],
                'controls'
              );
            }
          }
        } else {
          handleMessageBox(
            'master control',
            ['temperature missing', 'please input temperature '],
            'controls'
          );
          return;
        }
      }
    } else if (!isEditable) {
      handleCreateNewCommandMessageBox();
    }
  };

  const select = () => {
    if (isSelected) {
      if (!isEditable) {
        handleCreateNewCommandMessageBox();
      }
    } else {
      handleSelect();
    }
  };

  const handleMessageBox = (swtName, message, subtitle) => {
    setMessage(message);
    setMessageTitle(swtName);
    setDisplayMessageBox(true);
    setSubtitle(subtitle);
  };

  return (
    <Wrapper
      onClick={() => {
        isTgs || select();
      }}
    >
      <Img src={src} />

      <ContentsPositionAbsolute>
        <ControllerTitle
          applyWhenInstantHeatActive={isInstantHeatActive && isActivated}
          apply={isActivated}
          disabled={isTgs}
        >
          <Title>optional constant temperature program</Title>
          <Icon
            src={
              isTgs
                ? '/images/logo-constantTemp-disabled.svg'
                : '/images/logo-constantTemp.svg'
            }
          />
        </ControllerTitle>
        <ContentsWrapperHole
          onSubmit={handleOnSubmit}
          applyWhenInstantHeatActive={isInstantHeatActive && isActivated}
          apply={isActivated}
          disabled={isTgs}
        >
          <SectionInput>
            <Title disabled={isTgs}>input temp</Title>
            <InputWrapper
              applyWhenInstantHeatActive={isInstantHeatActive && isActivated}
              apply={isActivated}
              disabled={isTgs}
            >
              <TempInput
                type='text'
                placeholder={`---${unit}`}
                onChange={(e) =>
                  isDialSysDisabled
                    ? handleMessageBox(
                        'master control',
                        [
                          'm.c. shut off',
                          "can't be used another action with deactivate",
                        ],
                        'deactivate'
                      )
                    : isSelected && setTempInput(e.target.value)
                }
                value={tempInput}
                applyWhenInstantHeatActive={isInstantHeatActive && isActivated}
                apply={isActivated}
                disabled={isTgs}
              />
            </InputWrapper>
          </SectionInput>

          <SectionButton>
            <ButtonWrapper
              onClick={handleOnSubmit}
              apply={isActivated}
              applyWhenInstantHeatActive={isInstantHeatActive && isActivated}
              disabled={isTgs}
              isReadyToDispatch={isReadyToDispatch}
              isSelectedToDispatch={isInstantHeatActive && isReadyToDispatch}
            >
              <ButtonHole
                applyWhenInstantHeatActive={isInstantHeatActive && isActivated}
                apply={isActivated}
                disabled={isTgs}
              >
                <ButtonTop
                  applyWhenInstantHeatActive={
                    isInstantHeatActive && isActivated
                  }
                  apply={isActivated}
                  disabled={isTgs}
                >
                  {title}
                </ButtonTop>
              </ButtonHole>
            </ButtonWrapper>
          </SectionButton>
        </ContentsWrapperHole>
      </ContentsPositionAbsolute>
    </Wrapper>
  );
};

export default OptionalConstantTemp;

const Wrapper = styled.div`
  width: 55%;
  margin-left: 296px;
  margin-top: -5px;

  position: relative;
`;

const Img = styled.img``;

const ControllerTitle = styled.div`
  width: 318px;
  height: 22px;
  border-radius: 11px;

  ${layerADark}
  ${justifyContentSpaceBetween}
  

  padding: 0 2px 0 10px;

  ${(p) =>
    p.applyWhenInstantHeatActive
      ? css`
          ${layerADark}
        `
      : p.apply &&
        css`
          ${activeInput};
        `}

  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled};
    `}
`;

const Title = styled.span`
  font-size: 8px;
  ${(p) =>
    p.disabled &&
    css`
      color: #808080;
    `}
`;

const Icon = styled.img`
  height: 95%;
`;

const ContentsPositionAbsolute = styled.div`
  width: 350px;
  position: absolute;

  /* border: 1px solid green; */
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  top: 7rem;
  left: 16rem;
`;

const ContentsWrapperHole = styled.form`
  margin-top: 3rem;
  margin-left: 0rem;

  width: 318px;
  height: 48px;
  border-radius: 24px;
  ${layerA}
  ${justifyContentSpaceBetween}

  padding: 0 2rem 0 10rem;

  ${(p) =>
    p.applyWhenInstantHeatActive
      ? css`
          ${layerADark}
        `
      : p.apply &&
        css`
          ${activeInput};
        `}

  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled}
    `}
`;

const SectionInput = styled.section`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 2rem;
`;

const InputWrapper = styled.div`
  width: 141px;
  height: 25px;
  border-radius: 22px;

  ${layerA180Deg}
  ${flexBoxCenter}
  margin-top: 5rem;

  ${(p) =>
    p.applyWhenInstantHeatActive
      ? css`
          ${readyTop180Deg}
        `
      : p.apply &&
        css`
          ${activeLayer180Deg};
        `}

  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg};
    `}
`;
const TempInput = styled.input`
  width: 133px;
  height: 17px;

  ${layerADark}
  border-radius: 18px;
  font-size: 10px;
  ::placeholder {
    color: #fff;
    ${(p) =>
      p.disabled &&
      css`
        color: #808080;
      `}
  }
  ${(p) =>
    p.applyWhenInstantHeatActive
      ? css`
          ${layerADark}
        `
      : p.apply &&
        css`
          ${activeInput}
        `}

  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled}
    `}
`;
const SectionButton = styled.section`
  height: 100%;
  ${flexBoxCenter}
`;
const ButtonWrapper = styled.button`
  width: 154px;
  height: 44px;

  ${layerA180Deg}

  /* activated */
  /* border: 0.5px solid #95ff45; */
  border-radius: 25px;

  ${flexBoxCenter}

  ${(p) =>
    p.isSelectedToDispatch
      ? css`
          ${MC_SELECTED_READY}
        `
      : p.isReadyToDispatch &&
        css`
          ${MC_SELECTED}
        `}

  ${(p) =>
    p.applyWhenInstantHeatActive
      ? css`
          ${readyTop180Deg}
        `
      : p.apply &&
        css`
          ${activeLayer180Deg};
        `}

    ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg};
    `}
`;
const ButtonHole = styled.div`
  width: 139px;
  height: 32px;

  ${layerA}
  border-radius: 18px;

  ${flexBoxCenter}
  ${(p) =>
    p.applyWhenInstantHeatActive
      ? css`
          ${readyTop180Deg}
        `
      : p.apply &&
        css`
          ${activeInput};
        `}

    ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled};
    `}
`;
const ButtonTop = styled.span`
  width: 137px;
  height: 30px;

  ${layerA180Deg}
  border-radius: 25px;

  ${flexBoxCenter}

  ${(p) =>
    p.applyWhenInstantHeatActive
      ? css`
          ${readyTop180Deg}
        `
      : p.apply &&
        css`
          ${activeLayer180Deg};
        `}

    font-size:12rem;

  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg};
    `}
`;

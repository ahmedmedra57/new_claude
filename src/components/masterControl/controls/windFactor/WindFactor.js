import { useEffect, useState } from 'react';

import styled, { css } from 'styled-components';
import {
  MC_SELECTED_READY,
  flexBoxCenter,
  justifyContentSpaceBetween,
  layerA180Deg,
  layerADark,
  layerBDark,
  layerCLighter,
} from '../../../styles/commonStyles';

const WindFactor = ({
  isSelected,
  isReady,
  handleSelect,
  buttonHandler,
  isReadyToDispatch,

  isEditable,
  handleCreateNewCommandMessageBox,
  isDialSysDisabled,
  handleMessageBox,
}) => {
  const [src, setSrc] = useState('');

  const [title, setTitle] = useState('select');

  useEffect(() => {
    if (isReady) {
      setSrc('/images/bg-windFactor-ready.svg');
    } else if (isReadyToDispatch) {
      setSrc('/images/bg-windFactor-focus.svg');
      setTitle('selected');
    } else {
      setSrc('/images/bg-windFactor-none.svg');
      setTitle('select');
    }
  }, [isReadyToDispatch, isReady]);

  const handleOnSubmit = () => {
    if (isSelected) {
      if (isReadyToDispatch) {
        buttonHandler('windFactor', 'off');
      } else {
        buttonHandler('windFactor', 'on');
      }
    } else if (!isEditable) {
      handleCreateNewCommandMessageBox();
    }
  };
  const select = () => {
    if (!isEditable) {
      handleCreateNewCommandMessageBox();
    } else {
      handleSelect();
    }
  };

  return (
    <Wrapper onClick={() => isSelected || select()}>
      <Img src={src} />

      <ContentsPositionAbsolute>
        <ControllerTitle ready={isReady}>
          <Title>wind factor program</Title>
          <Icon src='/images/logo-windFactor.svg' />
        </ControllerTitle>

        <ButtonWrapper
          onClick={(e) =>
            isDialSysDisabled
              ? handleMessageBox(
                  'master control',
                  [
                    'm.c. shut off',
                    "can't be used another action with deactivate",
                  ],
                  'deactivate'
                )
              : isSelected && handleOnSubmit(e)
          }
          ready={isReady}
        >
          <ButtonOuterHole
            ready={isReady}
            isReadyToDispatch={isReadyToDispatch}
          >
            <ButtonInnerWrapper ready={isReady}>
              <ButtonTop ready={isReady}>{title}</ButtonTop>
            </ButtonInnerWrapper>
          </ButtonOuterHole>
        </ButtonWrapper>
      </ContentsPositionAbsolute>
    </Wrapper>
  );
};

export default WindFactor;

const Wrapper = styled.div`
  width: 65%;
  margin-left: 210rem;
  margin-top: -5rem;

  position: relative;
`;

const Img = styled.img``;

const ControllerTitle = styled.div`
  width: 349px;
  height: 22px;
  border-radius: 11px;
  ${layerADark}
  ${justifyContentSpaceBetween}

  padding: 0 2px 0 10px;
  margin-left: 22rem;

  ${(p) =>
    p.ready &&
    css`
      ${layerADark}
    `}

  ${(p) =>
    p.apply &&
    css`
      background: #124000 0% 0%;
      box-shadow: inset 0px 0px 6px #000000;
    `}
`;

const Title = styled.span`
  font-size: 8px;
`;

const Icon = styled.img`
  height: 95%;
`;

const ContentsPositionAbsolute = styled.div`
  width: 400px;
  position: absolute;

  /* border: 1px solid green; */
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  top: 7rem;
  left: 30rem;
`;

const ButtonWrapper = styled.button`
  margin-top: 4rem;

  width: 362px;
  height: 27px;
  border-radius: 18px;
  ${layerBDark}
  ${flexBoxCenter}

  ${(p) =>
    p.ready &&
    css`
      background: transparent linear-gradient(180deg, #1e7fc1 0%, #001640 100%);
      box-shadow: inset 0px 0px 6px #000000;
    `}

    ${(p) =>
    p.apply &&
    css`
      background: #124000;
      box-shadow: inset 0px 0px 2px #000000;
    `}
`;
const ButtonOuterHole = styled.div`
  width: 360px;
  height: 25px;
  border-radius: 25px;
  ${layerA180Deg}
  ${flexBoxCenter}

  ${(p) =>
    p.isReadyToDispatch &&
    css`
      ${MC_SELECTED_READY};
    `}

  ${(p) =>
    p.ready &&
    css`
      background: transparent linear-gradient(180deg, #1e7fc1 0%, #001640 100%)
        0% 0%;
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid #000000;
    `}

    ${(p) =>
    p.apply &&
    css`
      background: transparent linear-gradient(180deg, #4baf00 0%, #124000 100%)
        0% 0% no-repeat padding-box;
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid #000000;
    `}
`;
const ButtonInnerWrapper = styled.div`
  width: 352px;
  height: 17px;
  border-radius: 18px;
  ${layerCLighter}
  ${flexBoxCenter}

  ${(p) =>
    p.ready &&
    css`
      ${layerADark}
    `}

    ${(p) =>
    p.apply &&
    css`
      background: #124000;
      box-shadow: inset 0px 0px 1px #000000;
    `}
`;
const ButtonTop = styled.span`
  width: 350px;
  height: 15px;
  border-radius: 25px;
  ${layerA180Deg}
  font-size: 10px;

  ${(p) =>
    p.ready &&
    css`
      background: transparent linear-gradient(180deg, #1e7fc1 0%, #001640 100%)
        0% 0%;
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid #000000;
    `}

  ${(p) =>
    p.apply &&
    css`
      background: transparent linear-gradient(180deg, #4baf00 0%, #124000 100%)
        0% 0% no-repeat padding-box;
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid #000000;
    `}
`;

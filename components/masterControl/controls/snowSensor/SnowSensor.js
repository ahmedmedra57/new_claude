import { useState, useEffect } from 'react';

import styled, { css } from 'styled-components';
import {
  MC_SELECTED_READY,
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerADark,
} from '../../../styles/commonStyles';

const SnowSensor = ({
  isSelected,
  isReady,
  handleSelect,
  buttonHandler,
  isReadyToDispatch,
  isF,
  isEditable,
  handleCreateNewCommandMessageBox,
  isDialSysDisabled,
  handleMessageBox,
}) => {
  const [src, setSrc] = useState('');

  const [title, setTitle] = useState('select');

  useEffect(() => {
    if (isReady) {
      setSrc('/images/bg-snowSensor-ready.svg');
    } else if (isReadyToDispatch) {
      setSrc('/images/bg-snowSensor-focus.svg');
      setTitle('selected');
    } else {
      setSrc('/images/bg-snowSensor-none.svg');
      setTitle('select');
    }
  }, [isReadyToDispatch, isReady]);

  const handleOnClick = () => {
    if (isSelected) {
      if (isReadyToDispatch) {
        buttonHandler('snowSensor', 'off');
      } else {
        buttonHandler('snowSensor', 'on');
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
          <Title>snow sensor program</Title>
          <Icon src='/images/logo-snowSensor.svg' />
        </ControllerTitle>
        <ContentsWrapperHole ready={isReady}>
          <SectionDefaultTemp>
            <DefaultTempWrapper ready={isReady}>
              <DefaultTempTop ready={isReady}>
                <DefaultTitle>
                  default trigger <br></br>temperature
                </DefaultTitle>
                <Divider />
                <Temp>{isF ? '662 °F' : '350 °C'}</Temp>
              </DefaultTempTop>
            </DefaultTempWrapper>
          </SectionDefaultTemp>

          <SectionButton>
            <ButtonWrapper
              onClick={() =>
                isDialSysDisabled
                  ? handleMessageBox(
                      'master control',
                      [
                        'm.c. shut off',
                        "can't be used another action with deactivate",
                      ],
                      'deactivate'
                    )
                  : handleOnClick()
              }
              ready={isReady}
              // active={activated}
              isReadyToDispatch={isReadyToDispatch}
            >
              <ButtonHole ready={isReady}>
                <ButtonTop ready={isReady}>{title}</ButtonTop>
              </ButtonHole>
            </ButtonWrapper>
          </SectionButton>
        </ContentsWrapperHole>
      </ContentsPositionAbsolute>
    </Wrapper>
  );
};

export default SnowSensor;

const Wrapper = styled.div`
  width: 50%;
  margin-left: 262rem;
  margin-top: -5rem;

  position: relative;
`;

const Img = styled.img``;

const ContentsPositionAbsolute = styled.div`
  width: 350px;
  position: absolute;

  /* border: 1px solid green; */
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  top: 10rem;
  left: 18rem;
`;

const ControllerTitle = styled.div`
  width: 338px;
  height: 22px;
  border-radius: 11px;
  ${layerADark}
  ${justifyContentSpaceBetween}

  padding: 0 2px 0 10px;

  ${(p) =>
    p.ready &&
    css`
      ${layerADark}
    `}
  ${(p) => p.active && css``}
`;

const Title = styled.span`
  font-size: 8px;
`;

const Icon = styled.img`
  height: 95%;
`;

const ContentsWrapperHole = styled.div`
  margin-top: 2rem;
  margin-left: 20rem;

  width: 326px;
  height: 48px;

  border-radius: 24px;

  ${layerA}
  ${justifyContentSpaceBetween}
  padding: 0 2rem 0 3rem;

  ${(p) =>
    p.ready &&
    css`
      background: #233a54;
      box-shadow: inset 0px 0px 6px #000000;
    `}

  ${(p) => p.active && css``}
`;

const SectionDefaultTemp = styled.div``;
const DefaultTempWrapper = styled.div`
  width: 151px;
  height: 44px;
  border-radius: 22px;

  ${layerA180Deg}
  ${flexBoxCenter}

  ${(p) =>
    p.ready &&
    css`
      background: transparent linear-gradient(180deg, #1e7fc1 0%, #001640 100%);
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid #000000;
    `}

    ${(p) => p.active && css``}
`;
const DefaultTempTop = styled.div`
  width: 143px;
  height: 36px;
  border-radius: 18px;

  ${layerADark}
  ${flexDirectionColumn}

  padding: 2rem 0;

  ${(p) =>
    p.ready &&
    css`
      ${layerADark}
    `}

  ${(p) => p.active && css``}
`;

const DefaultTitle = styled.span`
  text-align: center;
  font-size: 8px;
  line-height: 95%;
`;
const Divider = styled.div`
  width: 95px;
  height: 0px;
  border: 1px solid #ffffff;
`;
const Temp = styled.span`
  font-size: 14px;
`;

const SectionButton = styled.section`
  height: 100%;
  ${flexBoxCenter}
`;
const ButtonWrapper = styled.button`
  width: 154px;
  height: 44px;
  border-radius: 25px;
  ${layerA180Deg}

  /* activated */
  /* border: 0.5px solid #95ff45; */


  ${(p) =>
    p.isReadyToDispatch &&
    css`
      ${MC_SELECTED_READY}/* border: 1px solid #95ff45; */
    `}

  ${flexBoxCenter}

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
      background: transparent linear-gradient(180deg, #4baf00 0%, #124000 100%);
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid #000000;
    `}
`;
const ButtonHole = styled.div`
  width: 136px;
  height: 32px;
  border-radius: 18px;
  ${layerA}
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
  width: 134px;
  height: 30px;
  border-radius: 25px;
  ${layerA180Deg}
  ${flexBoxCenter}

  ${(p) =>
    p.ready &&
    css`
      background: transparent linear-gradient(180deg, #1e7fc1 0%, #001640 100%);
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid #000000;
    `}

  ${(p) =>
    p.apply &&
    css`
      background: transparent linear-gradient(180deg, #4baf00 0%, #124000 100%);
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid #000000;
    `}
    font-size:12rem;
`;

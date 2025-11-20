import { useState, useEffect } from 'react';
import { useUnitsStore } from '../../../zustand-stores';
import styled, { css } from 'styled-components';
import {
import { useSelectedMachinesStore } from '../zustand-stores';
  activeInput,
  activeLayer180Deg,
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentFlexEnd,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerADark,
  layerB,
  layerBDark,
} from '../../../styles/commonStyles';
import { selectUnits } from '../../../store/slices/settings/unitsSlice';
import InputTempMessage from '../../../userMessages/inputTempMessage';
import { selectedMachinesState } from '../../../store/slices/selectedMachinesSlice';

const InstantHeat = ({
  isSelected,
  handleSelect,
  buttonHandler,
  tempInput,
  setTempInput,
  isTgs,
  isEditable,
  handleCreateNewCommandMessageBox,
  isReadyToDispatch,
  isFanOnlyReadyToDispatch,
  isActivated,
  isFanOnlyActivated,
  setDisplayMessageBox,
  setMessage,
  setMessageTitle,
  isDialSysDisabled,
  setSubtitle,
}) => {
  const { instantHeat } = useSelectedMachinesStore();

  const unitsStatus = useUnitsStore();
  const { isF } = unitsStatus;
  const unit = isF ? `°F` : `°C`;

  // const [selected, setSelected] = useState(isSelected);
  const [title, setTitle] = useState('select');

  const [fanOnlyReadyToDispatch, setFanOnlyReadyToDispatch] = useState(false);

  const [src, setSrc] = useState('');

  // for message box

  useEffect(() => {
    if (isActivated) {
      setSrc('/images/bg-instantHeat-active.svg');
    } else if (isReadyToDispatch) {
      setSrc('/images/bg-instantHeat-focus.svg');
      setTitle('selected');
    } else {
      setSrc('/images/bg-instantHeat-none.svg');
      setTitle('select');
    }
  }, [isReadyToDispatch, isActivated]);

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (isSelected) {
      if (isReadyToDispatch) {
        setTempInput(``);
        buttonHandler('instantHeat', 'off');
      } else {
        const temp = Number(tempInput);
        if (tempInput) {
          if (isF) {
            if (temp >= 250 && temp <= 1830) {
              buttonHandler('instantHeat', 'on');

              setTempInput(`${temp} °F`);
            } else {
              setTempInput('');
              // message logic
              buttonHandler('instantHeat', 'message');
              handleMessageBox(
                'master control',
                [
                  'wrong temperature',
                  'please input temperature between 250°F and 1830°F  ',
                ],
                'controls'
              );
            }
          } else {
            if (temp >= 121 && temp <= 999) {
              // setTempInput(`${temp} °C`);
              // id === instantHeat, state, scope, temp
              buttonHandler('instantHeat', 'on');

              setTempInput(`${temp} °C`);
            } else {
              setTempInput('');
              buttonHandler('instantHeat', 'message');
              handleMessageBox(
                'master control',
                [
                  'wrong temperature',
                  'please input temperature between 121°C and 999°C  ',
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

  const handleFanOnly = (e) => {
    e.preventDefault();
    if (isSelected) {
      if (fanOnlyReadyToDispatch) {
        buttonHandler('fanOnly', 'off');
        setFanOnlyReadyToDispatch(false);
      } else {
        buttonHandler('fanOnly', 'on');
        setFanOnlyReadyToDispatch(true);
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

  const handleMessageBox = (swtName, message, subtitle) => {
    setMessage(message);
    setMessageTitle(swtName);
    setSubtitle(subtitle);
    setDisplayMessageBox(true);
  };

  return (
    <Wrapper onClick={() => isSelected || select()}>
      <Img src={src} />
      <ContentsPositionAbsolute>
        <ControllerTitle >
          <Title>instant heat program</Title>
          <Icon src='/images/logo-instantHeat.svg' />
        </ControllerTitle>

        {isTgs ? (
          <ContentsWrapperHole isTgs={isTgs} apply={isActivated}>
            <ContentTop apply={isActivated}>
              <TgsSectionInput apply={isActivated}>
                <TgsFormWrapper
                  // onSubmit={handleOnSubmit}
                  apply={isActivated}
                  isReadyToDispatch={isReadyToDispatch}
                >
                  <TgsButtonWrapper onClick={handleOnSubmit}>
                    <TgsButtonHole apply={isActivated}>
                      <TgsButtonTop apply={isActivated}>
                        <ButtonImg src='/images/tgsInstantHeat.svg' />
                      </TgsButtonTop>
                    </TgsButtonHole>
                  </TgsButtonWrapper>

                  <TgsTitle onClick={handleOnSubmit}>instant heat</TgsTitle>

                  <TgsTempInput
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
                    apply={isActivated}
                  />
                </TgsFormWrapper>
              </TgsSectionInput>

              <SectionButton>
                <FanButtonWrapper
                  active={isFanOnlyActivated}
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
                      : instantHeat.ready
                      ? handleMessageBox(
                          'master control',
                          [
                            'fan only',
                            'the fan should always run while the heater is running in tgs',
                          ],
                          'controls'
                        )
                      : isSelected && handleFanOnly(e)
                  }
                >
                  <FanButtonTop
                    active={isFanOnlyActivated}
                    fanOnlyReadyToDispatch={isFanOnlyReadyToDispatch}
                  >
                    <TgsTitle fanOnly={true}>fan only</TgsTitle>

                    <TgsButtonWrapper>
                      <TgsButtonHole apply={isFanOnlyActivated}>
                        <TgsButtonTop apply={isFanOnlyActivated}>
                          <ButtonImg src='/images/tgs-fanOnly.svg' />
                        </TgsButtonTop>
                      </TgsButtonHole>
                    </TgsButtonWrapper>
                  </FanButtonTop>
                </FanButtonWrapper>
              </SectionButton>
            </ContentTop>
          </ContentsWrapperHole>
        ) : (
          <ContentsWrapperHoleForm
            onSubmit={handleOnSubmit}
            apply={isActivated}
          >
            <ContentTop ess={true}>
              <SectionInput>
                <Title>input temp</Title>
                <InputWrapper apply={isActivated}>
                  <TempInput
                    type='text'
                    placeholder={`--${unit}`}
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
                    apply={isActivated}
                  />
                </InputWrapper>
              </SectionInput>

              <SectionButton>
                <ButtonWrapper
                  onClick={handleOnSubmit}
                  apply={isActivated}
                  isReadyToDispatch={isReadyToDispatch}
                >
                  <ButtonHole apply={isActivated}>
                    <ButtonTop apply={isActivated}>{title}</ButtonTop>
                  </ButtonHole>
                </ButtonWrapper>
              </SectionButton>
            </ContentTop>
          </ContentsWrapperHoleForm>
        )}
      </ContentsPositionAbsolute>
    </Wrapper>
  );
};

export default InstantHeat;

const Wrapper = styled.div`
  padding-left: 177px;
  position: relative;
`;

const Img = styled.img``;

const ControllerTitle = styled.div`
  width: 380px;
  height: 22px;
  border-radius: 11px;
  ${layerADark}
  ${justifyContentSpaceBetween}
  padding: 0 2px 0 10px;

  ${(p) =>
    p.apply &&
    css`
      ${activeInput};
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

  top: 7px;
  right: 53px;
`;

const ContentsWrapperHole = styled.div`
  margin-top: 2px;
  margin-left: 45px;

  width: 349px;
  height: 48px;
  border-radius: 24px;

  ${layerA}
  ${flexBoxCenter}

  ${(p) =>
    p.isTgs &&
    css`
      padding: 0;
      justify-content: space-evenly;
    `}

  ${(p) =>
    p.apply &&
    css`
      ${activeInput}
    `}
`;

const ContentsWrapperHoleForm = styled.form`
  margin-top: 2px;
  margin-left: 45px;

  width: 349px;
  height: 48px;
  border-radius: 24px;

  ${layerA}
  ${flexBoxCenter}

  ${(p) =>
    p.isTgs &&
    css`
      padding: 0;
      justify-content: space-evenly;
    `}

  ${(p) =>
    p.apply &&
    css`
      ${activeInput}
    `}
`;

const ContentTop = styled.div`
  width: 345px;
  height: 44px;
  border-radius: 27px;
  /* 
  ${layerA180Deg} */
  ${layerA}
  ${justifyContentSpaceBetween}
  padding: 0 4px;

  ${(p) =>
    p.ess &&
    css`
      width: 100%;
      height: 100%;
      background: transparent;
      padding: 0 2px 0 16px;
    `}

  ${(p) =>
    p.apply &&
    css`
      ${activeLayer180Deg};
    `}
`;

const SectionInput = styled.section`
  height: 100%;

  ${flexDirectionColumn}
  padding: 6px 0 2px 0;
`;

const InputWrapper = styled.div`
  width: 146px;
  height: 25px;
  border-radius: 22px;
  ${layerA180Deg}
  ${flexBoxCenter}
  margin-top: 5px;

  ${(p) =>
    p.apply &&
    css`
      ${activeLayer180Deg};
    `}
`;
const TempInput = styled.input`
  width: 138px;
  height: 17px;
  border-radius: 18px;
  ${layerADark}
  font-size: 10px;
  ::placeholder {
    color: #fff;
  }

  ${(p) =>
    p.apply &&
    css`
      ${activeInput};
    `}
`;
const SectionButton = styled.section`
  height: 100%;
  ${flexBoxCenter}
`;
const ButtonWrapper = styled.button`
  width: 169px;
  height: 44px;
  border-radius: 25px;

  ${layerA180Deg}
  ${flexBoxCenter}

  ${(p) =>
    p.isReadyToDispatch &&
    css`
      border: 1px solid #95ff45;
    `}

  ${(p) =>
    p.apply &&
    css`
      ${activeLayer180Deg};
    `}
`;
const ButtonHole = styled.div`
  width: 154px;
  height: 32px;

  border-radius: 18px;

  ${layerA}
  ${flexBoxCenter}

  ${(p) =>
    p.apply &&
    css`
      ${activeInput}
    `}
`;
const ButtonTop = styled.span`
  width: 152px;
  height: 30px;
  border-radius: 25px;

  ${layerA180Deg}
  ${flexBoxCenter}

  ${(p) =>
    p.apply &&
    css`
      ${activeLayer180Deg}
    `}

    font-size:12px;
`;

// tgs mode
const TgsTitle = styled.div`
  width: 56px;
  font-size: 10px;
  text-align: center;

  ${(p) =>
    p.fanOnly &&
    css`
      width: auto;
      margin-right: 25px;
    `}
`;
const TgsSectionInput = styled.div`
  width: 162px;
  height: 34px;
  ${layerBDark};
  border-radius: 25px;

  ${flexBoxCenter}
`;
const TgsFormWrapper = styled.form`
  cursor: pointer;
  width: 160px;
  height: 32px;

  border-radius: 25px;

  ${layerA180Deg}
  ${(p) =>
    p.isReadyToDispatch &&
    css`
      border: 1px solid #95ff45;
    `}

  ${(p) =>
    p.apply &&
    css`
      ${activeLayer180Deg};
    `}

  ${justifyContentSpaceBetween};
  padding: 0 2.5px 0 1.5px;
`;

const TgsButtonWrapper = styled.button`
  z-index: 5;
  width: 28px;
  height: 28px;
  border-radius: 50%;

  ${layerA}
  ${flexBoxCenter}
`;
const TgsButtonHole = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50%;

  ${layerA180Deg}
  ${flexBoxCenter}

  ${(p) =>
    p.apply &&
    css`
      ${activeLayer180Deg};
    `}
`;
const TgsButtonTop = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;

  ${layerA}
  ${flexBoxCenter}

  ${(p) =>
    p.apply &&
    css`
      ${activeInput};
    `}
`;
const ButtonImg = styled.img``;

const TgsTempInput = styled.input`
  width: 48px;
  height: 27px;
  border-radius: 20px;

  ${layerA}
  font-size: 10px;
  ::placeholder {
    color: #fff;
  }

  ${(p) =>
    p.apply &&
    css`
      ${activeInput};
    `}
`;

const FanButtonWrapper = styled.div`
  cursor: pointer;
  width: 162px;
  height: 34px;
  ${flexBoxCenter}
  border-radius: 25px;
  ${layerB}
`;
const FanButtonTop = styled.div`
  width: 160px;
  height: 32px;
  border-radius: 25px;

  ${layerA180Deg}
  ${justifyContentFlexEnd}
  padding-right: 1.5px;

  ${(p) =>
    p.fanOnlyReadyToDispatch &&
    css`
      border: 1px solid #95ff45;
    `}

  ${(p) =>
    p.active &&
    css`
      ${activeLayer180Deg};
    `}
`;

const MessageBoxWrapper = styled.div`
  width: 1216px;
  height: 300px;

  ${flexBoxCenter}
  padding-right: 300px;

  position: absolute;
  top: 0;
  z-index: 100;
`;

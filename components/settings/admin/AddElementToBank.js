import { useState } from 'react';
import styled, { css } from 'styled-components';
import SettingConfirmedMessage from '../../masterControl/userMessages/SettingConfirmedMessage';
import { selectEditCancelApplyButtons } from '../../store/slices/settings/editCancelApplyButtonsSlice';
import {
  flexBoxCenter,
  justifyContentFlexEnd,
  justifyContentSpaceAround,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerA90Deg,
  layerB,
} from '../../styles/commonStyles';
import SaveButton from '../buttons/SaveButton';
import { useMediaQuery } from 'react-responsive';

const AddElementToBank = ({
  setSaveInputElement,
  handleSaveButton,
  isActivate,
}) => {
  // media query
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  const initialInputState = {
    elementName: '',
    partNumber: '',
    current: '',
    wattage: '',
    voltage: '',
    lengths: '',
  };
  const [inputElement, setInputElement] = useState(initialInputState);

  // useState
  const [messageBoxForBankInputs, setMessageBoxForBankInput] = useState(false);

  // redux
    const state = useSelector(selectEditCancelApplyButtons);
  const { isEdit } = state;

  const handleInput = (name, input) => {
    let copyState = { ...inputElement };
    copyState[name] = input;
    setInputElement(copyState);
  };

  const handleSave = () => {
    if (inputElement.current === '') {
      return setMessageBoxForBankInput(true);
    } else if (inputElement.elementName === '') {
      return setMessageBoxForBankInput(true);
    } else if (inputElement.lengths === '') {
      return setMessageBoxForBankInput(true);
    } else if (inputElement.partNumber === '') {
      return setMessageBoxForBankInput(true);
    } else if (inputElement.voltage === '') {
      return setMessageBoxForBankInput(true);
    } else if (inputElement.wattage === '') {
      return setMessageBoxForBankInput(true);
    } else {
      handleSaveButton(0);
      setSaveInputElement(inputElement);
    }
  };

  const handleMessageBox = () => {
    setMessageBoxForBankInput(false);
  };

  return (
    <>
      {isMobile ? (
        <Wrapper isMobile={true}>
          <TitleWrapper isMobile={true}>
            <Title>add element to bank</Title>
          </TitleWrapper>
          <SectionWrapper isMobile={true}>
            {/* element name */}
            <ElementNameBaseLayer isMobile={true}>
              <ElementNameWrapper isMobile={true}>
                <Span isMobile={true}>
                  element<br></br>Name:
                </Span>
                {isEdit ? (
                  <Input
                    isMobile={true}
                    type='text'
                    placeholder='---------'
                    name='elementName'
                    onChange={(event) =>
                      handleInput(
                        'elementName',
                        event.target.value.toUpperCase()
                      )
                    }
                    value={inputElement.elementName}
                  />
                ) : (
                  <FakeInput isMobile={true} onClick={() => handleSave()}>
                    ---------
                  </FakeInput>
                )}
              </ElementNameWrapper>
            </ElementNameBaseLayer>

            {/* element part number */}
            <ElementNameBaseLayer isMobile={true}>
              <ElementNameWrapper isMobile={true}>
                <Span isMobile={true} isPartNum={true}>
                  element<br></br>part number:
                </Span>
                {isEdit ? (
                  <Input
                    isMobile={true}
                    type='text'
                    placeholder='---------'
                    name='partNumber'
                    onChange={(event) =>
                      handleInput(
                        'partNumber',
                        event.target.value.toUpperCase()
                      )
                    }
                    value={inputElement.partNumber}
                  />
                ) : (
                  <FakeInput isMobile={true} onClick={() => handleSave()}>
                    ---------
                  </FakeInput>
                )}
              </ElementNameWrapper>
            </ElementNameBaseLayer>

            {/* element display box */}
            <DisplayWrapperHole isMobile={true}>
              <DisplayWrapper isMobile={true}>
                <Display isMobile={true}>
                  {inputElement.elementName && inputElement.elementName}
                  {inputElement.partNumber && ` - ${inputElement.partNumber}`}
                  <br></br>
                  {inputElement.current && `${inputElement.current}`}
                  {inputElement.wattage && ` / ${inputElement.wattage}`}
                  {inputElement.voltage && ` / ${inputElement.voltage}`}
                  {inputElement.lengths && ` / ${inputElement.lengths}`}
                </Display>
              </DisplayWrapper>
            </DisplayWrapperHole>

            {/* element specification */}
            <Span>element specification:</Span>
            <ElementSpecWrapper isMobile={true}>
              <ElementSpecInnerWrapper isMobile={true}>
                <SpecsGroupWrapper isMobile={true}>
                  {/* current and wattage */}
                  <FlexRow>
                    <FlexColumn>
                      <SubTitle>current (a)</SubTitle>
                      {isEdit ? (
                        <SmallInput
                          isMobile={true}
                          type='number'
                          placeholder='---------'
                          value={inputElement.current}
                          onChange={(event) =>
                            handleInput('current', Number(event.target.value))
                          }
                        />
                      ) : (
                        <FakeInput
                          isMobile={true}
                          size={0}
                          onClick={() => handleSave()}
                        >
                          ---------
                        </FakeInput>
                      )}
                    </FlexColumn>
                    <FlexColumn>
                      <SubTitle>wattage (w)</SubTitle>
                      {isEdit ? (
                        <SmallInput
                          isMobile={true}
                          type='number'
                          placeholder='---------'
                          value={inputElement.wattage}
                          onChange={(event) =>
                            handleInput('wattage', Number(event.target.value))
                          }
                        />
                      ) : (
                        <FakeInput
                          isMobile={true}
                          size={0}
                          onClick={() => handleSave()}
                        >
                          ---------
                        </FakeInput>
                      )}
                    </FlexColumn>
                  </FlexRow>
                  {/* voltage and length */}
                  <FlexRow>
                    <FlexColumn>
                      <SubTitle>voltage (v)</SubTitle>
                      {isEdit ? (
                        <SmallInput
                          isMobile={true}
                          type='number'
                          placeholder='---------'
                          value={inputElement.voltage}
                          onChange={(event) =>
                            handleInput('voltage', Number(event.target.value))
                          }
                        />
                      ) : (
                        <FakeInput
                          isMobile={true}
                          size={0}
                          onClick={() => handleSave()}
                        >
                          ---------
                        </FakeInput>
                      )}
                    </FlexColumn>
                    <FlexColumn>
                     <SubTitle>length (ft)</SubTitle>
                      {isEdit ? (
                        <SmallInput
                          isMobile={true}
                          type='number'
                          placeholder='---------'
                          value={inputElement.lengths}
                          onChange={(event) =>
                            handleInput('lengths', Number(event.target.value))
                          }
                        />
                      ) : (
                        <FakeInput
                          isMobile={true}
                          size={0}
                          onClick={() => handleSave()}
                        >
                          ---------
                        </FakeInput>
                      )}
                    </FlexColumn>
                  </FlexRow>
                </SpecsGroupWrapper>
              </ElementSpecInnerWrapper>
            </ElementSpecWrapper>
          </SectionWrapper>
          <ButtonWrapper isMobile={true}>
            <SaveButton handleSave={handleSave} isActivate={isActivate} />
          </ButtonWrapper>
          {messageBoxForBankInputs && (
            <SettingConfirmedMessage
              title={'element missing'}
              message={"please fill all the element's spec"}
              onClose={handleMessageBox}
            />
          )}
        </Wrapper>
      ) : (
        <BaseLayer>
          <Wrapper>
            <TitleWrapper>
              <Title>add element to bank</Title>
            </TitleWrapper>
            <SectionWrapper>
              {/* element name */}
              <ElementGroupWrapper>
                <ElementNameBaseLayer>
                  <ElementNameWrapper>
                    <Span>
                      element<br></br>Name:
                    </Span>
                    {isEdit ? (
                      <Input
                        type='text'
                        placeholder='---------'
                        name='elementName'
                        onChange={(event) =>
                          handleInput(
                            'elementName',
                            event.target.value.toUpperCase()
                          )
                        }
                        value={inputElement.elementName}
                      />
                    ) : (
                      <FakeInput onClick={() => handleSave()}>
                        ---------
                      </FakeInput>
                    )}
                  </ElementNameWrapper>
                </ElementNameBaseLayer>
                {/* element part number */}
                <ElementNameWrapper>
                  <Span>
                    element<br></br>Part Number:
                  </Span>
                  {isEdit ? (
                    <Input
                      type='text'
                      placeholder='---------'
                      name='partNumber'
                      onChange={(event) =>
                        handleInput(
                          'partNumber',
                          event.target.value.toUpperCase()
                        )
                      }
                      value={inputElement.partNumber}
                    />
                  ) : (
                    <FakeInput onClick={() => handleSave()}>
                      ---------
                    </FakeInput>
                  )}
                </ElementNameWrapper>
              </ElementGroupWrapper>
              {/* Display Box */}
              <DisplayWrapperHole>
                <DisplayWrapper>
                  <Display>
                    {inputElement.elementName && inputElement.elementName}
                    {inputElement.partNumber && ` - ${inputElement.partNumber}`}
                    <br></br>
                    {inputElement.current && `${inputElement.current}`}
                    {inputElement.wattage && ` / ${inputElement.wattage}`}
                    {inputElement.voltage && ` / ${inputElement.voltage}`}
                    {inputElement.lengths && ` / ${inputElement.lengths}`}
                  </Display>
                </DisplayWrapper>
              </DisplayWrapperHole>
            </SectionWrapper>
            {/* element specification titles */}
            <FlexWrapper>
              <SubTitlesWrapper>
                <SubTitle>current(a)</SubTitle>
                <SubTitle>wattage(w)</SubTitle>
                <SubTitle>voltage(v)</SubTitle>
                <SubTitle>length(ft)</SubTitle>
              </SubTitlesWrapper>
            </FlexWrapper>
            <ElementSpecWrapper>
              <ElementSpecInnerWrapper>
                <Span>
                  element <br></br>specification:
                </Span>
                <SpecsGroupWrapper>
                  {isEdit ? (
                    <SmallInput
                      type='number'
                      placeholder='---------'
                      value={inputElement.current}
                      onChange={(event) =>
                        handleInput('current', Number(event.target.value))
                      }
                    />
                  ) : (
                    <FakeInput size={0} onClick={() => handleSave()}>
                      ---------
                    </FakeInput>
                  )}
                  {isEdit ? (
                    <SmallInput
                      type='number'
                      placeholder='---------'
                      value={inputElement.wattage}
                      onChange={(event) =>
                        handleInput('wattage', Number(event.target.value))
                      }
                    />
                  ) : (
                    <FakeInput size={0} onClick={() => handleSave()}>
                      ---------
                    </FakeInput>
                  )}
                  {isEdit ? (
                    <SmallInput
                      type='number'
                      placeholder='---------'
                      value={inputElement.voltage}
                      onChange={(event) =>
                        handleInput('voltage', Number(event.target.value))
                      }
                    />
                  ) : (
                    <FakeInput size={0} onClick={() => handleSave()}>
                      ---------
                    </FakeInput>
                  )}
                  {isEdit ? (
                    <SmallInput
                      type='number'
                      placeholder='---------'
                      value={inputElement.lengths}
                      onChange={(event) =>
                        handleInput('lengths', Number(event.target.value))
                      }
                    />
                  ) : (
                    <FakeInput size={0} onClick={() => handleSave()}>
                      ---------
                    </FakeInput>
                  )}
                </SpecsGroupWrapper>
              </ElementSpecInnerWrapper>
            </ElementSpecWrapper>
            <ButtonWrapper>
              <SaveButton handleSave={handleSave} isActivate={isActivate} />
            </ButtonWrapper>
            {messageBoxForBankInputs && (
              <SettingConfirmedMessage
                title={'settings'}
                subtitle={'administration settings'}
                messageTheme={'input fields incomplete'}
                message={
                  'input fields incomplete, please fill all the input fields to save add element to bank.'
                }
                onClose={handleMessageBox}
              />
            )}
          </Wrapper>
        </BaseLayer>
      )}
    </>
  );
};
export default AddElementToBank;

// ${({isMobile})=> isMobile ? css`` : css``}

const BaseLayer = styled.div`
  width: 558px;
  height: 205px;

  ${layerB}

  border-radius: 9px;

  ${flexBoxCenter}
`;
const Wrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 280px;
          height: 339px;

          ${layerA90Deg}
          border-radius: 9px;
          ${justifyContentSpaceAround}
        `
      : css`
          width: 556px;
          height: 203px;
          padding: 1px 0;

          ${layerA180Deg}

          border-radius: 8px;
          ${justifyContentSpaceBetween}
        `}
  flex-direction: column;
`;
const TitleWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 272px;
          height: 32px;
        `
      : css`
          width: 546px;
          height: 32px;
        `}

  margin-top: 4px;
  border-radius: 16px;

  ${layerA}

  ${flexBoxCenter}
`;

const Title = styled.div`
  font-size: 12px;
  letter-spacing: 1.2px;
`;
const SectionWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          margin-top: 6px;
          margin-bottom: 6px;
          height: 280px;
          flex-direction: column;
        `
      : css`
          width: 539px;
          height: 80px;
        `}

  ${justifyContentSpaceBetween}
`;
const ElementGroupWrapper = styled.div`
  height: 72px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ElementNameBaseLayer = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 275px;
          height: 28px;
        `
      : css`
          width: 321px;
          height: 32px;
        `}

  ${layerA}

  border-radius: 16px;

  ${flexBoxCenter}
`;

const ElementNameWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 273px;
          height: 26px;
        `
      : css`
          width: 319px;
          height: 30px;
        `}

  ${layerA180Deg}

  border-radius: 15px;
  opacity: 1;

  ${justifyContentSpaceBetween};
`;

const Span = styled.span`
  ${({ isMobile }) =>
    isMobile
      ? css`
          font-size: 8px;
          letter-spacing: 0.8px;
          margin-left: 8px;
        `
      : css`
          margin-left: 12px;
          font-size: 10px;
        `}
`;
const Input = styled.input`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 181px;
          height: 20px;
          margin-right: 2px;
          font-size: 10px;
        `
      : css`
          margin-right: 2px;
          width: 206px;
          height: 26px;
        `}

  ${layerA}

  border-radius: 13px;

  &::placeholder {
    text-transform: uppercase;
    color: #999;
  }
`;

const FakeInput = styled.div`
  border-radius: 13px;

  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 181px;
          height: 20px;
          margin-right: 2px;
          font-size: 10px;
          ${({ size }) =>
            size === 0 &&
            css`
              width: 126px;
              height: 20px;
              border-radius: 12px;
            `}
        `
      : css`
          margin-right: 2px;
          width: 206px;
          height: 26px;
          font-size: 13px;
          ${({ size }) =>
            size === 0 &&
            css`
              width: 98px;
              height: 26px;
            `}
        `}

  ${layerA}

 

  ${flexBoxCenter}
  color: #999;
`;
const DisplayWrapperHole = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 273px;
          height: 60px;
        `
      : css`
          width: 210px;
          height: 72px;
        `}

  ${layerA}

  border-radius: 13px;

  ${flexBoxCenter}
`;
const DisplayWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 271px;
          height: 58px;
        `
      : css`
          width: 208px;
          height: 70px;
        `}

  ${layerA180Deg}

  border-radius: 12px;

  ${flexBoxCenter}
`;
const Display = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 266px;
          height: 54px;
        `
      : css`
          width: 204px;
          height: 66px;
        `}

  font-size: 10px;

  ${layerA}

  border-radius: 10px;
  ${flexBoxCenter}
`;

const FlexWrapper = styled.div`
  width: 100%;
  ${justifyContentFlexEnd}
`;
const SubTitlesWrapper = styled.div`
  width: 400px;
  margin-right: 27px;
  ${justifyContentFlexEnd}
  gap:35px;
  flex-direction: row;
`;

const ElementSpecWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 273px;
          height: 91px;
          border-radius: 13px;
        `
      : css`
          width: 546px;
          height: 32px;
          border-radius: 16px;
        `}

  ${layerA}

  ${flexBoxCenter}
`;
const ElementSpecInnerWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 271px;
          height: 89px;
          border-radius: 12px;
        `
      : css`
          width: 544px;
          height: 30px;
          border-radius: 15px;
          padding-left: 0.5px;
          padding-right: 0.1px;
        `}

  ${layerA180Deg}


  ${justifyContentSpaceBetween}
`;

const SpecsGroupWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          height: 100%;
          width: 100%;
          flex-wrap: wrap;
        `
      : css`
          height: 100%;
          width: 422px;
        `}

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FlexRow = styled.div`
  width: 100%;
  ${justifyContentSpaceAround}
`;

const FlexColumn = styled.div`
  height: 50%;
  ${flexBoxCenter}
  flex-direction: column;
  gap: 2px;
`;

const SubTitle = styled.p`
  font-size: 10px;
`;

const SmallInput = styled.input`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 126px;
          height: 20px;
          border-radius: 12px;
        `
      : css`
          width: 98px;
          height: 26px;
          border-radius: 13px;
        `}

  ${layerA}



  &::placeholder {
    text-transform: uppercase;
    color: #999;
  }
`;

const ButtonWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 100%;
          margin-bottom: 4px;
          ${flexBoxCenter}
        `
      : css`
          width: 98%;
          /* margin-bottom: 8px; */

          ${justifyContentFlexEnd};
        `}
`;

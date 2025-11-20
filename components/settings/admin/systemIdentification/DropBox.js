import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled, { css } from 'styled-components';
import {
  addSSRsRatingService,
  addSSRsSwitchSizesService,
} from '../../../../services/systemIdentification.service';
import {
  handleAddGasType,
  handleAddSwitchSizeSSRRating,
} from '../../../store/slices/settings/admin/sysIdentificationSlice';
import {
  borderADisabled,
  borderBBlue,
  flexBoxCenter,
  justifyContentFlexStart,
  justifyContentSpaceAround,
  justifyContentSpaceEvenly,
  layerA,
  layerA180Deg,
  layerADark,
  layerB,
} from '../../../styles/commonStyles';

const DropBox = ({
  content,
  handleSelection,
  switchIdx,
  selectBoxFor,
  handleOpenSelectBoxes,
  isCreateEditOrSave,
  buttonTitle,
  clearButtonTitle,
  isMultipleSelections,
  allSelections,
  selected,
  isTc,
  SSR,
  groupedIdx,
  selectedSSSIdx,
  selectedUOS,
}) => {
  const [selection, setSelection] = useState('');
  const [selections, setSelections] = useState(
    selectBoxFor === 'selectedSSR' ? [] : ''
  );
  const [inputValue, setInputValue] = useState(null);

  useEffect(() => {
    if (isMultipleSelections) {
      if (selectBoxFor === 'selectedSSR') {
        const selectionsArr = [];
        allSelections.forEach((selection) => {
          selectionsArr.push(Object.keys(selection)[0]);
        });
        setSelections(selectionsArr);
      } else {
        setSelections(selected);
      }
    } else {
      setSelection(selected);
    }
  }, []);

    const keyOfOptions =
    selectBoxFor === 'switchSize' ? 'switchSizeOptions' : 'ssrRatingOptions';

  const handleMultipleSelections = (el) => {
    switch (el) {
      case 'ess':
        setSelections('ess');
        break;
      case 'tgs':
        if (el !== selections && selections !== 'ess' && selections !== '') {
          setSelections('tgs/tes');
        } else {
          setSelections(el);
        }

        break;
      case 'tes':
        if (el !== selections && selections !== 'ess' && selections !== '') {
          setSelections('tgs/tes');
        } else {
          setSelections(el);
        }

        break;
      default:
        // select SSRs and store into an array
        const copySelections = [...selections];
        copySelections.push(el);

        let uniqueSelections = [...new Set(copySelections)];

        setSelections(uniqueSelections);

        break;
    }
  };

  return (
    <Wrapper isSelectSwitch={selectBoxFor === 'switch'}>
      <FlexRow>
        <TitleWrapper isSelectSwitch={selectBoxFor === 'switch'}>
          <Title>
            {isMultipleSelections
              ? selectBoxFor === 'selectedSSR'
                ? selections.length < 10
                  ? '0' + selections.length
                  : selections.length
                : selections
              : selection}
          </Title>
        </TitleWrapper>
        <Img
          src={'./images/settings-sysIdentification-whiteTriangle.svg'}
          onClick={() => handleOpenSelectBoxes()}
        />
      </FlexRow>
      <ContentWrapper isTc={isTc} isSelectSwitch={selectBoxFor === 'switch'}>
        {content?.map((el, i) => {
          const disabled =
            selectBoxFor === 'heatingSys' && (i === 3 || i === 4);

          return (
            <div key={el + i}>
              {isMultipleSelections ? (
                <IndivSelectionWrapper
                  // key={el + i}
                  disabled={disabled}
                  onClick={() => {
                    return disabled ? '' : handleMultipleSelections(el);
                  }}
                >
                  <OuterCircle disabled={disabled}>
                    <InnerCircle
                      isActive={
                        selectBoxFor === 'selectedSSR'
                          ? selections.includes(el)
                          : selections === 'tgs/tes'
                          ? el === 'tgs' || el === 'tes'
                          : selections === el
                      }
                      disabled={disabled}
                    ></InnerCircle>
                  </OuterCircle>

                  <Title>{el}</Title>
                </IndivSelectionWrapper>
              ) : (
                <IndivSelectionWrapper
                  // key={Math.floor(Math.random() * 935)}
                  disabled={disabled}
                  isSelectSwitch={selectBoxFor === 'switch'}
                  onClick={() => (disabled ? '' : setSelection(el))}
                >
                  <OuterCircle disabled={disabled}>
                    <InnerCircle
                      isActive={selection === el}
                      disabled={disabled}
                    ></InnerCircle>
                  </OuterCircle>

                  <Title>{el}</Title>
                </IndivSelectionWrapper>
              )}
            </div>
          );
        })}
        {isCreateEditOrSave && (
          <IndivSelectionWrapper onClick={() => setSelection('')}>
            <OuterCircle>
              <InnerCircle isInputActive={!selection}></InnerCircle>
            </OuterCircle>
            {(buttonTitle === 'add gas type' || buttonTitle === 'add size') &&
            selection === '' ? (
              <Input
                type='text'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              ></Input>
            ) : selection === '' ? (
              <Input
                type='number'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              ></Input>
            ) : (
              <Title>---</Title>
            )}
          </IndivSelectionWrapper>
        )}
      </ContentWrapper>
      {isCreateEditOrSave && (
        <ButtonWrapper>
          <Button
            onClick={() => {
              if (selectBoxFor === 'switchSize') {
                addSSRsSwitchSizesService(inputValue);
              } else if (selectBoxFor === 'ssrRating') {
                addSSRsRatingService(inputValue);
              }
              if (buttonTitle === 'add gas type') {
                dispatch(handleAddGasType(inputValue);
              } else {
                dispatch(
                  handleAddSwitchSizeSSRRating({
                    keyOfOptions,
                    value: inputValue,
                  });
              }
              setInputValue('');
            }}
          >
            <ButtonHole>
              <ButtonTop>
                <ButtonTitle
                  size={
                    buttonTitle === 'add ssr rating' ||
                    buttonTitle === 'add gas type'
                  }
                >
                  {buttonTitle}
                </ButtonTitle>
              </ButtonTop>
            </ButtonHole>
          </Button>
        </ButtonWrapper>
      )}
      {/* for SSR I.D. */}
      {clearButtonTitle && (
        <ButtonWrapper>
          <Button
            onClick={() => {
              selectBoxFor === 'selectedSSR'
                ? setSelections([])
                : setSelections('');
            }}
          >
            <ButtonHole>
              <ButtonTop>
                <ButtonTitle>{clearButtonTitle}</ButtonTitle>
              </ButtonTop>
            </ButtonHole>
          </Button>
        </ButtonWrapper>
      )}
      <ButtonWrapper isSelectSwitch={selectBoxFor === 'switch'}>
        <Button
          isSelectSwitch={selectBoxFor === 'switch'}
          onClick={() => {
            handleOpenSelectBoxes();
            selectBoxFor === 'tc'
              ? handleSelection(selection, groupedIdx, SSR)
              : selectBoxFor === 'switch'
              ? handleSelection(switchIdx, selection, SSR, selectedSSSIdx)
              : isMultipleSelections
              ? handleSelection(
                  switchIdx,
                  selections,
                  selectBoxFor,
                  selectedUOS
                )
              : handleSelection(
                  switchIdx,
                  selection,
                  selectBoxFor,
                  selectedUOS
                );
          }}
        >
          <ButtonHole isSelectSwitch={selectBoxFor === 'switch'}>
            <ButtonTop isSelectSwitch={selectBoxFor === 'switch'}>
              <ButtonTitle>select</ButtonTitle>
            </ButtonTop>
          </ButtonHole>
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
};

// buttonTitle === 'add gas type' && selection === '' ? (
//   <Input
//   type='text'
//   value={inputValue}
//   onChange={(e) => setInputValue(e.target.value)}
// ></Input>
// ) : selection === '' ? (
// <Input
//   type='number'
//   value={inputValue}
//   onChange={(e) => setInputValue(e.target.value)}
// ></Input>
// )

// handleSelection(switchIdx, selection, groupedIdx, SSR)

export default DropBox;

const Wrapper = styled.div`
  width: 95px;
  height: auto;

  ${({ isSelectSwitch }) =>
    isSelectSwitch &&
    css`
      width: 116px;
    `}

  ${layerA180Deg}

  border-radius: 8px 8px 13px 13px;
  opacity: 1;
  ${justifyContentSpaceAround}
  flex-direction: column;
`;

const FlexRow = styled.div`
  width: 100%;
  margin-top: 2px;
  ${justifyContentSpaceEvenly}
`;

const TitleWrapper = styled.div`
  width: 76px;
  height: 12px;

  ${({ isSelectSwitch }) =>
    isSelectSwitch &&
    css`
      width: 98px;
    `}

  ${layerA}

  border-radius: 12px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Title = styled.p`
  font-size: 8px;
  letter-spacing: 0.8px;
`;

const Input = styled.input`
  width: 55px;
  height: 14px;
  font-size: 10px;
  letter-spacing: 1px;
  background-color: transparent;
  text-transform: uppercase;
`;

const Img = styled.img``;

const ContentWrapper = styled.div`
  width: 91px;
  max-height: 160px;
  margin-top: 4px;
  margin-bottom: 4px;

  ${({ isSelectSwitch }) =>
    isSelectSwitch &&
    css`
      width: 112px;
    `}

  ${layerADark}

  border-radius: 8px;
  opacity: 1;
  display: flex;
  align-content: flex-start;
  align-items: center;
  flex-direction: column;

  /* scroll bar */
  scroll-behavior: smooth;
  overflow-y: auto;
  overflow-x: hidden;

  ::-webkit-scrollbar {
    width: 10px;
    border: 1px solid #ffffff;
    border-radius: 13px;
  }
  ::-webkit-scrollbar-track {
  }

  ::-webkit-scrollbar-thumb {
    background-color: #ffffff;
    border-radius: 13px;
    border: 1.5px solid transparent;
    background-clip: padding-box;
    height: 40%;
  }

  ::-webkit-scrollbar-button:start:decrement {
    background-repeat: no-repeat;
    background-size: 70%;
    background-position: center;
    height: 10px;

    background-image: url('/images/scrollbar-button-start.svg');
  }
  ::-webkit-scrollbar-button:end:increment {
    background-repeat: no-repeat;
    background-size: 70%;
    background-position: center;
    height: 10px;

    background-image: url('/images/scrollbar-button-end.svg');
  }

  ${({ isTc }) =>
    isTc &&
    css`
      ${justifyContentFlexStart}
    `}
`;

const IndivSelectionWrapper = styled.div`
  cursor: pointer;
  width: 80px;
  height: 14px;
  margin-top: 2px;
  &:last-child {
    margin-bottom: 2px;
  }

  ${({ isSelectSwitch }) =>
    isSelectSwitch &&
    css`
      width: 108px;
    `}

  ${borderBBlue}
  ${({ disabled }) =>
    disabled &&
    css`
      ${borderADisabled}
    `}
  border-radius: 7px;
  opacity: 1;
  ${justifyContentFlexStart}
`;

const OuterCircle = styled.div`
  height: 10px;
  width: 10px;
  margin-left: 2px;
  margin-right: 6px;
  border-radius: 50%;
  border: 1px solid #95ff45;
  ${({ disabled }) =>
    disabled &&
    css`
      ${borderADisabled}
    `}
  ${flexBoxCenter}
`;

const InnerCircle = styled.div`
  width: 6px;
  height: 6px;

  border-radius: 50%;
  ${({ isActive, isInputActive, disabled }) =>
    isInputActive
      ? css`
          background: #95ff45;
        `
      : isActive &&
        css`
          background: #95ff45;
        `};

  ${({ disabled }) =>
    disabled &&
    css`
      background: transparent;
    `}

  opacity: 1;
`;

const ButtonWrapper = styled.div`
  width: 91px;
  height: 24px;
  margin-bottom: 2px;

  ${({ isSelectSwitch }) =>
    isSelectSwitch &&
    css`
      width: 112px;
    `}

  ${layerB}

  border-radius: 27px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Button = styled.button`
  width: 89px;
  height: 22px;

  ${({ isSelectSwitch }) =>
    isSelectSwitch &&
    css`
      width: 110px;
    `}

  ${layerA180Deg}
  border-radius: 25px;
  opacity: 1;
  ${flexBoxCenter}
`;

const ButtonHole = styled.div`
  width: 82px;
  height: 16px;

  ${({ isSelectSwitch }) =>
    isSelectSwitch &&
    css`
      width: 102px;
    `}

  ${layerB}

  border-radius: 20px;
  opacity: 0.8;

  ${flexBoxCenter}
`;

const ButtonTop = styled.div`
  width: 80px;
  height: 14px;

  ${({ isSelectSwitch }) =>
    isSelectSwitch &&
    css`
      width: 100px;
    `}

  ${layerA180Deg}

  border-radius: 25px;
  opacity: 1;
  ${flexBoxCenter}
`;

const ButtonTitle = styled.p`
  font-size: 8px;
  letter-spacing: 0.8px;

  ${({ size }) =>
    size &&
    css`
      font-size: 6px;
    `}
`;

import { useEffect, useState } from 'react';
import { Fragment } from 'react';
import { useSSRDescriptionStore } from '../zustand-stores';

import styled, { css } from 'styled-components';
import {
import { useESSSwitchStore, useTESSwitchStore, useTGSSwitchStore } from '../zustand-stores';
  flexBoxCenter,
  ItemBackground,
  ItemBackgroundDisable,
  justifyContentSpaceBetween,
  layerA180Deg,
  layerADisabled180Deg,
  layerBDark,
} from '../styles/commonStyles';

// import SettingConfirmedMessage from '../../userMessages/SettingConfirmedMessage';

import PartNumberSuggestion from './PartNumberSuggestion';
import SSRSettingButton from './SSRSettingButton';
import SSRDetailButtonContainer from './SSRDetailButtonContainer';
import {
  addHeaterToSSRService,
  deleteHeaterFromSSRService,
  getAdminHeatersService,
} from '../../services/ssrs.service';
import { useDebounce } from '../../hooks';
import MessageBox from '../userMessages/messageBox';

const AdminSSRItemDetails = ({
  isEnable,
  isFault,
  isWarn,
  option,
  data,
  isSettingOpen,
  handleButtonClick,
  id,
  location,
  machine,
  swtName,
  SSRSwitchName,
  setSSRSwitchName,
}) => {
  const {
    partNumberSuggestions: partNumberSuggestionsStore,
    elementsOptions: elementsOptionsStore,
  } = useSSRDescriptionStore();
  const [partNumberSuggestions, setPartNumberSuggestions] = useState(
    partNumberSuggestionsStore
  );
  const [elementsOptions, setElementsOptions] = useState(elementsOptionsStore);

  const { specs } = data;

 
  const { essSwitch, tgsSwitch, tesSwitch,flatEssSwitch,flatTgsSwitch,flatTesSwitch } = swtName === 'ess'
      ? useESSSwitchStore()
      : swtName === 'tgs'
      ? useTGSSwitchStore()
      : useTESSwitchStore();
  const switchData =
    swtName === 'ess' ? flatEssSwitch : swtName === 'tgs' ? flatTgsSwitch : flatTesSwitch;
  const switchStatus = switchData[location][machine];

  const { deviceMac } = switchStatus;

  // temporary variables
  const unitsMeasurement = false;

  // Local states
  const initialInputState = [
    {
      partNumber: specs[0]?.partNumber || '',
    },
    {
      partNumber: specs[1]?.partNumber || '',
    },
    {
      partNumber: specs[2]?.partNumber || '',
    },
  ];

  const initialInputId = [null, null];
  const initialKeypadState = false;

  const [inputDetails, setInputDetails] = useState([
    {
      partNumber: specs[0]?.partNumber || '',
    },
    {
      partNumber: specs[1]?.partNumber || '',
    },
    {
      partNumber: specs[2]?.partNumber || '',
    },
  ]);
  const [elementSpec, setElementSpec] = useState([
    specs[0] || {},
    specs[1] || {},
    specs[2] || {},
  ]);
  const [hiddenNumber, setHiddenNumber] = useState(specs.length);

  const [inputId, setInputId] = useState(initialInputId);
  const [description, setDescription] = useState(['', '', '']);

  // ******************* to deal with input value conditionally *********************
  const [isEditable, setIsEditable] = useState(true);
  // ******************* to deal with input value conditionally *********************

  const [activateMessageBox, setActivateMessageBox] = useState(false);
  const [message, setMessage] = useState(null);
  
  useEffect(() => {
    if (inputDetails[0].partNumber !== '') {
      // 1. find index with partNumber in ssr
      const elementIdx = partNumberSuggestions.indexOf(
        inputDetails[0].partNumber
      );
      if (elementIdx >= 0) {
        // 2. Save element specs with idx from elementsOptions
        setElementSpec([elementsOptions[elementIdx], {}, {}]);
      } else {
        setElementSpec([{}, {}, {}]);
      }
    } else {
      setElementSpec([{}, {}, {}]);
    }
  }, [inputDetails[0].partNumber]);

  useEffect(() => {
    if (inputDetails[1].partNumber !== '') {
      // 1. find index with partNumber in ssr
      const elementIdx = partNumberSuggestions.indexOf(
        inputDetails[1].partNumber
      );

      if (elementIdx >= 0) {
        // 2. Save element specs with idx from elementsOptions
        setElementSpec([elementSpec[0], elementsOptions[elementIdx], {}]);
      }
    }
  }, [inputDetails[1].partNumber]);

  useEffect(() => {
    if (inputDetails[2].partNumber !== '') {
      // 1. find index with partNumber in ssr
      const elementIdx = partNumberSuggestions.indexOf(
        inputDetails[2].partNumber
      );

      if (elementIdx >= 0) {
        // 2. Save element specs with idx from elementsOptions
        setElementSpec([
          elementSpec[0],
          elementSpec[1],
          elementsOptions[elementIdx],
        ]);
      }
    }
  }, [inputDetails[2].partNumber]);

  const handleApply = (idx) => {
    const changeSSRDetail =
      swtName === 'ess' ? handleChangeSSRDetail : tesHandleChangeSSRDetail;
    if (elementSpec[idx].current) {
      const elementData = elementSpec.filter(
        (el) => Object.keys(el).length !== 0
      );
      
      dispatch(
        changeSSRDetail({
          location,
          machine,
          data: elementData,
          id: `ssr${id}`,
          unit: unitsMeasurement,
        });
          elementData.forEach((el, index) => {
          const oldEl = initialInputState[index];

          if (!oldEl || oldEl.partNumber !== el.partNumber) 
            {
 
            if (el.partNumber && (!oldEl || oldEl.partNumber !== el.partNumber)) {
            addHeaterToSSRService(deviceMac, {
              ssr_no: id - 1,
              partNumber: el.partNumber,
              deviceType: swtName.toUpperCase(),
            });
          }
        }
        });
        initialInputState.forEach((oldEl, index) => {
        const newEl = elementData[index];

        if (oldEl.partNumber && (!newEl || newEl.partNumber !== oldEl.partNumber)) {
     
     
          deleteHeaterFromSSRService(deviceMac, {
            ssr_no: id - 1,
            partNumber: oldEl.partNumber,
            deviceType: swtName.toUpperCase(),
          });
        }
      });
      setMessage(null);
      setActivateMessageBox(true);
    } 
    else {
      if (initialInputState.filter((el) => el.partNumber !== '').length !== 0) {
        dispatch(
          changeSSRDetail({
            location,
            machine,
            data: [{}],
            id: `ssr${id}`,
            unit: unitsMeasurement,
          });
        initialInputState
          .filter((element) => element.partNumber !== '')
          .map((el) => {
            deleteHeaterFromSSRService(deviceMac, {
              ssr_no: id - 1,
              partNumber: el.partNumber,
              deviceType: swtName.toUpperCase(),
            });
          });
        setMessage(null);
        setActivateMessageBox(true);
      } else {
        setMessage(
          'element not found! please check again the input specifications'
        );
        setActivateMessageBox(true);
      }
    }
  };

  // add, clear, apply button handler
  const handleClick = (name) => {
    if (name === 'add') {
      switch (hiddenNumber) {
        case 1: {
          setHiddenNumber(2);
          break;
        }
        case 2: {
          setHiddenNumber(3);
          break;
        }
        default: {
          return;
        }
      }
    }
     else if (name === 'clear') {
      // Logic for Delete the column
      switch (hiddenNumber) {
        case 3: {
          // 1. Delete Column
          setHiddenNumber(2);
          // 2. Reset Input States
          setElementSpec([elementSpec[0], elementSpec[1], {}]);
          setInputDetails([
            inputDetails[0],
            inputDetails[1],
            {
              partNumber: '',
            },
          ]);

          break;
        }
        case 2: {
          setHiddenNumber(1);
          setElementSpec([elementSpec[0], {}, {}]);
          setInputDetails([
            inputDetails[0],
            {
              partNumber: '',
            },
            {
              partNumber: '',
            },
          ]);
          setDescription([description[0]]);
          break;
        }
        case 1: {
          setHiddenNumber(1);
          // Reset input state
          setInputDetails([
            { partNumber: '' },
            { partNumber: '' },
            { partNumber: '' },
          ]);
          setElementSpec([{}, {}, {}]);
          break;
        }
        default: {
          return;
        }
      }
    } else if (name === 'apply') {
      // name === 'apply' do Dispatch
      switch (hiddenNumber) {
        case 1: {
          handleApply(0);
          break;
        }
        case 2: {
          handleApply(1);
          break;
        }
        default: {
          handleApply(2);
          break;
        }
      }
    }
  };

  // For keyboard input
  const handleSetInput = (index, input) => {
    // 1. Copy current inputDetails state
    const newInput = [...inputDetails];
    // 2. update new Input into requested index and name
    newInput[index].partNumber = input.toUpperCase();
    setInputDetails(newInput);
    setInputPartNumber(input.toUpperCase();
  };

  // ********************************auto complete*****************************
  const [selectedSuggestionIdx, setSelectedSuggestionIdx] = useState(0);
  const [inputPartNumber, setInputPartNumber] = useState('');
  const [displaySuggestions, setDisplaySuggestions] = useState(false);

  const inputPartNumberDebounced = useDebounce(inputPartNumber, 500);
  useEffect(() => {
    if (inputPartNumberDebounced) {
      getAdminHeatersService(inputPartNumberDebounced)
        .then((res) => {
          setElementsOptions(
            res.map((el) => {
              return {
                elementName: el.elementName,
                partNumber: el.partNumber,
                current: Number(el.current),
                wattage: Number(el.wattage),
                voltage: Number(el.voltage),
                lengths: Number(el.lengths),
              };
            });
          setPartNumberSuggestions(res.map((el) => el.partNumber);
        })
        .catch((err) => {
        });
    }
  }, [inputPartNumberDebounced]);

  let filteredSuggestions = partNumberSuggestions.filter(
    (suggestion) =>
      suggestion.includes(inputPartNumber);

  useEffect(() => {
    filteredSuggestions.length >= 1 && inputPartNumber.length >= 2
      ? setDisplaySuggestions(true)
      : setDisplaySuggestions(false);
  }, [filteredSuggestions, inputPartNumber]);

  const handleSelect = (index, suggestion) => {
    const newInput = [...inputDetails];
    newInput[inputId[0]].partNumber = suggestion;
    setInputDetails(newInput);
  };

  const handleKeyDown = (event, index) => {
    switch (event.key) {
      case 'Escape': {
        setInputPartNumber('');
        break;
      }
      case 'Enter': {
        handleSelect(index, filteredSuggestions[selectedSuggestionIdx]);
        setInputPartNumber('');
        setSelectedSuggestionIdx(-1);
        setDisplaySuggestions(false);
        break;
      }
      case 'ArrowUp': {
        selectedSuggestionIdx > 0
          ? setSelectedSuggestionIdx(selectedSuggestionIdx - 1)
          : setSelectedSuggestionIdx(filteredSuggestions.length - 1);
        break;
      }
      case 'ArrowDown': {
        selectedSuggestionIdx < filteredSuggestions.length - 1
          ? setSelectedSuggestionIdx(selectedSuggestionIdx + 1)
          : setSelectedSuggestionIdx(0);
        break;
      }
      default: {
        break;
      }
    }
  };

  // ********************************auto complete*****************************

  return (
    <Wrapper>
      <ContentWrapper isEnable={isEnable} isFault={isFault} isWarn={isWarn}>
        {elementSpec.map((element, index) => (
          <Fragment key={index}>
            <ItemWrapper  column={index} hiddenNumber={hiddenNumber}>
              <ItemPartNumber isEnable={isEnable}>
                <ItemPartNumberInput
                  type='text'
                  isEnable={isEnable}
                  placeholder='Input P / N'
                  onChange={(event) => {
                    handleSetInput(index, event.target.value);
                    setSelectedSuggestionIdx(-1);
                  }}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  value={inputDetails[index].partNumber}
                  onClick={() => setInputId([index])}
                />
              </ItemPartNumber>
              {displaySuggestions && (
                <AutoCompleteWrapper
                  onMouseMove={() => setSelectedSuggestionIdx(-1)}
                >
                  <AutoCompleteInnerWrapper>
                    {filteredSuggestions.map((suggestion, idx) => {
                      let isSelected =
                        filteredSuggestions.indexOf(suggestion) ===
                        selectedSuggestionIdx
                          ? true
                          : false;

                      return (
                        <PartNumberSuggestion
                          key={idx}
                          column={index}
                          matchedSuggestion={suggestion}
                          isSelected={isSelected}
                          handleSelect={handleSelect}
                          handleClose={() => {
                            setDisplaySuggestions(false);
                            setInputPartNumber('');
                          }}
                        />
                      );
                    })}
                  </AutoCompleteInnerWrapper>
                </AutoCompleteWrapper>
              )}

              <ItemOuterWrapper isEnable={isEnable}>
                <ItemData>
                  {element.current ? element.current : '----'}
                </ItemData>
              </ItemOuterWrapper>

              <ItemOuterWrapper isEnable={isEnable}>
                <ItemData>
                  {element.wattage ? element.wattage : '----'}
                </ItemData>
              </ItemOuterWrapper>

              <ItemOuterWrapper isEnable={isEnable}>
                <ItemData>
                  {element.voltage ? element.voltage : '----'}
                </ItemData>
              </ItemOuterWrapper>

              <ItemOuterWrapper isEnable={isEnable}>
                <ItemData>
                  {element.lengths ? element.lengths : '----'}
                </ItemData>
              </ItemOuterWrapper>

              <DescriptionAndButtonWrapper>
                <ItemDescription isEnable={isEnable}>
                  <ItemDataDescription isDescription={true} isEnable={isEnable}>
                    {inputDetails[index].partNumber?.length > 5
                      ? `${element.elementName} - ${element.partNumber} / ${element.current}a / ${element.wattage}w / ${element.voltage}v / ${element.lengths}m - ${element.lengths}ft`
                      : 'element not found'}
                  </ItemDataDescription>
                </ItemDescription>

                {/* <SSRSettingButton
                  isSettingOpen={isSettingOpen}
                  handleButtonClick={handleButtonClick}
                  id={option}
                  column={index + 1}
                  // when ssr status is fault button will be disable
                /> */}
              </DescriptionAndButtonWrapper>
            </ItemWrapper>
          </Fragment>
        ))}
      </ContentWrapper>

      <SSRDetailButtonContainer
        handleClick={handleClick}
        isEditable={isEditable}
      />
      {activateMessageBox && (
        <MessageBoxWrapper>
          <MessageBox
            onClose={() => {
              setActivateMessageBox(false);
              if (!message) {
                handleButtonClick();
              }
            }}
            title='ssr details settings'
            messages={message ? [message] : ['selections confirmed']}
          />
        </MessageBoxWrapper>
      )}
    </Wrapper>
  );
};
export default AdminSSRItemDetails;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  /* For layout */
  height: 106px;
`;
const ContentWrapper = styled.ul`
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: 1.5px 0;
  border-radius: 12px 12px 0 12px;

  ${layerA180Deg};

  ${(p) =>
    p.isEnable ||
    css`
      ${layerADisabled180Deg};
      border-radius: 12px;
    `}

  ${(p) =>
    p.isFault &&
    css`
      border: 1px solid red;
    `};

  ${(p) =>
    p.isWarn &&
    css`
      border: 1px solid #ff7800;
    `};
`;

const ItemWrapper = styled.div`
  ${flexBoxCenter}
  justify-content: space-between;
  padding: 0 1.5px;

  &:first-child {
    ${(p) =>
      p.hiddenNumber === 1 ||
      css`
        margin-bottom: 3px;
      `}
  }
  &:nth-child(2) {
    ${(p) =>
      p.hiddenNumber === 2 ||
      css`
        margin-bottom: 3px;
      `}

    ${(p) =>
      p.column < p.hiddenNumber ||
      css`
        display: none;
      `}
  }
  &:last-child {
    ${(p) =>
      p.column < p.hiddenNumber ||
      css`
        display: none;
      `}
  }
`;
const ItemPartNumber = styled.li`
  width: 94px;
  height: 20px;
  ${ItemBackground}

  ${flexBoxCenter}

   ${(p) =>
    p.isEnable ||
    css`
      ${ItemBackgroundDisable}
    `}
`;

const ItemOuterWrapper = styled.li`
  ${flexBoxCenter}

  width: 96px;
  height: 20px;
  ${ItemBackground}

  ${(p) =>
    p.isEnable ||
    css`
      ${ItemBackgroundDisable}
    `}
`;

const ItemDescription = styled.li`
  ${flexBoxCenter}

  width: 385.5px;
  height: 20px;
  ${ItemBackground}
  ${(p) =>
    p.isEnable ||
    css`
      ${ItemBackgroundDisable}
    `};
`;

const ItemPartNumberInput = styled.input`
  font-size: 9px;
  text-align: center;

  width: 100%;

  background-color: transparent;
  &::placeholder {
    color: #fff;
    color: ${(p) => p.isEnable || `#808080;`};
  }
`;

const ItemData = styled.div`
  font-size: 10px;
  text-align: center;
  width: 90px;

  background-color: transparent;
  &::placeholder {
    color: #fff;
    color: ${(p) => p.isEnable || `#808080;`};
  }
`;

const ItemDataDescription = styled.span`
  font-size: 7.5px;
  text-align: center;

  width: 90%;
  letter-spacing: -0.2px;

  /* ${(p) =>
    p.isDescription &&
    css`
      font-size: 6px;
    `} */
  color: ${(p) => p.isEnable || `#808080;`};

  /* Layout for radio box with parents box */
  margin-right: 6px;
`;

const DescriptionAndButtonWrapper = styled.div`
  width: 408px;
  ${justifyContentSpaceBetween}
`;

const AutoCompleteWrapper = styled.ul`
  width: 221px;
  border-radius: 20px;
  padding: 3px;
  text-align: left;

  ${layerA180Deg};
  ${flexBoxCenter}

  position: absolute;
  top: 46px;
  left: 0px;
  z-index: 1000;
`;

const AutoCompleteInnerWrapper = styled.div`
  width: 209px;
  border-radius: 15px;
  ${layerBDark};

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MessageBoxWrapper = styled.div`
  width: 120%;
  border-radius: 16px;

  display: flex;
  justify-content: center;

  margin-top: 8px;
  padding: 16px;

  position: absolute;
  top: -100px;
  right: 0px;
  z-index: 100;

  cursor: pointer;
`;

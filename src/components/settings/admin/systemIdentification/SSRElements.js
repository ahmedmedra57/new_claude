import styled, { css } from 'styled-components';
import {
  ItemBackground,
  alignItemsFlexStart,
  flexBoxCenter,
  justifyContentFlexEnd,
  justifyContentSpaceAround,
  layerA,
  layerA180Deg,
  layerB,
  layerBDark,
  layerCLighter,
  scrollbarY,
} from '../../../styles/commonStyles';
import { useState, useEffect, useCallback } from 'react';
import SelectBox from './SelectBox';
import { useSelector } from 'react-redux';
import { selectDescription } from '../../../store/slices/ssrDescriptionSlice';
import { matchSorter } from 'match-sorter';
import { useDebounce } from '../../../../hooks';
import { getAdminHeatersService } from '../../../../services';
import DownShiftAutoComplete from './DownShiftAutoComplete';

const SSRElements = ({
  SSRList,
  groupedSwitches,
  groupedIdx,
  switches,
  setSwitches,
}) => {
  const buttonTitles = ['add', 'clear'];

  // Create the list of thermoCouple
  const listOfTc = Array.from({ length: 11 }, (_, i) => {
    if (i < 9) {
      return 'tc-0' + (Number(i) + 1);
    } else {
      return 'tc-' + (Number(i) + 1);
    }
  });

  // create initial state of all thermocouple to be selected to tc-01
  const selectedTcArr = Array.from({ length: SSRList.length }, (_, i) => '---');

  // create new arr for the useState below to manage the opening of thermocouple Select box
  const openSelectBoxes = Array.from(
    { length: SSRList.length },
    (_, i) => false
  );

  // useStates
  const [selectedSSR, setSelectedSSR] = useState('');
  const [selectedTc, setSelectedTc] = useState(selectedTcArr);
  const [openSelectSSRBox, setOpenSelectSSRBox] = useState(openSelectBoxes);
  const [listOfGroupedSwitches, setListOfGroupedSwitches] = useState([]);
  const [inputPartNumber, setInputPartNumber] = useState('');

  // useRedux
  const { elementsOptions: elementsOptionsStore } =
    useSelector(selectDescription);
  const [elementsOptions, setElementsOptions] = useState(elementsOptionsStore);

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
            })
          );
        })
        .catch((err) => {
        });
    }
  }, [inputPartNumberDebounced]);
  // ****
  useEffect(() => {
    // sets all perviously selected thermocouples
    const copySelectedTc = [...selectedTcArr];
    groupedSwitches.forEach((switchEl) => {
      switchEl.selectedSSR.forEach((ssr) => {
        const objKey = Object.keys(ssr)[0];
        SSRList.forEach((el, ssrIdx) => {
          if (el === objKey) {
            copySelectedTc[ssrIdx] = ssr[objKey].thermoCouple;
          }
        });
      });
    });

    setSelectedTc(copySelectedTc);

    // create the list of switches to for select box
    let SwitchesArr = [];
    groupedSwitches.forEach((switchEl) => {
      SwitchesArr.push(switchEl.switchName);
    });
    setListOfGroupedSwitches(SwitchesArr);
  }, []);

  // ****
  // handle opening and closing of all select boxes
  const handleOpenSelectBoxes = useCallback(
    (isSelectSwitch, SSRIdx, switchIdx, SSR) => {
      if (isSelectSwitch) {
        // switches
        const copySwitches = [...switches];
        copySwitches[groupedIdx][SSRIdx].selectedSSR[switchIdx][
          SSR
        ].isSelectSwitchListOpen =
          !copySwitches[groupedIdx][SSRIdx].selectedSSR[switchIdx][SSR]
            .isSelectSwitchListOpen;
        setSwitches(copySwitches);
      } else {
        // thermocouples
        const copyOpenSelectSSRBox = [...openSelectSSRBox];
        copyOpenSelectSSRBox[SSRIdx] = !copyOpenSelectSSRBox[SSRIdx];
        setOpenSelectSSRBox(copyOpenSelectSSRBox);
      }
    },
    [openSelectSSRBox, switches]
  );

  // ****
  // handle selection of thermocouple
  const handleSelectTcBoxes = (selected, groupedIdx, SSR) => {
    const copySwitches = [...switches];
    copySwitches[groupedIdx].forEach(({ selectedSSR }, selectedIdx) => {
      selectedSSR.forEach((ssr, idx) => {
        const objKey = Object.keys(ssr)[0];

        if (objKey === SSR) {
          copySwitches[groupedIdx][selectedIdx].selectedSSR[idx][
            SSR
          ].thermoCouple = selected;
        }
      });
    });
    setSwitches(copySwitches);

    const tcIdx = +SSR.match(/\d+/g)[0] - 1;
    const copySelectedTc = [...selectedTc];
    copySelectedTc[tcIdx] = selected;
    setSelectedTc(copySelectedTc);
  };

  // ****
  //handle select boxes of selecting switches
  const handleSwitchSelectBoxes = (
    switchesIdx,
    selected,
    SSR
    // selectedSSRIdx
  ) => {
    const copySwitches = [...switches];
    const toBeRemoveSwitchesIdx = [];
    const selectedSSR = copySwitches[groupedIdx][switchesIdx].selectedSSR;

    copySwitches[groupedIdx].forEach((switchEl) => {
      if (switchEl.switchName === selected) {
        // add switches to the new selected switchName
        selectedSSR.forEach((el, idx) => {
          if (Object.keys(el)[0] === SSR) {
            el[SSR].isNewlyAdded = false;
            switchEl.selectedSSR.push(el);
            toBeRemoveSwitchesIdx.push(idx);
          }
        });
      }
    });

    // remove switches from previously selected switchName
    toBeRemoveSwitchesIdx.slice().reverse().forEach((el) => {
      selectedSSR.splice(el, 1);
    });

    // make elements in the group to use the same switch
    copySwitches[groupedIdx].forEach((switchEl, idx) => {
      if (idx !== switchesIdx) {
        switchEl.selectedSSR.forEach((el) => {
          if (Object.keys(el)[0] === SSR) {
            el[SSR].isNewlyAdded = false;
          }
        });
      }
    });

    setSwitches(copySwitches);
  };

  // ****
  const handleAddClearButtons = (buttonIdx, SSR) => {
    const copySwitches = [...switches];
  
    switch (buttonIdx) {
      case 0: // Add button
        // First, check if this SSR exists in any switch
        let existingSSRSwitch = null;
        copySwitches[groupedIdx].forEach((switchEl, idx) => {
          const hasSSR = switchEl.selectedSSR.some(el => Object.keys(el)[0] === SSR);
          if (hasSSR) {
            existingSSRSwitch = switchEl;
          }
        });
  
        if (existingSSRSwitch) {
          // SSR exists, add heater spec to existing SSR
          const ssrEntry = existingSSRSwitch.selectedSSR.find(
            (el) => Object.keys(el)[0] === SSR
          );
  
          if (ssrEntry[SSR].specs.length >= 3) {
            return;
          }
  
          ssrEntry[SSR].specs.push({
            elementName: '',
            partNumber: '',
            currentCurrent: '',
            current: '',
            wattage: '',
            voltage: '',
            lengths: '',
          });
        } else {
          // First time adding a heater for this SSR
          // Always add to first switch without creating duplicate SSR entries
          const firstSwitchIdx = 0;
          
          // Check if SSR already exists in first switch
          const existingSSREntry = copySwitches[groupedIdx][firstSwitchIdx].selectedSSR.find(
            el => Object.keys(el)[0] === SSR
          );
  
          if (!existingSSREntry) {
            // Only create new SSR entry if it doesn't exist
            copySwitches[groupedIdx][firstSwitchIdx].selectedSSR.push({
              [SSR]: {
                thermoCouple: '---',
                isSelectSwitchListOpen: false,
                isNewlyAdded: false,
                currentSpecs: [],
                specs: [{
                  elementName: '',
                  partNumber: '',
                  currentCurrent: '',
                  current: '',
                  wattage: '',
                  voltage: '',
                  lengths: '',
                }],
              },
            });
          } else {
            // SSR exists, just add another heater spec
            if (existingSSREntry[SSR].specs.length >= 3) {
              return;
            }
            existingSSREntry[SSR].specs.push({
              elementName: '',
              partNumber: '',
              currentCurrent: '',
              current: '',
              wattage: '',
              voltage: '',
              lengths: '',
            });
          }
        }
        break;
  
      case 1: // Clear button
        let switchIdx1 = '';
  
        // Find the switch associated with the SSR
        copySwitches[groupedIdx].forEach((switchEl, idx) => {
          switchEl.selectedSSR.forEach((el) => {
            if (Object.keys(el)[0] === SSR) {
              switchIdx1 = idx;
            }
          });
        });
  
        if (switchIdx1 !== '') {
          const ssrEntry = copySwitches[groupedIdx][switchIdx1].selectedSSR.find(
            (el) => Object.keys(el)[0] === SSR
          );
  
          // Instead of removing the entire SSR entry, just clear the specs array
          // but keep one empty spec
          if (ssrEntry[SSR].specs.length > 1) {
            ssrEntry[SSR].specs.pop();
          } else {
            // Reset the single spec to empty values instead of removing the SSR entry
            ssrEntry[SSR].specs = [];
          }
        }
  
        break;
  
      default:
        break;
    }
  
    setSwitches(copySwitches);
  };
  

  // ****
  const itemToString = (item) => (item ? item.partNumber : '');

  // useDownshift library for autocompletion of input boxes at part number and match-sorter to filtered the results of input box
  const getItems = (value, elementIdx, SSR) => {
    setInputPartNumber(value);
    if (value) {
      const partNumbers = switches[groupedIdx][elementIdx].selectedSSR
        .filter((el) => Object.keys(el)[0] === SSR)
        .map((el) => el[SSR].specs)
        .flat()
        .map((el) => el.partNumber);
      const filteredElementsOptions = elementsOptions.filter(
        (el) => !partNumbers.includes(el.partNumber)
      );
      const filteredResult = matchSorter(filteredElementsOptions, value, {
        keys: ['partNumber'],
      });

      return filteredResult;
    } else {
      return elementsOptions;
    }
  };

  // ****
  // handles the selection of part number from the list of dropdown
  const handleSelectedPartNumber = (
    selectedItem,
    selectedSSRIdx,
    SSR,
    specsIdx,
    switchIdx
  ) => {
    const copySwitches = [...switches];

    copySwitches[groupedIdx][switchIdx].selectedSSR[selectedSSRIdx][
      SSR
    ].specs.splice(specsIdx, 1, selectedItem);

    setSwitches(copySwitches);
  };

  return (
    <>
      {SSRList?.map((SSR, SSRIdx) => {
        return (
          <Wrapper key={SSRIdx}>
            {/* titles of SSR and dropbox selection of TC */}
            <SwitchTitlesWrapper>
              <SSRAndTCWrapper>
                <SSRWrapper>
                  <Ssr>{SSR}</Ssr>
                </SSRWrapper>
                {/* TC selectBox */}
                <SelectBox
                  isTc={true}
                  displaySelectBox={openSelectSSRBox[SSRIdx]}
                  switchIdx={SSRIdx}
                  SSR={SSR}
                  handleOpenSelectBoxes={() =>
                    handleOpenSelectBoxes(false, SSRIdx)
                  }
                  handleSelectBoxes={handleSelectTcBoxes}
                  selectBoxFor={'tc'}
                  selected={selectedTc[SSRIdx]}
                  content={listOfTc}
                  isCreateEditOrSave={false}
                  groupedIdx={groupedIdx}
                />
              </SSRAndTCWrapper>
              <SubTitle isPartNum={true}>part number</SubTitle>
              <SubTitle isCurrent={true}>current (a)</SubTitle>
              <SubTitle isWattage={true}>wattage (w)</SubTitle>
              <SubTitle isVoltage={true}>voltage (v)</SubTitle>
              <SubTitle isLength={true}>length (ft)</SubTitle>
              <SubTitle isDescription={true}>description</SubTitle>
            </SwitchTitlesWrapper>

            {/* grouped elements assigned to different switches */}
            <ElementsWrapper>
              {groupedSwitches?.map((element, elementIdx) => {
                return (
                  <div key={elementIdx}>
                    {element.selectedSSR.map((ssr, selectedSSRIdx) => {
                      const selectedSSR2 = Object.entries(ssr);
                      const key = selectedSSR2[0][0];
                      const value = selectedSSR2[0][1];
                      return (
                        <div key={selectedSSRIdx}>
                          {key === SSR &&
                            value.specs.map((el, elIdx) => {
                              const isFirstElement = elIdx === 0;
                              return (
                                <EachSwitchSpecsWrapper key={elIdx}>
                                  <SelectSwitchWrapper>
                                    <SelectBox
                                      displaySelectBox={
                                        isFirstElement &&
                                        groupedSwitches[elementIdx].selectedSSR[
                                          selectedSSRIdx
                                        ][SSR].isSelectSwitchListOpen
                                      }
                                      switchIdx={elementIdx}
                                      SSR={SSR}
                                      handleOpenSelectBoxes={() =>
                                        isFirstElement &&
                                        handleOpenSelectBoxes(
                                          true,
                                          elementIdx,
                                          selectedSSRIdx,
                                          SSR
                                        )
                                      }
                                      handleSelectBoxes={handleSwitchSelectBoxes}
                                      selectedSSRIdx={selectedSSRIdx}
                                      selectBoxFor={'switch'}
                                      selected={
                                        value?.isNewlyAdded
                                          ? 'select switch'
                                          : element.switchName
                                      }
                                      content={listOfGroupedSwitches}
                                      isCreateEditOrSave={false}
                                      groupedIdx={groupedIdx}
                                      disabled={!isFirstElement}
                                    />
                                  </SelectSwitchWrapper>              
                                  {/* <DownShiftAutoComplete2
                                    getItems={getItems}
                                    elementIdx={elementIdx}
                                    SSR={SSR}
                                    handleSelectedPartNumber={
                                      handleSelectedPartNumber
                                    }
                                    selectedSSRIdx={selectedSSRIdx}
                                    el={el}
                                    elIdx={elIdx}
                                  /> */}
                                  <DownShiftAutoComplete
                                    options={elementsOptions}
                                    specs={value.specs}
                                    currentSpecs={value.currentSpecs}
                                    handleSelectedPartNumber={
                                      handleSelectedPartNumber
                                    }
                                    selectedSSRIdx={selectedSSRIdx}
                                    SSR={SSR}
                                    elementIdx={elementIdx}
                                    elIdx={elIdx}
                                    el={el}
                                  />
                                </EachSwitchSpecsWrapper>
                              );
                            })}
                        </div>
                      );
                    })}
                  </div>
                );
              })}

              {/* part number input */}
              {/* <Spec isPartNum={true}>
                                          <Input
                                            type='text'
                                            value={el.partNumber}
                                            onChange={(e) =>
                                              handleSpecsInputs(
                                                groupedIdx,
                                                elementIdx,
                                                elIdx,
                                                SSR,
                                                'partNumber',
                                                e.target.value
                                              )
                                            }
                                          />
                                        </Spec>
                                        
                                        <Flex>
                                          <Spec isCurrent={true}>
                                            {el.currentCurrent
                                              ? el.currentCurrent + ' ' + 't'
                                              : ''}
                                          </Spec>
                                          <Spec isCurrent={true}>
                                            {el.current
                                              ? el.current + ' ' + 'a'
                                              : ''}
                                          </Spec>
                                        </Flex>
                                        <Spec isCommonSize={true}>
                                          {el.wattage
                                            ? el.wattage + ' ' + 'w'
                                            : ''}
                                        </Spec>
                                        <Spec isCommonSize={true}>
                                          {el.voltage
                                            ? el.voltage + ' ' + 'v'
                                            : ''}
                                        </Spec>
                                        <Spec isCommonSize={true}>
                                          {el.lengths
                                            ? el.lengths + ' ' + 'm'
                                            : ''}
                                        </Spec>
                                        {el.elementName &&
                                        el.partNumber &&
                                        el.current &&
                                        el.wattage &&
                                        el.voltage &&
                                        el.lengths ? (
                                          <Spec isDescription={true}>
                                            {el.elementName} - {el.partNumber}/
                                            {el.current + ' ' + 'a'}/
                                            {el.wattage + ' ' + 'w'}/
                                            {el.voltage + ' ' + 'v'}/
                                            {el.lengths + ' ' + 'm'}
                                          </Spec>
                                        ) : (
                                          <Spec isDescription={true}></Spec>
                                        )} */}

              {/* <div key={Math.floor(Math.random() * 199842)}>
                    {selectedSSR[0] &&
                      element[selectedSSR[0]].specs.map((el, elIdx) => {
                        return (
                          <EachSwitchSpecsWrapper
                            key={Math.floor(Math.random() * 14444)}
                          >
                            <SelectSwitchWrapper>
                              <SelectSwitch>
                                <SelectSwitchIndent>
                                  {element.switchName}
                                </SelectSwitchIndent>
                                <Img
                                  src={
                                    './images/settings-sysIdentification-whiteTriangle.svg'
                                  }
                                  onClick={() => ''}
                                />
                              </SelectSwitch>
                            </SelectSwitchWrapper>
                            <Spec isPartNum={true}>
                              <Input
                                type='text'
                                value={el.partNumber}
                                onChange={(e) =>
                                  handleSpecsInputs(
                                    groupedIdx,
                                    elementIdx,
                                    elIdx,
                                    SSR,
                                    'partNumber',
                                    e.target.value
                                  )
                                }
                              />
                            </Spec>
                            <Flex>
                              <Spec isCurrent={true}>
                                {el.currentCurrent + ' ' + 't'}
                              </Spec>
                              <Spec isCurrent={true}>
                                {el.current + ' ' + 'a'}
                              </Spec>
                            </Flex>
                            <Spec isCommonSize={true}>
                              {el.wattage + ' ' + 'w'}
                            </Spec>
                            <Spec isCommonSize={true}>
                              {el.voltage + ' ' + 'v'}
                            </Spec>
                            <Spec isCommonSize={true}>
                              {el.lengths + ' ' + 'm'}
                            </Spec>
                            <Spec isDescription={true}>
                              {el.elementName} - {el.partNumber}/
                              {el.current + ' ' + 'a'}/{el.wattage + ' ' + 'w'}/
                              {el.voltage + ' ' + 'v'}/ {el.lengths + ' ' + 'm'}
                            </Spec>
                          </EachSwitchSpecsWrapper>
                        );
                      })}
                  </div> */}

              {/* {GroupedSwitches[SSR]?.specs?.map((el, elIdx) => {
                return (
                  <EachSwitchSpecsWrapper
                    key={Math.floor(Math.random() * 14444)}
                  >
                    <SelectSwitchWrapper>
                      <SelectSwitch>
                        <SelectSwitchIndent>
                          <Img
                            src={
                              './images/settings-sysIdentification-whiteTriangle.svg'
                            }
                            onClick={() => ''}
                          />
                        </SelectSwitchIndent>
                      </SelectSwitch>
                    </SelectSwitchWrapper>
                    <Spec isPartNum={true}>{el.partNumber}</Spec>
                    <Spec isCurrent={true}></Spec>
                    <Spec isCurrent={true}></Spec>
                    <Spec isCommonSize={true}></Spec>
                    <Spec isCommonSize={true}></Spec>
                    <Spec isCommonSize={true}></Spec>
                    <Spec isDescription={true}></Spec>
                  </EachSwitchSpecsWrapper>
                );
              })} */}

              {/* Add and Clear buttons  */}
              <ButtonsWrapper>
                {buttonTitles?.map((title, buttonIdx) => {
                  return (
                    <ButtonWrapper key={buttonIdx} isAddClear={true}>
                      <Button
                        isAddClear={true}
                        onClick={() => handleAddClearButtons(buttonIdx, SSR)}
                      >
                        <ButtonIndent isAddClear={true}>
                          <ButtonTop isAddClear={true}>
                            <Title>{title}</Title>
                          </ButtonTop>
                        </ButtonIndent>
                      </Button>
                    </ButtonWrapper>
                  );
                })}
              </ButtonsWrapper>
            </ElementsWrapper>
          </Wrapper>
        );
      })}
    </>
  );
};

export default SSRElements;

//  <Downshift itemToString={itemToString}>
//                                     {({
//                                       getInputProps,
//                                       isOpen,
//                                       getMenuProps,
//                                       getItemProps,
//                                       getRootProps,
//                                       highlightedIndex,
//                                       inputValue,
//                                       selectedItem,
//                                     }) => (
//                                       <>
//                                         {/* part number input */}
//                                         <Spec
//                                           isPartNum={true}
//                                           {...getRootProps(
//                                             {},
//                                             { suppressRefError: true }
//                                           )}
//                                         >
//                                           <Input
//                                             placeholder={el.partNumber}
//                                             {...getInputProps()}
//                                           />
//                                         </Spec>

//                                         {/* autoComplete list */}
//                                         {isOpen && (
//                                           <AutoCompleteList {...getMenuProps()}>
//                                             <AutoCompleteListInnerWrapper>
//                                               {getItems(
//                                                 inputValue,
//                                                 elementIdx,
//                                                 SSR
//                                               ).map((item, index) => {
//                                                 return (
//                                                   <ListWrapper
//                                                     key={item.partNumber}
//                                                   >
//                                                     <List
//                                                       {...getItemProps({
//                                                         item,
//                                                         key: item.partNumber,
//                                                       })}
//                                                       onClick={() =>
//                                                         handleSelectedPartNumber(
//                                                           item,
//                                                           selectedSSRIdx,
//                                                           SSR,
//                                                           elIdx,
//                                                           elementIdx
//                                                         )
//                                                       }
//                                                     >
//                                                       {item.partNumber}
//                                                     </List>
//                                                   </ListWrapper>
//                                                 );
//                                               })}
//                                             </AutoCompleteListInnerWrapper>
//                                           </AutoCompleteList>
//                                         )}

//                                         {/* display specs depending on the chosen part number above */}
//                                         <Flex>
//                                           <Spec isCurrent={true}>
//                                             {el.currentCurrent
//                                               ? el.currentCurrent + ' ' + 't'
//                                               : ''}
//                                           </Spec>
//                                           <Spec isCurrent={true}>
//                                             {el.current
//                                               ? el.current + ' ' + 'a'
//                                               : ''}
//                                           </Spec>
//                                         </Flex>
//                                         <Spec isCommonSize={true}>
//                                           {el.wattage
//                                             ? el.wattage + ' ' + 'w'
//                                             : ''}
//                                         </Spec>
//                                         <Spec isCommonSize={true}>
//                                           {el.voltage
//                                             ? el.voltage + ' ' + 'v'
//                                             : ''}
//                                         </Spec>
//                                         <Spec isCommonSize={true}>
//                                           {el.lengths
//                                             ? el.lengths + ' ' + 'm'
//                                             : ''}
//                                         </Spec>
//                                         {el.elementName &&
//                                         el.partNumber &&
//                                         el.current &&
//                                         el.wattage &&
//                                         el.voltage &&
//                                         el.lengths ? (
//                                           <Spec isDescription={true}>
//                                             {el.elementName} - {el.partNumber}/
//                                             {el.current + ' ' + 'a'}/
//                                             {el.wattage + ' ' + 'w'}/
//                                             {el.voltage + ' ' + 'v'}/
//                                             {el.lengths + ' ' + 'm'}
//                                           </Spec>
//                                         ) : (
//                                           <Spec isDescription={true}></Spec>
//                                         )}
//                                       </>
//                                     )}
//                                   </Downshift>

const Wrapper = styled.div`
  margin-top: 6px;
  &:first-child {
    margin-top: 4px;
  }
`;

const SwitchTitlesWrapper = styled.div`
  height: 24px;
  width: 100%;
  ${flexBoxCenter}
  gap:22.5px;
  position: relative;
`;

const SubTitle = styled.div`
  ${({ isPartNum, isCurrent, isWattage, isVoltage, isLength, isDescription }) =>
    isPartNum
      ? css`
          position: absolute;
          top: 5px;
          left: 149px;
        `
      : isCurrent
      ? css`
          position: absolute;
          top: 5px;
          left: 255px;
        `
      : isWattage
      ? css`
          position: absolute;
          top: 5px;
          left: 332px;
        `
      : isVoltage
      ? css`
          position: absolute;
          top: 5px;
          left: 408px;
        `
      : isLength
      ? css`
          position: absolute;
          top: 5px;
          left: 484px;
        `
      : isDescription &&
        css`
          position: absolute;
          top: 5px;
          left: 638px;
        `}

  height: 10px;
  width: auto;
  font-size: 8px;
  letter-spacing: 0.8px;
  color: #ffffff;
`;

const SSRAndTCWrapper = styled.div`
  width: 118px;
  height: 20px;

  ${layerCLighter}
  border-radius: 12px;
  ${flexBoxCenter}

  position: absolute;
  top: 0;
  left: 0px;
`;

const SSRWrapper = styled.div`
  width: 58px;
  ${flexBoxCenter}
`;

const Ssr = styled.span`
  font-size: 10px;
  color: #fcff01;
`;

const TCDropBox = styled.div`
  width: 60px;
  height: 18px;
  margin-right: 1px;

  ${layerA180Deg}
  border-radius: 12px;
  ${justifyContentSpaceAround}
`;

const TC = styled.div`
  width: 43px;
  height: 14px;
  font-size: 8px;
  letter-spacing: 0.8px;

  ${layerA}
  border-radius: 12px;
`;

const Img = styled.img`
  /* margin-right: 3px; */
  cursor: pointer;
`;

const ElementsWrapper = styled.div`
  width: 808px;
  min-height: 63px;

  ${layerA180Deg}
  border-radius: 12px 12px 17px 12px;
`;

const EachSwitchSpecsWrapper = styled.div`
  width: 100%;
  height: 20px;
  margin-top: 4px;

  ${justifyContentSpaceAround}
  position:relative;
`;

const SelectSwitchWrapper = styled.div`
  width: 116px;
  height: 20px;

  ${layerA}

  border-radius: 12px;

  ${flexBoxCenter}
`;

const SelectSwitch = styled.div`
  width: 114px;
  height: 18px;

  ${layerA180Deg}

  border-radius: 12px;

  ${justifyContentSpaceAround}
`;

const SelectSwitchIndent = styled.div`
  width: 93px;
  height: 14px;
  font-size: 8px;
  letter-spacing: 0.8px;

  ${layerA}

  border-radius: 12px;

  ${flexBoxCenter}
`;

// const AllSpecs = styled.div`
// position: relative;
// `

const Spec = styled.div`
  height: 100%;

  font-size: 8px;
  letter-spacing: 0.8px;
  text-align: center;

  ${({ isPartNum, isCurrent, isCommonSize, isDescription }) =>
    isPartNum
      ? css`
          width: 76px;
          position: relative;
        `
      : isCurrent
      ? css`
          width: 42px;
        `
      : isCommonSize
      ? css`
          width: 72px;
        `
      : isDescription &&
        css`
          width: 260px;
          /* text-align: center; */
        `}

  ${layerA}

  border-radius: 12px;

  ${flexBoxCenter}
`;

const Flex = styled.div`
  height: 100%;
  display: flex;
  gap: 2px;
`;

const Input = styled.input`
  width: 85%;
  background-color: inherit;
  font-size: 8px;
  letter-spacing: 0.8px;
  text-align: center;
  ::placeholder {
    color: #ffff;
  }
`;

const AutoCompleteList = styled.ul`
  max-height: 200px;
  width: 160px;
  padding: 2px;
  text-align: left;

  position: absolute;

  top: 20px;
  left: 80px;

  z-index: 100;

  ${alignItemsFlexStart}

  ${layerA180Deg}

  border-radius: 12px;

  ${scrollbarY}
  ::-webkit-scrollbar {
    display: none;
  }

  /* ${(p) =>
    p.isTrue ||
    css`
      display: none;
    `} */
`;

const AutoCompleteListInnerWrapper = styled.div`
  /* max-height: 198px; */
  width: 100%;
  ${layerBDark}

  border-radius: 10px;
  padding: 2px 2px;

  /* ${(p) =>
    p.isTrue ||
    css`
      display: none;
    `} */

  ${flexBoxCenter}
  flex-direction: column;
`;

const ListWrapper = styled.div`
  height: 16px;
  width: 98%;

  ${ItemBackground};
  /* border-radius: 6px; */

  background-color: ${(p) => p.isSelected && `hsla(50deg, 100%, 80%,0.25)`};
  &:hover {
    background-color: hsla(50deg, 100%, 80%, 0.25);
  }

  margin-bottom: 2px;
  :last-child {
    margin-bottom: 0px;
  }
  /* padding-left: 10px; */
  cursor: pointer;
  overflow: hidden;
  ${flexBoxCenter};
`;

const List = styled.li`
  height: 8px;

  font-size: 8px;
  letter-spacing: 0.8px;

  align-items: center;
`;

const ButtonsWrapper = styled.div`
  width: 99.7%;
  margin-top: 8px;
  margin-bottom: 3px;
  ${justifyContentFlexEnd}
  gap:4px;
`;

const ButtonWrapper = styled.div`
  ${({ isAddClear }) =>
    isAddClear
      ? css`
          width: 84px;
          height: 29px;
        `
      : css``}

  ${layerB}
  border-radius: 27px;

  ${flexBoxCenter}
`;

const Button = styled.button`
  ${({ isAddClear }) =>
    isAddClear
      ? css`
          width: 82px;
          height: 27px;
        `
      : css``}

  ${layerA180Deg}
  border-radius: 25px;

  ${flexBoxCenter}
`;

const ButtonIndent = styled.div`
  ${({ isAddClear }) =>
    isAddClear
      ? css`
          width: 76px;
          height: 21px;
        `
      : css``}

  ${layerB}
  border-radius: 20px;

  ${flexBoxCenter}
`;

const ButtonTop = styled.div`
  ${({ isAddClear }) =>
    isAddClear
      ? css`
          width: 74px;
          height: 19px;
        `
      : css``}

  ${layerA180Deg}
  border-radius: 25px;

  ${flexBoxCenter}
`;

const Title = styled.p`
  font-size: 10px;
`;

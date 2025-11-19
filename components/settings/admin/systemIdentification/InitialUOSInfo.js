import React from 'react';
import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  justifyContentFlexStart,
  justifyContentSpaceAround,
  justifyContentSpaceEvenly,
  layerA,
  layerA180Deg,
  layerADark,
  layerB,
} from '../../../styles/commonStyles';
import SelectBox from './SelectBox';
import FakeSelectBox from './FakeSelectBox';

const InitialUOSInfo = ({
  selectSystem,
  data,
  switchSizeOptions,
  isCreateEditOrSave,
  saveHeatingSysTemporary,
  heatingSysOptions,
  listOfSelectedSSR,
  handleOpenSelectBoxes,
  handleSelectBoxes,
  listOfUOS,
  ssrRatingOptions,
  handleInputBoxes,
  gasTypeOptions,
  setDeleteSwitch,
  deleteSwitch,
}) => {
  return (
    <>
      {data?.map(
        (
          {
            UOS,
            switchName,
            switchSize,
            sysId,
            heatingSys,
            gasType,
            selectedSSR,
            ssrRating,
            application,
            displaySelectBox,
            zoneName,
            segment,
          },
          idx
        ) => {
          return (
            <FlexRow key={idx}>
              <SwitchesBaseLayer>
                <SwitchesWrapper>
                  {/* UOS */}
                  <SelectBox
                    isUOS={true}
                    displaySelectBox={displaySelectBox?.[0]}
                    switchIdx={idx}
                    handleOpenSelectBoxes={() => handleOpenSelectBoxes(idx, 0)}
                    handleSelectBoxes={handleSelectBoxes}
                    selected={UOS}
                    content={listOfUOS}
                    selectBoxFor={'UOS'}
                  />

                  {/* switch name || zone name and segment */}
                  {selectSystem ? (
                    <>
                      {/* zone name */}
                      <SwitchesInputBox
                        type='text'
                        esInputBox
                        switchName={true}
                        value={zoneName}
                        onChange={(e) =>
                          handleInputBoxes(idx, 'zoneName', e.target.value)
                        }
                      ></SwitchesInputBox>
                      {/* segment */}
                      <SwitchesInputBox
                        type='text'
                        esInputBox
                        segment={true}
                        value={segment}
                        onChange={(e) =>
                          handleInputBoxes(idx, 'segment', e.target.value)
                        }
                      ></SwitchesInputBox>
                    </>
                  ) : (
                    <>
                      {/* switch name */}
                      <SwitchesInputBox
                        type='text'
                        esInputBox
                        switchName={true}
                        value={switchName}
                        onChange={(e) =>
                          handleInputBoxes(idx, 'switchName', e.target.value)
                        }
                      ></SwitchesInputBox>
                      {/* switch size */}
                      <SelectBox
                        isSwitchSize={true}
                        displaySelectBox={displaySelectBox[1]}
                        switchIdx={idx}
                        handleOpenSelectBoxes={() =>
                          handleOpenSelectBoxes(idx, 1)
                        }
                        selectBoxFor={'switchSize'}
                        handleSelectBoxes={handleSelectBoxes}
                        selected={switchSize}
                        content={switchSizeOptions}
                        isCreateEditOrSave={
                          isCreateEditOrSave === 0 || isCreateEditOrSave === 1
                        }
                        buttonTitle={'add size'}
                      />
                    </>
                  )}
                  {/* switch size
                  <SelectBox
                    isSwitchSize={true}
                    displaySelectBox={displaySelectBox[1]}
                    switchIdx={idx}
                    handleOpenSelectBoxes={() => handleOpenSelectBoxes(idx, 1)}
                    selectBoxFor={'switchSize'}
                    handleSelectBoxes={handleSelectBoxes}
                    selected={switchSize}
                    content={switchSizeOptions}
                    isCreateEditOrSave={
                      isCreateEditOrSave === 0 || isCreateEditOrSave === 1
                    }
                    buttonTitle={'add size'}
                  /> */}

                  {/* system i.d. */}
                  <SwitchesInputBox
                    type='number'
                    readOnly={true}
                    systemId={true}
                    value={sysId ? sysId : 'undefined'}
                    // onChange={(e) =>
                    //   handleInputBoxes(
                    //     idx,
                    //     'sysId',
                    //     e.target.value
                    //   )
                    // }
                  ></SwitchesInputBox>

                  {/* heating system */}
                  <SelectBox
                    isHeatingSys={true}
                    displaySelectBox={displaySelectBox[2]}
                    switchIdx={idx}
                    handleOpenSelectBoxes={() => handleOpenSelectBoxes(idx, 2)}
                    handleSelectBoxes={handleSelectBoxes}
                    selected={heatingSys}
                    content={
                      saveHeatingSysTemporary[UOS]
                        ? saveHeatingSysTemporary[UOS]
                        : heatingSysOptions
                    }
                    selectBoxFor={'heatingSys'}
                    clearButtonTitle={'clear'}
                    isMultipleSelections={true}
                    selectedUOS={UOS}
                  />

                  {/* Gas Type */}
                  {heatingSys === 'ess' || heatingSys === 'tes' ? (
                    <FakeContentInput isGasType={true}></FakeContentInput>
                  ) : (
                    <SelectBox
                      isGasType={true}
                      displaySelectBox={displaySelectBox[5]}
                      switchIdx={idx}
                      handleOpenSelectBoxes={() =>
                        handleOpenSelectBoxes(idx, 5)
                      }
                      handleSelectBoxes={handleSelectBoxes}
                      selected={gasType}
                      content={gasTypeOptions}
                      selectBoxFor={'gasType'}
                      isCreateEditOrSave={
                        isCreateEditOrSave === 0 || isCreateEditOrSave === 1
                      }
                      buttonTitle={'add gas type'}
                      selectedUOS={UOS}
                    />
                  )}

                  {/* SSR QTY. */}
                  {heatingSys === 'tgs' ? (
                    <FakeSelectBox isSSRUnits={true} />
                  ) : (
                    <SelectBox
                      isSSRUnits={true}
                      displaySelectBox={displaySelectBox[3]}
                      switchIdx={idx}
                      handleOpenSelectBoxes={() =>
                        handleOpenSelectBoxes(idx, 3)
                      }
                      handleSelectBoxes={handleSelectBoxes}
                      selected={
                        selectedSSR &&
                        selectedSSR.length > 0 &&
                        selectedSSR.length < 10
                          ? selectedSSR.length > 0
                            ? '0' + selectedSSR.length
                            : selectedSSR.length
                          : ''
                      }
                      allSelections={selectedSSR}
                      content={typeof listOfSelectedSSR === 'function' ? listOfSelectedSSR(idx, UOS) : listOfSelectedSSR}
                      selectBoxFor={'selectedSSR'}
                      clearButtonTitle={'clear'}
                      isMultipleSelections={true}
                    />
                  )}

                  {/* SSR rating  */}
                  {heatingSys === 'tgs' ? (
                    <FakeSelectBox isSSRRating={true} />
                  ) : (
                    <SelectBox
                      isSSRRating={true}
                      displaySelectBox={displaySelectBox[4]}
                      switchIdx={idx}
                      handleOpenSelectBoxes={() =>
                        handleOpenSelectBoxes(idx, 4)
                      }
                      handleSelectBoxes={handleSelectBoxes}
                      selected={ssrRating}
                      content={
                        // saveSSRRatingTemporary[UOS]
                        //   ? saveSSRRatingTemporary[UOS]
                        //   :
                        ssrRatingOptions
                      }
                      selectBoxFor={'ssrRating'}
                      isCreateEditOrSave={
                        isCreateEditOrSave === 0 || isCreateEditOrSave === 1
                      }
                      buttonTitle={'add ssr rating'}
                      selectedUOS={UOS}
                    />
                  )}

                  {/* application */}
                  {/* <SwitchesInputBox
                    type='text'
                    application={true}
                    value={application}
                    onChange={(e) =>
                      handleInputBoxes(idx, 'application', e.target.value)
                    }
                  ></SwitchesInputBox> */}

                  {/* X Button  */}
                </SwitchesWrapper>
              </SwitchesBaseLayer>
              {(isCreateEditOrSave === 1 || isCreateEditOrSave === 0) && (
                <XButtonWrapper
                  onClick={() => setDeleteSwitch([true, idx])}
                  isGreenBorder={deleteSwitch[1] === idx}
                >
                  <XButton>
                    <XButtonTop>
                      <Img
                        src={
                          './images/settings-admin-sysIdentification-whiteX.svg'
                        }
                        margin={'x'}
                      />
                    </XButtonTop>
                  </XButton>
                </XButtonWrapper>
              )}
            </FlexRow>
          );
        }
      )}
    </>
  );
};

export default InitialUOSInfo;

const FlexRow = styled.div`
  position: relative;
  width: 100%;
  margin-left: 8px;

  ${justifyContentFlexStart}/* ${({ isLastRow }) =>
    isLastRow === 'sorted'
      ? css`
          ${justifyContentSpaceAround}
          margin-top: 6px;
          margin-bottom: 2px;
        `
      : isLastRow
      ? css`
          ${justifyContentFlexStart}
          margin-top: 6px;
        `
      : css`
          ${justifyContentSpaceEvenly}
        `}

  ${({ isFlexColumn, isFlexStart }) =>
    isFlexColumn
      ? css`
          flex-direction: column;
        `
      : isFlexStart &&
        css`
          display: flex;
          justify-content: space-around;
          align-items: flex-start;
        `} */
`;

const SwitchesBaseLayer = styled.div`
  width: 738px;
  height: 26px;
  margin-top: 2px;

  ${layerADark}

  border-radius: 14px;
  opacity: 1;
  ${flexBoxCenter}

  ${({ isGrouped }) =>
    isGrouped &&
    css`
      width: 750px;
      height: 26px;
    `}
`;

const SwitchesWrapper = styled.div`
  width: 736px;
  height: 24px;

  ${layerA180Deg}

  border-radius: 17px;

  ${justifyContentSpaceAround}

  ${({ isGrouped }) =>
    isGrouped &&
    css`
      width: 748px;
      height: 24px;
      /* ${flexBoxCenter}
      gap:1.7px; */
    `}
`;

const SwitchesInputBox = styled.input`
  height: 17px;
  ${({ switchName, segment, systemId, application, gasType }) =>
    switchName
      ? css`
          width: 136px;
          ${({ isGrouped }) =>
            isGrouped &&
            css`
              margin-left: 2px;
            `}
        `
      : systemId
      ? css`
          width: 148px;
        `
      : application
      ? css`
          width: 86px;
          margin-right: 2px;
        `
      : gasType
      ? css`
          width: 42px;
        `
      : segment &&
        css`
          width: 72px;
        `}

  font-size:10px;
  letter-spacing: 1px;
  text-transform: uppercase;

  ${layerA}

  border-radius: 12px;
`;

const FakeContentInput = styled.div`
  width: 280px;
  height: 24px;
  font-size: 8px;
  text-align: center;
  padding-top: 6px;
  letter-spacing: 0.8px;

  ${layerADark}

  border-radius: 12px;

  ${({ isGasType }) =>
    isGasType &&
    css`
      width: 42px;
      height: 18px;
      background-color: #393939;
      box-shadow: inset 0px 0px 2px #000000;
    `}
`;

const XButtonWrapper = styled.div`
  width: 18px;
  height: 18px;
  margin-left: 2px;

  ${layerA}

  border-radius: 9px;
  opacity: 1;
  ${flexBoxCenter}

  ${({ isGreenBorder }) =>
    isGreenBorder &&
    css`
      border: 1px solid #95ff45;
    `}
`;

const XButton = styled.div`
  width: 16px;
  height: 16px;

  ${layerA180Deg}

  border-radius: 9px;
  opacity: 1;
  ${flexBoxCenter}
`;

const XButtonTop = styled.div`
  width: 13px;
  height: 13px;

  ${layerB}

  border-radius: 9px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Img = styled.img`
  margin-right: 3px;
  cursor: pointer;
  ${({ margin }) =>
    margin === 'x'
      ? css`
          margin: 0;
        `
      : margin &&
        css`
          margin-right: 6px;
        `}
`;

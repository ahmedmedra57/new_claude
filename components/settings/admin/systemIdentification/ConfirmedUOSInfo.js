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
  layerCLighter,
} from '../../../styles/commonStyles';
import SelectBox from './SelectBox';
import SSRElements from './SSRElements';

const ConfirmedUOSInfo = ({
  selectSystem,
  data,
  switchSizeOptions,
  isCreateEditOrSave,
  saveHeatingSysTemporary,
  heatingSysOptions,
  listOfSelectedSSR,
  saveSSRRatingTemporary,
  ssrRatingOptions,
  expandHeatLoad,
  setSwitches,
  shortCutOfLocationName,
  UOSName,
  handleSaveButtonOfEachUOS,
  handleExpandHeatLoadConfiguration,
  setNumOfSSRSelected,
  numOfSSRSelected,
}) => {
  return (
    <>
      {data?.map((groupedData, groupedIdx) => {
        return (
          <div key={groupedData[0]?.sysId + groupedIdx}>
            <SortedUOSGroupWrapper>
              <FlexRow isFlexStart={true}>
                <UOSDisplay>
                  {groupedIdx < 9
                    ? '0' + (Number(groupedIdx) + 1)
                    : toString(Number(groupedIdx) + 1)}
                </UOSDisplay>
                <FlexRow isFlexColumn={true}>
                  {groupedData?.map(
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
                      const initialNumOfSSR = selectedSSR.length;
                      setNumOfSSRSelected(initialNumOfSSR);
                      return (
                        <FlexRow key={switchName || zoneName}>
                          <SwitchesBaseLayer isGrouped={true}>
                            <SwitchesWrapper isGrouped={true}>
                              {/* switch name || zone name and segment */}
                              {selectSystem ? (
                                <>
                                  <SwitchesInputBox
                                    isGrouped={true}
                                    type='text'
                                    esInputBox
                                    switchName={true}
                                    value={zoneName}
                                    readOnly={true}
                                  ></SwitchesInputBox>
                                  <SwitchesInputBox
                                    isGrouped={true}
                                    type='text'
                                    esInputBox
                                    segment={true}
                                    value={segment}
                                    readOnly={true}
                                  ></SwitchesInputBox>
                                </>
                              ) : (
                                <>
                                  <SwitchesInputBox
                                    isGrouped={true}
                                    type='text'
                                    esInputBox
                                    switchName={true}
                                    value={switchName}
                                    readOnly={true}
                                    // onChange={(e) =>
                                    //   handleInputBoxes(
                                    //     idx,
                                    //     'switchName',
                                    //     e.target.value,
                                    //     groupedIdx
                                    //   )
                                    // }
                                  ></SwitchesInputBox>
                                  {/* switch size */}
                                  <SelectBox
                                    isSwitchSize={true}
                                    displaySelectBox={displaySelectBox[1]}
                                    switchIdx={idx}
                                    // handleOpenSelectBoxes={() =>
                                    //   handleOpenSelectBoxes(idx, 1)
                                    // }
                                    selectBoxFor={'switchSize'}
                                    // handleSelectBoxes={
                                    //   handleSelectBoxes
                                    // }
                                    selected={switchSize}
                                    content={switchSizeOptions}
                                    isCreateEditOrSave={
                                      isCreateEditOrSave === 0 ||
                                      isCreateEditOrSave === 1
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
                                // handleOpenSelectBoxes={() =>
                                //   handleOpenSelectBoxes(idx, 1)
                                // }
                                selectBoxFor={'switchSize'}
                                // handleSelectBoxes={
                                //   handleSelectBoxes
                                // }
                                selected={switchSize}
                                content={switchSizeOptions}
                                isCreateEditOrSave={
                                  isCreateEditOrSave === 0 ||
                                  isCreateEditOrSave === 1
                                }
                                buttonTitle={'add size'}
                              /> */}

                              {/* system i.d. */}
                              <SwitchesInputBox
                                type='number'
                                systemId={true}
                                value={sysId ? sysId : 'undefined'}
                                readOnly={true}
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
                                // handleOpenSelectBoxes={() =>
                                //   handleOpenSelectBoxes(idx, 2)
                                // }
                                // handleSelectBoxes={
                                //   handleSelectBoxes
                                // }
                                selected={heatingSys}
                                content={
                                  saveHeatingSysTemporary[UOS]
                                    ? saveHeatingSysTemporary[UOS]
                                    : heatingSysOptions
                                }
                                selectBoxFor={'heatingSys'}
                                clearButtonTitle={'clear'}
                                isMultipleSelections={true}
                              />

                              {/* Gas Type */}
                              {heatingSys === 'ess' || heatingSys === 'tes' ? (
                                <FakeContentInput
                                  isGasType={true}
                                ></FakeContentInput>
                              ) : (
                                <SwitchesInputBox
                                  type='text'
                                  gasType={true}
                                  value={gasType}
                                  readOnly={true}
                                  // onChange={(e) =>
                                  //   handleInputBoxes(
                                  //     idx,
                                  //     'gasType',
                                  //     e.target.value
                                  //   )
                                  // }
                                ></SwitchesInputBox>
                              )}

                              {/* SSR QTY */}
                              <SelectBox
                                isSSRUnits={true}
                                displaySelectBox={displaySelectBox[3]}
                                switchIdx={idx}
                                // handleOpenSelectBoxes={() =>
                                //   handleOpenSelectBoxes(idx, 3)
                                // }
                                // handleSelectBoxes={
                                //   handleSelectBoxes
                                // }
                                selected={
                                  selectedSSR.length > 0 &&
                                  selectedSSR.length < 10
                                    ? selectedSSR.length > 0
                                      ? '0' + selectedSSR.length
                                      : selectedSSR.length
                                    : ''
                                }
                                allSelections={selectedSSR}
                                content={listOfSelectedSSR}
                                selectBoxFor={'selectedSSR'}
                                clearButtonTitle={'clear'}
                                isMultipleSelections={true}
                              />

                              {/* SSR rating  */}
                              <SelectBox
                                isSSRRating={true}
                                displaySelectBox={displaySelectBox[4]}
                                switchIdx={idx}
                                // handleOpenSelectBoxes={() =>
                                //   handleOpenSelectBoxes(idx, 4)
                                // }
                                // handleSelectBoxes={
                                //   handleSelectBoxes
                                // }
                                selected={ssrRating}
                                content={
                                  saveSSRRatingTemporary[UOS]
                                    ? saveSSRRatingTemporary[UOS]
                                    : ssrRatingOptions
                                }
                                selectBoxFor={'ssrRating'}
                                isCreateEditOrSave={
                                  isCreateEditOrSave === 0 ||
                                  isCreateEditOrSave === 1
                                }
                                buttonTitle={'add ssr rating'}
                              />

                              {/* application */}
                              {/* <SwitchesInputBox
                                type='text'
                                application={true}
                                value={application}
                                readOnly={true}
                                // onChange={(e) =>
                                //   handleInputBoxes(
                                //     idx,
                                //     'application',
                                //     e.target.value
                                //   )
                                // }
                              ></SwitchesInputBox> */}
                              {/* ********  */}
                            </SwitchesWrapper>
                          </SwitchesBaseLayer>

                          {/* X button to delete switch */}
                          {(isCreateEditOrSave === 1 ||
                            isCreateEditOrSave === 0) && (
                            <XButtonWrapper
                            // onClick={() =>
                            //   handleDeleteSwitch(idx)
                            // }
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
                </FlexRow>
              </FlexRow>

              {/* expanded Heat Load Configuration */}
              {expandHeatLoad[groupedIdx] && (
                <>
                  <Title isHeatLoad={true}>heat load configuration</Title>
                  <SSRElementsWrapper>
                    <SSRElements
                      SSRList={listOfSelectedSSR}
                      groupedSwitches={groupedData}
                      groupedIdx={groupedIdx}
                      setSwitches={setSwitches}
                      switches={data}
                    />
                  </SSRElementsWrapper>
                </>
              )}

              {/* !!! display UOS name and Heat load configuration button!!! */}
              <FlexRow isLastRow={expandHeatLoad[groupedIdx] ? 'sorted' : true}>
                <DisplayUOSName>
                  <UOSNameP>
                    {shortCutOfLocationName} - {UOSName[groupedIdx].slice(1)}
                  </UOSNameP>
                </DisplayUOSName>
                {expandHeatLoad[groupedIdx] ? (
                  <HeatLoadButtonWrapper isApply={true}>
                    <HeatLoadButton
                      isApply={true}
                      onClick={() => {
                        handleSaveButtonOfEachUOS(groupedIdx);
                      }}
                    >
                      <HeatLoadButtonIndent isApply={true}>
                        <HeatLoadButtonTop isApply={true}>
                          <HeatLoadSpan>save</HeatLoadSpan>
                        </HeatLoadButtonTop>
                      </HeatLoadButtonIndent>
                    </HeatLoadButton>
                  </HeatLoadButtonWrapper>
                ) : (
                  <HeatLoadButtonWrapper>
                    <HeatLoadButton
                      onClick={() =>
                        handleExpandHeatLoadConfiguration(groupedIdx)
                      }
                    >
                      <HeatLoadButtonIndent>
                        <HeatLoadButtonTop>
                          <HeatLoadSpan>heat load configuration</HeatLoadSpan>
                        </HeatLoadButtonTop>
                      </HeatLoadButtonIndent>
                    </HeatLoadButton>
                  </HeatLoadButtonWrapper>
                )}
              </FlexRow>
            </SortedUOSGroupWrapper>
          </div>
        );
      })}
    </>
  );
};

export default ConfirmedUOSInfo;

const SortedUOSGroupWrapper = styled.div`
  width: 814px;
  height: auto;
  padding: 2px;
  margin-bottom: 6px;

  ${layerA180Deg}

  border-radius: 16px;
`;

const FlexRow = styled.div`
  /* position: relative; */

  ${({ isLastRow }) =>
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
          justify-content: flex-start;
          align-items: flex-start;
          gap: 10px;
        `}
`;

const UOSDisplay = styled.div`
  width: 32px;
  height: 18px;
  margin-top: 6px;
  margin-left: 6px;

  font-size: 10px;

  ${layerCLighter}
  border-radius: 12px;
  ${flexBoxCenter}
`;

const SwitchesBaseLayer = styled.div`
  width: 684px;
  height: 26px;
  margin-top: 2px;

  ${layerADark}

  border-radius: 14px;
  opacity: 1;
  ${flexBoxCenter}
`;

const SwitchesWrapper = styled.div`
  width: 682px;
  height: 24px;

  ${layerA180Deg}

  border-radius: 17px;

  ${justifyContentSpaceAround}
`;

const SwitchesInputBox = styled.input`
  height: 17px;
  ${({ segment, switchName, systemId, application, gasType }) =>
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

const Title = styled.div`
  color: #ffffff;

  ${({ isHeatLoad }) =>
    isHeatLoad
      ? css`
          margin-top: 8px;
          font-size: 10px;

          display: flex;
          flex-direction: row;

          &:before {
            content: '';
            width: 314px;
            border-bottom: 1px solid #ffffff;
            margin: auto;
            margin-right: 4px;
          }
          &:after {
            content: '';
            width: 314px;
            border-bottom: 1px solid #ffffff;
            margin: auto;
            margin-left: 4px;
          }
        `
      : css`
          font-size: 12px;
          letter-spacing: 1.2px;
        `}
`;

const SSRElementsWrapper = styled.div``;

const DisplayUOSName = styled.div`
  width: 287px;
  min-height: 29px;

  background: #233a54 0% 0% no-repeat padding-box;
  box-shadow: inset 0px 0px 6px #000000;
  border-radius: 15px;
  ${flexBoxCenter}
`;

const UOSNameP = styled.p`
  width: 93%;
  font-size: 10px;

  letter-spacing: 1px;
`;

const HeatLoadButtonWrapper = styled.div`
  width: 221px;
  height: 29px;

  ${layerB}
  border-radius: 27px;
  ${flexBoxCenter}

  ${({ isApply }) =>
    isApply &&
    css`
      width: 514px;
      height: 29px;
    `}
`;

const HeatLoadButton = styled.button`
  width: 219px;
  height: 27px;

  ${layerA180Deg}
  border-radius: 25px;
  ${flexBoxCenter}

  ${({ isApply }) =>
    isApply &&
    css`
      width: 512px;
      height: 27px;
    `}
`;

const HeatLoadButtonIndent = styled.div`
  width: 213px;
  height: 21px;

  ${layerB}

  border-radius: 20px;
  ${flexBoxCenter}

  ${({ isApply }) =>
    isApply &&
    css`
      width: 506px;
      height: 21px;
    `}
`;

const HeatLoadButtonTop = styled.div`
  width: 211px;
  height: 19px;

  ${layerA180Deg}

  border-radius: 25px;
  ${flexBoxCenter}

  ${({ isApply }) =>
    isApply &&
    css`
      width: 504px;
      height: 19px;
    `}
`;

const HeatLoadSpan = styled.span`
  font-size: 10px;
`;

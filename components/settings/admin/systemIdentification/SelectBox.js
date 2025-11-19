import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
} from '../../../styles/commonStyles';
import DropBox from './DropBox';

const SelectBox = ({
  handleOpenSelectBoxes,
  handleSelectBoxes,
  switchIdx,
  displaySelectBox,
  selected,
  content,
  isCreateEditOrSave,
  buttonTitle,
  selectBoxFor,
  selectBoxIdx,
  clearButtonTitle,
  isMultipleSelections,
  isUOS,
  isSwitchSize,
  isHeatingSys,
  isSSRUnits,
  isSSRRating,
  isGasType,
  isTc,
  allSelections,
  SSR,
  selectedSSSIdx,
  groupedIdx,
  selectedUOS,
}) => {
  return (
    <SwitchesDropBoxBaseLayer
      isUOS={isUOS}
      isSwitchSize={isSwitchSize}
      isHeatingSys={isHeatingSys}
      isSSRUnits={isSSRUnits}
      isSSRRating={isSSRRating}
      isTc={isTc}
      isSelectSwitch={selectBoxFor === 'switch'}
      isGasType={isGasType}
    >
      <SwitchesDropBoxWrapper
        isUOS={isUOS}
        isSwitchSize={isSwitchSize}
        isHeatingSys={isHeatingSys}
        isSSRUnits={isSSRUnits}
        isSSRRating={isSSRRating}
        isTc={isTc}
        isSelectSwitch={selectBoxFor === 'switch'}
        isGasType={isGasType}
      >
        <SwitchesDisplayInfo
          isUOS={isUOS}
          isSwitchSize={isSwitchSize}
          isHeatingSys={isHeatingSys}
          isSSRUnits={isSSRUnits}
          isSSRRating={isSSRRating}
          isTc={isTc}
          isSelectSwitch={selectBoxFor === 'switch'}
          isGasType={isGasType}
        >
          {selected && selected}
        </SwitchesDisplayInfo>

        <Img
          src={'./images/settings-sysIdentification-whiteTriangle.svg'}
          onClick={handleOpenSelectBoxes}
        />

        {/* {selectBoxFor === 'switch' && selectBoxIdx !== 0 ? (
          <Img
          // src={'./images/settings-sysIdentification-whiteTriangle.svg'}
          // onClick={handleOpenSelectBoxes}
          />
        ) : (
          <Img
            src={'./images/settings-sysIdentification-whiteTriangle.svg'}
            onClick={handleOpenSelectBoxes}
          />
        )} */}
      </SwitchesDropBoxWrapper>
      {displaySelectBox && (
        <WrapperDropBox>
          {isUOS || isSSRUnits ? (
            <DropBox
              content={content.length > 0 ? content : []}
              handleSelection={handleSelectBoxes}
              switchIdx={switchIdx}
              selectBoxFor={selectBoxFor}
              handleOpenSelectBoxes={handleOpenSelectBoxes}
              isMultipleSelections={isMultipleSelections}
              clearButtonTitle={clearButtonTitle}
              allSelections={allSelections}
              selected={selected}
            />
          ) : (
            <DropBox
              content={content}
              handleSelection={handleSelectBoxes}
              switchIdx={switchIdx}
              selectBoxFor={selectBoxFor}
              handleOpenSelectBoxes={handleOpenSelectBoxes}
              isCreateEditOrSave={isCreateEditOrSave}
              buttonTitle={buttonTitle}
              clearButtonTitle={clearButtonTitle}
              isMultipleSelections={isMultipleSelections}
              selected={selected}
              isTc={isTc}
              SSR={SSR}
              groupedIdx={groupedIdx}
              selectedSSSIdx={selectedSSSIdx}
              selectedUOS={selectedUOS}
            />
          )}
        </WrapperDropBox>
      )}
    </SwitchesDropBoxBaseLayer>
  );
};

export default SelectBox;

const SwitchesDropBoxBaseLayer = styled.div`
  ${({
    isUOS,
    isSwitchSize,
    isHeatingSys,
    isSSRUnits,
    isSSRRating,
    isTc,
    isSelectSwitch,
    isGasType,
  }) =>
    isUOS
      ? css`
          width: 44px;
          height: 18px;
          margin-left: 2px;
        `
      : isSwitchSize
      ? css`
          width: 72px;
          height: 18px;
        `
      : isHeatingSys
      ? css`
          width: 84px;
          height: 18px;
        `
      : isSSRUnits
      ? css`
          width: 64px;
          height: 18px;
        `
      : isSelectSwitch
      ? css`
          width: 116px;
        `
      : isGasType
      ? css`
          width: 54px;
          height: 18px;
          margin-left: 2px;
        `
      : isSSRRating &&
        css`
          width: 96px;
          height: 18px;
        `}

  ${layerA}

  border-radius: 12px;
  opacity: 1;
  position: relative;
  ${flexBoxCenter}
`;

const SwitchesDropBoxWrapper = styled.div`
  ${({
    isUOS,
    isSwitchSize,
    isHeatingSys,
    isSSRUnits,
    isSSRRating,
    isTc,
    isSelectSwitch,
    isGasType,
  }) =>
    isUOS
      ? css`
          width: 42px;
          height: 16px;
        `
      : isSwitchSize
      ? css`
          width: 70px;
          height: 16px;
        `
      : isHeatingSys
      ? css`
          width: 82px;
          height: 16px;
        `
      : isSSRUnits
      ? css`
          width: 62px;
          height: 16px;
        `
      : isSSRRating
      ? css`
          width: 94px;
          height: 16px;
        `
      : isSelectSwitch
      ? css`
          width: 114px;
          height: 18px;
        `
      : isGasType
      ? css`
          width: 52px;
          height: 16px;
        `
      : isTc &&
        css`
          width: 60px;
          height: 18px;
        `};

  ${layerA180Deg}

  border-radius: 12px;
  opacity: 1;
  ${justifyContentSpaceBetween}
`;

const SwitchesDisplayInfo = styled.div`
  letter-spacing: 1px;
  font-size: 10px;
  margin-left: 2px;

  ${layerA}

  border-radius: 12px;

  ${flexBoxCenter}

  ${({
    isUOS,
    isSwitchSize,
    isHeatingSys,
    isSSRUnits,
    isSSRRating,
    isTc,
    isSelectSwitch,
    isGasType,
  }) =>
    isUOS
      ? css`
          width: 24px;
          height: 12px;
        `
      : isSwitchSize
      ? css`
          width: 54px;
          height: 12px;
        `
      : isHeatingSys
      ? css`
          width: 64px;
          height: 12px;
        `
      : isSSRUnits
      ? css`
          width: 46px;
          height: 12px;
        `
      : isSSRRating
      ? css`
          width: 78px;
          height: 12px;
        `
      : isSelectSwitch
      ? css`
          width: 100px;
          height: 14px;
          font-size: 8px;
          letter-spacing: 0.8px;
        `
      : isGasType
      ? css`
          width: 32px;
          height: 12px;
        `
      : isTc &&
        css`
          width: 43px;
          height: 14px;
          font-size: 8px;
          letter-spacing: 0.8px;
        `};
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

const WrapperDropBox = styled.div`
  position: absolute;
  z-index: 11;
  top: 0;
`;

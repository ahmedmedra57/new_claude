import styled, { css } from "styled-components";
import { useTranslation } from 'react-i18next';
import {
  borderADisabled,
  borderBlue,
  flexBoxCenter,
  justifyContentFlexStart,
  layerA,
} from "../../styles/commonStyles";
import { useCheckControlPermsission } from "../../../hooks";

const SelectConsumption = ({
  consumptionInfo,
  addToIndex,
  systemIndex,
  onSelect,
  isDataConsumption,
}) => {
  function getSwitchType(item) {
    const match = item.match(/^(\w+)/);
    return match ? match[0] : null;
  }
  const checkPermsission = useCheckControlPermsission();

  return consumptionInfo?.map((value, index) => {
    const newIndex = index + addToIndex;
    const swith = getSwitchType(value);
    const isSystemDisabled = !checkPermsission(swith);
    if (isDataConsumption) {
      return (
        <Selection
          key={newIndex}
          onClick={() => !isSystemDisabled && onSelect(newIndex)}
          disabled={isSystemDisabled}
        >
          <OutsideCircle disabled={isSystemDisabled}>
            <InsideCircle
              enable={systemIndex === newIndex}
              tesTgsEnabled={
                (systemIndex === 1 || systemIndex === 2) && newIndex !== 0 && newIndex !== 3
              }
              disabled={isSystemDisabled}
            ></InsideCircle>
          </OutsideCircle>
          <SystemTitle>{value}</SystemTitle>
        </Selection>
      );
    } else
      return (
        <Selection
          key={newIndex}
          onClick={() => !isSystemDisabled && onSelect(newIndex)}
          disabled={isSystemDisabled}
        >
          <OutsideCircle disabled={isSystemDisabled}>
            <InsideCircle enable={newIndex === systemIndex}></InsideCircle>
          </OutsideCircle>
          <SystemTitle>{value}</SystemTitle>
        </Selection>
      );
  });
};

export default SelectConsumption;

const Selection = styled.div`
  cursor: pointer;
  width: 291px;
  height: 26px;
  margin-top: 4px;

  ${borderBlue}
  ${({ disabled }) => disabled && `${borderADisabled}`}
  &:hover {
    ${layerA}
  }

  border-radius: 13px;
  opacity: 2;
  z-index: 10;
  ${justifyContentFlexStart}
`;

const OutsideCircle = styled.div`
  width: 18px;
  height: 18px;
  margin-left: 4px;

  border-radius: 50%;
  border: 1px solid #95ff45;
  ${({ disabled }) =>
    disabled &&
    css`
      border: 1px solid #808080;
    `}
  opacity: 1;
  z-index: 10;
  ${flexBoxCenter}
`;

const InsideCircle = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  ${({ enable, disabled, tesTgsEnabled }) =>
    disabled
      ? css`
          background-color: transparent;
        `
      : enable
      ? css`
          background-color: #95ff45;
        `
      : tesTgsEnabled &&
        css`
          background-color: #95ff45;
        `}
  opacity: 1;
  z-index: 10;
`;

const SystemTitle = styled.p`
  margin-left: 4px;
  text-align: left;
  font-size: 8px;
  letter-spacing: 1px;
  color: #ffffff;
  opacity: 1;
  z-index: 10;
`;

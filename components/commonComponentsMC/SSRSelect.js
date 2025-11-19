import { useState, useEffect } from "react";

import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA,
  layerBDark,
} from "../styles/commonStyles";
import styled, { css } from "styled-components";

import SelectButton from "./SelectButton";
import SSRRadioBox from "./SSRRadioBox";

// import { selectTgsSwitch } from '../../../store/slices/tgsSwitchSlice';
// import { updateSettingsValue } from '../../../helpers/helpers';

const select = [
  "tc-01",
  "tc-02",
  "tc-03",
  "tc-04",
  "tc-05",
  "tc-06",
  "tc-07",
  "tc-08",
  "tc-09",
  "tc-10",
  "tc-11",
];

const SSRSelect = ({ data, id, buttonHandler, status, isMobile, activeThermocouples }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isSelected, setIsSelected] = useState(data || select[0]);
  const disabled = status === "flt";
  const mobileDisabled = status === "flt" || status === "off";

  const displayOptions = () => {
    setIsClicked(!isClicked);
  };

  const handleChecked = (elem) => {
    setIsSelected(elem);
  };

  const onSelectHandler = () => {
    buttonHandler({ button: "SSRSelect", id: `ssr${id}`, data: isSelected });
    displayOptions();
  };

  useEffect(() => {
    if (data) {
      setIsSelected(data);
    }
  }, [data]);

  return (
    <>
      {isMobile ? (
        <Wrapper isMobile={true}>
          <TitleWrapper isMobile={true}>
            <Title isMobile={true}>select</Title>
          </TitleWrapper>

          <SelectorWrapper
            isClicked={isClicked}
            disabled={mobileDisabled}
            isMobile={true}
          >
            <SelectedOneAndArrowWrapper isClicked={isClicked} isMobile={true}>
              <SelectedOne disabled={mobileDisabled} isMobile={true}>
                <SelectedSwitch disabled={mobileDisabled} isMobile={true}>
                  {isSelected}
                </SelectedSwitch>
              </SelectedOne>
              <ArrowWrapper
                onClick={() => mobileDisabled || displayOptions()}
                isMobile={true}
              >
                <Arrow
                  isMobile={true}
                  disabled={mobileDisabled}
                  src={
                    mobileDisabled
                      ? "images/select-arrow-icon-disabled.svg"
                      : "images/select-arrow-icon.svg"
                  }
                />
              </ArrowWrapper>
            </SelectedOneAndArrowWrapper>

            {isClicked && (
              <>
                <SelectWrapper>
                  {select.map((option, index) => (
                    <SSRRadioBox
                      data={option}
                      selected={isSelected}
                      onHandler={handleChecked}
                      key={option}
                      disabled={activeThermocouples[index] === 0}
                      activeThermocouples={activeThermocouples}
                      index={index}
                    />
                  ))}
                </SelectWrapper>
                <SelectButton onSelect={onSelectHandler} />
              </>
            )}
          </SelectorWrapper>
        </Wrapper>
      ) : (
        <Wrapper>
          <TitleWrapper>
            <Title>select</Title>
          </TitleWrapper>

          <SelectorWrapper isClicked={isClicked} disabled={disabled}>
            <SelectedOneAndArrowWrapper isClicked={isClicked}>
              <SelectedOne disabled={disabled}>
                <SelectedSwitch disabled={disabled}>
                  {isSelected}
                </SelectedSwitch>
              </SelectedOne>
              <ArrowWrapper onClick={() => disabled || displayOptions()}>
                <Arrow
                  disabled={disabled}
                  src={
                    disabled
                      ? "images/select-arrow-icon-disabled.svg"
                      : "images/select-arrow-icon.svg"
                  }
                />
              </ArrowWrapper>
            </SelectedOneAndArrowWrapper>

            {isClicked && (
              <>
                <SelectWrapper>
                  {select.map((option, index) => {
                    return (
                      <SSRRadioBox
                        data={option}
                        selected={isSelected}
                        onHandler={handleChecked}
                        key={option}
                        disabled={activeThermocouples[index] === 0}
                        activeThermocouples={activeThermocouples}
                        index={index}
                      />
                    );
                  })}
                </SelectWrapper>
                <SelectButton onSelect={onSelectHandler} />
              </>
            )}
          </SelectorWrapper>
        </Wrapper>
      )}
    </>
  );
};

export default SSRSelect;

const Wrapper = styled.div`
  ${(p) =>
    p.isMobile
      ? css`
          width: 82px;
          height: 35px;
          ${flexDirectionColumn}
        `
      : css`
          margin-top: 15px;
          width: 86px;
        `}
`;
const TitleWrapper = styled.div`
  ${(p) =>
    p.isMobile
      ? css``
      : css`
          margin-bottom: 8px;
        `}

  ${flexBoxCenter}
`;

const Title = styled.span`
  ${(p) =>
    p.isMobile
      ? css`
          font-size: 8px;
        `
      : css`
          font-size: 10px;
        `}
`;

const SelectorWrapper = styled.div`
  background: transparent
    linear-gradient(
      ${(p) => (p.isClicked ? "90" : "180")}deg,
      #233a54 0%,
      #060d19 100%
    );
  box-shadow: inset 0px 0.5px 1px #ffffff29, 0px 0px 1px #000000;
  border: 0.5px solid #000000;
  ${(p) =>
    p.isMobile
      ? css`
          width: 80px;
          height: 16px;
          border-radius: 12px;
        `
      : css`
          width: 86px;
          height: 24px;
          border-radius: 12px;

          display: flex;
          align-items: center;

          ${(p) =>
            p.isClicked &&
            css`
              height: auto;
              position: absolute;
              padding: 1.5px 0;
              flex-direction: column;
            `}
        `}
  /* UI Properties */
 

  z-index: 10;

  ${(p) =>
    p.disabled &&
    css`
      background: transparent linear-gradient(180deg, #565656 0%, #1d1d1d 100%);
      box-shadow: inset 0px 0.5px 1px #ffffff29, 0px 0px 1px #000000;
      border: 0.5px solid #000000;
    `}
`;

const SelectedOneAndArrowWrapper = styled.div`
  width: 100%;

  ${(p) =>
    p.isMobile
      ? css`
          height: 100%;
          ${justifyContentSpaceBetween};
          padding: 0 2.5px 0 2px;
        `
      : css`
          ${flexBoxCenter};

          padding: 0 2px;
          ${(p) =>
            p.isClicked &&
            css`
              margin-bottom: 2px;
            `}
        `}
`;

const ArrowWrapper = styled.button`
  ${(p) =>
    p.isMobile
      ? css`
          width: auto;
          height: 9px;
        `
      : css`
          height: 100%;
        `}
  cursor: pointer;

  ${flexBoxCenter}
`;
const Arrow = styled.img`
  ${(p) =>
    p.isMobile
      ? css`
          height: 100%;
          margin-top: 2px;
          ${(p) =>
            p.disabled &&
            css`
              cursor: not-allowed;
            `}
        `
      : css`
          margin-top: 3px;
          height: 15px;

          ${(p) =>
            p.disabled &&
            css`
              height: 14px;
              cursor: not-allowed;
            `}
        `}
`;

const SelectedOne = styled.div`
  ${layerA};
  ${flexBoxCenter}
  ${(p) =>
    p.isMobile
      ? css`
          width: 62px;
          height: 12px;
          border-radius: 12px;
        `
      : css`
          width: 64px;
          height: 20px;
          border-radius: 12px;
        `}

  ${(p) =>
    p.disabled &&
    css`
      background: #3b3b3b;
      box-shadow: inset 0px 0px 2px #000000;
    `}
`;

const SelectWrapper = styled.div`
  ${(p) =>
    p.isMobile
      ? css``
      : css`
          width: 82px;
          border-radius: 11px;
          ${layerBDark};
          ${flexBoxCenter};
          flex-direction: column;
          /* space between options and button */
          margin-bottom: 3px;
        `}
`;

const SelectedSwitch = styled.span`
  ${(p) =>
    p.isMobile
      ? css`
          font-size: 8px;
        `
      : css`
          font-size: 10px;
          width: 100%;
          text-align: center;
        `};
  ${(p) =>
    p.disabled &&
    css`
      color: #808080;
    `}
`;

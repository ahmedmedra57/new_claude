import styled, { css } from 'styled-components';
import {
  activeInput,
  activeLayer180Deg,
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentFlexStart,
  justifyContentFlexEnd,
  justifyContentSpaceAround,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerADisabled,
  layerADisabled180Deg,
  layerB,
  layerBDark,
  layerBDisabled,
  layerC,
  layerCLighter,
  readyTop180Deg,
  alignItemsFlexEnd,
} from '../styles/commonStyles';

/**
 * Shared styled components for MasterControlByMachine
 * Used by ESS, TGS, and TES MasterControlByMachine components
 */

// Mobile Components
export const MainWrapperTop = styled.div`
  width: 301px;
  height: 50px;
  border-radius: 30px;
  ${layerA180Deg};
  ${justifyContentSpaceBetween};
  padding: 0 2px;

  ${(p) =>
    p.isOff &&
    css`
      ${layerADisabled180Deg}
    `};
`;

export const LeftWrapper = styled.div`
  width: 60%;
  height: 100%;
  ${justifyContentSpaceBetween};
`;

export const TitleAndConsumptionWrapper = styled.div`
  height: 100%;
  ${flexDirectionColumn};
`;

export const MainTitleWrapper = styled.div`
  width: 126px;
  height: 50%;
  ${flexBoxCenter}
  ${alignItemsFlexEnd}
`;

export const MainTitle = styled.span`
  font-size: 8px;
  overflow: hidden;
`;

export const RightWrapper = styled.div`
  width: 126px;
  height: 46px;
  border-radius: 0px 26px 26px 0px;
  ${layerA}
  ${justifyContentFlexEnd}
  padding-right: 1px;

  ${(p) =>
    p.isOff &&
    css`
      background: #3b3b3b;
      box-shadow: inset -1px 0px 2px #000000;
    `}
`;

export const RightTop = styled.div`
  width: 122px;
  height: 44px;
  border-radius: 22px;
  ${layerC};
  ${justifyContentSpaceBetween};
  padding: 0 1px;

  ${(p) =>
    p.isOff &&
    css`
      background: #3b3b3b;
    `}
`;

export const MobileButton = styled.button`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  ${layerA180Deg};
  ${flexBoxCenter};

  ${(p) =>
    p.noButton &&
    css`
      cursor: default;
    `};

  ${(p) =>
    p.isExpanded &&
    css`
      background: transparent linear-gradient(180deg, #1e7fc1 0%, #001640 100%);
      box-shadow: inset 0px 1px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid #000000;
    `};

  ${(p) =>
    p.isReady &&
    css`
      background: transparent linear-gradient(180deg, #1e7fc1 0%, #001640 100%);
      box-shadow: inset 0px 1px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid #000000;
    `};

  ${(p) =>
    p.isActivated &&
    css`
      background: transparent linear-gradient(180deg, #4baf00 0%, #124000 100%);
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid #000000;
    `};

  ${(p) =>
    p.isOff &&
    css`
      ${layerADisabled180Deg};
    `}
`;

export const MobileButtonHole = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  ${layerA};
  ${flexBoxCenter};

  ${(p) =>
    p.isExpanded &&
    css`
      background: #233a54;
      box-shadow: inset 0px 0px 3px #000000;
    `}

  ${(p) =>
    p.isActivated &&
    css`
      background: #124000;
      box-shadow: inset 0px 0px 3px #000000;
    `};

  ${(p) =>
    p.isOff &&
    css`
      background: #3b3b3b;
      box-shadow: inset 0px 0px 3px #000000;
    `};
`;

export const MobileButtonTop = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  ${layerA180Deg};
  ${flexBoxCenter};

  ${(p) =>
    p.isExpanded &&
    css`
      background: transparent linear-gradient(180deg, #1e7fc1 0%, #001640 100%);
      box-shadow: inset 0px 1px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid #000000;
    `}

  ${(p) =>
    p.isOff &&
    css`
      ${layerADisabled180Deg};
    `};
`;

export const SectionMobileInfoDisplay = styled.section`
  ${flexDirectionColumn};
`;

export const DisplayWrapper = styled.div`
  ${justifyContentSpaceBetween};
  flex-direction: column;
`;

export const DisplayInfo = styled.div`
  width: 29px;
  height: 8px;
  border-radius: 8px;
  ${layerA};
  ${flexBoxCenter};

  ${(p) =>
    p.isSpaceBetween &&
    css`
      ${justifyContentSpaceBetween};
      padding: 0 1px;
    `}

  ${(p) =>
    p.isOff &&
    css`
      background: #3b3b3b;
      box-shadow: inset 0px 0px 2px #000000;
    `};
`;

export const MobileImg = styled.img`
  height: 80%;
`;

export const ContentSpanWrapper = styled.div`
  height: 90%;
  width: 98px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  flex-direction: column;
`;

export const DisplayTempMobile = styled.div`
  width: 104px;
  height: 14px;
  border-radius: 7px;
  ${layerC};
  ${flexBoxCenter};
  font-size: 10px;

  ${(p) =>
    p.isOff &&
    css`
      background: #393939;
      box-shadow: inset 0px 0px 6px #000000;
      color: #808080;
    `}
`;

// Desktop Components
export const Wrapper = styled.div`
  ${(p) =>
    p.isMobile
      ? css`
          width: 311px;
          height: 108px;
          ${p.isFaults &&
          css`
            border: 1px solid red;
          `}
        `
      : css`
          width: 100%;
          height: 108px;
          position: relative;
        `}

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  ${(p) =>
    p.isExpanded &&
    css`
      height: auto;
    `};
`;

export const SectionHeader = styled.section`
  width: 100%;
  padding-left: ${(p) => (p.isMobile ? '0' : '24px')};
  display: flex;
  justify-content: space-between;
  position: relative;

  ${(p) =>
    p.isMobile &&
    css`
      ${justifyContentFlexEnd}
      padding-right: 40px;
    `}
`;

export const SectionHeaderWrapper = styled.div`
  width: 50%;
  display: flex;

  ${(p) =>
    p.right
      ? css`
          ${({ titleLength }) =>
            titleLength < 28
              ? css`
                  width: ${p.systemType === 'ess' ? '488px' : '608px'};
                `
              : titleLength < 46
              ? css`
                  width: 920px;
                `
              : css`
                  width: 1084px;
                `}
          justify-content: space-between;
        `
      : css`
          justify-content: flex-end;
          position: relative;
        `};

  ${(p) =>
    p.isExpanded ||
    css`
      visibility: hidden;
    `}
`;

export const HeaderHat = styled.div`
  background: url(${(p) => p.imgSrc}) no-repeat;
  display: flex;
  align-items: center;

  ${(p) =>
    p.isMobile
      ? css`
          height: 20px;
          width: 52px;
          padding-left: 6px;
          ${p.first &&
          css`
            margin-right: 6px;
          `}
        `
      : css`
          height: 31px;
          ${(p) =>
            p.first
              ? css`
                  &:hover ${HoverBox} {
                    display: inline;
                  }

                  ${({ titleLength, systemType }) =>
                    titleLength < 28
                      ? css`
                          width: ${systemType === 'ess' ? '388px' : '398px'};
                        `
                      : titleLength < 46
                      ? css`
                          width: ${systemType === 'ess' ? '610px' : '624px'};
                        `
                      : css`
                          width: ${systemType === 'ess' ? '900px' : '844px'};
                        `}
                  padding-left: 4px;
                `
              : p.second
              ? css`
                  width: ${p.systemType === 'ess' ? '96px' : '100px'};
                  justify-content: center;
                  padding-right: ${p.systemType === 'ess' ? '14px' : '34px'};
                `
              : css`
                  width: 122px;
                  justify-content: center;
                  padding-left: 20px;
                `};
        `}
`;

export const HeaderTitle = styled.span`
  margin-left: ${({ isMobile }) => !isMobile && '8px'};
  font-size: ${(p) => (p.isMobile ? '10px' : '14px')};
  letter-spacing: ${(p) => (p.isMobile ? '1.0px' : '1.4px')};
  color: ${({ isSwitch }) => (isSwitch ? '#fcff01' : '#fff')};
  overflow: hidden;
  cursor: pointer;
`;

export const HoverBox = styled.div`
  width: auto;
  height: auto;
  position: absolute;
  ${flexBoxCenter}
  bottom: 32px;
  left: 0;
  z-index: 100;
  display: none;
`;

export const HeaderButton = styled.button`
  width: 88px;
  height: 25px;
  border-radius: 18px;
  ${layerB}
  ${flexBoxCenter}
  position: absolute;
  top: 3px;
  right: 3px;
`;

export const HeaderButtonOuter = styled.div`
  width: 86px;
  height: 23px;
  border-radius: 25px;
  ${layerA180Deg}
  ${flexBoxCenter}
`;

export const HeaderButtonHole = styled.div`
  width: 78px;
  height: 15px;
  border-radius: 18px;
  ${layerB}
  ${flexBoxCenter}
`;

export const HeaderButtonTop = styled.div`
  width: 76px;
  height: 13px;
  border-radius: 25px;
  font-size: 7px;
  ${layerA180Deg}
  ${flexBoxCenter}
`;

export const SectionMainContentClose = styled.section`
  ${(p) =>
    p.isMobile
      ? css`
          width: 311px;
          height: 88px;
          border-radius: 30px;
          ${layerA180Deg};
          ${flexDirectionColumn};
          padding: 4px 0;
          ${p.isExpanded &&
          css`
            height: auto;
          `}
        `
      : css`
          width: ${p.systemType === 'ess' ? '130%' : '100%'};
          height: 77px;
          background: transparent linear-gradient(180deg, #1f344c 0%, #060d19 100%);
          border: 1px solid #000000;
          border-radius: 39px;
          ${justifyContentSpaceBetween}
          padding: 0 10px;
          box-sizing: border-box;
        `}

  ${(p) =>
    p.isOff &&
    css`
      background: transparent linear-gradient(180deg, #505050 0%, #1d1d1d 100%);
      border: 1px solid #000000;
    `}

  ${(p) =>
    p.isFaults &&
    css`
      border: 1px solid red;
    `}

  position: relative;
`;

export const SectionMain = styled.section`
  ${(p) =>
    p.isMobile
      ? css`
          width: 303px;
          height: 52px;
          border-radius: 30px;
          ${layerA}
          ${flexBoxCenter}
        `
      : css`
          width: ${p.systemType === 'tgs' || p.systemType === 'tes' ? '310px' : '100%'};
          height: 59px;
          border-radius: 30px;
          ${layerBDark}
          padding: 0 2px;
          margin-right: 10px;
          ${justifyContentSpaceBetween};
        `}

  ${(p) =>
    p.isOff &&
    css`
      ${layerBDisabled};
    `}
`;

export const SectionSub = styled.section`
  ${justifyContentSpaceBetween};

  ${(p) =>
    p.isMobile
      ? css`
          width: 220px;
          height: 23px;
          border-radius: 13px;
          ${layerA};
          padding: 0 4px;
        `
      : css`
          width: ${p.systemType === 'tgs' || p.systemType === 'tes' ? '868px' : '100%'};
          height: 59px;
          border-radius: 30px;
          ${layerA};
          padding: 0 10px 0 2px;
        `}

  ${(p) =>
    p.isOff &&
    css`
      ${layerBDisabled}
    `}
`;

export const ShutOffButton = styled.button`
  width: 55px;
  height: 55px;
  border-radius: 50%;
  ${flexBoxCenter}

  ${(p) =>
    p.isMobile &&
    css`
      width: 44px;
      height: 44px;
      margin-left: 1px;
    `}
`;

export const InstantHeatAndFanOnlyWrapper = styled.div`
  width: 189px;
  height: 55px;
  border-radius: 27px;
  ${layerCLighter};
  ${justifyContentSpaceBetween}
  padding: 0 1px;

  ${(p) =>
    p.isOff &&
    css`
      ${layerADisabled180Deg};
    `}
`;

export const InstantHeatWrapper = styled.form`
  width: ${(p) => (p.hasFanOnly ? '132px' : '148px')};
  height: ${(p) => (p.hasFanOnly ? '53px' : '55px')};
  border-radius: ${(p) => (p.hasFanOnly ? '27px' : '28px')};

  ${(p) =>
    p.hasFanOnly
      ? css`
          ${justifyContentSpaceBetween}
          ${layerA180Deg}
          padding: 0 5px;
        `
      : css`
          background: #142033;
          box-shadow: inset 0px 0px 2px #000000;
          ${flexBoxCenter}
        `}

  ${(p) =>
    p.isActivated && p.hasFanOnly
      ? css`
          ${activeLayer180Deg}
        `
      : p.isReady && p.hasFanOnly &&
        css`
          ${readyTop180Deg}
        `};

  ${(p) =>
    p.isOff &&
    css`
      ${layerADisabled180Deg};
    `};
`;

export const InstantHeatInner = styled.div`
  width: 146px;
  height: 53px;
  border-radius: 27px;
  ${layerA180Deg};
  ${justifyContentSpaceBetween}
  padding: 0 5px;

  ${(p) =>
    p.isActivated
      ? css`
          ${activeLayer180Deg};
        `
      : p.isReady &&
        css`
          ${readyTop180Deg}
        `};

  ${(p) =>
    p.isOff &&
    css`
      ${layerADisabled180Deg};
    `};
`;

export const ButtonWrapper = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  ${layerA180Deg}
  ${flexBoxCenter}

  ${(p) =>
    p.isActivated &&
    css`
      ${activeLayer180Deg};
    `};

  ${(p) =>
    p.isOff &&
    css`
      ${layerADisabled180Deg}
    `}
`;

export const Button = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  ${layerA}
  ${flexBoxCenter}

  ${(p) =>
    p.isActivated &&
    css`
      background: #124000;
      box-shadow: inset 0px 0px 1px #000000;
    `}

  ${(p) =>
    p.isOff &&
    css`
      cursor: not-allowed;
      ${layerBDisabled};
    `}
`;

export const ButtonHole = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  ${flexBoxCenter}
  ${layerA180Deg}

  ${(p) =>
    p.isActivated
      ? css`
          ${activeLayer180Deg};
        `
      : p.isReady &&
        css`
          ${readyTop180Deg}
        `}

  ${(p) =>
    p.isOff &&
    css`
      ${layerADisabled180Deg};
    `}
`;

export const ButtonTop = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  ${flexBoxCenter}
  ${layerA}

  ${(p) =>
    p.isActivated &&
    css`
      background: #124000;
      box-shadow: inset 0px 0px 3px #000000;
    `}

  ${(p) =>
    p.isOff &&
    css`
      ${layerBDisabled};
    `}
`;

export const Img = styled.img`
  width: 100%;

  ${(p) =>
    p.isShutOff &&
    css`
      width: 110%;
    `};

  ${(p) =>
    p.energy &&
    css`
      height: 100%;
    `};

  ${(p) =>
    p.expandIcon &&
    css`
      height: 62%;
    `}
`;

export const TitleAndInputWrapper = styled.div`
  height: 100%;
  width: auto;
  ${flexDirectionColumn};
  padding: 3px 0;
  margin-right: 6px;
`;

export const ControllerTitleWrapper = styled.div`
  width: 70px;
  height: 22px;
  border-radius: 20px;
  ${layerA};
  ${flexBoxCenter}

  ${(p) =>
    p.isActivated &&
    css`
      background: #124000;
      box-shadow: inset 0px 0px 1px #000000;
    `}

  ${(p) =>
    p.isOff &&
    css`
      ${layerADisabled};
    `}
`;

export const ControllerTitle = styled.span`
  ${(p) =>
    p.hasTitleWrapper
      ? css`
          width: 68px;
          height: 20px;
          border-radius: 25px;
          ${layerA180Deg}

          ${(p) =>
            p.isActivated
              ? css`
                  ${activeLayer180Deg};
                `
              : p.isReady &&
                css`
                  ${readyTop180Deg}
                `}
        `
      : css``}

  font-size: 8px;
  letter-spacing: 0.5px;
  text-align: center;

  ${(p) =>
    p.isOff &&
    css`
      ${p.hasTitleWrapper &&
      css`
        ${layerADisabled180Deg}
      `}
      color: #808080;
    `}
`;

export const TempInput = styled.input`
  width: ${(p) => (p.hasFanOnly ? '70px' : '44px')};
  height: ${(p) => (p.hasFanOnly ? '22px' : '44px')};
  border-radius: ${(p) => (p.hasFanOnly ? '20px' : '24px')};
  ${layerA};
  font-size: 8px;

  &::placeholder {
    color: #fff;
    ${(p) =>
      p.isOff &&
      css`
        color: #808080;
      `}
  }

  ${(p) =>
    p.isActivated &&
    css`
      ${activeInput}
    `}

  ${flexBoxCenter}
  ${(p) => !p.hasFanOnly && css`border-radius: 50%;`}

  ${(p) =>
    p.isOff &&
    css`
      ${layerBDisabled};
      color: #808080;
    `}
`;

export const SnowSensorWrapper = styled.div`
  width: ${(p) => (p.hasFanOnly ? '55px' : '98px')};
  height: 55px;
  border-radius: ${(p) => (p.hasFanOnly ? '50%' : '28px')};
  ${(p) => (p.hasFanOnly ? layerC : layerCLighter)};
  ${flexBoxCenter};

  ${(p) =>
    p.isOff &&
    css`
      ${p.hasFanOnly ? layerADisabled : layerADisabled180Deg};
    `}
`;

export const SnowSensorInner = styled.div`
  width: ${(p) => (p.hasFanOnly ? '52px' : '96px')};
  height: ${(p) => (p.hasFanOnly ? '52px' : '53px')};
  border-radius: ${(p) => (p.hasFanOnly ? '50%' : '27px')};
  ${layerA180Deg};
  ${justifyContentSpaceBetween}
  padding: 0 3px 0 5px;

  ${(p) =>
    p.isReady &&
    css`
      ${readyTop180Deg};
    `}

  ${(p) =>
    p.isActivated &&
    css`
      ${activeLayer180Deg}
    `}

  ${(p) =>
    p.isOff &&
    css`
      ${layerADisabled180Deg};
    `}
`;

export const SectionConsumption = styled.section`
  ${flexBoxCenter}

  ${(p) =>
    p.isMobile
      ? css`
          width: 128px;
          height: 20px;
          border-radius: 15px 0 0 15px;
          ${layerA};
          justify-content: flex-end;
          padding: 2px 0;
          margin-bottom: 1px;
        `
      : css`
          width: 94px;
          height: 56px;
          border-radius: 28px 12px 12px 28px;
          ${layerC};
        `}

  ${(p) =>
    p.isOff &&
    css`
      ${layerBDisabled}
    `}
`;

export const ConsumptionWrapper = styled.div`
  ${(p) =>
    p.isMobile
      ? css`
          width: 126px;
          height: 18px;
          border-radius: 19px 4px 4px 19px;
          ${layerC};
          ${justifyContentSpaceBetween};
          padding: 0 6px 0 2px;

          ${(p) =>
            p.isOff &&
            css`
              background: #3b3b3b;
              box-shadow: inset 0px 0.5px 3px #000000;
            `}
        `
      : css`
          width: 80%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding-left: 3px;
          padding-top: 14px;
          position: relative;
        `}
`;

export const ConsumptionImgWrapper = styled.div`
  ${(p) =>
    p.isMobile
      ? css`
          width: 17px;
          height: 14px;
        `
      : css`
          width: 100%;
          height: 28px;
          position: absolute;
          top: 0;
          left: 20px;
        `}
`;

export const ConsumptionTitleS = styled.span`
  color: #fcff01;

  ${(p) =>
    p.isMobile
      ? css`
          font-size: 7px;
          line-height: 90%;
        `
      : css`
          font-size: 8px;
          letter-spacing: 0.4px;

          ${(p) =>
            p.first &&
            css`
              margin-top: -9px;
              margin-bottom: -2px;
            `}
        `}

  ${(p) =>
    p.isOff &&
    css`
      color: #808080;
    `}
`;

export const ConsumptionTitleG = styled.span`
  color: #fcff01;
  margin-right: 4px;

  ${(p) =>
    p.isMobile
      ? css`
          font-size: 8px;
        `
      : css`
          font-size: 12px;
          letter-spacing: 1.2px;
        `}

  ${(p) =>
    p.isOff &&
    css`
      color: #808080;
    `}
`;

export const ConsumptionUnit = styled.span`
  text-transform: capitalize;
  color: #fcff01;
  font-size: 12px;
  letter-spacing: 1.2px;

  ${(p) =>
    p.isMobile &&
    css`
      font-size: 8px;
      letter-spacing: ${p.systemType === 'tgs' ? '0.8px' : '1px'};
    `};

  ${(p) =>
    p.isOff &&
    css`
      color: #808080;
    `};
`;

export const ConsumptionTitleWrapper = styled.div`
  ${justifyContentFlexStart}
  margin-top: -2px;

  ${(p) =>
    p.isMobile &&
    css`
      margin-top: 0;
    `}
`;

export const SectionTemperature = styled.section`
  width: 208px;
  height: 56px;
  border-radius: 12px;
  ${layerC}
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;

  ${(p) =>
    p.isOff &&
    css`
      ${layerBDisabled};
    `}
`;

export const DisplayTempWrapper = styled.div`
  ${flexBoxCenter}
  width: 202px;
  height: 24px;
  background: transparent linear-gradient(180deg, #ffd500 0%, #6a4e00 100%);
  box-shadow: inset 0px 1px 2px #ffffff29, 0px 0px 1px #000000;
  border: 0.5px solid #000000;
  border-radius: 14px;

  ${(p) =>
    p.isOff &&
    css`
      ${layerADisabled180Deg};
    `}
`;

export const DisplayTempWrapperTop = styled.div`
  ${flexBoxCenter}
  font-size: 14px;
  width: 195px;
  height: 18px;
  background: #d9b600;
  box-shadow: inset 0px 0.5px 2px #000000;
  border-radius: 12px;
  color: #1b2b44;

  ${(p) =>
    p.isOff &&
    css`
      ${layerBDisabled};
      color: #565656;
    `}
`;

export const SectionState = styled.section`
  width: 208px;
  height: 56px;
  border-radius: 14px;
  ${layerC}
  ${justifyContentSpaceAround}

  ${(p) =>
    p.isOff &&
    css`
      ${layerBDisabled};
    `}
`;

export const DisplayStateWrapper = styled.div`
  width: 25px;
  height: 49px;
  border-radius: 13px;
  ${layerB};
  ${flexDirectionColumn};
  padding-bottom: 5px;

  ${(p) =>
    p.isOff &&
    css`
      ${layerBDisabled};
    `}
`;

export const DisplayLogoImg = styled.img`
  width: 90%;
`;

export const DisplayIndicator = styled.div`
  border-radius: 50%;
  width: 12px;
  height: 12px;
  background: #565656;

  ${(p) =>
    p.isReady &&
    css`
      background-color: #82ffff;
    `}

  ${(p) =>
    p.isActivated &&
    css`
      background: #95ff45;
    `}

  ${(p) =>
    p.isOff &&
    css`
      background: #565656;
    `}
`;

export const SectionInfo = styled.section`
  width: 208px;
  height: 28px;
  border-radius: 18px;
  ${layerCLighter};
  ${justifyContentSpaceAround};

  ${(p) =>
    p.isOff &&
    css`
      ${layerBDisabled};
    `}
`;

export const InfoWrapperA = styled.div`
  width: 49px;
  height: 12px;
  border-radius: 7px;
  ${layerA};
  ${justifyContentSpaceBetween};
  padding: 0 4px;

  ${(p) =>
    p.isOff &&
    css`
      ${layerBDisabled};
    `}
`;

export const InfoWrapperB = styled.div`
  width: 27px;
  height: 15px;
  border-radius: 7px;
  ${layerA}
  ${flexBoxCenter}

  ${(p) =>
    p.isOff &&
    css`
      ${layerBDisabled};
    `}
`;

export const InfoImag = styled.img`
  height: 60%;
`;

export const InfoTitle = styled.span`
  font-size: 10px;

  ${(p) =>
    p.isMobile &&
    css`
      font-size: 7px;
    `};

  ${(p) =>
    p.isOff
      ? css`
          color: #808080;
        `
      : p.title === 'gp'
      ? css`
          color: #95ff45;
        `
      : css`
          color: #ff7800;
        `}

  ${(p) =>
    p.state ||
    css`
      color: #808080;
    `}
`;

export const SectionButton = styled.section`
  width: 73px;
  height: 28px;
  border-radius: 18px;
  ${layerB};
  ${flexBoxCenter}

  ${(p) =>
    p.isOff &&
    css`
      ${layerADisabled};
    `}
`;

export const ExpandButton = styled.button`
  width: 71px;
  height: 26px;
  border-radius: 25px;
  ${layerA180Deg};
  ${flexBoxCenter}

  ${(p) =>
    p.isOff &&
    css`
      cursor: not-allowed;
      ${layerADisabled180Deg};
    `}
`;

export const ExpandButtonHole = styled.div`
  width: 63px;
  height: 18px;
  border-radius: 18px;
  ${layerB};
  ${flexBoxCenter}

  ${(p) =>
    p.isOff &&
    css`
      ${layerADisabled};
    `}
`;

export const ExpandButtonTop = styled.div`
  width: 61px;
  height: 16px;
  border-radius: 25px;
  ${layerA180Deg};
  ${flexBoxCenter}
  font-size: 8px;

  ${(p) =>
    p.isOff &&
    css`
      ${layerADisabled180Deg};
      color: #808080;
    `}
`;

export const SectionMainContentExpand = styled.div`
  width: ${(p) => (p.systemType === 'ess' ? '1205px' : '100%')};
  ${flexBoxCenter}

  ${(p) =>
    p.isMobile &&
    css`
      ${p.systemType === 'ess' ? '' : 'width: 100%;'}
      margin-top: 6px;
    `}
`;

export const MessageBoxWrapper = styled.div`
  width: ${(p) => (p.systemType === 'ess' ? '34%' : '100%')};
  ${(p) =>
    p.systemType === 'tes' &&
    css`
      max-width: 1180px;
    `}
  height: ${(p) => (p.systemType === 'ess' ? '190px' : p.systemType === 'tes' ? '600px' : '190px')};
  position: absolute;
  ${flexBoxCenter}
  top: ${(p) => (p.systemType === 'tes' ? '-100%' : '0')};
  left: 0;
  z-index: 100;
`;

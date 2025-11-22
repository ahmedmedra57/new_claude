import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  layerA,
  layerA180Deg,
  layerC,
  justifyContentSpaceBetween,
  layerB,
  readyTop180Deg,
  activeLayer180Deg,
  activeInput,
  layerADark,
  flexDirectionColumn,
} from '../styles/commonStyles';

export const SectionMobileSwitches = styled.section`
  width: 303px;
  height: 60px;
  border-radius: 33px;
  ${layerA};
  ${flexBoxCenter};
  ${(p) =>
    p.isExpanded &&
    css`
      margin-bottom: 4px;
    `}
`;

export const MobileSwitchesInner = styled.div`
  width: 300px;
  height: 58px;
  border-radius: 31px;
  ${layerA180Deg};
  ${justifyContentSpaceBetween};
  padding: 0 6px;
`;

export const SectionLogo = styled.section`
  width: 44px;
  height: 44px;
  ${layerC}
  border-radius: 50%;
  ${flexBoxCenter}

  ${(p) => p.isReady && css``};
  ${(p) => p.isActivated && css``};
`;

export const Button = styled.button`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  ${layerA180Deg};
  ${flexBoxCenter};

  ${(p) =>
    p.noButton &&
    css`
      cursor: default;
    `}

  ${(p) =>
    p.isReady &&
    css`
      ${readyTop180Deg};
    `};
  ${(p) =>
    p.isActivated &&
    css`
      ${activeLayer180Deg};
    `};
  ${(p) =>
    p.isSelected &&
    css`
      border: 1px solid #95ff45;
    `}
`;

export const ButtonHole = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  ${layerA};
  ${flexBoxCenter};
  ${(p) =>
    p.isActivated &&
    css`
      ${activeInput};
    `};
`;

export const ButtonTop = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  ${layerA180Deg};
  ${flexBoxCenter};
`;

export const IconImg = styled.img`
  ${(p) =>
    p.isMc ||
    css`
      height: 100%;
    `}
  ${(p) =>
    p.isAts &&
    css`
      height: 80%;
    `}
`;

export const SectionController = styled.section`
  width: 238px;
  height: 48px;
  border-radius: 26px;

  ${layerA};
  ${justifyContentSpaceBetween};
  padding: 0 2px;
`;

export const ComponentWrapper = styled.div`
  width: 147px;
  height: 36px;
  border-radius: 18px;
  ${layerB};
  ${flexBoxCenter};
  ${(p) =>
    p.isSelected &&
    css`
      border: 1px solid #95ff45;
    `}
`;

export const SubButton = styled.button`
  width: 145px;
  height: 34px;
  border-radius: 25px;
  ${layerA180Deg};
  ${flexBoxCenter}
`;

export const SubButtonHole = styled.div`
  width: 137px;
  height: 26px;
  border-radius: 18px;
  ${layerA};
  ${flexBoxCenter};
`;

export const SubButtonTop = styled.div`
  width: 135px;
  height: 24px;
  border-radius: 25px;
  ${layerA180Deg};
  ${(p) =>
    p.isAts
      ? css`
          ${justifyContentSpaceBetween}
          padding: 0 6px;
        `
      : css`
          ${flexBoxCenter}
        `}
`;

export const ButtonName = styled.span`
  font-size: 14px;
  letter-spacing: 1.4px;

  ${(p) =>
    p.isGp &&
    css`
      color: #95ff45;
    `};

  ${(p) =>
    p.isEbp &&
    css`
      color: #ff7800;
    `};
`;

export const Wrapper = styled.div`
  width: 413px;
  ${flexBoxCenter}
  display: flex;
  flex-direction: column;
  position: relative;

  ${(p) => p.isMobile && css``}
`;

export const SectionHeader = styled.section`
  width: 100%;
  position: relative;
`;

export const HeaderTitleWrapper = styled.div`
  position: absolute;
  top: 0;
  padding: 0 6px;
  width: 100%;
  height: 100%;
  ${justifyContentSpaceBetween};
`;

export const Title = styled.span`
  font-size: 14px;
  letter-spacing: 1.4px;

  ${(p) =>
    p.right
      ? css`
          margin-left: 8px;
        `
      : css`
          width: 53%;
          font-size: 12px;
          letter-spacing: 1.2px;
        `}
`;

export const HeaderHatSvg = styled.img`
  position: relative;
`;

export const SectionMain = styled.section`
  width: 413px;
  height: 665px;

  background: transparent linear-gradient(180deg, #20354e 0%, #060d19 100%);
  border: 1px solid #000000;
  border-radius: 0px 12px 12px 12px;

  ${flexBoxCenter};

  ${({ isFaults }) =>
    isFaults &&
    css`
      border: 1px solid red;
    `}
`;

export const MainInnerWrapper = styled.div`
  width: 401px;
  height: 654px;
  border-radius: 8px;
  ${layerADark};
  ${flexDirectionColumn};
  padding: 1.5px 0;
`;

export const MessageBoxWrapper = styled.div`
  width: 1180px;
  height: 600px;
  position: absolute;

  ${flexBoxCenter};

  top: 0;
  left: 0;
  z-index: 100;
`;

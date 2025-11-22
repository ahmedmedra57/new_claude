import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerA90Deg,
  layerADark,
  layerB,
  layerBDark,
  layerC,
  layerCLighter,
} from '../styles/commonStyles';

// Desktop 2-column layout
export const TwoColumnWrapper = styled.div`
  display: flex;
  width: 100%;
  height: calc(100vh - 150px);
  gap: 10px;
  padding: 10px;
`;

export const NavigationColumn = styled.div`
  flex: 0 0 400px;
  display: flex;
  flex-direction: column;
  ${layerC};
  border-radius: 16px;
  overflow: hidden;
`;

export const DetailsColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  ${layerC};
  border-radius: 16px;
  overflow: hidden;
`;

export const ColumnHeader = styled.div`
  ${layerBDark};
  padding: 12px 16px;
  border-bottom: 2px solid #2c3e50;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ColumnTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1.2px;
  color: #95ff45;
  margin: 0;
  text-transform: uppercase;
`;

export const NavigationList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  ${layerA};

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #1a2332;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #3a4e6c;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #4a5e7c;
  }
`;

export const ZoneContainer = styled.div`
  margin-bottom: 4px;
`;

export const ZoneItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

export const ExpandIcon = styled.span`
  font-size: 12px;
  color: #95ff45;
  transition: transform 0.2s ease;
  transform: ${(p) => (p.isExpanded ? 'rotate(180deg)' : 'rotate(-90deg)')};
`;

export const SwitchesSubmenu = styled.div`
  margin-left: 16px;
  margin-top: 8px;
  padding: 8px;
  ${layerA};
  border-radius: 8px;
  border-left: 3px solid #95ff45;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const SwitchSubmenuItem = styled.div`
  ${layerBDark};
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid ${(p) => (p.isSelected ? '#ff920c' : 'transparent')};

  &:hover {
    ${layerB};
    transform: translateX(4px);
  }

  ${(p) =>
    p.isSelected &&
    css`
      ${layerB};
      box-shadow: 0 0 10px rgba(255, 146, 12, 0.3);
    `}
`;

export const DetailsContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  ${layerA};

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #1a2332;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #3a4e6c;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #4a5e7c;
  }
`;

export const ZoneItem = styled.div`
  ${layerBDark};
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid ${(p) => (p.isSelected ? '#95ff45' : 'transparent')};

  &:hover {
    ${layerB};
    transform: translateX(4px);
  }

  ${(p) =>
    p.isSelected &&
    css`
      ${layerB};
      box-shadow: 0 0 10px rgba(149, 255, 69, 0.3);
    `}
`;

export const ZoneItemTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
`;

export const ZoneItemSubtitle = styled.div`
  font-size: 11px;
  color: #95ff45;
  margin-bottom: 4px;
`;

export const ZoneItemInfo = styled.div`
  font-size: 10px;
  color: #aaa;
`;

export const SwitchItem = styled(ZoneItem)`
  border-color: ${(p) => (p.isSelected ? '#ff920c' : 'transparent')};

  ${(p) =>
    p.isSelected &&
    css`
      box-shadow: 0 0 10px rgba(255, 146, 12, 0.3);
    `}
`;

export const SwitchItemTitle = styled(ZoneItemTitle)``;

export const SwitchItemSubtitle = styled.div`
  font-size: 11px;
  color: #ff920c;
`;

export const MasterControlButton = styled.button`
  width: 100%;
  padding: 10px 12px;
  ${layerBDark};
  border: 2px solid #95ff45;
  border-radius: 8px;
  color: #95ff45;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 4px;

  &:hover:not(:disabled) {
    ${layerB};
    transform: scale(1.02);
    box-shadow: 0 4px 8px rgba(149, 255, 69, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
  font-size: 14px;
  text-align: center;
  padding: 20px;
`;

// Mobile layout
export const MobileWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 10px;
`;

export const MobileHeader = styled.div`
  ${layerBDark};
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 12px;
  text-align: center;
`;

export const BackButton = styled.button`
  ${layerA};
  border: 1px solid #95ff45;
  padding: 8px 16px;
  border-radius: 8px;
  color: #95ff45;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 12px;
  transition: all 0.2s ease;

  &:hover {
    ${layerB};
    transform: translateX(-4px);
  }
`;

export const MobileMasterControlButton = styled.button`
  width: 100%;
  padding: 12px;
  ${layerBDark};
  border: 2px solid #95ff45;
  border-radius: 12px;
  color: #95ff45;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 12px;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    ${layerB};
    box-shadow: 0 4px 8px rgba(149, 255, 69, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const MobileZonesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const MobileZoneItem = styled.div`
  ${layerBDark};
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    ${layerB};
    transform: scale(1.02);
  }
`;

export const MobileZoneTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
`;

export const MobileZoneSubtitle = styled.div`
  font-size: 12px;
  color: #95ff45;
  margin-bottom: 4px;
`;

export const MobileZoneInfo = styled.div`
  font-size: 11px;
  color: #aaa;
`;

export const MobileSwitchesList = styled(MobileZonesList)``;

export const MobileSwitchItem = styled(MobileZoneItem)``;

export const MobileSwitchTitle = styled(MobileZoneTitle)``;

export const MobileSwitchSubtitle = styled.div`
  font-size: 12px;
  color: #ff920c;
`;

export const MobileDetailsContent = styled.div`
  ${layerA};
  padding: 16px;
  border-radius: 12px;
`;

export const Title = styled.span`
  display: inline-block;
  width: 100%;
  font-size: 14px;
  letter-spacing: 1.4px;
  border-bottom: 1px solid #fff;
  ${(p) =>
    p.isMobile &&
    css`
      font-size: 11px;
      letter-spacing: 1px;
      text-align: center;
      border-bottom: none;
    `}
`;

export const TitleWrapper = styled.div`
  width: 100%;
  ${justifyContentSpaceBetween};
`;

export const UnderLine = styled.div`
  width: 120px;
  border: 1px solid #fff;
`;

export const MessageBoxWrapper = styled.div`
  width: 1200px;
  height: 220px;
  ${flexBoxCenter}
  position: absolute;
  top: 43%;
  left: 18%;
  z-index: 100;
`;

/**
 * Shared Styled Components for Control Components
 *
 * Common UI elements used across InstantHeat, SnowSensor, WindFactor,
 * and HeatingSchedule implementations to reduce duplication.
 *
 * These styles are extracted from the 12 control component files.
 */

import styled, { css } from 'styled-components';
import {
  activeInput,
  activeLayer180Deg,
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerADark,
  layerB,
  layerBDark,
  layerC,
  readyTop180Deg,
  grayModeLayer,
  layerADisabled180Deg,
  layerBDisabled,
  DisableButtonIndentTop,
} from '../styles/commonStyles';

/**
 * Common Input Components
 */

export const TemperatureInput = styled.input`
  width: ${props => props.width || '145px'};
  height: ${props => props.height || '36px'};
  border-radius: ${props => props.borderRadius || '25px'};
  font-size: ${props => props.fontSize || '22px'};
  letter-spacing: 2.2px;

  ${layerA}

  &::placeholder {
    color: #fff;
  }

  ${p => p.isActivated && css`
    ${activeInput}
  `}

  ${p => p.isDisabled && css`
    ${DisableButtonIndentTop};
  `}

  ${p => p.isMobile && css`
    width: 91px;
    height: 30px;
    border-radius: 18px;
    font-size: 11px;
  `}
`;

export const InputWrapper = styled.div`
  width: ${props => props.width || '146px'};
  height: ${props => props.height || '25px'};
  border-radius: 22px;
  ${layerA180Deg}
  ${flexBoxCenter}

  ${p => p.apply && css`
    ${activeLayer180Deg};
  `}
`;

/**
 * Common Button Components
 */

export const ControlButton = styled.button`
  width: ${props => props.width || '190px'};
  height: ${props => props.height || '35px'};
  border-radius: 25px;

  ${layerA180Deg}
  ${flexBoxCenter}

  ${p => p.isReady && css`
    border: 1px solid #95ff45;
  `}

  ${p => p.isActivated && css`
    ${activeLayer180Deg};
  `}

  ${p => p.disabled && css`
    ${layerADisabled180Deg};
    cursor: not-allowed;
  `}
`;

export const ButtonHole = styled.div`
  width: ${props => props.width || '182px'};
  height: ${props => props.height || '27px'};
  border-radius: 18px;

  ${layerC}
  ${flexBoxCenter}

  ${p => p.disabled && css`
    ${layerBDisabled}
  `}
`;

export const ButtonTop = styled.div`
  width: ${props => props.width || '180px'};
  height: ${props => props.height || '25px'};
  border-radius: 25px;

  ${layerA180Deg}
  ${flexBoxCenter}
  font-size: ${props => props.fontSize || '10px'};

  ${p => p.disabled && css`
    ${layerADisabled180Deg};
    color: #808080;
  `}
`;

/**
 * Common Circle/Logo Components
 */

export const CircleButton = styled.button`
  width: ${props => props.size || '94px'};
  height: ${props => props.size || '94px'};
  border-radius: 50%;

  ${layerA180Deg}
  ${flexBoxCenter}

  ${p => p.isReady && css`
    ${readyTop180Deg}
  `}

  ${p => p.isActivated && css`
    ${activeLayer180Deg}
  `}

  ${p => p.isDisabled && css`
    ${grayModeLayer};
  `}
`;

export const CircleHole = styled.div`
  width: ${props => props.size || '38px'};
  height: ${props => props.size || '38px'};
  border-radius: 50%;

  ${layerA180Deg}
  ${flexBoxCenter}

  ${p => p.isReady && css`
    ${readyTop180Deg}
  `}

  ${p => p.isActivated && css`
    ${activeLayer180Deg};
  `}

  ${p => p.isDisabled && css`
    ${grayModeLayer};
  `}
`;

export const CircleTop = styled.div`
  width: ${props => props.size || '30px'};
  height: ${props => props.size || '30px'};
  border-radius: 50%;

  ${layerA}
  ${flexBoxCenter}

  ${p => p.isActivated && css`
    ${activeInput};
  `}

  ${p => p.isDisabled && css`
    ${grayModeLayer};
  `}
`;

export const LogoImage = styled.img`
  height: ${props => props.height || '120%'};
  width: ${props => props.width || 'auto'};
`;

/**
 * Common Container Components
 */

export const ControlWrapper = styled.div`
  width: ${props => props.width || '397px'};
  height: ${props => props.height || '145px'};
  border-radius: 6px;

  ${flexBoxCenter};
  ${layerA}

  ${p => p.isMobile && css`
    width: 303px;
    height: 54px;
    border-radius: 33px;
  `}
`;

export const ControlForm = styled.form`
  width: ${props => props.width || '389px'};
  height: ${props => props.height || '126px'};
  border-radius: 63px;

  ${layerA}
  ${flexBoxCenter}

  ${p => p.isMobile && css`
    width: 299px;
    height: 50px;
    border-radius: 31px;
    ${justifyContentSpaceBetween}
    padding: 0 3px 0 5px;
  `}
`;

export const ControlInnerLayer = styled.div`
  width: ${props => props.width || '385px'};
  height: ${props => props.height || '122px'};
  border-radius: 61px;

  ${flexBoxCenter};
  ${layerA180Deg};

  ${p => p.isReady && css`
    ${readyTop180Deg}
  `}

  ${p => p.isActivated && css`
    ${activeLayer180Deg};
  `}

  ${p => p.isDisabled && css`
    ${grayModeLayer};
  `}
`;

export const ControlContentWrapper = styled.div`
  width: ${props => props.width || '367px'};
  height: ${props => props.height || '104px'};
  border-radius: 52px;

  ${layerA180Deg}
  ${justifyContentSpaceBetween};
  padding: ${props => props.padding || '0 2px 0 10px'};

  ${p => p.isReady && css`
    ${readyTop180Deg}
  `}

  ${p => p.isActivated && css`
    ${activeLayer180Deg};
  `}

  ${p => p.isDisabled && css`
    ${grayModeLayer};
  `}
`;

/**
 * Common Title Components
 */

export const ControlTitle = styled.div`
  width: ${props => props.width || '380px'};
  height: 22px;
  border-radius: 11px;

  ${layerADark}
  ${justifyContentSpaceBetween}
  padding: 0 2px 0 10px;
  font-size: 8px;

  ${p => p.apply && css`
    ${activeInput};
  `}
`;

export const TitleText = styled.span`
  font-size: ${props => props.fontSize || '21px'};
  letter-spacing: ${props => props.letterSpacing || '2.1px'};
  line-height: 98%;
`;

/**
 * Common Section Components
 */

export const SectionInput = styled.section`
  height: 100%;
  width: ${props => props.width || '70%'};

  ${flexDirectionColumn}
  padding: ${props => props.padding || '10px 0 5px 25px'};
`;

export const SectionButton = styled.section`
  width: ${props => props.width || '98px'};
  height: ${props => props.height || '98px'};
  border-radius: 50%;

  ${layerA}
  ${flexBoxCenter}

  ${p => p.isActivated && css`
    ${activeInput}
  `}

  ${p => p.isDisabled && css`
    ${DisableButtonIndentTop};
  `}
`;

/**
 * Mobile-specific Components
 */

export const MobileControlWrapper = styled.div`
  width: 303px;
  height: 54px;
  border-radius: 33px;
  ${layerA};
  ${flexBoxCenter};
`;

export const MobileControlForm = styled.form`
  width: 299px;
  height: 50px;
  border-radius: 31px;

  ${layerA180Deg};
  ${justifyContentSpaceBetween};
  padding: 0 3px 0 5px;

  ${p => p.isReady && css`
    ${readyTop180Deg}
  `};

  ${p => p.isActivated && css`
    ${activeLayer180Deg};
  `};

  ${p => p.isDisabled && css`
    ${grayModeLayer};
  `};
`;

export const MobileCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;

  ${layerA};
  ${flexBoxCenter};

  ${p => p.isActivated && css`
    background: #124000;
  `}

  ${p => p.isDisabled && css`
    ${grayModeLayer};
  `};
`;

export const MobileMainSection = styled.section`
  width: 246px;
  height: 42px;
  border-radius: 26px;
  ${layerA};
  ${flexBoxCenter};

  ${p => p.isActivated && css`
    ${activeInput};
  `}

  ${p => p.isDisabled && css`
    ${grayModeLayer};
  `};
`;

export const MobileButton = styled.button`
  width: 137px;
  height: 30px;
  border-radius: 18px;
  ${layerA};
  ${flexBoxCenter};
  font-size: 12px;
  text-align: center;
  line-height: 95%;

  ${p => p.isActivated && css`
    ${activeInput};
  `}

  ${p => p.isDisabled && css`
    ${grayModeLayer};
  `};
`;

/**
 * TGS-specific Components
 */

export const TgsSwitchButton = styled.button`
  width: 189px;
  height: 40px;
  border-radius: 27px;
  ${layerB};
  ${flexBoxCenter};
  margin-bottom: 6px;

  ${p => p.isSelected && css`
    border: 1px solid #95ff45;
  `}
`;

export const TgsInputWrapper = styled.div`
  width: 162px;
  height: 34px;
  ${layerBDark};
  border-radius: 25px;
  ${flexBoxCenter}
`;

export const TgsFormWrapper = styled.form`
  cursor: pointer;
  width: 160px;
  height: 32px;
  border-radius: 25px;

  ${layerA180Deg}
  ${justifyContentSpaceBetween};
  padding: 0 2.5px 0 1.5px;

  ${p => p.isReadyToDispatch && css`
    border: 1px solid #95ff45;
  `}

  ${p => p.apply && css`
    ${activeLayer180Deg};
  `}
`;

/**
 * Utility Functions
 */

export const getLogoPath = (programType, isDisabled, isActivated) => {
  const logoMap = {
    instantHeat: isDisabled ? '/images/logo-instantHeat-disabled.svg' : '/images/logo-instantHeat.svg',
    snowSensor: isDisabled ? '/images/logo-snowSensor-disabled.svg' : '/images/logo-snowSensor.svg',
    windFactor: isDisabled ? '/images/logo-windFactor-disabled.svg' : '/images/logo-windFactor.svg',
    heatingSchedule: isDisabled ? '/images/logo-heatingSchedule-disabled.svg' : '/images/logo-heatingSchedule.svg',
    fanOnly: '/images/tgs-fanOnly.svg',
  };

  return logoMap[programType] || logoMap.instantHeat;
};

export const getTemperaturePlaceholder = (isF, isMobile = false) => {
  if (isMobile) {
    return isF ? '--- °F' : '--- °C';
  }
  return isF ? '--- °F' : '--- °C';
};

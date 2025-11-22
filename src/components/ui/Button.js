import { memo } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  flexBoxCenter,
  layerA,
  layerA180Deg,
  layerB,
  layerADark,
  layerBDark,
} from '../styles/commonStyles';

/**
 * Reusable Button Component
 *
 * Replaces 46+ duplicate button components across the codebase
 *
 * @param {string} variant - Button style: 'primary' | 'secondary' | 'confirm' | 'save' | 'cancel' | 'apply' | 'edit' | 'activate'
 * @param {string} size - Button size: 'small' | 'medium' | 'large'
 * @param {string} translationKey - i18n translation key (optional)
 * @param {ReactNode} children - Button content (optional, overrides translationKey)
 * @param {boolean} disabled - Disabled state
 * @param {function} onClick - Click handler
 * @param {string} type - Button type: 'button' | 'submit' | 'reset'
 * @param {boolean} fullWidth - Make button full width
 *
 * @example
 * <Button variant="primary" translationKey="common.save" onClick={handleSave} />
 * <Button variant="confirm" size="large">Custom Text</Button>
 */
const Button = ({
  variant = 'primary',
  size = 'medium',
  translationKey,
  children,
  disabled = false,
  onClick,
  type = 'button',
  fullWidth = false,
  ...props
}) => {
  const { t } = useTranslation();

  const buttonText = children || (translationKey ? t(translationKey) : '');

  return (
    <Wrapper variant={variant} size={size} fullWidth={fullWidth}>
      <StyledButton
        variant={variant}
        size={size}
        disabled={disabled}
        onClick={onClick}
        type={type}
        fullWidth={fullWidth}
        {...props}
      >
        <ButtonHole variant={variant} size={size}>
          <ButtonTop variant={variant} size={size}>
            <ButtonName variant={variant} size={size}>
              {buttonText}
            </ButtonName>
          </ButtonTop>
        </ButtonHole>
      </StyledButton>
    </Wrapper>
  );
};

export default memo(Button);

// Variant configurations
const variantConfig = {
  primary: {
    wrapper: layerB,
    button: layerA180Deg,
    hole: layerBDark,
    top: layerA180Deg,
    color: '#fff',
  },
  secondary: {
    wrapper: layerB,
    button: layerA,
    hole: layerBDark,
    top: layerA,
    color: '#fff',
  },
  confirm: {
    wrapper: layerB,
    button: layerA180Deg,
    hole: layerBDark,
    top: layerA180Deg,
    color: '#4caf50',
  },
  save: {
    wrapper: layerB,
    button: layerA180Deg,
    hole: layerBDark,
    top: layerA180Deg,
    color: '#2196f3',
  },
  cancel: {
    wrapper: layerB,
    button: layerADark,
    hole: layerBDark,
    top: layerADark,
    color: '#f44336',
  },
  apply: {
    wrapper: layerB,
    button: layerA180Deg,
    hole: layerBDark,
    top: layerA180Deg,
    color: '#ff9800',
  },
  edit: {
    wrapper: layerB,
    button: layerA,
    hole: layerBDark,
    top: layerA,
    color: '#9c27b0',
  },
  activate: {
    wrapper: layerB,
    button: layerA180Deg,
    hole: layerBDark,
    top: layerA180Deg,
    color: '#00bcd4',
  },
};

// Size configurations
const sizeConfig = {
  small: {
    width: '80px',
    height: '30px',
    fontSize: '11px',
    holeWidth: '78px',
    holeHeight: '28px',
    topWidth: '77px',
    topHeight: '26px',
  },
  medium: {
    width: '120px',
    height: '40px',
    fontSize: '13px',
    holeWidth: '118px',
    holeHeight: '38px',
    topWidth: '116px',
    topHeight: '36px',
  },
  large: {
    width: '160px',
    height: '50px',
    fontSize: '15px',
    holeWidth: '158px',
    holeHeight: '48px',
    topWidth: '156px',
    topHeight: '46px',
  },
};

const Wrapper = styled.div`
  width: ${(p) => (p.fullWidth ? '100%' : sizeConfig[p.size].width)};
  height: ${(p) => sizeConfig[p.size].height};
  ${(p) => variantConfig[p.variant].wrapper}
  ${flexBoxCenter}
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const StyledButton = styled.button`
  width: ${(p) => (p.fullWidth ? '100%' : sizeConfig[p.size].width)};
  height: ${(p) => sizeConfig[p.size].height};
  ${(p) => variantConfig[p.variant].button}
  ${flexBoxCenter}
  border-radius: 7px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  ${(p) =>
    p.disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    `}
`;

const ButtonHole = styled.div`
  width: ${(p) => (p.fullWidth ? '99%' : sizeConfig[p.size].holeWidth)};
  height: ${(p) => sizeConfig[p.size].holeHeight};
  ${(p) => variantConfig[p.variant].hole}
  ${flexBoxCenter}
  border-radius: 6px;
`;

const ButtonTop = styled.div`
  width: ${(p) => (p.fullWidth ? '99%' : sizeConfig[p.size].topWidth)};
  height: ${(p) => sizeConfig[p.size].topHeight};
  ${(p) => variantConfig[p.variant].top}
  ${flexBoxCenter}
  border-radius: 5px;
`;

const ButtonName = styled.span`
  font-size: ${(p) => sizeConfig[p.size].fontSize};
  font-weight: 600;
  color: ${(p) => variantConfig[p.variant].color};
  text-transform: lowercase;
  letter-spacing: 0.5px;
`;

/**
 * Unified MessageBox Component
 *
 * Replaces 7 duplicate message box components from masterControl/userMessages:
 * - SettingAppliedMessage.js (166 lines)
 * - SettingConfirmedMessage.js (190 lines)
 * - SelectSystemApplyMessageBox.js (608 lines)
 * - ViewCommand.js (579 lines)
 * - SelectSystemMessage.js (154 lines)
 * - ConflictMessage.js (156 lines)
 * - SettingEditButtonMessage.js (120 lines)
 *
 * Total savings: ~1,973 lines → ~200 lines (90% reduction)
 */

import { useMediaQuery } from 'react-responsive';
import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerB,
} from '../styles/commonStyles';
import MessageBoxButton from '../userMessages/MessageBoxButton';

/**
 * MessageBox Component
 *
 * @param {object} props
 * @param {string} props.title - Message box title
 * @param {string} props.subtitle - Optional subtitle
 * @param {string|string[]} props.message - Message content (string or array of strings)
 * @param {string} props.variant - Message variant: 'info', 'success', 'error', 'warning', 'confirmation'
 * @param {function} props.onClose - Close handler
 * @param {function} props.onConfirm - Optional confirmation handler (for confirmation variant)
 * @param {string} props.confirmText - Optional confirm button text (default: 'confirm')
 * @param {string} props.cancelText - Optional cancel button text (default: 'cancel')
 * @param {boolean} props.showButtons - Whether to show action buttons (default: true)
 * @param {React.ReactNode} props.children - Optional custom content
 * @param {string} props.iconSrc - Optional custom icon source
 */
const MessageBox = ({
  title = 'Message',
  subtitle,
  message = [],
  variant = 'info',
  onClose,
  onConfirm,
  confirmText = 'confirm',
  cancelText = 'cancel',
  showButtons = true,
  children,
  iconSrc,
}) => {
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  // Convert message to array if it's a string
  const messages = Array.isArray(message) ? message : [message];

  // Get variant-specific styles
  const getVariantIcon = () => {
    if (iconSrc) return iconSrc;

    const iconMap = {
      info: '/images/logo-info.svg',
      success: '/images/logo-success.svg',
      error: '/images/logo-error.svg',
      warning: '/images/logo-warning.svg',
      confirmation: '/images/logo-question.svg',
    };

    return iconMap[variant] || iconMap.info;
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    if (onClose) {
      onClose();
    }
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <Wrapper onClick={handleCancel}>
      <MessageOuter
        isMobile={isMobile}
        variant={variant}
        onClick={(e) => e.stopPropagation()}
      >
        <MessageInner isMobile={isMobile} variant={variant}>
          {/* Header */}
          <HeaderWrapper>
            <Header isMobile={isMobile}>
              <TitleWrapper>
                <TitleText isMobile={isMobile}>{title}</TitleText>
              </TitleWrapper>
              <LogoCircle>
                <LogoCircleInner>
                  <LogoCircleTop>
                    <LogoImg src={getVariantIcon()} alt={variant} />
                  </LogoCircleTop>
                </LogoCircleInner>
              </LogoCircle>
            </Header>
          </HeaderWrapper>

          {/* Subtitle (optional) */}
          {subtitle && (
            <SubtitleWrapper isMobile={isMobile}>
              <SubtitleText>{subtitle}</SubtitleText>
            </SubtitleWrapper>
          )}

          {/* Message Content */}
          <MessageWrapper isMobile={isMobile}>
            <MessageContent isMobile={isMobile}>
              {children || (
                <>
                  {messages.map((msg, index) => (
                    <MessageText key={index} isMobile={isMobile}>
                      {msg}
                    </MessageText>
                  ))}
                </>
              )}
            </MessageContent>
          </MessageWrapper>

          {/* Action Buttons */}
          {showButtons && (
            <ButtonWrapper isMobile={isMobile}>
              {variant === 'confirmation' && onConfirm ? (
                <>
                  <MessageBoxButton
                    title={cancelText}
                    handleOnClick={handleCancel}
                    isMobile={isMobile}
                  />
                  <MessageBoxButton
                    title={confirmText}
                    handleOnClick={handleConfirm}
                    isMobile={isMobile}
                    isPrimary
                  />
                </>
              ) : (
                <MessageBoxButton
                  title={confirmText}
                  handleOnClick={handleCancel}
                  isMobile={isMobile}
                />
              )}
            </ButtonWrapper>
          )}
        </MessageInner>
      </MessageOuter>
    </Wrapper>
  );
};

export default MessageBox;

// Styled Components

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0px;
  left: 0px;
  background-color: rgba(0, 0, 0, 0.2);
  ${flexBoxCenter};
  z-index: 1000;
`;

const MessageOuter = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 330px;
        `
      : css`
          width: 402px;
        `}

  background: transparent linear-gradient(180deg, #77777742 0%, #c2c2c224 100%);
  border-radius: 14px;
  ${flexBoxCenter}

  ${({ variant }) =>
    variant === 'error' &&
    css`
      background: transparent linear-gradient(180deg, #ff474742 0%, #ff474724 100%);
    `}

  ${({ variant }) =>
    variant === 'success' &&
    css`
      background: transparent linear-gradient(180deg, #47ff4742 0%, #47ff4724 100%);
    `}

  ${({ variant }) =>
    variant === 'warning' &&
    css`
      background: transparent linear-gradient(180deg, #ffff4742 0%, #ffff4724 100%);
    `}
`;

const MessageInner = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 320px;
        `
      : css`
          width: 392px;
        `}

  ${flexDirectionColumn}
  ${layerA180Deg}

  border-radius: 12px;
  padding: 2px 0 7px 0;

  ${({ variant }) =>
    variant === 'error' &&
    css`
      border: 1px solid rgba(255, 71, 71, 0.3);
    `}

  ${({ variant }) =>
    variant === 'success' &&
    css`
      border: 1px solid rgba(71, 255, 71, 0.3);
    `}

  ${({ variant }) =>
    variant === 'warning' &&
    css`
      border: 1px solid rgba(255, 255, 71, 0.3);
    `}
`;

const HeaderWrapper = styled.section`
  width: 100%;
  ${flexBoxCenter}
  margin-bottom: 5px;
`;

const Header = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 316px;
        `
      : css`
          width: 388px;
        `}

  height: 44px;
  border-radius: 33px;
  ${layerB}
  ${justifyContentSpaceBetween}
  padding: 0 2px 0 15px;
`;

const TitleWrapper = styled.div`
  ${flexBoxCenter}
`;

const TitleText = styled.span`
  ${({ isMobile }) =>
    isMobile
      ? css`
          font-size: 14px;
        `
      : css`
          font-size: 15px;
        `}
  letter-spacing: 1.4px;
  text-transform: capitalize;
`;

const LogoCircle = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  ${layerB}
  ${flexBoxCenter}
`;

const LogoCircleInner = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  ${layerA180Deg}
  ${flexBoxCenter}
`;

const LogoCircleTop = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  ${layerB}
  ${flexBoxCenter}
`;

const LogoImg = styled.img`
  height: 80%;
`;

const SubtitleWrapper = styled.div`
  width: 100%;
  ${flexBoxCenter}
  margin-bottom: 5px;
  padding: 0 20px;
`;

const SubtitleText = styled.span`
  font-size: 13px;
  letter-spacing: 1.3px;
  color: #95ff45;
  text-align: center;
`;

const MessageWrapper = styled.section`
  width: 100%;
  ${flexBoxCenter}
  margin-bottom: 10px;
`;

const MessageContent = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 300px;
        `
      : css`
          width: 368px;
        `}

  min-height: 60px;
  ${flexDirectionColumn}
  ${flexBoxCenter}
  padding: 10px;
  text-align: center;
`;

const MessageText = styled.span`
  ${({ isMobile }) =>
    isMobile
      ? css`
          font-size: 12px;
        `
      : css`
          font-size: 13px;
        `}
  letter-spacing: 1.2px;
  line-height: 140%;
  margin-bottom: 5px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  ${flexBoxCenter}
  gap: 10px;
  padding: 0 20px;
`;

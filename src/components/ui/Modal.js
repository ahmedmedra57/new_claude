import { memo, useEffect } from 'react';
import styled from 'styled-components';
import { createPortal } from 'react-dom';
import {
  flexBoxCenter,
  flexDirectionColumn,
  layerB,
  layerA,
  layerADark,
} from '../styles/commonStyles';

/**
 * Reusable Modal Component
 *
 * Replaces 22+ duplicate message box/modal components
 *
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Close handler
 * @param {ReactNode} children - Modal content
 * @param {string} title - Modal title
 * @param {string} width - Modal width (default: '400px')
 * @param {string} height - Modal height (default: 'auto')
 * @param {boolean} closeOnOverlayClick - Close modal when clicking overlay (default: true)
 * @param {boolean} showCloseButton - Show X close button (default: true)
 *
 * @example
 * <Modal isOpen={isOpen} onClose={handleClose} title="Confirm Action">
 *   <p>Are you sure?</p>
 * </Modal>
 */
const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  width = '400px',
  height = 'auto',
  closeOnOverlayClick = true,
  showCloseButton = true,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  const modalContent = (
    <Overlay onClick={handleOverlayClick}>
      <ModalWrapper width={width} height={height}>
        <ModalContainer>
          <ModalHole>
            <ModalTop>
              {title && (
                <Header>
                  <Title>{title}</Title>
                  {showCloseButton && (
                    <CloseButton onClick={onClose}>×</CloseButton>
                  )}
                </Header>
              )}
              {!title && showCloseButton && (
                <CloseButton onClick={onClose} standalone>
                  ×
                </CloseButton>
              )}
              <Content>{children}</Content>
            </ModalTop>
          </ModalHole>
        </ModalContainer>
      </ModalWrapper>
    </Overlay>
  );

  return createPortal(modalContent, document.body);
};

export default memo(Modal);

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  ${flexBoxCenter}
  z-index: 9999;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalWrapper = styled.div`
  width: ${(p) => p.width};
  height: ${(p) => p.height};
  ${layerB}
  border-radius: 12px;
  ${flexBoxCenter}
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      transform: translateY(50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ModalContainer = styled.div`
  width: calc(100% - 4px);
  height: calc(100% - 4px);
  ${layerA}
  border-radius: 11px;
  ${flexBoxCenter}
`;

const ModalHole = styled.div`
  width: calc(100% - 4px);
  height: calc(100% - 4px);
  ${layerADark}
  border-radius: 10px;
  ${flexBoxCenter}
`;

const ModalTop = styled.div`
  width: calc(100% - 4px);
  height: calc(100% - 4px);
  ${layerA}
  border-radius: 9px;
  ${flexDirectionColumn}
  padding: 20px;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0;
  text-transform: capitalize;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: ${(p) => (p.standalone ? '32px' : '28px')};
  color: #fff;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  ${flexBoxCenter}
  border-radius: 50%;
  transition: all 0.2s ease;
  position: ${(p) => (p.standalone ? 'absolute' : 'relative')};
  top: ${(p) => (p.standalone ? '10px' : 'auto')};
  right: ${(p) => (p.standalone ? '10px' : 'auto')};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  color: #fff;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;

    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }
`;

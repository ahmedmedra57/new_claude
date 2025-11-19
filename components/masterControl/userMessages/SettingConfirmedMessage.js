import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  justifyContentFlexEnd,
} from '../../styles/commonStyles';
import MessageButton from './MessageButton';
import { useMediaQuery } from 'react-responsive';

const SettingConfirmedMessage = ({
  onClose,
  title,
  subtitle,
  messageTheme,
  message,
  alert,
  src,
  isEdit,
}) => {
  // media query
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  return (
    <Wrapper>
      <MessageOuter alert={alert} isMobile={isMobile}>
        <MessageInner isMobile={isMobile}>
          <HeaderWrapper alert={alert}>
            <HeaderTitle alert={alert}>{title}</HeaderTitle>
            <Logo src='/images/messagebox-logo.svg' />
          </HeaderWrapper>
          <SubtitleWrapper>
            <Subtitle>{subtitle}</Subtitle>
          </SubtitleWrapper>
          {alert ? (
            <MessageWrapper>
              <Message alert={alert}>{message}</Message>
              <AlertLogo src={src} />
            </MessageWrapper>
          ) : (
            <MessageWrapper isEdit={isEdit}>
              <Message isTheme={true}>{messageTheme}</Message>
              <Message>{message}</Message>
            </MessageWrapper>
          )}

          <ButtonWrapper>
            <MessageButton name='ok' buttonHandler={onClose} />
          </ButtonWrapper>
        </MessageInner>
      </MessageOuter>
    </Wrapper>
  );
};

export default SettingConfirmedMessage;

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;

  position: fixed;
  top: 0px;
  left: 0px;

  background-color: rgba(0, 0, 0, 0.2);
  z-index: 100;
  ${flexBoxCenter};
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
  height: 190px;

  background: transparent linear-gradient(180deg, #77777742 0%, #c2c2c224 100%)
    0% 0% no-repeat padding-box;
  box-shadow: inset 0px 1px 1px #ffffff24, 0px 0px 6px #000000;
  border: 0.5px solid #000000;

  border-radius: 14px;
  ${flexBoxCenter};
  z-index: 100;
`;
const MessageInner = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 312px;
        `
      : css`
          width: 384px;
        `}

  height: 172px;
  background: #1b2b44 0% 0% no-repeat padding-box;
  box-shadow: inset 0px 0px 3px #000000;
  border: 0.5px solid #000000;
  border-radius: 9px;

  padding: var(--space2);

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;
const HeaderWrapper = styled.div`
  width: 98%;
  border-bottom: 1px solid #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 15%;

  ${(p) =>
    p.alert &&
    css`
      border-bottom: 1px solid #ff0000;
    `}
`;
const HeaderTitle = styled.span`
  font-size: 14px;
  ${(p) =>
    p.alert &&
    css`
      color: #ff0000;
    `}
`;

const Logo = styled.img``;

const SubtitleWrapper = styled.div`
  width: 98%;
  ${justifyContentFlexEnd}
`;

const Subtitle = styled.span`
  font-size: 14px;
  color: #95ff45;
`;

const MessageWrapper = styled.div`
  width: 100%;
  height: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${(p) =>
    p.isEdit &&
    css`
      & :first-child {
        color: #95ff45;
        margin-bottom: 8px;
      }
    `}
`;

const AlertLogo = styled.img``;

const Message = styled.p`
  font-size: 12px;
  text-align: center;
  ${(p) =>
    p.alert
      ? css`
          width: 50%;
          color: #ff0000;
          text-align: left;
        `
      : p.isTheme &&
        css`
          color: #95ff45;
          margin-bottom: 8px;
        `}
`;

const ButtonWrapper = styled.div`
  width: 98%;
  margin-bottom: 4px;

  display: flex;
  justify-content: flex-end;
`;

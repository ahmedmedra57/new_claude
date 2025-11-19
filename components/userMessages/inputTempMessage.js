import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentFlexEnd,
  layerB,
  messageBoxBackground,
} from '../styles/commonStyles';

import MessageBoxButton from './MessageBoxButton';

const InputTempMessage = ({ onClose, title, subtitle, messages, isMobile }) => {
  return (
    <Wrapper isMobile={isMobile}>
      <MessageInner isMobile={isMobile}>
        <HeaderWrapper>
          <TitleWrapper>
            <Title>{title}</Title>
            <Logo src='/images/messageBox-logo.svg' />
          </TitleWrapper>
          <SubTitleWrapper>
            <SubTitle>{subtitle}</SubTitle>
          </SubTitleWrapper>
        </HeaderWrapper>
        <MessageWrapper>
          {messages.map((message, index) => (
            <Message key={index} idx={index}>
              {message}
            </Message>
          ))}
        </MessageWrapper>
        <ButtonWrapper>
          <MessageBoxButton name='ok' buttonHandler={onClose} />
        </ButtonWrapper>
      </MessageInner>
    </Wrapper>
  );
};

export default InputTempMessage;

const Wrapper = styled.div`
  min-width: 402px;
  min-height: 190px;
  border-radius: 14px;
  ${messageBoxBackground}
  ${flexBoxCenter};
  padding: 10px;

  ${({ isMobile }) =>
    isMobile &&
    css`
      min-width: 376px;
    `}
`;
const MessageInner = styled.div`
  min-width: 384px;
  min-height: 172px;
  border-radius: 9px;

  ${layerB}
  ${flexDirectionColumn}
  padding: 10px;

  ${({ isMobile }) =>
    isMobile &&
    css`
      min-width: 356px;
    `}
`;

const HeaderWrapper = styled.div`
  width: 100%;
  height: 15%;
  margin-bottom: 12px;
`;

const TitleWrapper = styled.div`
  width: 100%;
  height: 10%;

  border-bottom: 1px solid #fff;
  display: flex;
  justify-content: space-between;
`;
const Title = styled.span`
  font-size: 14px;
`;

const Logo = styled.img`
  height: 80%;
`;

const SubTitleWrapper = styled.div`
  width: 100%;
  ${justifyContentFlexEnd};
`;

const SubTitle = styled.span`
  width: fit-content;
  margin-top: 2px;
  font-size: 12px;
`;

const MessageWrapper = styled.div`
  width: 100%;
  height: 60%;
  margin-bottom: 12px;
  ${flexBoxCenter};
  flex-direction: column;
`;
const Message = styled.p`
  font-size: 12px;
  text-align: center;

  ${({ idx }) =>
    idx === 0 &&
    css`
      margin-bottom: 10px;
    `}
`;

const ButtonWrapper = styled.div`
  height: 20%;
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

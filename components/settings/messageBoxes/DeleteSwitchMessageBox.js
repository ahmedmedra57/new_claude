import styled from 'styled-components';

import MessageBoxButton from './MessageBoxButton';
import {
  flexBoxCenter,
  justifyContentFlexEnd,
} from '../../styles/commonStyles';

const DeleteSwitchMessageBox = ({
  onClose,
  onDelete,
  title,
  subtitle,
  theme,
  messages,
}) => {
  const imgSrc = '/images/messageBox-logo.svg';

  return (
    <Wrapper>
      <MessageInner>
        <HeaderWrapper>
          <HeaderTitle>{title}</HeaderTitle>
          <Logo src={imgSrc} />
        </HeaderWrapper>
        <SubtitleWrapper>
          <Subtitle>{subtitle}</Subtitle>
        </SubtitleWrapper>

        <MessageWrapper>
          <MessageTitle>{theme}</MessageTitle>
          {messages?.map((message, index) => (
            <Message key={index}>{message}</Message>
          ))}
        </MessageWrapper>
        <ButtonWrapper>
          <MessageBoxButton name='cancel' buttonHandler={onClose} />
          <MessageBoxButton name='confirm' buttonHandler={onDelete} />
        </ButtonWrapper>
      </MessageInner>
    </Wrapper>
  );
};

export default DeleteSwitchMessageBox;

const Wrapper = styled.div`
  width: 402px;
  height: 158px;
  border-radius: 14px;
  ${flexBoxCenter};

  background: transparent linear-gradient(180deg, #77777742 0%, #c2c2c224 100%);
  box-shadow: inset 0px 1px 1px #ffffff24, 0px 0px 6px #000000;
  border: 0.5px solid #000000;
`;
const MessageInner = styled.div`
  width: 384px;
  height: 140px;
  border-radius: 9px;

  padding: 10px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  background: #1b2b44;
  box-shadow: inset 0px 0px 3px #000000;
  border: 0.5px solid #000000;
`;
const HeaderWrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid #fff;
  display: flex;
  justify-content: space-between;
  height: 15%;

  padding-left: 5px;
`;
const HeaderTitle = styled.span`
  font-size: 14px;
`;

const Logo = styled.img`
  height: 80%;
`;

const SubtitleWrapper = styled.div`
  width: 98%;
  ${justifyContentFlexEnd}
`;

const Subtitle = styled.span`
  font-size: 14px;
  color: #95ff45;
`;

const MessageTitle = styled.p`
  font-size: 12px;
  margin-top: 6px;
  text-align: center;
  color: #95ff45;
  margin-bottom: 8px;
`;

const MessageWrapper = styled.div`
  width: 100%;
  height: 60%;
  ${flexBoxCenter};
  flex-direction: column;
`;
const Message = styled.p`
  font-size: 12px;
  text-align: center;
`;

const ButtonWrapper = styled.div`
  height: 20%;
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

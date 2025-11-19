import styled from 'styled-components';
import {
  flexBoxCenter,
  flexDirectionColumn,
  layerB,
} from '../styles/commonStyles';

import MessageBoxButton from './MessageBoxButton';

const SystemOffMessageBox = ({ onClose, title, message, alert }) => {
  const imgSrc = '/images/heater-off-alert.svg';

  return (
    <Wrapper>
      <MessageInner>
        <SectionHeader>
          <HeaderTitle>{title}</HeaderTitle>
          <Logo src={'/images/messageBox-logo.svg'} />
        </SectionHeader>

        <SectionMessage>
          <MessageWrapper>
            <Message>{message}</Message>
          </MessageWrapper>
          <SectionLogo></SectionLogo>
        </SectionMessage>

        <ButtonWrapper>
          <MessageBoxButton name='ok' buttonHandler={onClose} />
        </ButtonWrapper>
      </MessageInner>
    </Wrapper>
  );
};

export default SystemOffMessageBox;

const Wrapper = styled.div`
  width: 402px;
  height: 190px;
  border-radius: 14px;

  ${flexBoxCenter};
  background: transparent linear-gradient(180deg, #ff0000 0%, #950000 100%);
  box-shadow: inset 0px 1px 1px #ffffff24, 0px 0px 6px #000000;
  border: 0.5px solid #000000;
`;
const MessageInner = styled.div`
  width: 384px;
  height: 172px;
  border-radius: 9px;

  ${flexDirectionColumn}
  padding: 10px;

  ${layerB}
  border: 0.5px solid #000000;
`;

const SectionHeader = styled.section`
  width: 100%;
  height: 15%;
  border-bottom: 1px solid #ff0000;

  display: flex;
  justify-content: space-between;

  padding-left: 5px;
`;

const HeaderTitle = styled.span`
  font-size: 14px;
  color: #ff0000;
`;

const Logo = styled.img`
  height: 80%;
`;

const SectionMessage = styled.section``;
const SectionLogo = styled.section``;

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

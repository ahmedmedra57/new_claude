import styled from 'styled-components';
import { flexBoxCenter } from '../../styles/commonStyles';
import MessageButton from './MessageButton';

const SettingClearOkMessage = ({ onClose, title, message, onClear }) => {
  return (
    <>
      <Wrapper>
        <MessageOuter>
          <MessageInner>
            <HeaderWrapper>
              <HeaderTitle>{title}</HeaderTitle>
              <Logo src='/images/messagebox-logo.svg' />
            </HeaderWrapper>

            <MessageWrapper>
              <Message>{message}</Message>
            </MessageWrapper>
            <ButtonWrapper>
              <MessageButton name='clear' buttonHandler={onClear} />
              <MessageButton name='ok' buttonHandler={onClose} />
            </ButtonWrapper>
          </MessageInner>
        </MessageOuter>
      </Wrapper>
    </>
  );
};

export default SettingClearOkMessage;

const Wrapper = styled.div`
  width: 1024px;
  height: 600px;

  position: fixed;
  top: 0px;
  left: 0px;

  background-color: rgba(0, 0, 0, 0.2);
  z-index: 10000;
  ${flexBoxCenter};
`;

const MessageOuter = styled.div`
  width: 402px;
  height: 190px;
  background: transparent linear-gradient(180deg, #77777742 0%, #c2c2c224 100%)
    0% 0% no-repeat padding-box;
  box-shadow: inset 0px 1px 1px #ffffff24, 0px 0px 6px #000000;
  border: 0.5px solid #000000;
  opacity: 1;
  border-radius: 14px;
  ${flexBoxCenter};
`;
const MessageInner = styled.div`
  width: 384px;
  height: 172px;
  background: #1b2b44 0% 0% no-repeat padding-box;
  box-shadow: inset 0px 0px 3px #000000;
  border: 0.5px solid #000000;
  border-radius: 9px;
  opacity: 1;

  padding: var(--space2);

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;
const HeaderWrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid #fff;
  display: flex;
  justify-content: space-between;
  height: 15%;
`;
const HeaderTitle = styled.span``;

const Logo = styled.img``;

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

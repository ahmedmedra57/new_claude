import styled, { css } from 'styled-components';
import { flexBoxCenter } from '../../styles/commonStyles';

import MessageButton from './MessageButton';

const SettingEditButtonMessage = ({ onClose, title, message }) => {
  return (
    <Wrapper>
      <MessageOuter>
        <MessageInner>
          <HeaderWrapper>
            <HeaderTitle>{title}</HeaderTitle>
            <Logo src='/images/messagebox-logo.svg' />
          </HeaderWrapper>

          <MessageWrapper>
            <MessageTitle>{message?.title}</MessageTitle>
            <MessageDescription>{message?.content}</MessageDescription>
          </MessageWrapper>

          <ButtonWrapper>
            <MessageButton name='ok' buttonHandler={onClose} />
          </ButtonWrapper>
        </MessageInner>
      </MessageOuter>
    </Wrapper>
  );
};

export default SettingEditButtonMessage;

const Wrapper = styled.div`
  width: 1222rem;
  height: 638rem;
  /* 
  position: fixed;
  top: 0rem;
  left: 0rem; */

  background-color: rgba(0, 0, 0, 0.2);
  z-index: 10000;
  ${flexBoxCenter};
`;

const MessageOuter = styled.div`
  width: 402rem;
  height: auto;
  padding-top: 11rem;
  padding-bottom: 11rem;
  background: transparent linear-gradient(180deg, #77777742 0%, #c2c2c224 100%)
    0% 0% no-repeat padding-box;
  box-shadow: inset 0rem 1rem 1rem #ffffff24, 0rem 0rem 6rem #000000;
  border: 0.5rem solid #000000;

  border-radius: 14rem;
  ${flexBoxCenter}
`;
const MessageInner = styled.div`
  width: 384rem;
  height: auto;

  /* padding-top: 11rem;
  padding-bottom: 11rem; */
  background: #1b2b44 0% 0% no-repeat padding-box;
  box-shadow: inset 0rem 0rem 3rem #000000;
  border: 0.5rem solid #000000;
  border-radius: 9rem;

  padding: var(--space2);

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;
const HeaderWrapper = styled.div`
  width: 100%;
  margin-top: -4rem;
  border-bottom: 1rem solid #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 15%;
`;
const HeaderTitle = styled.span`
  font-size: 12rem;
`;

const Logo = styled.img``;

const MessageWrapper = styled.div`
  width: 100%;
  height: auto;
  margin-top: 14rem;
  margin-bottom: 20rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const AlertLogo = styled.img``;

const MessageTitle = styled.p`
  font-size: 12rem;
  margin-top: 6rem;
  text-align: center;
  color: #95ff45;
`;

const MessageDescription = styled.p`
  font-size: 12rem;
  text-align: center;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

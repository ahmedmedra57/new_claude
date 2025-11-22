import React from 'react';
import styled from 'styled-components';
import {
  flexBoxCenter,
  flexDirectionColumn,
  layerB,
  messageBoxBackground,
} from '../../styles/commonStyles';
import MessageButton from './MessageButton';

const SelectCreateNewCommandMessage = ({ title, message, onClose }) => {
  return (
    <Wrapper>
      <MessageOuter>
        <MessageInner>
          <HeaderWrapper>
            <HeaderTitle>{title}</HeaderTitle>
            <Logo src='/images/messagebox-logo.svg' />
          </HeaderWrapper>

          <MessageWrapper>
            <MessageDescription>{message}</MessageDescription>
          </MessageWrapper>

          <ButtonWrapper>
            <MessageButton name='ok' buttonHandler={onClose} />
          </ButtonWrapper>
        </MessageInner>
      </MessageOuter>
    </Wrapper>
  );
};

export default SelectCreateNewCommandMessage;

const Wrapper = styled.div`
  width: 1222rem;
  height: 638rem;

  background-color: rgba(0, 0, 0, 0.2);
  z-index: 10000;
  ${flexBoxCenter};
  position: absolute;
`;

const MessageOuter = styled.div`
  width: 396rem;
  height: auto;
  border-radius: 14rem;
  padding: 8rem;
  ${messageBoxBackground}
  ${flexBoxCenter}
`;
const MessageInner = styled.div`
  width: 378rem;
  height: auto;
  border-radius: 9rem;
  ${layerB}
  padding: var(--space2);
  ${flexDirectionColumn}
`;
const HeaderWrapper = styled.div`
  width: 97%;
  margin-top: 4rem;

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

const MessageDescription = styled.p`
  font-size: 12rem;
  text-align: center;
`;

const ButtonWrapper = styled.div`
  width: 97%;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 4rem;
`;

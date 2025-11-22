import React from 'react';
import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentFlexEnd,
  layerB,
  messageBoxBackground,
} from '../../styles/commonStyles';
import MessageButton from './MessageButton';

const SelectSystemMessage = ({ title, subtitle, messages, onClose }) => {
  return (
    <Wrapper>
      <MessageOuter>
        <MessageInner>
          <HeaderWrapper>
            <HeaderTitle>{title}</HeaderTitle>
            <Logo src='/images/messagebox-logo.svg' />
          </HeaderWrapper>
          <SubTitleWrapper>
            <SubTitle>{subtitle}</SubTitle>
          </SubTitleWrapper>

          {messages?.map((message, idx) => {
            return (
              <MessageWrapper key={message} line={idx}>
                <MessageDescription line={idx}>{message}</MessageDescription>
              </MessageWrapper>
            );
          })}

          <ButtonWrapper>
            <MessageButton name='ok' buttonHandler={onClose} />
          </ButtonWrapper>
        </MessageInner>
      </MessageOuter>
    </Wrapper>
  );
};

export default SelectSystemMessage;

const Wrapper = styled.div`
  width: 1222px;
  height: 638px;

  background-color: rgba(0, 0, 0, 0.2);
  z-index: 10000;
  ${flexBoxCenter};
  position: absolute;
`;

const MessageOuter = styled.div`
  width: 396px;
  height: auto;
  border-radius: 14px;
  padding: 8px;
  ${messageBoxBackground}
  ${flexBoxCenter}
`;
const MessageInner = styled.div`
  width: 378px;
  height: auto;
  border-radius: 9px;
  ${layerB}
  padding: var(--space2);
  ${flexDirectionColumn}
`;
const HeaderWrapper = styled.div`
  width: 97%;
  margin-top: 4px;

  border-bottom: 1px solid #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 15%;
`;
const HeaderTitle = styled.span`
  font-size: 12px;
`;

const Logo = styled.img``;

const SubTitleWrapper = styled.div`
  width: 97%;
  ${justifyContentFlexEnd};
`;

const SubTitle = styled.span`
  width: fit-content;
  margin-top: 2px;
  font-size: 12px;
`;

const MessageWrapper = styled.div`
  width: 100%;
  height: auto;

  /* margin-bottom: 20px; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${({ line }) =>
    line === 0
      ? css`
          margin-top: 12px;
        `
      : line === 1
      ? css`
          margin-top: 6px;
        `
      : line === 2 || line === 3
      ? css``
      : css`
          margin-bottom: 12px;
        `}
`;

const MessageDescription = styled.p`
  font-size: 12px;
  text-align: center;

  ${({ line }) =>
    line === 0
      ? css`
          color: #fff;
        `
      : line === 1
      ? css`
          color: #83ffff;
        `
      : line === 2
      ? css`
          color: #ff920c;
        `
      : line === 3
      ? css`
          color: #95ff45;
        `
      : css`
          color: #b78eff;
        `}
`;

const ButtonWrapper = styled.div`
  width: 97%;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 4px;
`;

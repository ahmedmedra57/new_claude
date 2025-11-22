import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  justifyContentFlexEnd,
} from '../../styles/commonStyles';

import MessageButton from './MessageButton';
import { useMediaQuery } from 'react-responsive';

const SettingAppliedMessage = ({ onClose, message }) => {
  // media query
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  return (
    <Wrapper>
      <MessageOuter isMobile={isMobile}>
        <MessageInner isMobile={isMobile}>
          <HeaderWrapper>
            <HeaderTitle>{message.title}</HeaderTitle>
            <Logo src='/images/messagebox-logo.svg' />
          </HeaderWrapper>
          <SubtitleWrapper>
            <Subtitle>{message.subtitle}</Subtitle>
          </SubtitleWrapper>

          {/* <MessageWrapper>
            {message.title?.map((value, index) => {
              return (
                <div key={index}>
                  <MessageTitle>{value}</MessageTitle>
                  <MessageDescription>{message.message}</MessageDescription>
                </div>
              );
            })}
          </MessageWrapper> */}
          <MessageWrapper>
            <MessageTitle>{message.theme}</MessageTitle>
            <MessageDescription>{message.message}</MessageDescription>
          </MessageWrapper>

          <ButtonWrapper>
            <MessageButton name='ok' buttonHandler={onClose} />
          </ButtonWrapper>
        </MessageInner>
      </MessageOuter>
    </Wrapper>
  );
};

export default SettingAppliedMessage;

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;

  position: fixed;
  top: 0px;
  left: 0px;

  background-color: rgba(0, 0, 0, 0.2);
  z-index: 10000;
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

  height: auto;
  padding-top: 11px;
  padding-bottom: 11px;
  background: transparent linear-gradient(180deg, #77777742 0%, #c2c2c224 100%)
    0% 0% no-repeat padding-box;
  box-shadow: inset 0px 1px 1px #ffffff24, 0px 0px 6px #000000;
  border: 0.5px solid #000000;

  border-radius: 14px;
  ${flexBoxCenter}
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

  height: auto;

  /* padding-top: 11px;
  padding-bottom: 11px; */
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
  width: 97%;
  margin-top: 4px;
  border-bottom: 1px solid #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 15%;
`;
const HeaderTitle = styled.span`
  font-size: 14px;
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
  height: auto;
  margin-top: 14px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const MessageTitle = styled.p`
  font-size: 12px;
  margin-top: 6px;
  margin-bottom: 8px;
  text-align: center;
  color: #95ff45;
`;

const MessageDescription = styled.p`
  font-size: 12px;
  text-align: center;
`;

const ButtonWrapper = styled.div`
  width: 98%;
  margin-bottom: 4px;
  display: flex;
  justify-content: flex-end;
`;

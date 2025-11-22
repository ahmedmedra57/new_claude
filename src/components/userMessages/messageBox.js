import styled from 'styled-components';
import { flexBoxCenter, justifyContentFlexEnd } from '../styles/commonStyles';
import { useState } from 'react';
import MessageBoxButton from './MessageBoxButton';

const MessageBox = ({ onClose, title, messages, subtitle }) => {
  const imgSrc = '/images/messageBox-logo.svg';
  const [loaded,setLoaded] = useState(false);

  return (
    <Wrapper>
      <MessageInner>
        <HeaderWrapper>
          <HeaderTitle>{title}</HeaderTitle>
          <LogoWrapper>
            {!loaded && <Skeleton />}
          <Logo
           src={imgSrc}
           alt="logo"
           onLoad={()=> setLoaded=(true)}
           onError={()=> setLoaded=(true) }
           loaded={loaded}
           />
          </LogoWrapper>
        </HeaderWrapper>
        {subtitle && (
          <SubtitleWrapper>
            <Subtitle>{subtitle}</Subtitle>
          </SubtitleWrapper>
        )}
        <MessageWrapper>
          {messages?.map((message, index) => (
            <Message key={index}>{message}</Message>
          ))}
        </MessageWrapper>
        <ButtonWrapper>
          <MessageBoxButton name='ok' buttonHandler={onClose} />
        </ButtonWrapper>
      </MessageInner>
    </Wrapper>
  );
};

export default MessageBox;

const Wrapper = styled.div`
  width: 402px;
  height: 158px;
  border-radius: 14px;
  ${flexBoxCenter};

  background: transparent linear-gradient(180deg, #77777742 0%, #c2c2c224 100%);
  box-shadow: inset 0px 1px 1px #2b242424, 0px 0px 6px #000000;
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

  /* padding-left: 5px; */
`;
const HeaderTitle = styled.span`
  font-size: 14px;
`;

const LogoWrapper = styled.div`
  position: relative;
  width: 50px;
  height: 50px;
`;

const Logo = styled.img`
  height: 100%;
  width: 100%;
  object-fit: contain;
  display: ${({ loaded }) => (loaded ? 'block' : 'none')};
`;

const Skeleton = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    #2c3e50 25%,
    #34495e 37%,
    #2c3e50 63%
  );
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;

  @keyframes shimmer {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: 200px 0;
    }
  }
`;


const SubtitleWrapper = styled.div`
  width: 100%;
  ${justifyContentFlexEnd}
`;

const Subtitle = styled.span`
  font-size: 12px;
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

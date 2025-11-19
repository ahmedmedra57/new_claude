import styled, { css } from 'styled-components';
import MessageButton from '../../masterControl/userMessages/MessageButton';
import {
  flexBoxCenter,
  justifyContentSpaceBetween,
  layerB,
} from '../../styles/commonStyles';
import { useMediaQuery } from 'react-responsive';

const SettingClearOkMessage = ({ onClose, title, message, onClear }) => {
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  return (
    <>
      <Wrapper>
        <MessageOuter isMobile={isMobile}>
          <MessageInner isMobile={isMobile}>
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
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 312px;
        `
      : css`
          width: 384px;
        `}

  height: 172px;

  ${layerB}

  border: 0.5px solid #000000;
  border-radius: 9px;
  opacity: 1;

  flex-direction: column;
  ${justifyContentSpaceBetween}
`;
const HeaderWrapper = styled.div`
  width: 97%;
  margin-top: 3px;
  border-bottom: 1px solid #fff;
  display: flex;
  justify-content: space-between;
`;

const HeaderTitle = styled.span`
  font-size: 14px;
`;

const Logo = styled.img`
  width: 15px;
  height: 15px;
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
  width: 98%;
  margin-bottom: 4px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

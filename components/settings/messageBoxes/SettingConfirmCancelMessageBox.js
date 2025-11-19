import styled, { css } from 'styled-components';
import MessageButton from '../../masterControl/userMessages/MessageButton';
import {
  flexBoxCenter,
  justifyContentFlexEnd,
  justifyContentSpaceBetween,
  layerB,
} from '../../styles/commonStyles';
import { useMediaQuery } from 'react-responsive';

const SettingConfirmCancelMessageBox = ({
  onCancel,
  // title,
  message,
  onConfirm,
}) => {
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  return (
    <>
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

            <MessageWrapper>
              <MessageTitle>{message.theme}</MessageTitle>
              {message.message &&
                message.message.map((el, idx) => {
                  return <Message key={idx}>{el}</Message>;
                })}
              <Message>please confirm</Message>
            </MessageWrapper>
            <ButtonWrapper>
              <MessageButton name='cancel' buttonHandler={onCancel} />
              <MessageButton name='confirm' buttonHandler={onConfirm} />
            </ButtonWrapper>
          </MessageInner>
        </MessageOuter>
      </Wrapper>
    </>
  );
};

export default SettingConfirmCancelMessageBox;

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
          min-width: 402px;
        `}

  min-height: 190px;
  padding: 10px;
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
          min-width: 384px;
        `}

  min-height: 172px;

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

const SubtitleWrapper = styled.div`
  width: 98%;
  ${justifyContentFlexEnd}
`;

const Subtitle = styled.span`
  font-size: 14px;
  color: #95ff45;
`;

const MessageWrapper = styled.div`
  width: 99%;
  height: 60%;
  ${flexBoxCenter};
  flex-direction: column;
`;

const MessageTitle = styled.p`
  font-size: 12px;
  margin-top: 6px;
  margin-bottom: 8px;
  text-align: center;
  color: #95ff45;
`;

const Message = styled.p`
  font-size: 12px;
  text-align: center;
  &:last-child {
    margin-top: 8px;
  }
`;

const ButtonWrapper = styled.div`
  width: 98%;
  margin-bottom: 4px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

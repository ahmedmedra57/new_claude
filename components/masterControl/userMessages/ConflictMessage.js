import styled, { css } from 'styled-components';
import { flexBoxCenter } from '../../styles/commonStyles';
import MessageButton from './MessageButton';

const ConflictMessage = ({
  handleCancel,
  handleConfirm,
  headerTitle,
  currentSwitch,
  DesiredSwitch,
}) => {
  const currSwitch =
    currentSwitch === 'tes-typhoon electric system' ? 'tes' : 'tgs';
  return (
    <Wrapper>
      <MessageOuter>
        <MessageInner>
          <HeaderWrapper>
            <HeaderTitle>{headerTitle}</HeaderTitle>
            <Logo src='/images/messagebox-logo.svg' />
          </HeaderWrapper>

          <MessageWrapper>
            <InnerWrapper>
              <Title id={1}>{currentSwitch}</Title>
              <Message>
                is currently <u>in operation</u>
              </Message>
            </InnerWrapper>
            <InnerWrapper>
              <Title id={2}>tgs & tes systems</Title>
              <Message>
                do not operate <u>simultaneously</u>
              </Message>
            </InnerWrapper>
            <InnerWrapper>
              <Message>
                you are about to <u>turn off</u> <br></br>
                <Strong>{currSwitch}</Strong> and switchover to
              </Message>
              <Title id={3}>{DesiredSwitch}</Title>
            </InnerWrapper>
          </MessageWrapper>
          <ButtonWrapper>
            <MessageButton name='cancel' buttonHandler={handleCancel} />
            <MessageButton name='confirm' buttonHandler={handleConfirm} />
          </ButtonWrapper>
        </MessageInner>
      </MessageOuter>
    </Wrapper>
  );
};

export default ConflictMessage;

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
  height: 293px;
  background: transparent linear-gradient(180deg, #77777742 0%, #c2c2c224 100%)
    0% 0% no-repeat padding-box;
  box-shadow: inset 0px 1px 1px #ffffff24, 0px 0px 6px #000000;
  border: 0.5px solid #000000;

  border-radius: 14px;
  ${flexBoxCenter}
`;
const MessageInner = styled.div`
  width: 384px;
  height: 275px;
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
  width: 100%;
  border-bottom: 1px solid #fff;
  display: flex;
  justify-content: space-between;
  height: 8%;
`;
const HeaderTitle = styled.span``;

const Logo = styled.img`
  width: 18px;
  height: 18px;
`;

const MessageWrapper = styled.div`
  width: 358px;
  height: 181px;
  ${flexBoxCenter}
  flex-direction: column;
  justify-content: space-evenly;
`;

const InnerWrapper = styled.div`
  ${flexBoxCenter}
  flex-direction: column;
`;

const Title = styled.div`
  font-size: 16px;

  ${(p) =>
    p.id === 1 &&
    css`
      color: #ff7800;
    `}
  ${(p) =>
    p.id === 2 &&
    css`
      color: #ff0000;
    `}
    ${(p) =>
    p.id === 3 &&
    css`
      color: #95ff45;
    `}
`;

const Strong = styled.span`
  font-size: 16px;
`;
const Message = styled.p`
  font-size: 12px;
  text-align: center;
`;

const ButtonWrapper = styled.div`
  height: 15%;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

import styled from 'styled-components';
import {
  flexBoxCenter,
  justifyContentFlexEnd,
  justifyContentSpaceBetween,
  layerB,
} from '../../styles/commonStyles';
import OkButton from '../buttons/OkButton';

const ErrorMessageBox = ({ message, handleClose }) => {
  return (
    <Wrapper>
      <MessageOuter>
        <MessageInner>
          <HeaderWrapper>
            <HeaderTitle>{message?.title}</HeaderTitle>
            <Logo src='/images/messagebox-logo.svg' />
          </HeaderWrapper>
          <SubtitleWrapper>
            <Subtitle>{message.subtitle}</Subtitle>
          </SubtitleWrapper>

          <MessageWrapper>
            <MessageTitle>{message?.theme}</MessageTitle>
            <MessageDescription>{message?.content}</MessageDescription>
          </MessageWrapper>

          <ButtonWrapper>
            <OkButton name='ok' handleClose={handleClose} />
          </ButtonWrapper>
        </MessageInner>
      </MessageOuter>
    </Wrapper>
  );
};

export default ErrorMessageBox;

const Wrapper = styled.div`
  width: 1222px;
  height: 638px;

  ${flexBoxCenter};
`;

const MessageOuter = styled.div`
  width: 402px;
  height: auto;
  padding-top: 8px;
  padding-bottom: 8px;

  background: transparent linear-gradient(180deg, #77777742 0%, #c2c2c224 100%)
    0% 0% no-repeat padding-box;
  box-shadow: inset 0px 1px 1px #ffffff24, 0px 0px 6px #000000;
  border: 0.5px solid #000000;

  border-radius: 14px;
  ${flexBoxCenter}
`;
const MessageInner = styled.div`
  width: 384px;
  height: auto;

  ${layerB}

  border: 0.5px solid #000000;
  border-radius: 9px;

  flex-direction: column;
  ${justifyContentSpaceBetween}
`;
const HeaderWrapper = styled.div`
  width: 98%;
  margin-top: 1px;
  border-bottom: 1px solid #fff;
  ${justifyContentSpaceBetween}
  height: 15%;
`;
const HeaderTitle = styled.span`
  margin-top: 4px;
  margin-left: 4px;
  font-size: 14px;
`;

const Logo = styled.img`
  margin-top: 4px;
  margin-right: 4px;
  margin-bottom: 1px;
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
  width: 100%;
  height: auto;
  margin-top: 14px;
  margin-bottom: 20px;
  flex-direction: column;
  ${flexBoxCenter}
`;

const MessageTitle = styled.p`
  font-size: 12px;
  margin-top: 6px;
  text-align: center;
  color: #95ff45;
  margin-bottom: 8px;
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

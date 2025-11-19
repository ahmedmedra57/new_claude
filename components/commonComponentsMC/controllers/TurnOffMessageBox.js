import styled, { css } from 'styled-components';
import {
  alignItemsFlexStart,
  flexBoxCenter,
  justifyContentSpaceBetween,
  layerB,
} from '../../styles/commonStyles';

const TurnOffMessageBox = ({
  locationName,
  specificLocation,
  switchName,
  message,
  isSwitchDisabled,
}) => {
  const imgSrc = isSwitchDisabled
    ? '/images/turnoff-messagebox-logo.svg'
    : '/images/messageBox-logo.svg';

  return (
    <Wrapper>
      <MessageOuter>
        <MessageInner>
          <HeaderWrapper isSwitchDisabled={isSwitchDisabled}>
            <HeaderTitle isSwitchDisabled={isSwitchDisabled}>
              {locationName}
            </HeaderTitle>
            {/* <HeaderTitle isSwitchDisabled={isSwitchDisabled}>
              {specificLocation}
            </HeaderTitle> */}
            <SmallHeaderWrapper>
              <HeaderTitle isSwitchDisabled={isSwitchDisabled}>
                {switchName}
              </HeaderTitle>
              <Logo src={imgSrc} />
            </SmallHeaderWrapper>
          </HeaderWrapper>

          <MessageWrapper>
            <MessageDescription isSwitchDisabled={isSwitchDisabled}>
              {message}
            </MessageDescription>
          </MessageWrapper>
        </MessageInner>
      </MessageOuter>
    </Wrapper>
  );
};

export default TurnOffMessageBox;

const Wrapper = styled.div`
  width: auto;
  height: auto;

  ${flexBoxCenter};
`;

const MessageOuter = styled.div`
  width: 396px;
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
  width: 378px;
  height: auto;

  ${layerB}

  border: 0.5px solid #000000;
  border-radius: 9px;

  flex-direction: column;
  ${justifyContentSpaceBetween}
`;
const HeaderWrapper = styled.div`
  width: 98%;
  height: 15%;
  margin-top: 1px;

  border-bottom: 1px solid #ffff;

  ${alignItemsFlexStart}
  flex-direction: column;

  ${({ isSwitchDisabled }) =>
    isSwitchDisabled &&
    css`
      border-bottom: 1px solid #ff920c;
    `}
`;

const SmallHeaderWrapper = styled.div`
  width: 100%;
  height: 15%;
  margin-top: 1px;

  ${justifyContentSpaceBetween}
  align-items: flex-start;
`;
const HeaderTitle = styled.span`
  font-size: 12px;
  color: #ffff;
  ${({ isSwitchDisabled }) =>
    isSwitchDisabled &&
    css`
      color: #ff920c;
    `}
`;

const Logo = styled.img`
  ${({ isSwitchDisabled }) =>
    isSwitchDisabled &&
    css`
      color: #ff920c;
    `}
`;

const MessageWrapper = styled.div`
  width: 82%;
  height: auto;
  margin-top: 14px;
  margin-bottom: 20px;
  flex-direction: column;
  ${flexBoxCenter}
`;

const MessageDescription = styled.p`
  margin-top: 6px;
  font-size: 12px;
  text-align: center;
  color: #ffff;

  ${({ isSwitchDisabled }) =>
    isSwitchDisabled &&
    css`
      color: #ff920c;
    `}
`;

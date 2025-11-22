import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useTranslation } from 'react-i18next';

import styled, { css } from 'styled-components';

import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentFlexEnd,
  justifyContentFlexStart,
  justifyContentSpaceAround,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerADark,
  layerBDark,
} from '../styles/commonStyles';
import SettingConfirmedMessage from '../masterControl/userMessages/SettingConfirmedMessage';
import {
  FaultAttendService,
  getFaultAttendService,
} from '../../services/faults.service';
import moment from 'moment';

const FaultAddAction = ({
  handleClose,
  faultType,
  handleAddActions,
  actionTaken,
  date,
  faultNumber,
  locationPre,
  location,
  specificLocation,
  machine,
  address,
  deviceType,
}) => {
  const { t } = useTranslation();
  // media query
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });
  const [inputUserName, setInputUserName] = useState(null);
  const [inputAction, setInputAction] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);
  const [activateMessageBox, setActivateMessageBox] = useState(false);
  const [prevAttends, setPrevAttends] = useState([]);
  const [message, setMessage] = useState(null);

  let fault_index =
    deviceType === 'tgs'
      ? 0
      : faultType?.includes('ssr') || faultType?.includes('thermocouple')
      ? faultNumber
      : 0;

  const handleCommentButtonClick = () => {
    if (inputUserName && inputAction) {
      const date = new Date();
      const now = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`;
      handleAddActions([inputUserName, inputAction, now]);
      const attendObject = {
        user_name: inputUserName,
        fault_type: faultTypeToSendFormat(faultType),
        action_taken: inputAction,
        fault_index: fault_index,
        device_id: machine,
        device_type: deviceType.toUpperCase(),
      };
      try {
        FaultAttendService(attendObject);
      } catch (error) {
        throw new Error('faild to add attend');
      }
      handleClose();
    } else {
      if (!inputUserName && !inputAction) {
        setMessage(
          t('faults.attend.fillAllInputs')
        );
      } else if (!inputUserName) {
        setMessage(t('faults.attend.fillUserName'));
      } else {
        setMessage(t('faults.attend.fillActionTaken'));
      }
      setActivateMessageBox(true);
    }
  };
  const faultTypeToSendFormat = (faultType) => {
    switch (faultType) {
      case 'timeout fault':
        return 'timeout_fault';
      case 'hp/lp fault':
        return 'hplp_fault';
      case 'thermocouple fault':
        return 'thermocouple_fault';
      case 'bms fault':
        return 'bms_fault';
      case 'ground fault':
        return 'ground_fault';
      case 'ssr fault':
        return 'ssr_fault';
      case 'ssr over current':
        return 'srr_over_current';
      default:
        return '';
    }
  };

  const getFaultAttends = async () => {
    if (faultType && machine) {
      await getFaultAttendService(
        faultTypeToSendFormat(faultType),
        fault_index,
        machine
      ).then((res) => {
        setPrevAttends(res.attends);
      });
    }
  };

  useEffect(() => {
    getFaultAttends();
  }, [faultType, fault_index, machine]);

  return (
    <>
      {isMobile ? (
        <Wrapper isMobile={isMobile}>
          <ContentsWrapper isMobile={isMobile}>
            <FlexEndWrapper>
              <Button onClick={() => handleClose()} isMobile={isMobile}>
                <ButtonInner isMobile={isMobile}>
                  <ButtonHole isMobile={isMobile}>
                    <ButtonTop isMobile={isMobile}>
                      <img
                        src={
                          './images/settings-admin-sysIdentification-whiteX.svg'
                        }
                      />
                    </ButtonTop>
                  </ButtonHole>
                </ButtonInner>
              </Button>
            </FlexEndWrapper>
            <FaultsWrapper isMobile={isMobile}>
              <FlexCenterWrapper>
                <Title>{t('faults.attend.title')}</Title>
              </FlexCenterWrapper>
              <FlexStartWrapper>
                <Title>{t('faults.attend.timeAndDate')}{date} </Title>
              </FlexStartWrapper>
              <FlexCenterWrapper>
                <ComponentTitle isMobile={isMobile}>
                  {faultType}
                  {faultNumber.length !== 0 &&
                    faultNumber.length !== 1 &&
                    `(${faultNumber})`}
                  -{locationPre}-{specificLocation ?? ''}-{location}-{machine}{' '}
                  {address}
                </ComponentTitle>
              </FlexCenterWrapper>
            </FaultsWrapper>
          </ContentsWrapper>
        </Wrapper>
      ) : (
        <Wrapper>
          <ContentsWrapper>
            <SectionHeader>
              <TitleWrapper isLogo={true}>
                <img src={'/images/logo-red.svg'} />
                <ComponentTitle>{t('faults.attend.title')}</ComponentTitle>
              </TitleWrapper>
              <InputBoxWrapper>
                <InputTitle>{t('faults.attend.userName')}</InputTitle>
                <InputUserName
                  type='text'
                  placeholder={t('faults.attend.inputNamePlaceholder')}
                  // onClick={() => {
                  //   setFocusedInput('name');
                  // }}
                  onChange={(event) => setInputUserName(event.target.value)}
                  value={inputUserName}
                />
              </InputBoxWrapper>
            </SectionHeader>

            <SectionFaultType>
              <TitleWrapper>
                <ComponentTitle>{t('faults.attend.fault')}</ComponentTitle>
              </TitleWrapper>

              <FaultsTypeWrapper>
                <ComponentTitle>{faultType}</ComponentTitle>
              </FaultsTypeWrapper>
            </SectionFaultType>

            <SectionDisplayActions type='actionTaken'>
              <TitleWrapper>
                <ComponentTitle>{t('faults.attend.previousComments')}</ComponentTitle>
              </TitleWrapper>

              <ActionTakenWrapper>
                {prevAttends.map((action, index) => (
                  <ComponentTitle key={index} action={true}>
                    - {action.user_name} / {action.action_taken} -{' '}
                    {moment(action?.timestamp).format('h:mma - DD/MM/YYYY')}
                  </ComponentTitle>
                ))}
              </ActionTakenWrapper>
            </SectionDisplayActions>

            <SectionAddAction>
              <TitleWrapper>
                <ComponentTitle>{t('faults.attend.addComment')}</ComponentTitle>
              </TitleWrapper>
              <CommentInput
                placeholder={t('faults.attend.actionPlaceholder')}
                onClick={() => {
                  if (inputUserName) {
                    setFocusedInput('action');
                  } else {
                    setMessage(t('faults.attend.inputUserNameFirst'));
                    setActivateMessageBox(true);
                  }
                }}
                onChange={(event) => setInputAction(event.target.value)}
                value={inputAction}
              />
            </SectionAddAction>

            <SectionButton>
              <Button onClick={handleCommentButtonClick}>
                <ButtonInner>
                  <ButtonHole>
                    <ButtonTop>{t('common.confirm')}</ButtonTop>
                  </ButtonHole>
                </ButtonInner>
              </Button>
            </SectionButton>
          </ContentsWrapper>
          {activateMessageBox && (
            <SettingConfirmedMessage
              title={t('faults.attend.messageTitle')}
              message={message}
              onClose={() => {
                setActivateMessageBox(false);
              }}
            />
          )}
        </Wrapper>
      )}
      ;
    </>
  );
};

export default FaultAddAction;

const Wrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 332px;
          height: 144px;
        `
      : css`
          width: 314px;
          height: 312px;
        `}

  border-radius: 14px;

  background: transparent linear-gradient(180deg, #77777742 0%, #c2c2c224 100%);
  box-shadow: inset 0px 1px 1px #ffffff29, 0px 0px 4px #000000;
  border: 0.5px solid #000000;

  ${flexBoxCenter}
`;

const ContentsWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 320px;
          height: 132px;

          border-radius: 10px;
          opacity: 1;
          ${justifyContentSpaceAround}
          flex-direction: column;
        `
      : css`
          width: 300px;
          height: 297px;
          border-radius: 6px;

          ${flexDirectionColumn}

          padding: 3px;
          position: relative;
        `}
  ${layerA180Deg};
`;

const FlexEndWrapper = styled.div`
  width: 99%;
  ${justifyContentFlexEnd};
`;

const FlexCenterWrapper = styled.div`
  width: 304px;
  border-bottom: 1px solid #ff0000;
  ${flexBoxCenter};
`;

const FlexStartWrapper = styled.div`
  width: 304px;
  border-bottom: 1px solid #ff0000;
  ${justifyContentFlexStart};
`;

const Title = styled.div`
  margin-top: 2px;
  font-size: 10px;
  color: #ff0000;
`;

const FaultsWrapper = styled.div`
  width: 312px;
  height: 93px;

  ${({ isMobile }) =>
    isMobile &&
    css`
      padding: 4px;
    `}

  ${layerADark}

  border-radius: 6px;
  opacity: 1;
`;

const SectionHeader = styled.section`
  width: 100%;

  height: 41px;
  border-radius: 4px;
  padding: 3px 5px;

  ${layerBDark}
  background: #1b2b44;
  box-shadow: inset 0px 0px 6px #000000;

  ${flexDirectionColumn}
`;

const SectionFaultType = styled.section`
  width: 100%;
  height: 40px;
  border-radius: 4px;
  ${layerBDark}
  padding: 3px 5px;
`;

const FaultsTypeWrapper = styled.div`
  width: 100%;
  height: 60%;
  ${flexBoxCenter}
`;

const SectionDisplayActions = styled.section`
  width: 100%;
  height: 80px;
  border-radius: 4px;
  ${layerBDark}
  padding: 3px 5px;
`;

const ActionTakenWrapper = styled.div`
  width: 100%;
  height: 60px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  scroll-behavior: smooth;
  overflow-y: auto;

  ::-webkit-scrollbar {
    width: 10px;
    border: 1px solid #ffffff;
    border-radius: 13px;
  }
  ::-webkit-scrollbar-track {
  }

  ::-webkit-scrollbar-thumb {
    background-color: #ffffff;
    border-radius: 13px;
    border: 1.5px solid transparent;
    background-clip: padding-box;
    height: 40%;
  }

  ::-webkit-scrollbar-button:start:decrement {
    background-repeat: no-repeat;
    background-size: 70%;
    background-position: center;
    height: 10px;

    background-image: url('/images/scrollbar-button-start.svg');
  }
  ::-webkit-scrollbar-button:end:increment {
    background-repeat: no-repeat;
    background-size: 70%;
    background-position: center;
    height: 10px;

    background-image: url('/images/scrollbar-button-end.svg');
  }
`;

const SectionAddAction = styled.div`
  width: 100%;
  height: 95px;

  border-radius: 4px;

  ${layerBDark}

  ${flexDirectionColumn}
  padding: 3px 5px;
`;

const TitleWrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid #ff0000;
  display: flex;
  justify-content: flex-end;

  ${(p) =>
    p.isLogo &&
    css`
      align-items: center;
      justify-content: space-between;
    `}
`;

const ComponentTitle = styled.span`
  ${({ isMobile }) =>
    isMobile &&
    css`
      width: 236px;
      margin-top: 2px;
    `}
  font-size: 10px;
  color: #ff0000;
`;

const InputBoxWrapper = styled.div`
  width: 100%;
  ${justifyContentSpaceBetween}
`;
const InputUserName = styled.input`
  width: 183px;
  height: 16px;
  border-radius: 16px;

  border: 1px solid #ff0000;
  background-color: transparent;
  text-align: left;
  font-size: 8px;
  padding: 0 5px;
  color: #ff0000;

  ::placeholder {
    color: #ff0000;
    text-align: left;
    font-size: 8px;
  }
`;
const InputTitle = styled.span`
  color: #ff0000;
  font-size: 8px;
  text-align: left;
`;

const CommentInput = styled.textarea`
  width: 98%;
  height: 80%;
  font-size: 10px;
  color: #ff0000;
  padding: 5px 16px;
  font-size: 10px;
  text-align: left;

  background: transparent;
  resize: none;
  ::placeholder {
    font-size: 10px;
    color: #ff0000;
    text-align: left;
  }
`;

const SectionButton = styled.section`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

const Button = styled.button`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 26px;
          height: 26px;
          border-radius: 50%;
        `
      : css`
          width: 74px;
          height: 27px;
          border-radius: 18px;
        `}

  ${layerA}
  ${flexBoxCenter}
`;

const ButtonInner = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 24px;
          height: 24px;
          border-radius: 50%;
        `
      : css`
          width: 72px;
          height: 25px;
          border-radius: 25px;
        `}

  ${layerA180Deg}
  ${flexBoxCenter}
`;

const ButtonHole = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 20px;
          height: 20px;
          border-radius: 50%;
        `
      : css`
          width: 64px;
          height: 17px;
          border-radius: 18px;
        `}

  ${layerA}
  ${flexBoxCenter}
`;

const ButtonTop = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 18px;
          height: 18px;
          border-radius: 50%;
        `
      : css`
          width: 62px;
          height: 15px;
          border-radius: 25px;
        `}

  ${layerA180Deg}
  ${flexBoxCenter}
  font-size: 10px;
`;

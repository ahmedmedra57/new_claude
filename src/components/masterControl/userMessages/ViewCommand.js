import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import {
  handleViewCommand,
  selectMCCommand,
} from '../../store/slices/mCCommandSlice';
import {
  alignItemsFlexStart,
  flexBoxCenter,
  justifyContentFlexEnd,
  justifyContentFlexStart,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  messageBoxBackground,
} from '../../styles/commonStyles';
import moment from 'moment';
import { selectUserInfo } from '../../store/slices/userSlice';
import { getType } from '@reduxjs/toolkit';

function ViewCommand() {
  // moment library
  const date = moment().format('MMMM. DD-YYYY');

  // redux
  const dispatch = useDispatch();

  const mCCommandState = useSelector(selectMCCommand);
  const number = mCCommandState.commandNumber;
  const { command, userId } = mCCommandState.searchedCommand;
  const user = mCCommandState.commandsInfo[userId];

  // const userNickName = dav;

  const [foundCommand, setFoundCommand] = useState({});

  useEffect(() => {
    const searchedCommand = user.filter((userCommand) => {
      if (Object.keys(userCommand)[0] === command) {
        return userCommand;
      }
    });

    setFoundCommand(searchedCommand[0][command]);
  }, []);

  

  const UserState = useSelector(selectUserInfo);
  const { user:currentUserData } = UserState;

  // ****************

  // !backend: find the user by filtering the userId and grab the index of the obj in the array
  const userIndex = 0;

  const nickName = currentUserData.user_id;
  const honorificTitle = getType(currentUserData.gender) + '.';
  const name = `${currentUserData.firstname} ${currentUserData.lastname}`;
  const workTitle = currentUserData.title;
  // const date = 'feb. 06-2022';
  const commandReference =
    'mca-dav-020622-' + `${number < 10 ? `${'0' + number} ` : number}`;

  const parametersOfSelectedCommand = foundCommand.parameters;

  const selectedSystem = foundCommand.system;

  const systemInitial = selectedSystem && selectedSystem?.split('-')[0];

  let switchCount = 0;
  foundCommand?.machines?.forEach((machine) => {
    switchCount += Number(machine.length);
  });

  const [atsMessage, setAtsMessage] = useState(
    '------------------------------------------'
  );

  // sets the message for select automatic transfer system
  useEffect(() => {
    if (systemInitial) {
      const { reactivate, block, activateTgs } = foundCommand.ats;

      switch (systemInitial) {
        case 'ess':
          if (reactivate) {
            setAtsMessage(
              'reactivates ess when powered by ebp (emergency backup power)'
            );
          } else if (block) {
            setAtsMessage(
              'block and do not allow ess to operate when on ebp (emergency backup power)'
            );
          }
          break;
        case 'tgs':
          if (reactivate) {
            setAtsMessage(
              'reactive to tgs-typhoon gas power heating system when on ebp emergency backup power'
            );
          } else if (block) {
            setAtsMessage(
              'block and do not allow tgs to operate when on ebp (emergency backup power)'
            );
          }
          break;
        case 'tes':
          if (activateTgs) {
            setAtsMessage(
              'switch to typhoon gas powered heating system when on (emergency backup power)'
            );
          } else if (reactivate) {
            setAtsMessage(
              'reactivates tes when powered by ebp (emergency backup power)'
            );
          } else if (block) {
            setAtsMessage(
              'tes to remain off when powered by ebp (emergency backup power)'
            );
          }
          break;
        default:
          setAtsMessage('------------------------------------------');
          break;
      }
    }
  }, [selectedSystem]);

  return (
    <Div>
      <WrapperBase>
        <Wrapper>
          <UserInfo>
            <WrapperTitle>
              <Title>master control command</Title>
              <Title>{commandReference}</Title>
              <Logo src={'./images/messagebox-logo.svg'} />
            </WrapperTitle>

            <Div1>
              <WrapperProfile>
                <Picture src={'./images/dummyPicture.svg'} />
                <Info underline={true}>uos user:{nickName}</Info>
                <Info underline={true}>
                  {honorificTitle}
                  {name}
                </Info>
                <Info underline={true}>{workTitle}</Info>
              </WrapperProfile>
              <WrapperCommandInfo>
                {/* <Info underline={true}>{commandReference}</Info> */}
                <Info underline={false}>{date}</Info>
              </WrapperCommandInfo>
            </Div1>
          </UserInfo>
          <WrapperSelectedDescription>
            <Title>selected system</Title>
          </WrapperSelectedDescription>
          <WrapperSelectedSystem>
            <Info>{selectedSystem}</Info>
            <Info>{switchCount} switches</Info>
          </WrapperSelectedSystem>
          <LocationsMachinesWrapper>
            {foundCommand?.locations?.map((location, idx) => {
              return (
                <LocationWrapper key={idx}>
                  <Locations>{location}</Locations>
                  {foundCommand?.machines[idx]?.map((machine, index) => {
                    return <Machine key={index * 98}>{machine}, </Machine>;
                  })}
                </LocationWrapper>
              );
            })}
          </LocationsMachinesWrapper>
          <TransferAndHeatingWrapper>
            <WrapperSelectedDescription fixSize={true}>
              <Title>selected automatic transfer system</Title>
            </WrapperSelectedDescription>
            <FlexCenter>
              <Info atsMessage={true}>{atsMessage}</Info>
            </FlexCenter>

            <WrapperSelectedDescription fixSize={true}>
              <Title>selected heating program</Title>
            </WrapperSelectedDescription>
            <ParametersWrapper>
              <Info>parameters</Info>
            </ParametersWrapper>
          </TransferAndHeatingWrapper>
          <WrapperListOfParameters>
            <Ul>
              <DivList>
                <Li>{systemInitial} instant Heat program:</Li>
                <Li>{parametersOfSelectedCommand?.instantHeat}</Li>
              </DivList>
              <DivList>
                <Li>
                  {systemInitial === 'tgs'
                    ? 'tgs fan only program:'
                    : `${systemInitial} snow sensor program:`}
                </Li>
                <Li>
                  {systemInitial === 'tgs'
                    ? parametersOfSelectedCommand?.fanOnly
                    : parametersOfSelectedCommand?.snowSensor}
                </Li>
              </DivList>
              <DivList>
                <Li>
                  {systemInitial === 'tgs'
                    ? ' tgs snow sensor program:'
                    : `${systemInitial} opt. cons. temp. program:`}
                </Li>
                <Li>
                  {systemInitial === 'tgs'
                    ? parametersOfSelectedCommand?.snowSensor
                    : parametersOfSelectedCommand?.optionalConstantTemp}
                </Li>
              </DivList>
              <DivList>
                <Li>{systemInitial} heating schedule program:</Li>
                <Li>{parametersOfSelectedCommand?.heatingSchedule}</Li>
              </DivList>
              <DivList>
                <Li>{systemInitial} wind factor program:</Li>
                <Li>{parametersOfSelectedCommand?.windFactor}</Li>
              </DivList>
            </Ul>
          </WrapperListOfParameters>
          <FlexWrapper>
            <WrapperButton>
              <Button
                onClick={() => {
                  dispatch(handleViewCommand(false));
                }}
              >
                <ButtonIndent>
                  <ButtonTop>
                    <ButtonTitle>close</ButtonTitle>
                  </ButtonTop>
                </ButtonIndent>
              </Button>
            </WrapperButton>
          </FlexWrapper>
        </Wrapper>
      </WrapperBase>
    </Div>
  );
}

export default ViewCommand;

const Div = styled.div`
  width: 983rem;
  height: 613rem;
  position: absolute;
  left: 6%;
  top: 10.5%;
  background-color: transparent;
  ${flexBoxCenter}
`;

const WrapperBase = styled.div`
  width: 657px;
  height: 555px;
  border-radius: 14rem;

  ${messageBoxBackground}
  ${flexBoxCenter}
  z-index: 100;
`;

const Wrapper = styled.div`
  width: 636px;
  height: 534px;
  border-radius: 6rem;
  ${layerA180Deg}
  ${justifyContentSpaceBetween}
  flex-direction: column;
`;

const UserInfo = styled.div`
  width: 636px;
  height: 105rem;
  margin-top: 2rem;
  background: transparent;
  ${justifyContentFlexStart}
  flex-direction: column;
`;

const WrapperTitle = styled.div`
  width: 98%;
  height: 22rem;
  border-bottom: 1px solid #ffff;

  ${justifyContentSpaceBetween}
`;

const Title = styled.p`
  margin-bottom: 4rem;
  text-align: left;
  font-size: 14rem;
  letter-spacing: 1.4rem;
  color: #ffffff;
  opacity: 1;
`;
const Logo = styled.img`
  width: 15px;
  height: 15px;
  margin-bottom: 1px;
`;

const Div1 = styled.div`
  height: 73rem;
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const WrapperProfile = styled.div`
  margin-top: 4rem;
  margin-left: 6rem;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
`;

const WrapperCommandInfo = styled.div`
  margin-top: 4rem;
  margin-right: 6rem;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  flex-direction: column;
`;

const Picture = styled.img`
  max-width: 28rem;
  max-height: 28rem;
  object-fit: cover;
`;

const Info = styled.p`
  margin-bottom: 4rem;
  ${({ underline }) =>
    underline
      ? css`
          text-decoration: underline;
        `
      : css`
          text-decoration: none;
        `};
  font-size: 12rem;
  letter-spacing: 1.2rem;
  color: #ffffff;
  ${({ atsMessage }) =>
    atsMessage &&
    css`
      color: #95ff45;
      margin-top: 8px;
      margin-bottom: 8px;
    `}
`;

const WrapperSelectedDescription = styled.div`
  width: 98%;
  height: 17rem;
  margin-top: 8rem;
  ${({ fixSize }) =>
    fixSize &&
    css`
      width: 621px;
    `}
  border-bottom: 1rem solid #ffff;
  ${justifyContentFlexEnd}
`;

const WrapperSelectedSystem = styled.div`
  width: 98%;
  height: 17rem;
  border-bottom: 1rem solid #ffff;
  ${justifyContentSpaceBetween}
`;

const FlexWrapperSwitchesCount = styled.div`
  display: flex;
  flex-direction: row;
`;

const LocationsMachinesWrapper = styled.div`
  width: 98%;
  ${alignItemsFlexStart}
  flex-direction: column;
`;

const LocationWrapper = styled.div`
  margin-top: 6rem;
  &:last-child {
    margin-bottom: 6rem;
  }
`;

const Locations = styled.p`
  width: fit-content;
  text-align: center;
  font-size: 12px;
  letter-spacing: 1px;
  color: #95ff45;
  opacity: 1;
  border-bottom: 1rem solid #95ff45;
`;

const FlexCenter = styled.div`
  width: 100%;
  ${flexBoxCenter}
`;

const Machine = styled.span`
  height: fit-content;
  width: auto;
  text-align: center;
  font-size: 10px;
  letter-spacing: 1px;
  color: #95ff45;
  opacity: 1;
`;

const TransferAndHeatingWrapper = styled.div``;

const TransferSystemWrapper = styled.div`
  width: 622px;
  border-bottom: 1rem solid #ffffff;
  ${justifyContentSpaceBetween}
`;

const P = styled.p`
  &:last-child {
    margin-top: 2rem;
  }
  margin-bottom: 2rem;
  text-align: center;
  font-size: 10px;
  letter-spacing: 1px;
  color: #ffffff;
  opacity: 1;
`;

const HeatingProgramWrapper = styled.div`
  width: 622px;
  border-bottom: 1rem solid #ffffff;
  ${justifyContentFlexStart}
`;

const ParametersWrapper = styled.div`
  width: 622px;
  margin-top: 4rem;
  ${justifyContentFlexEnd}
`;

const MessageWrapper = styled.div`
  width: 98%;
  height: auto;
  margin-top: 14rem;
  margin-bottom: 20rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;
const MapDiv = styled.div`
  width: 100%;
  height: 100%;
  ${justifyContentSpaceBetween}
`;

const MessageTitle = styled.p`
  font-size: 12rem;
  text-align: center;
  color: #95ff45;
`;

const MessageDescription = styled.p`
  font-size: 12rem;
  margin-top: 12rem;
  text-align: center;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  margin-right: 6rem;
  margin-bottom: 4rem;
  display: flex;
  justify-content: flex-end;
  gap: 6rem;
`;

const WrapperListOfParameters = styled.div`
  width: 98%;
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: column;
`;

const Ul = styled.ul`
  width: 100%;
  padding-bottom: 2rem;
`;

const DivList = styled.div`
  width: 100%;
  ${justifyContentSpaceBetween};
`;

const Li = styled.li`
  width: fit-content;
  text-align: center;
  font-size: 12px;
  letter-spacing: 1px;
  color: #95ff45;
  opacity: 1;
`;

const FlexWrapper = styled.div`
  width: 97%;
  margin-bottom: 8rem;
  ${justifyContentFlexEnd}
`;

const WrapperButton = styled.div`
  width: 109px;
  height: 33px;

  background: #233a54;
  box-shadow: inset 0px 0px 1px #000000;
  border-radius: 18px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Button = styled.button`
  width: 106px;
  height: 31px;
  border-radius: 25px;
  ${layerA180Deg}
  ${flexBoxCenter}
`;

const ButtonIndent = styled.div`
  width: 97px;
  height: 21px;
  border-radius: 18px;

  ${layerA}
  ${flexBoxCenter}
`;

const ButtonTop = styled.div`
  width: 95px;
  height: 19px;
  border-radius: 25px;
  ${layerA180Deg}
  ${flexBoxCenter}
`;

const ButtonTitle = styled.p`
  text-align: center;
  font-size: 11px;
  letter-spacing: 1.1px;
  color: #ffffff;
  opacity: 1;
`;

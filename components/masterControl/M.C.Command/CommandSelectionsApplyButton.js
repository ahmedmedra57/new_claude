import { useSelector } from "react-redux";
import styled, { css } from "styled-components";
import { selectMCCommand } from "../../store/slices/mCCommandSlice";
import {
  borderBlue,
  flexBoxCenter,
  justifyContentFlexEnd,
  justifyContentFlexStart,
  justifyContentSpaceEvenly,
  layerA180Deg,
  layerA90Deg,
  layerB,
  layerBDark,
  layerCLighter,
  scrollbarY,
} from "../../styles/commonStyles";
import ApplyButton from "./ApplyButton";

import ViewCommandsSelectBox from "./ViewCommandsSelectBox";
import { selectUserInfo } from "../../store/slices/userSlice";

function CommandSelectionsApplyButton({
  viewCommandTitle,
  buttonsTitle,
  handleViewCommandsList,
  handleApplyButton,
  openingSelectionBox,
  selectCommand,
  handleDisplayViewCommand,
  handleSelectCommand,
  handleCreateNewCommandMessageBox,
}) {
  const UserState = useUserStore();
  const userID = UserState.user.user_id;
  const commandsState = useMCCommandStore();
  const userCommandsInfo = commandsState.commandsInfo[userID];
  const { isNewCommandCreated } = commandsState;

  return (
    <Wrapper>
      {/* view commands select box */}
      <WrapperCommandsSelectBox>
        <ViewCommandsSelectBox
          title={viewCommandTitle}
          handleButton={handleViewCommandsList}
          openingSelectionBox={openingSelectionBox}
        />
      </WrapperCommandsSelectBox>
      {/* apply button */}

      <WrapperGroupButton
        onClick={() =>
          !isNewCommandCreated &&
          handleCreateNewCommandMessageBox("_", "__", true)
        }
      >
        <ApplyButton
          title={buttonsTitle}
          handleButton={isNewCommandCreated && handleApplyButton}
        />
      </WrapperGroupButton>
      {/* view commands list */}
      {openingSelectionBox && (
        <CommandsSelectBox>
          <FlexWrapper1>
            <IndentButton>
              <ButtonTitle>{viewCommandTitle}</ButtonTitle>
            </IndentButton>
            <Img
              src={"/images/whiteArrowDown.svg"}
              onClick={(e) => handleViewCommandsList(1, e)}
            />
          </FlexWrapper1>
          <SelectBox>
            {Array.from(
              new Set(userCommandsInfo.map((el) => Object.keys(el)[0]))
            ).map((commandTitle, index) => {
              return (
                <IndivSelection
                  key={index}
                  onClick={() => handleSelectCommand(commandTitle)}
                >
                  <OuterCircle>
                    <InnerCircle
                      selection={commandTitle === selectCommand?.command}
                    ></InnerCircle>
                  </OuterCircle>
                  <SelectionTitle>{commandTitle}</SelectionTitle>
                </IndivSelection>
              );
            })}
          </SelectBox>
          <FlexWrapper>
            <SelectButtonWrapper onClick={() => handleDisplayViewCommand()}>
              <SelectButton>
                <ButtonIndentation>
                  <ButtonTop>
                    <Title>select</Title>
                  </ButtonTop>
                </ButtonIndentation>
              </SelectButton>
            </SelectButtonWrapper>
          </FlexWrapper>
        </CommandsSelectBox>
      )}
    </Wrapper>
  );
}

export default CommandSelectionsApplyButton;

const Wrapper = styled.div`
  width: 292px;
  height: 62px;
  margin-bottom: 2px;

  ${layerBDark}
  border-radius: 16px;
  opacity: 1;
  ${flexBoxCenter}
  flex-direction: column;
  position: relative;
`;

const WrapperCommandsSelectBox = styled.div`
  width: 100%;
  height: 100%;
  ${flexBoxCenter}
`;

const WrapperGroupButton = styled.div`
  width: 100%;
  height: 100%;
  ${flexBoxCenter}
`;

const CommandsSelectBox = styled.div`
  width: 287px;
  height: 192px;

  ${layerA90Deg}

  border-radius: 13px;
  opacity: 1;
  position: absolute;
  top: -127px;
  ${flexBoxCenter};
  flex-direction: column;
`;

const SelectBox = styled.div`
  width: 280px;
  height: 133px;

  ${layerB}
  border-radius: 14px 10px 10px 14px;
  opacity: 1;

  ${scrollbarY}

  overflow-y: scroll;

  display: flex;
  flex-direction: column;
`;

const IndivSelection = styled.div`
  width: 256px;
  height: 24px;
  margin-left: 2px;
  margin-top: 2px;
  padding-top: 2px;
  padding-bottom: 2px;
  &:last-child {
    margin-bottom: 2px;
  }

  ${borderBlue}
  border-radius: 16px;
  opacity: 1;
  ${justifyContentFlexStart}
  gap:46px;
  cursor: pointer;
`;

const OuterCircle = styled.div`
  height: 18px;
  width: 18px;

  margin-left: 2px;
  border-radius: 50%;
  border: 1px solid #95ff45;
  ${flexBoxCenter}
`;

const InnerCircle = styled.div`
  height: 12px;
  width: 12px;
  border-radius: 50%;
  ${({ selection }) =>
    selection &&
    css`
      background-color: #95ff45;
    `};
`;

const SelectionTitle = styled.p`
  text-align: center;
  font-size: 10px;
  letter-spacing: 1px;
  color: #ffffff;
  opacity: 1;
`;

const FlexWrapper1 = styled.div`
  width: 100%;
  margin-top: 3px;
  margin-bottom: 4px;
  ${justifyContentSpaceEvenly}
`;

const FlexWrapper = styled.div`
  width: 100%;

  ${justifyContentFlexEnd}
`;

const SelectButtonWrapper = styled.div`
  width: 84px;
  height: 27px;
  margin-top: 2px;
  margin-right: 2px;

  ${layerBDark}
  border-radius: 18px;
  opacity: 1;
  ${flexBoxCenter}
`;

const SelectButton = styled.button`
  width: 82px;
  height: 25px;

  ${layerA180Deg}

  border-radius: 25px;
  opacity: 1;
  ${flexBoxCenter}
`;

const ButtonIndentation = styled.div`
  width: 74px;
  height: 17px;

  ${layerCLighter}

  border-radius: 18px;
  opacity: 1;
  ${flexBoxCenter}
`;

const ButtonTop = styled.div`
  width: 72px;
  height: 15px;

  ${layerA180Deg}

  border-radius: 25px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Title = styled.p`
  text-align: left;
  font-size: 10px;
  letter-spacing: 1px;
  color: #ffffff;
  opacity: 1;
`;

const IndentButton = styled.div`
  width: 254px;
  height: 18px;

  ${layerB}

  border-radius: 9px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Img = styled.img`
  margin-right: 2px;
  cursor: pointer;
`;

const ButtonTitle = styled.p`
  text-align: center;
  font-size: 10px;
  letter-spacing: 1px;
  color: #ffffff;
  opacity: 1;
`;

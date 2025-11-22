import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  justifyContentSpaceBetween,
  justifyContentSpaceEvenly,
  layerADark,
  layerBDark,
} from '../../styles/commonStyles';
import CreateNewCommandButton from './CreateNewCommandButton';
import SystemButton from './SystemButton';
import { useDispatch, useSelector } from 'react-redux';
import {
  handleControlResetInit,
  selectMCCommand,
} from '../../store/slices/mCCommandSlice';

function ContainerSelectSystem({
  // handleSelectSystem,
  toggleButtonColor,
  handleCreateNewCommand,
  handleCreateNewCommandMessageBox,
  setIsSystemSelectedMessage,
}) {
  // mcCommandSlice
  const { isNewCommandCreated } = useSelector(selectMCCommand);

  const systemButtonsNames = [
    { abbr: 'ess', fullName: 'electric switch system' },
    { abbr: 'tgs', fullName: 'typhoon gas system' },
    { abbr: 'tes', fullName: 'typhoon electric system' },
    { abbr: 'hp', fullName: 'heated platform' },
  ];

  return (
    <Div>
      <Wrapper>
        <WrapperTitle>
          <Title>select system</Title>
        </WrapperTitle>
        <WrapperSystemButtons
          onClick={() =>
            !isNewCommandCreated && handleCreateNewCommandMessageBox()
          }
        >
          {systemButtonsNames.map((value, index) => {
            return (
              <div key={index}>
                <SystemButton
                  name={value.fullName}
                  shortName={value.abbr}
                  index={index}
                  isColor={toggleButtonColor === index}
                  setIsSystemSelectedMessage={setIsSystemSelectedMessage}
                  // handleSelectSystem={handleSelectSystem}
                  // isNewCommandCreated={isNewCommandCreated}
                />
              </div>
            );
          })}
        </WrapperSystemButtons>
      </Wrapper>
      <WrapperCommandButton>
        <CreateNewCommandButton
          name={'create new command'}
          handleButton={handleCreateNewCommand}
        />
      </WrapperCommandButton>
    </Div>
  );
}

export default ContainerSelectSystem;

const Div = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
`;

const Wrapper = styled.div`
  width: 199px;
  height: 264px;
  border-radius: 18px 18px 28px 28px;

  ${layerBDark}

  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
`;

const WrapperTitle = styled.div`
  width: 195px;
  height: 31px;
  margin-top: 2px;

  border-radius: 16px;
  ${layerADark}
  ${flexBoxCenter}
`;

const Title = styled.p`
  text-align: left;
  font-size: 14px;
  letter-spacing: 1.4px;
  color: #ffffff;
  opacity: 1;
  text-decoration: underline;
`;

const WrapperSystemButtons = styled.div`
  height: 220px;
  width: auto;
  margin-top: 9px;
  ${justifyContentSpaceBetween};
  flex-direction: column;
`;

const WrapperCommandButton = styled.div`
  height: 130px;
  width: auto;
  margin-top: 10px;
  ${justifyContentSpaceEvenly};
  flex-direction: column;
`;

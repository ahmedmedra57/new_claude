import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  layerA180Deg,
  layerB,
  layerBDark,
} from '../../styles/commonStyles';
import { useSelector } from 'react-redux';
import { selectMCCommand } from '../../store/slices/mCCommandSlice';

function CreateNewCommandButton({ name, handleButton }) {
  const commandState = useSelector(selectMCCommand);
  const { isNewCommandCreated } = commandState;

  return (
    <ButtonHole>
      <Button onClick={(e) => handleButton(e)} isActive={isNewCommandCreated}>
        <ButtonIndent>
          <ButtonTop>
            <ButtonName>{name}</ButtonName>
          </ButtonTop>
        </ButtonIndent>
      </Button>
    </ButtonHole>
  );
}

export default CreateNewCommandButton;

const ButtonHole = styled.div`
  width: 199px;
  height: 57px;
  border-radius: 28px;
  ${layerBDark}
  ${flexBoxCenter}
`;

const Button = styled.button`
  width: 189px;
  height: 47px;
  border-radius: 25px;

  ${layerA180Deg}
  ${flexBoxCenter}

  ${({ isActive }) =>
    isActive &&
    css`
      border-color: #95ff45;
    `}
`;

const ButtonIndent = styled.div`
  width: 182px;
  height: 41px;
  border-radius: 20px;
  ${layerB}
  ${flexBoxCenter}
`;

const ButtonTop = styled.div`
  width: 180px;
  height: 39px;
  border-radius: 19px;

  ${layerA180Deg};
  ${flexBoxCenter}
`;

const ButtonName = styled.p`
  line-height: 14px;
  text-align: center;
  width: 160px;
  text-align: center;
  font-size: 14px;
  letter-spacing: 1.4px;
  color: #ffffff;
`;

import styled, { css } from 'styled-components';
import { flexBoxCenter, layerA180Deg, layerB } from '../../styles/commonStyles';

const SelectionsButton = ({ title, onClickButton, index }) => {
  return (
    <Button onClick={() => onClickButton(index)}>
      <IndentButton>
        <ButtonTop>
          <Title>{title}</Title>
        </ButtonTop>
      </IndentButton>
    </Button>
  );
};

export default SelectionsButton;

const Button = styled.button`
  width: 81px;
  height: 41px;

  ${layerA180Deg}

  border-radius: 34px;
  opacity: 1;
  ${flexBoxCenter}
`;

const IndentButton = styled.div`
  width: 71px;
  height: 31px;

  ${layerB}

  border-radius: 33px;
  opacity: 1;
  ${flexBoxCenter}
`;

const ButtonTop = styled.div`
  width: 67px;
  height: 27px;

  ${layerA180Deg}

  border-radius: 34px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Title = styled.p`
  text-align: center;
  font-size: 10px;
  letter-spacing: 1px;
  color: #ffffff;
  opacity: 1;
`;

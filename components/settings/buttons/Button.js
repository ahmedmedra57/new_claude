import styled, { css } from 'styled-components';
import { flexBoxCenter, layerA180Deg, layerB } from '../../styles/commonStyles';

const Button = ({
  name,
  handleClick,
  id,
  editState,
  sysIndex,
  isEdit,
  isActivate,
}) => {
  return (
    <Wrapper>
      <Wrapper1
        borderColor={editState}
        isActivate={isActivate}
        index={id}
        isEdit={isEdit}
        onClick={() => handleClick(id, sysIndex && sysIndex)}
      >
        <ButtonHole>
          <ButtonTop>
            <ButtonName>{name}</ButtonName>
          </ButtonTop>
        </ButtonHole>
      </Wrapper1>
    </Wrapper>
  );
};

export default Button;

const Wrapper = styled.div`
  width: 84px;
  height: 29px;

  ${layerB}

  border-radius: 27px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Wrapper1 = styled.button`
  cursor: pointer;
  width: 82px;
  height: 27px;

  ${layerA180Deg}

  border-radius: 25px;
  opacity: 1;

  ${flexBoxCenter}
  ${({ isEdit, index }) =>
    isEdit &&
    index === 0 &&
    css`
      border: 1px solid #95ff45;
    `}
  ${({ isActivate }) =>
    isActivate &&
    css`
      border: 1px solid #95ff45;
    `}
`;
const ButtonHole = styled.div`
  width: 76px;
  height: 21px;

  ${layerB}

  border-radius: 20px;
  opacity: 0.8;
  ${flexBoxCenter}
`;

const ButtonTop = styled.div`
  width: 74px;
  height: 19px;

  ${layerA180Deg}

  border-radius: 25px;
  opacity: 1;

  ${flexBoxCenter}
`;

const ButtonName = styled.span`
  font-size: 10px;
  letter-spacing: 1px;
  color: #ffffff;
  opacity: 1;
`;

import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  layerA180Deg,
  layerCLighter,
} from '../../../styles/commonStyles';

const SelectionsButton = ({ title, onClickButton, index, isMasterControl }) => {
  return (
    <Button
      isMasterControl={isMasterControl}
      onClick={() => onClickButton(index)}
    >
      <IndentButton isMasterControl={isMasterControl}>
        <ButtonTop isMasterControl={isMasterControl}>
          <Title isMasterControl={isMasterControl}>{title}</Title>
        </ButtonTop>
      </IndentButton>
    </Button>
  );
};

export default SelectionsButton;

const Button = styled.div`
  width: 82px;
  height: 25px;
  border-radius: 25px;

  ${layerA180Deg}
  ${flexBoxCenter}

  ${(p) =>
    p.isMasterControl &&
    css`
      width: 108px;
      height: 35px;
    `};
`;

const IndentButton = styled.div`
  width: 74px;
  height: 17px;
  border-radius: 18px;
  ${layerCLighter}
  ${flexBoxCenter}

  ${(p) =>
    p.isMasterControl &&
    css`
      width: 100px;
      height: 27px;
    `};
`;

const ButtonTop = styled.div`
  width: 72px;
  height: 15px;
  border-radius: 25px;
  font-size: 10px;

  ${layerA180Deg};
  ${flexBoxCenter};

  ${(p) =>
    p.isMasterControl &&
    css`
      width: 98px;
      height: 25px;
      font-size: 12px;
    `};
`;

const Title = styled.p`
  text-align: center;
  font-size: 10px;
  letter-spacing: 1px;
  color: #ffffff;
  opacity: 1;

  ${(p) =>
    p.isMasterControl &&
    css`
      font-size: 12px;
    `};
`;
// const Button = styled.button`
//   width: 81px;
//   height: 41px;

//   ${layerA180Deg}

//   border-radius: 34px;
//   opacity: 1;
//   ${flexBoxCenter}
// `;

// const IndentButton = styled.div`
//   width: 71px;
//   height: 31px;

//   ${layerB}

//   border-radius: 33px;
//   opacity: 1;
//   ${flexBoxCenter}
// `;

// // const ButtonTop = styled.div`
// //   width: 67px;
// //   height: 27px;

// //   ${layerA180Deg}

// //   border-radius: 34px;
// //   opacity: 1;
// //   ${flexBoxCenter}
// // `;

// const Title = styled.p`
//   text-align: center;
//   font-size: 10px;
//   letter-spacing: 1px;
//   color: #ffffff;
//   opacity: 1;
// `;

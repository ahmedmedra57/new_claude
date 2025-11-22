import styled, { css } from "styled-components";
import {
  flexBoxCenter,
  layerA180Deg,
  layerADisabled180Deg,
  layerB,
} from "../../../styles/commonStyles";

const Button = ({ title, handleClick, handleClear, disabled }) => {
  return (
    <BaseButton
      onClick={() => {
        if(disabled) return;
        return (
          handleClick(), typeof handleClear === "function" && handleClear()
        );
      }}
      greenBorder={title}
      disabled={disabled}
    >
      <IndentButton >
        <ButtonTop disabled={disabled}>
          <Title>{title}</Title>
        </ButtonTop>
      </IndentButton>
    </BaseButton>
  );
};

export default Button;

const BaseButton = styled.button`
  width: 87px;
  height: 24px;

  ${layerA180Deg}

  ${({ greenBorder }) =>
    greenBorder === "close"
      ? css`
          border: 0.5px solid #95ff45;
        `
      : css`
          border: 0.5px solid #000000;
        `}
border-radius: 12px;
  opacity: 1;
  cursor: pointer;
  ${flexBoxCenter}

  ${({ disabled }) =>
    disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.5;
      ${layerADisabled180Deg}
    `}
`;

const IndentButton = styled.div`
  width: 83px;
  height: 20px;

  ${layerB}
  border-radius: 13px;
  opacity: 1;
  ${flexBoxCenter}
`;

const ButtonTop = styled.div`
  width: 81px;
  height: 18px;

  ${layerA180Deg}
  ${({ disabled }) =>
    disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.5;
      ${layerADisabled180Deg}
    `}
border-radius: 12px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Title = styled.div`
  text-align: center;
  font-size: 10px;
  letter-spacing: 1px;
  color: #ffffff;
  opacity: 1;
`;

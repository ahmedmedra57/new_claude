import styled, { css } from "styled-components";
import {
  flexBoxCenter,
  layerA180Deg,
  layerB,
  layerDisabled180Deg,
} from "../../styles/commonStyles";
import { useSelector } from "react-redux";
import { PERMISSIONS } from "../../../constants";
import { selectUserPermissions } from "../../store/slices/userSlice";

const ViewPrintButton = ({ onClickButton }) => {
  const permissions = useSelector(selectUserPermissions);
  const isDisabled = !permissions[PERMISSIONS.PRINT_TELEMETRY];
  return (
    <ShadowButton onClick={() => !isDisabled && onClickButton()}>
      <Button disabled={isDisabled}>
        <IndentButton disabled={isDisabled}>
          <ButtonTop disabled={isDisabled}>
            <Title>view & print</Title>
          </ButtonTop>
        </IndentButton>
      </Button>
    </ShadowButton>
  );
};

export default ViewPrintButton;

const ShadowButton = styled.div`
  width: 167px;
  height: 29px;

  ${layerB}

  border-radius: 27px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Button = styled.button`
  width: 165px;
  height: 27px;

  ${layerA180Deg}
  ${({ disabled }) =>
    disabled &&
    css`
      ${layerDisabled180Deg}
    `}

  border-radius: 25px;
  opacity: 1;
  ${flexBoxCenter}
`;

const IndentButton = styled.div`
  width: 159px;
  height: 21px;

  ${layerB}
  ${({ disabled }) =>
    disabled &&
    css`
      ${layerDisabled180Deg}
    `}

  border-radius: 20px;
  opacity: 0.8;
  ${flexBoxCenter}
`;

const ButtonTop = styled.div`
  width: 157px;
  height: 19px;

  ${layerA180Deg}
  ${({ disabled }) =>
    disabled &&
    css`
      ${layerDisabled180Deg}
    `}
  border-radius: 25px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Title = styled.p`
  text-align: center;
  font-size: 8px;
  letter-spacing: 0.8px;
  color: #ffffff;
  opacity: 1;
`;

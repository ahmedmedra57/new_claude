import styled, { css } from 'styled-components';
import { flexBoxCenter } from '../styles/commonStyles';

const SwitchNameRadioBox = ({
  data,
  checked,
  handleClick,
  // id,
  isSelectSwitchName,
}) => {
  return (
    <Wrapper onClick={() => handleClick(data)}>
      <OptionChecker>
        <CheckedCircle
          checked={checked === data ? true : false}
        ></CheckedCircle>
      </OptionChecker>
      <Label isSelectSwitchName={isSelectSwitchName}>
        {data?.split(' - ')[1]}
      </Label>
    </Wrapper>
  );
};

export default SwitchNameRadioBox;

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  width: 76px;
  height: 14px;
  border: 1px solid #142033;
  border-radius: 9px;

  padding: 0 1px;
  margin-bottom: 1.5px;
  &:first-child {
    margin-top: 2px;
  }
  &:last-child {
    margin-bottom: 2px;
  }
  &:hover {
    background: #233a54;
    box-shadow: inset 0px 0px 2px #000000;

    opacity: 1;
  }
  z-index: 100;
`;
const Label = styled.span`
  cursor: pointer;
  font-size: 6px;
  text-align: center;
  width: 70%;
  ${({ isSelectSwitchName }) =>
    isSelectSwitchName &&
    css`
      font-size: 8px;
      letter-spacing: 0.8px;
    `}
`;
const OptionChecker = styled.div`
  ${flexBoxCenter}
  width: 30%;
  height: 10px;
  width: 10px;
  border: 1px solid #95ff45;
  border-radius: 50%;
`;
const CheckedCircle = styled.div`
  border-radius: 50%;
  height: 6px;
  width: 6px;
  background-color: ${(p) => (p.checked ? '#95ff45' : 'none')};
`;

import styled from 'styled-components';
import { flexBoxCenter } from '../styles/commonStyles';

const SSRRadioBox = ({ data, selected, onHandler, disabled, index, activeThermocouples }) => {
  return (
    <Wrapper
      onClick={(e) => !disabled && onHandler(data, e)}
      disabled={disabled}
    >
      <OptionChecker>
        <CheckedCircle
          checked={selected === data ? true : false}
        ></CheckedCircle>
      </OptionChecker>
      <Label disabled={disabled}>{data}</Label>
    </Wrapper>
  );
};

export default SSRRadioBox;

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  width: 80px;
  height: 20px;
  border: 1px solid #233a54;
  border-radius: 16px;

  padding: 0 0.1rem;
  margin-bottom: 3px;
  &:first-child {
    margin-top: 1px;
  }
  &:last-child {
    margin-bottom: 1px;
  }
  &:hover {
    background: #233a54;
    box-shadow: inset 0px 0px 2px #000000;
  }
  z-index: 100;
  cursor: ${(props) => (props.disabled === true ? 'not-allowed' : 'pointer')};

  padding: 0 2px;
  /* z-index: 1000; */
`;
const Label = styled.span`
  cursor: pointer;
  font-size: 10px;
  text-align: center;
  width: 70%;
  letter-spacing: 0.8px;
  /* border: 1px solid red; */
  z-index: 100;
  cursor: ${(props) => (props.disabled === true ? 'not-allowed' : 'pointer')};
`;
const OptionChecker = styled.div`
  ${flexBoxCenter}
  width: 30%;
  height: 14px;
  width: 14px;
  border: 1px solid #95ff45;
  border-radius: 50%;
  z-index: 100;
`;
const CheckedCircle = styled.div`
  border-radius: 50%;
  height: 6px;
  width: 6px;
  background-color: ${(p) => (p.checked ? '#95ff45' : 'none')};
  z-index: 100;
`;

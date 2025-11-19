import styled from 'styled-components';
import { flexBoxCenter } from '../styles/commonStyles';

const SwitchNameButton = ({ handleClick, name }) => {
  return (
    <WrapperHole onClick={() => handleClick(name)}>
      <ButtonOuterWrapper>
        <ButtonHole>
          <ButtonTop>
            <ButtonName>{name}</ButtonName>
          </ButtonTop>
        </ButtonHole>
      </ButtonOuterWrapper>
    </WrapperHole>
  );
};

export default SwitchNameButton;

const WrapperHole = styled.div`
  width: 80px;
  height: 22px;

  border-radius: 18px;
  background: #233a54;
  border-color: #707070;
  box-shadow: inset 0 0 6px #000000;
  opacity: 1;

  ${flexBoxCenter}
  margin-top: 0.1rem;
`;

const ButtonOuterWrapper = styled.button`
  cursor: pointer;
  width: 78px;
  height: 20px;

  border-radius: 25px;
  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background: transparent linear-gradient(180deg, #233a54 0%, #060d19 100%) 0%
    0% no-repeat padding-box;
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid #000000;
  opacity: 1;
`;

const ButtonHole = styled.div`
  width: 72px;
  height: 14px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #142033 0% 0% no-repeat padding-box;
  box-shadow: inset 0px 0px 1px #000000;
  opacity: 1;
`;

const ButtonTop = styled.div`
  width: 70px;
  height: 12px;
  border-radius: 25px;

  border-style: solid;
  border-width: 0.5px;
  border-color: rgb(0, 0, 0);

  background: transparent linear-gradient(180deg, #233a54 0%, #060d19 100%) 0%
    0% no-repeat padding-box;
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid #000000;
  border-radius: 25px;
  opacity: 1;

  ${flexBoxCenter}
`;

const ButtonName = styled.span`
  font-size: 7px;
  text-align: center;
`;

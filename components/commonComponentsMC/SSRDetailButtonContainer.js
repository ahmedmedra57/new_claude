import styled from 'styled-components';
import { flexBoxCenter } from '../styles/commonStyles';

import SSRDetailAddButton from './SSRDetailAddButton';

const SSRDetailButtonContainer = ({ handleClick, isEditable }) => {
  const buttonNames = ['add', 'clear', 'apply'];

  return (
    <Wrapper>
      <ButtonWrapper>
        {buttonNames.map((name, index) => (
          <SSRDetailAddButton
            handleClick={handleClick}
            name={name}
            key={index}
          />
        ))}
      </ButtonWrapper>
    </Wrapper>
  );
};

export default SSRDetailButtonContainer;

const Wrapper = styled.div`
  width: 246px;
  height: 32px;

  background: transparent linear-gradient(180deg, #233a54 0%, #060d19 100%);
  box-shadow: inset 0px 0 1px #ffffff29, 0px 0px 1px #000000;
  border: 0.5px solid #000000;
  border-radius: 0 0 12px 16px;

  ${flexBoxCenter}

  justify-content: flex-start;
  padding: 0 1.5px;
`;
const ButtonWrapper = styled.div`
  ${flexBoxCenter}
  justify-content: space-between;

  width: 222px;
  height: 28px;

  background: #1b2b44;
  border-radius: 15px;
  padding: 0 1.5px;
`;

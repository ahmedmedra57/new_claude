import { useState } from 'react';
import { useSelector } from 'react-redux';

import styled, { css } from 'styled-components';
import { flexBoxCenter } from '../styles/commonStyles';

import HoverMessageBox from './HoverMessageBox';

const SSRSettingButton = ({
  isSettingOpen,
  column,
  handleButtonClick,
  id,
  disable,
}) => {
  // const userState = useSelector(selectUserState);
  // const { isAdministrator } = userState;

  const isAdministrator = true;
  const [displayHiddenMessage, setDisplayHiddenMessage] = useState(false);

  const firstMessage = 'close password box';

  const secondMessage = isSettingOpen
    ? 'click to close'
    : 'shlc-switch heating load configuration';

  const message = isAdministrator ? secondMessage : firstMessage;
  return (
    <Wrapper column={column}>
      <SettingHole
        disable={disable}
        onClick={() => !disable && handleButtonClick(id)}
        // onMouseEnter={() => setDisplayHiddenMessage(true)}
        // onMouseLeave={() => setDisplayHiddenMessage(false)}
      >
        <SettingTop>
          <SettingIcon disable={disable} src={'/images/admin-setting.svg'} />
        </SettingTop>
      </SettingHole>

      {displayHiddenMessage && (
        <HiddenMessageWrapper isSettingOpen={isSettingOpen}>
          <HoverMessageBox message={message} />
        </HiddenMessageWrapper>
      )}
    </Wrapper>
  );
};

export default SSRSettingButton;

const Wrapper = styled.div`
  width: 18px;
  height: 18px;
  background: #233a54;
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 20px;

  visibility: ${(p) => p.column === 2 && 'hidden'};
  visibility: ${(p) => p.column === 3 && 'hidden'};

  position: relative;
  ${flexBoxCenter}
`;
const SettingHole = styled.button`
  width: 16px;
  height: 16px;

  background: transparent linear-gradient(180deg, #233a54 0%, #060d19 100%);
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid #000000;
  border-radius: 25px;

  ${flexBoxCenter}

  ${props => props.disable && css`
    cursor: not-allowed;
    opacity: 0.5;
  `}
`;

const SettingTop = styled.div`
  width: 13px;
  height: 13px;

  background: #1b2b44;
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 20px;

  ${flexBoxCenter}
`;

const SettingIcon = styled.img`
  height: 80%;
  cursor: pointer;
  
  ${props => props.disable && css`
    cursor: not-allowed;
    opacity: 0.5;
  `}
`;

const HiddenMessageWrapper = styled.div`
  position: absolute;
  width: 150px;
  top: ${(p) => (p.isSettingOpen ? '-8px' : '-17.5px')};
  right: 0rem;
  z-index: 10000;
`;

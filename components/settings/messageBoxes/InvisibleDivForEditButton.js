import { useState } from 'react';
import styled, { css } from 'styled-components';
import SettingConfirmedMessage from '../../masterControl/userMessages/SettingConfirmedMessage';

function InvisibleDivForEditButton({ height, width, isSystemIdentification }) {
  const [display, setDisplay] = useState(false);

  const handleMessage = (event) => {
    event.stopPropagation();
    return setDisplay(true);
  };

  const closeMessageBox = (event) => {
    event.stopPropagation();
    return setDisplay(false);
  };
  const editTitle = 'settings';
  const editSubtitle = 'settings options';
  const messageTheme = 'change options';
  const editMessage = isSystemIdentification
    ? 'please select edit or create to allow changes'
    : 'please select edit to allow changes';

  return (
    <Div onClick={(e) => handleMessage(e)} height={height} width={width}>
      {display && (
        <SettingConfirmedMessage
          onClose={closeMessageBox}
          title={editTitle}
          subtitle={editSubtitle}
          messageTheme={messageTheme}
          message={editMessage}
          enableButton={display}
          isEdit={true}
        />
      )}
    </Div>
  );
}

const Div = styled.div`
  height: ${({ height }) => height};
  width: 861px;
  background-color: transparent;
  /* border: 1px solid red; */
  ${({ width }) =>
    width &&
    css`
      width: ${width};
    `}
`;

export default InvisibleDivForEditButton;

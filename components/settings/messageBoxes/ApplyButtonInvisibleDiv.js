import { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
  handleClickedButton,
  handleResetButtons,
} from '../../store/slices/settings/editCancelApplyButtonsSlice';

import SettingClearOkMessage from './SettingClearOkMessage';

function ApplyButtonInvisibleDiv() {
  // redux
  
  const [display, setDisplay] = useState(false);

  const handleMessage = (event) => {
    event.stopPropagation();
    return setDisplay(true);
  };

  const closeMessageBox = (event) => {
    event.stopPropagation();
    return setDisplay(false);
  };

  const clearMessageBox = (event) => {
    event.stopPropagation();

    dispatch(handleResetButtons();
    dispatch(handleClickedButton('isCancel');

    setDisplay(false);
  };

  const applyTitle = 'settings options';
  const applyMessage =
    'please confirm your selected changes by pressing apply or clear to cancel changes';

  return (
    <Div onClick={(e) => handleMessage(e)}>
      {display && (
        <SettingClearOkMessage
          onClose={closeMessageBox}
          onClear={clearMessageBox}
          title={applyTitle}
          message={applyMessage}
          // enableButton={display}
        />
      )}
    </Div>
  );
}

export default ApplyButtonInvisibleDiv;

const Div = styled.div`
  height: 100%;
  width: 100%;
  background-color: transparent;
`;

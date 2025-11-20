import { useState } from 'react';
import styled from 'styled-components';
import {
import { useEditCancelApplyButtonsStore } from '../../zustand-stores';
  handleClickedButton,
  handleResetButtons,
} from '../../store/slices/settings/editCancelApplyButtonsSlice';

import SettingClearOkMessage from './SettingClearOkMessage';

function ApplyButtonInvisibleDiv() {
  const { resetButtons } = useEditCancelApplyButtonsStore();
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

    useEditCancelApplyButtonsStore().resetButtons();
    useEditCancelApplyButtonsStore().setButtonClicked('isCancel');

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

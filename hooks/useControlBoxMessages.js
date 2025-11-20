import { useState, useCallback } from 'react';

/**
 * Custom hook to manage message box state for ControlBox components
 * Replaces ~15 lines of useState + handler logic per component
 *
 * @returns {object} - Message state and control functions
 */
const useControlBoxMessages = () => {
  const [openMessageBox, setOpenMessageBox] = useState(false);
  const [message, setMessage] = useState([]);
  const [programName, setProgramName] = useState(null);
  const [messageTitle, setMessageTitle] = useState('');

  const showMessage = useCallback((title, messages, program = null) => {
    setMessageTitle(title);
    setMessage(Array.isArray(messages) ? messages : [messages]);
    setProgramName(program);
    setOpenMessageBox(true);
  }, []);

  const closeMessageBox = useCallback(() => {
    setOpenMessageBox(false);
    setMessage([]);
    setProgramName(null);
    setMessageTitle('');
  }, []);

  return {
    openMessageBox,
    message,
    programName,
    messageTitle,
    showMessage,
    closeMessageBox,
    // Expose setters for backward compatibility with existing code
    setOpenMessageBox,
    setMessage,
    setProgramName,
    setMessageTitle,
  };
};

export default useControlBoxMessages;

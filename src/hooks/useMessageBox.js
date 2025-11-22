import { useState } from 'react';

/**
 * Custom hook for managing message box state
 *
 * Eliminates duplicate message box state management across 6+ components.
 *
 * @returns {object} - Message box state and control functions
 *
 * @example
 * const { openMessageBox, messages, showMessage, closeMessage } = useMessageBox();
 *
 * // Show a message
 * showMessage(['Error title', 'Error description']);
 *
 * // Close the message
 * closeMessage();
 */
export const useMessageBox = () => {
  const [openMessageBox, setOpenMessageBox] = useState(false);
  const [messages, setMessages] = useState([]);

  /**
   * Shows a message box with the provided messages
   * @param {array} messageArray - Array of message strings or i18n keys
   */
  const showMessage = (messageArray) => {
    setMessages(messageArray);
    setOpenMessageBox(true);
  };

  /**
   * Closes the message box and clears messages
   */
  const closeMessage = () => {
    setOpenMessageBox(false);
    setMessages([]);
  };

  return {
    openMessageBox,
    messages,
    showMessage,
    closeMessage
  };
};

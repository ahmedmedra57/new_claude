export const messageBoxHandler = (state, scope, type, programName) => {
  setProgramName(programName);
  // handleMessageBox(state, scope, type);
  const { openMessage, openLocationMessage, newMessage, newMessageTitle } =
    mainMessageBoxHandler(state, scope, type, programName);
  setMessage(newMessage);
  setMessageTitle(newMessageTitle);
  setOpenMessageBox(openMessage);
  setOpenLocationMessageBox(openLocationMessage);
};

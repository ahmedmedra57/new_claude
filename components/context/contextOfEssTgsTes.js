import { createContext, useState } from 'react';
import { useFaultsStore, useUserStore } from '../zustand-stores';
import mainMessageBoxHandler from '../../helpers/ess-tgs-tes-mc/mainMessageBoxHandler';
import { useSelector } from 'react-redux';

export const EssTgsTesContext = createContext();

const EssTgsTesProvider = ({ children }) => {
  // for pop up message
  const [openMessageBox, setOpenMessageBox] = useState(false);
  const [openLocationMessageBox, setOpenLocationMessageBox] = useState(false);
  const [openSpecLocationMessageBox, setOpenSpecLocationMessageBox] =
    useState(false);
  const [message, setMessage] = useState([]);
  const [programName, setProgramName] = useState('');
  const [messageTitle, setMessageTitle] = useState('');

  const messageBoxHandler = (
    state,
    scope,
    type,
    programName,
  ) => {
    setProgramName(programName);
    const {
      openMessage,
      openLocationMessage,
      openSpecificLocationMessage,
      newMessage,
      newMessageTitle,
    } = mainMessageBoxHandler(
      state,
      scope,
      type,
      programName,
    
    );
    setMessage(newMessage);
    setMessageTitle(newMessageTitle);
    setOpenMessageBox(openMessage);
    setOpenLocationMessageBox(openLocationMessage);
    setOpenSpecLocationMessageBox(openSpecificLocationMessage);
  };

  // used in global display and ess tgs tes MC
  // icon src options
  // const faultsState = useFaultsStore();
  // const userInfo = useUserStore();
  // const { isEssSwitch, isTesSwitch, isTgsSwitch } = userInfo;
  // const essFaultMessages = faultsState.messages.ess;
  // const tgsFaultMessages = faultsState.messages.tgs;
  // const tesFaultMessages = faultsState.messages.tes;
  // const essFaultsNumber = isEssSwitch ? essFaultMessages.length : 0;
  // const tgsFaultsNumber = isTesSwitch ? tgsFaultMessages.length : 0;
  // const tesFaultsNumber = isTgsSwitch ? tesFaultMessages.length : 0;
  // const isFault = essFaultsNumber + tgsFaultsNumber + tesFaultsNumber > 0;
  // const essSrc = isEssSwitch
  //   ? '/images/sidebar-ess.svg'
  //   : '/images/sidebar-ess-disabled.svg';

  // const tgsSrc = isTgsSwitch
  //   ? '/images/sidebar-tgs.svg'
  //   : '/images/sidebar-tgs-disabled.svg';

  // const tesSrc = isTesSwitch
  //   ? '/images/sidebar-tes.svg'
  //   : '/images/sidebar-tes-disabled.svg';

  // const faultSrc = isFault
  //   ? '/images/sidebar-faults-faults.svg'
  //   : '/images/sidebar-faults.svg';

  // const initialSrc1 = [
  //   '/images/sidebar-global-overview.svg',
  //   '/images/sidebar-telemetry.svg',
  //   '/images/sidebar-master-control.svg',
  // ];
  // const initialSrc2 = [essSrc, tgsSrc, tesSrc];
  // const initialSrc3 = ['/images/sidebar-heating-platform-disabled.svg'];

  // const initialSrc4 = [
  //   '/images/sidebar-setting.svg',
  //   '/images/sidebar-audit-trail.svg',
  //   faultSrc,
  //   '/images/sidebar-report-status.svg',
  // ];
  // const [src1, setSrc1] = useState(initialSrc1);
  // const [src2, setSrc2] = useState(initialSrc2);
  // const [src3, setSrc3] = useState(initialSrc3);
  // const [src4, setSrc4] = useState(initialSrc4);

  // const handleGroupA = (id) => {
  //   setSrc2(initialSrc2);
  //   setSrc3(initialSrc3);
  //   setSrc4(initialSrc4);
  //   const arr = [...initialSrc1];
  //   switch (id) {
  //     case 0:
  //       arr[id] = '/images/sidebar-global-overview-active.svg';
  //       setSrc1(arr);
  //       break;
  //     case 1:
  //       arr[id] = '/images/sidebar-telemetry-active.svg';
  //       setSrc1(arr);
  //       break;
  //     case 2:
  //       arr[id] = '/images/sidebar-master-control-active.svg';
  //       setSrc1(arr);
  //       break;
  //     default:
  //       break;
  //   }
  // };
  // const handleGroupB = (id) => {
  //   setSrc1(initialSrc1);
  //   setSrc3(initialSrc3);
  //   setSrc4(initialSrc4);
  //   const arr = [...initialSrc2];
  //   switch (id) {
  //     case 0:
  //       arr[id] = '/images/sidebar-ess-active.svg';
  //       setSrc2(arr);
  //       break;
  //     case 1:
  //       arr[id] = '/images/sidebar-tgs-active.svg';
  //       setSrc2(arr);
  //       break;
  //     case 2:
  //       arr[id] = '/images/sidebar-tes-active.svg';
  //       setSrc2(arr);
  //       break;
  //     default:
  //       break;
  //   }
  // };

  // const handleGroupC = (id) => {
  //   return;
  // };

  // const handleGroupD = (id) => {
  //   setSrc2(initialSrc2);
  //   setSrc3(initialSrc3);
  //   setSrc1(initialSrc1);
  //   const arr = [...initialSrc4];
  //   switch (id) {
  //     case 0:
  //       arr[id] = '/images/sidebar-setting-active.svg';
  //       setSrc4(arr);
  //       break;
  //     case 1:
  //       arr[id] = '/images/sidebar-audit-trail-active.svg';
  //       setSrc4(arr);
  //       break;
  //     case 2:
  //       arr[id] = isFault
  //         ? '/images/sidebar-faults-faults-active.svg'
  //         : '/images/sidebar-faults-active.svg';
  //       setSrc4(arr);
  //       break;
  //     case 3:
  //       arr[id] = '/images/sidebar-report-status-active.svg';
  //       setSrc4(arr);
  //       break;
  //     default:
  //       break;
  //   }
  // };

  // const handleOnClick = (group, id) => {
  //   switch (group) {
  //     case 'a':
  //       handleGroupA(id);
  //       break;
  //     case 'b':
  //       handleGroupB(id);
  //       break;
  //     case 'c':
  //       handleGroupC(id);
  //       break;
  //     case 'd':
  //       handleGroupD(id);
  //       break;
  //     default:
  //       break;
  //   }
  // };

  return (
    <EssTgsTesContext.Provider
      value={{
        openMessageBox,
        setOpenMessageBox,
        openLocationMessageBox,
        setOpenLocationMessageBox,
        message,
        setMessage,
        programName,
        setProgramName,
        messageTitle,
        setMessageTitle,
        messageBoxHandler,
        openSpecLocationMessageBox,
        setOpenSpecLocationMessageBox,
        // src1,
        // src2,
        // src3,
        // src4,
        // handleGroupA,
        // handleGroupB,
        // handleGroupC,
        // handleGroupD,
        // handleOnClick,
      }}
    >
      {children}
    </EssTgsTesContext.Provider>
  );
};
export default EssTgsTesProvider;

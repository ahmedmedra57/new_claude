import { createContext, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectFaults } from '../store/slices/FaultsSlice';
import { selectUserInfo } from '../store/slices/userSlice';
import { GROUPS_ACTIVE_TAPS, PERMISSIONS, tabsSrc } from '../../constants';

export const GeneralContext = createContext();

const GeneralProvider = ({ children }) => {
  const faultsState = useSelector(selectFaults);
  const userInfo = useSelector(selectUserInfo);
  const { isEssSwitch, isTesSwitch, isTgsSwitch, isHpSwitch, permissions } =
    userInfo;
  const isMasterControl = permissions[PERMISSIONS.MASTER_CONTROL];

  const {
    ess: essFaultMessages,
    tgs: tgsFaultMessages,
    tes: tesFaultMessages,
  } = faultsState.messages;

  const getFaultsNumber = (isSwitch, faultMessages) =>
    isSwitch ? faultMessages.length : 0;

  const essFaultsNumber = getFaultsNumber(isEssSwitch, essFaultMessages);
  const tgsFaultsNumber = getFaultsNumber(isTesSwitch, tgsFaultMessages);
  const tesFaultsNumber = getFaultsNumber(isTgsSwitch, tesFaultMessages);

  const isFault = essFaultsNumber + tgsFaultsNumber + tesFaultsNumber > 0;

  const getIconSrc = (isSwitch, tapIcons) =>
    isSwitch ? tapIcons.src : tapIcons.inactiveSrc;

  const tabsSrcInitial = useMemo(() => {
    const initialSrcGroupA = [
      tabsSrc.globalOverview.src,
      tabsSrc.telemetry.src,
      getIconSrc(isMasterControl, tabsSrc.masterControl),
    ];
    const initialSrcGroupB = [
      getIconSrc(isEssSwitch, tabsSrc.ess),
      getIconSrc(isTgsSwitch, tabsSrc.tgs),
      getIconSrc(isTesSwitch, tabsSrc.tes),
    ];
    const initialSrcGroupC = [getIconSrc(isHpSwitch, tabsSrc.heatingPlatform)];
    // const initialSrcGroupC = [tabsSrc.heatingPlatform.inactiveSrc];
    const initialSrcGroupD = [
      tabsSrc.setting.src,
      tabsSrc.auditTrail.src,
      isFault ? tabsSrc.faults.redSrc : tabsSrc.faults.src,
      tabsSrc.reportStatus.src,
    ];
    return {
      groupA: initialSrcGroupA,
      groupB: initialSrcGroupB,
      groupC: initialSrcGroupC,
      groupD: initialSrcGroupD,
    };
  }, [isMasterControl, isEssSwitch, isTgsSwitch, isTesSwitch, isFault]);

  const [tapsSrc, setTapsSrc] = useState({ ...tabsSrcInitial });

  const handleGroupChange = (group, id) => {
    const newSrc = JSON.parse(JSON.stringify(tabsSrcInitial[group]));
    if (isFault && group === 'groupD' && id === 2) {
      newSrc[id] = tabsSrc.faults.activeRedSrc;
    } else {
      newSrc[id] = GROUPS_ACTIVE_TAPS[group][id];
    }
    setTapsSrc({ ...tabsSrcInitial, [group]: newSrc });
  };

  const handleOnClick = (group, id) => {
    if (!group) return;
    handleGroupChange(group, id);
  };

  return (
    <GeneralContext.Provider
      value={{
        src1: tapsSrc.groupA,
        src2: tapsSrc.groupB,
        src3: tapsSrc.groupC,
        src4: tapsSrc.groupD,
        handleOnClick,
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};

export default GeneralProvider;

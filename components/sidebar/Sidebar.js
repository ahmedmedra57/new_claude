import { useContext, useEffect, useState, memo } from 'react';
import { useFaultsStore, useUserStore } from '../zustand-stores';
import { useSelector } from 'react-redux';

import styled, { css } from 'styled-components';
import { alignItemsFlexStart, layerA90Deg } from '../styles/commonStyles';

import FaultsReportHoverBox from '../faults/FaultsReportHoverBox';
import ButtonGroup from './ButtonGroup';
import { createBrowserHistory } from 'history';
import { GeneralContext } from '../context/contextOfGeneral';
import { PERMISSIONS } from '../../constants';

const Sidebar = () => {
  // Global states
  const userInfo = useUserStore();
  const {
    isEssSwitch,
    isTesSwitch,
    isTgsSwitch,
    isHpSwitch,
    isAteSwitch,
    permissions,
  } = userInfo;
  const isMasterControl = permissions[PERMISSIONS.MASTER_CONTROL];
  const faultsState = useFaultsStore();
  const essFaultMessages = faultsState.messages.ess;
  const tgsFaultMessages = faultsState.messages.tgs;
  const tesFaultMessages = faultsState.messages.tes;
  const essFaultsNumber = isEssSwitch ? essFaultMessages.length : 0;
  const tgsFaultsNumber = isTesSwitch ? tgsFaultMessages.length : 0;
  const tesFaultsNumber = isTgsSwitch ? tesFaultMessages.length : 0;
  const isFault = essFaultsNumber + tgsFaultsNumber + tesFaultsNumber > 0;

  // useContext
  const { src1, src2, src3, src4, handleOnClick } = useContext(GeneralContext);

  // local states
  const [openFaultsReport, setOpenFaultsReport] = useState(false);

  const link1 = ['/', '/telemetry', '/masterControl'];
  const link2 = ['/ess', '/tgs', '/tes'];
  const link3 = ['/heatingPlatform'];
  const link4 = ['/settings', '/auditTrail', '/faults', '/reportStatus'];

  const history = createBrowserHistory();

  const { pathname } = history.location;

  useEffect(() => {
    const locationA = link1.some((el) => pathname === el);
    const locationB = link2.some((el) => pathname === el);
    const locationC = link3.some((el) => pathname === el);
    const locationD = link4.some((el) => pathname === el);

    if (locationA) {
      const id = pathname === '/' ? 0 : pathname === '/telemetry' ? 1 : 2;
      handleOnClick('groupA', id);
    } else if (locationB) {
      const id = pathname === '/ess' ? 0 : pathname === '/tgs' ? 1 : 2;
      handleOnClick('groupB', id);
    } else if (locationC) {
      handleOnClick('groupC', 0);
    } else {
      const id =
        pathname === '/settings'
          ? 0
          : pathname === '/auditTrail'
          ? 1
          : pathname === '/faults'
          ? 2
          : 3;
      handleOnClick('groupD'.id);
    }

    const path = `${pathname}${history.location.hash || ''}`;
    history.push(`?path=${path}`);
  }, [pathname, isFault]);

  const groups = [
    {
      name: 'groupA',
      src: src1,
      link: link1,
      disabled: [false, false, !isMasterControl],
    },
    {
      name: 'groupB',
      src: src2,
      link: link2,
      disabled: [!isEssSwitch, !isTgsSwitch, !isTesSwitch],
    },
    {
      name: 'groupC',
      src: src3,
      link: link3,
      disabled: [!isHpSwitch],
      // !!TODO: remove the code below and put back the code above
      // disabled: [isHpSwitch],
    },
    {
      name: 'groupD',
      src: src4,
      link: link4,
      disabled: [false, false, false, false],
      isFault,
      setOpenFaultsReport,
    },
  ];

  return (
    <StylingWrapper>
      <Wrapper positionRelative={openFaultsReport}>
        {groups.map((group, index) => (
          <ButtonGroup
            {...group}
            key={group.name}
            group={group.name}
            buttonArr={group.src}
            handleOnClick={handleOnClick}
          />
        ))}

        {openFaultsReport && <FaultsReportHoverBox />}
      </Wrapper>
    </StylingWrapper>
  );
};
export default memo(Sidebar);

const StylingWrapper = styled.div`
  height: 100%;

  ${alignItemsFlexStart}

  height: 100%;
  margin-left: 10rem;
  margin-top: 5rem;
`;

const Wrapper = styled.div`
  width: 64px;
  border-radius: 37px;

  ${layerA90Deg}
  padding: 5rem 0;

  display: flex;
  flex-direction: column;
  align-items: center;

  ${(p) =>
    p.positionRelative &&
    css`
      position: relative;
    `}
`;

import { useContext } from 'react';
import { useESSSwitchStore, useMCIsExpandedStore, useUnitsStore, useUserStore } from '../zustand-stores';


import { useMediaQuery } from 'react-responsive';

import styled from 'styled-components';

import MasterControlBySwitch from '../commonComponentsMC/MasterControlBySwitch';
import IntegratedSwitchLocations from '../commonComponentsMC/IntegratedSwitchLocations';
import {
  useGetScheduleQueries,
  useGetThermocouplesQueries,
  useSetZoneOpeningsState,
} from '../../hooks';
import {
  getEssZones,
} from '../../services';
import { useQuery } from 'react-query';

import {
  loopMachinesHandler,
} from '../../helpers/ess-tgs-tes-mc';
import { EssTgsTesContext } from '../context/contextOfEssTgsTes';
import { useSetOpenMasterControl } from '../../hooks/ess_tgs_tes_hooks/useSetOpenMasterControl';

const EssMain = ({ isMasterControl }) => {
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  const { essSwitch,flatEssSwitch } = useESSSwitchStore();

  const MCIsExpanded = useMCIsExpandedStore();
  const { masterControl } = MCIsExpanded.ess;

  const unitsStatus = useUnitsStore();
  const { isF } = unitsStatus;

  const { messageBoxHandler } = useContext(EssTgsTesContext);

  
  useGetScheduleQueries(flatEssSwitch, 'ESS');
  useGetThermocouplesQueries(flatEssSwitch, 'ess');

  useSetOpenMasterControl('ess', isMobile);

  useSetZoneOpeningsState(
    flatEssSwitch,
    masterControl,
    handleOpenMachineController,
    'ess'
  );

  const { data: essZones } = useQuery(
    ['essZones', 'structured'],
    () => getEssZones({ structured: true }),
    {
      enabled: !!handleAccessToken,
      staleTime: Infinity,
    }
  );

  const { permissions } = useUserStore();

  const integratedButtonHandler = (
    id,
    state,
    scope,
    temp,
    data,
    type,
    specificLocation
  ) => {
    if(permissions.WRITE){
    loopMachinesHandler(
      id,
      state,
      scope,
      type,
      temp,
      data,
      isF,
      essZones,
      'ESS',
      flatEssSwitch,
      dispatch,
      handleUnSelectIndividualMachine,
      essSpecificLocationUnselectMachinesHandler,
      handleResetAllSelectBySwitch,
      handleResetAllSelectByLocation,
      messageBoxHandler,
      essSwitch,
    );
  }
  };

  return (
    <Wrapper>
      {isMasterControl || (
        <Section>
          <MasterControlBySwitch
            swtName='ess'
            buttonHandler={integratedButtonHandler}
          />
        </Section>
      )}

      <Section>
        <IntegratedSwitchLocations
          swtName='ess'
          buttonHandler={integratedButtonHandler}
        />
      </Section>
    </Wrapper>
  );
};

export default EssMain;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Section = styled.section`
  &:first-child {
    margin-bottom: 8px;
  }
`;

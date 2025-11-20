import { useContext } from 'react';
import { useMCIsExpandedStore, useTESSwitchStore, useUnitsStore } from '../zustand-stores';


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
  getTesZones,
} from '../../services';
import { useQuery } from 'react-query';
import { useSetOpenMasterControl } from '../../hooks/ess_tgs_tes_hooks/useSetOpenMasterControl';
import { EssTgsTesContext } from '../context/contextOfEssTgsTes';
import { loopMachinesHandler } from '../../helpers/ess-tgs-tes-mc';

const TesMain = ({ isMasterControl }) => {
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  const { tesSwitch ,flatTesSwitch } = useTESSwitchStore();
  const MCIsExpanded = useMCIsExpandedStore();
  const { masterControl } = MCIsExpanded.tes;

  const unitsStatus = useUnitsStore();
  const { isF } = unitsStatus;

  
  const { messageBoxHandler } = useContext(EssTgsTesContext);

  useGetScheduleQueries(flatTesSwitch, 'TES');
  useGetThermocouplesQueries(flatTesSwitch, 'tes');

  useSetOpenMasterControl('tes', isMobile);

  useSetZoneOpeningsState(
    flatTesSwitch,
    masterControl,
    tesHandleOpenMachineController,
    'tes'
  );

  const { data: tesZones } = useQuery(['tesZones','structured'], ()=>getTesZones({structured:true}), {
    enabled: !!handleAccessToken,
    staleTime: Infinity,
  });

  const integratedButtonHandler = (
    id,
    state,
    scope,
    temp,
    data,
    type,
    specificLocation
  ) => {
    loopMachinesHandler(
      id,
      state,
      scope,
      type,
      temp,
      data,
      isF,
      tesZones,
      'TES',
      flatTesSwitch,
      dispatch,
      tesHandleUnSelectIndividualMachine,
      tesSpecificLocationUnselectMachinesHandler,
      handleResetAllSelectBySwitch,
      handleResetAllSelectByLocation,
      messageBoxHandler,
      tesSwitch,
    );
  };

  return (
    <Wrapper>
      {isMasterControl || (
        <Section>
          <MasterControlBySwitch
            swtName='tes'
            buttonHandler={integratedButtonHandler}
          />
        </Section>
      )}

      <Section>
        <IntegratedSwitchLocations
          swtName='tes'
          buttonHandler={integratedButtonHandler}
        />
      </Section>
    </Wrapper>
  );
};

export default TesMain;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const Section = styled.section`
  &:first-child {
    margin-bottom: 8px;
  }
`;

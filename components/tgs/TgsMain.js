import { useContext } from 'react';
import {
  useTGSSwitchStore,
  useMCIsExpandedStore,
  useUnitsStore,
  useMasterControlBySwitchSelectStore,
  useMasterControlSelectByLocationStore,
  useUserStore,
} from '../zustand-stores';

import { useMediaQuery } from 'react-responsive';

import styled from 'styled-components';
import MasterControlBySwitch from '../commonComponentsMC/MasterControlBySwitch';
import IntegratedSwitchLocations from '../commonComponentsMC/IntegratedSwitchLocations';
import { useGetScheduleQueries, useSetZoneOpeningsState } from '../../hooks';
import {
  getTgsZones,
} from '../../services';
import { useQuery } from 'react-query';
import {
  EssTgsTesContext,
} from '../context/contextOfEssTgsTes';
import { loopMachinesHandler } from '../../helpers/ess-tgs-tes-mc';
import { useSetOpenMasterControl } from '../../hooks/ess_tgs_tes_hooks/useSetOpenMasterControl';

const TgsMain = ({ isMasterControl }) => {
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  const { tgsSwitch, flatTgsSwitch } = useTGSSwitchStore();
  const MCIsExpanded = useMCIsExpandedStore();
  const { masterControl } = MCIsExpanded.tgs;

  const { isF } = useUnitsStore();
  const { accessToken } = useUserStore();

  const { messageBoxHandler } = useContext(EssTgsTesContext);

  // Zustand actions
  const { setOpenMachineController, setUnSelectIndividualMachine, setSpecificLocationUnselectMachines } = useTGSSwitchStore();
  const { setResetAllSelectBySwitch } = useMasterControlBySwitchSelectStore();
  const { setResetAllSelectByLocation } = useMasterControlSelectByLocationStore();

  useGetScheduleQueries(flatTgsSwitch, 'TGS');

  useSetOpenMasterControl('tes', isMobile);

  useSetZoneOpeningsState(
    flatTgsSwitch,
    masterControl,
    setOpenMachineController,
    'tgs'
  );

  const { data: tgsZones } = useQuery(['tgsZones','structured'], ()=>getTgsZones({structured:true}), {
    enabled: !!accessToken,
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
      tgsZones,
      'TGS',
      flatTgsSwitch,
      null, // No dispatch needed for Zustand
      setUnSelectIndividualMachine,
      setSpecificLocationUnselectMachines,
      setResetAllSelectBySwitch,
      setResetAllSelectByLocation,
      messageBoxHandler,
      tgsSwitch
    );
  };

  return (
    <Wrapper>
      {isMasterControl || (
        <Section>
          <MasterControlBySwitch
            swtName='tgs'
            buttonHandler={integratedButtonHandler}
          />
        </Section>
      )}

      <Section>
        <IntegratedSwitchLocations
          swtName='tgs'
          buttonHandler={integratedButtonHandler}
        />
      </Section>
    </Wrapper>
  );
};

export default TgsMain;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const Section = styled.section`
  &:first-child {
    margin-bottom: 8px;
  }
`;

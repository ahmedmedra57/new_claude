import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectTesSwitch,
  tesHandleOpenMachineController,
  tesHandleUnSelectIndividualMachine,
  tesSpecificLocationUnselectMachinesHandler,
} from '../store/slices/tesSwitchSlice';

import {
  selectMCIsExpanded,
} from '../store/slices/MCIsExpandedSlice';

import { useMediaQuery } from 'react-responsive';

import styled from 'styled-components';

import MasterControlBySwitch from '../commonComponentsMC/MasterControlBySwitch';
import IntegratedSwitchLocations from '../commonComponentsMC/IntegratedSwitchLocations';
import { selectUnits } from '../store/slices/settings/unitsSlice';
import { handleResetAllSelectBySwitch } from '../store/slices/masterControlBySwitchSelectSlice';
import { handleResetAllSelectByLocation } from '../store/slices/masterControlSelectByLocationSlice';
import {
  useGetScheduleQueries,
  useGetThermocouplesQueries,
  useSetZoneOpeningsState,
} from '../../hooks';
import {
  getTesZones,
} from '../../services';
import { useQuery } from 'react-query';
import { handleAccessToken } from '../store/slices/userSlice';
import { useSetOpenMasterControl } from '../../hooks/ess_tgs_tes_hooks/useSetOpenMasterControl';
import { EssTgsTesContext } from '../context/contextOfEssTgsTes';
import { loopMachinesHandler } from '../../helpers/ess-tgs-tes-mc';

const TesMain = ({ isMasterControl }) => {
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  const { tesSwitch ,flatTesSwitch } = useSelector(selectTesSwitch);
  const MCIsExpanded = useSelector(selectMCIsExpanded);
  const { masterControl } = MCIsExpanded.tes;

  const unitsStatus = useSelector(selectUnits);
  const { isF } = unitsStatus;

  const dispatch = useDispatch();

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

import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectTgsSwitch,
  tgsHandleOpenMachineController,
  tgsHandleUnSelectIndividualMachine,
  tgsSpecificLocationUnselectMachinesHandler,
} from '../store/slices/tgsSwitchSlice';

import { useMediaQuery } from 'react-responsive';

import styled from 'styled-components';
import MasterControlBySwitch from '../commonComponentsMC/MasterControlBySwitch';
import IntegratedSwitchLocations from '../commonComponentsMC/IntegratedSwitchLocations';
import {
  selectMCIsExpanded,
} from '../store/slices/MCIsExpandedSlice';
import { selectUnits } from '../store/slices/settings/unitsSlice';
import { handleResetAllSelectBySwitch } from '../store/slices/masterControlBySwitchSelectSlice';
import { handleResetAllSelectByLocation } from '../store/slices/masterControlSelectByLocationSlice';
import { useGetScheduleQueries, useSetZoneOpeningsState } from '../../hooks';
import {
  getTgsZones,
} from '../../services';
import { useQuery } from 'react-query';
import { handleAccessToken } from '../store/slices/userSlice';
import {
  EssTgsTesContext,
} from '../context/contextOfEssTgsTes';
import { loopMachinesHandler } from '../../helpers/ess-tgs-tes-mc';
import { useSetOpenMasterControl } from '../../hooks/ess_tgs_tes_hooks/useSetOpenMasterControl';

const TgsMain = ({ isMasterControl }) => {
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  const { tgsSwitch,flatTgsSwitch } = useSelector(selectTgsSwitch);
  const MCIsExpanded = useSelector(selectMCIsExpanded);
  const { masterControl } = MCIsExpanded.tgs;

  const unitsStatus = useSelector(selectUnits);
  const { isF } = unitsStatus;

  const { messageBoxHandler } = useContext(EssTgsTesContext);

  const dispatch = useDispatch();

  useGetScheduleQueries(flatTgsSwitch, 'TGS');

  useSetOpenMasterControl('tes', isMobile);

  useSetZoneOpeningsState(
    flatTgsSwitch,
    masterControl,
    tgsHandleOpenMachineController,
    'tgs'
  );

  const { data: tgsZones } = useQuery(['tgsZones','structured'], ()=>getTgsZones({structured:true}), {
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
      tgsZones,
      'TGS',
      flatTgsSwitch,
      dispatch,
      tgsHandleUnSelectIndividualMachine,
      tgsSpecificLocationUnselectMachinesHandler,
      handleResetAllSelectBySwitch,
      handleResetAllSelectByLocation,
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

import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import styled from 'styled-components';
import { useQuery } from 'react-query';

import MasterControlBySwitch from './MasterControlBySwitch';
import IntegratedSwitchLocations from './IntegratedSwitchLocations';
import { selectMCIsExpanded } from '../store/slices/MCIsExpandedSlice';
import { selectUnits } from '../store/slices/settings/unitsSlice';
import { handleResetAllSelectBySwitch } from '../store/slices/masterControlBySwitchSelectSlice';
import { handleResetAllSelectByLocation } from '../store/slices/masterControlSelectByLocationSlice';
import { handleAccessToken, selectUserPermissions } from '../store/slices/userSlice';
import {
  useGetScheduleQueries,
  useGetThermocouplesQueries,
  useSetZoneOpeningsState,
} from '../../hooks';
import { useSetOpenMasterControl } from '../../hooks/ess_tgs_tes_hooks/useSetOpenMasterControl';
import { EssTgsTesContext } from '../context/contextOfEssTgsTes';
import { loopMachinesHandler } from '../../helpers/ess-tgs-tes-mc';
import { systemConfigs } from './systemConfigs';

/**
 * Reusable SystemMain component for ESS, TGS, and TES systems
 * Eliminates code duplication across the three system main components
 *
 * @param {Object} props
 * @param {'ess' | 'tgs' | 'tes'} props.systemType - The type of system (ess, tgs, or tes)
 * @param {boolean} props.isMasterControl - Whether this is being used in master control mode
 */
const SystemMain = ({ systemType, isMasterControl }) => {
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  // Get configuration for this system type
  const config = systemConfigs[systemType];

  if (!config) {
    throw new Error(`Invalid system type: ${systemType}. Must be 'ess', 'tgs', or 'tes'`);
  }

  // Redux selectors
  const switchState = useSelector(config.selectSwitch);
  const systemSwitch = switchState[systemType + 'Switch'];
  const flatSystemSwitch = switchState['flat' + systemType.charAt(0).toUpperCase() + systemType.slice(1) + 'Switch'];

  const MCIsExpanded = useSelector(selectMCIsExpanded);
  const { masterControl } = MCIsExpanded[systemType];
  const unitsStatus = useSelector(selectUnits);
  const { isF } = unitsStatus;
  const permissions = useSelector(selectUserPermissions);

  const { messageBoxHandler } = useContext(EssTgsTesContext);
  const dispatch = useDispatch();

  // Hooks
  useGetScheduleQueries(flatSystemSwitch, config.systemType);

  // Always call useGetThermocouplesQueries - for TGS it will be a no-op
  // as TGS machines don't have thermocouple data
  useGetThermocouplesQueries(flatSystemSwitch, systemType);

  useSetOpenMasterControl(systemType, isMobile);

  useSetZoneOpeningsState(
    flatSystemSwitch,
    masterControl,
    config.actions.handleOpenMachineController,
    systemType
  );

  // Fetch zone data
  const { data: zones } = useQuery(
    [`${systemType}Zones`, 'structured'],
    () => config.getZones({ structured: true }),
    {
      enabled: !!handleAccessToken,
      staleTime: Infinity,
    }
  );

  // Integrated button handler
  const integratedButtonHandler = (
    id,
    state,
    scope,
    temp,
    data,
    type,
    specificLocation
  ) => {
    // Check permissions if required by this system
    if (config.requiresPermissionCheck && !permissions.WRITE) {
      return;
    }

    loopMachinesHandler(
      id,
      state,
      scope,
      type,
      temp,
      data,
      isF,
      zones,
      config.systemType,
      flatSystemSwitch,
      dispatch,
      config.actions.handleUnSelectIndividualMachine,
      config.actions.specificLocationUnselectMachinesHandler,
      handleResetAllSelectBySwitch,
      handleResetAllSelectByLocation,
      messageBoxHandler,
      systemSwitch
    );
  };

  return (
    <Wrapper>
      {isMasterControl || (
        <Section>
          <MasterControlBySwitch
            swtName={systemType}
            buttonHandler={integratedButtonHandler}
          />
        </Section>
      )}

      <Section>
        <IntegratedSwitchLocations
          swtName={systemType}
          buttonHandler={integratedButtonHandler}
        />
      </Section>
    </Wrapper>
  );
};

export default SystemMain;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Section = styled.section`
  &:first-child {
    margin-bottom: 8px;
  }
`;

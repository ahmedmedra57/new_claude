import { useEffect, useState } from 'react';
import { useLocationsStore } from '../zustand-stores';
import { useTranslation } from 'react-i18next';

import styled from 'styled-components';
import { flexDirectionColumn, layerA } from '../styles/commonStyles';

import TitleContainer from '../TitleContainer';
import AuditTrailComponentBySwitch from './AuditTrailComponentBySwitch';
import ATMainSelect from './ATMainSelect';

import {
  extractUniquePropertyValues,
  formatTime,
  getLocationAssignedUsersByDeviceIds,
} from '../../helpers/helpers';
import { getAuditTrailService } from '../../services/auditTrail.service';
import { useCheckControlPermsission } from '../../hooks';

const AuditTrailMain = () => {
  const { t } = useTranslation();
  const [isReadyToRender, setIsReadyToRender] = useState(false);
  const [userSelect, setUserSelect] = useState([]);
  const [auditTrailData, setAuditTrailData] = useState({});
  const checkSwitchPermission=useCheckControlPermsission();
  const locations = useLocationsStore();
  const { all: allLocations } = locations;
  const [disableSettings, setDisableSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState(null);
  const AUDIT_TRAIL_Action = [
    'MASTER_CONTROL',
    'GLOBAL_MASTER_CONTROL',
    'FAST_MASTER_CONTROL',
    'LOCAL_MASTER_CONTROL',
    'SSR_RESET',
    'THERMOCOUPLE_RESET',
    'GROUND_RESET',
    'HPLP_RESET',
    'LOAD_EXCEED_RESET',
    'TIMEOUT_RESET',
    'BMS_RESET',
    'GLOBAL_TELEMETRY_OVERVIEW',
    'ACTION',
  ];

  // array to use for map
  const componentsStatus = {
    ess: checkSwitchPermission('ess'),
    tgs: checkSwitchPermission('tgs'),
    tes: checkSwitchPermission('tes'),
    hp: checkSwitchPermission('hp'),
    ate: checkSwitchPermission('ate'),
    setting: true,
    aat: true,
  };

  // to Backend --- use "userSelect"
  const handleUserSelect = async (selectedData) => {
   
    // selectedData = [true(name) || false(location), dates, [...selected name or machines] ]
    const startDate = formatTime(selectedData[1].start, true);
    const endDate = formatTime(selectedData[1].end, true);
    if (selectedData[0]) {
      //serach by user name
      setUserSelect(selectedData);
      const userIds = extractUniquePropertyValues(selectedData[2], 'user_id');
      const AuditTrailPayload = (actionType = '', deviceType = '') => ({
        userIds,
        startDate,
        endDate,
        actionType: actionType,
        deviceType: deviceType,
      });
      const settingsByUesrnamePayload = {
        startDate,
        endDate,
        actionType: ['AUTH', 'SETTING', 'HEAT_CONFIGURATION'],
        userIds: userIds,
      };
      const additionalActionTakenByUsernamePayload = {
        startDate,
        endDate,
        userIds,
        actionType: ['GLOBAL_DATA_TELEMETRY_OVERVIEW', 'AUDIT_TRAIL'],
      };
      // all needed requests
      const allAduitTrail = {
        EssActions: getAuditTrailService(
          AuditTrailPayload(AUDIT_TRAIL_Action, 'ESS'),
          200
        ),
        EssFaults: getAuditTrailService(
          AuditTrailPayload(['FAULT'], 'ESS'),
          200
        ),
        TesActions: getAuditTrailService(
          AuditTrailPayload(AUDIT_TRAIL_Action, 'TES'),
          200
        ),
        TesFaults: getAuditTrailService(
          AuditTrailPayload(['FAULT'], 'TES'),
          200
        ),
        TgsActions: getAuditTrailService(
          AuditTrailPayload(AUDIT_TRAIL_Action, 'TGS'),
          200
        ),
        TgsFaults: getAuditTrailService(
          AuditTrailPayload(['FAULT'], 'TGS'),
          200
        ),
        // private for user
        settings: getAuditTrailService(settingsByUesrnamePayload, 1000),
        //overView
        additionalActionTaken: getAuditTrailService(
          additionalActionTakenByUsernamePayload,
          1000
        ),
      };
      setSearchQuery(AuditTrailPayload());

      const promises = Object.values(allAduitTrail);
      await Promise.all(promises)
        .then((results) => {
          let AduitTrailData = {
            ess: {
              actions: results[0],
              faults: results[1],
            },
            tes: {
              actions: results[2],
              faults: results[3],
            },
            tgs: {
              actions: results[4],
              faults: results[5],
            },
            setting: results[6],
            aat: results[7],
            hp: {},
            ate: {},
          };
          setAuditTrailData(AduitTrailData);
          setIsReadyToRender(true);
        })
        .catch((error) => {
          throw error;
        });
    } else {
      //serach by location
      const deviceIds = extractUniquePropertyValues(selectedData[2], 'machine');
      setUserSelect(selectedData);
      const AuditTrailPayload = (actionType = '', deviceType = '') => ({
        deviceIds,
        startDate,
        endDate,
        actionType: actionType,
        deviceType: deviceType,
      });

      const settingsByLoctionPayload = {
        startDate,
        endDate,
        actionType: ['SETTING', 'HEAT_CONFIGURATION'],
        userIds: getLocationAssignedUsersByDeviceIds(deviceIds, allLocations),
      };
      const additionalActionTakenByLoctionPayload = {
        startDate,
        endDate,
        deviceIds,
        actionType: ['GLOBAL_DATA_TELEMETRY_OVERVIEW', 'AUDIT_TRAIL'],
      };
      // all needed requests
      const allAduitTrail = {
        EssActions: getAuditTrailService(
          AuditTrailPayload(AUDIT_TRAIL_Action, 'ESS'),
          200
        ),
        EssFaults: getAuditTrailService(
          AuditTrailPayload(['FAULT'], 'ESS'),
          1000
        ),
        TesActions: getAuditTrailService(
          AuditTrailPayload(AUDIT_TRAIL_Action, 'TES'),
          200
        ),
        TesFaults: getAuditTrailService(
          AuditTrailPayload(['FAULT'], 'TES'),
          1000
        ),
        TgsActions: getAuditTrailService(
          AuditTrailPayload(AUDIT_TRAIL_Action, 'TGS'),
          200
        ),
        TgsFaults: getAuditTrailService(
          AuditTrailPayload(['FAULT'], 'TGS'),
          200
        ),
        settings: getAuditTrailService(settingsByLoctionPayload, 1000),
        additionalActionTaken: getAuditTrailService(
          additionalActionTakenByLoctionPayload,
          1000
        ),
      };
      setSearchQuery(AuditTrailPayload());

      const promises = Object.values(allAduitTrail);
      await Promise.all(promises)
        .then((results) => {
          let AduitTrailData = {
            ess: {
              actions: results[0],
              faults: results[1],
            },
            tes: {
              actions: results[2],
              faults: results[3],
            },
            tgs: {
              actions: results[4],
              faults: results[5],
            },
            setting: results[6],
            aat: results[7],
            hp: {},
            ate: {},
          };
          setAuditTrailData(AduitTrailData);
          setIsReadyToRender(true);
        })
        .catch((error) => {
          throw error;
        });
    }
  };

  useEffect(() => {}, []);

  return (
    <Wrapper>
      <TitleContainer title={t('auditTrail.title')} />
      <ATMainSelect
        isReadyToRender={isReadyToRender}
        handleSelection={handleUserSelect}
        setDisableSettings={setDisableSettings}
      />
      <SectionMain>
        {Object.keys(componentsStatus).map((component, index) => {
          return (
            <AuditTrailComponentBySwitch
              key={index}
              componentName={component}
              isReadyToRender={isReadyToRender}
              active={componentsStatus[component]}
              userSelect={userSelect}
              data={auditTrailData[component] ?? {}}
              disableSettings={disableSettings}
              searchQuery={searchQuery}
            />
          );
        })}
      </SectionMain>
    </Wrapper>
  );
};

export default AuditTrailMain;

const Wrapper = styled.div`
  min-height: 674rem;
  width: 1216rem;
`;

const SectionMain = styled.section`
  width: 1216px;

  border-radius: 40px 40px 40px 40px;
  ${layerA}
  ${flexDirectionColumn}
  padding: 2px 0;
`;

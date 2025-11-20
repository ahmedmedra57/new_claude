import { useEffect, useState, useMemo } from 'react';
import { useLocationsStore, useUnitsStore, useUserStore } from '../zustand-stores';
import { useTranslation } from 'react-i18next';

import styled, { css } from 'styled-components';

import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA180Deg,
  layerA,
  layerC,
  layerBDisabled,
  layerADisabled180Deg,
  justifyContentFlexEnd,
  justifyContentFlexStart,
} from '../styles/commonStyles';

import ExpandButton from '../faults/ExpandButton';
import {
  DUMMY_AUDIT_TRAIL,
  DUMMY_LOGIN_INFO,
} from '../DUMMY/DUMMY_AUDIT_TRAIL';

import IntegratedHistoryComponent from './IntegratedHistoryComponent';
import {
  auditTrailActionsDataForamt,
  auditTrailSettingsDataForamt,
  getESSAuditTrailFaults,
  getTESAuditTrailFaults,
  getTgsAuditTrailFaults,
} from '../../helpers/helpers';
const AuditTrailComponentBySwitch = ({
  componentName,
  isReadyToRender,
  active,
  userSelect,
  data,
  disableSettings,
  searchQuery
}) => {
  const { t } = useTranslation();
  // userSelect[0]=> true => name or false => location

  // const permissions = useUserStore();
  // const active = permissions.READ;

  const [isExpanded, setIsExpanded] = useState(false);
  const Locations = useLocationsStore();
  const swtStatus = Locations[componentName];
  const { all: allLocations } = Locations;
  // userSelect[0] -> true (userName) || false(locations)
  // userSelect[1] -> date
  // userSelect[2] -> selected names || selected machines

  // Temporary logic for render data depending on user select until connected with BE
  // A userName

  const unitsState = useUnitsStore();
  const { isF } = unitsState;

  const userInfo = useUserStore();
  const { allUsers } = userInfo;

  const actionData = useMemo(() => {
    return auditTrailActionsDataForamt(data?.actions, swtStatus, isF, allUsers);
  }, [allUsers, data?.actions, isF, swtStatus]);

  const sortByName = userSelect[2]?.map((name) =>
    actionData?.filter((data) => data.userName === name)
  );

  sortByName?.forEach((named) =>
    named.forEach(
      (command) => command.system === componentName && actionData.push(command)
    )
  );

  const faultData = useMemo(() => {
    return componentName === 'ess'
      ? getESSAuditTrailFaults(data?.faults, swtStatus)
      : componentName === 'tgs'
      ? getTgsAuditTrailFaults(data?.faults, swtStatus)
      : getTESAuditTrailFaults(data?.faults, swtStatus);
  }, [componentName, data?.faults, swtStatus]);

  const settingsData = useMemo(() => {
    if (Array.isArray(data)) {
      const settings = data.filter((data) => data?.row.actionType === 'AUTH');
      return componentName === 'setting'
        ? auditTrailSettingsDataForamt(settings)
        : []; 
    }
  }, [componentName, data]);

  const settingsOptionsData = useMemo(() => {
    if (Array.isArray(data)) {
      const settingsOptions = data?.filter((data) =>
        data?.row.actionType === 'SETTING' || data?.row.actionType === 'HEAT_CONFIGURATION'
      );
      return componentName === 'setting'
        ? auditTrailActionsDataForamt(settingsOptions, allLocations, isF, allUsers)
        : [];
    }
  }, [data]);

  const additionalActionTakenData = useMemo(() => {
    if (Array.isArray(data)) {
      return componentName === 'aat'
        ? auditTrailActionsDataForamt(data, allLocations, isF, allUsers)
        : [];
    }
  }, [data]);

  let isSettingsComponent = componentName === 'setting';

  // Temporary logic for render data depending on user select until connected with BE

  const componentTitle =
    componentName === 'ess'
      ? t('auditTrail.components.electricalSwitchSystems')
      : componentName === 'tgs'
      ? t('auditTrail.components.typhoonGasSystems')
      : componentName === 'tes'
      ? t('auditTrail.components.typhoonElectricSystems')
      : componentName === 'hp'
      ? t('auditTrail.components.heatingPlatforms')
      : componentName === 'ate'
      ? t('auditTrail.components.additionalTrackEquipment')
      : componentName === 'aat'
      ? t('auditTrail.components.additionalActionTaken')
      : t('auditTrail.components.settings');

  const actionNumber = isReadyToRender ? actionData.length : 0;
  const faultsNumber = isReadyToRender ? faultData.length : 0;
  const settingsNumber = isReadyToRender ? (settingsData?.length + settingsOptionsData?.length) : 0;
  const additionalActionTakenNumber = isReadyToRender ? additionalActionTakenData?.length : 0;

  const imageSrc = !active
    ? `images/sidebar-${componentName}-disabled.svg`
    : isExpanded
    ? `images/sidebar-${componentName}-active.svg`
    : `images/sidebar-${componentName}.svg`;

    const settingsSectionName = disableSettings ? ['settingsOptions'] : ['settings', 'settingsOptions'];

  return (
    <Wrapper isExpanded={isExpanded}>
      <InnerWrapper isExpanded={isExpanded} disabled={!active}>
        <LogoWrapper
          onClick={() =>
            active && isReadyToRender && setIsExpanded(!isExpanded)
          }
          disabled={!active}
        >
          <Img src={imageSrc} />
        </LogoWrapper>
        <SectionTitle>
          <Title>{componentTitle}</Title>
          <Divider option={componentName} active={active}></Divider>
        </SectionTitle>

        {componentName === 'setting' && (
          <DisplaySummation disabled={!active} isOptional={true}>
            <DetailsNumber
              isTripleDigits={active && settingsNumber > 99}
              id='1'
            >
              {active ? settingsNumber : 0}
            </DetailsNumber>
            <DetailsTitle isOptional={true}>{t('auditTrail.actionsHistory')}</DetailsTitle>
          </DisplaySummation>
        )}
        {componentName === 'aat' && (
          <DisplaySummation disabled={!active} isOptional={true}>
            <DetailsNumber
              isTripleDigits={active && additionalActionTakenNumber > 99}
              id='1'
            >
              {active ? additionalActionTakenNumber : 0}
            </DetailsNumber>
            <DetailsTitle isOptional={true}>{t('auditTrail.additionalActionHistory')}</DetailsTitle>
          </DisplaySummation>
        )}
        {componentName !== 'setting' && componentName !== 'aat' &&(
          <DisplaySummation disabled={!active}>
            <Flex id='1'>
              <DetailsNumber
                isTripleDigits={active && actionNumber > 99}
                id='1'
              >
                {active ? actionNumber : 0}
              </DetailsNumber>
              <DetailsTitle>{t('auditTrail.actions')}</DetailsTitle>
            </Flex>
            <DetailDivider />
            <Flex id='2'>
              <DetailsTitle>{t('auditTrail.faults')}</DetailsTitle>
              <DetailsNumber
                isTripleDigits={active && faultsNumber > 99}
                id='2'
              >
                {active ? faultsNumber : 0}
              </DetailsNumber>
            </Flex>
          </DisplaySummation>
        )}

        <ExpandButton
          handleOnClick={() =>
            active && isReadyToRender && setIsExpanded(!isExpanded)
          }
          name={isExpanded ? t('common.close') : t('common.expand')}
          disabled={!active}
        />
      </InnerWrapper>
      {isExpanded && (
        <SectionDetail>
          {!isSettingsComponent && componentName !== 'aat'
            ? ['actions', 'faults'].map((title, index) => (
              <IntegratedHistoryComponent
                key={title}
                title={title}
                actionData={actionData}
                faultData={faultData}
                componentName={componentName}
                searchQuery={searchQuery}
              />
            ))
            : componentName === 'aat'
              ? (<IntegratedHistoryComponent
                title={'actions'}
                actionData={additionalActionTakenData}
                componentName={componentName}
                searchQuery={searchQuery}
                withExpand={false}
              />)
              : (
                settingsSectionName.map((title) => (
                  <IntegratedHistoryComponent
                    key={title}
                    title={title}
                    settingsData={settingsData}
                    settingsOptionsData={settingsOptionsData}
                    componentName={componentName}
                    searchQuery={searchQuery}
                    active={active}
                    disableSettings={disableSettings}
                  />
                ))
              )}
        </SectionDetail>
      )}
    </Wrapper>
  );
};

export default AuditTrailComponentBySwitch;

const Wrapper = styled.div`
  width: 1212px;
  height: 76px;
  border-radius: 38px;
  ${layerC}
  ${flexBoxCenter}

  margin-top: 8px;
  &:first-child {
    margin-top: 0;
  }

  ${(p) =>
    p.isExpanded &&
    css`
      height: auto;
      padding: 2px 0 0 0;
      border-radius: 38px 38px 26px 26px;
      ${flexDirectionColumn}
    `}

  ${(p) =>
    p.isFaults &&
    css`
      border: 1px solid red;
    `}
`;

const InnerWrapper = styled.div`
  width: 1204px;
  height: 70px;
  border-radius: 70px;
  padding: 0 15px 0 5px;
  ${(p) =>
    p.isExpanded &&
    css`
      height: none;
      padding: 5px 15px 5px 5px;
      margin-top: 1px;
      margin-bottom: 5px;
    `}

  ${layerA180Deg}
  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg}
    `}
  ${justifyContentSpaceBetween}
`;

const LogoWrapper = styled.div`
  width: 61px;
  height: 61px;
  border-radius: 50%;
  cursor: pointer;

  ${layerC}
  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled}
    `}
  ${flexBoxCenter}
`;

const SectionTitle = styled.section`
  width: 675px;
  ${justifyContentSpaceBetween}
`;
const Title = styled.span`
  font-size: 12px;
  letter-spacing: 1.2px;
`;
const Img = styled.img`
  height: 100%;
`;

const Divider = styled.div`
  ${(p) =>
    p.option === 'ess'
      ? css`
          width: 407px;
        `
      : p.option === 'tgs'
      ? css`
          width: 461px;
        `
      : p.option === 'tes'
      ? css`
          width: 424px;
        `
      : p.option === 'hp'
      ? css`
          width: 492px;
        `
      : p.option === 'ate'
      ? css`
          width: 407px;
        `
      : p.option === 'aat'
      ? css`
          width: 445px;
        `
      : css`
          width: 582px;
        `}
  ${(p) =>
    p.active
      ? css`
          border-bottom: 1px solid #ffffff;
        `
      : css`
          border-bottom: 2px solid #808080;
        `}
`;

const DisplaySummation = styled.div`
  width: 320px;
  height: 62px;
  border-radius: 31px;

  ${layerA}
  ${justifyContentSpaceBetween}
  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled}
    `}    
  padding: 0 14px;

  ${(p) =>
    p.isOptional &&
    css`
      justify-content: flex-start;
    `}

  ${(p) =>
    p.isDisabled &&
    css`
      ${layerBDisabled}
    `}
`;

const Flex = styled.div`
  width: 49%;

  ${({ id }) =>
    id === '1'
      ? css`
          ${justifyContentFlexEnd}
        `
      : css`
          ${justifyContentFlexStart}
        `}
`;

const DetailsNumber = styled.span`
  ${({ isTripleDigits }) =>
    isTripleDigits
      ? css`
          font-size: 32px;
        `
      : css`
          font-size: 44px;
        `}

  ${({ id }) =>
    id === '1'
      ? css`
          margin-right: 4px;
        `
      : css`
          margin-left: 4px;
        `}

  ${(p) =>
    p.isFaults
      ? css`
          color: #fe0000;
        `
      : css`
          color: #fff;
        `}
`;
const DetailsTitle = styled.span`
  text-align: center;
  font-size: 12px;
  letter-spacing: 1.2px;
  ${(p) =>
    p.isOptional &&
    css`
      width: 300px;
    `}
`;

const DetailDivider = styled.div`
  height: 80%;
  border-left: 1px solid #ffffff;
`;

const SectionDetail = styled.div`
  width: 1204px;
`;

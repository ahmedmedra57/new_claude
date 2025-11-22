import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import styled from 'styled-components';
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentFlexEnd,
  justifyContentSpaceAround,
  justifyContentSpaceBetween,
  layerA180Deg,
  layerADark,
  layerCLighter,
} from '../styles/commonStyles';

import ButtonComponent from './ButtonComponent';

const ActionLoginHistory = ({ data, index }) => {
  const { t } = useTranslation();
  // ------------ temporary date formatting-----------
  const loginHour =
    (Number(data.login?.getHours()) > 12
      ? Number(data.login?.getHours()) - 12
      : data.login?.getHours())||null;

  const logoutHour =
    (Number(data.logout?.getHours()) > 12
      ? Number(data.logout?.getHours()) - 12
      : data.logout?.getHours())||null;

  const loginMinute =
    (Number(data.login?.getMinutes()) < 10
      ? `0${data.login?.getMinutes()}`
      : data.login?.getMinutes())||null;

  const logoutMinute =
   ( Number(data.logout?.getMinutes()) < 10
      ? `0${data.logout?.getMinutes()}`
      : data.logout?.getMinutes())||null;

  const loginIsPm = data.login?.getHours() > 12;
  const logoutIsPm = data.logout?.getHours() > 12;

  const loginDate =
    (Number(data.login?.getDate()) < 10
      ? `0${data.login?.getDate()}`
      : data.login?.getDate())||null;

  const logoutDate =
    (Number(data.logout?.getDate()) < 10
      ? `0${data.logout?.getDate()}`
      : data.logout?.getDate())||null;

  const loginMonth =
    (Number(data.login?.getMonth()) < 10
      ? `0${Number(data.login?.getMonth()) + 1}`
      : Number(data.login?.getMonth()) + 1)||null;

  const logoutMonth =
    (Number(data.logout?.getMonth()) < 10
      ? `0${Number(data.logout?.getMonth()) + 1}`
      : Number(data.logout?.getMonth()) + 1)||null;

  // ------------ temporary date formatting-----------

  // ------------ temporary naming command files-----------

  // ------------ temporary variable-----------

  // ------------ temporary variable-----------

  return (
    <Wrapper>
      <SectionDisplay>
        <SectionLog>
          <Title>{t('auditTrail.logIn')}</Title>
          <Divider>-</Divider>
          {loginHour && (
            <Date>
              {t('common.date')} : {loginHour}:{loginMinute} {loginIsPm ? t('common.pm') : t('common.am')}{' '}
              {data?.login?.toLocaleDateString()}
            </Date>
          )}
        </SectionLog>
        <Divider>-</Divider>
        <SectionLog>
          <Title>{t('auditTrail.logOut')}</Title>
          <Divider>-</Divider>
          {logoutHour && (
            <Date>
              {t('common.date')} : {logoutHour}:{logoutMinute} {logoutIsPm ? t('common.pm') : t('common.am')}{' '}
              {data?.logout?.toLocaleDateString()}
            </Date>
          )}
        </SectionLog>
      </SectionDisplay>
    </Wrapper>
  );
};
export default ActionLoginHistory;

const Wrapper = styled.div`
  width: 1191px;
  height: 44px;
  border-radius: 22px;
  ${layerA180Deg}
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 8px;
  &:last-child {
    margin-bottom: 0px;
  }
`;

const SectionDisplay = styled.section`
  width: 1183px;
  height: 36px;
  border-radius: 41px;
  ${layerADark};
  ${justifyContentSpaceBetween}
  padding: 0 12px;
`;

const SectionLog = styled.section`
  width: 30%;
`;
const Title = styled.span`
  font-size: 12px;
  letter-spacing: 1.2px;
  margin-right: 8px;
`;
const Divider = styled.span`
  font-size: 12px;
  margin-right: 8px;
`;

const Date = styled.span`
  width: 270px;
  font-size: 12px;
  letter-spacing: 1.2px;
  color: #fcff01;
`;

import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import ImperialMetricMeasurementReader from './ImperialMetricMeasurementReader';
import { useEffect } from 'react';
import { useUnitsStore, useUserStore } from '../../zustand-stores';
import SettingAppliedMessage from '../../masterControl/userMessages/SettingAppliedMessage';
import {
import { useEditCancelApplyButtonsStore } from '../../zustand-stores';
  flexBoxCenter,
  justifyContentFlexEnd,
  justifyContentSpaceAround,
  layerA,
  layerA180Deg,
  layerA90Deg,
} from '../../styles/commonStyles';
import EditCancelApplyButtons from '../buttons/EditCancelApplyButtons';
import TitleOfSelectedOption from '../TitleOfSelectedOption';
import InvisibleDivForEditButton from '../messageBoxes/InvisibleDivForEditButton';
import { useMediaQuery } from 'react-responsive';
const UnitsMain = ({
  handleClick,
  messageBoxContent,
  openMessageBox,
  handleCloseMessageBox,
  metricImperialToggle,
  setMetricImperialToggle,
}) => {
  // media query
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });
  const { t } = useTranslation();

  const measurementsArr = [
    {
      title: t('settings.imperial'),
      temp: t('settings.fahrenheit'),
      energy: 'Kw - KILOWATTS',
      measure: 'In - INCHES - Ft - FEET',
      gas: 'FT³- CUBIC FEET',
      backgroundColor: '360',
    },
    {
      title: t('settings.metric'),
      temp: t('settings.celsius'),
      energy: 'Kw - KILOWATTS',
      measure: 'M - METERS',
      gas: 'M³ - CUBIC METERS',
      backgroundColor: '180',
    },
  ];

  // redux
    const unitState = useUnitsStore();
  const { selectedUnit, isF } = unitState;
  const buttonsState = useEditCancelApplyButtonsStore();
  const { isCancel, isEdit } = buttonsState;
  const userInfo = useUserStore();
  const { user } = userInfo;
  // keeps track and render last state saved either to imperial or metric
  useEffect(() => {
    let choosenUnit = user?.temperature_unit === 'f' ? 0 : 1;
    dispatch(handleResetButtons();
    setMetricImperialToggle(choosenUnit);
  }, [user]);

  // keeps track and render last state change of either imperial or metric  when pressing cancel button
  useEffect(() => {
    let choosenUnit = user?.temperature_unit === 'f' ? 0 : 1;
    setMetricImperialToggle(choosenUnit);
  }, [isCancel]);

  // handle toggle selection
  const handleToggle = (index) => {
    if (index !== metricImperialToggle) {
      return setMetricImperialToggle(index);
    }
  };

  return (
    <>
      {isMobile ? (
        <>
          <BaseLayer isMobile={true}>
            <Wrapper isMobile={true}>
              {!isEdit && typeof metricImperialToggle !== Number && (
                <EditBoxWrapper>
                  <InvisibleDivForEditButton height={'481px'} />
                </EditBoxWrapper>
              )}
              <TitleOfSelectedOption title={t('settings.selectUnitsOfMeasurement')} />

              {measurementsArr.map((value, index) => {
                return (
                  <div key={index}>
                    <ImperialMetricMeasurementReader
                      value={value}
                      index={index}
                      handleClick={handleToggle}
                      metricImperialToggle={metricImperialToggle}
                    />
                  </div>
                );
              })}

              {/* message box */}
              {openMessageBox && (
                <SettingAppliedMessage
                  message={messageBoxContent}
                  onClose={handleCloseMessageBox}
                />
              )}
            </Wrapper>
          </BaseLayer>
          {/* 3 buttons edit, cancel and apply */}
          <WrapperButtons isMobile={true}>
            <EditCancelApplyButtons handleClick={handleClick} />
          </WrapperButtons>
        </>
      ) : (
        <BaseLayer>
          <Wrapper>
            {!isEdit && typeof metricImperialToggle !== Number && (
              <EditBoxWrapper>
                <InvisibleDivForEditButton height={'230px'} />
              </EditBoxWrapper>
            )}
            <TitleOfSelectedOption title={t('settings.selectUnitsOfMeasurement')} />
            <MetricImperialBaseLayer>
              <MetricImperialWrapper>
                {measurementsArr.map((value, index) => {
                  return (
                    <div key={index}>
                      <ImperialMetricMeasurementReader
                        value={value}
                        index={index}
                        handleClick={handleToggle}
                        metricImperialToggle={metricImperialToggle}
                      />
                    </div>
                  );
                })}
              </MetricImperialWrapper>
            </MetricImperialBaseLayer>
            {/* 3 buttons edit, cancel and apply */}
            <WrapperButtons>
              <EditCancelApplyButtons handleClick={handleClick} />
            </WrapperButtons>
            {/* message box */}
            {openMessageBox && (
              <SettingAppliedMessage
                message={messageBoxContent}
                onClose={handleCloseMessageBox}
              />
            )}
          </Wrapper>
        </BaseLayer>
      )}
    </>
  );
};

const BaseLayer = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 314px;
          height: 487px;
          border-radius: 16px;
        `
      : css`
          width: 873px;
          height: 325px;
          border-radius: 7px;
        `}

  ${layerA}

  ${flexBoxCenter};
`;

const Wrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 310px;
          height: 483px;
          ${layerA90Deg}
          border-radius: 14px;
          ${justifyContentSpaceAround}
        `
      : css`
          width: 869px;
          height: 321px;
          ${layerA180Deg}
          border-radius: 5px;
          ${flexBoxCenter};
          gap: 12rem;
        `}

  flex-direction: column;
`;

const EditBoxWrapper = styled.div`
  z-index: 100;
  position: absolute;
`;

const MetricImperialBaseLayer = styled.div`
  width: 859px;
  height: 206px;

  ${layerA}

  border-radius: 7px;
  opacity: 1;
  ${flexBoxCenter}
`;

const MetricImperialWrapper = styled.div`
  width: 855px;
  height: 202px;

  ${layerA180Deg}

  border-radius: 5px;
  opacity: 1;

  ${justifyContentSpaceAround}
`;

const WrapperButtons = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 100%;
          ${flexBoxCenter}
        `
      : css`
          width: 99.5%;
          ${justifyContentFlexEnd}
        `}
`;

export default UnitsMain;

import styled, { css } from 'styled-components';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  flexBoxCenter,
  justifyContentFlexStart,
  justifyContentSpaceAround,
  justifyContentSpaceEvenly,
  layerA,
  layerA180Deg,
  layerA90Deg,
} from '../../styles/commonStyles';
import TitleOfSelectedOption from '../TitleOfSelectedOption';
import SnowSensor from './SnowSensor';
import { selectSnowSensor } from '../../store/slices/settings/snowSensorSlice';
import SettingAppliedMessage from '../../masterControl/userMessages/SettingAppliedMessage';
import { selectEditCancelApplyButtons } from '../../store/slices/settings/editCancelApplyButtonsSlice';
import InvisibleDivForEditButton from '../messageBoxes/InvisibleDivForEditButton';
import { selectUserInfo } from '../../store/slices/userSlice';
import { useMediaQuery } from 'react-responsive';
import SettingConfirmCancelMessageBox from '../messageBoxes/SettingConfirmCancelMessageBox';

function SnowSensorMain({
  essSnowSensorRef,
  tgsSnowSensorRef,
  tesSnowSensorRef,
  messageBoxContent,
  handleCloseMessageBox,
  openMessageBox,
  handleConfirmButton,
}) {
  // media query
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });
  const { t } = useTranslation();

  const snowSensorSubTitles = [
    'ess-snow sensor trigger',
    'tgs-snow sensor trigger',
    'tes-snow sensor trigger',
  ];

  // redux
  const snowSensorState = useSelector(selectSnowSensor);
  const { essSnowSensorTemp, tgsSnowSensorTemp, tesSnowSensorTemp } =
    snowSensorState;

  const buttonsState = useSelector(selectEditCancelApplyButtons);
  const { isEdit } = buttonsState;

  const UserInfoState = useSelector(selectUserInfo);
  const { isEssSwitch, isTesSwitch, isTgsSwitch, isHpSwitch, isAteSwitch } =
    UserInfoState;

  // useEffect
  useEffect(() => {
    if (essSnowSensorTemp) {
      essSnowSensorRef.current.value = essSnowSensorTemp;
    }
    if (tgsSnowSensorTemp) {
      tgsSnowSensorRef.current.value = tgsSnowSensorTemp;
    }
    if (tesSnowSensorTemp) {
      tesSnowSensorRef.current.value = tesSnowSensorTemp;
    }
  }, []);

  return (
    <>
      {isMobile ? (
        <BaseLayer isMobile={true}>
          <Wrapper isMobile={true}>
            {!isEdit &&
              (essSnowSensorTemp || tgsSnowSensorTemp || tesSnowSensorTemp) && (
                <EditBoxWrapper>
                  <InvisibleDivForEditButton height={'280px'} />
                </EditBoxWrapper>
              )}
            <TitleOfSelectedOption title={t('settings.snowSensor')} />

            {snowSensorSubTitles.map((title, idx) => {
              return (
                <SnowSensor
                  key={idx}
                  title={title}
                  inputRef={
                    idx === 0
                      ? essSnowSensorRef
                      : idx === 1
                      ? tgsSnowSensorRef
                      : tesSnowSensorRef
                  }
                  isActive={
                    idx === 0
                      ? isEssSwitch
                      : idx === 1
                      ? isTgsSwitch
                      : idx === 2 && isTesSwitch
                  }
                />
              );
            })}

            {openMessageBox && (
              <SettingConfirmCancelMessageBox
                message={messageBoxContent}
                onCancel={handleCloseMessageBox}
                onConfirm={() => handleConfirmButton('snowSensor')}
              />
            )}
          </Wrapper>
        </BaseLayer>
      ) : (
        <BaseLayer>
          <Wrapper>
            {!isEdit &&
              (essSnowSensorTemp || tgsSnowSensorTemp || tesSnowSensorTemp) && (
                <EditBoxWrapper>
                  <InvisibleDivForEditButton height={'280px'} />
                </EditBoxWrapper>
              )}
            <TitleWrapper>
              <TitleOfSelectedOption title={t('settings.snowSensor')} />
            </TitleWrapper>
            <ContentsWrapper>
              {snowSensorSubTitles.map((title, idx) => {
                return (
                  <WrapperSnowFactor key={idx}>
                    <SnowSensor
                      title={title}
                      inputRef={
                        idx === 0
                          ? essSnowSensorRef
                          : idx === 1
                          ? tgsSnowSensorRef
                          : tesSnowSensorRef
                      }
                      isActive={
                        idx === 0
                          ? isEssSwitch
                          : idx === 1
                          ? isTgsSwitch
                          : idx === 2 && isTesSwitch
                      }
                      index={idx}
                    />
                  </WrapperSnowFactor>
                );
              })}
            </ContentsWrapper>
            {openMessageBox && (
              <SettingConfirmCancelMessageBox
                message={messageBoxContent}
                onCancel={handleCloseMessageBox}
                onConfirm={() => handleConfirmButton('snowSensor')}
              />
            )}
          </Wrapper>
        </BaseLayer>
      )}
    </>
  );
}

export default SnowSensorMain;

const BaseLayer = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 314px;
          height: 340px;
          border-radius: 16px;
        `
      : css`
          width: 873px;
          height: 284px;
          border-radius: 7px;
        `}

  ${layerA}

  ${flexBoxCenter}
`;

const Wrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 310px;
          height: 336px;
          border-radius: 14px;
          ${layerA90Deg}
          ${justifyContentSpaceEvenly}
        `
      : css`
          width: 869px;
          height: 280px;
          border-radius: 5px;
          ${justifyContentSpaceAround}
          ${layerA180Deg}
        `}

  flex-direction: column;
`;

const TitleWrapper = styled.div`
  margin-top: 1.5px;
`;

const EditBoxWrapper = styled.div`
  z-index: 100;
  position: absolute;
`;

const ContentsWrapper = styled.div`
  width: 859px;
  height: 212px;
  margin-top: 12px;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 4px;

  ${layerA}

  border-radius: 7px;
  opacity: 1;

  display: flex;
  align-items: stretch;
  align-content: space-between;
  flex-wrap: wrap;
`;

const WrapperSnowFactor = styled.div`
  &:nth-child(2) {
    margin-left: 4px;
  }
`;

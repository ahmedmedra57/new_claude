import styled, { css } from "styled-components";
import { useState } from "react";
import { useUserStore } from '../../zustand-stores';
import { useTranslation } from 'react-i18next';
import {
import { useEditCancelApplyButtonsStore, useInterfaceModeStore } from '../../zustand-stores';
import { useSettingsOptionsStore } from '../../zustand-stores';
  flexBoxCenter,
  justifyContentFlexStart,
  justifyContentSpaceEvenly,
  layerA,
  layerA90Deg,
  layerADisabled180Deg,
  layerB,
  layerDDisabled,
  layerDisabled180Deg,
  scrollbarY,
} from "../../styles/commonStyles";
import {
  handleSelectingSettings,
  setResetSettingsOptions,
import ApplyButtonInvisibleDiv from "../messageBoxes/ApplyButtonInvisibleDiv";
import { useMediaQuery } from "react-responsive";
import { PERMISSIONS, SETTINGS_OPTIONS } from "../../../constants";
import { useMemo } from "react";
function AllSettingsSelectOptions() {
  const { resetSettings } = useSettingsOptionsStore();
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ query: "(max-width:600px)" });
  const { permissions } = useUserStore();
  const allowedSettings = permissions[PERMISSIONS.ALLOWED_SETTINGS];

  const settingsData = [
    {
      name: t('settings.userProfile'),
      key: SETTINGS_OPTIONS.USER_PROFILE,
    },
    {
      name: t('settings.units'),
      key: SETTINGS_OPTIONS.UNITS,
    },
    {
      name: t('settings.windFactor'),
      key: SETTINGS_OPTIONS.WIND_FACTOR,
    },
    {
      name: t('settings.snowSensor'),
      key: SETTINGS_OPTIONS.SNOW_SENSOR,
    },
    {
      name: t('settings.forceCommands'),
      key: SETTINGS_OPTIONS.FORCE_COMMANDS,
    },
    {
      name: t('settings.admin'),
      key: SETTINGS_OPTIONS.ADMIN,
    },
    {
      name: t('settings.interfaceMode'),
      key: SETTINGS_OPTIONS.INTERFACE_MODE,
    },
  ];
  if (!isMobile) {
    settingsData.pop();
  }

  const [option, setOption] = useState(0);

    const interfaceMode = useInterfaceModeStore();
  const mode = interfaceMode;
  const buttonsState = useEditCancelApplyButtonsStore();
  const { isEdit } = buttonsState;

  const handleSelect = (value) => {
    if (option !== value) {
      setOption(value);
      useSettingsOptionsStore().resetSettingsOptions();
      switch (value) {
        case 0: {
          useSettingsOptionsStore().selectSetting("isUserProfileSelected");
          break;
        }
        case 1: {
          useSettingsOptionsStore().selectSetting("isUnitsSelected");
          break;
        }
        case 2: {
          useSettingsOptionsStore().selectSetting("isWindFactorSelected");
          break;
        }
        case 3: {
          useSettingsOptionsStore().selectSetting("isSnowSensorSelected");
          break;
        }
        case 4: {
          useSettingsOptionsStore().selectSetting("isForceAndCommandsSelected");
          break;
        }
        case 5: {
          useSettingsOptionsStore().selectSetting("isAdminSelected");
          break;
        }
        case 6: {
          useSettingsOptionsStore().selectSetting("isInterfaceModeSelected");
          break;
        }
        default:
          return;
      }
    }
  };

  return (
    <>
      {isMobile ? (
        <Wrapper isMobile={true}>
          <WrapperMobile>
            {isEdit && (
              <Div isMobile={true}>
                <ApplyButtonInvisibleDiv />
              </Div>
            )}
            <WrapperTitle isMobile={true}>
              <Title isMobile={true}>{t('settings.settingsOptions').toUpperCase()}</Title>
            </WrapperTitle>

            <SelectionsWrapper isMobile={true}>
              {settingsData.map((data, index) => {
              const isDisabled=!allowedSettings?.includes(data.key);
              return (
                  <ContainerOfEachSelectMeasurement
                    key={index}
                    onClick={() => {
                      isDisabled || handleSelect(index);
                    }}
                    isDisabled={isDisabled}
                    isMobile={true}
                  >
                    <SelectBox
                      isColor={option === index ? true : false}
                      isMobile={true}
                      isDisabled={isDisabled}
                    ></SelectBox>
                    <ContainerOfEachOptions
                      isColor={option === index ? true : false}
                      isMobile={true}
                      isDisabled={isDisabled}
                    >
                      <P isMobile={true}>{data.name}</P>
                    </ContainerOfEachOptions>
                  </ContainerOfEachSelectMeasurement>
                );
              })}
            </SelectionsWrapper>
          </WrapperMobile>
        </Wrapper>
      ) : (
        <Wrapper>
          {isEdit && (
            <Div>
              <ApplyButtonInvisibleDiv />
            </Div>
          )}
          <WrapperTitle>
            <Title>{t('settings.settingsOptions').toUpperCase()}</Title>
          </WrapperTitle>

          <SelectionsWrapper>
            {settingsData.map((data, index) => {
              const isDisabled=!allowedSettings?.includes(data.key);
              // console.log(settingsData,allowedSettings,data.key,"settingsData")
              return (
                <ContainerOfEachSelectMeasurement
                  key={index}
                  isDisabled={isDisabled}
                  onClick={() => {
                    isDisabled || handleSelect(index);
                  }}
                >
                  <SelectBox
                    mode={mode}
                    isDisabled={isDisabled}
                    isColor={option === index ? true : false}
                  ></SelectBox>
                  <ContainerOfEachOptions
                    isColor={option === index ? true : false}
                    isDisabled={isDisabled}
                  >
                    <P>{data.name}</P>
                  </ContainerOfEachOptions>
                </ContainerOfEachSelectMeasurement>
              );
            })}
          </SelectionsWrapper>
        </Wrapper>
      )}
    </>
  );
}
export default AllSettingsSelectOptions;

const Wrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 314px;
          height: 343px;
          border-radius: 16px;
          ${flexBoxCenter}
          margin-bottom: 10px;
        `
      : css`
          width: 309px;
          height: 310px;
          border-radius: 4px;
          ${justifyContentFlexStart}
          flex-direction: column;
          gap: 12px;
          ${layerA90Deg}
        `}
`;

const WrapperMobile = styled.div`
  width: 310px;
  height: 339px;
  border-radius: 14px;

  ${justifyContentFlexStart}
  flex-direction: column;
  gap: 7px;
  ${layerA90Deg}
  position: relative;
`;

const WrapperTitle = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 298px;
          height: 32px;
          margin-top: 6px;
        `
      : css`
          width: 293px;
          height: 32px;
          margin-top: 8px;
        `}

  ${layerA}
  border-radius: 16px;
  ${justifyContentFlexStart}
`;

const Title = styled.p`
  margin-left: 12px;

  text-align: center;
  font-size: 14px;
  letter-spacing: 1.4px;
  color: #ffffff;
`;

const Div = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 310px;
          height: 339px;
        `
      : css`
          width: 309px;
          height: 310px;
        `}
  position: absolute;

  /* border: 1px solid red; */
`;

const SelectionsWrapper = styled.div`
  ${flexBoxCenter};
  flex-direction: column;

  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 298px;
          height: 287px;
          border-radius: 9px;
          gap: 4px;
        `
      : css`
          width: 293px;
          height: 211px;
          ${scrollbarY}
          border-radius: 8px;
        `}

  ${layerB}
`;

const ContainerOfEachSelectMeasurement = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 298px;
          height: 36px;
          ${justifyContentSpaceEvenly}
        `
      : css`
          width: 293px;
          height: 35px;
          ${flexBoxCenter}
          gap:8px;
        `}
  ${({ isDisabled }) =>
    isDisabled &&
    css`
      cursor: not-allowed;
    `}
`;

const SelectBox = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 30px;
          height: 30px;
        `
      : css`
          width: 37px;
          height: 31px;
        `}
  cursor: pointer;

  margin-left: 1px;
  background: ${({ isColor }) => (isColor ? "#95ff45 " : "#46698C")};
  border: 1px solid #427293;
  opacity: 1;
  ${({ isDisabled }) =>
    isDisabled &&
    css`
      ${layerDisabled180Deg}
    `}
`;

const ContainerOfEachOptions = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 253px;
          height: 32px;
        `
      : css`
          width: 235px;
          height: 31px;
        `}

  cursor: pointer;
  margin-left: 8px;
  ${layerA}
  border: ${({ isColor }) =>
    isColor ? "1.5px solid #95ff45" : "1.5px solid #46698c"};
  border-radius: 6px;

  display: flex;
  align-items: center;
  ${({ isDisabled }) =>
    isDisabled &&
    css`
      ${layerDisabled180Deg}
    `}
`;

const P = styled.p`
  font-size: 10px;
  text-align: center;
  margin-left: 6px;
  letter-spacing: 1px;
  color: #ffffff;
`;

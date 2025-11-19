import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import SettingAppliedMessage from '../../masterControl/userMessages/SettingAppliedMessage';
import { selectEditCancelApplyButtons } from '../../store/slices/settings/editCancelApplyButtonsSlice';
import { selectWindFactor } from '../../store/slices/settings/windFactorSlice';
import {
  flexBoxCenter,
  justifyContentSpaceAround,
  layerA,
  layerA180Deg,
  layerA90Deg,
} from '../../styles/commonStyles';
import InvisibleDivForEditButton from '../messageBoxes/InvisibleDivForEditButton';
import TitleOfSelectedOption from '../TitleOfSelectedOption';
import WindFactor from './WindFactor';
import { useMediaQuery } from 'react-responsive';
import ContainerLogin from '../../adminPassword/ContainerLogin';
import {
  handleResetAccessAdministrator,
  selectUserInfo,
} from '../../store/slices/userSlice';
import SettingConfirmCancelMessageBox from '../messageBoxes/SettingConfirmCancelMessageBox';

function WindFactorMain({
  lowWindTempRef,
  medWindTempRef,
  highWindTempRef,
  extremeWindTempRef,
  messageBoxContent,
  handleCloseMessageBox,
  openMessageBox,
  handleConfirmButton,
}) {
  // media query
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });
  const { t } = useTranslation();

  const content = [
    {
      title: 'low wind factor',
      windMiles: '15-24',
      temperatureF: '302',
      windKilo: '24-39',
      temperatureC: '150',
    },
    {
      title: 'high wind factor',
      windMiles: '38-52',
      temperatureF: '392',
      windKilo: '61-84',
      temperatureC: '200',
    },
    {
      title: 'med wind factor',
      windMiles: '25-37',
      temperatureF: '347',
      windKilo: '40-60',
      temperatureC: '175',
    },
    {
      title: 'extreme wind factor',
      windMiles: '53-62',
      temperatureF: '437',
      windKilo: '85-100',
      temperatureC: '225',
    },
  ];

  const [openPasswordBox, setOpenPasswordBox] = useState(true);

  const dispatch = useDispatch();

  const buttonsState = useSelector(selectEditCancelApplyButtons);
  const { isEdit } = buttonsState;
  const windFactorState = useSelector(selectWindFactor);
  const { lowWindTemp, medWindTemp, highWindTemp, extremeWindTemp } =
    windFactorState;
  const selectUserInfoState = useSelector(selectUserInfo);
  const { isAdministrator } = selectUserInfoState;

  // sets the input fields to previously entered values
  useEffect(() => {
    if (
      lowWindTemp &&
      medWindTemp &&
      highWindTemp &&
      extremeWindTemp &&
      isEdit
    ) {
      lowWindTempRef.current.value = lowWindTemp;
      medWindTempRef.current.value = medWindTemp;
      highWindTempRef.current.value = highWindTemp;
      extremeWindTempRef.current.value = extremeWindTemp;
    }
  }, [isAdministrator === true]);

  useEffect(() => {
    return () => {
      dispatch(handleResetAccessAdministrator());
    };
  }, []);

  return (
    <>
      {isMobile ? (
        <BaseLayer isMobile={true}>
          <Wrapper isMobile={true}>
            {/* password pop up box */}
            {openPasswordBox && (
              <PasswordWrapper isMobile={true}>
                <ContainerLogin handleClose={() => setOpenPasswordBox(false)} />
              </PasswordWrapper>
            )}
            {/* show invisible box when it has not been Edit yet */}
            {!isEdit &&
              (lowWindTemp ||
                medWindTemp ||
                highWindTemp ||
                extremeWindTemp) && (
                <EditBoxWrapper>
                  <InvisibleDivForEditButton height={'440px'} />
                </EditBoxWrapper>
              )}

            <TitleOfSelectedOption title={t('settings.windFactor')} />

            {content.map((value, index) => {
              return (
                <div key={index}>
                  <WindFactor
                    contents={value}
                    index={index}
                    inputRef={
                      index === 0
                        ? lowWindTempRef
                        : index === 1
                        ? highWindTempRef
                        : index === 2
                        ? medWindTempRef
                        : extremeWindTempRef
                    }
                    isSignedIn={isAdministrator}
                    handleOpenPasswordBox={() => setOpenPasswordBox(true)}
                  />
                </div>
              );
            })}

            {openMessageBox && (
              <SettingConfirmCancelMessageBox
                message={messageBoxContent}
                onCancel={handleCloseMessageBox}
                onConfirm={() => handleConfirmButton('windFactor')}
              />
            )}
          </Wrapper>
        </BaseLayer>
      ) : (
        <BaseLayer>
          <Wrapper>
            {/* password pop up box */}
            {openPasswordBox && (
              <PasswordWrapper isMobile={true}>
                <ContainerLogin handleClose={() => setOpenPasswordBox(false)} />
              </PasswordWrapper>
            )}

            {/* show invisible box when it has not been Edit yet */}
            {!isEdit &&
              (lowWindTemp ||
                medWindTemp ||
                highWindTemp ||
                extremeWindTemp) && (
                <EditBoxWrapper>
                  <InvisibleDivForEditButton height={'280px'} />
                </EditBoxWrapper>
              )}

            <TitleOfSelectedOption title={t('settings.windFactor')} />
            <FlexWrapper>
              {content.map((value, index) => {
                return (
                  <div key={index}>
                    <WindFactor
                      contents={value}
                      index={index}
                      inputRef={
                        index === 0
                          ? lowWindTempRef
                          : index === 1
                          ? highWindTempRef
                          : index === 2
                          ? medWindTempRef
                          : extremeWindTempRef
                      }
                      isSignedIn={isAdministrator}
                      handleOpenPasswordBox={() => setOpenPasswordBox(true)}
                    />
                  </div>
                );
              })}
            </FlexWrapper>

            {openMessageBox && (
              <SettingConfirmCancelMessageBox
                message={messageBoxContent}
                onCancel={handleCloseMessageBox}
                onConfirm={() => handleConfirmButton('windFactor')}
              />
            )}
          </Wrapper>
        </BaseLayer>
      )}
    </>
  );
}

export default WindFactorMain;

const BaseLayer = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 314px;
          height: 451px;
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
          height: 447px;
          border-radius: 14px;
          ${layerA90Deg}
          ${flexBoxCenter};
        `
      : css`
          width: 869px;
          height: 280px;
          border-radius: 5px;
          ${layerA180Deg}
          ${justifyContentSpaceAround};
        `}

  flex-direction: column;
  gap: 8px;
`;

const PasswordWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          height: 360px;
        `
      : css`
          height: 448px;
        `}

  width: 869px;

  ${flexBoxCenter}

  position: absolute;
`;

const EditBoxWrapper = styled.div`
  z-index: 100;
  position: absolute;
`;

const FlexWrapper = styled.div`
  width: 859px;
  height: 212px;

  ${layerA}

  border-radius: 7px;

  ${justifyContentSpaceAround}
  flex-direction: column;
  gap: 2px;
  flex-wrap: wrap;
`;

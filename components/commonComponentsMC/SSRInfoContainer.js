import { useState, useEffect } from 'react';
import { useUserStore } from '../zustand-stores';



import { flexBoxCenter } from '../styles/commonStyles';
import styled from 'styled-components';

// import AdminSSRItemDetails from './AdminSSRItemDetails';
import SSRItemDetails from './SSRItemDetails';
import AdminSSRItemDetails from './AdminSSRItemDetails';
import ContainerLogin from '../adminPassword/ContainerLogin';

const SSRInfoContainer = ({
  swtName,
  data,
  id,
  location,
  machine,
  isSettingOpen,
  isOverAmp,
  SSRSwitchName,
  setSSRSwitchName,
}) => {
  // Global states
  const userInfo = useUserStore();
  const { isAdministrator, isPasswordBoxOpen } = userInfo;

  const { openPasswordBox } = data;

  
  // temporary variables
  const unitsMeasurement = false;

  // add styling by using isOverAmp state
  const isEnable = data.buttonStatus === 'on' ? true : false;

  // isEnable is for styling  [true:red border]
  const isFault = data.buttonStatus === 'flt';
  const isWarn = data.warn === 1;

  const handleButtonClick = (option) => {
    // option 1 = non admin (need to open) || option 2 = admin (need to close)
    if (option === 1) {
      // need to open setting
      if (isAdministrator) {
        // check is admin? yes -> open the settings
        swtName === 'ess'
          ? dispatch(
              handleOpenSetting({
                location,
                machine,
                id: `ssr${id}`,
                status: true,
              })
            )
          : dispatch(
              tesHandleOpenSetting({
                location,
                machine,
                id: `ssr${id}`,
                status: true,
              });
      } else {
        // no admin ?
        if (openPasswordBox) {
          // 1. close password box
          swtName === 'ess'
            ? dispatch(
                handleOpenPasswordBox({
                  location,
                  machine,
                  id: `ssr${id}`,
                  status: false,
                })
              )
            : dispatch(
                tesHandleOpenPasswordBox({
                  location,
                  machine,
                  id: `ssr${id}`,
                  status: false,
                });
        } else {
          // 2. Login process => Display Password require box

          if (!isPasswordBoxOpen) {
            swtName === 'ess'
              ? dispatch(
                  handleOpenPasswordBox({
                    location,
                    machine,
                    id: `ssr${id}`,
                    status: true,
                  })
                )
              : dispatch(
                  tesHandleOpenPasswordBox({
                    location,
                    machine,
                    id: `ssr${id}`,
                    status: true,
                  });
            // true : update password box status
            dispatch(handlePasswordPropagation(true);
          }
        }
      }
    } else {
      // id === 2  Close the setting and logout
      swtName === 'ess'
        ? dispatch(
            handleOpenSetting({
              location,
              machine,
              id: `ssr${id}`,
              status: false,
            })
          )
        : dispatch(
            tesHandleOpenSetting({
              location,
              machine,
              id: `ssr${id}`,
              status: false,
            });

      // log out admin
      useAdminStore().setAccessAdministrator(false);
    }
  };

  const handleClosePasswordBox = () => {
    swtName === 'ess'
      ? dispatch(
          handleOpenPasswordBox({
            location,
            machine,
            id: `ssr${id}`,
            status: false,
          })
        )
      : dispatch(
          tesHandleOpenPasswordBox({
            location,
            machine,
            id: `ssr${id}`,
            status: false,
          });
    dispatch(handlePasswordPropagation(false);
  };

  return (
    <Wrapper>
      <TitleWrapper>
        {isSettingOpen ? (
          <>
            <AdminTitle>part number</AdminTitle>
            <AdminTitle>current (a)</AdminTitle>
            <AdminTitle>wattage (w)</AdminTitle>
            <AdminTitle>voltage (v)</AdminTitle>
            <AdminTitle>length (ft)</AdminTitle>
            <AdminTitle>description</AdminTitle>
          </>
        ) : (
          <>
            <Title>current (a)</Title>
            <Title>wattage (w)</Title>
            <Title>voltage (v)</Title>
            <Title>length (ft)</Title>
            <Title>description</Title>
          </>
        )}
      </TitleWrapper>

      {isSettingOpen ? (
        <AdminSSRItemDetails
          isEnable={isEnable}
          isFault={isFault}
          isWarn={isWarn}
          // option 1 is SSRItemDetails || option 2 is AdminSSRItemDetails
          option={2}
          // id is column number
          id={id}
          data={data}
          isSettingOpen={isSettingOpen}
          handleButtonClick={handleButtonClick}
          isAdministrator={isAdministrator}
          location={location}
          machine={machine}
          swtName={swtName}
          SSRSwitchName={SSRSwitchName}
          setSSRSwitchName={setSSRSwitchName}
        />
      ) : (
        <SSRItemDetails
          isEnable={isEnable}
          isFault={isFault}
          isWarn={isWarn}
          // id is column number
          id={id}
          // option 1 is SSRItemDetails || option 2 is AdminSSRItemDetails
          option={1}
          data={data}
          handleButtonClick={handleButtonClick}
          isAdministrator={isAdministrator}
          overAmp={isOverAmp}
        />
      )}

      {openPasswordBox && (
        <PasswordWrapper onClick={handleClosePasswordBox}>
          <ContainerLogin
            setIsSettingOpen={() => {
              swtName === 'ess'
                ? dispatch(
                    handleOpenSetting({
                      location,
                      machine,
                      id: `ssr${id}`,
                      status: true,
                    })
                  )
                : dispatch(
                    tesHandleOpenSetting({
                      location,
                      machine,
                      id: `ssr${id}`,
                      status: true,
                    });
            }}
            handleClose={handleClosePasswordBox}
            isReadyToClose={true}
          />
        </PasswordWrapper>
      )}
    </Wrapper>
  );
};

export default SSRInfoContainer;
const Wrapper = styled.div`
  width: 969px;
  margin-top: 15px;
  position: relative;
`;

const TitleWrapper = styled.div`
  ${flexBoxCenter}
  justify-content: flex-start;
  margin-bottom: 8px;
`;

const AdminTitle = styled.span`
  font-size: 10px;

  &:first-child {
    margin-left: 7px;
    margin-right: 28px;
  }
  &:nth-child(2) {
    margin-right: 36px;
  }
  &:nth-child(3) {
    margin-right: 32px;
  }
  &:nth-child(4) {
    margin-right: 42px;
  }
  &:nth-child(5) {
    margin-right: 180px;
  }
`;
const Title = styled.span`
  font-size: 10px;
  &:first-child {
    margin-left: 12px;
    margin-right: 26px;
  }
  &:nth-child(2) {
    margin-right: 26px;
  }
  &:nth-child(3) {
    margin-right: 35px;
  }
  &:nth-child(4) {
    margin-right: 240px;
  }
`;

const PasswordWrapper = styled.div`
  width: 120%;
  border-radius: 16px;

  display: flex;
  justify-content: center;

  margin-top: 8px;
  padding: 16px;

  position: absolute;
  top: -100px;
  right: 0px;
  z-index: 100;

  cursor: pointer;
`;

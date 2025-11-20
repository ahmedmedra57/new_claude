import { useEffect, useState } from 'react';
import { import { useESSSwitchStore, useAdminStore, useMCStore, useTESSwitchStore, useUserStore } from '../zustand-stores';

import styled, { css } from 'styled-components';
import { getAllAdminHeatersService } from '../../services';
import ContainerLogin from '../adminPassword/ContainerLogin';




  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerADark,
  layerB,
  layerC,
  layerCLighter,
} from '../styles/commonStyles';
import DisplaySSR from './DisplaySSR';
import SSRDetail from './SSRDetail';

const HeaterStatus = ({
  swtName,
  location,
  specificLocation,
  machine,
  isMobile,
  indivLocationName,
  deviceMac,
}) => {
  // global
  const { essSwitch, flatTesSwitch,flatEssSwitch } = swtName === 'ess' ? useESSSwitchStore() : useTESSwitchStore();
  
  const switchData = swtName === 'ess' ? flatEssSwitch : flatTesSwitch;
 
  const switchStatus =switchData[location][machine];
  

  const { ssrState, isFaults, isExpanded, activatedHeaters} = switchStatus;
  const [localActivatedHeaters, setLocalActivatedHeaters] = useState(
    activatedHeaters 
  );
  const userInfo = useUserStore();
  const { isAdministrator, isPasswordBoxOpen } = userInfo;
const [isUpdating, setIsUpdating] = useState(false);
  // local
  const [btnName, setBtnName] = useState('expand');
  const [openPasswordBox, setOpenPasswordBox] = useState(false);
  
  useEffect(() => {
    isExpanded ? setBtnName('close') : setBtnName('expand');
  }, [isExpanded]);

  useEffect(() => {
    getAllAdminHeatersService().then((res) => {
      if (res) {    
       
        useMCStore().addNewElements(res);
      }
    });
  }, []);

  const handleExpandDetail = () => {
    if (isExpanded) {
      swtName === 'ess'
        ? useESSSwitchStore().expandSSRDetail(location, machine)
        : useTESSwitchStore().expandSSRDetail(location, specificLocation, machine);
    } else {
      swtName === 'ess'
        ? useESSSwitchStore().expandSSRDetail(location, machine)
        : useTESSwitchStore().expandSSRDetail(location, specificLocation, machine);
    }
  };

  // useEffect(() => {
  //   openPasswordBox
  //     ? useAdminStore().setPasswordPropagation(true)
  //     : useAdminStore().setPasswordPropagation(false);
  // }, [openPasswordBox]);

  const handlePasswordBox = (status) => {
    if (!isAdministrator) {
      if (!isPasswordBoxOpen) {
        setOpenPasswordBox(true);
      } else {
        setOpenPasswordBox(false);
      }
    } else {
      setOpenPasswordBox(false);
    }
  };

  return (
    <>
      {isMobile ? (
        <Wrapper isMobile={true}>
          <MobileWrapper isFaults={isFaults} positionRelative={openPasswordBox}>
            <MobileInner>
              <MobileHeader>heater status</MobileHeader>

              <SectionDisplaySSR isMobile={true}>
                <DisplaySSRInner>
                  <BR>
                    {Object.keys(ssrState).map((ssr, index) => {
                      if (index < 4) {
                        return (
                          <DisplaySSR
                            isMobile={true}
                            key={ssrState[ssr]?.No + 1 || index}
                            status={ssrState[ssr]}
                            id={ssrState[ssr]?.No + 1 || index + 1}
                          />
                        );
                      }
                    })}
                  </BR>
                  <BR>
                    {Object.keys(ssrState).map((ssr, index) => {
                      if (index >= 4) {
                        return (
                          <DisplaySSR
                            isMobile={true}
                            key={ssrState[ssr]?.No + 1 || index}
                            status={ssrState[ssr]}
                            id={ssrState[ssr]?.No + 1 || index + 1}
                          />
                        );
                      }
                    })}
                  </BR>
                </DisplaySSRInner>
              </SectionDisplaySSR>
            </MobileInner>
          </MobileWrapper>

          {isExpanded && (
            <SectionSSRDetail isMobile={true}>
              {Object.keys(ssrState).map((data, index) => (
                <SSRDetail
                  swtName={swtName}
                  data={ssrState[data]}
                  key={index}
                  id={index + 1}
                  location={location}
                  machine={machine}
                  indivLocationName={indivLocationName}
                  deviceMac={deviceMac}
                />
              ))}
            </SectionSSRDetail>
          )}
          <SectionButton isMobile={true}>
            <Button onClick={handleExpandDetail} isMobile={true}>
              <ButtonOuter isMobile={true}>
                <ButtonHole isMobile={true}>
                  <ButtonTop isMobile={true}>
                    <ButtonTitle isMobile={true}>{btnName}</ButtonTitle>
                  </ButtonTop>
                </ButtonHole>
              </ButtonOuter>
            </Button>
          </SectionButton>
        </Wrapper>
      ) : (
        <Wrapper isFaults={isFaults} positionRelative={openPasswordBox}>
          <SectionHeader isExpanded={isExpanded}>
            <Title>heater status</Title>
          </SectionHeader>

          <SectionDisplaySSR>
            {Object.keys(ssrState).map((ssr, index) => {
              return (
                <DisplaySSR
                  key={ssrState[ssr]?.No + 1 || index}
                  status={ssrState[ssr]}
                  id={ssrState[ssr]?.No + 1 || index + 1}
                  swtName={swtName}
                />
              );
            })}

            <SettingButton onClick={() => handlePasswordBox()}>
              <SettingButtonHole>
                <SettingButtonTop>
                  <SettingIcon src='/images/ssr-force-setting.svg' />
                </SettingButtonTop>
              </SettingButtonHole>
            </SettingButton>
          </SectionDisplaySSR>
          {isExpanded && (
            <SectionSSRDetail>
              {Object.keys(ssrState).map((data, index) => (
                <SSRDetail
                  key={index}
                  swtName={swtName}
                  data={ssrState[data]}
                  id={index + 1}
                  location={location}
                  machine={machine}
                  indivLocationName={indivLocationName}
                  isUpdating={isUpdating}
                  setIsUpdating={setIsUpdating}
                  localActivatedHeaters={localActivatedHeaters}
                  setLocalActivatedHeaters={setLocalActivatedHeaters}
                  
                />
              ))}
            </SectionSSRDetail>
          )}
          <SectionButton>
            <Button onClick={handleExpandDetail}>
              <ButtonOuter>
                <ButtonHole>
                  <ButtonTop>
                    <ButtonTitle>{btnName}</ButtonTitle>
                  </ButtonTop>
                </ButtonHole>
              </ButtonOuter>
            </Button>
          </SectionButton>
          {openPasswordBox && (
            <PasswordBoxWrapper
              onClick={() => {
                setOpenPasswordBox(false);
              }}
            >
              <ContainerLogin
                handleClose={() => {
                  setOpenPasswordBox(false);
                }}
              />
            </PasswordBoxWrapper>
          )}
        </Wrapper>
      )}
    </>
  );
};

export default HeaterStatus;

const MobileWrapper = styled.div`
  width: 303px;
  height: 166px;
  border-radius: 22px;
  ${layerA};
  ${flexBoxCenter};
  margin-bottom: 10px;
`;
const MobileInner = styled.div`
  width: 299px;
  height: 162px;
  border-radius: 20px;
  ${layerA180Deg};
  ${flexDirectionColumn};
  padding: 4px 0 6px 0;
`;

const MobileHeader = styled.div`
  width: 289px;
  height: 30px;
  border-radius: 15px;
  ${layerA};
  ${flexBoxCenter};
  font-size: 14px;
  letter-spacing: 1.4px;
`;
const DisplaySSRInner = styled.div`
  width: 287px;
  height: 114px;
  border-radius: 14px;
  ${layerA180Deg};
  ${flexDirectionColumn};
  padding: 6px;
`;

const BR = styled.div`
  width: 100%;
  ${justifyContentSpaceBetween};
`;

// for desktop

const Wrapper = styled.div`
  ${flexDirectionColumn};
  ${(p) =>
    p.isMobile
      ? css``
      : css`
          width: 1180px;
          min-height: 169px;
          border-radius: 12px;
          margin-top: 5px;
          margin-bottom: 1px;
          ${layerA180Deg};

          padding: 4px 0 10px 0;
        `}

  ${(p) =>
    p.isFaults &&
    css`
      border: 1px solid red;
    `}

  ${(p) =>
    p.positionRelative &&
    css`
      position: relative;
    `}
`;
const SectionHeader = styled.section`
  width: 1171px;
  height: 32px;
  border-radius: 16px;

  ${layerADark};
  ${flexBoxCenter};

  ${(p) =>
    p.isExpanded &&
    css`
      margin-bottom: 10px;
    `}
`;
const Title = styled.span`
  width: 97%;
  font-size: 14px;
  letter-spacing: 1.4px;
  border-bottom: 1px solid #fff;
`;
const SectionDisplaySSR = styled.section`
  ${(p) =>
    p.isMobile
      ? css`
          width: 287px;
          height: 114px;
          border-radius: 14px;
          ${layerA180Deg}
          ${flexBoxCenter};
        `
      : css`
          width: 1171px;
          height: 68px;
          border-radius: 39px;

          ${layerADark};
          ${justifyContentSpaceBetween};

          padding: 0 16px 0 100px;
        `}
`;

const SectionSSRDetail = styled.section`
  ${(p) =>
    p.isMobile
      ? css``
      : css`
          margin: 8px 0;
          width: 1171px;
        `}

  /* min-height: 430px; */
  /* border: 1px solid red; */

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SectionButton = styled.section`
  width: 100%;
  ${flexBoxCenter}
`;

const Button = styled.button`
  width: 96px;
  height: 35px;
  border-radius: 27px;

  ${layerCLighter}
  ${flexBoxCenter}
`;
const ButtonOuter = styled.div`
  width: 94px;
  height: 33px;
  border-radius: 25px;

  ${layerA180Deg};
  ${flexBoxCenter}
`;
const ButtonHole = styled.div`
  width: 83px;
  height: 23px;

  border-radius: 20px;

  ${layerB};
  ${flexBoxCenter};
`;
const ButtonTop = styled.div`
  width: 81px;
  height: 21px;

  border-radius: 25px;

  ${layerA180Deg};
  ${flexBoxCenter};
`;
const ButtonTitle = styled.span`
  font-size: 9px;
`;

const SettingButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  ${layerA};
  ${flexBoxCenter}
`;
const SettingButtonHole = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  ${layerA180Deg};
  ${flexBoxCenter}
`;
const SettingButtonTop = styled.div`
  width: 27px;
  height: 27px;
  border-radius: 50%;

  ${layerA};
  ${flexBoxCenter}
`;
const SettingIcon = styled.img``;

const PasswordBoxWrapper = styled.div`
  width: 100%;
  border-radius: 16px;

  display: flex;
  justify-content: center;

  margin-top: 8px;
  padding: 16px;

  position: absolute;
  top: -50px;
  right: 0px;
  z-index: 100;
`;

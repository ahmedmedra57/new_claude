import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useUserStore } from '../zustand-stores';

import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerA90Deg,
  layerADark,
  layerB,
  layerC,
  layerCLighter,
} from '../styles/commonStyles';
import { useViewport } from 'use-viewport';
import { getTitle } from '../../helpers/helpers';
import { tabsSrc } from '../../constants';

const MobileMain = () => {
  const { height } = useViewport();

  // Global states
  const userInfo = useUserStore();
  const { isEssSwitch, isTesSwitch, isTgsSwitch } = userInfo;
  const { firstname, lastname, title, gender, user_id } = userInfo.user;

  // local states

  // ----- temporary state ------
  const isFault = false;
  // ----- temporary state ------

  // icon src options
  // const essSrc = isEssSwitch
  //   ? '/images/sidebar-ess.svg'
  //   : '/images/sidebar-ess-disabled.svg';
  const essSrc = isEssSwitch ? tabsSrc.ess.src : tabsSrc.ess.inactiveSrc;

  const tgsSrc = isTgsSwitch ? tabsSrc.tgs.src : tabsSrc.tgs.inactiveSrc;
  // const tgsSrc = isTgsSwitch
  //   ? '/images/sidebar-tgs.svg'
  //   : '/images/sidebar-tgs-disabled.svg';

  const tesSrc = isTesSwitch ? tabsSrc.tes.src : tabsSrc.tes.inactiveSrc;
  // const tesSrc = isTesSwitch
  //   ? '/images/sidebar-tes.svg'
  //   : '/images/sidebar-tes-disabled.svg';

  const faultSrc = isFault ? tabsSrc.faults.redSrc : tabsSrc.faults.src;
  // const faultSrc = isFault
  //   ? '/images/sidebar-faults-faults.svg'
  //   : '/images/sidebar-faults.svg';

  const initialSrc2 = [
    tabsSrc.masterControl.src,
    tabsSrc.telemetry.inactiveSrc,
    tabsSrc.heatingPlatform.inactiveSrc,
  ];
  // const initialSrc2 = [
  //   '/images/sidebar-master-control.svg',
  //   '/images/sidebar-telemetry-disabled.svg',
  //   '/images/sidebar-hp-disabled.svg',
  // ];
  const initialSrc1 = [essSrc, tgsSrc, tesSrc];

  const initialSrc3 = [
    tabsSrc.setting.src,
    faultSrc,
    tabsSrc.reportStatus.inactiveSrc,
  ];
  // const initialSrc3 = [
  //   '/images/sidebar-setting.svg',
  //   faultSrc,
  //   '/images/sidebar-report-status-disabled.svg',
  // ];
  const [src1, setSrc1] = useState(initialSrc1);
  const [src2, setSrc2] = useState(initialSrc2);
  const [src3, setSrc3] = useState(initialSrc3);

  const link1 = ['/ess', '/tgs', '/tes'];
  const link2 = ['/masterControl', '/', '/'];
  const link3 = ['/settings', '/faults', '/'];

  const location = useLocation();
  const { pathname } = location;

  // logic for chang button styles but no need on mobile version
  const handleGroupA = (id) => {
    setSrc2(initialSrc2);
    setSrc3(initialSrc3);

    const arr = [...initialSrc1];
    switch (id) {
      case 0:
        arr[id] = '/images/sidebar-ess-active.svg';
        setSrc1(arr);
        break;
      case 1:
        arr[id] = '/images/sidebar-tgs-active.svg';
        setSrc1(arr);
        break;
      case 2:
        arr[id] = '/images/sidebar-tes-active.svg';
        setSrc1(arr);
        break;
    }
  };

  const handleGroupB = (id) => {
    setSrc1(initialSrc1);
    setSrc3(initialSrc3);

    const arr = [...initialSrc2];
    switch (id) {
      case 0:
        arr[id] = '/images/master-control-active.svg';
        setSrc2(arr);
        break;
      case 1:
        arr[id] = '/images/sidebar-telemetry-active.svg';
        setSrc2(arr);
        break;
      case 2:
        arr[id] = '/images/sidebar-hp-disabled.svg';
        setSrc2(arr);
        break;
    }
  };

  const handleGroupC = (id) => {
    setSrc1(initialSrc1);
    setSrc2(initialSrc2);

    const arr = [...initialSrc3];
    switch (id) {
      case 0:
        arr[id] = '/images/sidebar-setting-active.svg';
        setSrc3(arr);
        break;
      case 1:
        arr[id] = isFault
          ? '/images/sidebar-faults-red-active.svg'
          : '/images/sidebar-faults-active.svg';
        setSrc3(arr);
        break;
      case 2:
        arr[id] = '/images/sidebar-report-status-active.svg';
        setSrc3(arr);
        break;
    }
  };

  const handleLogButton = () => {
    window.alert('log out process');
  };

  return (
    <Wrapper>
      <SectionHeader>
        <HeaderHole>
          <HeaderTop>
            <HeaderTitleWrapper>
              <InfoLayoutWrapper userInfo={true}>
                <HeaderInfoSpan>
                  {getTitle(gender)} {firstname} {lastname}
                </HeaderInfoSpan>
                <HeaderInfoSpan>uos user id : {user_id}</HeaderInfoSpan>
              </InfoLayoutWrapper>
              <Divider />
              <InfoLayoutWrapper>
                <HeaderInfoSpan>{title}</HeaderInfoSpan>
              </InfoLayoutWrapper>
            </HeaderTitleWrapper>
            <Button onClick={handleLogButton}>
              <ButtonHole>
                <ButtonTop>log out</ButtonTop>
              </ButtonHole>
            </Button>
          </HeaderTop>
        </HeaderHole>
      </SectionHeader>

      <SectionContents height={height - 215}>
        <SectionInnerWrapper height={height - 221}>
          <IconGroupWrapper>
            <InnerWrapper>
              <IconWrapper>
                {src1.map((src, index) => (
                  <NavLinkButton to={link1[index]} key={index}>
                    <IconImg src={src} />
                  </NavLinkButton>
                ))}
              </IconWrapper>
              <IconWrapper>
                {src2.map((src, index) => (
                  <NavLinkButton to={link2[index]} key={index}>
                    <IconImg src={src} />
                  </NavLinkButton>
                ))}
              </IconWrapper>
              <IconWrapper>
                {src3.map((src, index) => (
                  <NavLinkButton to={link3[index]} key={index}>
                    <IconImg src={src} />
                  </NavLinkButton>
                ))}
              </IconWrapper>
            </InnerWrapper>
          </IconGroupWrapper>
        </SectionInnerWrapper>
      </SectionContents>
    </Wrapper>
  );
};

export default MobileMain;

const Wrapper = styled.div`
  width: 100%;
`;

const SectionHeader = styled.section`
  width: 332px;
  height: 54px;
  border-radius: 27px;
  ${layerA};
  ${flexBoxCenter};
  margin-bottom: 5px;
`;
const HeaderHole = styled.div`
  width: 328px;
  height: 50px;
  border-radius: 25px;

  ${layerA180Deg};
  ${flexBoxCenter};
`;
const HeaderTop = styled.div`
  width: 316px;
  height: 38px;
  border-radius: 19px;

  ${layerADark};
  ${justifyContentSpaceBetween}
  padding: 0 3px 0 10px;
`;

const Button = styled.button`
  width: 96px;
  height: 32px;
  border-radius: 16px;

  ${layerA180Deg};
  ${flexBoxCenter};
`;
const ButtonHole = styled.div`
  width: 90px;
  height: 26px;
  border-radius: 20px;

  ${layerB};
  ${flexBoxCenter};
`;
const ButtonTop = styled.div`
  width: 88px;
  height: 24px;
  border-radius: 25px;
  ${layerA180Deg};

  ${flexBoxCenter};
`;

const HeaderTitleWrapper = styled.div`
  width: 202px;
  height: 80%;
  ${flexDirectionColumn}
`;

const HeaderInfoSpan = styled.span`
  width: 100%;
  // height: 20%;
  font-size: 8px;
`;
const InfoLayoutWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 2px;
  ${({ userInfo }) =>
    userInfo &&
    css`
      overflow: hidden;
      text-overflow: ellipsis;
    `}

  ${justifyContentSpaceBetween}
`;
const Divider = styled.div`
  width: 100%;
  border: 0.7px solid #ffff;
`;

const SectionContents = styled.section`
  width: 332px;
  ${({ height }) =>
    height
      ? css`
          min-height: ${height}px;
        `
      : css`
          min-height: 100vh;
        `}
  /* height: 505px; */
  border-radius: 31px 31px 36px 13px;
  ${layerCLighter};
  ${flexBoxCenter};
`;
const SectionInnerWrapper = styled.div`
  width: 326px;
  ${({ height }) =>
    height
      ? css`
          min-height: ${height}px;
        `
      : css`
          min-height: 100vh;
        `}
  /* height: 498px; */
  border-radius: 28px 28px 33px 10px;
  ${layerA90Deg};
  ${flexBoxCenter};
`;

const IconGroupWrapper = styled.div`
  width: 316px;
  height: 300px;
  border-radius: 54px;

  ${layerA180Deg};
  ${flexBoxCenter};
`;
const InnerWrapper = styled.div`
  width: 312px;
  height: 296px;
  border-radius: 51px;

  ${layerA90Deg};
  ${justifyContentSpaceBetween}
  padding: 0 5px;
`;

const IconWrapper = styled.div`
  width: 92px;
  height: 283px;
  border-radius: 48px;

  ${layerA}
  ${flexDirectionColumn} 
  padding: 2px 0;
`;

const NavLinkButton = styled(NavLink)`
  width: 88px;
  height: 88px;
  ${flexBoxCenter};

  &:hover {
    ${(p) =>
      css`
        transform: scale(102%);
        img:last-child {
          filter: invert(5%);
        }
      `}
  }
`;
const IconImg = styled.img`
  height: 100%;
`;

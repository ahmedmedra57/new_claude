import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA180Deg,
  layerADisabled180Deg,
  layerBDisabled,
  layerC,
} from '../../styles/commonStyles';
import ExpandButton from '../../faults/ExpandButton';
import InfoDisplayBox from '../common/InfoDisplayBox';
import HpMasterControlAndOverSight from '../masterControlAndOverSight';
import { tabsSrc } from '../../../constants';

const TransitStation = ({ data }) => {
  const hpLogoList = {
    active: tabsSrc.heatingPlatform.purpleCircleActiveSrc,
    standard: tabsSrc.heatingPlatform.purpleCircleSrc,
    deactivate: '',
  };
  // const hpLogoList = {
  //   active: '/images/hp-active-button.svg',
  //   standard: '/images/hp-button.svg',
  //   deactivate: '',
  // };

  const [isExpand, setIsExpand] = useState(false);
  const [HPLogo, setHPLogo] = useState(hpLogoList.standard);

  useEffect(() => {
    if (isExpand) {
      setHPLogo(hpLogoList.active);
    } else {
      setHPLogo(hpLogoList.standard);
    }
  }, [isExpand]);

  const expandHandler = () => {
    setIsExpand((prev) => !prev);
  };

  return (
    <Wrapper isExpand={isExpand}>
      <InnerWrapper isExpand={isExpand}>
        <LogoWrapper onClick={expandHandler}>
          <Img src={HPLogo} alt='hp button' />
        </LogoWrapper>
        <SectionTitle>
          <Title>
            {data.company} - {data.stationTitle}, {data.address}
          </Title>
          <Divider></Divider>
        </SectionTitle>
        <InfoDisplayBox segmentTitles={data.segmentTitles} />
        <ExpandButton
          handleOnClick={expandHandler}
          name={isExpand ? 'close' : 'expand'}
          disabled={''}
        />
      </InnerWrapper>
      {isExpand && <HpMasterControlAndOverSight dataAccessKey={data.id} />}
    </Wrapper>
  );
};

export default TransitStation;

const Wrapper = styled.div`
  width: 1208px;
  height: auto;
  padding: 2px 0;
  /* height: 76px; */

  margin-top: 8px;
  &:first-child {
    margin-top: 0;
  }

  ${(p) =>
    p.isExpand
      ? css`
          padding: 2px 0 3px 0;
          border-radius: 38px 38px 33px 33px;
          /* border-radius: 38px 38px 56px 56px; */
          ${flexDirectionColumn}
        `
      : css`
          border-radius: 38px;
        `}

  ${(p) =>
    p.isFaults &&
    css`
      border: 1px solid red;
    `}

    ${layerC}
    ${flexBoxCenter}
`;

const InnerWrapper = styled.div`
  width: 1204px;
  height: auto;
  /* height: 70px; */
  border-radius: 70px;
  padding: 0 15px 0 5px;
  ${(p) =>
    p.isExpand &&
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
  width: 652px;
  ${justifyContentSpaceBetween}
`;
const Title = styled.span`
  width: 488px;
  font-size: 14px;
  letter-spacing: 1.2px;
`;
const Img = styled.img`
  height: 100%;
`;

const Divider = styled.div`
  width: 282px;
  border-bottom: 1px solid #ffffff;
`;

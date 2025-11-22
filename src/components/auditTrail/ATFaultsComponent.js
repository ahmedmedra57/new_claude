import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentFlexStart,
  justifyContentSpaceBetween,
  layerA180Deg,
  layerA,
  layerC,
  layerBDisabled,
  layerADisabled180Deg,
} from '../styles/commonStyles';

import ExpandButton from '../faults/ExpandButton';

const ATFaultComponent = ({ isReadyToRender, isExpanded, handleExpand }) => {
  const { t } = useTranslation();
  const number = 0;
  const imgSrc = isExpanded
    ? '/images/at-fault-activated.svg'
    : '/images/at-fault.svg';

  const handleOpenDetail = () => {
    isReadyToRender && handleExpand();
  };

  return (
    <Wrapper>
      <InnerWrapper isExpanded={isExpanded}>
        <LogoWrapper onClick={handleOpenDetail}>
          <Img src={imgSrc} />
        </LogoWrapper>

        <Divider></Divider>

        <DisplaySummation>
          <DetailsNumber>{number ? number : 0}</DetailsNumber>
          <DetailsTitle>{t('auditTrail.faultsHistory')}</DetailsTitle>
        </DisplaySummation>

        <ExpandButton
          handleOnClick={handleOpenDetail}
          name={isExpanded ? t('common.close') : t('common.expand')}
        />
      </InnerWrapper>
      {/* {isExpanded && (
        <DetailWrapper>
          <DetailInnerWrapper>
            <DetailInnerTop>
              {message.map((msg, index) => (
                <FaultsDetails
                  name={name}
                  key={index}
                  column={index}
                  handleButtonClick={handleButtonClick}
                  faultContents={msg}
                />
              ))}
            </DetailInnerTop>
          </DetailInnerWrapper>
        </DetailWrapper>
      )} */}
    </Wrapper>
  );
};

export default ATFaultComponent;

const Wrapper = styled.div`
  width: 1212px;
  border-radius: 38px;
  ${layerC}
  ${flexBoxCenter}

  margin-top: 8px;
  &:first-child {
    margin-top: 0;
  }

  ${(p) =>
    p.isExpanded
      ? css`
          height: auto;
          padding: 2px 0;
          border-radius: 38px;
          ${flexDirectionColumn}
        `
      : css`
          height: 76px;
        `}

  ${(p) =>
    p.isFaults &&
    css`
      border: 1px solid red;
    `}
`;

const InnerWrapper = styled.div`
  width: 1204px;
  border-radius: 70px;
  ${(p) =>
    p.isExpanded
      ? css`
          height: none;
        `
      : css`
          height: 70px;
        `}

  ${layerA180Deg}
  ${justifyContentSpaceBetween}
  padding: 0 15px 0 5px;

  ${(p) =>
    p.isDisabled &&
    css`
      ${layerADisabled180Deg}
    `}
`;

const LogoWrapper = styled.div`
  width: 61px;
  height: 61px;
  border-radius: 50%;
  cursor: pointer;

  ${layerC}
  ${flexBoxCenter}
`;

const Img = styled.img``;

const Divider = styled.div`
  width: 683px;

  border: 1px solid #ffffff;
`;

const DisplaySummation = styled.div`
  width: 320px;
  height: 62px;
  border-radius: 31px;

  ${layerA}
  ${justifyContentSpaceBetween}
  padding: 0 4px 0 14px;

  ${(p) =>
    p.isDisabled &&
    css`
      ${layerBDisabled}
    `}
`;

const DetailsNumber = styled.span`
  font-size: 48px;
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
  width: 90%;
  font-size: 12px;
`;

const DetailWrapper = styled.div`
  width: 1204px;
  border-radius: 16px 16px 35px 35px;

  margin: 8px 0 6.5px 0;
  padding: 1px 0;

  ${layerA180Deg}
  border: 1px solid #142033;
  ${flexBoxCenter}
`;
const DetailInnerWrapper = styled.div`
  width: 1200px;
  border-radius: 14px 14px 32px 32px;

  ${layerA180Deg}
  border: 0.5px solid #142033;

  ${flexBoxCenter}

  padding: 5px 0 20px 0;
`;

const DetailInnerTop = styled.div`
  width: 1187px;
  border-radius: 9px;

  ${flexDirectionColumn}

  ${layerA}
  box-shadow: inset 0px 0px 6px #000000;

  padding: 4px 0;
`;

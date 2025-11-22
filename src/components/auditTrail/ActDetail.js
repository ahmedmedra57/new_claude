import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerB,
} from '../styles/commonStyles';

const ActDetail = () => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const button = isExpanded ? t('common.close') : t('common.expand');

  const address = 'boston messachusettes';
  const date = '3:50am - 02/06/2022';
  const fileName = 'mca-lea-200622-03';

  return (
    <Wrapper>
      <DetailHatWrapper>
        <DetailHat first={true}>
          <HatTitle>bet east #10 s.t. - ess</HatTitle>
        </DetailHat>
        <DetailHat second={true}>
          <HatTitle second={true}>ate</HatTitle>
        </DetailHat>
      </DetailHatWrapper>

      <DetailContentWrapper isExpanded={isExpanded}>
        <InvisibleWrapper>
          <SectionDetail>
            <InfoSpan option={'location'}>{address}</InfoSpan>
            <InfoSpan option={'date'}>{t('common.date')} : {date}</InfoSpan>
            <InfoSpan>-</InfoSpan>
            <InfoSpan option={'command'}>{fileName}</InfoSpan>
          </SectionDetail>
          <SectionButton>
            <Button onClick={() => setIsExpanded(!isExpanded)}>
              <ButtonHole>
                <ButtonTop>{button}</ButtonTop>
              </ButtonHole>
            </Button>
          </SectionButton>
        </InvisibleWrapper>
        {/* {isExpanded && (
          <SectionActReport>
            <SectionInfo>
              <InfoHeader>
                <InfoTitle></InfoTitle>
              </InfoHeader>
              <InfoDetailWrapper></InfoDetailWrapper>
            </SectionInfo>
            <SectionInfo option={true}>
              <InfoHeader>
                <InfoTitle option={true}></InfoTitle>
              </InfoHeader>
              <InfoDetailWrapper></InfoDetailWrapper>
            </SectionInfo>
          </SectionActReport>
        )} */}
      </DetailContentWrapper>
    </Wrapper>
  );
};

export default ActDetail;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 8px;
`;

const DetailHatWrapper = styled.div`
  width: 100%;
  display: flex;
  padding-left: 30px; ;
`;

const DetailHat = styled.div`
  height: 24px;
  ${flexBoxCenter}

  ${(p) =>
    p.first
      ? css`
          width: 398px;
          background: url('/images/at-detail-hat-a.svg') no-repeat;
          margin-right: 16px;
        `
      : css`
          width: 96px;
          background: url('/images/at-detail-hat-b.svg') no-repeat;
        `}
`;
const HatTitle = styled.span`
  font-size: 14px;
  letter-spacing: 1.4px;
  margin-left: -14px;
`;

const DetailContentWrapper = styled.div`
  width: 1191px;
  height: 44px;
  border-radius: 22px;

  ${layerA180Deg}
  border: 0.5px solid #000000;
  ${flexBoxCenter}
  ${(p) =>
    p.isExpanded &&
    css`
      height: 206px;
      border-radius: 22px;
      flex-direction: column;
      justify-content: space-between;
    `}
`;

const InvisibleWrapper = styled.div`
  width: 100%;
  ${justifyContentSpaceBetween}
  padding: 0 8px 0 5px;
`;
const SectionDetail = styled.div`
  width: 1090px;
  height: 36px;
  border-radius: 41px;

  ${layerA}
  box-shadow: inset 0px 0px 6px #000000;
  ${justifyContentSpaceBetween}
  padding: 0 8px 0 8px;
`;

const InfoSpan = styled.span`
  font-size: 12px;
  letter-spacing: 1.2px;

  ${(p) =>
    p.option === 'location'
      ? css`
          width: 412px;
          text-align: left;
        `
      : p.option === 'date'
      ? css`
          width: 276px;
          color: #fcff01;
          text-align: center;
        `
      : p.option === 'command'
      ? css`
          width: 222px;
          text-align: right;
        `
      : css``}
`;

const SectionButton = styled.secton`
  width: 79px;
  height: 28px;
  border-radius: 18px;

  ${layerB};
  ${flexBoxCenter}
`;
const Button = styled.button`
  width: 77px;
  height: 26px;
  border-radius: 18px;

  ${layerA180Deg}
  ${flexBoxCenter}
`;
const ButtonHole = styled.div`
  width: 69px;
  height: 18px;
  border-radius: 18px;

  ${layerB}
  ${flexBoxCenter}
`;
const ButtonTop = styled.div`
  width: 67px;
  height: 16px;
  border-radius: 25px;

  ${layerA180Deg}
  ${flexBoxCenter}
  font-size: 8px;
`;

const SectionActReport = styled.section`
  width: 1181px;
  height: 156px;
  border-radius: 10px 10px 16px 16px;

  ${layerA}
  border: 0.25px solid #1B2B44;

  ${justifyContentSpaceBetween}
`;

const SectionInfo = styled.section`
  width: 646px;
  height: 152px;
  border-radius: 8px 8px 8px 14px;

  ${(p) =>
    p.option &&
    css`
      width: 516px;
    `}

  ${layerA180Deg}
  border: 0.5px solid #000000;

  ${flexDirectionColumn}
`;

const InfoHeader = styled.div`
  width: 100%;
  height: 33px;
  border-radius: 17px;

  ${layerA}
  box-shadow: inset 0px 0px 6px #000000;
  ${justifyContentSpaceBetween}
`;
const InfoTitle = styled.span`
  font-size: 12px;
  letter-spacing: 1.2px;
  text-align: left;
  ${(p) =>
    p.option &&
    css`
      color: #fcff01;
    `};
`;

const InfoDetailWrapper = styled.div`
  width: 100%;
  height: 106px;
  border-radius: 12px;

  ${layerA};
  box-shadow: inset 0px 0px 6px #000000;
`;

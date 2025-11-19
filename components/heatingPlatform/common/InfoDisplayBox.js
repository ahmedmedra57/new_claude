import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import {
  alignItemsFlexStart,
  flexBoxCenter,
  justifyContentSpaceBetween,
  layerA,
  layerBDisabled,
} from '../../styles/commonStyles';

const InfoDisplayBox = ({ segmentTitles }) => {
  const faultLogoList = {
    active: '',
    inactive: '/images/alert-logo.svg',
  };

  const [faultLogo, setFaultLogo] = useState(faultLogoList.inactive);
  return (
    <Wrapper>
      <FlexDiv first={true}>
        <Span largeFont={true}>{segmentTitles.length}</Span>
        <Span>segments</Span>
      </FlexDiv>
      <FlexDiv second={true}>
        {segmentTitles.map((title, titleIdx) => (
          <Span key={titleIdx} mediumFont={true}>
            {title}
          </Span>
        ))}
      </FlexDiv>
      <FlexDiv>
        <Img src={faultLogo} alt='fault bell' />
      </FlexDiv>
    </Wrapper>
  );
};

export default InfoDisplayBox;

const Wrapper = styled.div`
  width: 374px;
  height: 65px;
  border-radius: 31px;
  padding: 0 6px;

  ${layerA}
  ${justifyContentSpaceBetween}
  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled}
    `}    

  ${(p) =>
    p.isOptional &&
    css`
      justify-content: flex-start;
    `}

  ${(p) =>
    p.isDisabled &&
    css`
      ${layerBDisabled}
    `}
`;

const FlexDiv = styled.div`
  ${({ first, second }) =>
    first
      ? css`
          width: 47px;
          height: 54px;
          ${flexBoxCenter}
          flex-direction: column;
          padding-left: 20px;
        `
      : second
      ? css`
          width: 217px;
          height: auto;
          ${alignItemsFlexStart}
          flex-direction: column;
          overflow: ellipsis;
        `
      : css`
          ${flexBoxCenter}
        `}
`;
const Span = styled.span`
  ${({ largeFont, mediumFont }) =>
    largeFont
      ? css`
          font-size: 38px;
        `
      : mediumFont
      ? css`
          font-size: 9px;
        `
      : css`
          font-size: 6px;
        `}
`;

const Img = styled.img`
  height: 100%;
`;

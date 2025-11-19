import React from 'react';
import styled, { css } from 'styled-components';
import { flexBoxCenter, layerHPF, layerHPG } from '../../styles/commonStyles';

const YellowDisplayBox = ({
  wrapperXSize,
  wrapperYSize,
  innerXLayer,
  innerYLayer,
}) => {
  return (
    <Wrapper width={wrapperXSize} height={wrapperYSize}>
      <FirstLayer width={innerXLayer} height={innerYLayer}></FirstLayer>
    </Wrapper>
  );
};

export default YellowDisplayBox;

const Wrapper = styled.div`
  ${({ width }) =>
    width &&
    css`
      width: ${width};
    `}
  ${({ height }) =>
    height &&
    css`
      height: ${height};
    `}

${layerHPF}
  /* background: transparent
    linear-gradient(180deg, #d9d24b 0%, #aea951 61%, #67665c 100%) 0% 0%
    no-repeat padding-box;
  box-shadow: 0px 0px 3px #000000; */
  border-radius: 6px;
  ${flexBoxCenter}
`;

const FirstLayer = styled.div`
  ${({ width }) =>
    width &&
    css`
      width: ${width};
    `}
  ${({ height }) =>
    height &&
    css`
      height: ${height};
    `}

    ${layerHPG}
  /* background: transparent linear-gradient(180deg, #2e2e1e 0%, #fef100 100%) 0%
    0% no-repeat padding-box;
  border: 1px solid #ffe600; */
  border-radius: 2px;
`;

import React from 'react';
import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  hpBaseLayer,
  layerDegHPB,
  layerDegHPC,
  layerHPA,
} from '../../../../styles/commonStyles';

const DropBoxButton = ({ buttonsHandler, title }) => {
  return (
    <IndentLayer>
      <FistLayer>
        <SecondIndentLayer>
          <TopLayer onClick={() => buttonsHandler(title)}>{title}</TopLayer>
        </SecondIndentLayer>
      </FistLayer>
    </IndentLayer>
  );
};

export default DropBoxButton;

const IndentLayer = styled.div`
  border-radius: 20px;
  height: 20px;
  width: 80px;
  ${layerHPA}
  /* background: var(--LIGHT-BACKGROUND, #233a54);
  box-shadow: 0px 0px 2px 0px #000 inset; */

  ${flexBoxCenter}
`;

const FistLayer = styled.div`
  height: 19px;
  width: 79px;

  border-radius: 18px;
  ${layerDegHPB}
  /* border: 0.5px solid #000;
  background: linear-gradient(180deg, #233a54 0%, #060d19 100%);
  box-shadow: 0px 0.5px 1px 0px rgba(255, 255, 255, 0.25) inset; */

  ${flexBoxCenter}
`;

const SecondIndentLayer = styled.div`
  height: 15px;
  width: 75px;

  border-radius: 18px;
  ${layerDegHPC}
  /* background: var(
    --Light_blue_100,
    linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
    #233a54
  );
  box-shadow: 0px 0px 3px 0px #000 inset; */
  ${flexBoxCenter}
`;

const TopLayer = styled.button`
  height: 13px;
  width: 71px;

  font-size: 10px;

  border-radius: 16px;
  ${layerDegHPB}
  /* border: 0.5px solid #000;
  background: linear-gradient(180deg, #233a54 0%, #060d19 100%);
  box-shadow: 0px 0.5px 1px 0px rgba(255, 255, 255, 0.25) inset; */

  ${flexBoxCenter}
`;

import { css } from 'styled-components';

// flex box layouts
export const flexBoxCenter = css`
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`;

export const flexboxCenter = css`
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`;

export const justifyContentSpaceEvenly = css`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

export const justifyContentSpaceBetween = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const justifyContentSpaceAround = css`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

export const flexDirectionColumn = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

export const alignItemsFlexStart = css`
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

export const alignItemsFlexEnd = css`
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;

export const justifyContentFlexStart = css`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const justifyContentFlexEnd = css`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
// -------------------------------------------------------
// e.g 4 layers button a, b, a, b
export const layerA0Deg = css`
  background: transparent linear-gradient(0deg, #233a54 0%, #060d19 100%);
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid #000000;
`;

export const layerA180Deg = css`
  background: transparent linear-gradient(180deg, #233a54 0%, #060d19 100%);
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid #000000;
`;

export const layerA180DegLighter = css`
  background: transparent linear-gradient(180deg, #233a54 0%, #1f344c 100%);
  box-shadow: inset 0px 0px 2px #ffffff29, 0px 0px 1px #000000;
  border: 1px solid #000000;
`;

export const layerAGreen180Deg = css`
  background: transparent linear-gradient(180deg, #4baf00 0%, #124000 100%);
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid #000000;
`;

export const layerADisabled180Deg = css`
  background: transparent linear-gradient(180deg, #565656 0%, #1d1d1d 100%);
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid #000000;
`;

export const layerDisabled180Deg = css`
  ${layerADisabled180Deg}
  cursor: not-allowed;
`;

export const layerA90Deg = css`
  background: transparent linear-gradient(90deg, #233a54 0%, #060d19 100%);
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid #000000;
`;
export const layerA270Deg = css`
  background: transparent
    linear-gradient(270deg, #060d19 0%, #233a54 50%, #060d19 100%) 0% 0%
    no-repeat padding-box;
  box-shadow: inset 1px 1px 2px #ffffff29, 0px 0px 1px #000000;
  border: 0.5px solid #000000;
`;

export const layerA = css`
  background: #233a54;
  box-shadow: inset 0px 0px 3px #000000;
`;
export const layerADark = css`
  background: #233a54;
  box-shadow: inset 0px 0px 6px #000000;
`;

export const layerBDark = css`
  background: #1b2b44;
  box-shadow: inset 0px 0px 6px #000000;
`;

export const layerBMedium = css`
  background: #1b2b44;
  box-shadow: inset 0px 0px 3px #000000;
`;

export const layerB = css`
  background: #1b2b44;
  box-shadow: inset 0px 0px 1px #000000;
`;

export const layerBGreen = css`
  background: #124000;
  box-shadow: inset 0px 0px 1px #000000;
`;

export const layerC = css`
  background: #142033;
  box-shadow: inset 0px 0px 6px #000000;
`;
export const layerCLighter = css`
  background: #142033;
  box-shadow: inset 0px 0px 1px #000000;
`;

export const layerADisabled = css`
  background: #565656;
  box-shadow: inset 0px 0px 2px #000000;
`;

export const layerBDisabled = css`
  background: #3b3b3b;
  box-shadow: inset 0px 0px 6px #000000;
`;

export const layerCDisabled = css`
  background: #393939;
  box-shadow: inset 0px 0px 1px #000000;
`;

export const layerCDarkDisabled = css`
  background: #393939;
  box-shadow: inset 0px 0px 6px #000000;
`;

export const layerDDark = css`
  background: #18253a;
  box-shadow: inset 0px 0px 6px #000000;
`;

export const layerDDisabled = css`
  background: #242424;
  box-shadow: inset 0px 0px 6px #000000;
`;
export const layerE = css`
  background-color: rgba(149, 255, 69, 0.2);
  box-shadow: 0px 0px 4px #000000;
`;

// borders
export const borderBlue = css`
  border: 1px solid #233a54;
`;

export const borderABlue = css`
  border: 1px solid #142033;
`;

export const borderBBlue = css`
  border: 1px solid #18253a;
`;

export const borderC = css`
  border: 1px solid #1b2b44;
`;

export const borderDisabled = css`
  border: 1px solid #3b3b3b;
`;

export const borderADisabled = css`
  border: 1px solid #707070;
`;

export const selectionCircleBorder = css`
  border: 1px solid rgba(149, 255, 69, 1);
`;
//font color
export const fontColorA = css`
  color: #1b2b44;
`;

// messageBox transparent background
export const messageBoxBackground = css`
  background: transparent linear-gradient(180deg, #77777742 0%, #c2c2c224 100%);
  box-shadow: inset 0px 1px 1px #ffffff24, 0px 0px 6px #000000;
  border: 0.5px solid #000000;
`;

export const readyTop180Deg = css`
  background: transparent linear-gradient(180deg, #1e7fc1 0%, #001640 100%);
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid #000000;
`;
export const activeLayer180Deg = css`
  background: transparent linear-gradient(180deg, #4baf00 0%, #124000 100%);
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid #000000;
`;

// activated input || button hole
export const activeInput = css`
  background: #124000;
  box-shadow: inset 0px 0px 3px #000000;
`;

export const MC_SELECTED_READY = css`
  border: 1px solid #83ffff;
`;
export const MC_SELECTED = css`
  border: 1px solid #95ff45;
`;
// -------------------------------------------------------

export const marginBottom = css`
  margin-bottom: 5px;
`;

export const ssrHole = css`
  background: #142033;
  box-shadow: inset 0px 0px 1px #000000;
`;

export const ssrOn = css`
  background: transparent linear-gradient(180deg, #4baf00 0%, #124000 100%);
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid #000000;
  border-radius: 25px;
`;

export const ssrOff = css`
  background: transparent linear-gradient(180deg, #565656 0%, #1d1d1d 100%);
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid #000000;
`;

export const ControllerDisabledBackground = css`
  background: transparent linear-gradient(90deg, #565656 0%, #1d1d1d 100%);
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid #000000;
  border-radius: 4px;
`;

export const ControllerEnabledBackground = css`
  background: transparent linear-gradient(90deg, #233a54 0%, #060d19 100%);
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid #000000;
  border-radius: 4px;
  background-image: -webkit-linear-gradient(
    180deg,
    rgb(0, 0, 0) 0%,
    rgb(35, 58, 84) 100%
  );

  box-shadow: 0 0 2px rgba(0, 0, 0, 100%);
`;

export const DisableApplyButtonBG = css`
  background: transparent linear-gradient(180deg, #565656 0%, #1d1d1d 100%);
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid #000000;
`;

export const DisableApplyButtonHole = css`
  background: #3b3b3b;
  box-shadow: inset 0px 0px 1px #000000;
`;

export const DisableButtonIndentTop = css`
  background: #3b3b3b;
  box-shadow: inset 0px 0px 6px #000000;
`;

export const ItemBackground = css`
  background: #233a54;
  box-shadow: inset 0px 0px 2px #000000;
  border-radius: 12px;
`;

export const ItemBackgroundDisable = css`
  background: #3b3b3b;
  box-shadow: inset 0px 0px 2px #000000;

  border-radius: 12px;
`;
export const grayModeLayer = css`
  background: transparent linear-gradient(180deg, #565656 0%, #1d1d1d 100%) 0%
    0% no-repeat padding-box;
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid #000000;
`;

export const ButtonReady = css`
  background: transparent linear-gradient(180deg, #1e7fc1 0%, #001640 100%);
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid #000000;
`;

/*background of layer 2 when colors transition from left to right*/
export const layer2HorizontalGradient = css`
  border-style: solid;
  border-width: 0.5px;
  border-color: rgb(0, 0, 0);

  background-image: -webkit-linear-gradient(
    90deg,
    rgb(0, 0, 0) 0%,
    rgb(35, 58, 84) 100%
  );

  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 14%);
  box-shadow: 0 0 2px rgba(0, 0, 0, 100%);
`;

/*background of layer 2 when colors transition from top to bottom*/
export const layer2VerticalGradient = css`
  border-style: solid;
  border-width: 0.5px;
  border-color: rgb(0, 0, 0);

  background-image: -webkit-linear-gradient(
    180deg,
    rgb(0, 0, 0) 0%,
    rgb(35, 58, 84) 100%
  );

  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 14%);
  box-shadow: 0 0 2px rgba(0, 0, 0, 100%);
`;

/* background of whole box included layer 1 and 2 to be green  when activated*/
export const activeLayer = css`
  background: transparent linear-gradient(180deg, #4baf00 0%, #124000 100%) 0%
    0% no-repeat padding-box;
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid #000000;
`;

// ****scroll bars****

export const scrollbarY = css`
  scroll-behavior: smooth;
  overflow-y: auto;
  overflow-x: hidden;

  ::-webkit-scrollbar {
    width: 10px;
    border: 1px solid #ffffff;
    border-radius: 13px;
  }
  ::-webkit-scrollbar-track {
  }

  ::-webkit-scrollbar-thumb {
    background-color: #ffffff;
    border-radius: 13px;
    border: 1.5px solid transparent;
    background-clip: padding-box;
    height: 40%;
  }

  ::-webkit-scrollbar-button:start:decrement {
    background-repeat: no-repeat;
    background-size: 70%;
    background-position: center;
    height: 10px;

    background-image: url('/images/scrollbar-button-start.svg');
  }
  ::-webkit-scrollbar-button:end:increment {
    background-repeat: no-repeat;
    background-size: 70%;
    background-position: center;
    height: 10px;

    background-image: url('/images/scrollbar-button-end.svg');
  }
`;

export const scrollbarX = css`
  scroll-behavior: smooth;
  overflow-x: scroll;
  overflow-y: hidden;

  ::-webkit-scrollbar {
    width: 14px;
    height: 14px;
    border: 1px solid #ffffff;
    border-radius: 13px;
  }
  ::-webkit-scrollbar-track {
  }

  ::-webkit-scrollbar-corner {
    background-color: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #ffffff;
    border-radius: 13px;
    border: 1.5px solid transparent;
    background-clip: padding-box;
    height: 40%;
  }

  ::-webkit-scrollbar-button:start:decrement:vertical {
    background-repeat: no-repeat;
    background-size: 40%;
    background-position: center;
    height: 10px;

    background-image: url('/images/scrollbar-button-vertical.svg');
  }
  ::-webkit-scrollbar-button:end:increment:vertical {
    background-repeat: no-repeat;
    background-size: 70%;
    background-position: center;
    height: 10px;

    background-image: url('/images/scrollbar-button-vertical1.svg');
  }
  ::-webkit-scrollbar-button:start:decrement:horizontal {
    background-repeat: no-repeat;
    background-size: 70%;
    background-position: center;
    height: 10px;

    background-image: url('/images/scrollbar-button-horizontal1.svg');
  }
  ::-webkit-scrollbar-button:end:increment:horizontal {
    background-repeat: no-repeat;
    background-size: 70%;
    background-position: center;
    height: 10px;

    background-image: url('/images/scrollbar-button-horizontal.svg');
  }
`;

// ==================================================

//heated platform

export const layerHPA = css`
  background: #233a54;
  box-shadow: 0px 0px 2px 0px #000 inset;
`;

export const layerHPB = css`
  background: #142033 0% 0% no-repeat padding-box;
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid #000000;
`;

export const layerDegHPA = css`
  border: 0.5px solid #000;
  background: var(
    --Gradiente-umbrella,
    linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
    linear-gradient(180deg, #233a54 0%, #233a54 44%, #060d19 100%)
  );
  box-shadow: 0px 0px 2px 0px #000;
`;

export const layerDegHPB = css`
  border: 0.5px solid #000;
  background: linear-gradient(180deg, #233a54 0%, #060d19 100%);
  box-shadow: 0px 0.5px 1px 0px rgba(255, 255, 255, 0.25) inset;
`;

export const layerDegHPC = css`
  background: var(
    --Light_blue_100,
    linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
    #233a54
  );
  box-shadow: 0px 0px 3px 0px #000 inset;
`;

export const layerDegHPD = css`
  background: var(
    --Gradiente-umbrella,
    linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
    linear-gradient(180deg, #233a54 0%, #233a54 44%, #060d19 100%)
  );
  border: 0.5px solid #000;
`;

export const layerHPE = css`
  border: 0.5px solid #000;
  background: linear-gradient(
    180deg,
    #233a54 0%,
    #060d19 100%,
  );
  box-shadow: 0px 0px 2px 0px #000;
`;

export const layerHPF = css`
  background: transparent
    linear-gradient(180deg, #d9d24b 0%, #aea951 61%, #67665c 100%) 0% 0%
    no-repeat padding-box;
  box-shadow: 0px 0px 3px #000000;
`;

export const layerHPG = css`
  background: transparent linear-gradient(180deg, #2e2e1e 0%, #fef100 100%) 0%
    0% no-repeat padding-box;
  border: 1px solid #ffe600;
`;

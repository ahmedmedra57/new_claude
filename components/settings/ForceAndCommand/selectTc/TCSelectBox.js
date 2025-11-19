import { useState } from 'react';
import styled, { css } from 'styled-components';
import {
  borderBBlue,
  flexBoxCenter,
  grayModeLayer,
  justifyContentFlexEnd,
  justifyContentFlexStart,
  justifyContentSpaceAround,
  layerA,
  layerA180Deg,
  layerADark,
  layerB,
  scrollbarY,
} from '../../../styles/commonStyles';
import { useMediaQuery } from 'react-responsive';

const TCSelectBox = ({
  system,
  handleClick,
  position,
  isTCOpen,
  setIsTCOpen,
  isDisable,
}) => {
  // media query
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  const selectData = [
    'tc-01',
    'tc-02',
    'tc-03',
    'tc-04',
    'tc-05',
    'tc-06',
    'tc-07',
    'tc-08',
    'tc-09',
    'tc-10',
    'tc-11',
  ];

  const buttonTitles = ['clear', 'select'];

  const [selectTCNum, setSelectedTCNum] = useState([0, 0, 0, 0, 0, 0]);
  const [selectedTC, setSelectedTC] = useState(null);

  const handleSelectTC = (index, tc) => {
    setSelectedTC(tc);
    const copySelectTCNum = [...selectTCNum];
    copySelectTCNum[position] = index;
    return setSelectedTCNum(copySelectTCNum);
  };

  const handleOpenTCSelectBoxes = () => {
    const copyIsTCOpen = [...isTCOpen];
    copyIsTCOpen[position] = !isTCOpen[position];
    return setIsTCOpen(copyIsTCOpen);
  };

  return (
    <TCSelectBoxBaseLayer>
      <TCSelectBoxWrapper isZIndex={isTCOpen[position]} isDisable={isDisable}>
        <FlexRow>
          <TCSelectBoxTitleWrapper isDisable={isDisable}>
            <SelectBoxText>
              {selectedTC ? selectedTC : 'select t/c'}
            </SelectBoxText>
          </TCSelectBoxTitleWrapper>
          <Img
            src={'./images/select-arrow-icon.svg'}
            onClick={() => handleOpenTCSelectBoxes()}
          />
        </FlexRow>
        {isTCOpen[position] && (
          <SelectBoxWrapper>
            {/* <FlexRow>
              <TCSelectBoxTitleWrapper>
                <SelectBoxText>select t/c</SelectBoxText>
              </TCSelectBoxTitleWrapper>
              <Img
                src={'./images/select-arrow-icon.svg'}
                onClick={() => handleOpenTCSelectBoxes()}
              />
            </FlexRow> */}
            <ScrollBarWrapper isMobile={isMobile}>
              <TCSelectBoxContentWrapper isMobile={isMobile}>
                {selectData.map((tc, index) => {
                  return (
                    <IndivSelectionWrapper
                      key={index}
                      onClick={() => handleSelectTC(index, tc)}
                      isMobile={isMobile}
                    >
                      <TCSelectBoxOuterCircle>
                        <TCSelectBoxInnerCircle
                          enable={selectTCNum[position] === index}
                        ></TCSelectBoxInnerCircle>
                      </TCSelectBoxOuterCircle>
                      <SelectBoxText>{tc}</SelectBoxText>
                    </IndivSelectionWrapper>
                  );
                })}
              </TCSelectBoxContentWrapper>
            </ScrollBarWrapper>
            <ButtonsWrapper>
              {buttonTitles.map((title, index) => {
                return (
                  <ButtonBaseLayer key={index}>
                    <Button
                      onClick={() => {
                        handleClick(system, index, selectTCNum[position]);
                        index === 0 && handleSelectTC(0);
                      }}
                    >
                      <ButtonHole>
                        <ButtonTop>
                          <ButtonTitle>{title}</ButtonTitle>
                        </ButtonTop>
                      </ButtonHole>
                    </Button>
                  </ButtonBaseLayer>
                );
              })}
            </ButtonsWrapper>
          </SelectBoxWrapper>
        )}
      </TCSelectBoxWrapper>
    </TCSelectBoxBaseLayer>
  );
};

export default TCSelectBox;

const TCSelectBoxBaseLayer = styled.div`
  width: 262px;
  height: 32px;
  /* margin-bottom: 2px; */
  border-radius: 16px;
  position: relative;
  ${layerA}
`;

const TCSelectBoxWrapper = styled.div`
  /* width: 26px;
  max-height: 304px;
  padding-top: 2px;
  padding-bottom: 3px; */
  width: 260px;
  min-height: 30px;
  padding-top: 2.5px;
  padding-bottom: 2px;
  border-radius: 15px;

  ${layerA180Deg}

  /* ${justifyContentSpaceAround}
  flex-direction: column; */
  /* position: relative; */

  ${({ isZIndex }) =>
    isZIndex &&
    css`
      z-index: 12;
    `}

  position:absolute;
  top: 1px;
  left: 1px;
  ${flexBoxCenter}
  flex-direction: column;
  ${({ isDisable }) => (isDisable && css`
    pointer-events: none;
    ${grayModeLayer}
  `)};
`;

const FlexRow = styled.div`
  /* display: flex;
  flex-direction: row; */
  /* padding-top: 1px; */
  /* ${({ isPadding }) =>
    isPadding &&
    css`
      padding-top: 0.5px;
    `} */
  ${flexBoxCenter}
`;

const TCSelectBoxTitleWrapper = styled.div`
  width: 229px;
  height: 24px;
  /* ${({ isPadding }) =>
    isPadding &&
    css`
      margin-top: 0.5px;
    `} */
  /* margin-right: 2px; */
  border-radius: 16px;
  ${justifyContentFlexStart}

  ${layerA} /* width: 228px;
  height: 24px;
  margin-top: 1px;

  border-radius: 16px;
  opacity: 1;
  ${justifyContentFlexStart} */
  ${({ isDisable }) => (isDisable && css`
    pointer-events: none;
    ${grayModeLayer}
  `)};
`;

const SelectBoxText = styled.span`
  margin-left: 8px;
  &:first-child {
    margin-left: 13px;
  }
  font-size: 12px;
  letter-spacing: 1.2px;
  color: #ffffff;

  opacity: 1;
`;

const Img = styled.img`
  width: 22px;
  height: 17px;
  margin-top: 2px;
  margin-right: 2px;
  cursor: pointer;
`;

const ScrollBarWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 98%;
          height: 100%;
          border-radius: 14px 8px 8px 14px;
          ${layerADark}
          ${flexBoxCenter}
        `
      : css`
          width: 98%;
          min-height: 120px;
          max-height: 184px;
          padding: 4px;
          margin-bottom: 4px;
          border-radius: 14px 8px 8px 14px;
          ${layerA}
          ${justifyContentFlexStart}
        `}
`;

const TCSelectBoxContentWrapper = styled.div`
  ${scrollbarY}
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 98%;
          /* width: 253px; */
          height: 184px;
          ::-webkit-scrollbar {
            display: none;
          }

          ${flexBoxCenter}
          justify-content: flex-start;
        `
      : css`
          min-height: 112px;
          max-height: 176px;
          width: 100%;
          display: flex;
          justify-items: flex-start;
          align-items: flex-start;
          gap: 4px;
        `}

        
        
         
          border-radius: 14px 4px 4px 14px;
  flex-direction: column;
  /* margin-top: 4px; */
`;

const IndivSelectionWrapper = styled.div`
  cursor: pointer;
  /* width: 236px; */

  ${({ isMobile }) =>
    isMobile
      ? css`
          /* width: 245px; */
          width: 99%;
          &:first-child {
            margin-top: 4px;
          }
          margin-bottom: 4px;
        `
      : css`
          width: 98%;
          /* &:first-child {
            margin-top: 2px;
          }
          margin-bottom: 2px;
          margin-left: 2px; */
        `}
  min-height: 32px;

  ${borderBBlue}
  &:hover {
    ${layerA}
  }

  border-radius: 16px;
  opacity: 1;
  ${justifyContentFlexStart}
`;

const TCSelectBoxOuterCircle = styled.div`
  cursor: pointer;
  width: 18px;
  height: 18px;
  margin-left: 6px;

  border-radius: 50%;
  border: 1px solid #95ff45;
  opacity: 1;
  ${flexBoxCenter}
`;

const TCSelectBoxInnerCircle = styled.div`
  width: 12px;
  height: 12px;

  border-radius: 50%;
  ${({ enable }) =>
    enable &&
    css`
      background: #95ff45;
    `}

  opacity: 1;
`;

const SelectBoxWrapper = styled.div`
  width: 100%;
  margin-top: 4px;
  ${flexBoxCenter}
  flex-direction:column;
  /* ${layerA180Deg}

  width: 260px; 
   max-height: 304px;
  padding-top: 2px;


  border-radius: 15px;
  opacity: 1;
  z-index: 10;

  ${justifyContentSpaceAround}
  flex-direction: column;
  position: absolute;
  top: -1px; */
`;

const ButtonsWrapper = styled.div`
  width: 100%;
  margin-top: 4px;
  margin-bottom: 2px;
  ${justifyContentFlexEnd}
`;

const ButtonBaseLayer = styled.div`
  width: 84px;
  height: 29px;
  margin-left: 2px;
  margin-right: 2px;

  ${layerB}

  border-radius: 27px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Button = styled.button`
  width: 82px;
  height: 27px;

  ${layerA180Deg}

  border-radius: 25px;
  opacity: 1;
  ${flexBoxCenter}
`;

const ButtonHole = styled.div`
  width: 76px;
  height: 21px;

  ${layerB}

  border-radius: 20px;
  opacity: 0.8;
  ${flexBoxCenter}
`;

const ButtonTop = styled.div`
  width: 74px;
  height: 19px;

  ${layerA180Deg}

  border-radius: 25px;
  opacity: 1;
  ${flexBoxCenter}
`;

const ButtonTitle = styled.p`
  font-size: 10px;
  letter-spacing: 1px;
  color: #ffffff;
  opacity: 1;
`;

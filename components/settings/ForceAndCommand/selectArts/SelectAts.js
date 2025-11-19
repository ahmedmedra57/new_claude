import styled, { css } from 'styled-components';
import SelectBox from './SelectBox';
import SubTitles from './SubTitles';
import {
  borderABlue,
  flexBoxCenter,
  justifyContentFlexEnd,
  justifyContentFlexStart,
  justifyContentSpaceAround,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerB,
  layerCLighter,
} from '../../../styles/commonStyles';
import ClearApplyButton from './ClearApplyButton';
import SelectFCSwitchMachineOptions from '../SelectFCSwitchMachineOptions';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import EditCancelApplyButtons from '../../buttons/EditCancelApplyButtons';

const SelectAts = ({
  gpEbp,
  sysIndex,
  handleSelectAts,
  handleSaveSelectedOfSelectAts,
  selected,
  displaySelectBox,
  selectedOne,
  ess,
  tgs,
  tes,
  handleOpenSelectLocations,
  buttonColor,
  handleClick,
}) => {
  // media query
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  const buttonNames = ['clear', 'select'];
  const [isButtonActive, setIsButtonActive] = useState(null);

  return (
    <>
      {isMobile ? (
        <BaseLayer isMobile={true}>
          <BaseLayer2>
            <Wrapper isMobile={true}>
              <SubTitleWrapper>
                <SubTitles sysIndex={sysIndex} />
              </SubTitleWrapper>
              {/* toggle selection */}
              <FlexSelections>
                <SelectBox
                  gpEbp={gpEbp}
                  sysIndex={sysIndex}
                  handleClick={handleSaveSelectedOfSelectAts}
                  selected={selected}
                />
              </FlexSelections>

              {/* clear and select buttons */}
              <WrapperButton isMobile={true}>
                {buttonNames.map((name, index) => {
                  return (
                    <div key={index} onClick={() => setIsButtonActive(index)}>
                      <ClearApplyButton
                        name={index === 1 && buttonColor ? 'applied' : name}
                        handleClick={handleSelectAts}
                        sysIndex={sysIndex}
                        index={index}
                        isButtonActive={isButtonActive === index}
                        buttonColor={buttonColor && index === 1}
                        isAtsMobile={true}
                      />
                    </div>
                  );
                })}
              </WrapperButton>
              <ButtonsWrapper>
                <EditCancelApplyButtons
                  handleClick={handleClick}
                  sysIndex={sysIndex}
                />
              </ButtonsWrapper>
            </Wrapper>
          </BaseLayer2>
        </BaseLayer>
      ) : (
        <BaseLayer>
          <Wrapper>
            <TitleWrapper>
              <Title>select ats</Title>
              <GreenConnectionSignal src={'./images/gp-battery.svg'} />
            </TitleWrapper>
            {/* select location box */}
            <SelectLocationBaseLayer>
              <SelectLocationWrapper>
                <FlexRowWrapper>
                  <SelectLocationIndent>
                    <Title>
                      {selectedOne ? selectedOne : 'select location'}
                    </Title>
                  </SelectLocationIndent>
                  <ImgWrapper>
                    <ArrowImg
                      src={'./images/select-arrow-icon.svg'}
                      onClick={() => handleOpenSelectLocations(sysIndex)}
                    />
                  </ImgWrapper>
                </FlexRowWrapper>
                {displaySelectBox[sysIndex] && (
                  <SelectBoxWrapper>
                    <SelectFCSwitchMachineOptions
                      handleClose={() => handleOpenSelectLocations(sysIndex)}
                      data={sysIndex === 0 ? ess : sysIndex === 1 ? tgs : tes}
                      sysIndex={sysIndex}
                      swtName={
                        sysIndex === 0 ? 'ess' : sysIndex === 1 ? 'tgs' : 'tes'
                      }
                    />
                  </SelectBoxWrapper>
                )}
              </SelectLocationWrapper>
            </SelectLocationBaseLayer>
            {/*  */}
            <SubTitleWrapper>
              <SubTitles sysIndex={sysIndex} />
            </SubTitleWrapper>
            {/* toggle selection */}
            <FlexSelections>
              <SelectBox
                gpEbp={gpEbp}
                sysIndex={sysIndex}
                handleClick={handleSaveSelectedOfSelectAts}
                selected={selected}
              />
            </FlexSelections>
            {/* clear and apply buttons */}
            <WrapperButton>
              {buttonNames.map((name, index) => {
                return (
                  <div key={index} onClick={() => setIsButtonActive(index)}>
                    <ClearApplyButton
                      name={index === 1 && buttonColor ? 'applied' : name}
                      handleClick={handleSelectAts}
                      sysIndex={sysIndex}
                      index={index}
                      isButtonActive={isButtonActive === index}
                      buttonColor={buttonColor && index === 1}
                    />
                  </div>
                );
              })}
            </WrapperButton>
          </Wrapper>
        </BaseLayer>
      )}
    </>
  );
};

export default SelectAts;

const BaseLayer = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 286px;
          height: auto;
          padding-top: 2px;
          padding-bottom: 2px;
          margin-top: 2px;
          margin-bottom: 1px;
          border-radius: 9px 9px 27px 27px;
        `
      : css`
          width: 274px;
          height: auto;
          padding: 1px;
          margin-top: 2px;
          margin-left: 2px;
          border-radius: 9px;
        `}

  ${layerB}

  ${flexBoxCenter};
`;

const BaseLayer2 = styled.div`
  width: 282px;
  height: auto;
  padding: 2px;

  border-radius: 8px 8px 26px 26px;

  ${layerCLighter}
  ${flexBoxCenter}
`;

const Wrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 278px;
          height: auto;
          padding: 2px;
          border-radius: 6px 6px 24px 24px;
        `
      : css`
          width: 272px;
          height: auto;
          border-radius: 8px;
          ${borderABlue}
        `}

  ${layerA180Deg}

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const TitleWrapper = styled.div`
  width: 264px;
  height: 32px;
  margin-top: 6px;

  ${layerA}

  border-radius: 16px;
  opacity: 1;
  ${justifyContentSpaceBetween}
`;

const Title = styled.p`
  text-align: left;
  font-size: 12rem;
  letter-spacing: 1px;
  color: #ffffff;
  opacity: 1;
  margin-left: 8px;
  text-transform: uppercase;
`;

const GreenConnectionSignal = styled.img`
  width: 30px;
  height: 20px;
  margin-right: 8px;
`;

const SubTitleWrapper = styled.div`
  margin-top: 2px;
`;

const SelectLocationBaseLayer = styled.div`
  width: 263px;
  height: 32px;
  margin-top: 6rem;

  ${layerA}

  border-radius: 16px;

  z-index: 10;

  position: relative;
`;

const SelectLocationWrapper = styled.div`
  width: 261px;

  min-height: 30px;
  padding-top: 2px;
  padding-bottom: 2px;

  ${layerA180Deg}

  border-radius: 15px;

  ${flexBoxCenter}
  flex-direction: column;
  position: absolute;
  top: 1px;
  left: 1px;
`;

const FlexRowWrapper = styled.div`
  ${flexBoxCenter}
  gap:1PX;
`;

const SelectLocationIndent = styled.div`
  width: 229px;
  height: 24px;
  margin-right: 2px;

  ${layerA}

  border-radius: 16px;
  opacity: 1;
  ${justifyContentFlexStart}
`;

const ImgWrapper = styled.div`
  margin-top: 2px;
  margin-right: 2px;
`;

const ArrowImg = styled.img`
  cursor: pointer;
  width: 22px;
  height: 17px;
`;

const SelectBoxWrapper = styled.div`
  margin-top: 4px;
`;

const FlexSelections = styled.div`
  width: auto;
  height: auto;
  margin-top: 4px;
  margin-bottom: 6px;

  ${justifyContentSpaceAround}
  flex-direction: column;
`;

const WrapperButton = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 99%;
          ${flexBoxCenter}
          gap:16px;
        `
      : css`
          width: 98%;
          ${justifyContentFlexEnd}
          gap:8px;
        `}

  height: auto;
  margin-bottom: 4px;
`;

const ButtonsWrapper = styled.div`
  width: 100%;
  ${justifyContentFlexEnd}
  margin-top: 8px;
`;

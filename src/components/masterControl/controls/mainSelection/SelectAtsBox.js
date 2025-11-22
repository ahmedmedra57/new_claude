import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentFlexEnd,
  justifyContentSpaceAround,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerB,
  layerBDark,
  layerCLighter,
  messageBoxBackground,
} from '../../../styles/commonStyles';

const SelectAtsBox = ({ handleOnClick, handleOnSelect, swt, isSelected }) => {
  const selectOptions =
    swt === 'ess'
      ? [
          ' REACTIVATES ESS WHEN POWERED BY EBP (EMERGENCY BACKUP POWER)',
          'BLOCK AND DO NOT ALLOW ESS TO OPERATE WHEN ON EBP (EMERGENCY BACKUP POWER)',
        ]
      : swt === 'tgs'
      ? [
          'REACTIVATE TGS (TYPHOON GAS POWER HEATING SYSTEM) WHEN ON EBP (EMERGENCY BACKUP POWER)',
          'BLOCK AND DO NOT ALLOW TGS TO OPERATE WHEN ON EBP (EMERGENCY BACKUP POWER)',
        ]
      : [
          'REACTIVATE TES WHEN POWERED BY EBP (EMERGENCY BACKUP POWER)',
          'TES TO REMAIN OFF WHEN POWERED BY EBP (EMERGENCY BACKUP POWER)',
          'SWITCH TO TGS (TYPHOON GAS POWERED HEATING SYSTEM) WHEN ON EBP (EMERGENCY BACKUP POWER)',
        ];

  const buttonTitles = ['clear', 'select'];

  return (
    <Wrapper>
      <InnerWrapper swt={swt}>
        <SectionHeader>
          <TitleAndIconWrapper>
            <Title>select ats</Title>
            <Img src='/images/icon-battery.svg' />
          </TitleAndIconWrapper>
          <CloseButton onClick={() => handleOnClick(1)}>
            <CloseButtonInner>
              <CloseButtonHole>
                <CloseButtonTop>X</CloseButtonTop>
              </CloseButtonHole>
            </CloseButtonInner>
          </CloseButton>
        </SectionHeader>
        <SectionTitle>
          <SwtTitle>{swt}</SwtTitle>
          <SwtSubTitle>
            {swt === 'ess'
              ? 'electric switch system'
              : swt === 'tgs'
              ? 'typhoon gas system'
              : 'typhoon electric system'}
          </SwtSubTitle>
        </SectionTitle>

        <SectionIcon>
          <IconTitle>gp</IconTitle>
          <Img src='/images/icon-battery-main.svg' />
          <IconTitle ebp={true}>ebp</IconTitle>
        </SectionIcon>

        {selectOptions.map((select, index) => (
          <SectionSelectBox key={Math.random() * 10000}>
            <OptionWrapper onClick={() => handleOnSelect(index + 1)}>
              <RadioButtonWrapper>
                <RadioButtonInner
                  isSelected={isSelected[index]}
                ></RadioButtonInner>
              </RadioButtonWrapper>

              <Option>{select}</Option>
            </OptionWrapper>
          </SectionSelectBox>
        ))}

        <SectionButtons>
          {buttonTitles.map((title, idx) => {
            return (
              <ButtonWrapper
                key={idx}
                onClick={() =>
                  idx === 0 ? handleOnClick(2) : handleOnClick(3)
                }
              >
                <ButtonOuterHole>
                  <ButtonInnerHole>
                    <ButtonTop>{title}</ButtonTop>
                  </ButtonInnerHole>
                </ButtonOuterHole>
              </ButtonWrapper>
            );
          })}
        </SectionButtons>
      </InnerWrapper>
    </Wrapper>
  );
};

export default SelectAtsBox;

const Wrapper = styled.div`
  width: 402px;
  border-radius: 9rem;
  ${messageBoxBackground}
  ${flexBoxCenter}
  padding : 9px;

  position: absolute;
  top: 30rem;

  z-index: 100;
`;
const InnerWrapper = styled.div`
  width: 384px;
  border-radius: 9px;

  ${layerB}
  ${flexDirectionColumn}
  
  
  ${(p) =>
    p.swt === 'tes'
      ? css`
          height: 286px;
        `
      : css`
          height: 236px;
        `}

  padding: 7rem 0;
`;
const SectionHeader = styled.section`
  width: 373px;
  height: 32px;

  ${justifyContentSpaceBetween}
  padding-right: 5px;
`;
const TitleAndIconWrapper = styled.div`
  width: 334px;
  height: 32px;
  border-radius: 16px;
  ${layerA}
  ${justifyContentSpaceBetween}
  padding: 0 8px;
`;

const Title = styled.span`
  font-size: 10rem;
`;

const Img = styled.img``;

const CloseButton = styled.button`
  width: 26px;
  height: 26px;
  border-radius: 6px;
  ${layerB};
  ${flexBoxCenter};
`;
const CloseButtonInner = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 5px;
  ${layerA180Deg};
  ${flexBoxCenter};
`;
const CloseButtonHole = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 3px;
  ${layerB};
  ${flexBoxCenter};
`;
const CloseButtonTop = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 2px;
  ${layerA180Deg};
  ${flexBoxCenter};
`;

const SectionTitle = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SwtTitle = styled.span`
  color: #ff7800;
  font-size: 12rem;
`;
const SwtSubTitle = styled.span`
  color: #ff7800;
  font-size: 8rem;
`;
const SectionIcon = styled.section`
  width: 100%;

  ${justifyContentSpaceAround}
  padding: 0 20rem;
`;
const IconTitle = styled.span`
  font-size: 22rem;
  color: #95ff45;
  ${(p) =>
    p.ebp &&
    css`
      color: #ff7800;
    `}
`;
const SectionSelectBox = styled.section`
  display: flex;
  flex-direction: column;
`;
const OptionWrapper = styled.button`
  width: 373px;
  height: 34px;
  border-radius: 17px;
  ${layerA}
  ${justifyContentSpaceBetween}
  padding: 0 2rem 0 4rem;

  margin-top: 5rem;
`;
const Option = styled.div`
  font-size: 9rem;

  width: 339px;
  height: 30px;

  border: 1px solid #142033;
  border-radius: 15px;

  ${flexBoxCenter}
  text-align: center;
`;
const RadioButtonWrapper = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1px solid #95ff45;

  ${flexBoxCenter}
`;
const RadioButtonInner = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;

  ${(p) =>
    p.isSelected &&
    css`
      background-color: #95ff45;
    `}
`;

const SectionButtons = styled.section`
  width: 100%;

  ${justifyContentFlexEnd}
  padding-right: 6rem;
`;

const ButtonWrapper = styled.button`
  width: 74px;
  height: 27px;
  border-radius: 18px;
  ${layerBDark}
  ${flexBoxCenter}

  margin-left: 6rem;
`;
const ButtonOuterHole = styled.div`
  width: 72px;
  height: 25px;
  border-radius: 25px;

  ${layerA180Deg}
  ${flexBoxCenter}
`;
const ButtonInnerHole = styled.div`
  width: 64px;
  height: 17px;

  border-radius: 18px;
  ${layerCLighter}
  ${flexBoxCenter}
`;
const ButtonTop = styled.div`
  width: 62px;
  height: 15px;
  border-radius: 25px;

  ${layerA180Deg}
  ${flexBoxCenter}

  font-size: 8rem;
`;

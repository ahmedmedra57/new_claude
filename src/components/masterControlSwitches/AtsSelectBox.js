import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentFlexEnd,
  justifyContentFlexStart,
  justifyContentSpaceAround,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerADark,
  layerB,
  layerC,
} from '../styles/commonStyles';

const AtsSelectBox = ({
  isMasterControl,
  isMobile,
  handleButtons,
  options,
  swtName,
  handleOpenAts,
  isSelected,
  handleSelect,
  isSmall,
  handleApply,
}) => {
  const btnNames = isSmall ? ['clear', 'apply'] : ['clear', 'select'];

  return (
    <Wrapper
      swtName={swtName}
      isMobile={isMobile}
      isSmall={isSmall}
      isMasterControl={isMasterControl}
    >
      {isMobile ? (
        <SectionHeader isMobile={isMobile}>
          <Header isMobile={isMobile}>
            <Title isMobile={isMobile}>{swtName}</Title>
            <SubTitle>
              {swtName === 'ess'
                ? 'electric switch system'
                : swtName === 'tgs'
                ? 'typhoon gas system'
                : 'typhoon electric system'}
            </SubTitle>
          </Header>
          <SectionIcon>
            <SubTitle isGp={true}>gp</SubTitle>
            <Img src='/images/icon-battery-main.svg' isMobile={isMobile} />
            <SubTitle isEbp={true}>Ebp</SubTitle>
          </SectionIcon>
        </SectionHeader>
      ) : (
        <SectionHeader>
          <Header>
            <Title>
              {isSelected.includes(true) ? 'selected' : 'select ats'}
            </Title>
          </Header>
          <Img src='/images/masterCtr-select-btn.svg' onClick={handleOpenAts} />
        </SectionHeader>
      )}

      {options.map((option, index) => (
        <SectionSelect key={index} isMobile={isMobile} isSmall={isSmall}>
          <SelectWrapper
            isSmall={isSmall}
            onClick={() => handleSelect(index)}
            isMobile={isMobile}
          >
            <InvisibleWrapper isMobile={isMobile}>
              <RadioButtonWRapper isMobile={isMobile} isSmall={isSmall}>
                <RadioButton
                  isSelected={isSelected[index]}
                  isMobile={isMobile}
                  isSmall={isSmall}
                ></RadioButton>
              </RadioButtonWRapper>
            </InvisibleWrapper>

            <SelectOption
              isSmall={isSmall}
              isMobile={isMobile}
              lineHeight={swtName !== 'ess' && index === 0}
            >
              {option}
            </SelectOption>
          </SelectWrapper>
        </SectionSelect>
      ))}

      <SectionButton isMobile={isMobile} isSmall={isSmall}>
        {btnNames.map((btn, index) => (
          <Button
            key={index}
            onClick={() => {
              handleButtons(index);
            }}
            isMobile={isMobile}
            isSmall={isSmall}
          >
            <ButtonInner isMobile={isMobile} isSmall={isSmall}>
              <ButtonHole isMobile={isMobile} isSmall={isSmall}>
                <ButtonTop isMobile={isMobile} isSmall={isSmall}>
                  {btn}
                </ButtonTop>
              </ButtonHole>
            </ButtonInner>
          </Button>
        ))}
      </SectionButton>
    </Wrapper>
  );
};

export default AtsSelectBox;

const Wrapper = styled.div`
  ${(p) =>
    p.isMobile
      ? css`
          ${p.isMasterControl
            ? css`
                width: 312px;
                height: 202px;
                border-radius: 2px;
                padding: 4px 0;
              `
            : css`
                border-radius: 9px 9px 24px 24px;
                ${(p) =>
                  p.isSmall
                    ? css`
                        width: 301px;
                        height: ${(p) =>
                          p.swtName === 'tes' ? '242px' : '202px'};
                        padding: 4px 0;
                      `
                    : css`
                        width: 310px;
                        height: ${(p) =>
                          p.swtName === 'tes' ? '240px' : '202px'};
                        margin-top: 8px;
                        padding: 4px 0;
                      `}
              `}
        `
      : css`
          width: 199px;
          height: ${(p) => (p.swtName === 'tes' ? '249px' : '199px')};
          border-radius: 13px 13px 18px 18px;
          padding: 4px 0;

          position: absolute;
          top: 0;
          right: 1px;
          z-index: 10000;
        `};
  ${layerA180Deg};
  ${flexDirectionColumn};
`;
const SectionHeader = styled.div`
  width: 100%;
  ${justifyContentSpaceBetween};
  padding: 0 6px 0 4px;

  ${(p) =>
    p.isMobile &&
    css`
      ${flexDirectionColumn}
    `}
`;
const Header = styled.div`
  ${(p) =>
    p.isMobile
      ? css`
          width: 100%;
          ${flexDirectionColumn};
        `
      : css`
          width: 163px;
          height: 18px;
          border-radius: 18px;
          ${layerADark}
          ${justifyContentFlexStart}
  padding-left: 10px;
        `}
`;

const Title = styled.span`
  font-size: 8px;
  ${(p) =>
    p.isMobile &&
    css`
      font-size: 12px;
      margin-bottom: -2px;
      color: #ff7800;
    `}
`;
const SectionIcon = styled.section`
  width: 90%;
  ${justifyContentSpaceBetween}
`;
const SubTitle = styled.span`
  font-size: 8px;
  color: #ff7800;
  margin-bottom: 2px;
  ${(p) =>
    p.isGp &&
    css`
      color: #95ff45;
      font-size: 22px;
    `}

  ${(p) =>
    p.isEbp &&
    css`
      font-size: 22px;
    `}
`;
const Img = styled.img`
  ${(p) =>
    p.isMobile
      ? css`
          width: 63%;
        `
      : css`
          cursor: pointer;
        `}
`;

const SectionSelect = styled.div``;
const SelectWrapper = styled.button`
  ${(p) =>
    p.isMobile
      ? css`
          width: 301px;
          height: 34px;
          border-radius: 17px;
          padding: 0 2px 0 6px;
          ${p.isSmall &&
          css`
            width: 292px;
          `}
        `
      : css`
          width: 191px;
          border-radius: 12px;
          padding: 2px 2px 2px 5px;
        `}
  ${layerA};
  ${justifyContentSpaceBetween};

  &:hover {
    ${layerB};
  }
`;

const InvisibleWrapper = styled.div`
  ${(p) =>
    p.isMobile
      ? css``
      : css`
          height: 56px;
          padding-top: 2px;
        `}
`;
const RadioButtonWRapper = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1px solid #95ff45;

  ${flexBoxCenter}
`;
const RadioButton = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 50%;

  ${(p) =>
    p.isSelected &&
    css`
      background-color: #95ff45;
    `}
`;

const SelectOption = styled.div`
  ${(p) =>
    p.isMobile
      ? css`
          width: 267px;
          height: 30px;
          border-radius: 15px;
          font-size: 9px;
          ${flexBoxCenter}

          ${(p) =>
            p.lineHeight &&
            css`
              line-height: 95%;
            `};

          ${p.isSmall &&
          css`
            width: 258px;
          `};
        `
      : css`
          width: 158px;
          border-radius: 10px;
          font-size: 8.5px;
          text-align: left;
          padding: 4px;
        `}
  border: 1px solid #142033;
`;

const SectionButton = styled.section`
  ${(p) =>
    p.isMobile
      ? css`
          width: 301px;
          height: 42px;
          border-radius: 24px;
          ${layerA}
          ${justifyContentSpaceBetween}
          padding: 0 3px;

          ${p.isSmall &&
          css`
            width: 292px;
          `}
        `
      : css`
          width: 191px;
          ${justifyContentFlexEnd}
        `}
`;
const Button = styled.button`
  ${(p) =>
    p.isMobile
      ? css`
          width: 138px;
          height: 37px;
          border-radius: 18px;
        `
      : css`
          width: 77px;
          height: 30px;
          border-radius: 18px;
          margin-left: 4px;
        `}

  ${layerB}
  ${flexBoxCenter}
`;
const ButtonInner = styled.div`
  ${(p) =>
    p.isMobile
      ? css`
          width: 136px;
          height: 35px;
          border-radius: 25px;
          ${p.isSmall && css``}
        `
      : css`
          width: 75px;
          height: 28px;
          border-radius: 25px;
        `}

  ${layerA180Deg};
  ${flexBoxCenter};
`;
const ButtonHole = styled.div`
  ${(p) =>
    p.isMobile
      ? css`
          width: 128px;
          height: 27px;
          border-radius: 18px;
          ${p.isSmall && css``}
        `
      : css`
          width: 67px;
          height: 20px;
          border-radius: 18px;
        `}

  ${layerB};
  ${flexBoxCenter};
`;
const ButtonTop = styled.div`
  ${(p) =>
    p.isMobile
      ? css`
          width: 126px;
          height: 25px;
          border-radius: 25px;
          font-size: 12px;
          ${p.isSmall && css``}
        `
      : css`
          width: 65px;
          height: 18px;
          border-radius: 25px;
          font-size: 10px;
        `}
  ${layerA180Deg};
  ${flexBoxCenter}
`;

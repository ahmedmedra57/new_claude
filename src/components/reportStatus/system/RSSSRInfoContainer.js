import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  ItemBackground,
  ItemBackgroundDisable,
  layerA180Deg,
  layerADisabled180Deg,
} from '../../styles/commonStyles';

const RSSSRInfoContainer = ({ data }) => {
  const unitsMeasurement = false;

  // add styling by using false state
  const isEnable = data.buttonStatus === 'on' ? true : false;

  // isEnable is for styling  [true:red border]
  const isFault = data.buttonStatus === 'flt';
  const isWarn = data.warn === 1;

  // For mapping
  const { specs } = data;

  return (
    <Wrapper>
      <TitleWrapper>
        <>
          <Title>part number</Title>
          <Title>current (a)</Title>
          <Title>wattage (w)</Title>
          <Title>voltage (v)</Title>
          <Title>length (ft)</Title>

          <Title>description</Title>
        </>
      </TitleWrapper>

      <Wrapper1>
        <ContentWrapper
          isEnable={isEnable}
          isFault={isFault}
          overAmp={false}
          isWarn={isWarn}
        >
          {specs.map((spec, index) => (
            <ItemWrapper column={index} hiddenNumber={specs.length} key={index}>
              <ItemCurrentWrapper>
                <ItemPartNumber isEnable={isEnable}>
                  <ItemData isDefault={true} isEnable={isEnable}>
                    {spec.partNumber}
                  </ItemData>
                </ItemPartNumber>

                <ItemCurrent isEnable={isEnable}>
                  <ItemData isEnable={isEnable}>
                    {spec.currentCurrent} a
                  </ItemData>
                </ItemCurrent>
              </ItemCurrentWrapper>

              <ItemWattage isEnable={isEnable}>
                <ItemData isEnable={isEnable}>{spec.wattage}</ItemData>
              </ItemWattage>

              <ItemVoltage isEnable={isEnable}>
                <ItemData isEnable={isEnable}>{spec.voltage}</ItemData>
              </ItemVoltage>

              <ItemLength isEnable={isEnable}>
                {unitsMeasurement ? (
                  <ItemData isEnable={isEnable}>{spec.lengths}</ItemData>
                ) : (
                  <ItemData isEnable={isEnable}>
                    {spec.lengths &&
                      (Number(spec.lengths) / 3.28048).toFixed(1)}
                  </ItemData>
                )}
              </ItemLength>

              <ItemDescription isEnable={isEnable}>
                {spec.elementName ? (
                  <ItemData isDescription={true} isEnable={isEnable}>
                    {`${spec.elementName} - ${spec.partNumber}  / ${
                      spec.current
                    } A / ${spec.wattage} W / ${spec.voltage} v / ${(
                      Number(spec.lengths) / 3.28048
                    ).toFixed(1)} m - ${spec.lengths} ft`}
                  </ItemData>
                ) : (
                  <ItemData isDescription={true} isEnable={isEnable}>
                    -----------------------------
                  </ItemData>
                )}
              </ItemDescription>
            </ItemWrapper>
          ))}
        </ContentWrapper>
      </Wrapper1>
    </Wrapper>
  );
};

export default RSSSRInfoContainer;
const Wrapper = styled.div`
  width: 969px;
  margin-top: 11px;
  position: relative;
`;

const TitleWrapper = styled.div`
  ${flexBoxCenter}
  justify-content: flex-start;
  margin-bottom: 8px;
`;

const Title = styled.span`
  font-size: 10px;
  &:first-child {
    margin-left: 12px;
    margin-right: 26px;
  }
  &:nth-child(2) {
    margin-right: 26px;
  }
  &:nth-child(3) {
    margin-right: 35px;
  }
  &:nth-child(4) {
    margin-right: 26px;
  }
  &:nth-child(5) {
    margin-right: 240px;
  }
`;

const Wrapper1 = styled.div`
  width: 1060px;
  height: 23px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;
const ContentWrapper = styled.ul`
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: 0.1rem 0;
  border-radius: 12px;
  border: 0.5px solid #000000;
  ${(p) =>
    p.isEnable
      ? css`
          ${layerA180Deg};
        `
      : css`
          ${layerADisabled180Deg};
        `}

  border: ${(p) => (p.isFault ? '1px solid red' : '')};
  border: ${(p) => p.overAmp && `1px solid #FF7800`};
  border: ${(p) => p.isWarn && `1px solid #FF7800`};
  padding: 1px 0;
`;

const ItemPartNumber = styled.div`
  width: 100px;
  height: 20px;
  margin-right: 12rem;

  text-align: left;
  letter-spacing: 0.9px;
  color: #ffffff;

  opacity: 1;
  ${flexBoxCenter}
  ${ItemBackground}
  ${(p) =>
    p.isEnable ||
    css`
      ${ItemBackgroundDisable}
    `}
`;

const ItemWrapper = styled.div`
  ${flexBoxCenter}
  justify-content: space-between;
  padding: 0 1.6px;

  &:first-child {
    ${(p) =>
      p.hiddenNumber !== 1 &&
      css`
        margin-bottom: 0rem;
      `}
  }
  &:nth-child(2) {
    margin-bottom: 0rem;
  }
`;

const ItemCurrentWrapper = styled.div`
  display: flex;
  width: auto;
  justify-content: space-between;
`;

const ItemCurrent = styled.li`
  ${flexBoxCenter}

  width: 96px;
  height: 20px;
  ${ItemBackground}

  ${(p) =>
    p.isEnable ||
    css`
      ${ItemBackgroundDisable}
    `}
`;
const ItemWattage = styled.li`
  ${flexBoxCenter}
  width: 96px;
  height: 20px;
  ${ItemBackground}
  ${(p) =>
    p.isEnable ||
    css`
      ${ItemBackgroundDisable}
    `}
`;
const ItemVoltage = styled.li`
  ${flexBoxCenter}

  width: 96px;
  height: 20px;
  ${ItemBackground}
  ${(p) =>
    p.isEnable ||
    css`
      ${ItemBackgroundDisable}
    `}
`;
const ItemLength = styled.li`
  ${flexBoxCenter}

  width: 96px;
  height: 20px;
  ${ItemBackground}
  ${(p) =>
    p.isEnable ||
    css`
      ${ItemBackgroundDisable}
    `}
`;
const ItemDescription = styled.li`
  ${flexBoxCenter}

  width: 520px;
  height: 20px;
  ${ItemBackground}
  ${(p) =>
    p.isEnable ||
    css`
      ${ItemBackgroundDisable}
    `}


  padding: 0 0.1rem;
`;
const ItemData = styled.span`
  max-height: 18rem;
  font-size: 9px;
  text-align: center;
  letter-spacing: 0.9px;
  line-height: 0.9em;

  ${(p) =>
    p.isDescription &&
    css`
      font-size: 9px;
      overflow: hidden;
    `}
`;

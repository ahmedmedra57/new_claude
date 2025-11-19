import styled, { css } from "styled-components";
import {
  flexBoxCenter,
  justifyContentFlexEnd,
  justifyContentFlexStart,
  justifyContentSpaceBetween,
  layerA,
  layerA90Deg,
  layerBDark,
} from "../styles/commonStyles";

const DisplayLegend = ({ option, graph, swtName, isReadyToRender }) => {
  // option true = line graph || false = bar graph
  return (
    <InvisibleWrapper justifyContent={option} isReadyToRender={isReadyToRender}>
      <Wrapper isDifferentSize={option}>
        <InnerWrapper isDifferentSize={option}>
          <TopWrapper isDifferentSize={option}>
            {option ? (
              <GroupWrapper>
                <Title>legend :</Title>
                <ContentWrapperA>
                  <Circle color='ht' />
                  <LegendTitle color='ht'>ht - heater temperature</LegendTitle>
                </ContentWrapperA>
                <ContentWrapperA>
                  <Circle color='et' />
                  <LegendTitle color='et'>
                    et - enclosure temperature
                  </LegendTitle>
                </ContentWrapperA>
                <ContentWrapperA>
                  <Circle color='ot' />
                  <LegendTitle color='ot'>ot - outside temperature</LegendTitle>
                </ContentWrapperA>
              </GroupWrapper>
            ) : (
              <ContentWrapperB>
                <Title>legend :</Title>
                <CircleAndLegendWrapper>
                  <Circle color={swtName} />
                  <LegendTitle color={swtName}>
                    {graph === "data"
                      ? "data consumption"
                      : "energy consumption"}
                  </LegendTitle>
                </CircleAndLegendWrapper>
              </ContentWrapperB>
            )}
          </TopWrapper>
        </InnerWrapper>
      </Wrapper>
    </InvisibleWrapper>
  );
};

export default DisplayLegend;

const InvisibleWrapper = styled.div`
  width: 100%;

  ${(p) =>
    p.justifyContent
      ? css`
          ${justifyContentFlexStart}
        `
      : css`
          ${justifyContentFlexEnd}
        `}

  ${(p) =>
    p.isReadyToRender ||
    css`
      ${justifyContentFlexStart}
    `}
`;

const Wrapper = styled.div`
  width: 229px;
  height: 34px;
  border-radius: 17px;

  ${(p) =>
    p.isDifferentSize &&
    css`
      width: 743px;
      height: 34px;
    `}

  ${layerBDark};
  ${flexBoxCenter}
`;
const InnerWrapper = styled.div`
  width: 224px;
  height: 30px;
  border-radius: 15px;

  ${layerA90Deg};
  ${flexBoxCenter};
  ${(p) =>
    p.isDifferentSize &&
    css`
      width: 739px;
      height: 30px;
    `}
`;
const TopWrapper = styled.div`
  width: 213px;
  height: 18px;
  border-radius: 10px;

  ${layerA};
  ${flexBoxCenter};
  ${(p) =>
    p.isDifferentSize &&
    css`
      width: 729px;
      height: 19px;
    `}
`;

const GroupWrapper = styled.div`
  width: 100%;
  ${justifyContentSpaceBetween};
  padding: 0 25px 0 15px;
`;

const ContentWrapperA = styled.div`
  width: 160px;
  height: 18px;
  ${justifyContentFlexStart}
`;

const ContentWrapperB = styled.div`
  width: 213px;
  height: 18px;
  ${justifyContentSpaceBetween};
  padding: 0 12px;
`;

const CircleAndLegendWrapper = styled.div`
  margin-left: 8px;
  width: 140px;
  ${justifyContentFlexStart}
`;

const Title = styled.span`
  font-size: 7px;
`;
const Circle = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 10px;

  ${(p) =>
    p.color === "ess" &&
    css`
      background-color: #83ffff;
    `};

  ${(p) =>
    p.color === "tgs" &&
    css`
      background-color: #ff7800;
    `};

  ${(p) =>
    p.color === "tes" &&
    css`
      background-color: #95ff45;
    `};

  ${(p) =>
    p.color === "ht" &&
    css`
      background-color: #ff7800;
    `}
  ${(p) =>
    p.color === "et" &&
    css`
      background-color: #4baf00;
    `}
    ${(p) =>
    p.color === "ot" &&
    css`
      background-color: #2b6fc1;
    `}
`;

const LegendTitle = styled.span`
  font-size: 7px;
  ${(p) =>
    p.color === "ess" &&
    css`
      color: #83ffff;
    `};

  ${(p) =>
    p.color === "tgs" &&
    css`
      color: #ff7800;
    `};

  ${(p) =>
    p.color === "tes" &&
    css`
      color: #95ff45;
    `};

  ${(p) =>
    p.color === "ht" &&
    css`
      color: #ff7800;
    `}
  ${(p) =>
    p.color === "et" &&
    css`
      color: #4baf00;
    `}
    ${(p) =>
    p.color === "ot" &&
    css`
      color: #2b6fc1;
    `}
`;

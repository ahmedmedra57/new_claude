import styled, { css } from "styled-components";
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA,
  layerCLighter,
} from "../styles/commonStyles";

const DisplayControllers = ({
  states,
  swtStatusInLocation,
  swtStatusInLocationE,
  swtName,
}) => {
  let isGp = 0;
  let isEbp = 0;

  if (swtStatusInLocationE?.isSpecificLocation) {
    Object.keys(swtStatusInLocationE.subLocations).forEach((subLocation) => {
      Object.keys(
        swtStatusInLocationE.subLocations[subLocation].devices
      ).forEach((machine) => {
        // console.log(swtStatusInLocationE.subLocations[subLocation].devices[machine].isGp,"DisplayControllersXX");
        if (swtStatusInLocationE.subLocations[subLocation].devices[machine].isGp) {
          isGp = isGp + 1;
        }

        if (swtStatusInLocationE.subLocations[subLocation].devices[machine].isEbp) {
          isEbp = isEbp + 1;
        }
      });
    });
  } else {
    if (swtStatusInLocation) {

      Object.keys(swtStatusInLocation)?.forEach((machine) => {
        if (swtStatusInLocation[machine].isGp) {
          isGp = isGp + 1;
        }

        if (swtStatusInLocation[machine].isEbp) {
          isEbp = isEbp + 1;
        }
      });
    }
  }

  return (
    <Wrapper>
      <SectionController>
        <ControllerWrapper type="a">
          <Img src="images/logo-instantHeat.svg" />

          {/* instant heat */}
          <StatusInfoWrapper>
            <StatusContainer>
              <Indicator type="active"></Indicator>
              <Info>{states.instantHeat.isActivated}</Info>
            </StatusContainer>
            <StatusContainer>
              <Indicator></Indicator>
              <Info>{states.instantHeat.isReady}</Info>
            </StatusContainer>
          </StatusInfoWrapper>
        </ControllerWrapper>
      </SectionController>
      {/* snow fan only */}
      {swtName === "tgs" && (
        <SectionController>
          <ControllerWrapper>
            <Img src="images/tgs-fanOnly.svg" />

            <StatusInfoWrapper type={1}>
              <StatusContainer>
                <Indicator type="active"></Indicator>
                <Info>{states.fanOnly}</Info>
              </StatusContainer>
            </StatusInfoWrapper>
          </ControllerWrapper>
        </SectionController>
      )}
      {/* snow sensor */}
      <SectionController>
        <ControllerWrapper>
          <Img src="images/logo-snowSensor.svg" />
          <StatusInfoWrapper>
            <StatusContainer>
              <Indicator type="active"></Indicator>
              <Info>{states.snowSensor.isActivated}</Info>
            </StatusContainer>

            <StatusContainer>
              <Indicator></Indicator>
              <Info>{states.snowSensor.isReady}</Info>
            </StatusContainer>
          </StatusInfoWrapper>
        </ControllerWrapper>
      </SectionController>
      {/* constant temp */}
      {swtName !== "tgs" && (
        <SectionController>
          <ControllerWrapper>
            <Img src="images/logo-constantTemp.svg" />
            <StatusInfoWrapper>
              <StatusContainer>
                <Indicator type="active"></Indicator>
                <Info>{states.constantTemp.isActivated}</Info>
              </StatusContainer>
              <StatusContainer>
                <Indicator></Indicator>
                <Info>{states.constantTemp.isReady}</Info>
              </StatusContainer>
            </StatusInfoWrapper>
          </ControllerWrapper>
        </SectionController>
      )}
      {/* heating schedule */}
      <SectionController>
        <ControllerWrapper>
          <Img src="images/logo-schedule.svg" />
          <StatusInfoWrapper>
            <StatusContainer>
              <Indicator type="active"></Indicator>
              <Info>{states.heatingSchedule.isActivated}</Info>
            </StatusContainer>
            <StatusContainer>
              <Indicator></Indicator>
              <Info>{states.heatingSchedule.isReady}</Info>
            </StatusContainer>
          </StatusInfoWrapper>
        </ControllerWrapper>
      </SectionController>
      {/* wind factor */}
      <SectionController>
        <ControllerWrapper>
          <Img src="images/logo-windFactor.svg" />
          <StatusInfoWrapper>
            <StatusContainer>
              <Indicator type="active"></Indicator>
              <Info>{states.windFactor.isActivated}</Info>
            </StatusContainer>
            <StatusContainer>
              <Indicator></Indicator>
              <Info>{states.windFactor.isReady}</Info>
            </StatusContainer>
          </StatusInfoWrapper>
        </ControllerWrapper>
      </SectionController>
      {/* Gp Ebp */}
      <SectionController>
        <ControllerWrapper type="long">
          <StatusInfoWrapper type="long">
            <StatusContainer type="long">
              <StatusTitle title="gp" state={isGp !== 0}>
                {isGp} gp
              </StatusTitle>
              <Img
                isBattery={true}
                src={
                  isGp ? "/images/gp-battery.svg" : "/images/battery-none.svg"
                }
              />
            </StatusContainer>
            <StatusContainer type="long">
              <StatusTitle title="ebp" state={isEbp !== 0}>
                {isEbp} ebp
              </StatusTitle>
              <Img
                isBattery={true}
                src={
                  isEbp ? "/images/ebp-battery.svg" : "/images/battery-none.svg"
                }
              />
            </StatusContainer>
          </StatusInfoWrapper>
        </ControllerWrapper>
      </SectionController>
    </Wrapper>
  );
};

export default DisplayControllers;

const Wrapper = styled.div`
  width: 654px;
  height: 100%;
  ${justifyContentSpaceBetween};
`;
const SectionController = styled.section`
  ${flexBoxCenter}
`;

const ControllerWrapper = styled.div`
  width: 96px;
  height: 38px;
  border-radius: 8px;

  ${layerCLighter};
  ${justifyContentSpaceBetween};

  ${(p) =>
    p.type === "a" &&
    css`
      border-radius: 20px 8px 8px 20px;
    `}

  padding-left:4px;

  ${(p) =>
    p.type === "long" &&
    css`
      padding: 0;
    `}
`;

const Img = styled.img`
  height: 100%;
  ${(p) =>
    p.isBattery &&
    css`
      height: 70%;
    `}
`;

const StatusInfoWrapper = styled.div`
  height: 100%;
  width: 50%;

  ${flexDirectionColumn};
  padding: 4px 0;

  ${(p) =>
    p.type === 1 &&
    css`
      padding: 0;
      justify-content: center;
    `}
  ${(p) =>
    p.type === "long" &&
    css`
      width: 100%;
    `}
`;

const StatusContainer = styled.div`
  width: 40px;
  height: 12px;
  border-radius: 6px;

  ${layerA};
  ${justifyContentSpaceBetween};

  padding: 0 1px;

  ${(p) =>
    p.type === "long" &&
    css`
      width: 92px;
      padding: 0 4px;
    `}
`;
const Indicator = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;

  ${(p) =>
    p.type === "active"
      ? css`
          background: #95ff45;
        `
      : css`
          background: #82ffff;
        `}
`;

const Info = styled.span`
  font-size: 11px;
  letter-spacing: 1.1px;
`;

const StatusTitle = styled.span`
  font-size: 10px;

  ${(p) =>
    p.title === "gp" &&
    css`
      color: #95ff45;
    `}

  ${(p) =>
    p.title === "ebp" &&
    css`
      color: #ff7800;
    `}

    ${(p) =>
    p.state ||
    css`
      color: #808080;
    `}
`;

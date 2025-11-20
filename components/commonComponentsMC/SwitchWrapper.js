import { flexBoxCenter } from "../styles/commonStyles";
import styled, { css } from "styled-components";

import HeaterStatus from "./HeaterStatus";
import EssControlBox from "../ess/EssControlBox";
import TesControlBox from "../tes/TesControlBox";
import TgsControlBox from "../tgs/TgsControlBox";
import SwitchDetailContainer from "./SwitchDetailContainer";
import { useESSSwitchStore, useTESSwitchStore, useTGSSwitchStore } from '../zustand-stores';

const SwitchWrapper = ({
  swtName,
  location,
  machine,
  isMobile,
  specificLocation,
  indivLocationName,
  deviceMac,
}) => {
  // Global
  const { essSwitch, tgsSwitch,flatTgsSwitch, tesSwitch,flatEssSwitch: flatSwitchStatus,flatTesSwitch } = swtName === "ess"
      ? useESSSwitchStore()
      : swtName === "tgs"
      ? useTGSSwitchStore()
      : useTESSwitchStore();

  const switchStatus =
    swtName === "ess" ? flatSwitchStatus : swtName === "tgs" ? flatTgsSwitch : flatTesSwitch;

  const { isFaults, isOff } = switchStatus[location][machine];

  // temporary variables

  return (
    <Wrapper isFaults={isFaults}>
      <InnerWrapper>
        <SectionMain>
          {swtName === "ess" && (
            <>
              <EssControlBox
                location={location}
                specificLocation={specificLocation}
                machine={machine}
                swtName={swtName}
              />
              <SwitchDetailContainer
                location={location}
                specificLocation={specificLocation}
                machine={machine}
                swtName={swtName}
                isFaults={isFaults}
              />
            </>
          )}
          {swtName === "tes" && (
            <>
              <TesControlBox
                location={location}
                machine={machine}
                swtName={swtName}
              />
              <SwitchDetailContainer
                location={location}
                machine={machine}
                swtName={swtName}
                isFaults={isFaults}
              />
            </>
          )}
          {swtName === "tgs" && (
            <>
              <TgsControlBox
                location={location}
                machine={machine}
                swtName={swtName}
              />
              <SwitchDetailContainer
                location={location}
                machine={machine}
                swtName={swtName}
                isFaults={isFaults}
              />
            </>
          )}
        </SectionMain>

        {swtName !== "tgs" && (
          <SectionSub>
            <HeaterStatus
              swtName={swtName}
              location={location}
              specificLocation={specificLocation}
              machine={machine}
              isFaults={isFaults}
              isOff={isOff}
              indivLocationName={indivLocationName}
            />
          </SectionSub>
        )}
      </InnerWrapper>
    </Wrapper>
  );
};

export default SwitchWrapper;

const Wrapper = styled.div`
  width: 1205px;
  ${flexBoxCenter}

  background: transparent linear-gradient(180deg, #1f344c 0%, #060d19 100%);
  border: 1px solid #000000;
  border-radius: 26px 0px 26px 26px;

  ${({ isFaults }) =>
    isFaults &&
    css`
      border: 1px solid red;
    `}
`;
const InnerWrapper = styled.div`
  width: 1184px;
  margin: 11px 0;

  background: #233a54;
  box-shadow: inset 0px 0px 6px #000000;
  border: 1px solid #142033;
  border-radius: 15px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const SectionMain = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionSub = styled.div`
  width: 100%;
`;

import { useState } from "react";

import styled, { css } from "styled-components";

import GraphMain from "./GraphMain";
import HistoryMain from "./HistoryMain";
import SwitchStatusContainer from "./SwitchStatusContainer";
import VideoMain from "./VideoMain";
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentFlexEnd,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerA90Deg,
  layerB,
} from "../styles/commonStyles";
import DisplayFaultsBoxWrapper from "./controllers/DisplayFaultsBoxWrapper";
import DetailDisplayBoxWrapper from "./controllers/DetailDisplayBoxWrapper";
import { postAuditTrailLogService } from "../../services";
import InputTempMessage from "../userMessages/inputTempMessage";

const SwitchDetailContainer = ({
  swtName,
  location,
  specificLocation,
  machine,
  isFaults,
}) => {
  const [displayComponent, setDisplayComponent] = useState("graph");
  const [auditLogData, setAuditLogData] = useState({});
  const [openMessageBox, setOpenMessageBox] = useState(false);
  const [message, setMessage] = useState([]);

  const handleHeaderButtonClick = (component) => {
    setDisplayComponent(component);
  };

  const handleViewAndPrint = () => {
    if (Object.keys(auditLogData).length > 0) {
      postAuditTrailLogService(auditLogData);
    }
  };

  // const {isFaults} = useSelector

  const handleMessage = (state) => {
    if (state === "open") {
      setMessage([
        "selection missing",
        "in order to view your switch generated telemetry please choose all the selections",
      ]);
      setOpenMessageBox(true);
    } else if (state === "realTimeGraph") {
      setMessage([
        "real time graph",
        "you have selected real time graph. you can not select any dates.",
      ]);
      setOpenMessageBox(true);
    } else {
      setOpenMessageBox(false);
    }
  };

  return (
    <Wrapper>
      <SectionHeader>
        <SectionImages>
          <HeaderHatSvg
            onClick={() => handleHeaderButtonClick("history")}
            src={"/images/controller-hat-history.svg"}
          />
          <HeaderHatSvg src={"/images/controller-hat-video.svg"} />
          <HeaderHatSvg
            onClick={() => handleHeaderButtonClick("graph")}
            src={"/images/controller-hat-graph.svg"}
          />
        </SectionImages>

        <SectionHeaderTitle>
          <Title
            right={true}
            onClick={() => handleHeaderButtonClick("history")}
          >
            history
          </Title>
          <Title middle={true} onClick={() => handleHeaderButtonClick("video")}>
            video monitoring
          </Title>
          <Title left={true} onClick={() => handleHeaderButtonClick("graph")}>
            graph
          </Title>
        </SectionHeaderTitle>
      </SectionHeader>

      <SectionMain isFaults={isFaults}>
        <SectionSubHeader>
          <SubHeaderTitle>
            {displayComponent === "history"
              ? `switch history`
              : displayComponent === "graph"
              ? `switch generated telemetry`
              : ``}
          </SubHeaderTitle>
          <SwitchStatusContainer
            location={location}
            machine={machine}
            swtName={swtName}
          />
        </SectionSubHeader>
        {displayComponent === "history" ? (
          <HistoryMain
            location={location}
            machine={machine}
            swtName={swtName}
          />
        ) : displayComponent === "graph" ? (
          <GraphMain
            location={location}
            machine={machine}
            swtName={swtName}
            specificLocation={specificLocation}
            setAuditLogData={setAuditLogData}
            handleMessage={handleMessage}
          />
        ) : (
          <VideoMain location={location} machine={machine} swtName={swtName} />
        )}
        <SectionSubInfo>
          <SectionSubInfoTop>
            <DisplayFaultsBoxWrapper
              swtName={swtName}
              location={location}
              machine={machine}
            />
            <SectionPrintButton>
              <PrintTitle>generated telemetry</PrintTitle>
              <PrintButton onClick={handleViewAndPrint}>
                <PrintButtonOuter>
                  <PrintButtonHole>
                    <PrintButtonTop>view & print</PrintButtonTop>
                  </PrintButtonHole>
                </PrintButtonOuter>
              </PrintButton>
            </SectionPrintButton>
          </SectionSubInfoTop>
          <DetailDisplayBoxWrapper
            swtName={swtName}
            specificLocation={specificLocation}
            location={location}
            machine={machine}
          />
        </SectionSubInfo>
      </SectionMain>
      {openMessageBox && (
        <MessageBoxWrapper>
          <InputTempMessage
            onClose={() => handleMessage("close")}
            messages={message}
            title={"switch generated telemetry"}
            subtitle={"graph selection box"}
          />
        </MessageBoxWrapper>
      )}
    </Wrapper>
  );
};

export default SwitchDetailContainer;

const Wrapper = styled.div`
  width: 751px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const SectionHeader = styled.section`
  width: 100%;
  ${justifyContentFlexEnd};
  position: relative;
`;
const HeaderHatSvg = styled.img`
  cursor: pointer;
`;
const SectionImages = styled.section`
  width: 612px;
  ${justifyContentSpaceBetween};
`;
const SectionHeaderTitle = styled.section`
  width: 612px;
  position: absolute;
  top: 5px;
  ${justifyContentSpaceBetween};
  padding: 0 60px 0 63px;
`;
const Title = styled.span`
  cursor: pointer;
  font-size: 12px;
  letter-spacing: 1.2px;
`;

const SectionMain = styled.section`
  width: 100%;
  height: 665px;
  border-radius: 12px 0px 12px 12px;
  background: transparent linear-gradient(90deg, #233a54 0%, #060d19 100%);
  border: 1px solid #000000;
  ${flexDirectionColumn};
  padding: 3px 0;

  ${({ isFaults }) =>
    isFaults &&
    css`
      border: 1px solid red;
    `}
`;

const SectionSubHeader = styled.div`
  width: 743px;
  height: 32px;
  border-radius: 16px;
  ${layerA};
  ${justifyContentSpaceBetween};
  padding: 0 2px 0 12px;
`;
const SubHeaderTitle = styled.div`
  width: 73%;
  border-bottom: 1px solid #fff;
  font-size: 12px;
  letter-spacing: 1.2px;
  text-align: left;
`;

const SectionSubInfo = styled.section`
  width: 100%;
  height: 130px;
  ${flexDirectionColumn};
`;

const SectionSubInfoTop = styled.section`
  width: 742px;
  ${justifyContentSpaceBetween};
`;

const SectionPrintButton = styled.section`
  width: 742px;
  height: 52px;
  ${flexDirectionColumn};
`;

const PrintTitle = styled.span`
  font-size: 10px;
`;
const PrintButton = styled.button`
  width: 184px;
  height: 34px;
  border-radius: 27px;
  ${layerB};
  ${flexBoxCenter}
`;
const PrintButtonOuter = styled.div`
  width: 182px;
  height: 32px;
  border-radius: 25px;

  ${layerA180Deg};
  ${flexBoxCenter};
`;
const PrintButtonHole = styled.div`
  width: 173px;
  height: 23px;
  border-radius: 20px;
  ${layerB};
  ${flexBoxCenter};
`;
const PrintButtonTop = styled.div`
  width: 171px;
  height: 21px;
  border-radius: 25px;

  ${layerA180Deg};
  ${flexBoxCenter};
  font-size: 10px;
`;

const MessageBoxWrapper = styled.div`
  width: 34%;
  height: 190px;
  position: absolute;

  ${flexBoxCenter}

  top: 8%;
  left: 50%;
  z-index: 100;
`;

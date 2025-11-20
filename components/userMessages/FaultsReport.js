import moment from "moment";
import styled, { css } from "styled-components";
import { getFaultsList } from "../../helpers/helpers";
import {
  justifyContentFlexStart,
  justifyContentSpaceBetween,
  layerA180Deg,
  layerBDark,
} from "../styles/commonStyles";

const FaultsReport = ({
  isReportStatus,
  swt,
  locationData,
  specificLocation,
}) => {
  
  const locations = useLocationsStore();
  const faultsState = useFaultsStore();
  const faultsArray = getFaultsList(locationData)?.map((fault) => {
    const { receivedThermocoupleSetting } = faultsState[swt][fault.location][fault.machine];
    const locationName = locations[swt][fault.location].locationName;
    // const specificLocationName =
    //   locations[swt][fault.location][specificLocation]?.specificLocationName ??
    //   "";
    const machineName = locations[swt][fault.location].devices[fault.machine].machineName;
    const time = receivedThermocoupleSetting.find(
      (item) => item.tc_no === fault.number[0] - 1
    )?.time;
    const faultDate = fault.date
      ? ` - ${fault.date}`
      : fault.faultType === "thermocouple fault" && swt !== "tgs"
      ? ` - ${time ? moment.unix(time).format("h:mma - DD/MM/YYYY") : ""}`
      : "";

    return {
      fault: `${fault.faultType} ${fault.number}`,
      message: `${swt} - ${locationName} - ${machineName} ${faultDate}`,
    };
  });
  if (faultsArray.length > 0) {
    return (
      <Wrapper isReportStatus={isReportStatus}>
        <SectionHeader>
          <HeaderTitle>faults report</HeaderTitle>
        </SectionHeader>
        <SectionContent>
          {faultsArray.map((elem) => (
            <DisplayFaults key={JSON.stringify(elem)}>
              <FaultsMessage>{elem.message}</FaultsMessage>
              <Faults>{elem.fault}</Faults>
            </DisplayFaults>
          ))}
        </SectionContent>
      </Wrapper>
    );
  }
};

export default FaultsReport;

const Wrapper = styled.div`
  width: 544px;
  border-radius: 18px;
  ${layerA180Deg}

  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 3px 0;
  margin-left: 500px;
  ${({ isReportStatus }) =>
    isReportStatus &&
    css`
      position: absolute;
      right: 0px;
      top: 50px;
      border: 1px solid red;
      z-index: 1000;
    `}
`;
const SectionHeader = styled.section`
  width: 535px;
  height: 29px;

  border-radius: 15px;
  ${layerBDark};
  ${justifyContentFlexStart};
  padding: 0 12px;
`;
const HeaderTitle = styled.span`
  width: 100%;
  text-align: left;
  font-size: 12px;
  letter-spacing: 1.2px;
  color: #fe0000;
`;
const SectionContent = styled.section`
  width: 535px;
  border-radius: 8px;
  margin-top: 6px;
  ${layerBDark}
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px 0;
`;
const DisplayFaults = styled.div`
  width: 530px;
  height: 26px;
  border-radius: 13px;
  border: 1px solid #233a54;

  ${justifyContentSpaceBetween}

  margin-bottom: 2px;
  &:last-child {
    margin-bottom: 0px;
  }

  padding: 0 10px;
`;
const Faults = styled.span`
  color: #fe0000;
  font-size: 10px;
  text-align: right;
`;
const FaultsMessage = styled.span`
  font-size: 10px;
  text-align: left;
`;

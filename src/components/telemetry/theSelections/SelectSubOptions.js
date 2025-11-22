import styled, { css } from "styled-components";
import {
  borderABlue,
  borderBlue,
  flexBoxCenter,
  layerA,
} from "../../styles/commonStyles";
import { useMediaQuery } from "react-responsive";
import { useSelector } from "react-redux";
import { selectLocations } from "../../store/slices/locationsSlice";

const SelectSubOptions = ({
  location,
  machine,
  handleSelect,
  isSelected,
  isMobileTC,
  isTelemetry,
  isSpecificLocation,
  specLocationName,
}) => {
  // media query
  const isMobile = useMediaQuery({ query: "(max-width:600px)" });
  const locations = useSelector(selectLocations);

  let locationName = "undefined";
  let machineName = "undefined";

  // TODO: this is a test sample
  // const modifyLocations = {
  //   ...locations,
  //   all: {
  //     ...locations.all,
  //     '658ace1f-84c7-477f-a09d-eb6c63c89b6a': {
  //       test: locations.all[location],
  //     },
  //     10269483039492350: {
  //       test2: locations.all[location],
  //     },
  //   },
  // };
  if (Object.keys(locations?.all).length > 0) {
    if (specLocationName) {
      const findSpecificLocation = locations?.all[specLocationName];
      locationName = findSpecificLocation?.locationName;
      machineName = findSpecificLocation?.devices[machine]?.machineName;
      // !! TEST TGS Purpose Only
      // if (testTgsLocationsAll) {
      //   locationName =
      //     testTgsLocationsAll[location][specificLocation]?.locationName;
      //   machineName =
      //     testTgsLocationsAll[location][specificLocation]?.devices[machine]
      //       ?.machineName ??
      //     testEssLocationsAll[location][specificLocation]?.specificLocationName;
      // }

      // !! TEST ESS Purpose Only
      // if (testEssLocationsAll) {
      //   locationName =
      //     testEssLocationsAll[location][specificLocation]?.locationName;
      //   machineName =
      //     testEssLocationsAll[location][specificLocation]?.devices[machine]
      //       ?.machineName ??
      //     testEssLocationsAll[location][specificLocation]?.specificLocationName;
      // }
    } else {
      const findLocations = locations?.all[location];
      locationName = findLocations?.locationName;
      machineName = findLocations?.devices[machine]?.machineName;
    }
  }

  return (
    <Wrapper
      isMobile={isMobile}
      isMobileTC={isMobileTC}
      isTelemetry={isTelemetry}
    >
      <RadioButton
        onClick={() => handleSelect(location, machine, specLocationName)}
        isMobile={isMobile}
      >
        <RadioIndicator
          isMobile={isMobile}
          isSelected={isSelected}
        ></RadioIndicator>
      </RadioButton>
      <TitleWrapper>
        <Option isMobile={isMobile}>{`${locationName} ${machineName}`}</Option>
      </TitleWrapper>
    </Wrapper>
  );
};

export default SelectSubOptions;

const Wrapper = styled.button`
  ${borderABlue}
  ${({ isMobile, isTelemetry }) =>
    isMobile
      ? css`
          width: 268px;
          min-height: 32px;

          ${({ isMobileTC }) =>
            isMobileTC &&
            css`
              width: 98%;
            `}
        `
      : isTelemetry
      ? css`
          width: 98.5%;

          min-height: 26px;
          ${borderBlue}
        `
      : css`
          width: 98.5%;
          /* width: 100%; */
          min-height: 26px;
        `}
 
  border-radius: 16px;
  &:hover {
    ${layerA}
  }

  display: flex;
  align-items: center;
  justify-content: flex-start;

  padding: 0 2px;
  margin-bottom: 2px;
`;

const RadioButton = styled.div`
  width: 18px;
  height: 18px;
  ${({ isMobile }) =>
    isMobile
      ? css`
          margin-left: 4px;
        `
      : css`
          margin-left: 2px;
        `}

  border: 1px solid #95ff45;
  border-radius: 50%;
  ${flexBoxCenter}
`;
const RadioIndicator = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${(p) => (p.isSelected ? "#95ff45" : "none")};
`;

const TitleWrapper = styled.div`
  width: 90%;
  height: 20px;
  margin-left: 12px;
  white-space: nowrap;
  overflow: hidden;
  ${flexBoxCenter}
`;
const Option = styled.p`
  height: 100%;
  width: 100%;
  font-size: 10px;
  line-height: 20px;
  letter-spacing: 1px;
  text-overflow: ellipsis;
`;

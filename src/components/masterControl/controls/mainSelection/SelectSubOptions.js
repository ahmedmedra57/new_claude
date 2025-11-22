import { useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import { selectLocations } from '../../../store/slices/locationsSlice';
import {
  flexBoxCenter,
  justifyContentFlexStart,
  layerA,
} from '../../../styles/commonStyles';
import testData from '../../../../test_data/testData';
import { selectEssSwitch } from '../../../store/slices/essSwitchSlice';
import { selectTgsSwitch } from '../../../store/slices/tgsSwitchSlice';

const SelectSubOptions = ({
  location,
  machine,
  handleSelect,
  isSelected,
  scope,
  isMobile,
  isMasterControl,
  specificLocation,
  // specLocationName,
  specificLocationIdx,
}) => {
  const locations = useSelector(selectLocations);

  // !!TEST DATA!!
  // const { essSwitch } = useSelector(selectEssSwitch);
  // const { tgsSwitch } = useSelector(selectTgsSwitch);

  // const {
  //   testEssLocationsAll,

  //   testTgsLocationsAll,
  // } = testData(essSwitch, tgsSwitch, locations);
  // !!END
  let locationName = 'undefined';
  let machineName = 'undefined';

  if (Object.keys(locations?.all).length > 0) {
    if (specificLocation) {
      const findSpecificLocation = locations?.all[specificLocation];
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

  const option = scope === location;
  return (
    <Wrapper
      isMobile={isMobile}
      isSmall={scope !== 'switch'}
      isMasterControl={isMasterControl}
    >
      <RadioButton
        isSmall={scope !== 'switch'}
        onClick={() =>
          handleSelect(location, machine, specificLocation, specificLocationIdx)
        }
        isMobile={isMobile}
      >
        <RadioIndicator
          isSmall={scope !== 'switch'}
          isSelected={isSelected}
          isMobile={isMobile}
        ></RadioIndicator>
      </RadioButton>
      <Option
        isSmall={scope !== 'switch'}
        isMobile={isMobile}
        isOptional={option ? option : false}
      >{`${locationName} ${machineName}`}</Option>
    </Wrapper>
  );
};
export default SelectSubOptions;

const Wrapper = styled.button`
  width: 98%;
  min-height: 24px;
  border: 1px solid #233a54;
  border-radius: 16px;
  ${justifyContentFlexStart}

  padding: 0 2rem;
  margin-bottom: 2rem;

  &:hover {
    ${layerA}
  }

  ${(p) =>
    p.isMobile &&
    css`
      min-height: 32px;
      border: 1px solid #142033;
      padding: 0 6px;
      &:last-child {
        margin-bottom: 0;
      }
      ${(p) =>
        p.isSmall
          ? css`
              width: 282px;
            `
          : css`
              width: 293px;
            `}
    `}
  ${(p) =>
    p.isMasterControl &&
    css`
      width: 225px;
    `}
`;

const RadioButton = styled.div`
  min-width: 18px;
  min-height: 18px;
  border: 1px solid #95ff45;
  border-radius: 50%;
  ${flexBoxCenter}

  ${(p) =>
    p.isMobile &&
    css`
      min-width: 22px;
      min-height: 22px;
    `}
`;
const RadioIndicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${(p) => (p.isSelected ? '#95ff45' : 'none')};
`;
const Option = styled.span`
  font-size: 10px;
  margin-left: 20px;
  letter-spacing: 1px;

  ${(p) =>
    p.isOptional &&
    css`
      margin-left: 5px;
    `}

  ${(p) =>
    p.isMobile &&
    css`
      font-size: 12px;
      letter-spacing: 1.2px;
    `}
`;

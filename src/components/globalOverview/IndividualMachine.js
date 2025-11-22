import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  handleSelectDisplaySystem,
  selectGlobalOverview,
} from '../store/slices/globalOverviewSlice';
import { justifyContentSpaceBetween, layerA } from '../styles/commonStyles';
import { selectEssSwitch } from '../store/slices/essSwitchSlice';
import { selectTgsSwitch } from '../store/slices/tgsSwitchSlice';
import { selectTesSwitch } from '../store/slices/tesSwitchSlice';
import { useMemo } from 'react';
import isNumber from 'lodash/isNumber';
import { selectLocations } from '../store/slices/locationsSlice';
import { selectUnits } from '../store/slices/settings/unitsSlice';
import { calculateTotalEnergyConsumption } from '../../helpers/helpers';
import testData from '../../test_data/testData';

const IndividualMachine = ({
  location,
  specificLocation,
  machine,
  setCenter,
  swtName,
  setZoomNum,
  setSearchedMachine,
  selectedLocation
 ,setSelectedLocation
}) => {
  const dispatch = useDispatch();

  // !!TODO: put back the code below
  const { essSwitch,flatEssSwitch, tgsSwitch,flatTgsSwitch, tesSwitch,flatTesSwitch } = useSelector(
    swtName === 'ess'
      ? selectEssSwitch
      : swtName === 'tgs'
      ? selectTgsSwitch
      : selectTesSwitch
  );
  const switchStatus =
    swtName === 'ess' ? essSwitch : swtName === 'tgs' ? tgsSwitch : tesSwitch;
  const flatSwitchStatus =
    swtName === 'ess' ? flatEssSwitch : swtName === 'tgs' ? flatTgsSwitch : flatTesSwitch;

  const locations = useSelector(selectLocations);
  const { selectedSystem } = useSelector(selectGlobalOverview);
  const unitsStatus = useSelector(selectUnits);
  const { isF } = unitsStatus;
  const gas = isF ? 'FT³' : 'M³';
  const unit = swtName === 'tgs' ? gas : 'kw';

  // !!TEST
  // const { essSwitch } = useSelector(selectEssSwitch);
  // const { tgsSwitch } = useSelector(selectTgsSwitch);
  // const { tesSwitch } = useSelector(selectTesSwitch);

  // const { testEssSwitch, testTgsSwitch, testTesSwitch, testAllLocations } =
  //   testData(essSwitch, tgsSwitch, locations, tesSwitch);

  // const switchStatus =
  //   swtName === 'ess'
  //     ? testEssSwitch
  //     : swtName === 'tgs'
  //     ? testTgsSwitch
  //     : testTesSwitch;

  // const handleOnClick = () => {
  //   dispatch(handleSelectDisplaySystem(selectedSystem || 'all'));
  //   if (specificLocation) {
  //     setCenter(testAllLocations[swtName][location][specificLocation]?.address);
  //   } else {
  //     setCenter(testAllLocations[swtName][location]?.address);
  //   }
  //   setZoomNum(17);
  // };
  // !!END

  let data = useMemo(() => {}, []);
  if (specificLocation) {
    data = switchStatus[location].subLocations[specificLocation].devices[machine];
  } else {
    if(!switchStatus[location]){
      data = flatSwitchStatus[location][machine];
    }else{
      data = switchStatus[location].devices[machine];
    }
  }

  const { locationName, specificLocationName, machineName } = data;

  const handleOnClick = () => {
    dispatch(handleSelectDisplaySystem(selectedSystem || 'all'));
    if (specificLocation) {
      setCenter(locations[swtName][location][specificLocation]?.address);
    } else {
      setCenter(locations[swtName][location]?.address);
    }
    setZoomNum(17);
    setSelectedLocation(location);
  };

  const hoursOfUsage = useMemo(() => {
    return data?.hoursOfUsage ?? '--';
  }, [data]);

  const reading = useMemo(() => {
    return calculateTotalEnergyConsumption(data?.reading, swtName, isF);
  }, [data, swtName, isF]);

  const formattedName = specificLocationName
    ? `${locationName} - ${specificLocationName} - ${machineName}`
    : `${locationName} - ${machineName}`;
    // setSearchedMachine(formattedName)
  return (
    <Wrapper onClick={handleOnClick}>
      <IconAndLocationWrapper>
        <Icon src='/images/indeMachine-icon.svg' />

        <Info>{formattedName}</Info>
      </IconAndLocationWrapper>
      <Info>{machineName.split("/").length} {swtName === "ess" ? "switches" : "blowers"}</Info>
      <Info>{hoursOfUsage} Hrs</Info>

      <Info>
        {reading} {unit}
      </Info>
    </Wrapper>
  );
};

export default IndividualMachine;

const Wrapper = styled.button`
  width: 99.6%;
  min-height: 16px;
  border-radius: 13px;

  border: 1px solid #233a54;
  ${justifyContentSpaceBetween};
  padding: 0 8rem 0 22rem;

  margin-bottom: 2rem;

  :last-child {
    margin-bottom: 0;
  }

  :hover {
    ${layerA}
  }
`;
const IconAndLocationWrapper = styled.div`
  width: 40%;
  display: flex;
  align-items: center;
`;
const Icon = styled.img`
  margin-right: 4rem;
`;
const Info = styled.span`
  font-size: 7rem;
`;

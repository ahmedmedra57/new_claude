import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { selectLocations } from '../store/slices/locationsSlice';

import { ItemBackground } from '../styles/commonStyles';
import { selectEssSwitch } from '../store/slices/essSwitchSlice';
import { selectTgsSwitch } from '../store/slices/tgsSwitchSlice';
import { selectTesSwitch } from '../store/slices/tesSwitchSlice';
import testData from '../../test_data/testData';

const DisplayMachineSuggestion = ({
  matchedSuggestion,
  isSelected,
  handleSelect,
  column,
  handleClose,
}) => {
  const locations = useSelector(selectLocations);

  // !! TEST
  // const { essSwitch } = useSelector(selectEssSwitch);
  // const { tgsSwitch } = useSelector(selectTgsSwitch);
  // const { tesSwitch } = useSelector(selectTesSwitch);
  // const { testAllLocations } = testData(
  //   essSwitch,
  //   tgsSwitch,
  //   locations,
  //   tesSwitch
  // );
  // const title = useMemo(() => {
  //   const namesArr = matchedSuggestion.split(' - ');

  //   if (namesArr.length === 3) {
  //     return namesArr
  //       .map((el, index) => {
  //         if (index === 0) {
  //           return testAllLocations.all[el][namesArr[1]].locationName;
  //         } else if (index === 1) {
  //           return testAllLocations.all[namesArr[0]][el].specificLocationName;
  //         } else {
  //           return testAllLocations.all[namesArr[0]][namesArr[1]].devices[el]
  //             .machineName;
  //         }
  //       })
  //       .join(' - ');
  //   } else {
  //     return namesArr
  //       .map((el, index) => {
  //         if (index === 0) {
  //           return testAllLocations.all[el].locationName;
  //         } else {
  //           return testAllLocations.all[namesArr[0]].devices[el].machineName;
  //         }
  //       })
  //       .join(' - ');
  //   }
  // }, [matchedSuggestion]);

  // !! END

  const title = useMemo(() => {
    const namesArr = matchedSuggestion.split(' - ');

    if (namesArr.length === 3) {
      return namesArr
        .map((el, index) => {
          if (index === 0) {
            return locations.all[el][namesArr[1]].locationName;
          } else if (index === 1) {
            return locations.all[namesArr[0]][el].specificLocationName;
          } else {
            return locations.all[namesArr[0]][namesArr[1]].devices[el]
              .machineName;
          }
        })
        .join(' - ');
    } else {
      return namesArr
        .map((el, index) => {
          if (index === 0) {
            return locations.all[el].locationName;
          } else {
            return locations.all[namesArr[0]].devices[el].machineName;
          }
        })
        .join(' - ');
    }
  }, [matchedSuggestion]);

  const handleOnClick = () => {
    handleSelect(column, matchedSuggestion);
    handleClose();
  };

  return (
    <Wrapper isSelected={isSelected} onClick={handleOnClick}>
      <Prediction>{title}</Prediction>
    </Wrapper>
  );
};
export default DisplayMachineSuggestion;

const Wrapper = styled.li`
  width: 100%;

  ${ItemBackground};

  background-color: ${(p) => p.isSelected && `hsla(50deg, 100%, 80%,0.25)`};
  &:hover {
    background-color: hsla(50deg, 100%, 80%, 0.25);
  }

  margin-bottom: 2rem;
  :last-child {
    margin-bottom: 0rem;
  }
  padding-left: 10rem;
  cursor: pointer;
`;

const Prediction = styled.div`
  width: 100%;
  height: 20rem;

  font-size: 10rem;
  letter-spacing: 1rem;

  display: flex;
  align-items: center;
`;

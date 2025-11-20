import styled, { css } from 'styled-components';
import { ItemBackground } from '../../../styles/commonStyles';
import { useMemo } from 'react';
import { useLocationsStore } from '../../../zustand-stores';
import { selectLocations } from '../../../store/slices/locationsSlice';

const DisplaySwitchSuggestion = ({
  matchedSuggestion,
  isSelected,
  handleSelect,
  column,
  handleClose,
}) => {
  const handleOnClick = () => {
    handleSelect(column, matchedSuggestion, true);
    handleClose();
  };
  const locations = useLocationsStore();

  // const title = useMemo(() => {
  //   return matchedSuggestion
  //     ?.split(' - ')
  //     .map((el, index) => {
  //       if (index === 0) {
  //         return locations.all[el]?.locationName;
  //       } else {
  //         return locations.all[matchedSuggestion.split(' - ')[0]]?.devices[el]
  //           ?.machineName;
  //       }
  //     })
  //     .join(' - ');
  // }, [matchedSuggestion, locations.all]);

  const title = useMemo(() => {
    return matchedSuggestion
      ?.split(' - ')
      .map((el, index) => {
        if (index === 0) {
          if (locations.all[el]?.locationName) {
            return locations.all[el]?.locationName?.toUpperCase();
          }
          const specificLocationName = matchedSuggestion.split(' - ')[1];

          return locations.all[el][
            specificLocationName
          ]?.locationName?.toUpperCase();
        } else if (matchedSuggestion.split(' - ').length > 2) {
          // with specific location
          const names = matchedSuggestion.split(' - ');
          if (index === 1) {
            return locations.all[names[0]][names[1]].devices[
              names[2]
            ]?.specificLocationName?.toUpperCase();
          }
          return locations.all[names[0]][names[1]].devices[
            names[2]
          ]?.machineName?.toUpperCase();
        } else {
          // without specific location
          return locations.all[matchedSuggestion.split(' - ')[0]]?.devices[el]
            ?.machineName;
        }
      })
      .join(' - ');
  }, [matchedSuggestion, locations.all]);

  // !!TEST DATA!!
  // const title = useMemo(() => {
  //   const testLocationsAll = {
  //     ...locations.all,
  //     '658ace1f-84c7-477f-a09d-eb6c63c89b6a': {
  //       test: {
  //         ...locations.all['658ace1f-84c7-477f-a09d-eb6c63c89b6a'],
  //         specificLocationName: 'test',
  //         devices: {
  //           ...locations.all['658ace1f-84c7-477f-a09d-eb6c63c89b6a'].devices,
  //           '100000009e851421': {
  //             ...locations.all['658ace1f-84c7-477f-a09d-eb6c63c89b6a'].devices[
  //               '100000009e851421'
  //             ],
  //             specificLocationName: 'test',
  //           },
  //         },
  //       },
  //     },
  //     10269483039492350: {
  //       test2: {
  //         ...locations.all['10269483039492350'],
  //         specificLocationName: 'test2',
  //         devices: {
  //           ...locations.all['10269483039492350'].devices,
  //           '10000000badaff49': {
  //             ...locations.all['10269483039492350'].devices['10000000badaff49'],
  //             specificLocationName: 'test2',
  //           },
  //         },
  //       },
  //     },
  //   };

  //   return matchedSuggestion
  //     ?.split(' - ')
  //     .map((el, index) => {
  //       if (index === 0) {
  //         if (testLocationsAll[el]?.locationName) {
  //           return testLocationsAll[el]?.locationName?.toUpperCase();
  //         }
  //         const specificLocationName = matchedSuggestion.split(' - ')[1];

  //         return testLocationsAll[el][
  //           specificLocationName
  //         ]?.locationName?.toUpperCase();
  //       } else if (matchedSuggestion.split(' - ').length > 2) {
  //         // with specific location
  //         const names = matchedSuggestion.split(' - ');
  //         if (index === 1) {
  //           return testLocationsAll[names[0]][names[1]].devices[
  //             names[2]
  //           ]?.specificLocationName?.toUpperCase();
  //         }
  //         return testLocationsAll[names[0]][names[1]].devices[
  //           names[2]
  //         ]?.machineName?.toUpperCase();
  //       } else {
  //         // without specific location
  //         return locations.all[matchedSuggestion.split(' - ')[0]]?.devices[el]
  //           ?.machineName;
  //       }
  //     })
  //     .join(' - ');
  // }, [matchedSuggestion, locations.all]);

  return (
    <Wrapper isSelected={isSelected} onClick={handleOnClick}>
      <Prediction>{title}</Prediction>
    </Wrapper>
  );
};
export default DisplaySwitchSuggestion;

const Wrapper = styled.li`
  width: 100%;

  ${ItemBackground};

  background-color: ${(p) => p.isSelected && `hsla(50deg, 100%, 80%,0.25)`};
  &:hover {
    background-color: hsla(50deg, 100%, 80%, 0.25);
  }

  margin-bottom: 2px;
  :last-child {
    margin-bottom: 0px;
  }
  padding-left: 10px;
  cursor: pointer;
`;

const Prediction = styled.div`
  width: 100%;
  height: 20px;

  font-size: 10px;
  letter-spacing: 1px;

  display: flex;
  align-items: center;
`;

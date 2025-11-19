import styled from 'styled-components';
import {
  flexDirectionColumn,
  layerA,
  scrollbarY,
} from '../styles/commonStyles';
import TransitStation from './transitStation';

const HeatingPlatformMain = () => {
  // dummy data
  const stationsData = [
    {
      id: '1',
      address: 'sharon massachusetts',
      company: 'mbta',
      stationTitle: 'sharon',
      segmentTitles: ['outbound platform', 'inbound platform'],
    },
    {
      id: '2',
      address: 'boston massachusetts',
      company: 'mbta',
      stationTitle: 'blue hill',
      segmentTitles: [
        'cummings highway walkway',
        'outbound platform',
        'inbound platform',
        'blue hill avenue walkway',
      ],
    },
  ];

  return (
    <StationWrapper>
      {stationsData.map((station) => (
        <TransitStation key={station.id} data={station} />
      ))}
    </StationWrapper>
  );
};

export default HeatingPlatformMain;
// {
//   /* <Wrapper>
//   <TitleContainer title='heating platform' />
// </Wrapper> */
// }

// const Wrapper = styled.div`

// `;

const StationWrapper = styled.section`
  /* width: 1216px;
  height: auto;
  max-height: 620px; */
  padding: 2px;
  border-radius: 36px 36px 33px 33px;
  /* border-radius: 36px; */

  ${layerA}
  ${flexDirectionColumn} /* ${scrollbarY} */
`;

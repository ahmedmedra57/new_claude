import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { flexBoxCenter } from '../../../styles/commonStyles';
import OverSightDisplayBox from '../../common/OverSightDisplayBox';

const OverSightHP = ({ dataAccessKey }) => {
  // sample data
  const segmentsData = [
    {
      id: '1',
      data: [
        {
          id: 'seg1OP',
          segNum: '1',
          title: 'outbound platform',
          consumption: { energy: 0, measurement: 'kw', type: 'energy' },
          usage: 0,
          isOn: false,
        },
        {
          id: 'seg2IP',
          segNum: '2',
          title: 'inbound platform',
          consumption: { energy: 0, measurement: 'kw', type: 'energy' },
          usage: 0,
          isOn: false,
        },
      ],
    },
    {
      id: '2',
      data: [
        {
          id: 'seg1CW',
          segNum: '1',
          title: 'cummings walkway',
          consumption: { energy: 0, measurement: 'kw', type: 'energy' },
          usage: 0,
          isOn: false,
        },
        {
          id: 'seg2OP',
          segNum: '2',
          title: 'outbound platform',
          consumption: { energy: 0, measurement: 'kw', type: 'energy' },
          usage: 0,
          isOn: false,
        },
        {
          id: 'seg3IP',
          segNum: '3',
          title: 'inbound platform',
          consumption: { energy: 0, measurement: 'kw', type: 'energy' },
          usage: 0,
          isOn: false,
        },
        {
          id: 'seg4BHW',
          segNum: '4',
          title: 'blue hill walkway',
          consumption: { energy: 0, measurement: 'kw', type: 'energy' },
          usage: 0,
          isOn: false,
        },
      ],
    },
  ];

  const [localData, setLocalData] = useState([]);

  useEffect(() => {
    if (segmentsData && dataAccessKey) {
      const filteredData = segmentsData.filter(
        (data) => data.id === dataAccessKey
      );
      setLocalData(...filteredData);
    }
  }, []);

  return (
    <Wrapper>
      {/* Title */}
      <OverSightDisplayBox isMainTitle={true} />
      {/* Display segment Section */}
      {localData.data?.map((segmentData, segmentIdx) => (
        <OverSightDisplayBox
          dataAccessKey={localData.id}
          key={segmentData.id}
          openingId={segmentData.id}
          segNum={segmentData.segNum}
          title={segmentData.title}
          consumption={segmentData.consumption}
          usage={segmentData.usage}
          isOn={segmentData.isOn}
        />
      ))}
    </Wrapper>
  );
};

export default OverSightHP;

const Wrapper = styled.div`
  ${flexBoxCenter}
  flex-direction: column;
  gap: 6px;
  padding: 10px;
`;

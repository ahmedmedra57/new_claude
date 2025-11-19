import styled from 'styled-components';
import {
  flexBoxCenter,
  justifyContentFlexStart,
  justifyContentSpaceEvenly,
  layerA,
  layerA180Deg,
} from '../../../../styles/commonStyles';
import { useState } from 'react';
import DropBox from './DropBox';
import { useEffect } from 'react';

const HPDropBox = () => {
  const stationData = [
    {
      key: 'station1',
      stationTitle: 'sharon station',
      segmentsTitle: [
        'outbound platform segments 1',
        'inbound platform segments 2',
      ],
    },
    {
      key: 'station2',
      stationTitle: 'blue hill station',
      segmentsTitle: [
        'cummings walkway segments 1',
        'outbound platform segments 2',
        'inbound platform segments 3',
        'blue hill station segments 4',
      ],
    },
  ];

  const [selection, setSelection] = useState('select station');
  const [openDropBox, setOpenDropBox] = useState(false);
  const [selectStations, setSelectStations] = useState([]);
  const [selectSegments, setSelectSegments] = useState([]);

  const selectionInitialStateHandler = () => {
    const stationState = stationData.map((station) => false);
    setSelectStations(stationState);

    const segmentsState = stationData.map((station) =>
      station.segmentsTitle.map((title) => false)
    );
    setSelectSegments(segmentsState);
  };

  const selectionStateHandler = (isStation, stationIdx, segmentIdx) => {
    const stationState = [...selectStations];
    if (isStation) {
      stationState[stationIdx] = true;
      setSelectStations(stationState);

      const segmentsState = selectSegments.map(
        (groupSegmentsState, groupSegmentsIndex) => {
          if (groupSegmentsIndex === stationIdx) {
            return groupSegmentsState.map((_) => true);
          } else {
            return groupSegmentsState.map((_) => false);
          }
        }
      );
      setSelectSegments(segmentsState);
    } else {
      const segmentsState = [...selectSegments];
      segmentsState[stationIdx][segmentIdx] = true;
      setSelectSegments(segmentsState);

      if (segmentsState[stationIdx].every((state) => state === true)) {
        stationState[stationIdx] = true;
        setSelectStations(stationState);
      }
    }
  };

  useEffect(() => {
    if (stationData.length > 0) {
      selectionInitialStateHandler();
    }
  }, []);

  const handleOpenSelectBoxes = () => {
    setOpenDropBox((prev) => !prev);
  };

  const handleDropBoxSelection = (el) => {
    setSelection(el);
  };

  return (
    <Wrapper>
      <SelectBox>
        <DisplaySelection>
          <Selection>{selection}</Selection>
        </DisplaySelection>
        <Button onClick={handleOpenSelectBoxes}>
          <Img src={'./images/settings-sysIdentification-whiteTriangle.svg'} />
        </Button>
      </SelectBox>
      {openDropBox && (
        <DropBoxWrapper>
          <DropBox
            selectionHandler={handleDropBoxSelection}
            closeDropBoxHandler={handleOpenSelectBoxes}
            data={stationData}
            selection={selection}
            setSelection={setSelection}
            resetSelectionHandler={selectionInitialStateHandler}
            selectStations={selectStations}
            selectSegments={selectSegments}
            selectionGreenButtonHandler={selectionStateHandler}
          />
        </DropBoxWrapper>
      )}
    </Wrapper>
  );
};

export default HPDropBox;

const Wrapper = styled.div`
  width: 420px;
  height: 36px;

  ${layerA}

  border-radius: 18px;
  /* background: #233a54;
  box-shadow: 0px 0px 2px 0px #000 inset; */

  ${flexBoxCenter}
  position: relative;
`;

const SelectBox = styled.div`
  width: 416px;
  height: 32px;

  ${layerA180Deg}

  border-radius: 16px;

  ${justifyContentSpaceEvenly}
`;

const DisplaySelection = styled.div`
  width: 394px;
  height: 26px;

  border-radius: 29px;
  ${layerA}
  ${justifyContentFlexStart}
`;

const Selection = styled.p`
  font-size: 14px;
  margin-left: 12px;
`;

const Button = styled.button``;

const Img = styled.img``;

const DropBoxWrapper = styled.div`
  position: absolute;
  left: 2px;
  top: 2px;
`;

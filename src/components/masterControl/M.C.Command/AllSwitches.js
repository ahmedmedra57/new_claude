import styled, { css } from 'styled-components';
import {
  justifyContentFlexStart,
  layerADark,
  layerB,
  scrollbarY,
} from '../../styles/commonStyles';
import SwitchesByLocation from './SwitchesByLocation';

function AllSwitches({ selectedSwitches, setSelectedSwitches }) {
  return (
    <>
      <ScrollbarWrapper>
        <Scrollbar>
          <SwitchesByLocation
            selectedSwitches={selectedSwitches}
            setSelectedSwitches={setSelectedSwitches}
          />
        </Scrollbar>
      </ScrollbarWrapper>
    </>
  );
}

export default AllSwitches;

const Scrollbar = styled.div`
  width: 100%;
  min-height: 192px;
  max-height: 192px;

  ${scrollbarY}

  overflow-y: scroll;

  border-radius: 4px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
`;

const ScrollbarWrapper = styled.div`
  ${justifyContentFlexStart}

  width: 292px;
  max-height: 200px;
  min-height: 200px;
  padding: 4px;

  border-radius: 4px;
  ${layerB}
`;

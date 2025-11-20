import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  holeLighter,
  justifyContentSpaceBetween,
  layer180Deg,
  layer90Deg,
  layerA,
  layerA90Deg,
} from '../../styles/commonStyles';
import DisplayBox from './DisplayBox';
import { selectEssSwitch } from '../../store/slices/essSwitchSlice';
import { selectTgsSwitch } from '../../store/slices/tgsSwitchSlice';
import { selectTesSwitch } from '../../store/slices/tesSwitchSlice';
import { useSetAndCurrentTemp } from '../../../hooks';

const MCDisplayBoxWrapper = ({
  swtName,
  location,
  machine,
}) => {
  const unitsStatus = useUnitsStore();
  const { isF } = unitsStatus;
  const { essSwitch, tgsSwitch, tesSwitch,flatEssSwitch,flatTgsSwitch,flatTesSwitch } = useSelector(
    swtName === 'ess'
      ? selectEssSwitch
      : swtName === 'tgs'
      ? selectTgsSwitch
      : selectTesSwitch
  );

  const swtStatus =
    swtName === 'ess' ? flatEssSwitch : swtName === 'tgs' ? flatTgsSwitch : flatTesSwitch;
  const switchStatus = swtStatus[location][machine];
  const { setTemp, currentTemp } = useSetAndCurrentTemp(switchStatus);

  return (
    <Wrapper>
      <InnerWrapper>
        <DisplayBox
          title='set temperature'
          data={setTemp}
          unit={isF ? '°F' : '°C'}
        />
        <DisplayBox
          title='current temperature'
          data={currentTemp}
          unit={isF ? '°F' : '°C'}
        />
      </InnerWrapper>
    </Wrapper>
  );
};

export default MCDisplayBoxWrapper;

const Wrapper = styled.div`
  width: 397px;
  height: 64px;
  border-radius: 6px;
  ${flexBoxCenter};
  ${layerA90Deg};
`;
const InnerWrapper = styled.div`
  width: 389px;
  height: 54px;
  border-radius: 8px;

  ${layerA}
  ${justifyContentSpaceBetween}

  padding: 0 2px;
`;

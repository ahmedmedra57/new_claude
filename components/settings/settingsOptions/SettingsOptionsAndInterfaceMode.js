import styled from 'styled-components';
import { flexBoxCenter, layerA } from '../../styles/commonStyles';
import Interface from '../interfaceMode/Interface';
import AllSettingsSelectOptions from './AllSettingsSelectOptions';

function SettingsOptionsAndInterfaceMode() {
  return (
    <Wrapper>
      <AllSettingsSelectOptions />
      <Interface />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 313px;
  height: 498px;
  padding-top: 2px;
  padding-bottom: 2px;
  margin-bottom: 5px;

  ${layerA}

  border-radius: 7px;
  opacity: 1;
  ${flexBoxCenter};
  flex-direction: column;
`;

export default SettingsOptionsAndInterfaceMode;

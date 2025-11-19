import styled from 'styled-components';
import { layerHPA } from '../../../../styles/commonStyles';

const GraphDisplay = () => {
  return <Wrapper></Wrapper>;
};

export default GraphDisplay;

const Wrapper = styled.div`
  width: 860px;
  height: 140px;

  border-radius: 6px;
  ${layerHPA}/* background: #233a54;
  box-shadow: 0px 0px 2px 0px #000 inset; */
`;

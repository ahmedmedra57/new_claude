import styled from 'styled-components';
import {
  flexBoxCenter,
  layerDegHPA,
  layerHPA,
} from '../../../../styles/commonStyles';

const MainSitePlanBox = () => {
  return (
    <Wrapper>
      <FirstInnerLayer>
        <SecondInnerLayer></SecondInnerLayer>
      </FirstInnerLayer>
    </Wrapper>
  );
};

export default MainSitePlanBox;

const Wrapper = styled.div`
  height: 100%;
  width: 100%;

  border-radius: 10px;
  ${layerHPA}
  /* background: #233a54;
  box-shadow: 0px 0px 2px 0px #000 inset; */
  ${flexBoxCenter}
`;

const FirstInnerLayer = styled.div`
  height: 184px;
  width: 867px;
  /* width: 887px; */

  border-radius: 8px;
  ${layerDegHPA}
  box-shadow: none;
  /* border: 0.5px solid #000;
  background: var(
    --Gradiente-umbrella,
    linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
    linear-gradient(180deg, #233a54 0%, #233a54 44%, #060d19 100%)
  ); */
  ${flexBoxCenter}
`;

const SecondInnerLayer = styled.div`
  height: 176px;
  width: 857px;
  /* width: 867px; */

  border-radius: 4px;
  ${layerHPA}
  /* background: #233a54;
  box-shadow: 0px 0px 2px 0px #000 inset; */

  ${flexBoxCenter}
`;

import styled from 'styled-components';
import {
  flexBoxCenter,
  hpBaseLayer,
  justifyContentSpaceEvenly,
  layerDegHPA,
  layerHPA,
} from '../../../../styles/commonStyles';
import SetTempBox from '../temperatureBox/SetTempBox';

const WindFactorMain = () => {
  const smallBoxesTitles = [
    { title: 'low wind factor trigger', speed: '15-24 miles/h' },
    { title: 'med wind factor trigger', speed: '25-37 miles/h' },
    { title: 'high wind factor trigger', speed: '38-52 miles/h' },
    { title: 'extreme wind factor trigger', speed: '53-62miles/h' },
  ];

  return (
    <Wrapper>
      <TitleWrapper>
        <Title>wind factor trigger</Title>
      </TitleWrapper>
      <MainTempBox>
        {smallBoxesTitles.map(({ title, speed }, idx) => (
          <TempBoxWrapper key={idx}>
            <SetTempBox isWindFactor={true} title={title} windSpeed={speed} />
          </TempBoxWrapper>
        ))}
      </MainTempBox>
    </Wrapper>
  );
};

export default WindFactorMain;

const Wrapper = styled.section`
  height: 236px;
  width: 833px;
  /* width: 836px; */

  border-radius: 5px;

  ${layerDegHPA}
  /* border: 0.5px solid #000;
  background: var(
    --Gradiente-umbrella,
    linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
    linear-gradient(180deg, #233a54 0%, #233a54 44%, #060d19 100%)
  );
  box-shadow: 0px 0px 2px 0px #000; */

  ${justifyContentSpaceEvenly}
  flex-direction: column;
`;

const TitleWrapper = styled.div`
  height: 26px;
  width: 820px;

  border-radius: 13px;
  ${layerHPA}
  /* background: #233a54;

  box-shadow: 0px 0px 2px 0px #000 inset; */

  ${flexBoxCenter}
`;

const Title = styled.p`
  font-size: 14px;
`;

const MainTempBox = styled.div`
  width: 817px;
  /* height: 188px; */
  height: 200px;

  border-radius: 8px;
  ${layerHPA}
  /* background: #233a54;
  box-shadow: 0px 0px 2px 0px #000 inset; */

  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  align-content: space-around;
`;

const TempBoxWrapper = styled.div`
  width: 400px;
  height: 92px;
`;

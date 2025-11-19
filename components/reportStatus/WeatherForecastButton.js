// import { useContext } from 'react';
import styled from 'styled-components';
// import { ReportStatusContext } from '../context/contextOfReportStatus';
import {
  flexBoxCenter,
  justifyContentSpaceEvenly,
  layerA180Deg,
  layerB,
} from '../styles/commonStyles';

const WeatherForecastButton = () => {
  // const { handleWeatherForecast } = useContext(ReportStatusContext);

  return (
    <WrapperHole>
      {/* <WrapperHole onClick={(e) => handleWeatherForecast(e)}> */}
      <ButtonOuter>
        <SmallButtonInnerHole>
          <SmallButtonTop>
            <ButtonTopIndent>
              <Icon src={'/images/icon-weather-button.svg'} />
            </ButtonTopIndent>
          </SmallButtonTop>
        </SmallButtonInnerHole>
        <ButtonInnerHole>
          <ButtonTop>
            <Title>weather forecast </Title>
          </ButtonTop>
        </ButtonInnerHole>
      </ButtonOuter>
    </WrapperHole>
  );
};

export default WeatherForecastButton;

const WrapperHole = styled.div`
  width: 207px;
  height: 30px;
  border-radius: 27px;
  ${layerB};
  ${flexBoxCenter}
`;

const ButtonOuter = styled.button`
  width: 205px;
  height: 28px;
  border-radius: 25px;
  ${layerA180Deg};
  ${justifyContentSpaceEvenly};
`;

const SmallButtonInnerHole = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 20px;
  ${flexBoxCenter}

  ${layerB}
`;

const SmallButtonTop = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 25px;
  ${layerA180Deg};
  ${flexBoxCenter};
`;

const ButtonTopIndent = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 20px;

  ${layerB};
  ${flexBoxCenter};
`;

const Icon = styled.img``;

const ButtonInnerHole = styled.div`
  width: 175px;
  height: 22px;
  border-radius: 20px;
  ${layerB};
  ${flexBoxCenter};
`;

const ButtonTop = styled.div`
  width: 173px;
  height: 20px;
  border-radius: 25px;
  ${layerA180Deg};
  ${flexBoxCenter};
`;

const Title = styled.p`
  text-align: center;
  font-size: 8px;
  letter-spacing: 0.8px;
  color: #ffffff;
  opacity: 1;
`;

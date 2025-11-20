import { useMemo } from 'react';
import { useLocationsStore, useUnitsStore } from '../zustand-stores';
import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceAround,
  justifyContentSpaceBetween,
  layerA180Deg,
  layerB,
} from '../styles/commonStyles';
import { useMediaQuery } from 'react-responsive';
import { convertCelsiusToFahrenheit } from '../../helpers/helpers';

const WeatherBox = ({
  handleCloseWeatherBox,
  locationId,
  specificLocationId,
  isHP,
}) => {
  // , isMobile = { isMobile }
  // media query
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  // redux
  const locations = useLocationsStore();
  const unitsStatus = useUnitsStore();

  const { isF } = unitsStatus;
  const unit = isF ? '°F' : '°C';

  const locationWeatherArray = useMemo(() => {
    if (isHP) {
      return locations?.hp[locationId]?.weather || [];
    } else {
      return locations?.all[locationId]?.weather || [];
    }
  }, [locationId, locations?.all, specificLocationId]);
  return (
    <>
      {isMobile ? (
        <Wrapper isMobile={true}>
          <SectionWeather isMobile={true}>
            {locationWeatherArray.map(
              ({ day, tempMax, tempMin, icon }, index) => {
                if (index < 5) {
                  return (
                    <WeatherWrapper key={index} isMobile={true}>
                      <Title isMobile={true}>{day}</Title>
                      <Img
                        isMobile={true}
                        option={'weather'}
                        src={`/images/weather/${icon}.svg`}
                      />
                      <Title isMobile={true}>
                        {isF ? convertCelsiusToFahrenheit(tempMax) : tempMax}
                        {unit}/
                        {isF ? convertCelsiusToFahrenheit(tempMin) : tempMin}
                        {unit}
                      </Title>
                    </WeatherWrapper>
                  );
                }
              }
            )}
          </SectionWeather>

          <SectionLogo
            onClick={() => handleCloseWeatherBox(false)}
            isMobile={true}
          >
            <LogoWrapper isMobile={true}>
              <LogoTop isMobile={true}>
                <Img
                  isLogo={true}
                  src='/images/icon-weather-button.svg'
                  isMobile={true}
                />
              </LogoTop>
            </LogoWrapper>
          </SectionLogo>
        </Wrapper>
      ) : (
        <Wrapper>
          <SectionWeather>
            {locationWeatherArray.map(
              ({ day, tempMax, tempMin, icon }, index) => (
                <WeatherWrapper key={index}>
                  <Title>{day}</Title>
                  <Img option={'weather'} src={`/images/weather/${icon}.svg`} />
                  <Title>
                    {isF ? convertCelsiusToFahrenheit(tempMax) : tempMax}
                    {unit}/{isF ? convertCelsiusToFahrenheit(tempMin) : tempMin}
                    {unit}
                  </Title>
                </WeatherWrapper>
              )
            )}
          </SectionWeather>
          <SectionLogo onClick={() => handleCloseWeatherBox(false)}>
            <LogoWrapper>
              <LogoTop>
                <Img isLogo={true} src='/images/icon-weather-button.svg' />
              </LogoTop>
            </LogoWrapper>
          </SectionLogo>
        </Wrapper>
      )}
    </>
  );
};

export default WeatherBox;

const Wrapper = styled.div`
  /* margin-left: -400px; */
  ${layerA180Deg};
  ${justifyContentSpaceBetween};
  ${(p) =>
    p.isMobile
      ? css`
          width: 310px;
          height: 46px;
          border-radius: 34px;
          padding: 0 5px 0 5px;
        `
      : css`
          width: 810px;
          height: 72px;
          border-radius: 36px;
          padding: 0 7px 0 5px;
          margin-left: 390px;
        `}
`;

const SectionWeather = styled.section`
  ${layerB};
  ${justifyContentSpaceAround};
  ${(p) =>
    p.isMobile
      ? css`
          width: 258px;
          height: 36px;
          border-radius: 19px;
          padding: 2px 6px;
        `
      : css`
          width: 702px;
          height: 62px;
          border-radius: 31px;
          padding: 3px 10px;
        `}
`;
const WeatherWrapper = styled.div`
  height: 100%;

  ${flexDirectionColumn}
`;
const Title = styled.span`
  ${(p) =>
    p.isMobile
      ? css`
          font-size: 6px;
        `
      : css`
          font-size: 8px;
        `}
`;
const Img = styled.img`
  ${(p) =>
    p.isMobile
      ? css`
          height: 50%;
          ${p.isLogo &&
          css`
            margin-right: 4px;
            margin-bottom: 4px;
          `}
        `
      : css``}

  ${(p) =>
    p.isLogo &&
    css`
      height: 120%;
      margin-right: 5px;
      margin-bottom: 8px;
    `}
`;

const SectionLogo = styled.section`
  ${(p) =>
    p.isMobile
      ? css`
          width: 34px;
          height: 34px;
        `
      : css`
          width: 56px;
          height: 56px;
        `};

  border-radius: 50%;
  ${layerB};
  ${flexBoxCenter};
  cursor: pointer;
`;
const LogoWrapper = styled.div`
  ${(p) =>
    p.isMobile
      ? css`
          width: 32px;
          height: 32px;
        `
      : css`
          width: 52px;
          height: 52px;
        `}

  border-radius: 50%;
  ${layerA180Deg};
  ${flexBoxCenter};
`;
const LogoTop = styled.div`
  ${(p) =>
    p.isMobile
      ? css`
          width: 24px;
          height: 24px;
        `
      : css`
          width: 40px;
          height: 40px;
        `}
  border-radius: 50%;
  ${layerB};
  ${flexBoxCenter};
`;

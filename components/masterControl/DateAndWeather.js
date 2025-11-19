import moment from 'moment/moment';
import { memo } from 'react';
import { useMediaQuery } from 'react-responsive';

import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  justifyContentSpaceBetween,
} from '../styles/commonStyles';

const DateAndWeather = () => {
  // responsive design
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  const date = moment().format('MMMM dddd DD, YYYY');
  const imageDash = '/images/long-dash.svg';
  return (
    <Wrapper isMobile={isMobile}>
      <Dash isMobile={isMobile} />
      <DateAndWeatherWrapper>
        <Date>{date ? date : 'september wednesday 21, 2022'}</Date>
        <WeatherIcon
          isMobile={isMobile}
          alt='weather icon'
          src={'/images/weather-sunny.svg'}
        />
        <Weather>
          27 °F Montreal
        </Weather>
      </DateAndWeatherWrapper>
      <Dash isMobile={isMobile} />
    </Wrapper>
  );
};

export default memo(DateAndWeather);

const Wrapper = styled.div`
  width: 550px;

  ${justifyContentSpaceBetween}
  ${flexBoxCenter}
  margin-bottom: 8px;

  ${(p) =>
    p.isMobile &&
    css`
      margin-top: 10px;
      width: 98%;
    `}
`;

const DateAndWeatherWrapper = styled.span`
  width: 400px;
  font-size: 10px;
  color: white;

  ${flexBoxCenter}
  justify-content: space-evenly;
`;

const Dash = styled.div`
  width: 71px;
  ${(p) =>
    p.isMobile &&
    css`
      width: 10px;
    `};

  border: 1px solid #ffff;
`;

const Date = styled.span`
  ${({ interfaceMode }) =>
    interfaceMode
      ? css`
          color: #1b2b44;
        `
      : css`
          color: #ffff;
        `}
`;

const WeatherIcon = styled.img`
  ${(p) =>
    p.isMobile &&
    css`
      height: 14px;
    `}
`;
const Weather = styled.span`
  ${({ interfaceMode }) =>
    interfaceMode
      ? css`
          color: #1b2b44;
        `
      : css`
          color: #ffff;
        `}
`;

import { useState } from 'react';
import { useLocationsStore } from '../../../../zustand-stores';
import styled from 'styled-components';
import {
  flexBoxCenter,
  justifyContentSpaceAround,
  layerA180Deg,
  layerHPA,
} from '../../../../styles/commonStyles';

import WeatherBox from '../../../../commonComponentsMC/WeatherBox';
import { useSelector } from 'react-redux';
import { selectLocations } from '../../../../store/slices/locationsSlice';
import MessageBox from '../../../../userMessages/messageBox';
import ContainerLogin from '../../../../adminPassword/ContainerLogin';
import Upload from '../../../../commonComponentsMC/UploadBox';

const GroupButtons = ({ locationId = '' }) => {
  const locations = useLocationsStore();

  // !! test purpose only with test data
  const sitePlanUrl = locations?.hp[locationId] || '';

  const [displayWeatherForecast, setDisplayWeatherForecast] = useState(false);
  const [displayInfoCenter, setDisplayInfoCenter] = useState(false);
  const [displayUploadSitePlans, setDisplayUploadSitePlans] = useState(false);
  const [displayViewSitePlans, setDisplayViewSitePlans] = useState(false);
  const [openPasswordBox, setOpenPasswordBox] = useState(false);
  const [displayMessageBox, setDisplayMessageBox] = useState(false);

  const displayWeatherBoxHandler = () => {
    setDisplayWeatherForecast((prev) => !prev);
  };

  const displayInfoCenterHandler = () => {
    setDisplayInfoCenter((prev) => !prev);
  };

  const displayUploadSitePlansHandler = () => {
    setDisplayUploadSitePlans((prev) => !prev);
  };

  const displayViewSitePlansHandler = () => {
    if (sitePlanUrl) {
      setDisplayViewSitePlans((prev) => !prev);
    } else {
      setDisplayMessageBox((prev) => !prev);
    }
  };

  const openPasswordBoxHandler = () => {
    setOpenPasswordBox((prev) => !prev);
  };

  return (
    <Wrapper>
      <button>
        <img alt='zoom view' src='/images/hp-zoomView-button.svg' />
      </button>
      {/* WEATHER FORECAST */}
      <button onClick={displayWeatherBoxHandler}>
        <img
          alt='weather forecast'
          src='/images/hp-weatherForecast-button.svg'
        />
      </button>
      {displayWeatherForecast && (
        <WeatherBoxWrapper>
          <WeatherBox
            handleCloseWeatherBox={displayWeatherBoxHandler}
            // locationId={locationId}
            isHP={true}
            // specificLocationId={specificLocationKeyForWeather}
          />
        </WeatherBoxWrapper>
      )}
      {/* INFO CENTER */}
      <button onClick={displayInfoCenterHandler}>
        <img alt='info center' src='/images/hp-infoCenter-button.svg' />
      </button>
      <ButtonsWrapper>
        {/* UPLOAD SITE PLANS */}
        <Button onClick={openPasswordBoxHandler}>
          <img
            alt='upload site plans'
            src='/images/hp-uploadSitePlans-button.svg'
          />
        </Button>
        <SectionUpload displayUploadBox={displayUploadSitePlans}>
          {openPasswordBox && (
            <LoginBoxWrapper>
              <ContainerLogin
                handleClose={openPasswordBoxHandler}
                handleDisplayUploadSitePlan={displayUploadSitePlansHandler}
              />
            </LoginBoxWrapper>
          )}
          {displayUploadSitePlans && (
            <UploadBoxWrapper>
              <Upload
                handleClose={displayUploadSitePlansHandler}
                locationId={locationId}
                isHP={true}
              />
            </UploadBoxWrapper>
          )}
        </SectionUpload>
        {/* VIEW SITE PLANS */}
        <Button onClick={displayViewSitePlansHandler}>
          <img
            alt='view site plans'
            src='/images/hp-viewSitePlans-button.svg'
          />
        </Button>
        {displayViewSitePlans && (
          <PDFViewer>
            <button
              className='close-button'
              onClick={displayViewSitePlansHandler}
            >
              X
            </button>
            <div className='view' />
            <embed src={sitePlanUrl} type='application/pdf' />
          </PDFViewer>
        )}
        {displayMessageBox && (
          <MessageBoxWrapper>
            <MessageBox
              onClose={displayViewSitePlansHandler}
              title={'hp site plan'}
              subtitle='view site plan'
              messages={['No site plan uploaded yet.']}
            />
          </MessageBoxWrapper>
        )}
      </ButtonsWrapper>
    </Wrapper>
  );
};

export default GroupButtons;

const Wrapper = styled.div`
  width: 100%;
  ${flexBoxCenter}
  gap:6px;
  position: relative;
`;

const ButtonsWrapper = styled.div`
  width: 248px;
  height: 44px;

  border-radius: 22px;
  ${layerHPA}
  /* background: var(--LIGHT-BACKGROUND, #233a54);
  box-shadow: 0px 0px 2px 0px #000 inset; */

  ${justifyContentSpaceAround}
  position: relative;
`;

const Button = styled.button`
  margin-top: 4px;
`;

const WeatherBoxWrapper = styled.div`
  width: 810px;
  height: 72px;
  cursor: pointer;

  position: absolute;
  top: 0;
  left: -115px;
  z-index: 2;

  ${flexBoxCenter}
`;

const SectionUpload = styled.section`
  ${flexBoxCenter}
  position: relative;
`;

const LoginBoxWrapper = styled.div`
  position: absolute;
  top: -29px;
  z-index: 2;
`;
const UploadBoxWrapper = styled.div`
  position: absolute;
  top: -24px;
  left: -19px;
  z-index: 2;
  ${flexBoxCenter};
`;

const PDFViewer = styled.div`
  width: 70vw;
  height: 80vh;
  position: fixed;
  top: 10vh;
  left: 15vw;
  border: 1px solid #ccc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  background-color: white;
  z-index: 2;

  border-radius: 24px;

  ${layerA180Deg};
  ${flexBoxCenter};
  overflow: hidden;

  embed {
    width: 100%;
    height: 100%;
  }

  .close-button {
    position: absolute;
    top: 8px;
    right: 55px;
    cursor: pointer;
    font-size: 18px;
    width: 40px;
    height: 40px;
    background-color: #323639ff;
    z-index: 2;
  }

  .view {
    position: absolute;
    top: 8px;
    right: 95px;
    width: 40px;
    height: 40px;
    background-color: #323639ff;
    z-index: 2;
  }
`;

const MessageBoxWrapper = styled.div`
  border-radius: 16px;

  display: flex;
  justify-content: center;

  padding: 16px;

  position: absolute;
  top: -16px;
  right: -18px;
  z-index: 2;
`;

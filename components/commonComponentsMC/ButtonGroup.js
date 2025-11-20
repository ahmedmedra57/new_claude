import { useState } from 'react';
import { useLocationsStore } from '../zustand-stores';
import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerB,
  layerCLighter,
  layerBDisabled,
} from '../styles/commonStyles';
import Upload from './UploadBox';
import WeatherBox from './WeatherBox';
import ContainerLogin from '../adminPassword/ContainerLogin';
import MessageBox from '../userMessages/messageBox';

const ButtonGroup = ({
  handleOnClick,
  btnName,
  id,
  locationId = '',
  specificLocationId = '',
  swtName,
  displayHandler,
  openArr,
  disabled,
  expandFC,
}) => {
  const [displayWeatherBox, setDisplayWeatherBox] = useState(false);
  const [displayUploadBox, setDisplayUploadBox] = useState(false);
  const [displayViewSite, setDisplayViewSite] = useState(false);
  const [displayMessage, setDisplayMessage] = useState(false);
  const [openPasswordBox, setOpenPasswordBox] = useState(false);

    const locations = useLocationsStore();
  // !! test purpose only with test data
  const sitePlanUrl =
    locations[swtName][locationId][`site_maps_${swtName.toUpperCase()}`];
  // !!
  // const sitePlanUrl = isSpecificLocation
  //   ? locations[swtName][locationId][specificLocationId][
  //       `site_maps_${swtName.toUpperCase()}`
  //     ]
  //   : locations[swtName][locationId][`site_maps_${swtName.toUpperCase()}`];
  const handleViewSitePlan = () => {
    if (sitePlanUrl) {
      setDisplayViewSite(true);
    } else {
      setDisplayMessage(true);
    }
  };

  return (
    <Wrapper>
      <SectionWeather>
        <WeatherButtonHole
          onClick={() => {
            setDisplayWeatherBox(true);
            // handleOnClick('weather', id);
          }}
        >
          <WeatherButtonInner>
            <WeatherIconHole>
              <WeatherIconInner>
                <WeatherIconTop>
                  <Img src='/images/icon-weather-button.svg' />
                </WeatherIconTop>
              </WeatherIconInner>
            </WeatherIconHole>
            <WeatherButtonInnerHole>
              <WeatherButtonTop>
                weather <br></br> forecast
              </WeatherButtonTop>
            </WeatherButtonInnerHole>
          </WeatherButtonInner>
        </WeatherButtonHole>
      </SectionWeather>
      <SectionUpload displayUploadBox={displayUploadBox}>
        {openPasswordBox && (
          <LoginBoxWrapper isMobile={true}>
            <ContainerLogin
              handleClose={() => setOpenPasswordBox(false)}
              handleDisplayUploadSitePlan={() => setDisplayUploadBox(true)}
            />
          </LoginBoxWrapper>
        )}

        <ButtonWrapper displayUploadBox={displayUploadBox} disabled={disabled}>
          {displayUploadBox ? (
            <Upload
              handleClose={() => setDisplayUploadBox(false)}
              locationId={locationId}
              // specificLocationId={specificLocationId}
              swtName={swtName}
            />
          ) : (
            <ButtonHole
              disabled={disabled}
              onClick={() => {
                setOpenPasswordBox(true);
                // handleOnClick('upload', id);
              }}
            >
              <ButtonTop disabled={disabled}>upload site plan</ButtonTop>
            </ButtonHole>
          )}
        </ButtonWrapper>
      </SectionUpload>

      <SectionViewSite>
        <ButtonWrapper onClick={handleViewSitePlan} disabled={disabled}>
          <ButtonHole disabled={disabled}>
            <ButtonTop disabled={disabled}>view site plan</ButtonTop>
          </ButtonHole>
        </ButtonWrapper>
      </SectionViewSite>

      <SectionExpand>
        <ExpandButtonWrapper
          onClick={() => {
            handleOnClick(
              dispatch,
              displayHandler,
              openArr,
              swtName,
              'expand',
              id,
              locationId,
              specificLocationId
            );
            dispatch(
              expandFC({
                swtName,
                locationIdx: id,
                status: true,
              });
          }}
        >
          <ExpandButtonHole>
            <ExpandButtonTop>{btnName}</ExpandButtonTop>
          </ExpandButtonHole>
        </ExpandButtonWrapper>
      </SectionExpand>

      {displayWeatherBox && (
        <WeatherBoxWrapper onClick={() => setDisplayWeatherBox(false)}>
          <WeatherBox
            weatherData={null}
            locationId={locationId}
            // specificLocationId={specificLocationId}
          />
        </WeatherBoxWrapper>
      )}
      {displayViewSite && (
        <PDFViewer>
          <button
            className='close-button'
            onClick={() => setDisplayViewSite(false)}
          >
            X
          </button>
          <div className='view' />
          <embed src={sitePlanUrl} type='application/pdf' />
        </PDFViewer>
      )}
      {displayMessage && (
        <MessageBoxWrapper>
          <MessageBox
            onClose={() => setDisplayMessage(false)}
            title={specificLocationId ? 'specific location' : 'location'}
            subtitle='view site plan'
            messages={['No site plan uploaded yet.']}
          />
        </MessageBoxWrapper>
      )}
    </Wrapper>
  );
};

export default ButtonGroup;

const Wrapper = styled.div`
  width: 650px;
  height: 100%;

  ${justifyContentSpaceBetween};
  position: relative;
`;

const SectionWeather = styled.section`
  ${flexBoxCenter}
`;

const WeatherButtonHole = styled.button`
  width: 96px;
  height: 30px;
  border-radius: 27px;

  ${layerB};
  ${flexBoxCenter};
`;
const WeatherButtonInner = styled.div`
  width: 94px;
  height: 28px;
  border-radius: 25px;

  ${layerA180Deg};
  ${justifyContentSpaceBetween};
  padding: 0 2px;
`;

const WeatherIconHole = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;

  ${layerB};
  ${flexBoxCenter};
`;
const WeatherIconInner = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;

  ${layerA180Deg};
  ${flexBoxCenter}
`;

const WeatherIconTop = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;

  ${layerB};
  ${flexBoxCenter}
`;
const Img = styled.img`
  margin-right: 1px;
`;

const WeatherButtonInnerHole = styled.div`
  width: 66px;
  height: 24px;
  border-radius: 20px;

  ${layerB};
  ${flexBoxCenter};
`;
const WeatherButtonTop = styled.div`
  width: 64px;
  height: 22px;
  border-radius: 25px;

  ${layerA180Deg};
  ${flexBoxCenter}

  font-size: 8px;
  letter-spacing: 0.8px;
`;

const SectionUpload = styled.section`
  ${flexBoxCenter}
  position: relative;
`;

const LoginBoxWrapper = styled.div`
  position: absolute;
  top: 0;
  z-index: 100;
`;

const SectionViewSite = styled.section`
  ${flexBoxCenter}
`;

const ButtonWrapper = styled.div`
  width: 208px;
  height: 30px;
  border-radius: 25px;

  ${layerA180Deg}
  ${flexBoxCenter}
  ${(p) => p.displayUploadBox && css``}

  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled};
      cursor: not-allowed;
    `}
`;
const ButtonHole = styled.button`
  width: 200px;
  height: 22px;
  border-radius: 18px;

  ${layerCLighter};
  ${flexBoxCenter};

  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled};
      cursor: not-allowed;
    `}
`;
const ButtonTop = styled.div`
  width: 198px;
  height: 20px;
  border-radius: 25px;

  ${layerA180Deg};
  ${flexBoxCenter};

  font-size: 10px;

  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled};
      cursor: not-allowed;
    `}
`;

const SectionExpand = styled.section`
  ${flexBoxCenter}
`;
const ExpandButtonWrapper = styled.button`
  width: 93px;
  height: 30px;
  border-radius: 25px;

  ${layerA180Deg};
  ${flexBoxCenter};
`;
const ExpandButtonHole = styled.div`
  width: 85px;
  height: 22px;
  border-radius: 18px;

  ${layerCLighter};
  ${flexBoxCenter};
`;
const ExpandButtonTop = styled.div`
  width: 83px;
  height: 20px;
  border-radius: 25px;

  ${layerA180Deg};
  ${flexBoxCenter};
  font-size: 10px;
`;

const WeatherBoxWrapper = styled.div`
  width: 1206px;
  height: 300px;
  cursor: pointer;

  position: absolute;
  top: -113px;
  left: -555px;
  z-index: 100;

  ${flexBoxCenter}
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
  z-index: 999;

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
    z-index: 999;
  }

  .view {
    position: absolute;
    top: 8px;
    right: 95px;
    width: 40px;
    height: 40px;
    background-color: #323639ff;
    z-index: 999;
  }
`;

const MessageBoxWrapper = styled.div`
  width: 120%;
  border-radius: 16px;

  display: flex;
  justify-content: center;

  margin-top: 8px;
  padding: 16px;

  position: absolute;
  top: -100px;
  right: 0px;
  z-index: 100;

  cursor: pointer;
`;

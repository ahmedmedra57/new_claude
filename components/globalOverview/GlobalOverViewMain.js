import { useEffect, useState } from 'react';
import { useGlobalOverviewStore } from '../zustand-stores';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';

import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA180Deg,
  layerADark,
  layerBDark,
} from '../styles/commonStyles';

import IntegratedSystem from './IntegratedSystem';
import OverviewMap from './OverviewMap';
import SwitchSelect from './SwitchSelect';

const GlobalOverviewMain = () => {
  const { t } = useTranslation();
    const OverViewState = useGlobalOverviewStore();
  const { selectedSystem } = OverViewState;

  const [mapCenter, setMapCenter] = useState({
    lat: 42.36997,
    lng: -71.070647,
  });

  const [zoomNum, setZoomNum] = useState(8);
   const [selectedLocation, setSelectedLocation] = useState(null);


  const displaySelectedSwitch = {
    iconIndex: null,
    location: null,
    status: false,
  };

  const [isSelected, setIsSelected] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  useEffect(() => {
    if (selectedSystem === 'all') {
      setIsSelected([true, true, true, true, false, false]);
    } else if (selectedSystem === null) {
      setIsSelected([false, false, false, false, false, false]);
    }
  }, [selectedSystem]);

  useEffect(() => {
    useMasterControlSelectStore().resetMapSelection();
  }, []);

  return (
    <Wrapper>
      <TitlesWrapper>
        <TitleWrapper id={'main'}>
          <TitleContentsWrapper>
            <Title>{t('globalOverview.title')}</Title>
          </TitleContentsWrapper>
        </TitleWrapper>

        <TitleWrapper id={'sub'}>
          <TitleContentsWrapper>
            <Title>{t('globalOverview.integratedSystems')}</Title>
          </TitleContentsWrapper>
        </TitleWrapper>
      </TitlesWrapper>

      <SectionMainContents>
        <SectionInnerWrapper>
          <SectionSelectAndMap>
            <SectionSelectSwitch>
              <SwitchSelect
                isSelected={isSelected}
                setIsSelected={setIsSelected}
              />
            </SectionSelectSwitch>
            <SectionMap>
              <OverviewMap
                center={mapCenter}
                setCenter={setMapCenter}
                zoomNum={zoomNum}
                setZoomNum={setZoomNum}
                displaySelectedSwitch={displaySelectedSwitch}
                selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              />
            </SectionMap>
          </SectionSelectAndMap>

          <SectionSelectSwitches>
            <IntegratedSystem
              setCenter={setMapCenter}
              setZoomNum={setZoomNum}
              mapCenter={mapCenter}
              zoomNum={zoomNum}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
            />
          </SectionSelectSwitches>
        </SectionInnerWrapper>
      </SectionMainContents>
    </Wrapper>
  );
};

export default GlobalOverviewMain;

const Wrapper = styled.div`
  width: 1216rem;

  display: flex;
  flex-direction: column;
  align-items: center;

  margin-bottom: 40px;
`;

const TitlesWrapper = styled.div`
  width: 100%;
  ${justifyContentSpaceBetween}
  margin-bottom: 8rem;
`;

const TitleWrapper = styled.div`
  height: 32rem;
  ${(p) =>
    p.id === 'main'
      ? css`
          width: 656rem;
        `
      : css`
          width: 544rem;
        `}
  border-radius: 16px;

  ${layerADark}

  ${flexBoxCenter}
  padding: 5rem 10rem;
`;

const TitleContentsWrapper = styled.div`
  width: 100%;
  height: 90%;

  display: flex;
  align-items: center;

  padding: 0 5rem;
`;
const Title = styled.span`
  width: 100%;
  font-size: 16px;
  border-bottom: 2px solid #fff;
`;

const SectionMainContents = styled.section`
  width: 1216px;
  height: auto;
  border-radius: 16px;

  ${layerBDark}
  ${flexBoxCenter}
  padding: 1rem 0;
`;

const SectionInnerWrapper = styled.div`
  width: 1212px;
  border-radius: 15px;

  ${layerA180Deg}

  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 5rem 5rem;
`;

const SectionSelectAndMap = styled.section`
  /* padding: 5rem; */
  height: 590rem;

  ${flexDirectionColumn}
`;
const SectionSelectSwitch = styled.section`
  width: 100%;
  margin-bottom: 10rem;
`;

const SectionMap = styled.section`
  width: 650rem;
  height: 100%;
`;

const SelectWrapper = styled.div``;
const SelectInner = styled.div``;
const SelectBox = styled.div``;
const ArrowButton = styled.img``;

const SectionSelectSwitches = styled.section`
  width: 535rem;
  padding: 2px 0;
  border-radius: 12px;

  ${layerBDark}
  ${flexBoxCenter}
`;

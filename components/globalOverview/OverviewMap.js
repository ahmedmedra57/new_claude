import React, { useEffect } from 'react';
import { GoogleMap, useJsApiLoader, OverlayView } from '@react-google-maps/api';

import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectGlobalOverview } from '../store/slices/globalOverviewSlice';
import { selectEssSwitch } from '../store/slices/essSwitchSlice';
import { selectTesSwitch } from '../store/slices/tesSwitchSlice';
import { selectTgsSwitch } from '../store/slices/tgsSwitchSlice';

import styled from 'styled-components';
import { layerA180Deg } from '../styles/commonStyles';

import MapMarker from './MapMarker';
import { selectLocations } from '../store/slices/locationsSlice';

const OverviewMap = ({ center, setCenter, zoomNum, setZoomNum,selectedLocation,setSelectedLocation }) => {
  const overViewState = useSelector(selectGlobalOverview);
  const { selectedSystem } = overViewState;
  const [displayIcon, setDisplayIcon] = useState([true, true, true]);


  useEffect(() => {
    selectedSystem === 'all' && setDisplayIcon([true, true, true]);
    !selectedSystem && setDisplayIcon([false, false, false]);
    selectedSystem === 'ess' && setDisplayIcon([true, false, false]);
    selectedSystem === 'tgs' && setDisplayIcon([false, true, false]);
    selectedSystem === 'tes' && setDisplayIcon([false, false, true]);
    selectedSystem === 'ess, tes' && setDisplayIcon([true, false, true]);
    selectedSystem === 'ess, tgs' && setDisplayIcon([true, true, false]);
    selectedSystem === 'tgs, tes' && setDisplayIcon([false, true, true]);
  }, [selectedSystem]);

  // dummy address data
  const locations = useSelector(selectLocations);
  const { ess, tes, tgs } = locations;
  // dummy address data

  const { essSwitch: essSwitches } = useSelector(selectEssSwitch);
  const { tesSwitch: tesSwitches } = useSelector(selectTesSwitch);
  const { tgsSwitch: tgsSwitches } = useSelector(selectTgsSwitch);

  const { REACT_APP_GOOGLE_MAPS_API } = process.env;

  const icons = [
    '/images/marker-ess.svg',
    '/images/marker-tgs.svg',
    '/images/marker-tes.svg',
  ];

  const icon = '/images/map-icon.svg';

  const containerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '12px',
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_API,
  });

  const [map, setMap] = useState(null);

  const onLoad = useCallback((map) => {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);
  

  return (
    <Wrapper>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={zoomNum}
          // mapTypeId='satellite'
          // onLoad={onLoad}
          // onUnmount={onUnmount}
        >
          {/* Ess only */}
          {/* {displayIcon[0] &&
            Object.values(ess).map(({ address }, index) => (
              <OverlayView
                key={Math.random() * 1000}
                position={address}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <MapMarker
                  handleZoom={() => {
                    setCenter(address);
                    setZoomNum(17);
                  }}
                  index={index}
                  location={Object.keys(essSwitches)[index]}
                />
              </OverlayView>
            ))} */}
          {/* Ess only */}
         {displayIcon[0] &&
                    Object.entries(ess).map(([key, essSwitch], index) => {
                      const { address, specific_location } = essSwitch;

                      // لو في ماركر محدد واللي شغال مش هو، ارجع null
                      if (selectedLocation && selectedLocation !== key) return null;

                      // حساب العنوان الجديد فقط لما محدش محدد
                      let newAddress = address;
                      if (!selectedLocation && !specific_location) {
                        const radius = 0.0003;
                        const angle = (index / 10) * 2 * Math.PI;
                        newAddress = {
                          ...address,
                          lng: address.lng + radius * Math.cos(angle),
                          lat: address.lat + radius * Math.sin(angle),
                        };
                      }

                   
                  return (
                    <OverlayView
                      key={key || index}  
                      position={address}
                      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    >
                      <MapMarker
                        handleZoom={() => {
                          
                          setCenter(address);
                          setZoomNum(10);
                          setSelectedLocation(key);
                        }}
                        index={index}
                        location={key}   
                 />
                </OverlayView>
              );
            })}

          {/* tgs only */}
         {displayIcon[1] &&
              Object.entries(tgs).map(([key, { address }], index) => {
                const radius = 0.0003;
                const angle = (index / 10) * 2 * Math.PI;
                const newAddress = {
                  ...address,
                  lng: address.lng + radius * Math.cos(angle),
                  lat: address.lat + radius * Math.sin(angle),
                };
                 if (selectedLocation && selectedLocation !== key) return null;
                return (
                  <OverlayView
                    key={key}
                    position={address}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  >
                    <MapMarker
                      handleZoom={() => {
                        setCenter(newAddress);
                        setZoomNum(10);
                        setSelectedLocation(key);
                      }}
                      index={index}
                      location={key} 
                    />
                  </OverlayView>
              );
            })}

          {/* tes only */}
          {displayIcon[2] &&
            Object.entries(tes).map(([key, { address }], index) => {
             const radius = 0.0003; 
              const angle = (index / 10) * 2 * Math.PI; 
              const newAddress = {
                ...address,
                lng: address.lng + radius * Math.cos(angle),
                lat: address.lat + radius * Math.sin(angle),
              };
              if (selectedLocation && selectedLocation !== key) return null;
              return (
                <OverlayView
                  key={Math.random() * 1000}
                  position={address}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                  <MapMarker
                    handleZoom={() => {
                      setCenter(newAddress);
                      setZoomNum(10);
                      setSelectedLocation(key);
                    }}
                    index={index}
                    location={key}
                  />
                </OverlayView>
              );
            })}
        </GoogleMap>
      )}
    </Wrapper>
  );
};

export default React.memo(OverviewMap);

const Wrapper = styled.div`
  height: 100%;
  width: 100%;

  overflow: hidden;
`;

const HoverInfoBox = styled.div`
  width: 100px;
  height: 100px;
  ${layerA180Deg}
`;

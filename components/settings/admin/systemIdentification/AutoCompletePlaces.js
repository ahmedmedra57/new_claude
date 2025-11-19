import { useState } from 'react';
import { useRef, useEffect } from 'react';
import './styles.css';

const AutoCompletePlaces = ({ civicAddress, setCivicAddress, inputRef }) => {
  const autoCompleteRef = useRef();

  useEffect(() => {
    autoCompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ['address'],
        componentRestrictions: { country: ['ca', 'us'] },
      }
    );

    autoCompleteRef.current.addListener('place_changed', () => {
      const place = autoCompleteRef.current.getPlace();

      if (place && place.address_components) {
        const cityComponent = place.address_components.find((component) =>
          component.types.includes('locality')
        );

        const stateComponent = place.address_components.find((component) =>
          component.types.includes('administrative_area_level_1')
        );
        const streetComponent = place.address_components.find((component) =>
          component.types.includes('street_number')
        );
        const routeComponent = place.address_components.find((component) =>
          component.types.includes('route')
        );

        const city = cityComponent ? cityComponent.long_name : '';
        const state = stateComponent ? stateComponent.short_name : '';
        const street = streetComponent ? streetComponent.long_name : '';
        const route = routeComponent ? routeComponent.short_name : '';

        setCivicAddress(`${street} ${route} ${city}, ${state}`);
      }
    });
  }, [inputRef]);

  useEffect(() => {
    if (civicAddress) {
      inputRef.current.value = civicAddress;
    }
  }, [civicAddress]);

  return;
};

export default AutoCompletePlaces;

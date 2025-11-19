const headerGroupButtonsHandler = (
  dispatch,
  dispatchFC,
  openArr,
  swtName,
  name,
  id,
  location,
  specificLocation
) => {
  function updateHash(newParams) {
    // Save current scroll position
    const scrollPosition = window.scrollY;

    const currentHash = window.location.hash.replace("#", "");
    const params = new URLSearchParams(currentHash);

    Object.keys(newParams).forEach(key => {
      if (newParams[key]) {
        params.set(key, newParams[key]);
      } else {
        params.delete(key);  
      }
    });

    window.history.pushState({}, "", `#${params.toString()}`);

    // Restore scroll position after updating hash
    window.scrollTo(0, scrollPosition);
  }

  switch (name) {
    case "expand": {
      if (openArr[id]) {
        // Dispatch close action
        dispatch(
          dispatchFC({
            swtName,
            openSpecificLocationIdx: id,
            index: id,
            status: false,
          })
        );

        if (specificLocation) {
          // Update the hash only if specificLocation is provided
          updateHash({ specificLocation: "" });
          sessionStorage.removeItem("specificLocationId");
        } else {
          updateHash({ location: "" });
          sessionStorage.removeItem("locationId");
          updateHash({ specificLocation: "" });
          sessionStorage.removeItem("specificLocationId");
        }
      } else {
        // Close other locations and open the location
        openArr.forEach((_, index) =>
          index === id
            ? dispatch(
                dispatchFC({
                  swtName,
                  openSpecificLocationIdx: id,
                  index: id,
                  status: true,
                })
              )
            : dispatch(
                dispatchFC({
                  swtName,
                  openSpecificLocationIdx: index,
                  index,
                  status: false,
                })
              )
        );

        if (specificLocation) {
          // Update the hash with the specific location
          updateHash({ specificLocation });
          sessionStorage.setItem("specificLocationId", specificLocation);
        } else {
          updateHash({ location });
          sessionStorage.setItem("locationId", location);
        }
      }
      break;
    }
    case "weather": {
      break;
    }
    case "upload": {
      break;
    }
    case "view": {
      break;
    }
    default:
      break;
  }
};

export default headerGroupButtonsHandler;

// import styled from 'styled-components';

import { useEffect, useState } from 'react';

const ControlButton = ({ buttonData }) => {
  const { id, activeImg, inactiveImg, readyImg } = buttonData;

  const [buttonImage, setButtonImage] = useState(inactiveImg);
  const [buttonAltText, setButtonAltText] = useState(`inactive ${id}`);

  useEffect(() => {
    //  change some clicked buttons to active or ready when the others are switch to active or ready
  }, []);

  const clickButtonHandler = () => {
    if (inactiveImg === buttonImage) {
      switch (id) {
        case 'instant heat':
          setButtonImage(activeImg);
          setButtonAltText(`active ${id}`);
          break;
        case 'snow sensor and wind factor':
          setButtonImage(readyImg);
          setButtonAltText(`ready ${id}`);
          break;
        case 'heating schedule':
          setButtonImage(readyImg);
          setButtonAltText(`ready ${id}`);
          break;
        default:
          console.log('something went wrong with the selected control button');
          break;
      }
    } else {
      setButtonImage(inactiveImg);
      setButtonAltText(`inactive ${id}`);
    }
  };

  return (
    <>
      <img src={buttonImage} alt={buttonAltText} onClick={clickButtonHandler} />
    </>
  );
};

export default ControlButton;

// const Img = styled.img``;

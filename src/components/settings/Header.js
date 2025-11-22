import { memo } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  justifyContentSpaceAround,
  justifyContentSpaceEvenly,
  layerA180Deg,
  layerADark,
  layerADisabled180Deg,
  layerB,
  layerCDarkDisabled,
  layerCDisabled,
  layerDDark,
  layerDDisabled,
} from '../styles/commonStyles';
import ButtonCloseAndExpand from './buttons/ButtonCloseAndExpand';
import { useMediaQuery } from 'react-responsive';
import { useEffect } from 'react';

function Header({
  title,
  button,
  activatedButton,
  deactivatedButton,
  index,
  setOpenHeaders,
  openHeaders,
  isActive,
  isAdministrator,
  handleOpenPasswordBox,
}) {
  // media query
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  const splittedTitle = title.split(' ');

  const [toggleButtonsLogo, setToggleButtonsLogo] = useState(
    isActive ? button : deactivatedButton
  );

  useEffect(() => {
    if (isActive && !openHeaders[index]) {
      setToggleButtonsLogo(button);
    } else if (isActive && openHeaders[index]) {
      setToggleButtonsLogo(activatedButton);
    }
  }, [openHeaders[index]]);

  const handleOpenHeaders = useCallback(() => {
    const copyOpenHeaders = [...openHeaders];
   
    if (isAdministrator) {
      if (isActive) {
        if (openHeaders[index]) {
          copyOpenHeaders.fill(false);
        } else {
          copyOpenHeaders.fill(false);
          copyOpenHeaders[index] = true;
        }
      }
      setOpenHeaders(copyOpenHeaders);
    } else {
      handleOpenPasswordBox();
    }
  }, [openHeaders, isAdministrator, isActive]);

  return (
    <>
      {isMobile ? (
        <Wrapper isActive={isActive} isMobile={true}>
          <ButtonHole isActive={isActive} isMobile={true}>
            <Img
              src={toggleButtonsLogo}
              // src={toggleMobileButtonsLogo[index]}
              onClick={() => {
                handleOpenHeaders();
              }}
            />
          </ButtonHole>
          <ContainerTitle isActive={isActive} isMobile={true}>
            {splittedTitle.length < 3 ? (
              <Title>{`${splittedTitle[0]} ${splittedTitle[1]}`}</Title>
            ) : (
              <>
                <Title>{splittedTitle[0]}</Title>
                <Title>{`${splittedTitle[1]} ${splittedTitle[2]}`}</Title>
              </>
            )}
          </ContainerTitle>
        </Wrapper>
      ) : (
        <Wrapper isActive={isActive}>
          <ButtonHole isActive={isActive}>
            <Img
              src={toggleButtonsLogo}
              onClick={() => {
                handleOpenHeaders();
              }}
            />
            {/* <Img
              src={toggleButtonsLogo[index]}
              onClick={() => {
                handleOpenHeaders(index);
              }}
            /> */}
          </ButtonHole>
          <Line></Line>
          <ContainerTitle isActive={isActive}>
            <Title>{title}</Title>
          </ContainerTitle>
          <ContainerButton
            onClick={() => {
              handleOpenHeaders();
            }}
            isActive={isActive}
          >
            <ButtonCloseAndExpand
              name={openHeaders[index] ? 'close' : 'expand'}
              isActive={isActive}
            />
          </ContainerButton>
        </Wrapper>
      )}
    </>
  );
}

export default memo(Header);

const Wrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 290px;
          height: 46px;
          border-radius: 28px;
          ${justifyContentSpaceAround};
        `
      : css`
          width: 851px;
          height: 68px;
          border-radius: 36px;
          ${justifyContentSpaceEvenly};
        `}

  ${({ isActive }) =>
    isActive
      ? css`
          ${layerA180Deg}
        `
      : css`
          ${layerADisabled180Deg}
        `}
`;

const ButtonHole = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 40px;
          height: 40px;
        `
      : css`
          width: 60px;
          height: 60px;
          margin-left: 4px;
        `}

  border-radius: 50%;

  ${({ isActive }) =>
    isActive
      ? css`
          ${layerDDark}
        `
      : css`
          ${layerDDisabled}
        `}

  ${flexBoxCenter}
`;

const Img = styled.img`
  cursor: pointer;
`;

const Line = styled.span`
  content: '';
  flex: 1;
  border-bottom: solid 2px #ffff;
  margin: auto 0.25em;
`;

const ContainerTitle = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 236px;
          height: 38px;
          border-radius: 24px;
          flex-direction: column;
        `
      : css`
          width: 280px;
          height: 50px;
          margin-right: 4px;
          margin-left: 2px;
          border-radius: 25px;
        `}

  ${({ isActive }) =>
    isActive
      ? css`
          ${layerADark}
        `
      : css`
          ${layerCDarkDisabled}
        `}


  ${flexBoxCenter};
`;

const Title = styled.p`
  font-size: 12px;
  letter-spacing: 1.2px;
`;

const ContainerButton = styled.div`
  margin-right: 6px;
  width: 84px;
  height: 29px;

  ${({ isActive }) =>
    isActive
      ? css`
          ${layerB}
        `
      : css`
          ${layerCDisabled}
        `}

  border-radius: 19px;
  opacity: 1;
  ${flexBoxCenter};
`;

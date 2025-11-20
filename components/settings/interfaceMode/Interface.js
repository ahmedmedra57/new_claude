import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import Button from '../buttons/Button';
import { useState } from 'react';
import {
  flexBoxCenter,
  justifyContentFlexEnd,
  justifyContentSpaceAround,
  justifyContentSpaceEvenly,
  layerA,
  layerA90Deg,
  layerB,
} from '../../styles/commonStyles';
import { useMediaQuery } from 'react-responsive';

function Interface() {
  // media query
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });
  const { t } = useTranslation();

  const modesData = [t('settings.darkMode'), t('settings.lightMode')];
  // states
  const [interfaceModeButton, setInterfaceModeButton] = useState(0);
  // redux
    const interfaceMode = useSelector(selectInterfaceMode);
  const mode = interfaceMode;
  // functions
  const handleClick = (index) => {
    if (index !== interfaceModeButton) return setInterfaceModeButton(index);
  };

  const handleMode = () => {
    if (interfaceModeButton === 0) {
      return dispatch(setInterfaceMode(true);
    } else {
      return dispatch(setInterfaceMode(false);
    }
  };

  return (
    <>
      {isMobile ? (
        <BaseLayer>
          <Wrapper isMobile={true}>
            <InterfaceContainer>
              <InterfaceP>{t('settings.interfaceMode').toUpperCase()}</InterfaceP>
            </InterfaceContainer>
            <ControlContainer>
              {modesData.map((data, index) => {
                return (
                  <ContainerDarkLight key={index}>
                    <OutsideRingGreenCircle
                      onClick={() => {
                        handleClick(index);
                      }}
                    >
                      <InsideFilledGreenCircle
                        isColor={index === interfaceModeButton ? true : false}
                      ></InsideFilledGreenCircle>
                    </OutsideRingGreenCircle>

                    <IndividualContainer>
                      <ModeP>{data}</ModeP>
                    </IndividualContainer>
                  </ContainerDarkLight>
                );
              })}
            </ControlContainer>
            <ContainerButton onClick={() => handleMode()} isMobile={true}>
              <Button name={'apply'} />
            </ContainerButton>
          </Wrapper>
        </BaseLayer>
      ) : (
        <Wrapper>
          <InterfaceContainer>
            <InterfaceP>{t('settings.interfaceMode').toUpperCase()}</InterfaceP>
          </InterfaceContainer>
          <ControlContainer>
            {modesData.map((data, index) => {
              return (
                <ContainerDarkLight key={index}>
                  <OutsideRingGreenCircle
                    onClick={() => {
                      handleClick(index);
                    }}
                  >
                    <InsideFilledGreenCircle
                      isColor={index === interfaceModeButton ? true : false}
                    ></InsideFilledGreenCircle>
                  </OutsideRingGreenCircle>

                  <IndividualContainer>
                    <ModeP>{data}</ModeP>
                  </IndividualContainer>
                </ContainerDarkLight>
              );
            })}
          </ControlContainer>
          <ContainerButton onClick={() => handleMode()}>
            <Button name={'apply'} />
          </ContainerButton>
        </Wrapper>
      )}
    </>
  );
}

export default Interface;

const BaseLayer = styled.div`
  width: 313px;
  height: 186px;
  margin-bottom: 4px;
  border-radius: 16px;
  ${layerA}

  ${flexBoxCenter};
`;

const Wrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          border-radius: 14px;
        `
      : css`
          border-radius: 4px;
          margin-top: 4px;
        `}
  width: 309px;
  height: 182px;

  ${justifyContentSpaceEvenly}
  flex-direction: column;

  ${layerA90Deg};
  /* border: 0.5px solid black;
  background-image: -webkit-linear-gradient(
    180deg,
    ${(props) => (props.mode ? '#BBBBBB' : 'rgb(0, 0, 0) ')} 0%,
    ${(props) => (props.mode ? '#EBEBEB' : 'rgb(35, 58, 84)')} 100%
  );
  opacity: 1;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 14%);
  box-shadow: 0 0 2px rgba(0, 0, 0, 100%); */
`;

const InterfaceContainer = styled.div`
  width: 293px;
  height: 32px;

  ${layerA}

  border-radius: 16px;

  display: flex;
  align-items: center;
`;

const InterfaceP = styled.p`
  font-size: 14px;
  margin-left: 12px;

  letter-spacing: 1.2px;
`;

const ControlContainer = styled.div`
  width: 293px;
  height: 76px;

  ${layerA}

  border-radius: 19px;

  ${justifyContentSpaceEvenly}
  flex-direction: column;
`;

const ContainerDarkLight = styled.div`
  width: 100%;
  ${justifyContentSpaceAround}
  margin-left: -1px;
`;

const OutsideRingGreenCircle = styled.span`
  cursor: pointer;
  width: 24px;
  height: 24px;
  margin-left: 4px;
  margin-top: 2px;
  border: 1.5px solid #95ff45;
  border-radius: 50%;

  ${flexBoxCenter};
`;

const InsideFilledGreenCircle = styled.div`
  width: 16px;
  height: 16px;
  background-color: ${({ isColor }) => (isColor ? '#95ff45' : 'none')};
  border-radius: 50%;
`;

const IndividualContainer = styled.div`
  width: 246px;
  height: 32px;
  margin-left: 10px;
  border: 1.5px solid #142033;
  border-radius: 16px;
  opacity: 1;
  ${flexBoxCenter}
  justify-content: start;
`;

const ModeP = styled.p`
  font-size: 12px;
  margin-left: 10px;
  letter-spacing: 1.2px;
`;

const ContainerButton = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 100%;
          ${flexBoxCenter}
        `
      : css`
          width: 95%;
          ${justifyContentFlexEnd}
        `}
`;

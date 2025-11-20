import { useContext } from 'react';
import { useMobileSelectProgramStore } from '../zustand-stores';

import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerB,
  layerC,
} from '../styles/commonStyles';

import Ats from '../masterControlSwitches/Ats';
import HeatingSchedule from '../masterControlSwitches/HeatingSchedule';
import InstantHeat from '../masterControlSwitches/InstantHeat';
import OptionalConstant from '../masterControlSwitches/OptionalConstant';
import ShutOff from '../masterControlSwitches/ShutOff';
import SnowSensor from '../masterControlSwitches/SnowSensor';
import WindFactor from '../masterControlSwitches/WindFactor';
import InputTempMessage from '../userMessages/inputTempMessage';
import FanOnly from '../masterControlSwitches/FanOnly';

import { EssTgsTesContext } from '../context/contextOfEssTgsTes';

const MasterControlByLocation = ({
  location,
  specificLocation,
  swtName,
  buttonHandler,
  isMobile,
  disabled,
}) => {

  // useContext
  const {
    openMessageBox,
    setOpenMessageBox,
    message,
    programName,
    messageTitle,
  } = useContext(EssTgsTesContext);

  // redux
  const isSelected = useMobileSelectProgramStore();

  // const [isInstantHeatActivated, setIsInstantHeatActivated] = useState(false);
  // const [isSnowSensorActivated, setIsSnowSensorActivated] = useState(false);
  // const [isWindFactorActivated, setIsWindFactorActivated] = useState(false);
  // const [isOptionalConstantTempActivated, setIsOptionalConstantTempActivated] =
  //   useState(false);
  // const [isHeatingScheduleActivated, setIsHeatingScheduleActivated] =
  //   useState(false);

  
  const handleSwitchController = (program) => {
    if (program === 'unselect') {
      dispatch(handleUnselectAllProgram();
    } else {
      if (isSelected[program]) {
        dispatch(handleUnselectAllProgram();
      } else {
        dispatch(handleUnselectAllProgram();
        dispatch(handleSelectProgram(program);
      }
    }
  };

  return (
    <>
      {isMobile ? (
        <Wrapper isMobile={isMobile}>
          {isMobile && (
            <SectionMobileSwitches>
              <MobileSwitchesInner>
                <SectionLogo>
                  <Button
                    noButton={
                      !Object.values(isSelected).some(
                        (select) => select === true
                      )
                    }
                    onClick={() => handleSwitchController('unselect')}
                  >
                    <ButtonHole>
                      <ButtonTop>
                        <IconImg src='/images/mc-title.svg' isMc={true} />
                      </ButtonTop>
                    </ButtonHole>
                  </Button>
                </SectionLogo>

                <SectionController>
                  <SectionLogo>
                    <Button
                      isSelected={isSelected.instantHeat}
                      onClick={() => {
                        handleSwitchController('instantHeat');
                      }}
                    >
                      <ButtonHole>
                        <IconImg src='/images/logo-instantHeat.svg' />
                      </ButtonHole>
                    </Button>
                  </SectionLogo>

                  {swtName === 'tgs' && (
                    <SectionLogo>
                      <Button
                        isSelected={isSelected.fanOnly}
                        onClick={() => {
                          handleSwitchController('fanOnly');
                        }}
                      >
                        <ButtonHole>
                          <IconImg src='/images/tgs-fanOnly.svg' />
                        </ButtonHole>
                      </Button>
                    </SectionLogo>
                  )}

                  <SectionLogo>
                    <Button
                      isSelected={isSelected.snowSensor}
                      onClick={() => {
                        handleSwitchController('snowSensor');
                      }}
                    >
                      <ButtonHole>
                        <IconImg src='/images/logo-snowSensor.svg' />
                      </ButtonHole>
                    </Button>
                  </SectionLogo>

                  {swtName !== 'tgs' && (
                    <SectionLogo>
                      <Button
                        isSelected={isSelected.optionalConstantTemp}
                        onClick={() =>
                          handleSwitchController('optionalConstantTemp')
                        }
                      >
                        <ButtonHole>
                          <IconImg src='/images/logo-constantTemp.svg' />
                        </ButtonHole>
                      </Button>
                    </SectionLogo>
                  )}

                  <SectionLogo>
                    <Button
                      isSelected={isSelected.heatingSchedule}
                      onClick={() => handleSwitchController('heatingSchedule')}
                    >
                      <ButtonHole>
                        <IconImg src='/images/logo-schedule.svg' />
                      </ButtonHole>
                    </Button>
                  </SectionLogo>
                  <SectionLogo>
                    <Button
                      isSelected={isSelected.windFactor}
                      onClick={() => handleSwitchController('windFactor')}
                    >
                      <ButtonHole>
                        <IconImg src='/images/logo-windFactor.svg' />
                      </ButtonHole>
                    </Button>
                  </SectionLogo>
                </SectionController>
              </MobileSwitchesInner>
            </SectionMobileSwitches>
          )}
          {isSelected.instantHeat && (
            <InstantHeat
              scope={location}
              swtName={swtName}
              disabled={disabled}
              handleOnClick={buttonHandler}
              handleClose={() => handleSwitchController('unSelect')}
            />
          )}
          {swtName === 'tgs' && isSelected.fanOnly && (
            <FanOnly
              scope={location}
              swtName={swtName}
              handleOnClick={buttonHandler}
              disabled={disabled}
              handleClose={() => handleSwitchController('unSelect')}
            />
          )}
          {isSelected.snowSensor && (
            <SnowSensor
              scope={location}
              swtName={swtName}
              handleOnClick={buttonHandler}
              handleClose={() => handleSwitchController('unSelect')}
              disabled={disabled}
            />
          )}
          {swtName !== 'tgs' && isSelected.optionalConstantTemp && (
            <OptionalConstant
              scope={location}
              swtName={swtName}
              handleOnClick={buttonHandler}
              disabled={swtName === 'tgs' || disabled}
              handleClose={() => handleSwitchController('unSelect')}
            />
          )}
          {isSelected.heatingSchedule && (
            <HeatingSchedule
              scope={location}
              swtName={swtName}
              handleOnClick={buttonHandler}
              handleCloseSelect={() => handleSwitchController('unSelect')}
              disabled={disabled}
            />
          )}
          {isSelected.windFactor && (
            <WindFactor
              scope={location}
              swtName={swtName}
              handleOnClick={buttonHandler}
              handleClose={() => handleSwitchController('unSelect')}
              disabled={disabled}
            />
          )}

          <SubSectionWrapper isMobile={true}>
            <ComponentWrapper isSelected={isSelected.ats}>
              <SubButton onClick={() => handleSwitchController('ats')}>
                <SubButtonHole>
                  <SubButtonTop isAts={true}>
                    <ButtonName isGp={true}>gp</ButtonName>
                    <IconImg src='/images/logo-mobile-ats.svg' isAts={true} />
                    <ButtonName isEbp={true}>ebp</ButtonName>
                  </SubButtonTop>
                </SubButtonHole>
              </SubButton>
            </ComponentWrapper>

            <ComponentWrapper isSelected={isSelected.shutOff}>
              <SubButton onClick={() => handleSwitchController('shutOff')}>
                <SubButtonHole>
                  <SubButtonTop isAts={false}>
                    <ButtonName>m.c. off</ButtonName>
                  </SubButtonTop>
                </SubButtonHole>
              </SubButton>
            </ComponentWrapper>
          </SubSectionWrapper>

          {isSelected.ats && (
            <Ats
              disabled={swtName !== 'tgs' || disabled}
              scope={location}
              swtName={swtName}
              handleOnClick={buttonHandler}
              handleClose={() => handleSwitchController('unSelect')}
            />
          )}

          {isSelected.shutOff && (
            <ShutOff
              scope={location}
              swtName={swtName}
              handleOnClick={buttonHandler}
              handleClose={() => handleSwitchController('unSelect')}
              disabled={disabled}
            />
          )}
        </Wrapper>
      ) : (
        <Wrapper>
          <InstantHeat
            scope={location}
            swtName={swtName}
            handleOnClick={buttonHandler}
            disabled={disabled}
            specificLocation={specificLocation}
          />
          <SnowSensor
            scope={location}
            swtName={swtName}
            handleOnClick={buttonHandler}
            disabled={disabled}
            specificLocation={specificLocation}
          />
          <OptionalConstant
            scope={location}
            swtName={swtName}
            handleOnClick={buttonHandler}
            disabled={swtName === 'tgs' || disabled}
            specificLocation={specificLocation}
          />
          <HeatingSchedule
            scope={location}
            swtName={swtName}
            handleOnClick={buttonHandler}
            disabled={disabled}
            specificLocation={specificLocation}
          />

          <SubSectionWrapper>
            <WindFactor
              scope={location}
              swtName={swtName}
              handleOnClick={buttonHandler}
              disabled={disabled}
              specificLocation={specificLocation}
            />
            <Ats
              disabled={swtName !== 'tgs' || disabled}
              scope={location}
              swtName={swtName}
              handleOnClick={buttonHandler}
              specificLocation={specificLocation}
            />
          </SubSectionWrapper>

          <ShutOff
            scope={location}
            swtName={swtName}
            handleOnClick={buttonHandler}
            disabled={disabled}
            specificLocation={specificLocation}
          />

          {openMessageBox && (
            <MessageBoxWrapper>
              <InputTempMessage
                onClose={() => setOpenMessageBox(false)}
                title={messageTitle}
                subtitle={programName}
                messages={message}
              />
            </MessageBoxWrapper>
          )}
        </Wrapper>
      )}
    </>
  );
};

export default MasterControlByLocation;

const SectionMobileSwitches = styled.section`
  width: 303px;
  height: 60px;
  border-radius: 33px;
  ${layerA};
  ${flexBoxCenter};
  margin-top: 2px;
  margin-bottom: 4px;
`;

const MobileSwitchesInner = styled.div`
  width: 300px;
  height: 58px;
  border-radius: 31px;
  ${layerA180Deg};
  ${justifyContentSpaceBetween};
  padding: 0 6px;
`;

const SectionLogo = styled.section`
  width: 44px;
  height: 44px;
  ${layerC}
  border-radius: 50%;
  ${flexBoxCenter}
`;
const Button = styled.button`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  ${layerA180Deg};
  ${flexBoxCenter};
  ${(p) =>
    p.noButton &&
    css`
      cursor: default;
    `}

  ${(p) =>
    p.isSelected &&
    css`
      border: 1px solid #95ff45;
    `}
`;
const ButtonHole = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  ${layerA};
  ${flexBoxCenter};
`;

const ButtonTop = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  ${layerA180Deg};
  ${flexBoxCenter};
`;

const IconImg = styled.img`
  ${(p) =>
    p.isMc ||
    css`
      height: 100%;
    `}
  ${(p) =>
    p.isAts &&
    css`
      height: 80%;
    `}
`;

const SectionController = styled.section`
  width: 238px;
  height: 48px;
  border-radius: 26px;
  ${layerA};
  ${justifyContentSpaceBetween};
  padding: 0 2px;
`;

const ComponentWrapper = styled.div`
  width: 147px;
  height: 36px;
  border-radius: 18px;
  ${layerB};
  ${flexBoxCenter};
  ${(p) =>
    p.isSelected &&
    css`
      border: 1px solid #95ff45;
    `}
`;
const SubButton = styled.button`
  width: 145px;
  height: 34px;
  border-radius: 25px;
  ${layerA180Deg};
  ${flexBoxCenter}
`;

const SubButtonHole = styled.div`
  width: 137px;
  height: 26px;
  border-radius: 18px;
  ${layerA};
  ${flexBoxCenter};
`;
const SubButtonTop = styled.div`
  width: 135px;
  height: 24px;
  border-radius: 25px;
  ${layerA180Deg};
  ${(p) =>
    p.isAts
      ? css`
          ${justifyContentSpaceBetween}
          padding: 0 6px;
        `
      : css`
          ${flexBoxCenter}
        `}
`;
const ButtonName = styled.span`
  font-size: 14px;
  letter-spacing: 1.4px;

  ${(p) =>
    p.isGp &&
    css`
      color: #95ff45;
    `};

  ${(p) =>
    p.isEbp &&
    css`
      color: #ff7800;
    `};
`;

// ---for desktop
const Wrapper = styled.div`
  ${(p) =>
    p.isMobile
      ? css`
          ${flexDirectionColumn}
        `
      : css`
          width: 1194px;
          height: 204px;
          border-radius: 9px;

          ${layerA};
          ${justifyContentSpaceBetween};
          padding: 0 2.5rem;
          position: relative;
        `}
`;

const SubSectionWrapper = styled.div`
  ${(p) =>
    p.isMobile
      ? css`
          width: 303px;
          height: 41px;
          border-radius: 24px;
          ${layerA};
          ${justifyContentSpaceBetween};
          padding: 0 2px;
        `
      : css`
          width: 208px;
          height: 200px;
          ${flexDirectionColumn};
        `};
`;

const MessageBoxWrapper = styled.div`
  width: 1200px;
  height: 220px;

  ${flexBoxCenter}

  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
`;

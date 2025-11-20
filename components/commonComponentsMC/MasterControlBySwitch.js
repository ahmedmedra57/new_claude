import { useState, useEffect, useContext } from 'react';
import { useMCIsExpandedStore, useUserStore } from '../zustand-stores';
import { useMediaQuery } from 'react-responsive';


import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerADark,
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
import MasterControlBySwitchTitle from './MasterControlBySwitchTitle';

const MasterControlBySwitch = ({ swtName, buttonHandler }) => {
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  // useContext
  const { openMessageBox, setOpenMessageBox, message, programName } =
    useContext(EssTgsTesContext);

  const { permissions } = useUserStore();
  const disabled = !permissions.WRITE;

  // Global states
  const MCIsExpanded = useMCIsExpandedStore();
  // const { ess, tgs, tes } = MCIsExpanded;
  const { masterControl } = MCIsExpanded[swtName];

  // local states and variables
  const [btnName, setBtnName] = useState(masterControl ? 'close' : 'expand');
  
  useEffect(() => {
    dispatch(handleResetSelectedOne();
  }, [swtName]);

  useEffect(() => {
    setBtnName(masterControl ? 'close' : 'expand');
  }, [masterControl]);

  return (
    <>
      {isMobile ? (
        <MobileWrapper isExpanded={masterControl}>
          <MobileInnerHole isExpanded={masterControl}>
            <MobileInnerWrapper isExpanded={masterControl}>
              <HeaderWrapper isExpanded={masterControl}>
                <HeaderTop>
                  <Title isMobile={isMobile}>master control - {swtName}</Title>
                  <ButtonWrapper
                    isMobile={isMobile}
                    onClick={() =>
                      dispatch(
                        handleOpenMasterControl({
                          swtName,
                          status: !masterControl,
                        })
                      )
                    }
                  >
                    <ButtonHole isMobile={isMobile}>
                      <ButtonTop isMobile={isMobile}>{btnName}</ButtonTop>
                    </ButtonHole>
                  </ButtonWrapper>
                </HeaderTop>
              </HeaderWrapper>

              {masterControl && (
                <>
                  <InstantHeat
                    scope='switch'
                    swtName={swtName}
                    handleOnClick={buttonHandler}
                    disabled={disabled}
                  />
                  {swtName === 'tgs' && (
                    <FanOnly
                      swtName={swtName}
                      scope='switch'
                      handleOnClick={buttonHandler}
                      disabled={disabled}
                    />
                  )}
                  <SnowSensor
                    swtName={swtName}
                    scope='switch'
                    handleOnClick={buttonHandler}
                    disabled={disabled}
                  />
                  <OptionalConstant
                    swtName={swtName}
                    scope='switch'
                    handleOnClick={buttonHandler}
                    disabled={swtName === 'tgs' || disabled}
                  />
                  <HeatingSchedule
                    swtName={swtName}
                    scope='switch'
                    handleOnClick={buttonHandler}
                    disabled={disabled}
                    // heatingScheduleList={heatingScheduleList}
                  />

                  <WindFactor
                    swtName={swtName}
                    scope='switch'
                    handleOnClick={buttonHandler}
                    disabled={disabled}
                  />
                  <Ats
                    swtName={swtName}
                    disabled={swtName !== 'tgs' || disabled}
                    scope='switch'
                    handleOnClick={buttonHandler}
                  />

                  <ShutOff
                    swtName={swtName}
                    scope='switch'
                    handleOnClick={buttonHandler}
                    disabled={disabled}
                  />
                </>
              )}
            </MobileInnerWrapper>
          </MobileInnerHole>
          {openMessageBox && (
            <MessageBoxWrapper>
              <InputTempMessage
                onClose={() => setOpenMessageBox(false)}
                title={'master control'}
                subtitle={programName}
                messages={message}
              />
            </MessageBoxWrapper>
          )}
        </MobileWrapper>
      ) : (
        <Wrapper isExpanded={masterControl}>
          <InnerWrapper isExpanded={masterControl}>
            {/* <TitleWrapper isExpanded={masterControl}>
              <Title isExpanded={masterControl}>
                master control - {swtName}
              </Title>
              <ButtonWrapper
                isExpanded={masterControl}
                onClick={() =>
                  dispatch(
                    handleOpenMasterControl({ swtName, status: !masterControl })
                  )
                }
              >
                <ButtonHole isExpanded={masterControl}>
                  <ButtonTop isExpanded={masterControl}>{btnName}</ButtonTop>
                </ButtonHole>
              </ButtonWrapper>
            </TitleWrapper> */}
            <MasterControlBySwitchTitle
              isExpand={masterControl}
              expandFC={handleOpenMasterControl}
              swtName={swtName}
            />

            {masterControl && (
              <SectionMainContents>
                <InstantHeat
                  scope='switch'
                  swtName={swtName}
                  handleOnClick={buttonHandler}
                  disabled={disabled}
                />
                <SnowSensor
                  swtName={swtName}
                  scope='switch'
                  handleOnClick={buttonHandler}
                  disabled={disabled}
                />
                <OptionalConstant
                  swtName={swtName}
                  scope='switch'
                  handleOnClick={buttonHandler}
                  disabled={swtName === 'tgs' || disabled}
                />
                <HeatingSchedule
                  swtName={swtName}
                  scope='switch'
                  handleOnClick={buttonHandler}
                  disabled={disabled}
                  // heatingScheduleList={heatingScheduleList}
                />

                <SubSectionWrapper>
                  <WindFactor
                    swtName={swtName}
                    scope='switch'
                    handleOnClick={buttonHandler}
                    disabled={disabled}
                  />
                  <Ats
                    swtName={swtName}
                    disabled={swtName !== 'tgs' || disabled}
                    scope='switch'
                    handleOnClick={buttonHandler}
                  />
                </SubSectionWrapper>

                <ShutOff
                  swtName={swtName}
                  scope='switch'
                  handleOnClick={buttonHandler}
                  disabled={disabled}
                />
              </SectionMainContents>
            )}
          </InnerWrapper>

          {openMessageBox && (
            <MessageBoxWrapper>
              <InputTempMessage
                onClose={() => setOpenMessageBox(false)}
                title={'master control'}
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

export default MasterControlBySwitch;

const MobileWrapper = styled.section`
  width: 332px;
  height: 78px;
  border-radius: 37px;
  ${layerADark};
  ${flexBoxCenter}

  ${(p) =>
    p.isExpanded &&
    css`
      height: auto;
      border-radius: 37px 37px 41px 41px;
      padding: 2px 0;
    `}
`;
const MobileInnerHole = styled.div`
  width: 328px;
  height: 74px;
  border-radius: 37px;
  ${layerA180Deg}
  ${flexBoxCenter}
  ${(p) =>
    p.isExpanded &&
    css`
      height: auto;
      padding: 5px 0;
      border-radius: 37px 37px 41px 41px;
    `}
`;
const MobileInnerWrapper = styled.div`
  width: 318px;
  height: 64px;
  border-radius: 32px;
  ${layerA};
  ${flexBoxCenter};

  ${(p) =>
    p.isExpanded &&
    css`
      height: auto;
      border-radius: 32px 32px 38px 38px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      padding: 2px 0;
    `}
`;
const HeaderWrapper = styled.div`
  width: 314px;
  height: 60px;
  border-radius: 30px;
  ${layerA180Deg};
  ${flexBoxCenter};

  ${(p) =>
    p.isExpanded &&
    css`
      margin-bottom: 8px;
    `}
`;

const HeaderTop = styled.div`
  width: 299px;
  height: 44px;
  border-radius: 33px;

  ${layerADark};
  ${justifyContentSpaceBetween};
  padding: 0 2px 0 6px;
`;

// ---- for desktop
const Wrapper = styled.div`
  width: 1216px;
  height: auto;
  border-radius: 18px;

  ${layerB}
  box-shadow: inset 0px 0px 3px #000000;
  ${flexBoxCenter}
  padding: 2rem;

  position: relative;

  ${(p) =>
    p.isExpanded ||
    css`
      border-radius: 24px;
    `}
`;
const InnerWrapper = styled.div`
  width: 1212px;
  height: auto;
  border-radius: 16px;

  ${layerA180Deg};
  ${flexDirectionColumn}
  padding: 5rem;

  ${(p) =>
    p.isExpanded ||
    css`
      border-radius: 21px;
    `}
`;

const TitleWrapper = styled.div`
  width: 1201rem;
  border-radius: 33px;

  ${justifyContentSpaceBetween}
  ${layerADark}
  padding-left: 14rem;

  ${(p) =>
    p.isExpanded &&
    css`
      margin-bottom: 4px;
    `}
`;

const Title = styled.div`
  font-size: 14rem;
  letter-spacing: 1.4px;
  width: 1082rem;
  border-bottom: 1px solid #fff;

  ${(p) =>
    p.isExpanded ||
    css`
      width: 969rem;
    `}

  ${(p) =>
    p.isMobile &&
    css`
      font-size: 12px;
      letter-spacing: 1.2px;

      width: auto;
    `}
`;

const SubSectionWrapper = styled.div`
  width: 208px;
  height: 200px;

  ${flexDirectionColumn}
`;

const ButtonWrapper = styled.button`
  width: 87px;
  height: 30px;
  border-radius: 25px;

  ${layerA180Deg}
  ${flexBoxCenter};
  ${(p) =>
    p.isExpanded ||
    css`
      width: 206px;
      height: 28px;
    `};

  ${(p) =>
    p.isMobile &&
    css`
      width: 89px;
      height: 40px;
    `}
`;

const ButtonHole = styled.div`
  width: 77px;
  height: 20px;
  border-radius: 18px;

  ${layerB};
  ${flexBoxCenter};

  ${(p) =>
    p.isExpanded ||
    css`
      width: 196px;
      height: 18px;
    `};

  ${(p) =>
    p.isMobile &&
    css`
      width: 79px;
      height: 30px;
    `}
`;
const ButtonTop = styled.div`
  width: 75px;
  height: 18px;
  border-radius: 25px;
  ${layerA180Deg};

  ${(p) =>
    p.isExpanded ||
    css`
      width: 194px;
      height: 16px;
    `}

  font-size: 12px;
  letter-spacing: 1.2px;

  ${flexBoxCenter}

  ${(p) =>
    p.isMobile &&
    css`
      width: 77px;
      height: 28px;
    `}
`;

const SectionMainContents = styled.section`
  width: 1201px;
  height: 204px;
  border-radius: 9px;

  ${layerA}
  ${justifyContentSpaceBetween}
  padding: 0 2.5rem;

  ${(p) =>
    p.isMobile &&
    css`
      ${flexDirectionColumn}
      padding: 0;
      width: auto;
      height: auto;
    `}
`;

const MessageBoxWrapper = styled.div`
  width: 1216px;
  height: 300px;

  ${flexBoxCenter}

  position: absolute;
  top: 0;
  z-index: 100;
`;

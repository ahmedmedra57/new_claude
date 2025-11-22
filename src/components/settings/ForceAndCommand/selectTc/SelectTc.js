import styled, { css } from 'styled-components';
import OutsideTemperature from './OutsideTemperature';
import { useState } from 'react';
import {
  flexBoxCenter,
  justifyContentFlexEnd,
  justifyContentFlexStart,
  justifyContentSpaceAround,
  layerA,
  layerA180Deg,
  layerB,
  layerCLighter,
} from '../../../styles/commonStyles';
import ShareComponentForSelectTC from './ShareComponentForSelectTC';
import { useMediaQuery } from 'react-responsive';
import EditCancelApplyButtons from '../../buttons/EditCancelApplyButtons';

function SelectTc({
  handleOpenSelectLocations,
  displaySelectBox,
  ess,
  tgs,
  tes,
  sys,
  handleSelectIndividualMachine,
  handleUnSelectIndividualMachine,
  activeSelect,
  setActiveSelect,
  tCNumber,
  setTCNumber,
  isSave,
  setIsSave,
  sysIndex,
  handleThreeButtonsClick,
}) {
  // media query
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  const IndividualComponentInfo = [
    {
      id: 'burning chamber',
      title: 'burning chamber current temperature',
      systemAbbr: 'burningChamber',
      position: 1,
    },
    {
      id: 'enclose temperature',
      title: 'enclosure temperature',
      systemAbbr: 'encloseTemp',
      position: 2,
    },
    {
      id: 'ess heater temperature',
      title: 'current ess heater temperature',
      systemAbbr: 'currEss',
      position: 3,
    },
    {
      id: 'tgs heater temperature',
      title: 'current tgs heater temperature',
      systemAbbr: 'currTgs',
      position: 4,
    },
    {
      id: 'tes heater temperature',
      title: 'current tes heater temperature',
      systemAbbr: 'currTes',
      position: 5,
    },
  ];

  const [isTCOpen, setIsTCOpen] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const handleClick = (system, buttonIndex, tCNum) => {
    const copyIsSave = { ...isSave };
    const copyTCNumber = [...tCNumber];
    const copyIsTCOpen = [...isTCOpen];

    switch (system) {
      case 'outsideTemp':
        if (buttonIndex === 0) {
          copyTCNumber[0] = 1;
          copyIsSave.outsideTemp = false;
        } else {
          copyTCNumber[0] = tCNum;
          copyIsSave.outsideTemp = true;
          copyIsTCOpen[0] = false;
        }
        break;
      case 'burningChamber':
        if (buttonIndex === 0) {
          copyTCNumber[1] = 1;
          copyIsSave.burningChamber = false;
        } else {
          copyTCNumber[1] = tCNum;
          copyIsSave.burningChamber = true;
          copyIsTCOpen[1] = false;
        }
        break;
      case 'encloseTemp':
        if (buttonIndex === 0) {
          copyTCNumber[2] = 1;
          copyIsSave.encloseTemp = false;
        } else {
          copyTCNumber[2] = tCNum;
          copyIsSave.encloseTemp = true;
          copyIsTCOpen[2] = false;
        }
        break;
      case 'currEss':
        if (buttonIndex === 0) {
          copyTCNumber[3] = 1;
          copyIsSave.currEss = false;
        } else {
          copyTCNumber[3] = tCNum;
          copyIsSave.currEss = true;
          copyIsTCOpen[3] = false;
        }
        break;
      case 'currTgs':
        if (buttonIndex === 0) {
          copyTCNumber[4] = 1;
          copyIsSave.currTgs = false;
        } else {
          copyTCNumber[4] = tCNum;
          copyIsSave.currTgs = true;
          copyIsTCOpen[4] = false;
        }
        break;
      case 'currTes':
        if (buttonIndex === 0) {
          copyTCNumber[5] = 1;
          copyIsSave.currTes = false;
        } else {
          copyTCNumber[5] = tCNum;
          copyIsSave.currTes = true;
          copyIsTCOpen[5] = false;
        }
        break;
      default:
        break;
    }
    setIsSave(copyIsSave);
    setTCNumber(copyTCNumber);
    setIsTCOpen(copyIsTCOpen);
  };
  // const handleClick = (system, buttonIndex, tCNum) => {
  //   const copyIsSave = { ...isSave };
  //   const copyTCNumber = [...tCNumber];
  //   const copyIsTCOpen = [...isTCOpen];

  //   switch (system) {
  //     case 'outsideTemp':
  //       if (buttonIndex === 0) {
  //         copyTCNumber[0] = 1;
  //         setTCNumber(copyTCNumber);
  //         copyIsSave.outsideTemp = false;
  //         setIsSave(copyIsSave);
  //       } else {
  //         copyTCNumber[0] = tCNum;
  //         setTCNumber(copyTCNumber);
  //         copyIsSave.outsideTemp = true;
  //         setIsSave(copyIsSave);
  //         copyIsTCOpen[0] = false;
  //         setIsTCOpen(copyIsTCOpen);
  //       }
  //       break;
  //     case 'burningChamber':
  //       if (buttonIndex === 0) {
  //         copyTCNumber[1] = 1;
  //         setTCNumber(copyTCNumber);
  //         copyIsSave.burningChamber = false;
  //         setIsSave(copyIsSave);
  //       } else {
  //         copyTCNumber[1] = tCNum;
  //         setTCNumber(copyTCNumber);
  //         copyIsSave.burningChamber = true;
  //         setIsSave(copyIsSave);
  //         copyIsTCOpen[1] = false;
  //         setIsTCOpen(copyIsTCOpen);
  //       }
  //       break;
  //     case 'encloseTemp':
  //       if (buttonIndex === 0) {
  //         copyTCNumber[2] = 1;
  //         setTCNumber(copyTCNumber);
  //         copyIsSave.encloseTemp = false;
  //         setIsSave(copyIsSave);
  //       } else {
  //         copyTCNumber[2] = tCNum;
  //         setTCNumber(copyTCNumber);
  //         copyIsSave.encloseTemp = true;
  //         setIsSave(copyIsSave);
  //         copyIsTCOpen[2] = false;
  //         setIsTCOpen(copyIsTCOpen);
  //       }
  //       break;
  //     case 'currEss':
  //       if (buttonIndex === 0) {
  //         copyTCNumber[3] = 1;
  //         setTCNumber(copyTCNumber);
  //         copyIsSave.currEss = false;
  //         setIsSave(copyIsSave);
  //       } else {
  //         copyTCNumber[3] = tCNum;
  //         setTCNumber(copyTCNumber);
  //         copyIsSave.currEss = true;
  //         setIsSave(copyIsSave);
  //         copyIsTCOpen[3] = false;
  //         setIsTCOpen(copyIsTCOpen);
  //       }
  //       break;
  //     case 'currTgs':
  //       if (buttonIndex === 0) {
  //         copyTCNumber[4] = 1;
  //         setTCNumber(copyTCNumber);
  //         copyIsSave.currTgs = false;
  //         setIsSave(copyIsSave);
  //       } else {
  //         copyTCNumber[4] = tCNum;
  //         setTCNumber(copyTCNumber);
  //         copyIsSave.currTgs = true;
  //         setIsSave(copyIsSave);
  //         copyIsTCOpen[4] = false;
  //         setIsTCOpen(copyIsTCOpen);
  //       }
  //       break;
  //     case 'currTes':
  //       if (buttonIndex === 0) {
  //         copyTCNumber[5] = 1;
  //         setTCNumber(copyTCNumber);
  //         copyIsSave.currTes = false;
  //         setIsSave(copyIsSave);
  //       } else {
  //         copyTCNumber[5] = tCNum;
  //         setTCNumber(copyTCNumber);
  //         copyIsSave.currTes = true;
  //         setIsSave(copyIsSave);
  //         copyIsTCOpen[5] = false;
  //         setIsTCOpen(copyIsTCOpen);
  //       }
  //       break;
  //     default:
  //       break;
  //   }
  //   setIsSave();
  // };

  return (
    <>
      {isMobile ? (
        <BaseLayer isMobile={true}>
          <BaseLayer2>
            <WrapperTelemetry isMobile={true}>
              <TitleWrapper isMobile={true}>
                <P isMobile={true}>select t/c telemetry</P>
              </TitleWrapper>
              <Wrapper isMobile={true}>
                {/* outside temperature */}
                <IndividualWrapper>
                  <OutsideTemperature
                    handleOpenSelectLocations={handleOpenSelectLocations}
                    displaySelectBox={displaySelectBox}
                    ess={ess}
                    tgs={tgs}
                    tes={tes}
                    sys={sys}
                    // handleSelectIndividualMachine={
                    //   handleSelectIndividualMachine
                    // }
                    // handleUnSelectIndividualMachine={
                    //   handleUnSelectIndividualMachine
                    // }
                    activeSelect={activeSelect}
                    setActiveSelect={setActiveSelect}
                    handleClick={handleClick}
                    isTCOpen={isTCOpen}
                    setIsTCOpen={setIsTCOpen}
                  />
                </IndividualWrapper>
                {/* burning chamber, enclose temperature, ess, tgs and tes heater temperature */}
                {IndividualComponentInfo.map(
                  ({ id, title, systemAbbr, position }) => {
                    return (
                      <IndividualWrapper key={id}>
                        <ShareComponentForSelectTC
                          title={title}
                          handleOpenSelectLocations={handleOpenSelectLocations}
                          displaySelectBox={displaySelectBox}
                          ess={ess}
                          tgs={tgs}
                          tes={tes}
                          sys={sys}
                          // handleSelectIndividualMachine={
                          //   handleSelectIndividualMachine
                          // }
                          // handleUnSelectIndividualMachine={
                          //   handleUnSelectIndividualMachine
                          // }
                          sysIndex={systemAbbr}
                          sysOptions={'forceAndCommands'}
                          swt={'sys'}
                          handleClick={handleClick}
                          position={position}
                          isTCOpen={isTCOpen}
                          setIsTCOpen={setIsTCOpen}
                        />
                      </IndividualWrapper>
                    );
                  }
                )}
              </Wrapper>
            </WrapperTelemetry>
          </BaseLayer2>
          <ButtonsWrapper>
            <EditCancelApplyButtons
              handleClick={handleThreeButtonsClick}
              sysIndex={sysIndex}
            />
          </ButtonsWrapper>
        </BaseLayer>
      ) : (
        <BaseLayer>
          <WrapperTelemetry>
            <TitleWrapper>
              <P>select t/c telemetry</P>
            </TitleWrapper>
            <Wrapper>
              <OutsideTemperature
                handleOpenSelectLocations={handleOpenSelectLocations}
                displaySelectBox={displaySelectBox}
                ess={ess}
                tgs={tgs}
                tes={tes}
                sys={sys}
                // handleSelectIndividualMachine={handleSelectIndividualMachine}
                // handleUnSelectIndividualMachine={
                //   handleUnSelectIndividualMachine
                // }
                activeSelect={activeSelect}
                setActiveSelect={setActiveSelect}
                handleClick={handleClick}
                isTCOpen={isTCOpen}
                setIsTCOpen={setIsTCOpen}
              />
              {/* burning chamber, enclose temperature, ess, tgs and tes heater temperature */}
              {IndividualComponentInfo.map(
                ({ id, title, systemAbbr, position }) => {
                  return (
                    <IndividualWrapper key={id}>
                      <ShareComponentForSelectTC
                        title={title}
                        handleOpenSelectLocations={handleOpenSelectLocations}
                        displaySelectBox={displaySelectBox}
                        ess={ess}
                        tgs={tgs}
                        tes={tes}
                        sys={sys}
                        // handleSelectIndividualMachine={
                        //   handleSelectIndividualMachine
                        // }
                        // handleUnSelectIndividualMachine={
                        //   handleUnSelectIndividualMachine
                        // }
                        sysIndex={systemAbbr}
                        sysOptions={'forceAndCommands'}
                        swt={'sys'}
                        handleClick={handleClick}
                        position={position}
                        isTCOpen={isTCOpen}
                        setIsTCOpen={setIsTCOpen}
                      />
                    </IndividualWrapper>
                  );
                }
              )}
            </Wrapper>
          </WrapperTelemetry>
        </BaseLayer>
      )}
    </>
  );
}

export default SelectTc;

const BaseLayer = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 288px;
          height: 932px;
          margin-top: 4px;
          border-radius: 13px 13px 29px 29px;
          flex-direction: column;
          ${layerA180Deg}
        `
      : css`
          width: 558px;
          height: 484px;
          margin-top: 2px;
          margin-left: 2px;
          border-radius: 9px;
          ${layerB}
        `}

  ${flexBoxCenter}
`;

const BaseLayer2 = styled.div`
  width: 282px;
  height: 882px;

  ${layerCLighter}
  /* border-radius: 9px 9px 11px 11px; */
  border-radius: 11px;

  ${flexBoxCenter};
`;

const WrapperTelemetry = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 278px;
          height: 879px;
          border-radius: 9px;
          ${justifyContentFlexStart}
        `
      : css`
          width: 556px;
          height: 482px;
          border-radius: 8px;
          ${justifyContentSpaceAround}
        `}

  ${layerA180Deg}

  flex-direction: column;
`;

const TitleWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 270px;
          height: 32px;
          margin-top: 4px;
          margin-bottom: 6px;
        `
      : css`
          width: 548px;
          height: 32px;
        `}

  ${layerA}

  border-radius: 16px;

  ${flexBoxCenter}
`;

const P = styled.p`
  ${({ isMobile }) =>
    isMobile
      ? css`
          font-size: 11rem;
          letter-spacing: 1.1px;
        `
      : css`
          font-size: 12rem;
          letter-spacing: 1.2px;
        `}
`;

const Wrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 100%;
          height: 95%;
          gap: 10rem;
        `
      : css`
          width: 546px;
          height: 90.5%;

          flex-wrap: wrap;
          gap: 2rem;
        `}

  ${justifyContentFlexStart};
  flex-direction: column;
`;

const IndividualWrapper = styled.div``;

const ButtonsWrapper = styled.div`
  width: 100%;
  ${flexBoxCenter}
  margin-top: 8px;
`;

// ===================

//  {/* burning chamber */}
//  <IndividualWrapper>
//  <ShareComponentForSelectTC
//    title={'burning chamber current temperature'}
//    handleOpenSelectLocations={handleOpenSelectLocations}
//    displaySelectBox={displaySelectBox}
//    ess={ess}
//    tgs={tgs}
//    tes={tes}
//    sys={sys}
//    handleSelectIndividualMachine={handleSelectIndividualMachine}
//    handleUnSelectIndividualMachine={
//      handleUnSelectIndividualMachine
//    }
//    sysIndex={'burningChamber'}
//    sysOptions={'forceAndCommands'}
//    swt={'sys'}
//    handleClick={handleClick}
//    position={1}
//    isTCOpen={isTCOpen}
//    setIsTCOpen={setIsTCOpen}
//  />
// </IndividualWrapper>
// {/* enclosure temperature */}
// <IndividualWrapper>
//  <ShareComponentForSelectTC
//    title={'enclosure temperature'}
//    handleOpenSelectLocations={handleOpenSelectLocations}
//    displaySelectBox={displaySelectBox}
//    ess={ess}
//    tgs={tgs}
//    tes={tes}
//    sys={sys}
//    handleSelectIndividualMachine={handleSelectIndividualMachine}
//    handleUnSelectIndividualMachine={
//      handleUnSelectIndividualMachine
//    }
//    sysIndex={'encloseTemp'}
//    sysOptions={'forceAndCommands'}
//    swt={'sys'}
//    handleClick={handleClick}
//    position={2}
//    isTCOpen={isTCOpen}
//    setIsTCOpen={setIsTCOpen}
//  />
// </IndividualWrapper>
// {/* current Ess */}
// <IndividualWrapper>
//  <ShareComponentForSelectTC
//    title={'current ess heater temperature'}
//    handleOpenSelectLocations={handleOpenSelectLocations}
//    displaySelectBox={displaySelectBox}
//    ess={ess}
//    tgs={tgs}
//    tes={tes}
//    sys={sys}
//    handleSelectIndividualMachine={handleSelectIndividualMachine}
//    handleUnSelectIndividualMachine={
//      handleUnSelectIndividualMachine
//    }
//    sysIndex={'currEss'}
//    sysOptions={'forceAndCommands'}
//    swt={'sys'}
//    handleClick={handleClick}
//    position={3}
//    isTCOpen={isTCOpen}
//    setIsTCOpen={setIsTCOpen}
//  />
// </IndividualWrapper>
// {/* current Tgs */}
// <IndividualWrapper>
//  <ShareComponentForSelectTC
//    title={'current tgs heater temperature'}
//    handleOpenSelectLocations={handleOpenSelectLocations}
//    displaySelectBox={displaySelectBox}
//    ess={ess}
//    tgs={tgs}
//    tes={tes}
//    sys={sys}
//    handleSelectIndividualMachine={handleSelectIndividualMachine}
//    handleUnSelectIndividualMachine={
//      handleUnSelectIndividualMachine
//    }
//    sysIndex={'currTgs'}
//    sysOptions={'forceAndCommands'}
//    swt={'sys'}
//    handleClick={handleClick}
//    position={4}
//    isTCOpen={isTCOpen}
//    setIsTCOpen={setIsTCOpen}
//  />
// </IndividualWrapper>
// {/* current Tes */}
// <IndividualWrapper>
//  <ShareComponentForSelectTC
//    title={'current tes heater temperature'}
//    handleOpenSelectLocations={handleOpenSelectLocations}
//    displaySelectBox={displaySelectBox}
//    ess={ess}
//    tgs={tgs}
//    tes={tes}
//    sys={sys}
//    handleSelectIndividualMachine={handleSelectIndividualMachine}
//    handleUnSelectIndividualMachine={
//      handleUnSelectIndividualMachine
//    }
//    sysIndex={'currTes'}
//    sysOptions={'forceAndCommands'}
//    swt={'sys'}
//    handleClick={handleClick}
//    position={5}
//    isTCOpen={isTCOpen}
//    setIsTCOpen={setIsTCOpen}
//  />
// </IndividualWrapper>

// =================================================================

//  {/* burning chamber */}
//  <IndividualWrapper>
//  <ShareComponentForSelectTC
//    title={'burning chamber current temperature'}
//    handleOpenSelectLocations={handleOpenSelectLocations}
//    displaySelectBox={displaySelectBox}
//    ess={ess}
//    tgs={tgs}
//    tes={tes}
//    sys={sys}
//    // handleSelectIndividualMachine={
//    //   handleSelectIndividualMachine
//    // }
//    // handleUnSelectIndividualMachine={
//    //   handleUnSelectIndividualMachine
//    // }
//    sysIndex={'burningChamber'}
//    sysOptions={'forceAndCommands'}
//    swt={'sys'}
//    handleClick={handleClick}
//    position={1}
//    isTCOpen={isTCOpen}
//    setIsTCOpen={setIsTCOpen}
//  />
// </IndividualWrapper>
// {/* enclosure temperature */}
// <IndividualWrapper>
//  <ShareComponentForSelectTC
//    title={'enclosure temperature'}
//    handleOpenSelectLocations={handleOpenSelectLocations}
//    displaySelectBox={displaySelectBox}
//    ess={ess}
//    tgs={tgs}
//    tes={tes}
//    sys={sys}
//    handleSelectIndividualMachine={
//      handleSelectIndividualMachine
//    }
//    handleUnSelectIndividualMachine={
//      handleUnSelectIndividualMachine
//    }
//    sysIndex={'encloseTemp'}
//    sysOptions={'forceAndCommands'}
//    swt={'sys'}
//    handleClick={handleClick}
//    position={2}
//    isTCOpen={isTCOpen}
//    setIsTCOpen={setIsTCOpen}
//  />
// </IndividualWrapper>
// {/* current Ess */}
// <IndividualWrapper>
//  <ShareComponentForSelectTC
//    title={'current ess heater temperature'}
//    handleOpenSelectLocations={handleOpenSelectLocations}
//    displaySelectBox={displaySelectBox}
//    ess={ess}
//    tgs={tgs}
//    tes={tes}
//    sys={sys}
//    handleSelectIndividualMachine={
//      handleSelectIndividualMachine
//    }
//    handleUnSelectIndividualMachine={
//      handleUnSelectIndividualMachine
//    }
//    sysIndex={'currEss'}
//    sysOptions={'forceAndCommands'}
//    swt={'sys'}
//    handleClick={handleClick}
//    position={3}
//    isTCOpen={isTCOpen}
//    setIsTCOpen={setIsTCOpen}
//  />
// </IndividualWrapper>
// {/* current Tgs */}
// <IndividualWrapper>
//  <ShareComponentForSelectTC
//    title={'current tgs heater temperature'}
//    handleOpenSelectLocations={handleOpenSelectLocations}
//    displaySelectBox={displaySelectBox}
//    ess={ess}
//    tgs={tgs}
//    tes={tes}
//    sys={sys}
//    handleSelectIndividualMachine={
//      handleSelectIndividualMachine
//    }
//    handleUnSelectIndividualMachine={
//      handleUnSelectIndividualMachine
//    }
//    sysIndex={'currTgs'}
//    sysOptions={'forceAndCommands'}
//    swt={'sys'}
//    handleClick={handleClick}
//    position={4}
//    isTCOpen={isTCOpen}
//    setIsTCOpen={setIsTCOpen}
//  />
// </IndividualWrapper>
// {/* current Tes */}
// <IndividualWrapper>
//  <ShareComponentForSelectTC
//    title={'current tes heater temperature'}
//    handleOpenSelectLocations={handleOpenSelectLocations}
//    displaySelectBox={displaySelectBox}
//    ess={ess}
//    tgs={tgs}
//    tes={tes}
//    sys={sys}
//    handleSelectIndividualMachine={
//      handleSelectIndividualMachine
//    }
//    handleUnSelectIndividualMachine={
//      handleUnSelectIndividualMachine
//    }
//    sysIndex={'currTes'}
//    sysOptions={'forceAndCommands'}
//    swt={'sys'}
//    handleClick={handleClick}
//    position={5}
//    isTCOpen={isTCOpen}
//    setIsTCOpen={setIsTCOpen}
//  />
// </IndividualWrapper>

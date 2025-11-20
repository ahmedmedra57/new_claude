import { useState } from 'react';
import { useFaultsStore } from '../zustand-stores';
import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA180Deg,
  layerA,
  layerC,
  layerBDisabled,
  layerADisabled180Deg,
  layerA90Deg,
  layerCLighter,
  justifyContentFlexStart,
  layerADark,
  layerB,
} from '../styles/commonStyles';
import ExpandButton from './ExpandButton';
import FaultsDetails from './FaultsDetails';
import { useMediaQuery } from 'react-responsive';
import { tabsSrc } from '../../constants';

const FaultSwitch = ({ title, name, message, comments, disabled }) => {
  // media query
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });
  // useState
  const [isExpanded, setIsExpanded] = useState(false);
  // const [displayCommentBox, setDisplayCommentBox] = useState(false);
  // const [faultsIndexNumber, setFaultsIndexNumber] = useState(null);

  const number = message.length;

  const isFaults = number > 0;
  // const isFaults = false;

  // const faultsState = useFaultsStore();

  const imgSrcNormal = {
    ess: !disabled ? tabsSrc.ess.src : tabsSrc.ess.inactiveSrc,
    tgs: !disabled ? tabsSrc.tgs.src : tabsSrc.tgs.inactiveSrc,
    tes: !disabled ? tabsSrc.tes.src : tabsSrc.tes.inactiveSrc,
    hp: !disabled
      ? tabsSrc.heatingPlatform.purpleCircleSrc
      : tabsSrc.heatingPlatform.inactiveSrc,
    ate: !disabled ? tabsSrc.ate.src : tabsSrc.ate.inactiveSrc,
  };
  // const imgSrcNormal = {
  //   ess: !disabled
  //     ? '/images/sidebar-ess.svg'
  //     : '/images/sidebar-ess-disabled.svg',
  //   tgs: !disabled
  //     ? '/images/sidebar-tgs.svg'
  //     : '/images/sidebar-tgs-disabled.svg',
  //   tes: !disabled
  //     ? '/images/sidebar-tes.svg'
  //     : '/images/sidebar-tes-disabled.svg',
  //   hp: !disabled ? '/images/hp-button.svg' : '/images/sidebar-hp-disabled.svg',
  //   ate: !disabled
  //     ? '/images/sidebar-ate.svg'
  //     : '/images/sidebar-ate-disabled.svg',
  // };

  const imgSrcActivated =
    name === 'ess'
      ? tabsSrc.ess.activeSrc
      : name === 'tgs'
      ? tabsSrc.tgs.activeSrc
      : name === 'tes'
      ? tabsSrc.tes.activeSrc
      : name === 'hp'
      ? tabsSrc.heatingPlatform.purpleCircleActiveSrc
      : tabsSrc.ate.activeSrc;
  // const imgSrcActivated =
  //   name === 'ess'
  //     ? '/images/sidebar-ess-active.svg'
  //     : name === 'tgs'
  //     ? '/images/sidebar-tgs-active.svg'
  //     : name === 'tes'
  //     ? '/images/sidebar-tes-active.svg'
  //     : name === 'hp'
  //     ? '/images/hp-active-button.svg'
  //     : '/images/sidebar-ate-active.svg';

  const handleDisplayFaults = () => {
    if (isFaults) {
      if (isExpanded) {
        setIsExpanded(false);
      } else {
        setIsExpanded(true);
      }
    }
  };

  return (
    <Wrapper
      isExpanded={isExpanded}
      isFaults={isFaults}
      isDisabled={disabled}
      isMobile={isMobile}
    >
      <InnerWrapper
        isExpanded={isExpanded}
        isDisabled={disabled}
        isMobile={isMobile}
      >
        <LogoWrapper
          isFaults={isFaults}
          isDisabled={disabled}
          onClick={handleDisplayFaults}
          isMobile={isMobile}
        >
          <Img src={isExpanded ? imgSrcActivated : imgSrcNormal[name]} />
        </LogoWrapper>
        {!isMobile && (
          <TitleWrapper>
            <Title isFaults={isFaults}>{title}</Title>
            <Divider isFaults={isFaults} name={name}></Divider>
          </TitleWrapper>
        )}

        {isMobile ? (
          <DisplayFaults isDisabled={disabled} isMobile={isMobile}>
            <SmallWrapper>
              <FaultsDetailsNumber isFaults={isFaults} isMobile={isMobile}>
                {number ? number : 0}
              </FaultsDetailsNumber>
              <FaultsDetailsTitle isFaults={isFaults} isMobile={isMobile}>
                faults
              </FaultsDetailsTitle>
            </SmallWrapper>
            <FaultLogoWrapper
              isFaults={isFaults}
              isDisabled={disabled}
              isMobile={isMobile}
            >
              <Img
                small={true}
                src={
                  disabled
                    ? 'images/fault-fault-disabled.svg'
                    : isFaults
                    ? 'images/fault-fault-fault.svg'
                    : `images/fault-fault.svg`
                }
              />
            </FaultLogoWrapper>
          </DisplayFaults>
        ) : (
          <>
            <DisplayFaults isDisabled={disabled} isMobile={isMobile}>
              <FaultsNumberAndTitleWrapper>
                <FaultsDetailsNumber isFaults={isFaults} isMobile={isMobile}>
                  {number ? number : 0}
                </FaultsDetailsNumber>
                <FaultsDetailsTitle isFaults={isFaults} isMobile={isMobile}>
                  faults
                </FaultsDetailsTitle>
              </FaultsNumberAndTitleWrapper>

              <FaultLogoWrapper
                isFaults={isFaults}
                isDisabled={disabled}
                isMobile={isMobile}
              >
                <Img
                  small={true}
                  src={
                    disabled
                      ? 'images/fault-fault-disabled.svg'
                      : isFaults
                      ? 'images/fault-fault-fault.svg'
                      : `images/fault-fault.svg`
                  }
                />
              </FaultLogoWrapper>
            </DisplayFaults>

            <ExpandButton
              handleOnClick={handleDisplayFaults}
              name={isExpanded ? 'close' : 'expand'}
              disabled={disabled}
              isMobile={isMobile}
            />
          </>
        )}
      </InnerWrapper>
      {isMobile
        ? isExpanded && (
            <DetailInnerWrapper isMobile={isMobile}>
              <DetailInnerTop isMobile={isMobile}>
                {message.map((msg, index) => (
                  <FaultsDetails
                    name={name}
                    key={JSON.stringify(msg) + index + msg.number[0]}
                    column={index}
                    faultContents={msg}
                  />
                ))}
              </DetailInnerTop>
              <ButtonWrapper>
                <Button>
                  <ButtonHole>
                    <ButtonTop>
                      <ButtonTitle>view & print</ButtonTitle>
                    </ButtonTop>
                  </ButtonHole>
                </Button>
              </ButtonWrapper>
            </DetailInnerWrapper>
          )
        : isExpanded && (
            <DetailWrapper isMobile={isMobile}>
              <DetailInnerWrapper isMobile={isMobile}>
                <DetailInnerTop isMobile={isMobile}>
                  {message.map((msg, index) => (
                    <FaultsDetails
                      name={name}
                      key={JSON.stringify(msg)}
                      column={index}
                      faultContents={msg}
                    />
                  ))}
                </DetailInnerTop>
              </DetailInnerWrapper>
            </DetailWrapper>
          )}

      {/* {displayCommentBox && (
        <FaultsComments
          handleClose={() => {
            setDisplayCommentBox(false);
          }}
          faultsIndexNumber={faultsIndexNumber}
          name={name}
        />
      )} */}

      {/*       {displayForceMessageBox && (
        <SettingConfirmedMessage
          onClose={() => dispatch(handleDisplayForceMessageBox(false))}
          title='thermocouple failure'
          alert={true}
          src={'/static/images/heater-off-alert.svg'}
          message='SYSTEM OFF UNTIL RELEASE FAULT OR BY forcing the SYSTEM.'
        />
      )} */}
    </Wrapper>
  );
};
export default FaultSwitch;

const Wrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 315px;
          height: auto;
          padding-top: 1px;
          padding-bottom: 1px;
          ${({ isExpanded }) =>
            isExpanded &&
            css`
              padding-top: 4px;
              padding-bottom: 4px;
            `}
          ${layerA}
          border-radius: 30px;
          ${flexBoxCenter}
          flex-direction: column;
        `
      : css`
          width: 1212px;
          border-radius: 38px;
          ${layerC}
          margin-top: 8px;
          &:first-child {
            margin-top: 0;
          }

          ${(p) =>
            p.isExpanded
              ? css`
                  height: auto;
                  padding: 2px 0;
                  border-radius: 38px;
                  ${flexDirectionColumn}
                  position: relative;
                `
              : css`
                  height: 76px;
                `}
        `}

  ${flexBoxCenter}
  ${(p) =>
    p.isFaults &&
    css`
      border: 1px solid red;
    `}
`;

const InnerWrapper = styled.div`
  ${layerA180Deg}

  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 311px;
          height: 46px;

          border-radius: 28px;
          opacity: 1;
          ${flexBoxCenter}
        `
      : css`
          width: 1204px;
          border-radius: 38px;
          ${(p) =>
            p.isExpanded
              ? css`
                  height: 70px;
                `
              : css`
                  height: 70px;
                `}
          ${justifyContentSpaceBetween}
                padding: 0 15px 0 5px;
        `}

  ${(p) =>
    p.isDisabled &&
    css`
      ${layerADisabled180Deg}
    `}
`;

const TitleWrapper = styled.div`
  ${justifyContentSpaceBetween}
  width: 680px;
`;

const LogoWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 38px;
          height: 38px;
        `
      : css`
          width: 61px;
          height: 61px;
        `}

  border-radius: 50%;
  cursor: pointer;

  ${layerC}
  ${flexBoxCenter}

  ${(p) =>
    p.isFaults &&
    css`
      border: 1px solid red;
    `}

  ${(p) =>
    p.isDisabled &&
    css`
      ${layerBDisabled}
    `};
`;
const FaultLogoWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 42px;
          height: 42px;
        `
      : css`
          width: 56px;
          height: 56px;
        `}

  border-radius: 50%;

  ${layerC}
  border: 2px solid #233a54;
  ${flexBoxCenter}

  ${(p) =>
    p.isFaults &&
    css`
      border: 1px solid red;
    `}

  ${(p) =>
    p.isDisabled &&
    css`
      ${layerBDisabled}
      border: 2px solid #3B3B3B;
    `};
`;

const Img = styled.img`
  ${({ isMobile }) =>
    isMobile
      ? css``
      : css`
          height: 105%;
          ${(p) =>
            p.small &&
            css`
              height: 100%;
            `}
        `}
`;

const Title = styled.span`
  font-size: 12px;
  letter-spacing: 1.2px;

  ${(p) =>
    p.isFaults &&
    css`
      color: red;
    `}
`;
const Divider = styled.div`
  border: 1px solid #ffffff;

  ${(p) =>
    p.name === 'ess'
      ? css`
          width: 430px;
        `
      : p.name === 'tgs'
      ? css`
          width: 461px;
        `
      : p.name === 'tes'
      ? css`
          width: 424px;
        `
      : p.name === 'hp'
      ? css`
          width: 492px;
        `
      : css`
          width: 407px;
        `}
  ${(p) =>
    p.isFaults &&
    css`
      border: 1px solid red;
    `}
`;

const DisplayFaults = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 261px;
          height: 38px;
          border-radius: 24px;
          margin-left: 6px;
        `
      : css`
          width: 320px;
          height: 62px;
          border-radius: 31px;
          padding: 0 4px 0 10px;
        `}

  ${layerA}
  ${justifyContentSpaceBetween}
 

  ${(p) =>
    p.isDisabled &&
    css`
      ${layerBDisabled}
    `}
`;

const SmallWrapper = styled.div`
  width: 100px;
  margin-left: 10px;
  ${justifyContentSpaceBetween}
`;

const FaultsNumberAndTitleWrapper = styled.div`
  width: 50%;
  height: 100%;

  ${justifyContentFlexStart}
`;

const FaultsDetailsNumber = styled.span`
  ${({ isMobile }) =>
    isMobile
      ? css`
          font-size: 36px;
        `
      : css`
          font-size: 48px;
        `}

  ${(p) =>
    p.isFaults
      ? css`
          color: #fe0000;
        `
      : css`
          color: #fff;
        `}
`;
const FaultsDetailsTitle = styled.span`
  ${({ isMobile }) =>
    !isMobile &&
    css`
      text-align: center;
      width: 70%;
    `}

  font-size: 12px;

  ${(p) =>
    p.isFaults &&
    css`
      color: red;
    `}
`;

const DetailWrapper = styled.div`
  ${({ isMobile }) => !isMobile && css``}

  width: 1204px;
  border-radius: 16px 16px 35px 35px;

  margin: 8px 0 6.5px 0;
  padding: 1px 0;

  /* background: transparent linear-gradient(180deg, #233a54 0%, #060d19 100%); */
  ${layerA180Deg}
  /* box-shadow: none; */
  border: 1px solid #142033;
  ${flexBoxCenter}
`;

const DetailInnerWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 311px;
          height: auto;
          margin-top: 4px;
          padding-top: 4px;

          border-radius: 14px 14px 23px 23px;

          ${justifyContentFlexStart}
          flex-direction:column;
        `
      : css`
          width: 1200px;
          border-radius: 14px 14px 32px 32px;

          border: 0.5px solid #142033;

          ${flexBoxCenter}

          padding: 5px 0 20px 0;
        `}
  ${layerA180Deg}
`;

const DetailInnerTop = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 303px;
          height: 156px;

          ${layerA}
          border-radius: 10px 10px 19px 19px;
          opacity: 1;
          ${flexBoxCenter}
          flex-direction: column;
          gap: 4px;
        `
      : css`
          width: 1187px;
          border-radius: 9px;

          ${flexDirectionColumn}

          ${layerADark}
          padding: 4px 0;
        `}
`;

const ButtonWrapper = styled.div`
  width: 108px;
  height: 30px;
  margin-top: 4px;
  margin-bottom: 4px;

  ${layerA}

  border-radius: 15px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Button = styled.button`
  width: 106px;
  height: 28px;

  ${layerA180Deg}

  border-radius: 16px;
  opacity: 1;
  ${flexBoxCenter}
`;

const ButtonHole = styled.div`
  width: 100px;
  height: 22px;

  ${layerB}

  border-radius: 20px;
  ${flexBoxCenter}
`;

const ButtonTop = styled.div`
  width: 98px;
  height: 20px;

  ${layerA180Deg}

  border-radius: 25px;
  ${flexBoxCenter}
`;

const ButtonTitle = styled.p`
  font-size: 10px;
`;

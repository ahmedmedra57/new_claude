import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useTranslation } from 'react-i18next';

import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA180Deg,
  layerC,
  layerA,
  readyTop180Deg,
} from '../styles/commonStyles';

import styled, { css } from 'styled-components';

import SelectLocations from './SelectLocations';
import InputTempMessage from '../userMessages/inputTempMessage';

const FanOnly = ({ scope, handleOnClick, swtName, handleClose }) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  // Global
  const type = scope === 'switch' ? 'locations' : 'switches';

  const switchStatus = useSelector(
    scope === 'switch' ? selectMCBySwitch : selectMCByLocation
  );
  const { selectedOne } = switchStatus.snowSensor;

  // Local
  const [isExpanded, setIsExpanded] = useState(false);
  const [openMessageBox, setOpenMessageBox] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleApply = () => {
    if (!selectedOne) {
      // Message box
      setOpenMessageBox(true);
      setMessages([t('masterControl.fanOnly.selectLocations'), t('masterControl.fanOnly.selectLocationPrompt')]);
      // please select locations first
      handleOnClick('fanOnly', 'selectA', scope, '_', '_', type);

      if (isMobile && scope !== 'switch') {
        handleClose();
      }
    } else {
      handleOnClick('fanOnly', 'on', scope);
    }
  };

  return (
    <>
      {scope === 'switch' ? (
        <MobileWrapper isExpanded={isExpanded}>
          <SectionController
            isMobile={isMobile}
            isMargin={isMobile && isExpanded}
          >
            <MobileHole>
              <MobileTop>
                <SectionCircle>
                  <CircleButton onClick={handleApply}>
                    <CircleHole>
                      <LogoImg src='images/tgs-fanOnly.svg' />
                    </CircleHole>
                  </CircleButton>
                </SectionCircle>

                <SectionHeatButton>
                  <HeatButton onClick={handleApply}>
                    {t('masterControl.programs.fanOnly')}
                  </HeatButton>
                </SectionHeatButton>

                <SectionCircle>
                  <CircleButton
                    isExpanded={isExpanded}
                    onClick={() => {
                      setIsExpanded((prev) => !prev);
                    }}
                  >
                    <CircleHole>
                      <CircleTop isExpanded={isExpanded}>
                        <LogoImg
                          isSm={true}
                          src={
                            isExpanded
                              ? '/images/MC-expand-true.svg'
                              : '/images/MC-expand-false.svg'
                          }
                        />
                      </CircleTop>
                    </CircleHole>
                  </CircleButton>
                </SectionCircle>
              </MobileTop>
            </MobileHole>
          </SectionController>

          {isExpanded && (
            <SelectLocations name='fanOnly' scope={scope} swtName={swtName} />
          )}

          {openMessageBox && (
            <MobileMessageBoxWrapper>
              <InputTempMessage
                onClose={() => setOpenMessageBox(false)}
                title={t('masterControl.title')}
                subtitle={t('masterControl.programs.fanOnly')}
                messages={messages}
                isMobile={isMobile}
              />
            </MobileMessageBoxWrapper>
          )}
        </MobileWrapper>
      ) : (
        <MobileWrapper isExpanded={isExpanded} isSmall={true}>
          <SectionSelect>
            <SelectLocations name='fanOnly' scope={scope} swtName={swtName} />
          </SectionSelect>
          <ScopeWrapper>
            <SectionController
              isMobile={isMobile}
              isMargin={isMobile && isExpanded}
              isSmall={true}
            >
              <SectionCircle isSmall={true}>
                <CircleButton onClick={handleApply} isSmall={true}>
                  <CircleHole isSmall={true}>
                    <LogoImg src='images/tgs-fanOnly.svg' />
                  </CircleHole>
                </CircleButton>
              </SectionCircle>

              <MobileHole isSmall={true}>
                <MobileTop isSmall={true}>
                  <HeatButton onClick={handleApply} isSmall={true}>
                    {t('masterControl.programs.fanOnly')}
                  </HeatButton>
                </MobileTop>
              </MobileHole>
            </SectionController>
          </ScopeWrapper>

          {openMessageBox && (
            <MobileMessageBoxWrapper>
              <InputTempMessage
                onClose={() => setOpenMessageBox(false)}
                title={t('masterControl.title')}
                subtitle={t('masterControl.programs.fanOnly')}
                messages={messages}
                isMobile={isMobile}
              />
            </MobileMessageBoxWrapper>
          )}
        </MobileWrapper>
      )}
    </>
  );
};
export default FanOnly;

const MobileWrapper = styled.div`
  position: relative;
  ${(p) =>
    p.isSmall
      ? css`
          ${flexDirectionColumn};
        `
      : css`
          width: 314px;
          height: 72px;
          border-radius: 36px;
          ${flexBoxCenter}
          ${layerC}

          ${(p) =>
            p.isExpanded &&
            css`
              height: auto;
              border-radius: 36px;
              ${flexDirectionColumn};
              padding: 2px 0;
            `}
            margin-bottom: 8px;
        `}
`;

const SectionController = styled.div`
  width: 310px;
  height: 68px;
  border-radius: 34px;
  ${layerA180Deg}
  ${flexBoxCenter}
  margin-bottom: 6px;

  ${(p) =>
    p.isSmall &&
    css`
      width: 299px;
      height: 50px;
      border-radius: 31px;
      ${justifyContentSpaceBetween};
      padding: 0 3.5px 0 6px;
      margin-bottom: 0;
    `};
`;

const ScopeWrapper = styled.div`
  width: 303px;
  height: 54px;
  border-radius: 33px;
  ${layerA}
  ${flexBoxCenter};
  margin-bottom: 6px;
`;

const MobileHole = styled.div`
  width: 299px;
  height: 58px;
  border-radius: 29px;

  ${layerA};
  ${flexBoxCenter};
  ${(p) =>
    p.isSmall &&
    css`
      width: 246px;
      height: 42px;
      border-radius: 26px;
    `}
`;
const MobileTop = styled.div`
  width: 293px;
  height: 52px;
  border-radius: 26px;
  ${layerA180Deg};
  ${justifyContentSpaceBetween};
  padding: 0 2px;

  ${(p) =>
    p.isSmall &&
    css`
      width: 241px;
      height: 38px;
      border-radius: 23px;
      ${flexBoxCenter};
    `}
`;

const SectionCircle = styled.section`
  ${(p) =>
    p.isSmall
      ? css`
          width: 40px;
          height: 40px;
        `
      : css`
          width: 48px;
          height: 48px;
        `}
  border-radius: 50%;
  ${layerC};
  ${flexBoxCenter};
`;
const CircleButton = styled.button`
  ${(p) =>
    p.isSmall
      ? css`
          width: 38px;
          height: 38px;
        `
      : css`
          width: 46px;
          height: 46px;

          ${(p) =>
            p.isExpanded &&
            css`
              ${readyTop180Deg}
            `}
        `}
  border-radius: 50%;
  ${layerA180Deg};
  ${flexBoxCenter};

  ${(p) =>
    p.isExpanded &&
    css`
      ${readyTop180Deg}
    `}
`;
const CircleHole = styled.div`
  ${(p) =>
    p.isSmall
      ? css`
          width: 30px;
          height: 30px;
        `
      : css`
          width: 36px;
          height: 36px;
        `}

  border-radius: 50%;
  ${layerA};
  ${flexBoxCenter};
`;
const CircleTop = styled.div`
  ${(p) =>
    p.isSmall
      ? css``
      : css`
          width: 34px;
          height: 34px;

          ${(p) =>
            p.isExpanded &&
            css`
              ${readyTop180Deg}
            `}
        `}

  border-radius: 50%;
  ${layerA180Deg};
  ${flexBoxCenter};

  ${(p) =>
    p.isExpanded &&
    css`
      ${readyTop180Deg}
    `}
`;

const LogoImg = styled.img`
  height: 120%;
  ${(p) =>
    p.isSm &&
    css`
      height: auto;
    `}
`;

const SectionHeatButton = styled.section`
  width: 188px;
  height: 36px;
  border-radius: 18px;

  ${layerA}
  ${flexBoxCenter}
`;
const HeatButton = styled.button`
  border-radius: 17px;
  ${layerA180Deg};
  ${flexBoxCenter};

  ${(p) =>
    p.isSmall
      ? css`
          width: 231px;
          height: 28px;
          font-size: 12px;
        `
      : css`
          width: 186px;
          height: 34px;
          line-height: 95%;
          padding-top: 2px;
          font-size: 10px;
        `}
`;

const SectionSelect = styled.section`
  width: 303px;
  height: auto;
  border-radius: 34px;
  ${layerA};
  ${flexBoxCenter};
  padding: 2px 0;
  margin-bottom: 6px;
`;

const MobileMessageBoxWrapper = styled.div`
  width: auto;
  height: auto;

  ${flexBoxCenter}

  position: absolute;
  top: 50px;
  left: -32px;

  z-index: 100;
`;

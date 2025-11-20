import styled, { css } from "styled-components";
import TitleContainer from "../TitleContainer";
import FaultSwitch from "./FaultsSwitch";
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentFlexStart,
  justifyContentSpaceAround,
  layerA,
  layerA90Deg,
  layerCLighter,
} from "../styles/commonStyles";
import { useMediaQuery } from "react-responsive";
import { useViewport } from "use-viewport";
import { useGetAllSSRsQueries, useGetThermocouplesQueries } from "../../hooks";
import { useTranslation } from 'react-i18next';

const FaultsMain = () => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ query: "(max-width:600px)" });

  const { height } = useViewport();

  const { flatEssSwitch } = useESSSwitchStore();
  const { flatTesSwitch } = useTESSwitchStore();
  const { isEssSwitch, isTesSwitch, isTgsSwitch, isHpSwitch, isAteSwitch } =
    useUserStore();
  useGetAllSSRsQueries(flatEssSwitch, "ESS");
  useGetAllSSRsQueries(flatTesSwitch, "TES");
  useGetThermocouplesQueries(flatEssSwitch, "ess");
  useGetThermocouplesQueries(flatTesSwitch, "tes");
  const faultsState = useFaultsStore();
  const essFaultMessages = faultsState.messages.ess;
  const tgsFaultMessages = faultsState.messages.tgs;
  const tesFaultMessages = faultsState.messages.tes;

  const faults = [
    {
      name: "ess",
      title: t('faults.systems.ess'),
      disabled: !isEssSwitch,
      message: essFaultMessages,
      comments: [],
    },
    {
      name: "tgs",
      title: t('faults.systems.tgs'),
      disabled: !isTgsSwitch,
      message: tgsFaultMessages,
      comments: [],
    },
    {
      name: "tes",
      title: t('faults.systems.tes'),
      disabled: !isTesSwitch,
      message: tesFaultMessages,
      comments: [],
    },
    {
      name: "hp",
      title: t('faults.systems.hp'),
      disabled: !isHpSwitch,
      message: [],
      comments: [],
    },
    {
      name: "ate",
      title: t('faults.systems.ate'),
      disabled: !isAteSwitch,
      message: [],
      comments: [],
    },
  ];
  return (
    <>
      {isMobile ? (
        <BaseLayer height={height - 156}>
          <WrapperMobile height={height - 162}>
            <TitleContainer title={t('faults.title')} />
            <MobileSectionContent>
              {faults.map((fault) => (
                <FaultSwitch
                  key={fault.name}
                  name={fault.name}
                  title={fault.title}
                  disabled={fault.disabled}
                  message={fault.message}
                  comments={fault.comments}
                />
              ))}
            </MobileSectionContent>
          </WrapperMobile>
        </BaseLayer>
      ) : (
        <Wrapper>
          <TitleContainer title={t('faults.title')} />
          <SectionContent>
          {faults.map((fault) => {
              return (
                <FaultSwitch
                  key={fault.name}
                  name={fault.name}
                  title={fault.title}
                  disabled={fault.disabled}
                  message={fault.message}
                  comments={fault.comments}
                />
              )
            })}
          </SectionContent>
        </Wrapper>
      )}
    </>
  );
};

export default FaultsMain;

// ******mobile
const BaseLayer = styled.div`
  width: 332px;
  height: auto;
  ${({ height }) =>
    height
      ? css`
          min-height: ${height}px;
        `
      : css`
          min-height: 100vh;
        `}

  padding-top: 3px;
  padding-bottom: 3px;

  ${layerCLighter}
  border-radius: 31px 31px 36px 13px;
  /* background: #142033;
  box-shadow: inset 0px 0.5px 1px #00000029; */
  ${flexBoxCenter}
  opacity: 1;
`;

const WrapperMobile = styled.div`
  width: 326px;
  height: auto;
  ${({ height }) =>
    height
      ? css`
          min-height: ${height}px;
        `
      : css`
          min-height: 100vh;
        `}
  padding-top: 4px;
  padding-bottom: 4px;

  ${layerA90Deg}
  border-radius: 28px 28px 33px 10px;

  border: 1px solid #000000;
  opacity: 1;
  ${justifyContentFlexStart}
  flex-direction: column;
`;

const MobileSectionContent = styled.div`
  width: 100%;
  height: auto;
  margin-top: 10px;
  ${flexBoxCenter}
  flex-direction: column;
  gap: 5px;
`;

// **** full screen

const Wrapper = styled.div`
  width: 1216px;
  height: auto;
`;

const SectionContent = styled.section`
  width: 1216px;
  height: auto;
  border-radius: 40px;

  ${layerA};
  ${flexDirectionColumn};
  margin-top: 5px;
  padding: 2px 0;
`;

import styled, { css } from 'styled-components';
import { flexBoxCenter, layerA180Deg } from '../../styles/commonStyles';
import ChartTotalHoursAndEnergy from './ChartTotalHoursAndEnergy';
import NivoChartCopy from './NivoChartCopy';
import MainSwitchesSpecifications from './switchSytemsList/MainSwitchesSpecifications';
import TitleOfSelectedSystem from './TitleOfSelectedSystem';
import { selectMC } from '../../store/slices/mCSlice';

const MainChart = ({
  selectedSystemTitle,
  controlSelectionDisplay,
  telemetryData,
  telemetryDataKeys,
  setTelemetryData,
  setTelemetryDataKeys,
  copyTelemetryState,
  copyTelemetryStateKeys,
  copyTelemetryDailyState,
  setCopyTelemetryState,
  setCopyTelemetryStateKeys,
  setCopyTelemetryDailyState,
  doubleTelemetryData,
  setDoubleTelemetryData,
  doubleTelemetryKeys,
  setDoubleTelemetryKeys,
  scheduleData,
  isSearch,
}) => {
  const isDc = selectedSystemTitle?.split(' - ')[1] === 'dc';

  const selectionOfSystem = useMCStore();
  const { essDc, tgsTesDc, hpDc, tgs, hpGc, ess, tes, hpEc } =
    selectionOfSystem.selectSystem;

  const xAxisTitle = essDc
    ? 'ess electric switch systems (switches)'
    : tgsTesDc
    ? 'tgs/tes typhoon systems (switches)'
    : hpDc
    ? ''
    : tgs
    ? 'tgs typhoon gas systems (switches)'
    : hpGc
    ? ''
    : ess
    ? 'ess electric switch systems (switches)'
    : tes
    ? 'tes typhoon electric systems (switches)'
    : hpEc && '';

  const xAxisTitleFontColor =
    essDc || tgsTesDc
      ? '#FF0080'
      : hpDc
      ? ''
      : tgs
      ? '#FF7800'
      : hpGc
      ? ''
      : ess
      ? '#83FFFF'
      : tes
      ? '#95FF45'
      : hpEc && '';

  return (
    <ShadowWrapper>
      <Wrapper>
        <TitleOfSelectedSystem scheduleData={scheduleData} />
        <ChartWrapper>
          <NivoChartCopy
            telemetryData={telemetryData}
            telemetryDataKeys={telemetryDataKeys}
            setTelemetryData={setTelemetryData}
            setTelemetryDataKeys={setTelemetryDataKeys}
            copyTelemetryState={copyTelemetryState}
            copyTelemetryStateKeys={copyTelemetryStateKeys}
            copyTelemetryDailyState={copyTelemetryDailyState}
            setCopyTelemetryState={setCopyTelemetryState}
            setCopyTelemetryStateKeys={setCopyTelemetryStateKeys}
            setCopyTelemetryDailyState={setCopyTelemetryDailyState}
            doubleTelemetryData={doubleTelemetryData}
            setDoubleTelemetryData={setDoubleTelemetryData}
            doubleTelemetryKeys={doubleTelemetryKeys}
            setDoubleTelemetryKeys={setDoubleTelemetryKeys}
          />
          {/* {isSearch && (
            <xAxisTitleWrapper>
              <xAxisTitle fontColor={xAxisTitleFontColor}>
                {xAxisTitle}
              </xAxisTitle>
            </xAxisTitleWrapper>
          )} */}
          {isSearch && (
            <XAxisTitleWrapper>
              <XAxisTitle fontColor={xAxisTitleFontColor}>
                {xAxisTitle}
              </XAxisTitle>
            </XAxisTitleWrapper>
          )}
        </ChartWrapper>
        <ChartTotalHoursAndEnergy
          swtName={selectedSystemTitle?.split(' ')[0]}
          isDc={isDc}
        />
        <MainSwitchesSpecifications
          telemetryData={telemetryData}
          selectedSystem={selectedSystemTitle}
          controlSelectionDisplay={controlSelectionDisplay}
          scheduleData={scheduleData}
          isDc={isDc}
        />
      </Wrapper>
    </ShadowWrapper>
  );
};

export default MainChart;

const ShadowWrapper = styled.div`
  width: 1216rem;
  height: auto;
  padding-top: 2rem;
  padding-bottom: 2rem;

  box-shadow: inset 0rem 0rem 3rem #000000;
  border-radius: 12rem;
  opacity: 1;
  ${flexBoxCenter}
`;

const Wrapper = styled.div`
  width: 1212rem;
  height: auto;
  padding-top: 4rem;
  padding-bottom: 4rem;

  ${layerA180Deg}

  border-radius: 10rem;
  opacity: 1;
  ${flexBoxCenter}
  flex-direction: column;
  gap: 4rem;
`;

const ChartWrapper = styled.div`
  position: relative;
`;

const XAxisTitleWrapper = styled.div`
  position: absolute;
  top: 77%;
  right: 2%;
`;

const XAxisTitle = styled.span`
  font-size: 12px;

  ${({ fontColor }) =>
    css`
      color: ${fontColor};
    `}
`;

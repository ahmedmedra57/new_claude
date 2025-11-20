import { useState } from 'react';
import { useTelemetryStore } from '../zustand-stores';
import styled, { css } from 'styled-components';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import TitleContainer from '../TitleContainer';
import MainChart from './chart/MainChart';
import MainSelections from './theSelections/MainSelections';
import MessageBox from '../userMessages/messageBox';

const TelemetryMain = () => {
  const { t } = useTranslation();
  const [selectedSystemTitle, setSelectedSystemTitle] = useState(null);
  const [controlSelectionDisplay, setControlSelectionDisplay] = useState(false);
  const [telemetryData, setTelemetryData] = useState([]);
  const [doubleTelemetryData, setDoubleTelemetryData] = useState([]);
  const [doubleTelemetryKeys, setDoubleTelemetryKeys] = useState([]);
  const [telemetryDataKeys, setTelemetryDataKeys] = useState([]);
  const [copyTelemetryState, setCopyTelemetryState] = useState([]);
  const [copyTelemetryStateKeys, setCopyTelemetryStateKeys] = useState([]);
  const [copyTelemetryDailyState, setCopyTelemetryDailyState] = useState([]);
  const [scheduleData, setScheduleData] = useState({
    start: { date: null, time: null },
    end: { date: null, time: null },
  });
  const [popUpBox, setPopUpBox] = useState(false);

  const { isSearch } = useTelemetryStore();

  const handleMessageBoxForSelectBoxes = () => {
    if (isSearch) return;
    return setPopUpBox(true);
  };
  return (
    <Wrapper>
      <TitleContainer title={t('telemetry.title')} />
      <MainSelections
        selectedSystemTitle={selectedSystemTitle}
        setSelectedSystemTitle={setSelectedSystemTitle}
        setControlSelectionDisplay={setControlSelectionDisplay}
        setTelemetryData={setTelemetryData}
        setTelemetryDataKeys={setTelemetryDataKeys}
        setCopyTelemetryState={setCopyTelemetryState}
        setCopyTelemetryStateKeys={setCopyTelemetryStateKeys}
        setCopyTelemetryDailyState={setCopyTelemetryDailyState}
        scheduleData={scheduleData}
        setScheduleData={setScheduleData}
      />
      <div onClick={handleMessageBoxForSelectBoxes}>
        <MainChart
          selectedSystemTitle={selectedSystemTitle}
          controlSelectionDisplay={controlSelectionDisplay}
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
          scheduleData={scheduleData}
          isSearch={isSearch}
        />
      </div>
      {popUpBox && (
        <MessageBoxWrapper>
          <MessageBox
            onClose={() => setPopUpBox(false)}
            title={t('telemetry.title')}
            subtitle={t('telemetry.selectionBox')}
            messages={[
              t('telemetry.messages.selectAllBoxes'),
            ]}
          />
        </MessageBoxWrapper>
      )}
    </Wrapper>
  );
};

export default TelemetryMain;

const Wrapper = styled.div`
  height: auto;
  width: 1216rem;

  /* Hi Johnson I just put this temporary I think you should   */
  margin-bottom: 40px;
  position: relative;
`;

const MessageBoxWrapper = styled.div`
  position: absolute;
  top: 25%;
  left: 36%;
`;

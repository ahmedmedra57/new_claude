import { useState } from 'react';
import { useMCStore } from '../../zustand-stores';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useSelectedMachinesStore } from '../zustand-stores';
// import ScheduleCalendar from '../../masterControl/controls/heatingScheduler/ScheduleCalendar';
import { selectMC } from '../../store/slices/mCSlice';
import { selectedMachinesState } from '../../store/slices/selectedMachinesSlice';
import { flexBoxCenter, layerA180Deg } from '../../styles/commonStyles';
import SchedulerDisplay from './SchedulerDisplay';
import ScheduleCalendar from '../../masterControl/controls/heatingScheduler/ScheduleCalendar';

const SelectDates = ({ scheduleData, setScheduleData }) => {
  const { t } = useTranslation();
  // redux
  const selectsState = useSelectedMachinesStore();

  const { ready, activated } = selectsState.heatingSchedule;

  const selectedSwitch = useMCStore();
  const { ess, tgs, tes, essDc, tgsDc, tesDc, hpDc, hpGc, hpEc, tgsTesDc } = selectedSwitch.selectSystem;
  const [openScheduler, setOpenScheduler] = useState(false);
  const initialSchedule = {
    start: { date: null, time: null },
    end: { date: null, time: null },
  };

  // clear button but schedule. it sets it to initialSchedule state above
  const handleClear = () => {
    setScheduleData(initialSchedule);
  };

  // saves the start date and end date into the scheduleData state and closes the calender
  const handleSchedulerDate = (data) => {
    setScheduleData(data);
    setOpenScheduler(false);
  };

  return (
    <Wrapper>
      <WrapperTitles>
        <Title id={1}>{t('telemetry.selectStartDate')}</Title>
        <Title id={2}>{t('telemetry.selectEndDate')}</Title>
      </WrapperTitles>
      <WrapperSchedule>
        <SchedulerDisplay
          handleOpenScheduler={() => setOpenScheduler(true)}
          start={scheduleData.start}
          end={scheduleData.end}
          ready={ready}
          active={activated}
        />
      </WrapperSchedule>
      {openScheduler && (
        <ScheduleCalendarWrapper>
          <ScheduleCalendar
            handleScheduler={handleSchedulerDate}
            handleClose={() => setOpenScheduler(false)}
            handleClear={handleClear}
            scheduleList={scheduleData}
            noTimePicker={ess || tgs || tes || essDc || tgsDc || tesDc || hpDc || hpGc || hpEc || tgsTesDc}
            isToSelectPastDates={true}
          />
        </ScheduleCalendarWrapper>
      )}
    </Wrapper>
  );
};

export default SelectDates;

const Wrapper = styled.div`
  ${flexBoxCenter}
  flex-direction: column;
`;

const WrapperTitles = styled.div`
  width: 360px;
  height: auto;
  ${flexBoxCenter}
  gap:64px;
  margin-right: 46px;
`;

const Title = styled.p`
  margin-bottom: 4px;

  text-align: left;
  font-size: 10px;
  letter-spacing: 1px;
  color: #ffffff;
  opacity: 1;
`;

const WrapperSchedule = styled.div`
  width: 428px;
  height: 41px;

  ${layerA180Deg}

  border-radius: 34px;
  opacity: 1;
`;

const ScheduleCalendarWrapper = styled.div`
  position: absolute;
  top: 173px;
  left: 282px;
  z-index: 100;
`;

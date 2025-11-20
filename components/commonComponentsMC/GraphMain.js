import { useEffect, useState } from 'react';
import { useLocationsStore } from '../zustand-stores';

import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentFlexEnd,
  justifyContentFlexStart,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerB,
  layerBDark,
  layerCLighter,
} from '../styles/commonStyles';

import ScheduleCalendar from '../masterControl/controls/heatingScheduler/ScheduleCalendar';
import DisplayConsumptionBox from './DisplayConsumptionBox';
import DisplayFaultsTimer from './DisplayFaultsTimer';
import DisplayGraphInfoTitle from './DisplayGraphInfoTitle';
import DisplayLegend from './DisplayLegend';
import ChartContainer from './ChartContainer';
import { getDataConsumptionService, getTelemetryService } from '../../services';
import { formatTime, getGraphTypeKey } from '../../helpers/helpers';
import { selectLocations } from './../store/slices/locationsSlice';

const GraphMain = ({
  swtName,
  location,
  machine,
  setAuditLogData,
  handleMessage,
}) => {
  
  const locations = useLocationsStore();

  const energySource =
    swtName === 'tgs'
      ? 'gas consumption vs time'
      : 'energy consumption vs time';
  const graphSelection = [
    'heater temp. vs real time',
    'heater temp. vs time',
    energySource,
    'data consumption vs time',
  ];

  const selectButtons = ['clear', 'apply'];
  const [selectedOne, setSelectedOne] = useState('select graph type');
  const [isSelected, setIsSelected] = useState([false, false, false, false]);
  const [openGraphSelect, setOpenGraphSelect] = useState(false);
  const [openDateSelect, setOpenDateSelect] = useState(false);
  const [date, setDate] = useState({
    start: { date: null, time: null },
    end: { date: null, time: null },
  });
  const [isReadyToRender, setIsReadyToRender] = useState(false);

  // date format logic
  // ** deconstruction
  const { start, end } = date;
  const displayStart =
    start.date !== null
      ? `${start.time.hour} : ${start.time.minute} ${
          start.time.division
        } - ${start.date.getDate()} / ${
          start.date.getMonth() + 1
        } / ${start.date.getFullYear()} `
      : ' -----------------';

  const displayEnd =
    end.date !== null
      ? `${end.time.hour} : ${end.time.minute} ${
          end.time.division
        } - ${end.date.getDate()} / ${
          end.date.getMonth() + 1
        } / ${end.date.getFullYear()} `
      : ' -----------------';

  // calculate date period
  const btMs = end.date?.getTime() - start.date?.getTime();
  const selectedDatePeriod = btMs / (1000 * 60 * 60 * 24);

  // useEffect(() => {
  //   setIsReadyToRender(false);
  // }, [selectedOne, date, isSelected]);

  useEffect(() => {
    setAuditLogData({});
  }, [selectedOne, date, isSelected]);

  // when search button clicked send props to render depends on selections
  const handleSearchButton = () => {
    const deviceIds = [machine];
    if (
      !date.start.date ||
      !date.start.time ||
      !date.end.date ||
      !date.end.time ||
      !isSelected.some((el) => el)
    ) {
      handleMessage('open');
      return;
    }

    const startDate = formatTime(date.start, true);
    const endDate = formatTime(date.end, true);

    const handleTelemetryData = (data, unit, type) => {
      const newData = {
        location,
        machine,
        graphType: getGraphTypeKey(type),
        data: data[0]?.data
          .filter((el) => typeof el.startTime === 'number')
          .map((el) => {
            return [
              el.startTime,
              type === 'fuel' || type === 'energy'
                ? el.consumption
                : el.avg_value,
            ];
          }),
        unit,
      };
      if (swtName === 'ess') {
        useESSSwitchStore().setTesGraphDate(newData);
      } else if (swtName === 'tgs') {
        useTGSSwitchStore().setTesGraphDate(newData);
      } else if (swtName === 'tes') {
        useTESSwitchStore().setTesGraphDate(newData);
      }
    };

    const getAuditLogData = (data, isDc) => {
      const totalUsageHours = Math.floor(
        data?.reduce((acc, cur) => {
          return acc + ((isDc ? cur.total : cur.consumption) || 0);
        }, 0);
      const totalConsumption = Math.floor(
        data?.reduce((acc, cur) => {
          return acc + ((isDc ? cur.total : cur.consumption) || 0);
        }, 0);

      return {
        actionType: isDc
          ? 'GLOBAL_DATA_TELEMETRY_OVERVIEW'
          : 'GLOBAL_TELEMETRY_OVERVIEW',
        deviceIds,
        deviceType: swtName.toUpperCase(),
        data: {
          startDate,
          endDate,
          isDataConsumption: isDc,
          totalUsageHours,
          totalConsumption,
          data: {
            deviceId: machine,
            usageHours: totalUsageHours,
            consumption: totalConsumption,
          },
        },
      };
    };

    if (selectedOne !== 'selectedGraph type' && date.start.date) {
      if (isSelected[1]) {
        const categories =
          swtName === 'tgs'
            ? [
                'gas_graph',
                'gas_enclosure_graph',
                'outside_graph',
                'gas_snow_graph',
                'gas_wind_graph',
              ]
            : [
                'heater_graph',
                'enclosure_graph',
                'outside_graph',
                'snow_graph',
                'wind_graph',
              ];
        const promises = categories.map((category) =>
          getTelemetryService({ deviceIds, startDate, endDate, category });
        Promise.all(promises).then((res) => {
          res.forEach(({ data, unit }, index) => {
            handleTelemetryData(data, unit, categories[index]);
          });
        });
      }

      if (isSelected[2]) {
        const category = swtName === 'tgs' ? 'fuel' : 'energy';
        getTelemetryService({ deviceIds, startDate, endDate, category }).then(
          ({ data, unit }) => {
            handleTelemetryData(data, unit, category);
            setAuditLogData(getAuditLogData(data[0]?.data, false);
          }
        );
      }

      if (isSelected[3]) {
        const inhandIds = [
          locations[swtName][location]?.devices[machine]?.inhand_id,
        ];
        if (inhandIds[0]) {
          getDataConsumptionService({ inhandIds, startDate, endDate }).then(
            (res) => {
              const newData = {
                location,
                machine,
                graphType: 'dataConsumptionGraphData',
                data: Object.values(res)[0]
                  .filter((el) => el.start_date)
                  .map((el) => {
                    return [el.start_date, el.total];
                  }),
              };
              if (swtName === 'ess') {
                useESSSwitchStore().setTesGraphDate(newData);
              } else if (swtName === 'tgs') {
                useTGSSwitchStore().setTesGraphDate(newData);
              } else if (swtName === 'tes') {
                useTESSwitchStore().setTesGraphDate(newData);
              }

              setAuditLogData(getAuditLogData(Object.values(res)[0], true);
            }
          );
        }
      }

      if (isSelected[0]) {
        setIsReadyToRender(false);
      } else {
        setIsReadyToRender(true);
      }
    }
  };

  // scheduler functions
  const handleClear = () => {
    setDate({
      start: { date: null, time: null },
      end: { date: null, time: null },
    });
  };

  const handleClose = () => {
    setOpenDateSelect(false);
  };

  const handleSetNewSchedule = (data) => {
    setDate(data);
    setOpenDateSelect(false);
  };

  const handleSelectButton = (btn) => {
    if (btn === 'clear') {
      // clear button
      setIsSelected([false, false, false, false]);
    } else if (btn === 'apply') {
      // apply button
      if (isSelected[0]) {
        setSelectedOne(graphSelection[0]);
      } else if (isSelected[1]) {
        setSelectedOne(graphSelection[1]);
      } else if (isSelected[2]) {
        setSelectedOne(graphSelection[2]);
      } else if (isSelected[3]) {
        setSelectedOne(graphSelection[3]);
      }
      // close select box
      setOpenGraphSelect(false);
    }
  };

  const handleGraphSelect = (idx) => {
    if (idx === 0) {
      setIsSelected([true, false, false, false]);
    } else if (idx === 1) {
      setIsSelected([false, true, false, false]);
    } else if (idx === 2) {
      setIsSelected([false, false, true, false]);
    } else if (idx === 3) {
      setIsSelected([false, false, false, true]);
    }
  };

  return (
    <Wrapper positionRelative={openDateSelect}>
      <SectionSelect>
        <SelectHole>
          <GraphAndDateWrapper>
            <SectionGraphSelect>
              <SelectSpan>select graph</SelectSpan>
              <GraphSelectWrapper openGraphSelect={openGraphSelect}>
                <SelectedOneAndArrowWrapper openGraphSelect={openGraphSelect}>
                  <GraphSelectTop>
                    <SelectSpan text={true}>{selectedOne}</SelectSpan>
                  </GraphSelectTop>
                  <ArrowImg
                    src={'/images/masterCtr-select-btn.svg'}
                    onClick={() => {
                      setOpenDateSelect(false);
                      setOpenGraphSelect(!openGraphSelect);
                    }}
                  />
                </SelectedOneAndArrowWrapper>
                {openGraphSelect && (
                  <>
                    <SectionSelectOption>
                      {graphSelection.map((option, idx) => (
                        <SelectOptions
                          onClick={() => handleGraphSelect(idx)}
                          key={idx}
                        >
                          <RadioButton>
                            <RadioIndicator
                              isSelected={isSelected[idx]}
                            ></RadioIndicator>
                          </RadioButton>
                          <Option>{option}</Option>
                        </SelectOptions>
                      ))}
                    </SectionSelectOption>
                    <SectionSelectButton>
                      {selectButtons.map((button, idx) => (
                        <ButtonWrapper
                          key={idx}
                          onClick={() => handleSelectButton(button)}
                        >
                          <ButtonHole>
                            <ButtonInner>
                              <ButtonTop>{button}</ButtonTop>
                            </ButtonInner>
                          </ButtonHole>
                        </ButtonWrapper>
                      ))}
                    </SectionSelectButton>
                  </>
                )}
              </GraphSelectWrapper>
            </SectionGraphSelect>

            <SectionDateSelect>
              <TitleWrapper>
                <SelectSpan>select start date</SelectSpan>
                <SelectSpan>select end date</SelectSpan>
              </TitleWrapper>
              <SelectDataWrapper>
                <SelectDateTop>
                  <SelectSpan>
                    {isSelected[0] ? '-----------------' : displayStart}
                  </SelectSpan>
                </SelectDateTop>
                <SelectDateTop>
                  <SelectSpan>
                    {isSelected[0] ? '-----------------' : displayEnd}
                  </SelectSpan>
                </SelectDateTop>
                <ArrowImg
                  src={'/images/masterCtr-select-btn.svg'}
                  onClick={() => {
                    setOpenGraphSelect(false);
                    setOpenDateSelect(!openDateSelect);
                    isSelected[0] && handleMessage('realTimeGraph');
                  }}
                />
              </SelectDataWrapper>
            </SectionDateSelect>
          </GraphAndDateWrapper>

          <SectionButton>
            <SearchButton onClick={handleSearchButton}>
              <SearchButtonHole>
                <SearchButtonTop>
                  <SelectSpan>search</SelectSpan>
                </SearchButtonTop>
              </SearchButtonHole>
            </SearchButton>
          </SectionButton>
        </SelectHole>
      </SectionSelect>

      <SectionInfo>
        <SectionConsumption>
          <DisplayConsumptionBox
            location={location}
            machine={machine}
            swtName={swtName}
          />
        </SectionConsumption>

        <SectionSwitchTitle>
          <DisplayGraphInfoTitle
            location={location}
            machine={machine}
            swtName={swtName}
            start={isReadyToRender ? displayStart : '-------------'}
            end={isReadyToRender ? displayEnd : '-------------'}
            graph={
              isSelected[0]
                ? graphSelection[0]
                : isSelected[1]
                ? graphSelection[1]
                : isSelected[2]
                ? graphSelection[2]
                : isSelected[3]
                ? graphSelection[3]
                : '------- vs -------'
            }
          />
        </SectionSwitchTitle>
        <SectionTimer>
          <DisplayFaultsTimer
            location={location}
            machine={machine}
            swtName={swtName}
          />
        </SectionTimer>
      </SectionInfo>

      <SectionChart>
        <ChartContainer
          isReadyToRender={isReadyToRender}
          chartOption={isSelected}
          swtName={swtName}
          graph={selectedOne}
          location={location}
          machine={machine}
        />
      </SectionChart>

      <SectionLegend>
        <DisplayLegend
          isReadyToRender={isReadyToRender}
          option={isReadyToRender ? isSelected[0] && true : true}
          swtName={swtName}
          graph={
            isSelected[0] ? 'integrated' : isSelected[1] ? 'energy' : 'data'
          }
        />
      </SectionLegend>

      {openDateSelect && !isSelected[0] && (
        <ScheduleCalendarWrapper>
          <ScheduleCalendar
            handleScheduler={handleSetNewSchedule}
            handleClose={handleClose}
            handleClear={handleClear}
            scheduleList={date}
            noTimePicker={true}
            isToSelectPastDates={true}
          />
        </ScheduleCalendarWrapper>
      )}
    </Wrapper>
  );
};

export default GraphMain;

const Wrapper = styled.div`
  width: 100%;
  height: 488px;

  ${flexDirectionColumn};

  ${(p) =>
    p.positionRelative &&
    css`
      position: relative;
    `}/* border: 1px solid red; */
`;
const SectionSelect = styled.section`
  width: 743px;
  height: 59px;
  border-radius: 30px;

  ${layerB};
  ${flexBoxCenter};
`;

const SelectHole = styled.div`
  width: 738px;
  height: 55px;
  border-radius: 30px;

  ${layerA180Deg};
  ${justifyContentSpaceBetween};
  padding: 0 10px 0 4px;
`;
const GraphAndDateWrapper = styled.div`
  width: 643px;
  height: 47px;
  border-radius: 30px;

  ${layerA};
  ${justifyContentSpaceBetween};
  padding: 0 8px 0 8px;
`;

const SectionGraphSelect = styled.section`
  height: 100%;
  ${flexDirectionColumn};
  padding: 1px 0;
  z-index: 100;
`;

const GraphSelectWrapper = styled.div`
  width: 189px;
  height: 33px;
  border-radius: 25px;

  ${layerA180Deg};
  ${flexBoxCenter};

  ${(p) =>
    p.openGraphSelect &&
    css`
      height: auto;
      flex-direction: column;
      align-items: space;
      padding: 3px 2px 2px 2px;
      border-radius: 15px;
      margin-top: 2px;
    `}
`;

const SelectedOneAndArrowWrapper = styled.div`
  width: 189px;
  ${justifyContentSpaceBetween};
  padding: 0 8px 0 4px;
  ${(p) =>
    p.openGraphSelect &&
    css`
      padding: 0 9px 0 5px;
      margin-bottom: 4px;
    `}
`;

const GraphSelectTop = styled.div`
  width: 152px;
  height: 25px;
  border-radius: 18px;

  ${layerA};
  ${flexBoxCenter};
`;
const ArrowImg = styled.img`
  margin-top: 2px;
  cursor: pointer;
`;

const SelectSpan = styled.span`
  font-size: 8px;

  ${(p) =>
    p.text &&
    css`
      text-transform: capitalize;
    `}
`;

const SectionSelectOption = styled.section`
  width: 100%;
  border-radius: 14px;

  ${layerBDark};
  padding: 2px;

  margin-bottom: 2px;
`;

const SelectOptions = styled.button`
  width: 100%;
  height: 24px;
  border-radius: 16px;
  border: 1px solid #233a54;

  ${justifyContentFlexStart};

  padding: 0 2rem;
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }

  :hover {
    ${layerA};
  }
`;
const RadioButton = styled.div`
  width: 18rem;
  height: 18rem;
  border: 1px solid #95ff45;
  border-radius: 50%;
  ${flexBoxCenter}
`;
const RadioIndicator = styled.div`
  width: 12rem;
  height: 12rem;
  border-radius: 50%;
  /* background-color: #95ff45; */
  background-color: ${(p) => (p.isSelected ? '#95ff45' : 'none')};
`;

const Option = styled.span`
  font-size: 8px;
  margin-left: 5px;
  text-transform: capitalize;
`;

const SectionSelectButton = styled.section`
  width: 100%;
  ${justifyContentSpaceBetween};
`;

const ButtonWrapper = styled.button`
  width: 84px;
  height: 27px;
  border-radius: 18px;

  ${layerBDark};
  ${flexBoxCenter};
`;
const ButtonHole = styled.div`
  width: 82px;
  height: 25px;
  border-radius: 25px;

  ${layerA180Deg};
  ${flexBoxCenter}
`;
const ButtonInner = styled.div`
  width: 74px;
  height: 17px;
  border-radius: 18px;

  ${layerCLighter};
  ${flexBoxCenter};
`;
const ButtonTop = styled.div`
  width: 72px;
  height: 15px;
  border-radius: 25px;

  ${layerA180Deg};
  font-size: 10px;
  ${flexBoxCenter}
`;

const SectionDateSelect = styled.section`
  height: 100%;

  ${flexDirectionColumn};
  padding: 1px 0;
`;
const TitleWrapper = styled.div`
  width: 423px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 30px 0 0;
`;

const SelectDataWrapper = styled.div`
  width: 423px;
  height: 33px;
  border-radius: 20px;

  ${layerA180Deg};
  ${justifyContentSpaceBetween};
  padding: 0 10px 0 5px;
`;
const SelectDateTop = styled.div`
  width: 185px;
  height: 25px;
  border-radius: 18px;

  ${layerA};
  ${flexBoxCenter};
`;

const SectionButton = styled.section`
  width: 63px;
  height: 29px;
  border-radius: 27px;

  ${layerB};
  ${flexBoxCenter}
`;
const SearchButton = styled.button`
  width: 61px;
  height: 27px;
  border-radius: 25px;

  ${layerA180Deg};
  ${flexBoxCenter}
`;

const SearchButtonHole = styled.div`
  width: 55px;
  height: 21px;
  border-radius: 20px;

  ${layerB};
  ${flexBoxCenter};
`;
const SearchButtonTop = styled.div`
  width: 53px;
  height: 19px;
  border-radius: 25px;

  ${layerA180Deg};
  ${flexBoxCenter}
`;

const SectionInfo = styled.section`
  width: 743px;
  ${justifyContentSpaceBetween};
`;
const SectionConsumption = styled.section``;
const SectionSwitchTitle = styled.section``;
const SectionTimer = styled.section``;

const SectionChart = styled.section``;

const SectionLegend = styled.section`
  width: 743px;
`;

const ScheduleCalendarWrapper = styled.div`
  width: 120%;
  height: 100%;
  ${flexBoxCenter};

  position: absolute;
  top: -80px;
  left: -120px;
  z-index: 100;
`;

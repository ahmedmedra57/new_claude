// yarn add @nivo/core @nivo/bar
// install (please make sure versions match peerDependencies)
import { ResponsiveBar } from '@nivo/bar';
import styled, { css } from 'styled-components';
import {
import { useTelemetryChartDataStore } from '../zustand-stores';
  flexBoxCenter,
  justifyContentFlexEnd,
  scrollbarX,
  layerA90Deg,
  layerADark,
  layerBDark,
} from '../../styles/commonStyles';
import { selectTelemetry } from '../../store/slices/telemetrySlice';
import { useState, useEffect, useCallback } from 'react';
import { useESSSwitchStore, useMCStore, useMasterControlSelectStore, useTESSwitchStore, useTGSSwitchStore, useTelemetryStore, useUnitsStore } from '../../zustand-stores';

import { selectTelemetryChartData } from '../../store/slices/telemetryChartDataSlice';
import { selectMC } from '../../store/slices/mCSlice';
import moment from 'moment';
import {
  formatDateTooltip,
  formatTelemetryChartData,
  getSelectedDeviceIds,
  getStartAndEndTimestamps,
} from '../../../helpers/helpers';
import { getTelemetryService } from '../../../services';
import { selectEssSwitch } from '../../store/slices/essSwitchSlice';
import { selectTesSwitch } from '../../store/slices/tesSwitchSlice';
import { selectTgsSwitch } from '../../store/slices/tgsSwitchSlice';
import { selectMasterControls } from '../../store/slices/masterControlSelectSlice';

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const NivoChartCopy = ({
  telemetryData,
  telemetryDataKeys,
  setTelemetryData,
  setTelemetryDataKeys,
  copyTelemetryState,
  copyTelemetryStateKeys,
  copyTelemetryDailyState,
  setCopyTelemetryState,
  setCopyTelemetryDailyState,
  doubleTelemetryData,
  setDoubleTelemetryData,
  doubleTelemetryKeys,
  setDoubleTelemetryKeys,
}) => {
  const styles = {
    fontFamily: 'orbitron',
    fontWeight: '800',
  };

  // ******************************boolean that determines if the search button is clicked or not********************
  const telemetryState = useTelemetryStore();
  const { isSearch, selectChartSystem } = telemetryState;

  const selectionOfSystem = useMCStore();
  const { essDc, tgsTesDc, tesDc, hpDc, tgs, hpGc, ess, tes, hpEc } =
    selectionOfSystem.selectSystem;

  const chartData = useTelemetryChartDataStore();

  const {
    essSwitchData,
    tesSwitchData,
    tgsSwitchData,
    hpElectricData,
    hpGasData,
    doublesSidedChartData,
    intervalUnit,
  } = chartData;

  const { essSwitch } = useESSSwitchStore();
  const { tesSwitch } = useTESSwitchStore();
  const { tgsSwitch } = useTGSSwitchStore();
  const { isF } = useUnitsStore();
  const masterControlSelects = useMasterControlSelectStore();

  // ****************this is state is used to changed the bar system between single and double bars. back end needs to connect the calender so when selected start date and end date has a gap of 2 years, it needs to render double bars*************************

  const [zoom, setZoom] = useState('pointer');
  const [checkChangeOfData, setCheckChangeOfData] = useState(false);

  useEffect(() => {
    if (selectChartSystem === true) {
      setCopyTelemetryState(doublesSidedChartData);

      setDoubleTelemetryData({
        first: doublesSidedChartData.firstYearMonthlyData,
        second: doublesSidedChartData.secondYearMonthlyData,
      });
      setDoubleTelemetryKeys({
        first: doublesSidedChartData.firstYearMonthlyKeys,
        second: doublesSidedChartData.secondYearMonthlyKeys,
      });
      setCopyTelemetryState(doublesSidedChartData);
    }
  }, [selectChartSystem]);

  const tooltipSystemAbr =
    essDc || tgsTesDc || hpDc
      ? 'dc'
      : ess || tes || hpEc
      ? 'ec'
      : (tgs || hpGc) && 'gc';

  const tooltipMeasureUnits =
    essDc || tgsTesDc || hpDc
      ? 'mb'
      : ess || tes || hpEc
      ? 'kw'
      : (tgs || hpGc) && isF
      ? 'FT³'
      : 'M³';

  const colorOfBottomAxisDot = ess
    ? '#83FFFF'
    : tgs
    ? '#FF7800'
    : tes
    ? '#95FF45'
    : essDc || tgsTesDc
    ? '#FF0080'
    : (hpDc || hpEc || hpGc) && '';

  const titleOfLeftAxis =
    essDc || tgsTesDc || hpDc
      ? 'data consumption (mb)'
      : ess || tes || hpDc
      ? 'energy consumption (kw)'
      : `gas consumption (${isF ? 'FT³' : 'M³'})`;

  // ****************************this determines the width of the chart**************

  // const SVG_WIDTH = selectChartSystem
  //   ? 100 * telemetryData.first.length > 1184
  //     ? 100 * telemetryData.first.length
  //     : 1184
  //   : 100 * telemetryData.length > 1184
  //   ? 100 * telemetryData.length
  //   : 1184;

  let SVG_WIDTH = null;
  if (isSearch) {
    if (selectChartSystem) {
      SVG_WIDTH =
        100 * doubleTelemetryData.first.length > 1184
          ? 100 * doubleTelemetryData.first.length
          : 1184;
    } else {
      SVG_WIDTH =
        100 * telemetryData.length > 1184 ? 100 * telemetryData.length : 1184;
    }
  }

  // const SVG_WIDTH = selectChartSystem
  //   ? 100 * telemetryData.firstYearMonthlyData.length > 1184
  //     ? 100 * telemetryData.firstYearMonthlyData.length
  //     : 1184
  //   : 100 * telemetryData.length > 1184
  //   ? 100 * telemetryData.length
  //   : 1184;

  // doublesSidedChartData

  // const SVG_WIDTH =100 * telemetryData.first.length > 1184 ? 100 * telemetryData.first.length : 1184;

  const handleZoomOut = () => {
    if (checkChangeOfData) {
      setTelemetryData(copyTelemetryState);
      setTelemetryDataKeys(copyTelemetryStateKeys);
      setCheckChangeOfData(false);
    }
  };

  //********************************** * function below works with singe chart
  //****************************** */  when clicked on bar to select it, it will change the color of the selected box of the bar + it will check if the zoom state is true or false and sets the right data for use***************************
  const handleClickBar = useCallback(
    (id, selectedData) => {
      // copying the data that was set initially after selecting the switch and time to be modified
      const copyMonthlyData = copyTelemetryState?.map((data) => ({ ...data }));
      const copyDailyData = copyTelemetryDailyState?.map((data) => ({
        ...data,
      }));

      // methods below will modify the copy data above depending where was clicked on the bar and changes the color to red

      if (checkChangeOfData) {
        copyDailyData.filter((value) => {
          if (value.switch === selectedData.switch) {
            return setTelemetryData(
              copyDailyData,
              (value[`${id}Color`] = 'red')
            );
          }
        });
      } else {
        copyMonthlyData.filter((value) => {
          if (value.switch === selectedData.switch) {
            return setTelemetryData(
              copyMonthlyData,
              (value[`${id}Color`] = 'red')
            );
          }
        });
      }

      const handleZoomIn = (swtSwitch, swtName, category) => {
        if (!checkChangeOfData) {
          const deviceIds = getSelectedDeviceIds(
            masterControlSelects,
            swtSwitch,
            swtName
          );
          const { start: startDate, end: endDate } = getStartAndEndTimestamps(
            id,
            intervalUnit
          );

          getTelemetryService({ deviceIds, startDate, endDate, category }).then(
            ({ data }) => {
              const { intervalData, intervalKeys } = formatTelemetryChartData(
                data,
                swtName,
                swtSwitch,
                isF
              );

              setTelemetryData(intervalData);
              setTelemetryDataKeys(intervalKeys);
              setCheckChangeOfData(true);
            }
          );
        }
      };

      const handleZoomOut = () => {
        setTelemetryData(copyTelemetryState);
        setTelemetryDataKeys(copyTelemetryStateKeys);
        setCheckChangeOfData(false);
      };

      if (zoom === 'zoomIn') {
        if (ess) {
          handleZoomIn(essSwitch, 'ess', 'energy');
        } else if (tgs) {
          handleZoomIn(tgsSwitch, 'tgs', 'fuel');
        } else if (tes) {
          handleZoomIn(tesSwitch, 'tes', 'energy');
        } else if (hpGc) {
          return (
            setTelemetryData(hpGasData.dailyData),
            setTelemetryDataKeys(hpGasData.dailyKeys),
            setCheckChangeOfData(true)
          );
        } else if (hpEc) {
          return (
            setTelemetryData(hpElectricData.dailyData),
            setTelemetryDataKeys(hpElectricData.dailyKeys),
            setCheckChangeOfData(true)
          );
        }
        // setTelemetryData(telemetryData.dailyData);
        // setTelemetryDataKeys(telemetryData.dailyKeys);
        // setCheckChangeOfData(true);
      } else if (zoom === 'zoomOut') {
        if (ess) {
          handleZoomOut();
        } else if (tgs) {
          handleZoomOut();
        } else if (tes) {
          handleZoomOut();
        } else if (hpGc) {
          return (
            setTelemetryData(hpGasData.monthlyData),
            setTelemetryDataKeys(hpGasData.monthlyKeys),
            setCheckChangeOfData(false)
          );
        } else if (hpEc) {
          return (
            setTelemetryData(hpElectricData.monthlyData),
            setTelemetryDataKeys(hpElectricData.monthlyKeys),
            setCheckChangeOfData(false)
          );
        }
        // setTelemetryDataKeys(telemetryData.monthlyKeys);
        // setTelemetryData(telemetryData.monthlyData);
        // setCheckChangeOfData(false);
      }
    },
    [telemetryData, zoom]
  );

  //************************** */ 2 functions below works with double charts**************************

  const handleClickFirstBar = useCallback(
    (id, selectedData) => {
      // copying the data that was set initially after selecting the switch and time to be modified
      const copyFirstYearMonthlyData =
        copyTelemetryState.firstYearMonthlyData?.map((data) => ({ ...data }));
      const copyFirstYearDailyData = copyTelemetryState.firstYearDailyData?.map(
        (data) => ({ ...data })
      );
      const copySecondYearMonthlyData =
        copyTelemetryState.secondYearMonthlyData?.map((data) => ({ ...data }));
      const copySecondYearDailyData =
        copyTelemetryState.secondYearDailyData?.map((data) => ({ ...data }));

      // methods below will modify the copy data above depending where was clicked on the bar and changes the color to red

      if (checkChangeOfData) {
        const newCopyData = {
          first: copyFirstYearDailyData,
          second: copySecondYearDailyData,
        };
        newCopyData.first.filter((value) => {
          if (value.switch === selectedData.switch) {
            return setDoubleTelemetryData(
              newCopyData,
              (value[`${id}Color`] = 'red')
            );
          }
        });
      } else {
        const newCopyData = {
          first: copyFirstYearMonthlyData,
          second: copySecondYearMonthlyData,
        };
        newCopyData.first.filter((value) => {
          if (value.switch === selectedData.switch) {
            return setDoubleTelemetryData(
              newCopyData,
              (value[`${id}Color`] = 'red')
            );
          }
        });
      }

      //****************  call api and set the data in a state
      if (zoom === 'zoomIn') {
        setDoubleTelemetryData({
          first: copyTelemetryState.firstYearDailyData,
          second: copyTelemetryState.secondYearDailyData,
        });
        setDoubleTelemetryKeys({
          first: copyTelemetryState.firstYearDailyKeys,
          second: copyTelemetryState.secondYearDailyKeys,
        });
        setCheckChangeOfData(true);
      } else if (zoom === 'zoomOut') {
        setDoubleTelemetryKeys({
          first: copyTelemetryState.firstYearMonthlyKeys,
          second: copyTelemetryState.secondYearMonthlyKeys,
        });
        setDoubleTelemetryData({
          first: copyTelemetryState.firstYearMonthlyData,
          second: copyTelemetryState.secondYearMonthlyData,
        });
        setCheckChangeOfData(false);
      }
    },
    [doubleTelemetryData, zoom]
  );

  // ********************** bottom chart of double charts**********************
  const handleClickSecondBar = useCallback(
    (id, selectedData) => {
      // copying the data that was set initially after selecting the switch and time to be modified
      const copyFirstYearMonthlyData =
        copyTelemetryState.firstYearMonthlyData?.map((data) => ({ ...data }));
      const copyFirstYearDailyData = copyTelemetryState.firstYearDailyData?.map(
        (data) => ({ ...data })
      );
      const copySecondYearMonthlyData =
        copyTelemetryState.secondYearMonthlyData?.map((data) => ({ ...data }));
      const copySecondYearDailyData =
        copyTelemetryState.secondYearDailyData?.map((data) => ({ ...data }));

      // methods below will modify the copy data above depending where was clicked on the bar and changes the color to red

      if (checkChangeOfData) {
        const newCopyData = {
          first: copyFirstYearDailyData,
          second: copySecondYearDailyData,
        };
        newCopyData.second.filter((value) => {
          if (value.switch === selectedData.switch) {
            return setDoubleTelemetryData(
              newCopyData,
              (value[`${id}Color`] = 'red')
            );
          }
        });
      } else {
        const newCopyData = {
          second: copySecondYearMonthlyData,
          first: copyFirstYearMonthlyData,
        };

        newCopyData.second.filter((value) => {
          if (value.switch === selectedData.switch) {
            return setDoubleTelemetryData(
              newCopyData,
              (value[`${id}Color`] = 'red')
            );
          }
        });
      }

      // call api and set the new data base in a state because the bar has been either zoomed to from month to daily or daily to hourly, etc.
      if (zoom === 'zoomIn') {
        setDoubleTelemetryData({
          first: copyTelemetryState.firstYearDailyData,
          second: copyTelemetryState.secondYearDailyData,
        });
        setDoubleTelemetryKeys({
          first: copyTelemetryState.firstYearDailyKeys,
          second: copyTelemetryState.secondYearDailyKeys,
        });
        setCheckChangeOfData(true);
      } else if (zoom === 'zoomOut') {
        setDoubleTelemetryKeys({
          first: copyTelemetryState.firstYearMonthlyKeys,
          second: copyTelemetryState.secondYearMonthlyKeys,
        });
        setDoubleTelemetryData({
          first: copyTelemetryState.firstYearMonthlyData,
          second: copyTelemetryState.secondYearMonthlyData,
        });
        setCheckChangeOfData(false);
      }
    },
    [doubleTelemetryData, zoom]
  );

  //*********************single sided chart*****************

  // this sets the Y line position between the bars and the placement of both containers beside the bars
  const lineAndBarXPosition =
    telemetryData.length === 10
      ? { first: 20, second: 200, third: 75, fourth: 55, fifth: 205 }
      : telemetryData.length === 9
      ? { first: 22, second: 198, third: 83, fourth: 60, fifth: 210 }
      : telemetryData.length === 8
      ? { first: 24, second: 196, third: 91, fourth: 65, fifth: 215 }
      : telemetryData.length === 7
      ? { first: 22, second: 198, third: 105, fourth: 75, fifth: 225 }
      : telemetryData.length === 6
      ? { first: 22, second: 198, third: 125, fourth: 90, fifth: 240 }
      : telemetryData.length === 5
      ? { first: 22, second: 198, third: 150, fourth: 100, fifth: 250 }
      : telemetryData.length === 4
      ? { first: 22, second: 198, third: 180, fourth: 120, fifth: 270 }
      : telemetryData.length === 3
      ? { first: 22, second: 198, third: 230, fourth: 150, fifth: 300 }
      : telemetryData.length === 2
      ? { first: 22, second: 198, third: 300, fourth: 205, fifth: 355 }
      : telemetryData.length === 1
      ? { first: 22, second: 198, third: 700, fourth: 330, fifth: 480 }
      : { first: 20, second: 200, third: 65, fourth: 50, fifth: 200 };

  const CustomYLines = ({ bars }) => {
    return bars.map((bar, idx) => {
      const rotationTEC = `rotate(-90 ${bar.x - 10} 202)`;
      const rotationTHU = `rotate(-90 ${bar.x + 45} 187.5)`;

      return (
        <div key={idx}>
          {!bar.data.data.totalEnergyConsumption ? (
            ''
          ) : (
            <>
              <rect
                width='10'
                height='100'
                x={bar.x - lineAndBarXPosition.first}
                y={108}
                stroke='#1B2B44'
                strokeWidth='2'
                fill='#233a54'
              ></rect>

              <text
                x={bar.x - 14}
                y={lineAndBarXPosition.second}
                fill={bar.data.data.barColor}
                fontSize={8}
                transform={rotationTEC}
                z-index={2}
              >
                {bar.data.data.totalEnergyConsumption}
              </text>
            </>
          )}

          <line
            key={bar.key}
            x1={bar.x + lineAndBarXPosition.third}
            y1={210}
            x2={bar.x + lineAndBarXPosition.third}
            y2={0}
            stroke='#fff'
            strokeWidth={1.5}
            style={{ pointerEvents: 'none' }}
          />
          {!bar.data.data.totalUsageHours ? (
            ''
          ) : (
            <>
              <rect
                width='10'
                height={100}
                x={bar.x + lineAndBarXPosition.fourth}
                y={108}
                stroke='#1B2B44'
                strokeWidth='2'
                fill='#233a54'
              ></rect>
              <text
                x={bar.x + 26}
                y={lineAndBarXPosition.fifth}
                fill={bar.data.data.barColor}
                fontSize={8}
                transform={rotationTHU}
                z-index={2}
              >
                {bar.data.data.totalUsageHours}
              </text>
            </>
          )}
        </div>
      );
    });
  };

  // const CustomYLines = ({ bars }) => {
  //   return bars.map((bar) => {
  //     const rotationTEC = `rotate(-90 ${bar.x - 10} 202)`;
  //     const rotationTHU = `rotate(-90 ${bar.x + 45} 187.5)`;

  //     return (
  //       <>
  //         {!bar.data.data.totalEnergyConsumption ? (
  //           ''
  //         ) : (
  //           <>
  //             <rect
  //               width='10'
  //               height='100'
  //               x={bar.x - 20}
  //               y={108}
  //               stroke='#1B2B44'
  //               strokeWidth='2'
  //               fill='#233a54'
  //             ></rect>

  //             <text
  //               x={bar.x - 14}
  //               y={200}
  //               fill={bar.data.data.barColor}
  //               fontSize={8}
  //               transform={rotationTEC}
  //               z-index={2}
  //             >
  //               {bar.data.data.totalEnergyConsumption}
  //             </text>
  //           </>
  //         )}

  //         <line
  //           key={bar.key}
  //           x1={bar.x + 65}
  //           y1={216}
  //           x2={bar.x + 65}
  //           y2={0}
  //           stroke='#fff'
  //           strokeWidth={1.5}
  //           style={{ pointerEvents: 'none' }}
  //         />
  //         {!bar.data.data.totalUsageHours ? (
  //           ''
  //         ) : (
  //           <>
  //             <rect
  //               width='10'
  //               height={100}
  //               x={bar.x + 50}
  //               y={108}
  //               stroke='#1B2B44'
  //               strokeWidth='2'
  //               fill='#233a54'
  //             ></rect>
  //             <text
  //               x={bar.x + 26}
  //               y={200}
  //               fill={bar.data.data.barColor}
  //               fontSize={8}
  //               transform={rotationTHU}
  //               z-index={2}
  //             >
  //               {bar.data.data.totalUsageHours}
  //             </text>
  //           </>
  //         )}
  //       </>
  //     );
  //   });
  // };

  //************************double sided chart*******************************
  const CustomYLinesTopChart = ({ bars }) => {
    return bars.map((bar, index) => {
      const rotationTEC = `rotate(-90 ${bar.x - 10} 202)`;
      const rotationTHU = `rotate(-90 ${bar.x + 45} 187.5)`;

      return (
        <g key={index}>
          {!bar.data.data.totalEnergyConsumption ? (
            ''
          ) : (
            <>
              <rect
                width='10'
                height='100'
                x={bar.x - 14}
                y={128}
                stroke='#1B2B44'
                strokeWidth='2'
                fill='#233a54'
              ></rect>

              <text
                x={bar.x - 34}
                y={206}
                fill={bar.color}
                fontSize={8}
                transform={rotationTEC}
                z-index={2}
              >
                {bar.data.data.totalEnergyConsumption}
              </text>
            </>
          )}

          <line
            key={bar.key}
            x1={bar.x + 65}
            y1={230}
            x2={bar.x + 65}
            y2={0}
            stroke='#fff'
            strokeWidth={1.5}
            style={{ pointerEvents: 'none' }}
          />
          {!bar.data.data.totalUsageHours ? (
            ''
          ) : (
            <>
              <rect
                width='10'
                height={100}
                x={bar.x + 44}
                y={130}
                stroke='#1B2B44'
                strokeWidth='2'
                fill='#233a54'
              ></rect>
              <text
                x={bar.x + 6}
                y={194}
                fill={bar.color}
                fontSize={8}
                transform={rotationTHU}
                z-index={2}
              >
                {bar.data.data.totalUsageHours}
              </text>
            </>
          )}
        </g>
      );
    });
  };

  //**************************** double sided charts****************************
  const CustomYLinesBottomChart = ({ bars }) => {
    return bars.map((bar, index) => {
      const rotationTEC = `rotate(-90 ${bar.x - 10} 202)`;
      const rotationTHU = `rotate(-90 ${bar.x + 45} 187.5)`;

      return (
        <g key={index}>
          {!bar.data.data.totalEnergyConsumption ? (
            ''
          ) : (
            <>
              <rect
                width='10'
                height='100'
                x={bar.x - 15}
                y={0}
                stroke='#1B2B44'
                strokeWidth='2'
                fill='#233a54'
              ></rect>

              <text
                x={bar.x + 94}
                y={205}
                fill={bar.color}
                fontSize={8}
                transform={rotationTEC}
                z-index={2}
              >
                {bar.data.data.totalEnergyConsumption}
              </text>
            </>
          )}

          <line
            key={bar.key}
            x1={bar.x + 65}
            y1={231}
            x2={bar.x + 65}
            y2={0}
            stroke='#fff'
            strokeWidth={1.5}
            style={{ pointerEvents: 'none' }}
          />
          {!bar.data.data.totalUsageHours ? (
            ''
          ) : (
            <>
              <rect
                width='10'
                height={100}
                x={bar.x + 44}
                y={0}
                stroke='#1B2B44'
                strokeWidth='2'
                fill='#233a54'
              ></rect>
              <text
                x={bar.x + 135}
                y={194}
                fill={bar.color}
                fontSize={8}
                transform={rotationTHU}
                z-index={2}
              >
                {bar.data.data.totalUsageHours}
              </text>
            </>
          )}
        </g>
      );
    });
  };
  //**************************** double sided charts****************************

  const CustomLabels = ({ bars }) => {
    // const removedDuplicateData = [
    //   ...new Map(bars.map((m) => [m.x, m])).values(),
    // ];

    // return removedDuplicateData.map((data) => {
    //   const rotationTEC = `rotate(-90 ${data.x - 10} 202)`;
    //   return (
    //     <>
    //       <rect
    //         height='10'
    //         width='100'
    //         x={data.x - 25}
    //         y={-15}
    //         stroke='#1B2B44'
    //         stroke-width='2'
    //         fill='#233a54'
    //         padding={2}
    //       ></rect>
    //       <text
    //         x={data.x - 20}
    //         y={-6.5}
    //         fill={data.data.data[data.data.id + 'Color']}
    //         font-size={8}
    //         // transform={rotationTEC}
    //         z-index={2}
    //       >
    //         {data.data.data.month}
    //       </text>
    //     </>

    // );

    // });

    return (
      <>
        {/* <rect
          height='40'
          width='500'
          x={0}
          y={-15}
          stroke='#1B2B44'
          stroke-width='2'
          fill='#233a54'
          padding={2}
        ></rect> */}
        <text x={0} y={-10} fill={bars[0]?.color} fontSize={12} z-index={2}>
          {bars[0]?.data.data.month}
        </text>
      </>
    );
  };

  const CustomLabelsBottomChart = ({ bars }) => {
    // const removedDuplicateData = [
    //   ...new Map(bars.map((m) => [m.x, m])).values(),
    // ];

    // return removedDuplicateData.map((data) => {
    //   const rotationTEC = `rotate(-90 ${data.x - 10} 202)`;
    //   return (
    //     <>
    //       <rect
    //         height='10'
    //         width='100'
    //         x={data.x - 25}
    //         y={-15}
    //         stroke='#1B2B44'
    //         stroke-width='2'
    //         fill='#233a54'
    //         padding={2}
    //       ></rect>
    //       <text
    //         x={data.x - 20}
    //         y={-6.5}
    //         fill={data.data.data[data.data.id + 'Color']}
    //         font-size={8}
    //         // transform={rotationTEC}
    //         z-index={2}
    //       >
    //         {data.data.data.month}
    //       </text>
    //     </>

    // );

    // });

    return (
      <>
        {/* <rect
          height='40'
          width='500'
          x={0}
          y={-15}
          stroke='#1B2B44'
          stroke-width='2'
          fill='#233a54'
          padding={2}
        ></rect> */}
        <text x={0} y={250} fill={bars[0]?.color} font-size={12} z-index={2}>
          {bars[0]?.data.data.month}
        </text>
      </>
    );
  };

  const getTspanGroups = (value) => {
    return (
      <>
        <tspan>{value}</tspan>
      </>
    );
  };

  return (
    <>
      {isSearch ? (
        <ShadowWrapper1>
          <Wrapper>
            <ScrollbarContainer containerHeight={selectChartSystem}>
              <BarWrapper
                className='telemetry-chart'
                width={SVG_WIDTH}
                style={styles}
                zoom={zoom}
                containerHeight={selectChartSystem}
                onClick={() => setZoom('pointer')}
              >
                {selectChartSystem ? (
                  <>
                    <ResponsiveBar
                      height={310}
                      data={doubleTelemetryData.first}
                      keys={doubleTelemetryKeys.first}
                      indexBy={(_index) => _index.switch}
                      margin={{ top: 30, right: 30, bottom: 50, left: 60 }}
                      padding={0.55}
                      valueScale={{ type: 'linear' }}
                      indexScale={{ type: 'band', round: false }}
                      colors={({ id, data }) => data[`${id}Color`]}
                      valueFormat=' >-10'
                      onClick={({ id, data }) => handleClickFirstBar(id, data)}
                      label={({ id }) =>
                        checkChangeOfData
                          ? ''
                          : id === 'june' || id === 'july'
                          ? id.split('')[0].concat(id.split('')[2])
                          : id.split('')[0]
                      }
                      labelSkipWidth={8}
                      labelSkipHeight={8}
                      labelTextColor='#1b2b44'
                      labelFontFamily='Orbitron'
                      labelFontWeight={800}
                      enableGridX={false}
                      gridXValues={0.5}
                      borderWidth={1}
                      borderColor={{
                        from: 'color',
                        modifiers: [['darker', 1.6]],
                      }}
                      axisTop={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        // legend: 'switch',
                        legendPosition: 'middle',
                        legendOffset: 32,
                        renderTick: ({ x, y }) => {
                          return <g transform={`translate(${x},${y})`}></g>;
                        },
                      }}
                      axisRight={null}
                      axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        // legend: 'switch',
                        legendPosition: 'middle',
                        legendOffset: 32,
                        renderTick: ({
                          textAnchor,
                          textBaseline,
                          textX,
                          textY,
                          value,
                          x,
                          y,
                        }) => {
                          const switchName = value.split(' - ');
                          return (
                            <g transform={`translate(${x},${y})`}>
                              <circle
                                alignmentBaseline={textBaseline}
                                textAnchor={textAnchor}
                                transform={`translate(${
                                  textX - switchName[0].length * 3 - 8
                                },${textY + 26})`}
                                // transform={`translate(${textX - 34},${
                                //   textY + 26
                                // })`}
                                r={4}
                                fill={`${colorOfBottomAxisDot}`}
                              ></circle>

                              <text
                                alignmentBaseline={textBaseline}
                                textAnchor={textAnchor}
                                transform={`translate(${textX - 10},${
                                  textY + 28
                                })`}
                                fontSize={8}
                                fill={'#fff'}
                              >
                                {getTspanGroups(switchName[0])}
                              </text>
                              <text
                                alignmentBaseline={textBaseline}
                                textAnchor={textAnchor}
                                transform={`translate(${textX},${textY + 35})`}
                                fontSize={8}
                                fill={'#fff'}
                              >
                                {getTspanGroups(switchName[1])}
                              </text>
                            </g>
                          );
                        },
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: `${titleOfLeftAxis}`,
                        legendPosition: 'middle',
                        legendOffset: -50,
                      }}
                      theme={{
                        fontFamily: 'orbitron',
                        fontWeight: 800,
                        axis: {
                          legend: {
                            text: {
                              fill: '#ffff',
                              fontFamily: 'orbitron',
                              fontWeight: 800,
                            },
                          },

                          tickColor: '#eee',
                          ticks: {
                            line: {
                              stroke: '#ffff',
                              strokeWidth: 1,
                            },
                            text: {
                              fill: '#ffff',
                              fontFamily: 'orbitron',
                              fontWeight: 800,
                            },
                          },
                          domain: {
                            line: {
                              stroke: '#777777',
                              strokeWidth: 2,
                              strokeDasharray: 'solid',
                            },
                          },
                        },

                        grid: {
                          line: {
                            stroke: '#ffff',
                            strokeWidth: 1,
                          },
                        },
                      }}
                      tooltip={({ id, value, data }) => (
                        <div
                          style={{
                            width: '144px',
                            height: 'auto',
                            position: 'absolute',
                            top: '-15px',
                            left: '15px',
                            padding: 2,
                            border: '2px solid #1B2B44',
                            background: '#233A54',
                            fontSize: 8,
                          }}
                        >
                          <span>{data.switch}</span>
                          <br />
                          {moment(id).format(formatDateTooltip(intervalUnit))}
                          <br />
                          <span>
                            ({`${tooltipSystemAbr}`}: {value}{' '}
                            {`${tooltipMeasureUnits}`})
                          </span>
                          <br />
                          <span>hours of usage: {data[`${id}THU`]}</span>
                          <br />
                        </div>
                      )}
                      layers={[
                        'grid',
                        'markers',
                        'areas',
                        CustomYLinesTopChart,
                        checkChangeOfData && CustomLabels,
                        'lines',
                        'slices',
                        'axes',
                        'bars',
                        'points',
                        'legends',
                      ]}
                    />
                    <ResponsiveBar
                      height={310}
                      data={doubleTelemetryData.second}
                      keys={doubleTelemetryKeys.second}
                      indexBy={(_index) => _index.switch}
                      margin={{ top: 30, right: 30, bottom: 50, left: 60 }}
                      padding={0.55}
                      valueScale={{ type: 'linear' }}
                      indexScale={{ type: 'band', round: true }}
                      colors={({ id, data }) => data[`${id}Color`]}
                      valueFormat=' >-10'
                      reverse={true}
                      onClick={({ id, data }) => handleClickSecondBar(id, data)}
                      label={({ id }) =>
                        checkChangeOfData
                          ? ''
                          : id === 'june' || id === 'july'
                          ? id.split('')[0].concat(id.split('')[2])
                          : id.split('')[0]
                      }
                      labelSkipWidth={8}
                      labelSkipHeight={8}
                      labelTextColor='#1b2b44'
                      labelFontFamily='Orbitron'
                      labelFontWeight={800}
                      enableGridX={false}
                      gridXValues={0.5}
                      borderWidth={1}
                      borderColor={{
                        from: 'color',
                        modifiers: [['darker', 1.6]],
                      }}
                      axisTop={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        // legend: 'switch',
                        legendPosition: 'middle',
                        legendOffset: 32,
                        renderTick: ({ x, y }) => {
                          return <g transform={`translate(${x},${y})`}></g>;
                        },
                      }}
                      axisRight={null}
                      axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        // legend: 'switch',
                        legendPosition: 'middle',
                        legendOffset: 32,
                        renderTick: ({ x, y }) => {
                          return <g transform={`translate(${x},${y})`}></g>;
                        },
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,

                        legend: `${titleOfLeftAxis}`,
                        legendPosition: 'middle',
                        legendOffset: -50,
                      }}
                      theme={{
                        fontFamily: 'orbitron',
                        fontWeight: 800,
                        axis: {
                          legend: {
                            text: {
                              fill: '#ffff',
                              fontFamily: 'orbitron',
                              fontWeight: 800,
                            },
                          },

                          tickColor: '#eee',
                          ticks: {
                            line: {
                              stroke: '#ffff',
                              strokeWidth: 1,
                            },
                            text: {
                              fill: '#ffff',
                              fontFamily: 'orbitron',
                              fontWeight: 800,
                            },
                          },
                          domain: {
                            line: {
                              stroke: '#777777',
                              strokeWidth: 2,
                              strokeDasharray: 'solid',
                            },
                          },
                        },

                        grid: {
                          line: {
                            stroke: '#ffff',
                            strokeWidth: 1,
                          },
                        },
                      }}
                      tooltip={({ id, value, data }) => (
                        <div
                          style={{
                            width: '144px',
                            height: 'auto',
                            position: 'absolute',
                            top: '-15px',
                            left: '15px',
                            padding: 2,
                            border: '2px solid #1B2B44',
                            background: '#233A54',
                            fontSize: 8,
                          }}
                        >
                          <span>{data.switch}</span>
                          <br />
                          {moment(id).format(formatDateTooltip(intervalUnit))}
                          <br />
                          <span>
                            ({`${tooltipSystemAbr}`}: {value}{' '}
                            {`${tooltipMeasureUnits}`})
                          </span>
                          <br />
                          <span>hours of usage: {data[`${id}THU`]}</span>
                          <br />
                        </div>
                      )}
                      layers={[
                        'grid',
                        'markers',
                        'areas',
                        CustomYLinesBottomChart,
                        checkChangeOfData && CustomLabelsBottomChart,
                        'lines',
                        'slices',
                        'axes',
                        'bars',
                        'points',
                        'legends',
                      ]}
                    />
                  </>
                ) : (
                  <>
                    <ResponsiveBar
                      data={telemetryData}
                      keys={telemetryDataKeys}
                      indexBy={(_index) => _index.switch}
                      margin={{ top: 30, right: 30, bottom: 50, left: 60 }}
                      padding={0.55}
                      valueScale={{ type: 'linear' }}
                      indexScale={{ type: 'band', round: true }}
                      colors={({ id, data }) => data[`${id}Color`]}
                      valueFormat=' >-10'
                      onClick={({ id, data }) => handleClickBar(id, data)}
                      label={({ id }) =>
                        checkChangeOfData
                          ? ''
                          : `${essDc}` ||
                            `${tgsTesDc}` ||
                            `${tesDc}` ||
                            `${hpDc}`
                          ? ''
                          : id === 'june' || id === 'july'
                          ? id.split('')[0].concat(id.split('')[2])
                          : id.split('')[0]
                      }
                      labelSkipWidth={8}
                      labelSkipHeight={8}
                      labelTextColor='#1b2b44'
                      labelFontFamily='Orbitron'
                      labelFontWeight={800}
                      enableGridX={false}
                      gridXValues={0.5}
                      borderWidth={1}
                      borderColor={{
                        from: 'color',
                        modifiers: [['darker', 1.6]],
                      }}
                      axisTop={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        // legend: 'switch',
                        legendPosition: 'middle',
                        legendOffset: 32,
                        renderTick: ({ x, y }) => {
                          return <g transform={`translate(${x},${y})`}></g>;
                        },
                      }}
                      axisRight={null}
                      axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        // legend: 'switch',
                        legendPosition: 'middle',
                        legendOffset: 32,
                        renderTick: ({
                          textAnchor,
                          textBaseline,
                          textX,
                          textY,
                          value,
                          x,
                          y,
                          data,
                        }) => {
                          const switchName = value.split(' - ');
                          return (
                            <g transform={`translate(${x},${y})`}>
                              <circle
                                alignmentBaseline={textBaseline}
                                textAnchor={textAnchor}
                                // transform={`translate(${textX - 50},${
                                //   textY - 1
                                // })`}
                                transform={`translate(${
                                  textX - switchName[0].length * 3 - 8
                                },${textY - 1})`}
                                r={4}
                                fill={`${colorOfBottomAxisDot}`}
                              ></circle>

                              <text
                                alignmentBaseline={textBaseline}
                                textAnchor={textAnchor}
                                // transform={`translate(${textX - 10},${
                                //   textY + 3
                                // })`}
                                transform={`translate(${textX},${textY + 3})`}
                                fontSize={8}
                                fill={'#fff'}
                              >
                                {getTspanGroups(switchName[0])}
                              </text>
                              <text
                                alignmentBaseline={textBaseline}
                                textAnchor={textAnchor}
                                transform={`translate(${textX},${textY + 15})`}
                                fontSize={8}
                                fill={'#fff'}
                              >
                                {getTspanGroups(switchName[1])}
                              </text>
                            </g>
                          );
                        },
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,

                        legend: `${titleOfLeftAxis}`,
                        legendPosition: 'middle',
                        legendOffset: -50,
                      }}
                      theme={{
                        fontFamily: 'orbitron',
                        fontWeight: 800,
                        axis: {
                          legend: {
                            text: {
                              fill: '#ffff',
                              fontFamily: 'orbitron',
                              fontWeight: 800,
                            },
                          },

                          tickColor: '#eee',
                          ticks: {
                            line: {
                              stroke: '#ffff',
                              strokeWidth: 1,
                            },
                            text: {
                              fill: '#ffff',
                              fontFamily: 'orbitron',
                              fontWeight: 800,
                            },
                          },
                          domain: {
                            line: {
                              stroke: '#777777',
                              strokeWidth: 2,
                              strokeDasharray: 'solid',
                            },
                          },
                        },

                        grid: {
                          line: {
                            stroke: '#ffff',
                            strokeWidth: 1,
                          },
                        },
                      }}
                      tooltip={({ id, value, data }) => (
                        <div
                          style={{
                            width: '144px',
                            height: 'auto',
                            position: 'absolute',
                            top: '-15px',
                            left: '15px',
                            padding: 2,
                            border: '2px solid #1B2B44',
                            background: '#233A54',
                            fontSize: 8,
                          }}
                        >
                          <span>{data.switch}</span>
                          <br />
                          {moment(id).format(formatDateTooltip(intervalUnit))}

                          {/* essDc, tgsDc, tesDc, hpDc, tgs, hpGc, ess, tes, hpEc  */}

                          <br />

                          <span>
                            ({`${tooltipSystemAbr}`}: {value}{' '}
                            {`${tooltipMeasureUnits}`})
                          </span>
                          <br />
                          {!(essDc || tgsTesDc || tesDc) && (
                            <>
                              <span>hours of usage: {data[`${id}THU`]}</span>
                              <br />
                            </>
                          )}
                        </div>
                      )}
                      layers={[
                        'grid',
                        'markers',
                        'areas',
                        CustomYLines,
                        checkChangeOfData && CustomLabels,
                        'lines',
                        'slices',
                        'axes',
                        'bars',
                        'points',
                        'legends',
                      ]}
                    />
                  </>
                )}
              </BarWrapper>
            </ScrollbarContainer>

            {essDc || tgsTesDc || tesDc || hpDc ? (
              ''
            ) : (
              <ZoomContainer>
                <Img
                  src={'./images/zoomButtonMinus.svg'}
                  onClick={handleZoomOut}
                  // enableGreenBorder={zoom}
                />
                <Span>zoom</Span>
                <Img
                  src={'./images/zoomButtonPlus.svg'}
                  onClick={() => setZoom('zoomIn')}
                  enableGreenBorder={zoom}
                />
              </ZoomContainer>
            )}
          </Wrapper>
        </ShadowWrapper1>
      ) : (
        <ShadowWrapper>
          <img src={'./images/noDataTelemetryChart.svg'} />
        </ShadowWrapper>
      )}
    </>
  );
};

export default NivoChartCopy;

const ShadowWrapper1 = styled.div`
  width: 1202px;
  height: auto;
  padding-top: 2px;
  padding-bottom: 2px;

  ${layerBDark}

  border-radius: 5px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Wrapper = styled.div`
  width: 1198px;
  height: auto;
  padding-bottom: 4px;
  ${layerA90Deg}

  border-radius: 4px;
  opacity: 1;
  display: flex;
  flex-direction: column;
  ${flexBoxCenter}
`;

const ScrollbarContainer = styled.div`
  width: 1190px;

  height: ${({ containerHeight }) => (containerHeight ? '650px' : '310px')};
  margin-top: 4px;

  ${scrollbarX}

  opacity: 1;
`;

const BarWrapper = styled.div`
  width: ${({ width }) => width}px;
  height: 98%;

  ${({ zoom }) =>
    zoom === 'pointer'
      ? 'cursor:pointer '
      : zoom === 'zoomIn'
      ? 'cursor:zoom-in'
      : 'cursor:zoom-out'};

  ${layerADark}

  border-radius: 3px;
  ${flexBoxCenter};
  flex-direction: column;
`;

const ShadowWrapper = styled.div`
  width: 1202px;
  height: 150px;

  ${layerBDark}

  border-radius: 5px;
  opacity: 1;
  ${flexBoxCenter}
`;

const ZoomContainer = styled.div`
  width: 98%;
  height: 28px;
  margin-top: 8px;
  ${justifyContentFlexEnd}
`;

const Img = styled.img`
  width: fit-content;
  border-radius: 50%;
  cursor: pointer;
  ${({ enableGreenBorder }) =>
    enableGreenBorder === 'zoomOut'
      ? css`
           {
            &:first-child {
              border: 1px solid #95ff45;
            }
          }
        `
      : enableGreenBorder === 'zoomIn' &&
        css`
           {
            &:last-child {
              border: 1px solid #95ff45;
            }
          }
        `};
`;

const Span = styled.span`
  font-size: 10px;
  margin-left: 8px;
  margin-right: 8px;
`;

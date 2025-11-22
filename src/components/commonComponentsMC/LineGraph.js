import { useSelector } from 'react-redux';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceArea,
} from 'recharts';
import moment from 'moment';

import styled from 'styled-components';
import { flexBoxCenter } from '../styles/commonStyles';
import { selectUnits } from '../store/slices/settings/unitsSlice';
import { useMemo } from 'react';
import { convertCelsiusToFahrenheit, formatDateTooltip, formatDateXAxis } from '../../helpers/helpers';
import { selectEssSwitch } from '../store/slices/essSwitchSlice';
import { selectTgsSwitch } from '../store/slices/tgsSwitchSlice';
import { selectTesSwitch } from '../store/slices/tesSwitchSlice';

const LineGraph = ({ swtName, location, machine, realTime }) => {
  const { essSwitch, tgsSwitch, tesSwitch,flatEssSwitch,flatTgsSwitch,flatTesSwitch } = useSelector(
    swtName === 'ess'
      ? selectEssSwitch
      : swtName === 'tgs'
        ? selectTgsSwitch
        : selectTesSwitch
  );
  const swtStatus = swtName === 'ess' ? flatEssSwitch : swtName === 'tgs' ? flatTgsSwitch : flatTesSwitch;
  const {
    thermocouple,
    graphDateData,
  } = swtStatus[location][machine];
  const {
    outsideGraphData,
    enclosureGraphData,
    heaterGraphData,
    gasGraphData,
    snowGraphData,
    windGraphData,
    intervalUnit,
  } = realTime ? swtStatus[location][machine] : graphDateData;
  const { isF } = useSelector(selectUnits);
  const isGas = swtName === 'tgs';
  const configuration = swtName === 'ess' ? 'ess' : 'tgs/tes';
  const { locationName, machineName } = swtStatus[location][machine];
  const sortedValues = (type) => {
    // type: 0 - time, 1 - temp
    const heaterGraph = thermocouple ? heaterGraphGasElectrical : [];
    const mergedArray = [...outsideGraphData, ...enclosureGraphData, ...heaterGraph];
    const uniqueValues = [...new Set(mergedArray.map(item => Math.floor(item[type])))];
    const sortedValues = uniqueValues.sort((a, b) => a - b);
    return sortedValues;
  };

  const convertArrayToObject = (arr) => {
    if (arr.length > 0) {
      return arr.reduce((obj, item) => {
        obj[item[0]] = isF ? Math.floor(convertCelsiusToFahrenheit(item[1])) : Math.floor(item[1]);
        return obj;
      }, {});
    }
    return {};
  };

  const heaterGraphGasElectrical = useMemo(() => {
    return isGas ? gasGraphData : heaterGraphData;
  }, [isGas, gasGraphData, heaterGraphData]);

  const dataGraph = useMemo(() => {
    if (Array.isArray(outsideGraphData) && Array.isArray(heaterGraphGasElectrical) && Array.isArray(enclosureGraphData)) {
      const sortedTimestamps = sortedValues(0);
      const outsideGraph = convertArrayToObject(outsideGraphData);
      const enclosureGraph = convertArrayToObject(enclosureGraphData);
      const heaterGraph = convertArrayToObject(heaterGraphGasElectrical);
      const result = sortedTimestamps.map((time) => {
        const outsideTemp = Math.floor(outsideGraph[time]);
        const enclosureTemp = Math.floor(enclosureGraph[time]);
        const heaterTemp = Math.floor(heaterGraph[time]);
        return {
          name: time,
          HT: !isNaN(heaterTemp) ? heaterTemp : null,
          ET: !isNaN(enclosureTemp) ? enclosureTemp : null,
          OT: !isNaN(outsideTemp) ? outsideTemp : null,
        };
      });

      if (result.length > 0) {
        // 15 minutes = 900000 milliseconds
        const diffTimeTwoPoints = 900000;
        result.reduce((prev, curr) => {
          if (
            curr.HT === null &&
            prev.HT !== null &&
            curr.name - prev.name < diffTimeTwoPoints
          ) {
            curr.HT = prev.HT;
          }
          if (
            curr.ET === null &&
            prev.ET !== null &&
            curr.name - prev.name < diffTimeTwoPoints
          ) {
            curr.ET = prev.ET;
          }
          if (
            curr.OT === null &&
            prev.OT !== null &&
            curr.name - prev.name < diffTimeTwoPoints
          ) {
            curr.OT = prev.OT;
          }
          return curr;
        });
      }

      return result;
    }
    return [{
      name: null,
      HT: null,
      ET: null,
      OT: null,
      date: null,
    }];
  }, [ outsideGraphData, enclosureGraphData, heaterGraphGasElectrical ]);

  const handleSnowWindStorms = (data) => {
    if (Array.isArray(data)) {
      const sortedTimestamps = sortedValues(0);
      const result = data.map((item) => {
        const actualTime = sortedTimestamps.find((time) => time >= item[0]);
        return [actualTime, 1];
      });

      const newResult = [];
      if (result.length > 0) {
        // 15 minutes = 900000 milliseconds
        const diffTimeTwoPoints = 900000;
        let startPoint = result[0][0];
        result.map((item, index) => {
          if (
            index > 0 &&
            item[0] - result[index - 1][0] > diffTimeTwoPoints &&
            startPoint < result[index - 1][0]
          ) {
            newResult.push([startPoint, result[index - 1][0]]);
            startPoint = item[0];
          } else if (
            index === result.length - 1 &&
            item[0] > startPoint
          ) {
            newResult.push([startPoint, item[0]]);
            startPoint = null;
          } else if (
            index === result.length - 1 &&
            startPoint !== null
          ) {
            newResult.push([startPoint, result[result.length - 1]]);
          }
        });
      }
      return newResult;
    }
    return [];
  };

  const newSnowStorms = useMemo(() => {
    return handleSnowWindStorms(snowGraphData);
  }, [snowGraphData, outsideGraphData, enclosureGraphData, heaterGraphGasElectrical]);

  const newWindStorms = useMemo(() => {
    return handleSnowWindStorms(windGraphData);
  }, [windGraphData, outsideGraphData, enclosureGraphData, heaterGraphGasElectrical]);

  const timePointsX = useMemo(() => {
    if (Array.isArray(outsideGraphData) && Array.isArray(heaterGraphGasElectrical) && Array.isArray(enclosureGraphData)) {
      const sortedTimestamps = sortedValues(0);
      if (sortedTimestamps.length > 0) {
        const timeRange =
          sortedTimestamps[sortedTimestamps.length - 1] - sortedTimestamps[0];
        const timeIncrement = timeRange / 5;
        const result = [];
        for (let i = 0; i <= 5; i++) {
          const time = sortedTimestamps[0] + i * timeIncrement;
          const actualTime = sortedTimestamps.find((item) => item >= time);
          result.push(actualTime);
        }
        return result;
      }
      return [];
    }
    return [];
  }, [ outsideGraphData, enclosureGraphData, heaterGraphGasElectrical ]);

  const tempPointsY = useMemo(() => {
    if (Array.isArray(outsideGraphData) && Array.isArray(heaterGraphGasElectrical) && Array.isArray(enclosureGraphData)) {
      const sortedTemps = sortedValues(1);
      if (sortedTemps.length > 0) {
        const tempRange = sortedTemps[sortedTemps.length - 1] - sortedTemps[0];
        const tempIncrement = (tempRange / 4) % 5 !== 0 ? tempRange / 4 : tempRange / 4 * 1.25;
        const result = [];
        sortedTemps[0] = sortedTemps[0] - (tempIncrement * 0.5)
        for (let i = 0; i <= 5; i++) {
          const value = sortedTemps[0] + i * tempIncrement
          result.push(Math.ceil(isF ? convertCelsiusToFahrenheit(value) : value));
        }
        return result;
      }
      return [];
    }
    return [];
  }, [ outsideGraphData, enclosureGraphData, heaterGraphGasElectrical ]);

  const unitValue = isF
    ? 'HEATER TEMPERATURE (°F)'
    : 'HEATER TEMPERATURE (°C)';

  const CustomTooltip = ({ active, payload }) => {
    const switchName = `${locationName} - ${machineName} - ${configuration}`;

    let payloadName1st = '';
    let payloadName2nd = '';
    let payloadName3rd = '';

    if (active) {
      const unit = isF ? '°F' : '°C';
      payloadName1st = switchName;
      payloadName2nd = Array.isArray(payload)
        ? `( ` +
          (typeof payload[0]?.payload?.HT === 'number'
            ? `H.T- ${payload[0]?.payload?.HT} ${unit}`
            : '') +
          (typeof payload[0]?.payload?.HT === 'number' &&
          typeof payload[0]?.payload?.ET === 'number'
            ? `, `
            : '') +
          (typeof payload[0]?.payload?.ET === 'number'
            ? `E.T- ${payload[0]?.payload?.ET} ${unit}`
            : '') +
          (typeof payload[0]?.payload?.ET === 'number' &&
          typeof payload[0]?.payload?.OT === 'number'
            ? `, `
            : '') +
          (typeof payload[0]?.payload?.OT === 'number' &&
          typeof payload[0]?.payload?.HT === 'number' &&
          typeof payload[0]?.payload?.ET !== 'number'
            ? `, `
            : '') +
          (typeof payload[0]?.payload?.OT === 'number'
            ? `O.T- ${payload[0]?.payload?.OT} ${unit}`
            : '') +
          ` )`
        : '';
      payloadName3rd = Array.isArray(payload)
        ? `${moment(payload[0]?.payload?.name)
          .format(realTime ? 'MMMM dddd DD, YYYY - HH:mm' : formatDateTooltip(intervalUnit))}`
        : '';
    }

    return (
      <PayloadWrapper className='custom-tooltip'>
        <PayloadItem className='label'>{payloadName1st}</PayloadItem>
        <PayloadItem className='label'>{payloadName2nd}</PayloadItem>
        <PayloadItem className='label'>{payloadName3rd}</PayloadItem>
      </PayloadWrapper>
    );
  };

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <LineChart
        width={100}
        height={100}
        data={dataGraph}
        margin={{
          top: 15,
          right: 10,
          left: 60,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray=' 1 solid' />
        <XAxis
          tick={{ fontSize: 8 }}
          stroke='#FFFFFF'
          dataKey='name'
          ticks={timePointsX}
          tickFormatter={
            (unixTime) => moment(unixTime)
              .format(realTime ? 'HH:mm' : formatDateXAxis(intervalUnit))
          }
          label={{
            value: 'TIME',
            position: 'BottomRight',
            fill: '#ffff',
            dx: 295,
            dy: 10,
            fontSize: 11,
          }}
        />
        <YAxis
          stroke='#FFFFFF'
          type='number'
          tick={{ fontSize: 11 }}
          ticks={tempPointsY}
          domain={['dataMin', 'dataMax']}
          unit={isF ? '°F' : '°C'}
          label={{
            fill: '#ffff',
            value: unitValue,
            position: 'outsideLeft',
            angle: -90,
            dx: -55,
            dy: 0,
            fontSize: 11,
            letterSpacing: 1.1,
          }}
          width={20}
        />

        <Tooltip
          wrapperStyle={{
            backgroundColor: '#233a54',
            outline: '1px solid #1B2B44',
          }}
          content={<CustomTooltip />}
        />

        {thermocouple && (
          <Line
            type='monotone'
            dataKey='HT'
            stroke='#FF7800'
            strokeWidth={2}
            dot={false}
          />
        )}
        <Line
          type='monotone'
          dataKey='ET'
          stroke='#4BAF00'
          dot={false}
          strokeWidth={2}
        />
        <Line
          type='monotone'
          dataKey='OT'
          stroke='#2B6FC1'
          dot={false}
          strokeWidth={2}
        />
        {newSnowStorms.map(snowStorm => (
          <ReferenceArea
            x1={snowStorm[0]}
            x2={snowStorm[1]}
            stroke='#FCFF01'
            strokeOpacity={0.3}
            fill='#FCFF01'
            fillOpacity={0.3}
            label={{
              value: 'snow storm',
              position: 'top',
              fill: '#FCFF01',
              fontSize: 11,
            }}
          />
        ))}
        {newWindStorms.map(windStorm => (
          <ReferenceArea
            x1={windStorm[0]}
            x2={windStorm[1]}
            label={{
              value: 'wind storm',
              position: 'top',
              fill: '#24CCC6',
              fontSize: 11,
            }}
            stroke='#24CCC6'
            strokeOpacity={1}
            fill='#24CCC6'
            fillOpacity={0.3}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineGraph;

const PayloadWrapper = styled.div`
  ${flexBoxCenter}
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  padding: 5px;
  border-radius: 8px;
`;
const PayloadItem = styled.span`
  font-size: 12px;
  letter-spacing: 1.2px;
`;

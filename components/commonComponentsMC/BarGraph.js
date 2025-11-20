import { useSelector } from 'react-redux';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';
import moment from 'moment';

import { flexBoxCenter } from '../styles/commonStyles';
import styled from 'styled-components';
import { useMemo } from 'react';
import { useUnitsStore } from '../zustand-stores';
import {
  formatDateTooltip,
  formatDateXAxis,
  getConsumptionValue,
} from '../../helpers/helpers';

const BarGraph = ({ swtName, graph, location, machine }) => {
  // true = data consumption || false = energy consumption
  const dataType = graph === 'data consumption vs time';
  
  const { essSwitch, tgsSwitch, tesSwitch,flatEssSwitch,flatTgsSwitch,flatTesSwitch } = useSelector(
    swtName === 'ess'
      ? selectEssSwitch
      : swtName === 'tgs'
        ? selectTgsSwitch
        : selectTesSwitch
  );
  const swtStatus = swtName === 'ess' ? flatEssSwitch : swtName === 'tgs' ? flatTgsSwitch : flatTesSwitch;
  const {
    graphDateData: { energyGasConsumptionGraphData, dataConsumptionGraphData, intervalUnit }
  } = swtStatus[location][machine];
  const { isF } = useUnitsStore();
  const isGas = swtName === 'tgs';
  const configuration = swtName === 'ess' ? 'ess' : 'tgs/tes';
  const { locationName, machineName } = swtStatus[location][machine];

  const eneryGraphTitle = isGas ? 'gas consump.' : 'energy consump.';
  const tooltipTitle = dataType ? 'data consump.' : eneryGraphTitle;

  const gasUnit = isF ? 'FT³' : 'M³';
  const energyUnit = isGas ? gasUnit : 'kw';
  const unit = dataType ? 'mb' : energyUnit;

  const graphData = dataType ? dataConsumptionGraphData : energyGasConsumptionGraphData;

  const sortedValues = (type) => {
    // type: 0 - time, 1 - value
    const uniqueValues = [...new Set(graphData.map(item => Math.floor(item[type])))];
    const sortedValues = uniqueValues.sort((a, b) => a - b);
    return sortedValues;
  };

  const dataGraph = useMemo(() => {
    if (Array.isArray(graphData)) {
      const result = graphData.map((data) => {
        return {
          name: data[0],
          consumption: getConsumptionValue(swtName, data[1], isF),
          date: data[0],
        };
      });

      return result;
    }
    return [{
      name: null,
      consumption: null,
      date: null,
    }];
  }, [graphData]);

  const pointsY = useMemo(() => {
    if (Array.isArray(graphData)) {
      const sortedData = sortedValues(1);
      if (sortedValues.length > 0) {
        const newValues = sortedData.map(el => getConsumptionValue(swtName, el, isF));
        const valueRange = newValues[newValues.length - 1] - newValues[0];
        const valueIncrement = (valueRange / 5);
        const result = [];
        for (let i = 0; i <= 5; i++) {
          const value = newValues[0] + i * valueIncrement;
          result.push(Math.ceil(value));
        }
        return result;
      }
      return [];
    }
    return [];
  }, [graphData]);

  const CustomTooltip = ({ active, payload, label }) => {
    const switchName = `${locationName} - ${machineName} - ${configuration}`;

    if (active && Array.isArray(payload)) {
      const payload1stRow = switchName;
      const payload2ndRow = `${tooltipTitle} ${payload[0]?.value} ${unit}`;
      const payload3rdRow = `${moment(payload[0]?.payload?.name)
        .format(formatDateTooltip(dataType ? 'months' : intervalUnit))}`;

      return (
        <PayloadWrapper className='custom-tooltip'>
          <PayloadItem className='label'>{payload1stRow}</PayloadItem>
          <PayloadItem className='label'>{payload2ndRow}</PayloadItem>
          <PayloadItem className='label'>{payload3rdRow}</PayloadItem>
        </PayloadWrapper>
      );
    }
    return null;
  };

  const barColor = dataType
    ? '#FF0080'
    : swtName === 'ess' ? '#83FFFF' : swtName === 'tgs' ? '#ff7800' : '#95ff45';

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <BarChart
        width={100}
        height={100}
        data={dataGraph}
      >
        <Bar dataKey='consumption' fill={barColor} barSize={25} />

        <CartesianGrid stroke='#fff' />
        {/* <XAxis dataKey='consumption' stroke='#FFFFFF' hide={true} /> */}

        <XAxis
          tick={{ fontSize: 8 }}
          stroke='#FFFFFF'
          dataKey='name'
          tickFormatter={
            (unixTime) => moment(unixTime)
              .format(formatDateXAxis(dataType ? 'months' : intervalUnit))
          }
          label={{
            value: 'TIME (DAY)',
            position: 'BottomRight',
            fill: '#ffff',
            dx: 275,
            dy: 10,
            fontSize: 11,
          }}
        />

        <YAxis
          stroke='#FFFFFF'
          type='number'
          tick={{ fontSize: 11 }}
          ticks={pointsY}
          domain={['dataMin', 'dataMax']}
          unit={unit}
        />
        <Tooltip
          // wrapperStyle={{
          //   backgroundColor: '#233a54',
          //   outline: '1px solid #1B2B44',
          // }}
          cursor={{ fill: 'transparent' }}
          content={<CustomTooltip />}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarGraph;

const PayloadWrapper = styled.div`
  ${flexBoxCenter}
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;

  background-color: #233a54;
  outline: 1px solid #1b2b44;
  padding: 5px;

  border-radius: 8px;
`;
const PayloadItem = styled.span`
  font-size: 12px;
  letter-spacing: 1.2px;
`;

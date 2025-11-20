import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';
import moment from 'moment';

import styled from 'styled-components';
import {
  flexBoxCenter,
  layerA,
  layerA180Deg,
  layerBDark,
} from '../styles/commonStyles';

import { DUMMY_CHART_DATA } from './ChartDummyData';

const Chart = ({ isReadyToRender }) => {
  const sysIdState = useSelector(selectSystemIdentification);
  const { sysIdentification } = sysIdState;

  // ---- temporary variables
  const unitsMeasurement = false;
  const thermocouple = false;
  const unitValue = unitsMeasurement
    ? 'HEATER TEMPERATURE (°F)'
    : 'HEATER TEMPERATURE (°C)';

  const CustomTooltip = ({ active, payload, label }) => {
    const switchName =
      sysIdentification.switchName.length < 1
        ? 'switch information'
        : sysIdentification.locationName +
          '-' +
          sysIdentification.switchName +
          '-' +
          sysIdentification.switchSize +
          ' ' +
          sysIdentification.application +
          '-' +
          sysIdentification.heatingSystem.split(' - ')[0];

    if (active) {
      const unit = unitsMeasurement ? '°F' : '°C';
      const payloadName1st = switchName;
      const payloadName2nd = `( H.T- ${
        thermocouple ? 'xxx' : payload[0].value
      } ${unit}, E.T- ${payload[1].value} ${unit}, O.T- ${
        payload[2].value
      } ${unit} )`;
      const payloadName3rd = `${moment()
        .subtract(payload[0].payload.date, 'days')
        .format('MMMM dddd DD, YYYY')}`;

      return (
        <PayloadWrapper className='custom-tooltip'>
          <PayloadItem className='label'>{payloadName1st}</PayloadItem>
          <PayloadItem className='label'>{payloadName2nd}</PayloadItem>
          <PayloadItem className='label'>{payloadName3rd}</PayloadItem>
        </PayloadWrapper>
      );
    }
    return null;
  };
  return (
    <Wrapper>
      <InnerWrapper>
        <TopWrapper>
          {isReadyToRender && (
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart
                width={100}
                height={100}
                data={DUMMY_CHART_DATA}
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
                  label={{
                    value: 'TIME (DAY)',
                    position: 'BottomRight',
                    fill: '#ffff',
                    dx: 275,
                    dy: 10,
                    fontSize: 11,
                  }}
                  // scale="band"
                />
                <YAxis
                  interval={0}
                  stroke='#FFFFFF'
                  type='number'
                  tick={{ fontSize: 11 }}
                  tickCount={7}
                  ticks={[-100, 0, 150, 300, 450, 600, 700]}
                  domain={['dataMin', 700]}
                  unit={unitsMeasurement ? '°F' : '°C'}
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
                    // color: "#9bbcd1",
                    backgroundColor: '#233a54',
                    outline: '1px solid #1B2B44',

                    // border: "1px solid #394e5a",
                  }}
                  content={<CustomTooltip />}
                />

                <Line
                  type='monotone'
                  dataKey='HT'
                  stroke='#FF7800'
                  strokeWidth={2}
                  // activeDot={{ r: 6 }}
                  dot={false}
                />
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
              </LineChart>
            </ResponsiveContainer>
          )}
        </TopWrapper>
      </InnerWrapper>
    </Wrapper>
  );
};

export default Chart;

const Wrapper = styled.div`
  width: 743px;
  height: 322px;
  border-radius: 14px;

  ${layerBDark};
  ${flexBoxCenter};
`;
const InnerWrapper = styled.div`
  width: 739px;
  height: 318px;
  border-radius: 12px;

  ${layerA180Deg};
  ${flexBoxCenter};
`;
const TopWrapper = styled.div`
  width: 730px;
  height: 308px;
  border-radius: 8px;
  ${layerA}
`;

const PayloadWrapper = styled.div`
  ${flexBoxCenter}
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  padding: 0.3rem;
`;
const PayloadItem = styled.span`
  font-size: 12px;
  letter-spacing: 1.2px;
`;

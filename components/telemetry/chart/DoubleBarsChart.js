import { ResponsiveBar } from '@nivo/bar';

{
  /* <DoubleBarsChart
                  firstYearData={firstYearData}
                  firstYearKeys={firstYearKeys}
                  secondYearData={secondYearData}
                  secondYearKeys={secondYearKeys}
                  handleClick={handleClickBar}
                  checkChangeOfData={checkChangeOfData}
                  getTspanGroups={getTspanGroups}
                  CustomYLines={CustomYLines}
                  CustomYLines1={CustomYLines1}
                  CustomLabels={CustomLabels}
                />  */
}

const DoubleBarsChart = (
  firstYearData,
  firstYearKeys,
  secondYearData,
  secondYearKeys,
  handleClick,
  checkChangeOfData,
  getTspanGroups,
  CustomYLines,
  CustomYLines1,
  CustomLabels
) => {
  return (
    <>
      <ResponsiveBar
        height={310}
        data={firstYearData}
        keys={firstYearKeys}
        indexBy={(_index) => _index.switch}
        margin={{ top: 30, right: 30, bottom: 50, left: 60 }}
        padding={0.55}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={({ id, data }) => data[`${id}Color`]}
        valueFormat=' >-10'
        onClick={({ id, data }) => handleClick(id, data)}
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
            return (
              <g transform={`translate(${x},${y})`}>
                <circle
                  alignmentBaseline={textBaseline}
                  textAnchor={textAnchor}
                  transform={`translate(${textX - 34},${textY - 1})`}
                  r={4}
                  fill='#83FFFF'
                ></circle>

                <text
                  alignmentBaseline={textBaseline}
                  textAnchor={textAnchor}
                  transform={`translate(${textX - 10},${textY + 3})`}
                  fontSize={8}
                  fill={'#fff'}
                >
                  {getTspanGroups(value.split(' ')[0])}
                </text>
                <text
                  alignmentBaseline={textBaseline}
                  textAnchor={textAnchor}
                  transform={`translate(${textX},${textY + 15})`}
                  fontSize={8}
                  fill={'#fff'}
                >
                  {getTspanGroups(
                    value
                      .split(' ')[1]
                      .concat(value.split(' ')[2] + value.split(' ')[3])
                  )}
                </text>
              </g>
            );
          },
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,

          legend: 'energy consumption (kw)',
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
              padding: 6,
              border: '2px solid #1B2B44',
              background: '#233A54',
              fontSize: 8,
            }}
          >
            <span>{data.switch}</span>
            <br />
            <span>{id} - 2021</span>
            <br />
            <span>(ec: {value}kw)</span>
            <br />
            <span>hours of usage: {data[`${id}THU`]}</span>
            <br />
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
      <ResponsiveBar
        height={310}
        data={secondYearData}
        keys={secondYearKeys}
        indexBy={(_index) => _index.switch}
        margin={{ top: 30, right: 30, bottom: 50, left: 60 }}
        padding={0.55}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={({ id, data }) => data[`${id}Color`]}
        valueFormat=' >-10'
        reverse={true}
        onClick={({ id, data }) => handleClick(id, data)}
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

          legend: 'energy consumption (kw)',
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
              padding: 6,
              border: '2px solid #1B2B44',
              background: '#233A54',
              fontSize: 8,
            }}
          >
            <span>{data.switch}</span>
            <br />
            <span>{id} - 2021</span>
            <br />
            <span>(ec: {value}kw)</span>
            <br />
            <span>hours of usage: {data[`${id}THU`]}</span>
            <br />
          </div>
        )}
        layers={[
          'grid',
          'markers',
          'areas',
          CustomYLines1,
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
  );
};

export default DoubleBarsChart;

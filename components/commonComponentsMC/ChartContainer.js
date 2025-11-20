import styled from 'styled-components';
import {
  flexBoxCenter,
  layerA,
  layerA180Deg,
  layerC,
} from '../styles/commonStyles';
import BarGraph from './BarGraph';
import LineGraph from './LineGraph';

const ChartContainer = ({
  isReadyToRender,
  chartOption,
  swtName,
  graph,
  location,
  machine,
}) => {
  const { essSwitch, tgsSwitch, tesSwitch,flatEssSwitch,flatTgsSwitch,flatTesSwitch } = useSelector(
    swtName === 'ess'
      ? selectEssSwitch
      : swtName === 'tgs'
        ? selectTgsSwitch
        : selectTesSwitch
  );
  const swtStatus =
    swtName === 'ess' ? flatEssSwitch : swtName === 'tgs' ? flatTgsSwitch : flatTesSwitch;
  const { isWifi } = swtStatus[location][machine];
  return (
    <Wrapper>
      <InnerWrapper>
        {isReadyToRender ? (
          <TopWrapper>
            {chartOption[1] ? (
              <LineGraph
                swtName={swtName}
                location={location}
                machine={machine}
                realTime={false}
              />
            ) : chartOption[1] ? (
              isWifi ? (
                <LineGraph
                  swtName={swtName}
                  location={location}
                  machine={machine}
                  realTime={true}
                />
              ) : (
                <EmptyGraph src='/images/empty-graph.svg' />
              )
            ) : (
              (chartOption[2] || chartOption[3]) && (
                <BarGraph
                  swtName={swtName}
                  graph={graph}
                  location={location}
                  machine={machine}
                />
              )
            )}
          </TopWrapper>
        ) : (
          <TopWrapper>
            {isWifi ? (
              <LineGraph
                swtName={swtName}
                location={location}
                machine={machine}
                realTime={true}
              />
            ) : (
              <EmptyGraph src='/images/empty-graph.svg' />
            )}
          </TopWrapper>
        )}
      </InnerWrapper>
    </Wrapper>
  );
};

export default ChartContainer;

const Wrapper = styled.div`
  width: 743px;
  height: 322px;
  border-radius: 14px;

  ${layerC};
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

  ${layerA};
  ${flexBoxCenter}
  padding-left: 10px;
  padding-top: 20px;
`;

const EmptyGraph = styled.img``;

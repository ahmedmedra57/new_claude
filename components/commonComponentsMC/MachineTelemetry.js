import { useSelector } from 'react-redux';
import essSwitchSlice, {
  selectEssSwitch,
} from '../store/slices/essSwitchSlice';
import tgsSwitchSlice, {
  selectTgsSwitch,
} from '../store/slices/tgsSwitchSlice';
import tesSwitchSlice, {
  selectTesSwitch,
} from '../store/slices/tesSwitchSlice';

import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentFlexStart,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
} from '../styles/commonStyles';
import { selectUnits } from '../store/slices/settings/unitsSlice';

const MachineTelemetry = ({
  swtName,
  location,
  machine,
  setTemp,
}) => {
  // global state
  const { essSwitch,flatEssSwitch, tgsSwitch,flatTgsSwitch, flatTesSwitch } = useSelector(
    swtName === 'ess'
      ? selectEssSwitch
      : swtName === 'tgs'
      ? selectTgsSwitch
      : selectTesSwitch
  );

  const switchData =
    swtName === 'ess' ? flatEssSwitch : swtName === 'tgs' ? flatTgsSwitch : flatTesSwitch;
  const switchStatus = switchData[location][machine];

  const { currentTemp, consumption, enclosureTemp, outSideTemp, hoursOfUsage } =
    switchStatus;

  const unitsStatus = useSelector(selectUnits);
  const { isF } = unitsStatus;

  const gas = isF ? 'FT³' : 'M³';
  const unit = swtName === 'tgs' ? gas : 'Kw/H';

  return (
    <Wrapper>
      <SectionTelemetry>
        <Header>generated telemetry</Header>
        <SectionMain>
          <SectionTitleAndDisplay>
            <TitleWrapper>
              <Title>set temp.</Title>
              <Title>curr. temp.</Title>
              <Title>e. consump.</Title>
            </TitleWrapper>
            <DisplayWrapper>
              <DisplayInner>
                <DisplayTemperature>
                  <DataWrapper>
                    <Temp numCount={setTemp?.toString().length > 3}>
                      {setTemp ? setTemp : '---'}
                    </Temp>
                    <Unit>{isF ? '°F' : '°C'}</Unit>
                  </DataWrapper>
                </DisplayTemperature>

                <DisplayTemperature>
                  <DataWrapper>
                    <Temp numCount={currentTemp?.toString().length > 3}>
                      {currentTemp ? currentTemp : '---'}
                    </Temp>
                    <Unit>{isF ? '°F' : '°C'}</Unit>
                  </DataWrapper>
                </DisplayTemperature>

                <DisplayTemperature>
                  <DataWrapper isConsumption={true}>
                    {/* {console.log('Consumption:', consumption.toString().length)} */}
                    <Icon src='/images/MC-energy-consumption.svg' />
                    <Temp numCount={consumption?.toString().length > 3}>
                      {consumption ? consumption : '---'}
                    </Temp>
                    <Unit>{unit}</Unit>
                  </DataWrapper>
                </DisplayTemperature>
              </DisplayInner>
            </DisplayWrapper>
          </SectionTitleAndDisplay>
          <SectionTitleAndDisplay>
            <TitleWrapper>
              <Title>
                enclosure<br></br>temp.
              </Title>
              <Title>
                outside<br></br>temp.
              </Title>
              <Title>
                hours of<br></br>usage
              </Title>
            </TitleWrapper>
            <DisplayWrapper>
              <DisplayInner>
                <DisplayTemperature>
                  <DataWrapper>
                    <Temp numCount={enclosureTemp?.toString().length > 3}>
                      {enclosureTemp ? enclosureTemp : '---'}
                    </Temp>
                    <Unit>{isF ? '°F' : '°C'}</Unit>
                  </DataWrapper>
                </DisplayTemperature>
                <DisplayTemperature>
                  <DataWrapper>
                    <Temp numCount={outSideTemp?.toString().length > 3}>
                      {outSideTemp ? outSideTemp : '---'}
                    </Temp>
                    <Unit>{isF ? '°F' : '°C'}</Unit>
                  </DataWrapper>
                </DisplayTemperature>
                <DisplayTemperature>
                  <DataWrapper>
                    <Temp numCount={333?.toString().length > 3}>
                      {hoursOfUsage ? hoursOfUsage : '---'}
                    </Temp>
                    <Unit>hrs</Unit>
                  </DataWrapper>
                </DisplayTemperature>
              </DisplayInner>
            </DisplayWrapper>
          </SectionTitleAndDisplay>
        </SectionMain>
      </SectionTelemetry>
    </Wrapper>
  );
};

export default MachineTelemetry;

const Wrapper = styled.div`
  width: 303px;
  height: 166px;
  border-radius: 22px;
  ${layerA};
  ${flexBoxCenter};

  margin: 4px 0;
`;
const SectionTelemetry = styled.section`
  width: 299px;
  height: 162px;
  border-radius: 20px;
  ${layerA180Deg};
  ${flexDirectionColumn};
  padding: 4px 0;
`;
const Header = styled.div`
  width: 289px;
  height: 30px;
  border-radius: 15px;
  ${layerA};
  /* background: #233a54 0% 0% no-repeat padding-box;
  box-shadow: inset 0px 0px 2px #000000; */
  ${flexBoxCenter};
  font-size: 14px;
  letter-spacing: 1.4px;
`;
const SectionMain = styled.section`
  ${flexDirectionColumn};
  height: 114px;
`;

const SectionTitleAndDisplay = styled.section`
  ${flexDirectionColumn};
`;

const TitleWrapper = styled.div`
  width: 100%;
  ${justifyContentSpaceBetween};
  padding: 0 3px;
`;
const Title = styled.span`
  width: 30%;
  font-size: 10px;
  text-align: center;
  /* line-height: 99%; */
`;
const DisplayWrapper = styled.div`
  width: 289px;
  height: 34px;
  border-radius: 17px;
  ${layerA};
  ${flexBoxCenter};
`;
const DisplayInner = styled.div`
  width: 285px;
  height: 30px;
  border-radius: 15px;
  background: transparent linear-gradient(180deg, #ffd500 0%, #6a4e00 100%);
  box-shadow: inset 0px 1px 2px #ffffff29, 0px 0px 2px #000000;
  border: 0.5px solid #000000;
  ${justifyContentSpaceBetween};
  padding: 0 3px;
`;
const DisplayTemperature = styled.div`
  width: 82px;
  height: 24px;
  border-radius: 12px;
  background: #d9b600;
  box-shadow: inset 0px 0.5px 2px #000000;
  ${flexBoxCenter};
`;
const DataWrapper = styled.div`
  height: 100%;
  width: 100%;
  ${flexBoxCenter};
  ${(p) =>
    p.isConsumption &&
    css`
      ${justifyContentSpaceBetween}

      padding: 0 6px 0 2px;
    `}
`;
const Temp = styled.div`
  height: 100%;
  ${({ numCount }) =>
    numCount
      ? css`
          font-size: 12px;
        `
      : css`
          font-size: 14px;
        `}

  letter-spacing: 1.4px;
  color: #203351;
  ${flexBoxCenter};
`;
const Unit = styled.div`
  height: 100%;
  font-size: 9px;
  text-transform: none;
  color: #203351;
  display: flex;
  align-items: flex-start;
`;

const Icon = styled.img`
  height: 60%;
`;

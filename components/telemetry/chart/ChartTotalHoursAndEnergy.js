import { useEffect, useState } from 'react';
import { useTelemetryStore, useUnitsStore } from '../../zustand-stores';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { selectTelemetry } from '../../store/slices/telemetrySlice';
import {
  flexBoxCenter,
  justifyContentSpaceBetween,
  layerA90Deg,
  layerB,
  layerBDark,
} from '../../styles/commonStyles';
import ViewPrintButton from './ViewPrintButton';
import { exportChartToPdf } from '../../printPDF/exportChartToPdf';
import { postAuditTrailLogService } from '../../../services';

const ChartTotalHoursAndEnergy = ({ swtName, isDc }) => {
  const { t } = useTranslation();
  const { isF } = useUnitsStore();
  const gasUnit = isF ? 'FT³' : 'M³';
  const unit = isDc ? 'mb' : swtName === 'tgs' ? gasUnit : 'kw';
  const noData = ['---hrs', `---${unit}`];

  const text = t('telemetry.usageHours');
  const text1 = `${t('telemetry.totalEnergyConsumption')} ${
    swtName === 'tgs' ? 'gas' : isDc ? 'data' : 'energy'
  }`;

  const dataHours = text.split(' ');
  const dataEnergy = text1.split(' ');

  const telemetryState = useTelemetryStore();

  const { isSearch, totalHours, totalConsumption, auditLogData } = telemetryState;

  const [data, setData] = useState();

  useEffect(() => {
    isSearch
      ? setData([`${totalHours} hrs`, `${totalConsumption} ${unit}`])
      : setData(noData);
  }, [isSearch, totalHours, totalConsumption]);

  return (
    <ShadowWrapper>
      <Wrapper>
        <ShadowWrapperData>
          <WrapperData>
            <WrapperIndent>
              {data?.map((el, index) => {
                return (
                  <YellowWrapper key={index}>
                    <YellowIndent>
                      <FlexWrapperData>
                        <Data>
                          {isDc && index === 0 ? '---' : el.split(' ')[0]}
                        </Data>
                        <DataMeasurementSymbol>
                          {isDc && index === 0 ? 'hrs' : el.split(' ')[1]}
                        </DataMeasurementSymbol>
                      </FlexWrapperData>
                      <FlexWrapperDataDescription>
                        <DataDescription>
                          {index === 0 ? dataHours[0] : dataEnergy[0]}
                        </DataDescription>
                        <br></br>
                        <DataDescription>
                          {index === 0 ? dataHours[1] : dataEnergy[1]}
                        </DataDescription>
                        <br></br>
                        <DataDescription>
                          {index === 0
                            ? dataHours[2] + ' ' + dataHours[3]
                            : dataEnergy[2]}
                        </DataDescription>
                      </FlexWrapperDataDescription>
                    </YellowIndent>
                  </YellowWrapper>
                );
              })}
            </WrapperIndent>
          </WrapperData>
        </ShadowWrapperData>

        <WrapperButton>
          <P>generated telemetry</P>
          <ViewPrintButton
            onClickButton={() => {
              if (Object.keys(auditLogData).length > 0) {
                postAuditTrailLogService(auditLogData);
                exportChartToPdf('telemetry-chart');
              }
            }}
          />
        </WrapperButton>
      </Wrapper>
    </ShadowWrapper>
  );
};

export default ChartTotalHoursAndEnergy;

const ShadowWrapper = styled.div`
  width: 1202px;
  height: 80px;

  ${layerBDark}

  border-radius: 6px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Wrapper = styled.div`
  width: 1198px;
  height: 76px;

  ${layerA90Deg}

  border-radius: 4px;
  opacity: 1;
  ${justifyContentSpaceBetween}
`;

const ShadowWrapperData = styled.div`
  min-width: 420px;
  height: 70px;
  margin-left: 2px;
  padding-left: 2px;
  padding-right: 2px;

  ${layerB}

  border-radius: 8px;
  opacity: 1;
  ${flexBoxCenter}
  flex-direction: row;
`;

const WrapperData = styled.div`
  min-width: 416px;
  height: 66px;
  padding-left: 5px;
  padding-right: 5px;

  ${layerA90Deg}

  border-radius: 7px;
  opacity: 1;
  ${flexBoxCenter}
`;

const WrapperIndent = styled.div`
  min-width: 406px;
  height: 56px;
  ${layerB}

  border-radius: 4px;
  opacity: 1;
  ${flexBoxCenter};
  gap: 6px;
`;

const YellowWrapper = styled.div`
  min-width: 187px;
  height: 48px;
  &:first-child {
    margin-left: 4px;
  }
  &:last-child {
    margin-right: 4px;
  }
  margin-top: 4px;
  margin-bottom: 4px;
  padding-left: 4px;
  padding-right: 4px;

  background: transparent
    linear-gradient(180deg, #d9d24b 0%, #aea951 61%, #67665c 100%) 0% 0%
    no-repeat padding-box;
  box-shadow: 0px 0px 3px #000000;
  border-radius: 3px;
  opacity: 1;
  ${flexBoxCenter}
`;

const YellowIndent = styled.div`
  min-width: 177px;
  height: 42px;

  background: transparent linear-gradient(180deg, #2e2e1e 0%, #fef100 100%);
  border: 1px solid #ffe600;
  border-radius: 2px;
  opacity: 1;
  ${justifyContentSpaceBetween}
  flex-direction: row;
`;
const FlexWrapperData = styled.div`
  min-width: 135px;
  height: 100%;
  margin-left: 2px;

  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: row;
`;

const Data = styled.span`
  height: 32px;
  width: auto;
  text-align: left;
  font-size: 26px;
  letter-spacing: 2.6px;
  color: #1b2b44;
`;

const DataMeasurementSymbol = styled.span`
  width: auto;
  margin-top: 2px;
  font-size: 16px;
  color: #1b2b44;
`;

const FlexWrapperDataDescription = styled.div`
  width: 75px;
  height: 100%;
  margin-right: 2px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  flex-direction: column;
`;

const DataDescription = styled.p`
  height: 11px;
  text-align: right;
  font-size: 11px;
  letter-spacing: 1.1px;
  color: #1b2b44;
  opacity: 1;
`;

const P = styled.p`
  margin-right: 40px;

  text-align: center;
  font-size: 10px;
  letter-spacing: 1px;
  color: #ffffff;
  opacity: 1;
`;

const WrapperButton = styled.div`
  ${flexBoxCenter}
  margin-right: 20px;
`;

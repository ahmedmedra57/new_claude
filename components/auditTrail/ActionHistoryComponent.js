import { useState } from "react";
import { useLocationsStore } from '../zustand-stores';
import { useTranslation } from 'react-i18next';

import styled, { css } from "styled-components";
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentFlexEnd,
  justifyContentSpaceBetween,
  layerA180Deg,
  layerADark,
  layerCLighter,
} from "../styles/commonStyles";

import ButtonComponent from "./ButtonComponent";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import {
  createCommandTitle,
  getAuditTrailActionTitle,
  hasValue,
} from "../../helpers/helpers";
import moment from "moment";
import { postAuditTrailLogService } from "../../services/auditTrail.service";
import { sum } from "lodash";

const ActionHistoryComponent = ({
  data,
  index,
  componentName,
  searchQuery,
  isSettings,
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  //redux
  const locations = useLocationsStore();
  const { specific: allLocations } = locations;
  const {
    instantHeat,
    optionalConstantTemp,
    snowSensor,
    heatingSchedule,
    scheduleEnabled,
    windFactor,
    freeze,
    deviceActive,
    instantHeatChangeTemp,
    optionalConstantTempChanged,
    fan,
    EBP_mode,
    TES_enabled,
    blower_snow_threshold,
    electrical_snow_threshold,
    blower_temp_ch,
    burner_temp_ch,
    display_temp_ch,
    enclosure_temp_ch,
    outside_temp_ch,
    tc_mode,
    wind_threshold,
    gas_type,
    force,
    initial_open,
    min_open,
    max_open,
    commandNumber,
    EBP,
    ssrReset,
    groundReset,
    thermocoupleReset,
    thermocoupleForce,
    timeOutReset,
    Hp_LpReset,
    globalTelemetryOverview,
    auditTrail,
  } = data.parameters;

  const isWithTitleHeader = !globalTelemetryOverview && !auditTrail;
  const selectOptions = {
    ess: [
      "BLOCK AND DO NOT ALLOW ESS TO OPERATE WHEN ON EBP (EMERGENCY BACKUP POWER)",
      "REACTIVATES ESS WHEN POWERED BY EBP (EMERGENCY BACKUP POWER)",
    ],
    tgs: [
      "REACTIVATE TGS (TYPHOON GAS POWER HEATING SYSTEM) WHEN ON EBP (EMERGENCY BACKUP POWER)",
      "BLOCK AND DO NOT ALLOW TGS TO OPERATE WHEN ON EBP (EMERGENCY BACKUP POWER)",
    ],
    tes: [
      "SWITCH TO tgs (TYPHOON GAS POWERED HEATING SYSTEM) WHEN ON EBP (EMERGENCY BACKUP POWER)",
      "reactivate TES WHEN POWERED BY EBP (EMERGENCY BACKUP POWER)",
      "TES TO REMAIN OFF WHEN POWERED BY EBP (EMERGENCY BACKUP POWER)",
    ],
  };
  const isGlobalMasterControl = data.actionType === "GLOBAL_MASTER_CONTROL";

  const actionsDetailsFirstTitle = useMemo(() => {
    switch (true) {
      case data.actionType === "GLOBAL_TELEMETRY_OVERVIEW" ||
        data.actionType === "GLOBAL_DATA_TELEMETRY_OVERVIEW":
        return "global system telemetry overiew";
      case data.actionType === "AUDIT_TRAIL":
        return "audit trail";
      case data.actionType.includes("RESET"):
        return `selected fault action`;
      default:
        return "selected heating program";
    }
  }, [data.actionType]);

  const actionDetailsSecondTilte = useMemo(() => {
    switch (true) {
      case data.actionType === "SSR_RESET":
        return "SSR FAILURE RESET ACTION";
      case data.actionType === "THERMOCOUPLE_RESET":
        return "THERMOCOUPLE FAILURE RESET ACTION";
      case data.actionType === "GROUND_RESET":
        return "GROUND FAILURE RESET ACTION";
      case data.actionType === "HPLP_RESET":
        return "HP/LP FAILURE RESET ACTION";
      case data.actionType === "ACTION" && !!optionalConstantTempChanged:
        return `CHANGE TEMPERATURE`;
      case data.actionType === "ACTION" && !!instantHeatChangeTemp:
        return `CHANGE TEMPERATURE`;
      case data.actionType === "ACTION" && !!instantHeat:
        return `SELECTED HEATING PROGRAM`;
      case data.actionType === "FAST_MASTER_CONTROL" && !!instantHeat:
        return `SELECTED HEATING PROGRAM`;
      case data.actionType === "FAST_MASTER_CONTROL" && !!snowSensor:
        return `SELECTED SNOW SENSOR PROGRAM`;
      case data.actionType === "FAST_MASTER_CONTROL" && !!fan:
        return `SELECTED FAN ONLY PROGRAM`;
      case !!instantHeat || !!optionalConstantTemp:
        return `SELECTED HEATING PROGRAM`;
      case !!instantHeatChangeTemp || !!optionalConstantTempChanged:
        return `CHANGE TEMPERATURE`;
      case !!fan:
        return `SELECTED Fan oNLY PROGRAM`;
      case !!windFactor:
        return `SELECTED wind Factor PROGRAM`;

      default:
        return "SELECTED HEATING PROGRAM";
    }
  }, [
    data.actionType,
    fan,
    instantHeat,
    instantHeatChangeTemp,
    optionalConstantTemp,
    optionalConstantTempChanged,
    snowSensor,
    windFactor,
  ]);
  const hour =
    Number(data.date.getHours()) > 12
      ? Number(data.date.getHours()) - 12
      : data.date.getHours();

  const minute =
    Number(data.date.getMinutes()) < 10
      ? `0${data.date.getMinutes()}`
      : data.date.getMinutes();

  const isPm = data.date.getHours() > 12;

  const date =
    Number(data.date.getDate()) < 10
      ? `0${data.date.getDate()}`
      : data.date.getDate();

  const month =
    Number(data.date.getMonth()) < 10
      ? `0${Number(data.date.getMonth()) + 1}`
      : Number(data.date.getMonth()) + 1;

  const year = data.date.getFullYear();

  // ------------ temporary date formatting-----------

  // ------------ temporary naming command files-----------
  const userCode = data?.userCode ? data?.userCode : "LCD";
  const commandFileName = `${createCommandTitle(
    data.actionType,
    data.system
  )}-${userCode}-${date}${month}${year.toString().substr(2)}-${commandNumber}`;
  // ------------ temporary naming command files-----------

  // ------------ temporary variable-----------
  const selectAutomaticTransfer = false;
  // ------------ temporary variable-----------

  const switchNumber = data.machines?.length;
  const handlePrintPDF = () => {
    const startDateAsTimeStamp = moment(searchQuery.startDate).utc().valueOf();
    const endDateAsTimeStamp = moment(searchQuery.endDate).utc().valueOf();
    let dataToSend = {
      actionType: "AUDIT_TRAIL",
      ...(searchQuery.deviceIds && { deviceIds: searchQuery.deviceIds }),
      deviceType: data.system,
      data: {
        ...(searchQuery.userIds && { userIds: searchQuery.userIds }),
        startDate: startDateAsTimeStamp,
        endDate: endDateAsTimeStamp,
      },
    };
    postAuditTrailLogService(dataToSend);

    window.alert("Request print PDF to the backend");
  };

  const commandTitle = useMemo(() => {
    return (
      getAuditTrailActionTitle(data?.actionType, data?.system, data?.isLCD) ||
      ""
    );
  }, [data?.actionType, data?.system]);

  return (
    <Wrapper>
      <InvisibleWrapper>
        <SectionDisplay aat={componentName === "aat"}>
          <Title>{commandTitle}</Title>
          <Divider>-</Divider>
          <Date>
            {t('common.date')} : {hour}:{minute}
            {isPm ? t('common.pm') : t('common.am')} {data.date.toLocaleDateString()}
          </Date>
          <Divider>-</Divider>
          <Command>{commandFileName}</Command>
        </SectionDisplay>
        {componentName !== "aat" && (
          <ButtonComponent
            title={isExpanded ? t('common.close') : t('common.expand')}
            buttonHandler={() => setIsExpanded(!isExpanded)}
          />
        )}
      </InvisibleWrapper>

      {isExpanded && (
        <SectionDetail>
          <DetailWrapper>
            <SectionDetailPartA>
              <PartAHeader>
                <HeaderATitleWrapper>
                  <HeaderTitle>{commandFileName}</HeaderTitle>
                  <HeaderTitle>{switchNumber} SWITCHES</HeaderTitle>
                </HeaderATitleWrapper>
                <PrintButton onClick={handlePrintPDF}>
                  <PrintButtonWrapper>
                    <PrintButtonHole>
                      <PrintButtonTop>{t('common.printPdf')}</PrintButtonTop>
                    </PrintButtonHole>
                  </PrintButtonWrapper>
                </PrintButton>
              </PartAHeader>
              <DetailPartAOuterWrapper>
                <DetailPartAWrapper>
                  <DetailPartATop>
                    <PartABody>
                      {Object.keys(data.switches).map((location) => (
                        <SwitchInfoWrapper key={location}>
                          <SwitchLocation>
                            {allLocations[location]?.locationName}
                          </SwitchLocation>
                          <SwitchNameWrapper>
                            <SwitchName></SwitchName>
                            {data.switches[location].map((machine) => {
                              return (
                                <SwitchName key={machine}>
                                  {allLocations[location]?.locationName}-
                                  {
                                    allLocations[location]?.devices[machine]?.machineName
                                  }
                                  ,{" "}
                                </SwitchName>
                              );
                            })}
                          </SwitchNameWrapper>
                        </SwitchInfoWrapper>
                      ))}
                    </PartABody>
                  </DetailPartATop>
                </DetailPartAWrapper>
              </DetailPartAOuterWrapper>
            </SectionDetailPartA>

            <SectionDetailPartB>
              <PartBHeader>
                <HeaderBTitleWrapper>
                  <HeaderTitle>
                    {isSettings
                      ? "selected settings"
                      : actionsDetailsFirstTitle}
                  </HeaderTitle>
                </HeaderBTitleWrapper>
              </PartBHeader>
              <DetailPartBOuterWrapper>
                <DetailPartBWrapper>
                  <DetailPartBTop>
                    <PartBBody>
                      {isGlobalMasterControl && (
                        <PartBBodyHeader>
                          <PartBBodySpan>
                            select automatic transfer system :
                          </PartBBodySpan>
                        </PartBBodyHeader>
                      )}
                      {!isSettings ? (
                        <>
                          {hasValue(EBP) ? (
                            <>
                              <PartBBodySpan
                                style={{ textAlign: "left" }}
                              ></PartBBodySpan>
                              <PartBBodySpan
                                style={{
                                  textAlign: "center",
                                  marginTop: "10px",
                                }}
                              >
                                {selectOptions[componentName][EBP]}
                              </PartBBodySpan>
                            </>
                          ) : (
                            isGlobalMasterControl && (
                              <PartBBodySpan
                                style={{
                                  textAlign: "center",
                                  marginTop: "10px",
                                }}
                              >
                                ---
                              </PartBBodySpan>
                            )
                          )}
                          {isWithTitleHeader && (
                            <>
                              <PartBBodyHeader>
                                <PartBBodySpan>
                                  {actionDetailsSecondTilte}
                                </PartBBodySpan>
                              </PartBBodyHeader>
                              <PartBBodyProgramTitle>
                                parameters
                              </PartBBodyProgramTitle>
                            </>
                          )}
                          <SectionPartBBody>
                            {hasValue(instantHeat) && (
                              <ProgramWrapper>
                                <PartBBodySpan>
                                  {componentName} instant heat program
                                </PartBBodySpan>
                                <PartBBodySpan>{instantHeat}</PartBBodySpan>
                              </ProgramWrapper>
                            )}
                            {hasValue(instantHeatChangeTemp) && (
                              <ProgramWrapper>
                                <PartBBodySpan>
                                  instant heat Change Temperature
                                </PartBBodySpan>
                                <PartBBodySpan>
                                  {instantHeatChangeTemp}
                                </PartBBodySpan>
                              </ProgramWrapper>
                            )}

                            {hasValue(fan) && (
                              <ProgramWrapper>
                                <PartBBodySpan>
                                  {componentName} fan only
                                </PartBBodySpan>
                                <PartBBodySpan>{fan}</PartBBodySpan>
                              </ProgramWrapper>
                            )}

                            {hasValue(snowSensor) && (
                              <ProgramWrapper>
                                <PartBBodySpan>
                                  {componentName} snow sensor program
                                </PartBBodySpan>
                                <PartBBodySpan>{snowSensor}</PartBBodySpan>
                              </ProgramWrapper>
                            )}

                            {hasValue(optionalConstantTemp) && (
                              <ProgramWrapper>
                                <PartBBodySpan>
                                  {componentName} optional constant temp.
                                  program
                                </PartBBodySpan>
                                <PartBBodySpan>
                                  {optionalConstantTemp}
                                </PartBBodySpan>
                              </ProgramWrapper>
                            )}
                            {hasValue(optionalConstantTempChanged) && (
                              <ProgramWrapper>
                                <PartBBodySpan>
                                  {componentName} optional constant temp.
                                  Changed
                                </PartBBodySpan>
                                <PartBBodySpan>
                                  {optionalConstantTempChanged}
                                </PartBBodySpan>
                              </ProgramWrapper>
                            )}
                            {hasValue(heatingSchedule) && (
                              <>
                                <ProgramWrapper>
                                  <PartBBodySpan>
                                    {componentName} heating schedule program
                                  </PartBBodySpan>
                                  <PartBBodySpan>
                                    {heatingSchedule.split(" | ")?.[0]}
                                  </PartBBodySpan>
                                </ProgramWrapper>
                                <ProgramWrapper>
                                  <PartBBodySpan>start date</PartBBodySpan>
                                  <PartBBodySpan>
                                    {heatingSchedule.split(" | ")?.[1]}
                                  </PartBBodySpan>
                                </ProgramWrapper>
                                <ProgramWrapper>
                                  <PartBBodySpan>end date</PartBBodySpan>
                                  <PartBBodySpan>
                                    {heatingSchedule.split(" | ")?.[2]}
                                  </PartBBodySpan>
                                </ProgramWrapper>
                              </>
                            )}
                            {hasValue(scheduleEnabled) && (
                              <ProgramWrapper>
                                <PartBBodySpan>
                                  {componentName} heating schedule program
                                </PartBBodySpan>
                                <PartBBodySpan>{scheduleEnabled}</PartBBodySpan>
                              </ProgramWrapper>
                            )}
                            {hasValue(windFactor) && (
                              <ProgramWrapper>
                                <PartBBodySpan>
                                  {componentName} wind factor program
                                </PartBBodySpan>
                                <PartBBodySpan>{windFactor}</PartBBodySpan>
                              </ProgramWrapper>
                            )}
                            {hasValue(ssrReset) && (
                              <ProgramWrapper>
                                <PartBBodySpan>
                                  {componentName} ssr fault{" "}
                                  {data?.isLCD && "LCD"} reset action
                                </PartBBodySpan>
                                <PartBBodySpan>RESET</PartBBodySpan>
                              </ProgramWrapper>
                            )}
                            {hasValue(groundReset) && (
                              <ProgramWrapper>
                                <PartBBodySpan>
                                  {componentName} ground fault{" "}
                                  {data?.isLCD && "LCD"} reset action
                                </PartBBodySpan>
                                <PartBBodySpan>RESET</PartBBodySpan>
                              </ProgramWrapper>
                            )}
                            {hasValue(thermocoupleReset) && (
                              <ProgramWrapper>
                                <PartBBodySpan>
                                  {componentName} thermocouple failure{" "}
                                  {data?.isLCD && "LCD"} reset action
                                </PartBBodySpan>
                                <PartBBodySpan>YES</PartBBodySpan>
                              </ProgramWrapper>
                            )}
                            {hasValue(thermocoupleForce) && (
                              <>
                                <ProgramWrapper>
                                  <PartBBodySpan>
                                    {componentName} thermocouple failure{" "}
                                    {data?.isLCD && "LCD"} reset action
                                  </PartBBodySpan>
                                  <PartBBodySpan>NO</PartBBodySpan>
                                </ProgramWrapper>
                                <HorizontalLine />
                                <ProgramWrapper>
                                  <PartBBodySpan>
                                    {componentName} thermocouple failure{" "}
                                    {data?.isLCD && "LCD"} force action
                                  </PartBBodySpan>
                                  <PartBBodySpan>force</PartBBodySpan>
                                </ProgramWrapper>
                                <HorizontalLine />
                                <ProgramWrapper>
                                  <PartBBodySpan></PartBBodySpan>
                                  <PartBBodySpan>
                                    {thermocoupleForce === 1
                                      ? "max heat 12 hours"
                                      : thermocoupleForce === 2
                                      ? "max heat for 3 days"
                                      : "change and replace t/c"}
                                  </PartBBodySpan>
                                </ProgramWrapper>
                              </>
                            )}
                            {hasValue(Hp_LpReset) && (
                              <ProgramWrapper>
                                <PartBBodySpan>
                                  {componentName} hp/lp fault{" "}
                                  {data?.isLCD && "LCD"} reset action
                                </PartBBodySpan>
                                <PartBBodySpan>RESET</PartBBodySpan>
                              </ProgramWrapper>
                            )}
                            {hasValue(timeOutReset) && (
                              <ProgramWrapper>
                                <PartBBodySpan>
                                  {componentName} time Out fault{" "}
                                  {data?.isLCD && "LCD"} reset action
                                </PartBBodySpan>
                                <PartBBodySpan>RESET</PartBBodySpan>
                              </ProgramWrapper>
                            )}
                            {hasValue(globalTelemetryOverview) && (
                              <>
                                <ProgramWrapper>
                                  <PartBBodySpan></PartBBodySpan>
                                  <PartBBodySpan>
                                    {componentName === "ess"
                                      ? "ess - electric switch system"
                                      : componentName === "tgs"
                                      ? "tgs - typhoon gas switch system"
                                      : componentName === "tgs"
                                      ? "tes - typhoon electric switch system"
                                      : "tgs/tes - typhoon gas/electric switch system"}
                                  </PartBBodySpan>
                                  <PartBBodySpan></PartBBodySpan>
                                </ProgramWrapper>
                                <ProgramWrapper>
                                  <PartBBodySpan></PartBBodySpan>
                                  <PartBBodySpan>
                                    {globalTelemetryOverview.isDataConsumption
                                      ? "data"
                                      : componentName === "tgs"
                                      ? "gas"
                                      : "energy"}{" "}
                                    consumption vs time
                                  </PartBBodySpan>
                                  <PartBBodySpan></PartBBodySpan>
                                </ProgramWrapper>
                                <ProgramWrapper>
                                  <PartBBodySpan></PartBBodySpan>
                                  <PartBBodySpan>
                                    {moment(
                                      globalTelemetryOverview.startDate
                                    ).format("h:mma M/D/YYYY")}
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    {moment(
                                      globalTelemetryOverview.endDate
                                    ).format("h:mma M/D/YYYY")}
                                  </PartBBodySpan>
                                  <PartBBodySpan></PartBBodySpan>
                                </ProgramWrapper>
                                <ProgramWrapper>
                                  <PartBBodySpan>
                                    total hours of usage
                                  </PartBBodySpan>
                                  <PartBBodySpan>
                                    {globalTelemetryOverview.totalUsageHours}{" "}
                                    hrs
                                  </PartBBodySpan>
                                </ProgramWrapper>
                                <HorizontalLine />
                                <ProgramWrapper>
                                  <PartBBodySpan>
                                    total{" "}
                                    {globalTelemetryOverview.isDataConsumption
                                      ? "data"
                                      : componentName === "tgs"
                                      ? "gas"
                                      : "energy"}{" "}
                                    consumption
                                  </PartBBodySpan>
                                  <PartBBodySpan>
                                    {globalTelemetryOverview.totalConsumption}{" "}
                                    kw
                                  </PartBBodySpan>
                                </ProgramWrapper>
                                <HorizontalLine />
                                <ProgramWrapper>
                                  <PartBBodySpan>
                                    switch
                                    <br />
                                    specification
                                  </PartBBodySpan>
                                  <PartBBodySpan></PartBBodySpan>
                                  <PartBBodySpan>
                                    usage
                                    <br />
                                    hours
                                  </PartBBodySpan>
                                  <PartBBodySpan>
                                    {globalTelemetryOverview.isDataConsumption
                                      ? "data"
                                      : componentName === "tgs"
                                      ? "gas"
                                      : "energy"}
                                    <br />
                                    consumption
                                  </PartBBodySpan>
                                </ProgramWrapper>
                                <HorizontalLine />
                                {Object.keys(data.switches).map((location) => {
                                  const globalTelemetry = data.switches[
                                    location
                                  ].map((machine) => {
                                    return globalTelemetryOverview.data.find(
                                      (el) => el.deviceId === machine
                                    );
                                  });
                                  const usageHours = sum(
                                    globalTelemetry.map((el) => el.usageHours)
                                  );
                                  const consumption = sum(
                                    globalTelemetry.map((el) => el.consumption)
                                  );
                                  return (
                                    <>
                                      <ProgramWrapper key={location}>
                                        <PartBBodySpan>
                                          {allLocations[location]?.locationName}
                                        </PartBBodySpan>
                                        <PartBBodySpan>
                                          {data.switches[location].length}{" "}
                                          switches
                                        </PartBBodySpan>
                                        <PartBBodySpan>
                                          {usageHours} hrs
                                        </PartBBodySpan>
                                        <PartBBodySpan>
                                          {consumption} kw
                                        </PartBBodySpan>
                                      </ProgramWrapper>
                                      {data.switches[location].map(
                                        (machine) => {
                                          const data =
                                            globalTelemetryOverview.data.find(
                                              (el) => el.deviceId === machine
                                            );
                                          return (
                                            <>
                                              <ProgramWrapper key={machine}>
                                                <PartBBodySpan>
                                                  {
                                                    allLocations[location]
                                                      ?.locationName
                                                  }
                                                  -
                                                  {
                                                    allLocations[location]
                                                      ?.devices[machine]
                                                      .machineName
                                                  }
                                                </PartBBodySpan>
                                                <PartBBodySpan></PartBBodySpan>
                                                <PartBBodySpan>
                                                  {data.usageHours} hrs
                                                </PartBBodySpan>
                                                <PartBBodySpan>
                                                  {data.consumption} kw
                                                </PartBBodySpan>
                                              </ProgramWrapper>
                                            </>
                                          );
                                        }
                                      )}
                                    </>
                                  );
                                })}
                              </>
                            )}
                            {hasValue(auditTrail) && (
                              <>
                                <ProgramWrapper>
                                  <PartBBodySpan>start date</PartBBodySpan>
                                  <PartBBodySpan>
                                    {auditTrail.startDate}
                                  </PartBBodySpan>
                                </ProgramWrapper>
                                <ProgramWrapper>
                                  <PartBBodySpan>end date</PartBBodySpan>
                                  <PartBBodySpan>
                                    {auditTrail.endDate}
                                  </PartBBodySpan>
                                </ProgramWrapper>
                              </>
                            )}
                          </SectionPartBBody>
                        </>
                      ) : (
                        <SectionPartBBody>
                          {hasValue(EBP_mode) && (
                            <ProgramWrapper>
                              <PartBBodySpan>EBP mode program:</PartBBodySpan>
                              <PartBBodySpan>{EBP_mode}</PartBBodySpan>
                            </ProgramWrapper>
                          )}

                          {hasValue(TES_enabled) && (
                            <ProgramWrapper>
                              <PartBBodySpan>
                                TES enabled program:
                              </PartBBodySpan>
                              <PartBBodySpan>{TES_enabled}</PartBBodySpan>
                            </ProgramWrapper>
                          )}

                          {hasValue(blower_snow_threshold) && (
                            <ProgramWrapper>
                              <PartBBodySpan>
                                blower snow threshold program:
                              </PartBBodySpan>
                              <PartBBodySpan>
                                {blower_snow_threshold}
                              </PartBBodySpan>
                            </ProgramWrapper>
                          )}

                          {hasValue(electrical_snow_threshold) && (
                            <ProgramWrapper>
                              <PartBBodySpan>
                                electrical snow threshold program:
                              </PartBBodySpan>
                              <PartBBodySpan>
                                {electrical_snow_threshold}
                              </PartBBodySpan>
                            </ProgramWrapper>
                          )}

                          {hasValue(blower_temp_ch) && (
                            <ProgramWrapper>
                              <PartBBodySpan>
                                blower temperature channel program:
                              </PartBBodySpan>
                              <PartBBodySpan>{blower_temp_ch}</PartBBodySpan>
                            </ProgramWrapper>
                          )}

                          {hasValue(burner_temp_ch) && (
                            <ProgramWrapper>
                              <PartBBodySpan>
                                burner temperature channel program:
                              </PartBBodySpan>
                              <PartBBodySpan>{burner_temp_ch}</PartBBodySpan>
                            </ProgramWrapper>
                          )}

                          {hasValue(display_temp_ch) && (
                            <ProgramWrapper>
                              <PartBBodySpan>
                                display temperature channel program:
                              </PartBBodySpan>
                              <PartBBodySpan>{display_temp_ch}</PartBBodySpan>
                            </ProgramWrapper>
                          )}

                          {hasValue(enclosure_temp_ch) && (
                            <ProgramWrapper>
                              <PartBBodySpan>
                                enclosure temperature channel program:
                              </PartBBodySpan>
                              <PartBBodySpan>{enclosure_temp_ch}</PartBBodySpan>
                            </ProgramWrapper>
                          )}

                          {hasValue(outside_temp_ch) && (
                            <ProgramWrapper>
                              <PartBBodySpan>
                                outside temperature channel program:
                              </PartBBodySpan>
                              <PartBBodySpan>{outside_temp_ch}</PartBBodySpan>
                            </ProgramWrapper>
                          )}

                          {hasValue(tc_mode) && (
                            <ProgramWrapper>
                              <PartBBodySpan>
                                thermocouple mode program:
                              </PartBBodySpan>
                              <PartBBodySpan>{tc_mode}</PartBBodySpan>
                            </ProgramWrapper>
                          )}

                          {hasValue(wind_threshold) && (
                            <ProgramWrapper>
                              <PartBBodySpan>
                                wind threshold program:
                              </PartBBodySpan>
                              <PartBBodySpan>{wind_threshold}</PartBBodySpan>
                            </ProgramWrapper>
                          )}

                          {hasValue(gas_type) && (
                            <ProgramWrapper>
                              <PartBBodySpan>gas type program:</PartBBodySpan>
                              <PartBBodySpan>{gas_type}</PartBBodySpan>
                            </ProgramWrapper>
                          )}

                          {hasValue(force) && (
                            <ProgramWrapper>
                              <PartBBodySpan>force program:</PartBBodySpan>
                              <PartBBodySpan>{force}</PartBBodySpan>
                            </ProgramWrapper>
                          )}

                          {hasValue(initial_open) && (
                            <ProgramWrapper>
                              <PartBBodySpan>
                                gas valve start position program:
                              </PartBBodySpan>
                              <PartBBodySpan>{initial_open}</PartBBodySpan>
                            </ProgramWrapper>
                          )}

                          {hasValue(min_open) && (
                            <ProgramWrapper>
                              <PartBBodySpan>
                                gas valve min position program:
                              </PartBBodySpan>
                              <PartBBodySpan>{min_open}</PartBBodySpan>
                            </ProgramWrapper>
                          )}

                          {hasValue(max_open) && (
                            <ProgramWrapper>
                              <PartBBodySpan>
                                gas valve max position program:
                              </PartBBodySpan>
                              <PartBBodySpan>{max_open}</PartBBodySpan>
                            </ProgramWrapper>
                          )}
                        </SectionPartBBody>
                      )}
                    </PartBBody>
                  </DetailPartBTop>
                </DetailPartBWrapper>
              </DetailPartBOuterWrapper>
            </SectionDetailPartB>
          </DetailWrapper>
        </SectionDetail>
      )}
    </Wrapper>
  );
};
export default ActionHistoryComponent;

const Wrapper = styled.div`
  width: 1191px;
  border-radius: 22px;
  ${layerA180Deg}
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 8px;
  &:last-child {
    margin-bottom: 0px;
  }
`;

const InvisibleWrapper = styled.div`
  width: 100%;
  height: 44px;
  ${justifyContentSpaceBetween}
  padding: 0 5px 0 5px;
`;
const SectionDisplay = styled.section`
  width: 1088px;
  height: 36px;
  border-radius: 41px;
  ${layerADark};
  ${justifyContentSpaceBetween}
  padding: 0 12px;

  ${({ aat }) =>
    aat &&
    css`
      width: 100%;
    `}
`;
const Divider = styled.span`
  font-size: 12px;
`;
const Title = styled.span`
  width: 270px;
  font-size: 12px;
  letter-spacing: 1.2px;
`;
const Date = styled.span`
  width: 270px;
  font-size: 12px;
  letter-spacing: 1.2px;
  color: #fcff01;
`;
const Command = styled.span`
  width: 270px;
  font-size: 12px;
  letter-spacing: 1.2px;
`;

const SectionDetail = styled.section`
  width: 1182px;
  height: 205px;
  border-radius: 18px;
  ${layerADark};
  ${flexBoxCenter}
  margin-bottom: 3px;
`;
const DetailWrapper = styled.div`
  width: 1180px;
  height: 203px;
  border-radius: 17px;
  ${layerA180Deg}
  ${justifyContentSpaceBetween}
  padding: 5px;
`;
const SectionDetailPartA = styled.section`
  height: 100%;
  ${flexDirectionColumn}
`;

const DetailPartAOuterWrapper = styled.div`
  width: 634px;
  height: 154px;
  border-radius: 12px;
  ${layerADark}
  ${flexBoxCenter}
`;

const DetailPartAWrapper = styled.div`
  width: 630px;
  height: 151px;
  border-radius: 10px;
  ${layerA180Deg};
  ${flexBoxCenter}
`;
const DetailPartATop = styled.div`
  width: 622px;
  height: 143px;
  border-radius: 6px;
  ${layerADark};
`;
const PartAHeader = styled.div`
  width: 634px;
  height: 31px;
  border-radius: 16px;
  ${layerADark}
  ${justifyContentSpaceBetween}
  padding: 0 1px 0 10px;
`;

const HeaderATitleWrapper = styled.div`
  width: 523px;
  font-size: 12px;
  letter-spacing: 1.2px;
  border-bottom: 1px solid #fcff01;
  ${justifyContentSpaceBetween}
`;

const HeaderTitle = styled.span`
  font-size: 12px;
  letter-spacing: 1.2px;
  color: #fcff01;
`;

const PrintButton = styled.button`
  width: 95px;
  height: 29px;
  border-radius: 27px;
  ${layerCLighter};
  ${flexBoxCenter};
`;
const PrintButtonWrapper = styled.div`
  width: 93px;
  height: 27px;
  border-radius: 25px;
  ${layerA180Deg};
  ${flexBoxCenter};
`;
const PrintButtonHole = styled.div`
  width: 87px;
  height: 21px;
  border-radius: 20px;

  ${layerCLighter};
  ${flexBoxCenter};
`;
const PrintButtonTop = styled.div`
  width: 85px;
  height: 19px;
  border-radius: 25px;
  ${layerA180Deg};
  ${flexBoxCenter};
  font-size: 8px;
  letter-spacing: 0.8px;
`;

const PartABody = styled.div`
  width: 100%;
  height: 100%;
  padding: 5px;

  /* scroll bar */
  scroll-behavior: smooth;
  overflow-y: auto;

  ::-webkit-scrollbar {
    width: 10px;
    border: 1px solid #ffffff;
    border-radius: 13px;
  }
  ::-webkit-scrollbar-track {
  }

  ::-webkit-scrollbar-thumb {
    background-color: #ffffff;
    border-radius: 13px;
    border: 1.5px solid transparent;
    background-clip: padding-box;
    height: 40%;
  }

  ::-webkit-scrollbar-button:start:decrement {
    background-repeat: no-repeat;
    background-size: 70%;
    background-position: center;
    height: 10px;

    background-image: url("/images/scrollbar-button-start.svg");
  }
  ::-webkit-scrollbar-button:end:increment {
    background-repeat: no-repeat;
    background-size: 70%;
    background-position: center;
    height: 10px;

    background-image: url("/images/scrollbar-button-end.svg");
  }
`;
const SwitchInfoWrapper = styled.div`
  margin-bottom: 8px;
`;
const SwitchLocation = styled.span`
  border-bottom: 1px solid #fcff01;
  font-size: 12px;
  letter-spacing: 1.2px;
  color: #fcff01;
  display: inline-block;
  margin-bottom: 4px;
`;
const SwitchNameWrapper = styled.div``;
const SwitchName = styled.span`
  font-size: 12px;
  letter-spacing: 1.2px;
  color: #fcff01;
`;

const SectionDetailPartB = styled.section`
  height: 100%;
  ${flexDirectionColumn}
`;
const DetailPartBOuterWrapper = styled.section`
  width: 520px;
  height: 154px;
  border-radius: 12px;
  ${layerADark};
  ${flexBoxCenter}
`;

const DetailPartBWrapper = styled.div`
  width: 517px;
  height: 151px;
  border-radius: 10px;
  ${layerA180Deg};
  ${flexBoxCenter};
`;
const DetailPartBTop = styled.div`
  width: 509px;
  height: 143px;
  border-radius: 6px;
  ${layerADark}
`;
const PartBHeader = styled.div`
  width: 520px;
  height: 31px;
  border-radius: 16px;
  ${layerADark}
  ${flexBoxCenter}
  padding: 0 10px;
`;
const HeaderBTitleWrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid #fcff01;
`;

const PartBBody = styled.div`
  width: 100%;
  height: 100%;
  padding: 5px;

  display: flex;
  flex-direction: column;
  align-items: center;

  /* scroll bar */
  scroll-behavior: smooth;
  overflow-y: auto;

  ::-webkit-scrollbar {
    width: 10px;
    border: 1px solid #ffffff;
    border-radius: 13px;
  }
  ::-webkit-scrollbar-track {
  }

  ::-webkit-scrollbar-thumb {
    background-color: #ffffff;
    border-radius: 13px;
    border: 1.5px solid transparent;
    background-clip: padding-box;
    height: 40%;
  }

  ::-webkit-scrollbar-button:start:decrement {
    background-repeat: no-repeat;
    background-size: 70%;
    background-position: center;
    height: 10px;

    background-image: url("/images/scrollbar-button-start.svg");
  }
  ::-webkit-scrollbar-button:end:increment {
    background-repeat: no-repeat;
    background-size: 70%;
    background-position: center;
    height: 10px;

    background-image: url("/images/scrollbar-button-end.svg");
  }
`;
const PartBBodyHeader = styled.div`
  width: 98%;
  height: 22px;
  border-bottom: 1px solid #fcff01;
  ${justifyContentSpaceBetween}
`;
const PartBBodySpan = styled.span`
  font-size: 12px;
  letter-spacing: 1.2px;
  color: #fcff01;
`;
const PartBBodyProgramTitle = styled.span`
  width: 98%;
  font-size: 12px;
  letter-spacing: 1.2px;
  color: #fcff01;
  text-align: right;
`;

const SectionPartBBody = styled.section`
  width: 98%;
`;
const ProgramWrapper = styled.div`
  ${justifyContentSpaceBetween}
`;

const HorizontalLine = styled.div`
  width: 100%;
  height: 1px;
  background-color: #fcff01;
  margin-bottom: 4px;
`;

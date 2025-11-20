import { useMemo } from "react";
import { useUnitsStore } from "../components/zustand-stores";
import { convertCelsiusToFahrenheit } from "../helpers/helpers";

export const useSetAndCurrentTemp = (machineData) => {
    const { isF } = useUnitsStore();

    const instantHeatReady = useMemo(() => {
        return machineData.instantHeat.isReady;
    }, [machineData.instantHeat.isReady]);

    const optionalConstantReady = useMemo(() => {
        return machineData.optionalConstantTemp.isReady;
    }, [machineData.optionalConstantTemp.isReady]);

    const heatingScheduleActivated = useMemo(() => {
        return machineData.heatingSchedule.isActivated;
    }, [machineData.heatingSchedule.isActivated]);

    const snowSensorReady = useMemo(() => {
        return machineData.snowSensor.isReady;
    }, [machineData.snowSensor.isReady]);

    const snowSensorActivated = useMemo(() => {
        return machineData.snowSensor.isActivated;
    }, [machineData.snowSensor.isActivated]);

    const windFactorReady = useMemo(() => {
        return machineData.windFactor.isReady;
    }, [machineData.windFactor.isReady]);

    const windFactorActivated = useMemo(() => {
        return machineData.windFactor.isActivated;
    }, [machineData.windFactor.isActivated]);

    const setTemp = useMemo(() => {
        const setTemp = !machineData.thermocouple
            ? '--'
            : (instantHeatReady || optionalConstantReady || heatingScheduleActivated || (snowSensorReady && snowSensorActivated) || (windFactorReady && windFactorActivated)) ?
                isF ? convertCelsiusToFahrenheit(machineData.setTemp)
                    : machineData.setTemp
                : '--';
        return setTemp;
    }, [
        instantHeatReady,
        optionalConstantReady,
        heatingScheduleActivated,
        snowSensorReady,
        snowSensorActivated,
        windFactorReady,
        windFactorActivated,
        isF,
        machineData.setTemp,
        machineData.thermocouple
    ]);

    const currentTemp = useMemo(() => {
        const currentTemp = !machineData.thermocouple
            ? '--'
            : (instantHeatReady || optionalConstantReady || heatingScheduleActivated || (snowSensorReady && snowSensorActivated) || (windFactorReady && windFactorActivated)) ?
                isF ? convertCelsiusToFahrenheit(machineData.currentTemp)
                    : machineData.currentTemp
                : '--';
        return currentTemp;
    }, [
        instantHeatReady,
        optionalConstantReady,
        heatingScheduleActivated,
        snowSensorReady,
        snowSensorActivated,
        windFactorReady,
        windFactorActivated,
        isF,
        machineData.currentTemp,
        machineData.thermocouple
    ]);

    return { setTemp, currentTemp }
}
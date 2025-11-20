import { useQueries } from "react-query";
import { useFaultsStore, useLocationsStore } from "../components/zustand-stores";
import { getLocationDataByDeviceId } from "../helpers/helpers";
import { getDeviceThermocouplesService } from "../services";

export const useGetThermocouplesQueries = (switchStatus, swtName) => {
    const { setReceivedThermocoupleSetting } = useFaultsStore();
    const locations = useLocationsStore();
    const getSSRsQueries = useQueries(
        Object.values(switchStatus)
            .flatMap((zone) =>
                Object.values(zone)
                    .filter(machine => machine.thermocoupleFault?.includes(1))
                    .map((machine) => ({
                        queryKey: [machine.deviceMac, '-thermocouple'],
                        queryFn: () => getDeviceThermocouplesService(machine.deviceMac),
                        onSuccess: (data) => {
                            if (data) {
                                data.map(thermocouple => {
                                    const newData = {
                                        swtName,
                                        location: getLocationDataByDeviceId(thermocouple.device_id, locations[swtName])?.locationId,
                                        machine: thermocouple.device_id,
                                        data: { ...thermocouple, deviceType: swtName },
                                    }
                                    setReceivedThermocoupleSetting(newData);
                                });
                            }
                        },
                        onError: (error) => {
                        },
                        staleTime: Infinity
                    }))
            )
    );

    return getSSRsQueries;
};
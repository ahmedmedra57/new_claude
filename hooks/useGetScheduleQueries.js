import { useQueries } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { handleAddHeatingSchedule } from "../components/store/slices/essSwitchSlice";
import { selectUnits } from "../components/store/slices/settings/unitsSlice";
import { tesHandleAddHeatingSchedule } from "../components/store/slices/tesSwitchSlice";
import { tgsHandleAddHeatingSchedule } from "../components/store/slices/tgsSwitchSlice";
import { readableTime } from "../helpers/helpers";
import { getScheduleForDeviceService } from "../services/schedule.service";

export const useGetScheduleQueries = (switchStatus, swtName) => {
  const dispatch = useDispatch();
  const { isF } = useSelector(selectUnits);

  const getScheduleQueries = useQueries(
    Object.values(switchStatus)
      .flatMap((zone, zoneIndex) =>
        Object.values(zone).map((machine, machineIndex) => ({
          queryKey: [machine.deviceMac, '-scheduleData'],
          queryFn: () => getScheduleForDeviceService(machine.deviceMac, swtName),
          onSuccess: (data) => {
            if (data) {
              const { threshold, id } = data;
              const startDate = readableTime(data.startDate);
              const endDate = readableTime(data.endDate);
              const scheduleData = {
                location: Object.keys(switchStatus)[zoneIndex],
                machine: Object.keys(zone)[machineIndex],
                start: startDate,
                end: endDate,
                inputTemp: +threshold,
                isF,
                index: 0,
                id,
              }
              if (swtName === 'ESS') {
                dispatch(handleAddHeatingSchedule(scheduleData));
              } else if (swtName === 'TGS') {
                dispatch(tgsHandleAddHeatingSchedule(scheduleData));
              } else if (swtName === 'TES') {
                dispatch(tesHandleAddHeatingSchedule(scheduleData));
              }
            }
          },
          onError: (error) => {
          },
          staleTime: Infinity
        }))
      )
  );

  return getScheduleQueries;
}
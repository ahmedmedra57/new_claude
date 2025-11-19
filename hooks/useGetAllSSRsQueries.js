import { useQueries } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { handleEssSSRState, selectEssSwitch } from "../components/store/slices/essSwitchSlice";
import { selectDescription } from "../components/store/slices/ssrDescriptionSlice";
import { handleTesSSRState, selectTesSwitch } from "../components/store/slices/tesSwitchSlice";
import { getSSRsForDeviceService } from "../services";

export const useGetAllSSRsQueries = (switchStatus, swtName) => {
  const dispatch = useDispatch();
  const { elementsOptions } = useSelector(selectDescription);
  const { flatEssSwitch, flatTesSwitch } = useSelector(
    swtName === 'ESS'
      ? selectEssSwitch
      : selectTesSwitch
  );

  const swtStatus = swtName === 'ESS' ? flatEssSwitch : flatTesSwitch;

  const getSSRsQueries = useQueries(
    Object.values(switchStatus)
      .flatMap((zone, zoneIndex) =>
        Object.values(zone)
          .filter(machine => machine.ssrFault?.includes(1))
          .map((machine, machineIndex) => ({
            queryKey: [machine.deviceMac, '-ssrsData'],
            queryFn: () => getSSRsForDeviceService(machine.deviceMac),
            onSuccess: (data) => {
              if (data) {
                const location = Object.keys(switchStatus)[zoneIndex];
                const machine = Object.keys(zone)[machineIndex];
                const result = data.map((item) => {
                  const specs = elementsOptions.filter((element) =>
                    item.Heaters.includes(element?.partNumber)
                  );
                  return {
                    ...item,
                    select: `tc-${swtStatus[location][machine].heaterThermocoupleMap[item.No]}`,
                    buttonStatus: item?.fault === true || item?.Load_exceeded === true ? 'flt' :
                      item?.active === true ? 'on' : 'off',
                    specs: specs.length !== 0 ? specs : [{}],
                    switchName: `${item.name} ${item.size}`,
                  };
                });
                const ssrStateData = {
                  location,
                  machine,
                  data: result,
                }
                if (swtName === 'ESS') {
                  dispatch(handleEssSSRState(ssrStateData));
                } else if (swtName === 'TES') {
                  dispatch(handleTesSSRState(ssrStateData));
                }


              }
            },
            onError: (error) => {
            },
          }))
      )
  );

  return getSSRsQueries;
};
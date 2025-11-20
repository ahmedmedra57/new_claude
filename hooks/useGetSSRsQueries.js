import { useEffect, useState, useRef } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useESSSwitchStore, useTESSwitchStore, useSSRDescriptionStore } from "../components/zustand-stores";
import { getSSRsForDeviceService } from "../services";

export const useGetSSRsQueries = (location, machine, swtName) => {
  const queryClient = useQueryClient();
  const { elementsOptions } = useSSRDescriptionStore();

  const essStore = useESSSwitchStore();
  const tesStore = useTESSwitchStore();

  const { flatEssSwitch, setEssSSRState } = essStore;
  const { flatTesSwitch, setTesSSRState } = tesStore;

  const swtStatus = swtName === 'ESS' ? flatEssSwitch : flatTesSwitch;

  const [fetchSSRs, setFetchSSRs] = useState(false);
  const initialFetch = useRef(false);

  useEffect(() => {
    if (elementsOptions.length > 0 && !initialFetch.current) {
      setFetchSSRs(true);
      initialFetch.current = true;
    }
  }, [elementsOptions]);

  const getSSRsQueries = useQuery(
    [machine, '-ssrsData'],
    () => getSSRsForDeviceService(machine),
    {
      enabled: fetchSSRs,
      onSuccess: (data) => {
      
        if (data) {
   
          const result = data.map((item) => {
           
          
            // const specs = elementsOptions.filter((element) =>
            //   item.Heaters.includes(element?.partNumber)
            // );
     
            const specs=item.Heaters.map((el)=>{
              const matchEle=elementsOptions.find((ele)=> ele.partNumber == el);
                return matchEle ? matchEle:{partNumber:el};
              });
          
            return {
              ...item,
              select: `tc-${swtStatus[location][machine].heaterThermocoupleMap[item.No]}`,
              buttonStatus: item?.fault === true || item?.Load_exceeded === true ? 'flt' :
                item?.active === true ? 'on' : 'off',
              specs: specs.length !== 0 ? specs?.map((spec) => ({
                currentSSR:swtStatus[location][machine].ssr_current?.[item.No],
                ...spec,
              })) : [{}],
              switchName: `${item.name} ${item.size}`,
            };
          });
          if (swtName === 'ESS') {
            setEssSSRState(location, machine, result);
          } else if (swtName === 'TES') {
            setTesSSRState(location, null, machine, result);
          }
        }
      },
      onError: (error) => {
      },
      staleTime: Infinity,
      refetchOnWindowFocus: false, // Prevent refetching on window focus
      refetchInterval: false, // Disable any automatic refetching
      retry: false, // Disable automatic retries
    }
  );

  useEffect(() => {
    return () => {
      getSSRsQueries.remove();
    };
  }, []);

  return getSSRsQueries;
};

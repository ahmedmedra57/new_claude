import { useEffect, useState, useRef } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { handleEssSSRState, selectEssSwitch } from "../components/store/slices/essSwitchSlice";
import { selectDescription } from "../components/store/slices/ssrDescriptionSlice";
import { handleTesSSRState, selectTesSwitch } from "../components/store/slices/tesSwitchSlice";
import { getSSRsForDeviceService } from "../services";

export const useGetSSRsQueries = (location, machine, swtName) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { elementsOptions } = useSelector(selectDescription);
  const { flatEssSwitch, flatTesSwitch } = useSelector(
    swtName === 'ESS'
      ? selectEssSwitch
      : selectTesSwitch
  );

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
          const ssrStateData = {
            location,
            machine,
            data: result,
          };
          if (swtName === 'ESS') {
        
            dispatch(handleEssSSRState(ssrStateData));
          } else if (swtName === 'TES') {
            dispatch(handleTesSSRState(ssrStateData));
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

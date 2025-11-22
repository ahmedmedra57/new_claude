import { useEffect } from "react";
import { useQueries } from "react-query";
import { useDispatch } from "react-redux";
import { handleEssGraph } from "../components/store/slices/essSwitchSlice";
import { handleTesGraph } from "../components/store/slices/tesSwitchSlice";
import { handleTgsGraph } from "../components/store/slices/tgsSwitchSlice";
import { getGraphTypeKey } from "../helpers/helpers";
import { getGraphService } from "../services";

export const useGetGraphQueries = (location, machine, swtName) => {
    const dispatch = useDispatch();
    const graphTypes = swtName === 'TGS'
        ? ['gas_graph', 'gas_enclosure_graph', 'outside_graph', 'gas_snow_graph', 'gas_wind_graph']
        : ['heater_graph', 'enclosure_graph', 'outside_graph', 'snow_graph', 'wind_graph'];

    const getSSRsQueries = useQueries(
        graphTypes.map((graphType) => ({
            queryKey: [machine, graphType],
            queryFn: () => getGraphService(machine, graphType),
            onSuccess: (data) => {
                if (data) {
                    const newData = {
                        location,
                        machine,
                        graphType: getGraphTypeKey(graphType),
                        data: data.graph,
                    };
                    if (swtName === 'ESS') {
                        dispatch(handleEssGraph(newData));
                    } else if (swtName === 'TGS') {
                        dispatch(handleTgsGraph(newData));
                    } else if (swtName === 'TES') {
                        dispatch(handleTesGraph(newData));
                    }
                }
            },
            onError: (error) => {
            },
            staleTime: Infinity,
        }))
    );

    useEffect(() => {
        return () => {
            getSSRsQueries.forEach((query) => {
                query.remove();
            });
        };
    }, []);

    return getSSRsQueries;
}
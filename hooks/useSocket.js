import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import {
  handleAddHeatingSchedule,
  handleClearHeatingSchedule,
  handleEssGraph,
  handleEssSSRStateSocket,
  handleEssSwitchSocket,
} from '../components/store/slices/essSwitchSlice';
import { handleReceivedThermocoupleSetting } from '../components/store/slices/FaultsSlice';
import { selectLocations } from '../components/store/slices/locationsSlice';
import { selectUnits } from '../components/store/slices/settings/unitsSlice';
import { selectDescription } from '../components/store/slices/ssrDescriptionSlice';
import {
  handleTesSwitchSocket,
  handleTesSSRStateSocket,
  tesHandleClearHeatingSchedule,
  tesHandleAddHeatingSchedule,
  handleTesGraph,
} from '../components/store/slices/tesSwitchSlice';
import {
  handleTgsGraph,
  handleTgsSwitchSocket,
  tgsHandleAddHeatingSchedule,
  tgsHandleClearHeatingSchedule,
} from '../components/store/slices/tgsSwitchSlice';
import {
  convertCelsiusToFahrenheit,
  getGraphTypeKey,
  readableTime,
} from '../helpers/helpers';

export const useSocket = (room, accessToken) => {
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();
  const { elementsOptions } = useSelector(selectDescription);
  const { isF } = useSelector(selectUnits);
  const locations = useSelector(selectLocations);

  useEffect(() => {
    if (accessToken) {
      const newSocket = io('https://api.dev.umb-360.com', {
        query: { room }
      });

      // Listen for the WebSocket connection to be established
      newSocket.on('connect', () => {
      });

      newSocket.on('connect_error', (e) => {
      })

      // Listen for messages from the server
      newSocket.on('switchAudit', (data) => {
        dispatch(handleEssSwitchSocket({ data, isF }));
        dispatch(handleEssSSRStateSocket(data));
      });

      newSocket.on('blowerAudit', (data) => {
        if (data.eventDeviceType === 'TGS') {
          dispatch(handleTgsSwitchSocket({ data, isF }));
        } else if (data.eventDeviceType === 'TES') {
          dispatch(handleTesSwitchSocket({ data, isF }));
          dispatch(handleTesSSRStateSocket(data));
        }
      });

      newSocket.on('ssrUpdate', (data) => {
        const specs = elementsOptions.filter((element) =>
          data.Heaters.includes(element?.partNumber)
        );
        const newData = {
          ...data,
          specs: specs.length !== 0 ? specs : [{}],
        }
        if (data.eventDeviceType === 'ESS') {
          dispatch(handleEssSSRStateSocket(newData));
        } else if (data.eventDeviceType === 'TES') {
          dispatch(handleTesSSRStateSocket(newData));
        }
      });

      newSocket.on('scheduleList', (data) => {
        const location = data.zoneInfo.zone_id;
        const machine = data.device_mac;
        const clearData = [
          {
            start: { date: null, time: null },
            end: { date: null, time: null },
            inputTemp: null,
            isF: null,
            id: null,
          },
        ];

        const addSchedule = data.eventDeviceType === 'ESS'
          ? handleAddHeatingSchedule
          : data.eventDeviceType === 'TES'
            ? tesHandleAddHeatingSchedule
            : tgsHandleAddHeatingSchedule;

        const clearSchedule = data.eventDeviceType === 'ESS'
          ? handleClearHeatingSchedule
          : data.eventDeviceType === 'TES'
            ? tesHandleClearHeatingSchedule
            : tgsHandleClearHeatingSchedule;

        if (data.hasOwnProperty('threshold')) {
          const { threshold, startDate, endDate, id } = data;
          dispatch(addSchedule({
            location,
            machine,
            start: readableTime(startDate),
            end: readableTime(endDate),
            index: 0,
            inputTemp: isF ? convertCelsiusToFahrenheit(+threshold) : +threshold,
            isF,
            id,
          }));
        } else {
          dispatch(clearSchedule({ location, machine, data: clearData }));
        }
      });

      newSocket.on('thermocoupleUpdate', (data) => {
        const swtName = data.eventDeviceType.toLowerCase();
        const newData = {
          swtName,
          location: data.zoneInfo?.zone_id,
          machine: data.device_id,
          data: { ...data, deviceType: swtName },
        }
        dispatch(handleReceivedThermocoupleSetting(newData));
      });

      const handleGraph = (data, graphType) => {
        const newData = {
          location: data.zoneInfo?.zone_id,
          machine: data.device_mac,
          graphType: getGraphTypeKey(graphType),
          data: data.points,
        };
        if (data.eventDeviceType === 'ESS') {
          dispatch(handleEssGraph(newData));
        } else if (data.eventDeviceType === 'TGS') {
          dispatch(handleTgsGraph(newData));
        } else if (data.eventDeviceType === 'TES') {
          dispatch(handleTesGraph(newData));
        }
      };

      newSocket.on('heater_graph', (data) => handleGraph(data, 'heater_graph'));
      newSocket.on('enclosure_graph', (data) => handleGraph(data, 'enclosure_graph'));
      newSocket.on('gas_enclosure_graph', (data) => handleGraph(data, 'gas_enclosure_graph'));
      newSocket.on('outside_graph', (data) => handleGraph(data, 'outside_graph'));
      newSocket.on('gas_graph', (data) => handleGraph(data, 'gas_graph'));
      newSocket.on('snow_graph', (data) => handleGraph(data, 'snow_graph'));
      newSocket.on('wind_graph', (data) => handleGraph(data, 'wind_graph'));
      newSocket.on('gas_snow_graph', (data) => handleGraph(data, 'gas_snow_graph'));
      newSocket.on('gas_wind_graph', (data) => handleGraph(data, 'gas_wind_graph'));

      // Listen for the WebSocket connection to be closed
      newSocket.on('disconnect', () => {
      });

      setSocket(newSocket);

      // Clean up the WebSocket connection when the hook is unmounted
      return () => {
        newSocket.disconnect();
      };
    }
  }, [room, accessToken, isF]);

  const sendMessage = (message) => {
    if (socket && socket.connected) {
      socket.send(message);
    } else {
    }
  };

  return { sendMessage };
};

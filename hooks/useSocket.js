import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import {
  useESSSwitchStore,
  useTESSwitchStore,
  useTGSSwitchStore,
  useFaultsStore,
  useLocationsStore,
  useUnitsStore,
  useSSRDescriptionStore,
} from '../components/zustand-stores';
import {
  convertCelsiusToFahrenheit,
  getGraphTypeKey,
  readableTime,
} from '../helpers/helpers';

export const useSocket = (room, accessToken) => {
  const [socket, setSocket] = useState(null);
  const { elementsOptions } = useSSRDescriptionStore();
  const { isF } = useUnitsStore();
  const locations = useLocationsStore();

  const {
    setEssSwitchSocket,
    setEssSSRStateSocket,
    setAddHeatingSchedule: essSetAddHeatingSchedule,
    setClearHeatingSchedule: essSetClearHeatingSchedule,
    setEssGraph,
  } = useESSSwitchStore();

  const {
    setTesSwitchSocket,
    setTesSSRStateSocket,
    setAddHeatingSchedule: tesSetAddHeatingSchedule,
    setClearHeatingSchedule: tesSetClearHeatingSchedule,
    setTesGraph,
  } = useTESSwitchStore();

  const {
    setTgsSwitchSocket,
    setAddHeatingSchedule: tgsSetAddHeatingSchedule,
    setClearHeatingSchedule: tgsSetClearHeatingSchedule,
    setTgsGraph,
  } = useTGSSwitchStore();

  const { setReceivedThermocoupleSetting } = useFaultsStore();

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
        setEssSwitchSocket(data, isF);
        setEssSSRStateSocket(data);
      });

      newSocket.on('blowerAudit', (data) => {
        if (data.eventDeviceType === 'TGS') {
          setTgsSwitchSocket(data, isF);
        } else if (data.eventDeviceType === 'TES') {
          setTesSwitchSocket(data, isF);
          setTesSSRStateSocket(data);
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
          setEssSSRStateSocket(newData);
        } else if (data.eventDeviceType === 'TES') {
          setTesSSRStateSocket(newData);
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
          ? essSetAddHeatingSchedule
          : data.eventDeviceType === 'TES'
            ? tesSetAddHeatingSchedule
            : tgsSetAddHeatingSchedule;

        const clearSchedule = data.eventDeviceType === 'ESS'
          ? essSetClearHeatingSchedule
          : data.eventDeviceType === 'TES'
            ? tesSetClearHeatingSchedule
            : tgsSetClearHeatingSchedule;

        if (data.hasOwnProperty('threshold')) {
          const { threshold, startDate, endDate, id } = data;
          addSchedule(
            location,
            machine,
            readableTime(startDate),
            readableTime(endDate),
            0,
            isF ? convertCelsiusToFahrenheit(+threshold) : +threshold,
            isF,
            id
          );
        } else {
          clearSchedule(location, machine, clearData);
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
        setReceivedThermocoupleSetting(newData);
      });

      const handleGraph = (data, graphType) => {
        const location = data.zoneInfo?.zone_id;
        const machine = data.device_mac;
        const graphTypeKey = getGraphTypeKey(graphType);
        const points = data.points;

        if (data.eventDeviceType === 'ESS') {
          setEssGraph(location, machine, graphTypeKey, points);
        } else if (data.eventDeviceType === 'TGS') {
          setTgsGraph(location, machine, graphTypeKey, points);
        } else if (data.eventDeviceType === 'TES') {
          setTesGraph(location, machine, graphTypeKey, points);
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

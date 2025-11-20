import { useState, createContext } from 'react';
import { useMCCommandStore, useMCStore, useMasterControlSelectStore } from '../zustand-stores';

export const MasterControlContext = createContext();

const MasterControlProvider = ({ children }) => {
  // !for styling of ATS and DEACTIVATE buttons
  const [greenDetour, setGreenDetour] = useState([false, false]);
  // for Select ATS
  const [isSelectedForAts, setIsSelectedForAts] = useState([
    false,
    false,
    false,
  ]);

  //!  for styling deactivate
  const [selectPrograms, setSelectPrograms] = useState({
    instantHeat: false,
    isFanOnly: false,
    snowSensor: false,
    optionalConstantTemp: false,
    heatingSchedule: false,
    windFactor: false,
  });

  // ! for resetting the dial control to initial state
  const [resetDialControl, setResetDialControl] = useState(true);

  // !for selecting the control dial
  // const ready = [
  //   '/images/button-instantHeat.svg',
  //   '/images/button-snowSensor.svg',
  //   '/images/button-constantTemp.svg',
  //   '/images/button-heatingSchedule.svg',
  //   '/images/button-windFactor.svg',
  // ];
  // const instantHeatImg = [
  //   '/images/button-instantHeat-active.svg',
  //   '/images/button-snowSensor.svg',
  //   '/images/button-constantTemp.svg',
  //   '/images/button-heatingSchedule.svg',
  //   '/images/button-windFactor.svg',
  // ];
  // const snowSensorImg = [
  //   '/images/button-instantHeat.svg',
  //   '/images/button-snowSensor-active.svg',
  //   '/images/button-constantTemp.svg',
  //   '/images/button-heatingSchedule.svg',
  //   '/images/button-windFactor.svg',
  // ];
  // const constantTempImg = [
  //   '/images/button-instantHeat.svg',
  //   '/images/button-snowSensor.svg',
  //   '/images/button-constantTemp-active.svg',
  //   '/images/button-heatingSchedule.svg',
  //   '/images/button-windFactor.svg',
  // ];
  // const windFactorImg = [
  //   '/images/button-instantHeat.svg',
  //   '/images/button-snowSensor.svg',
  //   '/images/button-constantTemp.svg',
  //   '/images/button-heatingSchedule.svg',
  //   '/images/button-windFactor-active.svg',
  // ];
  // const heatingScheduleImg = [
  //   '/images/button-instantHeat.svg',
  //   '/images/button-snowSensor.svg',
  //   '/images/button-constantTemp.svg',
  //   '/images/button-heatingSchedule-active.svg',
  //   '/images/button-windFactor.svg',
  // ];

  // // import redux
  // const { isNewCommandCreated } = useMCCommandStore();
  // const selectedSwitch = useMCStore();
  // const { ess, tgs, tes } = selectedSwitch.selectSystem;
  // const selectsState = useMasterControlSelectStore();
  // const { selectedOne } = ess
  //   ? selectsState.ess
  //   : tes
  //   ? selectsState.tes
  //   : selectsState.tgs;
  // const dispatch = useDispatch();

  // // useState

  // const [isShutOff, setIsShutOff] = useState(false);
  // const [src, setSrc] = useState(ready);
  // const [selectSrc, setSelectSrc] = useState('/images/section-image-none.svg');
  // const [dialDeg, setDialDeg] = useState(null);

  // const handleSelectController = (id, isSetCommand) => {
  //   if ((selectedOne && selectedOne !== '0 switches') || isSetCommand) {

  //     switch (id) {
  //       case 1: {
  //         // 1. change icons
  //         setSrc(instantHeatImg);
  //         // 2. change select effect panel
  //         setSelectSrc('/images/section-image-1.svg');
  //         // change selected controller as true
  //         dispatch(handleSelectAController([true, false, false, false, false]);
  //         // turn dial dgree
  //         setDialDeg(1);
  //         break;
  //       }
  //       case 2: {
  //         // 1. change icons
  //         setSrc(snowSensorImg);
  //         // 2. change select effect panel
  //         setSelectSrc('/images/section-image-2.svg');
  //         // change selected controller as true
  //         dispatch(handleSelectAController([false, true, false, false, false]);
  //         // turn dial degree
  //         setDialDeg(2);
  //         break;
  //       }
  //       case 3: {
  //         // 1. change icons
  //         setSrc(constantTempImg);
  //         // 2. change select effect panel
  //         setSelectSrc('/images/section-image-3.svg');
  //         // change selected controller as true
  //         dispatch(handleSelectAController([false, false, true, false, false]);
  //         // turn dial degree
  //         setDialDeg(3);
  //         break;
  //       }
  //       case 4: {
  //         // 1. change icons
  //         setSrc(heatingScheduleImg);
  //         // 2. change select effect panel
  //         setSelectSrc('/images/section-image-4.svg');
  //         // change selected controller as true
  //         dispatch(handleSelectAController([false, false, false, true, false]);
  //         // turn dial degree
  //         setDialDeg(4);
  //         break;
  //       }
  //       case 5: {
  //         // 1. change icons
  //         setSrc(windFactorImg);
  //         // 2. change select effect panel
  //         setSelectSrc('/images/section-image-5.svg');
  //         // change selected controller as true
  //         dispatch(handleSelectAController([false, false, false, false, true]);
  //         // turn dial degree
  //         setDialDeg(5);
  //         break;
  //       }
  //       default: {
  //         break;
  //       }
  //     }
  //   }
  // };

  // const select = (dialControlIdx, isSetCommand) => {
  //   // if (!isNewCommandCreated) {
  //   //   setMessageBoxOfCreateNewCommand(true);
  //   // } else {
  //   //   isShutOff || handleSelectController(dialControlIdx);

  //   // }
  //   if (isSetCommand && isNewCommandCreated) {
  //     isShutOff || handleSelectController(dialControlIdx, isSetCommand);
  //   } else if (isNewCommandCreated) {
  //     isShutOff || handleSelectController(dialControlIdx);
  //   }
  // };

  return (
    <MasterControlContext.Provider
      value={{
        greenDetour,
        setGreenDetour,
        selectPrograms,
        setSelectPrograms,
        isSelectedForAts,
        setIsSelectedForAts,
        resetDialControl,
        setResetDialControl,
        // select,
        // handleSelectController,
        // src,
        // setSrc,
        // selectSrc,
        // setSelectSrc,
        // dialDeg,
        // setDialDeg,
        // isShutOff,
        // setIsShutOff,
      }}
    >
      {children}
    </MasterControlContext.Provider>
  );
};

export default MasterControlProvider;

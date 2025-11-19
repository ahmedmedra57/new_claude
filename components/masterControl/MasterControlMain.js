import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  handleUnSelectIndividualMachine,
  selectEssSwitch,
} from '../store/slices/essSwitchSlice';
import {
  handleDisplaySelectBoxWithAction,
  handleResetAllSelect,
} from '../store/slices/masterControlSelectSlice';
import {
  handleApplyCommand,
  handleCommandInfo,
  handleCommandDate,
  handleControlResetInit,
  handleCreateCommand,
  handleResetCommandNumber,
  selectMCCommand,
  handleResetCreateNewCommand,
} from '../store/slices/mCCommandSlice';
import { handleUnselectAllSystem, selectMC } from '../store/slices/mCSlice';
import { handleResetAll } from '../store/slices/selectedMachinesSlice';
import {
  selectTesSwitch,
  tesHandleUnSelectIndividualMachine,
} from '../store/slices/tesSwitchSlice';
import {
  selectTgsSwitch,
  tgsHandleUnSelectIndividualMachine,
} from '../store/slices/tgsSwitchSlice';
import { flexDirectionColumn, layerADark } from '../styles/commonStyles';
import TitleContainer from '../TitleContainer';
import MasterControlContents from './MasterControlContents';
import ContainerSelectSystem from './selectSystemAndAddCommand/ContainerSelectSystem';
import SelectCreateNewCommandMessage from './userMessages/SelectCreateNewCommandMessage';
import MasterControlProvider from './MaterControlContext';
import { getAuditTrailService } from '../../services';
import { selectUserInfo } from '../store/slices/userSlice';
import { selectUnits } from '../store/slices/settings/unitsSlice';
import moment from 'moment';
import SelectSystemMessage from './userMessages/SelectSystemMessage';

const MasterControlMain = () => {
  const { t } = useTranslation();
  // redux
  const dispatch = useDispatch();

  const { flatEssSwitch } = useSelector(selectEssSwitch);
  const { flatTesSwitch } = useSelector(selectTesSwitch);
  const { flatTgsSwitch } = useSelector(selectTgsSwitch);
  const { user } = useSelector(selectUserInfo);
  const { isF } = useSelector(selectUnits);

  const mCState = useSelector(selectMC);

  const essSelectSystem = mCState.selectSystem.ess;
  const tgsSelectSystem = mCState.selectSystem.tgs;
  const tesSelectSystem = mCState.selectSystem.tes;
  const hpSelectSystem = mCState.selectSystem.hp;

  const mCCommandState = useSelector(selectMCCommand);
  const { commandDate, isNewCommandCreated } = mCCommandState;
  // useState
  const [toggleButtonColor, setToggleButtonColor] = useState(false);

  // open and close the message box of master control commands
  const [messageBoxOfCreateNewCommand, setMessageBoxOfCreateNewCommand] =
    useState(false);
  const [commandConfirmed, setCommandConfirmed] = useState(false);

  // this state sets the controllers to solid green or blue depending on active or ready
  const controllersInitialState = [false, false, false, false, false];
  const [controllersStatus, setControllersStatus] = useState(
    controllersInitialState
  );

  const [isSystemSelectedMessage, setIsSystemSelectedMessage] = useState(false);

  // get master control commands
  useEffect(() => {
    getAuditTrailService({
      actionType: 'GLOBAL_MASTER_CONTROL',
    }).then((res) => {
      dispatch(
        handleCommandInfo({
          data: res,
          user,
          isF,
          flatEssSwitch,
          flatTgsSwitch,
          flatTesSwitch,
        })
      );
    });
  }, []);

  // Reset selected switch and dial control
  useEffect(() => {
    dispatch(handleUnselectAllSystem());
    dispatch(handleResetAll());
    dispatch(handleResetAllSelect());
    dispatch(handleResetCreateNewCommand());
  }, []);

  useEffect(() => {
    // if there a previous command date, then we will check if there's a change of date since last command, if so we will reset the command number to 0
    if (commandDate) {
      let difference = moment().diff(commandDate, 'days');
      if (difference) {
        dispatch(handleResetCommandNumber());
      }
    } else {
      // if we don't have a command date, we will set new commandDate to today
      dispatch(handleCommandDate(moment().format('DDMMYY')));
    }
  }, [moment().format('DDMMYY')]);

  // select system which toggles master control of ess, tes and tes system
  useEffect(() => {
    if (isNewCommandCreated) {
      if (essSelectSystem) {
        dispatch(handleDisplaySelectBoxWithAction(false));
        setToggleButtonColor(0);
        dispatch(handleControlResetInit(false));
      } else if (tgsSelectSystem) {
        dispatch(handleDisplaySelectBoxWithAction(false));
        setToggleButtonColor(1);
        dispatch(handleControlResetInit(false));
      } else if (tesSelectSystem) {
        dispatch(handleDisplaySelectBoxWithAction(false));
        setToggleButtonColor(2);
        dispatch(handleControlResetInit(false));
      } else if (hpSelectSystem) {
        dispatch(handleDisplaySelectBoxWithAction(false));
        setToggleButtonColor(3);
        dispatch(handleControlResetInit(false));
      }
    }

    return () => {
      dispatch(handleApplyCommand(false));
      setToggleButtonColor(false);
    };
  }, [essSelectSystem, tgsSelectSystem, tesSelectSystem, hpSelectSystem]);

  // this function is called when clicked on the buttons(create new command )
  const handleCreateNewCommand = (e) => {
    // this will create new command which will set everything to default and increase the command# by 1
    e.stopPropagation();
    dispatch(handleCreateCommand());
    dispatch(handleResetAllSelect());
    dispatch(handleResetAll());
    dispatch(handleApplyCommand(false));
    dispatch(handleUnselectAllSystem());
    dispatch(handleControlResetInit(false));
    handleCreateNewCommandMessageBox(1);

    if (essSelectSystem) {
      return Object.keys(flatEssSwitch).forEach((location) =>
        Object.keys(flatEssSwitch[location]).forEach((machine) => {
          dispatch(handleUnSelectIndividualMachine({ location, machine }));
        })
      );
    } else if (tgsSelectSystem) {
      return Object.keys(flatTgsSwitch).forEach((location) =>
        Object.keys(flatTgsSwitch[location]).forEach((machine) => {
          dispatch(tgsHandleUnSelectIndividualMachine({ location, machine }));
        })
      );
    } else if (tesSelectSystem) {
      return Object.keys(flatTesSwitch).forEach((location) =>
        Object.keys(flatTesSwitch[location]).forEach((machine) => {
          dispatch(tesHandleUnSelectIndividualMachine({ location, machine }));
        })
      );
    } else return;
  };

  const handleCreateNewCommandMessageBox = () => {
    setMessageBoxOfCreateNewCommand(true);
  };

  const handleMessageBoxOfSelectSystem = () => {
    const noSystemSelected = !essSelectSystem && !tesSelectSystem && !tgsSelectSystem && !hpSelectSystem;

    if (noSystemSelected && isNewCommandCreated) {
      setIsSystemSelectedMessage(true);
    }
  };

  const selectSystemMessage = [
    t('masterControl.messages.selectSystemFirst'),
    t('masterControl.systems.ess'),
    t('masterControl.systems.tgs'),
    t('masterControl.systems.tes'),
    t('masterControl.systems.hp'),
  ];

  return (
    <Wrapper>
      <MasterControlProvider>
        <TitleContainer title={t('masterControl.title')} />
        <ContentsWrapper>
          <ContainerSelectSystem
            toggleButtonColor={toggleButtonColor}
            handleCreateNewCommand={handleCreateNewCommand}
            handleCreateNewCommandMessageBox={handleCreateNewCommandMessageBox}
            setIsSystemSelectedMessage={setIsSystemSelectedMessage}
          />

          {messageBoxOfCreateNewCommand && !isNewCommandCreated && (
            <SelectCreateNewCommandMessage
              title={t('masterControl.commands.title')}
              message={t('masterControl.commands.selectCreateNew')}
              onClose={() => setMessageBoxOfCreateNewCommand(false)}
            />
          )}

          {isSystemSelectedMessage && isNewCommandCreated && (
            <SelectSystemMessage
              title={t('masterControl.commands.title')}
              subtitle={t('masterControl.commands.selectSystem')}
              messages={selectSystemMessage}
              onClose={() => setIsSystemSelectedMessage(false)}
            />
          )}

          <MasterControlContents
            controllersStatus={controllersStatus}
            setControllersStatus={setControllersStatus}
            setCommandConfirmed={setCommandConfirmed}
            handleCreateNewCommand={handleCreateNewCommand}
            handleCreateNewCommandMessageBox={handleCreateNewCommandMessageBox}
            commandConfirmed={commandConfirmed}
            isSystemSelectedMessage={isSystemSelectedMessage}
            handleMessageBoxOfSelectSystem={handleMessageBoxOfSelectSystem}
            messageBoxOfCreateNewCommand={isNewCommandCreated}
          />
        </ContentsWrapper>
      </MasterControlProvider>
    </Wrapper>
  );
};

export default MasterControlMain;

const Wrapper = styled.div`
  height: 674px;
  width: 1216px;

  ${flexDirectionColumn}
  position: relative;
`;

const ContentsWrapper = styled.div`
  width: 1216px;
  height: 632px;
  border-radius: 26px 16px 16px 16px;

  ${layerADark}

  display: flex;
  justify-content: space-between;

  padding: 10rem;
`;

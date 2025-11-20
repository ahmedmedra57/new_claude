import { useEffect, useState } from 'react';
import { useESSSwitchStore, useMCCommandStore, useMCStore, useTESSwitchStore, useTGSSwitchStore, useUnitsStore, useUserStore } from '../zustand-stores';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { flexDirectionColumn, layerADark } from '../styles/commonStyles';
import TitleContainer from '../TitleContainer';
import MasterControlContents from './MasterControlContents';
import ContainerSelectSystem from './selectSystemAndAddCommand/ContainerSelectSystem';
import SelectCreateNewCommandMessage from './userMessages/SelectCreateNewCommandMessage';
import MasterControlProvider from './MaterControlContext';
import { getAuditTrailService } from '../../services';
import moment from 'moment';
import SelectSystemMessage from './userMessages/SelectSystemMessage';

import { useMCCommandStore, useMasterControlSelectStore } from '../zustand-stores';
const MasterControlMain = () => {
  const { resetAllSelect } = useMasterControlSelectStore();
  const { t } = useTranslation();
  // redux
  
  const { flatEssSwitch } = useESSSwitchStore();
  const { flatTesSwitch } = useTESSwitchStore();
  const { flatTgsSwitch } = useTGSSwitchStore();
  const { user } = useUserStore();
  const { isF } = useUnitsStore();

  const mCState = useMCStore();

  const essSelectSystem = mCState.selectSystem.ess;
  const tgsSelectSystem = mCState.selectSystem.tgs;
  const tesSelectSystem = mCState.selectSystem.tes;
  const hpSelectSystem = mCState.selectSystem.hp;

  const mCCommandState = useMCCommandStore();
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
      useMCCommandStore().setCommandInfo({
          data: res,
          user,
          isF,
          flatEssSwitch,
          flatTgsSwitch,
          flatTesSwitch,
        });
    });
  }, []);

  // Reset selected switch and dial control
  useEffect(() => {
    useMCStore().unselectAllSystem();
    useMasterControlSelectStore().resetAll();
    useMasterControlSelectStore().resetAllSelect();
    useMCCommandStore().resetCreateNewCommand();
  }, []);

  useEffect(() => {
    // if there a previous command date, then we will check if there's a change of date since last command, if so we will reset the command number to 0
    if (commandDate) {
      let difference = moment().diff(commandDate, 'days');
      if (difference) {
        useMCCommandStore().resetCommandNumber();
      }
    } else {
      // if we don't have a command date, we will set new commandDate to today
      useMCCommandStore().setCommandDate(moment().format('DDMMYY'));
    }
  }, [moment().format('DDMMYY')]);

  // select system which toggles master control of ess, tes and tes system
  useEffect(() => {
    if (isNewCommandCreated) {
      if (essSelectSystem) {
        useMasterControlSelectStore().displaySelectBoxWithAction(false);
        setToggleButtonColor(0);
        useMCStore().resetControlInit(false);
      } else if (tgsSelectSystem) {
        useMasterControlSelectStore().displaySelectBoxWithAction(false);
        setToggleButtonColor(1);
        useMCStore().resetControlInit(false);
      } else if (tesSelectSystem) {
        useMasterControlSelectStore().displaySelectBoxWithAction(false);
        setToggleButtonColor(2);
        useMCStore().resetControlInit(false);
      } else if (hpSelectSystem) {
        useMasterControlSelectStore().displaySelectBoxWithAction(false);
        setToggleButtonColor(3);
        useMCStore().resetControlInit(false);
      }
    }

    return () => {
      useMCCommandStore().applyCommand(false);
      setToggleButtonColor(false);
    };
  }, [essSelectSystem, tgsSelectSystem, tesSelectSystem, hpSelectSystem]);

  // this function is called when clicked on the buttons(create new command )
  const handleCreateNewCommand = (e) => {
    // this will create new command which will set everything to default and increase the command# by 1
    e.stopPropagation();
    useMCCommandStore().createCommand();
    useMasterControlSelectStore().resetAllSelect();
    useMasterControlSelectStore().resetAll();
    useMCCommandStore().applyCommand(false);
    useMCStore().unselectAllSystem();
    useMCStore().resetControlInit(false);
    handleCreateNewCommandMessageBox(1);

    if (essSelectSystem) {
      return Object.keys(flatEssSwitch).forEach((location) =>
        Object.keys(flatEssSwitch[location]).forEach((machine) => {
          useMasterControlSelectStore().unselectMachine({ location, machine });
        });
    } else if (tgsSelectSystem) {
      return Object.keys(flatTgsSwitch).forEach((location) =>
        Object.keys(flatTgsSwitch[location]).forEach((machine) => {
          setUnSelectIndividualMachine({ location, machine });
        });
    } else if (tesSelectSystem) {
      return Object.keys(flatTesSwitch).forEach((location) =>
        Object.keys(flatTesSwitch[location]).forEach((machine) => {
          setUnSelectIndividualMachine({ location, machine });
        });
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

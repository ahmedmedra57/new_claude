import { handleSettingsSelectedOne } from '../../../components/store/slices/settings/force&CommandAndAdminSelectSlice';

export const settingsSwitchCountHandler = (machines, swt, dispatch) => {
  let selectedSwtNumber = 0;
  machines.forEach((location) =>
    location.forEach((machine) => {
      if (typeof machine === 'object') {
        machine.forEach((el) => {
          if (el) {
            selectedSwtNumber += 1;
          }
        });
      } else {
        if (machine) {
          selectedSwtNumber += 1;
        }
      }
    })
  );
  dispatch(
    handleSettingsSelectedOne({
      switch: swt,
      selectedOne: `${selectedSwtNumber} switches`,
    })
  );
};

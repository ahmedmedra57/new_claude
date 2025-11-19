const essButton = '/images/settings-ess-blue-button.svg';
const essButtonActive = '/images/settings-ess-green-button.svg';
const essButtonDisable = '/images/settings-ess-grey-button.svg';
const sysButton = '/images/settings-sys-blue-button.svg';
const sysButtonActive = '/images/settings-sys-green-button.svg';
const tgsButton = '/images/settings-tgs-blue-button.svg';
const tgsButtonActive = './images/settings-tgs-green-button.svg';
const tgsButtonDisable = './images/settings-tgs-grey-button.svg';
const tesButton = '/images/settings-tes-blue-button.svg';
const tesButtonActive = './images/settings-tes-green-button.svg';
const tesButtonDisable = './images/settings-tes-grey-button.svg';
const ateButtonDisable = '/images/settings-ate-grey-button.svg';
const hpButtonDisable = '/images/settings-hp-grey-button.svg';
const hpButtonActive = '/images/settings-hp-green-button.svg';
const hpButton = '/images/settings-hp-blue-button.svg';

// buttons for Ess, Tgs, Tes, Hp, Ate, and Sys : Mobile.
const mobileEssButton = './images/settings-mobile-headers-systemIcon-ess.svg';
const mobileEssButtonActive =
  './images/settings-mobile-headers-systemIcon-ess-active.svg';
const mobileEssButtonDisable =
  './images/settings-mobile-essButton-disabled.svg';
const mobileTgsButton = './images/settings-mobile-headers-systemIcon-tgs.svg';
const mobileTgsButtonActive =
  './images/settings-mobile-headers-systemIcon-tgs-active.svg';
const mobileTgsButtonDisable =
  './images/settings-mobile-tgsButton-disabled.svg';
const mobileTesButton = './images/settings-mobile-headers-systemIcon-tes.svg';
const mobileTesButtonActive =
  './images/settings-mobile-headers-systemIcon-tes-active.svg';
const mobileTesButtonDisable =
  './images/settings-mobile-tesButton-disabled.svg';
const mobileHpButtonDisable =
  './images/settings-mobile-headers-systemIcon-hp-disabled.svg';
const mobileAteButtonDisable =
  './images/settings-mobile-headers-systemIcon-ate-disabled.svg';
const mobileSysButton = './images/settings-mobile-headers-systemIcon-sys.svg';
const mobileSysButtonActive =
  './images/settings-mobile-headers-systemIcon-sys-active.svg';

export const getSettingsHeaderData = (isMobile) => {
  let headers = [];
  if (isMobile) {
    headers = [
      {
        title: 'electric switch system',
        button: mobileEssButton,
        activatedButton: mobileEssButtonActive,
        deactivatedButton: mobileEssButtonDisable,
      },
      {
        title: 'typhoon gas system',
        button: mobileTgsButton,
        activatedButton: mobileTgsButtonActive,
        deactivatedButton: mobileTgsButtonDisable,
      },
      {
        title: 'typhoon electrical system',
        button: mobileTesButton,
        activatedButton: mobileTesButtonActive,
        deactivatedButton: mobileTesButtonDisable,
      },
      {
        title: 'heating platforms',
        button: '',
        activatedButton: '',
        deactivatedButton: mobileHpButtonDisable,
      },
      {
        title: 'additional track equipment',
        button: '',
        activatedButton: '',
        deactivatedButton: mobileAteButtonDisable,
      },
      {
        title: 'system commands',
        button: mobileSysButton,
        activatedButton: mobileSysButtonActive,
        deactivatedButton: null,
      },
    ];
  } else {
    headers = [
      {
        title: 'electric switch system',
        button: essButton,
        activatedButton: essButtonActive,
        deactivatedButton: essButtonDisable,
      },
      {
        title: 'typhoon gas system',
        button: tgsButton,
        activatedButton: tgsButtonActive,
        deactivatedButton: tgsButtonDisable,
      },
      {
        title: 'typhoon electrical system',
        button: tesButton,
        activatedButton: tesButtonActive,
        deactivatedButton: tesButtonDisable,
      },
      {
        title: 'heating platforms',
        button: hpButton,
        activatedButton: hpButtonActive,
        deactivatedButton: hpButtonDisable,
      },
      {
        title: 'additional track equipment',
        button: '',
        activatedButton: '',
        deactivatedButton: ateButtonDisable,
      },
      {
        title: 'system commands',
        button: sysButton,
        activatedButton: sysButtonActive,
        deactivatedButton: null,
      },
    ];
  }
  return headers;
};

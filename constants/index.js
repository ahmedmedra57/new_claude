export const ROLES = {
  Administrator: 'Administrator',
  Sub_Admin: 'Sub_Admin',
  Manager: 'Manager',
  Employee_ESS_Control: 'Employee_ESS_Control',
  Employee_TGS_TES_Control: 'Employee_TGS_TES_Control',
  Employee_ESS_TGS_TES_Control: 'Employee_ESS_TGS_TES_Control',
  Employee_HP_Control: 'Employee_HP_Control',
  Employee_ATE_Control: 'Employee_ATE_Control',
  Guest_ESS_Control: 'Guest_ESS_Control',
  Guest_TGS_TES_Control: 'Guest_TGS_TES_Control',
  Guest_ESS_TGS_TES_Control: 'Guest_ESS_TGS_TES_Control',
  Guest_HP_Control: 'Guest_HP_Control',
  Guest_ATE_Control: 'Guest_ATE_Control',
  Winter_Disk: 'Winter_Disk',
};
export const NOT_ALLOWED_ROLES = ['operator', 'supervisor'];

export const SETTINGS_OPTIONS = {
  USER_PROFILE: 'USER_PROFILE',
  UNITS: 'UNITS',
  WIND_FACTOR: 'WIND_FACTOR',
  SNOW_SENSOR: 'SNOW_SENSOR',
  FORCE_COMMANDS: 'FORCE_COMMANDS',
  ADMIN: 'ADMIN',
  INTERFACE_MODE: 'INTERFACE_MODE',
};

export const PERMISSIONS = {
  ESS_CONTROL: 'ESS_CONTROL',
  TGS_CONTROL: 'TGS_CONTROL',
  TES_CONTROL: 'TES_CONTROL',
  HP_CONTROL: 'HP_CONTROL',
  ATE_CONTROL: 'ATE_CONTROL',
  AUDIT_TRAIL: 'AUDIT_TRAIL',
  PRINT_TELEMETRY: 'PRINT_TELEMETRY',
  WRITE: 'WRITE',
  READ: 'READ',
  ALLOWED_SETTINGS: 'ALLOWED_SETTINGS',
  SEARCH_TELEMETRY: 'SEARCH_TELEMETRY',
  MASTER_CONTROL: 'MASTER_CONTROL',
};

const allRoles = Object.keys(ROLES);

const controlRoles = [
  'Administrator',
  'Sub_Admin',
  'Manager',
  'Employee_ESS_Control',
  'Employee_TGS_TES_Control',
  'Employee_ESS_TGS_TES_Control',
  'Employee_HP_Control',
  'Employee_ATE_Control',
];

const guestControlRoles = [
  'Guest_ESS_Control',
  'Guest_TGS_TES_Control',
  'Guest_ESS_TGS_TES_Control',
  'Guest_HP_Control',
  'Guest_ATE_Control',
];


const ALLOWED_SETTINGS = {
  USER_PROFILE: allRoles,
  UNITS: allRoles,
  WIND_FACTOR: controlRoles,
  SNOW_SENSOR: controlRoles,
  FORCE_COMMANDS: controlRoles,
  ADMIN: ['Administrator', 'Sub_Admin'],
  INTERFACE_MODE: allRoles,
};

export const ROLE_PERMISSIONS = {
  WRITE: controlRoles,
  READ: allRoles,
  ESS_CONTROL: [
    ROLES.Administrator,
    ROLES.Sub_Admin,
    ROLES.Manager,
    ROLES.Employee_ESS_Control, 
    ROLES.Employee_ESS_TGS_TES_Control,
    ROLES.Winter_Disk,
    ROLES.Guest_ESS_Control,
    ROLES.Guest_ESS_TGS_TES_Control,
  ],
  TGS_CONTROL: [
    ROLES.Administrator,
    ROLES.Sub_Admin,
    ROLES.Manager,
    ROLES.Employee_TGS_TES_Control,
    ROLES.Employee_ESS_TGS_TES_Control,
    ROLES.Winter_Disk,
    ROLES.Guest_TGS_TES_Control,
    ROLES.Guest_ESS_TGS_TES_Control,
  ],
  TES_CONTROL: [
    ROLES.Administrator,
    ROLES.Sub_Admin,
    ROLES.Manager,
    ROLES.Employee_TGS_TES_Control,
    ROLES.Employee_ESS_TGS_TES_Control,
    ROLES.Winter_Disk,
    ROLES.Guest_TGS_TES_Control,
    ROLES.Guest_ESS_TGS_TES_Control,
  ],
  HP_CONTROL: [ROLES.Administrator,ROLES.Sub_Admin,ROLES.Manager,ROLES.Guest_HP_Control,ROLES.Employee_HP_Control,ROLES.Winter_Disk],
  ATE_CONTROL: [ROLES.Employee_ATE_Control,ROLES.Guest_ATE_Control],
  PRINT_TELEMETRY: controlRoles,
  SEARCH_TELEMETRY: controlRoles,
  MASTER_CONTROL: [...controlRoles, ROLES.Winter_Disk],
  ALLOWED_SETTINGS,
  AUDIT_TRAIL: controlRoles,
};

export const tabsSrc = {
  ess: {
    src: '/images/sidebar-ess.svg',
    activeSrc: '/images/sidebar-ess-active.svg',
    inactiveSrc: '/images/sidebar-ess-disabled.svg',
  },
  tgs: {
    src: '/images/sidebar-tgs.svg',
    activeSrc: '/images/sidebar-tgs-active.svg',
    inactiveSrc: '/images/sidebar-tgs-disabled.svg',
  },
  tes: {
    src: '/images/sidebar-tes.svg',
    activeSrc: '/images/sidebar-tes-active.svg',
    inactiveSrc: '/images/sidebar-tes-disabled.svg',
  },
  faults: {
    src: '/images/sidebar-faults.svg',
    activeSrc: '/images/sidebar-faults-active.svg',
    inactiveSrc: '/images/sidebar-faults-disabled.svg',
    activeRedSrc: '/images/sidebar-faults-red-active.svg',
    redSrc: '/images/sidebar-faults-red.svg',
  },
  globalOverview: {
    src: '/images/sidebar-global-overview.svg',
    activeSrc: '/images/sidebar-global-overview-active.svg',
    inactiveSrc: '/images/sidebar-global-overview-disabled.svg',
  },
  telemetry: {
    src: '/images/sidebar-telemetry.svg',
    activeSrc: '/images/sidebar-telemetry-active.svg',
    inactiveSrc: '/images/sidebar-telemetry-disabled.svg',
  },
  masterControl: {
    src: '/images/sidebar-master-control.svg',
    activeSrc: '/images/sidebar-master-control-active.svg',
    inactiveSrc: '/images/sidebar-master-control-disabled.svg',
  },
  heatingPlatform: {
    src: '/images/sidebar-hp.svg',
    activeSrc: '/images/sidebar-hp-active.svg',
    inactiveSrc: '/images/sidebar-hp-disabled.svg',
    purpleCircleSrc: '/images/hp-button.svg',
    purpleCircleActiveSrc: '/images/hp-active-button.svg',
  },
  // heatingPlatform: {
  //   src: '/images/sidebar-heating-platform.svg',
  //   activeSrc: '/images/sidebar-heating-platform-active.svg',
  //   inactiveSrc: '/images/sidebar-heating-platform-disabled.svg',
  // },
  setting: {
    src: '/images/sidebar-setting.svg',
    activeSrc: '/images/sidebar-setting-active.svg',
    inactiveSrc: '/images/sidebar-setting-disabled.svg',
  },
  auditTrail: {
    src: '/images/sidebar-audit-trail.svg',
    activeSrc: '/images/sidebar-audit-trail-active.svg',
    inactiveSrc: '/images/sidebar-audit-trail-disabled.svg',
  },
  ate: {
    src: '/images/sidebar-ate.svg',
    inactiveSrc: '/images/sidebar-ate-disabled.svg',
    activeSrc: '/images/sidebar-ate-active.svg',
  },
  reportStatus: {
    src: '/images/sidebar-report-status.svg',
    activeSrc: '/images/sidebar-report-status-active.svg',
    inactiveSrc: '/images/sidebar-report-status-disabled.svg',
  },
};

export const GROUPS_ACTIVE_TAPS = {
  groupA: [
    tabsSrc.globalOverview.activeSrc,
    tabsSrc.telemetry.activeSrc,
    tabsSrc.masterControl.activeSrc,
  ],
  groupB: [tabsSrc.ess.activeSrc, tabsSrc.tgs.activeSrc, tabsSrc.tes.activeSrc],
  groupC: [tabsSrc.heatingPlatform.activeSrc],
  groupD: [
    tabsSrc.setting.activeSrc,
    tabsSrc.auditTrail.activeSrc,
    tabsSrc.faults.activeSrc,
    tabsSrc.reportStatus.activeSrc,
  ],
};

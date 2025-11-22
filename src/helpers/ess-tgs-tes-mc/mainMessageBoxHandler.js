const mainMessageBoxHandler = (
  id,
  scope,
  type,
  programName,
  // specificLocation
) => {
  let openMessage = false;
  let openLocationMessage = false;
  let openSpecificLocationMessage = false;
  let newMessage = [];
  let newMessageTitle = '';

  if (type === 'switches') {
    newMessageTitle = 'locations master control';
  } else {
    newMessageTitle = 'master control';
  }

  // if (specificLocation) {
  //   openSpecificLocationMessage = true;
  // } else if (scope === 'switch') {
  //   openMessage = true;
  // } else {
  //   openLocationMessage = true;
  // }

  switch (id) {
    case 'tempA':
      // instantHeat, heating schedule
      newMessage = [
        'wrong temperature',
        `in order to finalize ${programName},`,
        'please input your temperature first',
        '( the minimum temperature is 121°C - 250°F )',
        '( the maximum temperature is 999°C - 1830°F )',
      ];

      break;
    case 'tempB':
      newMessage = [
        'wrong temperature',
        `in order to finalize ${programName},`,
        'please input your temperature first',
        '( the minimum temperature is 25°C - 77°F )',
        '( the maximum temperature is 120°C - 248°F )',
      ];

      break;
    case 'selectA':
      newMessage = [`select ${type}`, `please select ${type} to continue`];

      break;
    case 'selectB':
      newMessage = [
        `select ${type} and a schedule`,
        `please select ${type} and a start date and end date`,
      ];
      break;

    case 'selectC':
      newMessage = [
        'ats-automatic transfer system',
        'please select ATS option before apply',
      ];
      break;
    default:
      throw new Error('unknown error', id);
  }

  return {
    openMessage,
    openLocationMessage,
    openSpecificLocationMessage,
    newMessage,
    newMessageTitle,
  };
};

export default mainMessageBoxHandler;

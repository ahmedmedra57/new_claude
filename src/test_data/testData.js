const testData = (essState, tgsState, locations, tesState) => {
  const isEss = essState && Object.keys(essState).length > 0;
  const isTgs = tgsState && Object.keys(tgsState).length > 0;
  const isTes = tesState && Object.keys(tesState).length > 0;
  // !!TEST DATA FOR TGS!!
  let testTgsSwitch = {};
  if (isTgs) {
    testTgsSwitch = {
      ...tgsState,
      '658ace1f-84c7-477f-a09d-eb6c63c89b6a': {
        testTgsTes: {
          '100000009e851421':
            tgsState['658ace1f-84c7-477f-a09d-eb6c63c89b6a'][
              '100000009e851421'
            ],
        },
      },
      10269483039492350: {
        testTgsTes2: {
          '10000000badaff49': tgsState['10269483039492350']['10000000badaff49'],
        },
      },
    };
  }

  // !!TEST DATA FOR ESS!!
  let testEssSwitch = {};
  if (isEss) {
    testEssSwitch = {
      ...essState,
      1559816739777: {
        testEss: {
          '10000000c5d50c21': essState['1559816739777']['10000000c5d50c21'],
          'b8:27:eb:d1:d4:22': essState['1559816739777']['b8:27:eb:d1:d4:22'],
          'b8:27:eb:e5:c8:8f': essState['1559816739777']['b8:27:eb:e5:c8:8f'],
        },
      },
      11561044483344512: {
        testEss2: {
          '100000006e16eb11': essState['11561044483344512']['100000006e16eb11'],
          '10000000721ed311': essState['11561044483344512']['10000000721ed311'],
        },
      },
    };
  }

  // !!TEST DATA FOR TES!!
  let testTesSwitch = {};
  if (isTes) {
    testTesSwitch = {
      ...tesState,
      '658ace1f-84c7-477f-a09d-eb6c63c89b6a': {
        testTgsTes: {
          '100000009e851421':
            tesState['658ace1f-84c7-477f-a09d-eb6c63c89b6a'][
              '100000009e851421'
            ],
        },
      },
      10269483039492350: {
        testTgsTes2: {
          '10000000badaff49': tesState['10269483039492350']['10000000badaff49'],
        },
      },
    };
  }

  //  !! TEST ESS DATA FOR LOCATIONS
  let testEssLocationsAll = {};
  if (locations && isEss) {
    testEssLocationsAll = {
      ...locations.all,
      1559816739777: {
        testEss: {
          ...locations.all[1559816739777],
          specificLocationName: 'testEss',
          devices: {
            ...locations.all[1559816739777].devices,
            '10000000c5d50c21': {
              ...locations.all[1559816739777].devices['10000000c5d50c21'],
              specificLocationName: 'testEss',
            },
            'b8:27:eb:d1:d4:22': {
              ...locations.all[1559816739777].devices['b8:27:eb:d1:d4:22'],
              specificLocationName: 'testEss',
            },
            'b8:27:eb:e5:c8:8f': {
              ...locations.all[1559816739777].devices['b8:27:eb:e5:c8:8f'],
              specificLocationName: 'test',
            },
          },
          // ...locations.all[1559816739777],
          // specificLocationName: 'testEss',
          // devices: {
          //   ...locations.all[1559816739777].devices,
          //   'b8:27:eb:d1:d4:22': {
          //     ...locations.all[1559816739777].devices['b8:27:eb:d1:d4:22'],
          //     specificLocationName: 'testEss',
          //   },
          // },
          // ...locations.all[1559816739777],
          // specificLocationName: 'test',
          // devices: {
          //   ...locations.all[1559816739777].devices,
          //   'b8:27:eb:e5:c8:8f': {
          //     ...locations.all[1559816739777].devices['b8:27:eb:e5:c8:8f'],
          //     specificLocationName: 'test',
          //   },
          // },
        },
      },

      11561044483344512: {
        testEss2: {
          ...locations.all[11561044483344512],
          specificLocationName: 'testEss2',
          devices: {
            ...locations.all[11561044483344512].devices,
            '100000006e16eb11': {
              ...locations.all[11561044483344512].devices['100000006e16eb11'],
              specificLocationName: 'testEss2',
            },
            '10000000721ed311': {
              ...locations.all[11561044483344512].devices['10000000721ed311'],
              specificLocationName: 'testEss2',
            },
          },
        },
      },

      // 10269483039492350: {
      //   test2: {
      //     ...locations.all['10269483039492350'],
      //     specificLocationName: 'test2',
      //     devices: {
      //       ...locations.all['10269483039492350'].devices,
      //       '10000000badaff49': {
      //         ...locations.all['10269483039492350'].devices['10000000badaff49'],
      //         specificLocationName: 'test2',
      //       },
      //     },
      //   },
      // },
    };
  }

  //  !! TEST TGS DATA FOR LOCATIONS
  let testTgsLocationsAll = {};
  if (locations && isTgs) {
    testTgsLocationsAll = {
      ...locations.all,
      '658ace1f-84c7-477f-a09d-eb6c63c89b6a': {
        testTgsTes: {
          ...locations.all['658ace1f-84c7-477f-a09d-eb6c63c89b6a'],
          specificLocationName: 'testTgsTes',
          devices: {
            ...locations.all['658ace1f-84c7-477f-a09d-eb6c63c89b6a'].devices,
            '100000009e851421': {
              ...locations.all['658ace1f-84c7-477f-a09d-eb6c63c89b6a'].devices[
                '100000009e851421'
              ],
              specificLocationName: 'testTgsTes',
            },
          },
        },
      },

      10269483039492350: {
        testTgsTes2: {
          ...locations.all['10269483039492350'],
          specificLocationName: 'testTgsTes2',
          devices: {
            ...locations.all['10269483039492350'].devices,
            '10000000badaff49': {
              ...locations.all['10269483039492350'].devices['10000000badaff49'],
              specificLocationName: 'testTgsTes2',
            },
          },
        },
      },
    };
  }

  //  !! TEST TES DATA FOR LOCATIONS
  let testTesLocationsAll = {};
  if (locations && isTes) {
    testTesLocationsAll = {
      ...locations.all,
      '658ace1f-84c7-477f-a09d-eb6c63c89b6a': {
        testTgsTes: {
          ...locations.all['658ace1f-84c7-477f-a09d-eb6c63c89b6a'],
          specificLocationName: 'testTgsTes',
          devices: {
            ...locations.all['658ace1f-84c7-477f-a09d-eb6c63c89b6a'].devices,
            '100000009e851421': {
              ...locations.all['658ace1f-84c7-477f-a09d-eb6c63c89b6a'].devices[
                '100000009e851421'
              ],
              specificLocationName: 'testTgsTes',
            },
          },
        },
      },
    };
  }

  //  !! TEST ALL DATA FOR LOCATIONS
  let testAllLocations = {};
  if (locations && isEss && isTgs && isTes) {
    testAllLocations = {
      ...locations,
      all: {
        ...locations.all,
        '658ace1f-84c7-477f-a09d-eb6c63c89b6a': {
          testTgsTes: {
            ...locations.all['658ace1f-84c7-477f-a09d-eb6c63c89b6a'],
            specificLocationName: 'testTgsTes',
            devices: {
              ...locations.all['658ace1f-84c7-477f-a09d-eb6c63c89b6a'].devices,
              '100000009e851421': {
                ...locations.all['658ace1f-84c7-477f-a09d-eb6c63c89b6a']
                  .devices['100000009e851421'],
                specificLocationName: 'testTgsTes',
              },
            },
          },
        },

        10269483039492350: {
          testTgsTes2: {
            ...locations.all['10269483039492350'],
            specificLocationName: 'testTgsTes2',
            devices: {
              ...locations.all['10269483039492350'].devices,
              '10000000badaff49': {
                ...locations.all['10269483039492350'].devices[
                  '10000000badaff49'
                ],
                specificLocationName: 'testTgsTes2',
              },
            },
          },
        },
        1559816739777: {
          testEss: {
            ...locations.all[1559816739777],
            specificLocationName: 'testEss',
            devices: {
              ...locations.all[1559816739777].devices,
              '10000000c5d50c21': {
                ...locations.all[1559816739777].devices['10000000c5d50c21'],
                specificLocationName: 'testEss',
              },
              'b8:27:eb:d1:d4:22': {
                ...locations.all[1559816739777].devices['b8:27:eb:d1:d4:22'],
                specificLocationName: 'testEss',
              },
              'b8:27:eb:e5:c8:8f': {
                ...locations.all[1559816739777].devices['b8:27:eb:e5:c8:8f'],
                specificLocationName: 'testEss',
              },
            },
          },
        },
        11561044483344512: {
          testEss2: {
            ...locations.all[11561044483344512],
            specificLocationName: 'testEss2',
            devices: {
              ...locations.all[11561044483344512].devices,
              '100000006e16eb11': {
                ...locations.all[11561044483344512].devices['100000006e16eb11'],
                specificLocationName: 'testEss2',
              },
              '10000000721ed311': {
                ...locations.all[11561044483344512].devices['10000000721ed311'],
                specificLocationName: 'testEss2',
              },
            },
          },
        },
      },
      tgs: {
        ...locations.tgs,
        '658ace1f-84c7-477f-a09d-eb6c63c89b6a': {
          testTgsTes: {
            ...locations.all['658ace1f-84c7-477f-a09d-eb6c63c89b6a'],
            specificLocationName: 'testTgsTes',
            devices: {
              ...locations.all['658ace1f-84c7-477f-a09d-eb6c63c89b6a'].devices,
              '100000009e851421': {
                ...locations.all['658ace1f-84c7-477f-a09d-eb6c63c89b6a']
                  .devices['100000009e851421'],
                specificLocationName: 'testTgsTes',
              },
            },
          },
        },

        10269483039492350: {
          testTgsTes2: {
            ...locations.all['10269483039492350'],
            specificLocationName: 'testTgsTes2',
            devices: {
              ...locations.all['10269483039492350'].devices,
              '10000000badaff49': {
                ...locations.all['10269483039492350'].devices[
                  '10000000badaff49'
                ],
                specificLocationName: 'testTgsTes2',
              },
            },
          },
        },
      },
      ess: {
        ...locations.ess,
        1559816739777: {
          testEss: {
            ...locations.all[1559816739777],
            specificLocationName: 'testEss',
            devices: {
              ...locations.all[1559816739777].devices,
              '10000000c5d50c21': {
                ...locations.all[1559816739777].devices['10000000c5d50c21'],
                specificLocationName: 'testEss',
              },
              'b8:27:eb:d1:d4:22': {
                ...locations.all[1559816739777].devices['b8:27:eb:d1:d4:22'],
                specificLocationName: 'testEss',
              },
              'b8:27:eb:e5:c8:8f': {
                ...locations.all[1559816739777].devices['b8:27:eb:e5:c8:8f'],
                specificLocationName: 'testEss',
              },
            },
          },
        },
        11561044483344512: {
          testEss2: {
            ...locations.all[11561044483344512],
            specificLocationName: 'testEss2',
            devices: {
              ...locations.all[11561044483344512].devices,
              '100000006e16eb11': {
                ...locations.all[11561044483344512].devices['100000006e16eb11'],
                specificLocationName: 'testEss2',
              },
              '10000000721ed311': {
                ...locations.all[11561044483344512].devices['10000000721ed311'],
                specificLocationName: 'testEss2',
              },
            },
          },
        },
      },
      tes: {
        ...locations.tes,
        '658ace1f-84c7-477f-a09d-eb6c63c89b6a': {
          testTgsTes: {
            ...locations.all['658ace1f-84c7-477f-a09d-eb6c63c89b6a'],
            specificLocationName: 'testTgsTes',
            devices: {
              ...locations.all['658ace1f-84c7-477f-a09d-eb6c63c89b6a'].devices,
              '100000009e851421': {
                ...locations.all['658ace1f-84c7-477f-a09d-eb6c63c89b6a']
                  .devices['100000009e851421'],
                specificLocationName: 'testTgsTes',
              },
            },
          },
        },

        10269483039492350: {
          testTgsTes2: {
            ...locations.all['10269483039492350'],
            specificLocationName: 'testTgsTes2',
            devices: {
              ...locations.all['10269483039492350'].devices,
              '10000000badaff49': {
                ...locations.all['10269483039492350'].devices[
                  '10000000badaff49'
                ],
                specificLocationName: 'testTgsTes2',
              },
            },
          },
        },
      },
    };
  }

  return {
    testTgsSwitch,
    testTgsLocationsAll,
    testEssSwitch,
    testEssLocationsAll,
    testTesSwitch,
    testTesLocationsAll,
    testAllLocations,
  };
};

export default testData;

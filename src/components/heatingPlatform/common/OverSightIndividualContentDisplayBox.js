import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  justifyContentSpaceAround,
  justifyContentSpaceBetween,
  layerC,
} from '../../styles/commonStyles';

import SegmentContent from '../masterControlAndOverSight/overSightHP/segment/segmentContent';
import OverSightTitleInfo from '../masterControlAndOverSight/overSightHP/titleInfo';
import { useState } from 'react';
import Zone from '../masterControlAndOverSight/overSightHP/zone';
import OverSightSubIndividualContentDisplayBox from './OverSightSubIndividualContentDisplayBox';

const OverSightIndividualContentDisplayBox = ({
  isMainTitle,
  openingId,
  title,
  consumption,
  usage,
  isOn,
  dataAccessKey,
}) => {
  const sharonStationData = {
    seg1OP: {
      zones: [
        {
          id: 'zone 1',
          name: 'obj_01-03',
          thermocouple: '01',
          usage: 0,
          consumption: { energy: 0, measurement: 'kw', type: 'energy' },
          isOn: false,
          sections: [
            {
              id: 'section 1',
              name: 'obj_01',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 2',
              name: 'obj_02',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 3',
              name: 'obj_03',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
          ],
        },
        {
          id: 'zone 2',
          name: 'obj_04-06',
          thermocouple: '01',
          usage: 0,
          consumption: { energy: 0, measurement: 'kw', type: 'energy' },
          isOn: false,
          sections: [
            {
              id: 'section 4',
              name: 'obj_04',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 5',
              name: 'obj_05',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 6',
              name: 'obj_06',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
          ],
        },
        {
          id: 'zone 3',
          name: 'obj_07-09',
          thermocouple: '01',
          usage: 0,
          consumption: { energy: 0, measurement: 'kw', type: 'energy' },
          isOn: false,
          sections: [
            {
              id: 'section 7',
              name: 'obj_07',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 8',
              name: 'obj_08',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 9',
              name: 'obj_09',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
          ],
        },
        {
          id: 'zone 4',
          name: 'obj_10-12',
          thermocouple: '01',
          usage: 0,
          consumption: { energy: 0, measurement: 'kw', type: 'energy' },
          isOn: false,
          sections: [
            {
              id: 'section 10',
              name: 'obj_10',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 11',
              name: 'obj_11',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 12',
              name: 'obj_12',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
          ],
        },
        {
          id: 'zone 5',
          name: 'obj_13',
          thermocouple: '01',
          usage: 0,
          consumption: { energy: 0, measurement: 'kw', type: 'energy' },
          isOn: false,
          sections: [
            {
              id: 'section 13',
              name: 'obj_01',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
          ],
        },
      ],
    },
    seg2IP: {
      zones: [
        {
          id: 'zone 1',
          name: 'ibj_01-03',
          thermocouple: '01',
          usage: 0,
          consumption: { energy: 0, measurement: 'kw', type: 'energy' },
          isOn: false,
          sections: [
            {
              id: 'section 1',
              name: 'ibj_01',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 2',
              name: 'ibj_02',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 3',
              name: 'ibj_03',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
          ],
        },
        {
          id: 'zone 2',
          name: 'ibj_04-06',
          thermocouple: '01',
          usage: 0,
          consumption: { energy: 0, measurement: 'kw', type: 'energy' },
          isOn: false,
          sections: [
            {
              id: 'section 4',
              name: 'ibj_04',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 5',
              name: 'ibj_05',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 6',
              name: 'ibj_06',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
          ],
        },
        {
          id: 'zone 3',
          name: 'ibj_07-09',
          thermocouple: '01',
          usage: 0,
          consumption: { energy: 0, measurement: 'kw', type: 'energy' },
          isOn: false,
          sections: [
            {
              id: 'section 7',
              name: 'ibj_07',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 8',
              name: 'ibj_08',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 9',
              name: 'ibj_09',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
          ],
        },
        {
          id: 'zone 4',
          name: 'ibj_10-12',
          thermocouple: '01',
          usage: 0,
          consumption: { energy: 0, measurement: 'kw', type: 'energy' },
          isOn: false,
          sections: [
            {
              id: 'section 10',
              name: 'ibj_10',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 11',
              name: 'ibj_11',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 12',
              name: 'ibj_12',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
          ],
        },
        {
          id: 'zone 5',
          name: 'ibj_13',
          thermocouple: '01',
          usage: 0,
          consumption: { energy: 0, measurement: 'kw', type: 'energy' },
          isOn: false,
          sections: [
            {
              id: 'section 13',
              name: 'ibj_13',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
          ],
        },
      ],
    },
  };

  const blueHillStationData = {
    seg1CW: {
      zones: [
        {
          id: 'zone 1',
          name: 'cjb_01-03',
          thermocouple: '01',
          usage: 0,
          consumption: { energy: 0, measurement: 'kw', type: 'energy' },
          isOn: false,
          sections: [
            {
              id: 'section 1',
              name: 'cjb_01',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 2',
              name: 'cjb_02',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 3',
              name: 'cjb_03',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
          ],
        },
        {
          id: 'zone 2',
          name: 'cjb_04-06',
          thermocouple: '01',
          usage: 0,
          consumption: { energy: 0, measurement: 'kw', type: 'energy' },
          isOn: false,
          sections: [
            {
              id: 'section 4',
              name: 'cjb_04',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 5',
              name: 'cjb_05',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 6',
              name: 'cjb_06',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
          ],
        },
        {
          id: 'zone 3',
          name: 'cjb_07-09',
          thermocouple: '01',
          usage: 0,
          consumption: { energy: 0, measurement: 'kw', type: 'energy' },
          isOn: false,
          sections: [
            {
              id: 'section 7',
              name: 'cjb_07',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 8',
              name: 'cjb_08',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 9',
              name: 'cjb_09',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
          ],
        },
        {
          id: 'zone 4',
          name: 'cjb_10-12',
          thermocouple: '01',
          usage: 0,
          consumption: { energy: 0, measurement: 'kw', type: 'energy' },
          isOn: false,
          sections: [
            {
              id: 'section 10',
              name: 'cjb_10',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 11',
              name: 'cjb_11',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 12',
              name: 'cjb_12',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
          ],
        },
        {
          id: 'zone 5',
          name: 'cjb_13',
          thermocouple: '01',
          usage: 0,
          consumption: { energy: 0, measurement: 'kw', type: 'energy' },
          isOn: false,
          sections: [
            {
              id: 'section 13',
              name: 'cjb_13',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
          ],
        },
      ],
    },
    seg2OP: {
      zones: [
        {
          id: 'zone 1',
          name: 'obj_01-03',
          thermocouple: '01',
          usage: 0,
          consumption: { energy: 0, measurement: 'kw', type: 'energy' },
          isOn: false,
          sections: [
            {
              id: 'section 1',
              name: 'obj_01',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 2',
              name: 'obj_02',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 3',
              name: 'obj_03',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
          ],
        },
        {
          id: 'zone 2',
          name: 'obj_04-06',
          thermocouple: '01',
          usage: 0,
          consumption: { energy: 0, measurement: 'kw', type: 'energy' },
          isOn: false,
          sections: [
            {
              id: 'section 4',
              name: 'obj_04',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 5',
              name: 'obj_05',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 6',
              name: 'obj_06',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
          ],
        },
        {
          id: 'zone 3',
          name: 'obj_07-09',
          thermocouple: '01',
          usage: 0,
          consumption: { energy: 0, measurement: 'kw', type: 'energy' },
          isOn: false,
          sections: [
            {
              id: 'section 7',
              name: 'obj_07',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 8',
              name: 'obj_08',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 9',
              name: 'obj_09',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
          ],
        },
        {
          id: 'zone 4',
          name: 'obj_10-12',
          thermocouple: '01',
          usage: 0,
          consumption: { energy: 0, measurement: 'kw', type: 'energy' },
          isOn: false,
          sections: [
            {
              id: 'section 10',
              name: 'obj_10',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 11',
              name: 'obj_11',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 12',
              name: 'obj_12',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
          ],
        },
        {
          id: 'zone 5',
          name: 'obj_13',
          thermocouple: '01',
          usage: 0,
          consumption: { energy: 0, measurement: 'kw', type: 'energy' },
          isOn: false,
          sections: [
            {
              id: 'section 13',
              name: 'obj_01',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
          ],
        },
      ],
    },
    seg3IP: {
      zones: [
        {
          id: 'zone 1',
          name: 'ibj_01-03',
          thermocouple: '01',
          usage: 0,
          consumption: { energy: 0, measurement: 'kw', type: 'energy' },
          isOn: false,
          sections: [
            {
              id: 'section 1',
              name: 'ibj_01',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 2',
              name: 'ibj_02',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 3',
              name: 'ibj_03',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
          ],
        },
        {
          id: 'zone 2',
          name: 'ibj_04-06',
          thermocouple: '01',
          usage: 0,
          consumption: { energy: 0, measurement: 'kw', type: 'energy' },
          isOn: false,
          sections: [
            {
              id: 'section 4',
              name: 'ibj_04',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 5',
              name: 'ibj_05',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 6',
              name: 'ibj_06',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
          ],
        },
        {
          id: 'zone 3',
          name: 'ibj_07-09',
          thermocouple: '01',
          usage: 0,
          consumption: { energy: 0, measurement: 'kw', type: 'energy' },
          isOn: false,
          sections: [
            {
              id: 'section 7',
              name: 'ibj_07',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 8',
              name: 'ibj_08',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 9',
              name: 'ibj_09',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
          ],
        },
        {
          id: 'zone 4',
          name: 'ibj_10-12',
          thermocouple: '01',
          usage: 0,
          consumption: { energy: 0, measurement: 'kw', type: 'energy' },
          isOn: false,
          sections: [
            {
              id: 'section 10',
              name: 'ibj_10',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 11',
              name: 'ibj_11',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 12',
              name: 'ibj_12',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
          ],
        },
        {
          id: 'zone 5',
          name: 'ibj_13',
          thermocouple: '01',
          usage: 0,
          consumption: { energy: 0, measurement: 'kw', type: 'energy' },
          isOn: false,
          sections: [
            {
              id: 'section 13',
              name: 'ibj_13',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
          ],
        },
      ],
    },
    seg4BHW: {
      zones: [
        {
          id: 'zone 1',
          name: 'bajb_01-03',
          thermocouple: '01',
          usage: 0,
          consumption: { energy: 0, measurement: 'kw', type: 'energy' },
          isOn: false,
          sections: [
            {
              id: 'section 1',
              name: 'bajb_01',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 2',
              name: 'bajb_02',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 3',
              name: 'bajb_03',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
          ],
        },
        {
          id: 'zone 2',
          name: 'bajb_04-06',
          thermocouple: '01',
          usage: 0,
          consumption: { energy: 0, measurement: 'kw', type: 'energy' },
          isOn: false,
          sections: [
            {
              id: 'section 4',
              name: 'bajb_04',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 5',
              name: 'bajb_05',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 6',
              name: 'bajb_06',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
          ],
        },
        {
          id: 'zone 3',
          name: 'bajb_07-09',
          thermocouple: '01',
          usage: 0,
          consumption: { energy: 0, measurement: 'kw', type: 'energy' },
          isOn: false,
          sections: [
            {
              id: 'section 7',
              name: 'bajb_07',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 8',
              name: 'bajb_08',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 9',
              name: 'bajb_09',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
          ],
        },
        {
          id: 'zone 4',
          name: 'bajb_10-12',
          thermocouple: '01',
          usage: 0,
          consumption: { energy: 0, measurement: 'kw', type: 'energy' },
          isOn: false,
          sections: [
            {
              id: 'section 10',
              name: 'bajb_10',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 11',
              name: 'bajb_11',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 12',
              name: 'bajb_12',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
          ],
        },
        {
          id: 'zone 5',
          name: 'bajb_13-14',
          thermocouple: '01',
          usage: 0,
          consumption: { energy: 0, measurement: 'kw', type: 'energy' },
          isOn: false,
          sections: [
            {
              id: 'section 13',
              name: 'bajb_13',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
            {
              id: 'section 14',
              name: 'bajb_14',
              usage: 0,
              consumption: { energy: 0, measurement: 'kw', type: 'energy' },
              isOn: false,
            },
          ],
        },
      ],
    },
  };

  const stationsData = { 1: sharonStationData, 2: blueHillStationData };

  const [trackSegmentOpening, setTrackSegmentOpening] = useState(false);

  const trackSegmentOpeningsHandler = () => {
    setTrackSegmentOpening((prev) => !prev);
  };

  return (
    <Wrapper isMainTitle={isMainTitle} isExpand={trackSegmentOpening}>
      <OverSightSubIndividualContentDisplayBox
        isMainTitle={isMainTitle}
        isSegment={true}
        title={title}
        consumption={consumption}
        usage={usage}
        isOn={isOn}
        trackOpeningsHandler={trackSegmentOpeningsHandler}
      />
      {trackSegmentOpening &&
        stationsData[dataAccessKey][openingId].zones.map((zoneData) => (
          <OverSightSubIndividualContentDisplayBox
            key={zoneData.id}
            id={zoneData.id}
            title={zoneData.name}
            consumption={zoneData.consumption}
            usage={zoneData.usage}
            isOn={zoneData.isOn}
            data={zoneData.sections}
            isZone={true}
          />
        ))}
      {/* {trackSegmentOpening &&
        segmentsData[openingId].zones.map((zoneData) => (
          <OverSightSubIndividualContentDisplayBox
            key={zoneData.id}
            id={zoneData.id}
            title={zoneData.name}
            consumption={zoneData.consumption}
            usage={zoneData.usage}
            isOn={zoneData.isOn}
            data={zoneData.sections}
            isZone={true}
          />
        ))} */}
    </Wrapper>
  );
};

export default OverSightIndividualContentDisplayBox;

{
  /* <>
  {zonesData[openingId].zones[trackZoneIdx].sections.map(
    (sectionData) => (
      <OverSightSubIndividualContentDisplayBox
        key={sectionData.id}
        title={sectionData.name}
        consumption={sectionData.consumption}
        usage={sectionData.usage}
        isOn={sectionData.isOn}
      />
    )
  )}
</>; */
}
const Wrapper = styled.div`
  ${({ isMainTitle }) =>
    isMainTitle
      ? css`
          height: 32px;
        `
      : css`
          height: 34px;
        `}

  width: 1152px;
  border-radius: 15px;
  ${layerC}
  /* background: #142033;
  box-shadow: inset 0px 0px 6px #000000; */

  ${flexBoxCenter}
  ${({ isExpand }) =>
    isExpand &&
    css`
      height: auto;
      flex-direction: column;
      gap: 2px;
      margin: 2px;
      padding: 2px;
    `}
`;

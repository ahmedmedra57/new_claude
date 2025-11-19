import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { selectEssSwitch } from '../store/slices/essSwitchSlice';
import { selectTgsSwitch } from '../store/slices/tgsSwitchSlice';
import { selectTesSwitch } from '../store/slices/tesSwitchSlice';
import {
  handleReportStatus,
  selectReportStatus,
} from '../store/slices/reportStatusSlice';
import TitleContainer from '../TitleContainer';
import EachLocationReportStatus from './EachLocationReportStatus';
import { useEffect } from 'react';
import { useGetAllSSRsQueries, useGetThermocouplesQueries } from '../../hooks';
import { selectUnits } from '../store/slices/settings/unitsSlice';

const ReportStatusMain = () => {
  // const [isHover, setIsHover] = useState([]);
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const locations = useSelector(selectReportStatus);
  const { essSwitch,flatEssSwitch } = useSelector(selectEssSwitch);
  const { tgsSwitch,flatTgsSwitch } = useSelector(selectTgsSwitch);
  const { tesSwitch,flatTesSwitch } = useSelector(selectTesSwitch);
  const { isF } = useSelector(selectUnits);
  const { allLocations } = locations;


  // !!TEST DATA

  // let testData = [...allLocations];
  // // console.log('allLocations:', allLocations);
  // // console.log('allLocations[0]:', allLocations[0]);
  // // console.log(allLocations[0][1559816739777]);
  // if (allLocations.length > 0) {
  //   testData[0] = {
  //     1559816739777: {
  //       testSpecificLocation: {
  //         ...allLocations[0][1559816739777],
  //       },
  //       testSpecificLocation2: {
  //         ...allLocations[0][1559816739777],
  //       },
  //       // testSpecificLocation3: {
  //       //   ...allLocations[8]['658ace1f-84c7-477f-a09d-eb6c63c89b6a'],
  //       // },
  //     },
  //   };
  // }

  // console.log('allLocations:', allLocations);
  // console.log('testData:', testData);

  // !! END OF TEST DATA

  useGetAllSSRsQueries(flatEssSwitch, 'ESS');
  useGetAllSSRsQueries(flatTesSwitch, 'TES');
  useGetThermocouplesQueries(flatEssSwitch, 'ess');
  useGetThermocouplesQueries(flatTesSwitch, 'tes');

  useEffect(() => {
    dispatch(handleReportStatus({ essSwitch, tgsSwitch, tesSwitch, isF }));
  }, [essSwitch, tgsSwitch, tesSwitch]);

  // useEffect(() => {
  //   //*****  creates the arrays for the locations/systems/switches and sets them to false to be used for expand and close of each switch
  //   const createSwitchBtnExpandState = expandInitStateHandler();
  //   // ******* creates array fill with 'false' for hover effect on alert icon
  //   const newHoverArr = hoverInitStateHandler();
  //   setIsHover(newHoverArr);
  //   setSwitchIsExpand(createSwitchBtnExpandState);
  // }, [allLocations]);

  // const expandInitStateHandler = useCallback(() => {
  //   // !! change testData for allLocations
  //   return testData.map((location) => {
  //     const newValue = Object.values(Object.values(location)[0]).filter(
  //       (value) => value.length > 0
  //     );
  //     return newValue.map((el) => Object.keys(el).fill(false));
  //   });
  // }, [allLocations]);

  // const hoverInitStateHandler = useCallback(() => {
  //   // !! change testData for allLocations
  //   return testData.map((location) => {
  //     const falseArr = [];
  //     Object.values(Object.values(location)[0]).forEach((value) => {
  //       if (value.length > 0) {
  //         falseArr.push(false);
  //       }
  //     });
  //     return falseArr;
  //   });
  // }, [allLocations]);

  return (
    <Wrapper>
      <TitleContainer title={t('reportStatus.title')} />
      {/* !!TEST PURPOSE ONLY */}
      {/* {testData.map((location, index) => (
        <EachLocationReportStatus
          key={index}
          mainIndex={index}
          location={location}
          // allLocations={testData}
          // isHover={isHover}
          // setIsHover={setIsHover}
        />
      ))} */}
      {allLocations.map((location, index) => (
       
        <EachLocationReportStatus
          key={index}
          mainIndex={index}
          location={location}
          allLocations={allLocations}
        />
      ))}
    </Wrapper>
  );
};

export default ReportStatusMain;

const Wrapper = styled.div`
  min-height: 674px !important;
  width: 1216px;
`;

// const LocationWrapper = styled.div``;

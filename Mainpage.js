
import { useQuery } from 'react-query';
import {
  getAllUsers,
  getEssZones,
  getTesZones,
  getTgsZones,
  getUserProfileDataService,
  logoutService,
} from './services';
import {
  handleEssLocation,
  handleSysLocation,
  handleTesLocation,
  handleTgsLocation,
} from './components/store/slices/locationsSlice';
import {
  handleEssFaults,
  handleMessagesFaults,
  handleTesFaults,
  handleTgsFaults,
} from './components/store/slices/FaultsSlice';
import {
  handleEssFCSelect,
  handleTesFCSelect,
  handleTgsFCSelect,
  handleSysFCSelect,
} from './components/store/slices/settings/forceAndCommandsSlice';
import { useSetZoneOpeningsState, useSocket } from './hooks';
import {
  handleUnitSelection,
  selectUnits,
} from './components/store/slices/settings/unitsSlice';
import { createBrowserHistory } from 'history';
import qs from 'qs';
import {
  handleEssAdminSelect,
  handleSysAdminSelect,
  handleTesAdminSelect,
  handleTgsAdminSelect,
} from './components/store/slices/settings/admin/adminSlice';
import { handleEssDataConsumptionLocation } from './components/store/slices/essDataConsumptionSlice';
import { handleTgsDataConsumptionLocation } from './components/store/slices/tgsDataConsumptionSlice';
import { handleTesDataConsumptionLocation } from './components/store/slices/tesDataConsumptionSlice';
import EssTgsTesProvider from './components/context/contextOfEssTgsTes';
import testData from './test_data/testData';
import { getSpecLocationHandler } from './helpers/helpers';
import GeneralProvider from './components/context/contextOfGeneral';
import LandingPage from './components/newLandingPage/LandingPage';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  handleEssSwitch,
  selectEssSwitch,
} from './components/store/slices/essSwitchSlice';
import {
  handleTgsSwitch,
  selectTgsSwitch,
} from './components/store/slices/tgsSwitchSlice';
import {
  handleTesSwitch,
  selectTesSwitch,
} from './components/store/slices/tesSwitchSlice';
import { useEffect, useState, lazy, Suspense, useCallback, useRef } from 'react';
import {
  handleOpenMasterControl,
} from './components/store/slices/MCIsExpandedSlice';
import {
  handleAccessToken,
  handleAllUsers,
  selectUserInfo,
} from './components/store/slices/userSlice';
import { useMediaQuery } from 'react-responsive';
import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentFlexStart,
  scrollbarX,
  scrollbarY,
} from './components/styles/commonStyles';
import Footer from './components/Footer';
import Header from './components/Header';
import Sidebar from './components/sidebar/Sidebar';
import MainLoadingPage from './components/loading/MainLoadingPage';

const GlobalOverviewMain = lazy(() => import('./components/globalOverview/GlobalOverViewMain'));
const TelemetryMain = lazy(() => import('./components/telemetry/TelemetryMain'));
const EssMain = lazy(() => import('./components/ess/EssMain'));
const TgsMain = lazy(() => import('./components/tgs/TgsMain'));
const TesMain = lazy(() => import('./components/tes/TesMain'));
const HeatingPlatformMain = lazy(() => import('./components/heatingPlatform'));
const SettingsMain = lazy(() => import('./components/settings/SettingsMain'));
const AuditTrailMain = lazy(() => import('./components/auditTrail/AuditTrailMain'));
const FaultsMain = lazy(() => import('./components/faults/FaultsMain'));
const ReportStatusMain = lazy(() => import('./components/reportStatus/ReportStatusMain'));
const MasterControlMain = lazy(() => import('./components/masterControl/MasterControlMain'));
const MobileMain = lazy(() => import('./components/mobileMain/MobileMain'));
const MobileMasterControl = lazy(() => import('./components/masterControl/MobileMasterControl'));
const HomePage = lazy(() => import('./components/newLandingPage/LandingPage'));

const MainPage = () => {
  useEffect(()=>{
    const user= async ()=>{
       try{
         const users= await getUserProfileDataService();
         users.forEach(user =>{
         })
       }catch(error){
       }
    }
  },[])
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });
  const isTablet = useMediaQuery({ query: '(max-width:1366px)' });
 
  const userInfo = useSelector(selectUserInfo);
  const { isEssSwitch, isTesSwitch, isTgsSwitch, accessToken, user } = userInfo;

  const { essSwitch: essSwitches, flatEssSwitch } =
    useSelector(selectEssSwitch);
  const { tgsSwitch: tgsSwitches, flatTgsSwitch } =
    useSelector(selectTgsSwitch);
  const { tesSwitch: tesSwitches, flatTesSwitch } =
    useSelector(selectTesSwitch);
  const unitsStatus = useSelector(selectUnits);
  const { isF } = unitsStatus;
  const dispatch = useDispatch();
  const storedAccessToken = localStorage.getItem('access_token');

  // start handle logout after 15 minutes of inactivity
  const timerRef = useRef(null);

  const startTimer = useCallback(() => {
    timerRef.current = setTimeout(() => {
      logoutService().then(() => {
        localStorage.removeItem('access_token');
        dispatch(handleAccessToken(null));
      });
    }, 15 * 60 * 1000);
  }, [dispatch]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    startTimer();
  }, [startTimer]);

  useEffect(() => {
    if (accessToken) {
      startTimer();
      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keydown', resetTimer);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        window.removeEventListener('mousemove', resetTimer);
        window.removeEventListener('keydown', resetTimer);
      };
    }
  }, [accessToken, startTimer, resetTimer]);
  // end handle logout after 15 minutes of inactivity

  useSocket(user.user_id, accessToken);

  useEffect(() => {
    if (storedAccessToken) {
      dispatch(handleAccessToken(storedAccessToken));
      dispatch(getUserProfileDataService());
      getAllUsers().then((data) => {
        dispatch(handleAllUsers(data));
      });
    }
  }, [dispatch, storedAccessToken]);

  useEffect(() => {
    let choosenUnit = user?.temperature_unit === 'f' ? 0 : 1;
    dispatch(handleUnitSelection(choosenUnit));
  }, [user, user.temperature_unit]);

  useEffect(() => {
    dispatch(
      handleMessagesFaults({ flatEssSwitch, flatTgsSwitch, flatTesSwitch })
    );
  }, [flatEssSwitch, flatTgsSwitch, flatTesSwitch]);

  useSetZoneOpeningsState(essSwitches, isEssSwitch, null, 'ess', true);
  useSetZoneOpeningsState(tgsSwitches, isTgsSwitch, null, 'tgs', true);
  useSetZoneOpeningsState(tesSwitches, isTesSwitch, null, 'tes', true);

  useEffect(() => {
    if (isMobile) {
      if (isEssSwitch) {
        dispatch(handleOpenMasterControl({ swtName: 'ess', status: false }));
      }
      if (isTgsSwitch) {
        dispatch(handleOpenMasterControl({ swtName: 'tgs', status: false }));
      }
      if (isTesSwitch) {
        dispatch(handleOpenMasterControl({ swtName: 'tes', status: false }));
      }
    }
  }, []);

  // fetch zones from backend use react query
  const {
    data: essZones,
    isLoading: essZonesLoading,
    refetch: essRefetch,
  } = useQuery('essZones', () => getEssZones({ structured: true }), {
    enabled: !!accessToken,
    staleTime: Infinity,
  });
  const {
    data: tgsZones,
    isLoading: tgsZonesLoading,
    refetch: tgsRefetch,
  } = useQuery('tgsZones', () => getTgsZones({ structured: true }), {
    enabled: !!accessToken,
    staleTime: Infinity,
  });
  const {
    data: tesZones,
    isLoading: tesZonesLoading,
    refetch: tesRefetch,
  } = useQuery('tesZones', () => getTesZones({ structured: true }), {
    enabled: !!accessToken,
    staleTime: Infinity,
  });
  const [isDataLoading, setIsDataLoading] = useState(false);

  useEffect(() => {
    if (
      (essZonesLoading || tgsZonesLoading || tesZonesLoading) &&
      accessToken
    ) {
      setIsDataLoading(true);
    } else {
      setIsDataLoading(false);
    }
  }, [essZonesLoading, tgsZonesLoading, tesZonesLoading, accessToken]);

  useEffect(() => {
    if (essZones) {
      dispatch(handleEssSwitch({ essZones, isF }));
      dispatch(handleEssLocation(essZones));
      dispatch(handleEssFaults(essZones));
      dispatch(handleEssFCSelect(essZones));
      dispatch(handleEssAdminSelect(essZones));
      dispatch(handleEssDataConsumptionLocation(essZones));
    }
    if (tgsZones) {
      dispatch(handleTgsSwitch({ tgsZones, isF }));
      dispatch(handleTgsLocation(tgsZones));
      dispatch(handleTgsFaults(tgsZones));
      dispatch(handleTgsFCSelect(tgsZones));
      dispatch(handleTgsAdminSelect(tgsZones));
      dispatch(handleTgsDataConsumptionLocation(tgsZones));
    }
    if (tesZones) {
      dispatch(handleTesSwitch({ tesZones, isF }));
      dispatch(handleTesLocation(tesZones));
      dispatch(handleTesFaults(tesZones));
      dispatch(handleTesFCSelect(tesZones));
      dispatch(handleTesAdminSelect(tesZones));
      dispatch(handleTesDataConsumptionLocation(tesZones));
    }
    if (essZones && tgsZones && tesZones) {
      dispatch(handleSysLocation([ ...tesZones, ...tgsZones, ...essZones]));
      dispatch(handleSysFCSelect([...tesZones, ...tgsZones, ...essZones]));
      dispatch(handleSysAdminSelect([...tesZones, ...tgsZones, ...essZones]));
    }
  }, [essZones, tgsZones, tesZones, isF]);

  useEffect(() => {
    if (!essZones && accessToken) {
      essRefetch();
    }
    if (!tgsZones && accessToken) {
      tgsRefetch();
    }
    if (!tesZones && accessToken) {
      tesRefetch();
    }
  }, [
    essZones,
    tgsZones,
    tesZones,
    accessToken,
    essRefetch,
    tgsRefetch,
    tesRefetch,
  ]);
  const [savedPrevParam, setSavedPrevParam] = useState('');
  const history = createBrowserHistory();
  useEffect(() => {
    const filterParams = history.location.search.substr(1);
    const filtersFromParams = qs.parse(filterParams);

    if (filtersFromParams.path) {
      setSavedPrevParam(filtersFromParams.path);
    }
  }, []);

  if (isDataLoading) {
    return (
      <LoadingWrapper>
        <MainLoadingPage />
      </LoadingWrapper>
    );
  }

  return (
    <BrowserRouter>
      {isMobile ? (
        accessToken || storedAccessToken ? (
          <MobileWrapper>
            <GeneralProvider>
              <Header />
              <MobileMainContentsWrapper>
                <EssTgsTesProvider>
                  <Suspense fallback={<MainLoadingPage />}>
                    <Routes>
                      <Route path='/' element={<MobileMain />} />
                      <Route path='ess' element={<EssMain />} />
                      <Route path='tgs' element={<TgsMain />} />
                      <Route path='tes' element={<TesMain />} />

                      <Route
                        path='masterControl'
                        element={<MobileMasterControl />}
                      />
                      <Route path='telemetry' element={<TelemetryMain />} />

                      <Route
                        path='heatingPlatform'
                        element={<HeatingPlatformMain />}
                      />

                      <Route
                        path='settings'
                        element={
                          <SettingsMain
                            essRefetch={essRefetch}
                            tgsRefetch={tgsRefetch}
                            tesRefetch={tesRefetch}
                          />
                        }
                      />
                      <Route path='faults' element={<FaultsMain />} />
                      <Route path='reportStatus' element={<ReportStatusMain />} />
                    </Routes>
                  </Suspense>
                </EssTgsTesProvider>
              </MobileMainContentsWrapper>
              <Footer />
            </GeneralProvider>
          </MobileWrapper>
        ) : (
          <Wrapper>
            <Suspense fallback={<MainLoadingPage />}>
              <Routes>
                <Route path='/login' element={<HomePage />} />
                <Route path='/login/fr' element={<HomePage />} />
                <Route path='*' element={<Navigate to='/login' />} />
              </Routes>
            </Suspense>
          </Wrapper>
        )
      ) : accessToken || storedAccessToken ? (
        <MainWrapper isTablet={isTablet}>
          <GeneralProvider>
            <Wrapper>
              <Header />
              <Title src={'/images/embrellaTitle-sm.svg'} />
              <MainContentsWrapper>
                <Sidebar />
                <EssTgsTesProvider>
                  <Suspense fallback={<MainLoadingPage />}>
                    <Routes>
                      <Route path='/' element={<GlobalOverviewMain />} />

                      <Route path='/telemetry' element={<TelemetryMain />} />
                      <Route
                        path='masterControl'
                        element={<MasterControlMain />}
                      />

                      <Route path='ess' element={<EssMain />} />
                      <Route path='tgs' element={<TgsMain />} />
                      <Route path='tes' element={<TesMain />} />

                      <Route
                        path='heatingPlatform'
                        element={<HeatingPlatformMain />}
                      />
                      <Route
                        path='settings'
                        element={
                          <SettingsMain
                            essRefetch={essRefetch}
                            tgsRefetch={tgsRefetch}
                            tesRefetch={tesRefetch}
                          />
                        }
                      />
                      <Route path='auditTrail' element={<AuditTrailMain />} />
                      <Route path='faults' element={<FaultsMain />} />
                      <Route path='reportStatus' element={<ReportStatusMain />} />
                      <Route
                        path='*'
                        element={<Navigate to={savedPrevParam} />}
                      />
                    </Routes>
                  </Suspense>
                </EssTgsTesProvider>
              </MainContentsWrapper>
              <Footer />
            </Wrapper>
          </GeneralProvider>
        </MainWrapper>
      ) : (
        <Wrapper>
          <Suspense fallback={<MainLoadingPage />}>
            <Routes>
              <Route path='/login' element={<HomePage />} />
              <Route path='/login/fr' element={<HomePage />} />
              <Route path='*' element={<Navigate to='/login' />} />
            </Routes>
          </Suspense>
        </Wrapper>
      )}
    </BrowserRouter>
  );
};

export default MainPage;

const MainWrapper = styled.div`
  ${({ isTablet }) =>
    isTablet
      ? css`
          width: 100%;
          height: 100%;
          ${scrollbarX}
        `
      : css`
          ${flexBoxCenter}
        `}
`;

const Wrapper = styled.div`
  width: 1366px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 10rem 20rem;
  padding-top: 0;
`;

const LoadingWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  z-index: 1000;
`;

const Title = styled.img`
  margin: 5rem 0;
`;

const MainContentsWrapper = styled.div`
  width: 100%;
  height: auto;

  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  margin: 5rem 0;
`;

const MobileWrapper = styled.div`
  width: 332px;
  ${justifyContentFlexStart}
  flex-direction: column;
`;

const MobileMainContentsWrapper = styled.div``;

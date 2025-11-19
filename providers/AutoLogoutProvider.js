import { createContext, useEffect, useRef } from "react";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { logoutService } from "../services";
import {
  handleAccessToken,
  selectUserInfo,
} from "../components/store/slices/userSlice";
import { ROLES } from "../constants";

const AutoLogoutContext = createContext();
const LOGIN_TIMEOUT = 15;
const AutoLogoutProvider = ({ children }) => {
  const userInfo = useSelector(selectUserInfo);
  const userRole = userInfo?.user?.user_role;
  const dispatch = useDispatch();
  const isTimerRunning = useRef(false);

  const { mutate: mutateLogout } = useMutation(logoutService, {
    onSuccess: () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("loginTime");
      dispatch(handleAccessToken(null));
    },
  });

  const calcTimerMins = () => {
    const storedLoginTime = localStorage.getItem("loginTime");
    const passedMinutes = Math.floor(
      (new Date() - new Date(storedLoginTime)) / (1000 * 60)
    );
    return LOGIN_TIMEOUT - (storedLoginTime ? passedMinutes : 0);
  };

  useEffect(() => {
    if (userRole !== ROLES.Winter_Disk || isTimerRunning.current) return;

    const remainingMinutes = calcTimerMins();
    let timer;

    if (remainingMinutes > 0) {
      isTimerRunning.current = true;
      const timeoutDuration = remainingMinutes * 60 * 1000;
      setTimeout(() => {
        if (userRole === ROLES.Winter_Disk) {
          mutateLogout();
        }
      }, timeoutDuration);
    } else {
      mutateLogout();
    }
    return () => {
      clearTimeout(timer);
      isTimerRunning.current = false;
    };
  }, [userRole]);

  return (
    <AutoLogoutContext.Provider value={{}}>
      {children}
    </AutoLogoutContext.Provider>
  );
};

export { AutoLogoutProvider, AutoLogoutContext };

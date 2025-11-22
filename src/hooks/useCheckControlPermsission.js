import { useCallback } from "react";
import { selectUserPermissions } from "../components/store/slices/userSlice";
import { PERMISSIONS } from "../constants";
import { useSelector } from "react-redux";

export const useCheckControlPermsission = () => {
  const permissions = useSelector(selectUserPermissions);

  const checkControlPermsission = useCallback((swt) => {
    const userPermissions = {
      ess: PERMISSIONS.ESS_CONTROL,
      tgs: PERMISSIONS.TGS_CONTROL,
      tes: PERMISSIONS.TES_CONTROL,
      hp: PERMISSIONS.HP_CONTROL,
    };
    return permissions[userPermissions[swt]];
  },[permissions]);

  return checkControlPermsission;
};

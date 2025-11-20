import { useCallback } from "react";
import { useUserStore } from "../components/zustand-stores";
import { PERMISSIONS } from "../constants";

export const useCheckControlPermsission = () => {
  const { permissions } = useUserStore();

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

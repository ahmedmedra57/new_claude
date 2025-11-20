import { useEffect } from 'react';
import { useMCIsExpandedStore } from '../../components/zustand-stores';

export const useSetOpenMasterControl = (swtName, isMobile) => {
  const { setOpenMasterControl } = useMCIsExpandedStore();
  useEffect(() => {
    setOpenMasterControl(swtName, isMobile ? false : true);
  }, []);
};

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { handleOpenMasterControl } from '../../components/store/slices/MCIsExpandedSlice';

export const useSetOpenMasterControl = (swtName, isMobile) => {
  const dispatch = useDispatch();
  useEffect(() => {
    isMobile
      ? dispatch(handleOpenMasterControl({ swtName, status: false }))
      : dispatch(handleOpenMasterControl({ swtName, status: true }));
  }, []);
};

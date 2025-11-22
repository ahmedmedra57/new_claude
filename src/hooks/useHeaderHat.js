import { useMemo } from 'react';

/**
 * Custom hook to determine the correct header hat image
 * Based on machine state (off, faults, normal) and title length
 *
 * @param {boolean} isOff - Is machine off/disabled
 * @param {boolean} isFaults - Does machine have faults
 * @param {string} headerTitle - Title text (length determines hat size)
 * @param {boolean} isMobile - Is mobile view
 * @returns {string} - Image path for header hat
 */
const useHeaderHat = (isOff, isFaults, headerTitle, isMobile = false) => {
  const hatImg = useMemo(() => {
    if (isMobile) {
      return isOff
        ? '/images/MC-machine-header2-mobile.svg'
        : '/images/MC-machine-header2-mobile.svg';
    }

    const titleLength = headerTitle?.length || 0;

    // Determine size category
    const size = titleLength < 28 ? 'small' : titleLength < 46 ? 'medium' : 'large';

    // Determine state
    if (isOff) {
      return {
        small: '/images/MC-machine-header1-off.svg',
        medium: '/images/MC-machine-header-mediumSize-off.svg',
        large: '/images/MC-machine-header-largeSize-off.svg',
      }[size];
    }

    if (isFaults) {
      return {
        small: '/images/MC-machine-header1-faults.svg',
        medium: '/images/MC-machine-header-mediumSize-faults.svg',
        large: '/images/MC-machine-header-largeSize-faults.svg',
      }[size];
    }

    return {
      small: '/images/MC-machine-header1.svg',
      medium: '/images/MC-machine-header-medium-size.svg',
      large: '/images/MC-machine-header-long-size.svg',
    }[size];
  }, [isOff, isFaults, headerTitle, isMobile]);

  return hatImg;
};

export default useHeaderHat;

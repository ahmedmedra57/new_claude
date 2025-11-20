import { useEffect, useState } from 'react';
import { programIcons } from '../components/commonComponentsMC/systemConfigs';

/**
 * Custom hook to manage program icon states
 * Handles selected, activated, and ready program icons
 * Works for ESS, TGS, and TES systems
 *
 * @param {Object} switchData - Switch data containing program states
 * @param {Object} mobileSelectedProgram - Mobile selected program state
 * @param {string} systemName - 'ess', 'tgs', or 'tes'
 * @returns {Object} - { selectedProgramSrc, activatedProgramSrc, readyProgramSrc }
 */
const useProgramIcons = (switchData, mobileSelectedProgram, systemName = 'ess') => {
  const [selectedProgramByMachineSrc, setSelectedProgramByMachineSrc] = useState(null);
  const [activatedProgramSrc, setActivatedProgramSrc] = useState(null);
  const [readyProgramSrc, setReadyProgramSrc] = useState(null);

  const {
    instantHeat,
    snowSensor,
    heatingSchedule,
    windFactor,
    optionalConstantTemp,
    fanOnly,
  } = switchData || {};

  // Selected program (mobile)
  useEffect(() => {
    if (!mobileSelectedProgram) return;

    if (mobileSelectedProgram.instantHeat) {
      setSelectedProgramByMachineSrc(programIcons.instantHeat);
    } else if (mobileSelectedProgram.snowSensor) {
      setSelectedProgramByMachineSrc(programIcons.snowSensor);
    } else if (mobileSelectedProgram.heatingSchedule) {
      setSelectedProgramByMachineSrc(programIcons.heatingSchedule);
    } else if (mobileSelectedProgram.windFactor) {
      setSelectedProgramByMachineSrc(programIcons.windFactor);
    } else if (mobileSelectedProgram.optionalConstantTemp) {
      setSelectedProgramByMachineSrc(programIcons.optionalConstantTemp);
    } else if (mobileSelectedProgram.fanOnly && systemName === 'tgs') {
      setSelectedProgramByMachineSrc(programIcons.fanOnly);
    } else {
      setSelectedProgramByMachineSrc(null);
    }
  }, [mobileSelectedProgram, systemName]);

  // Activated program
  useEffect(() => {
    if (!switchData) return;

    if (instantHeat?.isActivated) {
      setActivatedProgramSrc(programIcons.instantHeat);
    } else if (snowSensor?.isActivated) {
      setActivatedProgramSrc(programIcons.snowSensor);
    } else if (heatingSchedule?.isActivated) {
      setActivatedProgramSrc(programIcons.heatingSchedule);
    } else if (windFactor?.isActivated) {
      setActivatedProgramSrc(programIcons.windFactor);
    } else if (optionalConstantTemp?.isActivated) {
      setActivatedProgramSrc(programIcons.optionalConstantTemp);
    } else if (fanOnly && systemName === 'tgs') {
      setActivatedProgramSrc(programIcons.fanOnly);
    } else {
      setActivatedProgramSrc(null);
    }
  }, [switchData, systemName]);

  // Ready program
  useEffect(() => {
    if (!switchData) return;

    if (instantHeat?.isReady) {
      setReadyProgramSrc(programIcons.instantHeat);
    } else if (snowSensor?.isReady) {
      setReadyProgramSrc(programIcons.snowSensor);
    } else if (windFactor?.isReady) {
      setReadyProgramSrc(programIcons.windFactor);
    } else if (heatingSchedule?.isReady) {
      setReadyProgramSrc(programIcons.heatingSchedule);
    } else if (optionalConstantTemp?.isReady) {
      setReadyProgramSrc(programIcons.optionalConstantTemp);
    } else {
      setReadyProgramSrc(null);
    }
  }, [switchData]);

  return {
    selectedProgramSrc: selectedProgramByMachineSrc,
    activatedProgramSrc,
    readyProgramSrc,
  };
};

export default useProgramIcons;

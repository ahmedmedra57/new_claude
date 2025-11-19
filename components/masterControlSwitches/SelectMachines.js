import { useEffect, useState } from 'react';
import { selectEssSwitch } from '../store/slices/essSwitchSlice';
import {
  handleLocationSelectBySwitch,
  handleMachineSelectBySwitch,
  handleSelectAllBySwitch,
  selectMCBySwitch,
} from '../store/slices/masterControlBySwitchSelectSlice';
import { useSelector, useDispatch } from 'react-redux';

import styled, { css } from 'styled-components';

import SelectMachineItems from './SelectMachineItems';

const SelectMachines = ({ size, name, disabled }) => {
  // Global States
  const { essSwitch } = useSelector(selectEssSwitch);
  const mCBySwitch = useSelector(selectMCBySwitch);
  const { selectedOne } = mCBySwitch[name];

  // location states and variables
  const [displaySelectBox, setDisplaySelectBox] = useState(false);
  const dispatch = useDispatch();
  const arrowSrc = disabled
    ? '/images/masterCtr-select-btn-disabled.svg'
    : '/images/masterCtr-select-btn.svg';

  // initialize all the select for display
  useEffect(() => {
    if (!selectedOne) {
      const essLocations = Object.keys(essSwitch);
      // unSelect all
      dispatch(handleSelectAllBySwitch({ controller: name, status: false }));

      // unSelect all the locations
      const locationArr = essLocations.map((location) => false);
      dispatch(
        handleLocationSelectBySwitch({ arr: locationArr, controller: name })
      );

      // unSelect all the individual machines into Back end(later)
      const machineArr = Object.values(essSwitch).map((location) =>
        Object.keys(location).map((machine) => false)
      );
      dispatch(
        handleMachineSelectBySwitch({ arr: machineArr, controller: name })
      );
    }
  }, []);

  return (
    <>
      {size !== 3 ? (
        <Wrapper
          disabled={disabled}
          displaySelectBox={displaySelectBox}
          size={size}
        >
          <SelectInnerWrapper
            disabled={disabled}
            displaySelectBox={displaySelectBox}
            size={size}
          >
            <SelectedOneAndArrowButtonWrapper size={size}>
              <SelectTop size={size} disabled={disabled}>
                {selectedOne ? selectedOne : 'select locations'}
              </SelectTop>
              <SelectArrowButton
                disabled={disabled}
                src={arrowSrc}
                onClick={() =>
                  disabled || setDisplaySelectBox(!displaySelectBox)
                }
              />
            </SelectedOneAndArrowButtonWrapper>
            {displaySelectBox && (
              <SelectMachineItems
                handleClose={() => setDisplaySelectBox(!displaySelectBox)}
                data={essSwitch}
                swt={'ess'}
                name={name}
              />
            )}
          </SelectInnerWrapper>
        </Wrapper>
      ) : (
        <Wrapper2 disabled={disabled} displaySelectBox={displaySelectBox}>
          <SelectInnerWrapper2
            disabled={disabled}
            displaySelectBox={displaySelectBox}
          >
            <SelectedOneAndArrowButtonWrapper2 size={size}>
              <SelectArrowButton
                size={size}
                disabled={disabled}
                src={'/images/masterCtr-select-btn2.svg'}
                onClick={() =>
                  disabled || setDisplaySelectBox(!displaySelectBox)
                }
              />
              <SelectTop2 size={size} disabled={disabled}>
                {selectedOne ? selectedOne : 'select locations'}
              </SelectTop2>
            </SelectedOneAndArrowButtonWrapper2>
          </SelectInnerWrapper2>

          {displaySelectBox && (
            <SelectOptionWrapper>
              <SelectMachineItems
                handleClose={() => setDisplaySelectBox(!displaySelectBox)}
                data={essSwitch}
                swt={'ess'}
                name={name}
              />
            </SelectOptionWrapper>
          )}
        </Wrapper2>
      )}
    </>
  );
};

export default SelectMachines;

const Wrapper = styled.div`
  width: 192rem;
  height: 37rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  position: relative;

  background: #142033;
  box-shadow: inset 0px 0px 6px #000000;
  border-radius: 27px;

  ${(p) =>
    p.size === 1 &&
    css`
      width: 201px;
      height: 37px;
    `}
  ${(p) =>
    p.size === 2 &&
    css`
      width: 201rem;
      height: 28rem;
    `}
    
    ${(p) =>
    p.disabled &&
    css`
      background: #3b3b3b;
      box-shadow: inset 0px 0px 6px #000000;
    `}

    ${(p) =>
    p.size === 3 &&
    css`
      width: 77px;
      height: 43px;
    `}
`;

const SelectInnerWrapper = styled.div`
  width: 190rem;
  height: 35rem;

  background: transparent linear-gradient(180deg, #233a54 0%, #060d19 100%) 0%
    0% no-repeat padding-box;
  box-shadow: inset 0px 1px 1px #00000029, 0px 0px 2px #000000;
  border: 0.5px solid #000000;
  border-radius: 34px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4rem;

  ${(p) =>
    p.size === 1 &&
    css`
      width: 199px;
      height: 35px;
    `}
  ${(p) =>
    p.size === 2 &&
    css`
      width: 199rem;
      height: 26rem;
    `}

  ${(p) =>
    p.displaySelectBox &&
    css`
      position: absolute;

      height: auto;
      flex-direction: column;

      background: transparent linear-gradient(90deg, #233a54 0%, #060d19 100%)
        0% 0% no-repeat padding-box;
      box-shadow: inset 0px 1px 1px #00000029, 0px 0px 2px #000000;
      border: 0.5px solid #000000;
      top: 0rem;

      z-index: 100;
      border-radius: 18px;
      padding: 5rem;
    `}

    ${(p) =>
    p.disabled &&
    css`
      background: transparent linear-gradient(180deg, #565656 0%, #1d1d1d 100%);
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
    `}
`;

const SelectedOneAndArrowButtonWrapper = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SelectArrowButton = styled.img`
  margin-right: 2rem;
  margin-top: 1rem;
  cursor: pointer;
  ${(p) =>
    p.disabled &&
    css`
      cursor: not-allowed;
    `}

  ${(p) =>
    p.size === 3 &&
    css`
      position: absolute;
      top: 3px;
      left: 3px;
    `}
`;

const SelectTop = styled.div`
  width: 157px;
  height: 27px;

  background: #233a54 0% 0%;
  box-shadow: inset 0px 0px 6px #000000;
  border-radius: 18px;

  font-size: 8px;
  display: flex;
  align-items: center;
  padding-left: 20rem;

  ${(p) =>
    p.size === 1 &&
    css`
      width: 157rem;
      height: 27rem;
    `}
  ${(p) =>
    p.size === 2 &&
    css`
      width: 163rem;
      height: 18rem;
    `}

    ${(p) =>
    p.disabled &&
    css`
      background: #3b3b3b;
      box-shadow: inset 0px 0px 6px #000000;
      color: #808080;
    `}
`;

// ************styles for shut off component****************
const Wrapper2 = styled.div`
  width: 77px;
  height: 43px;

  background: #1b2b44;
  box-shadow: inset 0px 0px 6px #000000;
  border: 0.5px solid #142033;
  border-radius: 5px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  position: relative;

  ${(p) =>
    p.disabled &&
    css`
      background: #3b3b3b;
      box-shadow: inset 0px 0px 6px #000000;
    `}
`;

const SelectInnerWrapper2 = styled.div`
  width: 75px;
  height: 41px;

  background: transparent linear-gradient(180deg, #233a54 0%, #060d19 100%);
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid #000000;
  border-radius: 4px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  /* ${(p) =>
    p.displaySelectBox &&
    css`
      position: absolute;

      height: auto;
      flex-direction: column;

      background: transparent linear-gradient(90deg, #233a54 0%, #060d19 100%)
        0% 0% no-repeat padding-box;
      box-shadow: inset 0px 1px 1px #00000029, 0px 0px 2px #000000;
      border: 0.5px solid #000000;
      top: 0rem;

      z-index: 100;
      border-radius: 18px;
      padding: 5rem;
    `} */

  ${(p) =>
    p.disabled &&
    css`
      background: transparent linear-gradient(180deg, #565656 0%, #1d1d1d 100%);
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
    `}
`;

const SelectedOneAndArrowButtonWrapper2 = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 0 0 2px 0;
  position: relative;
`;

const SelectTop2 = styled.div`
  width: 69px;
  height: 23px;

  font-size: 8px;
  display: flex;
  align-items: center;
  justify-content: end;
  text-align: right;
  padding-right: 2px;

  background: #233a54 0% 0%;
  box-shadow: inset 0px 0px 6px #000000;
  opacity: 1;
  border-radius: 6px;
  ${(p) =>
    p.disabled &&
    css`
      background: #3b3b3b;
      box-shadow: inset 0px 0px 6px #000000;
      color: #808080;
    `}
`;

const SelectOptionWrapper = styled.div`
  position: absolute;
  top: 0rem;
  right: 80px;

  height: auto;
  flex-direction: column;

  background: transparent linear-gradient(90deg, #233a54 0%, #060d19 100%) 0% 0%
    no-repeat padding-box;
  box-shadow: inset 0px 1px 1px #00000029, 0px 0px 2px #000000;
  border: 0.5px solid #000000;
  top: 0rem;

  z-index: 100;
  border-radius: 18px;
  padding: 5rem;
`;

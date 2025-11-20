import { useCallback, useMemo, memo } from 'react';
import { useLocationsStore } from '../zustand-stores';
import { useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import {
  justifyContentFlexStart,
  justifyContentSpaceBetween,
  layerA180Deg,
} from '../styles/commonStyles';
import { useState } from 'react';
import { useEffect } from 'react';
import testData from '../../test_data/testData';

const AutoCompleteBox = ({
  swtName,
  isSelected,
  handleSelect,
  handleClose,
  isMobile,
  handleNavigate,
  system,
}) => {
  const locations = useLocationsStore();

  const title = useMemo(() => {
    const namesArr = swtName.split(' - ');

    if (namesArr.length === 3) {
      return namesArr
        .map((el, index) => {
          if (index === 0) {
            return locations.all[el][namesArr[1]]?.locationName;
          } else if (index === 1) {
            return locations.all[namesArr[0]][el]?.specificLocationName;
          } else {
            return locations.all[namesArr[0]][namesArr[1]].devices[el]
              ?.machineName;
          }
        })
        .join(' - ');
    } else {
      return namesArr
        .map((el, index) => {
          if (index === 0) {
            return locations.all[el]?.locationName;
          } else {
            return locations.all[namesArr[0]].devices[el]?.machineName;
          }
        })
        .join(' - ');
    }
  }, [swtName]);

  const titleAndSystem = title + ' - ' + system;

  const handleOnClick = () => {
    handleSelect(swtName, titleAndSystem, system);
    handleClose();
  };

  return (
    <Wrapper isSelected={isSelected} isMobile={isMobile}>
      <DotAndTitleWrapperButton onClick={handleOnClick} isMobile={isMobile}>
        <GreenDot />
        <SwitchName isMobile={isMobile}>{titleAndSystem}</SwitchName>
      </DotAndTitleWrapperButton>
      <GoToButton
        isMobile={isMobile}
        onClick={handleOnClick}
      >
        select
      </GoToButton>
    </Wrapper>
  );
};

export default memo(AutoCompleteBox);

const Wrapper = styled.div`
  width: 491px;
  min-height: 32px;
  border: 1px solid #233a54;

  border-radius: 16px;
  padding: 0 0 0 10px;

  margin-bottom: 3px;
  &:last-child {
    margin-bottom: 0;
  }

  ${justifyContentSpaceBetween};
  ${(p) =>
    p.isSelected &&
    css`
      background-color: hsla(50deg, 100%, 80%, 0.25);
    `};

  &:hover {
    background-color: hsla(50deg, 100%, 80%, 0.25);
  }

  ${(p) =>
    p.isMobile &&
    css`
      width: 315px;
      height: 32px;
    `}
`;

const DotAndTitleWrapperButton = styled.button`
  ${justifyContentFlexStart}
  height: 100%;
  width: 70%;
`;

const GreenDot = styled.div`
  min-width: 12px;
  max-width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #95ff45;
  margin-right: 10px;
`;

const SwitchName = styled.span`
  font-size: 10px;

  ${(p) =>
    p.isMobile &&
    css`
      font-size: 8px;
    `}
`;

const GoToButton = styled.button`
  width: 118px;
  height: 28px;
  border-radius: 25px;
  font-size: 16px;
  letter-spacing: 1.6px;
  ${layerA180Deg}

  ${(p) =>
    p.isSelected &&
    css`
      border: 1px solid #233a54;
    `}

    ${(p) =>
    p.isMobile &&
    css`
      width: 83px;
      height: 28px;
    `};
  /* visibility: hidden; */
`;

import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  justifyContentSpaceAround,
  layerDegHPA,
  layerHPA,
} from '../../../styles/commonStyles';
import { useState } from 'react';
import SelectSystemDropBox from './SelectSystemDropBox';

const SelectSystem = ({ selectSystemHandler }) => {
  const selectionTitle = ['transit station', 'switches'];

  const [openDropBox, setOpenDropBox] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState('switches');

  const openDropBoxHandler = () => {
    setOpenDropBox((prev) => !prev);
  };

  const selectionHandler = (idx) => {
    setSelectedTitle(selectionTitle[idx]);
    selectSystemHandler(idx);
  };

  return (
    <ConcaveLayer width={'112px'} height={'28px'} radius={'14px'}>
      <ConvexLayer>
        <FlexWrapper>
          <ConcaveLayer width={'94px'} height={'22px'} radius={'11px'}>
            <Text>{selectedTitle}</Text>
          </ConcaveLayer>
          <Button onClick={openDropBoxHandler}>
            <img
              alt='white-triangle'
              src='./images/settings-sysIdentification-whiteTriangle.svg'
            />
          </Button>
        </FlexWrapper>
      </ConvexLayer>
      {openDropBox && (
        <DropBoxWrapper>
          <SelectSystemDropBox
            selectedTitle={selectedTitle}
            selectionHandler={selectionHandler}
            selectionTitle={selectionTitle}
            openDropBoxHandler={openDropBoxHandler}
          />
        </DropBoxWrapper>
      )}
    </ConcaveLayer>
  );
};

export default SelectSystem;

const ConcaveLayer = styled.div`
  ${({ width, height, radius }) =>
    css`
      width: ${width};
      height: ${height};
      border-radius: ${radius};
    `}
  ${layerHPA}
  position:relative;
  ${flexBoxCenter}
`;

const ConvexLayer = styled.div`
  width: 110px;
  height: 26px;

  border-radius: 13px;
  ${layerDegHPA}
`;

const FlexWrapper = styled.div`
  width: 100%;
  height: 100%;
  ${justifyContentSpaceAround}
`;

const Text = styled.p`
  font-size: 8px;
`;

const Button = styled.button``;

const DropBoxWrapper = styled.div`
  width: 108px;
  height: 74px;
  position: absolute;
  top: 0;
  left: 2px;
  z-index: 2;
`;

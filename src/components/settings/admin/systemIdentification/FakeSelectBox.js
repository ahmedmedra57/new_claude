import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerADisabled,
  layerADisabled180Deg,
} from '../../../styles/commonStyles';
import DropBox from './DropBox';

const FakeSelectBox = ({ isSSRUnits, isSSRRating }) => {
  return (
    <SwitchesDropBoxBaseLayer isSSRUnits={isSSRUnits} isSSRRating={isSSRRating}>
      <SwitchesDropBoxWrapper isSSRUnits={isSSRUnits} isSSRRating={isSSRRating}>
        <SwitchesDisplayInfo
          isSSRUnits={isSSRUnits}
          isSSRRating={isSSRRating}
        ></SwitchesDisplayInfo>
        <Img src={'./images/settings-sysIdentification-whiteTriangle.svg'} />
      </SwitchesDropBoxWrapper>
    </SwitchesDropBoxBaseLayer>
  );
};

export default FakeSelectBox;

const SwitchesDropBoxBaseLayer = styled.div`
  ${({ isSSRUnits, isSSRRating }) =>
    isSSRUnits
      ? css`
          width: 64px;
          height: 18px;
        `
      : isSSRRating &&
        css`
          width: 96px;
          height: 18px;
        `}

  ${layerADisabled}

  border-radius: 12px;
  opacity: 1;
  position: relative;
  ${flexBoxCenter}
`;

const SwitchesDropBoxWrapper = styled.div`
  ${({ isSSRUnits, isSSRRating }) =>
    isSSRUnits
      ? css`
          width: 62px;
          height: 16px;
        `
      : isSSRRating &&
        css`
          width: 94px;
          height: 16px;
        `};

  ${layerADisabled180Deg}

  border-radius: 12px;
  opacity: 1;
  ${justifyContentSpaceBetween}
`;

const SwitchesDisplayInfo = styled.div`
  letter-spacing: 1px;
  font-size: 10px;
  margin-left: 2px;

  ${layerADisabled}

  border-radius: 12px;

  ${flexBoxCenter}

  ${({ isSSRUnits, isSSRRating }) =>
    isSSRUnits
      ? css`
          width: 46px;
          height: 12px;
        `
      : isSSRRating &&
        css`
          width: 78px;
          height: 12px;
        `};
`;

const Img = styled.img`
  margin-right: 3px;

  ${({ margin }) =>
    margin === 'x'
      ? css`
          margin: 0;
        `
      : margin &&
        css`
          margin-right: 6px;
        `}
`;

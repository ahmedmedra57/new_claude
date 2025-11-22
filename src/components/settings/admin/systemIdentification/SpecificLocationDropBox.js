import styled, { css } from 'styled-components';
import {
  borderBBlue,
  flexBoxCenter,
  justifyContentFlexStart,
} from '../../../styles/commonStyles';

const SpecificLocationDropBox = ({
  location,
  locationIdx,
  specificLocation,
  specificLocationIdx,
  selectedLocation,
  setSelectedLocation,
}) => {
  return (
    <SelectionIndivWrapper
      onClick={() =>
        setSelectedLocation({
          location,
          locationIdx,
          specificLocation,
          specificLocationIdx,
        })
      }
    >
      <OuterCircle>
        <InnerCircle
          isSelected={
            selectedLocation &&
            selectedLocation?.specificLocationIdx === specificLocationIdx &&
            selectedLocation?.locationIdx === locationIdx
          }
        ></InnerCircle>
      </OuterCircle>
      <Title>{specificLocation}</Title>
    </SelectionIndivWrapper>
  );
};

export default SpecificLocationDropBox;

const SelectionIndivWrapper = styled.div`
  width: 91%;
  height: 24px;
  margin-left: 20px;

  ${borderBBlue}

  border-radius: 12px;
  opacity: 1;
  ${justifyContentFlexStart}
  cursor: pointer;
`;

const OuterCircle = styled.div`
  width: 20px;
  height: 20px;
  margin-left: 1.6px;
  margin-right: 6px;
  border: 1px solid #95ff45;
  border-radius: 50%;
  ${flexBoxCenter}
`;

const InnerCircle = styled.div`
  width: 14px;
  height: 14px;

  ${({ isSelected }) =>
    isSelected &&
    css`
      background-color: #95ff45;
    `}

  border-radius: 50%;
`;

const Title = styled.span`
  font-size: 10px;
`;

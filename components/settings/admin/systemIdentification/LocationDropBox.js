import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import {
  borderBBlue,
  flexBoxCenter,
  justifyContentFlexStart,
  justifyContentSpaceAround,
  justifyContentSpaceEvenly,
  layerA,
  layerA180Deg,
  layerB,
  scrollbarY,
} from '../../../styles/commonStyles';
import SpecificLocationDropBox from './SpecificLocationDropBox';
import { testSpecificLocation } from './testSpecificLocation';
import isObject from 'lodash/isObject';

const LocationDropBox = ({
  locations,
  openLocationSelectBox,
  setOpenLocationSelectBox,
  handleSelectedLocation,
}) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedSpecificLocations, setSelectedSpecificLocations] = useState(
    {}
  );

  const handleLocationSelect = (location) => {
    const newSelectedLocations = { ...selectedSpecificLocations };
    newSelectedLocations[location] = !!!newSelectedLocations?.[location];
    setSelectedSpecificLocations(newSelectedLocations);
  };
  return (
    <Wrapper>
      <FlexRow>
        <TitleWrapper>
          <Title>
            {selectedLocation ? selectedLocation.location : 'select'}
          </Title>
        </TitleWrapper>
        <Img
          src={'./images/settings-sysIdentification-whiteTriangle.svg'}
          onClick={() => {
            setOpenLocationSelectBox(!openLocationSelectBox);
          }}
        />
      </FlexRow>
      <ContentWrapper>
        <Scrollbar>
          {locations?.map(({ location, specificLocation }, idx) => {
            if (isObject(specificLocation)) {
              const arrowImg = selectedSpecificLocations[location]
                ? '/images/masterCtr-select-btn.svg'
                : '/images/masterCtr-select-btn-right.svg';

              /* const specificLocationArr = [specificLocation]; */

              const specificLocationArr =
                typeof specificLocation === 'object'
                  ? Object.keys(specificLocation)
                  : [];
              return (
                <SpecificLocationWrapper key={location + idx}>
                  <SelectionIndivWrapper
                    onClick={() => handleLocationSelect(location)}
                  >
                    <ArrowIcon src={arrowImg} alt='arrow icon' />
                    <Title>{location}</Title>
                  </SelectionIndivWrapper>
                  {selectedSpecificLocations[location] &&
                    specificLocationArr.map((el, specificLocationIdx) => {
                      return (
                        <SpecificLocationDropBox
                          key={el}
                          location={location}
                          locationIdx={idx}
                          specificLocation={el}
                          specificLocationIdx={specificLocationIdx}
                          selectedLocation={selectedLocation}
                          setSelectedLocation={setSelectedLocation}
                        />
                      );
                    })}
                </SpecificLocationWrapper>
              );
            } else {
              return (
                <SelectionIndivWrapper
                  key={idx}
                  onClick={() =>
                    setSelectedLocation({ location, locationIdx: idx })
                  }
                >
                  <OuterCircle>
                    <InnerCircle
                      isSelected={
                        selectedLocation &&
                        selectedLocation?.locationIdx === idx
                      }
                    ></InnerCircle>
                  </OuterCircle>
                  <Title>{location}</Title>
                </SelectionIndivWrapper>
              );
            }
          })}
        </Scrollbar>
      </ContentWrapper>
      <ButtonWrapper>
        <Button
          onClick={() => {
            handleSelectedLocation(selectedLocation);
            setOpenLocationSelectBox(!openLocationSelectBox);
          }}
        >
          <ButtonHole>
            <ButtonTop>
              <Title>select</Title>
            </ButtonTop>
          </ButtonHole>
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
};

export default LocationDropBox;

const Wrapper = styled.div`
  width: 258px;
  /* width: 320px; */
  height: auto;

  ${layerA180Deg}

  border-radius: 11px 11px 15px 15px;
  opacity: 1;
  ${justifyContentSpaceEvenly}
  flex-direction: column;
`;

const FlexRow = styled.div`
  width: 100%;
  ${justifyContentSpaceEvenly}
`;

const TitleWrapper = styled.div`
  width: 238px;
  /* width: 300px; */
  height: 18px;
  margin-top: 2px;

  ${layerA}

  border-radius: 12px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Title = styled.span`
  font-size: 10px;
  /* letter-spacing: 0.8px; */
`;

const Img = styled.img`
  margin-top: 4px;
  cursor: pointer;
`;

const ContentWrapper = styled.div`
  width: 250px;
  /* width: 312px; */
  max-height: 228px;
  min-height: 188px;
  margin-top: 4px;

  padding: 4px;

  ${layerA}

  border-radius: 13px 8px 8px 13px;

  ${justifyContentFlexStart}
`;

const Scrollbar = styled.div`
  width: 100%;
  min-height: 220px;
  max-height: 180px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  gap: 4px;

  ${scrollbarY}
`;

const SpecificLocationWrapper = styled.div`
  width: 100%;
  height: auto;
  margin-left: -2px;
  /* min-height: 24px; */

  /* ${borderBBlue} */

  border-radius: 12px;
  opacity: 1;
  ${justifyContentFlexStart}
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
`;

const SelectionIndivWrapper = styled.div`
  width: 98%;
  min-height: 24px;

  ${borderBBlue}

  border-radius: 12px;
  opacity: 1;
  ${justifyContentFlexStart}
  cursor: pointer;
`;

const ArrowIcon = styled.img`
  width: 16px;
  height: 16px;
  margin-left: 6px;
  margin-right: 5px;
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

const ButtonWrapper = styled.div`
  width: 250px;
  /* width: 312px; */
  height: 24px;
  margin-top: 2px;

  ${layerB}

  border-radius: 27px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Button = styled.button`
  width: 248px;
  /* width: 310px; */
  height: 22px;

  ${layerA180Deg}

  border-radius: 25px;
  opacity: 1;
  ${flexBoxCenter}
`;

const ButtonHole = styled.div`
  width: 242px;
  /* width: 304px; */
  height: 16px;

  ${layerB}

  border-radius: 20px;
  opacity: 0.8;
  ${flexBoxCenter}
`;

const ButtonTop = styled.div`
  width: 240px;
  /* width: 302px; */
  height: 14px;

  ${layerA180Deg}

  border-radius: 25px;
  opacity: 1;
  ${flexBoxCenter}
`;

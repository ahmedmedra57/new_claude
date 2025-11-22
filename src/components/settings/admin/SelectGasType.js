import { useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import { selectEditCancelApplyButtons } from '../../store/slices/settings/editCancelApplyButtonsSlice';
import {
  borderABlue,
  flexBoxCenter,
  justifyContentFlexEnd,
  justifyContentFlexStart,
  justifyContentSpaceEvenly,
  layerA,
  layerA180Deg,
  layerB,
} from '../../styles/commonStyles';
import Button from '../buttons/Button';
import SelectLocationsBox from '../SelectLocationsBox';
import { useMediaQuery } from 'react-responsive';

function SelectGasType({
  selectedOne,
  handleOpenSelectLocations,
  displaySelectBox,
  ess,
  tgs,
  tes,
  // handleSelectIndividualMachine,
  // handleUnSelectIndividualMachine,
  handleSaveButton,
  setGasSelection,
  gasSelection,
  isActivate,
}) {
  // media query
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  const gasType = ['lp-propane', 'ng-natural gas'];

  const editState = useSelector(selectEditCancelApplyButtons);
  const { isEdit } = editState;

  return (
    <BaseLayer>
      <Wrapper>
        <TitleWrapper>
          <Title>select gas type</Title>
        </TitleWrapper>
        <SelectLocationsBoxWrapper>
          <SelectLocationsBox
            selectedOne={selectedOne}
            handleOpenSelectLocations={handleOpenSelectLocations}
            displaySelectBox={displaySelectBox}
            sysIndex={'gasType'}
            // contentIdx={1}
            multipleSelectBoxes={true}
            sysOptions={'admin'}
            swt={'tgs'}
            program={'admin'}
            // contentTitle={'gasType'}
            ess={ess}
            tgs={tgs}
            tes={tes}
            // handleSelectIndividualMachine={handleSelectIndividualMachine}
            // handleUnSelectIndividualMachine={handleUnSelectIndividualMachine}
            isMobileValveSettings={isMobile}
            isMobileGasType={isMobile}
          />
        </SelectLocationsBoxWrapper>
        {/* <WrapperSelection> */}
        <ControlContainer>
          {gasType.map((data, index) => {
            return (
              <ContainerOfSelections key={index}>
                <OutsideRingGreenCircle
                  onClick={() => {
                    isEdit && setGasSelection(index);
                  }}
                >
                  <InsideFilledGreenCircle
                    isColor={index === gasSelection ? true : false}
                  ></InsideFilledGreenCircle>
                </OutsideRingGreenCircle>

                <IndividualContainer>
                  <Text>{data}</Text>
                </IndividualContainer>
              </ContainerOfSelections>
            );
          })}
        </ControlContainer>

        <FlexButton isMobile={isMobile}>
          <Button
            id={2}
            handleClick={handleSaveButton}
            name={'select'}
            isActivate={isActivate}
          />
        </FlexButton>
      </Wrapper>
    </BaseLayer>
  );
}

export default SelectGasType;

const BaseLayer = styled.div`
  width: 274px;
  height: 200px;

  ${layerB}

  border-radius: 9px;
  opacity: 1;

  ${flexBoxCenter}
`;

const Wrapper = styled.div`
  width: 272px;
  height: 198px;

  ${layerA180Deg}

  border-radius: 8px;
  opacity: 1;
  ${justifyContentSpaceEvenly}
  flex-direction: column;
`;

const TitleWrapper = styled.div`
  width: 264px;
  height: 32px;

  ${layerA}

  border-radius: 16px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Title = styled.p`
  text-align: center;
  font-size: 12rem;
  letter-spacing: 1.2px;
  color: #ffffff;
  opacity: 1;
`;

const SelectLocationsBoxWrapper = styled.div`
  z-index: 10;
`;

const ControlContainer = styled.div`
  width: 264px;
  height: 68px;

  ${layerA}

  border-radius: 16px;
  opacity: 1;

  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
`;

const ContainerOfSelections = styled.div`
  ${justifyContentSpaceEvenly}
  gap:6rem;
  margin-left: 1px;
`;

const OutsideRingGreenCircle = styled.span`
  cursor: pointer;
  width: 28px;
  height: 28px;
  margin-left: 2px;

  border: 1.5px solid #95ff45;
  border-radius: 50%;
  ${flexBoxCenter}
`;

const InsideFilledGreenCircle = styled.div`
  width: 18px;
  height: 18px;
  background-color: ${({ isColor }) => (isColor ? '#95ff45' : 'none')};
  border-radius: 50%;
`;

const IndividualContainer = styled.div`
  width: 224px;
  height: 28px;

  ${borderABlue}
  border-radius: 14px;
  opacity: 1;

  ${justifyContentFlexStart}
`;

const Text = styled.p`
  font-size: 10rem;
  margin-left: 10px;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  opacity: 1;
`;

const FlexButton = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 100%;
          ${flexBoxCenter}
        `
      : css`
          width: 95%;
          ${justifyContentFlexEnd}
        `}
`;

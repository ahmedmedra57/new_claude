import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  flexBoxCenter,
  justifyContentFlexEnd,
  justifyContentSpaceEvenly,
} from '../../styles/commonStyles';
import SelectLocationsBox from '../SelectLocationsBox';

function SystemConfiguration({
  selectedOne,
  handleOpenSelectLocations,
  displaySelectBox,
  ess,
  tgs,
  tes,
  sys,
  sysIndex,
  handleSelectIndividualMachine,
  handleUnSelectIndividualMachine,
  handleSaveButton,
  selectSystemConfig,
  setSelectSystemConfig,
}) {
  const tgsTesDescription = [
    'tgs-typhoon gas system',
    'tes-typhoon electric system',
  ];

  return (
    <BaseLayer>
      <Wrapper>
        <WrapperTitle>
          <Title>system configuration</Title>
        </WrapperTitle>
        <SelectLocationWrapper>
          <SelectLocationsBox
            selectedOne={selectedOne}
            handleOpenSelectLocations={handleOpenSelectLocations}
            displaySelectBox={displaySelectBox}
            sysIndex={sysIndex}
            ess={ess}
            tgs={tgs}
            tes={tes}
            sys={sys}
            handleSelectIndividualMachine={handleSelectIndividualMachine}
            handleUnSelectIndividualMachine={handleUnSelectIndividualMachine}
          />
        </SelectLocationWrapper>
        <ControlContainer>
          {tgsTesDescription.map((data, index) => {
            return (
              <ContainerOfSelections key={index}>
                <ContainerOfCircles>
                  <OuterCircle
                    onClick={() => {
                      // editState && handleSelect(index);
                      setSelectSystemConfig(index);
                    }}
                  >
                    <InnerCircle
                      color={index}
                      options={selectSystemConfig === 1}
                    ></InnerCircle>
                  </OuterCircle>
                </ContainerOfCircles>
                <IndividualContainer>
                  <img
                    src={
                      index === 0
                        ? './images/systemConfiguration-tgs-blueButton.svg'
                        : './images/systemConfiguration-tes-blueButton.svg'
                    }
                  />
                  <Text>{data}</Text>
                </IndividualContainer>
              </ContainerOfSelections>
            );
          })}
        </ControlContainer>
        <FlexEndWrapper>
          <ButtonWrapper>
            <Button onClick={() => handleSaveButton(4)}>
              <ButtonHole>
                <ButtonTop>
                  <ButtonTitle>save</ButtonTitle>
                </ButtonTop>
              </ButtonHole>
            </Button>
          </ButtonWrapper>
        </FlexEndWrapper>
      </Wrapper>
    </BaseLayer>
  );
}

export default SystemConfiguration;

const BaseLayer = styled.div`
  width: 274px;
  height: 201px;

  background: #1b2b44;
  box-shadow: inset 0px 0px 2px #000000;
  border-radius: 9px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Wrapper = styled.div`
  width: 272px;
  height: 199px;

  background: transparent linear-gradient(180deg, #233a54 0%, #060d19 100%);
  box-shadow: 0px 0px 2px #000000;
  border: 0.5px solid #000000;
  border-radius: 8px;
  opacity: 1;
  ${justifyContentSpaceEvenly}
  flex-direction: column;
`;

// const Wrapper3 = styled.div`
//   width: 100%;
//   height: 100%;
//   display: flex;
//   justify-content: space-evenly;
//   align-items: center;
//   flex-direction: column;
// `;

const WrapperTitle = styled.div`
  width: 264px;
  height: 32px;

  background: #233a54;
  box-shadow: inset 0px 0px 3px #000000;
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

const SelectLocationWrapper = styled.div`
  z-index: 10;
`;

const ControlContainer = styled.div`
  width: 264px;
  height: 68px;

  background: #233a54;
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 16px;
  opacity: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
`;

const ContainerOfSelections = styled.div`
  display: flex;
  justify-content: center;
  margin-left: 1px;
`;

const ContainerOfCircles = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const OuterCircle = styled.span`
  cursor: pointer;
  width: 28px;
  height: 28px;
  margin-left: 4px;
  margin-top: 2px;
  border: 1.5px solid #95ff45;
  border-radius: 50%;
  background: #1b2b44;
  ${flexBoxCenter}
`;

const InnerCircle = styled.span`
  width: 18px;
  height: 18px;

  background-color: ${({ color }) => color === 0 && '#95ff45'};

  ${({ options }) =>
    options ? 'background-color:#95ff45' : 'background-color:none'};

  border-radius: 50%;
`;

const IndividualContainer = styled.div`
  width: 224px;
  height: 28px;

  border: 1px solid #142033;
  border-radius: 14px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Text = styled.span`
  width: 218px;
  font-size: 7px;

  text-transform: uppercase;
  color: ${(props) => (props.mode ? '#233a54' : '#FFFFFF')};
  letter-spacing: 1.2px;
  opacity: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const FlexEndWrapper = styled.div`
  width: 98%;
  ${justifyContentFlexEnd}
`;

const ButtonWrapper = styled.div`
  width: 84px;
  height: 29px;

  background: #1b2b44;
  box-shadow: inset 0px 0px 1px #000000;
  border-radius: 27px;
  opacity: 1;

  ${flexBoxCenter}
`;

const Button = styled.button`
  width: 82px;
  height: 27px;

  background: transparent linear-gradient(180deg, #233a54 0%, #060d19 100%);
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid #000000;
  border-radius: 25px;
  opacity: 1;

  ${flexBoxCenter}
`;

const ButtonHole = styled.div`
  width: 76px;
  height: 21px;

  background: #1b2b44;
  box-shadow: inset 0px 0px 1px #000000;
  border-radius: 20px;

  opacity: 1;

  ${flexBoxCenter}
`;
const ButtonTop = styled.div`
  width: 74px;
  height: 19px;

  background: transparent linear-gradient(180deg, #233a54 0%, #060d19 100%);
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid #000000;
  border-radius: 25px;
  opacity: 1;

  ${flexBoxCenter}
`;

const ButtonTitle = styled.div`
  font-size: 10px;
  letter-spacing: 1px;
  color: #ffffff;
  opacity: 1;
`;

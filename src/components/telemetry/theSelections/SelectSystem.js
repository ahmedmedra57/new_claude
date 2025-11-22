import { useState } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  borderBlue,
  flexBoxCenter,
  justifyContentFlexEnd,
  justifyContentFlexStart,
  justifyContentSpaceAround,
  justifyContentSpaceBetween,
  justifyContentSpaceEvenly,
  layerA180Deg,
  layerA90Deg,
  layerADark,
  layerB,
  layerBDark,
} from '../../styles/commonStyles';
import SelectConsumption from './SelectConsumption';
import SelectionsButton from './SelectionsButton';

const SelectSystem = ({
  title,
  dataSystems,
  gasSystems,
  electricSystems,
  buttons,
  onSelect,
  systemIndex,
  onClickButton,
  openSelections,
  setOpenSelections,
  selectConsumptionType,
  handleExpansion,
  isExpanded,
  arrowImg,
}) => {
  const { t } = useTranslation();
  return (
    <Wrapper>
      <TitleWrapper>
        <Title>{t('telemetry.selectSystem')}</Title>
      </TitleWrapper>
      {openSelections ? (
        <WrapperSelection1>
          <TextImgWrapper>
            <IndentSelection1>
              <Text>{title ? title : '-----'}</Text>
            </IndentSelection1>
            <Img
              src={'/images/select-arrow-icon.svg'}
              onClick={() => setOpenSelections(!openSelections)}
            ></Img>
          </TextImgWrapper>
          <SelectionsWrapper>
            {selectConsumptionType?.map((value, index) => {
              return (
                <div key={index}>
                  <Selection onClick={() => handleExpansion(index)}>
                    <Img2 src={arrowImg[index]} />
                    <SystemTitle>{value}</SystemTitle>
                  </Selection>
                  {isExpanded[0] && index === 0 && (
                    <SelectConsumption
                      consumptionInfo={dataSystems}
                      addToIndex={0}
                      systemIndex={systemIndex}
                      onSelect={onSelect}
                      isDataConsumption={true}
                    />
                  )}
                  {isExpanded[1] && index === 1 && (
                    <SelectConsumption
                      consumptionInfo={electricSystems}
                      addToIndex={4}
                      systemIndex={systemIndex}
                      onSelect={onSelect}
                    />
                  )}
                  {isExpanded[2] && index === 2 && (
                    <SelectConsumption
                      consumptionInfo={gasSystems}
                      addToIndex={7}
                      systemIndex={systemIndex}
                      onSelect={onSelect}
                    />
                  )}
                </div>
              );
            })}
          </SelectionsWrapper>

          <ButtonsFlexEnd>
            <ButtonsWrapper>
              {buttons?.map((value, index) => {
                return (
                  <div key={index * 65}>
                    <SelectionsButton
                      title={value}
                      onClickButton={onClickButton}
                      index={index}
                    />
                  </div>
                );
              })}
            </ButtonsWrapper>
          </ButtonsFlexEnd>
        </WrapperSelection1>
      ) : (
        <WrapperSelection>
          <IndentSelection>
            <Text>{title ? title : '-----'} </Text>
          </IndentSelection>
          <Img
            src={'/images/select-arrow-icon.svg'}
            onClick={() => setOpenSelections(!openSelections)}
          ></Img>
        </WrapperSelection>
      )}
    </Wrapper>
  );
};

export default SelectSystem;

const Wrapper = styled.div`
  width: auto;
  height: 59px;

  flex-direction: column;
  z-index: 10;
`;

const TitleWrapper = styled.div`
  ${flexBoxCenter}
`;

const Title = styled.p`
  margin-bottom: 4px;

  text-align: left;
  font-size: 10px;
  letter-spacing: 1px;
  color: #ffffff;
  opacity: 1;
`;

const WrapperSelection1 = styled.div`
  width: 305px;
  height: auto;
  padding-top: 3.3px;
  padding-bottom: 4px;
  /* padding: 5px; */

  ${layerA90Deg}

  border-radius: 20px 20px 18px 18px;
  opacity: 1;
  ${justifyContentSpaceEvenly}
  flex-direction: column;
  gap: 4px;
  z-index: 10;
`;

const TextImgWrapper = styled.div`
  width: 305px;
  ${justifyContentSpaceAround}/* margin-left: 1px; */
`;

const IndentSelection1 = styled.div`
  width: 257px;
  height: 33px;

  ${layerADark}

  border-radius: 33px;
  opacity: 1;
  ${justifyContentFlexStart}
`;

const Text = styled.p`
  margin-left: 10px;

  max-width: 240px;
  text-align: center;
  font-size: 10px;
  letter-spacing: 1px;
  color: #ffffff;
`;

const Img = styled.img`
  margin-right: 4px;
  cursor: pointer;
`;

const SelectionsWrapper = styled.div`
  width: 296px;
  height: auto;
  padding: 4px;

  ${layerBDark}

  border-radius: 14px;
  opacity: 1;
  z-index: 10;
  ${flexBoxCenter}
  gap:4px;
  flex-direction: column;
`;

const Selection = styled.div`
  width: 291px;
  height: 26px;

  ${borderBlue}
  border-radius: 13px;
  opacity: 2;
  z-index: 10;
  ${justifyContentFlexStart}
`;

const Img2 = styled.img`
  width: fit-content;
  display: block;
  margin-top: 4px;
  margin-left: 6px;

  cursor: pointer;
`;

const SystemTitle = styled.p`
  margin-left: 4px;
  text-align: left;
  font-size: 8px;
  letter-spacing: 1px;
  color: #ffffff;
  opacity: 1;
  z-index: 10;
`;

const ButtonsFlexEnd = styled.div`
  width: 97%;
  height: 45px;

  ${justifyContentFlexEnd}
`;

const ButtonsWrapper = styled.div`
  width: 174px;
  height: 45px;
  padding-left: 2px;
  padding-right: 2px;

  ${layerB}

  border-radius: 23px;
  opacity: 1;
  z-index: 10;
  ${justifyContentSpaceBetween}
`;

const WrapperSelection = styled.div`
  width: 305px;
  height: 41px;

  ${layerA180Deg}

  border-radius: 34px;
  opacity: 1;
  ${justifyContentSpaceEvenly}
  gap:6px;
`;

const IndentSelection = styled.div`
  width: 257px;
  height: 33px;

  ${layerADark}

  border-radius: 33px;
  opacity: 1;
  ${justifyContentFlexStart}
`;

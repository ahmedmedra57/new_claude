import styled, { css } from 'styled-components';
import {
  borderABlue,
  flexBoxCenter,
  justifyContentFlexStart,
  justifyContentSpaceAround,
  justifyContentSpaceEvenly,
  layerDegHPA,
  layerDegHPB,
  layerHPA,
  selectionCircleBorder,
} from '../../../styles/commonStyles';
import { useState } from 'react';

const SelectSystemDropBox = ({
  selectedTitle,
  selectionHandler,
  selectionTitle,
  openDropBoxHandler,
}) => {
  // const selectionTitle = ['transit station', 'switches'];

  const [selectedOption, setSelectedOption] = useState('');
  // const [selectedTitle, setSelectedTitle] = useState('');

  // const selectionHandler = (idx) => {
  //   setSelectedTitle(selectionTitle[idx]);
  // };

  return (
    <Wrapper>
      <FlexWrapper first={true}>
        <ConcaveLayer width={'90px'} height={'14px'}>
          <BorderLayer title={true} width={'88px'} height={'12px'}>
            <Text>{selectedTitle}</Text>
          </BorderLayer>
        </ConcaveLayer>
        <Button onClick={openDropBoxHandler}>
          <img
            alt='white-triangle'
            src='./images/settings-sysIdentification-whiteTriangle.svg'
          />
        </Button>
      </FlexWrapper>
      <FlexWrapper second={true}>
        <ConcaveLayer width={'104px'} height={'32px'}>
          {selectionTitle.map((title, titleIdx) => (
            <Button onClick={() => setSelectedOption(titleIdx)}>
              <BorderLayer width={'100px'} height={'14px'}>
                <OuterGreenCircle>
                  <InnerGreenCircle
                    isSelected={titleIdx === selectedOption}
                  ></InnerGreenCircle>
                </OuterGreenCircle>
                <Text>{title}</Text>
              </BorderLayer>
            </Button>
          ))}
        </ConcaveLayer>
      </FlexWrapper>
      <FlexWrapper>
        <Button
          onClick={() => {
            selectionHandler(selectedOption);
            openDropBoxHandler();
          }}
        >
          <ButtonConcaveLayer
            borderRadius={'20px'}
            width={'58px'}
            height={'22px'}
          >
            <ButtonConvexLayer
              borderRadius={'18px'}
              width={'56px'}
              height={'20px'}
            >
              <ButtonConcaveLayer
                borderRadius={'18px'}
                width={'50px'}
                height={'14px'}
              >
                <ButtonConvexLayer
                  borderRadius={'13px'}
                  width={'48px'}
                  height={'12px'}
                >
                  <Text>select</Text>
                </ButtonConvexLayer>
              </ButtonConcaveLayer>
            </ButtonConvexLayer>
          </ButtonConcaveLayer>
        </Button>
      </FlexWrapper>
    </Wrapper>
  );
};

export default SelectSystemDropBox;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  border-radius: 8px;
  ${layerDegHPA}
`;

const FlexWrapper = styled.div`
  width: 100%;
  height: auto;

  ${({ first, second }) =>
    first
      ? css`
          ${justifyContentSpaceEvenly}
        `
      : second
      ? css`
          ${justifyContentSpaceAround}
          flex-direction: column;
        `
      : css`
          ${justifyContentFlexStart}
        `}
`;

const ConcaveLayer = styled.div`
  ${({ width, height }) =>
    css`
      width: ${width};
      height: ${height};
    `}
  border-radius: 6px;
  ${layerHPA}
  ${flexBoxCenter}
  flex-direction: column;
  gap: 1px;
`;

const BorderLayer = styled.div`
  border-radius: 10px;
  ${({ width, height }) =>
    css`
      width: ${width};
      height: ${height};
    `}
  ${({ title }) =>
    title
      ? css`
          ${flexBoxCenter}
        `
      : css`
          ${justifyContentFlexStart}
        `}
          ${borderABlue}
`;

const Text = styled.p`
  font-size: 8px;
`;

const Button = styled.button``;

const OuterGreenCircle = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  ${selectionCircleBorder}
  ${flexBoxCenter}
`;

const InnerGreenCircle = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  ${({ isSelected }) =>
    isSelected &&
    css`
      background-color: rgba(149, 255, 69, 1);
    `}
`;

const ButtonConcaveLayer = styled.div`
  ${({ borderRadius, width, height }) =>
    css`
      width: ${width};
      height: ${height};
      border-radius: ${borderRadius};
    `}
  ${layerHPA}
  ${flexBoxCenter}
`;

const ButtonConvexLayer = styled.div`
  ${({ borderRadius, width, height }) =>
    css`
      width: ${width};
      height: ${height};
      border-radius: ${borderRadius};
    `}
  ${layerDegHPB}
  ${flexBoxCenter}
`;

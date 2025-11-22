import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  layerA,
  borderABlue,
} from '../../../styles/commonStyles';

function SelectBox({ gpEbp, handleClick, sysIndex, selected }) {
  return (
    <>
      {gpEbp?.map((data, index) => {
        return (
          <EachContainerOfSelection
            key={index}
            isHeight={sysIndex === 1 || sysIndex === 2}
          >
            <FlexCenterWrapper>
              <>
                <OuterCircle
                  onClick={() => {
                    handleClick(sysIndex, index);
                  }}
                >
                  <InnerCircle
                    enabled={selected[sysIndex] === index}
                  ></InnerCircle>
                </OuterCircle>
              </>
              <IndividualContainer isHeight={sysIndex === 1 || sysIndex === 2}>
                <FlexWrapper>
                  <Description>{data}</Description>
                </FlexWrapper>
              </IndividualContainer>
            </FlexCenterWrapper>
          </EachContainerOfSelection>
        );
      })}
    </>
  );
}

export default SelectBox;

const EachContainerOfSelection = styled.div`
  width: 263px;
  height: 42px;
  margin-top: 6px;

  ${layerA}

  border-radius: 19px;
  opacity: 1;
  display: flex;
  justify-content: center;
  ${({ isHeight }) =>
    isHeight &&
    css`
      height: 53px;
      border-radius: 16px;
    `}
`;

const FlexCenterWrapper = styled.div`
  ${flexBoxCenter}
  width: 100%;
  height: 100%;
  margin-left: -1px;
`;

const OuterCircle = styled.span`
  cursor: pointer;
  width: 28px;
  height: 28px;
  margin-left: 4px;
  margin-top: 2px;
  border: 1.5px solid #95ff45;
  border-radius: 50%;
  ${flexBoxCenter}
`;

const InnerCircle = styled.div`
  cursor: pointer;
  width: 20px;
  height: 20px;
  background-color: ${({ enabled }) => (enabled ? '#95ff45' : 'none')};
  border-radius: 50%;
`;

const IndividualContainer = styled.div`
  width: 223px;
  height: 38px;
  margin-left: 4px;
  ${borderABlue}
  border-radius: 18px;
  opacity: 1;
  ${({ isHeight }) =>
    isHeight &&
    css`
      height: 49px;
      border-radius: 14px;
    `}
  ${flexBoxCenter}
`;

const FlexWrapper = styled.div`
  width: 215px;
`;

const Description = styled.p`
  font-size: 10px;
  text-transform: uppercase;

  letter-spacing: 1px;
  opacity: 1;
  max-width: 28ch;
  line-height: 10px;
  text-align: center;
`;

import styled from 'styled-components';
import {
  flexBoxCenter,
  layerA,
  layerDegHPB,
} from '../../../../styles/commonStyles';
import { useState } from 'react';

const HpMcTitle = () => {
  const [selection, setSelection] = useState('master control complete station');

  return (
    <Wrapper>
      <FirstLayer>
        <SecondLayer>
          <ThirdLayer>
            <TextWrapper>
              <Text>{selection}</Text>
            </TextWrapper>
          </ThirdLayer>
        </SecondLayer>
      </FirstLayer>
    </Wrapper>
  );
};

export default HpMcTitle;

const Wrapper = styled.div`
  width: 234px;
  height: 68px;

  ${layerA}
  /* background: #233a54 0% 0% no-repeat padding-box;
  box-shadow: inset 0px 0px 3px #000000; */
  border-radius: 19px;

  ${flexBoxCenter}
`;

const FirstLayer = styled.div`
  width: 228px;
  height: 62px;

  ${layerDegHPB}
  /* background: transparent
    linear-gradient(180deg, #233a54 0%, #060d19 49%, #233a54 100%) 0% 0%
    no-repeat padding-box;
    border: 0.5px solid #000000; */
    box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border-radius: 17px;

  ${flexBoxCenter}
`;

const SecondLayer = styled.div`
  width: 220px;
  height: 54px;

  ${layerA}
  /* background: #233a54 0% 0% no-repeat padding-box;
  box-shadow: inset 0px 0px 3px #000000; */
  border-radius: 13px;

  ${flexBoxCenter}
`;

const ThirdLayer = styled.div`
  width: 216px;
  height: 50px;

  ${layerDegHPB}
  /* background: transparent
    linear-gradient(180deg, #233a54 0%, #060d19 49%, #233a54 100%) 0% 0%
    no-repeat padding-box;
    border: 0.5px solid #000000; */
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border-radius: 12px;

  ${flexBoxCenter}
`;

const TextWrapper = styled.div`
  width: 200px;
  height: 37px;

  text-align: center;
  ${flexBoxCenter}
`;

const Text = styled.p`
  font-size: 14px;
  letter-spacing: 1.5px;
  color: #ffffff;
`;

import styled from 'styled-components';
import SubheaderBox from '../SubheaderBox';
import {
  flexBoxCenter,
  justifyContentSpaceEvenly,
  layerHPA,
  layerHPB,
} from '../../../../styles/commonStyles';
import YellowDisplayBox from '../../../common/YellowDisplayBox';

const EncloseTelemetry = () => {
  const yellowDisplayData = ['1yd', '2yd', '3yd', '4yd', '5yd', '6yd', '7yd'];
  return (
    <Wrapper>
      <FirstLayer>
        <SubheaderBox
          title={'enclosure live telemetry'}
          customCss={{ height: '22px', width: '860px', borderRadius: '12px' }}
          fontSize={'10px'}
          flexLeft={true}
        />
        <FlexWrapper>
          {yellowDisplayData.map((id, idx) => {
            const lastIdx = yellowDisplayData.length - 1;
            if (idx !== lastIdx) {
              return (
                <YellowDisplayBox
                  key={id}
                  wrapperXSize={'116px'}
                  wrapperYSize={'28px'}
                  innerXLayer={'112px'}
                  innerYLayer={'26px'}
                />
              );
            } else {
              return (
                <YellowDisplayBox
                  key={id}
                  wrapperXSize={'104px'}
                  wrapperYSize={'28px'}
                  innerXLayer={'100px'}
                  innerYLayer={'26px'}
                />
              );
            }
          })}
        </FlexWrapper>
      </FirstLayer>
    </Wrapper>
  );
};

export default EncloseTelemetry;

const Wrapper = styled.section`
  width: 875px;
  height: 81px;

  border-radius: 18px 18px 14px 14px;
  ${layerHPA}
  /* background: #233a54;
  box-shadow: 0px 0px 2px 0px #000 inset; */
  ${flexBoxCenter}
`;

const FirstLayer = styled.div`
  width: 869px;
  height: 77px;

  ${layerHPB}
  /* background: #142033 0% 0% no-repeat padding-box;
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid #000000; */
  border-radius: 14px;
  ${flexBoxCenter}
  flex-direction: column;
  gap: 16px;
`;

const FlexWrapper = styled.div`
  width: 100%;
  ${justifyContentSpaceEvenly}
`;

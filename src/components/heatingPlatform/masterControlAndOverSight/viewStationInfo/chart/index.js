import styled from 'styled-components';
import MainSitePlanBox from './MainSitePlanBox';
import { flexBoxCenter } from '../../../../styles/commonStyles';

const Chart = () => {
  return (
    <Wrapper>
      <MainSitePlanBox />
    </Wrapper>
  );
};

export default Chart;

const Wrapper = styled.section`
  height: 192px;
  width: 875px;
  ${flexBoxCenter}
  flex-direction: column;
`;

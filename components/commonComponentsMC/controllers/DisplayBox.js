import styled, { css } from 'styled-components';
import { flexBoxCenter } from '../../styles/commonStyles';

const DisplayBox = ({ title, data, unit, size }) => {
  return (
    <Wrapper size={size}>
      <InnerWrapper size={size}>
        <SectionDataAndUnit>
          <DisplayData>{data} </DisplayData>
          <DisplayUnit>{unit}</DisplayUnit>
        </SectionDataAndUnit>
        <SectionTitle>
          <DisplayTitle>
            {title.split(' ')[0]}
            <br></br>
            {title.split(' ')[1]}{' '}
            {title.split(' ')[2] && `${title.split(' ')[2]}`}
          </DisplayTitle>
        </SectionTitle>
      </InnerWrapper>
    </Wrapper>
  );
};

export default DisplayBox;

const Wrapper = styled.div`
  width: 182px;
  height: 50px;
  border-radius: 6px;

  background: transparent
    linear-gradient(180deg, #d9d24b 0%, #aea951 61%, #67665c 100%);
  box-shadow: 0px 0px 3px #000000;

  ${flexBoxCenter}

  ${(p) =>
    p.size === 'sm' &&
    css`
      width: 176px;
      height: 50px;
    `}
`;
const InnerWrapper = styled.div`
  width: 174px;
  height: 41px;

  background: transparent linear-gradient(180deg, #2e2e1e 0%, #fef100 100%);
  border: 1px solid #ffe600;
  border-radius: 4px;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  ${(p) =>
    p.size === 'sm' &&
    css`
      width: 168px;
      height: 41px;
    `}
`;
const SectionDataAndUnit = styled.section`
  width: 100%;
  display: flex;
  align-items: flex-start;
  margin-top: -5px;
  margin-bottom: -20px;
`;

const DisplayData = styled.span`
  font-size: 32px;
  color: #1b2b44;
`;
const DisplayUnit = styled.span`
  font-size: 20px;
  letter-spacing: 2px;
  color: #1b2b44;
  margin-top: 4px;
  text-transform: capitalize;
`;
const SectionTitle = styled.section`
  width: 100%;

  display: flex;
  justify-content: flex-end;
  margin-top: 5px;
  padding-right: 2px;
`;

const DisplayTitle = styled.span`
  font-size: 10px;
  line-height: 90%;
  color: #1b2b44;
  text-align: right;
`;

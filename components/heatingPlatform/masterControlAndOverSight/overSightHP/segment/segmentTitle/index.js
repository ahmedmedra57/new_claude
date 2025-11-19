import styled from 'styled-components';

const SegmentTitle = ({ num }) => {
  return (
    <FlexLeft>
      <MainTitle>segment {num}</MainTitle>
      <MainTitleUnderline></MainTitleUnderline>
    </FlexLeft>
  );
};

export default SegmentTitle;

const FlexLeft = styled.div`
  width: 100%;
  height: 38%;
  margin-left: 50px;

  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
`;

const MainTitle = styled.p`
  /* width: 30%;
  height: 50%; */
  font-size: 14px;
  letter-spacing: 1.4px;
`;

const MainTitleUnderline = styled.div`
  width: 97%;
  border-bottom: 1px solid #fff;
`;

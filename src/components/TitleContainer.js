import styled, { css } from 'styled-components';
import { memo } from 'react';
import { flexBoxCenter, layerADark } from './styles/commonStyles';
import { useMediaQuery } from 'react-responsive';

const TitleContainer = ({ title }) => {
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  return (
    <>
      {isMobile ? (
        <Wrapper isMobile={true}>
          <TitleWrapper isMobile={true}>
            <Title isMobile={true}>{title}</Title>
          </TitleWrapper>
        </Wrapper>
      ) : (
        <Wrapper>
          <TitleWrapper>
            <Title>{title}</Title>
          </TitleWrapper>
        </Wrapper>
      )}
    </>
  );
};

export default memo(TitleContainer);

const Wrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 314px;
          height: 40px;
          ${layerADark};
          ${flexBoxCenter};
          border-radius: 30px;
          opacity: 1;
        `
      : css`
          width: 1216px;
          height: 32px;
          margin-bottom: 10px;
          ${layerADark};
          ${flexBoxCenter};
          border-radius: 16px;
          padding: 5rem 10rem;
        `}
`;
const TitleWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 88%;
          height: 52%;
          border-bottom: 2px solid #fff;
          display: flex;
          align-items: center;
        `
      : css`
          width: 100%;
          height: 95%;
          border-bottom: 2px solid #fff;
          display: flex;
          align-items: center;
        `}
`;
const Title = styled.span`
  ${({ isMobile }) =>
    isMobile
      ? css`
          font-size: 14px;
          letter-spacing: 1.4px;
        `
      : css`
          font-size: 16px;
          letter-spacing: 1.6px;
        `}
`;

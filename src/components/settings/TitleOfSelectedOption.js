import { flexBoxCenter, layerADark } from '../styles/commonStyles';
import styled, { css } from 'styled-components';
import { useMediaQuery } from 'react-responsive';

const TitleOfSelectedOption = ({ title }) => {
  // media query
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  return (
    <>
      {isMobile ? (
        <TitleWrapper isMobile={true}>
          <Title isMobile={true}>{title}</Title>
        </TitleWrapper>
      ) : (
        <TitleWrapper>
          <Title>{title}</Title>
        </TitleWrapper>
      )}
    </>
  );
};

export default TitleOfSelectedOption;

const TitleWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 298px;
          height: 32px;
          border-radius: 16px;
        `
      : css`
          width: 859px;
          height: 38px;
          border-radius: 22px;
        `}

  ${layerADark}
  ${flexBoxCenter}
`;

const Title = styled.p`
  ${({ isMobile }) =>
    isMobile
      ? css`
          font-size: 12px;
          letter-spacing: 1.2px;
        `
      : css`
          font-size: 14px;
          letter-spacing: 1.4px;
        `}
`;

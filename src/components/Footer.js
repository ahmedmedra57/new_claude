import { memo } from 'react';
import { useMediaQuery } from 'react-responsive';
import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  layerA,
  layerA180Deg,
  layerADark,
} from './styles/commonStyles';

const Footer = () => {
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  return (
    <Wrapper isMobile={isMobile}>
      <InnerWrapper isMobile={isMobile}>
        <TitleWrapper isMobile={isMobile}>
          <Title src={'/images/embrellaTitle-footer.svg'} />
        </TitleWrapper>
      </InnerWrapper>
    </Wrapper>
  );
};

export default memo(Footer);

const Wrapper = styled.footer`
  width: 1328px;
  height: 50px;

  box-shadow: inset 0px 0.5px 6px #000000;
  border-radius: 13px 13px 33px 13px;

  ${flexBoxCenter};

  ${(p) =>
    p.isMobile &&
    css`
      width: 335px;
      height: 66px;
      border-radius: 12px 12px 32px 12px;
      ${layerADark}
      margin-top: 5px;
    `}
`;

const InnerWrapper = styled.div`
  width: 1326px;
  height: 48px;
  border-radius: 12px 12px 32px 12px;

  ${layerA180Deg}
  ${flexBoxCenter}

  ${(p) =>
    p.isMobile &&
    css`
      width: 333px;
      height: 64px;
      border-radius: 11px 11px 32px 11px;
    `}
`;

const TitleWrapper = styled.div`
  ${(p) => p.isMobile && css``}
`;
const Title = styled.img``;

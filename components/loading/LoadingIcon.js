import styled, { css } from 'styled-components';
import { flexBoxCenter } from '../styles/commonStyles';

const LoadingIcon = ({ isCenterPosition }) => {
  return (
    <PositionCenterWrapper isCenterPosition={isCenterPosition}>
      <Loader>
        <Spinner></Spinner>
        <Text>loading</Text>
      </Loader>
    </PositionCenterWrapper>
  );
};

export default LoadingIcon;

const PositionCenterWrapper = styled.div`
  ${({ isCenterPosition }) =>
    isCenterPosition
      ? css`
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        `
      : css``}
`;

const Loader = styled.div`
  width: 204px;
  height: 204px;

  position: relative;
  overflow: hidden;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 auto;
  ${flexBoxCenter}
`;

const Spinner = styled.div`
  width: 204px;

  aspect-ratio: 1;
  border-radius: 50%;
  padding: 1px;
  background: conic-gradient(#0000 10%, #95ff45) content-box;
  -webkit-mask: repeating-conic-gradient(
      #0000 12deg,
      #000 1deg 20deg,
      #0000 21deg 28deg
    ),
    radial-gradient(
      farthest-side,
      #0000 calc(100% - 18px - 3px),
      #000 calc(100% - 20px)
    );
  -webkit-mask-composite: destination-in;
  mask-composite: intersect;
  animation: s4 3000ms infinite steps(23);

  @keyframes s4 {
    to {
      transform: rotate(1turn);
    }
  }
  position: absolute;
`;

const Text = styled.p`
  color: #95ff45;
  font-size: 20px;
`;

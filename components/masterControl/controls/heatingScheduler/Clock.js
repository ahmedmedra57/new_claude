import styled, { css } from 'styled-components';
import { flexBoxCenter } from '../../../styles/commonStyles';

const Clock = ({ time, isMobile }) => {
  return (
    <Wrapper isMobile={isMobile}>
      <WatchBackground src={'/images/watch.svg'} isMobile={isMobile} />

      <Hour isMobile={isMobile}>
        <ClockHr
          isMobile={isMobile}
          time={time.hour * 30 + (Number(time.minute) / 12) * 6}
        ></ClockHr>
      </Hour>

      <Minute isMobile={isMobile}>
        <ClockMm time={time.minute * 6} isMobile={isMobile}></ClockMm>
      </Minute>
      <Center isMobile={isMobile}></Center>
    </Wrapper>
  );
};
export default Clock;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  ${flexBoxCenter}
  position: relative;

  ${(p) => p.isMobile && css``}
`;
const WatchBackground = styled.img`
  ${(p) =>
    p.isMobile &&
    css`
      height: 100%;
      width: 100%;
    `}
`;

const Hour = styled.div`
  width: 100px;
  height: 100px;
  position: absolute;

  ${(p) =>
    p.isMobile &&
    css`
      width: 92%;
      height: 92%;
    `}
`;

const ClockHr = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;

  display: flex;
  justify-content: center;
  position: absolute;
  z-index: 10;

  ::before {
    content: '';
    position: absolute;
    width: 4px;
    height: 45px;
    z-index: 10;
    border-radius: 6px 6px 0 0;
    background-color: #fff;
  }
  transform: rotateZ(${(p) => p.time}deg);

  ${(p) =>
    p.isMobile &&
    css`
      width: 100%;
      height: 100%;

      ::before {
        content: '';
        width: 2px;
        height: 40px;
      }
    `}
`;

const Minute = styled.div`
  width: 100px;
  height: 100px;
  position: absolute;

  ${(p) =>
    p.isMobile &&
    css`
      width: 92%;
      height: 92%;
    `}
`;
const ClockMm = styled.div`
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  position: absolute;
  border-radius: 50%;
  transform: rotateZ(${(p) => p.time}deg);
  ::before {
    content: '';
    position: absolute;
    width: 2px;
    height: 45px;
    z-index: 10;
    border-radius: 6px 6px 0 0;
    background-color: #95ff45;
  }

  ${(p) =>
    p.isMobile &&
    css`
      width: 100%;
      height: 100%;

      ::before {
        content: '';
        width: 2px;
        height: 42px;
      }
    `}
`;

const Center = styled.div`
  height: 0.7px;
  width: 0.7px;
  position: absolute;
  background-color: #fff;
  border-radius: 50%;
  z-index: 12;

  ${(p) => p.isMobile && css``}
`;

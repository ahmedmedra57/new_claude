import styled, { css } from 'styled-components';
import { memo } from 'react';
import LoadingIcon from './LoadingIcon';
import { flexBoxCenter, justifyContentFlexEnd } from '../styles/commonStyles';

const MainLoadingPage = () => {
  // Fading Out Loadbar on Finised
  // setTimeout(function () {
  //   $('.preloader-wrap').fadeOut(300);
  // }, time);

  return (
    <Wrapper>
      <LoadingIcon isCenterPosition={true} />

      <Position>
        <img src='./images/loadingPage-umbrella-sign.svg' />
      </Position>
    </Wrapper>
  );
};

export default memo(MainLoadingPage);

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  position: relative;
`;

const Position = styled.div`
  height: 80vh;
  ${justifyContentFlexEnd}
  flex-direction: column;
`;

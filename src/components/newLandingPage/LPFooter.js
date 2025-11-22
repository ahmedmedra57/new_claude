import styled from 'styled-components';

import { breakpoints, devices } from './landing-page-breakpoints/breakpoints';
import { flexBoxCenter } from '../styles/commonStyles';

const LPFooter = () => {
  return (
    <Wrapper>
      <Img src='/images/contactus-umbrella-dark.png' alt='umbrella logo' />
    </Wrapper>
  );
};

export default LPFooter;

const Wrapper = styled.div`
  height: 140px;
  width: 100vw;

  align-self: stretch;

  background: #fff;

  ${flexBoxCenter};
`;

const Img = styled.img`
  width: 300px;
  height: 34px;

  /* @media only screen and ${devices.md} {
    width: 355.5px;
    height: 43px;
  } */
`;

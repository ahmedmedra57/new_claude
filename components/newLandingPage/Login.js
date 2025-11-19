// react Hooks
import { memo, useEffect } from 'react';
import { useState } from 'react';
// libraries
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';

// common styles

import { devices, breakpoints } from './landing-page-breakpoints/breakpoints';
import {
  alignItemsFlexEnd,
  flexBoxCenter,
  justifyContentFlexEnd,
  justifyContentSpaceAround,
  justifyContentSpaceEvenly,
} from '../styles/commonStyles';
import LoginBox from './LoginBox';
import { useMediaQuery } from 'react-responsive';

const Login = ({ handleClickScroll }) => {
  const { t } = useTranslation();
  const imagesArr = ['./images/header.jpg', './images/slider.jpg'];

  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentImgIndex === imagesArr.length - 1) {
        setCurrentImgIndex(0);
      } else {
        setCurrentImgIndex(currentImgIndex + 1);
      }
    }, 8000);

    return () => clearInterval(intervalId); // Clear the interval when the component unmounts
  }, [currentImgIndex]);

  const cellphoneSize = useMediaQuery({ query: '(max-width:975px)' });

  return (
    <Wrapper imagesArr={imagesArr} currentImgIndex={currentImgIndex}>
      <ShadedBackground>
        <Flex>
          <LoginBoxWrapper>
            <LoginBoxInnerWrapper>
              <LoginBox />
            </LoginBoxInnerWrapper>
          </LoginBoxWrapper>
          <FlexRow>
            <LearnMore
              tempora={true}
              href='#tempora'
              onClick={() => handleClickScroll('#tempora')}
            >
              {t('landing.learnMore')}
            </LearnMore>
            <VerticalLine></VerticalLine>
            <Sign
              src='/images/tempora-slogan-and-logo.webp'
              alt='tempora sign'
            />
          </FlexRow>
          <LogoWrapper>
            <LogoImg
              src='/images/logo-umbrella-01.webp'
              alt='logo umbrella os'
            />
          </LogoWrapper>
          <TextWrapper parag_1={true}>
            <Text>{t('landing.login.paragraph1')}</Text>
          </TextWrapper>
          <TextWrapper parag_2={true}>
            <Text>{t('landing.login.paragraph2')}</Text>
          </TextWrapper>
          <FlexCenter>
            <Img
              src='/images/umbrella-metal-logo.png'
              alt='square-metal-logo'
            />
            <Text parag_3={true}>{t('landing.login.paragraph3')}</Text>
          </FlexCenter>
          <Img
            src='/images/umbrella-metal-logo.png'
            alt='square-metal-logo'
            secondImg={true}
          />
          <TextWrapper secondText={true}>
            <Text parag_3={true}>{t('landing.login.paragraph3')}</Text>
          </TextWrapper>
          <FlexEnd>
            <LearnMore
              href='#about'
              onClick={() => handleClickScroll('#about')}
            >
              {t('landing.learnMore')}
            </LearnMore>
          </FlexEnd>
        </Flex>
      </ShadedBackground>
    </Wrapper>
  );
};

export default memo(Login);

const Wrapper = styled.div`
  width: 100%;
  height: auto;
  padding-top: 137px;
  padding-bottom: 57px;

  transition: 1s;
  ${({ imagesArr, currentImgIndex }) =>
    css`
      background-image: url(${imagesArr[currentImgIndex]});
      -webkit-background-size: cover;
      -moz-background-size: cover;
      -o-background-size: cover;
      background-size: cover;
    `}
  ${flexBoxCenter}
`;

const ShadedBackground = styled.div`
  width: 1196px;
  padding: 60px;

  height: auto;
  background: linear-gradient(
    0deg,
    rgba(19, 32, 51, 0.8) 0%,
    rgba(19, 32, 51, 0.8) 100%
  );
  background-blend-mode: color, normal;
  backdrop-filter: blur(8px);

  justify-content: space-between;
  align-items: flex-start;
  flex-direction: row;
  @media (max-width: ${breakpoints.xl}) {
    padding-top: 130px;
    padding-bottom: 57px;
    width: 100%;
    ${flexBoxCenter}
    flex-direction: column;
  }
`;

const Flex = styled.div`
  max-width: 1320px;
  height: 685px;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: ${breakpoints.xl}) {
    ${justifyContentSpaceEvenly};
    flex-direction: column;
    height: auto;
    width: 100%;
  }
`;

const LoginBoxWrapper = styled.div`
  @media (max-width: ${breakpoints.xl}) {
    order: 1;
    height: auto;
    width: 100%;
    display: flex;
    padding: 4px;
    align-items: center;
    gap: 10px;

    border-radius: 10px;
    background: rgba(19, 32, 51, 0.2);
    box-shadow: 0px 0px 2px 0px #000 inset;
  }
`;

const LoginBoxInnerWrapper = styled.div`
  @media (max-width: ${breakpoints.xl}) {
    display: flex;
    height: auto;
    width: 100%;
    padding: 45px 11px 45px 10px;
    align-items: center;
    gap: 10px;

    border-radius: 6px;
    border: 1px solid #000;
    background: linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.15) 0%,
        rgba(0, 0, 0, 0.15) 100%
      ),
      linear-gradient(
        180deg,
        rgba(35, 58, 84, 0.15) 0%,
        rgba(35, 58, 84, 0.15) 44%,
        rgba(6, 13, 25, 0.15) 100%
      );
    box-shadow: 1px 1px 1px 0px rgba(255, 255, 255, 0.25) inset,
      0px 0px 4px 0px #000;
  }
`;

const LogoWrapper = styled.div`
  width: auto;
  height: 39px;
  margin-bottom: 40px;

  @media (max-width: ${breakpoints.xl}) {
    width: 86%;
    height: auto;
    margin-top: 40px;
    order: 2;
  }
`;

const LogoImg = styled.img`
  width: auto;
  height: 100%;

  @media (max-width: ${breakpoints.xl}) {
    width: 100%;
    order: 2;
  }
`;

const TextWrapper = styled.div`
  width: 60%;
  ${flexBoxCenter}
  @media (max-width: ${breakpoints.xl}) {
    ${flexBoxCenter}
    width: 90%;
    padding: none;
    ${({ parag_1, parag_2 }) =>
      parag_1
        ? css`
            order: 4;
          `
        : parag_2
        ? css`
            order: 5;
          `
        : css`
            order: 6;
          `}
  }
  @media ${devices.xl} {
    ${({ secondText }) =>
      secondText &&
      css`
        display: none;
      `}
  }
`;

const Text = styled.p`
  height: fit-content;
  margin-bottom: 20px;
  text-align: justify;

  color: #e4e4e4;
  text-align: justify;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 1.4;
  text-transform: capitalize;

  width: 50%;
  ${({ parag_3 }) =>
    parag_3
      ? css`
          width: 70%;
        `
      : css`
          width: 80%;
        `}

  @media (max-width: ${breakpoints.xl}) {
    width: inherit;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 1.4;
    text-align: justify;
    text-transform: capitalize;
    order: 3;
  }
`;

const FlexCenter = styled.div`
  height: 27%;
  width: 60%;
  display: flex;
  justify-content: center;
  align-items: flex-start;

  @media (max-width: ${breakpoints.xl}) {
    display: none;
    > img {
      order: 4;
    }

    > p {
      order: 7;
    }
  }
`;

const Img = styled.img`
  width: 54px;
  height: 52px;

  margin-left: -8px;
  margin-right: 8px;

  @media (max-width: ${breakpoints.xl}) {
    order: 3;
    width: 84px;
    height: 82px;
    margin-bottom: 20px;
  }
  @media ${devices.xl} {
    ${({ secondImg }) =>
      secondImg &&
      css`
        display: none;
      `}
  }
`;

const FlexEnd = styled.div`
  width: 48%;
  ${justifyContentFlexEnd}
  @media (max-width: ${breakpoints.xl}) {
    width: 75%;
    height: 50px;
    margin-bottom: 20px;
    order: 7;
  }
`;

const LearnMore = styled.a`
  width: 165px;
  height: 31px;
  font-size: 16.667px;
  font-weight: 500;
  text-decoration: none;
  text-transform: uppercase;
  font-family: 'Roboto', sans-serif;
  background-color: rgba(24, 37, 58, 0.478);

  ${({ tempora }) =>
    tempora
      ? css`
          border: 2px solid #ffff;
          color: #ffff;
          &:hover {
            border: 2px solid red;
            color: red;
          }
        `
      : css`
          border: 2px solid #82ffff;
          color: #82ffff;
          &:hover {
            border: 2px solid #ffff;
            color: #ffff;
          }
        `}

  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: ${breakpoints.xl}) {
    width: 100%;
    height: 100%;
  }
`;

const Sign = styled.img``;

const FlexRow = styled.div`
  margin-top: 26px;
  ${flexBoxCenter}

  gap: 6px;

  @media (max-width: ${breakpoints.xl}) {
    order: 8;
  }
`;

const VerticalLine = styled.div`
  border-left: 1px solid #ffff;
  height: 56px;
`;

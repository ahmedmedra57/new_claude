// libraries
import styled, { css } from 'styled-components';
import { useMediaQuery } from 'react-responsive';
import { useTranslation } from 'react-i18next';
import { alignItemsFlexStart, flexBoxCenter } from '../styles/commonStyles';
import { breakpoints } from './landing-page-breakpoints/breakpoints';

const About = () => {
  const { t } = useTranslation();

  // Unified feature data using translation keys
  const fourSquare = [
    { key: '01' },
    { key: '04' },
    { key: '02' },
    { key: 'img', img: '/images/umbrella-metal-logo.png' },
  ];

  const doubleSquare = [
    { key: '03' },
    { key: '05' },
  ];

  const singleSquare = [
    { key: '06' },
  ];

  const cellphoneFeatures = [
    { key: '01' },
    { key: '02' },
    { key: '03' },
    { key: '04' },
    { key: '05' },
    { key: '06' },
  ];

  const cellphoneSize = useMediaQuery({ query: '(max-width:975px)' });

  return (
    <>
      <Wrapper>
        <ContentWrapper firstItem={true}>
          <ImgLogo src='/images/logo-umbrella-01.webp' alt='umbrella os logo' />
          {cellphoneSize && (
            <LogoImg
              src='/images/umbrella-metal-logo.png'
              alt='square metal logo'
            />
          )}
          <>
            <Text>{t('about.paragraph1')}</Text>
            <br/>
            <br/>
            <Text>{t('about.paragraph2')}</Text>
          </>
        </ContentWrapper>
        <ContentWrapper secondItem={true}>
          <Img src='/images/base-on-water.jpg' alt='oil rig on water' />
        </ContentWrapper>
        <ContentWrapper>
          {cellphoneSize ? (
            <>
              {cellphoneFeatures.map(({ key }) => (
                <Item key={key}>
                  <NumberTitle>{key}</NumberTitle>
                  <Title>{t(`about.features.${key}.title`)}</Title>
                  <P>{t(`about.features.${key}.description`)}</P>
                </Item>
              ))}
            </>
          ) : (
            <>
              <FlexBox>
                <FourContainer>
                  {fourSquare.map(({ key, img }, idx) => (
                    <Item key={key} idx={key}>
                      {key === 'img' ? (
                        <LogoImg src={img} alt='square metal logo' />
                      ) : (
                        <>
                          <NumberTitle badge={idx === 0}>{key}</NumberTitle>
                          <Title>{t(`about.features.${key}.title`)}</Title>
                          <P>{t(`about.features.${key}.description`)}</P>
                        </>
                      )}
                    </Item>
                  ))}
                </FourContainer>
                <SingleContainer>
                  {singleSquare.map(({ key }) => (
                    <Item key={key} idx={key}>
                      <NumberTitle>{key}</NumberTitle>
                      <Title>{t(`about.features.${key}.title`)}</Title>
                      <P>{t(`about.features.${key}.description`)}</P>
                    </Item>
                  ))}
                </SingleContainer>
              </FlexBox>
              <FlexBox>
                <DoubleContainer>
                  {doubleSquare.map(({ key }) => (
                    <Item key={key} idx={key}>
                      <NumberTitle>{key}</NumberTitle>
                      <Title>{t(`about.features.${key}.title`)}</Title>
                      <P>{t(`about.features.${key}.description`)}</P>
                    </Item>
                  ))}
                </DoubleContainer>
              </FlexBox>
            </>
          )}
        </ContentWrapper>
      </Wrapper>
    </>
  );
};

export default About;

const Wrapper = styled.div`
  height: auto;
  width: 100%;
  padding: 128px 0px;
  ${flexBoxCenter}
  flex-direction: column;
  gap: 48px;

  /* @media (max-width: ${breakpoints.xl}) {
    background: var(
      --gradient-blue,
      linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
      linear-gradient(180deg, #233a54 0%, #233a54 44%, #060d19 100%)
    );
  } */
`;

const ContentWrapper = styled.section`
  width: 1196px;
  ${({ firstItem, secondItem }) =>
    firstItem
      ? css`
          height: 340px;
          padding: 36px 68px 70px 68px;
          ${flexBoxCenter}
          flex-direction: column;
          gap: 12px;

          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);

          @media (max-width: ${breakpoints.xl}) {
            width: 80%;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.05);
            gap: 24px;
            padding: 24px;
          }
        `
      : secondItem
      ? css`
          height: 497px;
          @media (max-width: ${breakpoints.xl}) {
            width: 89%;
          }
        `
      : css`
          height: 1024px;
          ${flexBoxCenter}
          gap: 30px;

          @media (max-width: ${breakpoints.xl}) {
            width: 89%;
            flex-direction: column;
            gap: 30px;
          }
        `}
  ${flexBoxCenter}

  @media (max-width: ${breakpoints.xl}) {
    height: auto;
  }
`;

const FlexBox = styled.div`
  height: inherit;
  width: inherit;
  ${flexBoxCenter}
  flex-direction: column;
  gap: 30px;
`;

const FourContainer = styled.div`
  width: 788px;
  height: 727px;
  ${flexBoxCenter}
  flex-direction: column;
  flex-wrap: wrap;
  gap: 30px;
`;

const SingleContainer = styled.div`
  height: 322px;
  width: 788px;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
`;

const DoubleContainer = styled.div`
  width: 380px;
  height: 1110px;

  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  gap: 30px;
`;

const Item = styled.div`
  width: 380px;
  height: 340px;

  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: column;
  gap: 12px;

  text-transform: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);

  ${({ idx }) =>
    idx === '01' || idx === '02' || idx === '04'
      ? css`
          padding: 36px 24px 72px 24px;
        `
      : idx === 'img'
      ? css`
          background: inherit;
          ${flexBoxCenter}
        `
      : idx === '05'
      ? css`
          height: 552px;
          padding: 62px 24px;
          justify-content: flex-start;
          gap: 17px;
        `
      : idx === '03'
      ? css`
          height: 480px;
          padding: 62px 24px;
          justify-content: flex-start;
          gap: 17px;
        `
      : css`
          width: 788px;
          padding: 62px 24px;
          gap: 17px;
        `}

  @media (max-width: ${breakpoints.xl}) {
    height: auto;
    width: 100%;
    padding: 36px 24px;
    ${flexBoxCenter}
    flex-direction: column;
    gap: 17px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.05);
  }
`;

const NumberTitle = styled.p`
  height: 61px;
  color: #fff;
  font-family: Inter;
  font-size: 72px;
  font-style: normal;
  font-weight: 700;
  line-height: 27px;
  ${flexBoxCenter}
`;

const ImgLogo = styled.img`
  width: 412px;
  height: 47px;
  padding: 0.008px 0.026px 0.025px 0px;
  ${flexBoxCenter}

  @media (max-width: ${breakpoints.xl}) {
    width: 210px;
    height: 26px;
  }
`;

const Img = styled.img`
  width: inherit;
  height: inherit;

  border-radius: 12px;
  background: url(<path-to-image>) lightgray 50% / cover no-repeat;
`;

const LogoImg = styled.img`
  width: 201px;
  height: 197px;

  @media (max-width: ${breakpoints.xl}) {
    width: 163px;
    height: 160px;
  }
`;

const Logo = styled.img`
  width: 360px;
  height: 43px;

  position: absolute;
  top: 10px;
  right: 80px;
`;

const Logo2 = styled.img`
  width: 90%;
  margin-bottom: 42px;
`;

const Section = styled.section`
  height: 80%;
  width: 100%;
  padding: 3% 0;
  background-color: rgba(0, 3, 8, 0.6);
  ${flexBoxCenter}
  gap: 30px;

  @media (max-width: ${breakpoints.xl}) {
    flex-direction: column;
  }
`;

const LeftSection = styled.div`
  width: 46%;

  ${alignItemsFlexStart}
  flex-direction: column;

  @media (max-width: ${breakpoints.xl}) {
    width: 85%;
  }
`;

const RightSection = styled.div`
  width: 46%;

  @media (max-width: ${breakpoints.xl}) {
    width: 85%;
  }
`;

const RightSideText = styled.div`
  height: 100%;
  width: 100%;
  margin-bottom: 4%;
`;

const Title = styled.h3`
  color: #fff;
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;

  /* font-size: 18px;
  color: #ffff;
  margin-bottom: 2px;
  text-transform: capitalize;
  font-family: 'Roboto', sans-serif; */
`;

const Text = styled.p`
  width: 1050px;
  color: #fff;
  text-align: justify;
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  text-transform: none;
  line-height: 24px;
  @media (max-width: ${breakpoints.xl}) {
    width: 80%;
  }
`;

const P = styled.p`
  color: rgba(255, 255, 255, 0.6);
  text-align: justify;
  font-family: Inter;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0.4px;
`;

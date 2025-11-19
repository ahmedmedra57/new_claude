import styled, { css } from 'styled-components';
import { alignItemsFlexEnd, flexBoxCenter } from '../styles/commonStyles';
import { breakpoints } from './landing-page-breakpoints/breakpoints';

const AboutUs = ({ isEnglish }) => {
  const englishContent = {
    title: 'Contact us!',
    subTitle: 'Thank you for your interest in Our Company',
    text: 'We would love to hear from you and discuss how we can help bring your ideas to life. Here are the different ways you can get in touch with us.',
  };

  const frenchContent = {
    title: 'Contactez-nous!',
    subTitle: 'Merci de votre intérêt pour notre entreprise',
    text: 'Nous serions ravis de votre entendre et de discuter de la manière dont nous pouvons vous aider à concrétiser vos idèes. Voici les diffèrentes façons de nous contacter.',
  };

  const content = isEnglish ? englishContent : frenchContent;

  return (
    <FullPageImg>
      <LayoutWrapper>
        <Title>{content.title}</Title>
        <LogoWrapper bigLogo={true}>
          <LogoImg
            src='/images/umbrella-logo-header.svg'
            // src='/images/umbrellalogometal-4-x-1.png'
            alt='metal logo'
            bigLogo={true}
          />
          <LogoImg
            src='/images/contactus-umbrella-white-lightblue.png'
            alt='umbrella logo'
            umbrellaLogo={true}
          />
        </LogoWrapper>
        <SubTitle>{content.subTitle}</SubTitle>
        <TextWrapper>
          <Text>{content.text}</Text>
        </TextWrapper>
        <FlexRow>
          <InfoWrapper>
            <LogoWrapper umbrella={true}>
              <LogoImg
                src='/images/contactus-umbrella-white.png'
                alt='umbrella logo'
              />
            </LogoWrapper>
            <P>2501 Avenue Dollard</P>
            <P>Lasalle, Quebec</P>
            <P>H8N 1S2</P>
          </InfoWrapper>
          <InfoWrapper>
            <LogoWrapper>
              <LogoImg
                src='/images/contactus-tempora-logo.svg'
                alt='tempora logo'
              />
            </LogoWrapper>

            <P>795 George V. Avenue</P>
            <P>Lachine, Quebe</P>
            <P>H8S 1L2</P>
          </InfoWrapper>
        </FlexRow>
        <CompanyInfo>
          <P>Tel: 514 933 - 1649</P>
          <P>Toll free: 877 933 - 1649</P>
          <P>Fax: 514 933 - 2245</P>
          <P>Email: sales@temporaheaters.com</P>
        </CompanyInfo>
      </LayoutWrapper>
    </FullPageImg>
  );
};

export default AboutUs;

const FullPageImg = styled.section`
  width: 100%;
  height: 1800px;
  background-image: url('/images/contact-us-background.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  ${flexBoxCenter}

  @media (max-width: ${breakpoints.xl}) {
    height: auto;
    gap: 36px;
    padding: 60px 10px;
  }
`;

const LayoutWrapper = styled.div`
  display: flex;
  padding: 60px 350px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 72px;
  align-self: stretch;

  @media (max-width: ${breakpoints.xl}) {
    width: 100%;
    height: auto;
    padding: 60px 10px;
    gap: 44px;
  }
`;

const Title = styled.p`
  text-align: center;
  font-family: Barlow;
  font-size: 38px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  text-transform: capitalize;

  @media (max-width: ${breakpoints.xl}) {
    font-size: 28px;
    width: 288px;
  }
`;

const LogoWrapper = styled.div`
  ${({ bigLogo, umbrella }) =>
    bigLogo
      ? css`
          width: 472px;
          height: 47px;

          ${alignItemsFlexEnd}
          gap:10px;
          @media (max-width: ${breakpoints.xl}) {
            width: 92px;
            height: 94px;
          }
        `
      : umbrella
      ? css`
          width: 276px;
          height: 36px;
        `
      : css`
          width: 250px;
          height: 54px;
        `}
`;

const LogoImg = styled.img`
  width: 100%;
  height: 100%;

  ${({ bigLogo }) =>
    bigLogo &&
    css`
      width: 80%;
      height: 80%;
    `}

  @media (max-width: ${breakpoints.xl}) {
    ${({ umbrellaLogo }) =>
      umbrellaLogo &&
      css`
        display: none;
      `}
  }
`;

const SubTitle = styled.p`
  text-align: center;
  font-family: Barlow;
  font-size: 38px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  text-transform: capitalize;

  @media (max-width: ${breakpoints.xl}) {
    width: 428px;
    height: 67px;
    font-size: 28px;
  }
`;

const TextWrapper = styled.div`
  width: 1040px;
  @media (max-width: ${breakpoints.xl}) {
    width: 85%;
  }
`;

const Text = styled.p`
  color: #e6e6e6;
  text-align: center;
  font-family: Barlow;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  letter-spacing: -0.108px;
  text-transform: capitalize;

  @media (max-width: ${breakpoints.xl}) {
    font-size: 22px;
  }
`;

const FlexRow = styled.div`
  ${flexBoxCenter}
  gap: 136px;

  @media (max-width: ${breakpoints.xl}) {
    flex-direction: column;
    gap: 32px;
  }
`;

const InfoWrapper = styled.div`
  height: 149px;
  width: 300px;
  ${flexBoxCenter}
  flex-direction: column;
  gap: 8px;
  align-self: stretch;
`;

const CompanyInfo = styled.div`
  height: 128px;
  width: 370px;

  ${flexBoxCenter}
  flex-direction: column;
  gap: 8px;
`;

const P = styled.p`
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 26px;
  text-transform: capitalize;
`;

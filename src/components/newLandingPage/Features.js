import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { devices, breakpoints } from './landing-page-breakpoints/breakpoints';

const Features = () => {
  const { t } = useTranslation();

  const features = [
    {
      img: '/images/umbrella-metal-logo.png',
      titleKey: 'features.platform.title',
      textKey: 'features.platform.description',
    },
    {
      img: '/images/brain.png',
      titleKey: 'features.smartControls.title',
      textKey: 'features.smartControls.description',
    },
    {
      img: '/images/monitoring.png',
      titleKey: 'features.monitoring.title',
      textKey: 'features.monitoring.description',
    },
    {
      img: '/images/data-logging.png',
      titleKey: 'features.dataLogging.title',
      textKey: 'features.dataLogging.description',
    },
  ];

  return (
    <Wrapper>
      <IndentWrapper>
        <SmallWrapper>
          {features.map(({ img, titleKey, textKey }) => (
            <IndivWrapper key={titleKey}>
              <Div>
                <Img src={img} alt={t(titleKey)} />
                <Title>{t(titleKey)}</Title>
                <Text>{t(textKey)}</Text>
              </Div>
            </IndivWrapper>
          ))}
        </SmallWrapper>
      </IndentWrapper>
    </Wrapper>
  );
};

export default Features;

const Wrapper = styled.div`
  /* height: 494px; */
  height: auto;
  width: auto;

  border-top: 1px solid #3b506c;
  padding: 16px;

  background: linear-gradient(180deg, #1e2f49 0%, #131e2f 80%);

  @media (max-width: ${breakpoints.xl}) {
    height: 866px;
  }
  @media (max-width: 686px) {
    height: fit-content;
  }
  @media (max-width: ${breakpoints.mm}) {
    margin-right: 0;
  }
`;

const IndentWrapper = styled.div`
  height: auto;
  width: auto;
  background: #18253a;
  border-radius: 20px;
  box-shadow: inset 0px 0px 4px black;
  padding: 16px;
  border-bottom: 1px solid #253448;
  @media (max-width: 686px) {
    height: fit-content;
  }
`;

const SmallWrapper = styled.div`
  background: linear-gradient(180deg, #1f304b, #111a29);
  height: 92%;
  width: 100%;
  border-radius: 5px;
  box-shadow: 0px 0px 4px black;
  border-top: 1px solid #40536e;
  padding: 35px 0;
  /* padding-top: 35px; */

  display: flex;

  @media (max-width: ${breakpoints.xl}) {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    height: 95.5%;
  }
  @media (max-width: 686px) {
    height: fit-content;
  }
`;

const IndivWrapper = styled.div`
  flex: 0 0 auto;
  width: 25%;
  @media (max-width: ${breakpoints.xl}) {
    width: 45%;
  }
  @media (max-width: 686px) {
    width: 86%;
  }
`;

const Div = styled.div`
  max-width: 160px;
  max-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffff;
  flex-direction: column;
  text-align: center;
  margin: auto;
`;

const Img = styled.img`
  margin-bottom: 33px;
  height: 108px;
`;

const Title = styled.h3`
  position: relative;
  height: 48px;
  font-size: 16.667px;
  line-height: 1.2;
  margin-bottom: 25px;
  font-weight: bold;
  text-transform: uppercase;
  white-space: pre-line;

  &::after {
    content: '';
    position: absolute;
    width: 64px;
    height: 2px;
    background-color: #ffff;
    opacity: 50%;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const Text = styled.p`
  font-size: 13px;
  white-space: pre-line;
  text-align: center;
  font-family: 'Roboto';
  text-transform: capitalize;
  line-height: 1.385;
`;

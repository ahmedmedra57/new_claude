import styled from 'styled-components';
import { flexBoxCenter } from '../../styles/commonStyles';

const StaticFormat = ({ isEnglish, imgs }) => {
  const imgContent = {
    ess: [
      {
        key: 'img_01',
        picture: '/images/tempora-snow-track-large-img.png',
        alt: 'train track with snow',
      },
      {
        key: 'img_02',
        picture: '/images/tempora-ess-system-install-train-track.png',
        alt: 'heating system train track',
      },
      {
        key: 'img_03',
        picture: '/images/tempora-train-track.png',
        alt: 'train track',
      },
    ],
    tgs: [
      {
        key: 'img_04',
        picture: '/images/tempora-tgs-system.png',
        alt: 'tgs heating system',
      },
      {
        key: 'img_05',
        picture: '/images/tempora-tgs-heating-system-connections.png',
        alt: 'tgs system and heating pipes connections',
      },
      {
        key: 'img_06',
        picture: '/images/tempora-tgs-complete-system.png',
        alt: 'tgs complete system',
      },
    ],
    hps: [
      {
        key: 'img_07',
        picture: '/images/tempora-train-track-platform-snow.png',
        alt: 'train station and train track cover in snow',
      },
      {
        key: 'img_08',
        picture: '/images/tempora-wet-platform.png',
        alt: 'train station wet platform',
      },
      {
        key: 'img_09',
        picture: '/images/tempora-train-station-platform.png',
        alt: 'train station platform',
      },
    ],
  };

  const englishContent = [
    {
      system: 'ess',
      title: 'electric track heating systems',
      text: 'Made of high density ceramic insulators and compacted using high purity MgO for vibration protection and exceptional dielectric strength ensuring the reliability needed in the harshest conditions by its most comprehensive energy efficient thermal transfer ratio HEATER to RAIL due by its excellent contact along its entire length of the rail.',
      pictures: imgContent.ess,
    },
    {
      system: 'tgs',
      title: 'typhoon gas switch heating systems',
      text: 'The TYPHOON is a self-contained NFPA86 approved fuel train Gas Powered (NG -PG) hot air switch blower system that efficiently regulates its consumption based on track conditions & requirements remotely in real time, & integrated Video Monitoring Camera Powered by the UMBRELLA OS platform.',
      pictures: imgContent.tgs,
    },
    {
      system: 'hps',
      title: 'platform & surface heating technology ',
      text: 'This innovative technology is an all-natural and environmentally friendly approach to platform and surface thermal winter protection offsetting millions of dollars in maintenance costs, and extending the life cycle of assets through structural integrity and conforming to all transportation and ADA requirements and standards and providing the resiliency, safety and reliability needed to meet any winter condition with confidence.',
      pictures: imgContent.hps,
    },
  ];

  const frenchContent = [
    {
      system: 'ess',
      title: 'systèmes de chauffage électrique pour voies ferrées',
      text: 'Faits d`isolants céramique haute densité et compactès a l`aide de MgO haute pureté pour une protection contre les vibrations et une résistance diélectrique exceptionnelle, ils assurent  la fiabilité nècessaire dans les conditions les plus difficiles grâce a leur rapport de transfert thermique le plus complet et le plus efficace possible entre le CHAUFFEUR et le RAIL, en raison de leur exccellent contact sur toute la longueur du travail.',
      pictures: imgContent.ess,
    },
    {
      system: 'tgs',
      title: 'SYSTÈMES DE CHAUFFAGE TYPHOON AU GAS',
      text: "Le TYPHOON est un système autonome de soufflerie d'aiguillage à air chaud alimenté au gaz, approuvé par la norme NFPA86. (NG -PG) qui régule efficacement sa consommation en fonction de l'état de la voie et des besoins, à distance et en temps réel, ainsi qu'une caméra de surveillance vidéo intégrée fonctionnant sur la plateforme UMBRELLA OS.",
      pictures: imgContent.tgs,
    },
    {
      system: 'hps',
      title: 'SYSTÈMES CHAUFFAGE POUR PLATE-FORME',
      text: "Cette technologie innovante est une approche entièrement naturelle et écologique de la protection thermique hivernale des plateformes et des surfaces. protection thermique hivernale des plates-formes et des surfaces, ce qui permet de compenser des millions de dollars en coûts de maintenance et d'allonger le cycle de vie des actifs grâce à une protection structurelle. prolongeant le cycle de vie des actifs grâce à l'intégrité structurelle et en se conformant à toutes les exigences et normes de transport et de l'ADA et en fournissant la résilience, la sécurité et la fiabilité nécessaires pour faire face à toutes les conditions hivernales en toute confiance.",
      pictures: imgContent.hps,
    },
  ];

  const content = isEnglish ? englishContent : frenchContent;

  return (
    <Wrapper>
      {content.map(({ system, title, text, pictures }) => (
        <>
          <ContentWrapper key={system}>
            <Title>{system}</Title>
            <SubTitle>{title}</SubTitle>
            <Text>{text}</Text>
            <UmbrellaLogo
              src='/images/VERTICAL_LOGO.webp'
              alt='umbrella os logo'
            ></UmbrellaLogo>
          </ContentWrapper>
          <FlexWrapper>
            {pictures.map(({ key, picture, alt }) => (
              <ImgWrapper key={key}>
                <Img src={picture} alt={alt} />
              </ImgWrapper>
            ))}
          </FlexWrapper>
        </>
      ))}
    </Wrapper>
  );
};

export default StaticFormat;

const Wrapper = styled.div`
  width: 98%;
  height: auto;
  ${flexBoxCenter}
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  width: 100%;
  height: auto;
  padding: 44px;

  ${flexBoxCenter}
  flex-direction: column;
  gap: 26px;

  border: 1px solid #f00;
  background: #000;
  box-shadow: 12px 12px 12px 0px rgba(0, 0, 0, 0.25);
`;

const Title = styled.h1`
  text-align: center;
  font-family: Orbitron;
  font-size: 56px;
  font-style: normal;
  font-weight: 800;
  line-height: 56px;
`;

const SubTitle = styled.h2`
  text-align: center;
  font-family: Inter;
  font-size: 26px;
  font-style: normal;
  font-weight: 800;
  line-height: 26px;
`;

const Text = styled.p`
  text-align: justify;
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 18px;
`;

const UmbrellaLogo = styled.img`
  height: 210px;
  /* height: 240px; */

  transform: rotate(90deg);
`;

const FlexWrapper = styled.div`
  height: auto;
  width: 100%;
  padding: 30px 0;
  ${flexBoxCenter}
  flex-direction: column;
  gap: 30px;
`;

const ImgWrapper = styled.div`
  height: 150px;
  width: inherit;
`;

const Img = styled.img`
  height: inherit;
  width: inherit;
  object-fit: contain;
`;

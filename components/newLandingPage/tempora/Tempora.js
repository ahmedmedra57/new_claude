import styled, { css } from 'styled-components';

import { useState } from 'react';
import { breakpoints, devices } from '../landing-page-breakpoints/breakpoints';
import { useMediaQuery } from 'react-responsive';
import {
  alignItemsFlexEnd,
  alignItemsFlexStart,
  flexBoxCenter,
  justifyContentFlexEnd,
  justifyContentSpaceAround,
  justifyContentSpaceBetween,
  justifyContentSpaceEvenly,
} from '../../styles/commonStyles';
import DisplayFormat from './DisplayFormat';
import SwapPicturesFormat from './SwapPicturesFormat';
import { useEffect } from 'react';
import StaticFormat from './StaticFormat';

const Tempora = ({ isEnglish }) => {
  const cellphoneSize = useMediaQuery({ query: '(max-width:975px)' });

  const systemImg = {
    ess: [
      {
        key: 'img_01',
        picture: '/images/landing-page-snow-track.png',
        alt: 'train track with snow',
      },
      {
        key: 'img_02',
        picture: '/images/landing-page-heating-system.png',
        alt: 'heating system',
      },
      {
        key: 'img_03',
        picture: '/images/landing-page-train-track.png',
        alt: 'train track',
      },
    ],
    tgs: [
      {
        key: 'img_04',
        picture: '/images/landing-page-heating-connection.png',
        alt: 'heating connection on train track ',
      },
      {
        key: 'img_05',
        picture: '/images/landing-page-tgs-train-track.png',
        alt: 'tgs and train track ',
      },
      {
        key: 'img_06',
        picture: '/images/landing-page-heating-pipe.png',
        alt: 'heating pipes attached to train track ',
      },
    ],
    hps: [
      {
        key: 'img_07',
        picture: '/images/landing-page-snow-platform.png',
        alt: 'platform covered in snow',
      },
      {
        key: 'img_08',
        picture: '/images/landing-page-wet-platform.png',
        alt: 'wet platform',
      },
      {
        key: 'img_09',
        picture: '/images/landing-page-yellow-sign.png',
        alt: 'platform yellow sign',
      },
    ],
  };

  const selectionImg = {
    bigImg: {
      ess: [
        {
          key: 'img_01',
          picture: '/images/tempora-snow-track-large-img.png',
          alt: 'train track with snow',
        },
        // {
        //   key: 'img_02',
        //   picture: '/images/tempora-ess-box-large-img.png',
        //   alt: 'ess heating system',
        // },
        // {
        //   key: 'img_03',
        //   picture: '/images/tempora-person-fixing-heating-system.png',
        //   alt: 'a person fixing heating system',
        // },
        {
          key: 'img_04',
          picture: '/images/tempora-open-box-system.png',
          alt: 'open box heating system',
        },
        {
          key: 'img_05',
          picture: '/images/tempora-ess-system-train-track.png',
          alt: 'heating installed on train track',
        },
        {
          key: 'img_06',
          picture: '/images/tempora-train-track.png',
          alt: 'train track',
        },
        {
          key: 'img_07',
          picture: '/images/tempora-ess-system-install-train-track.png',
          alt: 'heating system train track',
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
          picture: '/images/tempora-tgs-heating-pipes.png',
          alt: 'tgs heating pipes between train tracks',
        },
        {
          key: 'img_06',
          picture: '/images/tempora-tgs-closer-look-heating-pipes.png',
          alt: 'closer look at tgs heating pipes between train tracks',
        },
        {
          key: 'img_10',
          picture: '/images/tempora-tgs-heating-system-connections.png',
          alt: 'tgs system and heating pipes connections',
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
          picture: '/images/tempora-station-stairs.png',
          alt: 'stairs clear of snow',
        },
        {
          key: 'img_09',
          picture: '/images/tempora-train-station-platform.png',
          alt: 'train station platform',
        },
        {
          key: 'img_11',
          picture: '/images/tempora-dry-platform.png',
          alt: 'train station dry platform',
        },
        {
          key: 'img_12',
          picture: '/images/tempora-wet-platform.png',
          alt: 'train station wet platform',
        },
      ],
    },
    smallImg: {
      ess: [
        {
          key: 'smallImg_01',
          picture: '/images/tempora-open-ess-system.png',
          alt: 'open heating system',
        },
        {
          key: 'smallImg_02',
          picture: '/images/tempora-snow-train-track-small-img.png',
          alt: 'snow train track',
        },
        {
          key: 'smallImg_03',
          picture: '/images/tempora-heating-element-on-track.png',
          alt: 'heating element attached to train track',
        },
        {
          key: 'smallImg_04',
          picture: '/images/tempora-train-track-small-img.png      ',
          alt: 'train track',
        },
      ],
      tgs: [
        {
          key: 'smallImg_05',
          picture: '/images/tempora-top-look-heating-pipes.png',
          alt: 'top look at heating pipes',
        },
        {
          key: 'smallImg_06',
          picture: '/images/tempora-tgs-side-look-pipes.png',
          alt: 'side look at heating pipes',
        },
        {
          key: 'smallImg_07',
          picture: '/images/tempora-tgs-system-with-pipes.png',
          alt: 'tgs system with heating pipes',
        },
        {
          key: 'smallImg_08',
          picture: '/images/tempora-far-look-pipes.png',
          alt: 'far look at tgs heating pipes',
        },
      ],
      hps: [
        {
          key: 'smallImg_09',
          picture: '/images/tempora-train-nightview-station-platform.png',
          alt: 'night view of train station platform',
        },
        {
          key: 'smallImg_10',
          picture: '/images/tempora-staircase-small-img.png',
          alt: 'staircase',
        },
        {
          key: 'smallImg_11',
          picture: '/images/tempora-train-station-wet-platform.png',
          alt: 'train station wet platform',
        },
        {
          key: 'smallImg_12',
          picture: '/images/tempora-yellow-warning-platform.png',
          alt: 'train station yellow warning platform',
        },
      ],
    },
  };

  const englishContent = [
    {
      system: 'ess',
      title: 'electric track heating systems',
      text: 'Made of high density ceramic insulators and compacted using high purity MgO for vibration protection and exceptional dielectric strength ensuring the reliability needed in the harshest conditions by its most comprehensive energy efficient thermal transfer ratio HEATER to RAIL due by its excellent contact along its entire length of the rail.',
      img: systemImg.ess,
      bigImg: selectionImg.bigImg.ess,
      smallImg: selectionImg.smallImg.ess,
    },
    {
      system: 'tgs',
      title: 'typhoon gas switch heating systems',
      text: 'The TYPHOON is a self-contained NFPA86 approved fuel train Gas Powered (NG -PG) hot air switch blower system that efficiently regulates its consumption based on track conditions & requirements remotely in real time, & integrated Video Monitoring Camera Powered by the UMBRELLA OS platform.',
      img: systemImg.tgs,
      bigImg: selectionImg.bigImg.tgs,
      smallImg: selectionImg.smallImg.tgs,
    },
    {
      system: 'hps',
      title: 'platform & surface heating technology ',
      text: 'This innovative technology is an all-natural and environmentally friendly approach to platform and surface thermal winter protection offsetting millions of dollars in maintenance costs, and extending the life cycle of assets through structural integrity and conforming to all transportation and ADA requirements and standards and providing the resiliency, safety and reliability needed to meet any winter condition with confidence.',
      img: systemImg.hps,
      bigImg: selectionImg.bigImg.hps,
      smallImg: selectionImg.smallImg.hps,
    },
  ];

  const frenchContent = [
    {
      system: 'ess',
      title: 'systèmes de chauffage électrique pour voies ferrées',
      text: 'Faits d`isolants céramique haute densité et compactès a l`aide de MgO haute pureté pour une protection contre les vibrations et une résistance diélectrique exceptionnelle, ils assurent  la fiabilité nècessaire dans les conditions les plus difficiles grâce a leur rapport de transfert thermique le plus complet et le plus efficace possible entre le CHAUFFEUR et le RAIL, en raison de leur exccellent contact sur toute la longueur du travail.',
      img: systemImg.ess,
      bigImg: selectionImg.bigImg.ess,
      smallImg: selectionImg.smallImg.ess,
    },
    {
      system: 'tgs',
      title: 'SYSTÈMES DE CHAUFFAGE TYPHOON AU GAS',
      text: "Le TYPHOON est un système autonome de soufflerie d'aiguillage à air chaud alimenté au gaz, approuvé par la norme NFPA86. (NG -PG) qui régule efficacement sa consommation en fonction de l'état de la voie et des besoins, à distance et en temps réel, ainsi qu'une caméra de surveillance vidéo intégrée fonctionnant sur la plateforme UMBRELLA OS.",
      img: systemImg.tgs,
      bigImg: selectionImg.bigImg.tgs,
      smallImg: selectionImg.smallImg.tgs,
    },
    {
      system: 'hps',
      title: 'SYSTÈMES CHAUFFAGE POUR PLATE-FORME',
      text: "Cette technologie innovante est une approche entièrement naturelle et écologique de la protection thermique hivernale des plateformes et des surfaces. protection thermique hivernale des plates-formes et des surfaces, ce qui permet de compenser des millions de dollars en coûts de maintenance et d'allonger le cycle de vie des actifs grâce à une protection structurelle. prolongeant le cycle de vie des actifs grâce à l'intégrité structurelle et en se conformant à toutes les exigences et normes de transport et de l'ADA et en fournissant la résilience, la sécurité et la fiabilité nécessaires pour faire face à toutes les conditions hivernales en toute confiance.",
      img: systemImg.hps,
      bigImg: selectionImg.bigImg.hps,
      smallImg: selectionImg.smallImg.hps,
    },
  ];
  const footerContent = isEnglish
    ? 'ensuring the security and livehood of the rail industry in the harshest of conditions'
    : 'assurer la sécurité et la survie du secteur ferroviaire dans les conditions les plus difficiles.';

  const dataContent = isEnglish ? englishContent : frenchContent;

  const englishSubtitle = 'track transit & freight heating systems';

  const frenchSubtitle = 'système de chauffage du transit et du fret';

  const displaySubtitle = isEnglish ? englishSubtitle : frenchSubtitle;

  const [selectedContents, setSelectedContents] = useState(true);

  const [data, setData] = useState([]);
  // const [testData, setTestData] = useState(
  //   displayContent.map(
  //     (el) => (el = { ...el, img: [...selectionImg[el.system]] })
  //   )
  // );

  // useEffect(() => {
  //   handleChangeContent(true);
  // }, []);

  // const handleChangeContent = (display) => {
  //   const formattedData = displayContent.map((el) => {
  //     if (display) {
  //       el = { ...el, img: [...systemImg[el.system]] };
  //     } else {
  //       el = {
  //         ...el,
  //         bigImg: [...selectionNewImg.bigImg[el.system]],
  //         smallImg: [...selectionNewImg.smallImg[el.system]],
  //       };
  //       // el = { ...el, img: [...selectionImg[el.system]], smallImg: [...selectionImg.smallImg[el.system]] };
  //     }
  //     return el;
  //   });
  //   setData(formattedData);
  // };

  const handleChangeDisplay = () => {
    // let selectContent = selectedContents;
    setSelectedContents((prev) => !prev);
    // handleChangeContent(!selectContent);
  };

  return (
    <Wrapper>
      {cellphoneSize || (
        <>
          <ClickDiv onClick={handleChangeDisplay}></ClickDiv>
          <ClickDiv onClick={handleChangeDisplay} isRightSide={true}></ClickDiv>
        </>
      )}
      <TitleWrapper>
        <TitleImg src='/images/tempora.webp' alt='tempora logo' />
        <SubTitle>{displaySubtitle}</SubTitle>
      </TitleWrapper>
      {cellphoneSize ? (
        <StaticFormat isEnglish={isEnglish} imgs={systemImg} />
      ) : selectedContents ? (
        <DisplayFormat
          content={dataContent}
          isEnglish={isEnglish}
          handleChangeDisplay={handleChangeDisplay}
        />
      ) : (
        <SwapPicturesFormat content={dataContent} isEnglish={isEnglish} />
      )}
      {/* {selectedContents ? (
        <DisplayFormat
          content={dataContent}
          isEnglish={isEnglish}
          handleChangeDisplay={handleChangeDisplay}
        />
      ) : (
        <SwapPicturesFormat content={dataContent} isEnglish={isEnglish} />
      )} */}
      {/* <SwapPicturesFormat content={testData} /> */}
      <Footer>{footerContent}</Footer>
    </Wrapper>
  );
};

export default Tempora;

const Wrapper = styled.section`
  height: auto;
  padding: 122px;

  background-attachment: scroll;
  background-size: 100% 230%;
  background-position: 100% 80%;
  /* background-image: url('/images/bg-tempora.png'); */
  background: linear-gradient(180deg, #000 0%, #820000 100%);
  ${justifyContentSpaceEvenly}
  flex-direction: column;
  gap: 80px;
  position: relative;

  @media (max-width: ${breakpoints.xl}) {
    width: 100%;
    padding: 40px 20px;
    background: linear-gradient(180deg, #000 0%, #400 100%);
  }
`;

const ClickDiv = styled.button`
  height: 3815px;
  width: 26%;

  position: absolute;
  top: 0;
  ${({ isRightSide }) =>
    isRightSide
      ? css`
          right: 0;
        `
      : css`
          left: 0;
        `}
`;

const TitleWrapper = styled.div`
  height: auto;
  width: 1196px;
  ${flexBoxCenter}
  flex-direction: column;
  gap: 26px;

  @media (max-width: ${breakpoints.xl}) {
    width: 80%;
  }
`;

const TitleImg = styled.img`
  width: 500px;

  @media (max-width: ${breakpoints.xl}) {
    width: 340px;
  }
`;

const SubTitle = styled.p`
  color: #fff;
  font-family: Inter;
  font-size: 36px;
  font-style: normal;
  font-weight: 800;
  line-height: 28px;
  /* text-transform: uppercase; */

  @media (max-width: ${breakpoints.xl}) {
    font-size: 23px;
    font-weight: 500;
    line-height: 23px;
    text-align: center;
  }
`;

const Footer = styled.p`
  display: flex;
  width: 1196px;
  height: 25px;
  flex-direction: column;
  justify-content: center;

  color: #fff;
  text-align: center;
  font-family: Inter;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 28px;

  @media (max-width: ${breakpoints.xl}) {
    width: 100%;
    text-align: center;
    font-family: Inter;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
  }
`;

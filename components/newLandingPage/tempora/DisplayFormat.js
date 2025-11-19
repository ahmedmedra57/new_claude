import styled, { css } from 'styled-components';
import {
  alignItemsFlexEnd,
  alignItemsFlexStart,
  flexBoxCenter,
  justifyContentSpaceBetween,
} from '../../styles/commonStyles';

const DisplayFormat = ({ content, isEnglish, handleChangeDisplay }) => {
  return (
    <>
      {content.map(({ system, title, text, img }) => {
        return (
          <SystemWrapper key={system} rowReverse={system === 'tgs'}>
            {img.map(({ picture, alt, key }) => (
              <ImgWrapper key={key} onClick={handleChangeDisplay}>
                <Img src={picture} alt={alt} />
              </ImgWrapper>
            ))}

            <ContentWrapper>
              <SystemTitle>{system}</SystemTitle>
              <SystemSubTitle
                ess={system === 'ess'}
                tgs={system === 'tgs'}
                isEnglish={isEnglish}
              >
                {title}
              </SystemSubTitle>
              <div>
                <FlexBox tgs={system === 'tgs'}>
                  <SystemContent>{text}</SystemContent>
                  <LogoImg
                    tgs={system === 'tgs'}
                    src='/images/VERTICAL_LOGO.webp'
                    alt='umbrella logo'
                  />
                </FlexBox>
                {system === 'tgs' && (
                  <TyphoonImg
                    src='/images/typhoon-logo.png'
                    alt='typhoon logo'
                  />
                )}
              </div>
            </ContentWrapper>
          </SystemWrapper>
        );
      })}
    </>
  );
};

export default DisplayFormat;

const SystemWrapper = styled.div`
  width: 1196px;
  height: 1024px;
  padding: 0px 48px;
  ${flexBoxCenter}
  gap: 24px;

  ${({ rowReverse }) =>
    rowReverse &&
    css`
      flex-direction: row-reverse;
    `}

  position:relative;
`;

const ImgWrapper = styled.button`
  width: 224px;
  height: 1024px;

  border: 1px solid #f00;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ContentWrapper = styled.div`
  width: 466px;
  height: 1024px;
  padding: 40px;

  border: 1px solid #f00;
  background: #000;
  box-shadow: 12px 12px 12px 0px rgba(0, 0, 0, 0.25);
  ${justifyContentSpaceBetween}
  flex-direction: column;
`;

const SystemTitle = styled.p`
  color: #fff;
  font-size: 128px;
  font-style: normal;
  font-weight: 800;
  line-height: 86px;
`;

const SystemSubTitle = styled.p`
  height: 170px;
  min-width: 850px;
  max-width: 1050px;

  color: #fff;
  font-family: Inter;
  font-size: 86px;
  font-style: normal;
  font-weight: 800;
  line-height: 86px;

  position: absolute;
  ${({ ess, tgs }) =>
    ess
      ? css`
          text-align: right;

          ${({ isEnglish }) =>
            isEnglish
              ? css`
                  left: 7%;
                  top: 58%;
                `
              : css`
                  right: 7%;
                  top: 39%;
                `}
        `
      : tgs
      ? css`
          text-align: left;

          ${({ isEnglish }) =>
            isEnglish
              ? css`
                  left: 5%;
                  top: 54%;
                `
              : css`
                  left: 7%;
                  top: 44%;
                `}
        `
      : css`
          text-align: right;

          ${({ isEnglish }) =>
            isEnglish
              ? css`
                  left: 4%;
                  top: 54%;
                `
              : css`
                  right: 7%;
                  top: 42%;
                `}
        `}
`;

const FlexBox = styled.div`
  ${alignItemsFlexStart}
  gap:20px;

  ${({ tgs }) =>
    tgs &&
    css`
      ${alignItemsFlexEnd}
      flex-direction: row-reverse;
    `}
`;

const SystemContent = styled.p`
  width: 330px;
  /* height: 170px; */

  color: #fff;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  text-transform: none;

  text-align: justify;
  text-align-last: left;
`;

const LogoImg = styled.img`
  width: 24px;
  height: 144px;

  ${({ tgs }) =>
    tgs
      ? css`
          margin-bottom: 6px;
        `
      : css`
          transform: rotate(180deg);
        `}
`;

const TyphoonImg = styled.img`
  height: 42px;
  width: 180px;
  margin-left: 42px;
  margin-top: 20px;
`;

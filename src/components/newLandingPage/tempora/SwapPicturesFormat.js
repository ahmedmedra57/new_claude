import styled, { css } from 'styled-components';
import { flexBoxCenter } from '../../styles/commonStyles';
import { useState } from 'react';

const SwapPicturesFormat = ({ content, isEnglish }) => {
  const [toggleImages, setToggleImages] = useState([0, 0, 0]);

  const handleToggleImg = (idx, num) => {
    const newData = [...toggleImages];
    newData.splice(idx, 1, Number(newData[idx]) + num);
    setToggleImages(newData);
  };

  const RedArrow = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='44'
      height='51'
      viewBox='0 0 44 51'
      fill='none'
    >
      <path
        d='M42 22.2009C44.6667 23.7405 44.6667 27.5895 42 29.1291L5.99999 49.9138C3.33333 51.4534 -2.44188e-06 49.5288 -2.30729e-06 46.4496L-4.9024e-07 4.88042C-3.55644e-07 1.80122 3.33333 -0.123274 6 1.41633L42 22.2009Z'
        fill='#FF0000'
      />
    </svg>
  );

  return (
    <>
      {content.map(({ system, title, text, bigImg, smallImg }, idx) => {
        const selectImgIdx = toggleImages[idx];
        return (
          <SystemWrapper key={system} rowReverse={system === 'tgs'}>
            <ImgWrapper>
              <ToggleButton
                left={true}
                onClick={() => handleToggleImg(idx, -1)}
                disabled={selectImgIdx === 0}
              >
                {RedArrow}
              </ToggleButton>
              <LargeImg
                src={bigImg[selectImgIdx].picture}
                alt={bigImg[selectImgIdx].alt}
              />
              <ToggleButton
                onClick={() => handleToggleImg(idx, +1)}
                disabled={selectImgIdx === Number(bigImg.length - 1)}
              >
                {RedArrow}
              </ToggleButton>
            </ImgWrapper>
            <FlexColumn>
              <GroupImgWrapper>
                {smallImg.map(({ key, picture, alt }, idx) => (
                  <IndivImgWrapper key={key} smallImgIdx={idx}>
                    <Img src={picture} alt={alt} />
                  </IndivImgWrapper>
                ))}
              </GroupImgWrapper>
              <TextWrapper reduceGap={!isEnglish && idx === 2}>
                <Title isTgs={system === 'tgs'}>{title}</Title>
                {system === 'tgs' ? (
                  <FlexRow>
                    <LogoWrapper isTgs={system === 'tgs'}>
                      <LogoImg
                        src='/images/VERTICAL_LOGO.webp'
                        alt='umbrella logo'
                        isTgs={system === 'tgs'}
                      />
                    </LogoWrapper>
                    <Text isTgs={system === 'tgs'}>{text}</Text>
                  </FlexRow>
                ) : (
                  <>
                    <Text>{text}</Text>
                    <LogoWrapper>
                      <LogoImg
                        src='/images/VERTICAL_LOGO.webp'
                        alt='umbrella logo'
                      />
                    </LogoWrapper>
                  </>
                )}
                {system === 'tgs' && (
                  <LogoWrapper>
                    <TyphoonImg
                      src='/images/typhoon-logo.png'
                      alt='typhoon logo'
                    />
                  </LogoWrapper>
                )}
              </TextWrapper>
            </FlexColumn>
          </SystemWrapper>
        );
      })}
    </>
  );
};

export default SwapPicturesFormat;

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

const ImgWrapper = styled.div`
  width: 709px;
  height: 1024px;

  border: 1px solid #f00;

  position: relative;
`;

const LargeImg = styled.img`
  width: 100%;
  height: 100%;

  object-fit: cover;
`;

const ToggleButton = styled.button`
  width: 64px;
  height: 64px;
  position: absolute;
  top: 50%;
  ${({ left }) =>
    left
      ? css`
          transform: rotate(-180deg);
          left: 0;
        `
      : css`
          right: 0;
        `}

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.3;
      cursor: not-allowed;
    `}
`;

const FlexColumn = styled.div`
  height: inherit;
  ${flexBoxCenter}
  flex-direction: column;
`;

const GroupImgWrapper = styled.div`
  width: 466px;
  height: 630px;

  ${flexBoxCenter}
  flex-direction: column;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: -28px;
`;

const IndivImgWrapper = styled.div`
  ${({ smallImgIdx }) =>
    smallImgIdx === 0
      ? css`
          width: 202px;
          height: 280px;
          /* height: 330px; */
        `
      : smallImgIdx === 1
      ? css`
          width: 202px;
          height: 230px;
          /* height: 280px; */
        `
      : css`
          width: 112px;
          height: 530px;
          /* height: 630px; */
        `}

  border: 1px solid #f00;
  overflow: hidden;
`;

const Img = styled.img`
  height: 100%;
  width: 100%;

  display: block;
  object-fit: cover;
  /* object-position: center; */
`;

const TextWrapper = styled.div`
  display: flex;
  width: 466px;
  height: 500px;
  /* height: 372px; */
  padding: 24px 48px;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 24px;
  ${({ reduceGap }) =>
    reduceGap &&
    css`
      gap: 20px;
      padding: 12px 24px;
    `}

  border: 1px solid #f00;
  background: #000;
  box-shadow: 12px 12px 12px 0px rgba(0, 0, 0, 0.25);
`;

const Title = styled.p`
  min-width: 286px;
  max-width: 416px;
  color: #fff;

  font-family: Inter;
  font-size: 24px;
  font-style: normal;
  font-weight: 800;
  line-height: 24px;
  text-align: right;

  /* ${({ isTgs }) =>
    isTgs
      ? css`
          text-align: left;
        `
      : css``} */
`;

const Text = styled.p`
  color: #fff;
  text-align: right;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-transform: none;

  ${({ isTgs }) =>
    isTgs &&
    css`
      text-align: justify;
    `}
`;

const FlexRow = styled.div`
  ${flexBoxCenter}
  gap:16px;
`;

const LogoWrapper = styled.div`
  ${({ isTgs }) =>
    isTgs
      ? css`
          height: 175px;
          width: 35px;
        `
      : css`
          height: 35px;
          width: 175px;
        `}

  ${flexBoxCenter}
`;

const LogoImg = styled.img`
  ${({ isTgs }) =>
    isTgs
      ? css`
          width: 32px;
          height: 160px;
        `
      : css`
          transform: rotate(90deg);
          width: 35px;
          height: 175px;
        `}
`;

const TyphoonImg = styled.img``;

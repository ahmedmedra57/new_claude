import React from 'react';
import styled from 'styled-components';

const SnowSensorAndWindFactor = () => {
  const logoImgSrc = ['', ''];

  return (
    <Wrapper>
      <TitleBox>
        <Title></Title>
        {logoImgSrc.map((src, srcIdx) => (
          <Logo key={srcIdx} alt='logo' src={src} />
        ))}
      </TitleBox>
      <FlexBox>
        <SnowSensorBox>
          <SnowSensorIndentLayer></SnowSensorIndentLayer>
        </SnowSensorBox>
        <WindFactorBox>
          <WindFactorIndentLayer></WindFactorIndentLayer>
        </WindFactorBox>
      </FlexBox>
      <ButtonWrapper>
        <SelectButton alt='logo' src={''} />
      </ButtonWrapper>
    </Wrapper>
  );
};

export default SnowSensorAndWindFactor;

const Wrapper = styled.div`
  padding-left: 288px;
  position: relative;
`;

const TitleBox = styled.div``;

const Title = styled.span``;

const Logo = styled.img``;

const FlexBox = styled.div``;

const SnowSensorBox = styled.div``;

const SnowSensorIndentLayer = styled.div``;

const WindFactorBox = styled.div``;

const WindFactorIndentLayer = styled.div``;

const ButtonWrapper = styled.button``;

const SelectButton = styled.img``;

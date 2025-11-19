import styled, { css } from 'styled-components';
import {
  alignItemsFlexStart,
  flexBoxCenter,
  justifyContentFlexStart,
} from '../../../styles/commonStyles';

const SubheaderBox = ({
  customCss,
  title,
  secondTitle,
  fontSize,
  flexLeft,
}) => {
  return (
    <Wrapper customCss={customCss} flexLeft={flexLeft}>
      <Text fontSize={fontSize} flexLeft={flexLeft}>
        {title}
      </Text>
      {secondTitle && <Text fontSize={fontSize}>{secondTitle}</Text>}
    </Wrapper>
  );
};

export default SubheaderBox;

const Wrapper = styled.div`
  ${({ customCss }) =>
    customCss
      ? css`
          height: ${customCss.height};
          width: ${customCss.width};
          border-radius: ${customCss.borderRadius};
          ${({ flexLeft }) =>
            flexLeft
              ? css`
                  ${justifyContentFlexStart}
                `
              : css`
                  ${flexBoxCenter}
                  flex-direction: column;
                `}
        `
      : css`
          height: 12px;
          width: 876px;
          border-radius: 14px;
          ${alignItemsFlexStart}
        `}

  background: #233A54;
  box-shadow: 0px 0px 2px 0px #000 inset;
`;

const Text = styled.p`
  ${({ fontSize }) =>
    fontSize &&
    css`
      font-size: ${fontSize};
    `}
  text-align: center;
  ${({ flexLeft }) =>
    flexLeft &&
    css`
      margin-left: 10px;
    `}
`;

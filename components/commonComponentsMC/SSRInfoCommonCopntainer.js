import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  layerA,
  flexDirectionColumn,
  justifyContentSpaceBetween,
} from '../styles/commonStyles';

const SSRInfoCommonContainer = ({ data, unit, title, disabled }) => {
  return (
    <Wrapper isCurrent={title === 'current'}>
      <Title>
        {title} {title !== 'description' && `(${unit})`}
      </Title>

      {title === 'current' ? (
        <DataWrapper>
          <Data type='current' disabled={disabled}>
            {data.t} t
          </Data>{' '}
          <Data type='current' disabled={disabled}>
            {data.a} a
          </Data>
        </DataWrapper>
      ) : title === 'description' ? (
        <Data type='description' disabled={disabled}>
          {data.a}
          <br></br>
          {data.b}
        </Data>
      ) : (
        <Data disabled={disabled}>
          {data} {unit}
        </Data>
      )}
    </Wrapper>
  );
};

export default SSRInfoCommonContainer;

const Wrapper = styled.div`
  width: 82px;
  height: 35px;
  ${flexDirectionColumn}

  ${(p) =>
    p.isCurrent &&
    css`
      margin-left: 17px;
    `}
`;
const Title = styled.span`
  font-size: 8px;
  text-align: center;
`;

const DataWrapper = styled.div`
  width: 100%;
  ${justifyContentSpaceBetween};
`;
const Data = styled.div`
  text-align: center;
  ${(p) =>
    p.type === 'current'
      ? css`
          width: 38px;
          height: 18px;
          border-radius: 12px;
          &:first-child {
            ${p.disabled
              ? css`
                  color: #808080;
                `
              : css`
                  color: #95ff45;
                `}
          }
        `
      : p.type === 'description'
      ? css`
          width: 277px;
          height: 31px;
          border-radius: 16px;
        `
      : css`
          width: 82px;
          height: 18px;
          border-radius: 12px;
        `}

  ${layerA};
  ${flexBoxCenter};
  font-size: 8px;

  ${(p) =>
    p.disabled &&
    css`
      background: #3b3b3b;
      box-shadow: inset 0px 0.5px 2px #000000;
      color: #808080;
    `}
`;

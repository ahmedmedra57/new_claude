import styled, { css } from 'styled-components';
import {
  flexDirectionColumn,
  justifyContentSpaceBetween,
} from '../styles/commonStyles';

const DisplayGraphInfoTitle = ({
  swtName,
  location,
  machine,
  graph,
  start,
  end,
}) => {
  return (
    <Wrapper>
      <SwtTitle color={swtName}>
        {swtName === 'ess'
          ? 'ess-electric switch system'
          : swtName === 'tgs'
          ? 'tgs-typhoon gas switch system'
          : 'tes-typhoon electric switch system'}
      </SwtTitle>
      <GraphType>{graph}</GraphType>
      <DateInfoWrapper>
        <Date>{start}</Date>
        <Date>{end}</Date>
      </DateInfoWrapper>
    </Wrapper>
  );
};

export default DisplayGraphInfoTitle;

const Wrapper = styled.div`
  height: 53px;
  width: 358px;

  ${flexDirectionColumn};
  padding: 6px 0;
`;
const SwtTitle = styled.span`
  font-size: 12px;
  letter-spacing: 1.2px;
  ${(p) =>
    p.color === 'tgs' &&
    css`
      color: #ff7800;
    `}

  ${(p) =>
    p.color === 'ess' &&
    css`
      color: #83ffff;
    `}

    ${(p) =>
    p.color === 'tes' &&
    css`
      color: #95ff45;
    `}
`;
const GraphType = styled.span`
  font-size: 12px;
  letter-spacing: 1.2px;
`;
const DateInfoWrapper = styled.div`
  width: 80%;
  ${justifyContentSpaceBetween};
`;
const Date = styled.span`
  font-size: 8px;
`;

import { NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  flexDirectionColumn,
  layerADark,
} from '../styles/commonStyles';

const ButtonGroup = ({
  buttonArr,
  group,
  handleOnClick,
  link,
  disabled,
  isFault,
  setOpenFaultsReport,
}) => {
  return (
    <Wrapper>
      {buttonArr.map((button, index) => {
        const isDisabled = disabled[index];

        return (
          <Button
            onMouseEnter={() => {
              if (group === 'groupD' && index === 2) {
                isFault && setOpenFaultsReport(true);
              }
            }}
            onMouseLeave={() => {
              if (group === 'groupD' && index === 2) {
                setOpenFaultsReport(false);
              }
            }}
            key={`${group}${index}`}
            onClick={() => isDisabled || handleOnClick(group, index)}
            disabled={isDisabled}
            to={isDisabled || link[index]}
          >
            <Img src={button} />
          </Button>
        );
      })}
    </Wrapper>
  );
};

export default ButtonGroup;

const Wrapper = styled.div`
  width: 52px;
  border-radius: 30px;
  ${layerADark};
  ${flexDirectionColumn};
  padding: 4px 0 4px 1px;

  margin-bottom: 2rem;
  &:last-child {
    margin-bottom: 0;
  }
`;
const Button = styled(NavLink)`
  width: 44px;
  height: 44px;
  /* border: 1px solid red; */
  ${flexBoxCenter}

  margin-bottom: 2px;

  &:last-child {
    margin-bottom: 0;
  }
  ${(p) =>
    p.disabled &&
    css`
      cursor: not-allowed;
    `}

  transition: all 100ms ease-in;
  &:hover {
    ${(p) =>
      css`
        transform: scale(102%);
        img:last-child {
          filter: invert(5%);
        }
      `}
  }
`;
const Img = styled.img`
  width: 100%;
`;

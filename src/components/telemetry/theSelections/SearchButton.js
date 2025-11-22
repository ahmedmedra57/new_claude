import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  layerA180Deg,
  layerBDark,
  layerCLi,
  layerCLighter,
  layerCLighterghter,
} from '../../styles/commonStyles';

const SearchButton = ({ title, onClick }) => {
  return (
    <ShadowButton>
      <Button onClick={() => onClick()}>
        <IndentButton>
          <ButtonTop>
            <Title>{title}</Title>
          </ButtonTop>
        </IndentButton>
      </Button>
    </ShadowButton>
  );
};

export default SearchButton;

const ShadowButton = styled.div`
  width: 84px;
  height: 36px;

  ${layerBDark}

  border-radius: 33px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Button = styled.button`
  width: 82px;
  height: 34px;

  ${layerA180Deg}

  border-radius: 34px;
  opacity: 1;
  ${flexBoxCenter}
`;

const IndentButton = styled.div`
  width: 72px;
  height: 24px;

  ${layerCLighter}

  border-radius: 33px;
  opacity: 1;
  ${flexBoxCenter}
`;

const ButtonTop = styled.div`
  width: 68px;
  height: 20px;

  ${layerA180Deg}

  border-radius: 34px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Title = styled.p`
  text-align: center;
  font-size: 10px;
  letter-spacing: 1px;
  color: #ffffff;
  opacity: 1;
`;

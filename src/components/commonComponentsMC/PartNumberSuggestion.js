import styled from 'styled-components';

import { flexBoxCenter, ItemBackground } from '../styles/commonStyles';

const PartNumberSuggestion = ({
  matchedSuggestion,
  isSelected,
  handleSelect,
  column,
  handleClose,
}) => {
  const handleOnClick = () => {
    handleSelect(column, matchedSuggestion);
    handleClose();
  };

  return (
    <Wrapper isSelected={isSelected} onClick={handleOnClick}>
      <Prediction>{matchedSuggestion}</Prediction>
    </Wrapper>
  );
};

export default PartNumberSuggestion;

const Wrapper = styled.li`
  width: 206px;
  height: 29px;

  ${ItemBackground};
  background-color: ${(p) => p.isSelected && `hsla(50deg, 100%, 80%,0.25)`};
  &:hover {
    background-color: hsla(50deg, 100%, 80%, 0.25);
  }

  ${flexBoxCenter}
  margin: 0.2rem 0;
`;
const Prediction = styled.div`
  font-size: 12px;
  letter-spacing: 1.2px;
  text-align: center;
  ${flexBoxCenter}
`;

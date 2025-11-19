import styled from 'styled-components';

const TimeOption = ({ data, setSelect, onClose, title }) => {
  const handleSelect = () => {
    setSelect(title, data);
    onClose(title);
  };
  return <Wrapper onClick={handleSelect}>{data}</Wrapper>;
};

export default TimeOption;

const Wrapper = styled.button`
  font-size: 14px;
  text-align: center;
  transition: all 200ms ease-in;
  &:hover {
    background-color: #95ff45;
    color: #1b2b44;
  }
`;

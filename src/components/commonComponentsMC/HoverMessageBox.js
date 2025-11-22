import styled from 'styled-components';
import { flexBoxCenter, layerA } from '../styles/commonStyles';

const HoverMessageBox = ({ message }) => {
  return (
    <Wrapper>
      <Message>{message}</Message>
    </Wrapper>
  );
};

export default HoverMessageBox;

const Wrapper = styled.div`
  width: fit-content;

  ${layerA};
  ${flexBoxCenter};
  padding: 0.2rem;
`;
const Message = styled.span`
  /* Layout Properties */

  width: 150px;
  text-align: center;
  /* UI Properties */
  font-size: 8px;
  color: #ffffff;
  line-height: 90%;
`;

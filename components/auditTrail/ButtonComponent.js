import styled from 'styled-components';
import { flexBoxCenter, layerA180Deg, layerB } from '../styles/commonStyles';

const ButtonComponent = ({ title, buttonHandler }) => {
  return (
    <Wrapper>
      <Button onClick={buttonHandler}>
        <Hole>
          <Top>{title}</Top>
        </Hole>
      </Button>
    </Wrapper>
  );
};
export default ButtonComponent;

const Wrapper = styled.section`
  width: 75px;
  height: 28px;
  border-radius: 18px;

  ${layerB};
  ${flexBoxCenter}
`;
const Button = styled.button`
  width: 73px;
  height: 26px;
  border-radius: 25px;
  ${layerA180Deg};
  ${flexBoxCenter};
`;
const Hole = styled.div`
  width: 65px;
  height: 18px;

  border-radius: 18px;
  ${layerB};
  ${flexBoxCenter}
`;
const Top = styled.div`
  width: 63px;
  height: 16px;
  border-radius: 25px;
  ${layerA180Deg}
  ${flexBoxCenter}

  font-size: 8px;
`;

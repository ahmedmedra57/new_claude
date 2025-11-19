import styled from 'styled-components';
import { flexBoxCenter, layerA180Deg, layerB } from '../styles/commonStyles';

const ViewPlansButton = ({ buttonHandler, title }) => {
  // const { handleViewPlans } = useContext(ReportStatusContext);

  const handleButton = () => {
    buttonHandler();
  };

  return (
    <WrapperHole onClick={handleButton}>
      <ButtonOuter>
        <ButtonInnerHole>
          <ButtonTop>
            <Title>{title}</Title>
          </ButtonTop>
        </ButtonInnerHole>
      </ButtonOuter>
    </WrapperHole>
  );
};

export default ViewPlansButton;

const WrapperHole = styled.div`
  width: 93px;
  height: 30px;
  border-radius: 27px;
  ${layerB};
  ${flexBoxCenter};
`;

const ButtonOuter = styled.button`
  width: 91px;
  height: 28px;
  border-radius: 25px;
  ${layerA180Deg};
  ${flexBoxCenter};
`;

const ButtonInnerHole = styled.div`
  width: 85px;
  height: 22px;
  border-radius: 20px;
  ${layerB};
  ${flexBoxCenter};
`;

const ButtonTop = styled.div`
  width: 83px;
  height: 20px;
  border-radius: 25px;

  ${layerA180Deg};
  ${flexBoxCenter};
`;

const Title = styled.p`
  text-align: center;
  font-size: 8px;
  letter-spacing: 0.8px;
  color: #ffffff;
`;

import styled from 'styled-components';
import Title from './title';
import ControlButton from './button/ControlButton';
import {
  flexBoxCenter,
  justifyContentSpaceEvenly,
  layerA,
  layerA270Deg,
  layerBMedium,
  layerHPB,
} from '../../../styles/commonStyles';

const HpMasterControl = () => {
  const buttonsData = [
    // {
    //   id: 'instant heat',
    //   activeImg: '',
    //   inactiveImg: '/images/hp-instantHeat-ready-button.svg',
    //   readyImg: '',
    // },
    {
      id: 'instant heat',
      activeImg: '/images/hp-instantHeat-active-button.svg',
      inactiveImg: '/images/hp-instantHeat-button.svg',
      readyImg: '/images/hp-instantHeat-ready-button.svg',
    },
    {
      id: 'snow sensor and wind factor',
      activeImg: '/images/hp-snowSensor-windFactor-active-button.svg',
      inactiveImg: '/images/hp-snowSensor-windFactor-button.svg',
      readyImg: '/images/hp-snowSensor-windFactor-ready-button.svg',
    },
    {
      id: 'heating schedule',
      activeImg: '/images/hp-heatingSchedule-active-button.svg',
      inactiveImg: '/images/hp-heatingSchedule-button.svg',
      readyImg: '/images/hp-heatingSchedule-ready-button.svg',
    },
  ];

  return (
    <Wrapper>
      <FirstLayer>
        <SecondLayer>
          <ThirdLayer>
            <Title />
            <ButtonsWrapper>
              {buttonsData.map((buttonData) => {
                return (
                  <ControlButton key={buttonData.id} buttonData={buttonData} />
                );
              })}
            </ButtonsWrapper>
          </ThirdLayer>
        </SecondLayer>
      </FirstLayer>
    </Wrapper>
  );
};

export default HpMasterControl;

const Wrapper = styled.section`
  width: 265px;
  height: 695px;

  ${layerBMedium}
  /* background: #1b2b44 0% 0% no-repeat padding-box;
  box-shadow: inset 0px 0px 3px #000000; */
  border-radius: 33px 33px 25px 25px;

  ${flexBoxCenter}
`;

const FirstLayer = styled.div`
  width: 261px;
  height: 691px;

  ${layerA270Deg}
  /* background: transparent
    linear-gradient(270deg, #060d19 0%, #233a54 50%, #060d19 100%) 0% 0%
    no-repeat padding-box;
  box-shadow: inset 1px 1px 2px #ffffff29, 0px 0px 1px #000000;
  border: 0.5px solid #000000; */
  border-radius: 32px 32px 24px 24px;

  ${flexBoxCenter}
`;

const SecondLayer = styled.div`
  width: 247px;
  height: 677px;

  ${layerBMedium}
  /* background: #1b2b44 0% 0% no-repeat padding-box;
  box-shadow: inset 0px 0px 3px #000000; */
  border-radius: 24px 24px 16px 16px;

  ${flexBoxCenter}
`;

const ThirdLayer = styled.div`
  width: 243px;
  height: 673px;

  ${layerHPB}
  /* background: #142033 0% 0% no-repeat padding-box;
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid #000000; */
  border-radius: 23px 23px 14px 14px;

  ${flexBoxCenter}
  flex-direction: column;
  gap: 2px;
`;

const ButtonsWrapper = styled.div`
  width: 234px;
  height: 596px;

  ${layerA}
  /* background: #233a54 0% 0% no-repeat padding-box;
  box-shadow: inset 0px 0px 3px #000000; */
  border-radius: 10px 12px 10px 10px;

  ${justifyContentSpaceEvenly}
  flex-direction: column;
`;

import styled, { css } from 'styled-components';
import { flexBoxCenter } from '../../styles/commonStyles';
import RSSSRInfoContainer from './RSSSRInfoContainer';

const RSSSRDetail = ({ data, id, location, machine }) => {
  const { isSettingOpen, buttonStatus } = data;
  const switchIconSrc =
    buttonStatus === 'on'
      ? '/images/ssr-switch-on.svg'
      : buttonStatus === 'off'
      ? '/images/ssr-switch-off.svg'
      : '/images/ssr-switch-flt.svg';

  return (
    <Wrapper>
      <ToggleSWitchContainer>
        <Title isFontSize={true}>ssr{id} - 20</Title>
        <SwitchButton disabled={buttonStatus === 'flt' ? true : false}>
          <SwitchImg src={switchIconSrc} />
        </SwitchButton>
      </ToggleSWitchContainer>

      <RSSSRInfoContainer
        data={data}
        id={id}
        location={location}
        machine={machine}
        isSettingOpen={isSettingOpen}
      />
    </Wrapper>
  );
};

export default RSSSRDetail;

const Wrapper = styled.div`
  width: 100%;

  display: flex;
  justify-content: flex-start;
  gap: 8rem;
  padding: 0 5px;

  margin-bottom: 5px;
  transition: all 200ms ease-in-out;

  /* For the switch name selection box*/
  position: relative;
`;

const ToggleSWitchContainer = styled.div`
  padding-top: 3px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.span`
  font-fontsize: 7px;
  color: #fcff01;

  max-width: 90px;
  /* max-height: 20px; */
  overflow: hidden;
  ${({ isFontSize }) =>
    isFontSize &&
    css`
      font-size: 10px;
    `}
`;
const SwitchButton = styled.button`
  margin-top: 4px;
  height: 20px;
  ${flexBoxCenter}
  align-items: flex-start;
  cursor: default;
`;

const SwitchImg = styled.img``;

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled, { css } from 'styled-components';

const SwitchStatusContainer = ({ swtName, location, machine }) => {
  // global
  const { essSwitch, tgsSwitch, tesSwitch,flatEssSwitch,flatTgsSwitch,flatTesSwitch } = useSelector(
    swtName === 'ess'
      ? selectEssSwitch
      : swtName === 'tgs'
      ? selectTgsSwitch
      : selectTesSwitch
  );

  const switchStatus =
    swtName === 'ess' ? flatEssSwitch : swtName === 'tgs' ? flatTgsSwitch : flatTesSwitch;

  const { isGp, isEbp, isWifi, isFaults } = switchStatus[location][machine];
  // const isGp = true;
  // const isEbp = false;
  // const isWifi = true;
  // const isFaults = false;

  const gpSrc = isGp ? `/images/gp-battery.svg` : `/images/battery-none.svg`;
  const ebpSrc = isEbp ? `/images/ebp-battery.svg` : `/images/battery-none.svg`;
  const wifiSrc = isWifi ? `/images/wifi-active.svg` : `/images/wifi-none.svg`;
  const faultSrc = isFaults
    ? `/images/fault-sm-active.svg`
    : `/images/fault-sm.svg`;

  // useEffect(() => {}, [isGp, isEbp, isWifi, isFaults]);

  return (
    <Wrapper>
      <SectionContent>
        <Title state={isGp} title='gp'>
          gp
        </Title>
        <Img src={gpSrc} />
      </SectionContent>
      <SectionContent>
        <Title state={isEbp} title='ebp'>
          ebp
        </Title>
        <Img src={ebpSrc} />
      </SectionContent>
      <SectionContent isOption={true}>
        <Img src={wifiSrc} />
      </SectionContent>
      <SectionContent isOption={true}>
        <Img src={faultSrc} />
      </SectionContent>
    </Wrapper>
  );
};

export default SwitchStatusContainer;

const Wrapper = styled.div`
  width: 185px;
  height: 28px;
  border-radius: 18px;
  background: #1b2b44;
  box-shadow: inset 0px 0px 3px #000000;

  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;
const SectionContent = styled.section`
  width: 58px;
  height: 15px;
  border-radius: 8px;

  background: #233a54;
  box-shadow: inset 0px 0px 2px #000000;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 4px;

  ${(p) =>
    p.isOption &&
    css`
      width: 27px;
      height: 15px;
      justify-content: center;
    `}
`;
const Title = styled.span`
  font-size: 11px;
  letter-spacing: 1.1px;

  ${(p) =>
    p.title === 'gp'
      ? css`
          color: #95ff45;
        `
      : css`
          color: #ff7800;
        `};

  ${(p) =>
    p.state ||
    css`
      color: #808080;
    `};
`;

const Img = styled.img`
  height: 70%;
`;

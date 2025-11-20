import { useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import { flexBoxCenter } from '../styles/commonStyles';

import SwitchNameButton from './SwitchNameButton';
import SwitchNameRadioBox from './SwitchNameRadioBox';
import { updateHeaterOfSSRService } from '../../services';
import { useEffect } from 'react';

const SwitchNameSelector = ({
  data,
  SSRSwitchName,
  setSSRSwitchName,
  ssrId,
  swtName,
  location,
  machine,
}) => {
  const { essSwitch, tesSwitch,flatEssSwitch,flatTesSwitch } = useSelector(
    swtName === 'ess' ? selectEssSwitch : selectTesSwitch
  );
  const swtStatus = swtName === 'ess' ? flatEssSwitch : flatTesSwitch;
  const switchStatus = swtStatus[location][machine];
  const { switch_panels } = switchStatus;

  const switchNameSelection = useMemo(() => {
    return switch_panels
      ?.map((panel) => {
        
        if (panel.ssr_uts.includes(ssrId)) {
          return `#${panel.switch_size} - ${panel.name}`;
        }
      })
      .filter((item) => item);
  }, [ssrId, switch_panels]);

  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (switchNameSelection.includes(`#${data.size} - ${data.name}`)) {
      setSSRSwitchName(`#${data.size} - ${data.name}`);
    }
  }, [data]);

  // Handler to change Checked state
  const handleRadioBoxSelection = (elem) => {
    setSSRSwitchName(elem);
  };

  // Display select box
  const displaySelectOptions = () => {
    setIsClicked((prev) => !prev);
  };

  // Handle select button
  const handleSelect = () => {
    setIsClicked((prev) => !prev);
    if (SSRSwitchName !== 'select switch') {
      updateHeaterOfSSRService(machine, {
        ssr_no: ssrId,
        name: SSRSwitchName?.split(' - ')[1],
        size: SSRSwitchName?.split(' - ')[0].slice(1),
        deviceType: swtName.toUpperCase(),
      });
    }
  };

  return (
    <ContentsWrapper>
      <SelectBoxWrapperHole isClicked={isClicked}>
        <SelectBoxInnerWrapper isClicked={isClicked}>
          <SelectedTitleAndArrowWrapper isClicked={isClicked}>
            <SelectedTitle>
              <Title>
                {SSRSwitchName
                  ? SSRSwitchName?.split(' - ')[1]
                  : 'select switch'}
              </Title>
            </SelectedTitle>

            <ArrowWrapper onClick={() => displaySelectOptions()}>
              <Arrow src='images/select-arrow-icon.svg' />
            </ArrowWrapper>
          </SelectedTitleAndArrowWrapper>

          {isClicked && (
            <>
              {switchNameSelection?.map((switchName) => {
                return (
                  <SelectWrapper key={switchName}>
                    <SwitchNameRadioBox
                      // id={0}
                      data={switchName}
                      checked={SSRSwitchName}
                      handleClick={handleRadioBoxSelection}
                      isSelectSwitchName={true}
                    />
                  </SelectWrapper>
                );
              })}
              <SwitchNameButton name='select' handleClick={handleSelect} />
            </>
          )}
        </SelectBoxInnerWrapper>
      </SelectBoxWrapperHole>
    </ContentsWrapper>
  );
};

export default SwitchNameSelector;

const ContentsWrapper = styled.div`
  width: 183px;
  height: auto;
`;

const SelectBoxWrapperHole = styled.div`
  width: 88px;
  height: 26px;
  background: #233a54;

  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 16px;
  opacity: 1;
  ${flexBoxCenter}
  position: relative;
`;
const SelectBoxInnerWrapper = styled.div`
  width: 86px;
  /* min-height: 22px; */
  height: 24px;

  ${(p) =>
    p.isClicked &&
    css`
      height: auto;
    `};

  background: transparent linear-gradient(180deg, #233a54 0%, #060d19 100%);
  box-shadow: inset 0px 0.5px 1px #ffffff29, 0px 0px 1px #000000;
  border: 0.5px solid #000000;
  border-radius: 14px;

  ${flexBoxCenter}
  flex-direction: column;

  position: ${(p) => (p.isClicked ? 'absolute' : 'none')};
  padding-bottom: ${(p) => (p.isClicked ? '1.5px' : '0')};
  z-index: ${(p) => (p.isClicked ? '9' : '0')};
  top: ${(p) => (p.isClicked ? '1px' : 'none')};
  left: ${(p) => (p.isClicked ? '0.5px' : 'none')};
`;

const SelectedTitleAndArrowWrapper = styled.div`
  width: 100%;
  height: 100%;
  ${flexBoxCenter}
  gap:2px;

  /* padding: 0 1.5px; */

  margin: ${(p) => (p.isClicked ? '1.5px ' : '0')};
  margin-left: ${(p) => (p.isClicked ? '3px ' : '0')};
`;

const SelectedTitle = styled.div`
  width: 64px;
  height: 20px;
  background: #233a54 0% 0% no-repeat padding-box;
  box-shadow: inset 0px 0px 2px #000000;
  border-radius: 12px;

  ${flexBoxCenter}
`;
const Title = styled.span`
  width: 90%;
  font-size: 8px;
  letter-spacing: 0.8px;
  text-align: center;
`;

const ArrowWrapper = styled.button`
  height: 16px;
  ${flexBoxCenter}
  padding-top: 1.5px;
  cursor: pointer;
`;
const Arrow = styled.img`
  width: 15px;
  height: 14px;
  /* height: 100%; */
`;

const SelectWrapper = styled.div`
  width: 80px;
  height: 18px;
  background: #233a54;
  box-shadow: inset 0px 0px 2px #000000;
  border-radius: 8px;

  ${flexBoxCenter}
  flex-direction: column;
  justify-content: space-between;

  /* space between options and button */
  margin-bottom: 1px;
  z-index: 10;
`;

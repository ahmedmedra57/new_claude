import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import DisplaySSR from '../../commonComponentsMC/DisplaySSR';
import { selectEssSwitch } from '../../store/slices/essSwitchSlice';
import { selectTesSwitch } from '../../store/slices/tesSwitchSlice';
import {
import { useESSSwitchStore, useTESSwitchStore } from '../../zustand-stores';
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  justifyContentSpaceEvenly,
  layerA90Deg,
  layerADark,
  layerB,
} from '../../styles/commonStyles';
import ExpandButton from './ExpandButton';
import RSSSRDetail from './RSSSRDetail';

const RSHeaterStatus = ({
  swtName,
  location,
  machine,
  expandBtnName,
  handleExpandButton,
  // switchIndex,
  // mainIndex,
  // systemIndex,
  machineIsEnabled,
}) => {
  // global
  const { t } = useTranslation();
  const { flatEssSwitch, flatTesSwitch } = swtName === 'ess' ? useESSSwitchStore() : useTESSwitchStore();
  const swtStatus = swtName === 'ess' ? flatEssSwitch : flatTesSwitch;

  const { ssrState, isFaults, isExpanded } =
    swtStatus && swtStatus[location][machine];

  return (
    <BaseLayer>
      <Wrapper isFaults={isFaults}>
        <SectionHeader isExpanded={isExpanded}>
          <Title>{t('reportStatus.heaterStatus')}</Title>
        </SectionHeader>
        <SectionDisplaySSR>
          <SectionSSRDisplayWrapper>
            {Object.keys(ssrState)
              .splice(0, 4)
              .map((ssr, index) => (
                <DisplaySSR
                  key={ssrState[ssr]?.No + 1 || index}
                  status={ssrState[ssr]}
                  id={ssrState[ssr]?.No + 1 || index + 1}
                />
              ))}
          </SectionSSRDisplayWrapper>
          <SectionSSRDisplayWrapper>
            {Object.keys(ssrState)
              .splice(4, 4)
              .map((ssr, index) => (
                <DisplaySSR
                  key={ssrState[ssr]?.No + 1 || index}
                  status={ssrState[ssr]}
                  id={ssrState[ssr]?.No + 1 || index + 5}
                />
              ))}
          </SectionSSRDisplayWrapper>
        </SectionDisplaySSR>

        <SectionSSRDetail>
          {Object.keys(ssrState).map((data, index) => (
            <RSSSRDetail
              data={ssrState[data]}
              key={index}
              id={index + 1}
              location={location}
              machine={machine}
            />
          ))}
        </SectionSSRDetail>
        <ButtonWrapper enable={machineIsEnabled}>
          <ExpandButton
            expandBtnName={expandBtnName}
            handleExpandButton={machineIsEnabled && handleExpandButton}
            // switchIndex={switchIndex}
            // mainIndex={mainIndex}
            // systemIndex={systemIndex}
            systemIsEnabled={machineIsEnabled}
          />
        </ButtonWrapper>
      </Wrapper>
    </BaseLayer>
  );
};

export default RSHeaterStatus;

const BaseLayer = styled.div`
  width: 1148px;
  /* width: 1158px; */
  min-height: 169px;
  padding-top: 2px;
  padding-bottom: 2px;
  margin-top: 5px;
  ${layerADark}
  /* background: #233A54 0% 0% no-repeat padding-box;
box-shadow: inset 0px 0px 6px #000000; */
border-radius: 14px 14px 26px 26px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Wrapper = styled.div`
  width: 1144px;
  /* width: 1154px; */
  height: auto;

  border-radius: 12px 12px 24px 24px;

  ${layerA90Deg};
  ${flexDirectionColumn};

  /* padding: 4px 0 10px 0; */

  ${(p) =>
    p.isFaults &&
    css`
      border: 1px solid red;
    `}
`;
const SectionHeader = styled.section`
  width: 1135px;
  /* width: 1147px; */
  height: 32px;
  margin-top: 3px;
  border-radius: 16px;

  ${layerADark}
  ${flexBoxCenter}

  margin-bottom: 10px;

  ${(p) =>
    p.isExpanded &&
    css`
      margin-bottom: 10px;
    `}
`;
const Title = styled.span`
  width: 97%;
  font-size: 14px;
  letter-spacing: 1.4px;
  border-bottom: 1px solid #fff;
`;
const SectionDisplaySSR = styled.section`
  width: 1135px;
  /* width: 1147px; */
  height: 64px;
  border-radius: 32px;
  ${layerADark};
  ${justifyContentSpaceBetween};
  gap: 26rem;
  padding: 0 30px;
`;

const SectionSSRDisplayWrapper = styled.div`
  ${justifyContentSpaceEvenly}
  gap:54rem;
`;

const SectionSSRDetail = styled.section`
  width: 1135px;
  /* width: 1150px; */

  ${flexBoxCenter}
  flex-direction: column;
`;

const ButtonWrapper = styled.div`
  margin-top: 5rem;
  width: 97px;
  height: 34px;

  ${({ enable }) =>
    enable
      ? css`
          ${layerB}
        `
      : css`
          background: #3b3b3b;
          box-shadow: inset 0px 0px 1px #000000;
        `}

  border-radius: 27px;
  ${flexBoxCenter}
`;

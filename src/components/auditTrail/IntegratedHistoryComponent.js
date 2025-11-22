import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  justifyContentSpaceBetween,
  layerA180Deg,
  layerADark,
  layerB,
} from '../styles/commonStyles';
import ActionHistoryComponent from './ActionHistoryComponent';
import ActionLoginHistory from './ActionLoginHistory';
import FaultHistoryComponent from './FaultHistoryComponent';

const IntegratedHistoryComponent = ({
  title,
  actionData,
  faultData,
  settingsData,
  settingsOptionsData,
  componentName,
  searchQuery = {},
  active,
  disableSettings,
  withExpand = true,
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const expandButtonHandler = () => {
    if (title === 'actions') {
      actionData.length >= 1 && setIsExpanded((prev) => !prev);
    } else if (title === 'faults') {
      faultData.length >= 1 && setIsExpanded((prev) => !prev);
    } else if (title === 'settings') {
      settingsData.length >= 1 && setIsExpanded((prev) => !prev);
    } else if (title === 'settingsOptions') {
      settingsOptionsData.length >= 1 && setIsExpanded((prev) => !prev);
    }
  };

  return (
    <Wrapper isExpanded={isExpanded}>
      <InvisibleWrapper>
        <SectionDisplay>
          <DisplayNumber>
            {title === 'actions'
              ? actionData?.length
              : title === 'faults'
              ? faultData?.length
              : title === 'settings'
              ? settingsData?.length
              : title === 'settingsOptions'
              ? settingsOptionsData?.length
              : ''}
          </DisplayNumber>
          <DisplayTitle>
            {title === 'actions'
              ? componentName === 'aat'
                ? t('auditTrail.additionalActions')
                : t('auditTrail.actionsHistory')
              : title === 'faults'
              ? t('auditTrail.faultsHistory')
              : title === 'settings'
              ? t('auditTrail.logInHistory')
              : title === 'settingsOptions'
              ? t('auditTrail.settingsOptions')
              : ''}
          </DisplayTitle>
        </SectionDisplay>
        <Divider />
        {withExpand&&<SectionButton>
          <Button onClick={expandButtonHandler}>
            <ButtonHole>
              <ButtonTop>{isExpanded ? t('common.close') : t('common.expand')}</ButtonTop>
            </ButtonHole>
          </Button>
        </SectionButton>}
      </InvisibleWrapper>
      {isExpanded && title === 'actions' && (
        // ****************need to map *******************
        <SectionDetail>
          {actionData.map((data, index) => (
            <ActionHistoryComponent
              data={data}
              key={index}
              index={index}
              componentName={componentName}
              searchQuery={searchQuery}
            />
          ))}
        </SectionDetail>
      )}

      {isExpanded && title === 'faults' && (
        // ****************need to map *******************
        <SectionDetail>
          {faultData.map((fault, index) => (
            <FaultHistoryComponent
              data={fault}
              key={index}
              searchQuery={searchQuery}
              componentName={componentName}
            />
          ))}
        </SectionDetail>
      )}

      {isExpanded && title === 'settings' && (
        // ****************need to map *******************
        <SectionDetail>
          {settingsData.map((data, index) => (
            <ActionLoginHistory data={data} key={index} index={index} />
          ))}
        </SectionDetail>
      )}

      {isExpanded && title === 'settingsOptions' && (
        // ****************need to map *******************
        <SectionDetail>
          {settingsOptionsData.map((data, index) => (
            <ActionHistoryComponent
              data={data}
              key={index}
              index={index}
              componentName={componentName}
              searchQuery={searchQuery}
              isSettings={true}
            />
          ))}
        </SectionDetail>
      )}
    </Wrapper>
  );
};

export default IntegratedHistoryComponent;

const Wrapper = styled.div`
  width: 1204px;
  height: 44px;
  border-radius: 22px;
  ${layerA180Deg}

  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 3px;

  ${(p) =>
    p.isExpanded &&
    css`
      padding-bottom: 4px;
      height: auto;
    `}
`;

const InvisibleWrapper = styled.div`
  width: 100%;
  height: 44px;
  ${justifyContentSpaceBetween};
  padding: 0 5px 0 4px;
`;
const SectionDisplay = styled.section`
  width: 198px;
  height: 36px;
  border-radius: 41px;
  ${layerADark};
  ${justifyContentSpaceBetween}
  padding: 0 8px;
`;

const DisplayNumber = styled.span`
  font-size: 28px;
`;
const DisplayTitle = styled.span`
  width: 140px;
  text-align: center;
  font-size: 12px;
`;

const Divider = styled.div`
  width: 880px;
  border-bottom: 0.5px solid #ffff;
`;
const SectionButton = styled.section`
  width: 79px;
  height: 28px;
  border-radius: 18px;
  ${layerB};
  ${flexBoxCenter};
`;
const Button = styled.button`
  width: 77px;
  height: 26px;
  border-radius: 25px;
  ${layerA180Deg};
  ${flexBoxCenter};
`;
const ButtonHole = styled.div`
  width: 69px;
  height: 18px;
  border-radius: 18px;
  ${layerB};
  ${flexBoxCenter}
`;
const ButtonTop = styled.div`
  width: 67px;
  height: 16px;
  border-radius: 25px;

  ${layerA180Deg};
  ${flexBoxCenter};

  font-size: 8px;
`;
const SectionDetail = styled.section`
  width: 1195px;
  border-radius: 24px;
  ${layerADark}
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 2px 0 2px 0;
`;

import { useState } from 'react';

import styled, { css } from 'styled-components';

import GraphMain from '../commonComponentsMC/GraphMain';
import HistoryMain from '../commonComponentsMC/HistoryMain';
import SwitchStatusContainer from '../commonComponentsMC/SwitchStatusContainer';
import VideoMain from '../commonComponentsMC/VideoMain';
import { flexBoxCenter } from '../styles/commonStyles';

const EssDetailContainer = ({ swtName, location, machine }) => {
  const [displayComponent, setDisplayComponent] = useState('history');

  const handleHeaderButtonClick = (component) => {
    setDisplayComponent(component);
  };
  return (
    <Wrapper>
      <SectionHeader>
        <SectionImages>
          <HeaderHatSvg
            onClick={() => handleHeaderButtonClick('history')}
            src={'/images/controller-hat-history.svg'}
          />
          <HeaderHatSvg src={'/images/controller-hat-video.svg'} />
          <HeaderHatSvg
            onClick={() => handleHeaderButtonClick('graph')}
            src={'/images/controller-hat-graph.svg'}
          />
        </SectionImages>

        <SectionHeaderTitle>
          <Title
            right={true}
            onClick={() => handleHeaderButtonClick('history')}
          >
            history
          </Title>
          <Title middle={true} onClick={() => handleHeaderButtonClick('video')}>
            video monitoring
          </Title>
          <Title left={true} onClick={() => handleHeaderButtonClick('graph')}>
            graph
          </Title>
        </SectionHeaderTitle>
      </SectionHeader>

      <SectionMain>
        <SectionSubHeader>
          <SubHeaderTitle>
            {displayComponent === 'history'
              ? `switch history`
              : displayComponent === 'graph'
              ? `switch generated telemetry`
              : ``}
          </SubHeaderTitle>
          <SwitchStatusContainer
            location={location}
            machine={machine}
            swtName={swtName}
          />
        </SectionSubHeader>
        {displayComponent === 'history' ? (
          <HistoryMain />
        ) : displayComponent === 'graph' ? (
          <GraphMain />
        ) : (
          <VideoMain />
        )}
        <SectionSubInfo></SectionSubInfo>
      </SectionMain>
    </Wrapper>
  );
};

export default EssDetailContainer;

const Wrapper = styled.div`
  width: 751px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const SectionHeader = styled.section`
  width: 100%;
  display: flex;
  justify-content: flex-end;

  position: relative;
`;
const HeaderHatSvg = styled.img`
  cursor: pointer;
`;
const SectionImages = styled.section`
  width: 612px;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const SectionHeaderTitle = styled.section`
  position: absolute;
  top: 5px;
  padding: 0 60px 0 63px;
  width: 612px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Title = styled.span`
  cursor: pointer;
  font-size: 12px;
  letter-spacing: 1.2px;
`;

const SectionMain = styled.section`
  width: 100%;
  height: 665px;
  background: transparent linear-gradient(90deg, #233a54 0%, #060d19 100%);
  border: 1px solid #000000;
  border-radius: 12px 0px 12px 12px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  padding: 3px 0;
`;

const SectionSubHeader = styled.div`
  width: 743px;
  height: 32px;
  opacity: 1;

  background: #233a54;
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 16px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px 0 12px;
`;
const SubHeaderTitle = styled.div`
  width: 73%;
  border-bottom: 1px solid #fff;
  font-size: 12px;
  letter-spacing: 1.2px;
  text-align: left;
`;

const SectionSubInfo = styled.section`
  width: 100%;
  height: 130px;

  border: 1px solid red;
`;

import { useEffect, useState } from 'react';
import { useUnitsStore, useUserStore } from '../zustand-stores';
import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA180Deg,
  layerA90Deg,
  layerADark,
  layerB,
  layerBDark,
} from '../styles/commonStyles';
import { getAuditTrailService } from '../../services';
import { machineAuditTrailActionsFormat, machineAuditTrailFaultsFormat } from '../../helpers/helpers';
const AUDIT_TRAIL_Action= [
  'MASTER_CONTROL',
  'GLOBAL_MASTER_CONTROL',
  'FAST_MASTER_CONTROL',
  'LOCAL_MASTER_CONTROL',
  // 'ACTION',
];

const HistoryMain = ({ swtName, location, machine }) => {
  // local states
  const [isClicked, setIsClicked] = useState(false);
  const [selectedOne, setSelectedOne] = useState('');
  const [selectedActionIndex, setSelectedActionIndex] = useState(null);
  const [selectedFaultIndex, setSelectedFaultIndex] = useState(null);
  const [historyData,setHistoryData]=useState([]);
  
  const unitsState = useUnitsStore();
  const { isF } = unitsState;

  const userInfo = useUserStore();
  const {allUsers } = userInfo; 

  useEffect(() => {
    getHistoryData();
  }, []);

  const getHistoryData = async () => {
    const historyRequestPayload = (actionType, deviceType, deviceIds) => ({
      actionType: actionType,
      deviceType: deviceType,
      deviceIds,
    });

    const allHistoryPayload = {
      actions: getAuditTrailService(
        historyRequestPayload(AUDIT_TRAIL_Action, swtName.toUpperCase(), [
          machine,
        ]),
        1000
      ),
      faults: getAuditTrailService(
        historyRequestPayload(['FAULT'], swtName.toUpperCase(), [machine]),
        1000
      ),
    };

    const promises = Object.values(allHistoryPayload);
    await Promise.all(promises)
      .then((results) => {
        let AduitTrailData = {
          actions: machineAuditTrailActionsFormat(
            results[0],
            allUsers,
            isF
          ),
          faults: machineAuditTrailFaultsFormat(
            results[1],
            allUsers
          ),
        };

        setHistoryData(AduitTrailData);
      })
      .catch((error) => {
        throw error;
      });
  };

  const handleClick = (type, index) => {
    if (type === 'action') {
      setSelectedOne('action');
      setIsClicked(true);
      setSelectedActionIndex(index);
      setSelectedFaultIndex('');
      // call the command with index number
    } else {
      setSelectedOne('fault');
      setIsClicked(true);
      setSelectedActionIndex('');
      setSelectedFaultIndex(index);
      // call the fault with index number
    }
  };
  return (
    <Wrapper>
      <SectionHole>
        <SectionInner>
          <SectionMainContent
            isSelected={isClicked && selectedOne === 'action'}
          >
            <SectionHeader isSelected={isClicked && selectedOne === 'action'}>
              <HeaderTitle>actions and commands</HeaderTitle>
            </SectionHeader>

            <SectionContent isClicked={isClicked}>
              <ContentTitleWrapper>
                <ContentTitle id={1}>command i.d</ContentTitle>
                <ContentTitle id={2}>user name</ContentTitle>
                <ContentTitle id={3}>time & date</ContentTitle>
              </ContentTitleWrapper>

              <ContentMainWrapper>
                {historyData?.actions?.map((data, index) => (
                  <ContentWrapperButton
                    key={index}
                    onClick={() => handleClick('action', index)}
                    isActionSelected={selectedActionIndex === index}
                  >
                    <ContentTitle
                      id={1}
                      isActionSelected={selectedActionIndex === index}
                    >
                      {data.id}
                    </ContentTitle>
                    <ContentTitle
                      id={2}
                      isActionSelected={selectedActionIndex === index}
                    >
                      {data.userName}
                    </ContentTitle>
                    <ContentTitle
                      id={3}
                      isActionSelected={selectedActionIndex === index}
                    >
                      {data.time}
                    </ContentTitle>
                  </ContentWrapperButton>
                ))}
              </ContentMainWrapper>
            </SectionContent>

            {isClicked && selectedOne === 'action' && (
              <>
                <SectionHeader
                  isSelected={isClicked && selectedOne === 'action'}
                >
                  <HeaderTitle isAction={true}>
                    selected heating program
                  </HeaderTitle>
                </SectionHeader>
                <SectionContent isClicked={isClicked} detail={true}>
                  <ParameterTitle>parameters</ParameterTitle>

                  <ParameterContentWrapper>
                    <ParameterName>instant heat :</ParameterName>
                    <ParameterStatus>
                      {historyData?.actions[selectedActionIndex].parameters.instantHeat
                        ? historyData.actions[selectedActionIndex].parameters
                            .instantHeat
                        : 'off'}
                    </ParameterStatus>
                  </ParameterContentWrapper>

                  {swtName === 'tgs' && (
                    <ParameterContentWrapper>
                      <ParameterName>fan only :</ParameterName>
                      <ParameterStatus>
                        {historyData?.actions[selectedActionIndex].parameters.fanOnly
                          ? 'on'
                          : 'off'}
                      </ParameterStatus>
                    </ParameterContentWrapper>
                  )}

                  <ParameterContentWrapper>
                    <ParameterName>snow sensor :</ParameterName>
                    <ParameterStatus>
                      {historyData?.actions[selectedActionIndex].parameters.snowSensor
                        ? 'on'
                        : 'off'}
                    </ParameterStatus>
                  </ParameterContentWrapper>

                  <ParameterContentWrapper>
                    <ParameterName>opt. cons. temp. :</ParameterName>
                    <ParameterStatus>
                      {historyData?.actions[selectedActionIndex].parameters
                        .optionalConstantTemp
                        ? historyData?.actions[selectedActionIndex].parameters
                            .optionalConstantTemp
                        : 'off'}
                    </ParameterStatus>
                  </ParameterContentWrapper>

                  <ParameterContentWrapper>
                    <ParameterName>schedules :</ParameterName>
                    <ParameterStatus>
                      {historyData?.actions[selectedActionIndex].parameters
                        .heatingSchedule
                        ? historyData?.actions[selectedActionIndex].parameters
                            .heatingSchedule
                        : 'off'}
                    </ParameterStatus>
                  </ParameterContentWrapper>

                  <ParameterContentWrapper>
                    <ParameterName>wind factor :</ParameterName>
                    <ParameterStatus>
                      {historyData?.actions[selectedActionIndex].parameters.windFactor
                        ? 'on'
                        : 'off'}
                    </ParameterStatus>
                  </ParameterContentWrapper>
                </SectionContent>
              </>
            )}
          </SectionMainContent>

          <SectionMainContent isSelected={isClicked && selectedOne === 'fault'}>
            <SectionHeader isSelected={isClicked && selectedOne === 'fault'}>
              <HeaderTitle>faults history</HeaderTitle>
            </SectionHeader>
            <SectionContent isClicked={isClicked}>
              <ContentTitleWrapper>
                <ContentTitle id={1}>fault</ContentTitle>
                <ContentTitle id={2}>user name</ContentTitle>
                <ContentTitle id={3}>time & date</ContentTitle>
              </ContentTitleWrapper>

              <ContentMainWrapper>
                {historyData?.faults?.map((data, index) => (
                  <ContentWrapperButton
                    fault={true}
                    key={index}
                    onClick={() => handleClick('fault', index)}
                    isFaultSelected={selectedFaultIndex === index}
                  >
                    <ContentTitle
                      id={1}
                      fault={true}
                      isFaultSelected={selectedFaultIndex === index}
                    >
                      {data.fault}
                    </ContentTitle>
                    <ContentTitle
                      id={2}
                      fault={true}
                      isFaultSelected={selectedFaultIndex === index}
                    >
                      {data.userName}
                    </ContentTitle>
                    <ContentTitle
                      id={3}
                      fault={true}
                      isFaultSelected={selectedFaultIndex === index}
                    >
                      {data.time}
                    </ContentTitle>
                  </ContentWrapperButton>
                ))}
              </ContentMainWrapper>
            </SectionContent>
            {isClicked && selectedOne === 'fault' && (
              <>
                <SectionHeader
                  isSelected={isClicked && selectedOne === 'fault'}
                >
                  <HeaderTitle fault={true}>faults details</HeaderTitle>
                </SectionHeader>
                <SectionContent isClicked={isClicked} detail={true}>
                  <FaultDetailWrapper>
                    <FaultDetailTitle>
                      name : {historyData?.faults[selectedFaultIndex]?.userName}
                    </FaultDetailTitle>
                    <FaultDetailStatus>
                      date :{' '}
                      {historyData?.faults[selectedFaultIndex]?.time.split(' ')[2]}
                    </FaultDetailStatus>
                  </FaultDetailWrapper>
                  <FaultDetailWrapper>
                    <FaultDetailTitle>
                      title : {historyData?.faults[selectedFaultIndex]?.title}
                    </FaultDetailTitle>
                    <FaultDetailStatus>
                      time :{' '}
                      {historyData?.faults[selectedFaultIndex]?.time.split(' ')[0]}
                    </FaultDetailStatus>
                  </FaultDetailWrapper>
                  <FaultType>{historyData?.faults[selectedFaultIndex]?.fault}</FaultType>
                  <FaultComment>comment :</FaultComment>
                  {historyData?.faults[selectedFaultIndex]?.comment.map((com) => (
                    <FaultComment>{com}</FaultComment>
                  ))}
                </SectionContent>
              </>
            )}
          </SectionMainContent>
        </SectionInner>
      </SectionHole>
    </Wrapper>
  );
};

export default HistoryMain;

const Wrapper = styled.div`
  width: 741px;
  height: 482px;
  border-radius: 14px;

  ${layerBDark}
  ${flexBoxCenter}
`;

const SectionHole = styled.section`
  width: 737px;
  height: 478px;
  border-radius: 12px;
  ${layerA90Deg}
  ${flexBoxCenter}
`;

const SectionInner = styled.section`
  width: 728px;
  height: 468px;
  border-radius: 8px;

  ${layerB}
  ${flexDirectionColumn}
  padding: 2px 0;
`;

const SectionMainContent = styled.section`
  width: 724px;
  border-radius: 6px;

  ${layerA180Deg}
  ${flexDirectionColumn}
  padding: 3px 0 4px 0;

  ${(p) =>
    p.isSelected &&
    css`
      height: 304px;
    `}
`;

const SectionHeader = styled.section`
  width: 716px;
  height: 32px;
  border-radius: 16px;

  ${layerADark}
  ${flexBoxCenter}

  padding: 0 12px;
  margin-bottom: 5px;
  ${(p) =>
    p.isSelected &&
    css`
      margin-bottom: 0px;
    `}
`;
const HeaderTitle = styled.span`
  width: 100%;
  border-bottom: 1px solid #fff;
  font-size: 12px;
  letter-spacing: 1.2px;
  text-align: left;

  ${(p) =>
    p.fault &&
    css`
      color: #fe0000;
      border-bottom: 1px solid #fe0000;
    `}

  ${(p) =>
    p.isAction &&
    css`
      color: #fcff01;
      border-bottom: 1px solid #fcff01;
    `}
`;

const SectionContent = styled.div`
  width: 716px;
  height: 178px;
  border-radius: 8px;
  padding: 0 3px;
  ${(p) =>
    p.isClicked &&
    css`
      width: 716px;
      height: 100px;
      padding: 0 3px 10px 3px;
    `}
  ${layerADark}  
  position: relative;

  ${(p) =>
    p.detail &&
    css`
      /* scroll bar */
      scroll-behavior: smooth;
      overflow-y: scroll;

      ::-webkit-scrollbar {
        width: 10px;
        border: 1px solid #ffffff;
        border-radius: 13px;
      }
      ::-webkit-scrollbar-track {
      }

      ::-webkit-scrollbar-thumb {
        background-color: #ffffff;
        border-radius: 13px;
        border: 1.5px solid transparent;
        background-clip: padding-box;
        height: 40%;
      }

      ::-webkit-scrollbar-button:start:decrement {
        background-repeat: no-repeat;
        background-size: 70%;
        background-position: center;
        height: 10px;

        background-image: url('/images/scrollbar-button-start.svg');
      }
      ::-webkit-scrollbar-button:end:increment {
        background-repeat: no-repeat;
        background-size: 70%;
        background-position: center;
        height: 10px;

        background-image: url('/images/scrollbar-button-end.svg');
      }
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 6px 0;
    `}
`;

const ParameterTitle = styled.span`
  width: 680px;
  font-size: 8px;
  color: #fcff01;
  margin-bottom: 4px;
`;
const ParameterContentWrapper = styled.div`
  width: 680px;
  height: 15px;
  ${justifyContentSpaceBetween}
  border-bottom: 1px solid #fcff01;
`;
const ParameterName = styled.span`
  text-align: left;
  font-size: 8px;

  color: #fcff01;
`;
const ParameterStatus = styled.span`
  text-align: right;
  font-size: 8px;
  color: #fcff01;
`;

const FaultDetailWrapper = styled.div`
  width: 680px;
  height: 15px;
  ${justifyContentSpaceBetween}
  border-bottom: 1px solid #FE0000;
`;

const FaultDetailTitle = styled.span`
  color: #fe0000;
  font-size: 8px;
`;
const FaultDetailStatus = styled.span`
  color: #fe0000;
  font-size: 8px;
`;
const FaultType = styled.span`
  width: 680px;
  color: #fe0000;
  font-size: 8px;
  margin: 7px;
`;

const FaultComment = styled.span`
  width: 680px;
  color: #fe0000;
  font-size: 8px;
`;

const ContentMainWrapper = styled.div`
  width: 100%;
  height: 86%;

  /* scroll bar */
  scroll-behavior: smooth;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    width: 10px;
    border: 1px solid #ffffff;
    border-radius: 13px;
  }
  ::-webkit-scrollbar-track {
  }

  ::-webkit-scrollbar-thumb {
    background-color: #ffffff;
    border-radius: 13px;
    border: 1.5px solid transparent;
    background-clip: padding-box;
    height: 40%;
  }

  ::-webkit-scrollbar-button:start:decrement {
    background-repeat: no-repeat;
    background-size: 70%;
    background-position: center;
    height: 10px;

    background-image: url('/images/scrollbar-button-start.svg');
  }
  ::-webkit-scrollbar-button:end:increment {
    background-repeat: no-repeat;
    background-size: 70%;
    background-position: center;
    height: 10px;

    background-image: url('/images/scrollbar-button-end.svg');
  }
`;
const ContentTitleWrapper = styled.div`
  width: 695px;
  height: 22px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 10px;
`;
const ContentTitle = styled.span`
  width: 33%;
  font-size: 8px;
  ${(p) =>
    p.id === 1 &&
    css`
      text-align: left;
    `}
  ${(p) =>
    p.id === 2 &&
    css`
      text-align: center;
    `}
  ${(p) =>
    p.id === 3 &&
    css`
      text-align: right;
    `};

  ${(p) =>
    p.fault &&
    css`
      color: #fe0000;
    `}

  ${(p) =>
    p.isActionSelected &&
    css`
      color: #fcff01;
    `}

    ${(p) =>
    p.isFaultSelected &&
    css`
      color: #fff;
    `}
`;
const ContentWrapperButton = styled.button`
  width: 695px;
  height: 22px;
  border-radius: 16px;

  border: 1px solid #142033;
  padding: 0 10px;

  ${(p) =>
    p.fault &&
    css`
      border: 1px solid red;
    `}

  ${(p) =>
    p.isActionSelected &&
    css`
      border: 1px solid #fcff01;
    `}

    ${(p) =>
    p.isFaultSelected &&
    css`
      border: 1px solid #fff;
      background-color: #fe0000;
    `}

  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 2px;
  &:last-child {
    margin-bottom: 0px;
  }
`;

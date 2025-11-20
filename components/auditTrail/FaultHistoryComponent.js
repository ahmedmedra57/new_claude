import { useMemo, useState } from 'react';
import { useLocationsStore } from '../zustand-stores';
import { useTranslation } from 'react-i18next';

import styled from 'styled-components';
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentFlexEnd,
  justifyContentSpaceBetween,
  layerA180Deg,
  layerADark,
  layerCLighter,
} from '../styles/commonStyles';

import ButtonComponent from './ButtonComponent';
import moment from 'moment';
import { postAuditTrailLogService } from '../../services/auditTrail.service';
const FaultHistoryComponent = ({ data,searchQuery,componentName }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const title = `${data.faultType} ${
    data?.position !==undefined? '(' + (data?.position+1 ) + ')' : ''
  } - ${data.locationPre}-${data.address}`;
  const date = data.date;

const faultSsrArray = useMemo(() => {
  return data.number.length !== 0 ? '( ' + data.number?.toString() + ' )' : '';
}, [data]);

  //redux
  const locations = useLocationsStore();
  const { specific: allLocations } = locations;

  const handlePrintPDF = () => {
    window.alert('Request print pdf to the Backend');
    const startDateAsTimeStamp = moment(searchQuery.startDate).utc().valueOf();
    const endDateAsTimeStamp = moment(searchQuery.endDate).utc().valueOf();
    let dataToSend = {
      actionType: 'AUDIT_TRAIL',
      ...(searchQuery.deviceIds && { deviceIds: searchQuery.deviceIds }),
      deviceType: componentName.toUpperCase(),
      data: {
        ...(searchQuery.userIds && { userIds: searchQuery.userIds }),
        startDate: startDateAsTimeStamp,
        endDate: endDateAsTimeStamp,
      },
    };
    postAuditTrailLogService(dataToSend);
  };
  return (
    <Wrapper>
      <InvisibleWrapper>
        <SectionDisplay>
          <Title>{title}</Title>
          <Date>{t('common.date')} : {date}</Date>
        </SectionDisplay>
        <ButtonComponent
          title={isExpanded ? t('common.close') : t('common.expand')}
          buttonHandler={() => setIsExpanded(!isExpanded)}
        />
      </InvisibleWrapper>

      {isExpanded && (
        <SectionDetail>
          <DetailWrapper>
            <SectionDetailPartA>
              <PartAHeader>
                <HeaderATitleWrapper>
                  <HeaderTitle>{data.faultType}</HeaderTitle>
                  {data.number.length !== 0 && (
                    <HeaderTitle>
                      {data.number.length === 1
                        ? `${data.number.length} switch`
                        : `${data.number.length} switches`}{' '}
                    </HeaderTitle>
                  )}
                </HeaderATitleWrapper>
                <PrintButton onClick={handlePrintPDF}>
                  <PrintButtonWrapper>
                    <PrintButtonHole>
                      <PrintButtonTop>{t('common.printPdf')}</PrintButtonTop>
                    </PrintButtonHole>
                  </PrintButtonWrapper>
                </PrintButton>
              </PartAHeader>

              <DetailPartAOuterWrapper>
                <DetailPartAWrapper>
                  <DetailPartATop>
                    <PartABody>
                      <SwitchInfoWrapper>
                        <SwitchLocation>{allLocations[data.location]?.locationName}</SwitchLocation>
                        <SwitchNameWrapper>
                          <SwitchName>
                            {allLocations[data.location].locationName}-{allLocations[data.location].devices[data.machine]?.locationName}
                          </SwitchName>
                        </SwitchNameWrapper>
                      </SwitchInfoWrapper>
                    </PartABody>
                  </DetailPartATop>
                </DetailPartAWrapper>
              </DetailPartAOuterWrapper>
            </SectionDetailPartA>

            <SectionDetailPartB>
              <PartBHeader>
                <HeaderBTitleWrapper>
                  <HeaderTitle>{t('auditTrail.faultDetails')}</HeaderTitle>
                </HeaderBTitleWrapper>
              </PartBHeader>

              <DetailPartBOuterWrapper>
                <DetailPartBWrapper>
                  <DetailPartBTop>
                    <PartBBody>
                      <PartBBodyHeader>
                        <PartBBodySpan>{t('common.name')} : {/* {data.attends[0]?.user_name} */}</PartBBodySpan>
                        <PartBBodySpan>{t('common.date')} : {moment(data.date, 'h:mma - DD/MM/YYYY').format("DD/MM/YYYY")}</PartBBodySpan>
                      </PartBBodyHeader>

                      <PartBBodyHeader>
                        <PartBBodySpan>{t('common.title')} :</PartBBodySpan>
                        <PartBBodySpan>{t('common.time')} : {moment(data.date, 'h:mma - DD/MM/YYYY').format("HH : mm : ss A")}</PartBBodySpan>
                      </PartBBodyHeader>

                      <SectionPartBBody>
                        <PartBBodySpan>{data.faultType} {faultSsrArray} </PartBBodySpan>
                        <PartBBodySpan>{t('common.comment')} :</PartBBodySpan>
                        {data.attends?.map((attend)=>(
                          <PartBBodySpan>
                            {/* {data.attends[0]?.action_taken} */}
                            - {attend?.user_name} / {attend?.action_taken}
                          </PartBBodySpan>
                          ))
                        }
                      </SectionPartBBody>
                    </PartBBody>
                  </DetailPartBTop>
                </DetailPartBWrapper>
              </DetailPartBOuterWrapper>
            </SectionDetailPartB>
          </DetailWrapper>
        </SectionDetail>
      )}
    </Wrapper>
  );
};
export default FaultHistoryComponent;

const Wrapper = styled.div`
  width: 1191px;
  border-radius: 22px;
  ${layerA180Deg}
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 8px;
  &:last-child {
    margin-bottom: 0px;
  }
`;

const InvisibleWrapper = styled.div`
  width: 100%;
  height: 44px;
  ${justifyContentSpaceBetween}
  padding: 0 8px 0 5px;
`;
const SectionDisplay = styled.section`
  width: 1088px;
  height: 36px;
  border-radius: 41px;
  ${layerADark};
  ${justifyContentSpaceBetween}
  padding: 0 30px 0 12px;
`;

const Title = styled.span`
  font-size: 12px;
  letter-spacing: 1.2px;
`;
const Date = styled.span`
  font-size: 12px;
  letter-spacing: 1.2px;
  color: #fe0000;
`;
const Command = styled.span`
  width: 270px;
  font-size: 12px;
  letter-spacing: 1.2px;
`;

const SectionDetail = styled.section`
  width: 1182px;
  height: 205px;
  border-radius: 18px;
  ${layerADark};
  ${flexBoxCenter}
  margin-bottom: 3px;
`;
const DetailWrapper = styled.div`
  width: 1180px;
  height: 203px;
  border-radius: 17px;
  ${layerA180Deg}
  ${justifyContentSpaceBetween}
  padding: 5px;
`;
const SectionDetailPartA = styled.section`
  height: 100%;
  ${flexDirectionColumn}
`;

const DetailPartAOuterWrapper = styled.div`
  width: 634px;
  height: 154px;
  border-radius: 12px;
  ${layerADark}
  ${flexBoxCenter}
`;

const DetailPartAWrapper = styled.div`
  width: 630px;
  height: 151px;
  border-radius: 10px;
  ${layerA180Deg};
  ${flexBoxCenter}
`;
const DetailPartATop = styled.div`
  width: 622px;
  height: 143px;
  border-radius: 6px;
  ${layerADark};
`;
const PartAHeader = styled.div`
  width: 634px;
  height: 31px;
  border-radius: 16px;
  ${layerADark}
  ${justifyContentSpaceBetween}
  padding: 0 1px 0 10px;
`;
const HeaderATitleWrapper = styled.div`
  width: 523px;
  font-size: 12px;
  letter-spacing: 1.2px;
  border-bottom: 1px solid #fe0000;
  ${justifyContentSpaceBetween}
`;

const HeaderTitle = styled.span`
  font-size: 12px;
  letter-spacing: 1.2px;
  color: #fe0000;
`;

const PrintButton = styled.button`
  width: 95px;
  height: 29px;
  border-radius: 27px;
  ${layerCLighter};
  ${flexBoxCenter};
`;
const PrintButtonWrapper = styled.div`
  width: 93px;
  height: 27px;
  border-radius: 25px;
  ${layerA180Deg};
  ${flexBoxCenter};
`;
const PrintButtonHole = styled.div`
  width: 87px;
  height: 21px;
  border-radius: 20px;

  ${layerCLighter};
  ${flexBoxCenter};
`;
const PrintButtonTop = styled.div`
  width: 85px;
  height: 19px;
  border-radius: 25px;
  ${layerA180Deg};
  ${flexBoxCenter};
  font-size: 8px;
  letter-spacing: 0.8px;
`;

const PartABody = styled.div`
  padding: 5px;
`;
const SwitchInfoWrapper = styled.div`
  margin-bottom: 8px;
`;
const SwitchLocation = styled.span`
  border-bottom: 1px solid #fe0000;
  font-size: 12px;
  letter-spacing: 1.2px;
  color: #fe0000;
  display: inline-block;
  margin-bottom: 4px;
`;
const SwitchNameWrapper = styled.div``;
const SwitchName = styled.span`
  font-size: 12px;
  letter-spacing: 1.2px;
  color: #fe0000;
`;

const SectionDetailPartB = styled.section`
  height: 100%;
  ${flexDirectionColumn}
`;
const DetailPartBOuterWrapper = styled.section`
  width: 520px;
  height: 154px;
  border-radius: 12px;
  ${layerADark};
  ${flexBoxCenter}
`;

const DetailPartBWrapper = styled.div`
  width: 517px;
  height: 151px;
  border-radius: 10px;
  ${layerA180Deg};
  ${flexBoxCenter};
`;
const DetailPartBTop = styled.div`
  width: 509px;
  height: 143px;
  border-radius: 6px;
  ${layerADark}
`;
const PartBHeader = styled.div`
  width: 520px;
  height: 31px;
  border-radius: 16px;
  ${layerADark}
  ${flexBoxCenter}
  padding: 0 10px;
`;

const HeaderBTitleWrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid #fe0000;
`;
const PartBBody = styled.div`
  width: 100%;
  height: 100%;
  padding: 5px;

  display: flex;
  flex-direction: column;
  align-items: center;

  /* scroll bar */
  scroll-behavior: smooth;
  overflow-y: auto;

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
const PartBBodyHeader = styled.div`
  width: 98%;
  height: 22px;
  border-bottom: 1px solid #fe0000;
  ${justifyContentSpaceBetween}
`;
const PartBBodySpan = styled.span`
  font-size: 10px;
  color: #fe0000;
`;

const SectionPartBBody = styled.section`
  width: 98%;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

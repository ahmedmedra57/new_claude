import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerA90Deg,
} from '../../styles/commonStyles';
import { selectEssSwitch } from '../../store/slices/essSwitchSlice';
import { selectTesSwitch } from '../../store/slices/tesSwitchSlice';
import { selectTgsSwitch } from '../../store/slices/tgsSwitchSlice';
import { useMemo } from 'react';

const DisplayFaultsBoxWrapper = ({ swtName, location, machine }) => {
  const { essSwitch, tgsSwitch, tesSwitch,flatEssSwitch,flatTgsSwitch,flatTesSwitch } = useSelector(
    swtName === 'ess'
      ? selectEssSwitch
      : swtName === 'tgs'
      ? selectTgsSwitch
      : selectTesSwitch
  );

  const switchStatus =
    swtName === 'ess' ? flatEssSwitch : swtName === 'tgs' ? flatTgsSwitch : flatTesSwitch;

  const machineInfo = switchStatus[location][machine];
  const isTgs = swtName === 'tgs';

  const groundFault = useMemo(() => {
    if (isTgs) return '';
    return (machineInfo?.groundFault && 'Ground Fault') || '';
  }, [isTgs, machineInfo?.groundFault]);

  const thermocoupleFault = useMemo(() => {
    if (isTgs) return '';
    const thermocoupleFaultArray = machineInfo?.thermocoupleFault || [];
    const activeFaultIndices = thermocoupleFaultArray
      .map((element, index) => (element === 1 ? index + 1 : null))
      .filter((index) => index !== null);
      
    if (activeFaultIndices.length === 0) return '';
     
    return `[${activeFaultIndices.join(',')}]`;
  }, [isTgs, machineInfo?.thermocoupleFault]);

  const SsrFault = useMemo(() => {
    if (isTgs) return '';
    const ssrFaultArray = machineInfo?.ssrFault || [];
    const activeFaultIndices = ssrFaultArray
      .map((element, index) => (element === 1 ? index + 1 : null))
      .filter((index) => index !== null);

    if (activeFaultIndices.length === 0) return '';

    return `[${activeFaultIndices.join(',')}]`;
  }, [isTgs, machineInfo?.ssrFault]);

  const srrOverCurrent = useMemo(() => {
    if (isTgs) return '';
    const srrOverCurrentArray = machineInfo?.srrOverCurrent || [];
    const activeFaultIndices = srrOverCurrentArray
      .map((element, index) => (element === 1 ? index + 1 : null))
      .filter((index) => index !== null);

    if (activeFaultIndices.length === 0) return '';

    return `[${activeFaultIndices.join(',')}]`;
  }, [isTgs, machineInfo?.srrOverCurrent]);

  const TgsTimeoutFault = useMemo(() => {
    if (!isTgs) return '';

    return (machineInfo?.timeoutFault && 'TIMEOUT FAULT') || '';
  }, [isTgs, machineInfo?.timeoutFault]);

  const TgshplpFault = useMemo(() => {
    if (!isTgs) return '';

    return (machineInfo?.hplpFault && 'HPLP FAULT') || '';
  }, [isTgs, machineInfo?.hplpFault]);

  const TgsBmsFault = useMemo(() => {
    if (!isTgs) return '';

    return (machineInfo?.bmsFault && 'BMS FAULT') || '';
  }, [isTgs, machineInfo?.bmsFault]);

  const TgsthermocoupleFault = useMemo(() => {
    if (!isTgs) return '';

    return (machineInfo?.thermocoupleFault && 'thermocouple FAULT') || '';
  }, [isTgs, machineInfo?.thermocoupleFault]);

   return (
    <WrapperHole>
      <OuterLayer>
        <InnerHole>
         <Top>
              {isTgs ? (
                <>
                  <DisplayFault isFault={TgsTimeoutFault}>
                    <FaultMessage>{TgsTimeoutFault}</FaultMessage>
                  </DisplayFault>

                  <DisplayFault isFault={TgshplpFault}>
                    <FaultMessage>{TgshplpFault}</FaultMessage>
                  </DisplayFault>

                  <DisplayFault isFault={TgsBmsFault}>
                    <FaultMessage>{TgsBmsFault}</FaultMessage>
                  </DisplayFault>

                  <DisplayFault isFault={TgsthermocoupleFault}>
                    <FaultMessage>{TgsthermocoupleFault}</FaultMessage>
                  </DisplayFault>
                </>
              ) : (
                <>
                  <DisplayFault isFault={groundFault}>
                    <FaultMessage>{groundFault}</FaultMessage>
                  </DisplayFault>

                  {thermocoupleFault && (
                        <DisplayFault isFault={thermocoupleFault}>
                          <FaultMessage>{`thermocouple FAILURE : ${thermocoupleFault}`}</FaultMessage>
                        </DisplayFault>
                      )}

                      {SsrFault && (
                        <DisplayFault isFault={SsrFault}>
                          <FaultMessage>{`SSR FAULT IN SSR : ${SsrFault}`}</FaultMessage>
                        </DisplayFault>
                      )}

                      {srrOverCurrent && (
                        <DisplayFault isFault={srrOverCurrent}>
                          <FaultMessage>{`LOAD EXCEEDED FAULT : ${srrOverCurrent}`}</FaultMessage>
                        </DisplayFault>
                      )}
                </>
              )}
            </Top>

        </InnerHole>
      </OuterLayer>
    </WrapperHole>
  );
};

export default DisplayFaultsBoxWrapper;

const WrapperHole = styled.div`
  width: 554px;
  height: 59px;
  border-radius: 10px;

  ${layerA}
  ${flexBoxCenter}
`;
const OuterLayer = styled.div`
  width: 552px;
  height: 57px;
  border-radius: 9px;

  ${layerA90Deg}
  ${flexBoxCenter}
`;
const InnerHole = styled.div`
  width: 546px;
  height: 51px;
  border-radius: 7px;

  ${layerA}
  ${flexBoxCenter}
`;
const Top = styled.div`
  width: 543px;
  height: 48px;
  border-radius: 5px;

  ${layerA180Deg}
  ${justifyContentSpaceBetween}  
  padding: 0 3px;
`;
const DisplayFault = styled.div`
  width: 130px;
  height: 43px;
  border-radius: 4px;
  
 
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
 ${props => {
    
    return props.isFault && css`
      background: red;
    `;
  }
}
 
`;

const FaultMessage = styled.span`
  font-size: 10px;
  color: black;
  padding: 1px 4px;
  border-radius: 2px;
`;

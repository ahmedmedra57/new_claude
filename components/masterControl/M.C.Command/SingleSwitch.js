import styled, { css } from 'styled-components';
import {
  borderBlue,
  justifyContentSpaceBetween,
} from '../../styles/commonStyles';

function SingleSwitch({
  location,
  machineName,
  application,
  switches,
  displaySwitches,
}) {
  return (
    <Wrapper>
      <Div>
        <Div1>
          <Circle></Circle>
          <Location>{`${location}  ${machineName}`}</Location>
        </Div1>
        <SwitchHeatingSystem>{application}</SwitchHeatingSystem>
      </Div>
    </Wrapper>

    // =======================
    // <Wrapper>
    //   {displaySwitches.length > 0
    //     ? Object.values(switches)?.map((value) => {
    //         return Object.entries(value)?.map((el, index) => {
    //           const switchSysFistWord =
    //             el[1]?.heatingSystem?.split(' ')[1].split('')[0] + '.';
    //           const switchSysSecondWord =
    //             el[1]?.heatingSystem?.split(' ')[2].split('')[0] + '.';
    //           const fullAbbrOfSwitchSys =
    //             switchSysFistWord.concat(switchSysSecondWord);
    //           const switchNum = el[1]?.heatingSystem?.match(/\d+/g)[0];
    //           return (
    //             <Div key={index}>
    //               <Div1>
    //                 <Circle></Circle>
    //                 <Location>{location + ' ' + el[1].machineName}</Location>
    //               </Div1>
    //               <SwitchHeatingSystem>
    //                 {switchNum ? '#' : ''}
    //                 {switchNum ?? ''}{' '}
    //                 {fullAbbrOfSwitchSys === 'undefined.undefined.'
    //                   ? ''
    //                   : fullAbbrOfSwitchSys}
    //               </SwitchHeatingSystem>
    //             </Div>
    //           );
    //         });
    //       })
    //     : switches?.map((value, index) => {
    //         return (
    //           <Div key={index}>
    //             <Div1>
    //               {' '}
    //               <Circle></Circle>
    //               <Location>{location}</Location>
    //             </Div1>
    //             <SwitchHeatingSystem>{value}</SwitchHeatingSystem>
    //           </Div>
    //         );
    //       })}
    // </Wrapper>
  );
}

export default SingleSwitch;

const Wrapper = styled.div``;

const Div = styled.div`
  width: 274px;
  height: 24px;

  ${borderBlue}

  border-radius: 16px;
  opacity: 1;
  ${justifyContentSpaceBetween}
`;

const Div1 = styled.div`
  display: flex;
  align-items: center;
`;

const Circle = styled.div`
  width: 10px;
  height: 10px;
  margin-left: 10px;
  margin-right: 5px;
  border-radius: 50%;
  background-color: #ffff;
  color: #ffff;
`;
const Location = styled.p`
  font-size: 8px;
  margin-left: 4px;
  letter-spacing: 0.8px;
  color: #ffffff;
  opacity: 1;
`;
const SwitchHeatingSystem = styled.p`
  text-transform: capitalize;
  font-size: 8px;
  margin-right: 4px;
  letter-spacing: 0.8px;
  color: #ffffff;
  opacity: 1;
`;

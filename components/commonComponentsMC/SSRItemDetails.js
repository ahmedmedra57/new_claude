import { useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  ItemBackground,
  ItemBackgroundDisable,
} from '../styles/commonStyles';

import SSRSettingButton from './SSRSettingButton';
import { selectUserPermissions } from '../store/slices/userSlice';

const SSRItemDetails = ({
  isEnable,
  isFault,
  isWarn,
  option,
  id,
  data,
  isSettingOpen,
  handleButtonClick,
  overAmp,
}) => {
  const permissions = useSelector(selectUserPermissions);
  const disable = !permissions.WRITE;

  // const unitsState = useSelector(selectSettingsOfEss);
  // const { unitsMeasurement } = unitsState.buttonsOfSettings;

  // ---- Temporary variables ----
  const unitsMeasurement = false;
  // ---- Temporary variables ----

  // For mapping
  const { specs } = data;

  return (
    <Wrapper>
      <ContentWrapper isEnable={isEnable} isFault={isFault} overAmp={overAmp} isWarn={isWarn}>
  {specs.length > 3 ? (
 
    <div
      style={{
        backgroundColor: '#233a54',
        color: '#856404',
        border: '1px solid #ffeeba',
        borderRadius: '8px',
        padding: '10px',
        marginBottom: '10px',
        fontSize: '14px',
      }}
    >
      <h1 style={{color:"#856404"}}>Warning:</h1> There are more than 3 heaters for that SSR.
      <textarea
        readOnly
        style={{
          color:'white',
          width: '100%',
          marginTop: '8px',
          height: '80px',
          resize: 'none',
          borderRadius: '6px',
          border: '1px solid #ccc',
          padding: '6px',
          background: '#233a54',
          fontSize: '13px',
        }}
        value={specs
          .map(
            (el, idx) =>
              `${idx + 1}. ${el.partNumber || 'No part number'} `
          )
          .join('\n')}
      />
    </div>
  ) : (
    
    specs.map((spec, index) => (
      <ItemWrapper column={index} hiddenNumber={specs.length} key={index}>
        <ItemCurrentWrapper>
          <ItemCurrent isEnable={isEnable}>
            <ItemData isDefault={true} isEnable={isEnable}>
              {spec.current} t
            </ItemData>
          </ItemCurrent>

          <ItemCurrent isEnable={isEnable}>
            <ItemData isEnable={isEnable}>{spec.currentSSR}</ItemData>
          </ItemCurrent>
        </ItemCurrentWrapper>

        <ItemWattage isEnable={isEnable}>
          <ItemData isEnable={isEnable}>{spec.wattage}</ItemData>
        </ItemWattage>

        <ItemVoltage isEnable={isEnable}>
          <ItemData isEnable={isEnable}>{spec.voltage}</ItemData>
        </ItemVoltage>

        <ItemLength isEnable={isEnable}>
          <ItemData isEnable={isEnable}>{spec.lengths}</ItemData>
        </ItemLength>

        <ItemDescription isEnable={isEnable}>
          {spec.elementName ? (
            <ItemData isDescription={true} isEnable={isEnable}>
              {`${spec.elementName} - ${spec.partNumber} / ${spec.current} A / ${spec.wattage} W / ${spec.voltage} v / ${(Number(spec.lengths) / 3.28048).toFixed(1)} m - ${spec.lengths} ft`}
            </ItemData>
          ) : (
            <ItemData isDescription={true} isEnable={isEnable}>
              -----------------------------
            </ItemData>
          )}
        </ItemDescription>

        <SSRSettingButton
          disable={disable}
          isSettingOpen={isSettingOpen}
          handleButtonClick={handleButtonClick}
          id={option}
          column={index + 1}
        />
      </ItemWrapper>
    ))
  )}
</ContentWrapper>

    </Wrapper>
  );
};
export default SSRItemDetails;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;
const ContentWrapper = styled.ul`
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: 0.1rem 0;
  border-radius: 12px;
  border: 0.5px solid #000000;
  ${(p) =>
    p.isEnable
      ? css`
          background: transparent
            linear-gradient(180deg, #233a54 0%, #060d19 100%);
          box-shadow: inset 0px 0.5px 1px #ffffff29, 0px 0px 1px #000000;
        `
      : css`
          background: transparent
            linear-gradient(180deg, #565656 0%, #1d1d1d 100%);
          box-shadow: inset 0px 0.5px 1px #ffffff29, 0px 0px 1px #000000;
        `}

  border: ${(p) => (p.isFault ? '1px solid red' : '')};
  border: ${(p) => p.overAmp && `1px solid #FF7800`};
  border: ${(p) => p.isWarn && `1px solid #FF7800`};
  padding: 1px 0;
`;

const ItemWrapper = styled.div`
  ${flexBoxCenter}
  justify-content: space-between;
  padding: 0 1.6px;

  &:first-child {
    ${(p) =>
    p.hiddenNumber !== 1 &&
    css`
        margin-bottom: 0rem;
      `}
  }
  &:nth-child(2) {
    margin-bottom: 0rem;
  }
`;

const ItemCurrentWrapper = styled.div`
  display: flex;
  width: 91px;
  justify-content: space-between;
`;

const ItemCurrent = styled.li`
  ${flexBoxCenter}

  width: 45px;
  height: 20px;
  ${ItemBackground}

  ${(p) =>
    p.isEnable ||
    css`
      ${ItemBackgroundDisable}
    `}
`;
const ItemWattage = styled.li`
  ${flexBoxCenter}
  width: 96px;
  height: 20px;
  ${ItemBackground}
  ${(p) =>
    p.isEnable ||
    css`
      ${ItemBackgroundDisable}
    `}
`;
const ItemVoltage = styled.li`
  ${flexBoxCenter}

  width: 96px;
  height: 20px;
  ${ItemBackground}
  ${(p) =>
    p.isEnable ||
    css`
      ${ItemBackgroundDisable}
    `}
`;
const ItemLength = styled.li`
  ${flexBoxCenter}

  width: 96px;
  height: 20px;
  ${ItemBackground}
  ${(p) =>
    p.isEnable ||
    css`
      ${ItemBackgroundDisable}
    `}
`;
const ItemDescription = styled.li`
  ${flexBoxCenter}

  width: 520px;
  height: 20px;
  ${ItemBackground}
  ${(p) =>
    p.isEnable ||
    css`
      ${ItemBackgroundDisable}
    `}


  padding: 0 0.1rem;
`;
const ItemData = styled.span`
  font-size: 10px;
  text-align: center;

  ${(p) =>
    p.isDescription &&
    css`
      font-size: 9px;
      overflow: hidden;
    `}

  color: ${(p) => p.isDefault && '#95ff45'};
  color: ${(p) => p.isEnable || `#808080;`};
`;

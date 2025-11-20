import styled, { css } from 'styled-components';
import {
import { useMCStore } from '../zustand-stores';
  justifyContentSpaceEvenly,
  flexBoxCenter,
  layerB,
  layerAGreen180Deg,
  layerADisabled180Deg,
  layerA180Deg,
  layerBGreen,
  layerBDisabled,
  justifyContentSpaceBetween,
} from '../../styles/commonStyles';
import {
  handleSelectEss,
  handleSelectHp,
  handleSelectTes,
  handleSelectTgs,
} from '../../store/slices/mCSlice';
import { useCheckControlPermsission } from '../../../hooks';

function SystemButton({
  name,
  shortName,
  index,
  isColor,
  setIsSystemSelectedMessage,
}) {
  const { selectEss } = useMCStore();
  const a = name.split(' ');
  const checkSystemPermission = useCheckControlPermsission();

  
  const handleSelectSystem = () => {
    switch (shortName) {
      case 'ess':
        dispatch(handleSelectEss();
        setIsSystemSelectedMessage(false);
        break;
      case 'tgs':
        dispatch(handleSelectTgs();
        setIsSystemSelectedMessage(false);
        break;
      case 'tes':
        dispatch(handleSelectTes();
        setIsSystemSelectedMessage(false);
        break;
      case 'hp':
        dispatch(handleSelectHp();
        setIsSystemSelectedMessage(false);
        break;
      default:
        break;
    }
  };
  const isDisabled = !checkSystemPermission(shortName);

  return (
    <ButtonHole>
      <Button
        onClick={handleSelectSystem}
        isColor={isColor}
        disabled={isDisabled}
      >
        <Flex>
          <TitleAbbr index={index}>{shortName}</TitleAbbr>
          <ButtonIndent isColor={isColor} index={index}>
            <ButtonTop
              isColor={isColor}
              disabled={isDisabled}
            >
              <ButtonName index={index}>
                {a[0]} <br></br> {a[1]} {a[2]}
              </ButtonName>
            </ButtonTop>
          </ButtonIndent>
        </Flex>
      </Button>
    </ButtonHole>
  );
}

export default SystemButton;

const ButtonHole = styled.div`
  width: 191px;
  height: 49px;
  border-radius: 26px;

  ${layerB}
  ${flexBoxCenter}
`;

const Button = styled.button`
  width: 189px;
  height: 47px;

  ${({ isColor }) =>
    isColor
      ? css`
          ${layerAGreen180Deg}
        `
      : css`
          ${layerA180Deg}
        `}

  ${({ disabled }) =>
    disabled &&
    css`
      ${layerADisabled180Deg}
      cursor: not-allowed;
    `}
    
  border-radius: 25px;

  /* ${justifyContentSpaceBetween} */
`;

const Flex = styled.div`
  ${flexBoxCenter} /* gap:4px; */
  ${justifyContentSpaceEvenly}
`;

const TitleAbbr = styled.span`
  font-size: 12px;
  letter-spacing: 1.2px;
  /* margin-left: 5px; */
  /* margin-right: 2px; */
  ${({ index }) =>
    index === 3 &&
    css`
      margin-left: 8px;
      margin-right: 3px;
    `}
`;

const ButtonIndent = styled.div`
  width: 142px;
  height: 39px;
  margin-left: 1px;

  ${({ isColor }) =>
    isColor
      ? css`
          ${layerBGreen}
        `
      : css`
          ${layerB}
        `}

  ${({ index }) =>
    index === 3 &&
    css`
      ${layerBDisabled}
      margin-left:5px;
    `}
    

 
  border-radius: 20px;
  opacity: 1;
  ${flexBoxCenter}
`;

const ButtonTop = styled.div`
  width: 140px;
  height: 37px;

  ${({ isColor }) =>
    isColor
      ? css`
          ${layerAGreen180Deg}
        `
      : css`
          ${layerA180Deg}
        `}

  ${({ disabled }) =>
    disabled &&
    css`
      ${layerADisabled180Deg}
      cursor: not-allowed;
    `}
    

  border-radius: 19px;
  opacity: 1;
  ${flexBoxCenter}
`;

const ButtonName = styled.p`
  line-height: 10px;
  text-align: center;
  font-size: 10px;
  letter-spacing: 1px;
  color: #ffffff;
  opacity: 1;
`;

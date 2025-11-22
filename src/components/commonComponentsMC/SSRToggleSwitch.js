import styled, { css } from "styled-components";
import { flexBoxCenter } from "../styles/commonStyles";

const SSRToggleSWitch = ({
  data,
  id,
  buttonHandler,
  isMobile,
  disable,
  switch_panels,
  isUpdating,
  setIsUpdating
}) => {
  const { buttonStatus, switchName, name, test } = data;
  const mobileSwitchIconSrc =
    buttonStatus === "on"
      ? "/images/ssr-switch-on-mobile.svg"
      : buttonStatus === "off"
      ? "/images/ssr-switch-on-mobile-off.svg"
      : "/images/ssr-switch-on-mobile-flt.svg";

  const switchIconSrc =
    test === 1
      ? "/images/ssr-switch-test.svg"
      : buttonStatus === "on"
      ? "/images/ssr-switch-on.svg"
      : buttonStatus === "off"
      ? "/images/ssr-switch-off.svg"
      : "/images/ssr-switch-flt.svg";

  const handleButtonClick = () => {
    if (buttonStatus === "flt") {
      return;
    } else if (buttonStatus === "on") {
      buttonHandler({ button: "toggle", id: `ssr${id}`, buttonStatus: "off" });
    } else {
      buttonHandler({ button: "toggle", id: `ssr${id}`, buttonStatus: "on" });
    }
  };

  let swtName = "";
  if (switch_panels && data.switch_system_id) {
    swtName = switch_panels.find(
      (item) => item.system_id === data.switch_system_id
    )?.name;
  }
  const switchNameSplitted = switchName?.split(" ") || [switchName, ""];

  return (
    <Wrapper>
      <Flex>
        <Title isSize={true}>ssr{id}</Title>
        <Title>{swtName ? swtName : ""}</Title>
      </Flex>
      <SwitchButton
        disabled={buttonStatus === "flt" ? true : false}
        isOff={buttonStatus === "off"}
        onClick={!disable ? handleButtonClick : null}
        disable={disable }
        isUpdating={isUpdating}
        
      >
        <ToggleWrapper>
          <TogglePart active={buttonStatus === "on"}>ON</TogglePart>
          <TogglePart active={buttonStatus === "off"}>OFF</TogglePart>
        </ToggleWrapper>
      </SwitchButton>
    </Wrapper>
  );
};

export default SSRToggleSWitch;
const Wrapper = styled.div`
  padding-top: 3px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Title = styled.span`
  font-size: 10px;
  color: #fcff01;

  max-width: 90px;
  /* max-height: 20px; */
  overflow: hidden;
  ${(p) =>
    p.isSize &&
    css`
      font-size: 10px;
    `}
`;
const SwitchButton = styled.button`
 margin-top: 4px;
  height: 32px;
  ${flexBoxCenter}
  padding: 0;
  border: 3px solid
    ${(props) => (props.isOff ? "#18a7d3ff" : "transparent")}; 
  background: #233a54;
  border-radius: 20px;
  transition: all 0.25s ease;
  
  cursor: pointer;

  ${(props) =>
    (props.disabled || props.isUpdating) &&
    css`
      cursor: not-allowed;
      opacity: 0.5;
      box-shadow: none;
      pointer-events: none;
    `}
`;
const ToggleWrapper = styled.div`
  display: flex;
  width: 70px;
  border-radius: 20px;
  overflow: hidden;
`;

const TogglePart = styled.div`
  flex: 1;
  padding: 5px 0;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.25s ease;
  border-radius: ${(p) =>
    p.children === "ON" ? "20px 0 0 20px" : "0 20px 20px 0"};


  color: ${(p) => {
    if (p.active && p.children === "ON") return "#4caf50"; 
    if (p.active && p.children === "OFF") return "#f44336"; 
    return "#ffffff50"; 
  }};


  background: ${(p) => (p.children === "ON" ? "#1a2c42" : "#233a54")};

  
  transform: ${(p) => (p.active ? "translateY(0)" : "translateY(-2px)")};
  box-shadow: ${(p) =>
    p.active
      ? "inset 0 2px 4px rgba(0,0,0,0.6)" 
      : "0 2px 6px rgba(0, 0, 0, 0.5)"}; 

  

  &:hover {
    opacity: 0.9;
  }
`;

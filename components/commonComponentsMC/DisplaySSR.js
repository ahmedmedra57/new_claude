import { useEffect, useState } from "react";
import { useUserStore } from '../zustand-stores';
import styled, { css } from "styled-components";
import {
  activeInput,
  activeLayer180Deg,
  flexBoxCenter,
  flexDirectionColumn,
  layerA180Deg,
  layerADisabled180Deg,
  layerBDisabled,
  layerCLighter,
} from "../styles/commonStyles";
import {
  essCommandService,
  tesCommandService,
} from "../../services/sendCommand.service";
const DisplaySSR = ({ status, id, isMobile, swtName }) => {
  // console.log(status, "statusxD");
  const userInfo = useUserStore();
  const { isAdministrator } = userInfo;
  const commandService = swtName === "ess" ? essCommandService : tesCommandService;

  // -- temporary variable
  const needToForce = false;
  // -- temporary variable

  // Local state
  const [buttonActivated, setButtonActivated] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const isWarn = status.warn === 1;
  const isTest = status.test === 1;

  useEffect(() => {
    needToForce && setButtonActivated(true);
  }, [needToForce]);

  useEffect(() => {
    if (status.reset === 1 && status.fault) {
      setDisabled(false);
    }else{
      setDisabled(true)
    }
  }, [status.reset, status.fault]);

  const handleForceButtonClick = () => {
    // console.log("testXD",disabled,status.reset,status.fault)

    if (disabled) return;
    if (status.reset === 1 && status.fault) {
      commandService(status.device_id, {
        ssr_no: status.No ,
        ssr_reset: 0,
      });
    }
  };
  // console.log(disabled, "disabledXD");

  return (
    <>
      {isMobile ? (
        <Wrapper isMobile={true}>
          <HeaderTitle isMobile={true}>ssr {id}</HeaderTitle>

          <Outer
            isMobile={true}
            status={status.buttonStatus}
            isTest={isTest}
            isWarn={isWarn}
            needToForce={needToForce}
          >
            <InnerHole status={status.buttonStatus} isMobile={true}>
              <Top status={status.buttonStatus} isMobile={true}>
                <Title status={status} isMobile={true}>
                  {status.buttonStatus}
                </Title>
              </Top>
            </InnerHole>
          </Outer>
        </Wrapper>
      ) : (
        <Wrapper id={id}>
          <HeaderTitle>ssr {id}</HeaderTitle>

          <Button
            status={status.buttonStatus}
            disabled={(!isAdministrator && !buttonActivated) || disabled}
            onClick={() => handleForceButtonClick()}
          >
            <Outer
              status={status.buttonStatus}
              disabled={disabled}
              needToForce={needToForce}
              isTest={isTest}
              isWarn={isWarn}
            >
              <InnerHole status={status.buttonStatus}>
                <Top status={status.buttonStatus}>
                  <Title status={status}>{status.buttonStatus}</Title>
                </Top>
              </InnerHole>
            </Outer>
          </Button>
        </Wrapper>
      )}
    </>
  );
};

export default DisplaySSR;

const Wrapper = styled.div`
  ${(p) =>
    p.isMobile
      ? css`
          width: 54px;
          height: 46px;
          background: #203351 0% 0% no-repeat padding-box;
          box-shadow: inset 0px 1px 2px #000000;
          border-radius: 8px 8px 15px 15px;
          ${flexDirectionColumn};
          padding: 2px 0;
        `
      : css`
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          align-items: center;

          padding: 6px 0;

          ${(p) =>
            p.id === 4 &&
            css`
              margin-right: 60px;
            `}
        `}
`;

const HeaderTitle = styled.span`
  text-align: center;

  ${(p) =>
    p.isMobile
      ? css`
          font-size: 10px;
        `
      : css`
          font-size: 12px;
          margin-bottom: 0.3rem;
        `}
`;

const Button = styled.button`
  width: 52px;
  height: 29px;
  border-radius: 27px;

  ${layerCLighter};
  ${flexBoxCenter};

  ${(p) =>
    p.disabled &&
    css`
      cursor: not-allowed;
    `}
`;

const Outer = styled.div`
  ${flexBoxCenter}

  width: 50px;
  height: 27px;
  border-radius: 25px;
  ${activeLayer180Deg};

  ${(p) =>
    p.status === "off" &&
    css`
      ${layerADisabled180Deg};
    `}

  ${(p) =>
    p.needToForce &&
    css`
      border: 1px solid #83ffff;
    `};

  ${(p) =>
    p.isTest &&
    css`
      border: 2px solid #07a6dd;
    `};

  ${(p) =>
    p.isWarn &&
    css`
      border: 1px solid #ff7800;
    `};

  ${(p) =>
    p.status === "flt" &&
    css`
      ${layerADisabled180Deg};
      border: 1px solid red;
    `};
`;
const InnerHole = styled.div`
  ${flexBoxCenter}

  width: 39px;
  height: 17px;
  border-radius: 20px;

  width: 39px;
  height: 17px;
  border-radius: 20px;

  ${activeInput};

  ${(p) =>
    p.status === "off" &&
    css`
      ${layerBDisabled};
    `}
`;

const Top = styled.div`
  width: 37px;
  height: 15px;
  border-radius: 25px;

  ${activeLayer180Deg};

  ${flexBoxCenter}
  ${(p) =>
    p.status === "off" &&
    css`
      ${layerADisabled180Deg};
    `}

    ${(p) =>
    p.status === "flt" &&
    css`
      ${layerADisabled180Deg};
    `}
`;

const Title = styled.span`
  ${flexBoxCenter}
  font-size: 11px;

  width: 38px;
  height: 16px;
  border-radius: 25px;
`;

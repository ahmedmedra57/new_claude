import { useState, useRef, useEffect } from 'react';
import { useAdminStore, useUserStore } from '../zustand-stores';

import styled from 'styled-components';
import {
  flexBoxCenter,
  layerA,
  layerA180Deg,
  layerB,
} from '../styles/commonStyles';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';


function ContainerLogin({
  setIsSettingOpen,
  isReadyToClose,
  handleClose,
  handleDisplayUploadSitePlan,
}) {
  // state
  const [passwordType, setPasswordType] = useState('password');
  const [passwordInput, setPasswordInput] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  // redux
  const userInfo = useUserStore();

  const { adminPassword, isPasswordBoxOpen } = userInfo;
  

    const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handlePasswordChange = (e) => {
    setPasswordInput(e.target.value);
  };

  const togglePassword = () => {
    if (passwordType === 'password') {
      setPasswordType('text');
      return;
    }
    setPasswordType('password');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwordInput.toLowerCase() === adminPassword.toLowerCase()) {
      useAdminStore().setAccessAdministrator(true);
      setShowErrorMessage(false);
      isReadyToClose && setIsSettingOpen();
      handleClose();
      if (handleDisplayUploadSitePlan) {
        handleDisplayUploadSitePlan();
      }
    } else {
      setPasswordInput('');
      setShowErrorMessage(true);
    }
  };

  return (
    <Wrapper onClick={(e) => e.stopPropagation()}>
      <WrapperHole>
        <WrapperTop>
          <Title>
            admin password <br />
            required
          </Title>

          <XButtonWrapper>
            <XButton onClick={handleClose}>
              <XButtonHole>
                <XButtonTop>X</XButtonTop>
              </XButtonHole>
            </XButton>
          </XButtonWrapper>

          <Form onSubmit={handleSubmit}>
            <Label>password</Label>

            <ContainerInputButton>
              <InputWrap>
                <Input
                  type={passwordType}
                  value={passwordInput}
                  ref={inputRef}
                  placeholder='Input admin password'
                  onChange={handlePasswordChange}
                />
                <HidePasswordWrapper
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    togglePassword();
                  }}
                >
                  {passwordType === 'password' ? (
                    <AiOutlineEyeInvisible />
                  ) : (
                    <AiOutlineEye />
                  )}
                </HidePasswordWrapper>
              </InputWrap>
            </ContainerInputButton>

            <SectionError>
              {showErrorMessage && (
                <WarningMessage>
                  invalid password <br></br>please try again
                </WarningMessage>
              )}
            </SectionError>

            <SectionButton>
              <EnterButton type='submit'>
                <ButtonHole>
                  <ButtonTop>
                    <Title>enter</Title>
                  </ButtonTop>
                </ButtonHole>
              </EnterButton>
            </SectionButton>
          </Form>
        </WrapperTop>
      </WrapperHole>
    </Wrapper>
  );
}

export default ContainerLogin;

const Wrapper = styled.div`
  width: 256px;
  border-radius: 28px;

  ${layerA180Deg};
  ${flexBoxCenter};

  position: relative;
`;
const WrapperHole = styled.div`
  width: 246px;
  border-radius: 24px;

  ${layerA};
  ${flexBoxCenter};
  margin: 5px 0 5px 0;
`;
const WrapperTop = styled.div`
  width: 242px;
  border-radius: 22px;

  ${layerA180Deg};

  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

  margin: 1px 0;
  position: relative;
`;

const XButtonWrapper = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  ${layerB}
  ${flexBoxCenter}

  position: absolute;
  top: 5px;
  right: 5px;
`;
const XButton = styled.button`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  ${layerA180Deg}
  ${flexBoxCenter}
`;

const XButtonHole = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  ${layerB}
  ${flexBoxCenter}
`;
const XButtonTop = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  ${layerA180Deg}
  ${flexBoxCenter}
`;

const Title = styled.span`
  margin-top: 4px;
  text-align: center;
  font-size: 12px;
  letter-spacing: 1.2px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Label = styled.label`
  margin-top: 8px;
  text-align: center;
  font-size: 12px;
  letter-spacing: 1.2px;
`;

const ContainerInputButton = styled.div`
  display: flex;
  align-items: center;
  /* justify-content: center; */
`;

const InputWrap = styled.div`
  width: 236px;
  height: 40px;
  border-radius: 20px;

  ${layerA};
  display: flex;
  align-items: center;
  padding-right: 10px;
  margin-top: 4px;
`;

const Input = styled.input`
  width: 100%;
  height: 100%;
  font-size: 12px;
  padding-left: 20px;
  background: transparent;
  border-radius: 19px;

  ::placeholder {
    color: #fff;
    text-align: LEFT;
  }
`;

const HidePasswordWrapper = styled.div`
  height: 100%;
  ${flexBoxCenter}
  padding-top: 2px;
  font-size: 24px;
`;

const SectionError = styled.section`
  ${flexBoxCenter}
`;
const WarningMessage = styled.p`
  width: 100%;
  height: auto;
  margin: 8px 0 4px 0;

  text-align: center;
  font-size: 12px;
  letter-spacing: 1.2px;
  color: #ff0000;
`;

const SectionButton = styled.section`
  width: 236px;
  height: 40px;
  border-radius: 20px;

  ${layerB};
  ${flexBoxCenter}
  margin: 4px 0;
`;

const EnterButton = styled.button`
  width: 234px;
  height: 38px;
  border-radius: 19px;

  ${layerA180Deg};
  ${flexBoxCenter};
`;

const ButtonHole = styled.div`
  width: 228px;
  height: 32px;
  border-radius: 16px;

  ${layerB};
  ${flexBoxCenter};
`;

const ButtonTop = styled.div`
  width: 226px;
  height: 30px;

  border-radius: 15px;

  ${layerA180Deg};
  ${flexBoxCenter};
`;

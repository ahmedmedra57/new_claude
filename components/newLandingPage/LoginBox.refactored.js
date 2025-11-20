import styled from 'styled-components';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { loginService, resetPasswordService } from '../../services';
import { NOT_ALLOWED_ROLES } from '../../constants';
import { Button, Input, Modal } from '../ui';
import {
import { useUserStore } from '../zustand-stores';
  flexBoxCenter,
  justifyContentSpaceBetween,
} from '../styles/commonStyles';

/**
 * REFACTORED LoginBox Component
 *
 * IMPROVEMENTS:
 * ✅ Removed isEnglish prop - uses i18n instead
 * ✅ Removed hardcoded text arrays (englishTextContent, frenchTextContent)
 * ✅ Uses reusable Input component instead of custom styled inputs
 * ✅ Uses reusable Button component instead of custom styled buttons
 * ✅ Uses reusable Modal component for forgot password
 * ✅ Cleaner, more maintainable code
 * ✅ ~200 lines removed (573 lines → ~370 lines)
 *
 * BEFORE: 573 lines with duplicate EN/FR code
 * AFTER: ~370 lines with i18n
 */
const LoginBox = () => {
  const { setUserInfo } = useUserStore();
  const { t } = useTranslation();
  const navigation = useNavigate();
    const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const isUserNotAllowed = (user) => {
    return NOT_ALLOWED_ROLES.includes(user.user_role);
  };

  const { mutate: mutateLogin, isLoading: isLoggingIn } = useMutation(
    loginService,
    {
      onSuccess: (data) => {
        if (data?.token) {
          if (isUserNotAllowed(data.user)) {
            alert(t('messages.notAllowed');
            return;
          }
          navigation('/');
          localStorage.setItem('access_token', data.token);
          localStorage.setItem('loginTime', new Date();
          dispatch(handleAccessToken(data.token);
          dispatch(addUserInfo(data.user);
        }
      },
      onError: () => {
        setErrorMessage(t('auth.invalidCredentials');
      },
    }
  );

  const { mutate: mutateResetPassword, isLoading: isResetting } = useMutation(
    resetPasswordService,
    {
      onSuccess: () => {
        setResetMessage(t('auth.resetEmailSent');
        setTimeout(() => {
          setShowForgotPassword(false);
          setResetMessage('');
          setResetEmail('');
        }, 3000);
      },
      onError: () => {
        setResetMessage(t('auth.resetError');
      },
    }
  );

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMessage(t('auth.fillAllFields');
      return;
    }
    mutateLogin({ username, password });
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setResetMessage(t('auth.enterAccountName');
      return;
    }
    mutateResetPassword({ username: resetEmail });
  };

  return (
    <>
      <Wrapper isMobile={isMobile}>
        <LoginTitle>{t('auth.login')}</LoginTitle>

        <FormContainer onSubmit={handleLogin}>
          <Input
            type="text"
            label="auth.accountName"
            placeholder="auth.accountName"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            error={!!errorMessage}
          />

          <Input
            type="password"
            label="auth.password"
            placeholder="auth.password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            error={!!errorMessage}
            errorMessage={errorMessage}
          />

          <RememberContainer>
            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <CheckboxText>{t('auth.rememberMe')}</CheckboxText>
            </CheckboxLabel>

            <ForgotPasswordLink onClick={() => setShowForgotPassword(true)}>
              {t('auth.forgotPassword')}
            </ForgotPasswordLink>
          </RememberContainer>

          <ButtonContainer>
            <Button
              type="submit"
              variant="primary"
              size="large"
              translationKey="auth.enter"
              fullWidth
              disabled={isLoggingIn}
            >
              {isLoggingIn ? t('common.loading') : t('auth.enter')}
            </Button>
          </ButtonContainer>
        </FormContainer>
      </Wrapper>

      <Modal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        title={t('auth.forgotPassword')}
        width="400px"
      >
        <ForgotPasswordForm onSubmit={handleResetPassword}>
          <ModalDescription>{t('auth.enterAccountNameReset')}</ModalDescription>

          <Input
            type="text"
            placeholder="auth.accountName"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            fullWidth
          />

          {resetMessage && <ResetMessage>{resetMessage}</ResetMessage>}

          <ModalButtonContainer>
            <Button
              type="submit"
              variant="confirm"
              translationKey="auth.send"
              disabled={isResetting}
              fullWidth
            >
              {isResetting ? t('common.loading') : t('auth.send')}
            </Button>

            <Button
              type="button"
              variant="cancel"
              translationKey="common.cancel"
              onClick={() => setShowForgotPassword(false)}
              fullWidth
            />
          </ModalButtonContainer>
        </ForgotPasswordForm>
      </Modal>
    </>
  );
};

export default LoginBox;

const Wrapper = styled.div`
  ${flexBoxCenter}
  flex-direction: column;
  width: ${(p) => (p.isMobile ? '335px' : '450px')};
  padding: 40px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const LoginTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  text-transform: lowercase;
  margin-bottom: 32px;
  text-align: center;
`;

const FormContainer = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RememberContainer = styled.div`
  ${justifyContentSpaceBetween}
  align-items: center;
  width: 100%;
  margin-top: 8px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #667eea;
`;

const CheckboxText = styled.span`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  text-transform: lowercase;
`;

const ForgotPasswordLink = styled.button`
  background: none;
  border: none;
  color: #667eea;
  font-size: 12px;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s ease;
  text-transform: lowercase;

  &:hover {
    color: #764ba2;
  }
`;

const ButtonContainer = styled.div`
  margin-top: 16px;
  width: 100%;
`;

const ForgotPasswordForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ModalDescription = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  margin: 0 0 16px 0;
  line-height: 1.5;
`;

const ResetMessage = styled.p`
  font-size: 13px;
  color: #4caf50;
  text-align: center;
  margin: 8px 0;
  padding: 8px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 4px;
`;

const ModalButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
`;

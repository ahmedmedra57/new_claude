import { memo, useState } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';

/**
 * Reusable Input Component
 *
 * Replaces 35+ duplicate input field patterns
 *
 * @param {string} type - Input type: 'text' | 'password' | 'email' | 'number'
 * @param {string} placeholder - Placeholder text (translationKey)
 * @param {string} label - Label text (translationKey)
 * @param {*} value - Input value
 * @param {function} onChange - Change handler
 * @param {boolean} error - Error state
 * @param {string} errorMessage - Error message to display
 * @param {boolean} disabled - Disabled state
 * @param {boolean} required - Required field
 * @param {boolean} fullWidth - Make input full width
 * @param {string} name - Input name attribute
 *
 * @example
 * <Input
 *   type="text"
 *   label="auth.accountName"
 *   placeholder="auth.accountName"
 *   value={username}
 *   onChange={(e) => setUsername(e.target.value)}
 * />
 */
const Input = ({
  type = 'text',
  placeholder,
  label,
  value,
  onChange,
  error = false,
  errorMessage,
  disabled = false,
  required = false,
  fullWidth = false,
  name,
  ...props
}) => {
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);

  const placeholderText = placeholder ? t(placeholder) : '';
  const labelText = label ? t(label) : '';

  return (
    <Wrapper fullWidth={fullWidth}>
      {labelText && (
        <Label>
          {labelText}
          {required && <Required>*</Required>}
        </Label>
      )}
      <InputContainer error={error} isFocused={isFocused}>
        <StyledInput
          type={type}
          placeholder={placeholderText}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          required={required}
          name={name}
          {...props}
        />
      </InputContainer>
      {error && errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </Wrapper>
  );
};

export default memo(Input);

const Wrapper = styled.div`
  width: ${(p) => (p.fullWidth ? '100%' : '300px')};
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
  text-transform: capitalize;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Required = styled.span`
  color: #f44336;
  font-size: 14px;
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
  border-bottom: 2px solid
    ${(p) => (p.error ? '#f44336' : p.isFocused ? '#2196f3' : 'rgba(255, 255, 255, 0.3)')};
  transition: border-color 0.3s ease;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px 0;
  background: transparent;
  border: none;
  font-size: 14px;
  color: #fff;
  outline: none;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
    text-transform: lowercase;
  }

  &:focus::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  ${(p) =>
    p.disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
    `}

  /* Remove autofill background */
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 30px #233a54 inset !important;
    -webkit-text-fill-color: #fff !important;
    transition: background-color 5000s ease-in-out 0s;
  }
`;

const ErrorMessage = styled.span`
  font-size: 12px;
  color: #f44336;
  margin-top: 4px;
  animation: slideIn 0.2s ease;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

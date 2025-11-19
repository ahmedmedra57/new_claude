import { memo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { flexBoxCenter } from '../styles/commonStyles';

/**
 * Language Toggle Component
 *
 * Replaces manual language switching with /fr routes
 *
 * @param {string} size - Toggle size: 'small' | 'medium' | 'large'
 * @param {boolean} showFlags - Show flag icons (default: true)
 *
 * @example
 * <LanguageToggle size="medium" />
 */
const LanguageToggle = ({ size = 'medium', showFlags = true }) => {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language;

  const toggleLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <Wrapper size={size}>
      <LanguageButton
        active={currentLanguage === 'en'}
        onClick={() => toggleLanguage('en')}
        size={size}
      >
        {showFlags && <Flag>🇬🇧</Flag>}
        <Text>EN</Text>
      </LanguageButton>

      <Divider />

      <LanguageButton
        active={currentLanguage === 'fr'}
        onClick={() => toggleLanguage('fr')}
        size={size}
      >
        {showFlags && <Flag>🇫🇷</Flag>}
        <Text>FR</Text>
      </LanguageButton>
    </Wrapper>
  );
};

export default memo(LanguageToggle);

const sizeConfig = {
  small: {
    height: '30px',
    buttonWidth: '50px',
    fontSize: '11px',
    flagSize: '16px',
  },
  medium: {
    height: '40px',
    buttonWidth: '60px',
    fontSize: '13px',
    flagSize: '20px',
  },
  large: {
    height: '50px',
    buttonWidth: '70px',
    fontSize: '15px',
    flagSize: '24px',
  },
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: ${(p) => sizeConfig[p.size].height};
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2px;
  gap: 2px;
`;

const LanguageButton = styled.button`
  ${flexBoxCenter}
  gap: 6px;
  width: ${(p) => sizeConfig[p.size].buttonWidth};
  height: calc(100% - 4px);
  background: ${(p) =>
    p.active
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'transparent'};
  border: none;
  border-radius: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0 8px;

  &:hover {
    background: ${(p) =>
      p.active
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        : 'rgba(255, 255, 255, 0.05)'};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Flag = styled.span`
  font-size: ${(p) => sizeConfig[p.size]?.flagSize || '20px'};
  line-height: 1;
`;

const Text = styled.span`
  font-size: ${(p) => sizeConfig[p.size].fontSize};
  font-weight: ${(p) => (p.active ? '700' : '500')};
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Divider = styled.div`
  width: 1px;
  height: 60%;
  background: rgba(255, 255, 255, 0.2);
`;

import styled, { css } from 'styled-components';
import { useForm } from 'react-hook-form';
import { useMediaQuery } from 'react-responsive';
import { useTranslation } from 'react-i18next';
import { breakpoints, devices } from './landing-page-breakpoints/breakpoints';
import { flexBoxCenter } from '../styles/commonStyles';
import { contactUsService } from '../../services';

const ContactForm = () => {
  const { t } = useTranslation();
  const isXl = useMediaQuery({ query: '(min-width:975px)' });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    contactUsService(data);
  };

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Title>{t('contactForm.title')}</Title>
        <FlexRow>
          <FlexColumn firstRow={true}>
            {/* name */}
            <Label>{t('contactForm.fullName')}</Label>
            <Input
              type='text'
              placeholder={t('contactForm.placeholder')}
              {...register('name', { required: true, minLength: 3 })}
              aria-invalid={errors.name ? 'true' : 'false'}
              firstRow={true}
            />
            {errors.name?.type === 'required' && (
              <ErrorTag role='alert'>{t('contactForm.errors.nameRequired')}</ErrorTag>
            )}
          </FlexColumn>
          <FlexColumn firstRow={true}>
            {/* phone */}
            <Label>{t('contactForm.phone')}</Label>
            <Input
              type='number'
              placeholder={t('contactForm.placeholder')}
              {...register('phone', { required: true, minLength: 9 })}
              aria-invalid={errors.phone ? 'true' : 'false'}
              firstRow={true}
            />
            {errors.phone?.type === 'required' && (
              <ErrorTag role='alert'>{t('contactForm.errors.phoneRequired')}</ErrorTag>
            )}
          </FlexColumn>
        </FlexRow>
        <FlexColumn secondRow={true}>
          {/* email */}
          <Label>{t('contactForm.email')}</Label>
          <Input
            type='email'
            placeholder={t('contactForm.placeholder')}
            {...register('mail', {
              required: t('contactForm.errors.emailRequired'),
            })}
            aria-invalid={errors.mail ? 'true' : 'false'}
          />
          {errors.mail && (
            <ErrorTag role='alert'>{errors.mail.message}</ErrorTag>
          )}
        </FlexColumn>
        <FlexColumn>
          {/* your message */}
          <Label>{t('contactForm.message')}</Label>
          <Textarea
            type='text'
            placeholder={t('contactForm.placeholder')}
            {...register('message', { required: true, minLength: 10 })}
            aria-invalid={errors.message ? 'true' : 'false'}
          />
          {errors.message?.type === 'required' && (
            <ErrorTag role='alert'>{t('contactForm.errors.messageMinLength')}</ErrorTag>
          )}
        </FlexColumn>
        <Button type='submit'>
          <InnerButton>
            <IndentLayer>
              <TopLayer>
                <ButtonTitle>{t('contactForm.submit')}</ButtonTitle>
              </TopLayer>
            </IndentLayer>
          </InnerButton>
        </Button>
      </Form>
    </Wrapper>
  );
};

export default ContactForm;

const Wrapper = styled.div`
  display: flex;
  padding: 96px 10px;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  align-self: stretch;

  @media (max-width: ${breakpoints.xl}) {
    width: 100%;
  }
`;

const Form = styled.form`
  width: 904px;
  padding: 80px;

  ${flexBoxCenter}
  flex-direction: column;
  gap: 40px;

  border: 1px solid #fff;

  @media (max-width: ${breakpoints.xl}) {
    width: 100%;
    padding: 40px 30px;
  }
`;

const Title = styled.p`
  text-align: center;
  font-family: Barlow;
  font-size: 38px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  text-transform: capitalize;
`;

const FlexRow = styled.div`
  ${flexBoxCenter}
  gap: 40px;

  @media (max-width: ${breakpoints.xl}) {
    flex-direction: column;
  }
`;

const FlexColumn = styled.div`
  display: flex;
  padding: 24px 40px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
  flex: 1 0 0;

  border-radius: 8px;
  border: 1px solid var(--Grey-15, #262626);
  background: rgba(255, 255, 255, 0.2);

  ${({ firstRow, secondRow }) =>
    firstRow
      ? css`
          height: 144px;
          width: 314px;
          @media (max-width: ${breakpoints.xl}) {
            width: 100%;
          }
        `
      : secondRow
      ? css`
          height: 160px;
          width: 664px;

          @media (max-width: ${breakpoints.xl}) {
            height: 144px;
            width: 100%;
            /* width: 85%; */
          }
        `
      : css`
          min-height: 180px;
          width: 664px;

          @media (max-width: ${breakpoints.xl}) {
            min-height: 280px;
            width: 100%;
            justify-content: start;
          }
        `}
`;
const ErrorTag = styled.p`
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: red;
`;

const Label = styled.label`
  font-family: Inter;
  font-size: 22px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
  text-transform: none;
`;

const Input = styled.input`
  height: 28px;
  width: 100%;
  background-color: transparent;
  border-bottom: 4px solid #333;
  font-size: 18px;
  ::placeholder {
    text-transform: none;
    text-align: left;
  }
  :focus {
    border-color: #2e8cce;
    outline: none; /* Remove the default outline */
    box-shadow: 0 0 10px #2e8cce;
  }
  overflow: scroll;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 82px;
  font-size: 18px;
  background-color: transparent;
  text-align: left;
  border-bottom: 4px solid #333;
  ::placeholder {
    text-transform: none;
    text-align: left;
  }
  :focus {
    border-color: #2e8cce;
    outline: none; /* Remove the default outline */
    box-shadow: 0 0 10px #2e8cce;
  }
  overflow: scroll;
  overflow: hidden;

  @media (max-width: ${breakpoints.xl}) {
    min-height: 182px;
  }
`;

const Button = styled.button`
  display: flex;
  padding: 2px;
  justify-content: center;
  align-items: center;
  gap: 4px;

  border-radius: 22px;
  border: 0.25px solid #000;
  background: rgba(35, 58, 84, 0.4);

  box-shadow: 0px 0px 2px 0px #000 inset;
`;

const InnerButton = styled.div`
  display: flex;
  padding: 3px;
  justify-content: center;
  align-items: center;
  gap: 8px;

  border-radius: 20px;
  border: 0.5px solid #000;
  background: linear-gradient(180deg, #233a54 0%, #060d19 100%);

  box-shadow: 0px 0.5px 1px 0px rgba(255, 255, 255, 0.25) inset;
`;

const IndentLayer = styled.div`
  display: flex;
  padding: 1px;
  justify-content: center;
  align-items: center;

  border-radius: 18px;
  background: var(
    --Light_blue_100,
    linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
    #233a54
  );

  box-shadow: 0px 0px 3px 0px #000 inset;
`;

const TopLayer = styled.div`
  display: flex;
  width: 288px;
  padding: 2px 8px;
  justify-content: center;
  align-items: center;
  gap: 8px;

  border-radius: 16px;
  border: 0.5px solid #000;
  background: linear-gradient(180deg, #233a54 0%, #060d19 100%);

  /* OUT */
  box-shadow: 0px 0.5px 1px 0px rgba(255, 255, 255, 0.25) inset;
`;

const ButtonTitle = styled.p`
  text-align: center;
  font-size: 12px;
`;

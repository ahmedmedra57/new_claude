import { useEffect, useRef } from 'react';
import { useUserStore } from '../../zustand-stores';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import styled, { css } from 'styled-components';
import SettingAppliedMessage from '../../masterControl/userMessages/SettingAppliedMessage';
import {
  alignItemsFlexStart,
  borderABlue,
  flexBoxCenter,
  justifyContentFlexStart,
  justifyContentSpaceAround,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerA90Deg,
  layerB,
} from '../../styles/commonStyles';
import ErrorMessageBox from '../messageBoxes/ErrorMessageBox';
import InvisibleDivForEditButton from '../messageBoxes/InvisibleDivForEditButton';
import TitleOfSelectedOption from '../TitleOfSelectedOption';
import UploadBox from './UploadImageBox';
import EditCancelApplyButtons from '../buttons/EditCancelApplyButtons';
import LoadingIcon from '../../loading/LoadingIcon';

const UserProfileMain = ({
  setProfileInputsData,
  profileInputsData,
  setOpenUploadBox,
  openUploadBox,
  handleUploadImage,
  firstNameElement,
  familyNameElement,
  titleElement,
  workPhoneElement,
  cellPhoneElement,
  faxElement,
  emailElement,
  companyElement,
  addressElement,
  selectHonorific,
  setSelectHonorific,
  messageBoxContent,
  openMessageBox,
  handleCloseMessageBox,
  handleEditCancelApplyButtons,
}) => {
  // media query
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  const honorificTitles = ['mr.', 'ms.'];
  const InputsTitlesOfPersonalInfo = ['first name:', 'family name:', 'title:'];
  const InputsTitlesOfContactInfo = [
    'work phone:',
    'cellphone:',
    'fax:',
    'email:',
  ];
  const InputTitlesOfCompanyInfo = ['company:', 'address:'];
  const InputTitlesOfChangePassword = ['password:', 'new password:'];

  // const title = 'incorrect password';
  const message = {
    title: 'settings',
    subtitle: 'profile information',
    theme: 'incorrect password',
    content:
      "new password and confirm new password don't match or invalid password",
  };

  // useRef

  const passwordElement = useRef(null);
  const newPasswordElement = useRef(null);
  const confirmPasswordElement = useRef(null);

  // useState

  const [openErrorMessageBox, setOpenErrorMessageBox] = useState(false);
  const [checkNumber, setCheckNumber] = useState(false);
  const [checkUpperCase, setCheckUpperCase] = useState(false);
  const [checkLength, setCheckLength] = useState(false);
  const [isPasswordHidden, setIsPasswordHidden] = useState([true, true, true]);
  const [isNewPasswordConfirmed, setIsNewPasswordConfirmed] = useState(false);

  // redux
  const UserState = useUserStore();
  const { user } = UserState;
  const buttonsState = useSelector(selectEditCancelApplyButtons);
  const { isEdit } = buttonsState;

  // changePassword, companyInfo, contactInfo, personalInfo
  // useEffect to bring back what was saved previously in profiled info
  useEffect(() => {
    user.gender === 'male'
      ? setSelectHonorific(0)
      : user.gender === 'female'
      ? setSelectHonorific(1)
      : setSelectHonorific(null);

    const assignValuesList = [
      {
        element: firstNameElement,
        value: user.firstname,
      },
      {
        element: familyNameElement,
        value: user.lastname,
      },
      {
        element: titleElement,
        value: user.title,
      },
      {
        element: workPhoneElement,
        value: user.phone,
      },
      {
        element: cellPhoneElement,
        value: user.cell_phone,
      },
      {
        element: faxElement,
        value: user.fax,
      },
      {
        element: emailElement,
        value: user.email,
      },
      {
        element: companyElement,
        value: user.company_name,
      },
      {
        element: addressElement,
        value: user.company_location,
      },
    ];

    assignValuesList.forEach((assignValue) => {
      if (!!assignValue.value)
        assignValue.element.current.value = assignValue.value;
    });
  }, []);

  // logic to check password validity
  const handleVerificationPassword = () => {
    setCheckNumber(false);
    setCheckUpperCase(false);
    setCheckLength(false);
    const newPasswordRef = newPasswordElement.current.value;

    if (newPasswordRef) {
      newPasswordRef.length > 5 && setCheckLength(true);
    }
    for (var i = 0; i < newPasswordRef.length; i++) {
      if (!isNaN(newPasswordRef.charAt(i))) {
        setCheckNumber(true);
      }
      if (
        newPasswordRef.charAt(i) === newPasswordRef.charAt(i).toUpperCase() &&
        newPasswordRef.charAt(i).match(/[a-z]/i)
      ) {
        setCheckUpperCase(true);
      }
    }
  };

  const handleCloseErrorBox = () => {
    return setOpenErrorMessageBox(!openErrorMessageBox);
  };

  // handle confirm button of change password. check input password is valid and check new password and confirm new password match.
  const handleChangePasswordButton = () => {
    if (
      newPasswordElement.current.value === confirmPasswordElement.current.value
    ) {
      const copyProfileInputsData = { ...profileInputsData };
      copyProfileInputsData.new_password = newPasswordElement.current.value;
      copyProfileInputsData.current_password = passwordElement.current.value;
      setProfileInputsData(copyProfileInputsData);

      checkNumber &&
        checkUpperCase &&
        checkLength &&
        setIsNewPasswordConfirmed(true);
      return;
    } else {
      const copyProfileInputsData = { ...profileInputsData };
      delete copyProfileInputsData['current_password'];
      delete copyProfileInputsData['new_password'];
      setProfileInputsData(copyProfileInputsData);
      handleCloseErrorBox();
    }
  };

  const handlePasswordChangeHideLogo = (index) => {
    const copyIsPasswordHidden = [...isPasswordHidden];
    copyIsPasswordHidden[index] = !copyIsPasswordHidden[index];
    setIsPasswordHidden(copyIsPasswordHidden);
  };

  return (
    <>
      {isMobile ? (
        <BaseLayer isMobile={true}>
          <Wrapper isMobile={true}>
            {!isEdit && (
              <EditBoxWrapper>
                <InvisibleDivForEditButton height={'937px'} />
              </EditBoxWrapper>
            )}

            {/* personal information */}
            <>
              <SubTitleWrapper isMobile={true} isFirstChild={true}>
                <SubTitle isMobile={true}>personal information</SubTitle>
              </SubTitleWrapper>
              <SmallWrapper position={true} isMobile={true}>
                <UserImg
                  src={user?.avatar ? user?.avatar : '/images/dummyPicture.svg'}
                />
                <ButtonWrapper
                  onClick={() => setOpenUploadBox(true)}
                  isMobile={true}
                >
                  <Button isMobile={true}>
                    <ButtonHole isMobile={true}>
                      <ButtonTop isMobile={true}>
                        <InputTitle isMobile={true}>upload image</InputTitle>
                      </ButtonTop>
                    </ButtonHole>
                  </Button>
                </ButtonWrapper>
                {openUploadBox && (
                  <UploadBoxWrapper isMobile={true}>
                    <UploadBox
                      handleUploadImage={handleUploadImage}
                      closeUploadBox={() => setOpenUploadBox(false)}
                    />
                  </UploadBoxWrapper>
                )}
                <FlexColumn isMobile={true}>
                  {honorificTitles.map((title, idx) => {
                    return (
                      <FlexRow key={title + idx}>
                        <OuterCircles
                          onClick={() => setSelectHonorific(idx)}
                          isMobile={true}
                        >
                          <InnerCircles
                            selectHonorific={selectHonorific === idx}
                            isMobile={true}
                          ></InnerCircles>
                        </OuterCircles>
                        <Honorific>{title}</Honorific>
                      </FlexRow>
                    );
                  })}
                </FlexColumn>
              </SmallWrapper>
              {/* <FlexWrapper key={index} isMobile={true}>
                    </FlexWrapper> */}
              <FormWrapper index={0} isMobile={true}>
                {InputsTitlesOfPersonalInfo.map((title, index) => {
                  return (
                    <InputTitle isMobile={true} key={title + index}>
                      {title}
                      <IndivInput
                        type='text'
                        placeholder='Type here...'
                        // defaultValue={""}
                        ref={
                          index === 0
                            ? firstNameElement
                            : index === 1
                            ? familyNameElement
                            : titleElement
                        }
                        isMobile={true}
                      ></IndivInput>
                    </InputTitle>
                  );
                })}
              </FormWrapper>
            </>

            {/* company information */}
            <>
              <SubTitleWrapper isMobile={true}>
                <SubTitle isMobile={true}>company information</SubTitle>
              </SubTitleWrapper>
              {/* <FlexWrapper key={index} isMobile={true}>
                    </FlexWrapper> */}

              <FormWrapper index={1} isMobile={true}>
                {InputTitlesOfCompanyInfo.map((title, index) => {
                  return (
                    <InputTitle key={title + index} isMobile={true}>
                      {title}
                      <IndivInput
                        placeholder='Type here...'
                        type='text'
                        ref={index === 0 ? companyElement : addressElement}
                        isMobile={true}
                      ></IndivInput>
                    </InputTitle>
                  );
                })}
              </FormWrapper>
            </>
            {/* contact information */}
            <>
              <SubTitleWrapper isMobile={true}>
                <SubTitle isMobile={true}>contact information</SubTitle>
              </SubTitleWrapper>
              {/* <FlexWrapper key={index} isMobile={true}>
                    </FlexWrapper> */}
              <FormWrapper index={2} isMobile={true}>
                {InputsTitlesOfContactInfo.map((title, index) => {
                  return (
                    <InputTitle key={title + index} isMobile={true}>
                      {title}
                      <IndivInput
                        placeholder='Type here...'
                        type='text'
                        ref={
                          index === 0
                            ? workPhoneElement
                            : index === 1
                            ? cellPhoneElement
                            : index === 2
                            ? faxElement
                            : emailElement
                        }
                        isMobile={true}
                      ></IndivInput>
                    </InputTitle>
                  );
                })}
              </FormWrapper>
            </>

            {/* change password */}
            <BaseLayerMobile>
              <InfoOrPasswordWrapper isMobile={true}>
                <SubTitleWrapper margin={true} isMobile={true} smallSize={true}>
                  <SubTitle isMobile={true}>change password</SubTitle>
                </SubTitleWrapper>
                {/* <FlexWrapper key={index} isMobile={true}>
                      </FlexWrapper> */}
                {/* <PositionForLogo>
                          <IndivInput
                            placeholder='Type here...'
                            index={2}
                            type={isPasswordHidden[index] ? 'password' : 'text'}
                            ref={
                              index === 0 ? passwordElement : newPasswordElement
                            }
                            isMobile={true}
                            smallSize={true}
                          ></IndivInput>

                          <PasswordLogo
                            src={
                              isPasswordHidden[index]
                                ? './images/settings-showPassword-logo.svg'
                                : './images/settings-hidePasswordLogo.svg'
                            }
                            onClick={() => handlePasswordChangeHideLogo(index)}
                          />
                        </PositionForLogo> */}

                <FormWrapper index={3} isMobile={true}>
                  {InputTitlesOfChangePassword.map((title, index) => {
                    return (
                      <InputTitle isMobile={true} key={title + index}>
                        {title}{' '}
                        <IndivInput
                          // placeholder='Type here...'
                          index={2}
                          type={isPasswordHidden[index] ? 'password' : 'text'}
                          ref={
                            index === 0 ? passwordElement : newPasswordElement
                          }
                          isMobile={true}
                          smallSize={true}
                        ></IndivInput>
                        <PasswordLogo
                          src={
                            isPasswordHidden[index]
                              ? './images/settings-showPassword-logo.svg'
                              : './images/settings-hidePasswordLogo.svg'
                          }
                          onClick={() => handlePasswordChangeHideLogo(index)}
                        />
                      </InputTitle>
                    );
                  })}
                </FormWrapper>

                <PasswordCheckWrapper isMobile={true}>
                  <FlexRowCheck isMobile={true}>
                    <Img
                      src={
                        checkLength
                          ? './images/settings-userProfile-passwordCheck-check.svg'
                          : './images/settings-userProfile-passwordCheck-x.svg'
                      }
                    />
                    <Check isColor={checkLength} isMobile={true}>
                      6 characters minimum
                    </Check>
                  </FlexRowCheck>
                  <FlexRowCheck isMobile={true}>
                    <Img
                      src={
                        checkUpperCase
                          ? './images/settings-userProfile-passwordCheck-check.svg'
                          : './images/settings-userProfile-passwordCheck-x.svg'
                      }
                    />
                    <Check isColor={checkUpperCase} isMobile={true}>
                      one uppercase
                    </Check>
                  </FlexRowCheck>
                  <FlexRowCheck isMobile={true}>
                    <Img
                      src={
                        checkNumber
                          ? './images/settings-userProfile-passwordCheck-check.svg'
                          : './images/settings-userProfile-passwordCheck-x.svg'
                      }
                    />
                    <Check isColor={checkNumber} isMobile={true}>
                      must contain one number
                    </Check>
                  </FlexRowCheck>
                </PasswordCheckWrapper>
                <FormWrapper isMobile={true}>
                  <FlexWrapper index={2} isMobile={true}>
                    {/* <PositionForLogo index={2}>
                    </PositionForLogo> */}
                    <InputTitle index={2} isMobile={true}>
                      confirm <br />
                      new password:
                      <IndivInput
                        index={2}
                        type={isPasswordHidden[2] ? 'password' : 'text'}
                        ref={confirmPasswordElement}
                        isMobile={true}
                        smallSize={true}
                      ></IndivInput>
                      <PasswordLogo
                        src={
                          isPasswordHidden[2]
                            ? './images/settings-showPassword-logo.svg'
                            : './images/settings-hidePasswordLogo.svg'
                        }
                        onClick={() => handlePasswordChangeHideLogo(2)}
                      />
                    </InputTitle>

                    {/* <PositionForLogo index={2}>
                      <InputTitle index={2} isMobile={true}>
                        confirm <br />
                        new password:
                      </InputTitle>
                      <IndivInput
                        index={2}
                        type={isPasswordHidden[2] ? 'password' : 'text'}
                        ref={confirmPasswordElement}
                        isMobile={true}
                        smallSize={true}
                      ></IndivInput>

                      <PasswordLogo
                        src={
                          isPasswordHidden[2]
                            ? './images/settings-showPassword-logo.svg'
                            : './images/settings-hidePasswordLogo.svg'
                        }
                        onClick={() => handlePasswordChangeHideLogo(2)}
                      />
                    </PositionForLogo> */}
                  </FlexWrapper>
                </FormWrapper>
                <ButtonWrapper
                  index={1}
                  onClick={() => {
                    handleVerificationPassword();
                    handleChangePasswordButton();
                  }}
                  isMobile={true}
                  isNewPasswordConfirmed={isNewPasswordConfirmed}
                >
                  <Button index={1} isMobile={true}>
                    <ButtonHole index={1} isMobile={true}>
                      <ButtonTop index={1} isMobile={true}>
                        <ButtonTitle isMobile={true}>confirm</ButtonTitle>
                      </ButtonTop>
                    </ButtonHole>
                  </Button>
                </ButtonWrapper>
              </InfoOrPasswordWrapper>
            </BaseLayerMobile>

            {openErrorMessageBox && (
              <ErrorMessageWrapper>
                <ErrorMessageBox
                  message={message}
                  handleClose={handleCloseErrorBox}
                />
              </ErrorMessageWrapper>
            )}
            {openMessageBox && (
              <SettingAppliedMessage
                message={messageBoxContent}
                onClose={handleCloseMessageBox}
              />
            )}
          </Wrapper>
        </BaseLayer>
      ) : (
        <BaseLayer>
          <Wrapper>
            {!isEdit && (
              <EditBoxWrapper>
                <InvisibleDivForEditButton height={'462px'} />
              </EditBoxWrapper>
            )}
            <TitleWrapper>
              <TitleOfSelectedOption title={'profile information'} />
            </TitleWrapper>
            <ContentsWrapper>
              {/* personal information */}
              <InfoOrPasswordWrapper index={0}>
                <SubTitleWrapper>
                  <SubTitle>personal information</SubTitle>
                </SubTitleWrapper>
                <SmallWrapper position={true}>
                  <UserImg
                    src={
                      user?.avatar ? user?.avatar : '/images/dummyPicture.svg'
                    }
                  />
                  <ButtonWrapper onClick={() => setOpenUploadBox(true)}>
                    <Button>
                      <ButtonHole>
                        <ButtonTop>
                          <InputTitle>upload image</InputTitle>
                        </ButtonTop>
                      </ButtonHole>
                    </Button>
                  </ButtonWrapper>
                  {openUploadBox && (
                    <UploadBoxWrapper>
                      <UploadBox
                        handleUploadImage={handleUploadImage}
                        closeUploadBox={setOpenUploadBox}
                      />
                    </UploadBoxWrapper>
                  )}
                  <FlexColumn>
                    {honorificTitles.map((title, idx) => {
                      return (
                        <FlexRow key={idx}>
                          <OuterCircles onClick={() => setSelectHonorific(idx)}>
                            <InnerCircles
                              selectHonorific={selectHonorific === idx}
                            ></InnerCircles>
                          </OuterCircles>
                          <Honorific>{title}</Honorific>
                        </FlexRow>
                      );
                    })}
                  </FlexColumn>
                </SmallWrapper>
                <FormWrapper index={0}>
                  {InputsTitlesOfPersonalInfo.map((title, index) => {
                    return (
                      <FlexWrapper key={index}>
                        <InputTitle>{title}</InputTitle>
                        <IndivInput
                          type='text'
                          placeholder='Type here...'
                          ref={
                            index === 0
                              ? firstNameElement
                              : index === 1
                              ? familyNameElement
                              : titleElement
                          }
                        ></IndivInput>
                      </FlexWrapper>
                    );
                  })}
                </FormWrapper>
              </InfoOrPasswordWrapper>

              {/* contact information */}
              <InfoOrPasswordWrapper index={1}>
                <SubTitleWrapper>
                  <SubTitle>contact information</SubTitle>
                </SubTitleWrapper>
                <FormWrapper index={1}>
                  {InputsTitlesOfContactInfo.map((title, index) => {
                    return (
                      <FlexWrapper key={index}>
                        <InputTitle>{title}</InputTitle>
                        <IndivInput
                          type='text'
                          placeholder='Type here...'
                          ref={
                            index === 0
                              ? workPhoneElement
                              : index === 1
                              ? cellPhoneElement
                              : index === 2
                              ? faxElement
                              : emailElement
                          }
                        ></IndivInput>
                      </FlexWrapper>
                    );
                  })}
                </FormWrapper>
              </InfoOrPasswordWrapper>

              {/* company information */}
              <GridWrapper>
                <InfoOrPasswordWrapper index={2}>
                  <SubTitleWrapper>
                    <SubTitle>company information</SubTitle>
                  </SubTitleWrapper>

                  <FormWrapper index={2}>
                    {InputTitlesOfCompanyInfo.map((title, index) => {
                      return (
                        <FlexWrapper key={index}>
                          <InputTitle>{title}</InputTitle>
                          <IndivInput
                            placeholder='Type here...'
                            type='text'
                            ref={index === 0 ? companyElement : addressElement}
                          ></IndivInput>
                        </FlexWrapper>
                      );
                    })}
                  </FormWrapper>
                </InfoOrPasswordWrapper>
              </GridWrapper>

              {/* change password */}
              <InfoOrPasswordWrapper>
                <SubTitleWrapper>
                  <SubTitle>change password</SubTitle>
                </SubTitleWrapper>
                <FormWrapper index={2}>
                  {InputTitlesOfChangePassword.map((title, index) => {
                    return (
                      <FlexWrapper key={index}>
                        <InputTitle>{title}</InputTitle>
                        <PositionForLogo>
                          <IndivInput
                            index={2}
                            type={isPasswordHidden[index] ? 'password' : 'text'}
                            ref={
                              index === 0 ? passwordElement : newPasswordElement
                            }
                          ></IndivInput>

                          <PasswordLogo
                            src={
                              isPasswordHidden[index]
                                ? './images/settings-showPassword-logo.svg'
                                : './images/settings-hidePasswordLogo.svg'
                            }
                            onClick={() => handlePasswordChangeHideLogo(index)}
                          />
                        </PositionForLogo>
                      </FlexWrapper>
                    );
                  })}
                </FormWrapper>
                <PasswordCheckWrapper>
                  <FlexRowCheck>
                    <Img
                      src={
                        checkLength
                          ? './images/settings-userProfile-passwordCheck-check.svg'
                          : './images/settings-userProfile-passwordCheck-x.svg'
                      }
                    />
                    <Check isColor={checkLength}>6 characters minimum</Check>
                  </FlexRowCheck>
                  <FlexRowCheck>
                    <Img
                      src={
                        checkUpperCase
                          ? './images/settings-userProfile-passwordCheck-check.svg'
                          : './images/settings-userProfile-passwordCheck-x.svg'
                      }
                    />
                    <Check isColor={checkUpperCase}>one uppercase</Check>
                  </FlexRowCheck>
                  <FlexRowCheck>
                    <Img
                      src={
                        checkNumber
                          ? './images/settings-userProfile-passwordCheck-check.svg'
                          : './images/settings-userProfile-passwordCheck-x.svg'
                      }
                    />
                    <Check isColor={checkNumber}>must contain one number</Check>
                  </FlexRowCheck>
                </PasswordCheckWrapper>
                <FormWrapper>
                  <FlexWrapper index={2}>
                    <InputTitle index={2}>confirm new password:</InputTitle>
                    <PositionForLogo>
                      <IndivInput
                        index={2}
                        type={isPasswordHidden[2] ? 'password' : 'text'}
                        ref={confirmPasswordElement}
                      ></IndivInput>

                      <PasswordLogo
                        src={
                          isPasswordHidden[2]
                            ? './images/settings-showPassword-logo.svg'
                            : './images/settings-hidePasswordLogo.svg'
                        }
                        onClick={() => handlePasswordChangeHideLogo(2)}
                      />
                    </PositionForLogo>
                  </FlexWrapper>
                </FormWrapper>
                <ButtonWrapper
                  index={1}
                  onClick={() => {
                    handleVerificationPassword();
                    handleChangePasswordButton();
                  }}
                  isNewPasswordConfirmed={isNewPasswordConfirmed}
                >
                  <Button index={1}>
                    <ButtonHole index={1}>
                      <ButtonTop index={1}>
                        <ButtonTitle>confirm</ButtonTitle>
                      </ButtonTop>
                    </ButtonHole>
                  </Button>
                </ButtonWrapper>
              </InfoOrPasswordWrapper>
            </ContentsWrapper>

            {openErrorMessageBox && (
              <ErrorMessageWrapper>
                <ErrorMessageBox
                  message={message}
                  handleClose={handleCloseErrorBox}
                />
              </ErrorMessageWrapper>
            )}
            {openMessageBox && (
              <SettingAppliedMessage
                message={messageBoxContent}
                onClose={handleCloseMessageBox}
              />
            )}
          </Wrapper>
        </BaseLayer>
      )}
    </>
  );
};

export default UserProfileMain;

const BaseLayer = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 314px;
          height: 937px;
          border-radius: 16px;
        `
      : css`
          width: 873px;
          height: 467px;
          border-radius: 7px;
        `}

  ${layerA}

  ${flexBoxCenter}
  position: relative;
`;

const Wrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 310px;
          height: 933px;
          border-radius: 14px;
          ${layerA90Deg}
          ${flexBoxCenter}
        `
      : css`
          width: 869px;
          height: 463px;
          border-radius: 5px;
          ${layerA180Deg}
          ${justifyContentSpaceAround}
        `}

  flex-direction: column;
  gap: 18rem;
`;

const EditBoxWrapper = styled.div`
  z-index: 100;
  position: absolute;
`;

const TitleWrapper = styled.div`
  margin-top: 2px;
`;

const ContentsWrapper = styled.div`
  width: 859px;
  height: 391px;
  margin-bottom: 2px;

  ${layerA}

  border-radius: 7px;
  opacity: 1;

  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  column-gap: 1px;
  row-gap: 1rem;
  align-items: center;
  justify-items: center;
`;

const InfoOrPasswordWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 294px;
          height: 261px;
          ${layerA90Deg}
          border-radius: 12px;
          ${justifyContentSpaceAround}
          flex-direction: column;
        `
      : css`
          width: 423px;
          height: 184px;
          ${({ index }) =>
            index === 0
              ? css`
                  gap: 1rem;
                `
              : index === 1
              ? css`
                  gap: 12rem;
                `
              : index === 2
              ? css`
                  height: 114px;
                  gap: 5rem;
                `
              : css`
                  height: 197px;
                  margin-bottom: 3px;
                `}

          border-radius: 5px;
          ${layerA180Deg}
          ${flexBoxCenter}
          flex-direction: column;
        `}
`;

const SubTitleWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 298px;
          height: 32px;
          ${({ smallSize }) =>
            smallSize &&
            css`
              width: 281px;
              margin-top: 4px;
            `}

          ${({ isFirstChild }) =>
            isFirstChild &&
            css`
              margin-top: 4px;
            `}
        `
      : css`
          width: 413px;
          height: 32px;
        `}

  ${({ margin }) =>
    margin &&
    css`
      margin-bottom: 2px;
    `}

  ${layerA}
  border-radius: 16px;
  opacity: 1;
  ${flexBoxCenter}
`;

const SubTitle = styled.p`
  ${({ isMobile }) =>
    isMobile
      ? css`
          font-size: 14px;
          letter-spacing: 1.4px;
        `
      : css`
          font-size: 12px;
          letter-spacing: 1.2px;
        `}

  text-align: center;
  color: #ffffff;
`;

const SmallWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 300px;
          height: 70px;
        `
      : css`
          width: 380px;
          height: 42px;
        `}

  ${({ position }) =>
    position &&
    css`
      position: relative;
    `}

  ${justifyContentSpaceBetween}
`;

const UserImg = styled.img`
  width: 37px;
  height: 37px;
  border-radius: 50%;
  object-fit: 'cover';
`;

const ButtonWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 164px;
          height: 34px;
          border-radius: 19px;
          ${({ index }) =>
            index === 1 &&
            css`
              width: 284px;
              height: 32px;
              margin-top: 2px;
              border-radius: 18px;
            `}
          ${({ isNewPasswordConfirmed }) =>
            isNewPasswordConfirmed &&
            css`
              border: 1px solid #95ff45;
            `}
            &:last-child {
            margin-bottom: 4px;
          }
        `
      : css`
          width: 209px;
          height: 29px;
          ${({ index }) =>
            index === 1 &&
            css`
              width: 413px;
              height: 27px;
              margin-top: 2px;
            `}
          ${({ isNewPasswordConfirmed }) =>
            isNewPasswordConfirmed &&
            css`
              border: 1px solid #95ff45;
            `}
          border-radius: 27px;
        `}

  ${layerB}

  ${flexBoxCenter}
`;

const Button = styled.button`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 162px;
          height: 32px;
          border-radius: 16px;
          ${({ index }) =>
            index === 1 &&
            css`
              width: 282px;
              height: 30px;
              border-radius: 25px;
            `}
        `
      : css`
          width: 207px;
          height: 27px;
          ${({ index }) =>
            index === 1 &&
            css`
              width: 411px;
              height: 25px;
            `}

          border-radius: 25px;
        `}

  ${layerA180Deg}
 
  ${flexBoxCenter}
`;

const ButtonHole = styled.div`
  border-radius: 20px;
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 156px;
          height: 26px;
          ${({ index }) =>
            index === 1 &&
            css`
              width: 274px;
              height: 22px;
              border-radius: 18px;
            `}
        `
      : css`
          width: 201px;
          height: 21px;
          ${({ index }) =>
            index === 1 &&
            css`
              width: 405px;
              height: 19px;
            `}
        `}

  ${layerB}

  ${flexBoxCenter}
`;

const ButtonTop = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 154px;
          height: 24px;
          ${({ index }) =>
            index === 1 &&
            css`
              width: 272px;
              height: 21px;
            `}
        `
      : css`
          width: 199px;
          height: 19px;
          ${({ index }) =>
            index === 1 &&
            css`
              width: 403px;
              height: 17px;
            `}
        `}

  ${layerA180Deg}
  border-radius: 25px;

  ${flexBoxCenter}
`;

const ButtonTitle = styled.p`
  font-size: 9px;
  letter-spacing: 0.9px;
  margin-left: 4px;
`;

const UploadBoxWrapper = styled.div`
  width: 100%;
  height: 100%;
  ${({ isMobile }) =>
    isMobile
      ? css`
          left: 40px;
          top: 16px;
        `
      : css`
          left: 75px;
          top: 8px;
        `}
  position: absolute;
`;

const FlexRow = styled.div`
  cursor: pointer;
  ${flexBoxCenter};

  gap: 8rem;
`;

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  ${({ isMobile }) =>
    isMobile
      ? css`
          gap: 6px;
        `
      : css`
          gap: 2px;
        `}
`;

const OuterCircles = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 28px;
          height: 28px;
        `
      : css`
          width: 20px;
          height: 20px;
        `}

  border: 1px solid #95ff45;
  border-radius: 50%;
  opacity: 1;
  ${flexBoxCenter}
`;

const InnerCircles = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 18px;
          height: 18px;
        `
      : css`
          width: 12px;
          height: 12px;
        `}

  ${({ selectHonorific }) =>
    selectHonorific &&
    css`
      background: #95ff45;
    `}

  border-radius: 50%;
  opacity: 1;
`;

const Honorific = styled.span`
  font-size: 14px;
  letter-spacing: 1.4px;
  color: #ffffff;
  opacity: 1;
`;

const FormWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 298px;
          ${({ index }) =>
            index === 0
              ? css`
                  height: 128px;
                `
              : index === 1
              ? css`
                  height: 86px;
                `
              : index === 2
              ? css`
                  height: 168px;
                `
              : index === 3
              ? css`
                  height: 86px;
                  width: 281px;
                `
              : css`
                  height: 42px;
                  width: 281px;
                `}
          border-radius: 9px;
        `
      : css`
          width: 413px;
          ${({ index }) =>
            index === 0
              ? css`
                  height: 96px;
                `
              : index === 1
              ? css`
                  height: 128px;
                `
              : index === 2
              ? css`
                  height: 64px;
                `
              : css`
                  height: 32px;
                `}
          border-radius: 16px;
        `}

  ${layerA}

  display: flex;
  justify-content: space-evenly;
  align-items: flex-start;
  flex-direction: column;
`;

const FlexWrapper = styled.div`
  width: 100%;
  ${({ isMobile }) =>
    isMobile
      ? css``
      : css`
          ${({ index }) =>
            index === 2 &&
            css`
              width: 413px;
            `}
        `}
  ${justifyContentSpaceBetween}
`;

const InputTitle = styled.label`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 100%;
          font-size: 9px;
          letter-spacing: 0.9px;
          margin-left: 4px;
          ${justifyContentSpaceBetween}
          position: relative;
        `
      : css`
          font-size: 10px;
          letter-spacing: 1px;
          ${({ index }) =>
            index === 2 &&
            css`
              width: 115px;
              text-align: left;
            `}
          margin-left: 6px;
        `}
  ::placeholder {
    color: #808080;
  }
`;

let IndivInput = styled.input`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 199px;
          height: 32px;

          margin-right: 4px;
          ${({ smallSize }) =>
            smallSize &&
            css`
              width: 132px;
            `}
        `
      : css`
          width: 311px;
          height: 28px;
          margin-right: 2px;
          ${({ index }) =>
            index === 2 &&
            css`
              width: 288px;
            `}
        `}

  background: transparent;
  ${borderABlue}
  border-radius: 16px;
  ::placeholder {
    color: #808080;
  }
`;

const PasswordCheckWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 175px;
        `
      : css`
          width: 313px;
          ${justifyContentSpaceBetween}
          flex-wrap: wrap;
        `}
`;

const PositionForLogo = styled.div`
  ${({ index }) =>
    index === 2 &&
    css`
      width: 100%;
    `}

  position: relative;
  ${justifyContentSpaceBetween}
`;

const PasswordLogo = styled.img`
  cursor: pointer;
  position: absolute;
  right: 8px;
  top: 4px;
  z-index: 2;
`;

const FlexRowCheck = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          ${justifyContentFlexStart}
        `
      : css`
          ${justifyContentSpaceBetween}
        `}
`;

const Img = styled.img``;

const Check = styled.p`
  height: 10px;
  margin-left: 2px;
  margin-right: 8px;
  /* width: 125px; */
  font-size: 8px;
  letter-spacing: 0.8px;

  ${({ isColor }) =>
    isColor
      ? css`
          color: #95ff45;
        `
      : css`
          color: #fe0000;
        `}
`;

const GridWrapper = styled.div`
  width: 423px;
  height: 197px;
  ${alignItemsFlexStart}
`;

const BaseLayerMobile = styled.div`
  width: 298px;
  height: 265px;
  padding-top: 2px;
  padding-bottom: 2px;
  margin-bottom: 4px;
  ${layerA}
  border-radius: 14px;
  opacity: 1;
  ${flexBoxCenter}
`;

const ButtonsWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile &&
    css`
      width: 100%;
      ${flexBoxCenter}
    `}
`;

const ErrorMessageWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: transparent;
  ${flexBoxCenter}
  position:absolute;
`;

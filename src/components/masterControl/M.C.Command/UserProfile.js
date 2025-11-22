import styled, { css } from "styled-components";
import {
  alignItemsFlexEnd,
  flexBoxCenter,
  justifyContentFlexEnd,
  justifyContentSpaceBetween,
  layerADark,
} from "../../styles/commonStyles";
import moment from "moment";
import { useSelect } from "downshift";
import { selectUserInfo } from "../../store/slices/userSlice";

function UserProfile({
  nickName,
  honorificTitle,
  name,
  workTitle,
  commandReference,
  avatar,
}) {
  const date = moment().format("MMMM. DD-YYYY");
  const getTitle = (name) => {
    const nameParts = name.split(" "); 
    const firstName = nameParts[0]; 
    const lastName = nameParts[1];  

    const firstNamePart = firstName.slice(0, 2); 
    const lastNamePart = lastName ? lastName.slice(0, 1) : ""; 

    return `${firstNamePart} ${lastNamePart}`; 
  };
  return (
    <Wrapper>
      <WrapperTitle>
        <Logo src={"./images/smallLogo.svg"} />
        <Title>master control command</Title>
      </WrapperTitle>
      <Div>
        <WrapperCommandInfo>
          <Picture src={avatar || "./images/dummyPicture.svg"} />
          <SmallWrapper>
            <Info underline={true} isCommandNum={true}>
              {commandReference}
            </Info>
            <Info underline={false}>{date}</Info>
          </SmallWrapper>
        </WrapperCommandInfo>
        <WrapperProfile>
          <div>
            <Info underline={true}>
              uos user:  {honorificTitle}{getTitle(name)}
            </Info>
            {/* <Info underline={true}>
              {honorificTitle}
              {name}
            </Info> */}
            <Info underline={true}>{workTitle}</Info>
          </div>
        </WrapperProfile>
      </Div>
    </Wrapper>
  );
}

export default UserProfile;

const Wrapper = styled.div`
  width: 292px;
  height: 95px;
  margin-top: 2px;

  ${layerADark}
  border-radius: 4px;
  opacity: 1;

  ${flexBoxCenter}
  flex-direction: column;
`;

const WrapperTitle = styled.div`
  width: 283px;
  height: 14px;

  border-bottom: 1px solid #ffff;
  opacity: 1;
  ${justifyContentSpaceBetween}
`;

const Logo = styled.img`
  width: 10px;
  height: 10px;
`;

const Title = styled.p`
  text-align: left;
  font-size: 10px;
  letter-spacing: 1px;
  color: #ffffff;
  opacity: 1;
`;

const Div = styled.div`
  height: 73px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
`;

const WrapperCommandInfo = styled.div`
  height: 50%;
  width: 97%;
  margin-top: 6px;
  /* margin-right: 6px; */
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  /* gap: 92px; */
`;

const WrapperProfile = styled.div`
  height: 50%;
  width: 99%;
  margin-top: 2px;
  margin-left: 6px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`;

const Picture = styled.img`
  max-width: 28px;
  max-height: 28px;
  object-fit: cover;
`;

const SmallWrapper = styled.div`
  ${alignItemsFlexEnd}
  flex-direction: column;
`;

const Info = styled.p`
  ${({ underline }) =>
    underline
      ? css`
          text-decoration: underline;
        `
      : css`
          text-decoration: none;
          margin-top: 2px;
        `};
  font-size: 8px;
  letter-spacing: 0.8px;
  color: #ffffff;
  opacity: 1;

  ${({ isCommandNum }) =>
    isCommandNum &&
    css`
      color: #95ff45;
    `}
`;

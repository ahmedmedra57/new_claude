import styled from 'styled-components';

const VideoMain = () => {
  return (
    <Wrapper>
      <SectionHeader>
        <HeaderTitle></HeaderTitle>
      </SectionHeader>
      <SectionMainContent></SectionMainContent>
    </Wrapper>
  );
};

export default VideoMain;

const Wrapper = styled.div``;
const SectionHeader = styled.section``;
const HeaderTitle = styled.span``;
const SectionMainContent = styled.section``;

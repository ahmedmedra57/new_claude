import { useEffect, useRef, useState } from 'react';
import useFileUpload from 'react-use-file-upload';
import axios from 'axios';

import styled from 'styled-components';
import {
  borderABlue,
  flexBoxCenter,
  justifyContentFlexStart,
  justifyContentSpaceAround,
  justifyContentSpaceBetween,
  layerA180Deg,
  layerA90Deg,
  layerADark,
  layerBDark,
  layerC,
} from '../../styles/commonStyles';
import MessageBox from '../../userMessages/messageBox';

const UploadBox = ({ handleUploadImage, closeUploadBox }) => {
  const {
    files,
    fileNames,
    fileTypes,
    totalSize,
    totalSizeInBytes,
    handleDragDropEvent,
    clearAllFiles,
    createFormData,
    setFiles,
    removeFile,
  } = useFileUpload();

  const inputRef = useRef();

  const isNumOfImgCorrect = files.length === 0;

  const [isUploadSizeExceeded, setIsUploadSizeExceeded] = useState(false);
  const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(false);

  useEffect(() => {
    if (totalSizeInBytes > 10485760) {
      setIsUploadSizeExceeded(true);
      setIsMessageBoxOpen(true);
    } else if (totalSizeInBytes <= 10485760 && isUploadSizeExceeded) {
      setIsUploadSizeExceeded(false);
    }
  }, [totalSizeInBytes]);

  const handleMessageBox = (boolean) => {
    setIsMessageBoxOpen(boolean);
  };

  return (
    <Wrapper>
      <FlexColum>
        <SectionHeader>
          <HeaderTitle>upload image</HeaderTitle>
        </SectionHeader>
        <CancelButton onClick={() => closeUploadBox(false)}>
          <CancelButtonHole>
            <CancelButtonTop>X</CancelButtonTop>
          </CancelButtonHole>
        </CancelButton>
      </FlexColum>

      {files.length > 0 && (
        <FileUl>
          <FileWrapper>
            <File>{fileNames[0]}</File>
            <CancelButton onClick={() => removeFile(fileNames[0])}>
              <CancelButtonHole>
                <CancelButtonTop>X</CancelButtonTop>
              </CancelButtonHole>
            </CancelButton>
          </FileWrapper>
        </FileUl>
      )}

      <SectionMain>
        <InnerWrapper
          onDragEnter={
            !isUploadSizeExceeded && isNumOfImgCorrect && handleDragDropEvent
          }
          onDragOver={
            !isUploadSizeExceeded && isNumOfImgCorrect && handleDragDropEvent
          }
          onDrop={(e) => {
            !isUploadSizeExceeded &&
              isNumOfImgCorrect &&
              handleDragDropEvent(e);
            !isUploadSizeExceeded && isNumOfImgCorrect && setFiles(e, 'a');
          }}
        >
          <HeaderTitle>
            drag and drop <br></br> image here
          </HeaderTitle>
          <InvisibleInput
            ref={inputRef}
            type='file'
            multiple
            onChange={(e) => {
              !isUploadSizeExceeded && isNumOfImgCorrect && setFiles(e, 'a');
              !isUploadSizeExceeded &&
                isNumOfImgCorrect &&
                (inputRef.current.value = null);
            }}
          />
        </InnerWrapper>
      </SectionMain>

      <ButtonGroup>
        <Button
          onClick={() =>
            !isUploadSizeExceeded &&
            isNumOfImgCorrect &&
            inputRef.current.click()
          }
        >
          <ButtonOuter>
            <ButtonHole>
              <ButtonTop>browse</ButtonTop>
            </ButtonHole>
          </ButtonOuter>
        </Button>
        <Button
          onClick={(e) =>
            !isUploadSizeExceeded
              ? handleUploadImage(e, files)
              : handleMessageBox(true)
          }
        >
          <ButtonOuter>
            <ButtonHole>
              <ButtonTop>save</ButtonTop>
            </ButtonHole>
          </ButtonOuter>
        </Button>
      </ButtonGroup>
      {isMessageBoxOpen && (
        <>
          <MessageBox
            title={'upload error'}
            messages={[
              'maximum upload exceeded. Total upload can not exceed:10mb.',
            ]}
            onClose={() => handleMessageBox(false)}
          />
        </>
      )}
    </Wrapper>
  );
};

export default UploadBox;

const Wrapper = styled.div`
  width: 207px;
  height: auto;
  padding: 3px 0;

  ${layerA90Deg}

  border-radius: 14px;

  ${justifyContentSpaceBetween}
  flex-direction: column;

  z-index: 100;
`;

const FlexColum = styled.div`
  display: flex;
  ${flexBoxCenter}
  gap:4px;
`;

const SectionHeader = styled.section`
  width: 169px;
  height: 25px;

  ${layerBDark}

  border-radius: 18px;
  ${flexBoxCenter}

  margin-bottom: 2px;
`;
const HeaderTitle = styled.span`
  width: 100%;
  text-align: center;
  font-size: 10px;
`;

const FileUl = styled.section`
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FileWrapper = styled.li`
  width: 200px;
  height: 26px;
  margin-bottom: 2px;
  padding: 0 2px;

  border-radius: 18px;

  ${layerBDark}

  ${justifyContentSpaceBetween}
`;

const File = styled.div`
  width: 171px;
  height: 22px;
  padding-left: 4px;

  ${borderABlue}
  font-size: 10px;
  border-radius: 16px;
  ${justifyContentFlexStart}
`;

const CancelButton = styled.button`
  width: 23px;
  height: 22px;

  ${layerA180Deg}
  border-radius: 50%;

  ${flexBoxCenter}
`;

const CancelButtonHole = styled.div`
  ${flexBoxCenter}
  width: 19px;
  height: 18px;
  border-radius: 50%;
  ${layerC}
`;
const CancelButtonTop = styled.div`
  width: 17px;
  height: 16px;

  ${layerA180Deg}
  border-radius: 50%;
  ${flexBoxCenter}
`;

const SectionMain = styled.section`
  width: 200px;
  height: 78px;
  padding: 2px 0;
  margin-bottom: 2px;

  ${layerC}

  border-radius: 12px;

  ${flexBoxCenter}
`;
const InnerWrapper = styled.div`
  width: 194px;
  height: 72px;
  border: 1px dashed #ffffff;
  border-radius: 10px;

  ${justifyContentSpaceAround}
  flex-direction: column;
`;

const ButtonGroup = styled.div`
  width: 200px;
  ${justifyContentSpaceBetween}
`;

const Button = styled.button`
  width: 98px;
  height: 32px;
  border-radius: 33px;

  ${layerADark}
  ${flexBoxCenter}
`;

const ButtonOuter = styled.div`
  width: 96px;
  height: 30px;

  ${layerA180Deg}

  border-radius: 25px;
  ${flexBoxCenter}
`;
const ButtonHole = styled.div`
  width: 88px;
  height: 22px;

  ${layerC}

  border-radius: 18px;
  ${flexBoxCenter}
`;
const ButtonTop = styled.div`
  width: 86px;
  height: 20px;

  ${layerA180Deg}
  border-radius: 25px;

  font-size: 10px;
  ${flexBoxCenter}
`;

const InvisibleInput = styled.input`
  display: none;
`;

import { useRef } from 'react';
import useFileUpload from 'react-use-file-upload';
import axios from 'axios';

import styled from 'styled-components';
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentFlexStart,
  justifyContentSpaceBetween,
  layerA180Deg,
  layerA90Deg,
  layerADark,
  layerBDark,
  layerC,
} from '../styles/commonStyles';
import MessageBox from '../userMessages/messageBox';
import { useState } from 'react';
import { useEffect } from 'react';
import { uploadS3File } from '../../services/uploadS3File.service';
import { uploadSiteMapService } from '../../services';
import { useDispatch } from 'react-redux';

const Upload = ({
  handleClose,
  locationId = '',
  specificLocationId = '',
  swtName,
}) => {
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

  const [isUploadSizeExceeded, setIsUploadSizeExceeded] = useState(false);
  const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState([]);
  const handleButtonClick = async (e) => {
    e.preventDefault();

    try {
      // if(files.length !== 0 )
      if (files.length === 1 && files[0].type === 'application/pdf') {
        const uploadedFilesURLs = await Promise.all(
          files.map(async (file) => {
            return await uploadS3File(file, file.type);
          });
        await uploadSiteMapService(
          locationId,
          swtName,
          uploadedFilesURLs,
          specificLocationId
        ).then((res) => {
          const key = `site_maps_${swtName.toUpperCase()}`;
          const sitePlanURL = res.data[key][0];
          dispatch(
            handleSitePlanURL({
              swtName,
              key,
              location: locationId,
              specificLocation: specificLocationId,
              url: sitePlanURL,
            });
        });
        handleClose();
      } else {
        handleMessageBox('send');
        setErrorMessage([
          files[0].type !== 'application/pdf'
            ? 'file type not supported. Please upload a pdf file.'
            : 'maximum upload exceeded. Total upload can not exceed:25mb and more than 1 file.',
        ]);
      }
    } catch (error) {
      setErrorMessage(['Something went wrong. Please try again.']);
      handleMessageBox('send');
    }
  };

  const singleUploadCheck = files.length < 1;
  const comboCheck = !isUploadSizeExceeded && singleUploadCheck;

  useEffect(() => {
    if (totalSizeInBytes > 26214400) {
      setIsUploadSizeExceeded(true);
      setIsMessageBoxOpen(true);
    } else if (totalSizeInBytes <= 26214400 && isUploadSizeExceeded) {
      setIsUploadSizeExceeded(false);
    }
  }, [totalSizeInBytes]);

  const handleMessageBox = (messageFor) => {
    setErrorMessage([
      'maximum upload exceeded. Total upload can not exceed:25mb and more than 1 file.',
    ]);

    switch (messageFor) {
      case 'browse':
        setIsMessageBoxOpen(true);
        break;
      case 'send':
        setIsMessageBoxOpen(true);
        break;
      default:
        setIsMessageBoxOpen(false);
        break;
    }
  };

  return (
    <Wrapper>
      <SectionHeader>
        <HeaderWrapper>
          <HeaderTitle>upload site plan</HeaderTitle>
        </HeaderWrapper>
        <CancelButton onClick={handleClose}>
          <CancelButtonHole>
            <CancelButtonTop>X</CancelButtonTop>
          </CancelButtonHole>
        </CancelButton>
      </SectionHeader>

      {files.length > 0 && (
        <FileUl>
          {fileNames.map((fileName, index) => (
            <FileWrapper key={Math.random() * 10000}>
              <File>{fileName}</File>
              <CancelButton onClick={() => removeFile(fileName)}>
                <CancelButtonHole>
                  <CancelButtonTop>X</CancelButtonTop>
                </CancelButtonHole>
              </CancelButton>
            </FileWrapper>
          ))}
        </FileUl>
      )}

      <SectionMain>
        <InnerWrapper
          onDragEnter={comboCheck && handleDragDropEvent}
          onDragOver={comboCheck && handleDragDropEvent}
          onDrop={(e) => {
            comboCheck && handleDragDropEvent(e);
            comboCheck && setFiles(e, 'a');
          }}
        >
          <HeaderTitle>
            drag and drop <br></br> files here <br></br>{' '}
            {files.length > 0 && totalSize}
          </HeaderTitle>
          <InvisibleInput
            ref={inputRef}
            type='file'
            accept='application/pdf'
            onChange={(e) => {
              comboCheck ? setFiles(e, 'a') : handleMessageBox('browse');
              inputRef.current.value = null;
            }}
          />
        </InnerWrapper>
      </SectionMain>

      <ButtonGroup>
        <Button
          onClick={() =>
            comboCheck ? inputRef.current.click() : handleMessageBox('browse')
          }
        >
          <ButtonOuter>
            <ButtonHole>
              <ButtonTop>browse</ButtonTop>
            </ButtonHole>
          </ButtonOuter>
        </Button>
        <Button onClick={handleButtonClick}>
          <ButtonOuter>
            <ButtonHole>
              <ButtonTop>send</ButtonTop>
            </ButtonHole>
          </ButtonOuter>
        </Button>
      </ButtonGroup>
      {isMessageBoxOpen && (
        <>
          <MessageBox
            title={'location'}
            subtitle={'upload site plan'}
            messages={errorMessage}
            onClose={() => handleMessageBox()}
          />
        </>
      )}
    </Wrapper>
  );
};

export default Upload;

const Wrapper = styled.div`
  width: 207px;
  height: auto;
  border-radius: 14px;

  ${layerA90Deg}
  ${flexDirectionColumn} 

  position: absolute;
  z-index: 100;
  top: 0px;

  padding: 3px 0;
`;
const SectionHeader = styled.section`
  width: 100%;
  margin-bottom: 2px;

  ${justifyContentSpaceBetween};
  padding: 0 4px 0 2px;
`;

const HeaderWrapper = styled.div`
  width: 169px;
  height: 25px;
  border-radius: 18px;
  ${layerBDark}
  ${flexBoxCenter}
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
  border-radius: 18px;
  ${layerBDark};
  ${justifyContentSpaceBetween};
  margin-bottom: 2px;
  padding: 0 2px;
`;

const File = styled.div`
  width: 171px;
  height: 22px;
  border-radius: 16px;
  border: 1px solid #233a54;
  overflow: hidden;
  ${justifyContentFlexStart};
  font-size: 10px;
  padding-left: 4px;
`;

const CancelButton = styled.button`
  width: 23px;
  height: 22px;
  border-radius: 50%;

  ${layerA180Deg}
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
  border-radius: 50%;

  ${layerA180Deg};
  ${flexBoxCenter};
`;

const SectionMain = styled.section`
  width: 200px;
  height: 78px;
  padding: 2px 0;
  border-radius: 12px;
  ${layerC}
  ${flexBoxCenter}

  margin-bottom: 2px;
`;
const InnerWrapper = styled.div`
  width: 194px;
  height: 72px;
  border: 1px dashed #ffffff;
  border-radius: 10px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
`;

const ButtonGroup = styled.div`
  width: 200px;
  ${justifyContentSpaceBetween};
`;

const Button = styled.button`
  ${flexBoxCenter}
  width: 98px;
  height: 32px;
  border-radius: 33px;

  ${layerADark}
`;

const ButtonOuter = styled.div`
  width: 96px;
  height: 30px;
  border-radius: 25px;
  ${layerA180Deg}
  ${flexBoxCenter}
`;
const ButtonHole = styled.div`
  width: 88px;
  height: 22px;
  border-radius: 18px;
  ${layerC};
  ${flexBoxCenter};
`;
const ButtonTop = styled.div`
  width: 86px;
  height: 20px;
  border-radius: 25px;
  font-size: 10px;
  ${layerA180Deg};
  ${flexBoxCenter};
`;

const InvisibleInput = styled.input`
  display: none;
`;

import Downshift from 'downshift';
import styled, { css } from 'styled-components';
import {
  ItemBackground,
  alignItemsFlexStart,
  flexBoxCenter,
  justifyContentSpaceAround,
  layerA,
  layerA180Deg,
  layerBDark,
  scrollbarY,
} from '../../../styles/commonStyles';

const DownShiftAutoComplete = ({
  options,
  handleSelectedPartNumber,
  selectedSSRIdx,
  SSR,
  elIdx,
  elementIdx,
  el,
  specs,
  currentSpecs
}) => {
  return (
    <Downshift
      onClick={(selectedItem) => {
        handleSelectedPartNumber(
          selectedItem,
          selectedSSRIdx,
          SSR,
          elIdx,
          elementIdx
        )
      }}
      onChange={(selectedItem) => {
        if (selectedItem) {
          handleSelectedPartNumber(
            selectedItem,
            selectedSSRIdx,
            SSR,
            elIdx,
            elementIdx
          );
        }
      }}
      itemToString={(item) => (item ? item.partNumber : '')}
    >
      {({
        getInputProps,
        getMenuProps,
        getRootProps,
        getItemProps,
        isOpen,
        highlightedIndex,
        inputValue,
      }) => (
        <Form {...getRootProps()}>
          <Spec>
            <Input {...getInputProps()} placeholder={el.partNumber} />
          </Spec>
          {isOpen && (
            <AutoCompleteList {...getMenuProps()}>
              <AutoCompleteListInnerWrapper>
                {options
                  .filter((item) => {
              const specsIds = currentSpecs?  currentSpecs?.map((spec) => spec.id) : specs?.map((spec) => spec.id)

                    return (
                      !inputValue ||
                      item.partNumber
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                      // )
                    );
                  })
                  .map((item, index) => {
                    return (
                      <ListWrapper
                        key={`${item.partNumber}-${index}`}
                        background={index === highlightedIndex}
                      >
                        <List
                          {...getItemProps({
                            key: `${item.partNumber}-${index}`,
                            item,
                            index,
                          })}
                        >
                          {item.partNumber}
                        </List>
                      </ListWrapper>
                    );
                  })}
              </AutoCompleteListInnerWrapper>
            </AutoCompleteList>
          )}

          {/* display specs depending on the chosen part number above */}
          <Flex>
            <Spec isCurrent={true}>
              {el.currentCurrent ? el.currentCurrent + ' ' + 't' : ''}
            </Spec>
            <Spec isCurrent={true}>
              {el.current ? el.current + ' ' + 'a' : ''}
            </Spec>
          </Flex>
          <Spec isCommonSize={true}>
            {el.wattage ? el.wattage + ' ' + 'w' : ''}
          </Spec>
          <Spec isCommonSize={true}>
            {el.voltage ? el.voltage + ' ' + 'v' : ''}
          </Spec>
          <Spec isCommonSize={true}>
            {el.lengths ? el.lengths + ' ' + 'ft' : ''}
          </Spec>
          {el.elementName &&
          el.partNumber &&
          el.current &&
          el.wattage &&
          el.voltage &&
          el.lengths ? (
            <Spec isDescription={true}>
              {el.elementName} - {el.partNumber}/{el.current + ' ' + 'a'}/
              {el.wattage + ' ' + 'w'}/{el.voltage + ' ' + 'v'}/
              {el.lengths + ' ' + 'ft'}
            </Spec>
          ) : (
            <Spec isDescription={true}></Spec>
          )}
        </Form>
      )}
    </Downshift>
  );
};

export default DownShiftAutoComplete;

const Form = styled.form`
  width: 84%;
  height: 20px;
  margin-top: 4px;
  ${justifyContentSpaceAround}

  position: relative;
`;

const Flex = styled.div`
  height: 100%;
  display: flex;
  gap: 2px;
`;

const Spec = styled.div`
  height: 100%;

  font-size: 8px;
  letter-spacing: 0.8px;
  text-align: center;

  ${({ isPartNum, isCurrent, isCommonSize, isDescription }) =>
    isPartNum
      ? css`
          width: 76px;
          position: relative;
        `
      : isCurrent
      ? css`
          width: 42px;
        `
      : isCommonSize
      ? css`
          width: 72px;
        `
      : isDescription &&
        css`
          width: 260px;
          /* text-align: center; */
        `}

  ${layerA}

  border-radius: 12px;

  ${flexBoxCenter}
`;

const Input = styled.input`
  width: 85%;
  background-color: inherit;
  font-size: 8px;
  letter-spacing: 0.8px;
  text-align: center;
  ::placeholder {
    color: #ffff;
  }
`;

const AutoCompleteList = styled.div`
  max-height: 200px;
  width: 160px;
  padding: 2px;
  text-align: left;

  position: absolute;

  top: 20px;
  left: -20px;

  z-index: 100;

  ${alignItemsFlexStart}

  ${layerA180Deg}

  border-radius: 12px;

  ${scrollbarY}
  ::-webkit-scrollbar {
    display: none;
  }

  /* ${(p) =>
    p.isTrue ||
    css`
      display: none;
    `} */
`;

const AutoCompleteListInnerWrapper = styled.div`
  /* max-height: 198px; */
  width: 100%;
  ${layerBDark}

  border-radius: 10px;
  padding: 2px 2px;

  /* ${(p) =>
    p.isTrue ||
    css`
      display: none;
    `} */

  ${flexBoxCenter}
  flex-direction: column;
`;

const ListWrapper = styled.div`
  height: 16px;
  width: 98%;

  ${ItemBackground};
  /* border-radius: 6px; */

  background-color: ${(p) => p.isSelected && `hsla(50deg, 100%, 80%,0.25)`};
  &:hover {
    background-color: hsla(50deg, 100%, 80%, 0.25);
  }

  ${({ background }) =>
    background &&
    css`
      background-color: hsla(50deg, 100%, 80%, 0.25);
    `}

  margin-bottom: 2px;
  :last-child {
    margin-bottom: 0px;
  }
  /* padding-left: 10px; */
  cursor: pointer;
  overflow: hidden;
  ${flexBoxCenter};
`;

const List = styled.li`
  height: 8px;

  font-size: 8px;
  letter-spacing: 0.8px;

  align-items: center;
`;

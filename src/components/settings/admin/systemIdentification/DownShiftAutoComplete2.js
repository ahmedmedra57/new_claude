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

const DownShiftAutoComplete2 = ({
  getItems,
  elementIdx,
  SSR,
  handleSelectedPartNumber,
  selectedSSRIdx,
  el,
  elIdx,
}) => {
  const itemToString = (item) => (item ? item.partNumber : '');

  return (
    <Downshift itemToString={itemToString}>
      {({
        getInputProps,
        isOpen,
        getMenuProps,
        getItemProps,
        getRootProps,
        highlightedIndex,
        inputValue,
        selectedItem,
        toggleMenu,
      }) => (
        <Form {...getRootProps({ onBlur: toggleMenu })}>
          {/* part number input */}
          <Spec
            isPartNum={true}
            // {...getRootProps({}, { suppressRefError: true })}
          >
            <Input
              name='part number'
              placeholder={el.partNumber}
              value={el.partNumber ? el.partNumber : ''}
              {...getInputProps()}
            />
          </Spec>
          {console.log('el.partNumber:', el.partNumber)}

          {/* autoComplete list */}
          {isOpen && (
            <AutoCompleteList {...getMenuProps()}>
              <AutoCompleteListInnerWrapper>
                {getItems(inputValue, elementIdx, SSR).map((item) => {
                  return (
                    <ListWrapper key={item.partNumber}>
                      <List
                        {...getItemProps({
                          item,
                          key: item.partNumber,
                        })}
                        onClick={() =>
                          handleSelectedPartNumber(
                            item,
                            selectedSSRIdx,
                            SSR,
                            elIdx,
                            elementIdx
                          )
                        }
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

export default DownShiftAutoComplete2;

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
  left: -40px;

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

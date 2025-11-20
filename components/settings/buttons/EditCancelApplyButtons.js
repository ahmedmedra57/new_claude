import styled, { css } from 'styled-components';
import { useEditCancelApplyButtonsStore } from '../../zustand-stores';
import Button from './Button';

function EditCancelApplyButtons({ handleClick, sysIndex }) {
  const buttonsNames = ['edit', 'cancel', 'apply'];

  const { isEdit } = useEditCancelApplyButtonsStore();

  return (
    <ContainerButtons>
      {buttonsNames.map((name, index) => {
        return (
          <div key={index}>
            <Button
              id={index}
              handleClick={handleClick}
              name={name}
              sysIndex={sysIndex}
              // editState={editState}
              isEdit={isEdit}
            />
          </div>
        );
      })}
    </ContainerButtons>
  );
}

export default EditCancelApplyButtons;

const ContainerButtons = styled.div`
  width: 270px;
  height: 37px;
  opacity: 1;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1px;
`;

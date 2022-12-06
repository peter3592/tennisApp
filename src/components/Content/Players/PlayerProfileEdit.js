import styled from "styled-components";
import { FaEdit } from "react-icons/fa";

export default function PlayerProfileEdit({
  editMode,
  onClick,
  save,
  cancel,
  absolute,
}) {
  return (
    <Div absolute={absolute}>
      {!editMode && <FaEdit className="icon" onClick={onClick} />}
      {editMode && (
        <div className="buttons">
          <div className="button button--save" onClick={save}>
            Save
          </div>
          <div className="button button--cancel" onClick={cancel}>
            Cancel
          </div>
        </div>
      )}
    </Div>
  );
}

const Div = styled.div`
  ${({ absolute }) =>
    absolute
      ? `
    position: absolute; 
    top: 1.5rem; 
    right: 1.5rem;
    `
      : ""}

  .icon {
    font-size: 1.6rem;
    cursor: pointer;
    color: var(--primary-color);
  }

  .buttons {
    display: flex;
    flex-direction: ${({ absolute }) => (absolute ? "column" : "row")};
  }

  .button {
    font-size: 1.3rem;
    padding: 0.3rem 0.5rem;
    cursor: pointer;
    font-weight: bold;
    width: 5.3rem;
    text-align: center;

    :not(:last-of-type) {
      margin-right: ${({ absolute }) => (absolute ? "0" : "1rem")};
    }

    :first-of-type {
      margin-bottom: ${({ absolute }) => (absolute ? "1rem" : "0")};
    }

    &--save {
      border: 1px solid var(--primary-color);
      background-color: var(--primary-color);
      color: white;
    }

    &--cancel {
      border: 1px solid var(--red);
      color: var(--red);
      background-color: white;
    }
  }
`;

import React, { createContext, useReducer } from "react";

const initialState = {
  column2: [],
  back: [],
  folder: undefined,
  task: undefined,
};

const ListContext = createContext({
  column2: [],
  back: [],
  folder: undefined,
  task: undefined,
  setColumn2: (column) => {},
  setBack: (back) => {},
  setFolder: (folder) => {},
  setTask: (task) => {},
});

function listReducer(state, action) {
  switch (action.type) {
    case "SET_COLUMN":
      return {
        ...state,
        column2: action.payload,
      };
    case "SET_BACK":
      return {
        ...state,
        back: action.payload,
      };
    case "SET_FOLDER":
      return {
        ...state,
        folder: action.payload,
      };
    case "SET_TASK":
      return {
        ...state,
        task: action.payload,
      };
    default:
      break;
  }
}

const ListProvider = (props) => {
  const [state, dispatch] = useReducer(listReducer, initialState);

  function setColumn2(column) {
    dispatch({
      type: "SET_COLUMN",
      payload: column,
    });
  }

  function setBack(back) {
    dispatch({
      type: "SET_BACK",
      payload: back,
    });
  }

  function setFolder(folder) {
    dispatch({
      type: "SET_FOLDER",
      payload: folder,
    });
  }

  function setTask(task) {
    dispatch({
      type: "SET_TASK",
      payload: task,
    });
  }

  return (
    <ListContext.Provider
      value={{ ...state, setColumn2, setBack, setFolder, setTask }}
      {...props}
    />
  );
};

export { ListProvider, ListContext };

import React from "react";
import styled from "styled-components";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const EditorContainer = styled.div`
  color: black;
  padding: 0.1rem;
  border-radius: 4px;
  border: solid 2px #aaa;
  background-color: white;

  ul {
    padding-left: 1rem;
  }

  .ck-content {
    min-height: 300px;
    height: auto;
  }
`;

const Editor = ({ data, state }) => {
  return (
    <EditorContainer>
      <CKEditor
        style={{ height: "500px" }}
        editor={ClassicEditor}
        data={data}
        onReady={(editor) => {}}
        onChange={(event, editor) => {
          const data = editor.getData();
          state(data);
        }}
      />
    </EditorContainer>
  );
};

export default Editor;

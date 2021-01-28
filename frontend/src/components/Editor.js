import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const Editor = ({ data, state }) => {
  return (
    <div style={{ color: "black" }}>
      <CKEditor
        editor={ClassicEditor}
        data={data}
        onReady={(editor) => {}}
        onChange={(event, editor) => {
          const data = editor.getData();
          state(data);
        }}
      />
    </div>
  );
};

export default Editor;

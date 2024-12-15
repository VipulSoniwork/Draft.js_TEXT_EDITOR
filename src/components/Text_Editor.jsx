import React, { useState } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";
import "../Text_Editor.css";

const Text_Editor = () => {
  const [editorState, setEditorState] = useState(() => {
    const savedContent = localStorage.getItem("editorContent");
    return savedContent
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(savedContent)))
      : EditorState.createEmpty();
  });

  const handleSave = () => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    localStorage.setItem("editorContent", JSON.stringify(rawContent));
    alert("Content saved successfully!");
  };

  const handleBeforeInput = (chars, editorState) => {
    const selection = editorState.getSelection();
    const block = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey());
    const blockText = block.getText();
  
    // Check for # prefix and apply header-one
    if (chars === " " && blockText === "#") {
      setEditorState(
        applyBlockStyle(editorState, selection, "header-one", "#")
      );
      return "handled";
    }
  
    // Check for * prefix and apply bold
    if (chars === " " && blockText === "*") {
      setEditorState(
        resetBlockAndApplyInlineStyle(editorState, selection, "BOLD", "*")
      );
      return "handled";
    }
  
    // Check for ** prefix and apply red-line
    if (chars === " " && blockText === "**") {
      setEditorState(
        resetBlockAndApplyInlineStyle(editorState, selection, "red-line", "**")
      );
      return "handled";
    }
  
    // Check for *** prefix and apply underline
    if (chars === " " && blockText === "***") {
      setEditorState(
        resetBlockAndApplyInlineStyle(editorState, selection, "UNDERLINE", "***")
      );
      return "handled";
    }
  
    return "not-handled";
  };
  
  // Function to reset block type and apply inline style
  const resetBlockAndApplyInlineStyle = (editorState, selection, style, trigger) => {
    // Reset block type to "unstyled"
    const contentState = Modifier.setBlockType(
      editorState.getCurrentContent(),
      selection,
      "unstyled"
    );
  
    const editorStateWithoutBlock = EditorState.push(
      editorState,
      contentState,
      "change-block-type"
    );
  
    // Apply inline style after resetting the block type
    return applyInlineStyle(editorStateWithoutBlock, selection, style, trigger);
  };
  
  // Function to apply inline style
  const applyInlineStyle = (editorState, selection, style, trigger) => {
    const contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      selection.merge({
        anchorOffset: 0,
        focusOffset: trigger.length,
      }),
      " " // Replace the trigger text with a single space
    );
  
    const newEditorState = EditorState.push(
      editorState,
      contentState,
      "remove-range"
    );
  
    return RichUtils.toggleInlineStyle(newEditorState, style);
  };
  

  const applyBlockStyle = (editorState, selection, blockType, trigger) => {
    const contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      selection.merge({
        anchorOffset: 0,
        focusOffset: trigger.length,
      }),
      " " // Clear the trigger text
    );

    let newEditorState = EditorState.push(
      editorState,
      contentState,
      "remove-range"
    );

    return RichUtils.toggleBlockType(newEditorState, blockType);
  };

  const customStyleMap = {
    "red-line": { color: "red" },
  };

  return (
    <div className="editor-container">
      <h3 className="editor-heading">TEXT EDITOR</h3>

      <div className="editor-wrapper">
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          placeholder="Type here..."
          handleBeforeInput={handleBeforeInput}
          customStyleMap={customStyleMap}
        />
      </div>

      <button onClick={handleSave} className="editor-save-button">
        Save
      </button>
    </div>
  );
};

export default Text_Editor;

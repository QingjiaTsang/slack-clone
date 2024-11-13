"use client";

import {
  useRef,
  MutableRefObject,
  LegacyRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";

import type ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ReactQuillBase from "@/components/ReactQuillBase";

type QuillContentsRendererProps = {
  contents: string;
};

const QuillContentsRenderer = ({ contents }: QuillContentsRendererProps) => {
  const quillRef = useRef<ReactQuill>(null);

  const [isEmpty, setIsEmpty] = useState(false);

  const modules = useMemo(() => {
    return {
      toolbar: false,
    };
  }, []);

  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();

      editor.disable();
      const parsedContents = JSON.parse(contents);
      editor.setContents(parsedContents);

      const isEmpty = !editor
        .getText()
        .replace(
          /(\s|&nbsp;|&emsp;|&ensp;|&thinsp;|&#8203;|&#8204;|&#8205;|\u200B|\n|\r|\t)+/g,
          ""
        )
        .trim();

      setIsEmpty(isEmpty);
    }
  }, [contents]);

  if (isEmpty) {
    return null;
  }

  return (
    <ReactQuillBase forwardedRef={quillRef} theme="snow" modules={modules} />
  );
};

export default QuillContentsRenderer;

"use client";

import type ReactQuill from "react-quill";

import type { LegacyRef } from "react";

import dynamic from "next/dynamic";

import "react-quill/dist/quill.snow.css";

interface IWrappedComponent extends React.ComponentProps<typeof ReactQuill> {
  forwardedRef: LegacyRef<ReactQuill>;
}

const ReactQuillBase = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");

    function QuillJS({ forwardedRef, ...props }: IWrappedComponent) {
      return <RQ ref={forwardedRef} {...props} />;
    }

    return QuillJS;
  },
  {
    ssr: false,
  }
);

export default ReactQuillBase;

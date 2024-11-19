"use client";

import type { LegacyRef } from "react";
import type ReactQuill from "react-quill";

import dynamic from "next/dynamic";

// custom quill modules for image uploading by drop and paste
import QuillImageDropAndPaste from "quill-image-drop-and-paste";

import "react-quill/dist/quill.snow.css";

// add custom module type to react-quill
declare module "react-quill" {
  interface QuillOptions {
    imageDropAndPaste?: {
      handler: (imageDataUrl: string, type: string, imageData: any) => void;
    };
  }
}

interface IWrappedComponent extends React.ComponentProps<typeof ReactQuill> {
  forwardedRef: LegacyRef<ReactQuill>;
}

const ReactQuillBase = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");

    // register custom module
    if (typeof window !== "undefined") {
      const Quill = RQ.Quill;
      Quill.register("modules/imageDropAndPaste", QuillImageDropAndPaste);
    }

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

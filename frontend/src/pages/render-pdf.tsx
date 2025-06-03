import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { PDFViewer } from "../components/PDFViewer";

export const RenderPDF: React.FC = () => {
  const [queries] = useSearchParams();
  const pdfUrl = queries.get("pdf") || queries.get("url") || "";
  const frameId = queries.get("frameId") || "";
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      window.parent.postMessage(
        {
          type: "pdf-dimensions",
          width: window.innerWidth,
          height: document.body.scrollHeight,
          frameId,
        },
        "*"
      );
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [frameId]);

  const handleDocumentLoad = () => {
    setTimeout(() => {
      window.parent.postMessage(
        {
          type: "pdf-dimensions",
          width: window.innerWidth,
          height: document.body.scrollHeight,
          frameId,
        },
        "*"
      );
    }, 100);
  };

  return <PDFViewer url={pdfUrl} width={width} onLoadSuccess={handleDocumentLoad} />;
};
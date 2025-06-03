import React, { useMemo, useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import { Box, Button, Flex, Select } from "@mantine/core";
import { IconZoomIn, IconZoomOut, IconDownload } from "@tabler/icons";
import { usePinch } from "@use-gesture/react";

const ZOOM_LEVELS = [
  { value: "0.5", label: "50%" },
  { value: "0.75", label: "75%" },
  { value: "0.95", label: "95%" },
  { value: "1", label: "100%" },
  { value: "1.25", label: "125%" },
  { value: "1.5", label: "150%" },
  { value: "2", label: "200%" },
];

interface PDFViewerProps {
  url: string;
  width: number;
  onLoadSuccess?: (numPages: number) => void;
  filename?: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
  url,
  width,
  onLoadSuccess,
  filename = "document.pdf",
}) => {
  const [scale, setScale] = useState(0.95);
  const [numPages, setNumPages] = useState<number>(0);
  const documentBox = useRef<HTMLDivElement | null>(null);
  const fileUrlProp = useMemo(() => {
    return { url };
  }, [url]);
  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 2));
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
  };

  const downloadPdf = () => {
    if (url) {
      const link = document?.createElement("a");
      link.href = url;
      link.download = filename;
      document?.body?.appendChild(link);
      link.click();
      document?.body?.removeChild(link);
    }
  };

  usePinch(
    ({ offset: [d], event }: any) => {
      event?.preventDefault();
      const newScale = Math.min(Math.max(d, 0.5), 2);
      setScale(newScale);
    },
    {
      target: documentBox.current || undefined,
      eventOptions: { passive: false },
    }
  );

  const handleDocumentLoad = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    onLoadSuccess?.(numPages);
  };
  return (
    <Box sx={{ overflow: "auto", width: "100%" }}>
      <Flex
        justify="center"
        align="center"
        gap="md"
        mb="md"
        sx={{
          backgroundColor: "#f4f4f5",
          padding: "8px",
          borderRadius: "8px",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Button onClick={zoomOut} variant="filled" color="gray" radius="md">
          <IconZoomOut size={20} />
        </Button>
        <Select
          value={scale.toString()}
          onChange={(value) => setScale(Number(value))}
          data={ZOOM_LEVELS}
          style={{ width: 100 }}
          radius="md"
        />
        <Button onClick={zoomIn} variant="filled" color="gray" radius="md">
          <IconZoomIn size={20} />
        </Button>
        <Button onClick={downloadPdf} variant="filled" color="blue" radius="md">
          <IconDownload size={20} />
        </Button>
      </Flex>
      <Box ref={documentBox}>
        <Document
          key={url}
          file={fileUrlProp}
          onLoadSuccess={handleDocumentLoad}
        >
          {Array.from(new Array(numPages), (_el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={width}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={true}
            />
          ))}
        </Document>
      </Box>
    </Box>
  );
};

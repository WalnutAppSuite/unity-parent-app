import {
  Card,
  Image,
  Text,
  Group,
  Button,
  Badge,
  Flex,
  Modal,
} from "@mantine/core";
import {
  IconDownload,
  IconEye,
  IconFileTypePdf,
  IconPhoto,

} from "@tabler/icons-react";
import { useState } from "react";

interface FileItem {
  name: string;
  url: string;
  type: string;
  size: number;
}

interface ArchivedFilesCardProps {
  item: FileItem;
}

function ArchivedFilesCard({ item }: ArchivedFilesCardProps) {
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const isPDF = item.type.toUpperCase() === "PDF";
  const isImage = ["JPG", "JPEG", "PNG", "GIF"].includes(
    item.type.toUpperCase()
  );

  const handleViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setViewModalOpen(true);
  };

  return (
    <>
      <Card shadow="sm" p="lg" radius="md" withBorder w={350}>
        <Card.Section>
          {isImage ? (
            <Image
              src={item.url}
              height={170}
              alt={item.name}
              withPlaceholder
              placeholder={
                <Flex align="center" justify="center" h={170}>
                  <IconPhoto size={48} color="#00A3FF" />
                </Flex>
              }
            />
          ) : (
            <Flex align="center" justify="center" h={200} bg="gray.1">
              <IconFileTypePdf size={48} color="#FF0000" />
            </Flex>
          )}
        </Card.Section>

        <Group position="apart" mt="md" mb="xs">
          <Text weight={500} lineClamp={1} style={{ maxWidth: "70%" }}>
            {item.name}
          </Text>
          <Badge color={isPDF ? "red" : "blue"}>
            {item.type.toUpperCase()}
          </Badge>
        </Group>

        <Group grow spacing="sm">
          <Button
            variant="light"
            style={{
              backgroundColor: "var(--walsh-primary-lighter)",
              color: "white",
            }}
            leftIcon={<IconEye size={16} />}
            onClick={handleViewClick}
          >
            View
          </Button>
          <Button
            variant="light"
            style={{
              backgroundColor: "var(--walsh-secondary)",
              color: "var(--walsh-black)",
            }}
            leftIcon={<IconDownload size={16} />}
            onClick={() => {
              const link = document.createElement("a");
              link.href = item.url;
              link.download = item.name;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            Download
          </Button>
        </Group>
      </Card>

      {/* File Viewer Modal */}
      <Modal
        opened={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title={item.name}
        size="xl"
        closeButtonLabel="Close"
      >
        <div style={{ height: "80vh", width: "100%" }}>
          {isPDF ? (
            <iframe
              src={`${item.url}#toolbar=0`}
              style={{ width: "100%", height: "100%", border: "none" }}
              title={item.name}
            />
          ) : isImage ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <img
                src={item.url}
                alt={item.name}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <Text>This file type cannot be previewed in the browser.</Text>
              <Button
                mt="md"
                component="a"
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in New Tab
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}

export default ArchivedFilesCard;

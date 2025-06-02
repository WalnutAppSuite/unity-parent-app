import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

// TypeScript declaration for ClipboardItem
declare global {
  interface ClipboardItem {
    readonly types: readonly string[];
    getType: (type: string) => Promise<Blob>;
  }

  const ClipboardItemClass: {
    prototype: ClipboardItem;
    new (itemData: ClipboardItemData): ClipboardItem;
  };

  interface Window {
    walshmobile?: {
      shareImage?: (base64Image: string, filename: string) => void;
    };
  }
}
import {
  Box,
  Image,
  SimpleGrid,
  Text,
  Title,
  Modal,
  Group,
  Button,
  Loader,
  Checkbox,
  ActionIcon,
  Badge,

} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconArrowLeft, IconDownload, IconShare, IconSelectAll, IconSelect } from "@tabler/icons-react";
import useStudentProfileColor from "../../components/hooks/useStudentProfileColor";
import { useNavigate } from "react-router-dom";
import useEventDetails, {
  EventImage,
} from "../../components/queries/useEventDetails";

const EventDetail = () => {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("eventId") || "";
  const student = searchParams.get("student") || "";
  const navigate = useNavigate();

  const [viewImage, setViewImage] = useState<EventImage | null>(null);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const studentProfileColor = useStudentProfileColor(student);

  const { data, isLoading, isError } = useEventDetails(eventId);
  const eventDetails = data?.event;
  const success = data?.success;

  // Helper functions for image selection
  const toggleImageSelection = useCallback((imageId: string) => {
    setSelectedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(imageId)) {
        newSet.delete(imageId);
      } else {
        newSet.add(imageId);
      }
      return newSet;
    });
  }, []);

  const selectAllImages = useCallback(() => {
    if (eventDetails?.images) {
      setSelectedImages(new Set(eventDetails.images.map(img => img.id)));
    }
  }, [eventDetails?.images]);

  const clearSelection = useCallback(() => {
    setSelectedImages(new Set());
  }, []);

  const toggleSelectionMode = useCallback(() => {
    setIsSelectionMode(prev => !prev);
    if (isSelectionMode) {
      clearSelection();
    }
  }, [isSelectionMode, clearSelection]);

  // Share selected images function
  const shareSelectedImages = useCallback(async () => {
    if (selectedImages.size === 0) {
      showNotification({
        title: "No images selected",
        message: "Please select at least one image to share",
        color: "orange",
      });
      return;
    }

    const selectedImageObjects = eventDetails?.images?.filter(img => 
      selectedImages.has(img.id)
    ) || [];

    if (window.walshmobile?.shareImage) {
      // For mobile app, we can only share one image at a time
      // So we'll share them sequentially
      for (const image of selectedImageObjects) {
        try {
          const response = await fetch(image.url);
          const blob = await response.blob();
          
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result?.toString() || "";
            const base64Content = base64data.split(",")[1] || base64data;
            const filename = `${image.caption || eventDetails?.title || "event-image"}.jpg`;
            
            window?.walshmobile?.shareImage?.(base64Content, filename);
          };
          reader.readAsDataURL(blob);
        } catch (err) {
          console.error("Error sharing image:", err);
        }
      }
      
      showNotification({
        title: "Sharing images",
        message: `Sharing ${selectedImages.size} selected images via Walsh app`,
        color: "green",
      });
    } else {
      // For web, use Web Share API or copy to clipboard
      if (navigator.share && selectedImageObjects.length === 1) {
        // Web Share API works best with single items
        const image = selectedImageObjects[0];
        try {
          await navigator.share({
            title: image.caption || eventDetails?.title,
            text: `Check out this image from ${eventDetails?.title}`,
            url: image.url,
          });
          showNotification({
            title: "Shared successfully",
            message: "The image has been shared",
            color: "green",
          });
        } catch (err) {
          console.error("Error sharing:", err);
        }
      } else {
        // Fallback: copy image URLs to clipboard
        const imageUrls = selectedImageObjects.map(img => img.url).join('\n');
        try {
          await navigator.clipboard.writeText(imageUrls);
          showNotification({
            title: "Copied to clipboard",
            message: `${selectedImages.size} image URLs copied to clipboard`,
            color: "green",
          });
        } catch (err) {
          console.error("Failed to copy:", err);
          showNotification({
            title: "Copy failed",
            message: "Could not copy to clipboard",
            color: "red",
          });
        }
      }
    }
  }, [selectedImages, eventDetails, selectedImages.size]);

  if (isLoading) {
    return (
      <Box py={50} sx={{ textAlign: "center" }}>
        <Loader color={studentProfileColor} />
        <Text mt="md" color="dimmed">
          Loading event details...
        </Text>
      </Box>
    );
  }

  if (isError || !success || !eventDetails || !eventDetails.id) {
    return (
      <Box py={30} px="md">
        <Button
          leftIcon={<IconArrowLeft size={16} />}
          variant="subtle"
          color={studentProfileColor}
          onClick={() => navigate(`/event-gallery?student=${student}`)}
          mb="md"
        >
          Back to Events
        </Button>

        <Text align="center" color="red" my={30}>
          Event not found. {data?.message || ""}
        </Text>
      </Box>
    );
  }

  return (
    <Box p="md">
      <Group position="apart" mb="lg">
        <Button
          leftIcon={<IconArrowLeft size={16} />}
          variant="subtle"
          color={studentProfileColor}
          onClick={() => navigate(`/event-gallery?student=${student}`)}
        >
          Back to Events
        </Button>

        <Group spacing="sm">
          <Text size="sm" color="dimmed">
            {eventDetails.date}
          </Text>
          
          {eventDetails.images && eventDetails.images.length > 1 && (
            <ActionIcon
              variant={isSelectionMode ? "filled" : "subtle"}
              color={studentProfileColor}
              onClick={toggleSelectionMode}
              size="lg"
              title={isSelectionMode ? "Exit selection mode" : "Select multiple images"}
            >
              <IconSelect size={18} />
            </ActionIcon>
          )}
        </Group>
      </Group>

      <Title order={2} mb="xs" color={studentProfileColor}>
        {eventDetails.title}
      </Title>

      <Text mb="xl" size="md">
        {eventDetails.description}
      </Text>

      {/* Selection controls */}
      {isSelectionMode && eventDetails.images && eventDetails.images.length > 0 && (
        <Box mb="lg" p="md" sx={(theme) => ({
          backgroundColor: theme.colors.gray[0],
          borderRadius: theme.radius.md,
          border: `1px solid ${theme.colors.gray[3]}`,
        })}>
          <Group position="apart" mb="sm">
            <Group spacing="xs">
              <Badge color={studentProfileColor} variant="filled">
                {selectedImages.size} selected
              </Badge>
              <Text size="sm" color="dimmed">
                of {eventDetails.images.length} images
              </Text>
            </Group>
            
            <Group spacing="xs">
              <Button
                size="xs"
                variant="outline"
                color={studentProfileColor}
                leftIcon={<IconSelectAll size={14} />}
                onClick={selectAllImages}
                disabled={selectedImages.size === eventDetails.images.length}
              >
                Select All
              </Button>
              
              <Button
                size="xs"
                variant="subtle"
                color="gray"
                onClick={clearSelection}
                disabled={selectedImages.size === 0}
              >
                Clear
              </Button>
            </Group>
          </Group>
          
          {selectedImages.size > 0 && (
            <Button
              leftIcon={<IconShare size={16} />}
              color={studentProfileColor}
              onClick={shareSelectedImages}
              fullWidth
            >
              Share Selected Images ({selectedImages.size})
            </Button>
          )}
        </Box>
      )}

      {eventDetails.images && eventDetails.images.length > 0 ? (
        <SimpleGrid
          cols={3}
          spacing="md"
          breakpoints={[
            { maxWidth: "md", cols: 3 },
            { maxWidth: "sm", cols: 2 },
            { maxWidth: "xs", cols: 1 },
          ]}
        >
          {eventDetails.images.map((image) => (
            <Box
              key={image.id}
              sx={{
                position: "relative",
                cursor: "pointer",
                borderRadius: 8,
                overflow: "hidden",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                "&:hover": {
                  transform: "scale(1.02)",
                  transition: "transform 0.2s ease",
                },
                border: isSelectionMode && selectedImages.has(image.id) 
                  ? `3px solid ${studentProfileColor}` 
                  : "none",
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (isSelectionMode) {
                  toggleImageSelection(image.id);
                } else {
                  setViewImage(image);
                }
              }}
            >
              {isSelectionMode && (
                <Checkbox
                  checked={selectedImages.has(image.id)}
                  onChange={() => toggleImageSelection(image.id)}
                  size="md"
                  color={studentProfileColor}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    zIndex: 10,
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "50%",
                    padding: 2,
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
              
              <Image
                src={image.thumbnail}
                height={180}
                alt={image.caption}
                withPlaceholder
                sx={{ 
                  objectFit: "cover",
                  opacity: isSelectionMode && selectedImages.has(image.id) ? 0.8 : 1,
                }}
              />
              
              {isSelectionMode && selectedImages.has(image.id) && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: `${studentProfileColor}22`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Badge color={studentProfileColor} size="lg" variant="filled">
                    Selected
                  </Badge>
                </Box>
              )}
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <Text align="center" color="dimmed" my={30}>
          No images found for this event
        </Text>
      )}

      <Modal
        opened={!!viewImage}
        onClose={() => setViewImage(null)}
        size="xl"
        padding="xs"
        centered
      >
        {viewImage && (
          <Box>
            <Image
              src={viewImage.url}
              alt={viewImage.caption}
              withPlaceholder
              sx={{ maxHeight: "70vh" }}
            />
            <Group position="apart" mt="md">
              <Text size="sm">{viewImage.caption}</Text>

              <Group spacing="xs">
                <Button
                  leftIcon={<IconShare size={16} />}
                  variant="light"
                  color={studentProfileColor}
                  onClick={() => {
                    // Use the Walsh mobile app bridge if available

                    if (window.walshmobile?.shareImage) {
                      // First fetch the image to convert to base64
                      fetch(viewImage.url)
                        .then((response) => response.blob())
                        .then((blob) => {
                          // Convert blob to base64
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const base64data = reader.result?.toString() || "";

                            // Extract base64 content without the data URL prefix
                            const base64Content =
                              base64data.split(",")[1] || base64data;

                            // Generate filename from image caption or event title
                            const filename = `${
                              viewImage.caption ||
                              eventDetails.title ||
                              "event-image"
                            }.jpg`;

                            // Call the mobile app bridge function
                            window?.walshmobile?.shareImage?.(
                              base64Content,
                              filename
                            );

                            showNotification({
                              title: "Sharing with app",
                              message:
                                "The image is being shared via Walsh app",
                              color: "green",
                            });
                          };
                          reader.readAsDataURL(blob);
                        })
                        .catch((err) => {
                          console.error(
                            "Error preparing image for mobile sharing:",
                            err
                          );
                          // Fall back to Web Share API if available
                          shareWithFallback();
                        });
                    } else {
                      // Use regular sharing methods as fallback
                      shareWithFallback();
                    }

                    // Function for fallback sharing methods
                    function shareWithFallback() {
                      // Use Web Share API if available
                      if (navigator.share) {
                        navigator
                          .share({
                            title: viewImage?.caption || eventDetails?.title,
                            text: `Check out this image from ${eventDetails?.title}`,
                            url: viewImage?.url,
                          })
                          .then(() => {
                            showNotification({
                              title: "Shared successfully",
                              message: "The image has been shared",
                              color: "green",
                            });
                          })
                          .catch((err) => {
                            console.error("Error sharing:", err);
                            showNotification({
                              title: "Sharing failed",
                              message: "Could not share the image",
                              color: "red",
                            });
                          });
                      } else {
                        // Fallback - copy image to clipboard instead of just the URL
                        // Fetch the image and convert it to a blob
                        if (!viewImage?.url) return;
                        fetch(viewImage?.url)
                          .then((response) => response.blob())
                          .then((blob) => {
                            // Create a ClipboardItem
                            const item = new ClipboardItem({
                              [blob.type]: blob,
                            });
                            // Write the image to clipboard
                            navigator.clipboard
                              .write([item])
                              .then(() => {
                                showNotification({
                                  title: "Copied to clipboard",
                                  message:
                                    "Image copied to clipboard successfully",
                                  color: "green",
                                });
                              })
                              .catch((err) => {
                                console.error("Failed to copy image: ", err);
                                // Fall back to copying URL if image copy fails
                                navigator.clipboard
                                  .writeText(viewImage.url)
                                  .then(() => {
                                    showNotification({
                                      title: "Copied to clipboard",
                                      message:
                                        "Image URL copied to clipboard (image copy not supported in this browser)",
                                      color: "blue",
                                    });
                                  })
                                  .catch(() => {
                                    showNotification({
                                      title: "Copy failed",
                                      message: "Could not copy to clipboard",
                                      color: "red",
                                    });
                                  });
                              });
                          })
                          .catch((err) => {
                            console.error("Failed to fetch image: ", err);
                            // Fall back to copying URL if image fetch fails
                            navigator.clipboard
                              .writeText(viewImage.url)
                              .then(() => {
                                showNotification({
                                  title: "Copied to clipboard",
                                  message:
                                    "Image URL copied to clipboard (couldn't fetch the image)",
                                  color: "blue",
                                });
                              })
                              .catch(() => {
                                showNotification({
                                  title: "Copy failed",
                                  message: "Could not copy to clipboard",
                                  color: "red",
                                });
                              });
                          });
                      }
                    }
                  }}
                >
                  Share
                </Button>
                <Button
                  leftIcon={<IconDownload size={16} />}
                  variant="light"
                  color={studentProfileColor}
                  component="a"
                  href={viewImage.url}
                  download
                  target="_blank"
                >
                  Download
                </Button>
              </Group>
            </Group>
          </Box>
        )}
      </Modal>
    </Box>
  );
};

export default EventDetail;

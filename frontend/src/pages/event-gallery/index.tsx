import {
  Box,
  Button,
  Card,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Loader,
  TextInput,
  Collapse,
  Paper,
  ActionIcon,
} from "@mantine/core";
import { useEffect, useMemo, useRef, useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useStudentList from "../../components/queries/useStudentList";
import useClassDetails from "../../components/queries/useClassDetails";
import useStudentProfileColor from "../../components/hooks/useStudentProfileColor";
import useStudentEvents from "../../components/queries/useStudentEvents";
import { IconCalendarEvent, IconChevronDown, IconPhoto, IconSearch, IconX } from "@tabler/icons";

// Observer component for infinite scrolling
interface LoadMoreTriggerProps {
  loadMore: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  color: string;
  isFetched?: boolean;
}

const LoadMoreTrigger = ({
  loadMore,
  hasNextPage,
  isFetchingNextPage,
  color,
  isFetched = true,
}: LoadMoreTriggerProps) => {
  const triggerRef = useRef<HTMLDivElement>(null);

  // Set up intersection observer only if we have more pages to load
  useEffect(() => {
    if (!triggerRef.current || !hasNextPage || !isFetched) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // If trigger is visible and we have more pages to load
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    observer.observe(triggerRef.current);

    return () => {
      if (triggerRef.current) {
        observer.unobserve(triggerRef.current);
      }
    };
  }, [loadMore, hasNextPage, isFetchingNextPage, isFetched]);

  // Don't render anything if there are no more pages or data hasn't been fetched yet
  if (!hasNextPage || !isFetched) return null;

  return (
    <Box
      ref={triggerRef}
      sx={{
        textAlign: "center",
        padding: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "10px",
      }}
    >
      {isFetchingNextPage ? (
        <Loader size="sm" color={color} />
      ) : (
        <Button
          variant="subtle"
          color={color}
          onClick={() => loadMore()}
          leftIcon={<IconChevronDown size={16} />}
          size="sm"
        >
          Load more events
        </Button>
      )}
    </Box>
  );
};

const EventGallery = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchedStudent = searchParams.get("student") || "";
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [eventNameFilter, setEventNameFilter] = useState("");

  const { data: studentsList } = useStudentList();

  const students = useMemo(
    () => studentsList?.data?.message || [],
    [studentsList?.data]
  );

  // Find student ID from search params or use first student
  const selectedStudent = useMemo(() => {
    if (searchedStudent && students.some((s) => s.name === searchedStudent)) {
      return searchedStudent;
    }
    return students[0]?.name || "";
  }, [searchedStudent, students]);

  // Update URL when selected student changes
  useEffect(() => {
    if (selectedStudent && searchedStudent !== selectedStudent) {
      setSearchParams({ student: selectedStudent }, { replace: true });
    }
  }, [selectedStudent, searchedStudent, setSearchParams]);

  // Load student details
  const {
    data: classDetails,
    error: classError,
    isFetching: classLoading,
  } = useClassDetails(selectedStudent);

  // Get student event data with infinite loading
  const {
    data: eventsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: eventsLoading,
    isError: eventsError,
    isFetched,
  } = useStudentEvents(selectedStudent, { eventNameFilter });
  // Flattened events from all pages
  const allEvents = useMemo(() => {
    if (!eventsData?.pages) return [];
    return eventsData.pages.flatMap((page) => page.events || []);
  }, [eventsData?.pages]);

  // Handle student selection
  const handleStudentSelect = useCallback(
    (studentId: string) => {
      setSearchParams({ student: studentId }, { replace: true });
    },
    [setSearchParams]
  );

  const studentProfileColor = useStudentProfileColor(selectedStudent);
  const notEnrolledInProgram =
    classLoading ||
    classError ||
    !classDetails?.data?.message ||
    Object.keys(classDetails?.data?.message).length === 0;

  return (
    <Box>
      {/* Student selector */}
      <Stack
        sx={{
          whiteSpace: "nowrap",
          overflow: "auto",
          flexDirection: "row",
          gap: 0,
        }}
      >
        {students.map((student, index) => {
          const isSelected = selectedStudent === student.name;
          return (
            <Box
              key={index}
              sx={{
                display: "inline-block",
                marginTop: 10,
                flexShrink: 0,
                flexGrow: 1,
                textAlign: "center",
                minWidth: "33.33%",
              }}
              onClick={() => handleStudentSelect(student.name)}
            >
              <Text
                sx={{
                  paddingLeft: 20,
                  paddingRight: 20,
                  borderLeft: index ? "1px solid black" : "none",
                  color: isSelected ? "black" : "#0007",
                }}
              >
                {student.first_name}
              </Text>
              <Box
                sx={{
                  marginTop: isSelected ? 4 : 5,
                  borderBottom: isSelected
                    ? `2px solid ${studentProfileColor}`
                    : "1px solid #0005",
                }}
              />
            </Box>
          );
        })}
      </Stack>

      {/* Event Gallery Content */}
      {notEnrolledInProgram ? (
        <Text align="center" color="dimmed" weight="bold" my={30}>
          {classLoading ? "Loading..." : "Not Enrolled in program"}
        </Text>
      ) : (
        <Box mx="md" my="xl">
          <Group mb="md" position="apart">
            <Title order={3} color={studentProfileColor}>
              <Group spacing="xs">
                <IconCalendarEvent size={24} />
                <Text>Events Gallery</Text>
              </Group>
            </Title>

            <Group spacing="xs">
              {students.find((student) => student.name === selectedStudent)
                ?.reference_number && (
                <Text
                  sx={{
                    borderRadius: 50,
                    backgroundColor: `${studentProfileColor}22`,
                    padding: "3px 8px",
                    fontSize: 12,
                    display: "inline-block",
                    height: "1.4em",
                    lineHeight: 1.4,
                    color: studentProfileColor,
                    fontWeight: "bold",
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                  }}
                >
                  {
                    students.find((student) => student.name === selectedStudent)
                      ?.reference_number
                  }
                </Text>
              )}
              
              <ActionIcon
                variant="subtle"
                color={studentProfileColor}
                onClick={() => setShowFilters(!showFilters)}
                size="md"
              >
                <IconSearch size={18} />
              </ActionIcon>
            </Group>
          </Group>
          
          {/* Filters Section */}
          <Collapse in={showFilters}>
            <Paper p="md" mb="md" withBorder>
              <Group mb="sm" position="apart">
                <Text weight={500} color={studentProfileColor}>
                  Search Events
                </Text>
                {eventNameFilter && (
                  <Button
                    variant="subtle"
                    color={studentProfileColor}
                    size="xs"
                    leftIcon={<IconX size={14} />}
                    onClick={() => setEventNameFilter("")}
                  >
                    Clear
                  </Button>
                )}
              </Group>
              
              <TextInput
                placeholder="Search events by name..."
                value={eventNameFilter}
                onChange={(e) => setEventNameFilter(e.target.value)}
                size="sm"
                icon={<IconSearch size={16} />}
              />
            </Paper>
          </Collapse>

          {eventsLoading && !allEvents.length ? (
            <Box py={50} sx={{ textAlign: "center" }}>
              <Loader color={studentProfileColor} />
              <Text mt="md" color="dimmed">
                Loading events...
              </Text>
            </Box>
          ) : eventsError || !allEvents.length ? (
            <Text align="center" py={50} color="dimmed">
              No events found
            </Text>
          ) : (
            <>
              <SimpleGrid
                cols={2}
                spacing="md"
                breakpoints={[{ maxWidth: "sm", cols: 1 }]}
              >
                {allEvents.map((event) => (
                  <Card
                    key={event.id}
                    shadow="sm"
                    p="lg"
                    radius="md"
                    withBorder
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                        transform: "translateY(-5px)",
                        transition: "all 0.2s ease",
                      },
                    }}
                    onClick={() =>
                      navigate(
                        `/event-gallery/event-detail?eventId=${event.id}&student=${selectedStudent}`
                      )
                    }
                  >
                    <Card.Section>
                      <Image
                        src={event.thumbnail}
                        height={180}
                        alt={event.title}
                        withPlaceholder
                      />
                    </Card.Section>

                    <Group position="apart" mt="md" mb="xs">
                      <Text weight={500} color={studentProfileColor}>
                        {event.title}
                      </Text>
                    </Group>

                    <Text size="sm" color="dimmed" mb="md">
                      {event.description}
                    </Text>

                    <Group position="apart">
                      <Text size="xs" color="gray">
                        {event.date}
                      </Text>
                      <Group spacing={4}>
                        <IconPhoto
                          size={14}
                          stroke={1.5}
                          color={studentProfileColor}
                        />
                        <Text size="xs" color={studentProfileColor}>
                          {event.imageCount}
                        </Text>
                      </Group>
                    </Group>
                  </Card>
                ))}
              </SimpleGrid>

              {/* Infinite scroll trigger */}
              <LoadMoreTrigger
                loadMore={() => fetchNextPage()}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                isFetched={isFetched}
                color={studentProfileColor}
              />
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default EventGallery;

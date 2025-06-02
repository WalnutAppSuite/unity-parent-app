import React, { useMemo, useRef, useEffect, useState } from "react";
import {
  Box,
  Flex,
  Stack,
  Text,
  Loader,
  Center,
  Table,
  Paper,
} from "@mantine/core";
import { useSearchParams } from "react-router-dom";
import useStudentList from "../components/queries/useStudentList.ts";
import useClassDetails from "../components/queries/useClassDetails.ts";
import useStudentProfileColor from "../components/hooks/useStudentProfileColor.ts";
import useFetchTimeTable from "../components/queries/useTimetable";

type ScheduleEntry = {
  subject: string;
  instructor: string;
  room: string;
  room_number: string;
  time: string;
};

const formatTime = (time: string) =>
  time
    .split(" - ")
    .map((t) => t.substring(0, 5))
    .join(" - ");

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const getCurrentDayIndex = () => {
  const jsDay = new Date().getDay();
  if (jsDay >= 1 && jsDay <= 5) return jsDay - 1;
  return null;
};

const TimetableCell: React.FC<{
  entry?: ScheduleEntry;
  studentProfileColor: string;
}> = ({ entry, studentProfileColor }) => {
  if (!entry) {
    return (
      <Text color="gray.5" align="center">
        -
      </Text>
    );
  }

  return (
    <Paper
      shadow="sm"
      radius="md"
      p="sm"
      withBorder
      sx={{
        minHeight: 130, 
        height: "100% !important",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "box-shadow 0.2s",
        overflow: "hidden",
        background: "#f9f9fb",
      }}
    >
      <Stack
        spacing={3}
        align="center"
        justify="center"
        w="100%"
        h="100%"
        sx={{
          textAlign: "center",
          width: "100%",
          minHeight: 70,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text weight={700} color={studentProfileColor} size="sm">
          {entry.subject}
        </Text>
        <Text color="dark" size="sm" >
          {entry.instructor || ""}
        </Text>
        <Text color="gray.7" size="sm" >
          {entry.room_number || ""}
        </Text>
        <Text color="gray.5" size="xs">
          {formatTime(entry.time) || ""}
        </Text>
      </Stack>
    </Paper>
  );
};

const LeaveNote = () => {
  const [searchParams, _] = useSearchParams();

  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [isTimetableLoading, setIsTimetableLoading] = useState<boolean>(false);
  const [timetableData, setTimetableData] = useState<any>(null); // Explicit timetable state
  const searchedStudent = searchParams.get("student");

  const { data: studentsList } = useStudentList();
  const {
    data: classDetails,
    error: classError,
    isFetching: classLoading,
  } = useClassDetails(selectedStudent);

  const students = useMemo(
    () => studentsList?.data?.message || [],
    [studentsList?.data]
  );

  const [divisionName, setDivisionName] = useState<string>("");

  // Handle student selection and reset timetable
  useEffect(() => {
    const studentNames = students?.map((student) => student.name) || [];
    if (
      !selectedStudent &&
      searchedStudent &&
      selectedStudent !== searchedStudent &&
      studentNames.includes(searchedStudent)
    ) {
      setSelectedStudent(searchedStudent);
    } else if (!studentNames.includes(selectedStudent)) {
      setSelectedStudent(studentNames[0]);
    }

    // Reset timetable data and division name
    setDivisionName("");
    setTimetableData(null); // Clear timetable immediately
    setIsTimetableLoading(true); // Show loading state
  }, [searchedStudent, selectedStudent, students]);

  // Update division name when class details are fetched
  useEffect(() => {
    if (classDetails?.data?.message?.division?.name) {
      setDivisionName(classDetails.data.message.division.name);
    } else {
      setDivisionName("");
    }
  }, [classDetails]);

  // Fetch timetable when divisionName changes
  const {
    data: timetable,
    isLoading,
    isError,
  } = useFetchTimeTable(divisionName);

  useEffect(() => {
    if (isLoading) {
      setIsTimetableLoading(true);
      setTimetableData(null); // Clear timetable while loading
    } else if (timetable && Object.keys(timetable.timetable || {}).length > 0) {
      setIsTimetableLoading(false);
      setTimetableData(timetable); // Set new timetable data
    } else {
      setIsTimetableLoading(false);
      setTimetableData(null); // No timetable available
    }
  }, [timetable, isLoading]);

  const studentProfileColor = useStudentProfileColor(selectedStudent);
  const notEnrolledInProgram =
    classLoading ||
    classError ||
    !classDetails?.data?.message ||
    Object.keys(classDetails?.data?.message).length === 0;

  const dayRefs = useRef<(HTMLTableHeaderCellElement | null)[]>([]);
  const currentDayIndex = getCurrentDayIndex();

  useEffect(() => {
    if (currentDayIndex !== null && dayRefs.current[currentDayIndex]) {
      dayRefs.current[currentDayIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentDayIndex]);

  const getScheduleEntry = (scheduleItem: any): ScheduleEntry | undefined => {
    if (Array.isArray(scheduleItem)) {
      return scheduleItem.find((item) => isScheduleEntry(item)) as
        | ScheduleEntry
        | undefined;
    }

    if (
      scheduleItem &&
      typeof scheduleItem === "object" &&
      isScheduleEntry(scheduleItem)
    ) {
      return scheduleItem as ScheduleEntry;
    }

    return undefined;
  };

  function isScheduleEntry(value: unknown): value is ScheduleEntry {
    return (
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      "subject" in value &&
      typeof value.subject === "string" &&
      "instructor" in value &&
      typeof value.instructor === "string" &&
      "room" in value &&
      typeof value.room === "string" &&
      "room_number" in value &&
      typeof value.room_number === "string" &&
      "time" in value &&
      typeof value.time === "string"
    );
  }

  return (
    <Box>
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
              onClick={() => setSelectedStudent(student.name)}
            >
              <Text
                sx={{
                  paddingLeft: 20,
                  paddingRight: 20,
                  borderLeft: index && "1px solid black",
                  color: isSelected ? "black" : "#0007",
                }}
              >
                {student.first_name}
              </Text>
              <Box
                sx={{
                  marginTop: isSelected ? 4 : 5,
                  borderBottom: isSelected
                    ? "2px solid " + studentProfileColor
                    : "1px solid #0005",
                }}
              />
            </Box>
          );
        })}
      </Stack>
      {notEnrolledInProgram ? (
        <Text align="center" color="dimmed" weight="bold" my={30}>
          {classLoading ? "Loading..." : "Not Enrolled in program"}
        </Text>
      ) : isTimetableLoading ? (
        <Flex sx={{ width: "100%", overflow: "auto" }}>
          <Center mih={180} w="100%" style={{ width: "100%" }}>
            <Loader size={32} color={studentProfileColor} />
          </Center>
        </Flex>
      ) : isError ? (
        <Flex sx={{ width: "100%", overflow: "auto" }}>
          <Center mih={180} w="100%" style={{ width: "100%" }}>
            <Text align="center" color="gray">
              No time table for respective division
            </Text>
          </Center>
        </Flex>
      ) : !timetableData ? (
        <Flex sx={{ width: "100%", overflow: "auto" }}>
          <Center mih={180} w="100%" style={{ width: "100%" }}>
            <Text align="center" color="gray">
              No timetable available from API or CSV.
            </Text>
          </Center>
        </Flex>
      ) : (
        <Flex sx={{ width: "100%", overflow: "auto" }}>
          <Table
            withBorder
            striped
            highlightOnHover
            horizontalSpacing="sm"
            verticalSpacing="xs"
            fontSize="xs"
            sx={{
              minWidth: "100%",
              overflowX: "auto",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    position: "sticky",
                    left: 0,
                    top: 0,
                    zIndex: 3,
                    background: "#fff",
                    boxShadow: "2px 0 2px -1px #0001",
                  }}
                >
                  <Text weight={500} size="xs">
                    Period
                  </Text>
                </th>
                {days.map((day, idx) => (
                  <th
                    key={day}
                    ref={(el) => (dayRefs.current[idx] = el)}
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 2,
                      textAlign: "center",
                      backgroundColor:
                        idx === currentDayIndex
                          ? studentProfileColor + "22"
                          : "#fff",
                      transition: "background 0.3s",
                    }}
                  >
                    <Text
                      color={
                        idx === currentDayIndex ? studentProfileColor : "gray.7"
                      }
                      weight={500}
                      size="xs"
                    >
                      {day}
                    </Text>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(timetableData.timetable).map(
                ([period, schedule]) => (
                  <tr key={period}>
                    <td
                      style={{
                        position: "sticky",
                        left: 0,
                        zIndex: 2,
                        background: "#fff",
                        boxShadow: "2px 0 2px -1px #0001",
                      }}
                    >
                      <Text weight={700} color="dark" align="center" size="xs">
                        {period}
                      </Text>
                    </td>
                    {days.map((day, idx) => (
                      <td
                        key={day}
                        style={{
                          padding: 6,
                          backgroundColor:
                            idx === currentDayIndex
                              ? studentProfileColor + "22"
                              : undefined,
                          transition: "background 0.3s",
                          minWidth: 150,
                        }}
                      >
                        <TimetableCell
                          entry={getScheduleEntry(
                            (schedule as Record<string, any>)[day]
                          )}
                          studentProfileColor={studentProfileColor}
                        />
                      </td>
                    ))}
                  </tr>
                )
              )}
            </tbody>
          </Table>
        </Flex>
      )}
    </Box>
  );
};

export default LeaveNote;

import { Box, Flex, Stack, Text, Loader, Center } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useStudentList from "../components/queries/useStudentList.ts";
import useClassDetails from "../components/queries/useClassDetails.ts";
import useStudentProfileColor from "../components/hooks/useStudentProfileColor.ts";
import useFetchTimeTable from "../components/queries/useTimetable";
import TimetableComponent from "../components/Timetable";

const LeaveNote = () => {
  const [searchParams, _] = useSearchParams();

  const [selectedStudent, setSelectedStudent] = useState<string>("");
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

  useEffect(() => {
    const studentNames = students?.map((student) => student.name) || [];
    if (
      !selectedStudent &&
      searchedStudent &&
      selectedStudent != searchedStudent &&
      studentNames.includes(searchedStudent)
    ) {
      setSelectedStudent(searchedStudent);
    } else if (!studentNames.includes(selectedStudent)) {
      setSelectedStudent(studentNames[0]);
    }
  }, [searchedStudent, selectedStudent, students]);

  const studentProfileColor = useStudentProfileColor(selectedStudent);
  const notEnrolledInProgram =
    classLoading ||
    classError ||
    !classDetails?.data?.message ||
    Object.keys(classDetails?.data?.message).length == 0;

  const [divisionName, setDivisionName] = useState<string>("");

  useEffect(() => {
    if (classDetails?.data?.message?.division?.name) {
      setDivisionName(classDetails.data.message.division.name);
    } else {
      setDivisionName("");
    }
  }, [classDetails]);

  const {
    data: timetable,
    isLoading,
    isError,
  } = useFetchTimeTable(divisionName);

  return (
    <Box>
      <Stack
        sx={{
          whiteSpace: "nowrap",
          overflow: "auto",
          flexDirection: "row",
          // borderBottom: '1px solid  #0005',
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
                // marginBottom: 10,
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
      ) : isLoading ? (
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
      ) : !timetable || !timetable.timetable || Object.keys(timetable.timetable).length === 0 ? (
        <Flex sx={{ width: "100%", overflow: "auto" }}>
          <Center mih={180} w="100%" style={{ width: "100%" }}>
            <Text align="center" color="gray">
              No timetable available from API or CSV.
            </Text>
          </Center>
        </Flex>
      ) : (
        <Flex sx={{ width: "100%", overflow: "auto" }}>
          <TimetableComponent
            data={timetable}
            studentProfileColor={studentProfileColor}
          />
        </Flex>
      )}
    </Box>
  );
};

export default LeaveNote;

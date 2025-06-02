import { Box, Flex, Stack, Text, Loader, Center } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useStudentList from "../../components/queries/useStudentList";
import useClassDetails from "../../components/queries/useClassDetails";
import useStudentProfileColor from "../../components/hooks/useStudentProfileColor";
import type { Student } from "../../components/queries/useStudentList";

const Wiki = () => {
  const [searchParams] = useSearchParams();
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const searchedStudent = searchParams.get("student");

  const { data: studentsList } = useStudentList();
  const {
    data: classDetails,
    error: classError,
    isFetching: classLoading,
  } = useClassDetails(selectedStudent);

  const students: Student[] = studentsList?.data?.message || [];

  useEffect(() => {
    const studentNames = students.map((student) => student.name);
    if (searchedStudent && studentNames.includes(searchedStudent)) {
      setSelectedStudent(searchedStudent);
    } else if (!studentNames.includes(selectedStudent)) {
      setSelectedStudent(studentNames[0] || "");
    }
  }, [searchedStudent, selectedStudent, students]);

  const studentProfileColor = useStudentProfileColor(selectedStudent);

  const notEnrolledInProgram =
    classError ||
    !classDetails?.data?.message ||
    Object.keys(classDetails?.data?.message).length === 0;

  const renderContent = useCallback(() => {
    if (classLoading) {
      return (
        <Flex sx={{ width: "100%", overflow: "auto" }}>
          <Center mih={180} w="100%">
            <Loader size={32} color={studentProfileColor} />
          </Center>
        </Flex>
      );
    }

    if (notEnrolledInProgram) {
      return (
        <Text align="center" color="dimmed" weight="bold" my={30}>
          Not enrolled in program
        </Text>
      );
    }

    if (!classDetails?.data?.message?.program?.wiki_link) {
      return (
        <Flex sx={{ width: "100%", overflow: "auto" }}>
          <Center mih={180} w="100%">
            <Text align="center" color="gray">No wiki link found</Text>
          </Center>
        </Flex>
      );
    }

    return (
      <iframe
        src={classDetails?.data?.message?.program?.wiki_link || "https://erp.walnutedu.in/Std-1-to-10/know-your-dates-for-the-2025-26-academic-year"}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
      />
    );
  }, [notEnrolledInProgram, classLoading, classDetails, studentProfileColor]);

  return (
    <Box h="100%">
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
              key={student.name}
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
                  borderLeft: index ? "1px solid black" : undefined,
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
      {renderContent()}
    </Box>
  );
};

export default Wiki;
import { Box, Stack, Text } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useStudentList from "../components/queries/useStudentList";
import useStudentProfileColor from "../components/hooks/useStudentProfileColor";

export const SchoolCalendar = () => {
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [searchParams, setSearchParams] = useSearchParams();
  const searchedStudent = searchParams.get("student");

  const { data, isLoading } = useStudentList();
  const students = useMemo(
    () => data?.data?.message || [],
    [data?.data]
  );

  // Find the custom calendar link for the selected student
  const custom_calendar_link = useMemo(() => {
    if (!selectedStudent || !students.length) return "";
    const student = students.find(student => student.name === selectedStudent);
    return student?.custom_calendar_link || "";
  }, [selectedStudent, students]);

  // Set up URL parameters for selected student
  useEffect(() => {
    if (selectedStudent) {
      searchParams.set("student", selectedStudent || "");
      setSearchParams(searchParams, { replace: true });
    }
  }, [selectedStudent]);

  // Handle initial student selection
  useEffect(() => {
    const studentNames = students?.map((student) => student.name) || [];
    if (
      !selectedStudent &&
      searchedStudent &&
      selectedStudent != searchedStudent &&
      studentNames.includes(searchedStudent)
    ) {
      setSelectedStudent(searchedStudent);
    } else if (!selectedStudent && studentNames.length > 0) {
      setSelectedStudent(studentNames[0]);
    }
  }, [searchedStudent, selectedStudent, students]);

  const studentProfileColor = useStudentProfileColor(selectedStudent);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <Box>
      {/* Student tabs */}
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
              onClick={() => {
                setSelectedStudent(student.name);
              }}
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

      {/* Calendar content */}
      <Box mt={20}>
        {!custom_calendar_link ? (
          <div className="flex items-center justify-center h-screen">
            <p className="text-lg text-gray-600">Calendar not found for {selectedStudent}</p>
          </div>
        ) : (
          <div>
            <iframe
              title="School Calendar"
              src={custom_calendar_link}
              style={{
                border: 0,
                height: "calc(100vh - 140px)", // Adjusted for the tabs
                width: "100%",
              }}
              frameBorder="0"
              scrolling="no"
            ></iframe>
          </div>
        )}
      </Box>
    </Box>
  );
};

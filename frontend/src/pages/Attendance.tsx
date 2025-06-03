import { Button, Flex, Box, Text, Center, Alert } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { IconAlertCircle } from "@tabler/icons-react";
import AttendanceCalendar from "../components/calendar";
import LeaveNoteForm from "../components/leave note";
import useStudentList from "../components/queries/useStudentList";
import useStudentProfileColor from "../components/hooks/useStudentProfileColor";

interface Student {
  first_name: string;
  name: string;
}

type AttendanceCategory =
  | "Attendance count"
  | "Leave Note"
  | "Late Coming"
  | "Early Pickup";

function Attendance(): JSX.Element {
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedCategory, setSelectedCategory] =
    useState<AttendanceCategory>("Attendance count");
  const { data: studentsList, isLoading, isError } = useStudentList();

  const students = useMemo<Student[]>(
    () => studentsList?.data?.message || [],
    [studentsList?.data]
  );

  const studentProfileColor = useStudentProfileColor(selectedStudent);

  const buttonArray: AttendanceCategory[] = [
    "Attendance count",
    "Leave Note",
    "Late Coming",
    "Early Pickup",
  ];

  useEffect(() => {
    if (students.length > 0 && !selectedStudent) {
      setSelectedStudent(students[0].name);
    }
  }, [students, selectedStudent]);

  const renderContent = (): JSX.Element => {
    switch (selectedCategory) {
      case "Attendance count":
        return (
          <AttendanceCalendar
            students={students}
            selectedStudentId={selectedStudent}
          />
        );
      case "Leave Note":
        return (
          <LeaveNoteForm
            subject="leave"
            students={students}
            selectedStudent={selectedStudent}
            bgColor={studentProfileColor}
          />
        );
      case "Late Coming":
        return (
          <LeaveNoteForm
            subject="late-arrival"
            students={students}
            selectedStudent={selectedStudent}
            bgColor={studentProfileColor}
          />
        );
      case "Early Pickup":
        return (
          <LeaveNoteForm
            subject="early-pickup"
            students={students}
            selectedStudent={selectedStudent}
            bgColor={studentProfileColor}
          />
        );
      default:
        return <div>Select a category</div>;
    }
  };

  if (isLoading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Flex direction="column" align="center" gap="md">
          <Text size="md">Loading student data...</Text>
        </Flex>
      </Center>
    );
  }

  if (isError) {
    return (
      <Center style={{ height: "100vh", padding: "0 20px" }}>
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error"
          color="red"
          variant="filled"
          style={{ maxWidth: "500px", width: "100%" }}
        >
          Something went wrong while loading attendance data. Please try again
          later.
        </Alert>
      </Center>
    );
  }

  return (
    <div>
      <Box style={{ maxWidth: "100%", overflow: "auto" }}>
        <Flex>
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
        </Flex>
      </Box>

      <Flex
        mt={5}
        mx={10}
        gap={8}
        px={0}
        py={8}
        sx={{
          overflowX: "auto",
          whiteSpace: "nowrap",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          "::-webkit-scrollbar": { display: "none" },
        }}
      >
        {buttonArray.map((item) => (
          <Button
            key={item}
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              border:
                selectedCategory === item
                  ? `1px solid ${studentProfileColor}`
                  : "1px solid #ccc",
              backgroundColor:
                selectedCategory === item ? studentProfileColor : "#fff",
              color: selectedCategory === item ? "#fff" : "#000",
              cursor: "pointer",
              transition:
                "background-color 0.3s ease, color 0.3s ease, border 0.3s ease",
              whiteSpace: "nowrap",
            }}
            onClick={() => setSelectedCategory(item)}
          >
            {item}
          </Button>
        ))}
      </Flex>

      <Flex style={{ margin: "1rem", flexDirection: "column" }}>
        {renderContent()}
      </Flex>
    </div>
  );
}

export default Attendance;

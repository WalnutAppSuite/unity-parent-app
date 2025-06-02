import { Box, Button, Select, Stack, Text } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useStudentList from "../../components/queries/useStudentList.ts";
import useClassDetails from "../../components/queries/useClassDetails.ts";
import useStudentProfileColor from "../../components/hooks/useStudentProfileColor.ts";
import { IconBook, IconList, IconCalendar } from "@tabler/icons";
import HelpLink from "../../components/HelpLink/index.tsx";
// import { useAcademicYear } from "../../hooks/useAcademicYear.ts";
import {
  useStudentEnrollmentYears,
  EnrollmentData,
} from "../../components/queries/useAcademicYear.ts";

const Cmap = () => {
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedUnit, setSelectedUnit] = useState<string>("1");
  const [selectedYear, setSelectedYear] = useState<EnrollmentData | null>(null);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchedStudent = searchParams.get("student");

  const {
    years,
    isLoading: isLoadingYears,
    defaultYearEnrollment,
  } = useStudentEnrollmentYears(selectedStudent);

  const { data: studentsList } = useStudentList();
  const { data: classDetails, isFetching: classLoading } = useClassDetails(
    selectedStudent,
    selectedYear?.academic_year
  );

  const students = useMemo(
    () => studentsList?.data?.message || [],
    [studentsList?.data]
  );

  // Set the default year when it becomes available
  useEffect(() => {
    if (defaultYearEnrollment && !selectedYear) {
      setSelectedYear(defaultYearEnrollment);
    }
  }, [defaultYearEnrollment]);

  useEffect(() => {
    if (selectedStudent) {
      searchParams.set("student", selectedStudent || "");
      setSearchParams(searchParams, { replace: true });
    }
  }, [selectedStudent, searchParams, setSearchParams]);

  const subjectOptions = useMemo(() => {
    return (
      classDetails?.data?.message?.class?.subject?.map?.((subject) => ({
        label: subject.subject,
        value: subject.subject,
      })) || []
    );
  }, [classDetails?.data?.message?.class?.subject]);

  const unitOptions = useMemo(() => {
    return [...Array(4)].map((_, i) => ({
      label: `Unit ${i + 1}`,
      value: `${i + 1}`,
    }));
  }, []);

  useEffect(() => {
    const studentNames = students?.map((student) => student.name) || [];
    if (
      !selectedStudent &&
      searchedStudent &&
      selectedStudent != searchedStudent &&
      studentNames.includes(searchedStudent)
    ) {
      setSelectedStudent(searchedStudent);
    } else if (
      !studentNames.includes(selectedStudent) &&
      studentNames.length > 0
    ) {
      setSelectedStudent(studentNames[0]);
    }
  }, [searchedStudent, selectedStudent, students]);

  useEffect(() => {
    const subjectNames = subjectOptions.map((subject) => subject.value);
    if (subjectNames.length > 0 && !subjectNames.includes(selectedSubject)) {
      setSelectedSubject(subjectNames[0]);
    }
  }, [selectedSubject, subjectOptions]);

  useEffect(() => {
    const unitNames = unitOptions.map((unit) => unit.value);
    if (!unitNames.includes(selectedUnit)) {
      setSelectedUnit(unitNames[0]);
    }
  }, [selectedUnit, unitOptions]);

  const handleYearChange = (e: string | null) => {
    const yearEnrollment = years.find((v) => v.academic_year === e);
    if (yearEnrollment) {
      setSelectedYear(yearEnrollment);
    } else {
      setSelectedYear(null);
    }
  };

  const studentProfileColor = useStudentProfileColor(selectedStudent);
  const notEnrolledInProgram = years.length === 0 && !isLoadingYears;

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
      ) : (
        <>
          <HelpLink studentProfileColor={studentProfileColor} />
          <Box
            sx={{
              border: "1px solid " + studentProfileColor + "77",
              margin: 30,
              marginTop: 10,
              borderRadius: 10,
            }}
          >
            <Stack
              sx={{
                borderBottom: "1px solid " + studentProfileColor + "77",
                padding: "5px 10px",
                backgroundColor: studentProfileColor + "22",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                sx={{
                  color: studentProfileColor,
                  fontWeight: "bold",
                }}
              >
                {classDetails?.data?.message?.program?.program_name} -{" "}
                {classDetails?.data?.message?.division?.student_group_name}
              </Text>

              {students.find((student) => student.name === selectedStudent)
                ?.reference_number && (
                <Text
                  sx={{
                    borderRadius: 50,
                    backgroundColor: studentProfileColor + "22",
                    padding: "1px 5px",
                    fontSize: 10,
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
            </Stack>
            <Box
              sx={{
                textAlign: "center",
              }}
            >
              <Select
                sx={{
                  margin: 10,
                  ".mantine-Select-dropdown": {
                    '.mantine-Select-item[data-hovered="true"]': {
                      backgroundColor: studentProfileColor,
                    },
                  },
                  ".mantine-Select-input": {
                    color: studentProfileColor,
                    ":active": {
                      borderColor: studentProfileColor,
                    },
                    ":focus": {
                      borderColor: studentProfileColor,
                    },
                  },
                  borderRadius: 10,
                  borderColor: studentProfileColor,
                }}
                data={years.map((year) => ({
                  value: year.academic_year,
                  label: year.academic_year,
                }))}
                value={selectedYear?.academic_year}
                onChange={handleYearChange}
                placeholder="Select Academic Year"
                icon={<IconCalendar color={studentProfileColor} stroke={1} />}
              />
              <Select
                sx={{
                  margin: 10,
                  ".mantine-Select-dropdown": {
                    '.mantine-Select-item[data-hovered="true"]': {
                      backgroundColor: studentProfileColor,
                    },
                  },
                  ".mantine-Select-input": {
                    color: studentProfileColor,
                    ":active": {
                      borderColor: studentProfileColor,
                    },
                    ":focus": {
                      borderColor: studentProfileColor,
                    },
                  },
                  borderRadius: 10,
                  borderColor: studentProfileColor,
                }}
                data={subjectOptions}
                value={selectedSubject}
                onChange={(value) => setSelectedSubject(value || "")}
                icon={<IconBook color={studentProfileColor} stroke={1} />}
              />
              <Select
                color={studentProfileColor}
                sx={{
                  margin: 10,
                  ".mantine-Select-dropdown": {
                    '.mantine-Select-item[data-hovered="true"]': {
                      backgroundColor: studentProfileColor,
                    },
                  },
                  ".mantine-Select-input": {
                    color: studentProfileColor,
                    ":active": {
                      borderColor: studentProfileColor,
                    },
                    ":focus": {
                      borderColor: studentProfileColor,
                    },
                  },
                  borderRadius: 10,
                  borderColor: studentProfileColor,
                }}
                data={unitOptions}
                value={selectedUnit}
                onChange={(value) => setSelectedUnit(value || "")}
                icon={<IconList color={studentProfileColor} stroke={1} />}
              />
              <Button
                sx={{
                  marginBottom: 10,
                  marginTop: 10,
                  borderRadius: 10,
                  backgroundColor: studentProfileColor,
                }}
                onClick={() => {
                  if (
                    selectedStudent &&
                    selectedUnit &&
                    selectedSubject &&
                    selectedYear
                  )
                    navigate(
                      `/cmap/list?subject=${encodeURIComponent(
                        selectedSubject || ""
                      )}&unit=${encodeURIComponent(
                        selectedUnit || ""
                      )}&student=${encodeURIComponent(
                        selectedStudent || ""
                      )}&academic_year=${encodeURIComponent(
                        selectedYear.academic_year || ""
                      )}`
                    );
                }}
                disabled={!selectedYear}
              >
                Show Curriculum
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Cmap;

import { Box, Flex, Stack, Text, Loader, Center, Select } from "@mantine/core";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import useStudentList from "../../components/queries/useStudentList.ts";
import useStudentProfileColor from "../../components/hooks/useStudentProfileColor.ts";
import ObservationAccordion from "../../components/observation accordion/index.tsx";
import useObservationList from "../../components/queries/useObservation.ts";
import useUnitList from "../../components/queries/useUnit.ts";

const Observation = () => {
  const [searchParams] = useSearchParams();
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const searchedStudent = searchParams.get("student");

  const { data: studentsList } = useStudentList();
  const { data: unitList, isLoading: unitLoading } = useUnitList();
  const { data: observationList, isLoading: observationLoading, isError: observationError } = useObservationList(selectedStudent, selectedUnit);

  const students = studentsList?.data?.message || [];

  const handleStudentSelection = useCallback((studentName: string) => {
    setSelectedStudent(studentName);
    setSelectedUnit("");
  }, []);

  const unitListData = useMemo(() => {
    return unitList?.data?.data?.map((unit) => ({
      value: unit.name,
      label: unit.name,
    })) || [];
  }, [unitList?.data]);

  const studentNames = useMemo(() =>
    students.map((student) => student.name),
    [students]
  );

  useEffect(() => {
    if (searchedStudent && studentNames.includes(searchedStudent)) {
      setSelectedStudent(searchedStudent);
    } else if (!studentNames.includes(selectedStudent)) {
      setSelectedStudent(studentNames[0] || "");
    }
  }, [searchedStudent, selectedStudent, studentNames]);

  const studentProfileColor = useStudentProfileColor(selectedStudent);

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
              key={student.name}
              sx={{
                display: "inline-block",
                marginTop: 10,
                flexShrink: 0,
                flexGrow: 1,
                textAlign: "center",
                minWidth: "33.33%",
              }}
              onClick={() => handleStudentSelection(student.name)}
            >
              <Text
                sx={{
                  paddingLeft: 20,
                  paddingRight: 20,
                  borderLeft: index > 0 ? "1px solid black" : undefined,
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
      {unitLoading ? (
        <Center sx={{ height: "85vh" }}>
          <Loader size="lg" color={studentProfileColor} sx={{ marginTop: 20 }} />
        </Center>
      ) : (
        <Flex direction={"column"} gap={20} sx={{ padding: 20 }}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Select
              style={{ width: "50%" }}
              placeholder="Unit"
              data={unitListData}
              value={selectedUnit}
              onChange={(value: string | null) => setSelectedUnit(value || "")}
              styles={() => ({
                input: {
                  textAlign: "center",
                },
                item: {
                  textAlign: "center",
                  padding: "10px",
                  transition: "background-color 150ms ease",
                  "&[data-selected]": {
                    backgroundColor: studentProfileColor,
                    color: "#fff",
                  },
                  "&[data-hovered]": {
                    backgroundColor: studentProfileColor,
                  },
                },
              })}
            />
          </Box>
          {
            !selectedUnit ? (
              <Center sx={{ width: "100%" }}>
                <Text align="center" color="dimmed" weight="bold" my={30}>
                  Please select a unit to view observations.
                </Text>
              </Center>
            ) : observationLoading ? (
              <Center sx={{ width: "100%" }}>
                <Loader size="lg" color={studentProfileColor} sx={{ marginTop: 20 }} />
              </Center>
            ) : observationError ? (
              <Text align="center" color="dimmed" weight="bold" my={30}>
                Error loading observations
              </Text>
            ) : observationList?.data?.message?.observations_by_subject ? (
              <Flex direction={"column"} gap={20} w={"100%"}>
                {Object.entries(observationList.data.message.observations_by_subject).map(
                  ([subject, observations]) => (
                    <ObservationAccordion
                      key={subject}
                      subject={subject}
                      observations={observations}
                    />
                  )
                )}
              </Flex>
            ) : (
              <Center >
                <Text align="center" color="dimmed" weight="bold" my={30}>
                  No observations available for the selected student.
                </Text>
              </Center>
            )
          }
        </Flex>
      )}
    </Box>
  );
};

export default Observation;
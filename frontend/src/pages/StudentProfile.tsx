// import { Button, Collapse } from '@mantine/core';
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useStudentList from "../components/queries/useStudentList.ts";
import useClassDetails from "../components/queries/useClassDetails.ts";
import useStudentProfileColor from "../components/hooks/useStudentProfileColor.ts";
import { getSelectStyles } from "../utility/inputStyles";
import { Box, Stack, Button, Modal, Text, Select, Flex } from "@mantine/core";
import { useNotification } from "@refinedev/core";
import { useDetailsList } from "../components/queries/useGuardianList.ts";
import SiblingForm from "../components/sibling form";
// import { StudentProfleFOrm } from "./StudentProfileForm.tsx";
import StudentProfileCard from "../components/student profile card";
import ParentProfileCard from "../components/parent profile card/index.tsx";
export const StudentProfle = () => {
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedUnit, setSelectedUnit] = useState<string>("unit 1");
  const [selectedSection, setSelectedSection] =
    useState<string>("student-details");
  const [selectedGuardian, setSelectedGuardian] = useState<string | null>(null);
  // const [opened, setOpened] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [changeType, setChangeType] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [personOptions, setPersonOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchedStudent = searchParams.get("student");

  const { data: studentsList } = useStudentList();
  const { data: classDetails } = useClassDetails(selectedStudent);
  const { data: detailsList } = useDetailsList(selectedStudent);
  const students = useMemo(
    () => studentsList?.data?.message || [],
    [studentsList]
  );
  const { open } = useNotification();

  const handleDeleteRequest = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      const response = await fetch(
        "/api/method/unity_parent_app.api.login.request_account_deletion",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId: selectedStudent }),
        }
      );

      if (response.ok) {
        open?.({
          type: "success",
          message: "Your account deletion request has been queued",
        });
      }
    } catch {
      open?.({ type: "error", message: "Failed to submit deletion request" });
      setIsDeleting(false);
    }
    setShowDeleteModal(false);
  };

  useEffect(() => {
    if (selectedStudent) {
      searchParams.set("student", selectedStudent);
      setSearchParams(searchParams, { replace: true });
    }
  }, [selectedStudent, searchParams, setSearchParams]);

  const subjectOptions = useMemo(
    () =>
      classDetails?.data?.message?.class?.subject?.map((subject) => ({
        label: subject.subject,
        value: subject.subject,
      })) || [],
    [classDetails]
  );

  const unitOptions = useMemo(
    () => [
      { label: "Absent", value: "absent" },
      { label: "Sick", value: "sick" },
    ],
    []
  );

  useEffect(() => {
    const studentNames = students.map((student) => student.name);
    if (
      !selectedStudent &&
      searchedStudent &&
      studentNames.includes(searchedStudent)
    ) {
      setSelectedStudent(searchedStudent);
    } else if (!studentNames.includes(selectedStudent)) {
      setSelectedStudent(studentNames[0]);
    }
  }, [searchedStudent, selectedStudent, students]);

  useEffect(() => {
    const subjectNames = subjectOptions.map((subject) => subject.value);
    if (!subjectNames.includes(selectedSubject)) {
      setSelectedSubject(subjectNames[0]);
    }
  }, [selectedSubject, subjectOptions]);

  useEffect(() => {
    const unitNames = unitOptions.map((unit) => unit.value);
    if (!unitNames.includes(selectedUnit)) {
      setSelectedUnit(unitNames[0]);
    }
  }, [selectedUnit, unitOptions]);

  const studentProfileColor = useStudentProfileColor(selectedStudent);

  const navigate = useNavigate();

  useEffect(() => {
    if (changeType === "student") {
      const options = students.map((student) => ({
        value: student.name,
        label: student.student_name,
      }));
      setPersonOptions(options);
      setSelectedPerson(null);
    } else if (changeType === "guardian") {
      const guardians = detailsList?.data?.message?.guardians || [];
      const options = guardians.map(
        (guardian: { guardian_name: string; name: string }) => ({
          value: guardian.name,
          label: guardian.guardian_name,
        })
      );
      setPersonOptions(options);
      setSelectedPerson(null);
    } else {
      setPersonOptions([]);
      setSelectedPerson(null);
    }
  }, [changeType, students, detailsList]);

  const handleChangeRequest = () => {
    if (!changeType || !selectedPerson) return;

    navigate("/profile-change", {
      state: { category: changeType, selectedPerson },
    });

    setShowChangeModal(false);
  };

  const handleSectionSelect = (section: string, guardianName?: string) => {
    setSelectedSection(section);
    if (guardianName) {
      setSelectedGuardian(guardianName);
    }
  };
  return (
    <Box>
      <Stack
        sx={{
          whiteSpace: "nowrap",
          overflow: "auto",
          flexDirection: "column",
          gap: 0,
        }}
      >
        <Box sx={{ maxWidth: "100%", overflow: "auto" }}>
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
        <Flex p="sm" gap="sm" w="100%" maw="100%" sx={{ overflowX: "scroll" }}>
          <Button
            variant={
              selectedSection === "student-details" ? "filled" : "outline"
            }
            style={{
              borderColor: studentProfileColor || "blue",
              color:
                selectedSection === "student-details"
                  ? "white"
                  : studentProfileColor || "blue",
              backgroundColor:
                selectedSection === "student-details"
                  ? studentProfileColor || "blue"
                  : "transparent",
            }}
            key="student-details"
            onClick={() => handleSectionSelect("student-details")}
          >
            Student Details
          </Button>
          {detailsList?.data?.message?.guardians?.map(
            (guardian: { guardian_name: string; name: string }) => (
              <Button
                key={guardian.name}
                variant={
                  selectedSection === "guardian" &&
                  selectedGuardian === guardian.name
                    ? "filled"
                    : "outline"
                }
                style={{
                  borderColor: studentProfileColor || "blue",
                  color:
                    selectedSection === "guardian" &&
                    selectedGuardian === guardian.name
                      ? "white"
                      : studentProfileColor || "blue",
                  backgroundColor:
                    selectedSection === "guardian" &&
                    selectedGuardian === guardian.name
                      ? studentProfileColor || "blue"
                      : "transparent",
                }}
                onClick={() => handleSectionSelect("guardian", guardian.name)}
              >
                {guardian.guardian_name}
              </Button>
            )
          )}
          <Button
            variant={selectedSection === "sibling-info" ? "filled" : "outline"}
            style={{
              borderColor: studentProfileColor || "blue",
              color:
                selectedSection === "sibling-info"
                  ? "white"
                  : studentProfileColor || "blue",
              backgroundColor:
                selectedSection === "sibling-info"
                  ? studentProfileColor || "blue"
                  : "transparent",
            }}
            key="sibling-info"
            onClick={() => handleSectionSelect("sibling-info")}
          >
            Sibling Info
          </Button>
        </Flex>

        {selectedSection === "student-details" && (
          <StudentProfileCard
            selectedStudent={selectedStudent}
            students={students}
            studentProfileColor={studentProfileColor}
            classDetails={classDetails}
          />
        )}

        {selectedSection === "guardian" && selectedGuardian && (
          <ParentProfileCard
            studentProfileColor={studentProfileColor}
            detailsList={detailsList?.data?.message?.guardians?.find(
              (g: { name: string }) => g.name === selectedGuardian
            )}
          />
        )}

        {selectedSection === "sibling-info" && (
          <SiblingForm
            studentId={selectedStudent}
            studentProfileColor={studentProfileColor}
          />
        )}

        {selectedStudent && (
          <>
            {/* <Button
              color="red"
              variant="outline"
              onClick={() => setShowDeleteModal(true)}
              style={{
                marginTop: "1rem",
                marginLeft: "1rem",
                marginRight: "1rem",
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Deletion Requested" : "Request Account Deletion"}
            </Button> */}

            <Button
              color="blue"
              variant="outline"
              onClick={() => setShowChangeModal(true)}
              style={{
                marginTop: "0.5rem",
                marginLeft: "1rem",
                marginRight: "1rem",
                marginBottom: "1rem",
              }}
            >
              Request Change
            </Button>
          </>
        )}

        <Modal
          opened={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Confirm Account Deletion"
        >
          <Text size="sm">
            Are you sure you want to request account deletion? This action
            cannot be undone.
          </Text>
          <Box
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button color="red" onClick={handleDeleteRequest}>
              Confirm Deletion
            </Button>
          </Box>
        </Modal>

        <Modal
          opened={showChangeModal}
          onClose={() => setShowChangeModal(false)}
          title="Request Change"
        >
          <Stack spacing="md">
            <Select
              label="Select Type"
              placeholder="Choose type"
              data={[
                { value: "student", label: "Student" },
                { value: "guardian", label: "Guardian" },
              ]}
              value={changeType}
              onChange={setChangeType}
              required
              {...getSelectStyles("var(--walsh-primary)")}
            />

            <Select
              label="Select User"
              placeholder={
                changeType ? `Choose ${changeType}` : "Select type first"
              }
              data={personOptions}
              value={selectedPerson}
              onChange={setSelectedPerson}
              disabled={!changeType}
              required
              {...getSelectStyles("var(--walsh-primary)")}
            />

            <Box
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              <Button
                variant="outline"
                onClick={() => setShowChangeModal(false)}
              >
                Cancel
              </Button>
              <Button
                color="blue"
                onClick={handleChangeRequest}
                disabled={!changeType || !selectedPerson}
              >
                Submit
              </Button>
            </Box>
          </Stack>
        </Modal>
      </Stack>
    </Box>
  );
};

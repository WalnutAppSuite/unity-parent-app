import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Text, Stack, Title, Tabs, Card } from "@mantine/core";
import { usePendingForms } from "../../context/PendingFormsContext";
import { useNavigation } from "../../context/navigation";

interface Student {
  id: string;
  name: string;
}

interface PendingForm {
  name: string;
  title: string;
  route: string;
  introduction_text?: string;
  pending_form_name?: null | string;
}

interface Notice {
  name: string;
  subject: string;
  is_mandatory_notice: number;
  student: string;
  approval_status: string;
}

interface StudentWithForms {
  student: Student;
  pending_forms: PendingForm[];
  mandatory_notices: Notice[];
}

interface NoticeParams {
  noticeName: string;
  studentId: string;
}

const PendingFormsChecker = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setHasPendingForms, isOnFormPage, setIsOnFormPage } =
    usePendingForms();
  const { setIsBackButtonEnabled, setIsMenuEnabled } = useNavigation();

  const onLoginPage = location.pathname === '/login'
  const onDetailedNotice = /^\/notice\/[^/]+$/.test(location.pathname)

  // Check if current path is a form page
  useEffect(() => {
    const isFormPage = location.pathname.startsWith("/forms/");
    setIsOnFormPage(isFormPage);
  }, [location.pathname, setIsOnFormPage]);

  const { data: pendingFormsData, isLoading } = useQuery<StudentWithForms[]>(
    "pendingForms",
    async () => {
      const response = await fetch(
        "/api/method/unity_parent_app.api.forms.get_pending_forms_and_mandatory_notices"
      );
      const data = await response.json();
      return data.message || [];
    },
    {
      refetchOnWindowFocus: true,
      refetchInterval: 300000, // Check every 5 minutes
      enabled: !onLoginPage, // Only fetch when not on login page
    }
  );

  useEffect(() => {
    if (onLoginPage) return;
    if (isLoading) return;
    const hasForms = pendingFormsData && pendingFormsData.length > 0;
    setHasPendingForms(!!hasForms);

    if (hasForms && !isOnFormPage && !onDetailedNotice) {
      open();
    } else {
      close();
    }
  }, [pendingFormsData, isLoading, open, close, setHasPendingForms, isOnFormPage, onLoginPage, onDetailedNotice]);

  const handleFormClick = (formId: string, formName?: string | null) => {
    navigate(formName ? `/forms/${formId}/${formName}` : `/forms/${formId}`);
  };

  const handleNoticeClick = ({ noticeName, studentId }: NoticeParams) => {
    setIsBackButtonEnabled(false);
    setIsMenuEnabled(false);
    navigate(`/notice/${noticeName}?student=${studentId}`);
    close();
  };

  const hasPendingForms = pendingFormsData && pendingFormsData.length > 0;

  if (isOnFormPage) return null;

  return (
    <>
      <Modal
        opened={!!(opened && hasPendingForms && !onLoginPage && !onDetailedNotice)}
        // opened={false}
        onClose={() => { }} // Prevent closing by clicking outside
        title={
          <Title order={3} mb={10}>
            Pending Forms for Your Children
          </Title>
        }
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
        size="lg"
        radius="md"
        styles={{
          modal: {
            padding: "20px",
            maxHeight: "80vh",
            overflowY: "auto"
          },
        }}
      >
        {hasPendingForms ? (
          <Tabs
            defaultValue={pendingFormsData[0].student.id}
            styles={{
              tabsList: {
                borderBottom: "1px solid #0005",
                gap: 0,
              },
              tab: {
                paddingLeft: 20,
                paddingRight: 20,
                fontWeight: "normal",
                color: "#0007",
                "&[data-active]": {
                  color: "black",
                  borderBottom: "2px solid",
                },
              },
            }}
          >
            <Tabs.List>
              {pendingFormsData.map((studentData, index) => (
                <Tabs.Tab
                  key={studentData.student.id}
                  value={studentData.student.id}
                  sx={{
                    borderLeft: index ? "1px solid black" : undefined,
                  }}
                >
                  {studentData.student.name}
                </Tabs.Tab>
              ))}
            </Tabs.List>

            {pendingFormsData.map((studentData) => (
              <Tabs.Panel
                key={studentData.student.id}
                value={studentData.student.id}
                pt="md"
              >
                <Stack spacing="md" mt="md">
                  <Text size="md" weight={500}>
                    The following forms need to be completed for{" "}
                    {studentData.student.name}:
                  </Text>
                  <Stack>
                    {
                      studentData.pending_forms.length > 0 && (
                        <label style={{ fontWeight: "bold" }}>Pending Forms</label>
                      )
                    }
                    {studentData.pending_forms.map((form) => (
                      <Card
                        key={form.name}
                        shadow="sm"
                        p="lg"
                        radius="md"
                        withBorder
                        sx={{
                          border: "1px solid #0002",
                        }}
                      >
                        <Stack spacing="xs">
                          <Title order={4}>{form.title}</Title>
                          {form.introduction_text && (
                            <Text size="sm" color="dimmed">
                              {form.introduction_text}
                            </Text>
                          )}
                          <Button
                            variant="filled"
                            color="blue"
                            mt="sm"
                            radius="md"
                            onClick={() =>
                              handleFormClick(
                                form.route,
                                form.pending_form_name
                              )
                            }
                            style={{ alignSelf: "flex-start" }}
                          >
                            Complete Now
                          </Button>
                        </Stack>
                      </Card>
                    ))}
                    {
                      studentData.mandatory_notices.length > 0 && (
                        <label style={{ fontWeight: "bold" }}>Mandatory Notices</label>
                      )
                    }
                    {studentData.mandatory_notices.map((notice) => (
                      <Card
                        key={notice.name}
                        shadow="sm"
                        p="lg"
                        radius="md"
                        withBorder
                        sx={{
                          border: "1px solid #0002",
                        }}
                      >
                        <Title order={4}>{notice.subject}</Title>
                        <Button
                          onClick={() =>
                            handleNoticeClick({
                              noticeName: notice.name,
                              studentId: studentData.student.id,

                            })
                          }
                          variant="filled"
                          color="blue"
                          mt="sm"
                          radius="md"
                        >
                          Reply Now
                        </Button>
                      </Card>
                    ))}
                  </Stack>
                </Stack>
              </Tabs.Panel>
            ))}
          </Tabs>
        ) : (
          <Stack>
            <Text align="center" color="dimmed" weight="bold" my={30}>
              No pending forms or mandatory notices found.
            </Text>
          </Stack>
        )}

        {hasPendingForms && (
          <>
            <Text color="red" size="sm" weight={500} mt="xl" mb="md">
              These forms and notices are required and must be completed before continuing.
            </Text>
            <Button
              variant="outline"
              color="gray"
              fullWidth
              radius="md"
              size="md"
              disabled
            >
              I'll complete these later
            </Button>
          </>
        )}
      </Modal>
    </>
  );
};

export default PendingFormsChecker;

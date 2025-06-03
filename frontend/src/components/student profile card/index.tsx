import { Box, Flex, Grid, Text } from "@mantine/core";
import { Student } from "../../components/queries/useStudentList";
import { ClassDetails } from "../../components/queries/useClassDetails";

const InfoItem = ({ label, value }: { label: string; value: string }) => (
    <Box mb="sm">
        <Text size="sm" color="dimmed" weight={500}>
            {label}
        </Text>
        <Text size="sm" sx={{
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            lineHeight: 1.5
        }}>
            {value}
        </Text>
    </Box>
);

function StudentProfileCard({ selectedStudent, students, studentProfileColor, classDetails }: { selectedStudent: string, students: Student[], studentProfileColor: string, classDetails: { data: { message: ClassDetails } } | undefined }) {
    return (
        <Flex direction="column" gap="md" p="xl" sx={(theme) => ({
            background: theme.white,
            borderRadius: theme.radius.md,
            boxShadow: theme.shadows.sm,
            margin: theme.spacing.md,
        })}>
            {selectedStudent && students.map((student: Student) => {
                if (student.name === selectedStudent) {
                    return (
                        <>
                            <Flex align="center" gap="xl">
                                {
                                    student.image ? (
                                        <img
                                            src={student.image}
                                            alt="avatar"
                                            style={{
                                                height: "85px",
                                                aspectRatio: "1/1",
                                                borderRadius: "50%",
                                                boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
                                            }}
                                        />

                                    ) : (
                                        <div
                                            style={{
                                                height: "85px",
                                                aspectRatio: "1/1",
                                                borderRadius: "50%",
                                                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "24px",
                                                fontWeight: "bold",
                                                color: "#fff"
                                            }}
                                        >
                                            <Text size="xl" weight={700} mb={5} style={{ color: '#868e96' }}>

                                                {student.first_name.charAt(0)}
                                                {student.last_name.charAt(0)}
                                            </Text>
                                        </div>
                                    )
                                }
                                <Box>
                                    <Text size="xl" weight={700} mb={5} style={{ color: studentProfileColor || 'black' }}>
                                        {student.student_name}
                                    </Text>
                                    <Text size="sm" color="dimmed">UID: {student.name}</Text>
                                </Box>
                            </Flex>

                            <Box mt="md">
                                <Grid gutter="xl">
                                    <Grid.Col xs={12} sm={6}>
                                        <InfoItem label="First Name" value={student.first_name || '-'} />
                                        <InfoItem label="Middle Name" value={student.middle_name || '-'} />
                                        <InfoItem label="Last Name" value={student.last_name || '-'} />
                                        <InfoItem label="Student Email" value={student.student_email_id || '-'} />
                                        <InfoItem label="Batch" value={classDetails?.data?.message?.division?.academic_year || '-'} />
                                        <InfoItem label="Date of Birth" value={student.date_of_birth || '-'} />
                                        <InfoItem label="Grade" value={classDetails?.data?.message?.class?.name || '-'} />
                                        <InfoItem label="Section" value={classDetails?.data?.message?.division?.student_group_name || '-'} />
                                        <InfoItem label="School" value={student.school || '-'} />
                                        <InfoItem label="House" value={student.school_house || '-'} />
                                        <InfoItem label="Religion" value={student.religion || '-'} />
                                        <InfoItem label="Caste" value={student.caste || '-'} />
                                        <InfoItem label="Sub-caste" value={student.sub_caste || '-'} />
                                        <InfoItem label="Mother Tongue" value={student.mother_tongue || '-'} />
                                        <InfoItem label="Nationality" value={student.nationality || '-'} />
                                    </Grid.Col>
                                </Grid>

                                <Box mt="md" sx={{ maxWidth: '100%' }}>
                                    <InfoItem label="Address Line 1" value={student.address_line_1 || '-'} />
                                    <InfoItem label="Address Line 2" value={student.address_line_2 || '-'} />
                                    <InfoItem label="City" value={student.city || '-'} />
                                    <InfoItem label="Pin Code" value={student.pincode || '-'} />
                                </Box>
                            </Box>
                        </>
                    );
                }
                return null;
            })}
        </Flex>
    )
}

export default StudentProfileCard;
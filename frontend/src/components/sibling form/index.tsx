import { Box, Flex, Grid, Text } from "@mantine/core";
import fetchStudentInfo from "../queries/useStudentInfo";
import { useQuery } from "react-query";

interface Sibling {
    studying_in_same_institute: "YES" | "NO";
    full_name: string;
    gender: string;
    student?: string;
    program: string;
    date_of_birth: string;
    institution?: string;
}

interface StudentInfo {
    is_sibling_in_school: number;
    siblings: Sibling[];
}

interface SiblingCardProps {
    label: string;
    value: string | number
}

const InfoItem = ({ label, value }: SiblingCardProps) => (
    <Box mb="sm">
        <Text size="sm" color="dimmed" weight={500}>
            {label}
        </Text>
        <Text
            size="sm"
            sx={{
                whiteSpace: "normal",
                wordBreak: "break-word",
                lineHeight: 1.5,
            }}
        >
            {value || '-'}
        </Text>
    </Box>
);

function SiblingForm({ studentId, studentProfileColor }: { studentId: string, studentProfileColor: string }) {
    const { data: studentInfo } = useQuery<StudentInfo>({
        queryKey: ['studentInfo', studentId],
        queryFn: () => fetchStudentInfo(studentId)
    });

    const hasSiblings = studentInfo?.is_sibling_in_school === 1;
    const siblings = studentInfo?.siblings || [];
    const tgaaSiblings = siblings.filter((s: Sibling) => s.studying_in_same_institute === "YES");
    const nonTgaaSiblings = siblings.filter((s: Sibling) => s.studying_in_same_institute === "NO");

    return (
        <Flex
            direction="column"
            gap="md"
            p="xl"
            sx={(theme) => ({
                background: theme.white,
                borderRadius: theme.radius.md,
                boxShadow: theme.shadows.sm,
                margin: theme.spacing.md,
            })}
        >
            <Box>
                <Text size="xl" weight={700} mb={5} style={{ color: studentProfileColor || 'black' }}>
                    Sibling Information
                </Text>
            </Box>

            <Grid gutter="xl">
                <Grid.Col xs={12}>
                    <InfoItem
                        label="How many siblings do you have?"
                        value={siblings.length}
                    />
                    <InfoItem
                        label="Is your sibling in TGAA?"
                        value={hasSiblings ? "Yes" : "No"}
                    />
                </Grid.Col>

                {tgaaSiblings.length > 0 && (
                    <Grid.Col xs={12}>
                        <Box
                            sx={(theme) => ({
                                background: theme.colors.gray[0],
                                padding: theme.spacing.md,
                                borderRadius: theme.radius.sm,
                            })}
                        >
                            <InfoItem
                                label="TGAA Sibling Count"
                                value={tgaaSiblings.length}
                            />
                            {tgaaSiblings.map((sibling: Sibling, index: number) => (
                                <Box key={index} mt={index > 0 ? "md" : 0}>
                                    <InfoItem
                                        label="UID of the sibling"
                                        value={sibling.student || '-'}
                                    />
                                    <InfoItem
                                        label="Name of the Sibling"
                                        value={sibling.full_name}
                                    />
                                    <InfoItem
                                        label="Program"
                                        value={sibling.program}
                                    />
                                    <InfoItem
                                        label="Date of Birth"
                                        value={sibling.date_of_birth}
                                    />
                                </Box>
                            ))}
                        </Box>
                    </Grid.Col>
                )}

                {nonTgaaSiblings.length > 0 && (
                    <Grid.Col xs={12}>
                        <Box
                            sx={(theme) => ({
                                background: theme.colors.gray[0],
                                padding: theme.spacing.md,
                                borderRadius: theme.radius.sm,
                                marginTop: theme.spacing.sm,
                            })}
                        >
                            <InfoItem
                                label="Siblings not in TGAA Count"
                                value={nonTgaaSiblings.length}
                            />
                            {nonTgaaSiblings.map((sibling: Sibling, index: number) => (
                                <Box key={index} mt={index > 0 ? "md" : 0}>
                                    <InfoItem
                                        label="Name of the Sibling"
                                        value={sibling.full_name}
                                    />
                                    <InfoItem
                                        label="Institution"
                                        value={sibling.institution || '-'}
                                    />
                                    <InfoItem
                                        label="Program"
                                        value={sibling.program}
                                    />
                                    <InfoItem
                                        label="Date of Birth"
                                        value={sibling.date_of_birth}
                                    />
                                </Box>
                            ))}
                        </Box>
                    </Grid.Col>
                )}
            </Grid>
        </Flex>
    );
}

export default SiblingForm;
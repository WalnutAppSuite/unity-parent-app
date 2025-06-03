import { Box, Flex, Grid, Text } from "@mantine/core";

interface Guardian {
    relation: string;
    guardian: string;
    email_address: string;
    mobile_number: string;
    guardian_name: string;
    annual_income: string;
    occupation: string;
    company_name: string;
    designation: string;
    work_address: string;
    custom_secondary_mobile_number: string;
    education: string;
    image?: string;
}

interface ParentProfileCardProps {
    studentProfileColor: string;
    detailsList: Guardian;
}

const InfoItem = ({ label, value }: { label: string; value: string }) => (
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

function ParentProfileCard({ studentProfileColor, detailsList }: ParentProfileCardProps) {
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
            <Flex align="center" gap="xl">
                {detailsList.image ? (
                    <img
                        src={detailsList.image}
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
                            {detailsList.guardian_name?.split(' ').map(n => n[0]).join('') || '?'}
                        </Text>
                    </div>
                )}
                <Box>
                    <Text size="xl" weight={700} mb={5} style={{ color: studentProfileColor || 'black' }}>
                        {detailsList.guardian_name}
                    </Text>
                    <Text size="sm" color="dimmed">{detailsList.relation}</Text>
                </Box>
            </Flex>

            <Grid gutter="xl">
                <Grid.Col xs={12} sm={6}>
                    <InfoItem label="Mobile Number" value={detailsList.mobile_number} />
                    <InfoItem
                        label="Secondary Mobile"
                        value={detailsList.custom_secondary_mobile_number}
                    />
                    <InfoItem label="Email" value={detailsList.email_address} />
                    <InfoItem label="Education" value={detailsList.education} />
                    <InfoItem label="Occupation" value={detailsList.occupation} />
                    <InfoItem label="Company Name" value={detailsList.company_name} />
                    <InfoItem label="Designation" value={detailsList.designation} />
                    <InfoItem label="Annual Income" value={detailsList.annual_income} />
                </Grid.Col>
            </Grid>
            <Box mt="md" sx={{ maxWidth: "100%" }}>
                <InfoItem label="Work Address" value={detailsList.work_address} />
            </Box>
        </Flex>
    );
}

export default ParentProfileCard;

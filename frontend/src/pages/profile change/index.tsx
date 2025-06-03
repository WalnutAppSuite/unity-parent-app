import { Box } from "@mantine/core";
import { useLocation } from "react-router-dom";

function Index() {
  const location = useLocation();
  const userData = location.state || {};

  let url = "";

  if (userData.category === "student") {
    url = `/change-request/new?category=student&student_id=${userData.selectedPerson}`;
  } else if (userData.category === "guardian") {
    url = `/change-request/new?category=guardian&guardian_id=${userData.selectedPerson}`;
  }

  return (
    <>
      <Box sx={{ width: "100%", height: "100vh" }}>
        <iframe
          src={url}
          width="100%"
          height="100%"
          style={{ border: "none", padding: "16px" }}
        />
      </Box>
    </>
  );
}

export default Index;

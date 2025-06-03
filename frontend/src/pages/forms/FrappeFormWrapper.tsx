import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Container, Title, Text, Box } from "@mantine/core";

const FrappeFormWrapper = () => {
  const { formRoute, formId = null } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const studentId = queryParams.get("student");

  // State to track if the form is loaded
  const [formLoaded, setFormLoaded] = useState(false);

  useEffect(() => {
    // Function to load the Frappe form
    const loadFrappeForm = async () => {
      try {
        // Create an iframe to load the Frappe form
        const iframe = document.createElement("iframe");
        if (formId) {
          iframe.src = `/${formRoute}/${formId}?student=${studentId || ""}`;
        } else {
          iframe.src = `/${formRoute}?student=${studentId || ""}`;
        }
        iframe.style.width = "100%";
        iframe.style.height = "800px"; // Adjust as needed
        iframe.style.border = "none";
        iframe.style.padding = "12px";
        iframe.onload = () => setFormLoaded(true);

        // Clear and append the iframe to the container
        const container = document.getElementById("frappe-form-container");
        if (container) {
          container.innerHTML = "";
          container.appendChild(iframe);
        }
      } catch (error) {
        console.error("Error loading Frappe form:", error);
      }
    };

    loadFrappeForm();
  }, [formRoute, studentId, formId]);

  return (
    <Container size="xl" py="md">
      <Title order={3} mb="md">
        {formRoute?.replace(/-/g, " ")}
      </Title>
      {!formLoaded && <Text>Loading form...</Text>}
      <Box id="frappe-form-container" />
    </Container>
  );
};

export default FrappeFormWrapper;
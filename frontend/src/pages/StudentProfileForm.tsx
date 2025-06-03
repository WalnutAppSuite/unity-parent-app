import { useMemo, useState } from "react";
import {
  guardian_address,
  guardian_address2,
  guardian_city,
  guardian_email_update,
  guardian_father_number_update,
  guardian_number_update,
  guardian_pincode,
  updateAnnualIncome,
  updateBloodGroup,
} from "../components/queries/useGuardianList";
import { Box, Text, Button } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import OTPInput from "otp-input-react";

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
}

interface StudentProfileProps {
  student: {
    name: string;
  };
  selectedStudent: string;
  studentProfileColor: string;
  classDetails: any;
  isSelected: boolean;
  detailsList: any;
  studentsList: any;
  onRefetch: () => void;
}

export const StudentProfleFOrm = ({
  student,
  selectedStudent,
  studentProfileColor,
  classDetails,
  isSelected,
  detailsList,
  studentsList,
  onRefetch,
}: StudentProfileProps) => {
  const { mutateAsync: mutateAddress2 } = guardian_address2();
  const { mutateAsync: mutateCity } = guardian_city();
  const { mutateAsync: mutatePinCode } = guardian_pincode();
  const { mutateAsync: mutateAsyncAnnualIncome } = updateAnnualIncome();
  const { mutateAsync: mutateAsyncBloodGroup } = updateBloodGroup();
  const { mutateAsync: mutateAsyncEmail } = guardian_email_update();

 

  const [statusColor, setStatusColor] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("");
  const [editIcon, setEditIcon] = useState<Record<string, boolean>>({
    mother_email: false,
    mother_number: false,
    father_email: false,
    father_number: false,
  });
  const [submitBtn, setSubmitBtn] = useState<Record<string, boolean>>({
    mother_email: false,
    mother_number: false,
    father_email: false,
    father_number: false,
    address1: false,
    address2: false,
    bloods_group: false,
    annual__father_income: false,
    annual__mother_income: false,
  });
  const [isEditable, setIsEditable] = useState<Record<string, boolean>>({
    mother_email: false,
    mother_number: false,
    father_email: false,
    father_number: false,
    address: false,
    address2: false,
    bloods_group: false,
    annual__father_income: false,
    annual__mother_income: false,
  });
  const [sendOtp, setSendOtp] = useState<Record<string, boolean>>({
    mother_email: false,
    mother_number: false,
    father_email: false,
    father_number: false,
  });
  const [newEmail, setNewEmail] = useState<Record<string, string>>({
    mother_email_input: "",
    father_email_input: "",
  });
  const [, setEmailOtp] = useState("");
  const [newNumber, setNewNumber] = useState<Record<string, string>>({
    mother_number_input: "",
    father_number_input: "",
  });
  const [newBloodG, setBloodG] = useState("");
  const [newAnnualI, setAnnualI] = useState("");
  const [newAnnualIMother, setAnnualIMother] = useState("");
  const [addressGuardian1, setAddressGuardian1] = useState("");
  const [addressGuardian2, setAddressGuardian2] = useState("");
  const [cityValue, setCity] = useState("");
  const [pincodeValue, setPincode] = useState("");
  const [, setErrorMessage] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [otpVerify, setOtpVerify] = useState("");

  const guardians: Guardian[] = detailsList?.data?.message?.guardians || [];
  const FatherGuardian =
    guardians.find((i) => i.relation === "Father")?.guardian || "";
  const MotherGuardian =
    guardians.find((i) => i.relation === "Mother")?.guardian || "";
  const { mutateAsync: mutateAsyncNumber } = guardian_number_update();
  const { mutateAsync: mutateAsyncFatherNumbers } =
    guardian_father_number_update(FatherGuardian);

  const { mutateAsync: mutateAddress } = guardian_address();

  const MotherEmail =
    guardians.find((i) => i.relation === "Mother")?.email_address || "N/A";
  const FatherEmail =
    guardians.find((i) => i.relation === "Father")?.email_address || "N/A";
  const FatherMobile =
    guardians.find((i) => i.relation === "Father")?.mobile_number || "N/A";
  const FatherSecondaryMobile =
    guardians.find((i) => i.relation === "Father")
      ?.custom_secondary_mobile_number || "N/A";
  const MotherMobile =
    guardians.find((i) => i.relation === "Mother")?.mobile_number || "N/A";
  const MotherSecondaryMobile =
    guardians.find((i) => i.relation === "Mother")
      ?.custom_secondary_mobile_number || "N/A";
  const MotherName =
    guardians.find((i) => i.relation === "Mother")?.guardian_name || "N/A";
  const FatherName =
    guardians.find((i) => i.relation === "Father")?.guardian_name || "N/A";
  const address_guardian = detailsList?.data?.message?.address_line_1 || "N/A";
  const blood_group = detailsList?.data?.message?.blood_group || "N/A";
  const annuals_income =
    guardians.find((i) => i.relation === "Father")?.annual_income || "N/A";
  const annuals_income_mother =
    guardians.find((i) => i.relation === "Mother")?.annual_income || "N/A";
  const address_guardian2 =
    detailsList?.data?.message?.address_line_2 || "N/A";
  const cityData = detailsList?.data?.message?.city || "N/A";
  const pincodeData = detailsList?.data?.message?.pincode || "N/A";

  const verifyOTP = async (id: string, type: string) => {
    const relation = guardians.find((i) => i.relation === id)?.relation;
    const payload =
      type === "email"
        ? { otp: otpVerify, email: id === "Mother" ? MotherEmail : FatherEmail }
        : {
            otp: otpVerify,
            phone_no: id === "Mother" ? MotherMobile : FatherMobile,
          };
    const url =
      type === "email"
        ? "/api/method/unity_parent_app.api.studentProfile.verify_otp"
        : "/api/method/unity_parent_app.api.studentProfile.verify_otp_mobile";

    if (relation) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (data.message.success) {
          setVerificationStatus("OTP Verified!");
          setStatusColor("green");
          setTimeout(() => {
            if (type === "email") {
              mutateAsyncEmail({
                name: id === "Mother" ? MotherGuardian : FatherGuardian,
                email_address:
                  id === "Mother"
                    ? newEmail.mother_email_input
                    : newEmail.father_email_input,
              }).then(() => {
                onRefetch();
                setIsEditable((prevState) => ({
                  ...prevState,
                  [`${id.toLowerCase()}_email`]: false,
                }));
                setSubmitBtn((prevState) => ({
                  ...prevState,
                  [`${id.toLowerCase()}_email`]: false,
                }));
              });
            } else {
              (id === "Mother" ? mutateAsyncNumber : mutateAsyncFatherNumbers)({
                name: id === "Mother" ? MotherGuardian : FatherGuardian,
                mobile_number:
                  id === "Mother"
                    ? newNumber.mother_number_input
                    : newNumber.father_number_input,
              }).then(() => {
                onRefetch();
                setIsEditable((prevState) => ({
                  ...prevState,
                  [`${id.toLowerCase()}_number`]: false,
                }));
                setSubmitBtn((prevState) => ({
                  ...prevState,
                  [`${id.toLowerCase()}_number`]: false,
                }));
              });
            }
            setSendOtp((prevState) => ({
              ...prevState,
              [`${id.toLowerCase()}_${type}`]: false,
            }));
            setEditIcon((prevState) => ({
              ...prevState,
              [`${id.toLowerCase()}_${type}`]: false,
            }));
            setOtpVerify("");
            setVerificationStatus("");
          }, 2000);
        } else {
          setVerificationStatus("Invalid OTP. Please try again.");
          setStatusColor("red");
        }
      } catch (error) {
        console.error("Error verifying OTP:", error);
        setVerificationStatus("Error verifying OTP. Please try again later.");
      }
    }
  };

  const handleSubmit = useMemo(
    () => (id: string, type: string) => {
      const payload =
        type === "email"
          ? { email_address: id === "Mother" ? MotherEmail : FatherEmail }
          : { mobile_number: id === "Mother" ? MotherMobile : FatherMobile };
      const url =
        type === "email"
          ? "/api/method/unity_parent_app.api.studentProfile.send_otp_to_email_address"
          : "/api/method/unity_parent_app.api.studentProfile.send_otp_to_mobile_number";

      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then((result) => result.message)
        .then((message) => {
          if (message.success) {
            setErrorMessage("");
            setOtpMessage(message.message);
          } else {
            setErrorMessage(message.error_message);
            console.log("Error ", message.error);
          }
        })
        .catch((error) => console.log("error", error));
    },
    [MotherEmail, FatherEmail, MotherMobile, FatherMobile]
  );

  const data_of_birth = detailsList?.data?.message?.date_of_birth;
  const formattedEndDate = new Date(data_of_birth)
    .toLocaleDateString("en-GB")
    .replace(/\//g, "-");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "700px",
        fontSize: "14px",
        margin: "0 auto",
      }}
    >
      <div style={{ width: "100%", overflowX: "hidden" }}>
        {[
          { label: "ID", value: detailsList?.data?.message?.name || "-" },
          {
            label: "First Name",
            value: detailsList?.data?.message?.first_name || "-",
          },
          {
            label: "Middle Name",
            value: detailsList?.data?.message?.middle_name || "-",
          },
          {
            label: "Last Name",
            value: detailsList?.data?.message?.last_name || "-",
          },
          {
            label: "Student Email",
            value: detailsList?.data?.message?.student_email_id,
          },
          { label: "City", value: cityData },
          {
            label: "Pin code",
            value: pincodeData,
          },
          { label: "Class", value: classDetails?.data?.message?.class?.name },
          {
            label: "School",
            value: classDetails?.data?.message?.division?.custom_school,
          },
          { label: "Mother Name", value: MotherName },
          { label: "Father Name", value: FatherName },
          { label: "Date of Birth", value: formattedEndDate },
          {
            label: "Religion",
            value: studentsList?.data?.message[0]?.religion,
          },
          { label: "Caste", value: studentsList?.data?.message[0]?.caste },
          {
            label: "Sub Caste",
            value: studentsList?.data?.message[0]?.sub_caste,
          },
          {
            label: "Mother Tongue",
            value: studentsList?.data?.message[0]?.mother_tongue,
          },
          {
            label: "Mother's Secondary Mobile",
            value: MotherSecondaryMobile,
          },
          {
            label: "Father's Secondary Mobile",
            value: FatherSecondaryMobile,
          },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              borderBottom: `1px solid ${studentProfileColor}`,
              paddingBottom: "0.5rem",
              width: "100%",
              margin: "0px auto",
              flexWrap: "wrap",
            }}
          >
            <Text
              sx={{
                color: studentProfileColor,
                padding: "10px 1rem",
                minWidth: "150px",
              }}
              size={"sm"}
            >
              {label}:
            </Text>
            <span style={{ color: "black", flex: 1 }}>{value}</span>
          </div>
        ))}

        {[
          {
            label: "Mother's Email",
            value: MotherEmail,
            type: "email",
            id: "Mother",
          },
          {
            label: "Mother's Mobile",
            value: MotherMobile,
            type: "mobile",
            id: "Mother",
          },
          {
            label: "Father's Email",
            value: FatherEmail,
            type: "email",
            id: "Father",
          },
          {
            label: "Father's Mobile",
            value: FatherMobile,
            type: "mobile",
            id: "Father",
          },
        ].map(({ label, value, type, id }) => (
          <div
            key={label}
            style={{
              position: "relative",
              borderBottom: `1px solid ${studentProfileColor}`,
              paddingBottom: "0.5rem",
              width: "100%",
              margin: "0px auto",
            }}
          >
            <Text
              sx={{
                color: studentProfileColor,
                padding: "10px 1rem",
                minWidth: "150px",
              }}
              size={"sm"}
            >
              {label}:
            </Text>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "0.2rem",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <input
                type="text"
                style={{
                  borderRadius: "8px",
                  width: "100%",
                  maxWidth: "312px",
                  marginLeft: "1rem",
                  padding: "0.5rem",
                  backgroundColor: "lightgray",
                  border: "none",
                }}
                value={
                  isEditable[`${id.toLowerCase()}_${type}`]
                    ? type === "email"
                      ? newEmail[`${id.toLowerCase()}_email_input`]
                      : newNumber[`${id.toLowerCase()}_number_input`]
                    : value
                }
                onChange={(e) => {
                  if (type === "email") {
                    setNewEmail((prevEmail) => ({
                      ...prevEmail,
                      [`${id.toLowerCase()}_email_input`]: e.target.value,
                    }));
                  } else {
                    setNewNumber((prevNumber) => ({
                      ...prevNumber,
                      [`${id.toLowerCase()}_number_input`]: e.target.value,
                    }));
                  }
                }}
                disabled={!isEditable[`${id.toLowerCase()}_${type}`]}
              />
              {student.name === selectedStudent &&
              value &&
              !submitBtn[`${id.toLowerCase()}_${type}`] &&
              !editIcon[`${id.toLowerCase()}_${type}`] ? (
                <IconEdit
                  stroke={2}
                  onClick={() => {
                    setIsEditable((prevState) => ({
                      ...prevState,
                      [`${id.toLowerCase()}_${type}`]: true,
                    }));
                    if (type === "email") {
                      setNewEmail((prevEmail) => ({
                        ...prevEmail,
                        [`${id.toLowerCase()}_email_input`]: value || "",
                      }));
                    } else {
                      setNewNumber((prevNumber) => ({
                        ...prevNumber,
                        [`${id.toLowerCase()}_number_input`]: value || "",
                      }));
                    }
                    setSubmitBtn((prevState) => ({
                      ...prevState,
                      [`${id.toLowerCase()}_${type}`]: true,
                    }));
                  }}
                />
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <Button
                      sx={{ background: "green", color: "white" }}
                      disabled={sendOtp[`${id.toLowerCase()}_${type}`]}
                      onClick={() => {
                        if (
                          (type === "email" &&
                            (id === "Mother" ? MotherMobile : FatherMobile) ===
                              "N/A") ||
                          (type === "mobile" &&
                            (id === "Mother" ? MotherEmail : FatherEmail) ===
                              "N/A")
                        ) {
                          if (type === "email") {
                            mutateAsyncEmail({
                              name:
                                id === "Mother"
                                  ? MotherGuardian
                                  : FatherGuardian,
                              email_address:
                                id === "Mother"
                                  ? newEmail.mother_email_input
                                  : newEmail.father_email_input,
                            }).then(() => {
                              onRefetch();
                              setSubmitBtn((prevState) => ({
                                ...prevState,
                                [`${id.toLowerCase()}_${type}`]: false,
                              }));
                              setIsEditable((prevState) => ({
                                ...prevState,
                                [`${id.toLowerCase()}_${type}`]: false,
                              }));
                            });
                          } else {
                            (id === "Mother"
                              ? mutateAsyncNumber
                              : mutateAsyncFatherNumbers)({
                              name:
                                id === "Mother"
                                  ? MotherGuardian
                                  : FatherGuardian,
                              mobile_number:
                                id === "Mother"
                                  ? newNumber.mother_number_input
                                  : newNumber.father_number_input,
                            }).then(() => {
                              onRefetch();
                              setSubmitBtn((prevState) => ({
                                ...prevState,
                                [`${id.toLowerCase()}_${type}`]: false,
                              }));
                              setIsEditable((prevState) => ({
                                ...prevState,
                                [`${id.toLowerCase()}_${type}`]: false,
                              }));
                            });
                          }
                        } else {
                          setEmailOtp(
                            type === "email"
                              ? newEmail[`${id.toLowerCase()}_email_input`]
                              : newNumber[`${id.toLowerCase()}_number_input`]
                          );
                          handleSubmit(id, type);
                          setEditIcon((prevState) => ({
                            ...prevState,
                            [`${id.toLowerCase()}_${type}`]: true,
                          }));
                          setSendOtp((prevState) => ({
                            ...prevState,
                            [`${id.toLowerCase()}_${type}`]: true,
                          }));
                        }
                      }}
                    >
                      Update
                    </Button>
                    <Button
                      sx={{ backgroundColor: "red" }}
                      onClick={() => {
                        setIsEditable((prevState) => ({
                          ...prevState,
                          [`${id.toLowerCase()}_${type}`]: false,
                        }));
                        setSubmitBtn((prevState) => ({
                          ...prevState,
                          [`${id.toLowerCase()}_${type}`]: false,
                        }));
                        setSendOtp((prevState) => ({
                          ...prevState,
                          [`${id.toLowerCase()}_${type}`]: false,
                        }));
                        setEditIcon((prevState) => ({
                          ...prevState,
                          [`${id.toLowerCase()}_${type}`]: false,
                        }));
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </div>
            {student.name === selectedStudent &&
              value &&
              sendOtp[`${id.toLowerCase()}_${type}`] && (
                <>
                  <p style={{ color: "green", marginLeft: "1rem" }}>
                    OTP sent to{" "}
                    {type === "email"
                      ? id === "Mother"
                        ? MotherMobile
                        : FatherMobile
                      : id === "Mother"
                      ? MotherEmail
                      : FatherEmail}{" "}
                    {otpMessage}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                      gap: "1rem",
                      marginLeft: "1rem",
                    }}
                  >
                    <OTPInput
                      autoFocus
                      OTPLength={4}
                      value={otpVerify}
                      onChange={setOtpVerify}
                      otpType="number"
                      disabled={false}
                      secure
                    />
                    <button
                      style={{
                        width: "25%",
                        marginLeft: "1rem",
                        backgroundColor: "rgb(31 197 94)",
                        color: "white",
                        border: "none",
                        padding: "0.5rem",
                        borderRadius: "10px",
                      }}
                      onClick={() => {
                        verifyOTP(id, type);
                      }}
                    >
                      Verify OTP
                    </button>
                    {verificationStatus && (
                      <p style={{ color: statusColor, marginLeft: "1rem" }}>
                        {verificationStatus}
                      </p>
                    )}
                  </div>
                </>
              )}
          </div>
        ))}

        {[
          {
            label: "Mother's Education",
            value:
              guardians.find((i) => i.relation === "Mother")?.email_address ||
              "N/A",
          },
          {
            label: "Mother's Occupation",
            value:
              guardians.find((i) => i.relation === "Mother")?.occupation ||
              "N/A",
          },
          {
            label: "Mother's Company Name",
            value:
              guardians.find((i) => i.relation === "Mother")?.company_name ||
              "N/A",
          },
          {
            label: "Mother's Designation",
            value:
              guardians.find((i) => i.relation === "Mother")?.designation ||
              "N/A",
          },
          {
            label: "Mother's Work Address",
            value:
              guardians.find((i) => i.relation === "Mother")?.work_address ||
              "N/A",
          },
          {
            label: "Father's Education",
            value:
              guardians.find((i) => i.relation === "Father")?.email_address ||
              "N/A",
          },
          {
            label: "Father's Occupation",
            value:
              guardians.find((i) => i.relation === "Father")?.occupation ||
              "N/A",
          },
          {
            label: "Father's Company Name",
            value:
              guardians.find((i) => i.relation === "Father")?.company_name ||
              "N/A",
          },
          {
            label: "Father's Designation",
            value:
              guardians.find((i) => i.relation === "Father")?.designation ||
              "N/A",
          },
          {
            label: "Father's Work Address",
            value:
              guardians.find((i) => i.relation === "Father")?.work_address ||
              "N/A",
          },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              borderBottom: `1px solid ${studentProfileColor}`,
              paddingBottom: "0.5rem",
              width: "100%",
              margin: "0px auto",
              flexWrap: "wrap",
            }}
          >
            <Text
              sx={{
                color: studentProfileColor,
                padding: "10px 1rem",
                minWidth: "150px",
              }}
              size={"sm"}
            >
              {label}:
            </Text>
            <span style={{ color: "black", flex: 1 }}>{value}</span>
          </div>
        ))}

        {[
          {
            label: "Address 1",
            value: address_guardian,
            state: addressGuardian1,
            setState: setAddressGuardian1,
            mutate: mutateAddress,
            key: "address",
          },
          {
            label: "Address 2",
            value: address_guardian2,
            state: addressGuardian2,
            setState: setAddressGuardian2,
            mutate: mutateAddress2,
            key: "address2",
          },
          {
            label: "City",
            value: cityData,
            state: cityValue,
            setState: setCity,
            mutate: mutateCity,
            key: "city",
          },
          {
            label: "Pincode",
            value: pincodeData,
            state: pincodeValue,
            setState: setPincode,
            mutate: mutatePinCode,
            key: "pincode",
          },
          {
            label: "Blood Group",
            value: blood_group,
            state: newBloodG,
            setState: setBloodG,
            mutate: mutateAsyncBloodGroup,
            key: "bloods_group",
          },
          {
            label: "Approximate Yearly Income of Father",
            value: annuals_income,
            state: newAnnualI,
            setState: setAnnualI,
            mutate: mutateAsyncAnnualIncome,
            key: "annual__father_income",
          },
          {
            label: "Approximate Yearly Income of Mother",
            value: annuals_income_mother,
            state: newAnnualIMother,
            setState: setAnnualIMother,
            mutate: mutateAsyncAnnualIncome,
            key: "annual__mother_income",
          },
        ].map(({ label, value, state, setState, mutate, key }) => {
          const handleMutation = (mutate: any) => {
            const name = key.includes("mother")
              ? MotherGuardian
              : FatherGuardian;
            const data = {
              name,
              ...(key === "address" && { address_line_1: state }),
              ...(key === "address2" && { address_line_2: state }),
              ...(key === "city" && { city: state }),
              ...(key === "pincode" && { pincode: state }),
              ...(key === "bloods_group" && { blood_group: state }),
              ...(key.includes("annual") && { annual_income: state }),
            };

            mutate(data as any).then(() => {
              onRefetch();
              setIsEditable((prev) => ({ ...prev, [key]: false }));
              setSubmitBtn((prev) => ({ ...prev, [key]: false }));
            });
          };

          return (
            <div
              key={label}
              style={{
                borderBottom: `1px solid ${studentProfileColor}`,
                paddingBottom: "0.5rem",
                width: "100%",
                margin: "0px auto",
              }}
            >
              <Text
                sx={{
                  color: studentProfileColor,
                  padding: "10px 1rem",
                  minWidth: "150px",
                }}
                size={"sm"}
              >
                {label}
              </Text>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "0.2rem",
                  alignItems: "center",
                }}
              >
                <input
                  type="text"
                  style={{
                    borderRadius: "8px",
                    width: "100%",
                    maxWidth: "312px",
                    marginLeft: "1rem",
                    padding: "0.5rem",
                    backgroundColor: "lightgray",
                    border: "none",
                  }}
                  value={isEditable[key] ? state : value}
                  onChange={(e) => setState(e.target.value)}
                  disabled={!isEditable[key]}
                />
                {student.name === selectedStudent &&
                value &&
                !submitBtn[key] ? (
                  <IconEdit
                    stroke={2}
                    onClick={() => {
                      setIsEditable((prevState) => ({
                        ...prevState,
                        [key]: true,
                      }));
                      setState(value || "");
                      setSubmitBtn((prevState) => ({
                        ...prevState,
                        [key]: true,
                      }));
                    }}
                  />
                ) : (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <Button
                        sx={{ background: "green", color: "white" }}
                        onClick={() => handleMutation(mutate)}
                      >
                        Update
                      </Button>
                      <Button
                        sx={{ backgroundColor: "red" }}
                        onClick={() => {
                          setIsEditable((prevState) => ({
                            ...prevState,
                            [key]: false,
                          }));
                          setSubmitBtn((prevState) => ({
                            ...prevState,
                            [key]: false,
                          }));
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <Box
        sx={{
          marginTop: "2rem",
          width: "100%",
          borderBottom: isSelected
            ? `2px solid ${studentProfileColor}`
            : "1px solid #0005",
        }}
      />
    </div>
  );
};

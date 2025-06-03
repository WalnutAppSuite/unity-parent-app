import { useCustom, useCustomMutation } from "@refinedev/core";
import { useCallback } from "react";

// Common interfaces
interface BaseGuardian {
  name: string;
}

export interface Guardian extends BaseGuardian {
  first_name: string;
  last_name: string;
  guardian_name: string;
  email_address: string;
  mobile_number: string;
  annual_income: string;
  relation: string;
  address_line_1: string;
}

// Request interfaces
interface GuardianEmailVariables extends BaseGuardian {
  email_address: string;
}

interface GuardianNumberVariables extends BaseGuardian {
  mobile_number: string;
}

interface GuardianAddress extends BaseGuardian {
  address_line_1: string;
}

interface GuardianAddress2 extends BaseGuardian {
  address_line_2: string;
}

interface GuardianCity extends BaseGuardian {
  city: string;
}

interface GuardianPincode extends BaseGuardian {
  pincode: string;
}

interface UpdateBloodGroupProps extends BaseGuardian {
  blood_group: string;
}

interface UpdateAnnualIncomeProps extends BaseGuardian {
  annual_income: string;
}

// Helper function to create mutation hook
const createMutationHook = <T extends BaseGuardian>(
  urlBuilder: (variables: T) => string,
  method = "put"
) => {
  return () => {
    const { mutate, mutateAsync, ...mutationObjs } = useCustomMutation({
      mutationOptions: {},
    });

    const mutationFunction = useCallback(
      (variables: T) => {
        return mutate({
          url: urlBuilder(variables),
          method: method as "put" | "delete" | "post" | "patch",
          values: variables,
        });
      },
      [mutate]
    );

    const mutationAsyncFunction = useCallback(
      (variables: T) => {
        return mutateAsync({
          url: urlBuilder(variables),
          method: method as "put" | "delete" | "post" | "patch",
          values: variables,
        });
      },
      [mutateAsync]
    );

    return {
      ...mutationObjs,
      mutate: mutationFunction,
      mutateAsync: mutationAsyncFunction,
    };
  };
};

// Query hooks
export const useDetailsList = (student_id: string) =>
  useCustom({
    config: { query: { student: student_id } },
    method: "get",
    queryOptions: {
      queryKey: ["DetailsDataList", student_id],
      enabled: !!student_id,
    },
    url: `/api/method/unity_parent_app.api.student.get_student_data`,
  });

export const useGuardianList = (name: string, type: "mother" | "father") =>
  useCustom({
    config: { query: { name } },
    method: "get",
    queryOptions: { queryKey: [`guardian${type}Data`, name] },
    url: `/api/resource/Guardian/${name}`,
  });

// Mutation hooks
export const guardian_email_update = createMutationHook<GuardianEmailVariables>(
  (variables) => `/api/resource/Guardian/${variables.name}`
);

export const guardian_number_update =
  createMutationHook<GuardianNumberVariables>(
    (variables) => `/api/resource/Guardian/${variables.name}`
  );

export const guardian_father_number_update = (fatherGuardian: string) =>
  createMutationHook<GuardianNumberVariables>(
    () => `/api/resource/Guardian/${fatherGuardian}`
  )();

export const guardian_address = createMutationHook<GuardianAddress>(
  (variables) => `/api/resource/Student/${variables.name}`
);

export const guardian_address2 = createMutationHook<GuardianAddress2>(
  (variables) => `/api/resource/Student/${variables.name}`
);

export const guardian_city = createMutationHook<GuardianCity>(
  (variables) => `/api/resource/Student/${variables.name}`
);

export const guardian_pincode = createMutationHook<GuardianPincode>(
  (variables) => `/api/resource/Student/${variables.name}`
);

export const updateBloodGroup = createMutationHook<UpdateBloodGroupProps>(
  (variables) => `/api/resource/Student/${variables.name}`
);

export const updateAnnualIncome = createMutationHook<UpdateAnnualIncomeProps>(
  (variables) => `/api/resource/Guardian/${variables.name}`
);

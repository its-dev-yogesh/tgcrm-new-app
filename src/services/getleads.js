import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "./api";

export const useTestApi = () => {
  const { mutate, isLoading, isError } = useMutation(
    (data) => {
      const formData = data;
      // console.log(formData);
      return api.post("/trial-leads", formData);
    },
    {
      onSuccess: (data) => {
        toast.success("success");
      },

      onError: (error) => {
        toast.error("error");
      },
    }
  );
  return {
    testApiHit: mutate,
    isLoading,
    isError,
  };
};

export const useImportedDate = () => {
  const { mutate, isLoading, isError } = useMutation(
    (data) => {
      const formData = data;
      // console.log(formData);
      return api.post("/trial-leads", formData);
    },
    {
      onSuccess: (data) => {
        toast.success("success");
      },

      onError: (error) => {
        toast.error("error");
      },
    }
  );
  return {
    getLeadsByImportDate: mutate,
    isLoading,
    isError,
  };
};

import { apiMutations } from "@/lib/api/mutations";
import { useMutation } from "@tanstack/react-query";

export const useChargeCredit = () => {
  return useMutation({
    mutationFn: apiMutations.users.chargeCredit,
  });
};
export const useDeductCredit = () => {
  return useMutation({
    mutationFn: apiMutations.users.deductCredit,
  });
};

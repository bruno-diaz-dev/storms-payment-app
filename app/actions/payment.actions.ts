"use server";

import { registerPayment } from "@/src/services/payment.service";

export async function registerPaymentAction(data: {
  enrollmentId: string;
  amount: number;
  receivedById: string;
  note?: string;
}) {
  return registerPayment(data);
}

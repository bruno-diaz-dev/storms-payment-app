"use server";

import { prisma } from "@/lib/prisma";

export async function registerPaymentAction(
  enrollmentId: string,
  amount: number,
  userId: string,
  note?: string
) {
  if (!enrollmentId || amount <= 0) return;

  await prisma.payment.create({
    data: {
      enrollmentId,
      amount,
      paymentDate: new Date(),
      note,
      receivedById: userId,
    },
  });
}

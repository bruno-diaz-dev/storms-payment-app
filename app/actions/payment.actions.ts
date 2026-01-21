'use server'

import { prisma } from '@/lib/prisma'

export async function registerPaymentAction(
  enrollmentId: string,
  amount: number,
  receivedById: string
) {
  if (!enrollmentId || amount <= 0) {
    throw new Error('Invalid payment data')
  }

  await prisma.payment.create({
    data: {
      enrollmentId,
      amount,
      paymentDate: new Date(),
      receivedById,
    },
  })
}

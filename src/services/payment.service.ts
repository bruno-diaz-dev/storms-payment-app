import { Payment } from '@prisma/client'
import { prisma } from '@/src/lib/prisma'

export async function registerPayment(
  enrollmentId: string,
  amount: number,
  receivedById: string
): Promise<Payment> {
  return prisma.payment.create({
    data: {
      enrollmentId,
      amount,
      paymentDate: new Date(),
      receivedById,
    },
  })
}

export function sumPayments(payments: Payment[]): number {
  return payments.reduce(
    (sum: number, payment: Payment) =>
      sum + payment.amount,
    0
  )
}

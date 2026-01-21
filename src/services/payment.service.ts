import { Payment } from '@prisma/client'

export function sumPayments(
  payments: Payment[]
): number {
  return payments.reduce(
    (sum: number, payment: Payment) =>
      sum + payment.amount,
    0
  )
}

import { Enrollment, Payment } from '@prisma/client'

type EnrollmentWithPayments = Enrollment & {
  payments: Payment[]
}

export function calculateTotalPaid(
  enrollments: EnrollmentWithPayments[]
): number {
  return enrollments.reduce(
    (sum: number, enrollment: EnrollmentWithPayments) =>
      sum +
      enrollment.payments.reduce(
        (pSum: number, payment: Payment) =>
          pSum + payment.amount,
        0
      ),
    0
  )
}

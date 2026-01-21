import { Enrollment, Payment, Tournament } from '@prisma/client'

type EnrollmentWithPayments = Enrollment & {
  payments: Payment[]
}

export function getGlobalDashboardSummary(
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

export function getTournamentDashboardSummary(
  tournament: Tournament,
  enrollments: EnrollmentWithPayments[]
): {
  tournamentName: string
  totalCollected: number
} {
  const totalCollected = enrollments.reduce(
    (sum: number, enrollment: EnrollmentWithPayments) =>
      sum +
      enrollment.payments.reduce(
        (pSum: number, payment: Payment) =>
          pSum + payment.amount,
        0
      ),
    0
  )

  return {
    tournamentName: tournament.name,
    totalCollected,
  }
}

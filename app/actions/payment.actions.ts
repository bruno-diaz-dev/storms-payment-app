'use server'

import { registerPayment } from '@/src/services/payment.service'

export async function registerPaymentAction(
  enrollmentId: string,
  amount: number
) {
  // por ahora hardcodeado, luego vendrá del User admin
  const receivedById = 'admin'

  return registerPayment(enrollmentId, amount, receivedById)
}

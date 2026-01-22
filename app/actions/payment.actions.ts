'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function registerPaymentAction(
  enrollmentId: string,
  amount: number,
  receivedById: string
) {
  await prisma.payment.create({
    data: {
      enrollmentId,
      amount,
      paymentDate: new Date(),
      receivedById,
    },
  })

  revalidatePath('/payments')
}

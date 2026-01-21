export const dynamic = 'force-dynamic'


import { prisma } from '@/lib/prisma'

type PaymentRow = {
  id: string
  amount: number
  paymentDate: Date
  enrollment: {
    player: {
      fullName: string
    }
  }
}

export default async function PaymentsPage() {
  const payments: PaymentRow[] = await prisma.payment.findMany({
    include: {
      enrollment: {
        include: {
          player: true,
        },
      },
    },
    orderBy: {
      paymentDate: 'desc',
    },
  })

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Payments</h1>

      <table className="w-full border">
        <thead>
          <tr>
            <th>Player</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((row) => (
            <tr key={row.id}>
              <td>{row.enrollment.player.fullName}</td>
              <td>${row.amount}</td>
              <td>{row.paymentDate.toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

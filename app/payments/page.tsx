export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

export default async function PaymentsPage() {
  const enrollments = await prisma.enrollment.findMany({
    include: {
      player: true,
      tournament: true,
      payments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const rows = enrollments.map((e) => {
    const totalFee =
      e.totalFeeOverride ?? e.tournament.totalFee;

    const paid = e.payments.reduce(
      (sum, p) => sum + p.amount,
      0
    );

    const remaining = totalFee - paid;

    return {
      id: e.id,
      player: e.player.fullName,
      tournament: e.tournament.name,
      totalFee,
      paid,
      remaining,
    };
  });

  return (
    <main style={{ padding: 24 }}>
      <h1>Payments</h1>

      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Player</th>
            <th>Tournament</th>
            <th>Total</th>
            <th>Paid</th>
            <th>Remaining</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.player}</td>
              <td>{r.tournament}</td>
              <td>${r.totalFee}</td>
              <td>${r.paid}</td>
              <td
                style={{
                  color: r.remaining > 0 ? "red" : "green",
                  fontWeight: "bold",
                }}
              >
                ${r.remaining}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

import { prisma } from "@/src/lib/prisma";
import { logAction } from "./audit.service";

export async function registerPayment(data: {
  enrollmentId: string;
  amount: number;
  receivedById: string;
  note?: string;
}) {
  if (data.amount <= 0) {
    throw new Error("El monto del pago debe ser mayor a 0");
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: data.enrollmentId },
    include: {
      tournament: true,
      payments: true,
    },
  });

  if (!enrollment) {
    throw new Error("Enrollment no encontrado");
  }

  const totalFee =
    enrollment.totalFeeOverride ?? enrollment.tournament.totalFee;

  const paidSoFar = enrollment.payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  const balance = totalFee - paidSoFar;

  if (data.amount > balance) {
    throw new Error(`El pago excede el saldo pendiente. Saldo: ${balance}`);
  }

  const payment = await prisma.payment.create({
    data: {
      enrollmentId: data.enrollmentId,
      amount: data.amount,
      paymentDate: new Date(),
      note: data.note,
      receivedById: data.receivedById,
    },
  });

  // 🔍 AUDIT
  await logAction({
    action: "CREATE_PAYMENT",
    entityType: "Payment",
    entityId: payment.id,
    performedBy: data.receivedById,
  });

  return payment;
}

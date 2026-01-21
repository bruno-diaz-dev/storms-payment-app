import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Admin inicial
  const admin = await prisma.user.create({
    data: {
      name: "Admin Storms",
      role: "ADMIN",
    },
  });

  // Torneo Zeus
  const zeus = await prisma.tournament.create({
    data: {
      name: "Zeus",
      league: "AGSFFL",
      season: "2025",
      totalFee: 1800,
      isActive: true,
    },
  });

  // Torneo Sabatino
  const sabatino = await prisma.tournament.create({
    data: {
      name: "Sabatino",
      league: "Flagtastic",
      season: "2025",
      totalFee: 1600,
      isActive: true,
    },
  });

  console.log("✅ Seed completado");
  console.log({ admin, zeus, sabatino });
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

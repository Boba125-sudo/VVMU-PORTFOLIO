import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Demo User",
      email: "demo@example.com",
      password: "123456",
      bio: "Creative designer and portfolio owner"
    }
  });

  const category = await prisma.category.create({
    data: {
      name: "Web Design"
    }
  });

  console.log("Seed data created:", { user, category });
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
import prisma from "../../../prisma/prisma";
export async function findUserFromDatabase({
  type,
  email,
}: {
  type: "CLIENT" | "REALTOR";
  email: string;
}) {
  if (type === "CLIENT") {
    const role = type.toLowerCase();

    const user = await prisma[role].findFirst({
      where: {
        email,
      },
      include: {
        Listing: {
          include: {
            Bid: true,
          },
        },
      },
    });
    return user;
  } else {
    const user = await prisma["realtor"].findFirst({
      where: {
        email,
      },
      include: {
        Bid: {
          include: {
            Listing: true,
          },
        },
      },
    });

    return user;
  }
}

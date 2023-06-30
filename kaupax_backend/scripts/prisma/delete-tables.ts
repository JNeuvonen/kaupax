import prisma from "../../prisma/prisma";
const args = process.argv.slice(2);
let argumentsProvided = 0;

args.forEach(async (item) => {
  if (item.substring(0, 2) === "--") {
    // VALIDATE ARGUMENTS
    argumentsProvided += 1;
    let parsedItem = item.replace("--", "");
    parsedItem = parsedItem.toLowerCase();
    parsedItem = parsedItem.charAt(0).toUpperCase() + parsedItem.slice(1);
    try {
      await prisma[parsedItem].deleteMany();
      console.log("Succesfully deleted table: ", parsedItem);
    } catch (err) {
      console.log("Failed to delete table: ", parsedItem);
      console.log("Error: ", err);
    }
  }
});

if (argumentsProvided === 0) {
  console.log("No valid arguments provided");
  console.log(
    "Usage: ts-node scripts/prisma/delete-tables.ts --TABLE_NAME or --ALL"
  );
  console.log("Tip: you can pass multiple table names at once");
  console.log("WARNING: --ALL flag will delete all tables in the database");
}

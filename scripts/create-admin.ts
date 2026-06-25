import { createUser } from "../features/auth/services/user.service";

async function main() {
  const user = await createUser(
    "admin@dataflow.ci",
    "Admin123!",
    "ADMIN"
  );

  console.log(user);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
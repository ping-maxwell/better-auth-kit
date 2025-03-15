import { getTestInstance } from ".";

const { auth, client, testUser, db, signInWithUser } = await getTestInstance();

await signInWithUser(testUser.email, testUser.password);

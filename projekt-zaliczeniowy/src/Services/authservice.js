import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export const resetPassword = async (email) => {
  const auth = getAuth();
  await sendPasswordResetEmail(auth, email);
};

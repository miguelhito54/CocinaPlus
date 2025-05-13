import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "../../.env/firebaseConfig";

interface NavigateFunction {
  (path: string): void;
}

interface User {
  // Add relevant user properties based on Firebase User object
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

export const signInWithGoogle = async (navigate: NavigateFunction): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user as User;
    console.log("Google Sign-In Success:", user);
    navigate("Perfil"); // Redirect to /perfil
    return user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};

interface FacebookSignInResult {
  user: User;
}

export const signInWithFacebook = async (
  navigate: NavigateFunction
): Promise<User> => {
  try {
    const result: FacebookSignInResult = await signInWithPopup(auth, facebookProvider);
    const user = result.user;
    console.log("Facebook Sign-In Success:", user);
    navigate("/Perfil"); // Redirect to /perfil
    return user;
  } catch (error) {
    console.error("Facebook Sign-In Error:", error);
    throw error;
  }
};

export const handleLogout = async () => {
  try {
    await signOut(auth);
    console.log("Logout successful");
  } catch (error) {
    console.error("Logout Error:", error);
    throw error;
  }
};



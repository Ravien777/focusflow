import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  updateProfile,
  User,
  GoogleAuthProvider,
  signInWithCredential,
  OAuthProvider,
} from "firebase/auth";
import { getFirebaseAuth, isFirebaseAvailable } from "./firebase";
import { UserInfo } from "../types";

const UNAVAILABLE_ERR = "Firebase not configured. Sign-in is unavailable.";

function guardAuth() {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error(UNAVAILABLE_ERR);
  return auth;
}

export function onAuthChange(callback: (user: UserInfo | null) => void) {
  if (!isFirebaseAvailable()) {
    callback(null);
    return () => {};
  }
  try {
    const auth = getFirebaseAuth();
    if (!auth) {
      callback(null);
      return () => {};
    }
    return onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        callback({
          uid: firebaseUser.uid,
          email: firebaseUser.email ?? "",
          displayName: firebaseUser.displayName ?? firebaseUser.email ?? "User",
        });
      } else {
        callback(null);
      }
    });
  } catch {
    callback(null);
    return () => {};
  }
}

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string,
): Promise<UserInfo> {
  const auth = guardAuth();
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }
  return {
    uid: cred.user.uid,
    email: cred.user.email ?? email,
    displayName: displayName || email,
  };
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<UserInfo> {
  const auth = guardAuth();
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return {
    uid: cred.user.uid,
    email: cred.user.email ?? email,
    displayName: cred.user.displayName ?? cred.user.email ?? "User",
  };
}

export async function signOut(): Promise<void> {
  const auth = guardAuth();
  await fbSignOut(auth);
}

export async function signInWithGoogle(idToken: string): Promise<UserInfo> {
  const auth = guardAuth();
  const credential = GoogleAuthProvider.credential(idToken);
  const cred = await signInWithCredential(auth, credential);
  return {
    uid: cred.user.uid,
    email: cred.user.email ?? "",
    displayName: cred.user.displayName ?? "User",
  };
}

export async function signInWithApple(idToken: string): Promise<UserInfo> {
  const auth = guardAuth();
  const provider = new OAuthProvider("apple.com");
  const credential = provider.credential({ idToken });
  const cred = await signInWithCredential(auth, credential);
  return {
    uid: cred.user.uid,
    email: cred.user.email ?? "",
    displayName: cred.user.displayName ?? "User",
  };
}

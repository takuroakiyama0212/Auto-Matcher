import { useState, useEffect } from "react";
import { Platform, Alert } from "react-native";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import * as SecureStore from "expo-secure-store";
import { auth } from "@/lib/firebase";

// グローバルなコールバック関数（useFavoritesから設定される）
let onUserChangeCallback: ((userId: string | null) => Promise<void>) | null = null;

export function setFavoritesUserCallback(callback: (userId: string | null) => Promise<void>) {
  onUserChangeCallback = callback;
}

interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

interface AuthState {
  user: GoogleUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Firebase UserをGoogleUserに変換
const convertFirebaseUser = (firebaseUser: User | null): GoogleUser | null => {
  if (!firebaseUser) return null;

  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || "",
    name: firebaseUser.displayName || "",
    picture: firebaseUser.photoURL || undefined,
  };
};

export function useGoogleAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Firebase認証状態の監視
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!isMounted) return;

      if (firebaseUser) {
        const user = convertFirebaseUser(firebaseUser);
        if (user) {
          // ストレージに保存
          const userJson = JSON.stringify(user);
          if (Platform.OS === "web") {
            if (typeof window !== "undefined") {
              localStorage.setItem("google_user", userJson);
            }
          } else {
            try {
              await SecureStore.setItemAsync("google_user", userJson);
            } catch (error) {
              console.warn("Failed to save to SecureStore:", error);
            }
          }

          if (isMounted) {
            setAuthState({
              user,
              isLoading: false,
              isAuthenticated: true,
            });
          }

          // お気に入りをユーザーに紐付け（ログイン時）
          if (onUserChangeCallback) {
            await onUserChangeCallback(user.id);
          }
        }
      } else {
        // ログアウト状態
        if (Platform.OS === "web") {
          if (typeof window !== "undefined") {
            localStorage.removeItem("google_user");
          }
        } else {
          try {
            await SecureStore.deleteItemAsync("google_user");
          } catch (error) {
            console.warn("Failed to delete from SecureStore:", error);
          }
        }

        if (isMounted) {
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }

        // お気に入りをクリア（ログアウト時）
        if (onUserChangeCallback) {
          await onUserChangeCallback(null);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const signIn = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      if (Platform.OS === "web") {
        // Web環境: Firebase AuthのGoogle認証ポップアップを使用
        const provider = new GoogleAuthProvider();
        provider.addScope("profile");
        provider.addScope("email");

        const result = await signInWithPopup(auth, provider);
        // onAuthStateChangedが自動的に状態を更新するので、ここでは何もしない
      } else {
        // モバイル環境: デモモード（Firebase Authのモバイル実装は別途必要）
        console.log("Using demo mode on mobile (Firebase Auth mobile setup required)");
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        
        const demoUser: GoogleUser = {
          id: "demo-user-123",
          email: "demo@example.com",
          name: "Demo User",
          picture: undefined,
        };

        const userJson = JSON.stringify(demoUser);
        try {
          await SecureStore.setItemAsync("google_user", userJson);
        } catch (error) {
          console.warn("Failed to save to SecureStore:", error);
        }

        setAuthState({
          user: demoUser,
          isLoading: false,
          isAuthenticated: true,
        });

        Alert.alert(
          "Demo Mode",
          "Logged in as Demo User\n\nFor mobile, Firebase Auth mobile setup is required"
        );
      }
    } catch (error: any) {
      console.error("Google sign in error:", error);
      const errorMessage = error.message || "Failed to sign in with Google";
      
      if (Platform.OS === "web") {
        window.alert(errorMessage);
      } else {
        Alert.alert("Error", errorMessage);
      }
      
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const signOut = async () => {
    try {
      if (Platform.OS === "web") {
        await firebaseSignOut(auth);
        // onAuthStateChangedが自動的に状態を更新する
      } else {
        // モバイル環境
        try {
          await SecureStore.deleteItemAsync("google_user");
        } catch (error) {
          console.warn("Failed to delete from SecureStore:", error);
        }
        
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.error("Sign out error:", error);
      if (Platform.OS === "web") {
        window.alert("Failed to sign out");
      } else {
        Alert.alert("Error", "Failed to sign out");
      }
    }
  };

  return {
    ...authState,
    signIn,
    signOut,
  };
}

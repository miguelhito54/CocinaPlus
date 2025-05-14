import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { makeRedirectUri } from 'expo-auth-session';
import { getAuth, signInWithCredential, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { auth } from '../.env/firebaseConfig';
import { GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID, GOOGLE_ANDROID_CLIENT_ID, FACEBOOK_APP_ID } from '../.env/clientsData';

// Register your app with WebBrowser
WebBrowser.maybeCompleteAuthSession();

const redirectUri = makeRedirectUri();

const LoginScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Google Authentication setup
  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    clientId: Platform.OS === 'ios' ? GOOGLE_IOS_CLIENT_ID : GOOGLE_ANDROID_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    webClientId: GOOGLE_WEB_CLIENT_ID,
    redirectUri, // Explicitly set the redirect URI
  });

  // Facebook Authentication setup
  const [facebookRequest, facebookResponse, facebookPromptAsync] = Facebook.useAuthRequest({
    clientId: FACEBOOK_APP_ID,
    scopes: ['email'], // Request the email permission
    redirectUri, // Explicitly set the redirect URI
  });

  // Handle Google Sign In
  useEffect(() => {
    if (googleResponse?.type === 'success') {
      setLoading(true);
      const { id_token } = googleResponse.params;
      
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((result) => {
          console.log("Google Sign-In Success:", result.user);
          router.push("/Perfil");
        })
        .catch((error) => {
          console.error("Google Sign-In Error:", error);
          alert("Error signing in with Google: " + error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [googleResponse]);

  // Handle Facebook Sign In
  useEffect(() => {
    if (facebookResponse?.type === 'success') {
      setLoading(true);
      const { access_token } = facebookResponse.params;
      
      const credential = FacebookAuthProvider.credential(access_token);
      signInWithCredential(auth, credential)
        .then((result) => {
          console.log("Facebook Sign-In Success:", result.user);
          router.push("/Perfil");
        })
        .catch((error) => {
          console.error("Facebook Sign-In Error:", error);
          alert("Error signing in with Facebook: " + error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [facebookResponse]);

  const handleGoogleLogin = async () => {
    try {
      await googlePromptAsync();
    } catch (error) {
      console.error("Google prompt error:", error);
      alert("Error opening Google login: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await facebookPromptAsync();
    } catch (error) {
      console.error("Facebook prompt error:", error);
      alert("Error opening Facebook login: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>¡Bienvenido a Cocina Más!</Text>
          <Text style={styles.subtitle}>Inicia sesión y disfruta de la experiencia</Text>

          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: '#782701' }]}
            onPress={handleFacebookLogin}
            disabled={loading}
          >
            <FontAwesome name="facebook" size={20} color="#fff" style={styles.icon} />
            <Text style={styles.loginButtonText}>
              {loading ? "Cargando..." : "Iniciar sesión con Facebook"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: '#782701' }]}
            onPress={handleGoogleLogin}
            disabled={loading}
          >
            <MaterialCommunityIcons name="google" size={20} color="#fff" style={styles.icon} />
            <Text style={styles.loginButtonText}>
              {loading ? "Cargando..." : "Iniciar sesión con Google"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity >
          <Text
            style={styles.guestText}
            onPress={() => router.push('/(tabs)')} 
          >
            O continúa como invitado
          </Text>
          </TouchableOpacity>
        </View>
     </View>  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#782701',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 12,
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 10,
  },
  icon: {
    marginRight: 6,
  },
  guestText: {
    marginTop: 12,
    fontStyle: 'italic',
    color: '#888',
    fontSize: 13,
  },
});

export default LoginScreen;
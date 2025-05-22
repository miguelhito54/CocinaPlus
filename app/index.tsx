import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { auth } from '../.env/firebaseConfig';

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push('/Perfil');
      } else {
        router.push('/login'); 
      }
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#782701" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Index;

export const options = {
  headerShown: false,
};

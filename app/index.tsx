import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { auth } from '../.env/firebaseConfig';

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push('/Perfil'); // Usuario autenticado
      } else {
        router.push('/login'); // Redirigir al login
      }
    });

    return unsubscribe;
  }, []);

  return null; // Pantalla vacía mientras se redirige
};

export default Index;

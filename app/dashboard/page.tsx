// import HomePageAdmin from "./page-admin";
// import HomePageTeacher from "./page-teacher";

// export default function HomePage() {
//   return (
//     <>
//       <HomePageTeacher />
//       <HomePageAdmin />
//     </>
//   );
// }


"use client"; // Importante: estás usando hooks
import { useEffect, useState } from "react";
import axios from "axios";
import HomePageAdmin from "./page-admin";
import HomePageTeacher from "./page-teacher";

export default function HomePage() {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    role: '',
    username: ''
  });
  const [loading, setLoading] = useState(true);

  const getProfile = async () => {
    try {
      const response = await axios.get('/api/profile');
      setUser(response.data);
    } catch (error) {
      console.error("Error cargando perfil", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  if (loading) return <p>Cargando aplicación...</p>;

  // RENDERIZADO CONDICIONAL POR ROL
  switch (user.role) {
    case 'admin':
      return <HomePageAdmin/>;
    case 'profesor':
      return <HomePageTeacher/>;
    default:
      return <p>No tienes permisos para ver esto o el rol no existe.</p>;
  }
}

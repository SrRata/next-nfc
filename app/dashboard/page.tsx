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

  if (loading) return (
    <>

      <div className="bg-gray-200 h-50 rounded-primary animate-pulse p-7 space-y-3">
        <div className="bg-gray-300 size-15 rounded-primary"></div>
        <div className="bg-gray-300 w-1/3 h-6 rounded-primary"></div>
        <div className="bg-gray-300 w-1/2 h-10 rounded-primary"></div>
      </div>
      <div className="bg-gray-200 h-50 rounded-primary animate-pulse p-7 space-y-3">
        <div className="bg-gray-300 size-15 rounded-primary"></div>
        <div className="bg-gray-300 w-1/3 h-6 rounded-primary"></div>
        <div className="bg-gray-300 w-1/2 h-10 rounded-primary"></div>
      </div>
      <div className="bg-gray-200 h-50 rounded-primary animate-pulse p-7 space-y-3">
        <div className="bg-gray-300 size-15 rounded-primary"></div>
        <div className="bg-gray-300 w-1/3 h-6 rounded-primary"></div>
        <div className="bg-gray-300 w-1/2 h-10 rounded-primary"></div>
      </div>



      <div className="bg-gray-200 rounded-primary animate-pulse col-span-2 row-span-2 p-7 space-y-3 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="bg-gray-300 w-1/5 h-6 rounded-primary"></div>
          <div className="bg-gray-300 w-1/2 h-10 rounded-primary"></div>
          <div className="bg-gray-300 w-1/3 h-6 rounded-primary"></div>
        </div>

        <div>
          <div className="bg-gray-300 w-1/5 h-10 rounded-primary my-10 "></div>

          <div className="grid grid-cols-2 gap-5 mb-10">
            <div className="bg-gray-300 w-full h-40 rounded-primary"></div>
            <div className="bg-gray-300 w-full h-40 rounded-primary"></div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="bg-gray-300 w-1/3 h-7 rounded-primary"></div>
          <div className="bg-gray-300 w-1/5 h-7 rounded-primary"></div>

        </div>

      </div>

      <div className="bg-gray-200 h-70 rounded-primary animate-pulse p-7 space-y-3">
        <div className="bg-gray-300 size-15 rounded-primary"></div>
        <div className="bg-gray-300 w-1/3 h-6 rounded-primary mb-7"></div>
        <div className="bg-gray-300 w-full h-5 rounded-primary"></div>
        <div className="bg-gray-300 w-1/2 h-5 rounded-primary mb-7"></div>
        <div className="bg-gray-300 w-1/4 h-7 rounded-primary"></div>
      </div>

      <div className="bg-gray-200 h-70 rounded-primary animate-pulse p-7 space-y-3">
        <div className="bg-gray-300 size-15 rounded-primary"></div>
        <div className="bg-gray-300 w-1/3 h-6 rounded-primary mb-7"></div>
        <div className="bg-gray-300 w-full h-5 rounded-primary"></div>
        <div className="bg-gray-300 w-1/2 h-5 rounded-primary mb-7"></div>
        <div className="bg-gray-300 w-1/4 h-7 rounded-primary"></div>
      </div>

      <div className="bg-gray-200 h-70 rounded-primary animate-pulse p-7 space-y-3">
        <div className="bg-gray-300 size-15 rounded-primary"></div>
        <div className="bg-gray-300 w-1/3 h-6 rounded-primary mb-7"></div>
        <div className="bg-gray-300 w-full h-5 rounded-primary"></div>
        <div className="bg-gray-300 w-1/2 h-5 rounded-primary mb-7"></div>
        <div className="bg-gray-300 w-1/4 h-7 rounded-primary"></div>
      </div>
      <div className="bg-gray-200 h-70 rounded-primary animate-pulse p-7 space-y-3">
        <div className="bg-gray-300 size-15 rounded-primary"></div>
        <div className="bg-gray-300 w-1/3 h-6 rounded-primary mb-7"></div>
        <div className="bg-gray-300 w-full h-5 rounded-primary"></div>
        <div className="bg-gray-300 w-1/2 h-5 rounded-primary mb-7"></div>
        <div className="bg-gray-300 w-1/4 h-7 rounded-primary"></div>
      </div>
      <div className="bg-gray-200 h-70 rounded-primary animate-pulse p-7 space-y-3">
        <div className="bg-gray-300 size-15 rounded-primary"></div>
        <div className="bg-gray-300 w-1/3 h-6 rounded-primary mb-7"></div>
        <div className="bg-gray-300 w-full h-5 rounded-primary"></div>
        <div className="bg-gray-300 w-1/2 h-5 rounded-primary mb-7"></div>
        <div className="bg-gray-300 w-1/4 h-7 rounded-primary"></div>
      </div>
    </>
  );

  switch (user.role) {
    case 'admin':
      return <HomePageAdmin />
    case 'profesor':
      return <HomePageTeacher />;
    default:
      return <p>No tienes permisos para ver esto no moleste, no nos robe datos plis.</p>;
  }
}

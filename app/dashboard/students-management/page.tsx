import { Suspense } from "react";
import StudentsPageStructure from "./structure";

export default function StudentsPage() {

  return (
      <Suspense fallback={<div>Cargando...</div>}> 
        <StudentsPageStructure/>
      </Suspense>

  );
}

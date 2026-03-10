import { Alert } from "@/components/alert";
import { CourseCard, Subject } from "@/components/course-card";

import rawData from "./data.json";

import { educationLevel, section, status } from "@/lib/data-type";

type CourseData = {
  id: number;
  course: string;
  section: section; // matutina - vespertina
  level: educationLevel; // preparatoria - elemental - media - superior - bachillerato
  subjects: Subject[];
  studentCount: number;
  status: status; // activo - inactivo
};

  const data: CourseData[] = rawData as CourseData[];


export default function CoursesPage() {
  return (
    <>
      {/* <div className="col-span-full flex items-center justify-end">
        <Drawer direction="right">
          <DrawerTrigger asChild>
            <Button className="capitalize">
              <Filter />
              Filtros
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Filtros</DrawerTitle>
              <DrawerDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
                natus
              </DrawerDescription>
            </DrawerHeader>

            <div className="flex flex-col items-end gap-6 mt-10">
              <div className="w-full flex flex-col gap-4">
                <Label htmlFor="search">Buscar curso</Label>
                <Input id="search" placeholder="Buscar un curso..." />
              </div>
              <div className="w-full flex flex-col gap-4">
                <Label htmlFor="nivel">Nivel educativo</Label>
                <Select defaultValue="Todos">
                  <SelectTrigger id="nivel">
                    <SelectValue placeholder="Seleccione un nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Todos">Todos</SelectItem>
                      <SelectItem value="preparatoria">Preparatoria</SelectItem>
                      <SelectItem value="elemental">
                        Básica Elemental
                      </SelectItem>
                      <SelectItem value="media">Básica Media</SelectItem>
                      <SelectItem value="superior">Básica Superior</SelectItem>
                      <SelectItem value="bachillerato">Bachillerato</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full flex flex-col gap-4">
                <Label htmlFor="seccion">Sección</Label>
                <Select defaultValue="Todos">
                  <SelectTrigger id="seccion">
                    <SelectValue placeholder="Seleccione una sección" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Todos">Todos</SelectItem>
                      <SelectItem value="matutina">Sección Matutina</SelectItem>
                      <SelectItem value="vespertina">
                        Sección Vespertina
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full flex flex-col gap-4">
                <Label htmlFor="estado">Estado</Label>
                <Select defaultValue="Todos">
                  <SelectTrigger id="estado">
                    <SelectValue placeholder="Seleccione un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Todos">Todos</SelectItem>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="inactivo">Inactivo</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DrawerFooter>
              <Button>Aplicar</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div> */}

      {data.map((course) => (
        <CourseCard
          key={course.id}
          id={course.id}
          course={course.course}
          section={course.section}
          level={course.level}
          subjects={course.subjects}
          studentCount={course.studentCount}
          status={course.status} 
        />
      ))}

      <Alert
        variant="info"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor aspernatur, odio aliquid voluptates aliquam placeat debitis rerum doloribus qui, dolorem ullam nam! Non porro molestiae asperiores, fugiat voluptatem voluptates incidunt?"
      />
    </>
  );
}

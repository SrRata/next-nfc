import { Alert } from "@/components/alert";
import { CourseCard } from "@/components/course-card";
import { Pagination } from "@/components/ui/pagination";
import { TabsList, Tabs, TabsTrigger } from "@/components/ui/tabs";
import { ListTodo, Sunrise, Sunset } from "lucide-react";

export default function CoursesPage() {
    return (
        <>

        <CourseCard id="3roinfo" name="Inicial 1A" shift="morning" level="preschool" subjects={[{id: "desarollo", name: "Desarollo temprano"}]} studentCount={24} isActive={true}/>
        <CourseCard id="3roinfo" name="Inicial 1A" shift="afternoon" level="preschool" subjects={[{id: "desarollo", name: "Desarollo temprano"}]} studentCount={24} isActive={true}/>
        <CourseCard id="3roinfo" name="Tercero A" shift="morning" level="elementary" subjects={[{id: "lengua", name: "Lengua y Literatura"}]} studentCount={24} isActive={true}/>
        <CourseCard id="3roinfo" name="Tercero A" shift="afternoon" level="elementary" subjects={[{id: "lengua", name: "Lengua y Literatura"}]} studentCount={24} isActive={true}/>
        <CourseCard id="3roinfo" name="Quinto A" shift="morning" level="upper_middle" subjects={[{id: "sociales", name: "Estudios Sociales"}]} studentCount={24} isActive={true}/>
        <CourseCard id="3roinfo" name="Quinto A" shift="afternoon" level="upper_middle" subjects={[{id: "sociales", name: "Estudios Sociales"}]} studentCount={24} isActive={true}/>
        <CourseCard id="3roinfo" name="3ro Informática" shift="afternoon" level="high_school" subjects={[{id: "mate", name: "Matemáticas"}]} studentCount={24} isActive={true}/>
        <CourseCard id="3roinfo" name="3ro Informática" shift="morning" level="high_school" subjects={[{id: "mate", name: "Matemáticas"}]} studentCount={24} isActive={true}/>
        
        <Alert variant="info" description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor aspernatur, odio aliquid voluptates aliquam placeat debitis rerum doloribus qui, dolorem ullam nam! Non porro molestiae asperiores, fugiat voluptatem voluptates incidunt?"/>
        </>
        
    )
}
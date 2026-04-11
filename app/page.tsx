import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Baby, Blocks, ChartArea, Clock, Cloud, Cloudy, Code, Cpu, CreditCard, Database, Github, GraduationCap, IdCardLanyard, Key, LayoutTemplate, Nfc, Palette, Server, ShieldUser, UserLock, Users, Zap } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";



export const metadata: Metadata = {
  title: "SIAE",
};

export default function Home() {

    return (
      <>

        <header className="fixed  left-1/2 -translate-x-1/2 top-5 w-[95%] max-w-350 bg-white-primary/70 backdrop-blur-lg flex justify-between py-4 px-10 rounded-full z-50 shadow-xl ">

          <Logo />


          {/* <ul className="hidden md:flex gap-10 items-center">
            <li><a className="font-medium hover:underline text-black-primary" href="#1">¿Qué es el sistema?</a></li>
            <li><a className="font-medium hover:underline text-black-primary" href="#2">Funciones</a></li>
            <li><a className="font-medium hover:underline text-black-primary" href="#3">Tecnologías</a></li>
            <li><a className="font-medium hover:underline text-black-primary" href="#4">Equipo </a></li>
          </ul> */}

          <Link href="/dashboard" target="_blanck">
            <Button className="rounded-full" >
              Acceder
            </Button>
          </Link>

        </header>


        <section className="grid md:grid-cols-2 max-w-350 mx-auto py-15 px-6 pt-45 gap-20">

          <div className="flex flex-col gap-5">

            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-blue-900 leading-tight mb-6 text-center md:text-left">
              Sistema Inteligente de Asistencia Escolar con NFC
            </h2>

            <p className="text-xl text-black mb-10 leading-relaxed">
              Optimice el control de acceso y registro estudiantil con tecnología de proximidad. Seguridad, rapidez y reportes automáticos para una gestión educativa moderna.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/dashboard" target="_blanck">
                <Button className="w-fit">
                  <ShieldUser className="size-7" />
                  Acceso Administrador
                </Button>
              </Link>
              <Link href="/dashboard" target="_blanck">
                <Button className="w-fit" variant="outline">
                  <GraduationCap className="size-7" />
                  Acceso Docente
                </Button>
              </Link>
              <Link href="/dashboard" target="_blanck">
                <Button className="w-fit" variant="outline" >
                  <Baby className="size-7" />
                  Acceso Padres
                </Button>
              </Link>

            </div>

          </div>

          <div className="bg-white p-4 rounded-2xl shadow-2xl rotate-3 transform h-140 hidden md:block">
            <img className="rounded-2xl w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDP5bJ4gGbnW5xi3Rqzs9uvp9_8fMcw0vEUwzgLGbBQgd5wQ2JHP3x1u5eZ_Gf1cWyRmldOaZmv_hg5xXDlRxI3Ea6O50VklT6h8urwmI_TqP2-EEjVQy_CQYvLGwlg4fHDU0xRBX-m1zuJTCKun-SrngIsunWpgigsHSej9B0Sm1aG4LA8_dMY26iqcgZCqR6oOepOSM-q-UNPDKNLBiHqblfwY4MWfeqNKgiv4WXZi__lipQE8YTQxDSShEsGgA7DPE20RxN3Se-" />
            <div className="absolute -bottom-6 -left-6 bg-blue-primary text-white p-6 rounded-2xl shadow-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white-primary rounded-full size-12 grid place-content-center">
                  <Nfc className="size-8 text-blue-primary" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest opacity-80">Tecnología NFC</p>
                  <p className="text-xl font-bold">Registro 0.5s</p>
                </div>

              </div>
            </div>
          </div>

        </section >

        <div className="bg-white w-full" id="1">
          <section className="grid md:grid-cols-4 max-w-350 mx-auto py-15 gap-10 px-6">

            <div className="flex justify-center col-span-full mb-15">
              <h3 className="font-extrabold text-3xl text-blue-900">
                ¿Qué es el sistema?
                <div className="h-1 w-20 bg-blue-900 mx-auto rounded-full mt-2"></div>
              </h3>
            </div>

            <div className="bg-blue-secondary/40 rounded-primary p-8 flex flex-col gap-3 border-2 border-blue-secondary">
              <CreditCard className="text-blue-900 size-10" strokeWidth={2} />
              <h4 className="font-bold text-xl text-blue-900">Tarjetas NFC</h4>
              <p className="font-medium text-gray-700">Identificación única mediante tarjetas de proximidad de alta seguridad.</p>
            </div>

            <div className="bg-blue-secondary/40 rounded-primary p-8 flex flex-col gap-3 border-2 border-blue-secondary">
              <Zap className="text-blue-900 size-10" strokeWidth={2} />
              <h4 className="font-bold text-xl text-blue-900">Registro Automático</h4>
              <p className="font-medium text-gray-700">Elimine las listas de papel. El ingreso se marca al instante al acercar la tarjeta.</p>
            </div>

            <div className="bg-blue-secondary/40 rounded-primary p-8 flex flex-col gap-3 border-2 border-blue-secondary">
              <Cloud className="text-blue-900 size-10" strokeWidth={2} />
              <h4 className="font-bold text-xl text-blue-900">Base de Datos Cloud</h4>
              <p className="font-medium text-gray-700">Información centralizada y respaldada en la nube con acceso 24/7.</p>
            </div>

            <div className="bg-blue-secondary/40 rounded-primary p-8 flex flex-col gap-3 border-2 border-blue-secondary">
              <UserLock className="text-blue-900 size-10" strokeWidth={2} />
              <h4 className="font-bold text-xl text-blue-900">Acceso por Roles</h4>
              <p className="font-medium text-gray-700">Permisos diferenciados para una administración jerárquica y segura.</p>
            </div>


          </section>
        </div>


        <section className="grid md:grid-cols-3 max-w-350 mx-auto py-15 gap-7 px-6" id="2">

          <div className="col-span-full flex items-center justify-between mb-8">
            <div>
              <p className="text-primary font-bold text-sm tracking-widest uppercase mb-2">Herramientas</p>
              <h2 className="text-4xl font-extrabold text-blue-900">Funcionalidades Principales</h2>
            </div>
            <p className="max-w-md text-gray-700 font-medium hidden md:block">
              Una suite completa diseñada para cubrir todas las necesidades de la comunidad educativa.
            </p>
          </div>


          <div className="bg-white rounded-primary p-10 border border-blue-primary/20 md:col-span-2 relative cursor-pointer group">
            <Users className="mb-6 size-12 text-blue-900" strokeWidth={2.5} />
            <h3 className="text-2xl font-bold text-blue-900 mb-4">
              Gestión de Estudiantes
            </h3>
            <p className="font-medium text-gray-700 max-w-sm">Módulo integral para el manejo de expedientes, vinculación de acudientes y seguimiento individual del alumno.</p>
            <IdCardLanyard className="text-blue-secondary group-hover:text-blue-primary transition-all duration-300 size-25 absolute -right-2 bottom-0" strokeWidth={2.5} />
          </div>

          <div className="bg-blue-900 rounded-primary p-10 border border-blue-900 relative cursor-pointer">
            <div className="bg-white-primary rounded-full size-12 grid place-content-center mb-2">
              <Nfc className="size-8 text-blue-primary" strokeWidth={2.5} />
            </div>

            <h3 className="text-2xl font-bold text-white-primary mb-4">
              Asignación NFC
            </h3>
            <p className="font-medium text-white/60 max-w-sm">Proceso rápido de vinculación de tarjetas físicas con el perfil digital de cada estudiante.</p>
          </div>

          <div className="bg-white rounded-primary p-10 border border-blue-primary/20 cursor-pointer">
            <Clock className="mb-6 size-12 text-blue-900" strokeWidth={2.5} />
            <h3 className="text-2xl font-bold text-blue-900 mb-4">
              Control en Tiempo Real
            </h3>
            <p className="font-medium text-gray-700 max-w-sm">Visualice quién está en la institución en cada momento desde cualquier dispositivo móvil o PC.</p>
          </div>

          <div className="bg-white rounded-primary p-10 border border-blue-primary/20 md:col-span-2 cursor-pointer flex justify-between items-center">
            <div>
              <ChartArea className="mb-6 size-12 text-blue-900" strokeWidth={2.5} />
              <h3 className="text-2xl font-bold text-blue-900 mb-4">
                Reportes Estadísticos
              </h3>
              <p className="font-medium text-gray-700 max-w-sm">Gráficas de ausentismo, puntualidad y tendencias mensuales exportables a PDF y Excel.</p>
            </div>

            <div className="bg-blue-secondary rounded-primary p-4 w-full max-w-70 space-y-3">
              <div className="h-4 bg-blue-primary/20 rounded-full w-full"></div>
              <div className="h-4 bg-blue-primary/40 rounded-full w-3/4"></div>
              <div className="h-4 bg-blue-primary/10 rounded-full w-5/6"></div>
            </div>

          </div>

        </section>

        <div className="bg-white w-full" id="3">

          <section className="max-w-350 mx-auto py-15 px-6">

            <div className="col-span-full mb-15 flex justify-end">
              <div>
                <p className="text-primary font-bold text-sm tracking-widest uppercase mb-2 text-right">Stack Tecnológico</p>
                <h2 className="text-4xl font-extrabold text-blue-900">Tecnologías y Lenguajes</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-12 gap-6">

              <div className="col-span-full md:col-span-6 bg-blue-secondary/40 border border-blue-secondary rounded-2xl p-6 flex items-center gap-6 group hover:border-blue-primary transition-all duration-300 cursor-pointer">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                  <LayoutTemplate className="size-10 text-blue-900" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 text-lg">Next.js &amp; React</h4>
                  <p className="text-slate-600">Desarrollo frontend modular y reactivo para portales institucionales.</p>
                </div>
              </div>

              <div className="md:col-span-3 bg-blue-secondary/40 border border-blue-secondary rounded-2xl p-6 flex flex-col justify-center group hover:border-blue-primary transition-all duration-300 cursor-pointer">
                <Server className="size-10 mb-3 text-blue-900" />
                <h4 className="font-bold text-blue-900 text-lg">Node.js</h4>
                <p className=" text-slate-600">Arquitectura de servidor y API REST escalable.</p>
              </div>

              <div className="md:col-span-3 bg-blue-secondary/40 border border-blue-secondary rounded-2xl p-6 flex flex-col justify-center group hover:border-blue-primary transition-all duration-300 cursor-pointer">
                <Palette className="size-10 mb-3 text-blue-900" />
                <h4 className="font-bold text-blue-900 text-lg">Tailwind CSS</h4>
                <p className=" text-slate-600">Estilizado utility-first para interfaces modernas.</p>
              </div>

              <div className="col-span-full md:col-span-7 bg-blue-900 text-white rounded-2xl p-8 flex items-center gap-8 shadow-lg cursor-pointer">
                <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                  <Cpu className="size-10 text-white-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-2xl mb-2">ESP32 &amp; NFC</h4>
                  <p className="text-blue-100/80">Integración de hardware para el seguimiento de asistencia en tiempo real mediante tarjetas de proximidad.</p>
                </div>
              </div>

              <div className="md:col-span-5 bg-surface-container-high rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-4 border border-blue-secondary hover:border-blue-primary transition-all duration-300 group cursor-pointer">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0">
                  <Blocks className="size-10 mb-3 text-blue-900" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900">shadcn/ui</h4>
                  <p className=" text-slate-600">Componentes de UI accesibles y personalizables.</p>
                </div>
              </div>


              <div className="md:col-span-4 bg-blue-secondary/40 border border-blue-secondary rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-4 hover:border-blue-primary transition-all duration-300 cursor-pointer">
                <Code className="size-10 mb-3 text-blue-900" />
                <div>
                  <h4 className="font-bold text-blue-900">TypeScript</h4>
                  <p className=" text-slate-600">Tipado estático para un código robusto y mantenible.</p>
                </div>
              </div>

              <div className="md:col-span-4 bg-blue-secondary/40 border border-blue-secondary rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-4 hover:border-blue-primary transition-all duration-300 cursor-pointer">
                <Database className="size-10 mb-3 text-blue-900" />
                <div>
                  <h4 className="font-bold text-blue-900">SQL en MariaDB</h4>
                  <p className=" text-slate-600">Gestión relacional de datos estudiantiles y registros.</p>
                </div>
              </div>

              <div className="md:col-span-4 bg-blue-secondary/40 border border-blue-secondary rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-4 hover:border-blue-primary transition-all duration-300 cursor-pointer">
                <Cloudy className="size-10 mb-3 text-blue-900" />
                <div>
                  <h4 className="font-bold text-blue-900">Hostinger</h4>
                  <p className=" text-slate-600">Plataforma de despliegue y hosting de alto rendimiento.</p>
                </div>
              </div>

            </div >

          </section>

        </div >



        <section className="grid grid-cols-2 md:grid-cols-4 max-w-350 mx-auto py-15 gap-10 px-6" id="4">

          <div className="flex justify-center col-span-full mb-15">
            <h3 className="font-extrabold text-3xl text-blue-900">
              Equipo de Desarrollo
              <div className="h-1 w-20 bg-blue-900 mx-auto rounded-full mt-2"></div>
            </h3>
          </div>

          <div className="rounded-primary border border-blue-primary/30 p-5 flex flex-col items-center">
            <div className="bg-gray-400 size-40 rounded-full overflow-hidden mb-7">
              <img src="https://avatars.githubusercontent.com/u/167723338?v=4" className="size-full" />
            </div>
            <p className="font-bold text-black-primary mb-3 text-center">Luis Miguel Matailo</p>
            <Badge color="blue">Backend</Badge>
          </div>

          <div className="rounded-primary border border-blue-primary/30 p-5 flex flex-col items-center">
            <div className="bg-gray-400 size-40 rounded-full overflow-hidden mb-7">
              <img src="·" className="size-full" />
            </div>
            <p className="font-bold text-black-primary mb-3 text-center">Justin Ariel Alvarez</p>
            <Badge color="blue">Frontend & UI/UX</Badge>
          </div>

          <div className="rounded-primary border border-blue-primary/30 p-5 flex flex-col items-center">
            <div className="bg-gray-400 size-40 rounded-full overflow-hidden mb-7">
              <img src="·" className="size-full" />
            </div>
            <p className="font-bold text-black-primary mb-3 text-center">Bryam David Illescas</p>
            <Badge color="blue">Base de Datos</Badge>
          </div>

          <div className="rounded-primary border border-blue-primary/30 p-5 flex flex-col items-center">
            <div className="bg-gray-400 size-40 rounded-full overflow-hidden mb-7">
              <img src="·" className="size-full" />
            </div>
            <p className="font-bold text-black-primary mb-3 text-center">Braulio Alexander Guambaña</p>
            <Badge color="blue">Hardware & NFC</Badge>
          </div>

        </section>

        <footer className="bg-white">

          <div className="w-full max-w-350 mx-auto px-4 py-10 flex flex-col md:flex-row gap-5 justify-between items-center">

            <Logo />

              {/* <ul className="flex flex-wrap gap-10 items-center">
                <li><a className="hover:underline font-medium text-black-primary" href="#1">¿Qué es el sistema?</a></li>
                <li><a className="hover:underline font-medium text-black-primary" href="#2">Funciones</a></li>
                <li><a className="hover:underline font-medium text-black-primary" href="#3">Tecnologías</a></li>
                <li><a className="hover:underline font-medium text-black-primary" href="#4">Equipo </a></li>
              </ul> */}

            <Button variant="ghost" size="sm">
              <a href="https://github.com/SrRata" target="_blanck">
                <Code className="size-6" />
              </a>
            </Button>


          </div>
        </footer>

      </>
    );
  }

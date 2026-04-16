import CardSwap, { Card } from "@/components/card-swap";
import { ToggleResponsiveDesing } from "@/components/toggle-responsive-desing";
import { Android } from "@/components/ui/android";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { Iphone } from "@/components/ui/iphone";
import { Logo } from "@/components/ui/logo";
import RotatingText from "@/components/ui/roating-text";
import { Safari } from "@/components/ui/safari";
import { TextAnimate } from "@/components/ui/text-animate";
import { Baby, Blocks, ChartArea, Clock, Cloud, Cloudy, Code, Cpu, CreditCard, Database, Github, GraduationCap, IdCardLanyard, Key, LayoutTemplate, Nfc, Palette, Server, ShieldUser, UserLock, Users, Zap } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";





export const metadata: Metadata = {
  title: "SIAE",
};

export default function Home() {

  return (
    <>

      {/* <header className="fixed  left-1/2 -translate-x-1/2 top-5 w-[95%] max-w-350 bg-white-primary/70 backdrop-blur-lg flex justify-between py-4 px-10 rounded-full z-50 shadow-xl "> */}
      <header className="flex justify-between items-center p-5 max-w-450 mx-auto">

        <Logo />

        <div className="flex items-center gap-15">

          <ul className="hidden md:flex gap-10 items-center">
            <li><a className="font-medium hover:underline text-black-primary" href="#1">¿Qué es el sistema?</a></li>
            <li><a className="font-medium hover:underline text-black-primary" href="#2">Funciones</a></li>
            <li><a className="font-medium hover:underline text-black-primary" href="#3">Tecnologías</a></li>
            <li><a className="font-medium hover:underline text-black-primary" href="#4">Equipo </a></li>
            <li><a className="font-medium hover:underline text-black-primary" href="#5">Responsive design </a></li>
          </ul>

          <Link href="/login" target="_blanck">
            <Button className="rounded-full">
              Acceder
            </Button>
          </Link>

        </div>

      </header>





      <section className="grid md:grid-cols-2 max-w-350 mx-auto py-15 px-6 gap-20 relative">

        <div className="flex flex-col gap-5">

          <TextAnimate startOnView={false} animation="slideUp" by="word" className="text-5xl md:text-6xl font-extrabold tracking-tight text-blue-900 leading-tight mb-6 text-center md:text-left">
            Sistema Inteligente de Asistencia Escolar con NFC
          </TextAnimate>

          <TextAnimate startOnView={false} className="text-[12px] text-black mb-10 leading-relaxed" animation="slideLeft" by="character">
            Optimice el control de acceso y registro estudiantil con tecnología de proximidad. Seguridad, rapidez y reportes automáticos para una gestión educativa moderna.
          </TextAnimate>

          <div className="flex flex-wrap gap-4">
            {/* <Link href="/dashboard" target="_blanck">
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
            </Link> */}

            <Badge color="blue" className="text-[12px]">
              <ShieldUser className="size-7" />
              Acceso Admistrador
            </Badge>
            <Badge color="purple" className="text-[12px]">
              <GraduationCap className="size-7" />
              Acceso Docente
            </Badge>
            <Badge color="orange" className="text-[12px]">
              <Baby className="size-7" />
              Acceso Padres
            </Badge>


          </div>


          <BlurFade className="relative mt-15 w-[90%] h-[300px] md:hidden">

            <div className="absolute top-0 left-8 w-full h-full rounded-3xl shadow-xl transform translate-x-4 -translate-y-8 z-10 bg-[url('https://www.hubspot.es/hs-fs/hubfs/dise%C3%B1o-one-page-website.webp?width=567&height=361&name=dise%C3%B1o-one-page-website.webp')] bg-cover"></div>
            <div className="absolute top-0 left-4 w-full h-full rounded-3xl shadow-xl transform translate-x-2 -translate-y-4 z-20 bg-[url('https://www.komunicando.es/wp-content/uploads/2018/05/diseno-web.jpg')] bg-cover"></div>
            <div className="absolute top-0 left-0 w-full h-full rounded-3xl shadow-xl z-30 bg-[url('https://www.opiniones.hosting/wp-content/uploads/2024/07/Hostinger-opiniones.jpg')] bg-cover"></div>

          </BlurFade>
        </div>

        {/* 
  <CardSwap
    cardDistance={30}
    verticalDistance={40}
    delay={5000}
    pauseOnHover={false}
    width={500}
    height={300}
    easing="elastic"
  >
    <Card className=" bg-[url('https://www.hubspot.es/hs-fs/hubfs/dise%C3%B1o-one-page-website.webp?width=567&height=361&name=dise%C3%B1o-one-page-website.webp')] bg-cover shadow-2xl"></Card>
    <Card className="bg-[url('https://www.komunicando.es/wp-content/uploads/2018/05/diseno-web.jpg')] bg-cover shadow-2xl"></Card>
    <Card className=" bg-[url('https://www.opiniones.hosting/wp-content/uploads/2024/07/Hostinger-opiniones.jpg')] bg-cover shadow-2xl"></Card>
  </CardSwap>
   */}



        <BlurFade className="relative w-full h-[90%]">

          <div className="absolute top-0 left-8 w-full h-full rounded-3xl shadow-xl transform translate-x-4 -translate-y-8 z-10 bg-[url('https://www.hubspot.es/hs-fs/hubfs/dise%C3%B1o-one-page-website.webp?width=567&height=361&name=dise%C3%B1o-one-page-website.webp')] bg-cover"></div>
          <div className="absolute top-0 left-4 w-full h-full rounded-3xl shadow-xl transform translate-x-2 -translate-y-4 z-20 bg-[url('https://www.komunicando.es/wp-content/uploads/2018/05/diseno-web.jpg')] bg-cover"></div>
          <div className="absolute top-0 left-0 w-full h-full rounded-3xl shadow-xl z-30 bg-[url('https://www.opiniones.hosting/wp-content/uploads/2024/07/Hostinger-opiniones.jpg')] bg-cover"></div>

        </BlurFade>

        {/* <div className="bg-white p-4 rounded-2xl shadow-2xl rotate-3 transform h-140 hidden md:block">
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
        </div> */}

      </section >

      <div className="bg-white w-full" id="1">
        <section className=" max-w-350 mx-auto py-15 px-6">

          <div className="flex justify-center mb-15">
            <h3 className="font-extrabold text-4xl text-blue-900">
              ¿Qué es el sistema?
              <div className="h-1 w-20 bg-blue-900 mx-auto rounded-full mt-2"></div>
            </h3 >
          </div>

          <div className="grid md:grid-cols-4 group/1 gap-7">

            <BlurFade>
              <div className="bg-blue-secondary/40 rounded-primary p-8 flex flex-col gap-3 border border-blue-secondary hover:border-blue-primary transition-all duration-300 cursor-pointer hover:scale-101 group-hover/1:blur-[1px] hover:!blur-none">
                <CreditCard className="text-blue-900 size-10" strokeWidth={2} />
                <h4 className="font-bold text-xl text-blue-900">Tarjetas NFC</h4>
                <p className="font-medium text-gray-700">Identificación única mediante tarjetas de proximidad de alta seguridad.</p>
              </div>
            </BlurFade>
            <BlurFade>
              <div className="bg-blue-secondary/40 rounded-primary p-8 flex flex-col gap-3 border border-blue-secondary hover:border-blue-primary transition-all duration-300 cursor-pointer hover:scale-101 group-hover/1:blur-[1px] hover:!blur-none">
                <Zap className="text-blue-900 size-10" strokeWidth={2} />
                <h4 className="font-bold text-xl text-blue-900">Registro Automático</h4>
                <p className="font-medium text-gray-700">Elimine las listas de papel. El ingreso se marca al instante al acercar la tarjeta.</p>
              </div>
            </BlurFade>
            <BlurFade>

              <div className="bg-blue-secondary/40 rounded-primary p-8 flex flex-col gap-3 border border-blue-secondary hover:border-blue-primary transition-all duration-300 cursor-pointer hover:scale-101 group-hover/1:blur-[1px] hover:!blur-none">
                <Cloud className="text-blue-900 size-10" strokeWidth={2} />
                <h4 className="font-bold text-xl text-blue-900">Base de Datos Cloud</h4>
                <p className="font-medium text-gray-700">Información centralizada y respaldada en la nube con acceso 24/7.</p>
              </div>
            </BlurFade>
            <BlurFade>

              <div className="bg-blue-secondary/40 rounded-primary p-8 flex flex-col gap-3 border border-blue-secondary hover:border-blue-primary transition-all duration-300 cursor-pointer hover:scale-101 group-hover/1:blur-[1px] hover:!blur-none">
                <UserLock className="text-blue-900 size-10" strokeWidth={2} />
                <h4 className="font-bold text-xl text-blue-900">Acceso por Roles</h4>
                <p className="font-medium text-gray-700">Permisos diferenciados para una administración jerárquica y segura.</p>
              </div>
            </BlurFade>






          </div>


        </section>
      </div>


      <section className="max-w-350 mx-auto py-15 px-6" id="2">

        <div className="col-span-full flex items-center justify-between mb-8">
          <div>
            <p className="text-primary font-bold text-sm tracking-widest uppercase mb-2">Herramientas</p>
            <h2 className="text-4xl font-extrabold text-blue-900">Funcionalidades Principales</h2>
          </div>
          <p className="max-w-md text-gray-700 font-medium hidden md:block">
            Una suite completa diseñada para cubrir todas las necesidades de la comunidad educativa.
          </p>
        </div>


        <div className="group/2 grid md:grid-cols-3 gap-7">

          <div className="bg-white rounded-primary p-10 border border-blue-primary/20 md:col-span-2 relative cursor-pointer group/card1 overflow-hidden hover:border-blue-primary transition-all duration-300 hover:scale-101 group-hover/2:blur-[1px] hover:!blur-none">
            <Users className="mb-6 size-12 text-blue-900" strokeWidth={2.5} />
            <h3 className="text-2xl font-bold text-blue-900 mb-4">
              Gestión de Estudiantes
            </h3>
            <p className="font-medium text-gray-700 max-w-sm">Módulo integral para el manejo de expedientes, vinculación de acudientes y seguimiento individual del alumno.</p>
            <IdCardLanyard className="text-blue-secondary/90 size-50 md:size-60 absolute -right-10 -bottom-10 rotate-10 group-hover:text-blue-secondary group-hover/card1:-rotate-5  transition-all duration-300 group-hover/card1:scale-110" strokeWidth={2.5} />
          </div>

          <div className="bg-blue-900 rounded-primary p-10 border border-blue-900 relative hover:border-blue-primary transition-all duration-300 cursor-pointer hover:scale-101 group-hover/2:blur-[1px] hover:!blur-none">
            <div className="bg-white-primary rounded-full size-12 grid place-content-center mb-2">
              <Nfc className="size-8 text-blue-primary" strokeWidth={2.5} />
            </div>

            <h3 className="text-2xl font-bold text-white-primary mb-4">
              Asignación NFC
            </h3>
            <p className="font-medium text-white/60 max-w-sm">Proceso rápido de vinculación de tarjetas físicas con el perfil digital de cada estudiante.</p>
          </div>

          <div className="bg-white rounded-primary p-10 border border-blue-primary/20 hover:border-blue-primary transition-all duration-300 cursor-pointer hover:scale-101 group-hover/2:blur-[1px] hover:!blur-none">
            <Clock className="mb-6 size-12 text-blue-900" strokeWidth={2.5} />
            <h3 className="text-2xl font-bold text-blue-900 mb-4">
              Control en Tiempo Real
            </h3>
            <p className="font-medium text-gray-700 max-w-sm">Visualice quién está en la institución en cada momento desde cualquier dispositivo móvil o PC.</p>
          </div>

          <div className="bg-white rounded-primary p-10 border border-blue-primary/20 md:col-span-2 flex justify-between items-center hover:border-blue-primary transition-all duration-300 cursor-pointer hover:scale-101 group-hover/2:blur-[1px] hover:!blur-none group/card2">
            <div>
              <ChartArea className="mb-6 size-12 text-blue-900" strokeWidth={2.5} />
              <h3 className="text-2xl font-bold text-blue-900 mb-4">
                Reportes Estadísticos
              </h3>
              <p className="font-medium text-gray-700 max-w-sm">Gráficas de ausentismo, puntualidad y tendencias mensuales exportables a PDF y Excel.</p>
            </div>

            <div className="bg-blue-secondary rounded-primary p-4 w-full max-w-50 md:max-w-70 space-y-3 group-hover/card2:scale-110 transition-all duration-300 group-hover/card2:rotate-2">
              <div className="h-4 bg-blue-primary/20 rounded-full w-full"></div>
              <div className="h-4 bg-blue-primary/40 rounded-full w-3/4"></div>
              <div className="h-4 bg-blue-primary/10 rounded-full w-5/6"></div>
            </div>

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

          <div className="grid grid-cols-2 md:grid-cols-12 gap-6 group/3">

            <div className="col-span-full md:col-span-6 bg-blue-secondary/40 border border-blue-secondary rounded-primary p-6 flex items-center gap-6 group hover:border-blue-primary transition-all duration-300 cursor-pointer hover:scale-101 group-hover/3:blur-[1px] hover:!blur-none">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                <LayoutTemplate className="size-10 text-blue-900" />
              </div>
              <div>
                <h4 className="font-bold text-blue-900 text-lg">Next.js &amp; React</h4>
                <p className="text-slate-600">Desarrollo frontend modular y reactivo para portales institucionales.</p>
              </div>
            </div>

            <div className="md:col-span-3 bg-blue-secondary/40 border border-blue-secondary rounded-primary p-6 flex flex-col justify-center group hover:border-blue-primary transition-all duration-300 cursor-pointer hover:scale-101 group-hover/3:blur-[1px] hover:!blur-none">
              <Server className="size-10 mb-3 text-blue-900" />
              <h4 className="font-bold text-blue-900 text-lg">Node.js</h4>
              <p className=" text-slate-600">Arquitectura de servidor y API REST escalable.</p>
            </div>

            <div className="md:col-span-3 bg-blue-secondary/40 border border-blue-secondary rounded-primary p-6 flex flex-col justify-center group hover:border-blue-primary transition-all duration-300 cursor-pointer hover:scale-101 group-hover/3:blur-[1px] hover:!blur-none">
              <Palette className="size-10 mb-3 text-blue-900" />
              <h4 className="font-bold text-blue-900 text-lg">Tailwind CSS</h4>
              <p className=" text-slate-600">Estilizado utility-first para interfaces modernas.</p>
            </div>

            <div className="col-span-full md:col-span-7 bg-blue-900 text-white rounded-primary p-8 flex items-center gap-8 shadow-lg hover:border-blue-primary transition-all duration-300 cursor-pointer hover:scale-101 group-hover/3:blur-[1px] hover:!blur-none">
              <div className="w-20 h-20 bg-white/10 rounded-primary flex items-center justify-center shrink-0">
                <Cpu className="size-10 text-white-primary" />
              </div>
              <div>
                <h4 className="font-bold text-2xl mb-2">ESP32 &amp; NFC</h4>
                <p className="text-blue-100/80">Integración de hardware para el seguimiento de asistencia en tiempo real mediante tarjetas de proximidad.</p>
              </div>
            </div>

            <div className="md:col-span-5 bg-surface-container-high rounded-primary p-6 flex flex-col md:flex-row md:items-center gap-4 border border-blue-secondary hover:border-blue-primary transition-all duration-300 cursor-pointer hover:scale-101 group-hover/3:blur-[1px] hover:!blur-none">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0">
                <Blocks className="size-10 mb-3 text-blue-900" />
              </div>
              <div>
                <h4 className="font-bold text-blue-900">shadcn/ui</h4>
                <p className=" text-slate-600">Componentes de UI accesibles y personalizables.</p>
              </div>
            </div>


            <div className="md:col-span-4 bg-blue-secondary/40 border border-blue-secondary rounded-primary p-6 flex flex-col md:flex-row md:items-center gap-4 hover:border-blue-primary transition-all duration-300 cursor-pointer hover:scale-101 group-hover/3:blur-[1px] hover:!blur-none">
              <Code className="size-10 mb-3 text-blue-900" />
              <div>
                <h4 className="font-bold text-blue-900">TypeScript</h4>
                <p className=" text-slate-600">Tipado estático para un código robusto y mantenible.</p>
              </div>
            </div>

            <div className="md:col-span-4 bg-blue-secondary/40 border border-blue-secondary rounded-primary p-6 flex flex-col md:flex-row md:items-center gap-4 hover:border-blue-primary transition-all duration-300 cursor-pointer hover:scale-101 group-hover/3:blur-[1px] hover:!blur-none">
              <Database className="size-10 mb-3 text-blue-900" />
              <div>
                <h4 className="font-bold text-blue-900">SQL en MariaDB</h4>
                <p className=" text-slate-600">Gestión relacional de datos estudiantiles y registros.</p>
              </div>
            </div>

            <div className="md:col-span-4 bg-blue-secondary/40 border border-blue-secondary rounded-primary p-6 flex flex-col md:flex-row md:items-center gap-4 hover:border-blue-primary transition-all duration-300 cursor-pointer hover:scale-101 group-hover/3:blur-[1px] hover:!blur-none">
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
          <h3 className="font-extrabold text-4xl text-blue-900">
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


      <div className="bg-white w-full" id="5">

        <section className="max-w-350 mx-auto py-15 px-6">

          <div className="col-span-full mb-15 flex">
            <div>
              <p className="text-primary font-bold text-sm tracking-widest uppercase mb-2">Responsive design</p>
              <h2 className="text-4xl font-extrabold text-blue-900">Desktop & Mobile</h2>
            </div>
          </div>

          <ToggleResponsiveDesing />

        </section>

      </div >



      <footer className="bg-white">

        <div className="w-full max-w-450 mx-auto px-4 py-10 flex flex-col md:flex-row gap-5 justify-between items-center">

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

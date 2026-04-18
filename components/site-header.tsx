"use client"

// import { Button } from "@/components/ui/button"
// import { Separator } from "@/components/ui/separator"
// import { SidebarTrigger } from "@/components/ui/sidebar"
// import { UserInfo } from "./user"
// import { PageTitle } from "./header"
// import axios from "axios"
// import { useEffect, useRef, useState } from "react"
// import { formatFullName } from "@/lib/hooks/format-full-name"
// import { ArrowBigRightDash, ArrowDownRight, Inbox, Sparkles } from "lucide-react"
// import { Badge } from "./ui/badge"
// import { BorderBeam } from "./ui/border-beam"
// import { AuroraText } from "./ui/aurora-text"
// import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
// import { IconArrowBarToRight, IconArrowNarrowUp, IconEdit } from "@tabler/icons-react"
// import { Textarea } from "./ui/textarea"

// export function SiteHeader() {

//   //GET PROFILE

//   const [user, setUser] = useState({
//     firstName: '',
//     lastName: '',
//     role: '',
//     username: ''
//   })

//   const getProfile = async () => {
//     try {
//       const response = await axios.get('/api/profile');
//       console.log(response.data);
//       setUser(response.data)
//       console.log(user)
//     } catch (error: any) {
//       console.error(error.response?.data);
//     }
//   };

//   useEffect(() => {
//     getProfile();
//   }, []);






//   // Chatbot

//   // 1. Estado para la lista de mensajes
//   const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
//   // 2. Estado para el texto que se está escribiendo
//   const [input, setInput] = useState("");

//   // 1. Añade esta función para la nueva conversación
//   const handleNewChat = () => setMessages([]);


//   //AUTO SCROLL

//   const scrollRef = useRef<HTMLDivElement>(null);
//   const textareaRef = useRef<HTMLTextAreaElement>(null);

//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   useEffect(() => {
//     const textarea = textareaRef.current;
//     if (textarea) {
//       textarea.style.height = "auto"; // Reset para recalcular
//       textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`; // Máximo 200px
//     }
//   }, [input]);

//   //ENVIAR MENSAJES
//   const handleSendMessage = () => {
//     if (!input.trim()) return;
//     const newMessages = [...messages, { role: 'user' as const, content: input }];
//     setMessages(newMessages);
//     setInput("");

//     // Resetear altura manual tras enviar
//     if (textareaRef.current) textareaRef.current.style.height = "auto";
//   };

//   return (
//     <header className="sticky top-0 z-50 w-full bg-white-primary flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
//       <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
//         <SidebarTrigger className="-ml-1" />
//         <Separator
//           orientation="vertical"
//           className="mx-2 data-[orientation=vertical]:h-10"
//         />
//         <PageTitle
//           title={`Bienvenido, ${user.role} ${user.firstName}`}
//           description={`Panel de ${user.role}`}
//         />
//         <div className="ml-auto flex items-center gap-5">
//           {/* <UserInfo
//             name={`${user.firstName} ${user.lastName}`}
//             username={`${user.firstName} ${user.lastName}`}
//             role={user.role}
//           /> */}

//           <Sheet modal={false}>
//             <SheetTrigger asChild>
//               <div className="relative overflow-hidden border-0 hover:bg-transparent rounded-full py-3 px-8 cursor-pointer font-semibold">
//                 <AuroraText>Preguntar</AuroraText>
//                 <BorderBeam
//                   size={225}
//                   initialOffset={20}
//                   borderWidth={2}
//                   className="from-transparent via-[#FF0080] to-[#38bdf8]"
//                 />
//               </div>
//             </SheetTrigger>

//             <SheetContent
//               className="shadow-2xl border-l border-slate-100 p-0 flex flex-col w-[400px] sm:w-[540px] [&>button]:hidden" // [&>button]:hidden elimina la X nativa
//               side="right"
//               showCloseButton={false}
//               onPointerDownOutside={(e) => e.preventDefault()}
//               onInteractOutside={(e) => e.preventDefault()}
//               onEscapeKeyDown={(e) => e.preventDefault()}
//             >
//               <SheetHeader className="p-6 pb-2 border-b border-slate-50">
//                 <SheetTitle className="sr-only">Chat</SheetTitle>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <Badge variant="outline" className="font-medium text-slate-500">Asistente</Badge>
//                     {/* BOTÓN NUEVA CONVERSACIÓN */}
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={handleNewChat}
//                       className="text-xs text-slate-400 hover:text-[#FF0080] flex gap-1"
//                     >
//                       <IconEdit className="size-4" />
//                       Nueva
//                     </Button>
//                   </div>

//                   <SheetClose asChild>
//                     <Button variant="ghost" size="icon" className="text-slate-400">
//                       <IconArrowBarToRight className="size-5" />
//                     </Button>
//                   </SheetClose>
//                 </div>
//               </SheetHeader>

//               {/* ÁREA DE CHAT CON SCROLL MINIMALISTA */}
//               <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
//                 {messages.length === 0 ? (
//                   <div className="h-full flex flex-col justify-center space-y-4 text-center animate-in fade-in duration-500">
//                     <h2 className="text-4xl font-bold tracking-tight">
//                       ¡Hola <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF0080] to-[#38bdf8]">
//                         {user.firstName.split(' ')[0].toUpperCase()}
//                       </span>!
//                     </h2>
//                     <p className="text-slate-500">¿En qué puedo ayudarte hoy?</p>
//                   </div>
//                 ) : (
//                   messages.map((msg, index) => (
//                     <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
//                       <div className={`
//             max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed
//             ${msg.role === 'user'
//                           ? 'bg-black text-white rounded-tr-none shadow-md'
//                           : 'bg-slate-100 text-slate-800 rounded-tl-none'
//                         }
//             break-words whitespace-pre-wrap overflow-hidden // FIX PARA TEXTOS LARGOS
//           `}>
//                         {msg.content}
//                       </div>
//                       <div ref={scrollRef} />
//                     </div>
//                   ))
//                 )}
//               </div>

//               {/* INPUT */}
//               <div className="p-6 bg-white border-t border-slate-100">
//                 <div className="relative group">
//                   <Textarea
//                     ref={textareaRef} // ASIGNAR REF
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     onKeyDown={(e) => {
//                       if (e.key === 'Enter' && !e.shiftKey) {
//                         e.preventDefault();
//                         handleSendMessage();
//                       }
//                     }}
//                     className="min-h-[100px] w-full resize-none border-slate-100 bg-slate-50/50 p-4 pr-12 rounded-2xl transition-all focus:bg-white focus:ring-1 focus:ring-[#38bdf8]"
//                     placeholder="Escribe tu pregunta..."
//                   />
//                   <div className="absolute bottom-3 right-3">
//                     <Button
//                       onClick={handleSendMessage}
//                       disabled={!input.trim()}
//                       size="icon"
//                       className="rounded-xl bg-black hover:bg-slate-800 transition-all active:scale-90"
//                     >
//                       <ArrowBigRightDash className="size-5" />
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </SheetContent>

//           </Sheet>




//           <div className="relative">
//             <div className="bg-red-primary absolute top-0 right-0 rounded-full size-3">

//             </div>
//             <Button type="button" className="p-2" variant="outline">
//               <Inbox className="size-7" />
//             </Button>
//           </div>
//         </div>
//       </div>
//     </header>
//   )
// }







import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { PageTitle } from "./header"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { ArrowBigRightDash, Inbox } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { BorderBeam } from "@/components/ui/border-beam"
import { AuroraText } from "@/components/ui/aurora-text"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { IconArrowBarToRight, IconEdit, IconLoader2 } from "@tabler/icons-react"
import { Textarea } from "@/components/ui/textarea"
import { ai, CHAT_MODEL } from "@/lib/gemini"
import { getPageContext } from "@/lib/context"
import ReactMarkdown from "react-markdown"

export function SiteHeader() {
  // GET PROFILE
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    role: '',
    username: ''
  })

  const getProfile = async () => {
    try {
      const response = await axios.get('/api/profile');
      setUser(response.data)
    } catch (error: any) {
      console.error(error.response?.data);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  // CHATBOT
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleNewChat = () => setMessages([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const context = getPageContext();
      const systemPrompt = `Eres un asistente inteligente llamado 'LUMEN' para un panel de administración. 
Contexto de la página actual: "${context}".
Información del usuario: ${user.firstName} ${user.lastName} (${user.role}).
Responde a las preguntas del usuario considerando este contexto. Sé breve, profesional y útil.`;

      const history = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      // In real scenario we might use chat history, but for simplicity here we'll just send everything
      const result = await ai.models.generateContent({
        model: CHAT_MODEL,
        contents: [
          ...history,
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: systemPrompt,
        }
      });

      const responseText = result.text || "Lo siento, no pude procesar tu solicitud.";
      setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Hubo un error al conectar con la inteligencia artificial." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 flex h-22 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 h-8" />
        <PageTitle
          title={`Bienvenido, ${user.role} ${user.firstName}`}
          description={`Panel de ${user.role}`}
        />
        <div className="ml-auto flex items-center gap-5">
          <Sheet modal={false}>
            <SheetTrigger asChild>
              {/* <div className="relative overflow-hidden border-0 hover:bg-slate-50 transition-colors rounded-full py-2 px-6 cursor-pointer font-semibold shadow-sm">
                <AuroraText>Preguntar IA</AuroraText>
                <BorderBeam
                  size={150}
                  initialOffset={0}
                  borderWidth={1.5}
                  className="from-transparent via-[#FF0080] to-[#38bdf8]"
                />
              </div> */}
              <div className="relative overflow-hidden border-0 hover:bg-transparent rounded-full py-3 px-8 cursor-pointer font-semibold">
                <AuroraText>Preguntar AI</AuroraText>
                <BorderBeam
                  size={250}
                  initialOffset={20}
                  borderWidth={2}
                  className="from-transparent via-[#FF0080] to-[#38bdf8]"
                />
              </div>
            </SheetTrigger>

            <SheetContent
              className="chat-sheet shadow-2xl border-l border-slate-100 p-0 flex flex-col w-[400px] sm:w-[500px] [&>button]:hidden"
              side="right"
            >
              {/* <SheetHeader className="p-4 border-b border-slate-50 flex flex-row items-center justify-between space-y-0">
                <SheetTitle className="sr-only">Chat con Asistente</SheetTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-medium text-slate-500 bg-slate-50">IA Asistente</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNewChat}
                    className="text-xs text-slate-400 hover:text-[#FF0080] flex gap-1 h-8"
                  >
                    <IconEdit className="size-3.5" />
                    Nueva
                  </Button>
                </div>

                <SheetClose asChild>
                  <Button variant="ghost" size="icon" className="text-slate-400 h-8 w-8">
                    <IconArrowBarToRight className="size-4.5" />
                  </Button>
                </SheetClose>
              </SheetHeader> */}

              <SheetHeader className="p-6 pb-2 border-b border-slate-50">
                <SheetTitle className="sr-only">Chat</SheetTitle>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-medium text-slate-500 text-[11px]">Asistente</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleNewChat}
                      className="text-slate-400 hover:text-[#FF0080] flex gap-1"
                    >
                      <IconEdit className="size-7" />
                      Nueva
                    </Button>
                  </div>

                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="text-slate-400">
                      <IconArrowBarToRight className="size-7" />
                    </Button>
                  </SheetClose>
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-hide">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col justify-center space-y-4 text-center">
                    <div className="mx-auto size-25 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                      <AuroraText className="text-5xl font-bold">AI</AuroraText>
                    </div>
                    <h2 className="text-5xl font-bold tracking-tight">
                      ¡Hola <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF0080] to-[#38bdf8]">
                        {user.firstName ? user.firstName.split(' ')[0].toUpperCase() : 'USER'}
                      </span>!
                    </h2>
                    <p className="text-black-secondary font-medium text-[11px] max-w-[250px] mx-auto">
                      Soy tu asistente inteligente. Conozco el contenido de esta página y puedo ayudarte con tus dudas.
                    </p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`
                        max-w-[85%] p-3.5 rounded-2xl text-[13px] leading-relaxed
                        ${msg.role === 'user'
                          ? 'bg-black text-white shadow-sm'
                          : 'bg-slate-100 text-slate-800'
                        }
                        break-words whitespace-pre-wrap
                      `}>
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-50 p-3 rounded-2xl flex items-center gap-2">
                      <IconLoader2 className="size-4 animate-spin text-slate-400" />
                      <span className="text-[12px] text-slate-400 font-medium">Pensando...</span>
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>

              {/* <div className="p-4 bg-white border-t border-slate-100">
                <div className="relative">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    disabled={isLoading}
                    className="min-h-[60px] max-h-[200px] w-full resize-none border-slate-200 bg-slate-50/50 p-3 pr-12 rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-[#38bdf8] transition-all"
                    placeholder="Escribe tu pregunta..."
                  />
                  <div className="absolute bottom-2.5 right-2.5">
                    <Button
                      onClick={handleSendMessage}
                      disabled={!input.trim() || isLoading}
                      size="icon"
                      className="size-8 rounded-lg bg-black hover:bg-slate-800"
                    >
                      <ArrowBigRightDash className="size-4" />
                    </Button>
                  </div>
                </div>
              </div> */}

              <div className="p-6 bg-white border-t border-slate-100">
                <div className="relative group">
                  <Textarea
                    ref={textareaRef}  //ASIGNAR REF
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="min-h-[100px] w-full resize-none bg-slate-50/50 p-4 pr-12 rounded-2xl transition-all focus:bg-white focus:ring-1 focus:ring-[#38bdf8]"
                    placeholder="Escribe tu pregunta..."
                  />
                  <div className="absolute bottom-3 right-3">
                    <Button
                      onClick={handleSendMessage}
                      disabled={!input.trim()}
                      size="icon"
                      className="rounded-xl bg-black hover:bg-slate-800 transition-all active:scale-90"
                    >
                      <ArrowBigRightDash className="size-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="relative">
            <div className="bg-red-primary absolute top-0 right-0 rounded-full size-3"></div>
            <Button type="button" className="p-2" variant="outline">
              <Inbox className="size-7" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

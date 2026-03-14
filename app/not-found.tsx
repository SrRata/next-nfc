import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404",
};


export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground mt-2">
        La página que buscas no existe.
      </p>
    </div>
  );
}
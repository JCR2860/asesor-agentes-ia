import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6 pb-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white mb-2">Lex<span className="text-blue-500">IA</span></h1>
          <p className="text-neutral-500 font-medium tracking-tight">Apertura de Expediente Profesional</p>
        </div>
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: "bg-blue-600 hover:bg-blue-500 transition-all text-sm font-bold",
              card: "bg-neutral-950 border border-neutral-800 shadow-2xl",
              headerTitle: "text-white",
              headerSubtitle: "text-neutral-500",
              socialButtonsBlockButton: "bg-neutral-900 border-neutral-800 text-white hover:bg-neutral-800",
              formFieldLabel: "text-neutral-400 font-medium",
              formFieldInput: "bg-neutral-900 border-neutral-800 text-white",
              footerActionText: "text-neutral-500",
              footerActionLink: "text-blue-400 hover:text-blue-300"
            }
          }}
          routing="path" 
          path="/sign-up" 
          signInUrl="/sign-in"
        />
      </div>
    </div>
  );
}

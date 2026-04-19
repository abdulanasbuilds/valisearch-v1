import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/useUserStore";

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useUserStore();

  const handleStart = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="max-w-md w-full p-8 border border-white/10 rounded-2xl bg-white/[0.02]">
        <h1 className="text-3xl font-bold mb-4">Welcome to ValiSearch!</h1>
        <p className="text-muted-foreground mb-6">
          You have 15 free idea validations. Let's validate your first startup idea.
        </p>
        <button
          onClick={handleStart}
          className="w-full py-3 px-6 bg-primary text-white font-semibold rounded-xl text-base hover:bg-primary/90 transition-colors"
        >
          Start validating →
        </button>
      </div>
    </div>
  );
}
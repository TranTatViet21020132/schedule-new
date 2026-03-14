"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-hidden flex items-center justify-center">
      {/* Animated background blobs */}
      <div className="fixed inset-0 -z-10">
        <style>{`
          @keyframes float1 {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-30px) translateX(20px); }
          }
          @keyframes float2 {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(20px) translateX(-30px); }
          }
          @keyframes float3 {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-25px) translateX(-25px); }
          }
          .blob1 {
            position: absolute;
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, rgba(147, 112, 219, 0.4), transparent);
            border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
            filter: blur(40px);
            animation: float1 8s ease-in-out infinite;
            top: -100px;
            left: -100px;
          }
          .blob2 {
            position: absolute;
            width: 350px;
            height: 350px;
            background: radial-gradient(circle, rgba(59, 130, 246, 0.4), transparent);
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
            filter: blur(40px);
            animation: float2 10s ease-in-out infinite;
            bottom: -100px;
            right: -100px;
          }
          .blob3 {
            position: absolute;
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(34, 197, 94, 0.3), transparent);
            border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
            filter: blur(40px);
            animation: float3 12s ease-in-out infinite;
            top: 50%;
            right: 10%;
          }
          .gradient-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, transparent 0%, rgba(15, 23, 42, 0.3) 100%);
            pointer-events: none;
          }
        `}</style>
        <div className="blob1"></div>
        <div className="blob2"></div>
        <div className="blob3"></div>
        <div className="gradient-overlay"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Lịch Trình Đi Chơi
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-2">
            Plan your adventures with style
          </p>
        </div>

        <p className="text-muted-foreground mb-12 max-w-md mx-auto">
          Create beautiful timelines for your events, trips, and special
          moments. Share your journey with friends and family.
        </p>

        <button
          onClick={() => router.push("/timeline")}
          className="px-8 py-4 bg-linear-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
        >
          Get Started
        </button>

        <div className="mt-16 text-sm text-muted-foreground">
          <p>✨ Create • 📸 Organize • 🎯 Share</p>
        </div>
      </div>
    </main>
  );
}

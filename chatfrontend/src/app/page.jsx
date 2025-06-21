'use client';
import Navbar from "@/components/Navbar";
import React, { useEffect } from "react";
import Link from "next/link";
import AuthChecker from "../../middleware";
import AlertBubble from "@/components/ui/Bubbles";


export default function Page() {


  AuthChecker()

  


  return (
    <div className="w-full min-h-screen bg-white">
      <Navbar />
      <AlertBubble />
      <section id="home" className="w-full min-h-screen bg-gray-100">
        <div className="w-full min-h-screen bg-white relative overflow-hidden rounded-none ">

          {/* 🌈 Blobs */}
          <div className="absolute  w-[250px] h-[250px] md:w-[400px] md:h-[400px] rounded-full bg-purple-500 opacity-30 blur-3xl top-[-100px] left-[-100px] animate-pulse z-0"></div>
          <div className="absolute w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full bg-pink-400 opacity-25 blur-2xl top-[200px] right-[20px] md:right-[50px] animate-[float_5s_ease-in-out_infinite]
 z-0"></div>
          <div className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-blue-300 opacity-20 blur-[80px] md:blur-[100px] bottom-[-150px] left-[-100px] animate-[float_10s_ease-in-out_infinite] z-0"></div>

          {/* 🔥 Hero Content */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-screen px-5 md:px-10 py-20">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold font-poppins text-gray-800 leading-snug">
              Chat Loud. Share Fast. Stay <span className="text-purple-500">Blurby</span>.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-500 max-w-md sm:max-w-xl">
              Blurby is the modern way to chat and share media with your circle — fast, fun, and free.
            </p>
            <Link href="/auth/signup">
              <button className="mt-6 px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-all cursor-pointer text-sm sm:text-base">
                🚀 Start Chatting
              </button></Link>
          </div>

        </div>
      </section>
    </div>
  );
}

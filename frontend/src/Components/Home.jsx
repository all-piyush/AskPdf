import React from "react";
import {
  Upload,
  FileText,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Brain,
  Search,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleUploadClick = () => {
    navigate("/auth");
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen bg-[#F5FAFD] text-[#080B63]">

      <header className="h-[84px] bg-white border-b border-[#D8EDF4]">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#080B63] flex items-center justify-center">
              <FileText size={25} className="text-white" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-[#080B63]">
                AskPDF
              </h1>
              <p className="text-xs text-slate-400">
                AI Document Assistant
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-10 text-sm font-medium">

            <button
              onClick={() => scrollToSection("home")}
              className="text-[#0077B6] hover:text-[#080B63]  cursor-pointer transition"
            >
              Home
            </button>

            <button
              onClick={() => scrollToSection("features")}
              className="text-slate-600 hover:text-[#080B63] cursor-pointer transition"
            >
              Features
            </button>

            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-slate-600 hover:text-[#080B63] cursor-pointer transition"
            >
              How it works
            </button>

            <button
              onClick={() => scrollToSection("contact")}
              className="text-slate-600 hover:text-[#080B63] cursor-pointer transition"
            >
              Contact
            </button>

          </nav>

          <div className="flex items-center gap-3">
            <button
              className="px-5 py-2.5 rounded-xl cursor-pointer border border-[#0077B6] text-[#0077B6] hover:bg-[#EAF8FC] transition font-medium"
              onClick={() => navigate("/auth")}
            >
              Login
            </button>

            <button
              className="px-5 py-2.5 rounded-xl bg-[#080B63] cursor-pointer text-white hover:bg-[#11158A] transition font-medium"
              onClick={() => navigate("/auth")}
            >
              Signup
            </button>
          </div>

        </div>
      </header>

      <main>

        <section
          id="home"
          className="relative overflow-hidden"
        >

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-[#BFEAF5]/40 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-20">

            <div className="max-w-4xl mx-auto text-center">

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#B9E3EF] bg-white text-[#0077B6] text-sm mb-8 shadow-sm">
                <Sparkles size={16} />
                Powered by AI & RAG
              </div>

              <h2 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight text-[#080B63]">
                Talk to your
                <span className="block text-[#0077B6]">
                  documents.
                </span>
              </h2>

              <p className="mt-6 text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                Upload your PDF and let AskPDF understand it.
                Ask questions, find information, and get accurate
                answers from your documents in seconds.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">

                <button
                  onClick={handleUploadClick}
                  className="group flex items-center cursor-pointer justify-center gap-3 px-7 py-4 rounded-2xl bg-[#080B63] hover:bg-[#11158A] text-white transition font-semibold shadow-lg shadow-[#080B63]/20"
                >
                  <Upload size={20} />
                  Upload a PDF
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition"
                  />
                </button>

                <button className="px-7 py-4 cursor-pointer rounded-2xl border border-[#C8E6EF] bg-white hover:bg-[#F0FAFD] transition font-semibold text-[#080B63]">
                  Try Demo
                </button>

              </div>
            </div>

            <div className="max-w-4xl mx-auto mt-16">

              <div className="rounded-3xl border border-[#C8E6EF] bg-white p-3 shadow-xl shadow-[#0077B6]/5">

                <div className="rounded-2xl border-2 border-dashed border-[#B9DDE8] hover:border-[#0077B6] transition p-12 md:p-20 text-center">

                  <div className="mx-auto w-16 h-16 rounded-2xl bg-[#DDF5FB] flex items-center justify-center mb-6">
                    <Upload
                      className="text-[#0077B6]"
                      size={30}
                    />
                  </div>

                  <h3 className="text-xl font-semibold text-[#080B63]">
                    Drop your PDF here
                  </h3>

                  <p className="text-slate-400 mt-2">
                    or click to browse from your device
                  </p>

                  <button
                    onClick={handleUploadClick}
                    className="mt-6 px-6 cursor-pointer py-3 rounded-xl bg-[#080B63] hover:bg-[#11158A] text-white transition text-sm font-medium"
                  >
                    Choose PDF
                  </button>

                  <p className="mt-5 text-xs text-slate-400">
                    Supported format: PDF
                  </p>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E7F7FB] flex items-center justify-center">
                      <ShieldCheck
                        size={20}
                        className="text-[#0077B6]"
                      />
                    </div>

                    <div>
                      <p className="font-semibold text-sm text-[#080B63]">
                        Secure Documents
                      </p>
                      <p className="text-xs text-slate-400">
                        Your documents stay protected
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E7F7FB] flex items-center justify-center">
                      <Zap
                        size={20}
                        className="text-[#0077B6]"
                      />
                    </div>

                    <div>
                      <p className="font-semibold text-sm text-[#080B63]">
                        Fast Responses
                      </p>
                      <p className="text-xs text-slate-400">
                        Get answers in seconds
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E7F7FB] flex items-center justify-center">
                      <Brain
                        size={20}
                        className="text-[#0077B6]"
                      />
                    </div>

                    <div>
                      <p className="font-semibold text-sm text-[#080B63]">
                        AI Powered
                      </p>
                      <p className="text-xs text-slate-400">
                        Understand your documents
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </section>

        <section
          id="features"
          className="py-24 bg-white border-y border-[#D8EDF4]"
        >

          <div className="max-w-7xl mx-auto px-6">

            <div className="text-center mb-14">

              <p className="text-[#0077B6] font-semibold text-sm mb-3">
                POWERFUL FEATURES
              </p>

              <h2 className="text-4xl font-bold text-[#080B63]">
                Everything you need to understand PDFs
              </h2>

              <p className="mt-4 text-slate-500 max-w-xl mx-auto">
                Ask questions, summarize documents, find information,
                and analyze your PDFs with AI.
              </p>

            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

              <div className="p-6 rounded-2xl border border-[#D8EDF4] bg-[#F8FCFE] hover:shadow-lg hover:-translate-y-1 transition">

                <div className="w-12 h-12 rounded-xl bg-[#DDF5FB] flex items-center justify-center mb-5">
                  <MessageSquare
                    className="text-[#0077B6]"
                    size={23}
                  />
                </div>

                <h3 className="font-bold text-[#080B63]">
                  Ask Anything
                </h3>

                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  Ask questions in natural language and get answers
                  based on your PDF.
                </p>

              </div>

              <div className="p-6 rounded-2xl border border-[#D8EDF4] bg-[#F8FCFE] hover:shadow-lg hover:-translate-y-1 transition">

                <div className="w-12 h-12 rounded-xl bg-[#DDF5FB] flex items-center justify-center mb-5">
                  <FileText
                    className="text-[#0077B6]"
                    size={23}
                  />
                </div>

                <h3 className="font-bold text-[#080B63]">
                  Smart Summaries
                </h3>

                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  Turn long documents into concise summaries
                  and important points.
                </p>

              </div>

              <div className="p-6 rounded-2xl border border-[#D8EDF4] bg-[#F8FCFE] hover:shadow-lg hover:-translate-y-1 transition">

                <div className="w-12 h-12 rounded-xl bg-[#DDF5FB] flex items-center justify-center mb-5">
                  <Search
                    className="text-[#0077B6]"
                    size={23}
                  />
                </div>

                <h3 className="font-bold text-[#080B63]">
                  Find Information
                </h3>

                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  Quickly locate specific facts, numbers,
                  dates, and details.
                </p>

              </div>

              <div className="p-6 rounded-2xl border border-[#D8EDF4] bg-[#F8FCFE] hover:shadow-lg hover:-translate-y-1 transition">

                <div className="w-12 h-12 rounded-xl bg-[#DDF5FB] flex items-center justify-center mb-5">
                  <BarChart3
                    className="text-[#0077B6]"
                    size={23}
                  />
                </div>

                <h3 className="font-bold text-[#080B63]">
                  Analyze & Compare
                </h3>

                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  Compare information and discover patterns
                  across your documents.
                </p>

              </div>

            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="py-24 bg-[#F5FAFD]"
        >

          <div className="max-w-6xl mx-auto px-6">

            <div className="text-center mb-16">

              <p className="text-[#0077B6] font-semibold text-sm mb-3">
                SIMPLE PROCESS
              </p>

              <h2 className="text-4xl font-bold text-[#080B63]">
                How AskPDF works
              </h2>

            </div>

            <div className="grid md:grid-cols-4 gap-8">

              {[
                {
                  icon: Upload,
                  title: "Upload PDF",
                  text: "Upload your document securely."
                },
                {
                  icon: Brain,
                  title: "AI Processing",
                  text: "AskPDF reads and understands your document."
                },
                {
                  icon: MessageSquare,
                  title: "Ask Questions",
                  text: "Ask anything about your document."
                },
                {
                  icon: Sparkles,
                  title: "Get Answers",
                  text: "Receive accurate contextual answers."
                }
              ].map((step, index) => {

                const Icon = step.icon;

                return (
                  <div
                    key={step.title}
                    className="text-center relative"
                  >

                    <div className="mx-auto w-16 h-16 rounded-full bg-white border border-[#BFE3ED] shadow-sm flex items-center justify-center">
                      <Icon
                        size={25}
                        className="text-[#0077B6]"
                      />
                    </div>

                    <div className="mt-5">

                      <span className="text-xs font-semibold text-[#0077B6]">
                        STEP {index + 1}
                      </span>

                      <h3 className="font-bold text-[#080B63] mt-1">
                        {step.title}
                      </h3>

                      <p className="text-sm text-slate-500 mt-2">
                        {step.text}
                      </p>

                    </div>

                  </div>
                );
              })}

            </div>
          </div>
        </section>

        <section className="py-20 bg-white">

          <div className="max-w-5xl mx-auto px-6">

            <div className="rounded-3xl bg-[#080B63] px-8 py-16 text-center relative overflow-hidden">

              <div className="absolute w-72 h-72 bg-[#0077B6]/30 blur-[100px] rounded-full top-0 left-1/2 -translate-x-1/2" />

              <div className="relative">

                <h2 className="text-4xl font-bold text-white">
                  Start talking to your documents
                </h2>

                <p className="mt-4 text-blue-100 max-w-xl mx-auto">
                  Upload a PDF and start getting answers in seconds.
                </p>

                <button
                  onClick={handleUploadClick}
                  className="mt-8 inline-flex cursor-pointer items-center gap-3 px-7 py-4 rounded-2xl bg-white text-[#080B63] font-semibold hover:bg-[#EAF8FC] transition"
                >
                  <Upload size={19} />
                  Upload a PDF
                  <ArrowRight size={18} />
                </button>

              </div>
            </div>

          </div>
        </section>

      </main>

      <footer
        id="contact"
        className="bg-white border-t border-[#D8EDF4]"
      >

        <div className="max-w-7xl mx-auto px-6 py-14">

          <div className="grid md:grid-cols-4 gap-10">

            <div>

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-[#080B63] flex items-center justify-center">
                  <FileText size={20} className="text-white" />
                </div>

                <div>
                  <h3 className="font-bold text-[#080B63]">
                    AskPDF
                  </h3>

                  <p className="text-xs text-slate-400">
                    AI Document Assistant
                  </p>
                </div>

              </div>

              <p className="text-sm text-slate-500 mt-4 max-w-xs">
                Understand your documents faster with AI-powered
                document conversations.
              </p>

            </div>

            <div>

              <h4 className="font-bold text-[#080B63] mb-4">
                Product
              </h4>

              <div className="space-y-3 text-sm text-slate-500">

                <a
                  href="#features"
                  className="block hover:text-[#0077B6]"
                >
                  Features
                </a>

                <a
                  href="#how-it-works"
                  className="block hover:text-[#0077B6]"
                >
                  How it works
                </a>

                <a
                  href="/dashboard"
                  className="block hover:text-[#0077B6]"
                >
                  Dashboard
                </a>

              </div>

            </div>

            <div>

              <h4 className="font-bold text-[#080B63] mb-4">
                Company
              </h4>

              <div className="space-y-3 text-sm text-slate-500">

                <a
                  href="#"
                  className="block hover:text-[#0077B6]"
                >
                  About
                </a>

                <a
                  href="#contact"
                  className="block hover:text-[#0077B6]"
                >
                  Contact
                </a>

                <a
                  href="#"
                  className="block hover:text-[#0077B6]"
                >
                  Privacy
                </a>

              </div>

            </div>

            <div>

              <h4 className="font-bold text-[#080B63] mb-4">
                Get Started
              </h4>

              <p className="text-sm text-slate-500 mb-4">
                Upload your first PDF and start exploring.
              </p>

              <button  onClick={handleUploadClick} className="px-5 py-2.5 rounded-xl bg-[#080B63] text-white text-sm cursor-pointer font-medium hover:bg-[#11158A] transition">
                Get Started
              </button>

            </div>

          </div>

          

        </div>

      </footer>

    </div>
  );
};

export default Home;

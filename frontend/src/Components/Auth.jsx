import React, { useState } from "react";
import { FileText, Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Auth = ({ setloggedin, setuser }) => {
  const url = import.meta.env.VITE_APP_URL;
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setloading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setloading(true);

    try {
      const authurl = isLogin ? `${url}/api/v1/login` : `${url}/api/v1/register`;

      const body = isLogin ? { email: formData.email, password: formData.password } : { name: formData.name, email: formData.email, password: formData.password };

      const response = await fetch(authurl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      console.log("Success:", data);

      if (isLogin) {
        setuser(data.user);
        setloggedin(true);
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.success("Account created successfully!");

        setIsLogin(true);

        setFormData({
          name: "",
          email: "",
          password: ""
        });
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setloading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: "",
      email: "",
      password: ""
    });
  };

  return (
    <div className="min-h-screen bg-[#F4FAFF] flex">
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden bg-[#03045E] text-white flex-col justify-between p-12">
        <div className="absolute -top-40 -right-40 w-[550px] h-[550px] rounded-full bg-[#023E8A] opacity-60 blur-3xl" />
        <div className="absolute -bottom-48 -left-32 w-[500px] h-[500px] rounded-full bg-[#0077B6] opacity-30 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
            <FileText size={23} />
          </div>
          <div>
            <h1 className="text-xl font-bold">AskPDF</h1>
            <p className="text-xs text-blue-200">AI Document Assistant</p>
          </div>
        </div>

        <div className="relative max-w-xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-[#90E0EF] text-sm">
            <Sparkles size={15} />
            AI-powered document intelligence
          </div>

          <h2 className="mt-7 text-5xl xl:text-6xl font-bold leading-tight">
            Your documents.
            <span className="block text-[#90E0EF]">Your answers.</span>
          </h2>

          <p className="mt-6 text-lg text-blue-100/70 leading-relaxed">
            Upload your PDFs, ask questions, and let AskPDF find the information you need using AI-powered document search.
          </p>

          <div className="mt-10 p-5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#90E0EF]/20 flex items-center justify-center">
                <FileText size={19} className="text-[#90E0EF]" />
              </div>
              <div>
                <p className="text-sm font-medium">Ask questions about your PDF</p>
                <p className="text-xs text-blue-200/60 mt-1">Retrieve relevant information instantly</p>
              </div>
            </div>
          </div>
        </div>

        <p className="relative text-xs text-blue-200/50">© 2026 AskPDF. All rights reserved.</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="flex lg:hidden items-center justify-center gap-3 mb-10">
            <div className="w-11 h-11 rounded-xl bg-[#03045E] flex items-center justify-center">
              <FileText size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#03045E]">AskPDF</h1>
              <p className="text-xs text-slate-400">AI Document Assistant</p>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#03045E]">{isLogin ? "Welcome back" : "Create your account"}</h1>
            <p className="mt-2 text-sm text-slate-500">{isLogin ? "Sign in to continue to AskPDF" : "Start chatting with your documents"}</p>
          </div>

          <div className="mt-8 bg-white rounded-3xl border border-[#D8EDF4] shadow-xl shadow-blue-100/40 p-7">
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-[#173B63] mb-2">Full Name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" required className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#CFE5EF] bg-[#F8FCFF] outline-none text-sm text-[#03045E] placeholder:text-slate-400 focus:border-[#0077B6] focus:ring-4 focus:ring-[#90E0EF]/30 transition" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#173B63] mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#CFE5EF] bg-[#F8FCFF] outline-none text-sm text-[#03045E] placeholder:text-slate-400 focus:border-[#0077B6] focus:ring-4 focus:ring-[#90E0EF]/30 transition" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-[#173B63]">Password</label>
                  {isLogin && (
                    <button type="button" className="text-xs font-medium text-[#0077B6] hover:text-[#03045E]">Forgot password?</button>
                  )}
                </div>

                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required className="w-full pl-11 pr-12 py-3 rounded-xl border border-[#CFE5EF] bg-[#F8FCFF] outline-none text-sm text-[#03045E] placeholder:text-slate-400 focus:border-[#0077B6] focus:ring-4 focus:ring-[#90E0EF]/30 transition" />

                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#03045E]">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="remember" className="w-4 h-4 accent-[#03045E]" />
                  <label htmlFor="remember" className="text-xs text-slate-500">Remember me</label>
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#03045E] text-white font-semibold hover:bg-[#023E8A] transition shadow-lg shadow-[#03045E]/20 disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-[#D8EDF4]" />
              <span className="text-xs text-slate-400">OR</span>
              <div className="flex-1 h-px bg-[#D8EDF4]" />
            </div>

            <button type="button" className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl border border-[#CFE5EF] bg-white text-sm font-medium text-[#173B63] hover:bg-[#F4FAFF] transition">
              <span className="font-bold text-lg">G</span>
              Continue with Google
            </button>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-slate-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button type="button" onClick={switchMode} className="ml-1 font-semibold text-[#0077B6] hover:text-[#03045E] transition">
                {isLogin ? "Create one" : "Sign in"}
              </button>
            </p>
          </div>

          {!isLogin && (
            <p className="text-center text-[11px] text-slate-400 mt-5 leading-relaxed">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
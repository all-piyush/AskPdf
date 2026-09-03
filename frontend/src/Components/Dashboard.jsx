import React, { useEffect, useState } from "react";
import { FileText, MessageSquare, Plus, Search, Send, Paperclip, Menu, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Dashboard = (props) => {
  const url = import.meta.env.VITE_APP_URL;
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [files, setfiles] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { chats, setchats, user } = props;
  const navigate = useNavigate();
  const filteredChats = chats?.filter((chat) =>
    chat.title?.toLowerCase().includes(search.toLowerCase()) ||
    chat.preview?.toLowerCase().includes(search.toLowerCase())
  ) || [];


  const handleSend = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      toast.error("Please Attach Files To Proceed")
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      files.forEach((file) => {
        formData.append("documents", file);
      });

      const response = await fetch(
        `${url}/api/v1/add-document/null`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await response.json();


      if (!response.ok) {
        throw new Error(
          data.message || "Failed to upload documents"
        );
      }
      setchats((prev) => [
        data.chat,
        ...prev
      ]);
      setChatId(data.chat._id);
      const fileNames = files.map((file) => ({
  fileName: file.name
}));


      setfiles([]);
      setMessage("");
      navigate(`/chat/${data.chat._id}`, {
        state: {
          question: message,
          files: fileNames,
          messageId: data.messageid,
        }
      });

    } catch (error) {

      toast.error(error);

    } finally {

      setLoading(false);

    }
  };
  const handleLogout = async () => {

    const logoutPromise = fetch(`${url}/api/v1/logout`, {
      method: "POST",
      credentials: "include",
    }).then(async (response) => {
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      navigate("/");
      return response.json();
    });


    setLogoutLoading(true);
    toast.promise(logoutPromise, {
      loading: "Logging out...",
      success: "Logged out successfully!",
      error: "Logout failed",
    });
    setLogoutLoading(false)
  };

  return (
    <div className="h-screen bg-[#F4FAFF] flex overflow-hidden">

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={` fixed md:static inset-y-0 left-0 z-50 w-[300px] flex flex-col bg-white border-r border-[#D8EDF4] transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} `}>


        <div className="h-[72px] px-5 flex items-center gap-3 border-b border-[#D8EDF4]">

          <div className="w-10 h-10 rounded-xl bg-[#03045E] flex items-center justify-center">
            <FileText size={20} className="text-white" />
          </div>

          <div>
            <h1 className="font-bold text-[#03045E]">
              AskPDF
            </h1>

            <p className="text-[11px] text-slate-400">
              AI Document Assistant
            </p>
          </div>

        </div>



        <div className="p-4">

          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#F4FAFF] border border-[#D8EDF4]">

            <Search size={16} className="text-slate-400" />

            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search chats..." className="w-full bg-transparent outline-none text-sm placeholder:text-slate-400" />

          </div>

        </div>


        <div className="flex-1 overflow-y-auto px-3">

          <p className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Recent Chats
          </p>

          <div className="space-y-1">

            {filteredChats && filteredChats.map((chat) => (

              <button
                key={chat.id}
                onClick={() => navigate(`/chat/${chat._id}`)}
                className={`w-full text-left p-3 rounded-xl cursor-pointer transition group ${selectedChat?.id === chat.id ? "bg-[#EAF7FC] border border-[#CAF0F8]" : "hover:bg-[#F4FAFF]"}`}
              >

                <div className="flex items-start gap-3">

                  <MessageSquare
                    size={17}
                    className={`mt-0.5 flex-shrink-0 ${selectedChat?.id === chat.id ? "text-[#0077B6]" : "text-slate-400"}`}
                  />

                  <div className="min-w-0 flex-1">

                    <div className="flex justify-between gap-2">

                      <p className="text-sm font-medium text-[#03045E] truncate">
                        {chat.title}
                      </p>

                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {chat.time}
                      </span>

                    </div>

                    <p className="text-xs text-slate-400 truncate mt-1">
                      {chat.preview}
                    </p>

                  </div>

                </div>

              </button>

            ))}

          </div>

        </div>


        <div className="p-4 border-t border-[#D8EDF4]">

          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-full bg-[#03045E] text-white flex items-center justify-center font-semibold text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="flex-1 min-w-0">

              <p className="text-sm font-semibold text-[#03045E]">
                {user?.name || "User"}
              </p>

              <p className="text-xs text-slate-400">
                Free Account
              </p>


            </div>
            <button disabled={logoutLoading} onClick={handleLogout} className="px-3 py-2  font-medium text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"> {logoutLoading ? (<div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />) : ("Logout")}</button>

          </div>

        </div>

      </aside>


      <main className="flex-1 flex flex-col min-w-0">


        <header className="h-[72px] bg-white border-b border-[#D8EDF4] flex items-center justify-between px-5 md:px-8">

          <div className="flex items-center gap-3">

            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg hover:bg-[#F4FAFF] cursor-pointer"><Menu size={22} /></button>

            {selectedChat ? (

              <div className="cursor-pointer">

                <h2 className="font-semibold text-[#03045E]">
                  {selectedChat.title}
                </h2>

                <p className="text-xs text-slate-400">
                  Document conversation
                </p>

              </div>

            ) : (

              <div>

                <h2 className="font-semibold text-[#03045E]">
                  New Chat
                </h2>

                <p className="text-xs text-slate-400">
                  Ask anything about your documents
                </p>

              </div>

            )}

          </div>

          <button className="p-2 rounded-lg hover:bg-[#F4FAFF] text-slate-400">
            <MoreVertical size={19} />
          </button>

        </header>


        <div className="flex-1 overflow-y-auto">

          {!selectedChat ? (


            <div className="h-full flex items-center justify-center px-6">

              <div className="w-full max-w-2xl text-center">


                <div className="w-20 h-20 mx-auto rounded-3xl bg-[#CAF0F8] flex items-center justify-center">

                  <FileText size={34} className="text-[#0077B6]" />

                </div>

                <h1 className="mt-7 text-3xl md:text-4xl font-bold text-[#03045E]">
                  What would you like to know?
                </h1>

                <p className="mt-3 text-slate-500">
                  Upload a PDF and start a conversation with your document.
                </p>


                <form>

                  <div className="mt-10 bg-white border border-[#BDE4EF] rounded-2xl shadow-lg shadow-blue-100/40 p-3">
                    {files.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#F4FAFF] border border-[#D8EDF4] w-max">
                            <FileText size={16} className="text-[#0077B6] flex-shrink-0" />
                            <span className="text-xs text-slate-600 truncate flex-1">
                              {file.name}
                            </span>
                            <button type="button" onClick={() => setfiles(files.filter((_, i) => i !== index))} className="text-xs text-slate-400 hover:text-red-500">
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Ask something about your document..."
                      rows={2}
                      className="w-full resize-none outline-none px-3 py-2 text-sm text-[#03045E] placeholder:text-slate-400"
                    />

                    <div className="flex items-center justify-between mt-2">

                      <label className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-[#0077B6] bg-[#EAF7FC] hover:bg-[#CAF0F8] transition cursor-pointer">

                        <Paperclip size={15} />

                        Upload PDF

                        <input
                          type="file"
                          accept="application/pdf"
                          multiple
                          hidden
                          onChange={(e) => setfiles(Array.from(e.target.files))}
                        />

                      </label>

                      <button
                        onClick={handleSend}
                        disabled={loading}
                        className="w-10 h-10 rounded-xl bg-[#03045E] text-white flex items-center cursor-pointer justify-center hover:bg-[#023E8A] transition"
                      >
                        {loading ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Send size={17} />)}
                      </button>

                    </div>

                  </div>

                </form>




              </div>

            </div>

          ) : (



            <div className="max-w-4xl mx-auto px-6 py-8">


              <div className="flex justify-end mb-8">

                <div className="max-w-xl bg-[#03045E] text-white px-5 py-3 rounded-2xl rounded-br-md text-sm">
                  {selectedChat.preview}
                </div>

              </div>


              <div className="flex items-start gap-3 mb-8">

                <div className="w-9 h-9 rounded-xl bg-[#CAF0F8] flex items-center justify-center flex-shrink-0">

                  <FileText size={17} className="text-[#0077B6]" />

                </div>

                <div className="max-w-2xl">

                  <p className="text-sm font-semibold text-[#03045E] mb-2">
                    AskPDF
                  </p>

                  <div className="bg-white border border-[#D8EDF4] rounded-2xl rounded-tl-md px-5 py-4 text-sm text-slate-600 leading-relaxed shadow-sm">

                    Based on the relevant sections of your document, I found information related to your question.

                    <br />
                    <br />

                    The document indicates that the main findings are based on the retrieved context from the uploaded PDF.

                  </div>


                  <div className="mt-3 flex gap-2">

                    <span className="px-3 py-1.5 rounded-lg bg-[#EAF7FC] text-xs text-[#0077B6]">
                      Source: Page 4
                    </span>

                    <span className="px-3 py-1.5 rounded-lg bg-[#EAF7FC] text-xs text-[#0077B6]">
                      Source: Page 7
                    </span>

                  </div>

                </div>

              </div>

            </div>

          )}

        </div>


        {selectedChat && (

          <div className="border-t border-[#D8EDF4] bg-white px-5 md:px-8 py-4">

            <div className="max-w-4xl mx-auto">

              <div className="flex items-end gap-3 bg-[#F4FAFF] border border-[#BDE4EF] rounded-2xl p-2 focus-within:border-[#0077B6] transition">

                <button className="w-10 h-10 rounded-xl flex items-center justify-center text-[#0077B6] hover:bg-[#DFF5FA]">
                  <Paperclip size={18} />
                </button>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask a follow-up question..."
                  rows={1}
                  className="flex-1 resize-none bg-transparent outline-none text-sm text-[#03045E] py-2.5 placeholder:text-slate-400"
                />

                <button
                  onClick={handleSend}
                  className="w-10 h-10 rounded-xl bg-[#03045E] text-white flex items-center justify-center hover:bg-[#023E8A] transition"
                >
                  <Send size={17} />
                </button>

              </div>

              <p className="text-center text-[10px] text-slate-400 mt-2">
                AskPDF can make mistakes. Check important information.
              </p>

            </div>

          </div>

        )}

      </main>

    </div>
  );
};

const Suggestion = ({ text }) => {
  return (
    <button className="px-4 py-2 rounded-full bg-white border border-[#D8EDF4] text-xs text-slate-500 hover:border-[#90E0EF] hover:text-[#0077B6] transition">
      {text}
    </button>
  );
};

export default Dashboard;
import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  FileText,
  Send,
  Paperclip
} from "lucide-react";

const ChatPage = (props) => {
  const url = import.meta.env.VITE_APP_URL;
  const { chats, setchats } = props;
  const { chatId } = useParams();

  const [processingStatus, setProcessingStatus] = useState(null);
  const hasAskedRef = useRef(false);

  const waitUntilReady = async (chatId, maxAttempts = 20, intervalMs = 1000) => {
    for (let i = 0; i < maxAttempts; i++) {
      const res = await fetch(`${url}/api/v1/chat-status/${chatId}`, {
        credentials: "include"
      });
      const data = await res.json();

      if (data.status === "ready") {
        await new Promise((resolve) => setTimeout(resolve, 4000));
        return "ready";
      }
      if (data.status === "failed") return "failed";

      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
    return "timeout";
  };
  const location = useLocation();

  const [message, setMessage] = useState(
    location.state?.question || ""
  );

  const [messageId, setMessageId] = useState(location.state?.messageId || "");
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);

  const handleAddPdf = async (filesToUpload) => {
    if (filesToUpload.length === 0) return;

    const formData = new FormData();
    filesToUpload.forEach((file) => {
      formData.append("documents", file);
    });
    if (chatId) {
      formData.append("chatId", chatId);
    }

    const uploadResponse = await fetch(`${url}/api/v1/add-document/${chatId}`, {
      method: "POST",
      credentials: "include",
      body: formData
    });

    const uploadData = await uploadResponse.json();

    if (!uploadResponse.ok) {
      throw new Error(uploadData.message || "Failed to upload documents");
    }
    const newDocumentIds = uploadData.data.map(
      (document) => document._id
    );
    setMessageId(uploadData.data.messageid);
    return uploadData;
  };

  const handleAskQuestion = async (question) => {
    if (!question.trim()) return;
    if (!chatId) {
      throw new Error("Chat ID is required to ask a question.");
    }

    const response = await fetch(`${url}/api/v1/ask-question/${chatId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ question, messageId })
    });

    const data = await response.json();
    setMessageId("");
    if (!response.ok) {
      throw new Error(data.message || "Failed to get answer");
    }

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: data.answer,
        sources: data.sources || []
      }
    ]);
  };

  const handleSend = async (question) => {
    if (!question.trim() && files.length === 0) {
      console.log(true);
      return;
    }

    try {
      setLoading(true);
      const currentQuestion = question;

      if (currentQuestion.trim()) {
        setMessages((prev) => [
          ...prev,
          {
            role: "user",
            content: currentQuestion,
            files: files.map((file) => ({ fileName: file.name }))
          }
        ]);
      }

      setMessage("");

      if (files.length > 0) {
        await handleAddPdf(files);
        setFiles([]);
      }
      console.log("D", messageId);
      if (currentQuestion.trim()) {
        await handleAskQuestion(currentQuestion);
      }
    } catch (error) {
      console.error("Send error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.question && chatId && !hasAskedRef.current) {
      hasAskedRef.current = true;
      const question = location.state.question;

      setMessages((prev) => [
        ...prev,
        { role: "user", content: question, files: location.state?.files || [] }
      ]);
      setMessage("");
      setLoading(true);
      setProcessingStatus("processing");

      (async () => {
        const result = await waitUntilReady(chatId);
        setProcessingStatus(result);

        if (result !== "ready") {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                result === "failed"
                  ? "Document processing failed. Please try re-uploading."
                  : "This is taking longer than expected. Please try asking again in a moment."
            }
          ]);
          setLoading(false);
          return;
        }

        try {
          await handleAskQuestion(question);
        } catch (error) {
          console.error("Send error:", error);
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: "Something went wrong. Please try again." }
          ]);
        } finally {
          setLoading(false);
        }
      })();

      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [chatId]);
  const fetchMessages = async () => {
    if (chatId && location.state?.question) {
      return;
    }
    if (!chatId) return;

    try {
      setLoading(true);

      const response = await fetch(
        `${url}/api/v1/messages/${chatId}`,
        {
          method: "GET",
          credentials: "include"
        }
      );

      const data = await response.json();
      console.log("data", data.messages);
      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch messages"
        );
      }
      setMessages(data.messages || []);

    } catch (error) {

      console.error(
        "Fetch messages error:",
        error
      );

      setMessages([]);

    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (chatId) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [chatId]);
  return (
    <div className="h-screen flex flex-col bg-[#F4FAFF]">


      <header className="h-[72px] bg-white border-b border-[#D8EDF4] flex items-center px-8">

        <div className="flex items-center gap-3 h-12 6">

          <div className="w-10 h-10 rounded-xl bg-[#03045E] flex items-center justify-center">

            <FileText
              size={20}
              className="text-white"
            />

          </div>

          <div>

            <h1 className="font-bold text-[#03045E]">
              AskPDF
            </h1>

            <p className="text-xs text-slate-400">
              Document conversation
            </p>

          </div>

        </div>

      </header>



      <div className="flex-1 overflow-y-auto">

        <div className="max-w-4xl mx-auto px-6 py-8">

          {messages.map((msg, index) => (

            <div
              key={index}
              className={
                msg.role === "user"
                  ? "flex justify-end mb-8"
                  : "flex items-start gap-3 mb-8"
              }
            >

              {msg.role === "assistant" && (

                <div className="w-9 h-9 rounded-xl bg-[#CAF0F8] flex items-center justify-center">

                  <FileText
                    size={17}
                    className="text-[#0077B6]"
                  />

                </div>

              )}


              <div className="max-w-2xl">

                {msg.role === "assistant" && (

                  <p className="text-sm font-semibold text-[#03045E] mb-2">
                    AskPDF
                  </p>

                )}


                <div
                  className={
                    msg.role === "user"
                      ? "bg-[#03045E] text-white px-5 py-3 rounded-2xl rounded-br-md text-sm"
                      : "bg-white border border-[#D8EDF4] rounded-2xl rounded-tl-md px-5 py-4 text-sm text-slate-600 leading-relaxed shadow-sm"
                  }
                >
                  {msg.role === "user" && msg.files?.length > 0 && (
                    <div className="flex justify-end mb-2 gap-2 flex-wrap">
                      {msg.files.map((file, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-[#D8EDF4] text-xs text-slate-600"
                        >
                          <FileText
                            size={14}
                            className="text-[#0077B6]"
                          />

                          <span>{file.fileName}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>


                {msg.role === "assistant" &&
                  msg.sources?.length > 0 && (

                    <div className="mt-3 flex gap-2 flex-wrap">

                      {msg.sources.map(
                        (source, i) => (

                          <span
                            key={i}
                            className="px-3 py-1.5 rounded-lg bg-[#EAF7FC] text-xs text-[#0077B6]"
                          >
                            Source: Chunk{" "}
                            {source.chunkIndex}
                          </span>

                        )
                      )}

                    </div>

                  )}

              </div>

            </div>

          ))}



          {loading && (

            <div className="flex items-start gap-3 mb-8">

              <div className="w-9 h-9 rounded-xl bg-[#CAF0F8] flex items-center justify-center">

                <FileText
                  size={17}
                  className="text-[#0077B6]"
                />

              </div>

              <div>

                <p className="text-sm font-semibold text-[#03045E] mb-2">
                  AskPDF
                </p>

                <div className="bg-white border border-[#D8EDF4] rounded-2xl rounded-tl-md px-5 py-4 shadow-sm">

                  <div className="flex gap-1">

                    <div className="w-2 h-2 rounded-full bg-[#0077B6] animate-bounce" />

                    <div className="w-2 h-2 rounded-full bg-[#0077B6] animate-bounce [animation-delay:150ms]" />

                    <div className="w-2 h-2 rounded-full bg-[#0077B6] animate-bounce [animation-delay:300ms]" />

                  </div>

                </div>

              </div>

            </div>

          )}

        </div>

      </div>



      <div className="border-t border-[#D8EDF4] bg-white px-5 py-4">

        <div className="max-w-4xl mx-auto">

          <div className="relative flex items-end gap-3 bg-[#F4FAFF] border border-[#BDE4EF] rounded-2xl p-2">

            <label className="w-10 h-10 rounded-xl flex items-center justify-center text-[#0077B6] hover:bg-[#DFF5FA] transition cursor-pointer">

              <Paperclip size={18} />

              <input type="file" accept="application/pdf" multiple hidden onChange={(e) => setFiles(Array.from(e.target.files))} />
            </label>

            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#F4FAFF] border border-[#D8EDF4] w-max">
                    <FileText size={16} className="text-[#0077B6] flex-shrink-0" />
                    <span className="text-xs text-slate-600 truncate flex-1">
                      {file.name}
                    </span>
                    <button type="button" onClick={() => setFiles(files.filter((_, i) => i !== index))} className="text-xs text-slate-400 hover:text-red-500">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <textarea
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder="Ask a follow-up question..."
              rows={1}
              className="flex-1 resize-none bg-transparent outline-none text-sm text-[#03045E] py-2.5"
            />

            <button onClick={() => { handleSend(message) }} disabled={loading || (!message.trim() && files.length === 0)} className="w-10 h-10 rounded-xl bg-[#03045E] text-white flex items-center justify-center cursor-pointer disabled:opacity-50">

              {loading ? (

                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />

              ) : (

                <Send size={17} />

              )}

            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ChatPage;
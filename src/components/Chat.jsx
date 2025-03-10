import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { createSocketConection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import moment from "moment";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [userName, setUserName] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [userStatus, setUserStatus] = useState("offline");

  const user = useSelector((store) => store.user);
  const userId = user?._id;

  //  Ref for scrolling to the latest message
  const messagesEndRef = useRef(null);

  // Function to scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch target user's details
  const getConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      setUserName(res?.data?.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getConnections();
  }, [targetUserId]);

  const targetUser = userName.find((field) => field?._id === targetUserId);

  // Fetch chat messages
  const fetchChatMessages = async () => {
    try {
      const chat = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
        withCredentials: true,
      });

      setMessages(chat.data.messages);
      scrollToBottom(); //  Scroll after fetching messages
    } catch (err) {
      console.log("Error fetching chat messages:", err);
    }
  };

  useEffect(() => {
    if (!targetUserId) return;
    fetchChatMessages();
  }, [targetUserId]);

  useEffect(() => {
    if (!userId) return;
    
    const socket = createSocketConection();
    socket.emit("joinChat", { firstName: user.firstName, userId, targetUserId });

    socket.on("userOnline", ({ userId: onlineUserId }) => {
      if (onlineUserId === targetUserId) {
        setUserStatus("online");
      }
    });

    socket.on("userOffline", ({ userId: offlineUserId }) => {
      if (offlineUserId === targetUserId) {
        setUserStatus("offline");
      }
    });

    socket.on("messageReceived", ({ firstName, lastName, text, time }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { firstName, lastName, text, time },
      ]);

      scrollToBottom(); //  Scroll when new message arrives
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const socket = createSocketConection();
    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });

    setNewMessage("");
  };

  useEffect(() => {
    scrollToBottom(); //  Scroll when messages update
  }, [messages]);

  if (loading) return <div className="text-center mt-5"><span className="loading loading-ring loading-xs"></span>
  <span className="loading loading-ring loading-sm"></span>
  <span className="loading loading-ring loading-md"></span>
  <span className="loading loading-ring loading-lg"></span>
  <span className="loading loading-ring loading-xl"></span></div>;

  return (
    <div className="w-2/4 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col">
      <h1 className="p-5 border-b border-gray-600 flex items-center justify-between">
        <span>
          {targetUser ? `${targetUser.firstName} ${targetUser.lastName}` : "User"}
        </span>
        <span className={`text-sm ${userStatus === "online" ? "text-green-500" : "text-gray-500"}`}>
          {userStatus === "online" ? "Online" : "Offline"}
        </span>
      </h1>
      <div className="flex-1 overflow-y-auto p-5">  {/*  Make it scrollable */}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              "chat " + (user.firstName === msg.firstName ? "chat-end" : "chat-start")
            }
          >
            <div className="chat-header">
              {`${msg.firstName} ${msg.lastName}`}
              <time className="text-xs opacity-50">
                {moment(msg.time).fromNow()}
              </time>
            </div>
            <div className="chat-bubble">{msg.text}</div>
            <div className="chat-footer opacity-50">Seen</div>
          </div>
        ))}
        {/*  Invisible div to scroll into view */}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="p-5 border-t border-gray-600 flex items-center gap-2">
        <input
          value={newMessage}
          placeholder="Type a message..."
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border border-gray-500 text-white rounded p-2"
        />
        <button onClick={sendMessage} className="btn btn-secondary">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;

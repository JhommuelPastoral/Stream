import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import useAuthUser from "../hooks/useAuthUser.js";
import { getStreamToken } from "../lib/api.js";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Stream Video SDK
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import '@stream-io/video-react-sdk/dist/css/styles.css';

// Stream Chat SDK
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";

export default function CallPage() {
  const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
  const { id: callId } = useParams();
  const [callClient, setCallClient] = useState(null);
  const [call, setCall] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [chatChannel, setChatChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authData } = useAuthUser();
  const navigate = useNavigate();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authData,
  });

  useEffect(() => {
    const initClients = async () => {
      if (!tokenData?.token || !authData || !callId) return;
      try {
        const user = {
          id: authData._id,
          name: authData.fullname,
          image: authData.profilePic,
        };

        // Initialize video client
        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        });
        const callInstance = videoClient.call("default", callId);
              await callInstance.microphone.disable();
      await callInstance.camera.disable();
        await callInstance.join({
          create: true,
          startVideo: false,
          startAudio: false,
        });
        setCallClient(videoClient);
        setCall(callInstance);

        // Initialize chat client
        const chat = StreamChat.getInstance(STREAM_API_KEY);
        await chat.connectUser(user, tokenData.token);
        const channel = chat.channel("messaging", callId, {
          members: [authData._id], // Add others if needed
        });
        await channel.watch();
        setChatClient(chat);
        setChatChannel(channel);
      } catch (error) {
        console.error(error.message);
        toast.error("Error connecting to call or chat");
      } finally {
        setLoading(false);
      }
    };

    initClients();
  }, [tokenData, authData, callId]);

  if (loading || !callClient || !call || !chatClient || !chatChannel) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading call and chat...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Video Call Section */}
      <div className="flex-1 bg-base-200">
        <StreamVideo client={callClient}>
          <StreamCall call={call}>
            <CallContent />
          </StreamCall>
        </StreamVideo>
      </div>

      {/* Chat Section */}
      <div className="w-[400px] bg-base-100 border-l">
        <Chat client={chatClient}>
          <Channel channel={chatChannel}>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput />
            </Window>
          </Channel>
        </Chat>
      </div>
    </div>
  );
}

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      navigate("/");
    }
  }, [callingState, navigate]);

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};

import { useParams } from 'react-router'
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuthUser from '../hooks/useAuthUser.js'
import { getStreamToken } from '../lib/api.js';
import { useCreateChatClient, Chat, Channel, ChannelHeader, MessageInput, MessageList, Thread, Window } from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import toast from 'react-hot-toast';
import ChatLoader from '../components/ChatLoader.jsx';
import CallButton from '../components/CallButton.jsx';
export default function ChatPage() {
  const {id:targetUserId} = useParams();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const {authData} = useAuthUser();
  const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
  const {data:tokenData} = useQuery({
    queryKey: ['streamToken'], 
    queryFn: getStreamToken,
    enabled: !!authData
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authData) return;
      try {
        console.log('Init Chat');
        const client = StreamChat.getInstance(STREAM_API_KEY);
        await client.connectUser({
          id: authData?._id,
          name: authData?.fullname,
          image: authData?.profilePic
        }, tokenData?.token);

        const channelId = [authData._id, targetUserId].sort().join('-');
        const currentChannel = client.channel('messaging', channelId, {
          members: [authData._id, targetUserId]
        });
        await currentChannel.watch();

        setChatClient(client);
        setChannel(currentChannel);
      } catch (error) {
        console.log(error.message);
        toast.error('Error connecting to chat');
      } finally {
        setLoading(false);
      }
    };
    initChat();
  }, [tokenData, authData]);

  if(loading || !chatClient || !channel) return <ChatLoader/>;
  const handleVideoCall = () => {
    const callUrl = `${window.location.origin}/call/${channel.id}`;
    channel.sendMessage({
      text: `I've started a video call. Join me at ${callUrl}`,
    })
    toast.success('Video call started');
  }

  return (
    <div className='flex flex-col mx-auto max-w-[1000px] bg-base-300'>
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className='w-full relative h-[90vh]'>
            <CallButton handleVideoCall={handleVideoCall}/>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput />
            </Window>

          </div>
          <Thread />
        </Channel>
      </Chat>

    </div>
  )
}

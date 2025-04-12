import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, Link } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Send,
  User,
  Store,
  Info,
  MessageCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  businessId: number;
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface Conversation {
  userId: number;
  businessId: number;
  businessName: string;
  lastMessage: Message;
  unreadCount: number;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  avatar: string | null;
}

export default function MessagesPage() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Query to fetch the current user
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['/api/me'],
    retry: 1
  });
  
  // Handle success/error cases for user data
  useEffect(() => {
    if (userData) {
      setCurrentUser(userData as User);
    }
  }, [userData]);
  
  // Handle authentication errors
  useEffect(() => {
    if (!userLoading && !userData) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to access your messages.',
        variant: 'destructive',
      });
      setLocation('/login');
    }
  }, [userLoading, userData, toast, setLocation]);

  // Query to fetch all messages for the current user
  const { data: messagesData, isLoading: messagesLoading } = useQuery({
    queryKey: ['/api/messages'],
    enabled: !!currentUser,
  });

  // Query to fetch conversations between users when a conversation is selected
  const { data: conversationData, isLoading: conversationLoading } = useQuery({
    queryKey: ['/api/messages', selectedConversation?.businessId, selectedConversation?.userId],
    queryFn: () => 
      apiRequest('GET', `/api/messages/${selectedConversation?.businessId}/${selectedConversation?.userId}`),
    enabled: !!selectedConversation
  });
  
  // Handle marking messages as read when a conversation is loaded
  useEffect(() => {
    if (conversationData && selectedConversation && selectedConversation.unreadCount > 0) {
      markConversationAsRead();
    }
  }, [conversationData, selectedConversation]);

  // Mutation to send a new message
  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => {
      if (!selectedConversation) return Promise.reject('No conversation selected');
      return apiRequest('POST', '/api/messages', {
        receiverId: selectedConversation.userId,
        businessId: selectedConversation.businessId,
        content,
      });
    },
    onSuccess: () => {
      // Clear the input field
      setNewMessage('');
      // Invalidate queries to refetch messages
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
      queryClient.invalidateQueries({ 
        queryKey: ['/api/messages', selectedConversation?.businessId, selectedConversation?.userId]
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    },
  });

  // Function to mark messages in a conversation as read
  const markConversationAsRead = async () => {
    if (!selectedConversation) return;

    try {
      // Mark all unread messages in the conversation as read
      const unreadMessages = conversationData?.filter(
        (msg: Message) => !msg.isRead && msg.receiverId === currentUser?.id
      );

      if (unreadMessages?.length) {
        // Create an array of promises to mark each message as read
        const markReadPromises = unreadMessages.map((msg: Message) =>
          apiRequest('PATCH', `/api/messages/${msg.id}/read`)
        );

        // Execute all promises concurrently
        await Promise.all(markReadPromises);

        // Invalidate the queries to refetch data
        queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
        queryClient.invalidateQueries({
          queryKey: ['/api/messages', selectedConversation.businessId, selectedConversation.userId],
        });
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Function to organize messages into conversations
  const getConversations = () => {
    if (!messagesData || !messagesData.length) return [];

    const conversationsMap = new Map<string, Conversation>();

    // Group messages by business and user
    messagesData.forEach((message: Message) => {
      const otherUserId = message.senderId === currentUser?.id ? message.receiverId : message.senderId;
      const key = `${otherUserId}-${message.businessId}`;

      if (!conversationsMap.has(key)) {
        conversationsMap.set(key, {
          userId: otherUserId,
          businessId: message.businessId,
          businessName: 'Business', // This would need to be fetched from the API
          lastMessage: message,
          unreadCount: message.receiverId === currentUser?.id && !message.isRead ? 1 : 0
        });
      } else {
        const conv = conversationsMap.get(key)!;
        // Update last message if this one is newer
        if (new Date(message.createdAt) > new Date(conv.lastMessage.createdAt)) {
          conv.lastMessage = message;
        }
        // Increment unread count if this message is unread and to the current user
        if (message.receiverId === currentUser?.id && !message.isRead) {
          conv.unreadCount += 1;
        }
      }
    });

    // Convert map to array and sort by last message date (newest first)
    return Array.from(conversationsMap.values()).sort((a, b) => 
      new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
    );
  };

  // Handle send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && selectedConversation) {
      sendMessageMutation.mutate(newMessage);
    }
  };

  // Fetch business names for all conversations
  useEffect(() => {
    const conversations = getConversations();
    if (conversations.length > 0) {
      // For each conversation, fetch the business details
      Promise.all(
        conversations.map(conv => 
          apiRequest('GET', `/api/businesses/${conv.businessId}`)
            .then(business => {
              conv.businessName = business.name;
              return conv;
            })
        )
      ).catch(error => {
        console.error('Error fetching business details:', error);
      });
    }
  }, [messagesData]);

  // Loading state
  if (userLoading || (messagesLoading && !messagesData)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Not authenticated state
  if (!currentUser) {
    return (
      <div className="container max-w-4xl mx-auto p-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to access your messages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-6">
              <Button onClick={() => setLocation('/login')}>Go to Login</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const conversations = getConversations();

  return (
    <div className="container max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card className="h-[75vh] flex flex-col">
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="mx-auto h-12 w-12 mb-4 opacity-30" />
                  <p>No conversations yet</p>
                  <p className="text-sm mt-2">Messages from businesses will appear here</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {conversations.map((conv) => (
                    <Card 
                      key={`${conv.userId}-${conv.businessId}`}
                      className={cn(
                        "cursor-pointer hover:bg-accent transition-colors",
                        selectedConversation?.userId === conv.userId && 
                        selectedConversation?.businessId === conv.businessId
                          ? "bg-accent"
                          : ""
                      )}
                      onClick={() => setSelectedConversation(conv)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {conv.userId === currentUser.id ? <Store className="h-5 w-5" /> : <User className="h-5 w-5" />}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-grow">
                            <div className="flex justify-between items-center mb-1">
                              <div className="font-medium">{conv.businessName}</div>
                              <div className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: true })}
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground truncate">
                              {conv.lastMessage.content}
                            </div>
                          </div>
                          {conv.unreadCount > 0 && (
                            <Badge className="ml-2">{conv.unreadCount}</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Conversation View */}
        <div className="lg:col-span-2">
          <Card className="h-[75vh] flex flex-col">
            {selectedConversation ? (
              <>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>{selectedConversation.businessName}</CardTitle>
                    <Link href={`/business/${selectedConversation.businessId}`}>
                      <Button variant="ghost" size="sm">
                        <Info className="mr-2 h-4 w-4" />
                        View Business
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <Separator />
                
                <CardContent className="flex-grow overflow-y-auto pt-4">
                  {conversationLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  ) : conversationData?.length > 0 ? (
                    <div className="space-y-4">
                      {conversationData.map((message: Message) => (
                        <div 
                          key={message.id} 
                          className={cn(
                            "flex",
                            message.senderId === currentUser.id ? "justify-end" : "justify-start"
                          )}
                        >
                          <div 
                            className={cn(
                              "max-w-[75%] rounded-lg p-3",
                              message.senderId === currentUser.id 
                                ? "bg-primary text-primary-foreground" 
                                : "bg-muted"
                            )}
                          >
                            <div className="text-sm mb-1">{message.content}</div>
                            <div className="text-xs opacity-70 text-right">
                              {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                              {message.senderId !== currentUser.id && message.isRead && (
                                <span className="ml-2">✓</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No messages in this conversation</p>
                      <p className="text-sm mt-2">Start the conversation by sending a message</p>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="pt-2">
                  <form onSubmit={handleSendMessage} className="w-full flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-grow"
                    />
                    <Button 
                      type="submit" 
                      disabled={sendMessageMutation.isPending || !newMessage.trim()}
                    >
                      {sendMessageMutation.isPending ? (
                        <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </form>
                </CardFooter>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-center p-4">
                <div>
                  <MessageCircle className="mx-auto h-16 w-16 mb-4 opacity-30" />
                  <CardTitle className="mb-2">No Conversation Selected</CardTitle>
                  <CardDescription>
                    Select a conversation from the list or start a new one from a business page
                  </CardDescription>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
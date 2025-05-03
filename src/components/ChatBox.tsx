import React, { useState, useEffect, useRef, useCallback } from 'react';
import { db, storage, auth } from '../firebase';
import { ref as dbRef, onValue, off, set, push, update, onDisconnect, serverTimestamp, remove, query, orderByChild, limitToLast } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';
import imageCompression from 'browser-image-compression';
import { motion, AnimatePresence } from 'framer-motion';
import { PawPrint, Users, Camera, Send, Trash2, AlertCircle } from 'lucide-react';

interface Message {
  senderId: string;
  text?: string;
  photoURL?: string;
  timestamp: number;
  type: 'text' | 'photo';
  key?: string;
}

interface Presence {
  [uid: string]: {
    email: string | null;
    lastOnline: number;
  };
}

const ChatBox: React.FC = () => {
  const chatId = 'community';
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [userEmails, setUserEmails] = useState<Record<string, string | null>>({});
  const [onlineUsers, setOnlineUsers] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const listenerRef = useRef<boolean>(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

 
  const petTheme = {
    primary: '#6366F1', 
    secondary: '#EC4899', 
    tertiary: '#8B5CF6',
    success: '#10B981', 
    warning: '#F59E0B', 
    error: '#EF4444', 
    light: '#EEF2FF', 
    dark: '#4338CA', 
    neutralLight: '#F9FAFB', 
    neutralDark: '#4B5563', 
  };

  
  const getUserColor = (userId: string): string => {
    const colors = [
      petTheme.primary,
      petTheme.secondary,
      petTheme.tertiary,
      petTheme.success,
      petTheme.warning,
      '#06B6D4',
    ];
    const index = userId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const handleSnapshot = useCallback(
    (snapshot: any) => {
      const data = snapshot.val();
      if (data) {
        const messageList: Message[] = Object.entries(data as Record<string, Message>)
          .map(([key, msg]) => ({ ...msg, key }))
          .sort((a, b) => a.timestamp - b.timestamp);
        setMessages(messageList);
        setHasMore(Object.keys(data).length >= 50);
      } else {
        setMessages([]);
        setHasMore(false);
      }
    },
    []
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state:', user); // Debug
      setCurrentUserId(user ? user.uid : null);
      setCurrentUserEmail(user ? user.email : null);
      if (user && user.uid) {
        setUserEmails((prev) => ({ ...prev, [user.uid]: user.email }));
        const presenceRef = dbRef(db, `presence/${user.uid}`);
        const userPresence = { email: user.email, lastOnline: serverTimestamp() };
        set(presenceRef, userPresence).catch((err) => setError('Failed to set presence: ' + err.message));
        onDisconnect(presenceRef).remove();
      }
      setIsLoadingAuth(false);
    }, (error) => {
      setError('Authentication error: ' + error.message);
      setIsLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const presenceRef = dbRef(db, 'presence');
    const unsubscribe = onValue(presenceRef, (snapshot) => {
      const data = snapshot.val() as Presence | null;
      if (data) {
        setOnlineUsers(Object.keys(data).length);
        Object.entries(data).forEach(([uid, presence]) => {
          setUserEmails((prev) => ({ ...prev, [uid]: presence.email }));
        });
      } else {
        setOnlineUsers(0);
      }
    }, (error) => {
      setError('Failed to fetch online users: ' + error.message);
    });
    return () => off(presenceRef, 'value', unsubscribe);
  }, []);

  useEffect(() => {
    console.log('Fetching messages from:', `chats/${chatId}/messages`); // Debug
    const messagesRef = dbRef(db, `chats/${chatId}/messages`);
    const messagesQuery = query(messagesRef, orderByChild('timestamp'), limitToLast(50));

    if (!listenerRef.current) {
      listenerRef.current = true;
      onValue(messagesQuery, handleSnapshot, (error) => {
        setError('Failed to fetch messages: ' + error.message);
      });
    }

    return () => {
      listenerRef.current = false;
      off(messagesRef, 'value', handleSnapshot);
    };
  }, [chatId, handleSnapshot]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (photo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(photo);
    } else {
      setPhotoPreview(null);
    }
  }, [photo]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUserId) return;
    setError(null);
    try {
      const messageRef = dbRef(db, `chats/${chatId}/messages`);
      const newMessageRef = push(messageRef);
      const messageData: Message = {
        senderId: currentUserId,
        text: newMessage.trim(),
        timestamp: Date.now(),
        type: 'text',
      };
      await set(newMessageRef, messageData);
      await update(dbRef(db, `chats/${chatId}`), {
        lastMessage: newMessage.trim(),
        lastSenderId: currentUserId,
      });
      setNewMessage('');
    } catch (err: any) {
      setError('Failed to send message: ' + err.message);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const file = e.target.files[0];
        if (!file.type.startsWith('image/')) {
          setError('Please select an image file');
          return;
        }
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 800,
        });
        setPhoto(compressedFile);
      } catch (err: any) {
        setError('Failed to compress image: ' + err.message);
      }
    }
  };

  const handleSendPhoto = async () => {
    if (!photo || !currentUserId) {
      setError('No photo selected or user not authenticated');
      return;
    }
    setIsUploading(true);
    setError(null);
    try {
      const storagePath = `chat_photos/${chatId}/${Date.now()}_${photo.name}`;
      const photoRef = storageRef(storage, storagePath);
      const uploadResult = await uploadBytes(photoRef, photo);
      const photoURL = await getDownloadURL(uploadResult.ref);
      const messageRef = dbRef(db, `chats/${chatId}/messages`);
      const newMessageRef = push(messageRef);
      const messageData: Message = {
        senderId: currentUserId,
        photoURL,
        timestamp: Date.now(),
        type: 'photo',
      };
      await set(newMessageRef, messageData);
      await update(dbRef(db, `chats/${chatId}`), {
        lastMessage: '[Photo]',
        lastSenderId: currentUserId,
      });
      setPhoto(null);
      setPhotoPreview(null);
    } catch (err: any) {
      setError(`Failed to send photo: ${err.code || err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteMessage = async (messageKey: string | undefined) => {
    if (!messageKey || !currentUserId) return;
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    setError(null);
    try {
      const messageRef = dbRef(db, `chats/${chatId}/messages/${messageKey}`);
      await remove(messageRef);
    } catch (err: any) {
      setError('Failed to delete message: ' + err.message);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setError('Failed to load photo. It may have been deleted.');
  };

  if (isLoadingAuth) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: petTheme.light }}>
        <div className="text-center p-8 rounded-xl shadow-lg" style={{ backgroundColor: 'white' }}>
          <div className="animate-bounce mb-4">
            <PawPrint size={48} style={{ color: petTheme.primary }} />
          </div>
          <p style={{ color: petTheme.dark, fontWeight: 600 }}>Loading the pet community...</p>
        </div>
      </div>
    );
  }

  if (!currentUserId) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: petTheme.light }}>
        <div className="text-center p-8 rounded-xl shadow-lg" style={{ backgroundColor: 'white' }}>
          <AlertCircle size={48} style={{ color: petTheme.error, margin: '0 auto', marginBottom: '1rem' }} />
          <p style={{ color: petTheme.error, fontWeight: 600 }}>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      backgroundColor: petTheme.light, 
      backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%236366F1" fill-opacity="0.05" fill-rule="evenodd"%3E%3Ccircle cx="3" cy="3" r="3"/%3E%3Ccircle cx="13" cy="13" r="3"/%3E%3C/g%3E%3C/svg%3E")',
      padding: '2rem',
      minHeight: '100vh',
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        borderRadius: '1.5rem', 
        overflow: 'hidden', 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        background: 'white',
      }}>
        <div style={{ 
          background: `linear-gradient(135deg, ${petTheme.primary} 0%, ${petTheme.secondary} 100%)`,
          padding: '1.5rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <PawPrint size={32} />
            <h2 style={{ 
              fontSize: '1.75rem', 
              fontWeight: 'bold', 
              margin: 0,
            }}>Pet Pals Community Chat</h2>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '0.5rem', 
            backgroundColor: 'rgba(255, 255, 255, 0.2)', 
            padding: '0.5rem 1rem', 
            borderRadius: '2rem',
          }}>
            <Users size={18} />
            <span style={{ fontWeight: 500 }}>{onlineUsers} pet lovers online</span>
          </div>
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: `linear-gradient(to right, ${petTheme.error}, #F87171)`,
              color: 'white',
              padding: '0.75rem 1.5rem',
              margin: '0.5rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            }}
            role="alert"
          >
            <AlertCircle size={18} />
            <span style={{ fontWeight: 500 }}>{error}</span>
          </motion.div>
        )}
        
        <div style={{ height: '700px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ 
            flex: 1, 
            overflow: 'auto', 
            padding: '1.5rem',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M15 19c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zM7.3 12.1c-.5-.5-1.1-.1-1.1.7 0 1.1-.9 2-2 2-.8 0-1.2.6-.7 1.1l1.5 1.5c.3.3.8.3 1.1 0l1.5-1.5c.5-.5.5-1.3 0-1.8l-.3-.3zM22.7 12.1c.5-.5 1.1-.1 1.1.7 0 1.1.9 2 2 2 .8 0 1.2.6.7 1.1l-1.5 1.5c-.3.3-.8.3-1.1 0l-1.5-1.5c-.5-.5-.5-1.3 0-1.8l.3-.3zM12.1 7.3c-.5-.5-.1-1.1.7-1.1 1.1 0 2-.9 2-2 0-.8.6-1.2 1.1-.7l1.5 1.5c.3.3.3.8 0 1.1l-1.5 1.5c-.5.5-1.3.5-1.8 0l-.3-.3zM12.1 22.7c-.5.5-.1 1.1.7 1.1 1.1 0 2 .9 2 2 0 .8.6 1.2 1.1.7l1.5-1.5c.3-.3.3-.8 0-1.1l-1.5-1.5c-.5-.5-1.3-.5-1.8 0l-.3.3z" fill="%236366F1" fill-opacity="0.03"/%3E%3C/svg%3E")',
          }}>
            {messages.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                marginTop: '3rem', 
                color: petTheme.neutralDark,
                padding: '2rem',
              }}>
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1], 
                    rotate: [0, 5, -5, 0] 
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    repeatType: 'reverse' 
                  }}
                  style={{ margin: '0 auto', width: 'fit-content', marginBottom: '1rem' }}
                >
                  <PawPrint size={64} style={{ color: petTheme.primary, opacity: 0.6 }} />
                </motion.div>
                <p style={{ fontSize: '1.125rem' }}>No messages yet. Start the conversation with your fellow pet lovers!</p>
              </div>
            ) : (
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    style={{ 
                      marginBottom: '1rem', 
                      display: 'flex',
                      justifyContent: msg.senderId === currentUserId ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div style={{ 
                      padding: '1rem',
                      borderRadius: '1rem',
                      maxWidth: '75%', 
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      position: 'relative',
                      ...(msg.senderId === currentUserId ? {
                        background: `linear-gradient(135deg, ${petTheme.primary} 0%, ${petTheme.tertiary} 100%)`,
                        color: 'white',
                        borderBottomRightRadius: '0.25rem',
                      } : {
                        background: 'white',
                        color: petTheme.neutralDark,
                        borderLeft: `4px solid ${getUserColor(msg.senderId)}`,
                        borderBottomLeftRadius: '0.25rem',
                      })
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.25rem'
                      }}>
                        <p style={{
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          margin: 0,
                          color: msg.senderId === currentUserId ? 'white' : getUserColor(msg.senderId)
                        }}>
                          {userEmails[msg.senderId] || 'Unknown User'}
                        </p>
                        {msg.senderId === currentUserId && (
                          <button
                            onClick={() => handleDeleteMessage(msg.key)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: 'rgba(255, 255, 255, 0.7)',
                              padding: '0',
                              display: 'flex',
                              alignItems: 'center',
                              fontSize: '0.75rem',
                              transition: 'color 0.2s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.color = 'white'}
                            onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}
                            title="Delete Message"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      {msg.type === 'text' ? (
                        <>
                          <p style={{ margin: '0.25rem 0 0.5rem 0', fontSize: '1rem' }}>
                            {msg.text}
                          </p>
                          <p style={{ 
                            fontSize: '0.75rem', 
                            opacity: 0.7, 
                            margin: 0,
                          }}>
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </p>
                        </>
                      ) : (
                        <>
                          <div style={{ 
                            position: 'relative', 
                            overflow: 'hidden', 
                            borderRadius: '0.5rem', 
                            marginBottom: '0.5rem',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                          }}>
                            <img
                              src={msg.photoURL}
                              alt="Pet photo"
                              style={{ 
                                maxWidth: '100%', 
                                display: 'block',
                                borderRadius: '0.5rem',
                              }}
                              onError={handleImageError}
                            />
                          </div>
                          <p style={{ 
                            fontSize: '0.75rem', 
                            opacity: 0.7, 
                            margin: 0,
                          }}>
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </p>
                        </>
                      )}
                      
                      
                      <div style={{ 
                        position: 'absolute', 
                        bottom: '-10px', 
                        ...(msg.senderId === currentUserId ? { right: '-5px' } : { left: '-5px' }),
                        transform: 'rotate(30deg)', 
                        opacity: 0.2 
                      }}>
                        <PawPrint size={20} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div style={{ 
            borderTop: `1px solid ${petTheme.light}`, 
            padding: '1.5rem',
            background: petTheme.neutralLight,
          }}>
            {photoPreview && (
              <div style={{ 
                marginBottom: '1rem', 
                position: 'relative',
                display: 'inline-block',
              }}>
                <div style={{
                  position: 'relative',
                  borderRadius: '0.75rem',
                  overflow: 'hidden',
                  maxWidth: '200px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: `3px solid ${petTheme.primary}`,
                }}>
                  <img 
                    src={photoPreview} 
                    alt="Upload preview" 
                    style={{ display: 'block', maxWidth: '100%' }} 
                  />
                  <button 
                    onClick={() => setPhoto(null)} 
                    style={{
                      position: 'absolute',
                      top: '0.25rem',
                      right: '0.25rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: petTheme.error,
                    }}
                  >
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>×</span>
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSendMessage} style={{ marginBottom: '1rem' }}>
              <div style={{ 
                display: 'flex', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                borderRadius: '2rem',
                overflow: 'hidden',
              }}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Write to fellow pet lovers..."
                  style={{ 
                    flex: 1, 
                    padding: '1rem 1.5rem', 
                    border: 'none', 
                    outline: 'none',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                  }}
                  disabled={isUploading}
                />
                <button
                  type="submit"
                  style={{ 
                    background: `linear-gradient(135deg, ${petTheme.primary} 0%, ${petTheme.tertiary} 100%)`,
                    color: 'white',
                    border: 'none',
                    padding: '1rem 2rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease',
                    fontWeight: 600,
                    ...(isUploading ? { opacity: 0.7, cursor: 'not-allowed' } : {})
                  }}
                  disabled={isUploading}
                  onMouseOver={(e) => {
                    if (!isUploading) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isUploading) {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  <Send size={18} />
                  <span>Send</span>
                </button>
              </div>
            </form>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <div style={{
                position: 'relative',
                flex: 1,
              }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  id="photo-upload"
                  style={{ 
                    opacity: 0,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer',
                  }}
                  disabled={isUploading}
                />
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '2rem',
                  border: `2px dashed ${petTheme.tertiary}`,
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  color: petTheme.tertiary,
                  cursor: 'pointer',
                }}>
                  <Camera size={20} style={{ marginRight: '0.5rem' }} />
                  <span>Upload pet photos</span>
                </div>
              </div>
              
              <button
                onClick={handleSendPhoto}
                disabled={!photo || isUploading}
                style={{ 
                  padding: '0.75rem 1.5rem',
                  borderRadius: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  border: 'none',
                  ...(photo && !isUploading ? {
                    background: `linear-gradient(135deg, ${petTheme.secondary} 0%, ${petTheme.tertiary} 100%)`,
                    color: 'white',
                    cursor: 'pointer',
                  } : {
                    background: '#E5E7EB',
                    color: '#9CA3AF',
                    cursor: 'not-allowed',
                  })
                }}
                onMouseOver={(e) => {
                  if (photo && !isUploading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (photo && !isUploading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {isUploading ? (
                  <>
                    <div style={{ 
                      width: '16px', 
                      height: '16px', 
                      border: '2px solid rgba(255,255,255,0.3)', 
                      borderRadius: '50%', 
                      borderTopColor: 'white', 
                      animation: 'spin 1s linear infinite',
                    }} />
                    <style>{`
                     @keyframes spin {
                        to { transform: rotate(360deg); }
                      }
                    `}</style>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <PawPrint size={18} />
                    <span>Share Pet Photo</span>
                  </>
                )}
              </button>
            </div>
            
           
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginTop: '1.5rem', 
              opacity: 0.2 
            }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <PawPrint 
                  key={i} 
                  size={i % 2 === 0 ? 16 : 20} 
                  style={{ 
                    transform: `rotate(${(i * 12) % 60 - 30}deg)`, 
                    color: i % 3 === 0 ? petTheme.primary : i % 3 === 1 ? petTheme.secondary : petTheme.tertiary 
                  }} 
                />
              ))}
            </div>
          </div>
        </div>
        
       
        <div style={{ 
          padding: '1rem', 
          textAlign: 'center', 
          color: 'white',
          background: `linear-gradient(135deg, ${petTheme.dark} 0%, ${petTheme.primary} 100%)`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.875rem',
        }}>
          <PawPrint size={16} />
          <span>Connect with pet lovers from around the world</span>
          <PawPrint size={16} />
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
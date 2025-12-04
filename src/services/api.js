// // قاعدة بيانات وهمية
// const mockDatabase = {
//   chats: [
//     {
//       id: 1,
//       name: 'أحمد محمد',
//       avatar: 'A',
//       lastMessage: 'مرحبا!',
//       lastTime: '10:30 ص',
//       unreadCount: 2,
//       status: 'online',
//       isPinned: true
//     },
//     {
//       id: 2,
//       name: 'سارة علي',
//       avatar: 'S',
//       lastMessage: 'شكراً لك على المساعدة',
//       lastTime: 'أمس',
//       unreadCount: 0,
//       status: 'offline',
//       isPinned: false
//     },
//     {
//       id: 3,
//       name: 'محمد خالد',
//       avatar: 'M',
//       lastMessage: 'هل يمكنك المساعدة في المشروع؟',
//       lastTime: '12/10',
//       unreadCount: 5,
//       status: 'online',
//       isPinned: true
//     },
//     {
//       id: 4,
//       name: 'فاطمة الزهراء',
//       avatar: 'ف',
//       lastMessage: 'أرسلت لك الملفات المطلوبة',
//       lastTime: '11/10',
//       unreadCount: 1,
//       status: 'online',
//       isPinned: false
//     },
//   ],
//   messages: {
//     1: [ // chatId: 1
//       {
//         id: 1,
//         content: 'السلام عليكم!',
//         sender: 'other',
//         senderName: 'أحمد محمد',
//         timestamp: '2024-01-10T09:30:00Z',
//         read: true,
//         type: 'text'
//       },
//       {
//         id: 2,
//         content: 'وعليكم السلام ورحمة الله وبركاته',
//         sender: 'user',
//         senderName: 'أنت',
//         timestamp: '2024-01-10T09:32:00Z',
//         read: true,
//         type: 'text'
//       },
//       {
//         id: 3,
//         content: 'كيف حالك؟',
//         sender: 'other',
//         senderName: 'أحمد محمد',
//         timestamp: '2024-01-10T09:35:00Z',
//         read: false,
//         type: 'text'
//       }
//     ],
//     2: [ // chatId: 2
//       {
//         id: 4,
//         content: 'شكراً جزيلاً لك',
//         sender: 'other',
//         senderName: 'سارة علي',
//         timestamp: '2024-01-09T14:20:00Z',
//         read: true,
//         type: 'text'
//       }
//     ]
//   }
// };

// // محاكاة تأخير الشبكة
// const simulateNetworkDelay = () => 
//   new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));

// // جلب جميع المحادثات
// export const fetchChats = async () => {
//   await simulateNetworkDelay();
//   return [...mockDatabase.chats];
// };

// // جلب رسائل محادثة معينة
// export const fetchMessages = async (chatId) => {
//   await simulateNetworkDelay();
//   return mockDatabase.messages[chatId] || [];
// };

// // إرسال رسالة
// export const sendMessage = async (chatId, content) => {
//   await simulateNetworkDelay();
  
//   const newMessage = {
//     id: Date.now(),
//     content,
//     sender: 'user',
//     senderName: 'أنت',
//     timestamp: new Date().toISOString(),
//     read: false,
//     type: 'text'
//   };
  
//   // إضافة الرسالة للذاكرة المؤقتة
//   if (!mockDatabase.messages[chatId]) {
//     mockDatabase.messages[chatId] = [];
//   }
//   mockDatabase.messages[chatId].push(newMessage);
  
//   // تحديث آخر رسالة في المحادثة
//   const chatIndex = mockDatabase.chats.findIndex(chat => chat.id === chatId);
//   if (chatIndex !== -1) {
//     mockDatabase.chats[chatIndex] = {
//       ...mockDatabase.chats[chatIndex],
//       lastMessage: content,
//       lastTime: 'الآن',
//       unreadCount: 0
//     };
//   }
  
//   return newMessage;
// };

// // تحديث حالة الرسالة كمقروءة
// export const markAsRead = async (chatId, messageId) => {
//   await simulateNetworkDelay();
  
//   if (mockDatabase.messages[chatId]) {
//     const messageIndex = mockDatabase.messages[chatId].findIndex(msg => msg.id === messageId);
//     if (messageIndex !== -1) {
//       mockDatabase.messages[chatId][messageIndex].read = true;
//     }
//   }
  
//   // تحديث عدد الرسائل غير المقروءة
//   const chatIndex = mockDatabase.chats.findIndex(chat => chat.id === chatId);
//   if (chatIndex !== -1) {
//     mockDatabase.chats[chatIndex].unreadCount = 0;
//   }
  
//   return { success: true };
// };

// // إضافة محادثة جديدة
// export const addChat = async (chatData) => {
//   await simulateNetworkDelay();
  
//   const newChat = {
//     id: Date.now(),
//     ...chatData,
//     lastTime: 'الآن',
//     unreadCount: 0
//   };
  
//   mockDatabase.chats.push(newChat);
//   mockDatabase.messages[newChat.id] = [];
  
//   return newChat;
// };

// // تصدير كائن API كامل
// const api = {
//   fetchChats,
//   fetchMessages,
//   sendMessage,
//   markAsRead,
//   addChat
// };

// export default api;
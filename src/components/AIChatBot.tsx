import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, ChefHat, Lightbulb, Star, Image as ImageIcon, Menu, Trash2, MessageSquarePlus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import axiosInstance from '../utils/axiosInstance';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchConversations, deleteConversation } from '../redux/slices/chatSlice';

interface Recipe {
    id: string;
    name: string;
    image?: string;
    time?: number; // Thời gian nấu (phút)
    calories?: number; // Calo
    size?: number; // Số người ăn
    difficulty?: string;
    rating?: number; // Rating từ backend
    numberOfRatings?: number; // Số lượng đánh giá
    cuisine?: string | null; // Quốc gia/ẩm thực
    category?: string | null; // Danh mục
    short?: string; // Mô tả ngắn
}

interface MealPlanDay {
    morning?: {
        recipeId: string;
        recipeName: string;
        recipeImage?: string;
    };
    noon?: {
        recipeId: string;
        recipeName: string;
        recipeImage?: string;
    };
    evening?: {
        recipeId: string;
        recipeName: string;
        recipeImage?: string;
    };
}

interface MealPlan {
    mealPlanType: string;
    duration: number;
    plans: MealPlanDay[]; // Backend trả về plans, không có date
    totalRecipes: number;
}

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    recipes?: Recipe[];
    images?: string[]; // Base64 images
    mealPlan?: MealPlan; // AI-generated meal plan
}

const AIChatBot: React.FC = () => {
    const { language } = useLanguage();
    const { user } = useAppSelector((state) => state.auth);
    const { conversations, loading: chatLoading } = useAppSelector((state) => state.chat);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar chat history
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showTooltip, setShowTooltip] = useState(true);
    const [sessionId, setSessionId] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [chatSize, setChatSize] = useState({ width: 358, height: 552 });
    const [isResizing, setIsResizing] = useState(false);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; sessionId: string | null }>({ isOpen: false, sessionId: null });
    const [isDeleting, setIsDeleting] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Format markdown text to React elements
    const formatMessage = (text: string) => {
        // Split by lines
        const lines = text.split('\n').filter(line => line.trim());

        return lines.map((line, index) => {
            // Handle bullet points (*, -, •)
            if (line.trim().match(/^[\*\-•]\s/)) {
                const content = line.replace(/^[\*\-•]\s/, '');
                return (
                    <div key={index} className="flex items-start gap-2 my-2">
                        <span className="text-orange-500 mt-1">•</span>
                        <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(content) }} />
                    </div>
                );
            }

            // Normal line
            return (
                <div key={index} className="my-1" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />
            );
        });
    };

    // Format inline markdown (bold, italic)
    const formatInlineMarkdown = (text: string): string => {
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');

        text = text.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');

        return text;
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Tooltip animation - hiển thị mỗi 10 giây
    useEffect(() => {
        if (!isOpen) {
            setShowTooltip(true);
            const interval = setInterval(() => {
                setShowTooltip(true);
                setTimeout(() => setShowTooltip(false), 5000); 
            }, 10000); // Lặp lại mỗi 10 giây

            return () => clearInterval(interval);
        }
    }, [isOpen]);

    // Fetch conversations when opening chatbot (only for logged-in users)
    useEffect(() => {
        if (isOpen && user && user._id) {
            dispatch(fetchConversations(user._id));
        }
    }, [isOpen, user, dispatch]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            // Welcome message when first opened
            const welcomeMessage: Message = {
                id: '1',
                text: language === 'vi'
                    ? 'Xin chào! Tôi là Kooka AI Assistant. Tôi có thể giúp bạn tìm công thức, gợi ý món ăn, hoặc trả lời câu hỏi về nấu ăn. Bạn cần hỗ trợ gì?'
                    : 'Hello! I\'m Kooka AI Assistant. I can help you find recipes, suggest meals, or answer cooking questions. How can I help you today?',
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages([welcomeMessage]);
        }
    }, [isOpen, language]);

    const quickSuggestions = language === 'vi' ? [
        'Gợi ý món ăn với gà',
        'Công thức món chay',
        'Món ăn nhanh 15 phút',
        'Món Việt Nam dễ làm'
    ] : [
        'Suggest chicken recipes',
        'Vegetarian recipes',
        'Quick 15-minute meals',
        'Easy Vietnamese dishes'
    ];

    // Initialize session ID
    useEffect(() => {
        if (isOpen && !sessionId) {
            const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            setSessionId(newSessionId);
        }
    }, [isOpen, sessionId]);

    // Send message to backend API
    const sendMessageToAPI = async (userMessage: string, images?: string[]): Promise<{ message: string; recipes: Recipe[]; mealPlan?: MealPlan }> => {
        try {
            setError('');

            const requestBody: {
                message?: string;
                sessionId: string;
                userId: string | null;
                imageBase64?: string;
            } = {
                message: userMessage || undefined,
                sessionId: sessionId,
                userId: user?._id || null
            };

            if (images && images.length > 0) {
                requestBody.imageBase64 = images[0]; 
            }

            const response = await axiosInstance.post('/chatbot/chat', requestBody);

            if (response.data.success) {
                const message = response.data.message || response.data.response || 'Không có phản hồi';

                // Backend trả về structuredData với logic:
                // - recipe: 1 món chi tiết (hiển thị card lớn)
                // - recipes: danh sách nhiều món (hiển thị danh sách clickable cards)
                let recipes: Recipe[] = [];
                let mealPlan: MealPlan | undefined = undefined;

                if (response.data.structuredData) {
                    // Single recipe detail
                    if (response.data.structuredData.recipe) {
                        recipes = [response.data.structuredData.recipe];
                    }
                    // Multiple recipes list - hiển thị dạng clickable cards
                    else if (response.data.structuredData.recipes && response.data.structuredData.recipes.length > 0) {
                        recipes = response.data.structuredData.recipes;
                    }

                    // Handle meal plan data
                    if (response.data.structuredData.generatedMealPlan) {
                        mealPlan = response.data.structuredData.generatedMealPlan;
                    }
                }

                return { message, recipes, mealPlan };
            } else {
                throw new Error(response.data.error || 'Failed to get response');
            }
        } catch (err) {
            const error = err as Error;
            console.error('Error sending message to chatbot:', err);
            setError(error.message || 'An error occurred');

            // Fallback response on error
            const errorMessage = language === 'vi'
                ? 'Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau! 🙏'
                : 'Sorry, I\'m experiencing technical difficulties. Please try again later! 🙏';
            return { message: errorMessage, recipes: [] };
        }
    };

    // Handle file upload
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        // Backend only supports 1 image at a time
        if (selectedImages.length >= 1) {
            toast.error(language === 'vi' ? 'Chỉ có thể gửi 1 ảnh mỗi lần!' : 'Only 1 image allowed per message!');
            e.target.value = '';
            return;
        }

        const file = files[0]; // Only process first file

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error(language === 'vi' ? 'Vui lòng chỉ chọn file ảnh!' : 'Please select image files only!');
            e.target.value = '';
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error(language === 'vi' ? 'Kích thước ảnh không được vượt quá 5MB!' : 'Image size must not exceed 5MB!');
            e.target.value = '';
            return;
        }

        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setSelectedImages([base64]); 
        };
        reader.onerror = () => {
            console.error('Error reading file:', file.name);
            toast.error(language === 'vi' ? 'Lỗi khi đọc file!' : 'Error reading file!');
        };
        reader.readAsDataURL(file);

        // Reset input to allow selecting the same file again
        e.target.value = '';
    };

    // Handle paste image
    const handlePaste = async (e: React.ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        // Backend only supports 1 image at a time
        if (selectedImages.length >= 1) {
            toast.error(language === 'vi' ? 'Chỉ có thể gửi 1 ảnh mỗi lần!' : 'Only 1 image allowed per message!');
            return;
        }

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            if (item.type.startsWith('image/')) {
                e.preventDefault();

                const blob = item.getAsFile();
                if (!blob) continue;

                // Validate file size
                if (blob.size > 5 * 1024 * 1024) {
                    toast.error(language === 'vi' ? 'Kích thước ảnh không được vượt quá 5MB!' : 'Image size must not exceed 5MB!');
                    continue;
                }

                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64 = reader.result as string;
                    setSelectedImages([base64]); 
                };
                reader.readAsDataURL(blob);

                break;
            }
        }
    };

    // Remove image
    const removeImage = () => {
        setSelectedImages([]);
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim() && selectedImages.length === 0) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue || (language === 'vi' ? ' Đã gửi ảnh' : ' Sent images'),
            sender: 'user',
            timestamp: new Date(),
            images: selectedImages.length > 0 ? [...selectedImages] : undefined
        };

        const currentMessage = inputValue;
        const currentImages = [...selectedImages];

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setSelectedImages([]);
        setIsTyping(true);

        try {
            // Call backend API with Gemini AI
            const { message: botResponseText, recipes, mealPlan } = await sendMessageToAPI(currentMessage, currentImages);

            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: botResponseText,
                sender: 'bot',
                timestamp: new Date(),
                recipes: recipes.length > 0 ? recipes : undefined,
                mealPlan: mealPlan
            };
            setMessages(prev => [...prev, botResponse]);

            // Refresh conversations list to show the new/updated conversation (wait for backend to save)
            if (user && user._id) {
                setTimeout(() => {
                    dispatch(fetchConversations(user._id));
                }, 1500);
            }
        } catch (err) {
            console.error('Error getting bot response:', err);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: language === 'vi'
                    ? 'Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại! 🙏'
                    : 'Sorry, I\'m having trouble. Please try again! 🙏',
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleQuickSuggestion = (suggestion: string) => {
        setInputValue(suggestion);
    };

    // Start a new chat
    const handleNewChat = () => {
        const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setSessionId(newSessionId);
        setMessages([{
            id: '1',
            text: language === 'vi'
                ? 'Xin chào! Tôi là Kooka AI Assistant. Tôi có thể giúp bạn tìm công thức, gợi ý món ăn, hoặc trả lời câu hỏi về nấu ăn. Bạn cần hỗ trợ gì?'
                : 'Hello! I\'m Kooka AI Assistant. I can help you find recipes, suggest meals, or answer cooking questions. How can I help you today?',
            sender: 'bot',
            timestamp: new Date()
        }]);
    };

    // Load an existing conversation
    const handleLoadConversation = (conv: any) => {
        setSessionId(conv.sessionId);
        
        // Transform backend messages to frontend format
        const transformedMessages: Message[] = conv.messages.map((msg: any, index: number) => ({
            id: `${conv.sessionId}_${index}`,
            text: msg.content,
            sender: msg.role === 'assistant' ? 'bot' : 'user',
            timestamp: new Date(msg.timestamp),
            recipes: msg.metadata?.recipes,
            images: msg.metadata?.images,
            mealPlan: msg.metadata?.mealPlan
        }));
        
        setMessages(transformedMessages);
    };

    // Open delete confirmation modal
    const handleDeleteConversation = (sessionId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setDeleteModal({ isOpen: true, sessionId });
    };

    // Confirm delete conversation
    const confirmDeleteConversation = async () => {
        if (!deleteModal.sessionId || !user || !user._id) return;
        
        setIsDeleting(true);
        
        try {
            await dispatch(deleteConversation({ sessionId: deleteModal.sessionId, userId: user._id })).unwrap();
            
            // If deleted conversation is current, start new chat
            if (deleteModal.sessionId === sessionId) {
                handleNewChat();
            }
            
            toast.success(language === 'vi' ? ' Đã xóa đoạn chat thành công!' : ' Conversation deleted successfully!');
            setDeleteModal({ isOpen: false, sessionId: null });
        } catch (error) {
            toast.error(language === 'vi' ? '❌ Lỗi khi xóa đoạn chat!' : '❌ Failed to delete conversation!');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Handle resize
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);

        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = chatSize.width;
        const startHeight = chatSize.height;

        const handleMouseMove = (e: MouseEvent) => {
            const deltaX = startX - e.clientX;
            const deltaY = e.clientY - startY;

            const newWidth = Math.max(350, Math.min(800, startWidth + deltaX));
            const newHeight = Math.max(400, Math.min(900, startHeight + deltaY));

            setChatSize({ width: newWidth, height: newHeight });
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <>
            {/* Chat Button */}
            <div className="fixed bottom-6 right-6 z-50">
                {!isOpen && (
                    <div className="relative">
                        <button
                            onClick={() => setIsOpen(true)}
                            className="bg-white rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 group relative overflow-hidden"
                        >
                            <img
                                src="https://res.cloudinary.com/df2amyjzw/image/upload/v1760760986/bot_sc9i1l.webp"
                                alt="AI Chatbot"
                                className="h-12 w-12 object-cover rounded-2xl"
                            />
                        </button>

                        {/* Tooltip with Animation */}
                        {showTooltip && (
                            <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 pointer-events-none">
                                <div className="bg-white text-gray-800 px-3 py-2 rounded-lg text-xs shadow-md border border-gray-300 whitespace-nowrap">
                                    {language === 'vi' ? (
                                        <>Nhấn vào đây để bắt đầu<br />trò chuyện cùng trợ lý ảo!</>
                                    ) : (
                                        <>Click here to start<br />chatting with AI assistant!</>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                )}

                {/* Chat Window */}
                {isOpen && (
                    <div
                        ref={chatRef}
                        className="bg-white rounded-2xl shadow-2xl flex overflow-hidden border border-gray-200 relative"
                        style={{
                            width: `${chatSize.width + (user && isSidebarOpen ? 250 : 0)}px`,
                            height: `${chatSize.height}px`,
                            transition: isResizing ? 'none' : 'all 0.2s ease'
                        }}
                    >
                        {/* Sidebar Chat History - Only for logged-in users */}
                        {user && isSidebarOpen && (
                            <div className="w-[250px] bg-gray-50 border-r border-gray-200 flex flex-col">
                                {/* Sidebar Header */}
                                <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-gray-700">
                                        {language === 'vi' ? 'Lịch sử chat' : 'Chat History'}
                                    </h3>
                                    <button
                                        onClick={() => setIsSidebarOpen(false)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                        title={language === 'vi' ? 'Đóng sidebar' : 'Close sidebar'}
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* New Chat Button */}
                                <div className="p-3 border-b border-gray-200">
                                    <button
                                        onClick={handleNewChat}
                                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
                                    >
                                        <MessageSquarePlus className="h-4 w-4" />
                                        {language === 'vi' ? 'Chat mới' : 'New Chat'}
                                    </button>
                                </div>

                                {/* Conversations List */}
                                <div className="flex-1 overflow-y-auto">
                                    {chatLoading ? (
                                        <div className="p-4 text-center text-gray-500 text-sm">
                                            {language === 'vi' ? 'Đang tải...' : 'Loading...'}
                                        </div>
                                    ) : conversations.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500 text-sm">
                                            {language === 'vi' ? 'Chưa có đoạn chat nào' : 'No conversations yet'}
                                        </div>
                                    ) : (
                                        <div className="space-y-1 p-2">
                                            {conversations.map((conv) => {
                                                const isActive = conv.sessionId === sessionId;
                                                const lastMessage = conv.messages && conv.messages.length > 1 ? conv.messages[1] : null;
                                                const preview = lastMessage && lastMessage.content
                                                    ? lastMessage.content.substring(0, 40) + (lastMessage.content.length > 40 ? '...' : '')
                                                    : (language === 'vi' ? 'Đoạn chat mới' : 'New conversation');

                                                return (
                                                    <div
                                                        key={conv._id}
                                                        onClick={() => handleLoadConversation(conv)}
                                                        className={`p-3 rounded-lg cursor-pointer transition-all duration-200 group relative ${
                                                            isActive
                                                                ? 'bg-blue-100 border border-blue-300'
                                                                : 'hover:bg-gray-100 border border-transparent'
                                                        }`}
                                                    >
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-xs font-medium text-gray-700 line-clamp-1">
                                                                    {preview}
                                                                </p>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    {new Date(conv.updatedAt).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={(e) => handleDeleteConversation(conv.sessionId, e)}
                                                                className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                                title={language === 'vi' ? 'Xóa' : 'Delete'}
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Resize Handle */}
                        <div
                            className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-blue-500/20 z-10 group"
                            onMouseDown={handleMouseDown}
                        >
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-gray-300 group-hover:bg-blue-500 rounded-r transition-colors"></div>
                        </div>

                        {/* Main Chat Area */}
                        <div className="flex-1 flex flex-col">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center justify-between flex-shrink-0">
                                <div className="flex items-center space-x-3">
                                    {/* Toggle Sidebar Button - Only for logged-in users */}
                                    {user && (
                                        <button
                                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                            className="text-white/80 hover:text-white transition-colors duration-200"
                                            title={language === 'vi' ? 'Toggle lịch sử' : 'Toggle history'}
                                        >
                                            <Menu className="h-5 w-5" />
                                        </button>
                                    )}
                                    <div className="bg-white/20 p-2 rounded-full">
                                        <Bot className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Kooka AI</h3>
                                        <p className="text-xs text-white/80">
                                            {language === 'vi' ? 'Trợ lý nấu ăn thông minh' : 'Smart Cooking Assistant'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-white/80 hover:text-white transition-colors duration-200"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                                        }`}>
                                        <div className={`p-2 rounded-full ${message.sender === 'user'
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                                            : 'bg-gradient-to-r from-orange-500 to-red-500'
                                            }`}>
                                            {message.sender === 'user' ? (
                                                <User className="h-4 w-4 text-white" />
                                            ) : (
                                                <ChefHat className="h-4 w-4 text-white" />
                                            )}
                                        </div>
                                        <div className={`p-3 rounded-2xl ${message.sender === 'user'
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {/* Images */}
                                            {message.images && message.images.length > 0 && (
                                                <div className={`grid gap-2 mb-2 ${message.images.length === 1 ? 'grid-cols-1' :
                                                    message.images.length === 2 ? 'grid-cols-2' :
                                                        'grid-cols-2'
                                                    }`}>
                                                    {message.images.map((img, idx) => (
                                                        <div key={idx} className="rounded-lg overflow-hidden">
                                                            <img
                                                                src={img}
                                                                alt={`Uploaded ${idx + 1}`}
                                                                className="w-full h-auto object-cover max-h-32"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="text-sm leading-relaxed">
                                                {message.sender === 'bot' ? (
                                                    <div className="space-y-1">{formatMessage(message.text)}</div>
                                                ) : (
                                                    <p>{message.text}</p>
                                                )}
                                            </div>

                                            {/* Recipe Cards - Horizontal Layout */}
                                            {message.sender === 'bot' && message.recipes && message.recipes.length > 0 && (
                                                <div className="mt-3">
                                                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                                                        {message.recipes.slice(0, 6).map((recipe) => {
                                                            return (
                                                                <div
                                                                    key={recipe.id}
                                                                    onClick={() => {
                                                                        navigate(`/recipe/${recipe.id}`);
                                                                        setIsOpen(false);
                                                                    }}
                                                                    className="bg-white border border-gray-200 rounded-lg p-2 hover:shadow-md hover:border-orange-300 transition-all duration-200 cursor-pointer group flex items-center gap-2"
                                                                >
                                                                    {/* Recipe Image */}
                                                                    <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                                                                        {recipe.image ? (
                                                                            <img
                                                                                src={recipe.image}
                                                                                alt={recipe.name}
                                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                                                                            />
                                                                        ) : (
                                                                            <div className="w-full h-full flex items-center justify-center">
                                                                                <ChefHat className="h-6 w-6 text-gray-400" />
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Recipe Info */}
                                                                    <div className="flex-1 min-w-0">
                                                                        <h4 className="font-semibold text-xs text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1 mb-1">
                                                                            {recipe.name}
                                                                        </h4>

                                                                        {/* Rating only */}
                                                                        {recipe.rating !== undefined && recipe.rating !== null && recipe.rating > 0 && (
                                                                            <div className="flex items-center gap-0.5 text-xs text-gray-600">
                                                                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                                                <span className="font-medium">{recipe.rating.toFixed(1)}</span>
                                                                                {recipe.numberOfRatings && recipe.numberOfRatings > 0 && (
                                                                                    <span className="text-gray-400">({recipe.numberOfRatings})</span>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>

                                                    {/* Show more indicator */}
                                                    {message.recipes.length > 6 && (
                                                        <p className="text-xs text-gray-500 text-center mt-2">
                                                            {language === 'vi'
                                                                ? `Còn ${message.recipes.length - 6} món nữa. Hỏi tôi để xem chi tiết!`
                                                                : `${message.recipes.length - 6} more recipes. Ask me for details!`}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {/* Meal Plan Button - hiển thị khi có AI-generated meal plan */}
                                            {message.sender === 'bot' && message.mealPlan && (
                                                <div className="mt-3">
                                                    <button
                                                        onClick={() => {
                                            // Check if user is logged in
                                            if (!user) {
                                                toast.error(language === 'vi'
                                                    ? 'Vui lòng đăng nhập để sử dụng tính năng này!'
                                                    : 'Please login to use this feature!');
                                                return;
                                            }                                                         
                                                            navigate('/meal-planner', {
                                                                state: {
                                                                    aiGeneratedPlan: message.mealPlan
                                                                }
                                                            });
                                                            setIsOpen(false);
                                                        }}
                                                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-3 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                                                    >
                                                        <ChefHat className="h-4 w-4" />
                                                        <span>
                                                            {language === 'vi' ? '🎉 Xem Meal Plan' : '🎉 View Meal Plan'}
                                                        </span>
                                                    </button>
                                                </div>
                                            )}

                                            <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                                                }`}>
                                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Error Message */}
                            {error && (
                                <div className="flex justify-center">
                                    <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-xs">
                                        {error}
                                    </div>
                                </div>
                            )}

                            {/* Typing Indicator */}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="flex items-start space-x-2">
                                        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-full">
                                            <ChefHat className="h-4 w-4 text-white" />
                                        </div>
                                        <div className="bg-gray-100 p-3 rounded-2xl">
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Quick Suggestions */}
                            {messages.length === 1 && (
                                <div className="space-y-2">
                                    <p className="text-xs text-gray-500 text-center">
                                        {language === 'vi' ? 'Gợi ý nhanh:' : 'Quick suggestions:'}
                                    </p>
                                    <div className="grid grid-cols-1 gap-2">
                                        {quickSuggestions.map((suggestion, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleQuickSuggestion(suggestion)}
                                                className="text-left p-2 bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 rounded-lg text-sm text-gray-700 transition-all duration-200 flex items-center space-x-2"
                                            >
                                                <Lightbulb className="h-4 w-4 text-orange-500" />
                                                <span>{suggestion}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-gray-200 flex-shrink-0">
                            {/* Image Preview */}
                            {selectedImages.length > 0 && (
                                <div className="mb-3 flex flex-wrap gap-2">
                                    {selectedImages.map((img, idx) => (
                                        <div key={idx} className="relative group">
                                            <img
                                                src={img}
                                                alt="Preview"
                                                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                            />
                                            <button
                                                onClick={removeImage}
                                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}

                                </div>
                            )}

                            <div className="flex space-x-2">
                                {/* Hidden file input */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />

                                {/* Image upload button */}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={selectedImages.length >= 1}
                                    className="text-gray-500 hover:text-blue-500 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                                    title={language === 'vi' ? 'Đính kèm ảnh (1 ảnh)' : 'Attach image (1 image)'}
                                >
                                    <ImageIcon className="h-5 w-5" />
                                </button>

                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    onPaste={handlePaste}
                                    placeholder={language === 'vi' ? 'Nhập câu hỏi hoặc dán ảnh...' : 'Type your question or paste image...'}
                                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!inputValue.trim() && selectedImages.length === 0}
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        </div>
                    </div>
                )}

            {/* Delete Confirmation Modal */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]" onClick={() => !isDeleting && setDeleteModal({ isOpen: false, sessionId: null })}>
                    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-red-100 p-3 rounded-full">
                                <Trash2 className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {language === 'vi' ? 'Xác nhận xóa' : 'Confirm Delete'}
                            </h3>
                        </div>
                        
                        <p className="text-gray-600 mb-6">
                            {language === 'vi' 
                                ? 'Bạn có chắc chắn muốn xóa đoạn chat này? Hành động này không thể hoàn tác.'
                                : 'Are you sure you want to delete this conversation? This action cannot be undone.'}
                        </p>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteModal({ isOpen: false, sessionId: null })}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {language === 'vi' ? 'Hủy' : 'Cancel'}
                            </button>
                            <button
                                onClick={confirmDeleteConversation}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        {language === 'vi' ? 'Đang xóa...' : 'Deleting...'}
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="h-4 w-4" />
                                        {language === 'vi' ? 'Xóa' : 'Delete'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </>
    );
};

export default AIChatBot;

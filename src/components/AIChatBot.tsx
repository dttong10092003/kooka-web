import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, ChefHat, Lightbulb, Star, Clock, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import axiosInstance from '../utils/axiosInstance';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { useNavigate } from 'react-router-dom';

interface Recipe {
    _id: string;
    name: string;
    image?: string;
    cookTime?: number;
    prepTime?: number;
    servings?: number;
    difficulty?: string;
    rate?: number; // Rating từ backend
    numberOfRate?: number; // Số lượng đánh giá
}

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    recipes?: Recipe[];
}

const AIChatBot: React.FC = () => {
    const { language } = useLanguage();
    const { user } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showTooltip, setShowTooltip] = useState(true);
    const [sessionId, setSessionId] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [chatSize, setChatSize] = useState({ width: 358, height: 552 });
    const [isResizing, setIsResizing] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<HTMLDivElement>(null);

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
        // Bold: **text** -> <strong>text</strong>
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');

        // Italic: *text* -> <em>text</em>
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
                setTimeout(() => setShowTooltip(false), 5000); // Hiển thị trong 5 giây
            }, 10000); // Lặp lại mỗi 10 giây

            return () => clearInterval(interval);
        }
    }, [isOpen]);

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
    const sendMessageToAPI = async (userMessage: string): Promise<{ message: string; recipes: Recipe[] }> => {
        try {
            setError('');
            const response = await axiosInstance.post('/chatbot/chat', {
                message: userMessage,
                sessionId: sessionId,
                userId: user?._id || null
            });

            console.log('✅ Chatbot response:', response.data);

            // Backend returns "message" not "response"
            if (response.data.success) {
                const message = response.data.message || response.data.response || 'Không có phản hồi';
                const recipes = response.data.data?.recipes || [];
                return { message, recipes };
            } else {
                throw new Error(response.data.error || 'Failed to get response');
            }
        } catch (err: any) {
            console.error('Error sending message to chatbot:', err);
            setError(err.message || 'An error occurred');

            // Fallback response on error
            const errorMessage = language === 'vi'
                ? 'Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau! 🙏'
                : 'Sorry, I\'m experiencing technical difficulties. Please try again later! 🙏';
            return { message: errorMessage, recipes: [] };
        }
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        const currentMessage = inputValue;
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            // Call backend API with Gemini AI
            const { message: botResponseText, recipes } = await sendMessageToAPI(currentMessage);

            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: botResponseText,
                sender: 'bot',
                timestamp: new Date(),
                recipes: recipes.length > 0 ? recipes : undefined
            };
            setMessages(prev => [...prev, botResponse]);
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
                            <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3">
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
                        className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 relative"
                        style={{
                            width: `${chatSize.width}px`,
                            height: `${chatSize.height}px`,
                            transition: isResizing ? 'none' : 'all 0.2s ease'
                        }}
                    >
                        {/* Resize Handle */}
                        <div
                            className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-blue-500/20 z-10 group"
                            onMouseDown={handleMouseDown}
                        >
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-gray-300 group-hover:bg-blue-500 rounded-r transition-colors"></div>
                        </div>

                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center space-x-3">
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
                                            <div className="text-sm leading-relaxed">
                                                {message.sender === 'bot' ? (
                                                    <div className="space-y-1">{formatMessage(message.text)}</div>
                                                ) : (
                                                    <p>{message.text}</p>
                                                )}
                                            </div>

                                            {/* Recipe Cards - hiển thị trong bubble của bot */}
                                            {message.sender === 'bot' && message.recipes && message.recipes.length > 0 && (
                                                <div className="mt-3 space-y-2">
                                                    <p className="text-xs text-gray-500 mb-2">
                                                        {language === 'vi' ? 'Các món ăn gợi ý:' : 'Suggested recipes:'}
                                                    </p>
                                                    {message.recipes.map((recipe) => {
                                                        console.log('Recipe data:', recipe); // Debug
                                                        return (
                                                            <div
                                                                key={recipe._id}
                                                                onClick={() => {
                                                                    navigate(`/recipe/${recipe._id}`);
                                                                    setIsOpen(false);
                                                                }}
                                                                className="bg-white border border-gray-200 rounded-lg p-2.5 hover:shadow-md transition-all duration-200 cursor-pointer group"
                                                            >
                                                                <div className="flex gap-2.5">
                                                                    {/* Recipe Image */}
                                                                    <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
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

                                                                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                                                                            {/* Rating */}
                                                                            {recipe.rate !== undefined && recipe.rate !== null && recipe.rate > 0 && (
                                                                                <div className="flex items-center gap-0.5">
                                                                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                                                    <span className="font-medium">{recipe.rate.toFixed(1)}</span>
                                                                                    {recipe.numberOfRate && recipe.numberOfRate > 0 && (
                                                                                        <span className="text-gray-400">({recipe.numberOfRate})</span>
                                                                                    )}
                                                                                </div>
                                                                            )}

                                                                            {/* Cook Time */}
                                                                            {recipe.cookTime && (
                                                                                <div className="flex items-center gap-0.5">
                                                                                    <Clock className="h-3 w-3" />
                                                                                    <span>{recipe.cookTime}{language === 'vi' ? 'p' : 'm'}</span>
                                                                                </div>
                                                                            )}

                                                                            {/* Servings */}
                                                                            {recipe.servings && (
                                                                                <div className="flex items-center gap-0.5">
                                                                                    <Users className="h-3 w-3" />
                                                                                    <span>{recipe.servings}</span>
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                        {/* Difficulty */}
                                                                        {recipe.difficulty && (
                                                                            <span className={`inline-block px-1.5 py-0.5 text-xs rounded-full ${recipe.difficulty === 'Dễ' || recipe.difficulty === 'Easy'
                                                                                ? 'bg-green-100 text-green-700'
                                                                                : recipe.difficulty === 'Trung bình' || recipe.difficulty === 'Medium'
                                                                                    ? 'bg-yellow-100 text-yellow-700'
                                                                                    : 'bg-red-100 text-red-700'
                                                                                }`}>
                                                                                {recipe.difficulty}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
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
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder={language === 'vi' ? 'Nhập câu hỏi...' : 'Type your question...'}
                                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!inputValue.trim()}
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                                >
                                    <Send className="h-4 w-4" />
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

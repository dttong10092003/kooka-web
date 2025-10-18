import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, ChefHat, Lightbulb } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const AIChatBot: React.FC = () => {
    const { language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showTooltip, setShowTooltip] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

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
        'Cách làm bánh ngọt'
    ] : [
        'Suggest chicken recipes',
        'Vegetarian recipes',
        'Quick 15-minute meals',
        'How to bake desserts'
    ];

    const getBotResponse = (userMessage: string): string => {
        const message = userMessage.toLowerCase();

        if (language === 'vi') {
            if (message.includes('gà') || message.includes('chicken')) {
                return 'Tôi gợi ý một số món gà ngon: Gà nướng mật ong, Gà xào sả ớt, Gà cà ri, hoặc Gà rán giòn. Bạn muốn xem công thức chi tiết món nào?';
            }
            if (message.includes('chay') || message.includes('vegetarian')) {
                return 'Món chay rất đa dạng! Tôi gợi ý: Đậu hũ xào rau củ, Cà ri chay, Bún bò chay, hoặc Salad quinoa. Tất cả đều bổ dưỡng và ngon miệng!';
            }
            if (message.includes('nhanh') || message.includes('15') || message.includes('quick')) {
                return 'Món ăn nhanh 15 phút: Mì xào tôm, Cơm chiên dương châu, Sandwich thịt nguội, hoặc Salad trộn. Đơn giản mà ngon!';
            }
            if (message.includes('bánh') || message.includes('ngọt') || message.includes('dessert')) {
                return 'Bánh ngọt dễ làm: Bánh flan, Bánh bông lan, Cookies chocolate chip, hoặc Tiramisu. Bạn có lò nướng không?';
            }
            if (message.includes('cảm ơn') || message.includes('thank')) {
                return 'Rất vui được giúp bạn! Nếu cần thêm hỗ trợ về nấu ăn, đừng ngần ngại hỏi tôi nhé! 😊';
            }
            return 'Tôi hiểu bạn đang tìm kiếm thông tin về nấu ăn. Bạn có thể hỏi tôi về công thức món ăn, cách chế biến, hoặc gợi ý món ăn theo nguyên liệu bạn có. Hãy cụ thể hơn để tôi hỗ trợ tốt nhất!';
        } else {
            if (message.includes('chicken') || message.includes('gà')) {
                return 'Here are some delicious chicken recipes: Honey Glazed Chicken, Lemongrass Chicken Stir-fry, Chicken Curry, or Crispy Fried Chicken. Which recipe would you like to see in detail?';
            }
            if (message.includes('vegetarian') || message.includes('vegan')) {
                return 'Vegetarian dishes are amazing! I suggest: Tofu Vegetable Stir-fry, Vegetarian Curry, Vegetarian Pho, or Quinoa Salad. All nutritious and delicious!';
            }
            if (message.includes('quick') || message.includes('15') || message.includes('fast')) {
                return 'Quick 15-minute meals: Shrimp Noodle Stir-fry, Fried Rice, Deli Sandwich, or Mixed Salad. Simple but tasty!';
            }
            if (message.includes('dessert') || message.includes('sweet') || message.includes('cake')) {
                return 'Easy desserts: Crème Caramel, Sponge Cake, Chocolate Chip Cookies, or Tiramisu. Do you have an oven?';
            }
            if (message.includes('thank')) {
                return 'You\'re welcome! If you need more cooking help, don\'t hesitate to ask me! 😊';
            }
            return 'I understand you\'re looking for cooking information. You can ask me about recipes, cooking methods, or meal suggestions based on your ingredients. Please be more specific so I can help you better!';
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

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI thinking time
        setTimeout(() => {
            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: getBotResponse(inputValue),
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1500);
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
                    <div className="bg-white rounded-2xl shadow-2xl w-80 h-96 flex flex-col overflow-hidden border border-gray-200">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center justify-between">
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
                                            <p className="text-sm leading-relaxed">{message.text}</p>
                                            <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                                                }`}>
                                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}

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
                        <div className="p-4 border-t border-gray-200">
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
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

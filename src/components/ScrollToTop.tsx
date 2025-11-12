import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

const ScrollToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const location = useLocation();

    // Scroll to top whenever route changes
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'instant' // Instant scroll when navigating to new page
        });
    }, [location.pathname]);

    // Show button when page is scrolled down
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <>
            {isVisible && (
                <div className="fixed bottom-24 right-6 z-40">
                    <button
                        onClick={scrollToTop}
                        className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-full shadow-2xl hover:shadow-3xl hover:from-orange-600 hover:to-red-600 transform hover:scale-110 transition-all duration-300 group"
                        aria-label="Scroll to top"
                    >
                        <ArrowUp className="h-5 w-5 group-hover:animate-bounce" />
                    </button>
                </div>
            )}
        </>
    );
};

export default ScrollToTop;

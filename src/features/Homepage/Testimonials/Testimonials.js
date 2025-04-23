import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import './Testimonials.scss';
import { TestimonialCard } from './components/TestimonialCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
/**
 * Testimonials component - Displays user testimonials
 */
export const Testimonials = ({ testimonials = [] }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    // Default testimonials if none provided from props
    const defaultTestimonials = testimonials.length > 0 ? testimonials : [
        {
            id: 1,
            name: 'Sarah Johnson',
            role: 'Marathon Runner',
            quote: 'This AI workout generator transformed my training routine. I\'ve seen more progress in 3 months than in my previous year of self-guided workouts.',
            rating: 5
        },
        {
            id: 2,
            name: 'Mike Reynolds',
            role: 'Busy Professional',
            quote: 'With my hectic schedule, I never had time to plan effective workouts. Now I get personalized routines that fit perfectly into my day.',
            rating: 5
        },
        {
            id: 3,
            name: 'Emma Chen',
            role: 'Fitness Enthusiast',
            quote: 'The variety keeps me engaged and motivated. I\'ve discovered exercises I never would have tried on my own, and my results speak for themselves.',
            rating: 4
        }
    ];
    const nextTestimonial = () => {
        setActiveIndex((prevIndex) => prevIndex === defaultTestimonials.length - 1 ? 0 : prevIndex + 1);
    };
    const prevTestimonial = () => {
        setActiveIndex((prevIndex) => prevIndex === 0 ? defaultTestimonials.length - 1 : prevIndex - 1);
    };
    return (_jsx("section", { className: "testimonials-section py-24 bg-[#151F38]", id: "testimonials", children: _jsxs("div", { className: "container mx-auto px-4", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsxs("h2", { className: "text-4xl font-bold mb-4 text-white", children: ["What Our ", _jsx("span", { className: "text-[#CCFF00]", children: "Users" }), " Say"] }), _jsx("p", { className: "text-gray-400 max-w-2xl mx-auto", children: "Real results from people just like you" })] }), _jsxs("div", { className: "testimonials-slider relative max-w-4xl mx-auto", children: [_jsx("div", { className: "testimonials-track", children: defaultTestimonials.map((testimonial, index) => (_jsx("div", { className: `testimonial-slide transition-opacity duration-500 ${index === activeIndex ? 'opacity-100' : 'opacity-0 absolute top-0 left-0'}`, children: _jsx(TestimonialCard, { name: testimonial.name, role: testimonial.role, quote: testimonial.quote, avatar: testimonial.avatar, rating: testimonial.rating }) }, testimonial.id))) }), _jsxs("div", { className: "flex justify-center mt-8 gap-4", children: [_jsx("button", { onClick: prevTestimonial, className: "p-2 rounded-full bg-[#0B1121] border border-gray-700 hover:border-[#CCFF00] transition-colors duration-300", "aria-label": "Previous testimonial", children: _jsx(ChevronLeft, { size: 24, className: "text-gray-400" }) }), _jsx("div", { className: "flex gap-2", children: defaultTestimonials.map((_, index) => (_jsx("button", { onClick: () => setActiveIndex(index), className: `w-3 h-3 rounded-full transition-colors duration-300 ${index === activeIndex ? 'bg-[#CCFF00]' : 'bg-gray-700'}`, "aria-label": `Go to testimonial ${index + 1}` }, index))) }), _jsx("button", { onClick: nextTestimonial, className: "p-2 rounded-full bg-[#0B1121] border border-gray-700 hover:border-[#CCFF00] transition-colors duration-300", "aria-label": "Next testimonial", children: _jsx(ChevronRight, { size: 24, className: "text-gray-400" }) })] })] })] }) }));
};
export default Testimonials;

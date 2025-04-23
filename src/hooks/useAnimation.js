var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useEffect } from 'react';
export function useAnimation(options = {}) {
    useEffect(() => {
        const initializeAnimations = () => __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if AOS is already defined globally
                if (typeof window.AOS !== 'undefined') {
                    window.AOS.init({
                        duration: options.duration || 800,
                        easing: options.easing || 'ease-in-out',
                        once: options.once !== undefined ? options.once : true,
                        offset: options.offset || 100,
                        delay: options.delay || 0,
                        disable: options.disableForReducedMotion !== false &&
                            window.matchMedia('(prefers-reduced-motion: reduce)').matches
                    });
                }
                else {
                    // Dynamically import AOS
                    const AOS = (yield import('aos')).default;
                    AOS.init({
                        duration: options.duration || 800,
                        easing: options.easing || 'ease-in-out',
                        once: options.once !== undefined ? options.once : true,
                        offset: options.offset || 100,
                        delay: options.delay || 0,
                        disable: options.disableForReducedMotion !== false &&
                            window.matchMedia('(prefers-reduced-motion: reduce)').matches
                    });
                }
            }
            catch (error) {
                console.error('Failed to load animation library:', error);
            }
        });
        initializeAnimations();
        // Cleanup function
        return () => {
            document.querySelectorAll('[data-aos]').forEach(el => {
                el.removeAttribute('data-aos');
            });
        };
    }, [options]);
}

import { VendorExtendedDocument } from '../../types/vendor';
import {
    browserSupportsPictureInPicture,
    documentHasMsFullscreen,
    documentHasWebkitFullscreen,
    hasMsFullscreenMethods,
    hasWebkitFullscreenMethods,
    isAudioElement,
    isMediaElement,
    isVideoElement,
    supportsPictureInPicture
} from '../mediaTypeGuards';

describe('Media Type Guards', () => {
    describe('Element type checks', () => {
        let videoElement: HTMLVideoElement;
        let audioElement: HTMLAudioElement;
        let divElement: HTMLDivElement;

        beforeEach(() => {
            videoElement = document.createElement('video');
            audioElement = document.createElement('audio');
            divElement = document.createElement('div');
        });

        test('isVideoElement correctly identifies video elements', () => {
            expect(isVideoElement(videoElement)).toBe(true);
            expect(isVideoElement(audioElement)).toBe(false);
            expect(isVideoElement(divElement)).toBe(false);
            expect(isVideoElement(null)).toBe(false);
        });

        test('isAudioElement correctly identifies audio elements', () => {
            expect(isAudioElement(audioElement)).toBe(true);
            expect(isAudioElement(videoElement)).toBe(false);
            expect(isAudioElement(divElement)).toBe(false);
            expect(isAudioElement(null)).toBe(false);
        });

        test('isMediaElement correctly identifies media elements', () => {
            expect(isMediaElement(videoElement)).toBe(true);
            expect(isMediaElement(audioElement)).toBe(true);
            expect(isMediaElement(divElement)).toBe(false);
            expect(isMediaElement(null)).toBe(false);
        });
    });

    describe('Browser feature detection', () => {
        test('documentHasWebkitFullscreen detects webkit fullscreen support', () => {
            // Save original document
            const _originalDocument = { ...document };

            // Define property to make the mock work with 'in' operator
            Object.defineProperty(document, 'webkitExitFullscreen', {
                value: jest.fn(),
                configurable: true
            });

            expect(documentHasWebkitFullscreen()).toBe(true);

            // Clean up
            delete (document as VendorExtendedDocument).webkitExitFullscreen;
        });

        test('documentHasMsFullscreen detects MS fullscreen support', () => {
            // Define property to make the mock work with 'in' operator
            Object.defineProperty(document, 'msExitFullscreen', {
                value: jest.fn(),
                configurable: true
            });

            expect(documentHasMsFullscreen()).toBe(true);

            // Clean up
            delete (document as VendorExtendedDocument).msExitFullscreen;
        });

        test('hasWebkitFullscreenMethods detects webkit fullscreen methods on element', () => {
            const videoElement = document.createElement('video');

            // Original should not have webkit methods
            expect(hasWebkitFullscreenMethods(videoElement)).toBe(false);

            // Add webkit method
            Object.defineProperty(videoElement, 'webkitRequestFullscreen', {
                value: jest.fn(),
                configurable: true
            });

            expect(hasWebkitFullscreenMethods(videoElement)).toBe(true);
        });

        test('hasMsFullscreenMethods detects MS fullscreen methods on element', () => {
            const videoElement = document.createElement('video');

            // Original should not have MS methods
            expect(hasMsFullscreenMethods(videoElement)).toBe(false);

            // Add MS method
            Object.defineProperty(videoElement, 'msRequestFullscreen', {
                value: jest.fn(),
                configurable: true
            });

            expect(hasMsFullscreenMethods(videoElement)).toBe(true);
        });

        test('supportsPictureInPicture detects PiP support on element', () => {
            const videoElement = document.createElement('video');

            // Original should not have PiP methods in jest environment
            expect(supportsPictureInPicture(videoElement)).toBe(false);

            // Add PiP method
            Object.defineProperty(videoElement, 'requestPictureInPicture', {
                value: jest.fn(),
                configurable: true
            });

            expect(supportsPictureInPicture(videoElement)).toBe(true);
        });

        test('browserSupportsPictureInPicture detects browser PiP support', () => {
            // Define properties to make the mock work with 'in' operator
            Object.defineProperty(document, 'pictureInPictureElement', {
                value: null,
                configurable: true
            });

            Object.defineProperty(document, 'exitPictureInPicture', {
                value: jest.fn(),
                configurable: true
            });

            expect(browserSupportsPictureInPicture()).toBe(true);

            // Clean up
            delete (document as VendorExtendedDocument).pictureInPictureElement;
            delete (document as VendorExtendedDocument).exitPictureInPicture;
        });
    });
}); 
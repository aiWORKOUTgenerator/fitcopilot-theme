import {
    isAudioMedia,
    isImageGallery,
    isImageMedia,
    isMediaCarousel,
    isVideoMedia,
    isYouTubeMedia,
    MediaProps
} from '../types';

describe('Media type guards', () => {
    it('isVideoMedia returns true for video', () => {
        const props: MediaProps = { variant: 'video', src: 'video.mp4' };
        expect(isVideoMedia(props)).toBe(true);
    });
    it('isAudioMedia returns true for audio', () => {
        const props: MediaProps = { variant: 'audio', src: 'audio.mp3' };
        expect(isAudioMedia(props)).toBe(true);
    });
    it('isImageMedia returns true for image', () => {
        const props: MediaProps = { variant: 'image', src: 'img.png' };
        expect(isImageMedia(props)).toBe(true);
    });
    it('isYouTubeMedia returns true for youtube', () => {
        const props: MediaProps = { variant: 'youtube', videoId: 'abc123' };
        expect(isYouTubeMedia(props)).toBe(true);
    });
    it('isImageGallery returns true for imageGallery', () => {
        const props: MediaProps = { variant: 'imageGallery', images: [{ src: 'img1.png' }] };
        expect(isImageGallery(props)).toBe(true);
    });
    it('isMediaCarousel returns true for carousel', () => {
        const props: MediaProps = { variant: 'carousel', items: [{ type: 'image', src: 'img.png' }] };
        expect(isMediaCarousel(props)).toBe(true);
    });
    it('returns false for other variants', () => {
        const video: MediaProps = { variant: 'video', src: 'video.mp4' };
        expect(isAudioMedia(video)).toBe(false);
        expect(isImageMedia(video)).toBe(false);
        expect(isYouTubeMedia(video)).toBe(false);
        expect(isImageGallery(video)).toBe(false);
        expect(isMediaCarousel(video)).toBe(false);
    });
}); 
/**
 * Test Fixtures
 * 
 * This utility provides helper functions for creating test fixtures that handle 
 * differences between component and core type discriminator properties.
 */

/**
 * Creates properly structured Media props with both 'type' and 'variant' discriminators
 * to work with both component rendering and type guards
 *
 * @param mediaType - The type/variant of media (video, audio, image, etc)
 * @param props - Additional props to include
 * @returns Props object with both discriminators
 */
export const createMediaProps = (mediaType: string, props = {}) => ({
    type: mediaType,     // For core type guards
    variant: mediaType,  // For component props
    ...props
});

/**
 * Creates properly structured Button props for testing
 *
 * @param buttonVariant - The variant of button (primary, secondary, link, etc)
 * @param props - Additional props to include
 * @returns Props object with correct discriminator
 */
export const createButtonProps = (buttonVariant: string, props = {}) => ({
    variant: buttonVariant,  // Buttons use variant consistently
    ...props
});

/**
 * Creates properly structured Card props with consistent discriminator
 *
 * @param cardVariant - The variant of card (content, profile, workout, etc)
 * @param props - Additional props to include
 * @returns Props object with correct discriminator
 */
export const createCardProps = (cardVariant: string, props = {}) => ({
    variant: cardVariant,  // Cards use variant consistently
    ...props
});

/**
 * Helper for class assertion to handle BEM naming convention changes
 * 
 * @param element - The DOM element to check
 * @param expectedClasses - Array of expected class names
 * @returns void
 */
export const expectClassNames = (element: HTMLElement, expectedClasses: string[]) => {
    expectedClasses.forEach(className => {
        expect(element.classList.contains(className)).toBe(true);
    });
};

/**
 * Converts legacy class names to BEM format for testing
 * 
 * @param className - Original class name
 * @returns Converted BEM class name
 */
export const convertToBEMClass = (className: string): string => {
    // Media classes
    if (className === 'media-audio') return 'audio-player__element';
    if (className === 'media-video') return 'video-player__element';
    if (className === 'media-image') return 'image-media__element';
    if (className === 'media-youtube') return 'youtube-player__container';
    if (className === 'media-gallery') return 'image-gallery__container';
    if (className === 'media-carousel') return 'media-carousel__container';

    // Button classes
    if (className === 'btn-lg') return 'btn-large';
    if (className === 'btn-sm') return 'btn-small';
    if (className === 'btn-primary') return 'btn btn-primary';
    if (className === 'btn-secondary') return 'btn btn-secondary';

    // Default case
    return className;
}; 
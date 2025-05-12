import { render } from '@testing-library/react';
import React from 'react';
import AudioPlayer from '../AudioPlayer';

describe('AudioPlayer', () => {
    it('renders with required props', () => {
        const { getByRole } = render(
            <AudioPlayer variant="audio" src="audio.mp3" />
        );
        expect(getByRole('audio')).toBeInTheDocument();
    });

    it('applies className and controls', () => {
        const { container } = render(
            <AudioPlayer variant="audio" src="audio.mp3" className="test-class" controls={false} />
        );
        const audio = container.querySelector('audio');
        expect(audio).toHaveClass('media-audio test-class');
        expect(audio).not.toHaveAttribute('controls');
    });

    it('calls onLoad when loaded', () => {
        const onLoad = jest.fn();
        const { container } = render(
            <AudioPlayer variant="audio" src="audio.mp3" onLoad={onLoad} />
        );
        const audio = container.querySelector('audio');
        if (audio) {
            audio.dispatchEvent(new Event('loadeddata'));
            expect(onLoad).toHaveBeenCalled();
        }
    });
}); 
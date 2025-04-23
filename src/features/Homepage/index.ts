// Use direct component imports instead of relying on module resolution
import Homepage from './Homepage';

// Default export for the main component
export default Homepage;

// Export component features individually
import { Features } from './Features';
import { Footer } from './Footer';
import { Hero } from './Hero';
import { Journey } from './Journey';
import { Pricing } from './Pricing';
import { Testimonials } from './Testimonials';

export {
    Features, Footer, Hero, Journey, Pricing, Testimonials
};

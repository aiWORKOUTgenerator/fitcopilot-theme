// Use direct component imports instead of relying on module resolution
import Homepage from './Homepage';

// Default export for the main component
export default Homepage;

// Export component features individually
import { Hero } from './Hero/Hero';
import { Features } from './Features/Features';
import { Journey } from './Journey/Journey';
import { Testimonials } from './Testimonials/Testimonials';
import { Pricing } from './Pricing/Pricing';
import { Footer } from './Footer/Footer';

export {
  Hero,
  Features,
  Journey,
  Testimonials,
  Pricing,
  Footer
}; 
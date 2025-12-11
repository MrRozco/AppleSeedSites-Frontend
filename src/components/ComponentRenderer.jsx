import dynamic from 'next/dynamic';
import Hero from "./custom/Hero";

// Dynamically import other components to reduce initial bundle size
const Features = dynamic(() => import("./custom/Features"));
const BusinessSection = dynamic(() => import("./custom/BusinessSection"));
const OurWork = dynamic(() => import("./custom/OurWork"));
const Performance = dynamic(() => import("./custom/Performance"));
const Testimonials = dynamic(() => import("./custom/Testimonials"));
const AboutSection = dynamic(() => import("./custom/AboutSection"));

const componentMap = {
    'custom.hero': Hero,
    'custom.features': Features,
    'custom.business-section': BusinessSection,
    'custom.our-work': OurWork,
    'custom.performance': Performance,
    'custom.testimonials': Testimonials,
    'custom.about-section': AboutSection,
};


export default function ComponentRenderer({ component }) {
    const Component = componentMap[component.__component];
    if (!Component) {
        console.warn(`No component found for ${component.__component}`);
        return null; // or some fallback UI
    }
    return <Component data={component} />;
    }
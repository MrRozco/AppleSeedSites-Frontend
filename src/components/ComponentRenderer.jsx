"use client";

import Hero from "./custom/Hero";
import Features from "./custom/Features";
import BusinessSection from "./custom/BusinessSection";
import OurWork from "./custom/OurWork";
import Performance from "./custom/Performance";
import Testimonials from "./custom/Testimonials";
import AboutSection from "./custom/AboutSection";
import Pricing from "./custom/Pricing";
import ContactSection from "./custom/ContactSection";

const componentMap = {
    'custom.hero': Hero,
    'custom.features': Features,
    'custom.business-section': BusinessSection,
    'custom.our-work': OurWork,
    'custom.performance': Performance,
    'custom.testimonials': Testimonials,
    'custom.about-section': AboutSection,
    'custom.pricing': Pricing,
    'custom.contact-section': ContactSection,
};


export default function ComponentRenderer({ component }) {
    const Component = componentMap[component.__component];
    if (!Component) {
        console.warn(`No component found for ${component.__component}`);
        return null; // or some fallback UI
    }
    return <Component data={component} />;
    }
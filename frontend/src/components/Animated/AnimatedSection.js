import React from "react";
import { useAnimation } from "../../context/AnimationContext";

const AnimatedSection = ({ children, animation, delay }) => {
  const { animation: defaultAnimation, delay: defaultDelay } = useAnimation();

  // Usa as configurações do contexto ou as personalizadas
  const finalAnimation = animation || defaultAnimation;
  const finalDelay = delay || defaultDelay;

  return (
    <div data-aos={finalAnimation} data-aos-delay={finalDelay}>
      {children}
    </div>
  );
};

export default AnimatedSection;
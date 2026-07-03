export const pageTransition = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
  transition: { duration: 0.3, ease: "easeOut" }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

export const cardReveal = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, y: 0, 
    transition: { type: "tween", ease: "easeOut", duration: 0.3 } 
  }
};

export const popScale = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { type: "spring", stiffness: 300, damping: 20 }
};

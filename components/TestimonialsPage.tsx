import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiHome } from 'react-icons/fi';
import { FaQuoteLeft } from 'react-icons/fa';
import { testimonials } from '../data/testimonials.ts';

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

const wrap = (min: number, max: number, v: number) => {
    const rangeSize = max - min;
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

const TestimonialsPage: React.FC = () => {
  const [[page, direction], setPage] = React.useState([0, 0]);
  const testimonialIndex = wrap(0, testimonials.length, page);
  
  const x = useMotionValue(0);
  const rotateY = useTransform(x, [-300, 0, 300], [-25, 0, 25]);
  const scale = useTransform(x, [-300, 0, 300], [0.85, 1, 0.85]);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <div className="relative w-full min-h-screen h-screen flex flex-col items-center justify-center overflow-hidden bg-brand-dark-blue" style={{ perspective: 1000 }}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${testimonials[testimonialIndex].avatar})` }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            scale: [1.1, 1, 1.1],
            transition: {
              opacity: { duration: 0.5, delay: 0.2 },
              scale: { duration: 20, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
            }
          }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        />
        <div className="absolute inset-0 w-full h-full bg-black/60 backdrop-blur-md"></div>
      </AnimatePresence>

      <motion.div 
        className="absolute top-4 left-4 sm:top-5 sm:left-5 z-20"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0, transition: { delay: 0.5, duration: 0.5 }}}
      >
        <NavLink to="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full p-3">
            <FiHome size={24} />
            <span className="font-semibold hidden sm:inline">Back to Home</span>
        </NavLink>
      </motion.div>

      <div className="relative w-full max-w-4xl flex items-center justify-center px-6 sm:px-8 md:px-12">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            className="w-full flex flex-col justify-center items-center text-center py-8"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            style={{ x, rotateY, scale }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              } else {
                animate(x, 0, { type: 'spring', stiffness: 400, damping: 40 });
              }
            }}
          >
            <span className="text-brand-yellow text-4xl sm:text-5xl mb-6"><FaQuoteLeft /></span>
            <p className="text-lg sm:text-xl md:text-2xl font-medium text-white italic max-w-3xl leading-relaxed">
              "{testimonials[testimonialIndex].quote}"
            </p>
            <div className="mt-8 flex items-center justify-center">
              <img
                src={testimonials[testimonialIndex].avatar}
                alt={testimonials[testimonialIndex].name}
                className="w-16 h-16 rounded-full mr-4 border-2 border-white/50"
              />
              <div>
                <p className="font-bold text-white text-lg">{testimonials[testimonialIndex].name}</p>
                <p className="text-sm text-white/70">{testimonials[testimonialIndex].role}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.button
        className="absolute top-1/2 -translate-y-1/2 left-4 md:left-8 z-10 w-12 h-12 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        onClick={() => paginate(-1)}
        aria-label="Previous testimonial"
      >
        <span className="h-8 w-8 text-white"><FiChevronLeft /></span>
      </motion.button>
      <motion.button
        className="absolute top-1/2 -translate-y-1/2 right-4 md:right-8 z-10 w-12 h-12 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        onClick={() => paginate(1)}
        aria-label="Next testimonial"
      >
        <span className="h-8 w-8 text-white"><FiChevronRight /></span>
      </motion.button>
      
      <div className="absolute bottom-8 flex justify-center space-x-4">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => {
                if(i === testimonialIndex) return;
                setPage([i, i > page ? 1 : -1])
            }}
            className="relative w-3.5 h-3.5 rounded-full bg-white/40 hover:bg-white/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label={`Go to testimonial ${i + 1}`}
          >
            {testimonialIndex === i && (
                <motion.div
                    className="absolute inset-0 bg-white rounded-full"
                    layoutId="active-testimonial-dot"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsPage;
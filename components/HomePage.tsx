import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { FaCoins, FaCalendarAlt, FaMapMarkedAlt, FaArrowRight } from 'react-icons/fa';
import youthopiaLogo from '../assets/youthopia-logo.png';

const staggeredTextContainer: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
};

const staggeredLetter: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 18 }
  }
};

const AnimatedHeading: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => (
  <motion.h1
    className={className}
    variants={staggeredTextContainer}
    initial="hidden"
    animate="visible"
    aria-label={text}
  >
    {text.split('').map((char, i) => (
      <motion.span key={i} variants={staggeredLetter} className="inline-block">
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    ))}
  </motion.h1>
);

const floatingAnimation: Variants = {
  animate: {
    y: [0, -15, 0],
    rotate: [0, 2, -2, 0],
    transition: {
      duration: 6,
      ease: "easeInOut",
      repeat: Infinity,
    }
  }
};

const HomePage: React.FC = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } },
        exit: { opacity: 0 }
      }}
      className="overflow-hidden bg-white"
    >
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center overflow-hidden">

        {/* Decorative Blobs - Made subtler */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            className="mb-8 flex justify-center"
            variants={floatingAnimation}
            animate="animate"
          >
            <motion.img
              src={youthopiaLogo}
              alt="Youthopia Logo"
              className="w-[85%] sm:w-[70%] md:w-[60%] lg:w-[50%] max-w-3xl h-auto drop-shadow-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-dark-blue to-brand-blue mb-6 tracking-tight">
              Where Passion Meets <span className="text-brand-yellow">Opportunity</span>
            </h1>
          </motion.div>

          <motion.p
            className="mt-4 max-w-3xl mx-auto text-lg sm:text-xl md:text-2xl text-slate-700 dark:text-gray-300 leading-relaxed font-medium"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Welcome to <span className="font-bold text-brand-dark-blue">Youthopia</span>! A festival buzzing with excitement.
            From dance duels to business pitches, discover your potential and celebrate with us.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <NavLink
              to="/auth"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-brand-dark-blue font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-dark-blue hover:bg-brand-blue shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Join the Community
              <span className="ml-2 group-hover:translate-x-1 transition-transform">  </span> <FaArrowRight />
            </NavLink>

            <NavLink
              to="/dashboard"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-brand-dark-blue transition-all duration-200 bg-white border-2 border-brand-dark-blue font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-dark-blue hover:bg-brand-blue hover:text-white hover:border-transparent shadow-md hover:shadow-lg hover:-translate-y-1"
            >
              Explore Events
            </NavLink>
          </motion.div>
        </div >
      </section >

      {/* Quick Tour Section */}
      < section className="bg-white/70 py-12 sm:py-16" >
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-brand-blue mb-8 sm:mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            A Quick Tour of What’s Inside
          </motion.h2>

          <motion.div
            className="grid gap-8 md:gap-10 sm:grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15 }
              },
            }}
          >
            {/* Card 1 */}
            <motion.div
              className="group relative bg-white rounded-[2rem] p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 overflow-hidden"
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
              }}
              whileHover={{ y: -10 }}
            >
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-yellow-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 ease-out" />

              <div className="relative z-10 flex flex-col items-center text-center h-full">
                <div className="mb-6 p-4 bg-yellow-50 text-yellow-600 rounded-2xl group-hover:bg-yellow-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <span className="text-4xl"> <FaCoins /> </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-yellow-600 transition-colors">
                  Earn & Redeem
                </h3>

                <p className="text-slate-600 mb-6 leading-relaxed flex-grow">
                  Collect points as you participate in events and unlock exclusive cool rewards!
                </p>

                <div className="flex items-center text-yellow-600 font-semibold group-hover:translate-x-1 transition-transform cursor-pointer">
                  <span>Start Earning</span>
                  <span className="ml-2 text-sm"> <FaArrowRight /> </span>
                </div>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              className="group relative bg-white rounded-[2rem] p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 overflow-hidden"
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
              }}
              whileHover={{ y: -10 }}
            >
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-blue-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 ease-out" />

              <div className="relative z-10 flex flex-col items-center text-center h-full">
                <div className="mb-6 p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <span className="text-4xl"> <FaCalendarAlt /> </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                  Event Schedule
                </h3>

                <p className="text-slate-600 mb-6 leading-relaxed flex-grow">
                  Stay updated with the timeline. Never miss your favorite competitions and shows.
                </p>

                <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform cursor-pointer">
                  <span>View Timeline</span>
                  <span className="ml-2 text-sm"> <FaArrowRight /> </span>
                </div>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              className="group relative bg-white rounded-[2rem] p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 overflow-hidden"
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
              }}
              whileHover={{ y: -10 }}
            >
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-purple-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 ease-out" />

              <div className="relative z-10 flex flex-col items-center text-center h-full">
                <div className="mb-6 p-4 bg-purple-50 text-purple-600 rounded-2xl group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <span className="text-4xl"> <FaMapMarkedAlt /> </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-purple-600 transition-colors">
                  Interactive Map
                </h3>

                <p className="text-slate-600 mb-6 leading-relaxed flex-grow">
                  Navigate the fest effortlessly. Find every venue and stall right at your fingertips.
                </p>

                <div className="flex items-center text-purple-600 font-semibold group-hover:translate-x-1 transition-transform cursor-pointer">
                  <span>Explore Map</span>
                  <span className="ml-2 text-sm"> <FaArrowRight /> </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section >
    </motion.div >
  );
};

export default HomePage;
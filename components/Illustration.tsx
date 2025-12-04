import * as React from 'react';
import { motion } from 'framer-motion';

const Illustration: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.2, ease: "backOut" }}
    >
      <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="womanClip">
            <path d="M235 150 a 25 25 0 0 1 50 0 v 100 h -50 z" />
          </clipPath>
        </defs>
        
        <motion.path 
          d="M100 380 Q 200 420 300 380 T 380 200 Q 420 100 350 50 T 200 20 Q 50 40 50 150 T 100 380" 
          fill="#E0E7FF"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
        />

        <g id="checklist">
          <motion.rect x="120" y="80" width="160" height="240" rx="20" fill="#FFFFFF" stroke="#0A2647" strokeWidth="4" 
            initial={{ y: 50, opacity: 0 }} animate={{ y: 80, opacity: 1 }} transition={{ delay: 0.5, duration: 0.8, type: "spring", stiffness: 120, damping: 10 }}/>
          <motion.rect x="135" y="95" width="100" height="10" rx="5" fill="#0A2647"
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.9, duration: 0.6 }} style={{transformOrigin: 'left'}}/>
          
          {[140, 180, 220, 260, 300].map((y, i) => (
            <g key={y}>
              <motion.rect x="140" y={y} width="20" height="20" rx="4" fill="#FFC107"
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2 + i * 0.1, duration: 0.5, ease: "backOut" }}/>
              <motion.path d={`M145 ${y+10} l 4 4 l 6 -8`} stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round"
                 initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.4 + i * 0.1, duration: 0.4 }}/>
              <motion.rect x="175" y={y+5} width="80" height="8" rx="4" fill="#C7D2FE"
                 initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.3 + i * 0.1, duration: 0.6, ease:'backOut' }} style={{transformOrigin: 'left'}}/>
            </g>
          ))}
        </g>

        <g id="woman" transform="translate(10, 20)">
            <motion.path d="M 270 270 L 275 350 L 260 350 L 255 270 Z" fill="#0A2647"/>
            <motion.rect x="250" y="190" width="30" height="80" rx="10" fill="#205295" />
            <motion.circle cx="265" cy="170" r="25" fill="#FDE68A" />
            <path d="M265 150 a 15 10 0 0 1 0 15 a 10 10 0 0 0 0 -15" fill="#0A2647" />
        </g>
        
        <motion.g id="pencil" transform="rotate(15 300 150)"
          initial={{ x: 50, opacity: 0, rotate: 10 }} animate={{ x: 0, opacity: 1, rotate: 0 }} transition={{ delay: 0.7, duration: 1, ease: "backOut" }}>
            <path d="M290 120 L 310 120 L 310 260 L 290 260 Z" fill="#FFC107" />
            <path d="M290 120 L 300 100 L 310 120 Z" fill="#FDE68A" />
            <polygon points="300,100 295,105 305,105" fill="#0A2647" />
            <rect x="290" y="260" width="20" height="10" fill="#F472B6" />
        </motion.g>

      </svg>
    </motion.div>
  );
};

export default Illustration;
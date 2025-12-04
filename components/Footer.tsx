import React from 'react';
import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';
import { motion, type Variants } from 'framer-motion';
import { itemSpringUp } from '../utils/animations';

const Footer: React.FC = () => {
    const iconVariants: Variants = {
        hover: {
            y: -5,
            scale: 1.2,
            color: '#FFC107',
            transition: { type: 'spring', stiffness: 300 }
        },
        tap: {
            scale: 0.9
        }
    };

    return (
        <motion.footer
            className="glass-dark text-white border-t border-white/10"
            variants={itemSpringUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
        >
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-yellow to-yellow-200">Youthopia</h3>
                        <p className="mt-1 text-gray-300">Your space for mental wellness.</p>
                    </div>
                    <div className="flex space-x-6">
                        <motion.a href="#" variants={iconVariants} whileHover="hover" whileTap="tap" className="text-gray-300 hover:text-brand-yellow transition-colors"><FaTwitter size={24} /></motion.a>
                        <motion.a href="#" variants={iconVariants} whileHover="hover" whileTap="tap" className="text-gray-300 hover:text-brand-yellow transition-colors"><FaInstagram size={24} /></motion.a>
                        <motion.a href="#" variants={iconVariants} whileHover="hover" whileTap="tap" className="text-gray-300 hover:text-brand-yellow transition-colors"><FaFacebook size={24} /></motion.a>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700/50 pt-6 text-center text-gray-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} Youthopia. All Rights Reserved. A project for hope and resilience.</p>
                </div>
            </div>
        </motion.footer>
    );
};

export default Footer;
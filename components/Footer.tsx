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
            className="bg-brand-dark-blue text-white"
            variants={itemSpringUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
        >
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold">Youthopia</h3>
                        <p className="mt-1 text-gray-400">Your space for mental wellness.</p>
                    </div>
                    <div className="flex space-x-6">
                        <motion.a href="#" variants={iconVariants} whileHover="hover" whileTap="tap" className="text-gray-400"><FaTwitter size={24} /></motion.a>
                        <motion.a href="#" variants={iconVariants} whileHover="hover" whileTap="tap" className="text-gray-400"><FaInstagram size={24} /></motion.a>
                        <motion.a href="#" variants={iconVariants} whileHover="hover" whileTap="tap" className="text-gray-400"><FaFacebook size={24} /></motion.a>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} Youthopia. All Rights Reserved. A project for hope and resilience.</p>
                </div>
            </div>
        </motion.footer>
    );
};

export default Footer;
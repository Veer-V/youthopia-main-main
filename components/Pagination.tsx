import * as React from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const PaginationButton: React.FC<{
    onClick: () => void;
    isDisabled?: boolean;
    isActive?: boolean;
    children: React.ReactNode;
}> = ({ onClick, isDisabled = false, isActive = false, children }) => (
    <motion.button
        onClick={onClick}
        disabled={isDisabled}
        className={`w-9 h-9 flex items-center justify-center rounded-full font-semibold text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-passport-primary
            ${isDisabled ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}
            ${isActive ? 'bg-brand-passport-accent text-brand-passport-primary' : 'bg-transparent text-brand-passport-subtle'}
        `}
        whileTap={!isDisabled ? { scale: 0.9 } : {}}
    >
        {children}
    </motion.button>
);


const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) {
        return null;
    }
    
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
            <PaginationButton onClick={() => onPageChange(currentPage - 1)} isDisabled={currentPage === 1}>
                <FiChevronLeft />
            </PaginationButton>
            
            {pageNumbers.map(number => (
                <PaginationButton
                    key={number}
                    onClick={() => onPageChange(number)}
                    isActive={currentPage === number}
                >
                    {number}
                </PaginationButton>
            ))}

            <PaginationButton onClick={() => onPageChange(currentPage + 1)} isDisabled={currentPage === totalPages}>
                <FiChevronRight />
            </PaginationButton>
        </nav>
    );
};

export default Pagination;
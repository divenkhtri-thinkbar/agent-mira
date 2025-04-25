import React from 'react';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children, className = '' }) => {
    if (!open) return null;

    return (
        <>
            {/* Backdrop - keeping the same */}
            <div 
                className="fixed inset-0 bg-black/30 z-40 transition-opacity"
                onClick={onClose}
            />
            
            {/* Modal - updated to solid white background */}
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div 
                    className={`bg-white rounded-lg shadow-xl ${className} transform transition-all`}
                    style={{ backgroundColor: 'white' }}  // Ensuring solid white background
                    onClick={(e) => e.stopPropagation()}
                >
                    {children}
                </div>
            </div>
        </>
    );
};

export default Modal; 
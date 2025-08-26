'use client'

// ModalGiftCardQuickviewContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GiftCardType } from '@/type/GiftCardType';

interface ModalGiftCardQuickviewContextProps {
    children: ReactNode;
}

interface ModalGiftCardQuickviewContextValue {
    selectedGiftCard: GiftCardType | null;
    openGiftCardQuickview: (giftCard: GiftCardType) => void;
    closeGiftCardQuickview: () => void;
}

const ModalGiftCardQuickviewContext = createContext<ModalGiftCardQuickviewContextValue | undefined>(undefined);

export const ModalGiftCardQuickviewProvider: React.FC<ModalGiftCardQuickviewContextProps> = ({ children }) => {
    const [selectedGiftCard, setSelectedGiftCard] = useState<GiftCardType | null>(null);

    const openGiftCardQuickview = (giftCard: GiftCardType) => {
        setSelectedGiftCard(giftCard);
    };

    const closeGiftCardQuickview = () => {
        setSelectedGiftCard(null);
    };

    return (
        <ModalGiftCardQuickviewContext.Provider value={{ selectedGiftCard, openGiftCardQuickview, closeGiftCardQuickview }}>
            {children}
        </ModalGiftCardQuickviewContext.Provider>
    );
};

export const useModalGiftCardQuickviewContext = () => {
    const context = useContext(ModalGiftCardQuickviewContext);
    if (!context) {
        throw new Error('useModalGiftCardQuickviewContext must be used within a ModalGiftCardQuickviewProvider');
    }
    return context;
};
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { authClient } from '@/lib/auth-client';

interface Business {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    logoUrl?: string | null;
    currency: string;
}

interface BusinessContextType {
    businesses: Business[];
    activeBusiness: Business | null;
    isLoading: boolean;
    setActiveBusiness: (business: Business) => void;
    refreshBusinesses: () => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: React.ReactNode }) {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [activeBusiness, setActiveBusinessState] = useState<Business | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { data: session } = authClient.useSession();

    const fetchBusinesses = async () => {
        if (!session) return;
        try {
            const data = await api.get<Business[]>('/v1/business');
            setBusinesses(data);

            // Restore from localStorage or pick first
            const savedId = localStorage.getItem('active_business_id');
            const found = savedId ? data.find(b => b.id === savedId) : data[0];

            if (found) {
                setActiveBusinessState(found);
                localStorage.setItem('active_business_id', found.id);
            }
        } catch (error) {
            console.error('Failed to fetch businesses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const setActiveBusiness = (business: Business) => {
        setActiveBusinessState(business);
        localStorage.setItem('active_business_id', business.id);
    };

    useEffect(() => {
        if (session) {
            fetchBusinesses();
        } else {
            setBusinesses([]);
            setActiveBusinessState(null);
            setIsLoading(false);
        }
    }, [session]);

    return (
        <BusinessContext.Provider value={{
            businesses,
            activeBusiness,
            isLoading,
            setActiveBusiness,
            refreshBusinesses: fetchBusinesses
        }}>
            {children}
        </BusinessContext.Provider>
    );
}

export function useBusiness() {
    const context = useContext(BusinessContext);
    if (context === undefined) {
        throw new Error('useBusiness must be used within a BusinessProvider');
    }
    return context;
}

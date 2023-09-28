// SidebarContext.js
import React, { createContext, useContext, useState } from 'react';
const SidebarContext = createContext();
export const SidebarProvider = ({ children }) => {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    return (
        <SidebarContext.Provider value={{ sidebarVisible, setSidebarVisible }}>
            {children}
        </SidebarContext.Provider>
    );
};
export const useSidebar = () => {
    return useContext(SidebarContext);
};

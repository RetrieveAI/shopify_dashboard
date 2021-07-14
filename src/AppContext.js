import React, { useState } from "react";

export const AppContext = React.createContext();

const AppContextProvider = ({ children }) => {

    
    const [selected, setSelected] = useState(['Trial']);

    const [selectedState, setSelectedState] = useState('');

    const [isBillingStatusRecevied, setIsBillingStatusRecevied] = useState(false);

    return (
        <AppContext.Provider
            value={{
            selected, 
            setSelected,
            selectedState,
            setSelectedState,
            isBillingStatusRecevied,
            setIsBillingStatusRecevied,
            }}
        >
            {children}
        </AppContext.Provider>
    );

};
export default AppContextProvider;
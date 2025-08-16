import { useContext } from 'react';
import { ThemeContext } from '../Page/Them/ThemeContext';


const useTheme = () => {
    return useContext(ThemeContext);
};

export default useTheme;

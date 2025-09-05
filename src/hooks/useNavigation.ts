import { useState } from 'react';

export const useNavigation = () => {
  const [activePage, setActivePage] = useState('Dashboard');

  const navigateTo = (page: string) => {
    setActivePage(page);
  };

  return {
    activePage,
    navigateTo,
  };
};

import { useState, useCallback } from 'react';

export interface PinColor {
  name: string;
  bg: string;
  hover: string;
  border: string;
}

export const PIN_COLORS: PinColor[] = [
  { name: 'Blue', bg: 'bg-blue-50 dark:bg-blue-950/30', hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/40', border: 'border-blue-200 dark:border-blue-800' },
  { name: 'Green', bg: 'bg-green-50 dark:bg-green-950/30', hover: 'hover:bg-green-100 dark:hover:bg-green-900/40', border: 'border-green-200 dark:border-green-800' },
  { name: 'Purple', bg: 'bg-purple-50 dark:bg-purple-950/30', hover: 'hover:bg-purple-100 dark:hover:bg-purple-900/40', border: 'border-purple-200 dark:border-purple-800' },
  { name: 'Pink', bg: 'bg-pink-50 dark:bg-pink-950/30', hover: 'hover:bg-pink-100 dark:hover:bg-pink-900/40', border: 'border-pink-200 dark:border-pink-800' },
  { name: 'Yellow', bg: 'bg-yellow-50 dark:bg-yellow-950/30', hover: 'hover:bg-yellow-100 dark:hover:bg-yellow-900/40', border: 'border-yellow-200 dark:border-yellow-800' },
  { name: 'Orange', bg: 'bg-orange-50 dark:bg-orange-950/30', hover: 'hover:bg-orange-100 dark:hover:bg-orange-900/40', border: 'border-orange-200 dark:border-orange-800' },
  { name: 'Red', bg: 'bg-red-50 dark:bg-red-950/30', hover: 'hover:bg-red-100 dark:hover:bg-red-900/40', border: 'border-red-200 dark:border-red-800' },
  { name: 'Indigo', bg: 'bg-indigo-50 dark:bg-indigo-950/30', hover: 'hover:bg-indigo-100 dark:hover:bg-indigo-900/40', border: 'border-indigo-200 dark:border-indigo-800' },
  { name: 'Teal', bg: 'bg-teal-50 dark:bg-teal-950/30', hover: 'hover:bg-teal-100 dark:hover:bg-teal-900/40', border: 'border-teal-200 dark:border-teal-800' },
  { name: 'Gray', bg: 'bg-gray-50 dark:bg-gray-950/30', hover: 'hover:bg-gray-100 dark:hover:bg-gray-900/40', border: 'border-gray-200 dark:border-gray-800' },
];

interface PinnedItemsHook<T extends { id: string; pinned?: boolean }> {
  pinnedItems: Set<string>;
  itemColors: Map<string, PinColor>;
  togglePin: (itemId: string) => void;
  isPinned: (itemId: string) => boolean;
  setItemColor: (itemId: string, color: PinColor) => void;
  getItemColor: (itemId: string) => PinColor | undefined;
  separateItems: (items: T[]) => { pinnedItems: T[]; unpinnedItems: T[] };
}

export function usePinnedItems<T extends { id: string; pinned?: boolean }>(): PinnedItemsHook<T> {
  const [pinnedItems, setPinnedItems] = useState<Set<string>>(new Set());
  const [itemColors, setItemColors] = useState<Map<string, PinColor>>(new Map());

  const togglePin = useCallback((itemId: string) => {
    setPinnedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
        // Remove color when unpinning
        setItemColors(prevColors => {
          const newColors = new Map(prevColors);
          newColors.delete(itemId);
          return newColors;
        });
      } else {
        newSet.add(itemId);
        // Set default color when pinning
        setItemColors(prevColors => {
          const newColors = new Map(prevColors);
          newColors.set(itemId, PIN_COLORS[0]); // Default to first color
          return newColors;
        });
      }
      return newSet;
    });
  }, []);

  const isPinned = useCallback((itemId: string) => {
    return pinnedItems.has(itemId);
  }, [pinnedItems]);

  const setItemColor = useCallback((itemId: string, color: PinColor) => {
    setItemColors(prev => {
      const newColors = new Map(prev);
      newColors.set(itemId, color);
      return newColors;
    });
  }, []);

  const getItemColor = useCallback((itemId: string) => {
    return itemColors.get(itemId);
  }, [itemColors]);

  const separateItems = useCallback((items: T[]) => {
    const pinnedItemsArray: T[] = [];
    const unpinnedItems: T[] = [];

    items.forEach(item => {
      if (pinnedItems.has(item.id) || item.pinned) {
        pinnedItemsArray.push({ ...item, pinned: true });
      } else {
        unpinnedItems.push(item);
      }
    });

    return { pinnedItems: pinnedItemsArray, unpinnedItems };
  }, [pinnedItems]);

  return {
    pinnedItems,
    itemColors,
    togglePin,
    isPinned,
    setItemColor,
    getItemColor,
    separateItems,
  };
}
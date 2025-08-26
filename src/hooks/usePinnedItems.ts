import { useState, useCallback } from 'react';

interface PinnedItemsHook<T extends { id: string; pinned?: boolean }> {
  pinnedItems: Set<string>;
  togglePin: (itemId: string) => void;
  isPinned: (itemId: string) => boolean;
  separateItems: (items: T[]) => { pinnedItems: T[]; unpinnedItems: T[] };
}

export function usePinnedItems<T extends { id: string; pinned?: boolean }>(): PinnedItemsHook<T> {
  const [pinnedItems, setPinnedItems] = useState<Set<string>>(new Set());

  const togglePin = useCallback((itemId: string) => {
    setPinnedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);

  const isPinned = useCallback((itemId: string) => {
    return pinnedItems.has(itemId);
  }, [pinnedItems]);

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
    togglePin,
    isPinned,
    separateItems,
  };
}
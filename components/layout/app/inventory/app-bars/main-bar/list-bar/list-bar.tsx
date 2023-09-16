// components\layout\app\app-bars\main-bar\list-bar\list-bar.tsx
import { useUserInfoContext } from "@/context/user-context";
import { useWindowContext } from "@/context/window-context";
import { Item } from "@/lib/types/item";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import SlabList from "../../../item-list-types/slabs/slab-list";
import TileList from "../../../item-list-types/tiles/tile-list";

export default function ListBar() {
  const { serverLoadWasTried, getUserItems, getPreferredListType } = useUserInfoContext();
  const [itemsAreLoading, setItemsAreLoading] = useState(true);
  const [loadedItems, setLoadedItems] = useState<Item[]>([]);

  useEffect(() => {
    const items = getUserItems();
    if (items) {
      setLoadedItems(items);
    }
    setItemsAreLoading(false);
  }, [getUserItems]);

  return (
    <section className={"listBarSectionBox"}>
      <AnimatePresence mode="wait">
        {serverLoadWasTried &&
          !itemsAreLoading &&
          loadedItems.length > 0 &&
          getPreferredListType() === "tiles" && (
            <motion.div
              key={"tile-list"}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 },
              }}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.5 }}
            >
              <TileList loadedItems={loadedItems} />
            </motion.div>
          )}

        {serverLoadWasTried &&
          !itemsAreLoading &&
          loadedItems.length > 0 &&
          getPreferredListType() === "slabs" && (
            <motion.div
              key={"slab-list"}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 },
              }}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.5 }}
            >
              <SlabList loadedItems={loadedItems} />
            </motion.div>
          )}

        {serverLoadWasTried && !itemsAreLoading && loadedItems.length < 1 && (
          <motion.div key={"no-items"} className={"listBarNoItemsDisplayBox"}>
            <motion.h1
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { scale: 0, opacity: 0 },
                visible: { scale: 1, opacity: 1 },
              }}
            >
              No items found.
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

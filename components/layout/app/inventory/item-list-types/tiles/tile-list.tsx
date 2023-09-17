// tile-list.tsx
import MainLoader from "@/components/ui/loading/main-loader";
import { useItemsContext } from "@/context/items-context";
import { Item } from "@/lib/types/item";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react";
import { BiEdit } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";

export default function TileList({ loadedItems }: { loadedItems: Item[] }) {
  const { showItemModal, showDeleteModal } = useItemsContext();
  const [imageLoaded, setImageLoaded] = useState(false);

  function editItemHandler(itemToEdit: Item) {
    showItemModal(itemToEdit);
  }

  function deleteItemHandler(itemToDelete: Item) {
    showDeleteModal(itemToDelete, null);
  }

  function handleImageLoad() {
    setImageLoaded(true);
  }

  return (
    <motion.section
      className="tileListSectionBox"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ duration: 0.2 }}
    >
      <AnimatePresence>
        {loadedItems.map((item: Item) => {
          if (!item) {
            return;
          }
          return (
            <motion.div
              className="tileListItemCardBox"
              key={item.id}
              layout={"position"}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 },
              }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="tileListItemCard"
                tabIndex={0}
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  e.stopPropagation();
                  editItemHandler(item);
                }}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                    editItemHandler(item);
                  }
                }}
              >
                <div className="tileListItemImageBox">
                  {!imageLoaded && <MainLoader message="loading image..." />}
                  {/* Show the loader when the image is not loaded */}
                  <Image
                    className="tileListItemImage"
                    src={item.imageURL}
                    alt={"Item's image"}
                    // fill
                    width={250}
                    height={250}
                    sizes="100vw"
                    onLoadingComplete={handleImageLoad}
                  />
                </div>
                <div className="tileListItemPriceTagBox">
                  {`$${item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                </div>
                <div className="tileListItemInfoBox">
                  <div className="tileListItemInfoBits">
                    <p>{item.name.length > 25 ? `${item.name.slice(0, 25)}...` : item.name}</p>
                  </div>
                  <div className="tileListItemInfoBits">
                    <p>{`${item.amount.toLocaleString("en-US")} in stock`}</p>
                  </div>

                  <div className="tileListOperationIcons">
                    <button
                      className="tileListOperationButton"
                      onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        e.stopPropagation();
                        editItemHandler(item);
                      }}
                    >
                      <BiEdit className={`tileListOperationIcon`} />
                    </button>

                    <button
                      className="tileListOperationButton"
                      onClick={async (e: React.MouseEvent) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteItemHandler(item);
                      }}
                    >
                      <BsTrash className={`tileListOperationIcon`} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.section>
  );
}

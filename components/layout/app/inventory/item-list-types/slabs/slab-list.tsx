// tile-list.tsx
import MainLoader from "@/components/ui/loading/main-loader";
import { useItemsContext } from "@/context/items-context";
import { useWindowContext } from "@/context/window-context";
import { Item } from "@/lib/types/item";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BiEdit } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";

export default function SlabList({ loadedItems }: { loadedItems: Item[] }) {
  const { windowWidth } = useWindowContext();
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
      className="slabListSectionBox"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence>
        {loadedItems.map((item: Item) => {
          if (!item) {
            return;
          }
          return (
            <motion.div
              className="slabListItemSlabBox"
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
              <Link href={`inventory/${item.id}`} className="slabListItemSlab">
                <div className="slabListItemImageBox">
                  {!imageLoaded && <MainLoader message="loading image..." />}
                  {/* Show the loader when the image is not loaded */}
                  <Image
                    className="slabListItemImage"
                    src={item.imageURL}
                    alt={"Item's image"}
                    width={windowWidth > 740 ? 100 : windowWidth > 450 ? 80 : 50}
                    height={windowWidth > 740 ? 100 : windowWidth > 450 ? 80 : 50}
                    sizes="50vw"
                    onLoadingComplete={handleImageLoad}
                  />
                </div>

                <div className="slabListItemInfoBox">
                  <div className="slabListItemInfoBits">
                    <p>{item.name.length > 25 ? `${item.name.slice(0, 25)}...` : item.name}</p>
                    <p>
                      <p>{`${parseFloat(item.amount).toLocaleString("en-US")} in stock`}</p>
                    </p>
                    <div className="slabListItemPriceTagBox">
                      {`$${parseFloat(item.price).toLocaleString("en-US")}`}
                    </div>
                  </div>

                  {windowWidth > 600 && (
                    <div className="slabListItemInfoBits">
                      <h6>Created</h6>
                      <p>{`${item.date_created} ${item.time_created}`}</p>
                      <h6>Modified</h6>
                      <p>{`${item.date_modified} ${item.time_modified}`}</p>
                    </div>
                  )}

                  <div className="slabListOperationIcons">
                    <BiEdit
                      className={`slabListOperationIcon slabListEditIcon`}
                      onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        e.stopPropagation();
                        editItemHandler(item);
                      }}
                    />
                    <BsTrash
                      className={`slabListOperationIcon slabListDeleteIcon`}
                      onClick={async (e: React.MouseEvent) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteItemHandler(item);
                      }}
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.section>
  );
}

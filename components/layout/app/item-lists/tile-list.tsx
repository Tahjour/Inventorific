// tile-list.tsx
import Loader from "@/components/ui/loading/loader";
import { useItemsContext } from "@/context/items-context";
import { Item } from "@/lib/types/item";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BiEdit } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import styles from "./tile-list.module.css";

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
    <motion.section className={styles.tileList} exit={{ opacity: 0 }}>
      <AnimatePresence>
        {loadedItems.map((item: Item) => {
          if (!item) {
            return;
          }
          return (
            <motion.div
              // className={styles.itemCardBox}
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
              <Link href={`inventory/${item.id}`} className={styles.itemCard}>
                <div className={styles.itemImageBox}>
                  {!imageLoaded && <Loader message="loading image..." />}
                  {/* Show the loader when the image is not loaded */}
                  <Image
                    className={styles.itemImage}
                    src={item.imageURL}
                    alt={"Item's image"}
                    // fill
                    width={250}
                    height={250}
                    sizes="100vw"
                    onLoadingComplete={handleImageLoad}
                  />
                </div>
                <div className={styles.itemPriceTagBox}>
                  {item.price.length > 12 ? `$${item.price.slice(0, 12)}+` : `$${item.price}`}
                </div>
                <div className={styles.itemInfoBox}>
                  {/* <div className={styles.itemInfoHighlight}> */}
                  <div className={styles.itemInfoBits}>
                    {/* <h3>Name</h3> */}
                    <p>{item.name.length > 25 ? `${item.name.slice(0, 25)}...` : item.name}</p>
                  </div>
                  {/* <div className={styles.itemInfoBits}>
                    <strong>Price</strong>
                    {item.price.length > 11 ? `$${item.price.slice(0, 11)}...` : `$${item.price}`}
                  </div> */}
                  <div className={styles.itemInfoBits}>
                    {/* <h3>Amount</h3> */}
                    <p>
                      {item.amount.length > 12 ? `${item.amount.slice(0, 12)}+` : `${item.amount}`}{" "}
                      in stock
                    </p>
                  </div>
                  {/* </div> */}

                  <div className={styles.operationIcons}>
                    <BiEdit
                      className={`${styles.operationIcon} ${styles.editIcon}`}
                      onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        e.stopPropagation();
                        editItemHandler(item);
                      }}
                    />
                    <BsTrash
                      className={`${styles.operationIcon} ${styles.deleteIcon}`}
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

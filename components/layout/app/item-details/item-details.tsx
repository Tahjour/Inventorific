import Loader from "@/components/ui/loading/loader";
import { Item } from "@/lib/types/item";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import styles from "./item-details.module.css";

function ItemDetails({ item }: { item: Item }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  function handleImageLoad() {
    setImageLoaded(true);
  }

  return (
    <section className={styles.itemDetailsBox}>
      <div className={styles.itemImageBox}>
        <AnimatePresence mode="wait">
          {!imageLoaded && <Loader message="loading image..." />}
        </AnimatePresence>
        <Image
          className={styles.itemImage}
          src={item ? item.imageURL : ""}
          alt={"Item's image"}
          sizes="(max-width: 640px) 90vw, 100vw"
          fill
          onLoadingComplete={handleImageLoad}
        />
      </div>
      <div className={styles.itemInfo}>
        <div className={styles.itemInfoSub}>
          <div className={styles.itemInfoCol}>
            <h1>Name: {item?.name}</h1>
            <p>Price: ${item?.price}</p>
            <p>In Stock: {item?.amount}</p>
          </div>
          <div className={styles.itemInfoCol}>
            <p>
              Created On: {item?.date_created} {item?.time_created}
            </p>
            <p>
              Last Modified: {item?.date_modified} {item?.time_modified}
            </p>
          </div>
        </div>

        <p className={styles.itemDescription}>{item?.description}</p>
      </div>
    </section>
  );
}

export default ItemDetails;

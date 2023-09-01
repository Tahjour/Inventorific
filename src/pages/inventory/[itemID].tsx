import ItemDetails from "@/components/layout/app/item-details/item-details";
import Loader from "@/components/ui/loading/loader";
import { useUserInfoContext } from "@/context/user-context";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { Fragment } from "react";

export default function ItemDetailsPage() {
  const router = useRouter();
  const { itemID } = router.query;
  const id = itemID as string;

  const { getUserItem } = useUserInfoContext();
  const item = getUserItem(id);

  return (
    <Fragment>
      <AnimatePresence mode="wait">
        {!item && <Loader message="Loading item info..." />}
      </AnimatePresence>
      {item && <ItemDetails item={item} />}
    </Fragment>
  );
}

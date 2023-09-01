import { useContext, useEffect, useRef } from "react";
import styles from "./user-type.module.css";
import Link from "next/link";
import { ItemsContext } from "../../context/ItemsContext";

function UserTypeSelect() {
    const itemsContext = useContext(ItemsContext);
    const buyerRef = useRef(null);
    const sellerRef = useRef(null);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === "ArrowLeft") {
                buyerRef.current.focus();
            } else if (e.key === "ArrowRight") {
                sellerRef.current.focus();
            }
        };

        document.addEventListener("keydown", handleKeyPress);
        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, []);

    return (
        <section className={styles.userTypeBox}>
            <Link
                href={`/${itemsContext.loginMode}`}
                className={styles.userType}
                role="button"
                tabIndex="0"
                ref={buyerRef}
            >
                Buyer
            </Link>
            <Link
                href={`/${itemsContext.loginMode}`}
                className={styles.userType}
                role="button"
                tabIndex="0"
                ref={sellerRef}
            >
                Seller
            </Link>
        </section>
    );
}

export default UserTypeSelect;

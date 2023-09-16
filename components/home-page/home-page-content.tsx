import Link from "next/link";
export default function HomePageContent() {
  return (
    <section className={"homePageContentBox"}>
      <div className={"homePageIntroBox"}>
        <h1>Inventorific</h1>
        <p style={{ margin: 10 }}>An inventory control manager</p>
        <Link href={"/inventory"} className={"homePageLaunchLink"}>
          Launch
        </Link>
      </div>
    </section>
  );
}

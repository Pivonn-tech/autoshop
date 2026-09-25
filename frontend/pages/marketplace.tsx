import Head from "next/head";
import Cars360Header from "../components/Cars360Header";
import Cars360Listing from "../components/Cars360Listing";
import Cars360Footer from "../components/Cars360Footer";

export default function MarketplacePage() {
  return (
    <>
      <Head>
        <title>CARS360 - Kenya's Largest Car Marketplace</title>
        <meta name="description" content="Browse thousands of vehicles, parts, and services on Kenya's largest car marketplace. Find your perfect car today." />
      </Head>

      <Cars360Header />
      <Cars360Listing />
      <Cars360Footer />
    </>
  );
}

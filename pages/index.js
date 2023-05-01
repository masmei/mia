import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName,
          companyDescription,
          productDescription,
          targetAudience,
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Head>
        <title>MIA: Marketing Ideation App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>MIA: Marketing Ideation App</h1>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="companyName"
            placeholder="Enter Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <textarea
            name="companyDescription"
            placeholder="Enter Company Description"
            value={companyDescription}
            onChange={(e) => setCompanyDescription(e.target.value)}
          />
          <textarea
            name="productDescription"
            placeholder="Enter Product Description"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
          />
          <input
            type="text"
            name="targetAudience"
            placeholder="Enter Target Audience"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
          />
          <input type="submit" value="Generate" disabled={loading} />
        </form>
        {loading ? (
          <div className={styles.loader}></div>
        ) : (
          <div className={styles.result}>{result}</div>
        )}
      </main>
    </div>
  );
}

import Link from "next/link";
import styles from "./BlogSidebar.module.css";

// Dummy data
const categories = [
    { name: "Web Development", count: 12 },
    { name: "Grafički Dizajn", count: 8 },
    { name: "Digitalni Marketing", count: 15 },
    { name: "SEO", count: 6 },
    { name: "Tehnologija", count: 10 },
];

const recentPosts = [
    {
        title: "5 Trendova u Web Dizajnu za 2024.",
        slug: "5-trendova-web-dizajn-2024",
        date: "12. Jan 2024",
    },
    {
        title: "Kako Poboljšati SEO Vašeg Sajta",
        slug: "kako-poboljsati-seo",
        date: "05. Jan 2024",
    },
    {
        title: "Zašto vam je potreban Custom Softver?",
        slug: "zasto-custom-softver",
        date: "28. Dec 2023",
    },
];

export default function BlogSidebar() {
    return (
        <aside className={styles.sidebar}>
            {/* Search */}
            <div className={styles.widget}>
                <h3 className={styles.title}>Pretraga</h3>
                <div className={styles.searchBox}>
                    <input
                        type="text"
                        placeholder="Pretraži..."
                        className={styles.searchInput}
                    />
                    <button className={styles.searchButton}>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Categories */}
            <div className={styles.widget}>
                <h3 className={styles.title}>Kategorije</h3>
                <ul className={styles.categoryList}>
                    {categories.map((cat) => (
                        <li key={cat.name} className={styles.categoryItem}>
                            <Link href={`/blog/category/${cat.name.toLowerCase().replace(/ /g, "-")}`} className={styles.categoryLink}>
                                {cat.name}
                            </Link>
                            <span className={styles.count}>({cat.count})</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Recent Posts */}
            <div className={styles.widget}>
                <h3 className={styles.title}>Nedavne Objave</h3>
                <ul className={styles.recentList}>
                    {recentPosts.map((post) => (
                        <li key={post.slug} className={styles.recentItem}>
                            <Link href={`/blog/${post.slug}`} className={styles.recentLink}>
                                {post.title}
                            </Link>
                            <span className={styles.date}>{post.date}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Newsletter */}
            <div className={`${styles.widget} ${styles.newsletter}`}>
                <h3 className={styles.title}>Newsletter</h3>
                <p className={styles.text}>
                    Prijavite se za najnovije vesti i savete direktno u inbox.
                </p>
                <input
                    type="email"
                    placeholder="Vaša email adresa"
                    className={styles.input}
                />
                <button className={styles.subscribeButton}>Prijavi se</button>
            </div>
        </aside>
    );
}

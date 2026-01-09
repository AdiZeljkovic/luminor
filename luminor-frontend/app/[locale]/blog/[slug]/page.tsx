import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";
import BlogSidebar from "@/components/BlogSidebar";
import styles from "./page.module.css";

const getPostData = (slug: string) => {
    return {
        title: "5 trendova u Web Dizajnu za 2024.",
        content: `
      <p class="lead">Web dizajn se neprestano menja. Ono što je bilo moderno prošle godine, danas može izgledati zastarelo. U ovom tekstu istražujemo 5 ključnih trendova koji će oblikovati internet u 2024. godini.</p>
      
      <h2>1. Bento Grid Layout</h2>
      <p>Inspirisan Apple-ovim promotivnim materijalima i dashboard interfejsima, Bento Grid (ili bento kutija) postaje sve popularniji. Ovaj stil karakteriše podela sadržaja u pravougaone blokove različitih veličina, što omogućava prikazivanje velike količine informacija na organizovan i vizuelno privlačan način.</p>
      
      <h2>2. Kinetička Tipografija</h2>
      <p>Tekst više nije samo statičan. Kinetička tipografija podrazumeva animirani tekst koji se kreće, menja veličinu ili boju na scroll ili hover. Ovo daje dinamiku sajtu i drži pažnju korisnika.</p>
      
      <h2>3. Mikro-interakcije</h2>
      <p>Dugmad koja reaguju na prelazak miša, subtle loading animacije i interaktivni elementi čine sajt "živim". Ovi mali detalji značajno doprinose boljem korisničkom iskustvu (UX).</p>
      
      <h2>4. AI-Generisane Slike</h2>
      <p>Sa napretkom alata kao što su Midjourney i DALL-E, sve više sajtova koristi originalne, AI-generisane ilustracije umesto generičkih stock fotografija. Ovo omogućava unikatnost brenda po znatno nižoj ceni.</p>
      
      <h2>5. Održivi Web Dizajn</h2>
      <p>Fokus na smanjenje digitalnog "ugljeničnog otiska". Ovo podrazumeva optimizaciju slika, korišćenje sistemskih fontova i dark mode opcije radi uštede energije na OLED ekranima.</p>
      
      <h3>Zaključak</h3>
      <p>Iako je važno pratiti trendove, zapamtite da je funkcionalnost uvek na prvom mestu. Dobar dizajn treba da služi svrsi i rešava probleme korisnika, a ne samo da izgleda lepo.</p>
    `,
        date: "12. Jan 2024",
        author: {
            name: "Marko Petrović",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            description: "Senior Frontend Developer sa 10 godina iskustva u kreiranju modernih web aplikacija."
        },
        image: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        category: "Web Dizajn",
        readTime: 5,
        tags: ["dizajn", "trendovi", "2024", "ux", "ui"]
    };
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = getPostData(params.slug);

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.contentWrapper}>
                    {/* Main Content */}
                    <div className={styles.mainContent}>
                        <AnimatedSection>
                            <article className={styles.article}>

                                {/* Header */}
                                <header className={styles.header}>
                                    <div className={styles.meta}>
                                        <span className={styles.category}>
                                            {post.category}
                                        </span>
                                        <span>{post.date}</span>
                                        <span>•</span>
                                        <span>{post.readTime} min čitanja</span>
                                    </div>

                                    <h1 className={styles.title}>
                                        {post.title}
                                    </h1>

                                    <div className={styles.author}>
                                        <Image
                                            src={post.author.avatar}
                                            alt={post.author.name}
                                            width={48}
                                            height={48}
                                            className={styles.authorImage}
                                        />
                                        <div>
                                            <div className={styles.authorName}>{post.author.name}</div>
                                            <div className={styles.authorRole}>Autor</div>
                                        </div>
                                    </div>
                                </header>

                                {/* Featured Image */}
                                <div className={styles.featuredImage}>
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>

                                {/* Content */}
                                <div
                                    className={`${styles.content} prose prose-lg max-w-none text-gray-600 prose-headings:font-display prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-yellow-600 hover:prose-a:text-yellow-700`}
                                    dangerouslySetInnerHTML={{ __html: post.content }}
                                >
                                </div>

                                {/* Tags */}
                                <div className={styles.tagsSection}>
                                    <h3 className={styles.tagsTitle}>Tagovi:</h3>
                                    <div className={styles.tagsList}>
                                        {post.tags.map(tag => (
                                            <Link
                                                key={tag}
                                                href={`/blog/tag/${tag}`}
                                                className={styles.tag}
                                            >
                                                #{tag}
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Author Box */}
                                <div className={styles.authorBox}>
                                    <Image
                                        src={post.author.avatar}
                                        alt={post.author.name}
                                        width={64}
                                        height={64}
                                        className={styles.authorBoxImage}
                                    />
                                    <div>
                                        <h4 className={styles.authorBoxName}>O Autoru</h4>
                                        <p className={styles.authorBoxDesc}>
                                            {post.author.description}
                                        </p>
                                    </div>
                                </div>

                            </article>
                        </AnimatedSection>
                    </div>

                    {/* Sidebar */}
                    <div className={styles.sidebarWrapper}>
                        <BlogSidebar />
                    </div>
                </div>
            </div>
        </div>
    );
}

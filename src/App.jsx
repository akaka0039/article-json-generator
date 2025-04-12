import { useState } from "react";

function App() {
  const [title, setTitle] = useState("海外就職に有利な資格と経験");
  const [subtitle, setSubtitle] = useState(
    "資格と経験を持ち合わせて、海外挑戦を成功させよう"
  );
  const [slug, setSlug] = useState("overseas-jobs");
  const [datePublished, setDatePublished] = useState("2025-03-27");
  const [author, setAuthor] = useState("Your Name");
  const [publisher, setPublisher] = useState("Your Blog Name");
  const [image, setImage] = useState("/image/article/1_article_image.jpeg");

  const generateAndDownloadJSON = () => {
    const jsonData = {
      [slug]: {
        id: 1,
        slug,
        title,
        subtitle,
        datePublished,
        dateModified: datePublished,
        image,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "Article",
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://red-look.com/ja/articles/${slug}.html`,
          },
          headline: title,
          description: subtitle,
          image: `https://red-look.com${image}`,
          author: {
            "@type": "Person",
            name: author,
          },
          publisher: {
            "@type": "Organization",
            name: publisher,
            logo: {
              "@type": "ImageObject",
              url: "https://red-look.com/image/Red_Look_main_image.png",
            },
          },
          datePublished,
          dateModified: datePublished,
        },
        toc: [],
        introduction: "",
        sections: [],
      },
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow space-y-4">
        <h1 className="text-2xl font-bold text-center mb-4">
          記事データ作成フォーム
        </h1>

        <label className="block">
          <span className="text-gray-700">スラッグ</span>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
          />
        </label>

        <label className="block">
          <span className="text-gray-700">タイトル</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
          />
        </label>

        <label className="block">
          <span className="text-gray-700">サブタイトル</span>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
          />
        </label>

        <label className="block">
          <span className="text-gray-700">公開日</span>
          <input
            type="date"
            value={datePublished}
            onChange={(e) => setDatePublished(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
          />
        </label>

        <label className="block">
          <span className="text-gray-700">画像パス</span>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
          />
        </label>

        <label className="block">
          <span className="text-gray-700">著者</span>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
          />
        </label>

        <label className="block">
          <span className="text-gray-700">発行者</span>
          <input
            type="text"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
          />
        </label>

        <button
          onClick={generateAndDownloadJSON}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          JSONを出力してダウンロード
        </button>
      </div>
    </div>
  );
}

export default App;

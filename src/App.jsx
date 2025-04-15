import { useState, useEffect } from "react";
import KeywordForm from "./KeywordForm";

function App() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [slug, setSlug] = useState("");

  const [lang, setLang] = useState("en");

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  const [datePublished, setDatePublished] = useState(formattedDate);
  const [author, setAuthor] = useState("Red look");
  const [publisher, setPublisher] = useState("Red look");
  const [image, setImage] = useState("");
  const [toc, setToc] = useState([]);

  const [introduction, setIntroduction] = useState("");

  const [sections, setSections] = useState([]);
  const [conclusion, setConclusion] = useState("");
  const [newSection, setNewSection] = useState({
    title: "",
    slug: "",
    content: "",
    bulletPoints: [],
    bulletInput: { title: "", description: "" },
    summary: "",
  });
  const [keywords, setKeywords] = useState([]);

  const handleKeywordsChange = (newKeywords) => {
    setKeywords(newKeywords);
  };

  const generateAndDownloadJSON = () => {
    const jsonData = {
      slug,
      title,
      subtitle,
      keywords: keywords,
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
        image: `https://red-look.com/image/article/${image}`,
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
          url: "https://red-look.com/",
        },
        datePublished,
        dateModified: datePublished,
        keywords: keywords,
        inLanguage: lang,
      },
      toc,
      introduction,
      sections,
      conclusion,
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

  const addBulletPoint = () => {
    const { bulletInput } = newSection;
    if (bulletInput.title && bulletInput.description) {
      setNewSection({
        ...newSection,
        bulletPoints: [...newSection.bulletPoints, bulletInput],
        bulletInput: { title: "", description: "" },
      });
    }
  };

  const handleLangChange = (e) => {
    setLang(e.target.value);
  };

  const addSection = () => {
    if (newSection.title && newSection.slug && newSection.content) {
      // まずセクション追加
      setSections([
        ...sections,
        {
          title: newSection.title,
          slug: newSection.slug,
          content: newSection.content,
          bulletPoints: newSection.bulletPoints,
          summary: newSection.summary,
        },
      ]);

      setToc([
        ...toc,
        {
          title: newSection.title,
          slug: newSection.slug,
        },
      ]);

      setNewSection({
        title: "",
        slug: "",
        content: "",
        bulletPoints: [],
        bulletInput: { title: "", description: "" },
        summary: "",
      });
    }
  };

  const getCurrentData = () => {
    return {
      [slug]: {
        slug,
        title,
        subtitle,
        keywords: keywords,
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
          image: `https://red-look.com/image/article/${image}`,
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
            url: "https://red-look.com/",
          },
          datePublished,
          dateModified: datePublished,
          keywords: keywords,
          inLanguage: lang,
        },
        toc,
        introduction,
        sections,
        conclusion,
      },
    };
  };

  useEffect(() => {
    const storageKey = "articleDraft";

    const handleBeforeUnload = (event) => {
      const currentData = getCurrentData();
      localStorage.setItem(storageKey, JSON.stringify(currentData));
      event.preventDefault();
      event.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData[slug]) {
          const data = parsedData[slug];
          setTitle(data.title || "");
          setSubtitle(data.subtitle || "");
          setDatePublished(data.datePublished || formattedDate);
          setImage(data.image || "");
          setAuthor(data.author || "Red look");
          setPublisher(data.publisher || "Red look");
          setKeywords(data.jsonLd.keywords || []);
          setLang(data.jsonLd.inLanguage || "en");
          setToc(data.toc || []);
          setIntroduction(data.introduction || "");
          setSections(data.sections || []);
          setConclusion(data.conclusion || "");

          if (
            window.confirm("保存されたデータが見つかりました。復元しますか？")
          ) {
            localStorage.removeItem(storageKey); // 復元成功したら削除
          } else {
            // 復元しない場合は、ローカルストレージのデータを残すか、削除するかは要検討
            // 例: localStorage.removeItem(storageKey); // 削除する場合
          }
        } else {
          localStorage.removeItem(storageKey); // slug が一致しない場合は削除
        }
      } catch (error) {
        console.error("ローカルストレージのデータ解析エラー:", error);
        localStorage.removeItem(storageKey); // 解析に失敗したら削除
      }
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [slug, formattedDate]);

  return (
    <>
      {" "}
      <div className="min-h-screen bg-gray-100 p-6 flex gap-4">
        <div className="w-2/3 bg-white p-6 rounded-xl shadow space-y-4 overflow-y-auto max-h-screen">
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
            <span className="text-gray-700">言語</span>
            <select
              value={lang}
              onChange={handleLangChange}
              className="mt-1 block w-full border rounded p-2"
            >
              <option value="ja">日本語 (ja)</option>
              <option value="en">英語 (en)</option>
            </select>
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
            <span className="text-gray-700">画像の名前</span>
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

          <div className="mb-4">
            <div>
              <KeywordForm
                onKeywordsChange={handleKeywordsChange}
                initialKeywords={keywords}
              />
            </div>
          </div>

          <div className="max-w-3xl mx-auto p-4 space-y-6">
            <h2 className="text-xl font-bold">導入文</h2>
            <textarea
              className="border p-2 w-full h-24 rounded"
              placeholder="記事の導入文を入力"
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
            />

            <h2 className="text-xl font-bold">セクション</h2>
            <div className="space-y-2">
              <input
                type="text"
                className="border p-2 w-full rounded"
                placeholder="セクションタイトル"
                value={newSection.title}
                onChange={(e) =>
                  setNewSection({ ...newSection, title: e.target.value })
                }
              />
              <input
                type="text"
                className="border p-2 w-full rounded"
                placeholder="スラッグ"
                value={newSection.slug}
                onChange={(e) =>
                  setNewSection({ ...newSection, slug: e.target.value })
                }
              />
              <textarea
                className="border p-2 w-full h-24 rounded"
                placeholder="本文"
                value={newSection.content}
                onChange={(e) =>
                  setNewSection({ ...newSection, content: e.target.value })
                }
              />

              <h3 className="text-md font-semibold">箇条書きポイント</h3>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  className="border p-2  rounded"
                  placeholder="タイトル"
                  value={newSection.bulletInput.title}
                  onChange={(e) =>
                    setNewSection({
                      ...newSection,
                      bulletInput: {
                        ...newSection.bulletInput,
                        title: e.target.value,
                      },
                    })
                  }
                />
                <textarea
                  type="text"
                  className="border p-2  rounded"
                  placeholder="説明"
                  value={newSection.bulletInput.description}
                  onChange={(e) =>
                    setNewSection({
                      ...newSection,
                      bulletInput: {
                        ...newSection.bulletInput,
                        description: e.target.value,
                      },
                    })
                  }
                />
                <button
                  className="w-1/2 bg-green-500 text-white px-4 rounded"
                  onClick={addBulletPoint}
                >
                  +
                </button>
              </div>
              <ul className="list-disc ml-5">
                {newSection.bulletPoints.map((bp, idx) => (
                  <li className="truncate" key={idx}>
                    {bp.title} - {bp.description}
                  </li>
                ))}
              </ul>

              <h3 className="text-md font-semibold">Summary</h3>
              <textarea
                className="border p-2 w-full h-24 rounded"
                placeholder="summary"
                value={newSection.summary}
                onChange={(e) =>
                  setNewSection({ ...newSection, summary: e.target.value })
                }
              />

              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={addSection}
              >
                セクション追加
              </button>
            </div>

            <h2 className="text-xl font-bold">結論</h2>
            <div className="flex flex-col gap-2">
              <textarea
                rows="6"
                className="border p-2 rounded"
                placeholder="内容"
                value={conclusion}
                onChange={(e) => setConclusion(e.target.value)}
              />
            </div>
            <button
              onClick={generateAndDownloadJSON}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              JSONを出力してダウンロード
            </button>
          </div>
        </div>

        <div className="w-1/3 sticky top-6 h-fit bg-white p-4 rounded-xl shadow overflow-y-auto max-h-screen">
          <h2 className="text-xl font-bold mb-2">JSONプレビュー</h2>
          <pre className="text-sm bg-gray-100 p-3 rounded overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(
              {
                id: 1,
                slug,
                title,
                subtitle,
                keywords: keywords,
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

                  keywords: keywords,
                  inLanguage: lang,
                },
                toc,
                introduction,
                sections,
                conclusion: conclusion,
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </>
  );
}

export default App;

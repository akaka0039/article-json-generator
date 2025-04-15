import React, { useState } from "react";

const KeywordForm = ({ onKeywordsChange, initialKeywords = [] }) => {
  const [keywords, setKeywords] = useState([...initialKeywords]);
  const [newKeyword, setNewKeyword] = useState("");

  const handleInputChange = (e) => {
    setNewKeyword(e.target.value);
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim() !== "") {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword("");
      if (onKeywordsChange) {
        onKeywordsChange([...keywords, newKeyword.trim()]);
      }
    }
  };

  const handleRemoveKeyword = (index) => {
    const updatedKeywords = keywords.filter((_, i) => i !== index);
    setKeywords(updatedKeywords);
    if (onKeywordsChange) {
      onKeywordsChange(updatedKeywords);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        キーワード
      </label>
      <div className="flex items-center mb-2">
        <input
          type="text"
          value={newKeyword}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="新しいキーワード"
        />
        <button
          type="button"
          onClick={handleAddKeyword}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2 focus:outline-none focus:shadow-outline"
        >
          追加
        </button>
      </div>
      {keywords.length > 0 && (
        <div className="flex flex-wrap">
          {keywords.map((keyword, index) => (
            <span
              key={index}
              className="inline-flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
            >
              {keyword}
              <button
                type="button"
                onClick={() => handleRemoveKeyword(index)}
                className="flex-shrink-0 ml-2 -mr-1 w-4 h-4 text-gray-400 hover:text-gray-500 focus:outline-none focus:shadow-outline"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default KeywordForm;

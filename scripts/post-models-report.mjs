// scripts/post-models-report.mjs

import fetch from "node-fetch";

async function main() {
  console.log("=== Post Models Report ===");

  // OpenAI API キーを環境変数から読み込み
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("❌ OPENAI_API_KEY が設定されていません");
    process.exit(1);
  }

  try {
    // OpenAI Models API にリクエスト
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    const data = await response.json();
    console.log("✅ モデル一覧を取得しました:", data);
  } catch (err) {
    console.error("❌ API 呼び出しに失敗:", err);
    process.exit(1);
  }
}

main();

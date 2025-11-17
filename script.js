/* 基本スタイル */
body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif;
    margin: 0;
    background-color: #f4f7f6;
    color: #333;
}

header {
    background-color: #005a9c; /* 医療系のクリーンなブルー */
    color: white;
    padding: 20px 40px;
    text-align: center;
}

header h1 {
    margin: 0;
}

main {
    padding: 20px;
    max-width: 1200px;
    margin: 20px auto;
}

.user-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    margin-bottom: 20px;
}

/* ダッシュボードのグリッドレイアウト */
.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 20px;
}

.chart-container {
    background-color: #ffffff;
    padding: 25px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
}

.chart-container h2 {
    margin-top: 0;
    color: #005a9c;
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 10px;
}

/* ボタン */
button#showSurveyBtn {
    background-color: #e60012; /* 注意を引く赤系 */
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}
button#showSurveyBtn:hover {
    background-color: #c00010;
}

/* モーダル (サーベイ) */
.modal {
    display: none; /* 初期状態は非表示 */
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.6);
}

.modal-content {
    background-color: #fefefe;
    margin: 10% auto;
    padding: 30px;
    border: 1px solid #888;
    width: 80%;
    max-width: 600px;
    border-radius: 10px;
    position: relative;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.close-btn {
    color: #aaa;
    position: absolute;
    top: 15px;
    right: 25px;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
}
.close-btn:hover,
.close-btn:focus {
    color: black;
}

/* フォーム */
.form-group {
    margin-bottom: 20px;
}
.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
}
.form-group select {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border-radius: 5px;
    border: 1px solid #ccc;
}

.submit-btn {
    background-color: #007b43; /* 信頼感のある緑 */
    color: white;
    padding: 12px 25px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    font-weight: bold;
    width: 100%;
}
.submit-btn:hover {
    background-color: #005a30;
}

/* ★ 修正点2: 比較ボタンのスタイルを追加 ★ */
.toggle-buttons {
    margin-top: 20px;
    text-align: center;
}

.toggle-btn {
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;
}
.toggle-btn:hover {
    background-color: #e0e0e0;
}

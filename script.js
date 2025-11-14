// ページの読み込みが完了したら実行
document.addEventListener('DOMContentLoaded', () => {

    // グラフのインスタンスをグローバルに保持
    let physicalLoadChart;
    let psychologicalLoadChart;

    // チャート描画のコンテキストを取得
    const physicalCtx = document.getElementById('physicalLoadChart').getContext('2d');
    const psychologicalCtx = document.getElementById('psychologicalLoadChart').getContext('2d');

    // --- モジュール1: 物理的負荷ダッシュボード ---
    // (デモ用の初期データ)
    const physicalLoadData = {
        labels: ['身体的負荷 (患者ケア等)', '管理的負荷 (カルテ記入等)', 'その他 (休憩・移動等)'],
        datasets: [{
            label: '業務負荷の割合',
            // このデータが設計書の「効率化」を示します
            // 「管理的負荷」が先月より減り、「その他（休憩）」が増えている、というデモ
            // ★修正点1: デモ用のデータを追加 (例: 50%, 20%, 30%)
            data: [50, 20, 30],
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)', // 身体的
                'rgba(54, 162, 235, 0.8)', // 管理的
                'rgba(75, 192, 192, 0.8)'  // その他
            ],
            borderColor: '#fff',
            borderWidth: 2
        }]
    };

    // 物理負荷グラフ（ドーナツチャート）を描画
    function renderPhysicalChart() {
        physicalLoadChart = new Chart(physicalCtx, {
            type: 'doughnut',
            data: physicalLoadData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            // ★修正点2: ご指摘いただいたエラー箇所を修正 (修正済みでした)
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    // dataに [50, 20, 30] が入っている場合、
                                    // context.parsed は 50 などの数値になります。
                                    label += context.parsed + '%';
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    // --- モジュール3: 心理的負荷ダッシュボード ---
    // (初期状態のデータ)
    const psychologicalLoadData = {
        labels: ['職場のサポート', '業務の評価', 'ストレスレベル (低いほど良い)'],
        datasets: [{
            label: 'あなたのウェルビーイング',
            // ★修正点3: 初期値を0に設定
            data: [0, 0, 0],
            fill: true,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            pointBackgroundColor: 'rgb(54, 162, 235)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(54, 162, 235)'
        }]
    };

    // 心理的負荷グラフ（レーダーチャート）を描画
    function renderPsychologicalChart() {
        psychologicalLoadChart = new Chart(psychologicalCtx, {
            type: 'radar',
            data: psychologicalLoadData,
            options: {
                responsive: true,
                // スケールを0から5に固定
                scales: {
                    r: {
                        beginAtZero: true,
                        min: 0,
                        max: 5,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // --- モジュール2: パルスサーベイ (モーダル制御) ---
    const modal = document.getElementById('surveyModal');
    const showBtn = document.getElementById('showSurveyBtn');
    // ★修正点4: getElementsByClassNameは配列を返すため、最初の要素[0]を取得
    const closeBtn = document.getElementsByClassName('close-btn')[0];

    // 「回答」ボタンを押したらモーダル表示
    showBtn.onclick = () => {
        modal.style.display = 'block';
    }
    // 「×」ボタンでモーダル非表示
    // (closeBtnがnullでないかチェックするとより安全ですが、ここでは修正指示に基づき[0]のみ指定)
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = 'none';
        }
    }
    // モーダルの外側をクリックしても非表示
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // --- サーベイの「送信」処理 ---
    const form = document.getElementById('pulseSurveyForm');
    form.onsubmit = (event) => {
        event.preventDefault(); // ページ遷移を防ぐ

        // フォームから値を取得 (数値に変換)
        const q1Value = parseInt(document.getElementById('q1').value);
        const q2Value = parseInt(document.getElementById('q2').value);
        // Q3 (ストレス)はスコアを反転させる (5(高い) -> 1(低い), 1(低い) -> 5(高い))
        const q3Value = 6 - parseInt(document.getElementById('q3').value);

        // ★★★
        // ここがMVPの核心です
        // 取得した値で、モジュール3のグラフデータを更新
        // ★★★
        // ★修正点5: 0番目のdatasetを指定
        psychologicalLoadChart.data.datasets[0].data = [q1Value, q2Value, q3Value];
        psychologicalLoadChart.update(); // グラフを再描画

        // モーダルを閉じ、ボタンを非表示にする
        modal.style.display = 'none';
        showBtn.style.display = 'none'; // 回答済みのため非表示
        
        // メッセージを更新
        document.querySelector('#psychological-load p').textContent = 'サーベイへのご協力、ありがとうございました。あなたの最新のウェルビーイング状態が反映されました。';
    };


    // --- 初期化 ---
    // ページ読み込み時に両方のグラフを初期描画
    renderPhysicalChart();
    renderPsychologicalChart();

});
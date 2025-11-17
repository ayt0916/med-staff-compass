document.addEventListener('DOMContentLoaded', () => {

    // --- チャートのインスタンス ---
    let physicalLoadChartCurrent, physicalLoadChartPrevious, psychologicalLoadChart;
    let adminLoadChartCurrent, adminLoadChartPrevious, adminWellbeingChart;

    // --- DOM要素 ---
    const physicalCtxCurrent = document.getElementById('physicalLoadChartCurrent').getContext('2d');
    const physicalCtxPrevious = document.getElementById('physicalLoadChartPrevious').getContext('2d');
    const psychologicalCtx = document.getElementById('psychologicalLoadChart').getContext('2d');
    const adminLoadCtxCurrent = document.getElementById('adminLoadChartCurrent').getContext('2d');
    const adminLoadCtxPrevious = document.getElementById('adminLoadChartPrevious').getContext('2d');
    const adminWellbeingCtx = document.getElementById('adminWellbeingChart').getContext('2d');
    // ★挨拶文の要素
    const userGreetingEl = document.getElementById('userGreeting');


    // --- ★チャートラベル (変更) ---
    const chartLabels = {
        physical: ['身体的負荷 (患者ケアなど)', '管理的負担 (カルテ記入など)', 'その他 (休憩・移動など)'],
        psychological: ['職場のサポート満足度', '業務の評価満足度', 'ノンストレス度']
    };
    
    // (個人) 田中看護師のデータ
    const staffData = {
        physicalLoad: {
            current: [50, 20, 30],
            previous: [55, 30, 15]
        },
        psychologicalLoad: [0, 0, 0] // 初期値
    };

    // (管理者) チーム全体の集計データ
    const adminData = {
         physicalLoad: {
            current: [48, 22, 30],
            previous: [50, 35, 15]
        },
        psychologicalLoad: [3.2, 2.9, 3.8] // チームの平均スコア
    };


    // --- チャート共通設定 ---
    const chartColors = {
        physical: 'rgba(255, 99, 132, 0.8)', // 身体的
        admin: 'rgba(54, 162, 235, 0.8)',   // 管理的
        other: 'rgba(75, 192, 192, 0.8)'    // その他
    };
    
    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom' },
            tooltip: {
                callbacks: {
                    label: (context) => ` ${context.label}: ${context.parsed}%`
                }
            }
        }
    };

    const radarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                beginAtZero: true,
                min: 0,
                max: 5,
                ticks: { stepSize: 1, backdropColor: 'transparent' },
                pointLabels: { fontSize: 14, font: { weight: 'bold' } }
            }
        },
        plugins: {
            legend: { display: false }
        }
    };


    // --- (スタッフ) 物理的負荷ダッシュボード ---
    function renderStaffPhysicalLoadChart() {
        const currentAdminLoad = staffData.physicalLoad.current[1];
        const prevAdminLoad = staffData.physicalLoad.previous[1];
        const adminDiff = currentAdminLoad - prevAdminLoad;
        const currentOtherLoad = staffData.physicalLoad.current[2];
        const prevOtherLoad = staffData.physicalLoad.previous[2];
        const otherDiff = currentOtherLoad - prevOtherLoad;
        
        let summaryHtml = `
            <p class="font-semibold">(個人) 先月との比較:</p>
            <ul class="list-disc list-inside">
                <li><strong>管理的負担:</strong> ${currentAdminLoad}% <span class="font-bold ${adminDiff <= 0 ? 'text-green-600' : 'text-red-600'}">(${adminDiff > 0 ? '+' : ''}${adminDiff}%)</span></li>
                <li><strong>その他(休憩等):</strong> ${currentOtherLoad}% <span class="font-bold ${otherDiff >= 0 ? 'text-green-600' : 'text-red-600'}">(${otherDiff > 0 ? '+' : ''}${otherDiff}%)</span></li>
            </ul>
        `;
        if (adminDiff < 0 && otherDiff > 0) {
            summaryHtml += `<p class="mt-2 font-semibold text-green-700">素晴らしい！管理的負担が削減され、休憩時間が確保できています。</p>`;
        }
        document.getElementById('physicalLoadSummary').innerHTML = summaryHtml;
        
        physicalLoadChartCurrent = new Chart(physicalCtxCurrent, {
            type: 'doughnut',
            data: {
                labels: chartLabels.physical, // ★ラベル変更
                datasets: [{ data: staffData.physicalLoad.current, backgroundColor: [chartColors.physical, chartColors.admin, chartColors.other] }]
            },
            options: doughnutOptions
        });
        
        physicalLoadChartPrevious = new Chart(physicalCtxPrevious, {
            type: 'doughnut',
            data: {
                labels: chartLabels.physical, // ★ラベル変更
                datasets: [{ data: staffData.physicalLoad.previous, backgroundColor: [chartColors.physical, chartColors.admin, chartColors.other] }]
            },
            options: doughnutOptions
        });
    }

    // --- (スタッフ) 心理的負荷ダッシュボード ---
    function renderStaffPsychologicalChart() {
        psychologicalLoadChart = new Chart(psychologicalCtx, {
            type: 'radar',
            data: {
                labels: chartLabels.psychological, // ★ラベル変更
                datasets: [{
                    label: 'あなたのウェルビーイング',
                    data: staffData.psychologicalLoad,
                    fill: true,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgb(54, 162, 235)',
                    pointBackgroundColor: 'rgb(54, 162, 235)',
                }]
            },
            options: radarOptions
        });
    }

    // --- (管理者) 統合ダッシュボード ---
    function renderAdminCharts() {
        const currentAdminLoad = adminData.physicalLoad.current[1];
        const prevAdminLoad = adminData.physicalLoad.previous[1];
        const adminDiff = currentAdminLoad - prevAdminLoad;
        const currentOtherLoad = adminData.physicalLoad.current[2];
        const prevOtherLoad = adminData.physicalLoad.previous[2];
        const otherDiff = currentOtherLoad - prevOtherLoad;
        
        let summaryHtml = `
            <p class="font-semibold">(チーム全体) 先月との比較:</p>
            <ul class="list-disc list-inside">
                <li><strong>管理的負担:</strong> ${currentAdminLoad}% <span class="font-bold ${adminDiff <= 0 ? 'text-green-600' : 'text-red-600'}">(${adminDiff > 0 ? '+' : ''}${adminDiff}%)</span></li>
                <li><strong>その他(休憩等):</strong> ${currentOtherLoad}% <span class="font-bold ${otherDiff >= 0 ? 'text-green-600' : 'text-red-600'}">(${otherDiff > 0 ? '+' : ''}${otherDiff}%)</span></li>
            </ul>
        `;
        if (adminDiff < 0 && otherDiff > 0) {
            summaryHtml += `<p class="mt-2 font-semibold text-green-700">チーム全体で効率化が休憩時間に還元されています。</p>`;
        } else {
            summaryHtml += `<p class="mt-2 font-semibold text-red-700">要注意: チームの効率化が負担軽減に繋がっていません。</p>`;
        }
        document.getElementById('adminLoadSummary').innerHTML = summaryHtml;

        adminLoadChartCurrent = new Chart(adminLoadCtxCurrent, {
            type: 'doughnut',
            data: {
                labels: chartLabels.physical, // ★ラベル変更
                datasets: [{ data: adminData.physicalLoad.current, backgroundColor: [chartColors.physical, chartColors.admin, chartColors.other] }]
            },
            options: doughnutOptions
        });

        adminLoadChartPrevious = new Chart(adminLoadCtxPrevious, {
            type: 'doughnut',
            data: {
                labels: chartLabels.physical, // ★ラベル変更
                datasets: [{ data: adminData.physicalLoad.previous, backgroundColor: [chartColors.physical, chartColors.admin, chartColors.other] }]
            },
            options: doughnutOptions
        });

        adminWellbeingChart = new Chart(adminWellbeingCtx, {
            type: 'radar',
            data: {
                labels: chartLabels.psychological, // ★ラベル変更
                datasets: [{
                    label: 'チームのウェルビーイング (平均)',
                    data: adminData.psychologicalLoad,
                    fill: true,
                    backgroundColor: 'rgba(0, 123, 67, 0.2)', // med-green
                    borderColor: 'rgb(0, 123, 67)',
                    pointBackgroundColor: 'rgb(0, 123, 67)',
                }]
            },
            options: radarOptions
        });
    }


    // --- パルスサーベイ (モーダル制御) ---
    const modal = document.getElementById('surveyModal');
    const showBtn = document.getElementById('showSurveyBtn');
    const closeBtn = document.getElementById('closeSurveyBtn');
    const modalBackdrop = document.querySelector('.modal-backdrop');
    const showModal = () => modal.classList.replace('hidden', 'flex');
    const hideModal = () => modal.classList.replace('flex', 'hidden');
    showBtn.onclick = showModal;
    closeBtn.onclick = hideModal;
    modalBackdrop.onclick = hideModal;

    // --- サーベイの「送信」処理 ---
    const form = document.getElementById('pulseSurveyForm');
    form.onsubmit = (event) => {
        event.preventDefault(); 
        const q1Value = parseInt(document.getElementById('q1').value);
        const q2Value = parseInt(document.getElementById('q2').value);
        // ★「ノンストレス度」に合わせるためスコアを反転
        const q3Value = 6 - parseInt(document.getElementById('q3').value); 

        // (スタッフ) 心理グラフデータを更新
        psychologicalLoadChart.data.datasets[0].data = [q1Value, q2Value, q3Value];
        psychologicalLoadChart.update(); 

        hideModal();
        showBtn.style.display = 'none'; 
        document.getElementById('psychologicalLoadSummary').textContent = 'サーベイへのご協力、ありがとうございました。あなたの最新のウェルビーイング状態がチャートに反映されました。';
    };

    // --- ★ビュー切り替え処理 (挨拶文変更を追加) ---
    const viewToggle = document.getElementById('viewToggle');
    const staffView = document.getElementById('staff-view');
    const adminView = document.getElementById('admin-view');
    const originalGreeting = userGreetingEl.innerHTML; // 元の挨拶文を記憶

    viewToggle.addEventListener('change', (event) => {
        if (event.target.checked) {
            // 管理者ビュー
            staffView.classList.add('hidden');
            adminView.classList.remove('hidden');
            // 挨拶文を変更
            userGreetingEl.innerHTML = `<strong class="text-med-blue">A病棟 管理者ダッシュボード</strong>`;
            // スタッフ個人用サーベイボタンを非表示
            showBtn.style.display = 'none'; 
        } else {
            // スタッフビュー
            staffView.classList.remove('hidden');
            adminView.classList.add('hidden');
            // 挨拶文を戻す
            userGreetingEl.innerHTML = originalGreeting;
             // サーベイボタンを再表示 (回答済みでなければ)
            if (document.getElementById('psychologicalLoadSummary').textContent.includes('回答すると')) {
                 showBtn.style.display = 'block';
            }
        }
    });


    // --- 初期化 ---
    renderStaffPhysicalLoadChart();
    renderStaffPsychologicalChart();
    renderAdminCharts(); 

});

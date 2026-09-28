/**
 * VIỆT PHỤC REMIX - CULTURAL WIKI & QUIZ ENGINE (NÂNG CẤP TOÀN DIỆN)
 * Bách khoa toàn thư tra cứu nguồn gốc, ý nghĩa Việt Phục,
 * Chuyên mục Giải Mã Hiểu Lầm Văn Hóa (Mythbusters) và Mini Quiz văn hóa
 */

class CulturalWiki {
  constructor(studioManager) {
    window.culturalWiki = this;
    this.studioManager = studioManager;
    this.currentQuizIndex = 0;
    this.quizScore = 0;
    this.initUI();
  }

  initUI() {
    this.renderWikiDirectory();
    this.renderMythbusters();
    this.renderQuizQuestion();

    // Tìm kiếm trong Wiki
    const searchInput = document.getElementById("wikiSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", e => {
        this.filterWiki(e.target.value);
      });
    }

    // Nút làm lại Quiz
    const btnRestartQuiz = document.getElementById("btnRestartQuiz");
    if (btnRestartQuiz) {
      btnRestartQuiz.addEventListener("click", () => {
        this.restartQuiz();
      });
    }
  }

  renderWikiDirectory() {
    const container = document.getElementById("wikiGarmentList");
    if (!container) return;

    container.innerHTML = Object.values(VIET_PHUC_DATA.garments).map(g => `
      <div class="wiki-card" data-wiki-id="${g.id}">
        <div class="wiki-badge">${g.region}</div>
        <h3 class="wiki-name">${g.name}</h3>
        <p class="wiki-era">⏳ ${g.era}</p>
        <p class="wiki-desc">${g.description}</p>
        
        <div class="wiki-cultural-box">
          <strong>Ý NGHĨA BIỂU TRƯNG:</strong>
          <p>${g.culturalMeaning}</p>
        </div>

        <div class="wiki-cut-box">
          <strong>QUY CÁCH MAY MẶC:</strong>
          <p>${g.cutDetails}</p>
        </div>

        <button class="btn-wiki-wear" onclick="window.culturalWiki.wearGarment('${g.id}')">
          Phối Trang Phục Này Ngay 👘
        </button>
      </div>
    `).join("");
  }

  renderMythbusters() {
    const container = document.getElementById("mythbustersContainer");
    if (!container) return;

    const myths = [
      {
        question: "Hiểu lầm 1: Có phải Áo Ngũ Thân chỉ dành cho nam giới?",
        fact: "HOÀN TOÀN SAI! Áo Ngũ Thân là trang phục chuẩn mực của cả nam lẫn nữ thời Nguyễn. Điểm khác biệt là áo nữ thường có cổ cao hơn một chút để giữ sự kín đáo, tay áo may vừa vặn và phụ nữ thường vấn khăn hoặc đội mấn nhung duyên dáng."
      },
      {
        question: "Hiểu lầm 2: Áo Tứ Thân chỉ là áo của phụ nữ nông dân lao động?",
        fact: "CHƯA CHÍNH XÁC! Áo Tứ Thân là trang phục dân tộc Bắc Bộ cổ xưa. Nông dân mặc tứ thân đũi nhuộm bùn, củ nâu mộc mạc; trong khi tiểu thư khuê các, ca nương quan họ mặc áo tứ thân the, lụa ngũ sắc thêu hoa mai cực kỳ đài các và sang quý."
      },
      {
        question: "Hiểu lầm 3: Mặc riêng chiếc Áo Yếm ra đường có phải là truyền thống?",
        fact: "SAI LẦM PHỔ BIẾN! Trong phong tục Việt Nam, chiếc Yếm Đào là nội y lót bên trong bảo vệ cơ thể. Người phụ nữ xưa ra khỏi nhà bắt buộc phải khoác áo Tứ Thân hoặc áo Cánh bên ngoài để giữ trọn vẹn nét đoan trang kín đáo của người phụ nữ Việt."
      },
      {
        question: "Hiểu lầm 4: Cài vạt áo bên nào cũng được tùy tay thuận?",
        fact: "CỰC KỲ TAI HẠI! Toàn bộ hệ thống cổ phục Việt (và Á Đông cổ truyền) tuân theo quy tắc 'Hữu nhậm' (vạt phải đè vạt trái). Nếu cài ngược 'Tả nhậm' (vạt trái đè vạt phải) thời xưa chỉ dùng cho trang phục người mất hoặc lúc đại tang!"
      }
    ];

    container.innerHTML = myths.map(m => `
      <div class="myth-card">
        <div class="myth-question">❓ ${m.question}</div>
        <div class="myth-fact">💡 <strong>GIẢI MÃ LỊCH SỬ:</strong> ${m.fact}</div>
      </div>
    `).join("");
  }

  filterWiki(keyword) {
    const q = keyword.toLowerCase().trim();
    document.querySelectorAll(".wiki-card").forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(q) ? "block" : "none";
    });
  }

  wearGarment(garmentId) {
    if (this.studioManager) {
      this.studioManager.currentOutfit.garment = garmentId;
      const defColor = VIET_PHUC_DATA.garments[garmentId].defaultColor;
      if (defColor) this.studioManager.currentOutfit.colorHex = defColor;
      this.studioManager.updateStudio();

      if (window.switchTab) window.switchTab("studioTab");
      if (window.soundEngine) window.soundEngine.playPluck();
      if (window.showToast) window.showToast(`Đã chọn ${VIET_PHUC_DATA.garments[garmentId]?.name} vào Xưởng Phối Đồ!`, "success");
    }
  }

  // --- MINI QUIZ VĂN HÓA GEN Z ---
  renderQuizQuestion() {
    const qBox = document.getElementById("quizBox");
    if (!qBox) return;

    const questions = VIET_PHUC_DATA.quizQuestions;
    if (this.currentQuizIndex >= questions.length) {
      this.renderQuizCompletion();
      return;
    }

    const q = questions[this.currentQuizIndex];
    qBox.innerHTML = `
      <div class="quiz-progress-text">Câu hỏi ${this.currentQuizIndex + 1} / ${questions.length}</div>
      <div class="quiz-question-title">${q.question}</div>
      
      <div class="quiz-options-list">
        ${q.options.map((opt, idx) => `
          <button class="quiz-opt-btn" onclick="window.culturalWiki.handleAnswer(${idx})">
            <span class="opt-letter">${String.fromCharCode(65 + idx)}</span>
            <span class="opt-text">${opt}</span>
          </button>
        `).join("")}
      </div>

      <div id="quizFeedbackBox" class="quiz-feedback" style="display:none;"></div>
    `;
  }

  handleAnswer(selectedIdx) {
    const q = VIET_PHUC_DATA.quizQuestions[this.currentQuizIndex];
    const feedbackBox = document.getElementById("quizFeedbackBox");
    const btns = document.querySelectorAll(".quiz-opt-btn");

    btns.forEach(b => b.disabled = true);

    if (selectedIdx === q.correctIndex) {
      this.quizScore++;
      btns[selectedIdx].classList.add("correct");
      if (window.soundEngine) window.soundEngine.playChime();
      feedbackBox.innerHTML = `
        <div class="fb-title correct">🎉 CHÍNH XÁC!</div>
        <p>${q.explanation}</p>
        <button class="btn-primary-glow small" onclick="window.culturalWiki.nextQuestion()">Câu Tiếp Theo ➔</button>
      `;
    } else {
      btns[selectedIdx].classList.add("incorrect");
      btns[q.correctIndex].classList.add("correct");
      feedbackBox.innerHTML = `
        <div class="fb-title incorrect">Chưa đúng rồi!</div>
        <p>${q.explanation}</p>
        <button class="btn-primary-glow small" onclick="window.culturalWiki.nextQuestion()">Câu Tiếp Theo ➔</button>
      `;
    }

    feedbackBox.style.display = "block";
  }

  nextQuestion() {
    this.currentQuizIndex++;
    this.renderQuizQuestion();
  }

  renderQuizCompletion() {
    const qBox = document.getElementById("quizBox");
    if (!qBox) return;

    const total = VIET_PHUC_DATA.quizQuestions.length;
    const isMaster = this.quizScore === total;

    qBox.innerHTML = `
      <div class="quiz-result-card animate-fade-in">
        <div class="trophy-icon">${isMaster ? "🏆" : "🎖️"}</div>
        <h3>CHÚC MỪNG BẠN ĐÃ HOÀN THÀNH THỬ THÁCH!</h3>
        <p class="quiz-final-score">Điểm số: <strong>${this.quizScore} / ${total}</strong></p>
        
        <div class="badge-awarded">
          <div class="badge-icon">👑</div>
          <div class="badge-info">
            <h4>${isMaster ? 'GEN Z ĐẠI SỨ DI SẢN VIỆT PHỤC' : 'TÂN BINH VIỆT PHỤC KHÁM PHÁ'}</h4>
            <p>${isMaster ? 'Bạn nắm vững tri thức văn hóa, sẵn sàng tự tin diện cổ phục đi muôn nơi!' : 'Một khởi đầu tuyệt vời để hiểu thêm về trang phục dân tộc!'}</p>
          </div>
        </div>

        <button class="btn-primary-glow" onclick="window.culturalWiki.restartQuiz()">
          Làm Lại Thử Thách 🔄
        </button>
      </div>
    `;
  }

  restartQuiz() {
    this.currentQuizIndex = 0;
    this.quizScore = 0;
    this.renderQuizQuestion();
  }
}

if (typeof window !== "undefined") {
  window.CulturalWiki = CulturalWiki;
}

/**
 * VIỆT PHỤC REMIX - SMART STYLIST & RECOMMENDER ENGINE (NÂNG CẤP TOÀN DIỆN)
 * Gợi ý 3 phương án phối đồ đa chiều (Cổ Điển, Remix Thời Thượng, Cyber Táo Bạo)
 * dựa theo 10 dịp lễ hội, 4 kiểu khí hậu thời tiết và phong cách người mặc.
 */

class SmartStylist {
  constructor(studioManager) {
    this.studioManager = studioManager;
    this.initUI();
  }

  initUI() {
    // Nạp danh sách 10 sự kiện vào select
    const eventSelect = document.getElementById("recomEvent");
    if (eventSelect && VIET_PHUC_DATA.events) {
      eventSelect.innerHTML = Object.values(VIET_PHUC_DATA.events).map(ev => `
        <option value="${ev.id}">${ev.name}</option>
      `).join("");
    }

    const generateBtn = document.getElementById("btnGenerateRecommendation");
    if (generateBtn) {
      generateBtn.addEventListener("click", () => {
        this.generateRecommendation();
      });
    }
  }

  generateRecommendation() {
    const event = document.getElementById("recomEvent") ? document.getElementById("recomEvent").value : "ky_yeu";
    const weather = document.getElementById("recomWeather") ? document.getElementById("recomWeather").value : "mild";
    const gender = document.getElementById("recomGender") ? document.getElementById("recomGender").value : "female";
    const vibe = document.getElementById("recomVibe") ? document.getElementById("recomVibe").value : "streetwear";

    if (window.soundEngine) window.soundEngine.playPluck(3);

    // Xây dựng 3 Phương Án Phối Đồ Đa Chiều
    const options = this.buildThreeStylingOptions(event, weather, gender, vibe);
    this.renderResultCards(options, weather, event);
  }

  buildThreeStylingOptions(event, weather, gender, vibe) {
    const eventObj = VIET_PHUC_DATA.events[event] || VIET_PHUC_DATA.events.ky_yeu;
    
    // --- PHƯƠNG ÁN 1: CHUẨN CỔ ĐIỂN DI SẢN ---
    let opt1 = {
      title: "Phương Án 1: Di Sản Cổ Phong Chuẩn Mực",
      badge: "TRUYỀN THỐNG 100%",
      badgeCls: "traditional",
      garment: (event === "le_chua" || event === "tet") ? "ngu_than_tay_thung" : "ngu_than_tay_chen",
      bottom: "quan_lua_suong",
      colorHex: (event === "tet" || event === "dam_cuoi") ? "#d90429" : (event === "le_chua" ? "#2a9d8f" : "#1d3557"),
      bottomColor: "#f8f9fa",
      pattern: "sen_dam",
      tradAcc: gender === "female" ? "khan_dong_man_nhung" : "khan_dong_man_nhung",
      modernAcc: null,
      bg: "hue_palace",
      event: event,
      scoreHeritage: 98,
      scoreTrend: 68,
      scoreComfort: 85,
      rationale: `Giữ trọn 100% cốt cách cổ truyền với phom áo nghiêm cẩn, tà áo buông rủ kết hợp nẹp cổ cài khuy ngũ thường, tuyệt đối mực thước và trang trọng cho dịp ${eventObj.name}.`
    };

    // --- PHƯƠNG ÁN 2: GEN Z REMIX THỜI THƯỢNG ---
    let opt2 = {
      title: "Phương Án 2: Gen Z Remix Cân Bằng Cổ & Kim",
      badge: "REMIX ĐƯỢC YÊU THÍCH NHẤT",
      badgeCls: "popular",
      garment: gender === "female" ? "ao_dai_tan_thoi" : "ngu_than_tay_chen",
      bottom: "quan_linen_ong_dung",
      colorHex: event === "prom" ? "#7209b7" : "#ffd166",
      bottomColor: "#e9d8a6",
      pattern: "trong_dong",
      tradAcc: "quat_tram_huong",
      modernAcc: "chunky_sneaker",
      bg: "ho_guom",
      event: event,
      scoreHeritage: 90,
      scoreTrend: 92,
      scoreComfort: 95,
      rationale: `Sự kết hợp hoàn hảo giữa tà áo cách tân thanh thoát và đôi chunky sneaker hack dáng, vừa giữ hồn dân tộc vừa tự tin sải bước suốt cả ngày dài.`
    };

    // --- PHƯƠNG ÁN 3: CYBERPUNK / HIGH-FASHION TÁO BẠO ---
    let opt3 = {
      title: "Phương Án 3: Cyber-Folk Đột Phá Runway",
      badge: "HIGH-FASHION TÁO BẠO",
      badgeCls: "cyber",
      garment: gender === "female" ? "ao_nhat_binh" : "ao_giao_linh",
      bottom: "quan_cargo_street",
      colorHex: "#f72585",
      bottomColor: "#212529",
      pattern: "thuy_ba",
      tradAcc: "chuoi_ngoc_boi_bac",
      modernAcc: "blazer_oversized",
      bg: "cyber_saigon",
      event: event,
      scoreHeritage: 86,
      scoreTrend: 98,
      scoreComfort: 88,
      rationale: `Cú va chạm thị giác giữa cổ phục thêu Thủy Ba ngũ sắc và áo blazer oversized quyền lực, sẵn sàng làm chủ thảm đỏ Prom hay sàn diễn thời trang đường phố.`
    };

    // Điều chỉnh theo thời tiết
    if (weather === "hot") {
      opt1.pattern = "tron_moc"; // Lụa mộc mát
      opt2.bottom = "vay_tennis_pleated"; // Váy xếp ly mát mẻ
    } else if (weather === "cold") {
      opt1.garment = "ngu_than_tay_thung"; // Áo tấc ấm
      opt2.modernAcc = "blazer_oversized";
    }

    return [opt1, opt2, opt3];
  }

  renderResultCards(options, weather, event) {
    const container = document.getElementById("recomResultContainer");
    if (!container) return;

    let weatherNote = "";
    if (weather === "hot") weatherNote = "☀️ Lưu ý khí hậu: Nắng hè oi ả (35°C), nên ưu tiên chất vải lụa tơ sống, đũi mộc và gam màu dịu mát.";
    else if (weather === "cold") weatherNote = "❄️ Lưu ý khí hậu: Tiết đông se lạnh (15°C), áo tấc dày hoặc khoác thêm blazer là lựa chọn giữ ấm số 1.";
    else if (weather === "rain") weatherNote = "🌧️ Lưu ý khí hậu: Ngày mưa phùn, hãy chọn sneaker đế cao hoặc quần ống đứng để tránh lấm tà áo.";
    else weatherNote = "🍃 Khí hậu mát mẻ lý tưởng cho mọi chất liệu gấm lụa thướt tha.";

    container.innerHTML = `
      <div class="weather-alert-banner">
        <span>🌦️</span> ${weatherNote}
      </div>

      <div class="recom-multi-grid">
        ${options.map((opt, idx) => {
          const gInfo = VIET_PHUC_DATA.garments[opt.garment];
          const bInfo = VIET_PHUC_DATA.bottoms[opt.bottom];
          const tInfo = opt.tradAcc ? VIET_PHUC_DATA.tradAccessories[opt.tradAcc] : null;
          const mInfo = opt.modernAcc ? VIET_PHUC_DATA.modernAccessories[opt.modernAcc] : null;

          return `
            <div class="recom-option-card animate-fade-in" style="animation-delay: ${idx * 0.1}s">
              <div class="recom-card-badge ${opt.badgeCls}">${opt.badge}</div>
              <h3 class="opt-card-title">${opt.title}</h3>
              <p class="opt-rationale">${opt.rationale}</p>

              <div class="opt-specs-box">
                <div class="spec-row">
                  <span class="lbl">Áo chính:</span>
                  <span class="val"><strong>${gInfo ? gInfo.name : ''}</strong></span>
                </div>
                <div class="spec-row">
                  <span class="lbl">Phần dưới:</span>
                  <span class="val">${bInfo ? bInfo.name : ''}</span>
                </div>
                <div class="spec-row">
                  <span class="lbl">Sắc màu:</span>
                  <span class="val">
                    <span class="color-dot" style="background:${opt.colorHex};"></span>
                    <span class="color-dot" style="background:${opt.bottomColor};"></span>
                  </span>
                </div>
                <div class="spec-row">
                  <span class="lbl">Phụ kiện:</span>
                  <span class="val">
                    ${tInfo ? tInfo.icon : ''} ${tInfo ? tInfo.name : ''} 
                    ${mInfo ? `· ${mInfo.icon} ${mInfo.name}` : ''}
                  </span>
                </div>
              </div>

              <!-- Thước đo chỉ số -->
              <div class="opt-score-bars">
                <div class="opt-score-item">
                  <span>Di sản: ${opt.scoreHeritage}%</span>
                  <div class="mini-bar"><div class="fill heritage" style="width:${opt.scoreHeritage}%"></div></div>
                </div>
                <div class="opt-score-item">
                  <span>Trend Gen Z: ${opt.scoreTrend}%</span>
                  <div class="mini-bar"><div class="fill trend" style="width:${opt.scoreTrend}%"></div></div>
                </div>
                <div class="opt-score-item">
                  <span>Tiện dụng: ${opt.scoreComfort}%</span>
                  <div class="mini-bar"><div class="fill comfort" style="width:${opt.scoreComfort}%"></div></div>
                </div>
              </div>

              <button class="btn-primary-glow small btn-apply-recom" data-opt-index="${idx}">
                Thử Phương Án Này Trên Mannequin 🎨
              </button>
            </div>
          `;
        }).join("")}
      </div>
    `;

    // Gắn sự kiện nút áp dụng
    container.querySelectorAll(".btn-apply-recom").forEach(btn => {
      btn.addEventListener("click", e => {
        const idx = parseInt(e.currentTarget.dataset.optIndex);
        const chosen = options[idx];
        if (chosen && this.studioManager) {
          this.studioManager.currentOutfit.garment = chosen.garment;
          this.studioManager.currentOutfit.bottom = chosen.bottom;
          this.studioManager.currentOutfit.colorHex = chosen.colorHex;
          this.studioManager.currentOutfit.bottomColor = chosen.bottomColor;
          this.studioManager.currentOutfit.pattern = chosen.pattern;
          this.studioManager.currentOutfit.tradAcc = chosen.tradAcc;
          this.studioManager.currentOutfit.modernAcc = chosen.modernAcc;
          this.studioManager.currentOutfit.bg = chosen.bg;
          this.studioManager.currentOutfit.event = chosen.event;
          this.studioManager.updateStudio();

          if (window.switchTab) window.switchTab("studioTab");
          if (window.soundEngine) window.soundEngine.playChime();
          if (window.showToast) window.showToast(`Đã áp dụng "${chosen.title}" vào Studio!`, "success");
        }
      });
    });
  }
}

if (typeof window !== "undefined") {
  window.SmartStylist = SmartStylist;
}

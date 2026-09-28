/**
 * VIỆT PHỤC REMIX - STUDIO CONTROLLER & CULTURAL RADAR (NÂNG CẤP TOÀN DIỆN)
 * Quản lý trạng thái phối đồ, bảng màu theo bộ chủ đề, 10 dịp lễ hội,
 * chọn avatar giới tính, tính điểm văn hóa và hài hòa ngũ hành.
 */

class StudioManager {
  constructor(mannequin) {
    this.mannequin = mannequin;
    this.currentOutfit = {
      garment: "ngu_than_tay_chen",
      bottom: "quan_lua_suong",
      colorHex: "#1d3557",
      bottomColor: "#f8f9fa",
      pattern: "sen_dam",
      tradAcc: "khan_dong_man_nhung",
      modernAcc: "chunky_sneaker",
      bg: "hue_palace",
      event: "prom",
      gender: "female", // 'female' | 'male' | 'unisex'
      lapelSide: "right_over_left", // Chuẩn hữu nhậm
      hasOuterWear: true
    };

    this.activeColorTab = "suites"; // 'suites' | 'top' | 'bottom'
    this.initUI();
    this.updateStudio();
  }

  initUI() {
    this.bindGenderSelectors();
    this.bindGarmentSelectors();
    this.bindBottomSelectors();
    this.bindColorPalette();
    this.bindPatternSelectors();
    this.bindAccessorySelectors();
    this.bindEventAndBgSelectors();
    this.bindPresetButtons();
    this.bindAvatarUpload();
    this.bindRandomMixButton();
  }

  // Cập nhật toàn bộ Studio khi người dùng thay đổi bất kỳ thành phần nào
  updateStudio() {
    // 1. Vẽ lại Canvas với trang phục hiện tại
    if (this.mannequin) {
      this.mannequin.render(this.currentOutfit);
    }

    // 2. Cập nhật thẻ thông tin lịch sử & ý nghĩa văn hóa
    this.updateCulturalInfoCard();

    // 3. Phân tích Thước đo Chuẩn mực Văn hóa & Bảng màu
    this.evaluateCulturalRadar();

    // 4. Cập nhật lưu ý văn hóa theo sự kiện (Event Tip)
    this.updateEventCulturalTip();

    // 5. Cập nhật active state của các nút trên giao diện
    this.updateActiveSelectorsUI();
  }

  // --- BỘ CHỌN VÓC DÁNG & GIỚI TÍNH AVATAR ---
  bindGenderSelectors() {
    const container = document.getElementById("genderSelectorRow");
    if (!container) return;

    container.addEventListener("click", e => {
      const btn = e.target.closest("[data-gender]");
      if (btn) {
        this.currentOutfit.gender = btn.dataset.gender;
        if (window.soundEngine) window.soundEngine.playClick();
        this.updateStudio();
      }
    });
  }

  // --- CẬP NHẬT THẺ THÔNG TIN LỊCH SỬ VIỆT PHỤC ---
  updateCulturalInfoCard() {
    const garment = VIET_PHUC_DATA.garments[this.currentOutfit.garment];
    if (!garment) return;

    const nameEl = document.getElementById("infoGarmentName");
    const eraEl = document.getElementById("infoGarmentEra");
    const regionEl = document.getElementById("infoGarmentRegion");
    const descEl = document.getElementById("infoGarmentDesc");
    const meaningEl = document.getElementById("infoGarmentMeaning");
    const cutEl = document.getElementById("infoGarmentCut");
    const tagsEl = document.getElementById("infoGarmentTags");

    if (nameEl) nameEl.textContent = garment.name;
    if (eraEl) eraEl.textContent = garment.era;
    if (regionEl) regionEl.textContent = garment.region;
    if (descEl) descEl.textContent = garment.description;
    if (meaningEl) meaningEl.textContent = garment.culturalMeaning;
    if (cutEl) cutEl.textContent = garment.cutDetails;

    if (tagsEl && garment.tags) {
      tagsEl.innerHTML = garment.tags.map(t => `<span class="badge-tag">#${t}</span>`).join(" ");
    }
  }

  // --- CẬP NHẬT LƯU Ý VĂN HÓA THEO DỊP LỄ HỘI ---
  updateEventCulturalTip() {
    const eventObj = VIET_PHUC_DATA.events[this.currentOutfit.event];
    const tipEl = document.getElementById("eventCulturalTipText");
    const titleEl = document.getElementById("eventCulturalTipTitle");

    if (eventObj) {
      if (titleEl) titleEl.textContent = `LƯU Ý TRANG PHỤC: ${eventObj.name.toUpperCase()}`;
      if (tipEl) tipEl.textContent = eventObj.culturalTip || eventObj.desc;
    }
  }

  // --- HỆ THỐNG THƯỚC ĐO VĂN HÓA & MÀU SẮC (CULTURAL RADAR) ---
  evaluateCulturalRadar() {
    let culturalScore = 92;
    let harmonyScore = 88;
    let comfortScore = 85;
    let genZStyleScore = 82;
    const alerts = [];

    const garment = VIET_PHUC_DATA.garments[this.currentOutfit.garment];
    const bottom = VIET_PHUC_DATA.bottoms[this.currentOutfit.bottom];

    // 1. Kiểm tra các quy tắc bảo vệ văn hóa
    VIET_PHUC_DATA.culturalRules.forEach(rule => {
      try {
        if (rule.condition(this.currentOutfit)) {
          alerts.push(rule);
          if (rule.severity === "critical") culturalScore -= 35;
          if (rule.severity === "danger") culturalScore -= 25;
          if (rule.severity === "warning") culturalScore -= 10;
          if (rule.severity === "praise") culturalScore = Math.min(100, culturalScore + 8);
        }
      } catch (e) {}
    });

    // 2. Đánh giá tính phù hợp với sự kiện
    if (garment && Array.isArray(garment.recommendedEvents) && garment.recommendedEvents.includes(this.currentOutfit.event)) {
      culturalScore += 5;
    } else {
      culturalScore -= 5;
    }

    // 3. Đánh giá độ thoải mái di chuyển (Comfort Score)
    if (this.currentOutfit.modernAcc === "chunky_sneaker") {
      comfortScore += 10;
    }
    if (this.currentOutfit.bottom === "quan_cargo_street" || this.currentOutfit.bottom === "quan_jeans_wide_leg") {
      comfortScore += 8;
    }
    if (this.currentOutfit.garment === "ngu_than_tay_thung") {
      comfortScore -= 12; // Tay thụng dài cần ý tứ
    }

    // 4. Đánh giá phụ kiện Gen Z
    if (this.currentOutfit.modernAcc) {
      genZStyleScore += 12;
      if (this.currentOutfit.modernAcc === "chunky_sneaker" || this.currentOutfit.modernAcc === "tai_nghe_over_ear") {
        genZStyleScore += 5;
      }
    }

    // 5. Đánh giá tính hài hòa của màu sắc
    const activeColor = VIET_PHUC_DATA.colorPalettes.find(c => c.hex === this.currentOutfit.colorHex);
    if (activeColor && Array.isArray(activeColor.harmonyWith)) {
      if (activeColor.harmonyWith.includes(this.currentOutfit.bottomColor)) {
        harmonyScore = 98;
      } else {
        harmonyScore = 84;
      }
    }

    culturalScore = Math.max(10, Math.min(100, culturalScore));
    harmonyScore = Math.max(20, Math.min(100, harmonyScore));
    comfortScore = Math.max(20, Math.min(100, comfortScore));
    genZStyleScore = Math.max(30, Math.min(100, genZStyleScore));

    // Hiển thị thanh tiến trình & điểm số
    this.updateScoreBar("culturalScoreVal", "culturalScoreBar", culturalScore);
    this.updateScoreBar("harmonyScoreVal", "harmonyScoreBar", harmonyScore);
    this.updateScoreBar("comfortScoreVal", "comfortScoreBar", comfortScore);
    this.updateScoreBar("genzScoreVal", "genzScoreBar", genZStyleScore);

    // Hiển thị thông báo văn hóa (Cultural Guardrail Box)
    this.renderCulturalAlerts(alerts, culturalScore);
  }

  updateScoreBar(valId, barId, score) {
    const valEl = document.getElementById(valId);
    const barEl = document.getElementById(barId);
    if (valEl) valEl.textContent = `${score}%`;
    if (barEl) {
      barEl.style.width = `${score}%`;
      if (score >= 85) barEl.style.backgroundColor = "#06d6a0";
      else if (score >= 65) barEl.style.backgroundColor = "#ffd166";
      else barEl.style.backgroundColor = "#e63946";
    }
  }

  renderCulturalAlerts(alerts, culturalScore) {
    const alertContainer = document.getElementById("culturalAlertContainer");
    if (!alertContainer) return;

    if (alerts.length === 0) {
      alertContainer.innerHTML = `
        <div class="alert-box alert-success">
          <div class="alert-icon">✨</div>
          <div class="alert-content">
            <h4>BỘ PHỐI ĐỒ CHUẨN MỰC & ĐẸP MẮT!</h4>
            <p>Trang phục giữ trọn cốt cách di sản, tôn trọng quy cách 'Hữu nhậm' và kết hợp hài hòa phụ kiện đương đại.</p>
          </div>
        </div>
      `;
      return;
    }

    alertContainer.innerHTML = alerts.map(a => {
      const cls = a.severity === "critical" || a.severity === "danger" 
        ? "alert-danger" 
        : a.severity === "warning" 
          ? "alert-warning" 
          : "alert-praise";
      const icon = a.severity === "praise" ? "🏆" : (a.severity === "warning" ? "💡" : "⚠️");
      return `
        <div class="alert-box ${cls}">
          <div class="alert-icon">${icon}</div>
          <div class="alert-content">
            <h4>${a.title}</h4>
            <p>${a.message}</p>
            ${a.remedy ? `<div class="alert-remedy"><strong>LỜI KHUYÊN:</strong> ${a.remedy}</div>` : ""}
          </div>
        </div>
      `;
    }).join("");
  }

  // --- BIND SỰ KIỆN GIAO DIỆN ---
  bindGarmentSelectors() {
    const container = document.getElementById("garmentSelectorGrid");
    if (!container) return;

    container.innerHTML = Object.values(VIET_PHUC_DATA.garments).map(g => `
      <button class="selector-card ${g.id === this.currentOutfit.garment ? 'active' : ''}" data-garment-id="${g.id}">
        <div class="card-tag">${g.era.split("(")[0].trim()}</div>
        <div class="card-name">${g.name}</div>
        <div class="card-sub">${g.region}</div>
      </button>
    `).join("");

    container.addEventListener("click", e => {
      const card = e.target.closest("[data-garment-id]");
      if (card) {
        const id = card.dataset.garmentId;
        this.currentOutfit.garment = id;
        const defaultColor = VIET_PHUC_DATA.garments[id].defaultColor;
        if (defaultColor) this.currentOutfit.colorHex = defaultColor;
        if (window.soundEngine) window.soundEngine.playPluck();
        this.updateStudio();
      }
    });
  }

  bindBottomSelectors() {
    const container = document.getElementById("bottomSelectorGrid");
    if (!container) return;

    container.innerHTML = Object.values(VIET_PHUC_DATA.bottoms).map(b => `
      <button class="selector-card small ${b.id === this.currentOutfit.bottom ? 'active' : ''}" data-bottom-id="${b.id}">
        <div class="card-tag ${b.category}">${b.category === 'traditional' ? 'Cổ truyền' : 'Gen Z Remix'}</div>
        <div class="card-name">${b.name}</div>
      </button>
    `).join("");

    container.addEventListener("click", e => {
      const card = e.target.closest("[data-bottom-id]");
      if (card) {
        this.currentOutfit.bottom = card.dataset.bottomId;
        if (window.soundEngine) window.soundEngine.playClick();
        this.updateStudio();
      }
    });
  }

  // --- NÂNG CẤP BẢNG MÀU: HỖ TRỢ BỘ PHỐI MÀU SUITES & CHỌN MÀU TỪNG MÓN ---
  bindColorPalette() {
    // 1. Render các bộ màu Suites
    const suiteContainer = document.getElementById("colorSuitesContainer");
    if (suiteContainer && VIET_PHUC_DATA.colorSuites) {
      suiteContainer.innerHTML = VIET_PHUC_DATA.colorSuites.map(suite => `
        <div class="color-suite-card" data-suite-id="${suite.id}">
          <div class="suite-info">
            <span class="suite-title">${suite.theme}</span>
            <span class="suite-rule">${suite.elementRule}</span>
          </div>
          <div class="suite-swatches-row">
            ${suite.colors.map(col => `
              <span class="suite-dot" style="background-color: ${col.hex};" title="${col.name}"></span>
            `).join("")}
          </div>
          <button class="btn-apply-suite" data-apply-suite="${suite.id}">Áp Dụng Bộ Này ✨</button>
        </div>
      `).join("");

      suiteContainer.addEventListener("click", e => {
        const btn = e.target.closest("[data-apply-suite]");
        if (btn) {
          const suiteId = btn.dataset.applySuite;
          const suite = VIET_PHUC_DATA.colorSuites.find(s => s.id === suiteId);
          if (suite) {
            this.currentOutfit.colorHex = suite.defaultTop;
            this.currentOutfit.bottomColor = suite.defaultBottom;
            if (window.soundEngine) window.soundEngine.playChime();
            if (window.showToast) window.showToast(`Đã áp dụng bảng màu: ${suite.theme}!`, "success");
            this.updateStudio();
          }
        }
      });
    }

    // 2. Render các mẫu màu Áo Chính (Top Color Swatches)
    const topColorContainer = document.getElementById("colorPaletteContainer");
    if (topColorContainer) {
      topColorContainer.innerHTML = VIET_PHUC_DATA.colorPalettes.map(c => `
        <button class="color-swatch-btn ${c.hex === this.currentOutfit.colorHex ? 'active' : ''}" 
                style="background-color: ${c.hex};" 
                data-hex="${c.hex}" 
                title="${c.name} (${c.element})">
        </button>
      `).join("");

      topColorContainer.addEventListener("click", e => {
        const btn = e.target.closest("[data-hex]");
        if (btn) {
          this.currentOutfit.colorHex = btn.dataset.hex;
          if (window.soundEngine) window.soundEngine.playPluck();
          this.updateStudio();
        }
      });
    }

    // Custom Hex Input
    const hexInput = document.getElementById("customColorInput");
    if (hexInput) {
      hexInput.addEventListener("input", e => {
        this.currentOutfit.colorHex = e.target.value;
        this.updateStudio();
      });
    }

    // Bottom Color Swatches
    const bottomColorBtns = document.querySelectorAll(".bottom-color-btn");
    bottomColorBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        this.currentOutfit.bottomColor = btn.dataset.color;
        if (window.soundEngine) window.soundEngine.playClick();
        this.updateStudio();
      });
    });
  }

  bindPatternSelectors() {
    const container = document.getElementById("patternSelectorGrid");
    if (!container) return;

    container.innerHTML = Object.values(VIET_PHUC_DATA.patterns).map(p => `
      <button class="selector-chip ${p.id === this.currentOutfit.pattern ? 'active' : ''}" data-pattern-id="${p.id}">
        ${p.name}
      </button>
    `).join("");

    container.addEventListener("click", e => {
      const chip = e.target.closest("[data-pattern-id]");
      if (chip) {
        this.currentOutfit.pattern = chip.dataset.patternId;
        if (window.soundEngine) window.soundEngine.playClick();
        this.updateStudio();
      }
    });
  }

  bindAccessorySelectors() {
    // 1. Phụ kiện truyền thống
    const tradContainer = document.getElementById("tradAccGrid");
    if (tradContainer) {
      tradContainer.innerHTML = `
        <button class="selector-chip ${!this.currentOutfit.tradAcc ? 'active' : ''}" data-trad-id="">
          (Không chọn)
        </button>
      ` + Object.values(VIET_PHUC_DATA.tradAccessories).map(t => `
        <button class="selector-chip ${t.id === this.currentOutfit.tradAcc ? 'active' : ''}" data-trad-id="${t.id}">
          ${t.icon} ${t.name}
        </button>
      `).join("");

      tradContainer.addEventListener("click", e => {
        const chip = e.target.closest("[data-trad-id]");
        if (chip) {
          this.currentOutfit.tradAcc = chip.dataset.tradId || null;
          if (window.soundEngine) window.soundEngine.playClick();
          this.updateStudio();
        }
      });
    }

    // 2. Phụ kiện Gen Z
    const modernContainer = document.getElementById("modernAccGrid");
    if (modernContainer) {
      modernContainer.innerHTML = `
        <button class="selector-chip ${!this.currentOutfit.modernAcc ? 'active' : ''}" data-modern-id="">
          (Không chọn)
        </button>
      ` + Object.values(VIET_PHUC_DATA.modernAccessories).map(m => `
        <button class="selector-chip ${m.id === this.currentOutfit.modernAcc ? 'active' : ''}" data-modern-id="${m.id}">
          ${m.icon} ${m.name}
        </button>
      `).join("");

      modernContainer.addEventListener("click", e => {
        const chip = e.target.closest("[data-modern-id]");
        if (chip) {
          this.currentOutfit.modernAcc = chip.dataset.modernId || null;
          if (window.soundEngine) window.soundEngine.playClick();
          this.updateStudio();
        }
      });
    }
  }

  bindEventAndBgSelectors() {
    // Render 10 sự kiện vào dropdown
    const eventSelect = document.getElementById("eventSelect");
    if (eventSelect && VIET_PHUC_DATA.events) {
      eventSelect.innerHTML = Object.values(VIET_PHUC_DATA.events).map(ev => `
        <option value="${ev.id}" ${ev.id === this.currentOutfit.event ? 'selected' : ''}>
          ${ev.name}
        </option>
      `).join("");

      eventSelect.addEventListener("change", e => {
        this.currentOutfit.event = e.target.value;
        if (window.soundEngine) window.soundEngine.playClick();
        this.updateStudio();
      });
    }

    // Render bối cảnh nền vào dropdown
    const bgSelect = document.getElementById("bgSelect");
    if (bgSelect && VIET_PHUC_DATA.backgrounds) {
      bgSelect.innerHTML = Object.values(VIET_PHUC_DATA.backgrounds).map(bg => `
        <option value="${bg.id}" ${bg.id === this.currentOutfit.bg ? 'selected' : ''}>
          ${bg.name}
        </option>
      `).join("");

      bgSelect.addEventListener("change", e => {
        this.currentOutfit.bg = e.target.value;
        if (window.soundEngine) window.soundEngine.playClick();
        this.updateStudio();
      });
    }

    // Quy cách cài vạt áo (Hữu nhậm vs Tả nhậm)
    const lapelToggle = document.getElementById("lapelToggle");
    if (lapelToggle) {
      lapelToggle.addEventListener("change", e => {
        this.currentOutfit.lapelSide = e.target.checked ? "left_over_right" : "right_over_left";
        if (window.soundEngine) window.soundEngine.playClick();
        this.updateStudio();
      });
    }
  }

  bindPresetButtons() {
    const container = document.getElementById("presetCarousel");
    if (!container) return;

    container.innerHTML = VIET_PHUC_DATA.presets.map(p => `
      <div class="preset-card" data-preset-id="${p.id}">
        <div class="preset-title">${p.name}</div>
        <div class="preset-desc">${p.caption}</div>
        <div class="preset-author">Stylist: <strong>${p.designer}</strong></div>
        <button class="btn-use-preset">Áp Dụng Look Này ✨</button>
      </div>
    `).join("");

    container.addEventListener("click", e => {
      const card = e.target.closest("[data-preset-id]");
      if (card) {
        const id = card.dataset.presetId;
        const preset = VIET_PHUC_DATA.presets.find(p => p.id === id);
        if (preset) {
          this.loadPreset(preset);
          if (window.soundEngine) {
            window.soundEngine.playChime();
          }
          if (window.showToast) {
            window.showToast(`Đã áp dụng mẫu phối: ${preset.name}!`, "success");
          }
        }
      }
    });
  }

  loadPreset(preset) {
    this.currentOutfit.garment = preset.garment;
    this.currentOutfit.bottom = preset.bottom;
    this.currentOutfit.colorHex = preset.colorHex;
    this.currentOutfit.bottomColor = preset.bottomColor || "#f8f9fa";
    this.currentOutfit.pattern = preset.pattern;
    this.currentOutfit.tradAcc = preset.tradAcc;
    this.currentOutfit.modernAcc = preset.modernAcc;
    this.currentOutfit.bg = preset.bg;
    this.currentOutfit.event = preset.event;
    this.currentOutfit.lapelSide = "right_over_left";

    const eventSelect = document.getElementById("eventSelect");
    if (eventSelect) eventSelect.value = preset.event;
    const bgSelect = document.getElementById("bgSelect");
    if (bgSelect) bgSelect.value = preset.bg;

    this.updateStudio();
  }

  bindAvatarUpload() {
    const uploadInput = document.getElementById("avatarUploadInput");
    const removeBtn = document.getElementById("removeAvatarBtn");

    if (uploadInput) {
      uploadInput.addEventListener("change", e => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = ev => {
            const img = new Image();
            img.onload = () => {
              this.mannequin.setUserAvatar(img);
              if (removeBtn) removeBtn.style.display = "inline-flex";
              if (window.showToast) window.showToast("Đã ghép ảnh chân dung thử đồ thành công!", "success");
            };
            img.src = ev.target.result;
          };
          reader.readAsDataURL(file);
        }
      });
    }

    if (removeBtn) {
      removeBtn.addEventListener("click", () => {
        this.mannequin.clearUserAvatar();
        if (uploadInput) uploadInput.value = "";
        removeBtn.style.display = "none";
        if (window.showToast) window.showToast("Đã chuyển về người mẫu minh họa.", "info");
      });
    }
  }

  bindRandomMixButton() {
    const randomBtn = document.getElementById("randomMixBtn");
    if (!randomBtn) return;

    randomBtn.addEventListener("click", () => {
      const garments = Object.keys(VIET_PHUC_DATA.garments);
      const bottoms = Object.keys(VIET_PHUC_DATA.bottoms);
      const suites = VIET_PHUC_DATA.colorSuites;
      const patterns = Object.keys(VIET_PHUC_DATA.patterns);
      const trads = Object.keys(VIET_PHUC_DATA.tradAccessories);
      const moderns = Object.keys(VIET_PHUC_DATA.modernAccessories);
      const bgs = Object.keys(VIET_PHUC_DATA.backgrounds);
      const events = Object.keys(VIET_PHUC_DATA.events);

      const randomSuite = suites[Math.floor(Math.random() * suites.length)];

      this.currentOutfit.garment = garments[Math.floor(Math.random() * garments.length)];
      this.currentOutfit.bottom = bottoms[Math.floor(Math.random() * bottoms.length)];
      this.currentOutfit.colorHex = randomSuite.defaultTop;
      this.currentOutfit.bottomColor = randomSuite.defaultBottom;
      this.currentOutfit.pattern = patterns[Math.floor(Math.random() * patterns.length)];
      this.currentOutfit.tradAcc = Math.random() > 0.3 ? trads[Math.floor(Math.random() * trads.length)] : null;
      this.currentOutfit.modernAcc = Math.random() > 0.2 ? moderns[Math.floor(Math.random() * moderns.length)] : null;
      this.currentOutfit.bg = bgs[Math.floor(Math.random() * bgs.length)];
      this.currentOutfit.event = events[Math.floor(Math.random() * events.length)];
      this.currentOutfit.lapelSide = "right_over_left";

      if (window.soundEngine) window.soundEngine.playChime();
      if (window.showToast) window.showToast(`Ngẫu hứng bộ phối theo theme: ${randomSuite.theme}!`, "success");
      this.updateStudio();
    });
  }

  updateActiveSelectorsUI() {
    // Gender buttons
    document.querySelectorAll("[data-gender]").forEach(el => {
      el.classList.toggle("active", el.dataset.gender === this.currentOutfit.gender);
    });
    // Garment cards
    document.querySelectorAll("[data-garment-id]").forEach(el => {
      el.classList.toggle("active", el.dataset.garmentId === this.currentOutfit.garment);
    });
    // Bottom cards
    document.querySelectorAll("[data-bottom-id]").forEach(el => {
      el.classList.toggle("active", el.dataset.bottomId === this.currentOutfit.bottom);
    });
    // Color swatches
    document.querySelectorAll("[data-hex]").forEach(el => {
      el.classList.toggle("active", el.dataset.hex === this.currentOutfit.colorHex);
    });
    // Pattern chips
    document.querySelectorAll("[data-pattern-id]").forEach(el => {
      el.classList.toggle("active", el.dataset.patternId === this.currentOutfit.pattern);
    });
    // Accessories chips
    document.querySelectorAll("[data-trad-id]").forEach(el => {
      el.classList.toggle("active", (el.dataset.tradId || null) === this.currentOutfit.tradAcc);
    });
    document.querySelectorAll("[data-modern-id]").forEach(el => {
      el.classList.toggle("active", (el.dataset.modernId || null) === this.currentOutfit.modernAcc);
    });
  }
}

if (typeof window !== "undefined") {
  window.StudioManager = StudioManager;
}

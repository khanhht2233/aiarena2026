/**
 * VIỆT PHỤC REMIX - OUTFIT COMPARISON ENGINE (NÂNG CẤP TOÀN DIỆN)
 * So sánh song song hai phương án phối đồ (Side-by-Side) đa chiều
 */

class OutfitComparison {
  constructor(studioManager) {
    this.studioManager = studioManager;
    this.canvasA = document.getElementById("compareCanvasA");
    this.canvasB = document.getElementById("compareCanvasB");
    this.mannequinA = this.canvasA ? new VietPhucMannequin("compareCanvasA") : null;
    this.mannequinB = this.canvasB ? new VietPhucMannequin("compareCanvasB") : null;

    // Bộ A: Truyền thống chuẩn mực
    this.outfitA = {
      garment: "ngu_than_tay_chen",
      bottom: "quan_lua_suong",
      colorHex: "#1d3557",
      bottomColor: "#f8f9fa",
      pattern: "sen_dam",
      tradAcc: "khan_dong_man_nhung",
      modernAcc: null,
      bg: "hue_palace",
      event: "ky_yeu",
      lapelSide: "right_over_left"
    };

    // Bộ B: Gen Z Streetwear Remix
    this.outfitB = {
      garment: "ao_tu_than",
      bottom: "quan_cargo_street",
      colorHex: "#ffd166",
      bottomColor: "#212529",
      pattern: "trong_dong",
      tradAcc: "non_quai_thao",
      modernAcc: "chunky_sneaker",
      bg: "ho_guom",
      event: "streetwear",
      lapelSide: "right_over_left"
    };

    this.initUI();
  }

  initUI() {
    this.renderComparison();

    const btnLoadToA = document.getElementById("btnLoadStudioToA");
    const btnLoadToB = document.getElementById("btnLoadStudioToB");

    if (btnLoadToA) {
      btnLoadToA.addEventListener("click", () => {
        if (this.studioManager) {
          this.outfitA = JSON.parse(JSON.stringify(this.studioManager.currentOutfit));
          this.renderComparison();
          if (window.showToast) window.showToast("Đã đưa trang phục từ Studio vào Phương Án A!", "info");
        }
      });
    }

    if (btnLoadToB) {
      btnLoadToB.addEventListener("click", () => {
        if (this.studioManager) {
          this.outfitB = JSON.parse(JSON.stringify(this.studioManager.currentOutfit));
          this.renderComparison();
          if (window.showToast) window.showToast("Đã đưa trang phục từ Studio vào Phương Án B!", "info");
        }
      });
    }

    const presetSelectA = document.getElementById("selectPresetA");
    const presetSelectB = document.getElementById("selectPresetB");

    if (presetSelectA && VIET_PHUC_DATA.presets) {
      presetSelectA.innerHTML = VIET_PHUC_DATA.presets.map((p, idx) => `
        <option value="${p.id}" ${idx === 0 ? 'selected' : ''}>${p.name}</option>
      `).join("");
      presetSelectA.addEventListener("change", e => {
        const p = VIET_PHUC_DATA.presets.find(item => item.id === e.target.value);
        if (p) {
          this.outfitA = JSON.parse(JSON.stringify(p));
          this.renderComparison();
        }
      });
    }

    if (presetSelectB && VIET_PHUC_DATA.presets) {
      presetSelectB.innerHTML = VIET_PHUC_DATA.presets.map((p, idx) => `
        <option value="${p.id}" ${idx === 1 ? 'selected' : ''}>${p.name}</option>
      `).join("");
      presetSelectB.addEventListener("change", e => {
        const p = VIET_PHUC_DATA.presets.find(item => item.id === e.target.value);
        if (p) {
          this.outfitB = JSON.parse(JSON.stringify(p));
          this.renderComparison();
        }
      });
    }
  }

  renderComparison() {
    if (this.mannequinA) this.mannequinA.render(this.outfitA);
    if (this.mannequinB) this.mannequinB.render(this.outfitB);

    this.renderComparisonTable();
  }

  renderComparisonTable() {
    const tableContainer = document.getElementById("comparisonTableContainer");
    if (!tableContainer) return;

    const gA = VIET_PHUC_DATA.garments[this.outfitA.garment];
    const gB = VIET_PHUC_DATA.garments[this.outfitB.garment];
    const bA = VIET_PHUC_DATA.bottoms[this.outfitA.bottom];
    const bB = VIET_PHUC_DATA.bottoms[this.outfitB.bottom];
    const tA = this.outfitA.tradAcc ? VIET_PHUC_DATA.tradAccessories[this.outfitA.tradAcc] : null;
    const tB = this.outfitB.tradAcc ? VIET_PHUC_DATA.tradAccessories[this.outfitB.tradAcc] : null;
    const mA = this.outfitA.modernAcc ? VIET_PHUC_DATA.modernAccessories[this.outfitA.modernAcc] : null;
    const mB = this.outfitB.modernAcc ? VIET_PHUC_DATA.modernAccessories[this.outfitB.modernAcc] : null;

    const evA = VIET_PHUC_DATA.events[this.outfitA.event];
    const evB = VIET_PHUC_DATA.events[this.outfitB.event];

    const scoreTradA = this.outfitA.modernAcc ? 88 : 98;
    const scoreTradB = this.outfitB.modernAcc ? 85 : 98;
    const scoreTrendA = this.outfitA.modernAcc ? 92 : 65;
    const scoreTrendB = this.outfitB.modernAcc ? 96 : 65;
    const scoreComfortA = this.outfitA.bottom === "quan_lua_suong" ? 82 : 94;
    const scoreComfortB = this.outfitB.bottom === "quan_cargo_street" ? 95 : 82;

    tableContainer.innerHTML = `
      <table class="compare-table">
        <thead>
          <tr>
            <th style="width:25%;">Tiêu chí phân tích</th>
            <th style="width:37.5%;">Phương Án A: ${gA ? gA.name : ''}</th>
            <th style="width:37.5%;">Phương Án B: ${gB ? gB.name : ''}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Áo chính & Cổ áo</strong></td>
            <td>${gA ? gA.name : ''} (${gA ? gA.era.split("(")[0] : ''})</td>
            <td>${gB ? gB.name : ''} (${gB ? gB.era.split("(")[0] : ''})</td>
          </tr>
          <tr>
            <td><strong>Phần dưới</strong></td>
            <td>${bA ? bA.name : ''}</td>
            <td>${bB ? bB.name : ''}</td>
          </tr>
          <tr>
            <td><strong>Phụ kiện Cổ vs Tân</strong></td>
            <td>${tA ? `${tA.icon} ${tA.name}` : ''} ${mA ? `· ${mA.icon} ${mA.name}` : '(Không phụ kiện tân)'}</td>
            <td>${tB ? `${tB.icon} ${tB.name}` : ''} ${mB ? `· ${mB.icon} ${mB.name}` : '(Không phụ kiện tân)'}</td>
          </tr>
          <tr>
            <td><strong>Độ chuẩn mực di sản</strong></td>
            <td><div class="score-badge high">${scoreTradA}/100</div></td>
            <td><div class="score-badge ${scoreTradB >= 85 ? 'high' : 'medium'}">${scoreTradB}/100</div></td>
          </tr>
          <tr>
            <td><strong>Độ Hot Trend Gen Z</strong></td>
            <td><div class="score-badge ${scoreTrendA >= 80 ? 'high' : 'medium'}">${scoreTrendA}/100</div></td>
            <td><div class="score-badge high">${scoreTrendB}/100</div></td>
          </tr>
          <tr>
            <td><strong>Độ thoải mái vận động</strong></td>
            <td><div class="score-badge ${scoreComfortA >= 85 ? 'high' : 'medium'}">${scoreComfortA}/100</div></td>
            <td><div class="score-badge high">${scoreComfortB}/100</div></td>
          </tr>
          <tr>
            <td><strong>Chi phí ước tính</strong></td>
            <td>250.000đ - 450.000đ (Thuê) / 1.500.000đ (May đo)</td>
            <td>200.000đ - 400.000đ (Dùng sẵn đồ streetwear)</td>
          </tr>
          <tr>
            <td><strong>Hoàn cảnh tối ưu</strong></td>
            <td>${evA ? evA.name : 'Nghi lễ trang nghiêm, kỷ yếu, đi chùa'}</td>
            <td>${evB ? evB.name : 'Dạo phố cuối tuần, festival, chụp lookbook'}</td>
          </tr>
          <tr>
            <td><strong>Lời khuyên Stylist</strong></td>
            <td>Phương án mực thước, an toàn tuyệt đối khi gặp người lớn hoặc tham gia lễ hội tôn nghiêm.</td>
            <td>Phương án phá cách, visual cực cuốn hút để chụp ảnh đăng mạng xã hội và dạo phố cùng bạn bè.</td>
          </tr>
        </tbody>
      </table>
    `;
  }
}

if (typeof window !== "undefined") {
  window.OutfitComparison = OutfitComparison;
}

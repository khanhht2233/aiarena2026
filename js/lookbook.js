/**
 * VIỆT PHỤC REMIX - LOOKBOOK GALLERY & HIGH-RES EXPORTER
 * Tạo, lưu trữ bộ sưu tập và xuất ảnh Lookbook thời trang phong cách Tạp chí
 */

class LookbookManager {
  constructor(studioManager) {
    window.lookbookManager = this;
    this.studioManager = studioManager;
    this.storageKey = "vietphuc_remix_lookbooks_v1";
    this.lookbooks = this.loadSavedLookbooks();
    this.initUI();
  }

  loadSavedLookbooks() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    // Dữ liệu mẫu ban đầu cực đẹp
    return VIET_PHUC_DATA.presets.map((p, idx) => ({
      id: `lb_${Date.now()}_${idx}`,
      title: p.name,
      designer: p.designer,
      caption: p.caption,
      garment: p.garment,
      bottom: p.bottom,
      colorHex: p.colorHex,
      tradAcc: p.tradAcc,
      modernAcc: p.modernAcc,
      event: p.event,
      bg: p.bg,
      createdAt: "2026-09-28"
    }));
  }

  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.lookbooks));
    } catch (e) {}
  }

  initUI() {
    this.renderGallery();

    // Nút Lưu Outfit Hiện Tại Vào Lookbook
    const btnSaveLookbook = document.getElementById("btnSaveLookbook");
    if (btnSaveLookbook) {
      btnSaveLookbook.addEventListener("click", () => {
        this.saveCurrentOutfit();
      });
    }

    // Nút Tải Xuất Ảnh Tạp Chí PNG từ Studio
    const btnExportPNG = document.getElementById("btnExportPNG");
    if (btnExportPNG) {
      btnExportPNG.addEventListener("click", () => {
        this.exportEditorialPoster();
      });
    }
  }

  saveCurrentOutfit() {
    const outfit = this.studioManager.currentOutfit;
    const garment = VIET_PHUC_DATA.garments[outfit.garment];

    const title = prompt("Nhập tên bộ Lookbook của bạn:", `${garment ? garment.name : 'Việt Phục'} Remix Gen Z`) || "My Lookbook";
    const designer = prompt("Nhập tên Stylist / Bạn:", "Gen Z Stylist") || "Gen Z Stylist";

    const newLookbook = {
      id: `lb_${Date.now()}`,
      title: title,
      designer: designer,
      caption: `Tác phẩm phối ${garment ? garment.name : ''} phong cách đương đại đầy cảm hứng!`,
      garment: outfit.garment,
      bottom: outfit.bottom,
      colorHex: outfit.colorHex,
      tradAcc: outfit.tradAcc,
      modernAcc: outfit.modernAcc,
      event: outfit.event,
      bg: outfit.bg,
      createdAt: new Date().toLocaleDateString("vi-VN")
    };

    this.lookbooks.unshift(newLookbook);
    this.saveToStorage();
    this.renderGallery();

    if (window.soundEngine) window.soundEngine.playChime();
    if (window.showToast) window.showToast(`Đã lưu "${title}" vào Thư Viện Lookbook!`, "success");
  }

  renderGallery() {
    const grid = document.getElementById("lookbookGrid");
    if (!grid) return;

    if (this.lookbooks.length === 0) {
      grid.innerHTML = `<div class="empty-state">Chưa có bộ Lookbook nào được lưu. Hãy phối đồ và bấm "Lưu Vào Lookbook"!</div>`;
      return;
    }

    grid.innerHTML = this.lookbooks.map(lb => {
      const g = VIET_PHUC_DATA.garments[lb.garment];
      const b = VIET_PHUC_DATA.bottoms[lb.bottom];
      const t = lb.tradAcc ? VIET_PHUC_DATA.tradAccessories[lb.tradAcc] : null;
      const m = lb.modernAcc ? VIET_PHUC_DATA.modernAccessories[lb.modernAcc] : null;

      return `
        <div class="lookbook-item-card">
          <div class="lb-header" style="border-top: 4px solid ${lb.colorHex};">
            <span class="lb-event-tag">#${lb.event.toUpperCase()}</span>
            <span class="lb-date">${lb.createdAt}</span>
          </div>

          <div class="lb-body">
            <h3 class="lb-title">${lb.title}</h3>
            <p class="lb-designer">Stylist: <strong>${lb.designer}</strong></p>
            <p class="lb-caption">${lb.caption}</p>

            <div class="lb-spec-list">
              <div>👘 <strong>${g ? g.name : ''}</strong></div>
              <div>👖 ${b ? b.name : ''}</div>
              <div>${t ? `🪭 ${t.name}` : ''} ${m ? `👟 ${m.name}` : ''}</div>
            </div>

            <div class="lb-palette-row">
              <span class="swatch" style="background:${lb.colorHex};" title="Màu áo"></span>
              <span class="swatch" style="background:${lb.bottomColor || '#ffffff'};" title="Màu quần/váy"></span>
              <span class="swatch" style="background:#ffd166;" title="Ánh kim"></span>
              <span class="swatch" style="background:#f72585;" title="Neon"></span>
            </div>
          </div>

          <div class="lb-footer">
            <button class="btn-lb-action btn-apply" onclick="window.lookbookManager.applyLookbook('${lb.id}')">
              Thử Lại 🎨
            </button>
            <button class="btn-lb-action btn-share" onclick="window.lookbookManager.shareLookbook('${lb.id}')">
              Chia Sẻ 📤
            </button>
            <button class="btn-lb-action btn-delete" onclick="window.lookbookManager.deleteLookbook('${lb.id}')">
              🗑️
            </button>
          </div>
        </div>
      `;
    }).join("");
  }

  applyLookbook(id) {
    const lb = this.lookbooks.find(x => x.id === id);
    if (!lb || !this.studioManager) return;

    this.studioManager.currentOutfit.garment = lb.garment;
    this.studioManager.currentOutfit.bottom = lb.bottom;
    this.studioManager.currentOutfit.colorHex = lb.colorHex;
    this.studioManager.currentOutfit.tradAcc = lb.tradAcc;
    this.studioManager.currentOutfit.modernAcc = lb.modernAcc;
    this.studioManager.currentOutfit.event = lb.event;
    this.studioManager.currentOutfit.bg = lb.bg;
    this.studioManager.updateStudio();

    if (window.switchTab) window.switchTab("studioTab");
    if (window.soundEngine) window.soundEngine.playChime();
    if (window.showToast) window.showToast(`Đã tải bộ phối: ${lb.title}!`, "success");
  }

  shareLookbook(id) {
    const lb = this.lookbooks.find(x => x.id === id);
    if (!lb) return;

    const textToCopy = `✨ VIỆT PHỤC REMIX - ${lb.title}\nStylist: ${lb.designer}\nTrang phục: ${VIET_PHUC_DATA.garments[lb.garment]?.name}\nSự kiện: #${lb.event}\n👉 Khám phá và phối đồ Việt Phục Remix phong cách Gen Z ngay!`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      if (window.showToast) window.showToast("Đã sao chép thông tin Lookbook vào clipboard!", "success");
    }).catch(() => {
      prompt("Sao chép liên kết chia sẻ:", textToCopy);
    });
  }

  deleteLookbook(id) {
    if (confirm("Bạn có chắc chắn muốn xóa bộ Lookbook này?")) {
      this.lookbooks = this.lookbooks.filter(x => x.id !== id);
      this.saveToStorage();
      this.renderGallery();
      if (window.showToast) window.showToast("Đã xóa Lookbook.", "info");
    }
  }

  // Xuất Poster Tạp Chí thời trang độ phân giải cao
  exportEditorialPoster() {
    if (!this.studioManager || !this.studioManager.mannequin) return;

    const mannequinCanvas = this.studioManager.mannequin.canvas;
    const outfit = this.studioManager.currentOutfit;
    const garment = VIET_PHUC_DATA.garments[outfit.garment];

    // Tạo canvas poster phụ độ phân giải cao
    const posterCanvas = document.createElement("canvas");
    posterCanvas.width = 1200;
    posterCanvas.height = 1700;
    const pCtx = posterCanvas.getContext("2d");

    // Vẽ ảnh từ mannequin canvas phóng to
    pCtx.drawImage(mannequinCanvas, 0, 0, 1200, 1700);

    // Thêm các yếu tố Tạp chí thời trang (Vogue/Harper's Bazaar style)
    pCtx.save();
    pCtx.fillStyle = "#ffffff";
    pCtx.textAlign = "center";
    pCtx.font = "bold 90px 'Outfit', serif";
    pCtx.fillText("VIỆT PHỤC REMIX", 600, 140);

    pCtx.font = "italic 28px 'Be Vietnam Pro', sans-serif";
    pCtx.fillStyle = "#ffd166";
    pCtx.fillText("SỐ ĐẶC BIỆT: GEN Z & KHÍ CHẤT ĐẠI VIỆT", 600, 195);

    // Khung thông tin phía dưới
    pCtx.fillStyle = "rgba(10, 14, 23, 0.85)";
    pCtx.fillRect(80, 1450, 1040, 180);
    pCtx.strokeStyle = "#ffd166";
    pCtx.lineWidth = 3;
    pCtx.strokeRect(80, 1450, 1040, 180);

    pCtx.textAlign = "left";
    pCtx.fillStyle = "#ffffff";
    pCtx.font = "bold 38px 'Be Vietnam Pro', sans-serif";
    pCtx.fillText(garment ? garment.name.toUpperCase() : "VIỆT PHỤC", 120, 1515);

    pCtx.font = "24px 'Be Vietnam Pro', sans-serif";
    pCtx.fillStyle = "#e2e8f0";
    pCtx.fillText(`Di sản: ${garment ? garment.era : ''}`, 120, 1560);
    pCtx.fillText(`Ý nghĩa: ${garment ? garment.culturalMeaning.substring(0, 75) + '...' : ''}`, 120, 1600);

    // Palette màu
    const colors = [outfit.colorHex, outfit.bottomColor || "#f8f9fa", "#ffd166", "#f72585"];
    colors.forEach((c, i) => {
      pCtx.fillStyle = c;
      pCtx.beginPath();
      pCtx.arc(1040 - i * 45, 1540, 18, 0, Math.PI * 2);
      pCtx.fill();
      pCtx.strokeStyle = "#ffffff";
      pCtx.lineWidth = 2;
      pCtx.stroke();
    });

    pCtx.restore();

    // Kích hoạt tải ảnh về máy
    const dataUrl = posterCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `VietPhucRemix_Lookbook_${Date.now()}.png`;
    link.href = dataUrl;
    link.click();

    if (window.soundEngine) window.soundEngine.playChime();
    if (window.showToast) window.showToast("Đã tải poster Lookbook Tạp Chí HD về máy thành công!", "success");
  }
}

if (typeof window !== "undefined") {
  window.LookbookManager = LookbookManager;
}

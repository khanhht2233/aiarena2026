/**
 * VIỆT PHỤC REMIX - MAIN APPLICATION CONTROLLER
 * Quản lý khởi tạo an toàn, chuyển tab điều hướng, thông báo toast và theme
 */

// 1. Toast Notification System toàn cục
window.showToast = function (message, type = "info") {
  try {
    let container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast-item toast-${type} animate-slide-up`;
    const icon = type === "success" ? "✓" : (type === "warning" ? "⚠️" : "ℹ️");
    toast.innerHTML = `<span class="toast-icon">${icon}</span> <span class="toast-text">${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("toast-fade-out");
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  } catch (e) {
    console.log("[Toast]", message);
  }
};

// 2. Chuyển Tab Toàn Cục
window.switchTab = function (targetTabId) {
  try {
    const navTabs = document.querySelectorAll(".nav-tab-btn");
    const tabPanes = document.querySelectorAll(".tab-pane");

    navTabs.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === targetTabId);
    });

    tabPanes.forEach(pane => {
      pane.classList.toggle("active", pane.id === targetTabId);
    });

    if (window.soundEngine) {
      window.soundEngine.playClick();
    }

    // Lazy load canvas comparison if opening comparison tab
    if (targetTabId === "compareTab" && !window.outfitComparison) {
      setTimeout(() => {
        try {
          window.outfitComparison = new OutfitComparison(window.studioManager);
        } catch (err) {
          console.warn("Comparison init:", err);
        }
      }, 50);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    console.error("switchTab error:", err);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  console.log("Việt Phục Remix: DOM Loaded. Initializing modules...");

  // Gắn sự kiện chuyển Tab ngay lập tức
  const navTabs = document.querySelectorAll(".nav-tab-btn");
  navTabs.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabTarget = btn.dataset.tab;
      if (tabTarget) window.switchTab(tabTarget);
    });
  });

  // Giao diện Sáng / Tối (Theme Toggle)
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("light-royal-theme");
      const isLight = document.body.classList.contains("light-royal-theme");
      themeToggleBtn.innerHTML = isLight ? "🌙 Chế Độ Đêm" : "☀️ Hoàng Kim";
      if (window.soundEngine) window.soundEngine.playClick();
      window.showToast(isLight ? "Đã chuyển sang giao diện Hoàng Kim Cung Đình" : "Đã chuyển sang giao diện Đêm Huyền Bí", "info");
    });
  }

  // Âm Thanh (Sound Toggle)
  const soundToggleBtn = document.getElementById("soundToggleBtn");
  if (soundToggleBtn && window.soundEngine) {
    soundToggleBtn.addEventListener("click", () => {
      const isMuted = window.soundEngine.toggleMute();
      soundToggleBtn.innerHTML = isMuted ? "🔇 Âm Thanh: Tắt" : "🎵 Âm Thanh: Bật";
      window.showToast(isMuted ? "Đã tắt âm thanh" : "Đã bật âm thanh Đàn Tranh ngũ cung", "info");
    });
  }

  // Khởi tạo Mannequin Engine
  let mannequin = null;
  try {
    mannequin = new VietPhucMannequin("mannequinCanvas");
    window.mannequin = mannequin;
    console.log("✓ Mannequin Engine ready");
  } catch (err) {
    console.error("Mannequin initialization error:", err);
  }

  // Khởi tạo Studio Manager
  let studioManager = null;
  try {
    studioManager = new StudioManager(mannequin);
    window.studioManager = studioManager;
    console.log("✓ Studio Manager ready");
  } catch (err) {
    console.error("StudioManager initialization error:", err);
  }

  // Khởi tạo Smart Stylist
  try {
    window.smartStylist = new SmartStylist(studioManager);
    console.log("✓ Smart Stylist ready");
  } catch (err) {
    console.error("SmartStylist initialization error:", err);
  }

  // Khởi tạo Lookbook Manager
  try {
    window.lookbookManager = new LookbookManager(studioManager);
    console.log("✓ Lookbook Manager ready");
  } catch (err) {
    console.error("LookbookManager initialization error:", err);
  }

  // Khởi tạo Cultural Wiki & Quiz
  try {
    window.culturalWiki = new CulturalWiki(studioManager);
    console.log("✓ Cultural Wiki ready");
  } catch (err) {
    console.error("CulturalWiki initialization error:", err);
  }

  // ===================================================================
  // ĐIỀU KHIỂN GÓC NHÌN CAMERA 3D & ZOOM CANVAS
  // ===================================================================
  const btnViewFull = document.getElementById("btnViewFull");
  const btnViewClose = document.getElementById("btnViewClose");
  const btnViewAngle = document.getElementById("btnViewAngle");
  const btnViewBack = document.getElementById("btnViewBack");
  const btnAutoRotate = document.getElementById("btnAutoRotate");
  const btnResetRot = document.getElementById("btnResetRot");
  const viewModeBtns = [btnViewFull, btnViewClose, btnViewAngle, btnViewBack].filter(Boolean);

  function setActiveViewBtn(activeBtn) {
    viewModeBtns.forEach(btn => btn.classList.remove("active"));
    if (activeBtn) activeBtn.classList.add("active");
  }

  if (btnViewFull && mannequin) {
    btnViewFull.addEventListener("click", () => {
      mannequin.setViewMode("full");
      setActiveViewBtn(btnViewFull);
      if (btnAutoRotate) btnAutoRotate.classList.remove("active");
      if (window.soundEngine) window.soundEngine.playClick();
      window.showToast("Góc nhìn: Toàn bộ outfit từ đầu đến chân", "info");
    });
  }

  if (btnViewClose && mannequin) {
    btnViewClose.addEventListener("click", () => {
      mannequin.setViewMode("close");
      setActiveViewBtn(btnViewClose);
      if (btnAutoRotate) btnAutoRotate.classList.remove("active");
      if (window.soundEngine) window.soundEngine.playClick();
      window.showToast("Góc nhìn: Cận cảnh chi tiết áo & cúc ngũ thường", "info");
    });
  }

  if (btnViewAngle && mannequin) {
    btnViewAngle.addEventListener("click", () => {
      mannequin.setViewMode("angle");
      setActiveViewBtn(btnViewAngle);
      if (btnAutoRotate) btnAutoRotate.classList.remove("active");
      if (window.soundEngine) window.soundEngine.playClick();
      window.showToast("Góc nhìn: Góc nghiêng 3/4 Runway 3D", "info");
    });
  }

  if (btnViewBack && mannequin) {
    btnViewBack.addEventListener("click", () => {
      mannequin.setViewMode("back");
      setActiveViewBtn(btnViewBack);
      if (btnAutoRotate) btnAutoRotate.classList.remove("active");
      if (window.soundEngine) window.soundEngine.playClick();
      window.showToast("Góc nhìn: Mặt sau lưng áo & tà áo buông rủ", "info");
    });
  }

  if (btnAutoRotate && mannequin) {
    btnAutoRotate.addEventListener("click", () => {
      const isRotating = mannequin.toggleAutoRotate();
      btnAutoRotate.classList.toggle("active", isRotating);
      if (window.soundEngine) window.soundEngine.playClick();
      window.showToast(isRotating ? "Bắt đầu tự động xoay 360° Runway" : "Dừng xoay 360°", "info");
    });
  }

  if (btnResetRot && mannequin) {
    btnResetRot.addEventListener("click", () => {
      mannequin.resetRotation();
      setActiveViewBtn(btnViewFull);
      if (btnAutoRotate) btnAutoRotate.classList.remove("active");
      if (window.soundEngine) window.soundEngine.playClick();
      window.showToast("Đã đặt lại góc nhìn ban đầu", "info");
    });
  }

  // Điều khiển Zoom Canvas
  const btnZoomIn = document.getElementById("btnZoomIn");
  const btnZoomOut = document.getElementById("btnZoomOut");
  const btnResetZoom = document.getElementById("btnResetZoom");

  if (btnZoomIn && mannequin) {
    btnZoomIn.addEventListener("click", () => {
      mannequin.targetZoomLevel = Math.min(1.5, mannequin.zoomLevel + 0.12);
      if (window.soundEngine) window.soundEngine.playClick();
    });
  }
  if (btnZoomOut && mannequin) {
    btnZoomOut.addEventListener("click", () => {
      mannequin.targetZoomLevel = Math.max(0.65, mannequin.zoomLevel - 0.12);
      if (window.soundEngine) window.soundEngine.playClick();
    });
  }
  if (btnResetZoom && mannequin) {
    btnResetZoom.addEventListener("click", () => {
      mannequin.setViewMode("full");
      setActiveViewBtn(btnViewFull);
      if (window.soundEngine) window.soundEngine.playClick();
    });
  }

  console.log("🚀 Việt Phục Remix Web App is fully interactive with 3D Mannequin Engine!");
});

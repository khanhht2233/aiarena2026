/**
 * VIỆT PHỤC REMIX - 3D INTERACTIVE MANNEQUIN & HIGH-FASHION RENDERING ENGINE
 * Mô phỏng người mẫu 3D tương tác đa góc nhìn:
 * - Xoay 360° tự do (kéo chuột/chạm xoay không gian 3D)
 * - Các góc máy chuẩn Runway: Toàn Bộ Outfit (Full-body), Cận Cảnh Áo (Upper Detail), Góc Nghiêng 3/4, Mặt Sau (Back View)
 * - Tự động xoay 360° (Auto-Orbit)
 * - Phom dáng chuẩn giải phẫu cơ thể, trang phục may đo ôm fit tự nhiên (cổ, vai, eo, tà áo rủ mềm)
 * - Hiệu ứng ánh sáng 3D đa chiều phản chiếu chất liệu lụa, gấm triều đình và streetwear đương đại
 */

// Canvas Polyfills
if (typeof CanvasRenderingContext2D !== "undefined") {
  if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, radii) {
      if (!radii) radii = 0;
      if (typeof radii === "number") radii = [radii, radii, radii, radii];
      const r = Math.min(Math.abs(w) / 2, Math.abs(h) / 2, radii[0] || 0);
      this.moveTo(x + r, y);
      this.lineTo(x + w - r, y);
      this.quadraticCurveTo(x + w, y, x + w, y + r);
      this.lineTo(x + w, y + h - r);
      this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      this.lineTo(x + r, y + h);
      this.quadraticCurveTo(x, y + h, x, y + h - r);
      this.lineTo(x, y + r);
      this.quadraticCurveTo(x, y, x + r, y);
      this.closePath();
      return this;
    };
  }

  if (!CanvasRenderingContext2D.prototype.ellipse) {
    CanvasRenderingContext2D.prototype.ellipse = function (x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) {
      this.save();
      this.translate(x, y);
      this.rotate(rotation || 0);
      this.scale(radiusX, radiusY);
      this.arc(0, 0, 1, startAngle || 0, endAngle || (Math.PI * 2), anticlockwise || false);
      this.restore();
    };
  }
}

function drawSafeRoundedRect(ctx, x, y, w, h, r) {
  const radius = Math.min(Math.abs(w) / 2, Math.abs(h) / 2, r || 0);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

class VietPhucMannequin {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.userImage = null;

    // 3D Camera & Transform State
    this.rotationY = 0;              // Góc xoay hiện tại quanh trục Y (radians)
    this.targetRotationY = 0;        // Góc xoay mục tiêu (cho quán tính mượt mà)
    this.zoomLevel = 0.88;           // Phóng to / Thu nhỏ (mặc định 0.88 toàn bộ outfit)
    this.targetZoomLevel = 0.88;
    this.offsetY = 38;               // Dịch chuyển trục Y (để thấy trọn vẹn từ mũ tới giày)
    this.targetOffsetY = 38;

    this.viewMode = "full";          // "full" | "close" | "angle" | "back"
    this.isAutoRotating = false;
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartRot = 0;
    this.dragVelocity = 0;
    this.lastDragX = 0;

    this.particles = [];
    this.currentOutfit = null;
    this.lightAngle = -0.5; // Hướng ánh sáng chính

    this.initParticles();
    this.initInteractiveListeners();
    this.startAnimationLoop();
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < 30; i++) {
      this.particles.push({
        x: Math.random() * 600,
        y: Math.random() * 850,
        size: Math.random() * 4.5 + 2.5,
        speedX: Math.random() * 0.6 - 0.15,
        speedY: Math.random() * 1.0 + 0.4,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 1.8,
        opacity: Math.random() * 0.5 + 0.25,
        type: Math.random() > 0.45 ? "petal" : "sparkle"
      });
    }
  }

  // --- TƯƠNG TÁC CHUỘT / CẢM ỨNG 3D XOAY 360° ---
  initInteractiveListeners() {
    if (!this.canvas) return;

    this.canvas.addEventListener("pointerdown", e => {
      this.isDragging = true;
      this.dragStartX = e.clientX;
      this.dragStartRot = this.targetRotationY;
      this.lastDragX = e.clientX;
      this.dragVelocity = 0;
      this.canvas.style.cursor = "grabbing";
      if (this.canvas.setPointerCapture) {
        try { this.canvas.setPointerCapture(e.pointerId); } catch (err) {}
      }
    });

    window.addEventListener("pointermove", e => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.dragStartX;
      this.dragVelocity = (e.clientX - this.lastDragX) * 0.007;
      this.lastDragX = e.clientX;
      this.targetRotationY = this.dragStartRot + dx * 0.008;
    });

    const stopDrag = () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      if (this.canvas) this.canvas.style.cursor = "grab";
    };

    window.addEventListener("pointerup", stopDrag);
    window.addEventListener("pointercancel", stopDrag);

    // Lăn chuột zoom phóng to / thu nhỏ
    this.canvas.addEventListener("wheel", e => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.05 : -0.05;
      this.targetZoomLevel = Math.max(0.65, Math.min(1.5, this.targetZoomLevel + delta));
    }, { passive: false });
  }

  // Chuyển đổi Góc Nhìn (Camera View Presets)
  setViewMode(mode) {
    this.viewMode = mode;
    if (mode === "full") {
      // Góc nhìn toàn bộ outfit: Trọn vẹn từ phụ kiện đầu tới giày và bóng đổ
      this.targetZoomLevel = 0.88;
      this.targetOffsetY = 38;
      this.targetRotationY = 0;
      this.isAutoRotating = false;
    } else if (mode === "close") {
      // Cận cảnh áo: Zoom sâu vào ngực áo, nẹp vạt hữu nhậm, khuy ngũ thường, hoa văn và cổ áo
      this.targetZoomLevel = 1.38;
      this.targetOffsetY = -135;
      this.targetRotationY = 0;
      this.isAutoRotating = false;
    } else if (mode === "angle") {
      // Góc nghiêng 3/4 3D: Thể hiện độ dày, độ rủ của tà áo và layer streetwear
      this.targetZoomLevel = 0.94;
      this.targetOffsetY = 25;
      this.targetRotationY = 0.58; // ~33 độ
      this.isAutoRotating = false;
    } else if (mode === "back") {
      // Mặt sau: Xoay 180 độ xem tà sau, nếp vải và kiểu tóc phía sau
      this.targetZoomLevel = 0.90;
      this.targetOffsetY = 30;
      this.targetRotationY = Math.PI; // 180 độ
      this.isAutoRotating = false;
    }
  }

  toggleAutoRotate() {
    this.isAutoRotating = !this.isAutoRotating;
    return this.isAutoRotating;
  }

  resetRotation() {
    this.targetRotationY = 0;
    this.rotationY = 0;
    this.targetZoomLevel = 0.88;
    this.targetOffsetY = 38;
  }

  setUserAvatar(imgElement) {
    this.userImage = imgElement;
    if (this.currentOutfit) this.render(this.currentOutfit);
  }

  clearUserAvatar() {
    this.userImage = null;
    if (this.currentOutfit) this.render(this.currentOutfit);
  }

  // --- VÒNG LẶP HOẠT HỌA 3D CONTINUOUS RENDER LOOP ---
  startAnimationLoop() {
    const loop = () => {
      // Cập nhật góc xoay với quán tính mượt
      if (this.isAutoRotating) {
        this.targetRotationY += 0.012;
      } else if (!this.isDragging && Math.abs(this.dragVelocity) > 0.0001) {
        this.targetRotationY += this.dragVelocity;
        this.dragVelocity *= 0.92; // Giảm tốc tự nhiên
      }

      // Nội suy mượt mà (Lerp)
      this.rotationY += (this.targetRotationY - this.rotationY) * 0.12;
      this.zoomLevel += (this.targetZoomLevel - this.zoomLevel) * 0.12;
      this.offsetY += (this.targetOffsetY - this.offsetY) * 0.12;

      // Chuẩn hóa góc xoay trong khoảng -PI đến PI
      while (this.rotationY > Math.PI) {
        this.rotationY -= Math.PI * 2;
        this.targetRotationY -= Math.PI * 2;
      }
      while (this.rotationY < -Math.PI) {
        this.rotationY += Math.PI * 2;
        this.targetRotationY += Math.PI * 2;
      }

      if (this.currentOutfit) {
        this.drawScene(this.currentOutfit);
      }

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  render(outfit) {
    this.currentOutfit = outfit;
    this.drawScene(outfit);
  }

  // --- 3D PROJECTION HELPER ---
  // Chiếu điểm 3D (x, z) theo góc xoay rotationY
  projX(x, z = 0) {
    const cos = Math.cos(this.rotationY);
    const sin = Math.sin(this.rotationY);
    return x * cos - z * sin;
  }

  projZ(x, z = 0) {
    const cos = Math.cos(this.rotationY);
    const sin = Math.sin(this.rotationY);
    return x * sin + z * cos;
  }

  // Tính toán độ sáng theo góc xoay (Directional Rim Lighting)
  getLightShade(surfaceNormalAngle = 0) {
    const effectiveAngle = this.rotationY + surfaceNormalAngle;
    const diff = Math.cos(effectiveAngle - this.lightAngle);
    // Trả về hệ số từ 0.72 (tối bên khuất) đến 1.15 (sáng bên hứng sáng)
    return 0.75 + 0.35 * Math.max(0, (diff + 1) / 2);
  }

  // --- HÀM VẼ TOÀN BỘ BỐI CẢNH & NHÂN VẬT 3D ---
  drawScene(outfit) {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    try {
      ctx.save();
      ctx.clearRect(0, 0, w, h);

      // 1. Bối cảnh không gian di sản
      this.drawBackground(ctx, w, h, outfit.bg || "hue_palace");

      // 2. Cánh hoa & hạt sáng bay theo gió
      this.drawParticles(ctx, w, h);

      // 3. Khung tọa độ 3D trung tâm người mẫu
      ctx.save();
      ctx.translate(w / 2, this.offsetY);
      ctx.scale(this.zoomLevel, this.zoomLevel);

      // Bóng đổ 3D dưới sàn
      this.drawShadow(ctx);

      const rot = this.rotationY;
      const isBackView = Math.abs(rot) > Math.PI / 2; // Góc nhìn lưng

      // Thứ tự vẽ lớp 3D (Depth-Sorted)
      if (isBackView) {
        // [Góc nhìn Mặt Sau]
        // 1. Phụ kiện phía trước (bị khuất một phần)
        // 2. Chân & Quần
        this.drawBottoms3D(ctx, outfit, true);
        // 3. Thân người mẫu cơ bản
        this.drawBody3D(ctx, outfit, true);
        // 4. Áo chính (Mặt sau phẳng mượt, đường may sống lưng)
        this.drawGarment3D(ctx, outfit, true);
        // 5. Áo khoác ngoài Blazer (nếu có)
        if (outfit.modernAcc === "blazer_oversized") {
          this.drawBlazer3D(ctx, outfit, true);
        }
        // 6. Đầu, Tóc & Phụ Kiện Phía Sau
        this.drawHead3D(ctx, outfit, true);
        this.drawAccessories3D(ctx, outfit, true);
      } else {
        // [Góc nhìn Mặt Trước & 3/4]
        // 1. Tóc phía sau & Cổ sau
        this.drawRearHairAndBackdrop(ctx, outfit);
        // 2. Chân & Quần
        this.drawBottoms3D(ctx, outfit, false);
        // 3. Thân người mẫu cơ bản (cổ thon, ngực, cánh tay nối liền lạc)
        this.drawBody3D(ctx, outfit, false);
        // 4. Áo chính Việt Phục ôm fit cơ thể
        this.drawGarment3D(ctx, outfit, false);
        // 5. Áo khoác Blazer Gen Z (nếu có)
        if (outfit.modernAcc === "blazer_oversized") {
          this.drawBlazer3D(ctx, outfit, false);
        }
        // 6. Đầu, Gương mặt V-line & Cổ lót
        this.drawHead3D(ctx, outfit, false);
        // 7. Phụ kiện trước (Khăn rằn uốn lượn, tai nghe bluetooth, dây chuyền)
        this.drawAccessories3D(ctx, outfit, false);
      }

      ctx.restore();

      // 4. Khung viền Tạp chí & Watermark Runway
      this.drawEditorialFrame(ctx, w, h, outfit);

      ctx.restore();
    } catch (err) {
      console.warn("VietPhucMannequin drawScene error:", err);
    }
  }

  // --- 1. BỐI CẢNH KHÔNG GIAN ---
  drawBackground(ctx, w, h, bgKey) {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    if (bgKey === "hue_palace") {
      grad.addColorStop(0, "#08121e");
      grad.addColorStop(0.35, "#1e293b");
      grad.addColorStop(0.75, "#334155");
      grad.addColorStop(1, "#0f172a");
    } else if (bgKey === "ho_guom") {
      grad.addColorStop(0, "#04151f");
      grad.addColorStop(0.4, "#002a42");
      grad.addColorStop(0.8, "#004966");
      grad.addColorStop(1, "#0d2116");
    } else if (bgKey === "hoi_an") {
      grad.addColorStop(0, "#130122");
      grad.addColorStop(0.45, "#2d004d");
      grad.addColorStop(0.8, "#6a0572");
      grad.addColorStop(1, "#ab2f05");
    } else if (bgKey === "cyber_saigon") {
      grad.addColorStop(0, "#03030a");
      grad.addColorStop(0.45, "#14052b");
      grad.addColorStop(0.8, "#280644");
      grad.addColorStop(1, "#830058");
    } else {
      // Studio Minimalist
      grad.addColorStop(0, "#0f1117");
      grad.addColorStop(0.5, "#181c26");
      grad.addColorStop(1, "#0b0d13");
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Ánh sáng sân khấu Runway (Spotlight mềm)
    const spot = ctx.createRadialGradient(w / 2, 280, 20, w / 2, 280, 360);
    spot.addColorStop(0, "rgba(255, 240, 200, 0.12)");
    spot.addColorStop(0.6, "rgba(255, 209, 102, 0.04)");
    spot.addColorStop(1, "transparent");
    ctx.fillStyle = spot;
    ctx.fillRect(0, 0, w, h);

    // Họa tiết kiến trúc di sản nhẹ nhàng
    ctx.save();
    ctx.globalAlpha = 0.22;
    if (bgKey === "hue_palace") {
      // Vầng trăng hoàng gia & mái đình
      ctx.beginPath();
      ctx.arc(w - 110, 140, 44, 0, Math.PI * 2);
      ctx.fillStyle = "#fef08a";
      ctx.fill();

      ctx.fillStyle = "#ffd166";
      ctx.beginPath();
      ctx.moveTo(30, h - 170);
      ctx.lineTo(w / 2, h - 250);
      ctx.lineTo(w - 30, h - 170);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();
    } else if (bgKey === "hoi_an") {
      const lanterns = [
        { x: 65, y: 110, r: 22, c: "#ff0055" },
        { x: 125, y: 75, r: 16, c: "#ffb703" },
        { x: w - 85, y: 100, r: 24, c: "#fb5607" },
        { x: w - 145, y: 65, r: 18, c: "#9d4edd" }
      ];
      lanterns.forEach(l => {
        ctx.fillStyle = l.c;
        ctx.beginPath();
        ctx.ellipse(l.x, l.y, l.r * 0.7, l.r, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ffd166";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(l.x, 0);
        ctx.lineTo(l.x, l.y - l.r);
        ctx.moveTo(l.x, l.y + l.r);
        ctx.lineTo(l.x, l.y + l.r + 20);
        ctx.stroke();
      });
    } else if (bgKey === "cyber_saigon") {
      ctx.strokeStyle = "#00f5d4";
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, h - 180);
        ctx.lineTo(w / 2 + (x - w / 2) * 2.2, h);
        ctx.stroke();
      }
      ctx.strokeStyle = "#f72585";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, h - 180);
      ctx.lineTo(w, h - 180);
      ctx.stroke();
    }
    ctx.restore();
  }

  // --- 2. CÁNH HOA & BỤI SÁNG BAY ---
  drawParticles(ctx, w, h) {
    ctx.save();
    this.particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotSpeed;

      if (p.y > h + 20) { p.y = -20; p.x = Math.random() * w; }
      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;

      if (p.type === "petal") {
        ctx.fillStyle = "#fb7185";
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 1.8, 0.4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = "#fde047";
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.45, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
    ctx.restore();
  }

  // --- 3. BÓNG ĐỔ SÀN 3D ---
  drawShadow(ctx) {
    ctx.save();
    const shadowWidth = 115 * (1 + 0.15 * Math.abs(Math.sin(this.rotationY)));
    const grad = ctx.createRadialGradient(0, 690, 10, 0, 690, shadowWidth);
    grad.addColorStop(0, "rgba(0, 0, 0, 0.55)");
    grad.addColorStop(0.5, "rgba(0, 0, 0, 0.25)");
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(0, 690, shadowWidth, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // --- TÓC PHÍA SAU (KHI NHÌN TỪ TRƯỚC) ---
  drawRearHairAndBackdrop(ctx, outfit) {
    const gender = outfit.gender || "female";
    ctx.save();
    ctx.fillStyle = "#171717";

    if (gender === "female") {
      // Suối tóc dài óng ả xõa sau lưng
      ctx.beginPath();
      ctx.moveTo(-32, 60);
      ctx.quadraticCurveTo(-38, 140, -42, 270);
      ctx.quadraticCurveTo(0, 285, 42, 270);
      ctx.quadraticCurveTo(38, 140, 32, 60);
      ctx.closePath();
      ctx.fill();
    } else {
      // Tóc nam gọn gàng gáy
      ctx.beginPath();
      ctx.ellipse(0, 75, 33, 40, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // --- 4. THÂN NGƯỜI MẪU 3D LIỀN MẠCH (KHÔNG BỊ HỞ CỔ) ---
  drawBody3D(ctx, outfit, isBackView) {
    const gender = outfit.gender || "female";
    const shade = this.getLightShade(0);

    ctx.save();
    // Tone da tự nhiên cao cấp
    const skinColor = gender === "male" ? "#eab69f" : "#fcd5ce";
    ctx.fillStyle = skinColor;

    const shoulderW = gender === "male" ? 68 : (gender === "unisex" ? 64 : 58);
    const leftX = this.projX(-shoulderW, 0);
    const rightX = this.projX(shoulderW, 0);
    const neckLeft = this.projX(-16, 0);
    const neckRight = this.projX(16, 0);

    // CỔ LIỀN KHỐI TỪ CẰM (Y: 92) XUỐNG XƯƠNG QUAI XANH (Y: 158)
    ctx.beginPath();
    ctx.moveTo(neckLeft, 92);
    ctx.lineTo(neckRight, 92);
    ctx.quadraticCurveTo(neckRight + 2, 125, rightX * 0.4, 158);
    ctx.lineTo(leftX * 0.4, 158);
    ctx.quadraticCurveTo(neckLeft - 2, 125, neckLeft, 92);
    ctx.closePath();
    ctx.fill();

    // Bóng đổ tự nhiên dưới cằm
    ctx.fillStyle = "rgba(0, 0, 0, 0.14)";
    ctx.beginPath();
    ctx.ellipse(0, 108, 18, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // VAI & CÁNH TAY 3D
    ctx.fillStyle = skinColor;
    // Cánh tay trái
    const armLeftShoulder = this.projX(-shoulderW + 4, 0);
    const armLeftElbow = this.projX(-shoulderW - 14, 8);
    const armLeftWrist = this.projX(-shoulderW - 6, 4);

    ctx.beginPath();
    ctx.moveTo(armLeftShoulder, 162);
    ctx.lineTo(armLeftElbow, 260);
    ctx.lineTo(armLeftWrist, 345);
    ctx.lineTo(armLeftWrist + 14, 345);
    ctx.lineTo(armLeftElbow + 16, 258);
    ctx.lineTo(armLeftShoulder + 18, 168);
    ctx.closePath();
    ctx.fill();

    // Cánh tay phải
    const armRightShoulder = this.projX(shoulderW - 4, 0);
    const armRightElbow = this.projX(shoulderW + 14, -8);
    const armRightWrist = this.projX(shoulderW + 6, -4);

    ctx.beginPath();
    ctx.moveTo(armRightShoulder, 162);
    ctx.lineTo(armRightElbow, 260);
    ctx.lineTo(armRightWrist, 345);
    ctx.lineTo(armRightWrist - 14, 345);
    ctx.lineTo(armRightElbow - 16, 258);
    ctx.lineTo(armRightShoulder - 18, 168);
    ctx.closePath();
    ctx.fill();

    // Bàn tay búp măng thanh nhã
    ctx.beginPath();
    ctx.ellipse(armLeftWrist + 7, 355, 6, 12, -0.1, 0, Math.PI * 2);
    ctx.ellipse(armRightWrist - 7, 355, 6, 12, 0.1, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // --- 5. LỚP QUẦN & CHÂN VÁY 3D ---
  drawBottoms3D(ctx, outfit, isBackView) {
    const bottomKey = outfit.bottom || "quan_lua_suong";
    const bottomColor = outfit.bottomColor || "#f8f9fa";
    const shade = this.getLightShade(0);

    ctx.save();

    if (bottomKey === "quan_lua_suong" || bottomKey === "quan_linen_ong_dung") {
      // QUẦN LỤA ỐNG RỘNG SUÔNG THƯỚT THA
      ctx.fillStyle = bottomColor;

      // Ống trái
      const pL_top = this.projX(-36, 0);
      const pL_in = this.projX(-8, 5);
      const pL_bot_in = this.projX(-16, 5);
      const pL_bot_out = this.projX(-68, -5);

      ctx.beginPath();
      ctx.moveTo(pL_top, 335);
      ctx.lineTo(pL_in, 360);
      ctx.lineTo(pL_bot_in, 655);
      ctx.lineTo(pL_bot_out, 650);
      ctx.closePath();
      ctx.fill();

      // Ống phải
      const pR_top = this.projX(36, 0);
      const pR_in = this.projX(8, -5);
      const pR_bot_in = this.projX(16, -5);
      const pR_bot_out = this.projX(68, 5);

      ctx.beginPath();
      ctx.moveTo(pR_top, 335);
      ctx.lineTo(pR_in, 360);
      ctx.lineTo(pR_bot_in, 655);
      ctx.lineTo(pR_bot_out, 650);
      ctx.closePath();
      ctx.fill();

      // Nếp gấp 3D rủ lụa tơ tằm
      ctx.strokeStyle = "rgba(0, 0, 0, 0.16)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pL_top + 10, 370);
      ctx.lineTo(pL_bot_out + 25, 645);
      ctx.moveTo(pR_top - 10, 370);
      ctx.lineTo(pR_bot_out - 25, 645);
      ctx.stroke();

    } else if (bottomKey === "quan_cargo_street") {
      // QUẦN CARGO STREETWEAR TÚI HỘP GEN Z
      ctx.fillStyle = bottomColor || "#1f242d";

      const cL_out = this.projX(-66, 0);
      const cL_in = this.projX(-8, 5);
      const cR_in = this.projX(8, -5);
      const cR_out = this.projX(66, 0);

      // Ống trái phồng
      ctx.beginPath();
      ctx.moveTo(this.projX(-38, 0), 335);
      ctx.lineTo(cL_in, 360);
      ctx.lineTo(this.projX(-18, 5), 642);
      ctx.lineTo(cL_out, 642);
      ctx.closePath();
      ctx.fill();

      // Ống phải phồng
      ctx.beginPath();
      ctx.moveTo(this.projX(38, 0), 335);
      ctx.lineTo(cR_in, 360);
      ctx.lineTo(this.projX(18, -5), 642);
      ctx.lineTo(cR_out, 642);
      ctx.closePath();
      ctx.fill();

      // Túi hộp 3D hai bên đùi
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      const pocketLX = this.projX(-64, 8);
      const pocketRX = this.projX(44, -8);
      ctx.fillRect(pocketLX, 415, 26, 38);
      ctx.fillRect(pocketRX, 415, 26, 38);

      // Dây strap rủ màu Cyber Pink
      ctx.strokeStyle = "#f72585";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(pocketLX + 6, 445);
      ctx.bezierCurveTo(pocketLX - 15, 485, pocketLX + 5, 520, pocketLX, 560);
      ctx.stroke();

    } else if (bottomKey === "vay_tennis_pleated") {
      // CHÂN VÁY TENNIS XẾP LY NGẮN GEN Z
      ctx.fillStyle = bottomColor || "#ffffff";
      const skirtTopL = this.projX(-44, 0);
      const skirtTopR = this.projX(44, 0);
      const skirtBotL = this.projX(-74, 0);
      const skirtBotR = this.projX(74, 0);

      ctx.beginPath();
      ctx.moveTo(skirtTopL, 330);
      ctx.lineTo(skirtTopR, 330);
      ctx.lineTo(skirtBotR, 425);
      ctx.lineTo(skirtBotL, 425);
      ctx.closePath();
      ctx.fill();

      // Nếp gấp xếp ly 3D
      ctx.strokeStyle = "rgba(0, 0, 0, 0.22)";
      ctx.lineWidth = 1.6;
      for (let i = -55; i <= 55; i += 12) {
        const topPx = this.projX(i * 0.65, 0);
        const botPx = this.projX(i * 1.15, 0);
        ctx.beginPath();
        ctx.moveTo(topPx, 330);
        ctx.lineTo(botPx, 425);
        ctx.stroke();
      }

      // Đôi chân thon dài phía dưới váy
      const skinTone = outfit.gender === "male" ? "#eab69f" : "#fcd5ce";
      ctx.fillStyle = skinTone;
      const legL = this.projX(-26, 0);
      const legR = this.projX(14, 0);
      ctx.fillRect(legL, 425, 22, 225);
      ctx.fillRect(legR, 425, 22, 225);

    } else if (bottomKey === "quan_jeans_wide_leg") {
      // QUẦN JEANS WASH ỐNG RỘNG
      ctx.fillStyle = bottomColor || "#3a5a80";
      const jL = this.projX(-64, 0);
      const jR = this.projX(64, 0);
      ctx.beginPath();
      ctx.moveTo(this.projX(-38, 0), 335);
      ctx.lineTo(this.projX(-8, 5), 360);
      ctx.lineTo(this.projX(-18, 5), 650);
      ctx.lineTo(jL, 650);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(this.projX(38, 0), 335);
      ctx.lineTo(this.projX(8, -5), 360);
      ctx.lineTo(this.projX(18, -5), 650);
      ctx.lineTo(jR, 650);
      ctx.closePath();
      ctx.fill();

      // Vết rách gối cá tính
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(this.projX(-50, 0), 485, 24, 3);

    } else {
      // Váy đụp đũi đen dân gian
      ctx.fillStyle = "#18181b";
      ctx.beginPath();
      ctx.moveTo(this.projX(-40, 0), 330);
      ctx.lineTo(this.projX(40, 0), 330);
      ctx.lineTo(this.projX(72, 0), 635);
      ctx.lineTo(this.projX(-72, 0), 635);
      ctx.closePath();
      ctx.fill();
    }

    // Giày / Dép 3D
    this.drawFootwear3D(ctx, outfit, isBackView);

    ctx.restore();
  }

  // --- VẼ GIÀY DÉP 3D ---
  drawFootwear3D(ctx, outfit, isBackView) {
    const isChunky = outfit.modernAcc === "chunky_sneaker";
    const isGuocMoc = outfit.tradAcc === "guoc_moc_quai_nhung";

    ctx.save();
    const footLX = this.projX(-46, 0);
    const footRX = this.projX(26, 0);

    if (isChunky) {
      // CHUNKY SNEAKER ĐẾ BÁNH MÌ STREETWEAR
      ctx.fillStyle = "#ffffff";
      drawSafeRoundedRect(ctx, footLX - 16, 645, 52, 26, 8);
      ctx.fill();
      drawSafeRoundedRect(ctx, footRX - 8, 645, 52, 26, 8);
      ctx.fill();

      // Chi tiết phối màu Neon Cyber
      ctx.fillStyle = "#f72585";
      ctx.fillRect(footLX - 10, 652, 36, 4);
      ctx.fillRect(footRX - 2, 652, 36, 4);

      // Đế gân hầm hố
      ctx.fillStyle = "#e4e4e7";
      ctx.fillRect(footLX - 16, 664, 52, 7);
      ctx.fillRect(footRX - 8, 664, 52, 7);

    } else if (isGuocMoc) {
      // GUỐC MỘC TRUYỀN THỐNG QUAI NHUNG ĐỎ
      ctx.fillStyle = "#78350f"; // Gỗ xoan đào
      ctx.fillRect(footLX - 10, 654, 40, 14);
      ctx.fillRect(footRX, 654, 40, 14);

      // Quai nhung đỏ son
      ctx.fillStyle = "#dc2626";
      ctx.fillRect(footLX - 6, 646, 28, 9);
      ctx.fillRect(footRX + 4, 646, 28, 9);

    } else {
      // Hài nhung / Loafer đen thanh lịch
      ctx.fillStyle = "#18181b";
      drawSafeRoundedRect(ctx, footLX - 12, 648, 44, 20, 6);
      ctx.fill();
      drawSafeRoundedRect(ctx, footRX - 4, 648, 44, 20, 6);
      ctx.fill();
    }
    ctx.restore();
  }

  // --- 6. VẼ ÁO CHÍNH VIỆT PHỤC ÔM FIT CƠ THỂ 3D ---
  drawGarment3D(ctx, outfit, isBackView) {
    const garmentKey = outfit.garment || "ngu_than_tay_chen";
    const color = outfit.colorHex || "#1d3557";
    const pattern = outfit.pattern || "sen_dam";

    ctx.save();

    if (garmentKey === "ngu_than_tay_chen") {
      this.drawAoNguThanTayChen3D(ctx, color, pattern, outfit, isBackView);
    } else if (garmentKey === "ngu_than_tay_thung") {
      this.drawAoTacTayThung3D(ctx, color, pattern, outfit, isBackView);
    } else if (garmentKey === "ao_tu_than") {
      this.drawAoTuThan3D(ctx, color, pattern, outfit, isBackView);
    } else if (garmentKey === "ao_nhat_binh") {
      this.drawAoNhatBinh3D(ctx, color, pattern, outfit, isBackView);
    } else if (garmentKey === "ao_dai_tan_thoi") {
      this.drawAoDaiModern3D(ctx, color, pattern, outfit, isBackView);
    } else if (garmentKey === "ao_ba_ba_remix") {
      this.drawAoBaBa3D(ctx, color, pattern, outfit, isBackView);
    } else {
      this.drawAoGiaoLinh3D(ctx, color, pattern, outfit, isBackView);
    }

    ctx.restore();
  }

  // A. ÁO NGŨ THÂN TAY CHẼN (CHUẨN HỮU NHẬM & FIT THÂN HÌNH)
  drawAoNguThanTayChen3D(ctx, color, pattern, outfit, isBackView) {
    const shoulderL = this.projX(-54, 0);
    const shoulderR = this.projX(54, 0);
    const waistL = this.projX(-42, 0);
    const waistR = this.projX(42, 0);
    const hemL = this.projX(-78, 0);
    const hemR = this.projX(78, 0);

    ctx.save();

    // 1. Thân áo chính (Thắt eo mềm mại, tà xòe chữ A buông qua gối)
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(shoulderL, 154);
    ctx.lineTo(shoulderR, 154);
    ctx.lineTo(waistR, 260); // Eo fit gọn
    ctx.lineTo(hemR, 545);   // Tà dưới buông dài qua gối
    ctx.lineTo(hemL, 545);
    ctx.lineTo(waistL, 260);
    ctx.closePath();
    ctx.fill();

    // Hiệu ứng ánh sáng & bóng đổ 3D trên bề mặt vải
    const grad = ctx.createLinearGradient(shoulderL, 154, shoulderR, 154);
    grad.addColorStop(0, "rgba(255, 255, 255, 0.16)");
    grad.addColorStop(0.5, "rgba(255, 255, 255, 0)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0.28)");
    ctx.fillStyle = grad;
    ctx.fill();

    // Phủ hoa văn vải di sản
    this.applyFabricPattern3D(ctx, pattern, -80, 155, 160, 390);

    // 2. Tay áo chẽn (ôm bắp tay, nếp gấp mềm mại tại khuỷu tay)
    this.drawFittedSleeves(ctx, color, 24);

    if (isBackView) {
      // ĐƯỜNG MAY SỐNG LƯNG CHUẨN CỔ TRUYỀN (CHÍNH TRỰC)
      ctx.strokeStyle = "rgba(0, 0, 0, 0.35)";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(0, 154);
      ctx.lineTo(0, 545);
      ctx.stroke();

      // Cổ đứng phía sau ôm khít
      ctx.fillStyle = color;
      drawSafeRoundedRect(ctx, this.projX(-20, 0), 126, 40, 28, 4);
      ctx.fill();
    } else {
      // 3. CỔ ĐỨNG LẬP LĨNH ÔM TRỌN CỔ (Y: 126 ĐẾN 155) - KHÔNG BỊ HỞ
      const colL = this.projX(-21, 0);
      const colW = 42;
      ctx.fillStyle = color;
      drawSafeRoundedRect(ctx, colL, 126, colW, 28, 5);
      ctx.fill();

      // Cổ lót bạch ngọc (viền trắng bên trong thể hiện sự thanh bạch)
      ctx.fillStyle = "#ffffff";
      drawSafeRoundedRect(ctx, colL + 2, 124, colW - 4, 5, 2);
      ctx.fill();

      // 4. Đường nẹp vạt 'HỮU NHẬM' (Vạt phải đè vạt trái mềm mại hình chữ S)
      const lapelTurn = this.projX(32, 5);
      ctx.strokeStyle = "rgba(0, 0, 0, 0.38)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(this.projX(0, 5), 154);
      ctx.quadraticCurveTo(this.projX(18, 5), 185, lapelTurn, 220); // Lượn sang nách phải
      ctx.lineTo(this.projX(34, 5), 410);                          // Dọc sườn phải
      ctx.stroke();

      // 5 NÚT CÀI NGŨ THƯỜNG (Nhân, Lễ, Nghĩa, Trí, Tín)
      const buttons = [
        { x: this.projX(0, 5), y: 142 },   // Cúc cổ
        { x: this.projX(14, 5), y: 172 },  // Cúc yết hầu
        { x: this.projX(28, 5), y: 212 },  // Cúc nách
        { x: this.projX(33, 5), y: 265 },  // Cúc sườn trên
        { x: this.projX(34, 5), y: 320 }   // Cúc sườn dưới
      ];
      ctx.fillStyle = "#ffd166"; // Khuy vàng hoàng gia
      buttons.forEach(b => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#854d0e";
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    }

    ctx.restore();
  }

  // B. ÁO TẤC (NGŨ THÂN TAY THỤNG ĐẠI LỄ HOÀNG GIA)
  drawAoTacTayThung3D(ctx, color, pattern, outfit, isBackView) {
    const sL = this.projX(-58, 0);
    const sR = this.projX(58, 0);

    ctx.save();
    // Thân áo thụng uy nghi
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(sL, 154);
    ctx.lineTo(sR, 154);
    ctx.lineTo(this.projX(88, 0), 410);
    ctx.lineTo(this.projX(102, 0), 570);
    ctx.lineTo(this.projX(-102, 0), 570);
    ctx.lineTo(this.projX(-88, 0), 410);
    ctx.closePath();
    ctx.fill();

    this.applyFabricPattern3D(ctx, pattern, -100, 155, 200, 415);

    // Ống tay thụng buông dài (rộng 35-40cm)
    const tL_cuff = this.projX(-148, 10);
    const tR_cuff = this.projX(148, -10);

    ctx.fillStyle = color;
    // Tay trái
    ctx.beginPath();
    ctx.moveTo(sL, 154);
    ctx.lineTo(tL_cuff, 275);
    ctx.lineTo(tL_cuff + 8, 415);
    ctx.lineTo(this.projX(-45, 0), 260);
    ctx.closePath();
    ctx.fill();

    // Tay phải
    ctx.beginPath();
    ctx.moveTo(sR, 154);
    ctx.lineTo(tR_cuff, 275);
    ctx.lineTo(tR_cuff - 8, 415);
    ctx.lineTo(this.projX(45, 0), 260);
    ctx.closePath();
    ctx.fill();

    // Viền mép cửa tay gấm hoàng gia
    ctx.strokeStyle = "#fef08a";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(tL_cuff, 275);
    ctx.lineTo(tL_cuff + 8, 415);
    ctx.moveTo(tR_cuff, 275);
    ctx.lineTo(tR_cuff - 8, 415);
    ctx.stroke();

    if (!isBackView) {
      // Cổ đứng và cổ lót
      ctx.fillStyle = color;
      drawSafeRoundedRect(ctx, this.projX(-22, 0), 126, 44, 28, 5);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      drawSafeRoundedRect(ctx, this.projX(-20, 0), 124, 40, 5, 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // C. ÁO TỨ THÂN & YẾM ĐÀO
  drawAoTuThan3D(ctx, color, pattern, outfit, isBackView) {
    ctx.save();

    if (!isBackView) {
      // 1. Chiếc Yếm Đào bên trong (Sắc thắm hoa đào)
      ctx.fillStyle = "#e11d48";
      ctx.beginPath();
      ctx.moveTo(this.projX(-30, 8), 154);
      ctx.lineTo(this.projX(30, 8), 154);
      ctx.lineTo(this.projX(38, 8), 310);
      ctx.lineTo(this.projX(-38, 8), 310);
      ctx.closePath();
      ctx.fill();

      // Dải dây yếm buộc thanh mảnh ôm quanh cổ
      ctx.strokeStyle = "#be123c";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(this.projX(-24, 8), 154);
      ctx.lineTo(this.projX(-8, 8), 128);
      ctx.moveTo(this.projX(24, 8), 154);
      ctx.lineTo(this.projX(8, 8), 128);
      ctx.stroke();
    }

    // 2. Hai vạt sau áo tứ thân
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(this.projX(-54, 0), 154);
    ctx.lineTo(this.projX(54, 0), 154);
    ctx.lineTo(this.projX(84, 0), 525);
    ctx.lineTo(this.projX(-84, 0), 525);
    ctx.closePath();
    ctx.fill();

    this.applyFabricPattern3D(ctx, pattern, -84, 154, 168, 370);

    // Tay áo xắn cao lanh lẹ
    this.drawFittedSleeves(ctx, color, 20);

    if (!isBackView) {
      // 3. Hai vạt trước buộc gút chéo duyên dáng trước bụng
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(this.projX(-54, 0), 154);
      ctx.lineTo(this.projX(-18, 12), 320);
      ctx.lineTo(this.projX(-36, 12), 450);
      ctx.lineTo(this.projX(-62, 0), 320);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(this.projX(54, 0), 154);
      ctx.lineTo(this.projX(18, 12), 320);
      ctx.lineTo(this.projX(36, 12), 450);
      ctx.lineTo(this.projX(62, 0), 320);
      ctx.closePath();
      ctx.fill();

      // Thắt lưng bao xanh ngọc giữ nếp thắt đáy lưng ong
      ctx.fillStyle = "#0d9488";
      ctx.fillRect(this.projX(-38, 14), 304, 76, 18);
      // Dải lụa thắt lưng rủ mềm
      ctx.beginPath();
      ctx.moveTo(this.projX(0, 14), 322);
      ctx.lineTo(this.projX(-14, 14), 435);
      ctx.lineTo(this.projX(6, 14), 435);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  // D. ÁO NHẬT BÌNH CUNG ĐÌNH NGUYỄN
  drawAoNhatBinh3D(ctx, color, pattern, outfit, isBackView) {
    ctx.save();
    // Thân áo suông quyền quý
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(this.projX(-56, 0), 154);
    ctx.lineTo(this.projX(56, 0), 154);
    ctx.lineTo(this.projX(88, 0), 555);
    ctx.lineTo(this.projX(-88, 0), 555);
    ctx.closePath();
    ctx.fill();

    this.applyFabricPattern3D(ctx, pattern, -88, 154, 176, 400);

    // Cửa tay viền dải ngũ sắc
    const ngusac = ["#dc2626", "#f59e0b", "#1e3a8a", "#059669", "#f8fafc"];
    this.drawFittedSleeves(ctx, color, 30);

    if (!isBackView) {
      // CỔ XẺ HÌNH CHỮ NHẬT TO BẢN 'NHẬT BÌNH' VỚI DẢI NGŨ SẮC
      ngusac.forEach((c, idx) => {
        ctx.strokeStyle = c;
        ctx.lineWidth = 3.5;
        const wOffset = idx * 3;
        const hOffset = idx * 2.5;
        ctx.strokeRect(this.projX(-26 + wOffset, 8), 140 + hOffset, 52 - wOffset * 2, 78 - hOffset * 2);
      });

      // Dây thao đính ngọc bích rủ trước ngực
      ctx.strokeStyle = "#ffd166";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(0, 220);
      ctx.lineTo(0, 335);
      ctx.stroke();
      ctx.fillStyle = "#10b981"; // Ngọc bích cẩm thạch
      ctx.beginPath();
      ctx.arc(0, 340, 7, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // E. ÁO DÀI CÁCH TÂN GEN Z
  drawAoDaiModern3D(ctx, color, pattern, outfit, isBackView) {
    ctx.save();
    const sL = this.projX(-48, 0);
    const sR = this.projX(48, 0);

    // Tà trước & tà sau thắt eo quyến rũ, xẻ tà cao năng động
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(sL, 154);
    ctx.lineTo(sR, 154);
    ctx.lineTo(this.projX(34, 0), 258); // Eo thắt tinh tế
    ctx.lineTo(this.projX(64, 0), 485); // Tà lửng qua gối
    ctx.lineTo(this.projX(-64, 0), 485);
    ctx.lineTo(this.projX(-34, 0), 258);
    ctx.closePath();
    ctx.fill();

    this.applyFabricPattern3D(ctx, pattern, -64, 154, 128, 330);

    // Tay lửng hiện đại
    this.drawFittedSleeves(ctx, color, 18, 270);

    if (!isBackView) {
      // Cổ tròn cách tân ôm sát chân cổ
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, 150, 18, 0, Math.PI);
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.8;
      ctx.stroke();
    }
    ctx.restore();
  }

  // F. ÁO BÀ BA REMIX
  drawAoBaBa3D(ctx, color, pattern, outfit, isBackView) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(this.projX(-50, 0), 154);
    ctx.lineTo(this.projX(50, 0), 154);
    ctx.lineTo(this.projX(54, 0), 350);
    ctx.lineTo(this.projX(-54, 0), 350);
    ctx.closePath();
    ctx.fill();

    this.applyFabricPattern3D(ctx, pattern, -54, 154, 108, 196);
    this.drawFittedSleeves(ctx, color, 18, 320);

    if (!isBackView) {
      // Cổ tim nhẹ & hàng khuy bấm giữa
      ctx.strokeStyle = "rgba(0,0,0,0.25)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 160);
      ctx.lineTo(0, 350);
      ctx.stroke();
      // Khuy ngọc
      ctx.fillStyle = "#ffffff";
      for (let y = 175; y <= 330; y += 38) {
        ctx.beginPath();
        ctx.arc(0, y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  // G. ÁO GIAO LĨNH (CỔ VẠT CHÉO)
  drawAoGiaoLinh3D(ctx, color, pattern, outfit, isBackView) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(this.projX(-54, 0), 154);
    ctx.lineTo(this.projX(54, 0), 154);
    ctx.lineTo(this.projX(82, 0), 525);
    ctx.lineTo(this.projX(-82, 0), 525);
    ctx.closePath();
    ctx.fill();

    this.applyFabricPattern3D(ctx, pattern, -82, 154, 164, 370);
    this.drawFittedSleeves(ctx, color, 26);

    if (!isBackView) {
      // Cổ vạt chéo 'Hữu nhậm'
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(this.projX(-28, 6), 136);
      ctx.lineTo(this.projX(32, 6), 245);
      ctx.stroke();

      // Đai thắt lưng to bản quấn eo
      ctx.fillStyle = "#b91c1c";
      ctx.fillRect(this.projX(-44, 8), 280, 88, 24);
    }
    ctx.restore();
  }

  // HÀM VẼ TAY ÁO MAY ĐO TỰ NHIÊN (FITTED SLEEVES)
  drawFittedSleeves(ctx, color, sleeveWidth = 22, lengthY = 325) {
    ctx.fillStyle = color;

    const leftShoulder = this.projX(-54, 0);
    const leftElbow = this.projX(-72, 8);
    const leftWrist = this.projX(-62, 4);

    // Tay trái
    ctx.beginPath();
    ctx.moveTo(leftShoulder, 154);
    ctx.lineTo(leftElbow, 245);
    ctx.lineTo(leftWrist, lengthY);
    ctx.lineTo(leftWrist + sleeveWidth, lengthY);
    ctx.lineTo(leftElbow + sleeveWidth * 0.7, 245);
    ctx.lineTo(leftShoulder + 18, 172);
    ctx.closePath();
    ctx.fill();

    const rightShoulder = this.projX(54, 0);
    const rightElbow = this.projX(72, -8);
    const rightWrist = this.projX(62, -4);

    // Tay phải
    ctx.beginPath();
    ctx.moveTo(rightShoulder, 154);
    ctx.lineTo(rightElbow, 245);
    ctx.lineTo(rightWrist, lengthY);
    ctx.lineTo(rightWrist - sleeveWidth, lengthY);
    ctx.lineTo(rightElbow - sleeveWidth * 0.7, 245);
    ctx.lineTo(rightShoulder - 18, 172);
    ctx.closePath();
    ctx.fill();
  }

  // --- HOA VĂN VẢI 3D ---
  applyFabricPattern3D(ctx, patternKey, x, y, w, h) {
    ctx.save();
    ctx.globalAlpha = 0.16;
    ctx.strokeStyle = "#ffffff";

    if (patternKey === "sen_dam") {
      ctx.lineWidth = 1.4;
      for (let py = y + 40; py < y + h; py += 68) {
        for (let px = x + 24; px < x + w; px += 52) {
          const prX = this.projX(px, 0);
          ctx.beginPath();
          ctx.arc(prX, py, 11, 0, Math.PI, true);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(prX, py - 6, 5, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    } else if (patternKey === "thuy_ba") {
      // Sóng Thủy Ba Triều Nguyễn
      ctx.lineWidth = 1.8;
      for (let py = y + 50; py < y + h; py += 48) {
        ctx.beginPath();
        for (let px = x; px < x + w; px += 24) {
          const prX = this.projX(px, 0);
          ctx.bezierCurveTo(prX + 6, py - 8, prX + 16, py + 8, prX + 24, py);
        }
        ctx.stroke();
      }
    } else if (patternKey === "trong_dong") {
      // Trống Đồng Đông Sơn
      ctx.lineWidth = 1.5;
      const cx = this.projX(0, 0);
      const cy = y + h * 0.45;
      ctx.beginPath();
      ctx.arc(cx, cy, 38, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, 58, 0, Math.PI * 2);
      ctx.stroke();
    } else if (patternKey === "tho_cam") {
      // Thổ Cẩm
      ctx.lineWidth = 1.4;
      for (let py = y + 30; py < y + h; py += 36) {
        for (let px = x + 16; px < x + w; px += 36) {
          ctx.strokeRect(this.projX(px, 0), py, 15, 15);
        }
      }
    }
    ctx.restore();
  }

  // --- 7. VẼ BLAZER OVERSIZED GEN Z 3D ---
  drawBlazer3D(ctx, outfit, isBackView) {
    ctx.save();
    ctx.fillStyle = "#18181b"; // Charcoal mạnh mẽ

    const bL_shoulder = this.projX(-66, 6);
    const bR_shoulder = this.projX(66, 6);

    // Ve áo khoác hờ vai trái
    ctx.beginPath();
    ctx.moveTo(bL_shoulder, 148);
    ctx.lineTo(this.projX(-96, 6), 215);
    ctx.lineTo(this.projX(-84, 6), 440);
    ctx.lineTo(this.projX(-44, 6), 420);
    ctx.lineTo(this.projX(-48, 6), 180);
    ctx.closePath();
    ctx.fill();

    // Ve áo khoác hờ vai phải
    ctx.beginPath();
    ctx.moveTo(bR_shoulder, 148);
    ctx.lineTo(this.projX(96, 6), 215);
    ctx.lineTo(this.projX(84, 6), 440);
    ctx.lineTo(this.projX(44, 6), 420);
    ctx.lineTo(this.projX(48, 6), 180);
    ctx.closePath();
    ctx.fill();

    // Ve ve áo blazer cứng cáp
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(this.projX(-58, 6), 154);
    ctx.lineTo(this.projX(-74, 6), 275);
    ctx.moveTo(this.projX(58, 6), 154);
    ctx.lineTo(this.projX(74, 6), 275);
    ctx.stroke();

    ctx.restore();
  }

  // --- 8. VẼ ĐẦU, KHUÔN MẶT V-LINE & TÓC 3D (FIT LIỀN MẠCH) ---
  drawHead3D(ctx, outfit, isBackView) {
    ctx.save();
    const gender = outfit.gender || "female";
    const headX = this.projX(0, 0);

    if (isBackView) {
      // [MẶT SAU]: Tóc sau gáy & nếp tóc suôn mượt
      ctx.fillStyle = "#171717";
      if (gender === "female") {
        ctx.beginPath();
        ctx.ellipse(headX, 72, 34, 46, 0, 0, Math.PI * 2);
        ctx.fill();
        // Bím tóc hoặc suối tóc rủ
        ctx.beginPath();
        ctx.moveTo(headX - 18, 90);
        ctx.quadraticCurveTo(headX - 24, 180, headX - 16, 260);
        ctx.lineTo(headX + 16, 260);
        ctx.quadraticCurveTo(headX + 24, 180, headX + 18, 90);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.ellipse(headX, 70, 32, 42, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      return;
    }

    // [MẶT TRƯỚC]:
    if (this.userImage && this.userImage.complete && this.userImage.naturalWidth > 0) {
      // Ghép ảnh chân dung tải lên của người dùng
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(headX, 68, 30, 40, 0, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(this.userImage, headX - 32, 28, 64, 80);
      ctx.restore();

      ctx.strokeStyle = "rgba(0, 0, 0, 0.15)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(headX, 68, 30, 40, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // Gương mặt thanh thoát V-line Runway
      // Nền tóc
      ctx.fillStyle = "#171717";
      ctx.beginPath();
      ctx.ellipse(headX, 65, 34, 46, 0, 0, Math.PI * 2);
      ctx.fill();

      // Khuôn mặt V-line liền mạch xuống cằm (y: 106)
      const skinTone = gender === "male" ? "#eab69f" : "#fcd5ce";
      ctx.fillStyle = skinTone;
      ctx.beginPath();
      ctx.moveTo(headX - 26, 55);
      ctx.quadraticCurveTo(headX - 26, 92, headX, 106); // Cằm V-line
      ctx.quadraticCurveTo(headX + 26, 92, headX + 26, 55);
      ctx.quadraticCurveTo(headX, 36, headX - 26, 55);
      ctx.closePath();
      ctx.fill();

      // Đôi mắt phượng sắc sảo
      ctx.fillStyle = "#262626";
      const eyeOffset = this.projX(11, 0);
      ctx.beginPath();
      ctx.ellipse(headX - 11, 68, 4.8, 2.4, -0.12, 0, Math.PI * 2);
      ctx.ellipse(headX + 11, 68, 4.8, 2.4, 0.12, 0, Math.PI * 2);
      ctx.fill();

      // Lông mày
      ctx.strokeStyle = "#404040";
      ctx.lineWidth = gender === "male" ? 2.5 : 1.7;
      ctx.beginPath();
      if (gender === "male") {
        ctx.moveTo(headX - 19, 60); ctx.lineTo(headX - 4, 58);
        ctx.moveTo(headX + 4, 58); ctx.lineTo(headX + 19, 60);
      } else {
        ctx.moveTo(headX - 18, 60); ctx.quadraticCurveTo(headX - 10, 56, headX - 4, 61);
        ctx.moveTo(headX + 4, 61); ctx.quadraticCurveTo(headX + 10, 56, headX + 18, 60);
      }
      ctx.stroke();

      // Sống mũi thẳng thanh tú
      ctx.strokeStyle = "rgba(0, 0, 0, 0.22)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(headX, 68);
      ctx.lineTo(headX, 79);
      ctx.lineTo(headX + 2.5, 81);
      ctx.stroke();

      // Môi son thanh tân
      ctx.fillStyle = gender === "male" ? "#c97a63" : "#e11d48";
      ctx.beginPath();
      ctx.ellipse(headX, 91, gender === "male" ? 5.5 : 6.5, gender === "male" ? 2.2 : 3.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Má hồng nhẹ duyên dáng (cho nữ & unisex)
      if (gender !== "male") {
        ctx.fillStyle = "rgba(251, 113, 133, 0.22)";
        ctx.beginPath();
        ctx.arc(headX - 15, 78, 6.5, 0, Math.PI * 2);
        ctx.arc(headX + 15, 78, 6.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Tóc mái & kiểu tóc thời thượng
      ctx.fillStyle = "#171717";
      ctx.beginPath();
      if (gender === "male") {
        // Tóc nam Side-part nho nhã
        ctx.moveTo(headX - 26, 48);
        ctx.quadraticCurveTo(headX, 26, headX + 26, 48);
        ctx.lineTo(headX + 24, 38);
        ctx.quadraticCurveTo(headX, 22, headX - 24, 38);
        ctx.closePath();
      } else if (gender === "unisex") {
        // Mullet Layer đương đại
        ctx.moveTo(headX - 28, 46);
        ctx.quadraticCurveTo(headX, 28, headX + 28, 46);
        ctx.lineTo(headX + 22, 70);
        ctx.lineTo(headX + 10, 56);
        ctx.lineTo(headX - 10, 56);
        ctx.lineTo(headX - 22, 70);
        ctx.closePath();
      } else {
        // Mái bay thanh lịch nữ sinh
        ctx.moveTo(headX - 28, 45);
        ctx.quadraticCurveTo(headX, 30, headX + 28, 45);
        ctx.quadraticCurveTo(headX + 14, 58, headX + 4, 50);
        ctx.quadraticCurveTo(headX - 12, 56, headX - 28, 45);
        ctx.closePath();
      }
      ctx.fill();
    }

    ctx.restore();
  }

  // --- 9. PHỤ KIỆN TRUYỀN THỐNG & GEN Z REMIX 3D ---
  drawAccessories3D(ctx, outfit, isBackView) {
    const trad = outfit.tradAcc;
    const modern = outfit.modernAcc;
    const headX = this.projX(0, 0);

    ctx.save();

    // A. MẤN NHUNG ĐÍNH NGỌC / KHĂN ĐÓNG HOÀNG GIA
    if (trad === "khan_dong_man_nhung") {
      ctx.fillStyle = "#831843"; // Đỏ rượu vang hoàng gia
      ctx.beginPath();
      ctx.ellipse(headX, 36, 32, 13, 0, 0, Math.PI * 2);
      ctx.fill();
      // Chuỗi hạt ngọc quanh mấn
      ctx.fillStyle = "#ffd166";
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
        ctx.beginPath();
        ctx.arc(headX + Math.cos(a) * 28, 36 + Math.sin(a) * 9, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // B. NÓN LÁ BÀI THƠ XỨ HUẾ
    if (trad === "non_la_hue") {
      ctx.fillStyle = "#fef3c7";
      ctx.beginPath();
      ctx.moveTo(headX, -12);
      ctx.lineTo(headX - 68, 30);
      ctx.lineTo(headX + 68, 30);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#d97706";
      ctx.lineWidth = 1.4;
      ctx.stroke();

      if (!isBackView) {
        // Quai nón nhung tím Huế buông lơi
        ctx.strokeStyle = "#7c3aed";
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(headX - 35, 30);
        ctx.quadraticCurveTo(headX, 98, headX + 35, 30);
        ctx.stroke();
      }
    }

    // C. NÓN QUAI THAO
    if (trad === "non_quai_thao") {
      ctx.fillStyle = "#fef9c3";
      ctx.beginPath();
      ctx.ellipse(headX, 18, 72, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#b45309";
      ctx.lineWidth = 1.8;
      ctx.stroke();

      if (!isBackView) {
        // Quai thao tơ vàng rủ mềm 2 bên ngực
        ctx.strokeStyle = "#eab308";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(headX - 48, 20);
        ctx.bezierCurveTo(headX - 62, 90, headX - 44, 180, headX - 32, 240);
        ctx.moveTo(headX + 48, 20);
        ctx.bezierCurveTo(headX + 62, 90, headX + 44, 180, headX + 32, 240);
        ctx.stroke();
      }
    }

    // D. KHĂN RẰN NAM BỘ (DÁNG UỐN LƯỢN RỦ MỀM MẠI, KHÔNG BỊ CẮT KHỐI THÔ)
    if (trad === "khan_ran_nam_bo" && !isBackView) {
      ctx.save();
      // Khăn quàng chữ U mềm quanh cổ
      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      ctx.moveTo(headX - 22, 134);
      ctx.quadraticCurveTo(headX, 174, headX + 22, 134);
      ctx.lineTo(headX + 16, 235); // Dải khăn rủ ngực phải
      ctx.lineTo(headX + 4, 235);
      ctx.lineTo(headX + 10, 155);
      ctx.quadraticCurveTo(headX, 162, headX - 10, 155);
      ctx.lineTo(headX - 4, 260); // Dải khăn rủ ngực trái dài hơn
      ctx.lineTo(headX - 16, 260);
      ctx.closePath();
      ctx.fill();

      // Sọc caro thanh lịch
      ctx.fillStyle = "#0f172a";
      for (let y = 140; y < 255; y += 12) {
        ctx.fillRect(headX - 15, y, 10, 5);
        if (y < 230) ctx.fillRect(headX + 6, y, 9, 5);
      }
      ctx.restore();
    }

    // E. QUẠT TRẦM HƯƠNG / LỤA CẦM TAY
    if (trad === "quat_tram_huong" && !isBackView) {
      ctx.save();
      const fanX = this.projX(62, 0);
      ctx.translate(fanX, 290);
      ctx.rotate(-0.35);
      ctx.fillStyle = "rgba(225, 29, 72, 0.9)";
      ctx.beginPath();
      ctx.arc(0, 0, 46, -Math.PI * 0.72, -Math.PI * 0.08);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // --- PHỤ KIỆN GEN Z REMIX ---

    // 1. TAI NGHE OVER-EAR BLUETOOTH (ĐEO HỜ QUANH CỔ RẤT CHILL)
    if (modern === "tai_nghe_over_ear" && !isBackView) {
      ctx.save();
      // Vòng đệm tai nghe cong theo xương quai xanh
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(headX, 142, 28, 0.2, Math.PI - 0.2);
      ctx.stroke();

      // Củ tai nghe kim loại bạc Matte
      ctx.fillStyle = "#94a3b8";
      drawSafeRoundedRect(ctx, headX - 36, 130, 16, 26, 6);
      ctx.fill();
      drawSafeRoundedRect(ctx, headX + 20, 130, 16, 26, 6);
      ctx.fill();

      // Điểm nhấn LED Cyber
      ctx.fillStyle = "#00f5d4";
      ctx.fillRect(headX - 33, 141, 3, 4);
      ctx.fillRect(headX + 30, 141, 3, 4);
      ctx.restore();
    }

    // 2. KÍNH RÂM MATRIX CYBER Y2K
    if (modern === "kinh_ram_cyber_y2k" && !isBackView) {
      ctx.save();
      ctx.fillStyle = "#09090b";
      // Mắt kính hẹp sắc sảo
      ctx.fillRect(headX - 22, 64, 19, 8);
      ctx.fillRect(headX + 3, 64, 19, 8);
      // Gọng kính kim loại phản quang Neon
      ctx.strokeStyle = "#00f5d4";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(headX - 24, 66);
      ctx.lineTo(headX + 24, 66);
      ctx.stroke();
      ctx.restore();
    }

    // 3. TÚI TOTE CANVAS THƯ PHÁP VIỆT
    if (modern === "tui_tote_canvas_thu_phap" && !isBackView) {
      ctx.save();
      const bagX = this.projX(-84, 0);
      // Quai túi vắt chéo
      ctx.strokeStyle = "#d4a373";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(this.projX(-45, 0), 160);
      ctx.lineTo(bagX + 16, 385);
      ctx.stroke();

      // Thân túi mộc mạc
      ctx.fillStyle = "#fef3c7";
      drawSafeRoundedRect(ctx, bagX, 385, 46, 54, 4);
      ctx.fill();
      ctx.strokeStyle = "#b45309";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.fillStyle = "#1e1e24";
      ctx.font = "bold 13px serif";
      ctx.fillText("VIỆT", bagX + 9, 416);
      ctx.restore();
    }

    // 4. VÒNG XÍCH TITAN LAYER NGỌC TRAI
    if (modern === "vong_xich_titan_ngoc" && !isBackView) {
      ctx.strokeStyle = "#f8fafc";
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.arc(headX, 150, 22, 0.1, Math.PI - 0.1);
      ctx.stroke();

      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.arc(headX, 162, 26, 0.15, Math.PI - 0.15);
      ctx.stroke();
    }

    ctx.restore();
  }

  // --- 10. KHUNG TẠP CHÍ RUNWAY & CHẾ ĐỘ 3D WATERMARK ---
  drawEditorialFrame(ctx, w, h, outfit) {
    ctx.save();
    // Viền khung ảnh thanh lịch
    ctx.strokeStyle = "rgba(255, 255, 255, 0.14)";
    ctx.lineWidth = 1;
    ctx.strokeRect(16, 16, w - 32, h - 32);

    // Tiêu đề Tạp chí Thời Trang Việt Phục Remix
    ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
    ctx.font = "bold 16px 'Outfit', 'Cinzel', sans-serif";
    ctx.letterSpacing = "3px";
    ctx.fillText("VIỆT PHỤC REMIX", 28, 42);

    const garment = VIET_PHUC_DATA.garments[outfit.garment];
    const garmentName = garment ? garment.name : "Việt Phục Cổ Truyền";
    ctx.font = "11px 'Be Vietnam Pro', sans-serif";
    ctx.fillStyle = "#ffd166";
    ctx.fillText(`${garmentName.toUpperCase()} · 3D RUNWAY`, 28, 60);

    // Chỉ số góc xoay hiện tại
    const deg = Math.round((this.rotationY * 180) / Math.PI);
    ctx.font = "10px monospace";
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillText(`3D YAW: ${deg}° · VIEW: ${this.viewMode.toUpperCase()}`, 28, 76);

    // Bảng Palette màu nhỏ
    const colors = [outfit.colorHex, outfit.bottomColor || "#f8f9fa", "#ffd166", "#f72585"];
    colors.forEach((c, idx) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(36 + idx * 20, h - 32, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Watermark góc dưới phải
    ctx.textAlign = "right";
    ctx.font = "italic 11px 'Be Vietnam Pro', sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
    ctx.fillText("DI SẢN TRUYỀN THỐNG x SÁNG TẠO ĐƯƠNG ĐẠI", w - 28, h - 30);

    ctx.restore();
  }

  exportImage(format = "image/png") {
    return this.canvas.toDataURL(format);
  }
}

if (typeof window !== "undefined") {
  window.VietPhucMannequin = VietPhucMannequin;
}

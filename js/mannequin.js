/**
 * VIỆT PHỤC REMIX - INTERACTIVE MANNEQUIN & CANVAS RENDERING ENGINE
 * Vẽ trực quan người mẫu thời trang 2D cao cấp, các lớp Việt Phục chi tiết,
 * hoa văn gấm, phụ kiện truyền thống & Gen Z streetwear, bối cảnh ánh sáng.
 */

// Robust Polyfills for Canvas roundRect and ellipse
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
    this.userImage = null; // Ảnh chân dung người dùng upload
    this.zoomLevel = 1.0;
    this.particles = [];
    this.currentOutfit = null;
    this.initParticles();
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < 28; i++) {
      this.particles.push({
        x: Math.random() * 600,
        y: Math.random() * 850,
        size: Math.random() * 5 + 3,
        speedX: Math.random() * 0.8 - 0.2,
        speedY: Math.random() * 1.2 + 0.5,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 2,
        opacity: Math.random() * 0.6 + 0.2,
        type: Math.random() > 0.4 ? "petal" : "sparkle" // cánh hoa sen/mai hoặc bụi vàng
      });
    }
  }

  setUserAvatar(imgElement) {
    this.userImage = imgElement;
    if (this.currentOutfit) this.render(this.currentOutfit);
  }

  clearUserAvatar() {
    this.userImage = null;
    if (this.currentOutfit) this.render(this.currentOutfit);
  }

  render(outfit) {
    if (!this.ctx || !this.canvas) return;
    this.currentOutfit = outfit;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    try {
      ctx.save();
      ctx.clearRect(0, 0, w, h);

      // 1. Vẽ bối cảnh nền (Background Scene)
      this.drawBackground(ctx, w, h, outfit.bg || "hue_palace");

      // 2. Vẽ hiệu ứng cánh hoa / hạt bụi vàng rơi
      this.drawParticles(ctx, w, h);

      // 3. Chuẩn bị tọa độ vẽ nhân vật
      ctx.save();
      ctx.translate(w / 2, 60);
      ctx.scale(this.zoomLevel, this.zoomLevel);

      // Vẽ bóng đổ dưới chân
      this.drawShadow(ctx);

      // 4. Vẽ Lớp Quần / Chân Váy
      this.drawBottoms(ctx, outfit);

      // 5. Vẽ Thân người mẫu cơ bản (Da, Cổ, Cánh tay)
      this.drawBodyBase(ctx, outfit);

      // 6. Vẽ Áo chính (Garment Top)
      this.drawGarment(ctx, outfit);

      // 7. Vẽ Áo khoác ngoài Gen Z (nếu có Blazer)
      if (outfit.modernAcc === "blazer_oversized") {
        this.drawBlazer(ctx, outfit);
      }

      // 8. Vẽ Đầu & Gương mặt / User Avatar & Tóc
      this.drawHeadAndFace(ctx, outfit);

      // 9. Vẽ Phụ Kiện Đầu & Cổ Truyền Thống / Gen Z
      this.drawAccessories(ctx, outfit);

      ctx.restore();

      // 10. Vẽ Khung Tem Thời Trang & Watermark Tinh Tế
      this.drawEditorialFrame(ctx, w, h, outfit);

      ctx.restore();
    } catch (err) {
      console.warn("Mannequin render warning:", err);
    }
  }

  // --- 1. BỐI CẢNH NỀN ---
  drawBackground(ctx, w, h, bgKey) {
    const bgInfo = VIET_PHUC_DATA.backgrounds[bgKey] || VIET_PHUC_DATA.backgrounds.hue_palace;

    // Nền chuyển sắc Gradient
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    if (bgKey === "hue_palace") {
      grad.addColorStop(0, "#0d1b2a");
      grad.addColorStop(0.4, "#415a77");
      grad.addColorStop(0.7, "#778da9");
      grad.addColorStop(1, "#1b263b");
    } else if (bgKey === "ho_guom") {
      grad.addColorStop(0, "#051923");
      grad.addColorStop(0.5, "#003554");
      grad.addColorStop(0.8, "#006494");
      grad.addColorStop(1, "#132a13");
    } else if (bgKey === "hoi_an") {
      grad.addColorStop(0, "#190028");
      grad.addColorStop(0.5, "#3c096c");
      grad.addColorStop(0.85, "#7b2cbf");
      grad.addColorStop(1, "#ff9e00");
    } else if (bgKey === "cyber_saigon") {
      grad.addColorStop(0, "#050510");
      grad.addColorStop(0.5, "#180b30");
      grad.addColorStop(0.8, "#320e4e");
      grad.addColorStop(1, "#f72585");
    } else {
      // studio
      grad.addColorStop(0, "#121418");
      grad.addColorStop(0.5, "#1a1f29");
      grad.addColorStop(1, "#0d0f12");
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Vẽ họa tiết kiến trúc đặc trưng
    ctx.save();
    ctx.globalAlpha = 0.25;
    if (bgKey === "hue_palace") {
      // Silhouette Ngọ Môn & Mái Cung Đình
      ctx.fillStyle = "#ffd166";
      ctx.beginPath();
      ctx.moveTo(40, h - 180);
      ctx.lineTo(w / 2, h - 260);
      ctx.lineTo(w - 40, h - 180);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      // Vầng trăng rằm cung đình
      ctx.beginPath();
      ctx.arc(w - 110, 150, 48, 0, Math.PI * 2);
      ctx.fillStyle = "#fff3b0";
      ctx.fill();
    } else if (bgKey === "ho_guom") {
      // Cành liễu rủ mộng mơ & Tháp rùa
      ctx.strokeStyle = "#a7c957";
      ctx.lineWidth = 2;
      for (let i = 0; i < 7; i++) {
        ctx.beginPath();
        ctx.moveTo(30 + i * 25, 0);
        ctx.bezierCurveTo(40 + i * 25, 120, 20 + i * 25, 220, 35 + i * 25, 300);
        ctx.stroke();
      }
      // Mặt nước hồ loang ánh sáng
      ctx.fillStyle = "rgba(42, 157, 143, 0.2)";
      ctx.fillRect(0, h - 220, w, 220);
    } else if (bgKey === "hoi_an") {
      // Đèn lồng lung linh Hội An
      const lanterns = [
        { x: 70, y: 120, r: 24, c: "#ff006e" },
        { x: 130, y: 80, r: 18, c: "#ffbe0b" },
        { x: w - 90, y: 110, r: 26, c: "#fb5607" },
        { x: w - 150, y: 70, r: 20, c: "#8338ec" }
      ];
      lanterns.forEach(l => {
        // Dây treo
        ctx.strokeStyle = "#ffd166";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(l.x, 0);
        ctx.lineTo(l.x, l.y - l.r);
        ctx.stroke();

        // Quả lồng đèn
        ctx.fillStyle = l.c;
        ctx.beginPath();
        ctx.ellipse(l.x, l.y, l.r * 0.7, l.r, 0, 0, Math.PI * 2);
        ctx.fill();
        // Tua rua
        ctx.strokeStyle = "#ffd166";
        ctx.beginPath();
        ctx.moveTo(l.x, l.y + l.r);
        ctx.lineTo(l.x, l.y + l.r + 25);
        ctx.stroke();
      });
    } else if (bgKey === "cyber_saigon") {
      // Lưới Cyberpunk Neon Grid
      ctx.strokeStyle = "#00f5d4";
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 45) {
        ctx.beginPath();
        ctx.moveTo(x, h - 180);
        ctx.lineTo(w / 2 + (x - w / 2) * 2.2, h);
        ctx.stroke();
      }
      // Vệt neon ngang
      ctx.strokeStyle = "#f72585";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, h - 180);
      ctx.lineTo(w, h - 180);
      ctx.stroke();
    }
    ctx.restore();
  }

  // --- 2. CÁNH HOA / HẠT SÁNG BAY ---
  drawParticles(ctx, w, h) {
    ctx.save();
    this.particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotSpeed;

      if (p.y > h + 20) {
        p.y = -20;
        p.x = Math.random() * w;
      }
      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;

      if (p.type === "petal") {
        // Cánh hoa sen hồng / đào
        ctx.fillStyle = "#ff70a6";
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 1.8, 0.4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Hạt bụi vàng lấp lánh
        ctx.fillStyle = "#ffd166";
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
    ctx.restore();
  }

  // --- 3. BÓNG ĐỔ ---
  drawShadow(ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
    ctx.beginPath();
    ctx.ellipse(0, 680, 110, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // --- 4. VẼ LỚP QUẦN / CHÂN VÁY ---
  drawBottoms(ctx, outfit) {
    const bottomKey = outfit.bottom || "quan_lua_suong";
    const bottomColor = outfit.bottomColor || "#f8f9fa";
    ctx.save();

    if (bottomKey === "quan_lua_suong" || bottomKey === "quan_linen_ong_dung") {
      // Quần lụa ống rộng / linen ống suông
      ctx.fillStyle = bottomColor;
      // Ống trái
      ctx.beginPath();
      ctx.moveTo(-45, 340);
      ctx.lineTo(-10, 360);
      ctx.lineTo(-20, 650);
      ctx.lineTo(-70, 645);
      ctx.closePath();
      ctx.fill();
      // Ống phải
      ctx.beginPath();
      ctx.moveTo(45, 340);
      ctx.lineTo(10, 360);
      ctx.lineTo(20, 650);
      ctx.lineTo(70, 645);
      ctx.closePath();
      ctx.fill();

      // Nếp gấp đổ bóng vải lụa
      ctx.strokeStyle = "rgba(0, 0, 0, 0.15)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-42, 380);
      ctx.lineTo(-45, 630);
      ctx.moveTo(42, 380);
      ctx.lineTo(45, 630);
      ctx.stroke();
    } else if (bottomKey === "quan_cargo_street") {
      // Quần Cargo phong cách Streetwear túi hộp Gen Z
      ctx.fillStyle = bottomColor || "#212529";
      // Ống phồng
      ctx.beginPath();
      ctx.moveTo(-45, 340);
      ctx.lineTo(-8, 360);
      ctx.lineTo(-18, 640);
      ctx.lineTo(-65, 640);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(45, 340);
      ctx.lineTo(8, 360);
      ctx.lineTo(18, 640);
      ctx.lineTo(65, 640);
      ctx.closePath();
      ctx.fill();

      // Túi hộp hai bên đùi
      ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
      ctx.fillRect(-68, 420, 24, 34);
      ctx.fillRect(44, 420, 24, 34);
      // Dây rút / strap rủ streetwear
      ctx.strokeStyle = "#f72585";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-60, 450);
      ctx.bezierCurveTo(-75, 490, -45, 520, -50, 560);
      ctx.stroke();
    } else if (bottomKey === "vay_tennis_pleated") {
      // Chân váy xếp ly Tennis ngắn Gen Z
      ctx.fillStyle = bottomColor || "#ffffff";
      ctx.beginPath();
      ctx.moveTo(-50, 330);
      ctx.lineTo(50, 330);
      ctx.lineTo(80, 425);
      ctx.lineTo(-80, 425);
      ctx.closePath();
      ctx.fill();

      // Vẽ các nếp xếp ly
      ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
      ctx.lineWidth = 1.5;
      for (let x = -70; x <= 70; x += 14) {
        ctx.beginPath();
        ctx.moveTo(x * 0.65, 330);
        ctx.lineTo(x, 425);
        ctx.stroke();
      }

      // Đôi chân thon thả bên dưới váy
      ctx.fillStyle = "#fed0bb";
      // Chân trái
      ctx.fillRect(-38, 425, 24, 220);
      // Chân phải
      ctx.fillRect(14, 425, 24, 220);
    } else if (bottomKey === "quan_jeans_wide_leg") {
      // Quần jeans rách gối cá tính
      ctx.fillStyle = bottomColor || "#4a6fa5";
      ctx.beginPath();
      ctx.moveTo(-46, 340);
      ctx.lineTo(-8, 360);
      ctx.lineTo(-16, 645);
      ctx.lineTo(-68, 645);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(46, 340);
      ctx.lineTo(8, 360);
      ctx.lineTo(16, 645);
      ctx.lineTo(68, 645);
      ctx.closePath();
      ctx.fill();

      // Vết rách gối Gen Z
      ctx.fillStyle = "#fed0bb";
      ctx.fillRect(-52, 480, 26, 8);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-50, 482, 22, 2);
    } else {
      // Váy đụp đũi đen
      ctx.fillStyle = "#161616";
      ctx.beginPath();
      ctx.moveTo(-45, 330);
      ctx.lineTo(45, 330);
      ctx.lineTo(75, 630);
      ctx.lineTo(-75, 630);
      ctx.closePath();
      ctx.fill();
    }

    // Vẽ Giày dép (Footwear)
    this.drawFootwear(ctx, outfit);

    ctx.restore();
  }

  // --- VẼ GIÀY / DÉP ---
  drawFootwear(ctx, outfit) {
    const isChunky = outfit.modernAcc === "chunky_sneaker";
    const isGuocMoc = outfit.tradAcc === "guoc_moc_quai_nhung";

    ctx.save();
    if (isChunky) {
      // Chunky Sneaker đế bánh mì hầm hố
      ctx.fillStyle = "#ffffff";
      // Giày trái
      drawSafeRoundedRect(ctx, -75, 640, 58, 28, 8);
      ctx.fill();
      ctx.fillStyle = "#f72585"; // Điểm nhấn neon
      ctx.fillRect(-65, 646, 38, 4);

      // Giày phải
      ctx.fillStyle = "#ffffff";
      drawSafeRoundedRect(ctx, 18, 640, 58, 28, 8);
      ctx.fill();
      ctx.fillStyle = "#f72585";
      ctx.fillRect(28, 646, 38, 4);
    } else if (isGuocMoc) {
      // Guốc mộc quai nhung đỏ
      ctx.fillStyle = "#8b5a2b"; // Gỗ
      ctx.fillRect(-65, 646, 42, 12);
      ctx.fillRect(22, 646, 42, 12);
      // Quai nhung đỏ son
      ctx.fillStyle = "#d90429";
      ctx.fillRect(-58, 638, 28, 9);
      ctx.fillRect(29, 638, 28, 9);
    } else {
      // Giày loafer / hài nhung đen thanh lịch
      ctx.fillStyle = "#1e1e24";
      drawSafeRoundedRect(ctx, -66, 642, 45, 20, 6);
      ctx.fill();
      drawSafeRoundedRect(ctx, 22, 642, 45, 20, 6);
      ctx.fill();
    }
    ctx.restore();
  }

  // --- 5. VẼ CƠ THỂ CƠ BẢN ---
  drawBodyBase(ctx, outfit) {
    ctx.save();
    ctx.fillStyle = "#fed0bb"; // Tone da tươi sáng

    // Cổ
    ctx.fillRect(-18, 120, 36, 46);

    // Cánh tay & Bàn tay
    // Tay trái
    ctx.beginPath();
    ctx.moveTo(-60, 160);
    ctx.lineTo(-80, 310);
    ctx.lineTo(-65, 315);
    ctx.lineTo(-45, 170);
    ctx.closePath();
    ctx.fill();

    // Tay phải
    ctx.beginPath();
    ctx.moveTo(60, 160);
    ctx.lineTo(80, 310);
    ctx.lineTo(65, 315);
    ctx.lineTo(45, 170);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // --- 6. VẼ ÁO CHÍNH (GARMENT TOP) ---
  drawGarment(ctx, outfit) {
    const garmentKey = outfit.garment || "ngu_than_tay_chen";
    const color = outfit.colorHex || "#1d3557";
    const pattern = outfit.pattern || "sen_dam";

    ctx.save();

    if (garmentKey === "ngu_than_tay_chen") {
      this.drawAoNguThanTayChen(ctx, color, pattern, outfit);
    } else if (garmentKey === "ngu_than_tay_thung") {
      this.drawAoTacTayThung(ctx, color, pattern, outfit);
    } else if (garmentKey === "ao_tu_than") {
      this.drawAoTuThan(ctx, color, pattern, outfit);
    } else if (garmentKey === "ao_nhat_binh") {
      this.drawAoNhatBinh(ctx, color, pattern, outfit);
    } else if (garmentKey === "ao_dai_tan_thoi") {
      this.drawAoDaiModern(ctx, color, pattern, outfit);
    } else if (garmentKey === "ao_ba_ba_remix") {
      this.drawAoBaBa(ctx, color, pattern, outfit);
    } else {
      // Áo Giao Lĩnh
      this.drawAoGiaoLinh(ctx, color, pattern, outfit);
    }

    ctx.restore();
  }

  // A. ÁO NGŨ THÂN TAY CHẼN
  drawAoNguThanTayChen(ctx, color, pattern, outfit) {
    ctx.save();

    // Thân áo chính (dài qua gối, vạt cong chữ A)
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-50, 155); // Vai trái
    ctx.lineTo(50, 155);  // Vai phải
    ctx.lineTo(75, 420);  // Hông phải
    ctx.lineTo(85, 540);  // Tà dưới phải (dài qua gối)
    ctx.lineTo(-85, 540); // Tà dưới trái
    ctx.lineTo(-75, 420); // Hông trái
    ctx.closePath();
    ctx.fill();

    // Áp dụng hoa văn lên vải
    this.applyFabricPattern(ctx, pattern, -85, 155, 170, 390);

    // Tay áo chẽn (ôm gọn cổ tay linh hoạt)
    ctx.fillStyle = color;
    // Tay trái
    ctx.beginPath();
    ctx.moveTo(-50, 155);
    ctx.lineTo(-90, 310);
    ctx.lineTo(-68, 315);
    ctx.lineTo(-40, 200);
    ctx.closePath();
    ctx.fill();
    // Tay phải
    ctx.beginPath();
    ctx.moveTo(50, 155);
    ctx.lineTo(90, 310);
    ctx.lineTo(68, 315);
    ctx.lineTo(40, 200);
    ctx.closePath();
    ctx.fill();

    // Cổ đứng vuông vức (Cổ lập lĩnh đặc trưng Ngũ Thân)
    ctx.fillStyle = color;
    ctx.fillRect(-22, 130, 44, 28);
    // Viền trắng cổ trong (cổ lót bạch ngọc bảo vệ cổ áo)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-19, 127, 38, 5);

    // Đường nẹp vạt 'Hữu nhậm' (Vạt phải đè lên vạt trái - chuẩn văn hóa)
    ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, 158);
    ctx.lineTo(32, 200); // Lượn sang nách phải
    ctx.lineTo(32, 380); // Chạy dọc xuống sườn
    ctx.stroke();

    // 5 Nút Cài Ngũ Thường (Khuy đồng / xà cừ cổ truyền)
    const buttonPositions = [
      { x: 0, y: 145 },   // Cúc cổ (Nhân)
      { x: 14, y: 175 },  // Cúc yết hầu (Lễ)
      { x: 30, y: 215 },  // Cúc nách (Nghĩa)
      { x: 32, y: 265 },  // Cúc sườn trên (Trí)
      { x: 32, y: 315 }   // Cúc sườn dưới (Tín)
    ];
    ctx.fillStyle = "#ffd166"; // Khuy vàng hoàng gia
    buttonPositions.forEach(btn => {
      ctx.beginPath();
      ctx.arc(btn.x, btn.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#854d0e";
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    ctx.restore();
  }

  // B. ÁO TẤC (NGŨ THÂN TAY THỤNG ĐẠI LỄ)
  drawAoTacTayThung(ctx, color, pattern, outfit) {
    ctx.save();
    // Thân áo rộng dài uy nghi
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-52, 155);
    ctx.lineTo(52, 155);
    ctx.lineTo(95, 420);
    ctx.lineTo(105, 570);
    ctx.lineTo(-105, 570);
    ctx.lineTo(-95, 420);
    ctx.closePath();
    ctx.fill();

    this.applyFabricPattern(ctx, pattern, -105, 155, 210, 415);

    // Ống tay thụng buông dài rộng thướt tha (35-40cm)
    ctx.fillStyle = color;
    // Tay trái thụng
    ctx.beginPath();
    ctx.moveTo(-52, 155);
    ctx.lineTo(-145, 280);
    ctx.lineTo(-140, 410);
    ctx.lineTo(-45, 260);
    ctx.closePath();
    ctx.fill();

    // Tay phải thụng
    ctx.beginPath();
    ctx.moveTo(52, 155);
    ctx.lineTo(145, 280);
    ctx.lineTo(140, 410);
    ctx.lineTo(45, 260);
    ctx.closePath();
    ctx.fill();

    // Lót mép gấu tay áo màu trắng hoặc vàng cung đình
    ctx.strokeStyle = "#fefae0";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-145, 280);
    ctx.lineTo(-140, 410);
    ctx.moveTo(145, 280);
    ctx.lineTo(140, 410);
    ctx.stroke();

    // Cổ đứng cổ lót cao quý
    ctx.fillStyle = color;
    ctx.fillRect(-22, 130, 44, 28);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-19, 127, 38, 5);

    // Nút cài ngọc
    ctx.fillStyle = "#ffffff";
    for (let y = 175; y <= 315; y += 45) {
      ctx.beginPath();
      ctx.arc(30, y, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // C. ÁO TỨ THÂN & YẾM ĐÀO
  drawAoTuThan(ctx, color, pattern, outfit) {
    ctx.save();

    // 1. Chiếc Yếm Đào bên trong
    ctx.fillStyle = "#d90429"; // Sắc đỏ thắm hoa đào
    ctx.beginPath();
    ctx.moveTo(-32, 160);
    ctx.lineTo(32, 160);
    ctx.lineTo(40, 310);
    ctx.lineTo(-40, 310);
    ctx.closePath();
    ctx.fill();

    // Dải dây yếm buộc quanh cổ
    ctx.strokeStyle = "#d90429";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-28, 160);
    ctx.lineTo(-10, 132);
    ctx.moveTo(28, 160);
    ctx.lineTo(10, 132);
    ctx.stroke();

    // 2. Hai vạt sau áo tứ thân (phủ phía sau lưng)
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-54, 155);
    ctx.lineTo(54, 155);
    ctx.lineTo(85, 520);
    ctx.lineTo(-85, 520);
    ctx.closePath();
    ctx.fill();

    this.applyFabricPattern(ctx, pattern, -85, 155, 170, 365);

    // Tay áo xắn cao lanh lẹ duyên dáng
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-54, 155);
    ctx.lineTo(-85, 270);
    ctx.lineTo(-65, 275);
    ctx.lineTo(-42, 180);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(54, 155);
    ctx.lineTo(85, 270);
    ctx.lineTo(65, 275);
    ctx.lineTo(42, 180);
    ctx.closePath();
    ctx.fill();

    // 3. Hai vạt trước buộc gút chéo trước bụng duyên dáng
    ctx.fillStyle = color;
    // Vạt trái buộc
    ctx.beginPath();
    ctx.moveTo(-54, 155);
    ctx.lineTo(-20, 320);
    ctx.lineTo(-40, 460);
    ctx.lineTo(-65, 320);
    ctx.closePath();
    ctx.fill();

    // Vạt phải buộc
    ctx.beginPath();
    ctx.moveTo(54, 155);
    ctx.lineTo(20, 320);
    ctx.lineTo(40, 460);
    ctx.lineTo(65, 320);
    ctx.closePath();
    ctx.fill();

    // Thắt lưng bao xanh giữ nếp người phụ nữ thắt đáy lưng ong
    ctx.fillStyle = "#2a9d8f";
    ctx.fillRect(-38, 305, 76, 16);
    // Dải thắt lưng rủ mềm
    ctx.beginPath();
    ctx.moveTo(0, 321);
    ctx.lineTo(-12, 430);
    ctx.lineTo(8, 430);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // D. ÁO NHẬT BÌNH CUNG ĐÌNH
  drawAoNhatBinh(ctx, color, pattern, outfit) {
    ctx.save();
    // Thân áo suông quý tộc
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-55, 155);
    ctx.lineTo(55, 155);
    ctx.lineTo(90, 550);
    ctx.lineTo(-90, 550);
    ctx.closePath();
    ctx.fill();

    this.applyFabricPattern(ctx, pattern, -90, 155, 180, 395);

    // Cổ xẻ hình chữ nhật to bản 'Nhật Bình' đặc trưng với dải ngũ sắc
    const ngusacColors = ["#d90429", "#ffd166", "#1d3557", "#2a9d8f", "#f8f9fa"];
    ngusacColors.forEach((nc, idx) => {
      ctx.strokeStyle = nc;
      ctx.lineWidth = 3.5;
      ctx.strokeRect(-26 + idx * 3, 140 + idx * 2, 52 - idx * 6, 80 - idx * 4);
    });

    // Ống tay rộng viền dải ngũ sắc ở cửa tay
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-55, 155);
    ctx.lineTo(-115, 320);
    ctx.lineTo(-85, 335);
    ctx.lineTo(-42, 210);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(55, 155);
    ctx.lineTo(115, 320);
    ctx.lineTo(85, 335);
    ctx.lineTo(42, 210);
    ctx.closePath();
    ctx.fill();

    // Dải ngũ sắc viền ống tay
    ngusacColors.forEach((nc, idx) => {
      ctx.strokeStyle = nc;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-115 + idx * 3, 310 + idx * 2);
      ctx.lineTo(-85 + idx * 3, 325 + idx * 2);
      ctx.moveTo(115 - idx * 3, 310 + idx * 2);
      ctx.lineTo(85 - idx * 3, 325 + idx * 2);
      ctx.stroke();
    });

    // Dây buộc thao đính ngọc rủ trước ngực
    ctx.strokeStyle = "#ffd166";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 220);
    ctx.lineTo(0, 330);
    ctx.stroke();
    ctx.fillStyle = "#06d6a0"; // Viên ngọc bích
    ctx.beginPath();
    ctx.arc(0, 335, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // E. ÁO DÀI CÁCH TÂN GEN Z
  drawAoDaiModern(ctx, color, pattern, outfit) {
    ctx.save();
    // Tà trước & Tà sau xẻ cao lửng năng động
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-45, 155);
    ctx.lineTo(45, 155);
    ctx.lineTo(36, 260); // Thắt eo quyến rũ
    ctx.lineTo(65, 480); // Tà lửng đến bắp chân
    ctx.lineTo(-65, 480);
    ctx.lineTo(-36, 260);
    ctx.closePath();
    ctx.fill();

    this.applyFabricPattern(ctx, pattern, -65, 155, 130, 325);

    // Cổ tròn cách tân hoặc cổ yếm Gen Z
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 155, 20, 0, Math.PI);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Tay áo lửng hiện đại
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-45, 155);
    ctx.lineTo(-75, 265);
    ctx.lineTo(-58, 270);
    ctx.lineTo(-38, 185);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(45, 155);
    ctx.lineTo(75, 265);
    ctx.lineTo(58, 270);
    ctx.lineTo(38, 185);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // F. ÁO BÀ BA REMIX
  drawAoBaBa(ctx, color, pattern, outfit) {
    ctx.save();
    // Thân ngắn ngang hông xẻ tà phóng khoáng
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-48, 155);
    ctx.lineTo(48, 155);
    ctx.lineTo(55, 345);
    ctx.lineTo(40, 355); // Xẻ tà hông
    ctx.lineTo(0, 360);
    ctx.lineTo(-40, 355);
    ctx.lineTo(-55, 345);
    ctx.closePath();
    ctx.fill();

    this.applyFabricPattern(ctx, pattern, -55, 155, 110, 205);

    // Cổ tròn thanh thoát
    ctx.fillStyle = color;
    ctx.fillRect(-18, 135, 36, 20);

    // Hàng cúc bấm dọc thân áo
    ctx.fillStyle = "#ffffff";
    for (let y = 175; y <= 335; y += 32) {
      ctx.beginPath();
      ctx.arc(0, y, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Hai túi áo phía trước đặc trưng Bà Ba
    ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-38, 285, 22, 26);
    ctx.strokeRect(16, 285, 22, 26);

    // Tay áo dài vừa vặn
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-48, 155);
    ctx.lineTo(-80, 305);
    ctx.lineTo(-65, 310);
    ctx.lineTo(-38, 185);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(48, 155);
    ctx.lineTo(80, 305);
    ctx.lineTo(65, 310);
    ctx.lineTo(38, 185);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // G. ÁO GIAO LĨNH (CỔ CHÉO)
  drawAoGiaoLinh(ctx, color, pattern, outfit) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-52, 155);
    ctx.lineTo(52, 155);
    ctx.lineTo(80, 520);
    ctx.lineTo(-80, 520);
    ctx.closePath();
    ctx.fill();

    this.applyFabricPattern(ctx, pattern, -80, 155, 160, 365);

    // Cổ vạt chéo 'Hữu nhậm'
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-25, 140);
    ctx.lineTo(30, 240); // Chéo từ trái qua phải
    ctx.stroke();

    // Dây thắt lưng to bản quấn eo
    ctx.fillStyle = "#d90429";
    ctx.fillRect(-45, 280, 90, 22);

    ctx.restore();
  }

  // --- HOA VĂN VẢI (PATTERNS) ---
  applyFabricPattern(ctx, patternKey, x, y, w, h) {
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = "#ffffff";

    if (patternKey === "sen_dam") {
      // Họa tiết hoa sen cách điệu chìm
      ctx.lineWidth = 1.5;
      for (let py = y + 40; py < y + h; py += 70) {
        for (let px = x + 25; px < x + w; px += 55) {
          ctx.beginPath();
          ctx.arc(px, py, 12, 0, Math.PI, true);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(px, py - 6, 6, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    } else if (patternKey === "thuy_ba") {
      // Thủy Ba sóng nước triều Nguyễn
      ctx.lineWidth = 2;
      for (let py = y + 50; py < y + h; py += 45) {
        ctx.beginPath();
        for (let px = x; px < x + w; px += 20) {
          ctx.bezierCurveTo(px + 5, py - 8, px + 15, py + 8, px + 20, py);
        }
        ctx.stroke();
      }
    } else if (patternKey === "trong_dong") {
      // Chim Lạc & Họa tiết Trống đồng Đông Sơn
      ctx.lineWidth = 1.5;
      const cx = x + w / 2;
      const cy = y + h / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 38, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, 60, 0, Math.PI * 2);
      ctx.stroke();
      // Các tia sao trống đồng
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * 36, cy + Math.sin(a) * 36);
        ctx.stroke();
      }
    } else if (patternKey === "tho_cam") {
      // Họa tiết kỷ hà quả trám Thổ Cẩm
      ctx.lineWidth = 1.5;
      for (let py = y + 30; py < y + h; py += 35) {
        for (let px = x + 15; px < x + w; px += 35) {
          ctx.strokeRect(px, py, 16, 16);
        }
      }
    }
    ctx.restore();
  }

  // --- 7. VẼ BLAZER OVERSIZED GEN Z ---
  drawBlazer(ctx, outfit) {
    ctx.save();
    ctx.fillStyle = "#18181b"; // Đen charcoal quyền lực
    // Khoác hờ vai trái
    ctx.beginPath();
    ctx.moveTo(-65, 145);
    ctx.lineTo(-98, 200);
    ctx.lineTo(-85, 430);
    ctx.lineTo(-45, 410);
    ctx.lineTo(-50, 180);
    ctx.closePath();
    ctx.fill();

    // Khoác hờ vai phải
    ctx.beginPath();
    ctx.moveTo(65, 145);
    ctx.lineTo(98, 200);
    ctx.lineTo(85, 430);
    ctx.lineTo(45, 410);
    ctx.lineTo(50, 180);
    ctx.closePath();
    ctx.fill();

    // Ve áo blazer cứng cáp
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-60, 150);
    ctx.lineTo(-75, 270);
    ctx.moveTo(60, 150);
    ctx.lineTo(75, 270);
    ctx.stroke();

    ctx.restore();
  }

  // --- 8. VẼ ĐẦU, KHUÔN MẶT, USER AVATAR & TÓC ---
  drawHeadAndFace(ctx, outfit) {
    ctx.save();

    // Nếu người dùng đã tải ảnh mặt chân dung lên
    if (this.userImage && this.userImage.complete && this.userImage.naturalWidth > 0) {
      // Cắt ảnh tròn khớp vào khung mặt người mẫu
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(0, 68, 30, 40, 0, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(this.userImage, -32, 28, 64, 80);
      ctx.restore();

      // Viền nhẹ tự nhiên quanh khuôn mặt
      ctx.strokeStyle = "rgba(0, 0, 0, 0.15)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(0, 68, 30, 40, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // Vẽ gương mặt minh họa thời trang thanh thoát
      // Tóc phía sau
      ctx.fillStyle = "#1c1917";
      ctx.beginPath();
      ctx.ellipse(0, 65, 34, 46, 0, 0, Math.PI * 2);
      ctx.fill();

      // Khuôn mặt V-line
      ctx.fillStyle = "#fed0bb";
      ctx.beginPath();
      ctx.moveTo(-28, 55);
      ctx.quadraticCurveTo(-28, 95, 0, 110);
      ctx.quadraticCurveTo(28, 95, 28, 55);
      ctx.quadraticCurveTo(0, 35, -28, 55);
      ctx.closePath();
      ctx.fill();

      // Mắt phượng sắc nét
      ctx.fillStyle = "#27272a";
      ctx.beginPath();
      ctx.ellipse(-11, 68, 5, 2.5, -0.15, 0, Math.PI * 2);
      ctx.ellipse(11, 68, 5, 2.5, 0.15, 0, Math.PI * 2);
      ctx.fill();

      const gender = outfit.gender || "female";

      // Lông mày
      ctx.strokeStyle = "#44403c";
      ctx.lineWidth = gender === "male" ? 2.6 : 1.8;
      ctx.beginPath();
      if (gender === "male") {
        // Chân mày kiếm nam tính
        ctx.moveTo(-20, 60);
        ctx.lineTo(-4, 58);
        ctx.moveTo(4, 58);
        ctx.lineTo(20, 60);
      } else {
        // Lá liễu nữ sinh
        ctx.moveTo(-18, 60);
        ctx.quadraticCurveTo(-11, 56, -4, 61);
        ctx.moveTo(4, 61);
        ctx.quadraticCurveTo(11, 56, 18, 60);
      }
      ctx.stroke();

      // Sống mũi thẳng
      ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, 68);
      ctx.lineTo(0, 80);
      ctx.lineTo(3, 82);
      ctx.stroke();

      // Đôi môi
      ctx.fillStyle = gender === "male" ? "#d08c78" : "#e63946";
      ctx.beginPath();
      ctx.ellipse(0, 93, gender === "male" ? 6 : 7, gender === "male" ? 2.5 : 3.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Má hồng (chỉ cho nữ và unisex)
      if (gender !== "male") {
        ctx.fillStyle = "rgba(255, 112, 166, 0.25)";
        ctx.beginPath();
        ctx.arc(-16, 80, 7, 0, Math.PI * 2);
        ctx.arc(16, 80, 7, 0, Math.PI * 2);
        ctx.fill();
      }

      // Tóc theo giới tính
      ctx.fillStyle = "#1c1917";
      ctx.beginPath();
      if (gender === "male") {
        // Tóc nam sinh Side-part nho nhã
        ctx.moveTo(-28, 48);
        ctx.quadraticCurveTo(0, 26, 28, 48);
        ctx.lineTo(26, 40);
        ctx.quadraticCurveTo(0, 22, -26, 40);
        ctx.closePath();
      } else if (gender === "unisex") {
        // Tóc Mullet Layer gợn sóng Gen Z
        ctx.moveTo(-32, 45);
        ctx.quadraticCurveTo(0, 28, 32, 45);
        ctx.lineTo(24, 75);
        ctx.lineTo(12, 60);
        ctx.lineTo(-12, 60);
        ctx.lineTo(-24, 75);
        ctx.closePath();
      } else {
        // Tóc mái bay nữ sinh thanh lịch
        ctx.moveTo(-30, 45);
        ctx.quadraticCurveTo(0, 30, 30, 45);
        ctx.quadraticCurveTo(15, 62, 5, 52);
        ctx.quadraticCurveTo(-12, 60, -30, 45);
        ctx.closePath();
      }
      ctx.fill();
    }

    ctx.restore();
  }

  // --- 9. PHỤ KIỆN TRUYỀN THỐNG & GEN Z REMIX ---
  drawAccessories(ctx, outfit) {
    const trad = outfit.tradAcc;
    const modern = outfit.modernAcc;

    ctx.save();

    // A. NÓN QUAI THAO
    if (trad === "non_quai_thao") {
      // Đặt nón quai thao nghiêng nhẹ sau lưng hoặc đội đầu
      ctx.fillStyle = "#e9d8a6";
      ctx.beginPath();
      ctx.ellipse(0, 18, 70, 24, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#bc6c25";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Quai thao tơ đồng rủ hai bên vai
      ctx.strokeStyle = "#d4af37";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(-50, 20);
      ctx.bezierCurveTo(-65, 80, -45, 170, -35, 230);
      ctx.moveTo(50, 20);
      ctx.bezierCurveTo(65, 80, 45, 170, 35, 230);
      ctx.stroke();
    }

    // B. NÓN LÁ BÀI THƠ
    if (trad === "non_la_hue") {
      ctx.fillStyle = "#faedcd";
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(-65, 32);
      ctx.lineTo(65, 32);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#d4a373";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Quai nón nhung xanh/tím Huế
      ctx.strokeStyle = "#7209b7";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-35, 32);
      ctx.quadraticCurveTo(0, 95, 35, 32);
      ctx.stroke();
    }

    // C. MẤN NHUNG ĐÍNH NGỌC / KHĂN ĐÓNG
    if (trad === "khan_dong_man_nhung") {
      ctx.fillStyle = "#800f2f"; // Đỏ nhung rượu vang
      ctx.beginPath();
      ctx.ellipse(0, 36, 32, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      // Các hạt ngọc đính quanh mấn
      ctx.fillStyle = "#ffd166";
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 5) {
        ctx.beginPath();
        ctx.arc(Math.cos(a) * 28, 36 + Math.sin(a) * 10, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // D. KHĂN RẰN NAM BỘ
    if (trad === "khan_ran_nam_bo") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-28, 142, 56, 18);
      // Sọc caro đen trắng
      ctx.fillStyle = "#111111";
      for (let x = -28; x < 28; x += 8) {
        ctx.fillRect(x, 142, 4, 18);
      }
    }

    // E. QUẠT TRẦM HƯƠNG / LỤA CẦM TAY
    if (trad === "quat_tram_huong") {
      ctx.save();
      ctx.translate(68, 280);
      ctx.rotate(-0.3);
      // Nan quạt xòe
      ctx.fillStyle = "rgba(230, 57, 70, 0.85)";
      ctx.beginPath();
      ctx.arc(0, 0, 48, -Math.PI * 0.7, -Math.PI * 0.1);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // F. CHUỖI NGỌC BỘI KHẢM BẠC
    if (trad === "chuoi_ngoc_boi_bac") {
      ctx.save();
      ctx.translate(28, 335);
      // Dây thao
      ctx.strokeStyle = "#ffd166";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 55);
      ctx.stroke();
      // Ngọc bội cẩm thạch xanh ngọc
      ctx.fillStyle = "#06d6a0";
      ctx.beginPath();
      ctx.arc(0, 55, 9, 0, Math.PI * 2);
      ctx.fill();
      // Tua rua đỏ
      ctx.strokeStyle = "#d90429";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 64);
      ctx.lineTo(0, 85);
      ctx.stroke();
      ctx.restore();
    }

    // --- GEN Z MODERN ACCESSORIES ---

    // 1. KÍNH RÂM MATRIX CYBER Y2K
    if (modern === "kinh_ram_cyber_y2k") {
      ctx.fillStyle = "#09090b";
      // Mắt kính hẹp sắc lẹm
      ctx.fillRect(-22, 64, 19, 8);
      ctx.fillRect(3, 64, 19, 8);
      // Gọng kính kim loại
      ctx.strokeStyle = "#00f5d4";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-25, 66);
      ctx.lineTo(25, 66);
      ctx.stroke();
    }

    // 2. TAI NGHE OVER-EAR BLUETOOTH
    if (modern === "tai_nghe_over_ear") {
      // Vòng tai nghe quàng hờ quanh cổ
      ctx.strokeStyle = "#e4e4e7";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(0, 142, 28, 0.2, Math.PI - 0.2);
      ctx.stroke();
      // Hai củ tai nghe kim loại bạc
      ctx.fillStyle = "#a1a1aa";
      drawSafeRoundedRect(ctx, -35, 130, 16, 26, 6);
      ctx.fill();
      drawSafeRoundedRect(ctx, 19, 130, 16, 26, 6);
      ctx.fill();
    }

    // 3. TÚI TOTE CANVAS THƯ PHÁP
    if (modern === "tui_tote_canvas_thu_phap") {
      ctx.save();
      // Quai túi vắt qua vai
      ctx.strokeStyle = "#d4a373";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-50, 160);
      ctx.lineTo(-78, 380);
      ctx.stroke();

      // Thân túi vải bố kem
      ctx.fillStyle = "#faedcd";
      drawSafeRoundedRect(ctx, -95, 380, 48, 55, 4);
      ctx.fill();
      ctx.strokeStyle = "#bc6c25";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Chữ Thư pháp 'Việt' nhỏ trên túi
      ctx.fillStyle = "#1e1e24";
      ctx.font = "bold 13px serif";
      ctx.fillText("VIỆT", -86, 412);
      ctx.restore();
    }

    // 4. VÒNG XÍCH TITAN LAYER NGỌC TRAI
    if (modern === "vong_xich_titan_ngoc") {
      ctx.strokeStyle = "#f8f9fa";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 150, 24, 0.1, Math.PI - 0.1);
      ctx.stroke();
      // Xích titan mắt to
      ctx.strokeStyle = "#71717a";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(0, 162, 28, 0.15, Math.PI - 0.15);
      ctx.stroke();
    }

    // 5. SMARTWATCH DÂY DA
    if (modern === "smartwatch_co_dien") {
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(-72, 310, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffd166";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    ctx.restore();
  }

  // --- 10. VẼ KHUNG THỜI TRANG & WATERMARK ---
  drawEditorialFrame(ctx, w, h, outfit) {
    ctx.save();
    // Viền khung ảnh thanh lịch
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    ctx.strokeRect(16, 16, w - 32, h - 32);

    // Tiêu đề Tạp chí Thời Trang Việt Phục Remix
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.font = "bold 16px 'Outfit', 'Be Vietnam Pro', sans-serif";
    ctx.letterSpacing = "4px";
    ctx.fillText("VIỆT PHỤC REMIX", 28, 42);

    // Vibe Tag
    const garment = VIET_PHUC_DATA.garments[outfit.garment];
    const garmentName = garment ? garment.name : "Việt Phục Cổ Truyền";
    ctx.font = "12px 'Be Vietnam Pro', sans-serif";
    ctx.fillStyle = "#ffd166";
    ctx.fillText(`${garmentName.toUpperCase()} · GEN Z EDITION`, 28, 62);

    // Bảng Palette màu nhỏ hiển thị góc dưới
    const colors = [outfit.colorHex, outfit.bottomColor || "#f8f9fa", "#ffd166", "#f72585"];
    colors.forEach((c, idx) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(36 + idx * 20, h - 32, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Huy hiệu thẩm định văn hóa góc dưới phải
    ctx.textAlign = "right";
    ctx.font = "italic 11px 'Be Vietnam Pro', sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
    ctx.fillText("DI SẢN TRUYỀN THỐNG x SÁNG TẠO ĐƯƠNG ĐẠI", w - 28, h - 30);

    ctx.restore();
  }

  // Xuất file ảnh chất lượng cao để tải về Lookbook
  exportImage(format = "image/png") {
    return this.canvas.toDataURL(format);
  }
}

// Export to window
if (typeof window !== "undefined") {
  window.VietPhucMannequin = VietPhucMannequin;
}

/**
 * VIỆT PHỤC REMIX - DỮ LIỆU VĂN HÓA VÀ THỜI TRANG GEN Z TOÀN DIỆN
 * Cơ sở dữ liệu chuyên sâu về cổ phục Việt Nam, phụ kiện đương đại,
 * bộ màu sắc ngũ hành & chủ đề, 10 dịp lễ hội bối cảnh và quy chuẩn văn hóa.
 */

const VIET_PHUC_DATA = {
  // ===================================================================
  // 1. CÁC LOẠI TRANG PHỤC CHÍNH (TOPS)
  // ===================================================================
  garments: {
    ngu_than_tay_chen: {
      id: "ngu_than_tay_chen",
      name: "Áo Ngũ Thân Tay Chẽn",
      era: "Triều Nguyễn (TK 18 - 19) - Định hình bởi Chúa Nguyễn Phúc Khoát & Vua Minh Mạng",
      region: "Toàn quốc (Bắt nguồn từ Đàng Trong, lan tỏa Cố đô Huế & Đàng Ngoài)",
      formality: "Lịch thiệp, thường phục lẫn lễ phục",
      description: "Áo có 5 thân (4 thân ngoài tượng trưng cho tứ thân phụ mẫu, 1 thân con bên trong tượng trưng cho người mặc), cổ đứng vuông vắn cài kín đáo với 5 khuy tượng trưng cho Ngũ Thường (Nhân, Lễ, Nghĩa, Trí, Tín). Tay áo ôm vừa vặn từ khuỷu tay đến cổ tay giúp cử động linh hoạt.",
      culturalMeaning: "Biểu trưng cho đạo lý làm người Việt: hiếu thuận với cha mẹ, giữ trọn 5 đức tính Ngũ Thường, thể hiện sự kín đáo, đoan trang và bình đẳng xã hội thời xưa.",
      cutDetails: "Thân áo dài quá gối, vạt áo cong uyển chuyển (vạt tả đè vạt hữu - vạt phải cài lên trên), tà áo khép kín thanh thoát.",
      defaultColor: "#1d3557",
      defaultPattern: "sen_dam",
      gender: "unisex",
      tags: ["Huế", "Lịch sự", "Triều Nguyễn", "Cổ điển"],
      recommendedEvents: ["prom", "ky_yeu", "tet", "dam_cuoi", "ngoai_giao"]
    },
    ngu_than_tay_thung: {
      id: "ngu_than_tay_thung",
      name: "Áo Tấc (Ngũ Thân Tay Thụng)",
      era: "Triều Nguyễn",
      region: "Cố đô Huế & Toàn quốc",
      formality: "Đại lễ phục trang trọng bậc nhất",
      description: "Là dạng lễ phục của áo ngũ thân với ống tay dài rộng thụng (thường rộng từ 30 - 45cm). Khi đứng nghiêm hai tay chắp trước bụng, hai ống tay buông rủ tạo phong thái tôn nghiêm, uy nghi.",
      culturalMeaning: "Thể hiện sự tôn kính thần linh, tổ tiên, bề trên trong các dịp đại tế, lễ đình, hôn lễ truyền thống và quốc lễ.",
      cutDetails: "Cổ đứng cài 5 nút, vạt dài quá gối, tay thụng rộng thướt tha mang đậm dấu ấn cung đình phong nhã.",
      defaultColor: "#9b2226",
      defaultPattern: "thuy_ba",
      gender: "unisex",
      tags: ["Đại lễ", "Trang trọng", "Hoàng cung", "Quý phái"],
      recommendedEvents: ["le_chua", "tet", "prom", "dam_cuoi", "ky_yeu", "ngoai_giao"]
    },
    ao_tu_than: {
      id: "ao_tu_than",
      name: "Áo Tứ Thân & Yếm Đào",
      era: "Bắc Bộ cổ truyền (TK 12 - đầu TK 20, thịnh hành thời Lê - Nguyễn)",
      region: "Đồng bằng Bắc Bộ (Kinh Bắc, Thăng Long, Hà Đông)",
      formality: "Dân gian, lễ hội chèo, quan họ, dạo xuân",
      description: "Gồm bốn vạt: hai vạt sau may liền sống lưng, hai vạt trước để buông hoặc thắt vạt chéo trước bụng duyên dáng. Bên trong mặc chiếc Yếm Đào (hoặc yếm cổ xây, yếm cánh sen) giữ nét quyến rũ e ấp.",
      culturalMeaning: "Bốn vạt áo tượng trưng cho tứ thân phụ mẫu (bố mẹ mình và bố mẹ chồng/vợ). Hai vạt trước buộc lại biểu trưng cho tình nghĩa vợ chồng son sắt gắn bó. Chiếc thắt lưng bao xanh giữ nếp người phụ nữ thắt đáy lưng ong.",
      cutDetails: "Áo không có khuy cài trước ngực, khoác ngoài yếm lụa, xắn tay áo duyên dáng, đi cùng nón quai thao trăng rằm.",
      defaultColor: "#bc6c25",
      defaultPattern: "tron_moc",
      gender: "female",
      tags: ["Bắc Bộ", "Quan họ", "Duyên dáng", "Dân gian"],
      recommendedEvents: ["streetwear", "festival", "van_nghe", "trung_thu", "ky_yeu"]
    },
    ao_nhat_binh: {
      id: "ao_nhat_binh",
      name: "Áo Nhật Bình Cung Đình",
      era: "Triều Nguyễn (Quy định chi tiết từ năm Gia Long thứ 6 - 1807)",
      region: "Cung đình Huế",
      formality: "Thường phục của Hậu phi, Công chúa & Lễ phục mệnh phụ",
      description: "Áo có cổ xẻ trước ngực tạo thành hình chữ nhật bao quanh cổ (tên gọi 'Nhật Bình' xuất phát từ dạng cổ này). Viền cổ áo thêu hoa văn ngũ sắc tinh xảo, tay áo có dải ngũ sắc biểu trưng cho Ngũ Hành (Kim, Mộc, Thủy, Hỏa, Thổ).",
      culturalMeaning: "Đỉnh cao nghệ thuật thêu thùa cung đình, thể hiện sự cao quý, tôn nghiêm và vị thế quyền quý của người phụ nữ cung đình xưa.",
      cutDetails: "Thân áo may rộng thẳng, hai vạt trước buộc dây thao đính ngọc bội hoặc cài dải khuy ngọc quý giá.",
      defaultColor: "#d4a373",
      defaultPattern: "thuy_ba",
      gender: "female",
      tags: ["Cung đình", "Quyền quý", "Ngũ sắc", "Độc bản"],
      recommendedEvents: ["prom", "dam_cuoi", "festival", "ky_yeu", "van_nghe"]
    },
    ao_dai_tan_thoi: {
      id: "ao_dai_tan_thoi",
      name: "Áo Dài Cách Tân Gen Z",
      era: "Tiến hóa từ Áo Dài Lemur, Lê Phổ đến Phong cách Đương Đại 2026",
      region: "Toàn quốc & Quốc tế",
      formality: "Linh hoạt từ dạo phố đến dạ tiệc",
      description: "Kế thừa phom dáng tà đôi thướt tha nhưng ứng dụng kỹ thuật cắt cúp đương đại: cổ yếm hoặc cổ tròn cách điệu, tà lửng năng động, chất liệu tơ sống, gấm organza hoặc linen hữu cơ thoáng khí.",
      culturalMeaning: "Biểu tượng thời trang dân tộc bất hủ, kết nối di sản ngàn năm với nhịp đập tự do, hiện đại và tràn đầy sức sống của thế hệ trẻ Gen Z.",
      cutDetails: "Hai tà trước sau buông rủ, phom dáng thoải mái cử động, phối linh hoạt với quần ống suông hoặc chân váy xếp ly.",
      defaultColor: "#ff006e",
      defaultPattern: "sen_dam",
      gender: "female",
      tags: ["Năng động", "Gen Z", "Thời thượng", "Đa dụng"],
      recommendedEvents: ["streetwear", "prom", "ky_yeu", "tet", "van_nghe", "trung_thu"]
    },
    ao_ba_ba_remix: {
      id: "ao_ba_ba_remix",
      name: "Áo Bà Ba Nam Bộ Remix",
      era: "Nam Bộ (Thế kỷ 19 - đương đại)",
      region: "Đồng bằng Sông Cửu Long & Sài Gòn",
      formality: "Thường nhật phóng khoáng, dạo phố streetwear",
      description: "Áo xẻ tà ngắn hai bên hông, cổ tròn hoặc cổ tim thanh thoát, thân áo ôm nhẹ, hai túi tiện dụng phía trước. Phiên bản Remix phối chất liệu đũi thô, denim hoặc lụa cát tạo chất bụi bặm phong trần.",
      culturalMeaning: "Biểu trưng cho tính cách hào sảng, phóng khoáng, chân chất và đôn hậu của con người phương Nam phù sa màu mỡ.",
      cutDetails: "Thân ngắn hơn áo dài, hàng cúc bấm hoặc cúc ngọc chạy dọc thân trước, tay dài thon gọn.",
      defaultColor: "#3a5a40",
      defaultPattern: "tron_moc",
      gender: "unisex",
      tags: ["Nam Bộ", "Phóng khoáng", "Streetwear", "Bụi bặm"],
      recommendedEvents: ["streetwear", "festival", "van_nghe", "trung_thu"]
    },
    ao_giao_linh: {
      id: "ao_giao_linh",
      name: "Áo Giao Lĩnh (Đại Việt Cổ)",
      era: "Thời Lý - Trần - Lê (Thế kỷ 11 - 18)",
      region: "Đại Việt cổ truyền",
      formality: "Cổ phong thanh tao, trang nhã",
      description: "Áo cổ chéo vạt (vạt phải đè chéo sang vạt trái và buộc dây thắt lưng). Ống tay rộng thướt tha, phom áo bay bổng gợi nhớ thời kỳ phục hưng vàng son của Đại Việt.",
      culturalMeaning: "Khí chất quân tử, nho nhã, thể hiện triết lý hòa hợp âm dương với vạt áo đan chéo hài hòa.",
      cutDetails: "Cổ áo bắt chéo sâu trước ngực để lộ lớp nội y thanh nhã, thắt lưng thắt nơ dài duyên dáng.",
      defaultColor: "#2b2d42",
      defaultPattern: "trong_dong",
      gender: "unisex",
      tags: ["Đại Việt", "Cổ phong", "Nho nhã", "Kiếm hiệp"],
      recommendedEvents: ["festival", "ky_yeu", "prom", "van_nghe"]
    }
  },

  // ===================================================================
  // 2. LỚP QUẦN & CHÂN VÁY (BOTTOMS)
  // ===================================================================
  bottoms: {
    quan_lua_suong: {
      id: "quan_lua_suong",
      name: "Quần Lụa Ống Rộng Cổ Điển",
      style: "Truyền thống chuẩn mực",
      category: "traditional",
      desc: "Quần lụa tơ tằm mềm rủ, ống rộng 30-35cm, cạp chun hoặc dải rút truyền thống, tạo bước đi uyển chuyển thướt tha.",
      defaultColor: "#f8f9fa",
      vibe: "Thanh nhã, trang trọng"
    },
    quan_cargo_street: {
      id: "quan_cargo_street",
      name: "Quần Cargo Đa Túi Streetwear",
      style: "Gen Z Streetwear Remix",
      category: "remix",
      desc: "Quần túi hộp phom thụng ống túm hoặc suông bằng chất liệu kaki/nylon chống nước, mang hơi thở Cyber Y2K cực cháy.",
      defaultColor: "#212529",
      vibe: "Nổi loạn, năng động, bụi bặm"
    },
    vay_tennis_pleated: {
      id: "vay_tennis_pleated",
      name: "Chân Váy Xếp Ly Tennis Gen Z",
      style: "Học đường K-pop Y2K",
      category: "remix",
      desc: "Chân váy xếp ly ngắn trẻ trung, tạo điểm nhấn tương phản độc đáo khi phối tà áo dài lửng cách tân.",
      defaultColor: "#ffffff",
      vibe: "Ngọt ngào, tươi trẻ, nữ sinh"
    },
    quan_linen_ong_dung: {
      id: "quan_linen_ong_dung",
      name: "Quần Đũi Linen Ống Đứng Tối Giản",
      style: "Minimalist Indochine",
      category: "fusion",
      desc: "Quần đũi dệt thô mộc, màu be hoặc nâu trầm, ống đứng thanh lịch mang chất hoài niệm thời kỳ Đông Dương.",
      defaultColor: "#e9d8a6",
      vibe: "Tối giản, thư thái, vintage"
    },
    quan_jeans_wide_leg: {
      id: "quan_jeans_wide_leg",
      name: "Quần Jeans Ống Rộng Rách Gối",
      style: "Retro Grunge Gen Z",
      category: "remix",
      desc: "Chất liệu denim xanh bạc wash bụi bặm, cạp cao tôn dáng, tạo cú va chạm thị giác giữa cổ xưa và nổi loạn.",
      defaultColor: "#4a6fa5",
      vibe: "Cá tính, tự do, phá cách"
    },
    vay_doi_dui_dai: {
      id: "vay_doi_dui_dai",
      name: "Váy Đụp Đũi Đen Truyền Thống",
      style: "Dân gian Bắc Bộ",
      category: "traditional",
      desc: "Chân váy đen dài quá bắp chân, kết hợp cùng áo tứ thân và yếm đào tạo nên hình ảnh cô thôn nữ Kinh Bắc xốn xang.",
      defaultColor: "#111111",
      vibe: "Dân dã, thuần khiết, mộc mạc"
    }
  },

  // ===================================================================
  // 3. PHỤ KIỆN TRUYỀN THỐNG (TRADITIONAL ACCESSORIES)
  // ===================================================================
  tradAccessories: {
    non_quai_thao: {
      id: "non_quai_thao",
      name: "Nón Quai Thao (Nón Ba Tầm)",
      category: "headwear",
      origin: "Bắc Bộ (Hội Lim, Quan họ)",
      meaning: "Tượng trưng cho sự viên mãn trăng rằm, quai thao bằng dải tơ đồng thể hiện tình ý thắm nồng của người quan họ.",
      icon: "👒"
    },
    non_la_hue: {
      id: "non_la_hue",
      name: "Nón Lá Bài Thơ Thêu Chỉ Vàng",
      category: "headwear",
      origin: "Xứ Huế thơ mộng",
      meaning: "Chiếc nón lá soi lên ánh nắng hiện vần thơ và hình cầu Trường Tiền, nét duyên thầm e lệ của người con gái sông Hương.",
      icon: "👒"
    },
    khan_dong_man_nhung: {
      id: "khan_dong_man_nhung",
      name: "Mấn Nhung Đính Hạt Ngọc Bội",
      category: "headwear",
      origin: "Triều Nguyễn & Lễ phục",
      meaning: "Vấn tóc gọn gàng tôn vinh gương mặt phúc hậu, nếp khăn đều tăm tắp tượng trưng cho nếp nhà quy củ, đoan chính.",
      icon: "👑"
    },
    khan_ran_nam_bo: {
      id: "khan_ran_nam_bo",
      name: "Khăn Rằn Nam Bộ Rực Rỡ",
      category: "neckwear",
      origin: "Đồng bằng Nam Bộ",
      meaning: "Hình ảnh người dân mở cõi phương Nam quật cường, phối theo kiểu bandana streetwear hiện đại cực chất.",
      icon: "🧣"
    },
    quat_tram_huong: {
      id: "quat_tram_huong",
      name: "Quạt Lụa Thêu Thủy Ba Nan Gỗ Trầm",
      category: "handheld",
      origin: "Huế & Thăng Long",
      meaning: "Cốt cách phong lưu tài tử, xua đi oi bức mùa hè và e ấp nụ cười duyên trong các buổi hội ngộ tao nhân.",
      icon: "🪭"
    },
    guoc_moc_quai_nhung: {
      id: "guoc_moc_quai_nhung",
      name: "Guốc Mộc Yên Ngựa Sơn Son",
      category: "footwear",
      origin: "Làng nghề guốc Yên Xá cổ truyền",
      meaning: "Âm thanh lóc cóc thanh tao trên đường lát gạch Bát Tràng, đế gỗ xoan thơm nhẹ tôn vinh sự mộc mạc thanh cao.",
      icon: "👡"
    },
    chuoi_ngoc_boi_bac: {
      id: "chuoi_ngoc_boi_bac",
      name: "Khánh Ngọc Bội Bạc Chạm Hoa Sen",
      category: "jewelry",
      origin: "Cung đình & Quý tộc Việt",
      meaning: "Vật tùy thân bằng ngọc cẩm thạch xua tà khí, mang lại may mắn, trường thọ và tâm hồn trong sáng như ngọc.",
      icon: "📿"
    }
  },

  // ===================================================================
  // 4. PHỤ KIỆN GEN Z REMIX (MODERN / STREETWEAR / TECH)
  // ===================================================================
  modernAccessories: {
    chunky_sneaker: {
      id: "chunky_sneaker",
      name: "Chunky Platform Sneaker (Trắng/Bạc)",
      category: "footwear",
      vibe: "Cyber Streetwear",
      desc: "Đôi sneaker đế bánh mì hầm hố phá cách, giúp hack dáng và tạo độ nảy năng động cho tà áo truyền thống thướt tha.",
      icon: "👟"
    },
    kinh_ram_cyber_y2k: {
      id: "kinh_ram_cyber_y2k",
      name: "Kính Râm Matrix Cyber Y2K Gọng Kim Loại",
      category: "eyewear",
      vibe: "Futuristic Gen Z",
      desc: "Tròng kính hẹp sắc lẹm tráng gương màu khói hoặc cam neon, biến bộ cổ phục thành bộ cánh sci-fi ấn tượng.",
      icon: "🕶️"
    },
    tai_nghe_over_ear: {
      id: "tai_nghe_over_ear",
      name: "Tai Nghe Over-Ear Bluetooth Bạc Kim",
      category: "tech",
      vibe: "Lo-fi Aesthetic / City Pop",
      desc: "Chiếc tai nghe chụp tai kim loại đeo hờ ở cổ, thể hiện người trẻ yêu âm nhạc truyền thống kết hợp nhịp đập điện tử.",
      icon: "🎧"
    },
    tui_tote_canvas_thu_phap: {
      id: "tui_tote_canvas_thu_phap",
      name: "Túi Tote Vải Mộc In Thư Pháp Gen Z",
      category: "bags",
      vibe: "Artistic Minimalist",
      desc: "Túi tote vải dệt thô in typo chữ Nôm cách điệu 'Việt Nam Phong Hoa', đựng vừa laptop và máy ảnh film dạo phố.",
      icon: "👜"
    },
    blazer_oversized: {
      id: "blazer_oversized",
      name: "Áo Blazer Oversized Cấu Trúc Rộng",
      category: "outerwear",
      vibe: "High-Fashion Editorial",
      desc: "Khoác hờ bên ngoài áo dài hoặc áo ngũ thân, mang lại phong thái quyền lực thời thượng như trên sàn runway Paris.",
      icon: "🧥"
    },
    vong_xich_titan_ngoc: {
      id: "vong_xich_titan_ngoc",
      name: "Dây Chuyền Xích Titan Layer Ngọc Trai",
      category: "jewelry",
      vibe: "Genderless Luxury",
      desc: "Sự giao thoa giữa chuỗi ngọc trai quý phái cổ điển và mắt xích kim loại gai góc của văn hóa hip-hop đường phố.",
      icon: "⛓️"
    },
    smartwatch_co_dien: {
      id: "smartwatch_co_dien",
      name: "Đồng Hồ Thông Minh Mặt Tròn Dây Da Thủ Công",
      category: "tech",
      vibe: "Modern Classic",
      desc: "Mặt số hiển thị họa tiết âm lịch và các tiết khí Việt Nam, giao hòa hoàn hảo giữa công nghệ số và nhịp thở bốn mùa.",
      icon: "⌚"
    }
  },

  // ===================================================================
  // 5. CÁC BỘ BẢNG MÀU PHỐI SẴN THEO CHỦ ĐỀ (COLOR SUITES / HARMONIES)
  // Bổ sung phong phú các chủ đề màu sắc, hỗ trợ áp dụng nguyên bộ 1-click
  // ===================================================================
  colorSuites: [
    {
      id: "suite_ngu_hanh",
      theme: "Ngũ Hành Hoàng Triều",
      desc: "Màu sắc biểu trưng triết lý vũ trụ quan Đại Việt: Kim, Mộc, Thủy, Hỏa, Thổ hòa hợp.",
      colors: [
        { name: "Đỏ Chu Sa (Hỏa)", hex: "#d90429", role: "Nhiệt huyết, may mắn" },
        { name: "Vàng Hoàng Thổ (Thổ)", hex: "#ffd166", role: "Vương giả, đất mẹ" },
        { name: "Xanh Chàm (Thủy)", hex: "#1d3557", role: "Sâu lắng, minh triết" },
        { name: "Xanh Ngọc Bích (Mộc)", hex: "#2a9d8f", role: "Sinh sôi, tươi tốt" },
        { name: "Trắng Bạch Ngọc (Kim)", hex: "#f8f9fa", role: "Thuần khiết, thanh cao" }
      ],
      defaultTop: "#1d3557",
      defaultBottom: "#f8f9fa",
      elementRule: "Thủy dưỡng Mộc - Mộc sinh Hỏa"
    },
    {
      id: "suite_hanoi_pho",
      theme: "Hà Nội 36 Phố Phường",
      desc: "Sắc vàng hoa cúc mùa thu, xanh cốm Vòng và màu gạch nung gốm Bát Tràng bảng lảng sương sớm.",
      colors: [
        { name: "Vàng Hoa Cúc Thu", hex: "#e76f51", role: "Nắng thu trên mái ngói" },
        { name: "Xanh Cốm Vòng", hex: "#84a59d", role: "Hương nếp thanh khiết" },
        { name: "Gạch Bát Tràng", hex: "#b02a37", role: "Nét xưa hoài niệm" },
        { name: "Gỗ Gụ Nhà Cổ", hex: "#582f0e", role: "Trầm mặc cổ kính" },
        { name: "Trắng Sương Sớm", hex: "#fdfbf7", role: "Sương phủ Hồ Tây" }
      ],
      defaultTop: "#e76f51",
      defaultBottom: "#fdfbf7",
      elementRule: "Tone màu ấm áp, thanh tao, đậm chất thu Hà Nội"
    },
    {
      id: "suite_co_do_hue",
      theme: "Cố Đô Sông Hương Dạ Khúc",
      desc: "Sắc tím Huế trầm tư thủy chung, xanh cổ vịt triều Nguyễn và màu vàng lá trúc chỉ dát vàng.",
      colors: [
        { name: "Tím Mộng Mơ Huế", hex: "#7209b7", role: "Sắc son tình nghĩa" },
        { name: "Xanh Cổ Vịt Cung Đình", hex: "#144552", role: "Uy nghiêm vương triều" },
        { name: "Vàng Trúc Chỉ", hex: "#e0a96d", role: "Ánh nến hoa đăng" },
        { name: "Đỏ Son Cung Cấm", hex: "#800f2f", role: "Cổng rường cột thế thiếp" },
        { name: "Mây Thủy Ba", hex: "#e2eafc", role: "Dòng Hương Giang êm đềm" }
      ],
      defaultTop: "#7209b7",
      defaultBottom: "#e2eafc",
      elementRule: "Tone màu quý phái, đài các, đậm chất cung đình"
    },
    {
      id: "suite_genz_cyber",
      theme: "Gen Z Cyber-Folk 2077",
      desc: "Hoa sen quốc hồn quốc túy khuếch đại thành neon rực cháy, tương phản mạnh mẽ với bóng đêm công nghệ.",
      colors: [
        { name: "Hồng Sen Neon", hex: "#f72585", role: "Quốc hoa thế hệ mới" },
        { name: "Electric Cyan", hex: "#00f5d4", role: "Tia chớp tương lai" },
        { name: "Acid Lime Green", hex: "#ccff00", role: "Năng lượng bùng nổ" },
        { name: "Dark Matrix Black", hex: "#0b090a", role: "Bóng đêm phố thị" },
        { name: "Ultra Violet", hex: "#3a0ca3", role: "Không gian đa chiều" }
      ],
      defaultTop: "#f72585",
      defaultBottom: "#0b090a",
      elementRule: "Tương phản thị giác cực đại, visual bắt trọn ánh nhìn"
    },
    {
      id: "suite_vintage_indochine",
      theme: "Indochine Vintage & Zen",
      desc: "Chất liệu đũi tơ sống mộc mạc, màu nâu đồng phù sa, xanh rêu rừng nhiệt đới thư thái.",
      colors: [
        { name: "Xanh Rêu Rừng Nhiệt Đới", hex: "#386641", role: "Thiên nhiên an yên" },
        { name: "Be Sữa Vải Đũi", hex: "#e9d8a6", role: "Mộc mạc tơ tằm" },
        { name: "Nâu Đất Phù Sa", hex: "#6f4e37", role: "Đất mẹ đồng bằng" },
        { name: "Vàng Mù Tạt Cổ", hex: "#cca43b", role: "Nắng xế chiều tà" },
        { name: "Xám Tro Trầm Mặc", hex: "#495057", role: "Tĩnh lặng sâu lắng" }
      ],
      defaultTop: "#386641",
      defaultBottom: "#e9d8a6",
      elementRule: "Tối giản, chữa lành tâm hồn, phong thái điềm nhiên"
    },
    {
      id: "suite_pastel_youth",
      theme: "Pastel Thanh Xuân Ngọt Ngào",
      desc: "Sắc màu trong trẻo của tuổi học trò: hồng phấn, xanh da trời và tím hoa cà mơ mộng.",
      colors: [
        { name: "Hồng Cánh Sen Non", hex: "#ffb4a2", role: "Duyên thầm tuổi trẻ" },
        { name: "Xanh Bầu Trời Mùa Hè", hex: "#bde0fe", role: "Ước mơ bay xa" },
        { name: "Tím Hoa Cà Lavender", hex: "#cdb4db", role: "Kỷ niệm thanh xuân" },
        { name: "Kem Bơ Sữa", hex: "#fefae0", role: "Nắng sớm sân trường" },
        { name: "Xanh Bạc Hà Dịu Mát", hex: "#d8f3dc", role: "Tươi mới rạng rỡ" }
      ],
      defaultTop: "#ffb4a2",
      defaultBottom: "#fefae0",
      elementRule: "Tone màu nhẹ nhàng, thanh thoát, tôn sáng làn da"
    }
  ],

  // Danh sách màu đơn lẻ chọn nhanh
  colorPalettes: [
    { id: "hoa_do_tham", name: "Đỏ Thắm Chu Sa (Hành Hỏa)", hex: "#d90429", element: "Hỏa", harmonyWith: ["#ffd166", "#06d6a0", "#118ab2", "#f8f9fa"] },
    { id: "tho_vang_hoang_kim", name: "Vàng Hoàng Thổ (Hành Thổ)", hex: "#ffd166", element: "Thổ", harmonyWith: ["#d90429", "#ffffff", "#2b2d42", "#f8f9fa"] },
    { id: "thuy_xanh_cham", name: "Xanh Chàm Cố Đô (Hành Thủy)", hex: "#1d3557", element: "Thủy", harmonyWith: ["#a8dadc", "#f1faee", "#06d6a0", "#f8f9fa"] },
    { id: "moc_xanh_ngoc_bich", name: "Xanh Ngọc Bích (Hành Mộc)", hex: "#2a9d8f", element: "Mộc", harmonyWith: ["#e76f51", "#264653", "#f4a261", "#f8f9fa"] },
    { id: "kim_trang_bach_ngoc", name: "Trắng Bạch Ngọc (Hành Kim)", hex: "#f8f9fa", element: "Kim", harmonyWith: ["#1d3557", "#2b2d42", "#d90429", "#111111"] },
    { id: "genz_pastel_lavender", name: "Tím Mộng Mơ Pastel Gen Z", hex: "#b8a9c9", element: "Remix", harmonyWith: ["#ffffff", "#6247aa", "#ffcad4", "#f8f9fa"] },
    { id: "genz_cyber_magenta", name: "Hồng Sen Neon Cyberpunk", hex: "#f72585", element: "Remix", harmonyWith: ["#4cc9f0", "#7209b7", "#3a0ca3", "#0b090a"] },
    { id: "genz_sage_green", name: "Xanh Cốm Vòng Mùa Thu", hex: "#84a59d", element: "Remix", harmonyWith: ["#f7ede2", "#f5cac3", "#f28482", "#f8f9fa"] },
    { id: "ha_noi_dat_nung", name: "Cam Đất Nung Bát Tràng", hex: "#e76f51", element: "Thổ", harmonyWith: ["#fdfbf7", "#264653", "#2a9d8f", "#f8f9fa"] },
    { id: "indochine_moss", name: "Xanh Rêu Rừng Đông Dương", hex: "#386641", element: "Mộc", harmonyWith: ["#e9d8a6", "#fefae0", "#6f4e37", "#f8f9fa"] }
  ],

  // ===================================================================
  // 6. HỌA TIẾT VẢI TRUYỀN THỐNG (PATTERNS)
  // ===================================================================
  patterns: {
    tron_moc: {
      id: "tron_moc",
      name: "Lụa Trơn Tơ Tằm Mộc",
      desc: "Bề mặt vải lụa tơ sống bóng nhẹ tự nhiên, mộc mạc và thanh tao tối đa."
    },
    sen_dam: {
      id: "sen_dam",
      name: "Gấm Dệt Hoa Sen Cổ Điển",
      desc: "Biểu tượng tinh khiết của bùn lầy không hôi tanh, hoa văn chìm sang trọng dưới ánh sáng."
    },
    thuy_ba: {
      id: "thuy_ba",
      name: "Thủy Ba Sóng Nước Triều Nguyễn",
      desc: "Họa tiết sóng biển dâng trào và mây ngũ sắc cầu chúc quốc thái dân an, uy nghi vương triều."
    },
    trong_dong: {
      id: "trong_dong",
      name: "Chim Lạc & Trống Đồng Đông Sơn",
      desc: "Nguồn cội văn minh Văn Lang 4000 năm, họa tiết hình học kỷ hà độc bản của người Việt."
    },
    tho_cam: {
      id: "tho_cam",
      name: "Thổ Cẩm Sợi Nhuộm Núi Rừng",
      desc: "Sắc màu rực rỡ dệt tay của các đồng bào Tây Bắc, mang hơi thở tự do hoang dã."
    }
  },

  // ===================================================================
  // 7. 10 DỊP LỄ HỘI & SỰ KIỆN PHỤC VỤ ĐA DẠNG NGƯỜI DÙNG (EVENTS)
  // Mở rộng sâu sắc theo yêu cầu để phục vụ học sinh, sinh viên, gia đình
  // ===================================================================
  events: {
    ky_yeu: {
      id: "ky_yeu",
      name: "Chụp Ảnh Kỷ Yếu & Lễ Tốt Nghiệp",
      desc: "Ghi dấu thanh xuân học trò, lưu giữ nét đẹp rạng ngời truyền thống bên sân trường hoặc Văn Miếu.",
      defaultWeather: "mild",
      recommendedVibe: "Thanh lịch, trẻ trung, tôn vinh nét đẹp học thức",
      bgLocation: "Văn Miếu - Quốc Tử Giám / Cổng Trường Xưa",
      culturalTip: "Ưu tiên trang phục áo dài trắng, ngũ thân xanh chàm hoặc áo tấc đỏ may mắn. Tránh phối màu quá sặc sỡ làm mất nét thư sinh."
    },
    prom: {
      id: "prom",
      name: "Dạ Hội Prom / Khiêu Vũ Cuối Khóa",
      desc: "Tỏa sáng lộng lẫy giữa dạ hội bằng cổ phục quyền quý, biến hóa cùng blazer và trang sức kim loại sắc sảo.",
      defaultWeather: "cold",
      recommendedVibe: "Quý phái, High-fashion, Sang trọng lộng lẫy",
      bgLocation: "Sảnh Khiêu Vũ Cung Đình Thắp Đèn Lồng",
      culturalTip: "Có thể phối áo Nhật Bình hoặc Áo Tấc tay thụng cùng blazer dạ hội, tạo cấu trúc Haute Couture cực kỳ quyền lực."
    },
    tet: {
      id: "tet",
      name: "Tết Cổ Truyền & Du Xuân Chúc Tết",
      desc: "Diện sắc đỏ thắm, vàng hoàng tộc đón lộc đầu xuân cùng gia đình, chụp ảnh rạng rỡ bên cành đào mai.",
      defaultWeather: "mild",
      recommendedVibe: "Tươi tắn, ấm cúng, đậm phong vị cổ truyền",
      bgLocation: "Chợ Hoa Tết Phố Cổ & Vườn Đào Nhật Tân",
      culturalTip: "Nên chọn tone Đỏ thắm (Hỏa) hoặc Vàng hoàng gia (Thổ). Tránh mặc nguyên cây đen tuyền khi đi chúc Tết người lớn."
    },
    le_chua: {
      id: "le_chua",
      name: "Đi Chùa Cầu An & Vu Lan Báo Hiếu",
      desc: "Không gian trang nghiêm tôn kính nơi cửa Phật, đòi hỏi trang phục kín đáo, trang nhã và tịnh tâm.",
      defaultWeather: "mild",
      recommendedVibe: "Kín đáo, thuần khiết, thanh tịnh, mực thước",
      bgLocation: "Sân Chùa Cổ Trấn Quốc Yên Bình",
      culturalTip: "Bắt buộc mặc áo kín cổ, cài đủ nút. Tuyệt đối không mặc yếm trần lộ vai hay váy ngắn xẻ tà khi vào chính điện."
    },
    dam_cuoi: {
      id: "dam_cuoi",
      name: "Dự Đám Cưới / Phù Dâu Phù Rể / Lễ Bê Tráp",
      desc: "Tham gia ngày đại hỷ của bạn bè người thân trong tà áo ngũ thân thanh nhã hoặc áo dài đôi duyên dáng.",
      defaultWeather: "mild",
      recommendedVibe: "Trang trọng, tươi vui, trang nhã, không lấn át cô dâu chú rể",
      bgLocation: "Tư Gia Lễ Hôn Phối Truyền Thống",
      culturalTip: "Nếu là đội bê tráp, nên chọn màu đồng điệu pastel hoặc vàng nhạt, tránh diện màu đỏ rực trùng với áo cưới của cô dâu."
    },
    streetwear: {
      id: "streetwear",
      name: "Dạo Phố Cuối Tuần & Cafe Aesthetic",
      desc: "Thả dáng tại Hồ Gươm, Nhà hát Lớn hay phố đi bộ Nguyễn Huệ cùng cà phê sữa đá và phụ kiện Y2K.",
      defaultWeather: "hot",
      recommendedVibe: "Năng động, ngẫu hứng, thoải mái di chuyển",
      bgLocation: "Phố Đi Bộ Hồ Gươm & Xe Trà Đá Vỉa Hè",
      culturalTip: "Phối áo tứ thân hoặc áo bà ba cùng sneaker chunky, quần jeans baggy để vừa giữ hồn Việt vừa cực kỳ thoải mái chạy nhảy."
    },
    festival: {
      id: "festival",
      name: "Festival Văn Hóa, Diễu Hành & Comic Con",
      desc: "Bữa tiệc sắc màu tôn vinh di sản, tự tin thể hiện tình yêu lịch sử nước nhà cùng cộng đồng bạn trẻ.",
      defaultWeather: "hot",
      recommendedVibe: "Ấn tượng, chuẩn xác di sản hoặc sáng tạo đột phá",
      bgLocation: "Kỳ Đài Kinh Thành Huế Rực Rỡ Cờ Hoa",
      culturalTip: "Không gian mở cho sáng tạo: bạn có thể phối áo Giao Lĩnh cổ chéo kết hợp phụ kiện Cyberpunk, kính râm matrix cực cháy."
    },
    van_nghe: {
      id: "van_nghe",
      name: "Trình Diễn Văn Nghệ & Thi Thanh Lịch",
      desc: "Tỏa sáng trên sân khấu trường học với những tiết mục múa quạt, hát quan họ hoặc thi biểu diễn trang phục truyền thống.",
      defaultWeather: "mild",
      recommendedVibe: "Rực rỡ ánh đèn, phom áo bay bổng, tôn vinh dáng vóc",
      bgLocation: "Sân Khấu Nhà Văn Hóa Tuổi Trẻ",
      culturalTip: "Chọn trang phục có màu tương phản bắt đèn sân khấu, tà áo xòe rộng như Áo Tứ Thân thắt bao xanh hoặc Áo Nhật Bình ngũ sắc."
    },
    trung_thu: {
      id: "trung_thu",
      name: "Đêm Hội Trăng Rằm & Phố Đèn Lồng",
      desc: "Dạo bước dưới ánh trăng rằm tháng Tám bên đèn ông sao, đèn kéo quân cùng nhóm bạn trong trang phục mộc mạc ấm áp.",
      defaultWeather: "mild",
      recommendedVibe: "Ấm cúng, hoài niệm tuổi thơ, lãng mạn",
      bgLocation: "Phố Đèn Lồng Lương Nhữ Học / Hội An",
      culturalTip: "Áo tứ thân yếm đỏ hoặc áo ngũ thân lụa mềm mại dưới ánh đèn lồng tạo nên những bức ảnh kỷ niệm tuyệt mỹ."
    },
    ngoai_giao: {
      id: "ngoai_giao",
      name: "Giao Lưu Quốc Tế & Hội Nghị Di Sản",
      desc: "Đại diện thế hệ trẻ Việt Nam đón tiếp bạn bè quốc tế, tự hào giới thiệu nét đẹp trang phục nghìn năm văn hiến.",
      defaultWeather: "cold",
      recommendedVibe: "Mực thước ngoại giao, trang nhã, kiêu hãnh dân tộc",
      bgLocation: "Trung Tâm Hội Nghị Quốc Tế Hà Nội",
      culturalTip: "Áo Ngũ Thân tay chẽn hoặc Áo Tấc tay thụng là biểu tượng chính lễ quốc gia hoàn hảo nhất, thể hiện sự trọng thị và cốt cách đàng hoàng."
    }
  },

  // ===================================================================
  // 8. BỐI CẢNH NỀN CANVAS (BACKGROUND SCENES)
  // ===================================================================
  backgrounds: {
    hue_palace: {
      id: "hue_palace",
      name: "Ngọ Môn - Đại Nội Cố Đô Huế",
      accent: "#f4a261",
      desc: "Bóng chiều tà dát vàng lên lầu Ngũ Phụng cổ kính."
    },
    ho_guom: {
      id: "ho_guom",
      name: "Tháp Rùa - Hồ Gươm Hà Nội Mùa Thu",
      accent: "#2a9d8f",
      desc: "Liễu rủ ven hồ Gươm thoảng hương hoa sữa ngọt ngào."
    },
    hoi_an: {
      id: "hoi_an",
      name: "Phố Cổ Hội An Đèn Lồng Lung Linh",
      accent: "#e76f51",
      desc: "Sắc vàng hoa giấy và ánh đèn lồng lững lờ trôi bến sông Hoài."
    },
    cyber_saigon: {
      id: "cyber_saigon",
      name: "Cyberpunk Sài Gòn 2077 Neon City",
      accent: "#f72585",
      desc: "Các tòa tháp chọc trời lung linh bảng hiệu neon hòa trộn mái chùa cổ."
    },
    van_mieu: {
      id: "van_mieu",
      name: "Khuê Văn Các - Văn Miếu Thăng Long",
      accent: "#d4af37",
      desc: "Nơi tôn vinh đạo học ngàn năm, sao Khuê tỏa sáng rạng ngời."
    },
    studio_minimal: {
      id: "studio_minimal",
      name: "Studio Editorial Minimalist",
      accent: "#d4af37",
      desc: "Phông nền vô cực xám lạnh chuyên nghiệp chuẩn tạp chí thời trang."
    }
  },

  // ===================================================================
  // 9. QUY TẮC CẢNH BÁO BẢO VỆ VĂN HÓA (CULTURAL GUARDRAILS)
  // ===================================================================
  culturalRules: [
    {
      id: "rule_yem_chua",
      condition: (outfit) => outfit.garment === "ao_tu_than" && !outfit.hasOuterWear && outfit.event === "le_chua",
      severity: "critical",
      title: "CẢNH BÁO VĂN HÓA: Trang phục không phù hợp chốn tôn nghiêm!",
      message: "Áo Yếm là nội y truyền thống của phụ nữ xưa. Khi đi chùa hoặc nơi trang trọng, bắt buộc phải mặc đủ áo Tứ Thân cài kín tà bên ngoài, tuyệt đối không mặc yếm trần lộ vai để giữ sự trang nghiêm nơi cửa Phật.",
      remedy: "Hãy khoác thêm áo Tứ Thân hoặc chọn Áo Ngũ Thân/Áo Dài cho dịp này."
    },
    {
      id: "rule_vat_nguoc",
      condition: (outfit) => outfit.lapelSide === "left_over_right",
      severity: "danger",
      title: "LƯU Ý NGHIÊM NGẶT: Cài vạt áo sai quy cách cổ nhân!",
      message: "Trong văn hóa Việt Phục cổ truyền (Ngũ Thân, Tứ Thân, Giao Lĩnh), quy tắc bất di bất dịch là 'Hữu nhậm' (Vạt phải đè lên vạt trái). Nếu cài ngược 'Tả nhậm' (vạt trái đè vạt phải) thời xưa chỉ dùng cho trang phục liệm người đã khuất hoặc biểu hiện của sự tang tóc!",
      remedy: "Hệ thống đã tự động điều chỉnh vạt phải cài lên trên để đảm bảo chuẩn mực phong tục."
    },
    {
      id: "rule_mau_tang_le_tet",
      condition: (outfit) => outfit.event === "tet" && outfit.colorHex === "#111111" && outfit.bottomColor === "#111111",
      severity: "warning",
      title: "Góp ý sắc màu: Tết truyền thống kiêng kỵ toàn màu đen tuyền",
      message: "Dịp Tết cổ truyền đầu năm, người Việt chuộng sắc Đỏ, Vàng, Xanh tươi mới để đón sinh khí và may mắn. Diện nguyên cây đen tuyền có thể bị người lớn trong gia đình nhắc nhở.",
      remedy: "Thêm dải yếm đỏ, mấn hoàng kim hoặc đổi thân áo sang tone Đỏ thắm / Vàng hoàng thổ rạng rỡ!"
    },
    {
      id: "rule_le_chua_kin_dao",
      condition: (outfit) => outfit.event === "le_chua" && outfit.bottom === "vay_tennis_pleated",
      severity: "critical",
      title: "CẢNH BÁO: Váy ngắn không phù hợp chốn cửa Phật",
      message: "Chân váy tennis ngắn trẻ trung rất đẹp khi dạo phố, nhưng nơi cửa Phật tôn nghiêm đòi hỏi sự kín đáo qua đầu gối.",
      remedy: "Nên đổi sang Quần lụa ống rộng hoặc Quần đũi suông để thể hiện lòng thành kính."
    },
    {
      id: "rule_dam_cuoi_lan_at",
      condition: (outfit) => outfit.event === "dam_cuoi" && outfit.garment === "ao_nhat_binh" && outfit.colorHex === "#d90429",
      severity: "warning",
      title: "Lưu ý trang phục dự đám cưới: Tránh lấn át Cô Dâu",
      message: "Áo Nhật Bình đỏ thêu ngũ sắc là trang phục dành riêng cho Cô Dâu trong ngày xuất giá. Khách mời hoặc phù dâu diện bộ này dễ chiếm spotlight của nhân vật chính!",
      remedy: "Khuyên bạn đổi sang Áo Ngũ Thân màu Pastel, Xanh Chàm hoặc Trắng Ngà thanh lịch."
    },
    {
      id: "rule_tuyet_pham_remix",
      condition: (outfit) => (outfit.garment === "ngu_than_tay_chen" && outfit.modernAcc === "chunky_sneaker") || (outfit.garment === "ao_dai_tan_thoi" && outfit.modernAcc === "blazer_oversized"),
      severity: "praise",
      title: "PHỐI ĐỒ ĐẠT CHUẨN REMIX VĂN MINH!",
      message: "Sự kết hợp xuất sắc! Bạn giữ trọn vẹn phom dáng và cổ áo nghiêm cẩn của Việt Phục, đồng thời đưa năng lượng hiện đại qua phụ kiện gọn gàng, tôn vinh di sản theo cách vô cùng thời thượng.",
      remedy: "Đạt chuẩn 98/100 Điểm Tôn Vinh Bản Sắc!"
    }
  ],

  // ===================================================================
  // 10. BỘ PHỐI MẪU GEN Z INSPIRATION (PRESETS)
  // ===================================================================
  presets: [
    {
      id: "preset_hanoi_y2k",
      name: "Hà Nội Y2K Street Beats",
      garment: "ao_tu_than",
      bottom: "quan_cargo_street",
      colorHex: "#ffd166",
      bottomColor: "#212529",
      pattern: "trong_dong",
      tradAcc: "non_quai_thao",
      modernAcc: "chunky_sneaker",
      bg: "ho_guom",
      event: "streetwear",
      designer: "Linh Đan (Gen Z Hà Nội)",
      caption: "Vạt áo tứ thân vàng óng buông lơi trên nền quần cargo túi hộp đen tuyền, dạo bước ven hồ mùa thu cực ngầu!"
    },
    {
      id: "preset_royal_cyber",
      name: "Cố Đô Royal Cyberpunk",
      garment: "ngu_than_tay_chen",
      bottom: "quan_lua_suong",
      colorHex: "#1d3557",
      bottomColor: "#f8f9fa",
      pattern: "thuy_ba",
      tradAcc: "khan_dong_man_nhung",
      modernAcc: "kinh_ram_cyber_y2k",
      bg: "hue_palace",
      event: "prom",
      designer: "Minh Quân (CLB Cổ Phong ĐH Huế)",
      caption: "Áo ngũ thân tay chẽn xanh chàm quyền uy kết hợp kính râm Matrix và chuỗi ngọc khảm bạc, thần thái dạ tiệc số 1!"
    },
    {
      id: "preset_saigon_chic",
      name: "Sài Gòn Modern Sen Hồng",
      garment: "ao_dai_tan_thoi",
      bottom: "vay_tennis_pleated",
      colorHex: "#f72585",
      bottomColor: "#ffffff",
      pattern: "sen_dam",
      tradAcc: "quat_tram_huong",
      modernAcc: "tai_nghe_over_ear",
      bg: "cyber_saigon",
      event: "streetwear",
      designer: "Bảo Ngọc (Visual Artist TPHCM)",
      caption: "Áo dài tà lửng hồng neon ngọt ngào phối cùng chân váy xếp ly trắng và tai nghe over-ear lofi chill phố thị."
    },
    {
      id: "preset_indochine_prom",
      name: "Nhật Bình Indochine Haute Couture",
      garment: "ao_nhat_binh",
      bottom: "quan_linen_ong_dung",
      colorHex: "#d4a373",
      bottomColor: "#e9d8a6",
      pattern: "thuy_ba",
      tradAcc: "chuoi_ngoc_boi_bac",
      modernAcc: "blazer_oversized",
      bg: "studio_minimal",
      event: "prom",
      designer: "Hoàng Duy (Stylist)",
      caption: "Vẻ đài các của Áo Nhật Bình cổ vuông viền ngũ sắc khoác cùng blazer dạ hội oversized đỉnh cao sàn diễn thời trang."
    },
    {
      id: "preset_dam_cuoi_phu_dau",
      name: "Hỷ Sự Phù Dâu Nhã Nhặn",
      garment: "ao_dai_tan_thoi",
      bottom: "quan_lua_suong",
      colorHex: "#ffb4a2",
      bottomColor: "#f8f9fa",
      pattern: "sen_dam",
      tradAcc: "quat_tram_huong",
      modernAcc: "smartwatch_co_dien",
      bg: "hoi_an",
      event: "dam_cuoi",
      designer: "Thùy Trang (Wedding Stylist)",
      caption: "Tà áo dài hồng phấn trang nhã, điểm xuyết hoa sen thanh khiết mang lại niềm vui tươi tắn trong ngày đại hỷ."
    },
    {
      id: "preset_ngoai_giao_kieu_hanh",
      name: "Sứ Giả Văn Hóa Ngoại Giao",
      garment: "ngu_than_tay_chen",
      bottom: "quan_lua_suong",
      colorHex: "#144552",
      bottomColor: "#f8f9fa",
      pattern: "sen_dam",
      tradAcc: "khan_dong_man_nhung",
      modernAcc: "tui_tote_canvas_thu_phap",
      bg: "van_mieu",
      event: "ngoai_giao",
      designer: "Đặng Tuấn (Hội Sinh Viên Việt Nam)",
      caption: "Phong thái điềm đạm, đàng hoàng của chiếc áo ngũ thân tay chẽn đại diện bản sắc quốc gia vươn tầm thế giới."
    }
  ],

  // ===================================================================
  // 11. BÁCH KHOA VĂN HÓA & TRẮC NGHIỆM GEN Z SỨ GIẢ (QUIZ)
  // ===================================================================
  quizQuestions: [
    {
      question: "Trong chiếc Áo Ngũ Thân truyền thống, 5 chiếc cúc cài dọc thân áo biểu trưng cho điều gì?",
      options: [
        "5 hành Kim - Mộc - Thủy - Hỏa - Thổ",
        "Ngũ Thường: Nhân - Lễ - Nghĩa - Trí - Tín",
        "5 mùa trong năm theo lịch cổ",
        "5 điều ước Phúc - Lộc - Thọ - Khang - Ninh"
      ],
      correctIndex: 1,
      explanation: "Chính xác! 5 chiếc cúc cài áo ngũ thân tượng trưng cho Ngũ Thường của đạo làm người: Nhân (nhân ái), Lễ (lễ độ), Nghĩa (chính nghĩa), Trí (trí tuệ), Tín (uy tín)."
    },
    {
      question: "Vì sao gọi là Áo Tứ Thân và hai vạt trước buộc lại mang ý nghĩa gì?",
      options: [
        "Bốn vạt tượng trưng tứ phương; buộc lại để dễ chạy nhảy",
        "Bốn vạt tượng trưng tứ thân phụ mẫu (cha mẹ hai bên); buộc lại tượng trưng cho tình nghĩa vợ chồng son sắt",
        "Áo do 4 mảnh vải chắp lại vì ngày xưa vải hiếm",
        "Tượng trưng cho 4 linh vật Long - Ly - Quy - Phụng"
      ],
      correctIndex: 1,
      explanation: "Đúng rồi! Bốn vạt áo tượng trưng cho tứ thân phụ mẫu (bố mẹ mình và bố mẹ chồng/vợ). Hai vạt trước buộc lại biểu trưng cho tình nghĩa vợ chồng khắng khít bền lâu."
    },
    {
      question: "Quy tắc cài vạt áo chuẩn trong toàn bộ hệ thống Việt Phục cổ truyền là gì?",
      options: [
        "Vạt trái đè vạt phải (Tả nhậm)",
        "Vạt phải đè vạt trái (Hữu nhậm)",
        "Cài vạt nào cũng được tùy tay thuận",
        "Nam cài vạt trái, nữ cài vạt phải"
      ],
      correctIndex: 1,
      explanation: "Rất chuẩn! Văn hóa Việt tuân theo quy tắc 'Hữu nhậm' - vạt phải đè lên vạt trái. Tuyệt đối không cài vạt trái lên trước vì thời xưa đó là cách mặc của người đã mất."
    },
    {
      question: "Chiếc áo Nhật Bình có nguồn gốc và đặc điểm nhận dạng nổi bật nhất là gì?",
      options: [
        "Áo có cổ hình chữ nhật trước ngực, viền ngũ sắc tượng trưng Ngũ Hành, là lễ phục quý tộc triều Nguyễn",
        "Áo được du nhập từ Nhật Bản thời kỳ giao thương Hội An",
        "Áo của người lính thủy quân thời nhà Trần",
        "Áo bà ba được vẽ thêm hoa văn mặt trời"
      ],
      correctIndex: 0,
      explanation: "Chính xác! Tên gọi Nhật Bình xuất phát từ chiếc cổ áo xẻ hình chữ nhật nằm ngang trước ngực, viền thêu dải ngũ hành rực rỡ, là biểu tượng quyền quý triều Nguyễn."
    },
    {
      question: "Sự khác biệt rõ rệt nhất giữa Áo Tấc và Áo Ngũ Thân tay chẽn là gì?",
      options: [
        "Áo Tấc may bằng vải nhung, áo tay chẽn may bằng lụa",
        "Áo Tấc có ống tay thụng dài rộng buông rủ (dùng làm đại lễ phục), còn tay chẽn có ống tay ôm thon gọn (dùng làm thường phục)",
        "Áo Tấc chỉ dành cho phụ nữ, áo tay chẽn chỉ dành cho nam giới",
        "Áo Tấc không có cúc cài"
      ],
      correctIndex: 1,
      explanation: "Đúng! Cả hai đều thuộc hệ thống áo ngũ thân, nhưng Áo Tấc có ống tay rộng thụng 35-40cm trang nghiêm cho các dịp đại lễ, còn tay chẽn ôm vừa vặn để làm việc và di chuyển linh hoạt."
    }
  ]
};

// Export to window
if (typeof window !== "undefined") {
  window.VIET_PHUC_DATA = VIET_PHUC_DATA;
}

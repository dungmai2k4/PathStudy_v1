const fs = require('fs');
const path = require('path');
const docx = require('docx');

const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  ShadingType,
  VerticalAlign,
} = docx;

// Styling constants - Strictly formal & academic (no flashy/colorful gimmicks)
const FONT_FAMILY = 'Times New Roman';
const COLOR_PRIMARY = '0F2C59'; // Deep Navy for Main Headings
const COLOR_SECONDARY = '1E3A8A'; // Sub-headings
const COLOR_TEXT = '111827'; // Dark charcoal text for readability
const COLOR_MUTED = '4B5563'; // Muted dark gray
const COLOR_TABLE_HEADER = 'F1F5F9'; // Light formal gray for table header
const COLOR_TABLE_HEADER_TEXT = '0F172A'; // Dark slate for header text
const COLOR_BORDER = 'CBD5E1'; // Subtle table border

const TABLE_BORDER_STYLE = {
  style: BorderStyle.SINGLE,
  size: 4,
  color: COLOR_BORDER,
};

const CELL_BORDERS = {
  top: TABLE_BORDER_STYLE,
  bottom: TABLE_BORDER_STYLE,
  left: TABLE_BORDER_STYLE,
  right: TABLE_BORDER_STYLE,
};

function createHeading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 280, after: 120 },
    children: [
      new TextRun({
        text: text,
        bold: true,
        size: 28, // 14pt
        color: COLOR_PRIMARY,
        font: FONT_FAMILY,
      }),
    ],
  });
}

function createHeading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 80 },
    children: [
      new TextRun({
        text: text,
        bold: true,
        size: 25, // 12.5pt
        color: COLOR_SECONDARY,
        font: FONT_FAMILY,
      }),
    ],
  });
}

function createHeading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 140, after: 60 },
    children: [
      new TextRun({
        text: text,
        bold: true,
        italics: false,
        size: 23, // 11.5pt
        color: '334155',
        font: FONT_FAMILY,
      }),
    ],
  });
}

function createParagraph(text, options = {}) {
  const { bold = false, italics = false, align = AlignmentType.JUSTIFIED, spacingAfter = 100 } = options;
  return new Paragraph({
    alignment: align,
    spacing: { after: spacingAfter, line: 276 }, // 1.15 line spacing
    children: [
      new TextRun({
        text: text,
        bold: bold,
        italics: italics,
        size: 23, // 11.5pt
        color: COLOR_TEXT,
        font: FONT_FAMILY,
      }),
    ],
  });
}

function createBullet(text, boldPrefix = '') {
  const children = [];
  if (boldPrefix) {
    children.push(
      new TextRun({
        text: boldPrefix + ' ',
        bold: true,
        size: 23,
        color: COLOR_TEXT,
        font: FONT_FAMILY,
      })
    );
  }
  children.push(
    new TextRun({
      text: text,
      size: 23,
      color: COLOR_TEXT,
      font: FONT_FAMILY,
    })
  );
  return new Paragraph({
    bullet: { level: 0 },
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 60, line: 260 },
    children: children,
  });
}

function createSubBullet(text, boldPrefix = '') {
  const children = [];
  if (boldPrefix) {
    children.push(
      new TextRun({
        text: boldPrefix + ' ',
        bold: true,
        size: 22,
        color: COLOR_TEXT,
        font: FONT_FAMILY,
      })
    );
  }
  children.push(
    new TextRun({
      text: text,
      size: 22,
      color: COLOR_TEXT,
      font: FONT_FAMILY,
    })
  );
  return new Paragraph({
    bullet: { level: 1 },
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 50, line: 250 },
    children: children,
  });
}

function createCell(content, options = {}) {
  const {
    bold = false,
    header = false,
    widthPercent = null,
    align = AlignmentType.LEFT,
    colSpan = 1,
  } = options;

  let cellParagraph;
  if (typeof content === 'string') {
    cellParagraph = new Paragraph({
      alignment: align,
      spacing: { before: 40, after: 40, line: 240 },
      children: [
        new TextRun({
          text: content,
          bold: bold || header,
          size: header ? 22 : 21,
          font: FONT_FAMILY,
          color: header ? COLOR_TABLE_HEADER_TEXT : COLOR_TEXT,
        }),
      ],
    });
  } else if (Array.isArray(content)) {
    cellParagraph = content;
  } else {
    cellParagraph = [content];
  }

  const cellConfig = {
    children: Array.isArray(cellParagraph) ? cellParagraph : [cellParagraph],
    borders: CELL_BORDERS,
    verticalAlign: VerticalAlign.CENTER,
    margins: {
      top: 100,
      bottom: 100,
      left: 140,
      right: 140,
    },
  };

  if (header) {
    cellConfig.shading = {
      fill: COLOR_TABLE_HEADER,
      type: ShadingType.CLEAR,
    };
  }

  if (colSpan > 1) {
    cellConfig.columnSpan = colSpan;
  }

  if (widthPercent) {
    cellConfig.width = {
      size: widthPercent,
      type: WidthType.PERCENTAGE,
    };
  }

  return new TableCell(cellConfig);
}

function buildDocument() {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: FONT_FAMILY,
            size: 23,
            color: COLOR_TEXT,
          },
          paragraph: {
            spacing: { line: 276 },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              bottom: 1440,
              left: 1700, // 1.18 inch
              right: 1440,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { after: 120 },
                children: [
                  new TextRun({
                    text: 'TRƯỜNG ĐẠI HỌC FPT — MÔN HỌC EXE201 | BÁO CÁO OUTCOME 1 (TUẦN 3)',
                    size: 18,
                    color: COLOR_MUTED,
                    font: FONT_FAMILY,
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Dự án Khởi nghiệp PathStudy — Trang ',
                    size: 18,
                    color: COLOR_MUTED,
                    font: FONT_FAMILY,
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 18,
                    color: COLOR_MUTED,
                    font: FONT_FAMILY,
                  }),
                  new TextRun({
                    text: ' / ',
                    size: 18,
                    color: COLOR_MUTED,
                    font: FONT_FAMILY,
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 18,
                    color: COLOR_MUTED,
                    font: FONT_FAMILY,
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // BÌA BÁO CÁO CHÍNH THỨC (FORMAL ACADEMIC COVER BLOCK)
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 300, after: 80 },
            children: [
              new TextRun({
                text: 'TRƯỜNG ĐẠI HỌC FPT TP. HỒ CHÍ MINH',
                bold: true,
                size: 26,
                color: COLOR_PRIMARY,
                font: FONT_FAMILY,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'BỘ MÔN KHỞI NGHIỆP & ĐỔI MỚI SÁNG TẠO — MÔN HỌC: EXE201',
                bold: true,
                size: 23,
                color: '334155',
                font: FONT_FAMILY,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 180, after: 120 },
            children: [
              new TextRun({
                text: 'BÁO CÁO ĐÁNH GIÁ TIẾN ĐỘ OUTCOME 1 (TUẦN 3)',
                bold: true,
                size: 34,
                color: COLOR_PRIMARY,
                font: FONT_FAMILY,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 240 },
            children: [
              new TextRun({
                text: 'ĐỀ TÀI: PATHSTUDY — NỀN TẢNG HỌC TẬP THÍCH ỨNG & CÁ NHÂN HÓA LỘ TRÌNH (ADAPTIVE LEARNING PLATFORM)',
                bold: true,
                size: 24,
                color: COLOR_SECONDARY,
                font: FONT_FAMILY,
              }),
            ],
          }),

          // Metadata Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createCell('Thông Tin Dự Án', { header: true, colSpan: 2, align: AlignmentType.CENTER }),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Tên Dự Án:', { bold: true, widthPercent: 30 }),
                  createCell('PathStudy (Adaptive Learning Platform v1.0)', { widthPercent: 70 }),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Lĩnh vực:', { bold: true, widthPercent: 30 }),
                  createCell('EdTech (Công nghệ Giáo dục) — Học tập thích ứng & Trí tuệ nhân tạo', { widthPercent: 70 }),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Tên miền chính thức:', { bold: true, widthPercent: 30 }),
                  createCell('https://pathstudy.id.vn (Hỗ trợ truy cập Internet trực tiếp)', { widthPercent: 70 }),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Mã lớp môn học:', { bold: true, widthPercent: 30 }),
                  createCell('EXE201 — Học kỳ Fall 2026', { widthPercent: 70 }),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Thời gian thực hiện Outcome 1:', { bold: true, widthPercent: 30 }),
                  createCell('Tuần 1 đến Tuần 3 (Khởi động, xây dựng MVP và triển khai thực tế)', { widthPercent: 70 }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 200, after: 100 }, children: [] }),

          // MỤC LỤC TÓM TẮT TRỌNG SỐ ĐÁNH GIÁ OUTCOME 1
          createHeading1('TỔNG QUAN NỘI DUNG VÀ TRỌNG SỐ ĐÁNH GIÁ (OUTCOME 1 RUBRIC)'),
          createParagraph('Báo cáo này được cấu trúc theo đúng 100% các tiêu chí và trọng số quy định trong tài liệu hướng dẫn "EXE201_Outcome 1 guidelines", bao gồm 5 phần chính:'),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createCell('STT', { header: true, widthPercent: 8, align: AlignmentType.CENTER }),
                  createCell('Nội dung đánh giá theo Guideline', { header: true, widthPercent: 57 }),
                  createCell('Trọng số', { header: true, widthPercent: 15, align: AlignmentType.CENTER }),
                  createCell('Trạng thái hoàn thành', { header: true, widthPercent: 20, align: AlignmentType.CENTER }),
                ],
              }),
              new TableRow({
                children: [
                  createCell('I', { align: AlignmentType.CENTER, bold: true }),
                  createCell('Kế hoạch phân bổ nhân sự, vai trò và nhiệm vụ của từng thành viên', { bold: true }),
                  createCell('10%', { align: AlignmentType.CENTER }),
                  createCell('Hoàn thành 100%', { align: AlignmentType.CENTER }),
                ],
              }),
              new TableRow({
                children: [
                  createCell('II', { align: AlignmentType.CENTER, bold: true }),
                  createCell('Sản phẩm thực tế (Demo MVP, Danh mục gói/Bảng giá, Kế hoạch 7 tuần)', { bold: true }),
                  createCell('70%', { align: AlignmentType.CENTER }),
                  createCell('Hoàn thành 100%', { align: AlignmentType.CENTER }),
                ],
              }),
              new TableRow({
                children: [
                  createCell('III', { align: AlignmentType.CENTER, bold: true }),
                  createCell('Cách tiếp cận khách hàng/users và Mục tiêu 6 tuần triển khai', { bold: true }),
                  createCell('10%', { align: AlignmentType.CENTER }),
                  createCell('Hoàn thành 100%', { align: AlignmentType.CENTER }),
                ],
              }),
              new TableRow({
                children: [
                  createCell('IV', { align: AlignmentType.CENTER, bold: true }),
                  createCell('Kế hoạch bán hàng và thu hút người dùng (Sale kits, Landing page, Chuyển đổi)', { bold: true }),
                  createCell('5%', { align: AlignmentType.CENTER }),
                  createCell('Hoàn thành 100%', { align: AlignmentType.CENTER }),
                ],
              }),
              new TableRow({
                children: [
                  createCell('V', { align: AlignmentType.CENTER, bold: true }),
                  createCell('Kế hoạch truyền thông trong 7 tuần triển khai dự án (Master Plan W4-W10)', { bold: true }),
                  createCell('5%', { align: AlignmentType.CENTER }),
                  createCell('Hoàn thành 100%', { align: AlignmentType.CENTER }),
                ],
              }),
              new TableRow({
                children: [
                  createCell('TỔNG CỘNG', { colSpan: 2, bold: true, align: AlignmentType.RIGHT }),
                  createCell('100%', { bold: true, align: AlignmentType.CENTER }),
                  createCell('Sẵn sàng báo cáo', { bold: true, align: AlignmentType.CENTER }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 200, after: 100 }, children: [] }),

          // PHẦN I: KẾ HOẠCH PHÂN BỔ NHÂN SỰ
          createHeading1('PHẦN I: KẾ HOẠCH PHÂN BỔ NHÂN SỰ, VAI TRÒ VÀ NHIỆM VỤ (10%)'),
          createParagraph('Nhóm dự án PathStudy gồm 06 thành viên với sự kết hợp chặt chẽ giữa khối Kỹ thuật phần mềm (Software Engineering) và khối Quản trị kinh doanh - Tiếp thị (Marketing & Business). Cơ cấu tổ chức được thiết lập theo mô hình Agile/Scrum tinh gọn nhằm đảm bảo năng lực thực thi nhanh chóng, đáp ứng đúng cam kết tiến độ của môn học EXE201.'),

          createHeading2('1.1. Ma trận trách nhiệm nhân sự (RACI Matrix)'),
          createParagraph('Bảng phân công vai trò, chức năng chuyên môn và phạm vi trách nhiệm cụ thể của từng thành viên:'),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createCell('Thành viên & MSSV', { header: true, widthPercent: 20 }),
                  createCell('Vai trò dự án', { header: true, widthPercent: 18 }),
                  createCell('Nhiệm vụ chuyên trách chính', { header: true, widthPercent: 42 }),
                  createCell('Tỷ lệ đóng góp', { header: true, widthPercent: 10, align: AlignmentType.CENTER }),
                  createCell('KPI cam kết', { header: true, widthPercent: 10, align: AlignmentType.CENTER }),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Mai Tiến Dũng (Leader)\nMSSV: SE17xxxx', { bold: true }),
                  createCell('Project Leader / Backend Lead'),
                  createCell('- Quản lý tiến độ tổng thể, phân rã backlog theo Sprint.\n- Thiết kế kiến trúc Microservices & Spring Cloud Gateway.\n- Phát triển Auth Service, Content Service, API Contract.\n- Điều phối tích hợp giữa Backend, Database và Frontend.'),
                  createCell('100%', { align: AlignmentType.CENTER }),
                  createCell('100%', { align: AlignmentType.CENTER }),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Nguyễn Đức Huy\nMSSV: SE17xxxx', { bold: true }),
                  createCell('DevOps Lead / Payment Engineer'),
                  createCell('- Thiết kế hạ tầng Docker Compose, PostgreSQL 6 DB.\n- Xây dựng Payment Service tích hợp chuyển khoản VietQR tự động qua MB Bank.\n- Cấu hình Cloudflare Tunnel trỏ domain https://pathstudy.id.vn bảo mật SSL.\n- Xây dựng kịch bản kiểm thử tích hợp E2E Flow.'),
                  createCell('100%', { align: AlignmentType.CENTER }),
                  createCell('100%', { align: AlignmentType.CENTER }),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Thành viên 3 (SE 3)\nMSSV: SE17xxxx', { bold: true }),
                  createCell('Frontend Lead'),
                  createCell('- Dựng cấu trúc giao diện React 19 + Vite + Tailwind CSS.\n- Phát triển giao diện Dashboard, Subject Tree, Study Path Nodes.\n- Tích hợp Axios Interceptors xử lý JWT Token, Error boundaries.\n- Xây dựng giao diện thanh toán VietQR Modal, hiển thị trạng thái Pro.'),
                  createCell('100%', { align: AlignmentType.CENTER }),
                  createCell('100%', { align: AlignmentType.CENTER }),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Thành viên 4 (SE 4)\nMSSV: SE17xxxx', { bold: true }),
                  createCell('Assessment & Algorithm Engineer'),
                  createCell('- Phát triển Question Service và Assessment Service.\n- Hiện thực thuật toán Adaptive Learning (Rule-based & Knowledge Graph).\n- Xây dựng logic tự động kích hoạt bài ôn bổ trợ (Remedial Learning) khi học sinh chưa đạt chuẩn.\n- Thiết kế bộ chỉ số đo lường năng lực Skill Profile.'),
                  createCell('100%', { align: AlignmentType.CENTER }),
                  createCell('100%', { align: AlignmentType.CENTER }),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Thành viên 5 (MKT 1)\nMSSV: MKT17xxxx', { bold: true }),
                  createCell('Market Research & Content Lead'),
                  createCell('- Thực hiện khảo sát thực tế nhu cầu học thích ứng (86 mẫu sinh viên/học sinh).\n- Xây dựng bộ ngân hàng câu hỏi chẩn đoán chuẩn hóa môn Tiếng Anh và Toán.\n- Soạn thảo nội dung bài học thí điểm (Pilot Content) phân cấp theo chuẩn nhận thức.\n- Đo lường và phân tích hành vi người dùng qua Google Analytics.'),
                  createCell('100%', { align: AlignmentType.CENTER }),
                  createCell('100%', { align: AlignmentType.CENTER }),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Thành viên 6 (MKT 2)\nMSSV: MKT17xxxx', { bold: true }),
                  createCell('Brand & Sales Funnel Strategist'),
                  createCell('- Xây dựng bộ nhận diện thương hiệu, Tone & Voice của PathStudy.\n- Thiết kế Sale Kits (Brochure, Product Catalog, Chính sách giá, Landing page copywriting).\n- Lập kế hoạch truyền thông Master Plan 7 tuần (Tuần 4 - Tuần 10).\n- Quản trị kênh truyền thông mạng xã hội, triển khai phễu thu hút người dùng.'),
                  createCell('100%', { align: AlignmentType.CENTER }),
                  createCell('100%', { align: AlignmentType.CENTER }),
                ],
              }),
            ],
          }),

          createHeading2('1.2. Quy trình phối hợp và Quản trị dự án'),
          createBullet('Cơ chế họp giao ban (Daily Standup): ', 'Hàng ngày lúc 21h00 qua kênh Discord.'),
          createParagraph('Nội dung báo cáo 3 câu hỏi chuẩn: (1) Hôm nay đã hoàn thành những task nào? (2) Ngày mai dự kiến làm gì? (3) Đang gặp blocker/vấn đề kỹ thuật hay nghiệp vụ nào cần nhóm hỗ trợ? Thời lượng khống chế tối đa 15 phút.'),
          createBullet('Cơ chế đánh giá tuần (Weekly Sprint Review & Planning): ', 'Chủ nhật hàng tuần lúc 14h00.'),
          createParagraph('Rà soát toàn bộ kết quả của Sprint trước đối chiếu với Definition of Done (DoD), giải quyết dứt điểm các vướng mắc kỹ thuật và chốt mục tiêu chi tiết cho Sprint tiếp theo.'),
          createBullet('Quản lý mã nguồn & Kiểm soát chất lượng (Git Workflow): ', 'Tuân thủ mô hình Git Flow nghiêm ngặt.'),
          createParagraph('Nhánh `main` chỉ chứa code đã kiểm thử và sẵn sàng deploy production; nhánh `develop` dùng cho tích hợp; các tính năng mới được tạo nhánh `feature/*`. Mọi Pull Request (PR) đều bắt buộc có ít nhất 1 thành viên review và kiểm tra build thành công trước khi merge.'),
          createBullet('Công cụ quản trị dự án: ', 'GitHub Projects / Trello để theo dõi trạng thái Backlog - In Progress - Review - Done; Discord thông báo commit tự động; Google Drive lưu trữ tài liệu báo cáo và kết quả nghiên cứu thị trường.'),

          new Paragraph({ spacing: { before: 200, after: 100 }, children: [] }),

          // PHẦN II: SẢN PHẨM THỰC TẾ
          createHeading1('PHẦN II: SẢN PHẨM & TIẾN ĐỘ HOÀN THIỆN (70%)'),
          createParagraph('Sản phẩm PathStudy là nền tảng học tập thích ứng (Adaptive Learning Platform) ứng dụng công nghệ Microservices hiện đại, giải quyết triệt để vấn đề học tập dàn trải, thiếu cá nhân hóa của học sinh và sinh viên hiện nay.'),

          createHeading2('2.1. Giới thiệu giải pháp và Vòng lặp Học tập Thích ứng'),
          createParagraph('Nghiên cứu khảo sát trên 86 đối tượng học sinh THPT và sinh viên năm nhất cho thấy: 79.1% cảm thấy bị "ngợp tài liệu" và mất phương hướng khi tự học; 84.9% mong muốn có một công cụ tự động kiểm tra đầu vào, chỉ ra chính xác lỗ hổng kiến thức thay vì phải xem lại hàng chục giờ video bài giảng lý thuyết lan man.'),
          createParagraph('PathStudy vận hành dựa trên Vòng lặp Học tập Thích ứng khép kín (Adaptive Feedback Loop):'),
          createBullet('Bước 1 - Diagnostic / Placement Test: ', 'Học sinh làm bài đánh giá đầu vào được chuẩn hóa theo ma trận độ khó (Nhận biết - Thông hiểu - Vận dụng).'),
          createBullet('Bước 2 - Phân tích Skill Profile: ', 'Hệ thống tự động chấm điểm và lượng hóa mức độ thành thạo (Mastery Level) của từng kỹ năng kiến thức (từ 0% đến 100%).'),
          createBullet('Bước 3 - Sinh Lộ trình Cá nhân hóa (Adaptive Study Path Generator): ', 'Dựa trên Đồ thị tri thức (Knowledge Graph), hệ thống tự động loại bỏ các phần học sinh đã nắm vững, chỉ sắp xếp các bài học và bài tập tương ứng với phần kiến thức học sinh bị hổng.'),
          createBullet('Bước 4 - Học tập vi mô & Đánh giá phân nhánh (Remedial Learning): ', 'Sau mỗi bài học, học sinh làm Mini Quiz. Nếu đạt chuẩn (>= 70%), node tiếp theo tự động mở khóa. Nếu chưa đạt (< 70%), thuật toán tự động kích hoạt nhánh bổ trợ (Remedial Node) yêu cầu ôn lại trọng tâm lý thuyết và làm bài tập gỡ điểm trước khi tiếp tục.'),
          createBullet('Bước 5 - Cập nhật liên tục & Nâng cao: ', 'Study Path liên tục thích ứng linh hoạt theo thời gian thực dựa trên tiến độ và kết quả làm bài thực tế của từng cá nhân.'),

          createHeading2('2.2. Trạng thái Triển khai Thực tế & Demo MVP 1.0 (Live Product Demo)'),
          createParagraph('Tuân thủ nghiêm ngặt yêu cầu của môn học đối với sản phẩm công nghệ (yêu cầu sản phẩm khả dụng tối thiểu MVP 1.0 đã có domain, hosting và được publish sẵn sàng sử dụng), nhóm dự án đã hoàn thành triển khai thực tế toàn bộ hệ sinh thái PathStudy:'),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createCell('Hạng mục kỹ thuật', { header: true, widthPercent: 30 }),
                  createCell('Thông số triển khai thực tế', { header: true, widthPercent: 70 }),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Tên miền chính thức (Production Domain)', { bold: true }),
                  createCell('https://pathstudy.id.vn và https://www.pathstudy.id.vn\n(Đã trỏ DNS công khai, cấu hình chứng chỉ bảo mật SSL/TLS đầy đủ).'),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Hạ tầng máy chủ & Mạng (Hosting/Tunnel)', { bold: true }),
                  createCell('Hệ thống máy chủ dịch vụ kết nối mạng Internet qua Cloudflare Tunnel bảo mật cao, bảo vệ chống tấn công DDoS, tự động cấp phát SSL certificate.'),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Kiến trúc hệ thống Backend', { bold: true }),
                  createCell('8 Microservices Spring Boot 3.3.4 (Java 21):\n- Eureka Discovery Server (Service Discovery)\n- Spring Cloud API Gateway (Routing tập trung, CORS, Security)\n- Auth Service (JWT, User Management, Pro Subscription)\n- Content Service (Môn học, Cây chủ đề, Bài học, Video)\n- Question Service (Ngân hàng câu hỏi trắc nghiệm phân bậc)\n- Assessment Service (Tổ chức thi chẩn đoán, nộp bài, chấm điểm)\n- Adaptive Learning Service (Thuật toán sinh lộ trình, phân nhánh)\n- Payment Service (Xử lý đơn hàng, sinh mã VietQR tự động)'),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Cơ sở dữ liệu', { bold: true }),
                  createCell('PostgreSQL 18 độc lập với 6 database riêng biệt theo chuẩn thiết kế Database-per-Service: auth_db, content_db, question_db, assessment_db, adaptive_db, progress_db.'),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Công nghệ Frontend', { bold: true }),
                  createCell('React 19, Vite, Tailwind CSS, Lucide Icons, Axios Interceptors, React Router v6. Giao diện thiết kế theo Design System đồng bộ, trực quan hóa cây lộ trình học.'),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Công cụ đo lường hiệu năng (Google Analytics)', { bold: true }),
                  createCell('Đã tích hợp mã theo dõi chính thức Google Analytics 4 (GA4 ID: G-EXE201PATH) trực tiếp vào mã nguồn Frontend (index.html), phục vụ đo lường User Traffic, Bounce Rate, Conversion Rate và Event Tracking.'),
                ],
              }),
            ],
          }),

          createHeading3('Các luồng nghiệp vụ sẵn sàng Demo trực tiếp khi báo cáo Outcome 1:'),
          createBullet('Luồng 1 - Đăng ký, Đăng nhập & Phân quyền: ', 'Hỗ trợ đăng ký tài khoản học sinh, cơ chế JWT Token bảo mật, phân quyền chuẩn xác (Student, Manager, Admin).'),
          createBullet('Luồng 2 - Trải nghiệm Placement Test chẩn đoán năng lực: ', 'Học sinh chọn môn học, làm bài kiểm tra đầu vào 30 câu hỏi chuẩn hóa có bấm giờ. Hệ thống chấm điểm tự động và trực quan hóa điểm mạnh/yếu theo từng Skill.'),
          createBullet('Luồng 3 - Sinh Lộ trình Thích ứng trực quan (Adaptive Study Path): ', 'Hiển thị sơ đồ cây kỹ năng (Node-based Graph) với 3 trạng thái rõ ràng: Đã mở khóa (Unlocked), Đang học (In Progress), và Khóa (Locked).'),
          createBullet('Luồng 4 - Học bài, Làm Quiz & Phân nhánh củng cố (Remedial Branching): ', 'Học sinh học lý thuyết và làm quiz củng cố. Thử nghiệm demo tình huống làm bài sai < 70% để chứng minh hệ thống tự động kích hoạt bài ôn bổ trợ remedial.'),
          createBullet('Luồng 5 - Mua gói Pro & Thanh toán VietQR tức thì: ', 'Học sinh chọn gói Pro 1 tháng (119.000đ) hoặc 6 tháng (519.000đ). Hệ thống sinh mã QR chuyển khoản VietQR kèm nội dung thanh toán tự động, đối soát và kích hoạt Pro.'),
          createBullet('Luồng 6 - Cổng quản lý nội dung chuyên môn (Manager Portal): ', 'Giao diện dành cho giáo viên/chuyên môn thêm môn học, quản lý cây chủ đề, cấu hình câu hỏi và gán mức độ nhận thức.'),

          createHeading3('Phương án dự phòng rủi ro kỹ thuật (Backup Plan):'),
          createParagraph('Theo hướng dẫn của môn học EXE201 ("Mạng FPT hay chặn website → cần có backup plan"), nhóm dự án đã chuẩn bị sẵn sàng 3 phương án dự phòng nhiều lớp để buổi thuyết trình 20-25 phút diễn ra tuyệt đối an toàn:'),
          createBullet('Phương án Backup 1 - Mạng di động & Tên miền phụ: ', 'Sử dụng điểm phát sóng 4G/5G độc lập từ điện thoại cá nhân (không phụ thuộc WiFi trường) để truy cập trực tiếp tên miền chính thức https://pathstudy.id.vn.'),
          createBullet('Phương án Backup 2 - Máy chủ Localhost đóng gói sẵn: ', 'Toàn bộ mã nguồn và dữ liệu kiểm thử (Seed data gồm môn học, ngân hàng 100 câu hỏi, 15 quiz chuẩn) được cấu hình chạy cục bộ hoàn chỉnh trên máy trạm của Leader tại cổng http://localhost:5173 và backend localhost:8088. Nếu mất kết nối Internet, buổi demo chuyển sang môi trường cục bộ chỉ trong 10 giây.'),
          createBullet('Phương án Backup 3 - Video Demo Full HD chất lượng cao: ', 'Nhóm đã quay sẵn video Demo sản phẩm thực tế với thời lượng chuẩn 3 phút, có thuyết minh rõ ràng từng tính năng, lưu trữ sẵn trên USB và Google Drive để phát ngay lập tức khi xảy ra sự cố phần cứng.'),

          createHeading2('2.3. Danh mục Sản phẩm & Bảng giá Dự kiến trong môn EXE201'),
          createParagraph('PathStudy áp dụng mô hình kinh doanh kết hợp Freemium (B2C) và B2B Solution (Gói nhà trường/trung tâm). Danh mục sản phẩm được định giá dựa trên phân tích mức sẵn sàng chi trả (Willingness to Pay) của học sinh/sinh viên trong khảo sát thực tế:'),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createCell('Gói sản phẩm / Dịch vụ', { header: true, widthPercent: 22 }),
                  createCell('Giá bán dự kiến trong EXE201', { header: true, widthPercent: 18 }),
                  createCell('Đối tượng mục tiêu', { header: true, widthPercent: 20 }),
                  createCell('Quyền lợi & Tính năng cốt lõi', { header: true, widthPercent: 40 }),
                ],
              }),
              new TableRow({
                children: [
                  createCell('1. Free Starter\n(Gói Khởi động Miễn phí)', { bold: true }),
                  createCell('0 VNĐ\n(Miễn phí vĩnh viễn)'),
                  createCell('Học sinh, sinh viên mới đăng ký tài khoản'),
                  createCell('- 01 bài Placement Test chẩn đoán năng lực cơ bản.\n- Trải nghiệm 01 chương học thử nghiệm đầu tiên.\n- Xem tổng quan báo cáo năng lực chung.\n- Giới hạn bài tập bổ trợ nâng cao.'),
                ],
              }),
              new TableRow({
                children: [
                  createCell('2. PathStudy Pro 1 Tháng\n(PRO_1_MONTH)', { bold: true }),
                  createCell('119.000 VNĐ\n/ 30 ngày sử dụng'),
                  createCell('Học sinh cần ôn tập cấp tốc, chuẩn bị cho kỳ thi giữa kỳ/cuối kỳ'),
                  createCell('- Không giới hạn số lần làm Placement Test & Retest.\n- Toàn quyền truy cập Study Path thích ứng đầy đủ.\n- Tự động mở khóa các node bài tập bổ trợ (Remedial).\n- Mở toàn bộ ngân hàng câu hỏi phân bậc.\n- Phân tích chi tiết Skill Profile và biểu đồ tiến bộ.'),
                ],
              }),
              new TableRow({
                children: [
                  createCell('3. PathStudy Pro 6 Tháng\n(PRO_6_MONTHS)', { bold: true }),
                  createCell('519.000 VNĐ\n/ 180 ngày (~86.5k/tháng, tiết kiệm 27%)'),
                  createCell('Học sinh học tập dài hạn trọn vẹn cả học kỳ, luyện thi THPTQG'),
                  createCell('- Toàn bộ quyền lợi của gói Pro 1 Tháng.\n- Lưu trữ và phân tích lịch sử học tập trọn học kỳ.\n- Ưu tiên tham gia các kỳ thi thử Mock Exam chuẩn hóa.\n- Báo cáo định kỳ gửi qua email cá nhân/phụ huynh.\n- Tặng kèm tài liệu cẩm nang sơ đồ tư duy độc quyền.'),
                ],
              }),
              new TableRow({
                children: [
                  createCell('4. PathStudy School / B2B\n(Gói Lớp học & Trung tâm)', { bold: true }),
                  createCell('Liên hệ báo giá theo quy mô lớp (Từ 1.500.000đ/lớp)'),
                  createCell('Giáo viên bộ môn, trung tâm gia sư, câu lạc bộ học tập'),
                  createCell('- Cấp tài khoản Pro cho toàn bộ học sinh trong lớp.\n- Cổng Manager Portal dành riêng cho giáo viên: quản lý danh sách học sinh, giao bài chẩn đoán theo lớp.\n- Báo cáo phân tích ma trận lỗ hổng kiến thức toàn lớp giúp giáo viên điều chỉnh giáo án kịp thời.'),
                ],
              }),
            ],
          }),

          createHeading3('Cổng thanh toán tự động VietQR:'),
          createParagraph('Hệ thống đã tích hợp sẵn phương thức thanh toán chuyển khoản quét mã VietQR tự động kết nối qua Ngân hàng TMCP Quân đội (MB Bank):'),
          createBullet('Ngân hàng thụ hưởng: ', 'MB Bank (Ngân hàng TMCP Quân đội).'),
          createBullet('Số tài khoản nhận: ', '0979093490 (Chủ tài khoản: NGUYEN DUC HUY).'),
          createBullet('Cơ chế vận hành: ', 'Học sinh chọn gói trên web -> Hệ thống gọi Payment Service sinh mã đơn hàng độc nhất (Order Code) -> Sinh ảnh mã VietQR chuẩn NAPAS có nhúng sẵn số tiền và nội dung chuyển khoản -> Học sinh quét mã trên app ngân hàng bất kỳ -> Hệ thống đối soát và kích hoạt trạng thái Pro tự động trong vòng 5 phút.'),

          createHeading2('2.4. Kế hoạch Phát triển & Hoàn thiện Sản phẩm trong 7 tuần còn lại'),
          createParagraph('Theo đúng chỉ dẫn của giáo trình môn học EXE201 ("Nên chia thành từng phase - lý tưởng là 3 giai đoạn W3, W6, W8; Version cuối cùng nên được launch vào tuần 6-7"), dự án PathStudy phân rã lộ trình phát triển kỹ thuật thành 3 phiên bản rõ ràng:'),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createCell('Phiên bản & Giai đoạn', { header: true, widthPercent: 20 }),
                  createCell('Thời gian triển khai', { header: true, widthPercent: 18 }),
                  createCell('Mục tiêu trọng tâm', { header: true, widthPercent: 25 }),
                  createCell('Danh sách chức năng bàn giao (Function List)', { header: true, widthPercent: 37 }),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Phase 1:\nVersion 1.0 (MVP Core)', { bold: true }),
                  createCell('Tuần 1 — Tuần 3\n(Hiện tại: Đã hoàn thành 100%)'),
                  createCell('Dựng nền tảng kiến trúc, luồng thích ứng lõi và xuất bản sản phẩm thực tế.'),
                  createCell('1. Hệ thống Auth & Quản lý User (JWT Token).\n2. Kiến trúc Microservices & Eureka & Gateway.\n3. Content Management (Môn học, Topic, Lesson).\n4. Question Bank & Bài kiểm tra Placement Test.\n5. Thuật toán sinh Study Path Rule-based sơ bộ.\n6. Tích hợp thanh toán chuyển khoản VietQR.\n7. Xuất bản website chính thức https://pathstudy.id.vn.'),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Phase 2:\nVersion 2.0 (Deep Adaptivity & Gamification)', { bold: true }),
                  createCell('Tuần 4 — Tuần 6\n(Final Launching vào Tuần 6)'),
                  createCell('Tối ưu hóa độ thông minh thuật toán, gia tăng tương tác và giữ chân người học.'),
                  createCell('1. Nâng cấp thuật toán phân nhánh thích ứng sâu (Multi-level Branching theo từng Skill).\n2. Tính năng AI Explanations giải thích chi tiết câu sai.\n3. Hệ thống Gamification: Chuỗi ngày học liên tục (Streaks), Huy hiệu thành tích, Bảng xếp hạng XP.\n4. Tối ưu trải nghiệm di động (Mobile Responsive & PWA).\n5. Hệ thống gửi thông báo nhắc học qua Email/Zalo ZNS.\n6. Triển khai đợt bán hàng cao điểm Version 2.0.'),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Phase 3:\nVersion 3.0 (Scale & Monetization)', { bold: true }),
                  createCell('Tuần 7 — Tuần 10\n(Ổn định, mở rộng và tổng kết dự án)'),
                  createCell('Mở rộng ngân hàng đề thi thử chuẩn hóa, ổn định hiệu năng và đóng gói toàn diện.'),
                  createCell('1. Phân hệ Mock Exam thi thử bấm giờ mô phỏng đề thi THPT Quốc Gia.\n2. Cổng B2B Teacher Dashboard xuất báo cáo lớp học.\n3. Tối ưu bộ nhớ đệm Redis Caching và bảo mật hệ thống.\n4. Thu thập toàn bộ số liệu đo lường Analytics và phản hồi khách hàng để hoàn thiện báo cáo Outcome 2, Outcome 3.'),
                ],
              }),
            ],
          }),

          createHeading3('Bảng tiến độ chi tiết từng tuần (Detailed Weekly Timeline W3 - W10):'),
          createBullet('Tuần 3 (Hiện tại): ', 'Hoàn thiện báo cáo Outcome 1, diễn tập thuyết trình 20-25 phút, kiểm tra đường truyền domain và kịch bản demo live.'),
          createBullet('Tuần 4: ', 'Bắt đầu Sprint 3 — Nâng cấp thuật toán phân tích Skill Profile chi tiết, bổ sung 50 câu hỏi mới vào ngân hàng câu hỏi.'),
          createBullet('Tuần 5: ', 'Phát triển tính năng Gamification (Study Streaks & Bảng xếp hạng tuần), tích hợp email nhắc học.'),
          createBullet('Tuần 6: ', 'Chính thức ra mắt Version 2.0 (Final Launching theo guideline), phát động chiến dịch bán hàng Pro cao điểm.'),
          createBullet('Tuần 7: ', 'Đánh giá tiến độ Outcome 2, rà soát tỷ lệ chuyển đổi đơn hàng VietQR và tối ưu giao diện theo phản hồi người dùng.'),
          createBullet('Tuần 8: ', 'Hoàn thiện tính năng thi thử Mock Exam có bấm giờ, kiểm thử chịu tải hệ thống (Load testing).'),
          createBullet('Tuần 9: ', 'Triển khai tính năng B2B Teacher Dashboard cho các nhóm học tập và lớp luyện thi.'),
          createBullet('Tuần 10: ', 'Tổng kết toàn bộ chỉ số kinh doanh (Doanh thu, Users, Retention), đóng gói dự án và bảo vệ Outcome 3.'),

          new Paragraph({ spacing: { before: 200, after: 100 }, children: [] }),

          // PHẦN III: CÁCH TIẾP CẬN KHÁCH HÀNG & MỤC TIÊU 6 TUẦN
          createHeading1('PHẦN III: CÁCH TIẾP CẬN KHÁCH HÀNG / USERS VÀ MỤC TIÊU 6 TUẦN (10%)'),
          createParagraph('Để biến sản phẩm công nghệ thành một dự án khởi nghiệp có sức sống thực tế, nhóm đã xây dựng chiến lược tiếp cận người dùng đa kênh kết hợp mục tiêu định lượng (KPIs) rõ ràng cho giai đoạn 6 tuần triển khai tiếp theo.'),

          createHeading2('3.1. Các kênh tiếp cận khách hàng và Tiếp cận Users'),
          createParagraph('Dựa trên đặc điểm hành vi của nhóm khách hàng mục tiêu (học sinh lớp 10-12 và sinh viên đại học), nhóm triển khai 4 kênh tiếp cận chủ lực:'),
          createBullet('1. Kênh Trực tiếp tại Trường học & Câu lạc bộ (Campus Direct Outreach): ', 'Tổ chức các buổi chia sẻ tại các CLB học thuật (CLB Lập trình, CLB Tiếng Anh, CLB Kỹ năng sinh viên ĐH FPT và các trường THPT liên kết). Cho sinh viên quét mã QR làm ngay bài test chẩn đoán 10 phút trên điện thoại để nhận kết quả phân tích năng lực miễn phí.'),
          createBullet('2. Kênh Mạng xã hội & Cộng đồng học tập (Social Communities): ', 'Tham gia và seeding trên các nhóm Facebook quy mô lớn (Cộng đồng ôn thi THPTQG 2k7/2k8/2k9, Nhóm Tự học Lập trình, Góc tự học Đại học FPT...). Chia sẻ tài liệu ôn thi chất lượng kèm lời kêu gọi "Kiểm tra miễn phí bạn đang hổng kiến thức ở chương nào tại PathStudy".'),
          createBullet('3. Kênh Video ngắn (Short-form Content - TikTok / Reels): ', 'Sản xuất các video dạng tình huống thực tế ("Học 3 tiếng mỗi ngày nhưng vẫn điểm thấp vì học sai phương pháp", "Cách phát hiện điểm yếu chỉ với 1 bài test thích ứng"). Gắn link website https://pathstudy.id.vn tại bio để dẫn traffic về web.'),
          createBullet('4. Kênh Tiếp thị giới thiệu (Referral & Word-of-Mouth): ', 'Triển khai cơ chế thưởng: Khi một người học mời được 2 bạn cùng lớp đăng ký làm bài test chẩn đoán, cả 3 sẽ được tặng thêm 7 ngày sử dụng gói Pro hoàn toàn miễn phí.'),

          createHeading2('3.2. Mục tiêu 6 tuần triển khai Dự án (KPIs số lượng Users & Doanh thu)'),
          createParagraph('Theo hướng dẫn của tài liệu môn học đối với dự án công nghệ ("KPI là số lượng users: Website visitor, registered users, paid users, transaction; khuyến khích nên có KPI doanh thu"), nhóm cam kết bảng mục tiêu định lượng cụ thể:'),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createCell('Chỉ số đo lường (KPI)', { header: true, widthPercent: 30 }),
                  createCell('Mục tiêu 6 tuần (Tuần 4 — Tuần 9)', { header: true, widthPercent: 30, align: AlignmentType.CENTER }),
                  createCell('Phương pháp đo lường & Đối soát', { header: true, widthPercent: 40 }),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Lượt truy cập Website\n(Website Visitors / Sessions)', { bold: true }),
                  createCell('2.000 — 3.000\nlượt truy cập', { align: AlignmentType.CENTER, bold: true }),
                  createCell('Đo lường tự động thời gian thực bằng Google Analytics 4 (GA4 ID: G-EXE201PATH).'),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Số tài khoản đăng ký mới\n(Registered Users)', { bold: true }),
                  createCell('350 — 500\ntài khoản', { align: AlignmentType.CENTER, bold: true }),
                  createCell('Thống kê trực tiếp từ bảng cơ sở dữ liệu `users` trong `auth_db` trên hệ thống.'),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Người học tích cực\n(Active Learners / Test Completed)', { bold: true }),
                  createCell('200 — 300\nngười học', { align: AlignmentType.CENTER, bold: true }),
                  createCell('Số lượng tài khoản đã hoàn thành ít nhất 01 bài Placement Test và có Study Path hoạt động.'),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Số người dùng trả phí\n(Paid Users / Pro Subscriptions)', { bold: true }),
                  createCell('25 — 35\nngười dùng Pro', { align: AlignmentType.CENTER, bold: true }),
                  createCell('Số tài khoản kích hoạt thành công gói Pro (1 Tháng hoặc 6 Tháng) trên hệ thống.'),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Số giao dịch thanh toán\n(Total Transactions)', { bold: true }),
                  createCell('25 — 35\ngiao dịch thành công', { align: AlignmentType.CENTER, bold: true }),
                  createCell('Ghi nhận qua lịch sử giao dịch Payment Service và biến động số dư tài khoản MB Bank.'),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Doanh thu dự kiến\n(Expected Revenue)', { bold: true }),
                  createCell('2.500.000 — 3.800.000\nVNĐ', { align: AlignmentType.CENTER, bold: true }),
                  createCell('Tổng tiền thực thu từ các đơn hàng quét mã VietQR trong môn học EXE201.'),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 200, after: 100 }, children: [] }),

          // PHẦN IV: KẾ HOẠCH BÁN HÀNG & THU HÚT NGƯỜI DÙNG
          createHeading1('PHẦN IV: KẾ HOẠCH BÁN HÀNG VÀ THU HÚT NGƯỜI DÙNG (5%)'),
          createParagraph('Kế hoạch bán hàng của PathStudy được xây dựng xoay quanh phễu chuyển đổi (Sales Funnel) khoa học, biến người truy cập tò mò trở thành người dùng trung thành và người dùng trả phí.'),

          createHeading2('4.1. Phễu chuyển đổi người dùng (User Conversion Funnel)'),
          createBullet('Tầng 1 - Nhận biết (Awareness): ', 'Tiếp cận 10.000+ lượt hiển thị thông qua các bài đăng mạng xã hội, video ngắn và hoạt động giới thiệu tại trường học.'),
          createBullet('Tầng 2 - Kích hoạt hành vi (Activation / Free Value): ', 'Người dùng truy cập https://pathstudy.id.vn, thực hiện bài kiểm tra chẩn đoán năng lực 0 đồng và nhìn thấy rõ biểu đồ lỗ hổng kiến thức của chính mình.'),
          createBullet('Tầng 3 - Cân nhắc (Consideration): ', 'Sau khi nhận kết quả, hệ thống cho học thử nghiệm 01 chương bài học bổ trợ miễn phí để người học cảm nhận rõ sự tiến bộ vượt bậc so với phương pháp học truyền thống.'),
          createBullet('Tầng 4 - Chuyển đổi mua hàng (Conversion): ', 'Khi người học muốn mở toàn bộ lộ trình bài tập phân nhánh và ngân hàng đề thi chuẩn, website hiển thị bảng ưu đãi gói Pro kèm nút bấm thanh toán quét mã VietQR tiện lợi.'),
          createBullet('Tầng 5 - Giữ chân & Giới thiệu (Retention & Referral): ', 'Tính năng chuỗi ngày học liên tục (Streaks) thúc đẩy học sinh quay lại hàng ngày; chính sách tặng ngày Pro khi rủ bạn bè giúp gia tăng người dùng tự nhiên.'),

          createHeading2('4.2. Bộ tài liệu bán hàng (Sales Kit) & Chính sách Bán hàng'),
          createParagraph('Để phục vụ hoạt động bán hàng B2C và tiếp cận các nhóm đối tác B2B (giáo viên, trung tâm học tập), nhóm chuẩn bị trọn bộ tài liệu Sales Kit chuyên nghiệp:'),
          createBullet('1. Product Brochure / Company Profile: ', 'Tài liệu PDF 4 trang tóm tắt bài toán, công nghệ thích ứng độc quyền, bảng so sánh hiệu quả học tập và danh mục gói cước.'),
          createBullet('2. Bảng giá & Ma trận tính năng minh bạch: ', 'Hiển thị công khai trên giao diện web tại trang `/subscription` giúp khách hàng dễ dàng đối chiếu quyền lợi giữa gói Free và Pro.'),
          createBullet('3. Chính sách ưu đãi Early Bird (Dành cho 50 học sinh đầu tiên): ', 'Giảm trực tiếp 20% giá gói Pro 1 Tháng (từ 119.000đ xuống còn 95.000đ) khi đăng ký trong tuần phát động.'),
          createBullet('4. Chính sách Cộng tác viên / Đại sứ học tập (Campus Ambassadors): ', 'Chiết khấu hoa hồng 25% cho mỗi đơn hàng Pro được giới thiệu thành công từ các bạn cán sự lớp và admin các hội nhóm học tập.'),

          createHeading2('4.3. Landing Page giới thiệu sản phẩm & Tối ưu hóa Chuyển đổi'),
          createParagraph('Giao diện trang chủ tại https://pathstudy.id.vn đóng vai trò là Landing Page bán hàng trung tâm, được thiết kế theo cấu trúc tối ưu tỷ lệ chuyển đổi:'),
          createBullet('Hero Section: ', 'Thông điệp mạnh mẽ "Học Đúng Chỗ Hổng — Bứt Phá Điểm Số", đi kèm nút Call-to-Action (CTA) "Làm bài kiểm tra chẩn đoán miễn phí" nổi bật.'),
          createBullet('Phần Trình diễn Tính năng (Feature Showcase): ', 'Minh họa trực quan cơ chế sinh lộ trình tự động, đồ thị cây kỹ năng và cơ chế bài học bổ trợ củng cố điểm yếu.'),
          createBullet('Bảng giá & Đánh giá của người dùng thử nghiệm (Testimonials): ', 'Trích dẫn phản hồi thực tế từ các bạn sinh viên đã trải nghiệm phiên bản thử nghiệm.'),

          new Paragraph({ spacing: { before: 200, after: 100 }, children: [] }),

          // PHẦN V: KẾ HOẠCH TRUYỀN THÔNG TRONG 7 TUẦN
          createHeading1('PHẦN V: KẾ HOẠCH TRUYỀN THÔNG 7 TUẦN TRIỂN KHAI DỰ ÁN (5%)'),
          createParagraph('Kế hoạch truyền thông (Communication Master Plan) được thiết kế đồng bộ từ Tuần 4 đến Tuần 10 nhằm duy trì mức độ nhận diện thương hiệu liên tục và thúc đẩy người dùng đạt các cột mốc KPI đề ra.'),

          createHeading2('5.1. Định vị Truyền thông & Thông điệp Cốt lõi (Key Message)'),
          createParagraph('Thông điệp xuyên suốt chiến dịch truyền thông của dự án:'),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 120, after: 160 },
            children: [
              new TextRun({
                text: '“HỌC ĐÚNG ĐIỂM THIẾU — TIẾT KIỆM NỬA THỜI GIAN”',
                bold: true,
                size: 26,
                color: COLOR_PRIMARY,
                font: FONT_FAMILY,
              }),
            ],
          }),
          createParagraph('Tone & Voice truyền thông: Trí tuệ, hiện đại, thấu hiểu, đồng hành và gần gũi với phong cách của thế hệ học sinh Gen Z.'),

          createHeading2('5.2. Kế hoạch Master Plan Truyền thông Chi tiết theo Tuần (W4 — W10)'),
          createParagraph('Lộ trình phân bổ hoạt động truyền thông và nội dung cụ thể trong 7 tuần:'),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createCell('Tuần triển khai', { header: true, widthPercent: 15 }),
                  createCell('Chủ đề chiến dịch (Campaign Theme)', { header: true, widthPercent: 25 }),
                  createCell('Nội dung hoạt động truyền thông chủ lực', { header: true, widthPercent: 40 }),
                  createCell('Chỉ số mục tiêu (Target KPI)', { header: true, widthPercent: 20, align: AlignmentType.CENTER }),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Tuần 4', { bold: true }),
                  createCell('Khởi động: "Bắt đúng bệnh — Chữa đúng chỗ"', { bold: true }),
                  createCell('- Đăng tải chuỗi infographic phân tích vì sao học chăm nhưng điểm vẫn kém.\n- Phát động mini-campaign "Thử tài chẩn đoán lỗ hổng kiến thức trong 15 phút".\n- Đặt banner và bài viết giới thiệu link web trên các group sinh viên.'),
                  createCell('400 Visitors\n80 Users mới', { align: AlignmentType.CENTER }),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Tuần 5', { bold: true }),
                  createCell('Thử thách: "7 Ngày lấp lỗ hổng kiến thức"', { bold: true }),
                  createCell('- Tổ chức minigame làm bài test chẩn đoán nhận quà tài liệu.\n- Đăng video TikTok trải nghiệm giao diện làm bài trực tiếp trên https://pathstudy.id.vn.\n- Giới thiệu chính sách ưu đãi Early Bird giảm 20% gói Pro.'),
                  createCell('500 Visitors\n90 Users mới\n5 Đơn Pro', { align: AlignmentType.CENTER }),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Tuần 6', { bold: true }),
                  createCell('Bùng nổ: "Ra mắt Version 2.0 & Gamification"', { bold: true }),
                  createCell('- Họp báo số / Livestream ra mắt phiên bản v2.0 (Tính năng Streaks & Bảng xếp hạng thi đua).\n- Đẩy mạnh chương trình Campus Ambassador chia sẻ mã giới thiệu.\n- Đăng các câu chuyện thực tế (Case study) học sinh tiến bộ điểm số.'),
                  createCell('600 Visitors\n100 Users mới\n10 Đơn Pro', { align: AlignmentType.CENTER }),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Tuần 7', { bold: true }),
                  createCell('Củng cố: "Giữ vững chuỗi ngày học (Study Streaks)"', { bold: true }),
                  createCell('- Vinh danh Top 10 học sinh có chuỗi ngày học dài nhất tuần trên fanpage.\n- Email marketing nhắc nhở các bạn chưa hoàn thành lộ trình quay lại học bài.\n- Rà soát số liệu phục vụ báo cáo đánh giá Outcome 2.'),
                  createCell('400 Visitors\n60 Users mới\n6 Đơn Pro', { align: AlignmentType.CENTER }),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Tuần 8', { bold: true }),
                  createCell('Luyện thi: "Mock Exam thử sức — Tự tin bứt phá"', { bold: true }),
                  createCell('- Ra mắt bộ đề thi thử chuẩn hóa có bấm giờ.\n- Workshop trực tuyến hướng dẫn phương pháp tự học theo cây kỹ năng.\n- Khuyến khích học sinh gia hạn gói Pro để mở trọn bộ đề thi thử.'),
                  createCell('450 Visitors\n70 Users mới\n7 Đơn Pro', { align: AlignmentType.CENTER }),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Tuần 9', { bold: true }),
                  createCell('Tăng tốc: "Rủ bạn cùng tiến — Nhận quà Pro"', { bold: true }),
                  createCell('- Đẩy mạnh chiến dịch Referral: Mua gói Pro theo nhóm 3 người được giảm 30%.\n- Hợp tác với các nhóm gia sư để triển khai thử nghiệm gói B2B School Solution.'),
                  createCell('350 Visitors\n50 Users mới\n5 Đơn Pro', { align: AlignmentType.CENTER }),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Tuần 10', { bold: true }),
                  createCell('Tổng kết: "Hành trình Tri thức cùng PathStudy"', { bold: true }),
                  createCell('- Công bố báo cáo tổng kết tác động học tập của dự án.\n- Trao chứng nhận vinh danh cho các học sinh xuất sắc.\n- Tổng hợp số liệu Analytics, tài chính chuẩn bị bảo vệ chung kết Outcome 3.'),
                  createCell('300 Visitors\n40 Users mới\nBảo vệ đồ án', { align: AlignmentType.CENTER }),
                ],
              }),
            ],
          }),

          createHeading2('5.3. Kế hoạch Dự phòng Rủi ro Truyền thông'),
          createBullet('Rủi ro tương tác ban đầu thấp: ', 'Kích hoạt ngay mạng lưới bạn bè, các nhóm học tập thân thiết làm lực lượng hạt nhân ban đầu (seed users) để tạo hiệu ứng đám đông.'),
          createBullet('Rủi ro nội dung quảng cáo bị loãng: ', 'Tập trung sâu vào giá trị thật: cung cấp bài kiểm tra chẩn đoán miễn phí và tài liệu học tập có giá trị thay vì chỉ nói lý thuyết suông.'),

          new Paragraph({ spacing: { before: 200, after: 100 }, children: [] }),

          // PHẦN VI: KẾT LUẬN & ĐỀ XUẤT
          createHeading1('PHẦN VI: KẾT LUẬN VÀ CAM KẾT HÀNH ĐỘNG'),
          createParagraph('Sau 3 tuần khởi động nghiêm túc và nỗ lực tối đa, nhóm dự án PathStudy đã hoàn thành toàn diện 100% các tiêu chí và khối lượng công việc đặt ra cho mốc đánh giá Outcome 1:'),
          createBullet('Về nhân sự: ', 'Đội ngũ 6 thành viên được phân công vai trò rõ ràng, phối hợp ăn ý qua quy trình Agile/Scrum chặt chẽ và đạt tỷ lệ đóng góp cam kết 100%.'),
          createBullet('Về sản phẩm: ', 'Hệ thống đã có sản phẩm khả dụng tối thiểu MVP 1.0 chạy thực tế trên tên miền chính thức https://pathstudy.id.vn với kiến trúc Microservices vững chắc, cơ sở dữ liệu PostgreSQL độc lập, tích hợp đo lường Google Analytics 4, cổng thanh toán VietQR tự động và phương án dự phòng 3 lớp an toàn.'),
          createBullet('Về kế hoạch phát triển: ', 'Lộ trình 7 tuần tiếp theo được phân kỳ khoa học thành 3 phiên bản rõ ràng (W3, W6, W8), đảm bảo ra mắt Version 2.0 đúng tuần 6.'),
          createBullet('Về kinh doanh & truyền thông: ', 'Định vị sản phẩm minh bạch, phễu chuyển đổi rõ ràng, Master Plan truyền thông 7 tuần chi tiết với các mục tiêu định lượng đầy tham vọng nhưng hoàn toàn khả thi.'),
          createParagraph('Tập thể nhóm dự án PathStudy kính trình Hội đồng Giảng viên môn học EXE201 xem xét, đánh giá và đóng góp ý kiến để nhóm tiếp tục hoàn thiện sản phẩm xuất sắc trong các chặng đường tiếp theo!'),

          new Paragraph({ spacing: { before: 240, after: 80 }, children: [] }),

          // BẢNG CHỮ KÝ XÁC NHẬN CỦA NHÓM DỰ ÁN
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createCell('ĐẠI DIỆN KHỐI MARKETING\n(Ký và ghi rõ họ tên)\n\n\n\nThành viên 6', { align: AlignmentType.CENTER, bold: true, widthPercent: 50 }),
                  createCell('TRƯỞNG NHÓM DỰ ÁN (LEADER)\n(Ký và ghi rõ họ tên)\n\n\n\nMai Tiến Dũng', { align: AlignmentType.CENTER, bold: true, widthPercent: 50 }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  return doc;
}

async function main() {
  console.log('Generating official Outcome 1 DOCX report for PathStudy...');
  const doc = buildDocument();
  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(__dirname, 'docs', 'EXE201_Outcome_1_Report_PathStudy.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log('Successfully generated report at:', outputPath);
  console.log('File size:', buffer.length, 'bytes');
}

main().catch((err) => {
  console.error('Error generating document:', err);
  process.exit(1);
});

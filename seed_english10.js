const BASE_CONTENT = 'http://localhost:8082/api/v1/content';
const BASE_QUESTION = 'http://localhost:8083/api/v1/questions';
const SUBJECT_ID = '11111111-1111-1111-1111-111111111101';
const BANK_ID = '33333333-3333-3333-3333-333333333301';
const headers = { 'Content-Type': 'application/json' };

async function postContent(url, data) {
  try {
    const res = await fetch(BASE_CONTENT + url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) {
      console.error('  [ERROR CONTENT] POST ' + url + ':', json);
      return {};
    }
    return json.data || {};
  } catch (err) {
    console.error('  [FETCH ERROR] ' + url + ':', err.message);
    return {};
  }
}

async function postQuestion(data) {
  try {
    const res = await fetch(BASE_QUESTION, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) {
      console.error('  [ERROR QUESTION] POST /questions:', json);
      return {};
    }
    return json.data || {};
  } catch (err) {
    console.error('  [FETCH ERROR] Question:', err.message);
    return {};
  }
}

async function addQuiz(lessonId, title, desc, questions) {
  await postContent('/lessons/' + lessonId + '/mini-quizzes', {
    title: title,
    description: desc,
    questionsJson: JSON.stringify(questions)
  });
}

async function addExample(lessonId, title, content, translation, explanation, order = 1) {
  await postContent('/lessons/' + lessonId + '/examples', {
    title: title,
    content: content,
    translation: translation,
    explanation: explanation,
    displayOrder: order
  });
}

async function seedAll() {
  console.log('======================================================================');
  console.log('  SEED DU LIEU TIENG ANH 10: ENGLISH CONTENT + TIENG VIET HUONG DAN');
  console.log('  KEM THEO: MINI-QUIZ TUNG BAI & NGAN HANG CAU HOI (QUESTION BANK)');
  console.log('======================================================================\n');

  // Lấy danh sách skills hiện có của môn
  const rSkill = await fetch(BASE_CONTENT + '/subjects/' + SUBJECT_ID + '/skills');
  const dSkill = await rSkill.json();
  const skills = dSkill.data || [];
  const defaultSkillId = skills.length > 0 ? skills[0].id : '22222222-2222-2222-2222-222222222201';

  let bankQuestionOrder = 1;

  async function createBankQuestion({ topicId, moduleId, lessonId, skillId, content, difficulty, explanation, options }) {
    await postQuestion({
      questionBankId: BANK_ID,
      skillId: skillId || defaultSkillId,
      moduleId: moduleId,
      topicId: topicId,
      lessonId: lessonId,
      content: content,
      difficulty: difficulty,
      explanation: explanation,
      displayOrder: bankQuestionOrder++,
      options: options.map((opt, idx) => ({
        optionContent: opt.text,
        isCorrect: !!opt.isCorrect,
        displayOrder: idx + 1
      }))
    });
  }

  // ==================================================================
  // MODULE 1: APPLIED GRAMMAR IN CONTEXT (Ngữ pháp Ứng dụng theo Ngữ cảnh)
  // ==================================================================
  console.log('>>> [1/3] Khoi tao Module: Applied Grammar in Context...');
  const mod1 = await postContent('/modules', {
    subjectId: SUBJECT_ID,
    code: 'GRAMMAR_APPLICATION_2025',
    name: 'Applied Grammar in Context (Ngữ pháp Ứng dụng theo Ngữ cảnh)',
    description: 'Master core grammatical structures for formal texts, daily communication, and academic writing under the new curriculum standard.',
    displayOrder: 1
  });

  // --- Topic 1.1: Tense Systems in Real Communication ---
  const t1_1 = await postContent('/topics', {
    moduleId: mod1.id,
    code: 'TENSES_IN_CONTEXT',
    name: 'Tense Systems in Communication & Texts (Hệ thống Thì trong Giao tiếp & Văn bản)',
    description: 'Comprehensive usage of Present, Past, and Future tenses in describing daily habits, ongoing shifts, planned initiatives, and narrative reporting.',
    displayOrder: 1
  });

  // Lesson 1.1.1
  let les1_1_1 = await postContent('/lessons', {
    topicId: t1_1.id,
    title: 'Present Simple and Present Continuous in Describing Habits and Trends',
    theorySummary: 'Học cách phân biệt Hiện tại đơn (thói quen, quy luật) và Hiện tại tiếp diễn (xu hướng biến đổi, kế hoạch đã chốt) trong các đoạn văn giới thiệu và bài báo xã hội.',
    content: `# Present Simple and Present Continuous in Context

## 1. Grammatical Framework & Practical Usage
*(Lý thuyết ngữ pháp & Cách sử dụng thực tế)*

### A. The Present Simple (Hiện tại đơn)
- **Habits and Regular Routines:**
  *In many Vietnamese households, family members **share** the daily chores equally.*
- **Permanent Situations & General Truths:**
  *Renewable energy sources **produce** far fewer greenhouse emissions than fossil fuels.*
- **Timetables & Scheduled Events:**
  *The community clean-up drive **starts** at 8:00 AM next Saturday.*

### B. The Present Continuous (Hiện tại tiếp diễn)
- **Actions Happening Right Now:**
  *The volunteers **are planting** indigenous trees along the riverbank at the moment.*
- **Contemporary Trends & Ongoing Changes:**
  *More and more consumers **are switching** to biodegradable packaging.*
- **Criticism of Annoying Habits (with 'always'):**
  *He **is always forgetting** to turn off the air conditioner when leaving the room.*

---

## 2. Stative Verbs - Key Distinction
*(Các động từ trạng thái - Lưu ý không chia tiếp diễn)*
- **Mental states:** *know, understand, recognize, believe, remember*
- **Emotions:** *prefer, love, appreciate, desire*
- **Possession & Relationship:** *belong to, possess, contain, consist of*
- *Example:* *I **understand** the environmental impact, and I **support** the new policy.* (NOT: *I am understanding...*)`,
    isRemedial: false,
    displayOrder: 1
  });

  await addExample(les1_1_1.id, 'Routine vs. Emerging Trend', 
    'My brother routinely **cycles** to school, but this week he **is taking** the electric bus because of the heavy rain.',
    'Anh trai tôi thường ngày đạp xe đi học, nhưng tuần này anh ấy đang đi xe buýt điện do mưa lớn.',
    'cycles thể hiện thói quen cố định (Present Simple); is taking thể hiện hành động tạm thời trong tuần này (Present Continuous).', 1);

  await addQuiz(les1_1_1.id, 'Mini-Quiz: Present Tenses in Context', 'Kiểm tra nhanh khả năng vận dụng thì Hiện tại đơn và Hiện tại tiếp diễn', [
    {
      question: 'According to recent reports, our local government ___ a new eco-friendly public transport project this month.',
      options: { A: 'is launching', B: 'launches', C: 'launched', D: 'has launch' },
      correctAnswer: 'A',
      explanation: 'Diễn tả kế hoạch hoặc xu hướng mới đang diễn ra trong tháng này ("this month") -> dùng Present Continuous: is launching.'
    },
    {
      question: 'She usually ___ all the lights before going to bed to conserve electrical energy.',
      options: { A: 'is turning off', B: 'turns off', C: 'turned off', D: 'turn off' },
      correctAnswer: 'B',
      explanation: 'Thói quen lặp đi lặp lại có trạng từ "usually", chủ ngữ số ít "She" -> Present Simple: turns off.'
    },
    {
      question: 'I ___ why many teenagers prefer digital textbooks over paper ones.',
      options: { A: 'am understanding', B: 'understand', C: 'was understood', D: 'have understood' },
      correctAnswer: 'B',
      explanation: 'understand là động từ chỉ nhận thức (stative verb), không dùng ở thì tiếp diễn -> understand.'
    }
  ]);

  // Questions in Bank for Lesson 1.1.1
  await createBankQuestion({
    topicId: t1_1.id, moduleId: mod1.id, lessonId: les1_1_1.id, skillId: skills[0]?.id,
    content: 'Environmental organizations observe that public interest in recycling ________ rapidly over the past few seasons.',
    difficulty: 'MEDIUM',
    explanation: 'Expressing a trend developing and persisting in modern times. Present Continuous / Present Perfect context: is growing shows the ongoing trend.',
    options: [
      { text: 'is growing', isCorrect: true },
      { text: 'grow', isCorrect: false },
      { text: 'grew', isCorrect: false },
      { text: 'has been grow', isCorrect: false }
    ]
  });

  await createBankQuestion({
    topicId: t1_1.id, moduleId: mod1.id, lessonId: les1_1_1.id, skillId: skills[0]?.id,
    content: 'Every morning, the homeroom teacher ________ attendance before the first lesson begins.',
    difficulty: 'EASY',
    explanation: 'Routine habit marked by "Every morning" with singular subject -> takes.',
    options: [
      { text: 'takes', isCorrect: true },
      { text: 'is taking', isCorrect: false },
      { text: 'took', isCorrect: false },
      { text: 'has taken', isCorrect: false }
    ]
  });

  // Lesson 1.1.2: Future forms
  let les1_1_2 = await postContent('/lessons', {
    topicId: t1_1.id,
    title: 'Future Intentions with Will and Be Going To in Announcements and Project Plans',
    theorySummary: 'Phân biệt ý định có sẵn/chứng cứ rõ ràng (be going to) và quyết định tức thời/lời hứa/dự đoán chủ quan (will) trong các tờ rơi thông báo và dự án.',
    content: `# Future Expressions: Will vs. Be Going To

## 1. Principles of Application
*(Nguyên tắc vận dụng trong văn bản thông báo & thư từ)*

### A. Be going to: Prior Intentions & Visual Evidence
- **Pre-arranged Plans & Firm Decisions:**
  *Our class **is going to organize** an environmental workshop next month.*
- **Predictions Based on Present Physical Evidence:**
  *Look at those dark storm clouds! It **is going to rain** heavily.*

### B. Will: Spontaneous Decisions, Promises & Beliefs
- **Decisions Made at the Moment of Speaking:**
  *I haven't got enough cash. Don't worry, I **will lend** you some.*
- **Official Promises & Guarantees:**
  *The school board promises that it **will install** smart boards in every classroom.*
- **Subjective Opinions (with think, hope, believe):**
  *We believe renewable energy **will become** the primary power source by 2035.*`,
    isRemedial: false,
    displayOrder: 2
  });

  await addExample(les1_1_2.id, 'Announcement Context',
    'We **are going to build** a new community garden because the youth union has already approved the funding.',
    'Chúng tôi dự định sẽ xây một khu vườn cộng đồng mới vì đoàn thanh niên đã phê duyệt kinh phí.',
    'Sử dụng be going to vì kế hoạch đã có sự chuẩn bị và bằng chứng phê duyệt từ trước.', 1);

  await addQuiz(les1_1_2.id, 'Mini-Quiz: Future Forms', 'Luyện tập phân biệt Will và Be going to trong thông báo', [
    {
      question: 'Have you made reservations for the field trip? - Yes, we ___ stay at an eco-lodge near Cuc Phuong National Park.',
      options: { A: 'will', B: 'are going to', C: 'might to', D: 'are staying to' },
      correctAnswer: 'B',
      explanation: 'Kế hoạch đã được thảo luận và đặt trước ("made reservations") -> dùng are going to.'
    },
    {
      question: 'I think sustainable technologies ___ create millions of green jobs in the future.',
      options: { A: 'will', B: 'are going to', C: 'were', D: 'have been' },
      correctAnswer: 'A',
      explanation: 'Dự đoán mang tính quan điểm chủ quan đi kèm "I think" -> dùng will.'
    }
  ]);

  await createBankQuestion({
    topicId: t1_1.id, moduleId: mod1.id, lessonId: les1_1_2.id, skillId: skills[1]?.id,
    content: 'Announcement: "The charity concert ________ place at the Youth Cultural Center at 7:30 PM this Sunday."',
    difficulty: 'MEDIUM',
    explanation: 'Scheduled official public event or confirmed plan -> is going to take / takes place. In future intention options: is going to take.',
    options: [
      { text: 'is going to take', isCorrect: true },
      { text: 'will be taken', isCorrect: false },
      { text: 'takes place will', isCorrect: false },
      { text: 'went', isCorrect: false }
    ]
  });

  // --- Topic 1.2: Passive Voice & Modals ---
  const t1_2 = await postContent('/topics', {
    moduleId: mod1.id,
    code: 'PASSIVE_AND_MODALS',
    name: 'Passive Voice and Modal Auxiliaries in Regulations (Câu Bị động & Động từ Khuyết thiếu)',
    description: 'Constructing formal regulations, codes of conduct, gender equality policies, and environmental guidelines.',
    displayOrder: 2
  });

  let les1_2_1 = await postContent('/lessons', {
    topicId: t1_2.id,
    title: 'Passive Voice with Modal Verbs in Codes of Conduct and Public Notices',
    theorySummary: 'Cấu trúc Modal + be + V3/ed trong việc ban hành quy chế, nội quy trường học và tuyên truyền bình đẳng giới.',
    content: `# Modal Passives in Formal Directives & Guidelines

## 1. Structural Formula
*(Công thức cấu trúc)*
**Subject + Modal Verb (must / should / can / ought to / may) + be + Past Participle (V3/ed)**

## 2. Real-World Applications
*(Ứng dụng thực tiễn trong văn bản)*

### A. Gender Equality & Workplace Standards:
- *Equal educational and career opportunities **must be granted** to both genders.*
- *Pay disparity between male and female employees **should be eliminated** immediately.*

### B. Environmental Codes of Practice:
- *Single-use plastic cups **must not be brought** into the school library.*
- *Household organic waste **can be converted** into natural fertilizer for plants.*`,
    isRemedial: false,
    displayOrder: 1
  });

  await addExample(les1_2_1.id, 'School Regulation Notice',
    'All laboratory equipment **must be cleaned** and returned to the designated shelf after each experiment.',
    'Tất cả thiết bị phòng thí nghiệm phải được vệ sinh sạch sẽ và trả về đúng kệ quy định sau mỗi buổi thực hành.',
    'Thể bị động với động từ khuyết thiếu thể hiện nội quy bắt buộc (must be cleaned).', 1);

  await addQuiz(les1_2_1.id, 'Mini-Quiz: Modal Passives', 'Kiểm tra dạng bị động với Modal Verbs', [
    {
      question: 'Library Notice: "Mobile phones must ___ on silent mode at all times inside the reading room."',
      options: { A: 'kept', B: 'be kept', C: 'be keeping', D: 'keep' },
      correctAnswer: 'B',
      explanation: 'Quy định bị động: must + be + V3 (kept) -> must be kept.'
    },
    {
      question: 'Gender equality awareness campaigns ought to ___ regularly across high schools.',
      options: { A: 'be organized', B: 'organize', C: 'organizing', D: 'have organized' },
      correctAnswer: 'A',
      explanation: 'ought to + be + V3 -> ought to be organized.'
    }
  ]);

  await createBankQuestion({
    topicId: t1_2.id, moduleId: mod1.id, lessonId: les1_2_1.id, skillId: skills[1]?.id,
    content: 'School Directive: "Personal electronic devices may ________ during classroom hours only under the direct supervision of the subject teacher."',
    difficulty: 'HARD',
    explanation: 'Passive voice with modal verb "may": may + be + past participle (used).',
    options: [
      { text: 'be used', isCorrect: true },
      { text: 'use', isCorrect: false },
      { text: 'been used', isCorrect: false },
      { text: 'have using', isCorrect: false }
    ]
  });

  // --- Topic 1.3: Complex Structures & Clauses ---
  const t1_3 = await postContent('/topics', {
    moduleId: mod1.id,
    code: 'RELATIVE_CLAUSES_IN_TEXT',
    name: 'Relative Clauses & Conditional Sentences (Mệnh đề Quan hệ & Câu Điều kiện)',
    description: 'Advanced linking devices for describing technological tools, expressing environmental conditions, and academic argumentation.',
    displayOrder: 3
  });

  let les1_3_1 = await postContent('/lessons', {
    topicId: t1_3.id,
    title: 'Defining and Non-defining Relative Clauses in Academic Exposition',
    theorySummary: 'Sử dụng who, which, that, whose để kết nối thông tin khoa học, công nghệ số và giáo dục một cách súc tích, mạch lạc.',
    content: `# Relative Clauses in Scientific & Educational Texts

## 1. Defining vs. Non-Defining Clauses
*(Mệnh đề xác định và Không xác định)*

### A. Defining Relative Clauses:
- Essential information needed to identify the noun; **no commas**; **that** can replace *who* or *which*.
- *Example:* *The mobile applications **which/that** support blended learning are gaining tremendous popularity among high school students.*

### B. Non-Defining Relative Clauses:
- Extra background information about a unique person or entity; **separated by commas**; **THAT CANNOT BE USED**.
- *Example:* *UNESCO, **which** was founded in 1945, promotes global collaboration in education, science, and culture.* (NEVER write: *UNESCO, that was...*)

## 2. Special Relatives
- **whose + Noun:** Indicates ownership (*Students **whose** projects win first prize will represent our school.*)
- **where / when:** Relatives of place and time (*The virtual lab **where** students conduct simulations...*)`,
    isRemedial: false,
    displayOrder: 1
  });

  await addExample(les1_3_1.id, 'Defining vs Non-defining',
    'Dr. Green, **who delivered** a keynote speech on global warming yesterday, will lead our environmental workshop.',
    'Tiến sĩ Green, người đã phát biểu đề dẫn về sự nóng lên toàn cầu ngày hôm qua, sẽ dẫn dắt hội thảo môi trường của chúng ta.',
    'who delivered... là non-defining clause bổ nghĩa cho tên riêng, đứng giữa hai dấu phẩy.', 1);

  await addQuiz(les1_3_1.id, 'Mini-Quiz: Relative Clauses', 'Nhận diện mệnh đề quan hệ chuẩn học thuật', [
    {
      question: 'Artificial Intelligence, ___ has transformed numerous industries, is now reshaping education.',
      options: { A: 'which', B: 'that', C: 'whose', D: 'who' },
      correctAnswer: 'A',
      explanation: 'Mệnh đề có dấu phẩy bổ nghĩa cho sự vật ("Artificial Intelligence") -> dùng which, không được dùng that.'
    },
    {
      question: 'Candidates ___ applications are submitted before midnight will receive an automated confirmation email.',
      options: { A: 'whom', B: 'whose', C: 'which', D: 'who' },
      correctAnswer: 'B',
      explanation: 'whose + danh từ (applications) chỉ quan hệ sở hữu của ứng viên.'
    }
  ]);

  await createBankQuestion({
    topicId: t1_3.id, moduleId: mod1.id, lessonId: les1_3_1.id, skillId: skills[2]?.id,
    content: 'The solar panels ________ were mounted on the gymnasium roof supply over 40% of the school\'s daily electricity.',
    difficulty: 'MEDIUM',
    explanation: 'Defining relative clause referring to things (solar panels) without commas -> that / which.',
    options: [
      { text: 'which', isCorrect: true },
      { text: 'whom', isCorrect: false },
      { text: 'whose', isCorrect: false },
      { text: 'where', isCorrect: false }
    ]
  });

  // ==================================================================
  // MODULE 2: THEMATIC VOCABULARY & PROJECTS (Từ vựng Chủ đề & Đời sống)
  // ==================================================================
  console.log('>>> [2/3] Khoi tao Module: Thematic Vocabulary & Projects...');
  const mod2 = await postContent('/modules', {
    subjectId: SUBJECT_ID,
    code: 'VOCAB_THEMATIC_PROJECTS',
    name: 'Thematic Vocabulary & Real-World Projects (Từ vựng Chủ đề & Đời sống Thực tiễn)',
    description: 'High-frequency academic collocations, thematic terminology, and communicative phrasing across the 10 units of the Grade 10 curriculum.',
    displayOrder: 2
  });

  // --- Topic 2.1: Family Dynamics & Green Sustainability ---
  const t2_1 = await postContent('/topics', {
    moduleId: mod2.id,
    code: 'THEME_FAMILY_GREEN_LIVING',
    name: 'Family Dynamics and Green Living (Gia đình & Lối sống Xanh)',
    description: 'Domestic cooperation, carbon footprint reduction, eco-friendly consumer habits, and circular sustainability.',
    displayOrder: 1
  });

  let les2_1_1 = await postContent('/lessons', {
    topicId: t2_1.id,
    title: 'Essential Collocations for Domestic Life and Eco-friendly Practices',
    theorySummary: 'Hệ thống các cụm từ kết hợp (Collocations) chuẩn xác về lối sống gia đình và bảo vệ môi trường xuất hiện trong các bài đọc hiểu và tờ rơi.',
    content: `# Collocations: Domestic Cooperation & Sustainable Living

## 1. Household Cooperation & Family Roles
*(Trách nhiệm gia đình & Phân công công việc)*
- **breadwinner** (noun): The family member who earns the primary income to support the household.
- **homemaker** (noun): A person who manages domestic duties, cooking, and child-rearing.
- **share the household chores**: Divide domestic cleaning, laundry, and cooking responsibilities equally.
- **do the heavy lifting**: Handle physically demanding household tasks or major burdens.
- **set a positive example**: Demonstrate constructive behavior for children to emulate.

## 2. Green Living & Environmental Stewardship
*(Lối sống xanh & Ý thức bảo vệ sinh thái)*
- **reduce one's carbon footprint**: Minimize total greenhouse gas emissions generated by individual actions.
- **adopt an eco-friendly lifestyle**: Embrace consumption patterns that do not harm natural resources.
- **energy-efficient appliances**: Electrical devices designed to consume minimal power.
- **biodegradable packaging**: Wrapping materials capable of decaying naturally without chemical pollution.
- **promote waste segregation**: Encourage sorting recyclable, organic, and hazardous refuse at the source.`,
    isRemedial: false,
    displayOrder: 1
  });

  await addExample(les2_1_1.id, 'Flyer on Green Habits',
    'By unplugging chargers and opting for public transport, every resident can easily **reduce their carbon footprint**.',
    'Bằng cách rút phích cắm sạc và chọn phương tiện công cộng, mỗi người dân đều có thể dễ dàng cắt giảm lượng phát thải carbon của mình.',
    'reduce carbon footprint là cụm collocation tần suất cao trong bài thi mới.', 1);

  await addQuiz(les2_1_1.id, 'Mini-Quiz: Family & Green Collocations', 'Luyện tập chọn cụm từ thích hợp trong ngữ cảnh', [
    {
      question: 'In modern society, both spouses frequently work full-time to share the financial ___ of raising children.',
      options: { A: 'burden', B: 'lifting', C: 'breadwinner', D: 'chore' },
      correctAnswer: 'A',
      explanation: 'share the financial burden: cùng nhau gánh vác gánh nặng tài chính.'
    },
    {
      question: 'Supermarkets are increasingly replacing single-use polythene bags with ___ alternatives.',
      options: { A: 'biodegradable', B: 'polluted', C: 'exhausted', D: 'heavy' },
      correctAnswer: 'A',
      explanation: 'biodegradable alternatives: các giải pháp thay thế có khả năng tự phân hủy sinh học.'
    }
  ]);

  await createBankQuestion({
    topicId: t2_1.id, moduleId: mod2.id, lessonId: les2_1_1.id, skillId: skills[4]?.id,
    content: 'Community Brochure: "Households are encouraged to install rooftop solar panels to lower energy bills and ________ their carbon footprint."',
    difficulty: 'EASY',
    explanation: 'Standard collocation: reduce / minimize one\'s carbon footprint.',
    options: [
      { text: 'reduce', isCorrect: true },
      { text: 'expand', isCorrect: false },
      { text: 'waste', isCorrect: false },
      { text: 'pollute', isCorrect: false }
    ]
  });

  // --- Topic 2.2: Technology, Innovation & Education ---
  const t2_2 = await postContent('/topics', {
    moduleId: mod2.id,
    code: 'THEME_INVENTIONS_LEARNING',
    name: 'Technology, Inventions and Modern Learning (Công nghệ, Phát minh & Học tập Hiện đại)',
    description: 'Technological breakthroughs, artificial intelligence in the classroom, blended learning, and digital ethics.',
    displayOrder: 2
  });

  let les2_2_1 = await postContent('/lessons', {
    topicId: t2_2.id,
    title: 'Digital Tools and Educational Innovations in the 21st Century',
    theorySummary: 'Từ vựng chuyên đề công nghệ giáo dục, ứng dụng thông minh và mô hình học tập kết hợp (blended learning).',
    content: `# Terminology: Inventions & Emerging Educational Paradigms

## 1. Technological Breakthroughs
*(Đột phá công nghệ & Thiết bị thông minh)*
- **technological breakthrough**: A major advancement or discovery in applied science.
- **artificial intelligence (AI)**: Computer systems programmed to perform tasks requiring human intelligence.
- **portable electronic device**: Compact handheld hardware such as smartphones, tablets, or e-readers.
- **serve multiple purposes**: Satisfy diverse functions or requirements simultaneously.

## 2. New Ways of Learning
*(Phương pháp học tập thời đại số)*
- **blended learning**: An educational approach combining physical classroom sessions with online digital activities.
- **interactive educational platform**: Online software enabling real-time collaboration between teachers and students.
- **digital distractions**: Electronic notifications or entertainment diverting attention away from studies.
- **foster autonomous learning**: Cultivate independent self-study habits among learners.`,
    isRemedial: false,
    displayOrder: 1
  });

  await addExample(les2_2_1.id, 'Educational Technology Context',
    'Our school has introduced a **blended learning** model, allowing students to access video lectures before attending class discussions.',
    'Trường chúng tôi đã áp dụng mô hình học tập kết hợp, cho phép học sinh xem trước bài giảng video trước khi tham gia thảo luận trên lớp.',
    'blended learning = học tập tích hợp trực tuyến và trực tiếp.', 1);

  await addQuiz(les2_2_1.id, 'Mini-Quiz: Inventions & Learning', 'Kiểm tra từ vựng công nghệ giáo dục', [
    {
      question: 'The adoption of ___ learning allows students to study at their own pace outside traditional classrooms.',
      options: { A: 'blended', B: 'manual', C: 'exhausted', D: 'primitive' },
      correctAnswer: 'A',
      explanation: 'blended learning = mô hình học tập kết hợp trực tiếp và trực tuyến.'
    },
    {
      question: 'Without disciplined self-control, smartphones can become serious digital ___ during study sessions.',
      options: { A: 'distractions', B: 'solutions', C: 'innovations', D: 'collaborations' },
      correctAnswer: 'A',
      explanation: 'digital distractions = những tác nhân gây xao nhãng bằng công nghệ số.'
    }
  ]);

  await createBankQuestion({
    topicId: t2_2.id, moduleId: mod2.id, lessonId: les2_2_1.id, skillId: skills[2]?.id,
    content: 'Article excerpt: "Modern educational institutions are striving to create interactive platforms that foster ________ learning among high school students."',
    difficulty: 'HARD',
    explanation: 'foster autonomous / independent learning = thúc đẩy khả năng tự học độc lập.',
    options: [
      { text: 'autonomous', isCorrect: true },
      { text: 'passive', isCorrect: false },
      { text: 'reluctant', isCorrect: false },
      { text: 'distracted', isCorrect: false }
    ]
  });

  // ==================================================================
  // MODULE 3: COMPETENCY-BASED EXAM STRATEGIES (Chiến thuật Đánh giá Năng lực 2025)
  // ==================================================================
  console.log('>>> [3/3] Khoi tao Module: Competency Exam Strategies...');
  const mod3 = await postContent('/modules', {
    subjectId: SUBJECT_ID,
    code: 'EXAM_STRATEGIES_2025',
    name: 'Competency-Based Exam Strategies (Chiến thuật Dạng bài Đánh giá Năng lực 2025)',
    description: 'Specific test-taking techniques for administrative notices, informational leaflets, textual logic, and analytical reading.',
    displayOrder: 3
  });

  // --- Topic 3.1: Notices & Leaflets Completion ---
  const t3_1 = await postContent('/topics', {
    moduleId: mod3.id,
    code: 'NOTICES_AND_LEAFLETS',
    name: 'Text Completion for Notices and Leaflets (Đọc điền Thông báo & Tờ rơi)',
    description: 'Mastering the 12-question section covering administrative announcements, event notices, brochures, and commercial flyers.',
    displayOrder: 1
  });

  let les3_1_1 = await postContent('/lessons', {
    topicId: t3_1.id,
    title: 'Dissecting School Announcements and Administrative Notices',
    theorySummary: 'Phương pháp phân tích cấu trúc một bản thông báo (tiêu đề, mốc thời gian, đối tượng, thể thức liên hệ) để điền đúng từ loại và giới từ.',
    content: `# Strategy: Notice Completion in Competency Exams

## 1. Architectural Anatomy of an Announcement
*(Cấu trúc văn bản của một Thông báo chuẩn)*
1. **Title / Headline:** Identifies the nature of the event (*Notice: Annual Volunteer Day*, *Book Fair Regulations*).
2. **Context & Eligibility:** Specifies target audience (*All Grade 10 students...*).
3. **Core Directives & Timing:** Time, venue, mandatory items, and dress code (*Participants are required to assemble...*).
4. **Point of Contact:** Specific inquiries directed to the organizing committee.

## 2. Three-Step Solving Technique
*(Quy trình 3 bước giải nhanh dạng đọc điền thông báo)*
- **Step 1 - Skim the Header:** Immediately grasp who is announcing what to whom.
- **Step 2 - Syntax & Part of Speech Analysis:** Examine whether the gap requires a verb in passive form (*be submitted*), a preposition (*participate IN*), or an adjective.
- **Step 3 - Formal Register Verification:** Ensure the chosen vocabulary maintains an objective, administrative tone (*attend*, *contact*, *assemble*, *prohibited*).`,
    isRemedial: false,
    displayOrder: 1
  });

  await addExample(les3_1_1.id, 'Notice Completion Sample',
    'ANNOUNCEMENT: CAMPUS GREEN CLUB\nAll registered members are requested to (1) **assemble** at the lecture hall by 8:00 AM sharp.\nKey: assemble = gather together formally.',
    'THÔNG BÁO: CLB XANH NHÀ TRƯỜNG\nTất cả thành viên đã đăng ký được yêu cầu tập trung tại giảng đường trước 8:00 sáng đúng giờ.',
    'assemble là động từ trang trọng mang nghĩa tập hợp trong các thông báo trường học.', 1);

  await addQuiz(les3_1_1.id, 'Mini-Quiz: Notice Completion', 'Luyện tập giải quyết câu hỏi trong thông báo', [
    {
      question: 'NOTICE: "Students interested in the musical talent show should ___ the registration form before October 15th."',
      options: { A: 'fill out', B: 'put off', C: 'give up', D: 'call out' },
      correctAnswer: 'A',
      explanation: 'fill out / complete the registration form = điền vào mẫu đăng ký.'
    },
    {
      question: 'ANNOUNCEMENT: "For further details regarding the exchange programme, please ___ Ms. Thu at room 204."',
      options: { A: 'contact', B: 'connect with', C: 'inform', D: 'inquire' },
      correctAnswer: 'A',
      explanation: 'contact someone = liên hệ trực tiếp với ai đó.'
    }
  ]);

  await createBankQuestion({
    topicId: t3_1.id, moduleId: mod3.id, lessonId: les3_1_1.id, skillId: skills[5]?.id,
    content: 'Notice Board: "Volunteers wishing to participate in the rural literacy project must submit their health certificates ________ Friday afternoon."',
    difficulty: 'MEDIUM',
    explanation: 'Preposition indicating a deadline: by / before Friday afternoon.',
    options: [
      { text: 'by', isCorrect: true },
      { text: 'for', isCorrect: false },
      { text: 'during', isCorrect: false },
      { text: 'since', isCorrect: false }
    ]
  });

  // --- Topic 3.2: Text Organisation & Dialogue Coherence ---
  const t3_2 = await postContent('/topics', {
    moduleId: mod3.id,
    code: 'TEXT_ORGANISATION_LOGIC',
    name: 'Text Coherence and Dialogue Ordering (Sắp xếp Đoạn văn & Lá thư Logic)',
    description: 'Unlocking logical sequencing clues: topic sentences, pronoun reference tracing, chronological transitions, and discourse markers.',
    displayOrder: 2
  });

  let les3_2_1 = await postContent('/lessons', {
    topicId: t3_2.id,
    title: 'Pronoun Tracing and Discourse Markers in Sentence Ordering',
    theorySummary: 'Phương pháp lần theo dấu vết đại từ thay thế (it, they, these) và các liên từ logic (However, Consequently, Furthermore) để tìm nhanh thứ tự đúng.',
    content: `# Logical Sequencing: Pronoun Tracing & Discourse Markers

## 1. The 4 Golden Rules of Coherence
*(4 Quy tắc vàng để tìm đúng thứ tự đoạn văn / lá thư)*

1. **Rule 1 - The Autonomous Opening (Câu mở đầu độc lập):**
   - The initial sentence introduces the central subject or theme.
   - It **NEVER** begins with contrast markers (*However, On the contrary*) or unclarified pronouns (*They, He, This problem*).

2. **Rule 2 - Pronoun Referencing (Dấu vết đại từ):**
   - A full noun phrase must be stated first before a pronoun substitutes it.
   - Example: *Solar panels (Noun) -> They / These devices (Pronouns)*.

3. **Rule 3 - Discourse Connectors (Từ nối liên kết):**
   - Addition: *In addition, Furthermore, Moreover*
   - Cause and Consequence: *Therefore, As a result, Consequently*
   - Contrast: *However, Despite this, Conversely*

4. **Rule 4 - Procedural & Chronological Hierarchy:**
   - Sequencing words: *Initially -> Subsequently -> Concurrently -> Ultimately*.`,
    isRemedial: false,
    displayOrder: 1
  });

  await addExample(les3_2_1.id, 'Dialogue Ordering Example',
    'A: "What are your plans for the weekend?"\nB: "I\'m going to join the local river clean-up campaign."\nA: "That sounds wonderful! Can I join you?"',
    'A: "Kế hoạch cuối tuần của bạn là gì?"\nB: "Tôi định tham gia chiến dịch dọn sạch dòng sông địa phương."\nA: "Nghe tuyệt quá! Mình đi cùng bạn được không?"',
    'Trật tự câu hỏi -> câu trả lời nêu hành động -> phản hồi cảm xúc và đề nghị đi cùng.', 1);

  await addQuiz(les3_2_1.id, 'Mini-Quiz: Text Ordering Clues', 'Kiểm tra nhận diện câu mở đầu và từ nối logic', [
    {
      question: 'Which of the following sentences is MOST SUITABLE as the opening sentence of an essay?',
      options: {
        A: 'Renewable energy has emerged as a critical solution to global climate change.',
        B: 'Consequently, governments must subsidize electric vehicles immediately.',
        C: 'However, these technologies still require high initial capital investments.',
        D: 'They also believe that consumers will gradually embrace greener alternatives.'
      },
      correctAnswer: 'A',
      explanation: 'Câu A giới thiệu chủ đề tổng quan, độc lập, không phụ thuộc vào từ nối hay đại từ thay thế phía trước.'
    },
    {
      question: 'Which transition word indicates a DIRECT CAUSE-AND-EFFECT outcome?',
      options: { A: 'Consequently', B: 'Furthermore', C: 'Whereas', D: 'Similarly' },
      correctAnswer: 'A',
      explanation: 'Consequently = As a result, diễn tả mối quan hệ nguyên nhân - kết quả.'
    }
  ]);

  await createBankQuestion({
    topicId: t3_2.id, moduleId: mod3.id, lessonId: les3_2_1.id, skillId: skills[5]?.id,
    content: 'Rearrange the exchange:\na. "Certainly! Here is the registration link."\nb. "Hi Nam, are you attending tomorrow\'s environmental debate?"\nc. "Yes, I am. Would you like to come along?"',
    difficulty: 'HARD',
    explanation: 'Logical progression: b asks question -> c answers and invites -> a confirms and shares link. Order: b - c - a.',
    options: [
      { text: 'b - c - a', isCorrect: true },
      { text: 'a - b - c', isCorrect: false },
      { text: 'c - a - b', isCorrect: false },
      { text: 'b - a - c', isCorrect: false }
    ]
  });

  console.log('\n======================================================================');
  console.log('  DA HOAN THANH NHAP DU LIEU TIENG ANH 10 TOAN DIEN:');
  console.log('  1. Noi dung tieng Anh chuan quoc te, giang giai bang tieng Viet.');
  console.log('  2. Day du Mini-quiz kiem tra nhanh cho moi bai hoc.');
  console.log('  3. Ngan hang cau hoi (Question Bank) tren Question Service (port 8083)');
  console.log('     da duoc cap nhat them cac cau hoi moi gan voi tung Lesson!');
  console.log('======================================================================');
}

seedAll().catch(console.error);

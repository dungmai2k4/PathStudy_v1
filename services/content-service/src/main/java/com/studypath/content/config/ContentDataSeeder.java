package com.studypath.content.config;

import com.studypath.content.domain.*;
import com.studypath.content.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class ContentDataSeeder implements CommandLineRunner {

    private final SubjectRepository subjectRepository;
    private final ModuleRepository moduleRepository;
    private final TopicRepository topicRepository;
    private final SkillRepository skillRepository;
    private final LessonRepository lessonRepository;
    private final ExampleRepository exampleRepository;
    private final MiniQuizRepository miniQuizRepository;

    public static final UUID ENGLISH_SUBJECT_ID = UUID.fromString("11111111-1111-1111-1111-111111111101");

    // Modules
    public static final UUID MODULE_GRAMMAR_ID = UUID.fromString("22222222-2222-2222-2222-222222222210");
    public static final UUID MODULE_VOCAB_ID = UUID.fromString("22222222-2222-2222-2222-222222222220");

    // Grammar Topics
    public static final UUID TOPIC_WORD_CLASSES_ID = UUID.fromString("22222222-2222-2222-2222-222222222211");
    public static final UUID TOPIC_SENTENCE_STRUCT_ID = UUID.fromString("22222222-2222-2222-2222-222222222212");
    public static final UUID TOPIC_TENSES_ID = UUID.fromString("22222222-2222-2222-2222-222222222201");
    public static final UUID TOPIC_MODALS_ID = UUID.fromString("22222222-2222-2222-2222-222222222213");
    public static final UUID TOPIC_CONDITIONALS_ID = UUID.fromString("22222222-2222-2222-2222-222222222203");
    public static final UUID TOPIC_PASSIVE_ID = UUID.fromString("22222222-2222-2222-2222-222222222202");
    public static final UUID TOPIC_COMPLEX_ID = UUID.fromString("22222222-2222-2222-2222-222222222204");

    // Vocabulary Topics
    public static final UUID TOPIC_MEANING_ID = UUID.fromString("22222222-2222-2222-2222-222222222221");
    public static final UUID TOPIC_SYNONYMS_ID = UUID.fromString("22222222-2222-2222-2222-222222222222");
    public static final UUID TOPIC_COLLOCATIONS_ID = UUID.fromString("22222222-2222-2222-2222-222222222205");
    public static final UUID TOPIC_WORD_FORMS_ID = UUID.fromString("22222222-2222-2222-2222-222222222223");
    public static final UUID TOPIC_CONTEXTUAL_ID = UUID.fromString("22222222-2222-2222-2222-222222222224");
    public static final UUID TOPIC_PHRASAL_VERBS_ID = UUID.fromString("22222222-2222-2222-2222-222222222225");

    @Override
    @Transactional
    public void run(String... args) {
        seedSubjects();
        seedModulesAndTopics();
    }

    private void seedSubjects() {
        if (subjectRepository.count() > 0) {
            log.info("Subjects already seeded.");
            return;
        }

        log.info("Seeding subject catalog...");
        SubjectEntity english = SubjectEntity.builder()
                .id(ENGLISH_SUBJECT_ID)
                .name("Tiếng Anh")
                .code("ENGLISH")
                .description("Chương trình Tiếng Anh THPT phát triển 4 kỹ năng ngôn ngữ và trọng tâm ngữ pháp, từ vựng chuẩn cấu trúc đề thi tốt nghiệp & đánh giá năng lực.")
                .icon("Languages")
                .status("ACTIVE")
                .isAvailable(true)
                .displayOrder(1)
                .build();

        SubjectEntity math = SubjectEntity.builder()
                .name("Toán học")
                .code("MATH")
                .description("Đại số, Giải tích, Hình học không gian và các chuyên đề Toán tư duy ứng dụng bậc THPT.")
                .icon("Calculator")
                .status("COMING_SOON")
                .isAvailable(false)
                .displayOrder(2)
                .build();

        SubjectEntity literature = SubjectEntity.builder()
                .name("Ngữ văn")
                .code("LITERATURE")
                .description("Tác phẩm văn học trung đại & hiện đại Việt Nam, kỹ năng đọc hiểu văn bản và viết bài nghị luận.")
                .icon("BookOpen")
                .status("COMING_SOON")
                .isAvailable(false)
                .displayOrder(3)
                .build();

        SubjectEntity physics = SubjectEntity.builder()
                .name("Vật lý")
                .code("PHYSICS")
                .description("Cơ học, Nhiệt học, Điện từ học, Quang hình & Vật lý lượng tử hiện đại.")
                .icon("Atom")
                .status("COMING_SOON")
                .isAvailable(false)
                .displayOrder(4)
                .build();

        SubjectEntity chemistry = SubjectEntity.builder()
                .name("Hóa học")
                .code("CHEMISTRY")
                .description("Hóa học vô cơ, Hóa học hữu cơ, Phản ứng oxi hóa khử và Hóa học ứng dụng đời sống.")
                .icon("FlaskConical")
                .status("COMING_SOON")
                .isAvailable(false)
                .displayOrder(5)
                .build();

        SubjectEntity biology = SubjectEntity.builder()
                .name("Sinh học")
                .code("BIOLOGY")
                .description("Sinh học tế bào, Di truyền học, Tiến hóa và Sinh thái học quần thể.")
                .icon("Dna")
                .status("COMING_SOON")
                .isAvailable(false)
                .displayOrder(6)
                .build();

        SubjectEntity history = SubjectEntity.builder()
                .name("Lịch sử")
                .code("HISTORY")
                .description("Lịch sử Việt Nam từ thời nguyên thủy đến hiện đại và tiến trình lịch sử thế giới văn minh.")
                .icon("Hourglass")
                .status("COMING_SOON")
                .isAvailable(false)
                .displayOrder(7)
                .build();

        SubjectEntity geography = SubjectEntity.builder()
                .name("Địa lý")
                .code("GEOGRAPHY")
                .description("Địa lý tự nhiên, Địa lý kinh tế - xã hội Việt Nam và các khu vực kinh tế trọng điểm toàn cầu.")
                .icon("Compass")
                .status("COMING_SOON")
                .isAvailable(false)
                .displayOrder(8)
                .build();

        SubjectEntity informatics = SubjectEntity.builder()
                .name("Tin học")
                .code("INFORMATICS")
                .description("Thuật toán, Lập trình Python, CSDL và Kiến trúc hệ thống mạng máy tính.")
                .icon("Laptop")
                .status("COMING_SOON")
                .isAvailable(false)
                .displayOrder(9)
                .build();

        SubjectEntity civics = SubjectEntity.builder()
                .name("Giáo dục công dân")
                .code("CIVICS")
                .description("Pháp luật và đời sống, Quyền công dân và Đạo đức xã hội hiện đại.")
                .icon("Scale")
                .status("COMING_SOON")
                .isAvailable(false)
                .displayOrder(10)
                .build();

        SubjectEntity technology = SubjectEntity.builder()
                .name("Công nghệ")
                .code("TECHNOLOGY")
                .description("Kỹ thuật điện tử, Cơ khí ứng dụng và Công nghệ số trong đời sống.")
                .icon("Cpu")
                .status("COMING_SOON")
                .isAvailable(false)
                .displayOrder(11)
                .build();

        subjectRepository.saveAll(List.of(
                english, math, literature, physics, chemistry, biology, history, geography, informatics, civics, technology
        ));
    }

    private void seedModulesAndTopics() {
        // Backfill topicId for any existing lessons where topic_id is null
        List<LessonEntity> existingLessons = lessonRepository.findAll();
        for (LessonEntity l : existingLessons) {
            if (l.getTopicId() == null && l.getSkillId() != null) {
                l.setTopicId(l.getSkillId());
                if (l.getIsRemedial() == null) {
                    l.setIsRemedial(false);
                }
                lessonRepository.save(l);
            }
        }

        if (moduleRepository.count() > 0) {
            log.info("Modules and Topics already seeded.");
            return;
        }

        log.info("Seeding Modules, Topics, Lessons and Quizzes for English Subject...");

        // 1. MODULES
        ModuleEntity modGrammar = ModuleEntity.builder()
                .id(MODULE_GRAMMAR_ID)
                .subjectId(ENGLISH_SUBJECT_ID)
                .name("Grammar (Ngữ pháp)")
                .code("ENG_GRAMMAR")
                .description("Hệ thống các chủ đề ngữ pháp trọng tâm: Từ loại, Thì, Cấu trúc câu, Động từ khuyết thiếu, Câu điều kiện, Bị động và Câu phức.")
                .displayOrder(1)
                .status("ACTIVE")
                .build();

        ModuleEntity modVocab = ModuleEntity.builder()
                .id(MODULE_VOCAB_ID)
                .subjectId(ENGLISH_SUBJECT_ID)
                .name("Vocabulary (Từ vựng)")
                .code("ENG_VOCAB")
                .description("Hệ thống phát triển vốn từ vựng học thuật: Nghĩa từ, Đồng nghĩa / Trái nghĩa, Collocations, Cấu tạo từ, Ngữ cảnh và Phrasal Verbs.")
                .displayOrder(2)
                .status("ACTIVE")
                .build();

        moduleRepository.saveAll(List.of(modGrammar, modVocab));

        // 2. TOPICS UNDER GRAMMAR
        TopicEntity topWordClasses = TopicEntity.builder()
                .id(TOPIC_WORD_CLASSES_ID)
                .moduleId(modGrammar.getId())
                .name("Word Classes (Các từ loại trong câu)")
                .code("ENG_WORD_CLASSES")
                .description("Nhận biết danh từ, động từ, tính từ, trạng từ và vị trí ngữ pháp trong câu.")
                .displayOrder(1)
                .status("ACTIVE")
                .build();

        TopicEntity topSentenceStruct = TopicEntity.builder()
                .id(TOPIC_SENTENCE_STRUCT_ID)
                .moduleId(modGrammar.getId())
                .name("Sentence Structure (Cấu trúc câu & Trật tự từ)")
                .code("ENG_SENTENCE_STRUCT")
                .description("Các thành phần nòng cốt S-V-O-C-A và các dạng câu đơn, câu ghép, câu phức.")
                .displayOrder(2)
                .status("ACTIVE")
                .build();

        TopicEntity topTenses = TopicEntity.builder()
                .id(TOPIC_TENSES_ID)
                .moduleId(modGrammar.getId())
                .name("Perfect Tenses (Các thì hoàn thành)")
                .code("ENG_PERFECT_TENSES")
                .description("Hiện tại hoàn thành, Quá khứ hoàn thành và so sánh đối chiếu với Quá khứ đơn.")
                .displayOrder(3)
                .status("ACTIVE")
                .build();

        TopicEntity topModals = TopicEntity.builder()
                .id(TOPIC_MODALS_ID)
                .moduleId(modGrammar.getId())
                .name("Modals (Động từ khuyết thiếu)")
                .code("ENG_MODALS")
                .description("Can, could, must, should, may, might và modal verbs trong suy đoán quá khứ.")
                .displayOrder(4)
                .status("ACTIVE")
                .build();

        TopicEntity topConditionals = TopicEntity.builder()
                .id(TOPIC_CONDITIONALS_ID)
                .moduleId(modGrammar.getId())
                .name("Conditionals (Câu điều kiện)")
                .code("ENG_CONDITIONALS")
                .description("Câu điều kiện loại 0, loại 1, loại 2, loại 3 và đảo ngữ câu điều kiện.")
                .displayOrder(5)
                .status("ACTIVE")
                .build();

        TopicEntity topPassive = TopicEntity.builder()
                .id(TOPIC_PASSIVE_ID)
                .moduleId(modGrammar.getId())
                .name("Passive Voice (Câu bị động)")
                .code("ENG_PASSIVE_VOICE")
                .description("Cấu trúc bị động chuẩn, bị động đặc biệt và cấu trúc nhờ vả causative have/get.")
                .displayOrder(6)
                .status("ACTIVE")
                .build();

        TopicEntity topComplex = TopicEntity.builder()
                .id(TOPIC_COMPLEX_ID)
                .moduleId(modGrammar.getId())
                .name("Complex Sentences (Câu phức & Mệnh đề quan hệ)")
                .code("ENG_COMPLEX_SENTENCES")
                .description("Mệnh đề quan hệ xác định, không xác định và phương pháp rút gọn mệnh đề.")
                .displayOrder(7)
                .status("ACTIVE")
                .build();

        // 3. TOPICS UNDER VOCABULARY
        TopicEntity topMeaning = TopicEntity.builder()
                .id(TOPIC_MEANING_ID)
                .moduleId(modVocab.getId())
                .name("Meaning (Nghĩa của từ)")
                .code("ENG_MEANING")
                .description("Nghĩa đen, nghĩa bóng, trường từ vựng và sắc thái biểu cảm của từ ngữ.")
                .displayOrder(1)
                .status("ACTIVE")
                .build();

        TopicEntity topSynonyms = TopicEntity.builder()
                .id(TOPIC_SYNONYMS_ID)
                .moduleId(modVocab.getId())
                .name("Synonyms / Antonyms (Từ đồng nghĩa & Trái nghĩa)")
                .code("ENG_SYN_ANT")
                .description("Phương pháp xử lý dạng bài tìm từ đồng nghĩa - trái nghĩa trong đề thi THPT.")
                .displayOrder(2)
                .status("ACTIVE")
                .build();

        TopicEntity topCollocations = TopicEntity.builder()
                .id(TOPIC_COLLOCATIONS_ID)
                .moduleId(modVocab.getId())
                .name("Collocations (Cụm từ cố định)")
                .code("ENG_COLLOCATIONS")
                .description("Các cặp kết hợp từ tự nhiên thường gặp trong bài thi tiếng Anh học thuật.")
                .displayOrder(3)
                .status("ACTIVE")
                .build();

        TopicEntity topWordForms = TopicEntity.builder()
                .id(TOPIC_WORD_FORMS_ID)
                .moduleId(modVocab.getId())
                .name("Word Forms (Cấu tạo từ)")
                .code("ENG_WORD_FORMS")
                .description("Hậu tố danh từ, tính từ, tiền tố phủ định và chuyển đổi từ loại.")
                .displayOrder(4)
                .status("ACTIVE")
                .build();

        TopicEntity topContextual = TopicEntity.builder()
                .id(TOPIC_CONTEXTUAL_ID)
                .moduleId(modVocab.getId())
                .name("Contextual Usage (Sử dụng từ theo ngữ cảnh)")
                .code("ENG_CONTEXTUAL")
                .description("Chọn từ phù hợp với ngữ cảnh học thuật, trang trọng và đời sống hàng ngày.")
                .displayOrder(5)
                .status("ACTIVE")
                .build();

        TopicEntity topPhrasalVerbs = TopicEntity.builder()
                .id(TOPIC_PHRASAL_VERBS_ID)
                .moduleId(modVocab.getId())
                .name("Phrasal Verbs (Cụm động từ)")
                .code("ENG_PHRASAL_VERBS")
                .description("Các phrasal verbs thông dụng với Get, Take, Look, Turn, Bring, Put...")
                .displayOrder(6)
                .status("ACTIVE")
                .build();

        topicRepository.saveAll(List.of(
                topWordClasses, topSentenceStruct, topTenses, topModals, topConditionals, topPassive, topComplex,
                topMeaning, topSynonyms, topCollocations, topWordForms, topContextual, topPhrasalVerbs
        ));

        // 4. SEED LESSONS & QUIZZES FOR KEY TOPICS
        seedPerfectTensesLessons(topTenses);
        seedConditionalsLessons(topConditionals);
        seedCollocationsLessons(topCollocations);
        seedWordFormsLessons(topWordForms);
        seedPhrasalVerbsLessons(topPhrasalVerbs);
    }

    private void seedPerfectTensesLessons(TopicEntity topTenses) {
        // Lesson 1: Present Perfect
        LessonEntity l1 = LessonEntity.builder()
                .topicId(topTenses.getId())
                .skillId(topTenses.getId())
                .title("Present Perfect (Hiện tại hoàn thành)")
                .theorySummary("S + have/has + V3/ed. Diễn tả hành động xảy ra trong quá khứ kéo dài đến hiện tại, hoặc trải nghiệm tính đến thời điểm nói.")
                .content("""
                        ### 1. Công thức Thì Hiện Tại Hoàn Thành (Present Perfect)
                        - **Khẳng định**: S + have / has + V3/ed
                        - **Phủ định**: S + have / has + not + V3/ed (haven't / hasn't)
                        - **Nghi vấn**: Have / Has + S + V3/ed?

                        ### 2. Cách dùng trọng tâm trong đề thi
                        1. **Hành động bắt đầu trong quá khứ và còn tiếp diễn ở hiện tại**:
                           - *We have lived in Hanoi for ten years.* (Đã sống 10 năm và hiện vẫn đang sống ở đây).
                        2. **Trải nghiệm hoặc kinh nghiệm tính tới thời điểm hiện tại**:
                           - *She has visited London twice.*
                           - *This is the first time I have ever eaten sushi.*
                        3. **Hành động vừa mới xảy ra, để lại kết quả ở hiện tại**:
                           - *I have just finished my homework.* (Vừa mới làm xong).
                           - *He has lost his keys, so he cannot enter his house now.*

                        ### 3. Dấu hiệu nhận biết quan trọng
                        - *since* + mốc thời gian (*since 2020, since yesterday*)
                        - *for* + khoảng thời gian (*for 5 years, for three days*)
                        - *already, just, recently, lately, yet (dùng trong câu phủ định và nghi vấn)*
                        - *ever, never, so far, up to now, until now*
                        """)
                .displayOrder(1)
                .isRemedial(false)
                .build();
        lessonRepository.save(l1);

        exampleRepository.save(ExampleEntity.builder()
                .lessonId(l1.getId())
                .title("Ví dụ Hiện tại hoàn thành")
                .content("They have worked on this AI research project since January.")
                .translation("Họ đã làm việc trong dự án nghiên cứu AI này từ tháng Một đến nay.")
                .explanation("Có 'since January' (mốc thời gian) nên động từ chia ở Hiện tại hoàn thành 'have worked'.")
                .displayOrder(1)
                .build());

        miniQuizRepository.save(MiniQuizEntity.builder()
                .lessonId(l1.getId())
                .title("Quiz 1: Hiện tại hoàn thành")
                .description("Trả lời 3 câu hỏi sau để kiểm tra mức độ hiểu bài và mở khóa bài tiếp theo.")
                .questionsJson("""
                        [
                          {
                            "question": "My brother ________ for this software company for over three years.",
                            "options": ["works", "has worked", "worked", "is working"],
                            "answer": "has worked",
                            "explanation": "Dấu hiệu 'for over three years' diễn tả hành động kéo dài từ quá khứ đến hiện tại -> chọn 'has worked'."
                          },
                          {
                            "question": "She hasn't finished her graduation thesis ________.",
                            "options": ["already", "yet", "since", "just"],
                            "answer": "yet",
                            "explanation": "Từ 'yet' thường đứng ở cuối câu phủ định hoặc nghi vấn trong thì Hiện tại hoàn thành."
                          },
                          {
                            "question": "How many international conferences ________ you ________ so far this year?",
                            "options": ["did / attend", "have / attended", "do / attend", "were / attending"],
                            "answer": "have / attended",
                            "explanation": "Dấu hiệu 'so far this year' (cho đến nay trong năm nay) đi với Hiện tại hoàn thành 'have attended'."
                          }
                        ]
                        """)
                .build());

        // Lesson 2: Past Perfect
        LessonEntity l2 = LessonEntity.builder()
                .topicId(topTenses.getId())
                .skillId(topTenses.getId())
                .title("Past Perfect (Quá khứ hoàn thành)")
                .theorySummary("S + had + V3/ed. Diễn tả một hành động xảy ra và hoàn tất trước một hành động khác trong quá khứ.")
                .content("""
                        ### 1. Công thức Thì Quá Khứ Hoàn Thành (Past Perfect)
                        - **Khẳng định**: S + had + V3/ed
                        - **Phủ định**: S + had not + V3/ed (hadn't)
                        - **Nghi vấn**: Had + S + V3/ed?

                        ### 2. Nguyên tắc phối hợp thì cốt lõi
                        > **Hành động xảy ra trước chia Quá khứ hoàn thành (had + V3), hành động xảy ra sau chia Quá khứ đơn (V2/ed).**

                        ### 3. Cấu trúc liên từ thường xuất hiện trong đề thi
                        1. **Before / By the time + S + V(quá khứ đơn), S + had + V3/ed**
                           - *By the time we arrived at the cinema, the film had already started.*
                        2. **After + S + had + V3/ed, S + V(quá khứ đơn)**
                           - *After he had completed his essay, he went to sleep.*
                        3. **Hardly / Scarcely + had + S + V3/ed + when + S + V(quá khứ đơn)**
                           - *Hardly had she left the house when it began to rain heavily.*
                        """)
                .displayOrder(2)
                .isRemedial(false)
                .build();
        lessonRepository.save(l2);

        exampleRepository.save(ExampleEntity.builder()
                .lessonId(l2.getId())
                .title("Ví dụ Quá khứ hoàn thành")
                .content("When the police arrived at the bank, the robbers had escaped.")
                .translation("Khi cảnh sát đến ngân hàng, những tên cướp đã tẩu thoát trước đó rồi.")
                .explanation("Hành động cướp tẩu thoát xảy ra trước khi cảnh sát đến -> chia 'had escaped'.")
                .displayOrder(1)
                .build());

        miniQuizRepository.save(MiniQuizEntity.builder()
                .lessonId(l2.getId())
                .title("Quiz 2: Quá khứ hoàn thành")
                .description("Trả lời 3 câu hỏi sau để hoàn thành bài và mở khóa bài tiếp theo.")
                .questionsJson("""
                        [
                          {
                            "question": "By the time the firefighter reached the scene, the fire ________ by the neighbors.",
                            "options": ["was extinguished", "had been extinguished", "has been extinguished", "extinguished"],
                            "answer": "had been extinguished",
                            "explanation": "Cấu trúc 'By the time + S + V(quá khứ đơn)' -> vế chính chia Quá khứ hoàn thành (bị động: had been extinguished)."
                          },
                          {
                            "question": "Hardly had the teacher entered the classroom ________ the students stopped talking.",
                            "options": ["than", "when", "then", "after"],
                            "answer": "when",
                            "explanation": "Cấu trúc đảo ngữ 'Hardly + had + S + V3/ed + when + S + V(quá khứ đơn)'."
                          },
                          {
                            "question": "Lan realized she ________ her passport at the hotel only after arriving at the airport.",
                            "options": ["left", "has left", "had left", "was leaving"],
                            "answer": "had left",
                            "explanation": "Hành động để quên hộ chiếu xảy ra trước khi đến sân bay -> dùng Quá khứ hoàn thành 'had left'."
                          }
                        ]
                        """)
                .build());

        // Lesson 3: Present Perfect vs Past Simple
        LessonEntity l3 = LessonEntity.builder()
                .topicId(topTenses.getId())
                .skillId(topTenses.getId())
                .title("Present Perfect vs Past Simple (Phân biệt Hiện tại hoàn thành & Quá khứ đơn)")
                .theorySummary("Quá khứ đơn chỉ hành động đã kết thúc dứt điểm với thời gian xác định. Hiện tại hoàn thành liên quan tới hiện tại hoặc không nêu thời gian cụ thể.")
                .content("""
                        ### 1. Bảng so sánh Hiện tại hoàn thành vs Quá khứ đơn
                        | Tiêu chí | Quá khứ đơn (Past Simple) | Hiện tại hoàn thành (Present Perfect) |
                        | :--- | :--- | :--- |
                        | **Thời điểm** | Xác định cụ thể trong quá khứ (*yesterday, in 2018, ago*) | Không xác định hoặc kéo dài tới nay (*since, for, so far*) |
                        | **Kết quả** | Chấm dứt hoàn toàn trong quá khứ | Còn liên hệ hoặc ảnh hưởng tới hiện tại |
                        | **Công thức** | S + V2/ed | S + have/has + V3/ed |

                        ### 2. Ví dụ phân biệt kinh điển
                        - *I lost my key yesterday, but I found it this morning.* (Mất hôm qua nhưng sáng nay đã tìm thấy -> Quá khứ đơn).
                        - *I have lost my key! I can't open the door now.* (Mất chìa khóa và hiện tại chưa vào được nhà -> Hiện tại hoàn thành).
                        """)
                .displayOrder(3)
                .isRemedial(false)
                .build();
        lessonRepository.save(l3);

        miniQuizRepository.save(MiniQuizEntity.builder()
                .lessonId(l3.getId())
                .title("Quiz 3: Phân biệt HTHT và QKĐ")
                .description("Trả lời 3 câu hỏi sau để hoàn thành bài học cuối cùng của topic.")
                .questionsJson("""
                        [
                          {
                            "question": "Shakespeare ________ many famous plays that are still performed today.",
                            "options": ["wrote", "has written", "writes", "had written"],
                            "answer": "wrote",
                            "explanation": "Shakespeare là nhân vật lịch sử đã mất trong quá khứ, hành động viết kịch đã kết thúc hẳn -> dùng Quá khứ đơn 'wrote'."
                          },
                          {
                            "question": "I ________ my wallet yesterday, but fortunately someone ________ it to me this morning.",
                            "options": ["lost / returned", "have lost / returned", "had lost / has returned", "lost / has returned"],
                            "answer": "lost / returned",
                            "explanation": "Cả hai mốc thời gian 'yesterday' và 'this morning' đều xác định trong quá khứ -> dùng Quá khứ đơn."
                          },
                          {
                            "question": "Up to now, our team ________ three major technical milestones in the project.",
                            "options": ["achieved", "has achieved", "had achieved", "achieves"],
                            "answer": "has achieved",
                            "explanation": "'Up to now' (cho đến nay) là dấu hiệu điển hình của thì Hiện tại hoàn thành."
                          }
                        ]
                        """)
                .build());

        // Remedial Lesson for Tenses
        LessonEntity remedialTenses = LessonEntity.builder()
                .topicId(topTenses.getId())
                .skillId(topTenses.getId())
                .title("[Luyện lại] Củng cố Phối hợp thì & Bảng động từ bất quy tắc")
                .theorySummary("Nội dung ôn tập bổ trợ: Tổng hợp các bẫy phối hợp thì hay gặp và quy tắc chia động từ V3/ed.")
                .content("""
                        ### Bài ôn luyện bổ trợ: Tránh các bẫy phối hợp thì thường gặp
                        1. **Bẫy Since**:
                           - S + have/has + V3/ed + **since** + S + V(quá khứ đơn).
                           - *Ví dụ*: I haven't seen Nam since he moved to London.
                        2. **Bẫy By the time**:
                           - By the time + S + V(hiện tại đơn) $\\rightarrow$ S + will have + V3 (Tương lai hoàn thành).
                           - By the time + S + V(quá khứ đơn) $\\rightarrow$ S + had + V3 (Quá khứ hoàn thành).
                        """)
                .displayOrder(4)
                .isRemedial(true)
                .build();
        lessonRepository.save(remedialTenses);

        miniQuizRepository.save(MiniQuizEntity.builder()
                .lessonId(remedialTenses.getId())
                .title("Quiz: Ôn tập Củng cố Phối hợp thì")
                .description("Trả lời 3 câu hỏi củng cố kiến thức trước khi kiểm tra lại.")
                .questionsJson("""
                        [
                          {
                            "question": "He has lived in Da Nang ________ he graduated from university.",
                            "options": ["since", "for", "in", "when"],
                            "answer": "since",
                            "explanation": "Sau 'since' là mốc thời gian / mệnh đề quá khứ đơn 'he graduated'."
                          },
                          {
                            "question": "The train ________ before we arrived at the platform.",
                            "options": ["left", "has left", "had left", "was leaving"],
                            "answer": "had left",
                            "explanation": "Hành động tàu rời ga xảy ra trước hành động đến sân ga ('before we arrived') -> Quá khứ hoàn thành."
                          },
                          {
                            "question": "Mr. Nam ________ in this high school since 2015.",
                            "options": ["taught", "has taught", "had taught", "teaches"],
                            "answer": "has taught",
                            "explanation": "Hành động bắt đầu năm 2015 và vẫn tiếp diễn đến nay -> 'has taught'."
                          }
                        ]
                        """)
                .build());
    }

    private void seedConditionalsLessons(TopicEntity topCond) {
        // Lesson 1: Zero Conditional
        LessonEntity l1 = LessonEntity.builder()
                .topicId(topCond.getId())
                .skillId(topCond.getId())
                .title("Zero Conditional (Câu điều kiện loại 0)")
                .theorySummary("If + S + V(hiện tại đơn), S + V(hiện tại đơn). Diễn tả chân lý, quy luật khoa học tự nhiên hoặc thói quen luôn đúng.")
                .content("""
                        ### 1. Cấu trúc câu điều kiện loại 0
                        - **Mệnh đề If**: If / When + S + V(hiện tại đơn)
                        - **Mệnh đề chính**: S + V(hiện tại đơn)

                        ### 2. Cách dùng
                        Diễn tả một sự thật hiển nhiên, quy luật vật lý hoặc phản ứng tất yếu:
                        - *If you heat ice, it melts into water.*
                        - *If plants do not get enough sunlight, they die.*
                        """)
                .displayOrder(1)
                .isRemedial(false)
                .build();
        lessonRepository.save(l1);

        miniQuizRepository.save(MiniQuizEntity.builder()
                .lessonId(l1.getId())
                .title("Quiz: Điều kiện loại 0")
                .description("Kiểm tra nhanh 3 câu hỏi về câu điều kiện loại 0.")
                .questionsJson("""
                        [
                          {
                            "question": "If you mix red and blue colors, you ________ purple.",
                            "options": ["get", "will get", "got", "would get"],
                            "answer": "get",
                            "explanation": "Quy luật pha màu hiển nhiên -> dùng điều kiện loại 0: get."
                          },
                          {
                            "question": "If water reaches 100 degrees Celsius, it ________.",
                            "options": ["boils", "will boil", "boiled", "would boil"],
                            "answer": "boils",
                            "explanation": "Sự thật hiển nhiên khoa học dùng câu điều kiện loại 0: hiện tại đơn cả 2 vế."
                          },
                          {
                            "question": "When iron ________ exposed to air and moisture, it rusts easily.",
                            "options": ["is", "was", "will be", "has been"],
                            "answer": "is",
                            "explanation": "Quy luật hóa học tự nhiên -> câu điều kiện loại 0 dùng 'is'."
                          }
                        ]
                        """)
                .build());

        // Lesson 2: First Conditional
        LessonEntity l2 = LessonEntity.builder()
                .topicId(topCond.getId())
                .skillId(topCond.getId())
                .title("First Conditional (Câu điều kiện loại 1)")
                .theorySummary("If + S + V(hiện tại đơn), S + will/can/may + V(nguyên mẫu). Diễn tả sự việc có thật hoặc có thể xảy ra ở hiện tại hoặc tương lai.")
                .content("""
                        ### 1. Cấu trúc câu điều kiện loại 1
                        - **Mệnh đề If**: If + S + V(s/es) (Hiện tại đơn)
                        - **Mệnh đề chính**: S + will / can / may + V(nguyên mẫu)

                        ### 2. Đảo ngữ loại 1
                        - **Should + S + V(nguyên mẫu), S + will + V(nguyên mẫu)**
                        - *Ví dụ*: Should you need any assistance, please call our hotline.
                        """)
                .displayOrder(2)
                .isRemedial(false)
                .build();
        lessonRepository.save(l2);

        miniQuizRepository.save(MiniQuizEntity.builder()
                .lessonId(l2.getId())
                .title("Quiz: Điều kiện loại 1")
                .description("Kiểm tra nhanh 3 câu hỏi về câu điều kiện loại 1.")
                .questionsJson("""
                        [
                          {
                            "question": "If it ________ tomorrow, we will postpone our football match.",
                            "options": ["rains", "will rain", "rained", "has rained"],
                            "answer": "rains",
                            "explanation": "Mệnh đề If của câu điều kiện loại 1 chia ở Hiện tại đơn -> rains."
                          },
                          {
                            "question": "________ you meet Sarah at the library, please remind her of our group assignment.",
                            "options": ["Should", "Were", "Had", "Unless"],
                            "answer": "Should",
                            "explanation": "Đảo ngữ câu điều kiện loại 1: 'Should + S + V(nguyên mẫu)'."
                          },
                          {
                            "question": "Unless you ________ hard now, you won't pass the upcoming national exam.",
                            "options": ["study", "don't study", "will study", "studied"],
                            "answer": "study",
                            "explanation": "'Unless' = 'If not'. Mệnh đề Unless dùng thể khẳng định: 'Unless you study'."
                          }
                        ]
                        """)
                .build());

        // Lesson 3: Second Conditional
        LessonEntity l3 = LessonEntity.builder()
                .topicId(topCond.getId())
                .skillId(topCond.getId())
                .title("Second Conditional (Câu điều kiện loại 2)")
                .theorySummary("If + S + V2/ed (were), S + would/could + V(nguyên mẫu). Giả định trái ngược với thực tế ở hiện tại.")
                .content("""
                        ### 1. Cấu trúc câu điều kiện loại 2
                        - **Mệnh đề If**: If + S + V2/ed (Động từ 'to be' dùng 'were' cho tất cả các ngôi)
                        - **Mệnh đề chính**: S + would / could + V(nguyên mẫu)

                        ### 2. Đảo ngữ loại 2
                        - **Were + S + to-V (hoặc Were + S + Adj/Noun), S + would + V**
                        - *Ví dụ*: Were I rich, I would travel around the world.
                        """)
                .displayOrder(3)
                .isRemedial(false)
                .build();
        lessonRepository.save(l3);

        miniQuizRepository.save(MiniQuizEntity.builder()
                .lessonId(l3.getId())
                .title("Quiz: Điều kiện loại 2")
                .description("Kiểm tra nhanh 3 câu hỏi về câu điều kiện loại 2.")
                .questionsJson("""
                        [
                          {
                            "question": "If I ________ you, I would take that prestigious scholarship opportunity.",
                            "options": ["am", "were", "was being", "have been"],
                            "answer": "were",
                            "explanation": "Câu giả định khuyên bảo 'If I were you' -> chọn 'were'."
                          },
                          {
                            "question": "________ I to have more free time, I would participate in community volunteer projects.",
                            "options": ["Were", "Had", "Should", "If"],
                            "answer": "Were",
                            "explanation": "Đảo ngữ câu điều kiện loại 2: 'Were + S + to-V'."
                          },
                          {
                            "question": "If this laptop ________ cheaper, I would buy it right away.",
                            "options": ["is", "were", "had been", "will be"],
                            "answer": "were",
                            "explanation": "Giả định trái thực tế hiện tại dùng câu điều kiện loại 2 (động từ to be là 'were')."
                          }
                        ]
                        """)
                .build());
    }

    private void seedCollocationsLessons(TopicEntity topColloc) {
        LessonEntity l1 = LessonEntity.builder()
                .topicId(topColloc.getId())
                .skillId(topColloc.getId())
                .title("Academic Collocations (Cụm từ học thuật quan trọng)")
                .theorySummary("Các cụm từ cố định thường gặp: make a decision, take responsibility, pay attention, draw a conclusion.")
                .content("""
                        ### 1. Các Collocation thông dụng
                        - **make progress**: tiến bộ
                        - **take into account**: cân nhắc, tính đến
                        - **pay attention to**: chú ý tới
                        - **catch up with**: bắt kịp
                        """)
                .displayOrder(1)
                .isRemedial(false)
                .build();
        lessonRepository.save(l1);

        miniQuizRepository.save(MiniQuizEntity.builder()
                .lessonId(l1.getId())
                .title("Quiz: Collocations")
                .description("Kiểm tra nhanh 3 câu hỏi về cụm từ cố định.")
                .questionsJson("""
                        [
                          {
                            "question": "The students have made remarkable ________ in their English writing skills.",
                            "options": ["progress", "advance", "growth", "step"],
                            "answer": "progress",
                            "explanation": "Cụm cố định là 'make progress' (tiến bộ)."
                          },
                          {
                            "question": "You should always ________ into account all the safety guidelines before conducting the experiment.",
                            "options": ["take", "make", "give", "bring"],
                            "answer": "take",
                            "explanation": "Cụm cố định là 'take into account' (tính đến, cân nhắc)."
                          },
                          {
                            "question": "Please ________ close attention to the grammar notes on the whiteboard.",
                            "options": ["pay", "spend", "cost", "take"],
                            "answer": "pay",
                            "explanation": "Cụm cố định là 'pay attention to' (chú ý đến)."
                          }
                        ]
                        """)
                .build());
    }

    private void seedWordFormsLessons(TopicEntity topWordForms) {
        LessonEntity l1 = LessonEntity.builder()
                .topicId(topWordForms.getId())
                .skillId(topWordForms.getId())
                .title("Word Formation & Suffixes (Hậu tố tạo danh từ và tính từ)")
                .theorySummary("Hậu tố danh từ (-tion, -ment, -ness, -ity), hậu tố tính từ (-ful, -less, -able, -ive).")
                .content("""
                        ### 1. Hậu tố tạo Danh từ (Noun Suffixes)
                        - *-tion / -sion*: pollute $\\rightarrow$ pollution, decide $\\rightarrow$ decision
                        - *-ment*: develop $\\rightarrow$ development, improve $\\rightarrow$ improvement
                        - *-ness*: happy $\\rightarrow$ happiness, dark $\\rightarrow$ darkness

                        ### 2. Hậu tố tạo Tính từ (Adjective Suffixes)
                        - *-able / -ible*: rely $\\rightarrow$ reliable
                        - *-ful / -less*: care $\\rightarrow$ careful / careless
                        """)
                .displayOrder(1)
                .isRemedial(false)
                .build();
        lessonRepository.save(l1);

        miniQuizRepository.save(MiniQuizEntity.builder()
                .lessonId(l1.getId())
                .title("Quiz: Word Forms")
                .description("Kiểm tra nhanh 3 câu hỏi về cấu tạo từ.")
                .questionsJson("""
                        [
                          {
                            "question": "Environmental ________ is one of the most critical challenges facing our planet.",
                            "options": ["pollution", "pollute", "polluted", "polluting"],
                            "answer": "pollution",
                            "explanation": "Sau tính từ 'Environmental' cần một danh từ -> chọn 'pollution'."
                          },
                          {
                            "question": "Regular exercise brings significant health ________ to people of all ages.",
                            "options": ["benefits", "beneficial", "beneficially", "benefiting"],
                            "answer": "benefits",
                            "explanation": "Sau tính từ 'health' cần danh từ số nhiều 'benefits' (lợi ích sức khỏe)."
                          },
                          {
                            "question": "He is a very ________ driver who never breaks traffic regulations.",
                            "options": ["care", "careful", "carefully", "careless"],
                            "answer": "careful",
                            "explanation": "Đứng trước danh từ 'driver' cần tính từ mang nghĩa cẩn thận -> 'careful'."
                          }
                        ]
                        """)
                .build());
    }

    private void seedPhrasalVerbsLessons(TopicEntity topPhrasal) {
        LessonEntity l1 = LessonEntity.builder()
                .topicId(topPhrasal.getId())
                .skillId(topPhrasal.getId())
                .title("Essential Phrasal Verbs (Cụm động từ thiết yếu)")
                .theorySummary("Các phrasal verbs phổ biến: give up, turn down, look after, carry out, bring about.")
                .content("""
                        ### 1. Danh sách Phrasal Verbs trọng tâm
                        - **look after**: chăm sóc (= take care of)
                        - **turn down**: từ chối (= reject) hoặc giảm âm lượng
                        - **give up**: từ bỏ (= surrender/quit)
                        - **carry out**: tiến hành, thực hiện (= conduct)
                        - **bring about**: mang lại, gây ra (= cause)
                        """)
                .displayOrder(1)
                .isRemedial(false)
                .build();
        lessonRepository.save(l1);

        miniQuizRepository.save(MiniQuizEntity.builder()
                .lessonId(l1.getId())
                .title("Quiz: Phrasal Verbs")
                .description("Kiểm tra nhanh 3 câu hỏi về cụm động từ.")
                .questionsJson("""
                        [
                          {
                            "question": "Scientists are planning to ________ an experiment to test the new vaccine.",
                            "options": ["carry out", "turn off", "look for", "give in"],
                            "answer": "carry out",
                            "explanation": "'carry out an experiment' nghĩa là tiến hành một thí nghiệm."
                          },
                          {
                            "question": "He had to ________ the job offer because the salary was too low.",
                            "options": ["turn down", "look after", "give up", "bring about"],
                            "answer": "turn down",
                            "explanation": "'turn down' = reject (từ chối lời mời)."
                          },
                          {
                            "question": "She promised to ________ her neighbor's cat while they were away on vacation.",
                            "options": ["look after", "give in", "take off", "turn up"],
                            "answer": "look after",
                            "explanation": "'look after' = take care of (chăm sóc)."
                          }
                        ]
                        """)
                .build());
    }
}

package com.studypath.question.config;

import com.studypath.question.domain.QuestionBankEntity;
import com.studypath.question.domain.QuestionEntity;
import com.studypath.question.domain.QuestionOptionEntity;
import com.studypath.question.repository.QuestionBankRepository;
import com.studypath.question.repository.QuestionOptionRepository;
import com.studypath.question.repository.QuestionRepository;
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
public class QuestionDataSeeder implements CommandLineRunner {

    private final QuestionBankRepository questionBankRepository;
    private final QuestionRepository questionRepository;
    private final QuestionOptionRepository questionOptionRepository;

    public static final UUID ENGLISH_SUBJECT_ID = UUID.fromString("11111111-1111-1111-1111-111111111101");
    public static final UUID QUESTION_BANK_ID = UUID.fromString("33333333-3333-3333-3333-333333333301");

    public static final UUID SKILL_TENSES_ID = UUID.fromString("22222222-2222-2222-2222-222222222201");
    public static final UUID SKILL_PASSIVE_ID = UUID.fromString("22222222-2222-2222-2222-222222222202");
    public static final UUID SKILL_CONDITIONALS_ID = UUID.fromString("22222222-2222-2222-2222-222222222203");
    public static final UUID SKILL_RELATIVES_ID = UUID.fromString("22222222-2222-2222-2222-222222222204");
    public static final UUID SKILL_VOCAB_ID = UUID.fromString("22222222-2222-2222-2222-222222222205");
    public static final UUID SKILL_READING_ID = UUID.fromString("22222222-2222-2222-2222-222222222206");

    @Override
    @Transactional
    public void run(String... args) {
        // Backfill topicId and moduleId for existing questions
        List<QuestionEntity> existingQuestions = questionRepository.findAll();
        boolean needUpdate = false;
        for (QuestionEntity q : existingQuestions) {
            if (q.getTopicId() == null && q.getSkillId() != null) {
                q.setTopicId(q.getSkillId());
                boolean isGrammar = q.getSkillId().toString().endsWith("01") ||
                                    q.getSkillId().toString().endsWith("02") ||
                                    q.getSkillId().toString().endsWith("03") ||
                                    q.getSkillId().toString().endsWith("04");
                q.setModuleId(isGrammar
                        ? UUID.fromString("22222222-2222-2222-2222-222222222210")
                        : UUID.fromString("22222222-2222-2222-2222-222222222220"));
                needUpdate = true;
            }
        }
        if (needUpdate) {
            questionRepository.saveAll(existingQuestions);
            log.info("Backfilled topicId and moduleId for {} existing questions.", existingQuestions.size());
        }

        if (questionBankRepository.count() > 0) {
            log.info("Question bank data already seeded. Skipping question seeding.");
            return;
        }

        log.info("Seeding comprehensive English Question Bank...");

        QuestionBankEntity bank = QuestionBankEntity.builder()
                .id(QUESTION_BANK_ID)
                .subjectId(ENGLISH_SUBJECT_ID)
                .name("Ngân hàng Câu hỏi Tiếng Anh Chuẩn THPT & Đánh giá Năng lực")
                .description("Bộ câu hỏi trắc nghiệm tiếng Anh 4 lựa chọn chuẩn hóa, phân cấp 3 mức độ (Dễ, Trung bình, Khó) theo 6 nhóm kỹ năng ngữ pháp, từ vựng và đọc hiểu.")
                .status("ACTIVE")
                .build();

        questionBankRepository.save(bank);

        // --- 1. SKILL: Verb Tenses ---
        addQuestion(
                bank.getId(), SKILL_TENSES_ID,
                "Water ________ at 100 degrees Celsius under normal atmospheric conditions.",
                "EASY",
                "Quy luật tự nhiên / Chân lý vật lý hiển nhiên luôn chia ở thì Hiện tại đơn (Present Simple). 'Water' là danh từ không đếm được nên động từ thêm 's' -> 'boils'.",
                List.of("boils", "is boiling", "boiled", "has boiled"),
                0
        );

        addQuestion(
                bank.getId(), SKILL_TENSES_ID,
                "Listen! The baby ________ in the next bedroom.",
                "EASY",
                "Thán từ 'Listen!' báo hiệu hành động đang diễn ra ngay tại thời điểm nói -> dùng Hiện tại tiếp diễn (is/am/are + V-ing) -> 'is crying'.",
                List.of("cries", "is crying", "cried", "has cried"),
                1
        );

        addQuestion(
                bank.getId(), SKILL_TENSES_ID,
                "While we ________ along the beach, a sudden thunderstorm began.",
                "MEDIUM",
                "Hành động đi dạo kéo dài đang diễn ra trong quá khứ ('were walking') thì hành động cơn giông bão ập đến xen ngang ('began' - quá khứ đơn). Cấu trúc: While + Past Continuous, Past Simple.",
                List.of("walked", "were walking", "have walked", "are walking"),
                1
        );

        addQuestion(
                bank.getId(), SKILL_TENSES_ID,
                "Mr. Nam ________ for this multinational technology corporation since he graduated in 2020.",
                "MEDIUM",
                "Cấu trúc: 'S + have/has + V3/ed + since + mốc thời gian quá khứ' diễn tả hành động bắt đầu từ quá khứ và kéo dài đến nay -> chia Hiện tại hoàn thành 'has worked'.",
                List.of("worked", "works", "has worked", "is working"),
                2
        );

        addQuestion(
                bank.getId(), SKILL_TENSES_ID,
                "By the time the rescue team arrived at the isolated village, the floodwaters ________ almost all low-lying houses.",
                "HARD",
                "Cấu trúc 'By the time + S + V(quá khứ đơn), S + had + V3/ed'. Hành động nước lũ phá hủy xảy ra và hoàn tất trước thời điểm đội cứu hộ tới -> Quá khứ hoàn thành 'had destroyed'.",
                List.of("destroyed", "had destroyed", "was destroying", "has destroyed"),
                1
        );

        // --- 2. SKILL: Passive Voice ---
        addQuestion(
                bank.getId(), SKILL_PASSIVE_ID,
                "This historic suspension bridge ________ by talented French architects in the late 19th century.",
                "EASY",
                "Chủ ngữ là cây cầu ('bridge') chịu tác động của hành động xây dựng, kèm mốc thời gian 'in the late 19th century' (quá khứ) -> Bị động quá khứ đơn 'was built'.",
                List.of("was built", "is built", "built", "has been built"),
                0
        );

        addQuestion(
                bank.getId(), SKILL_PASSIVE_ID,
                "Strict environmental regulations must ________ by local authorities to mitigate water pollution.",
                "MEDIUM",
                "Bị động với động từ khuyết thiếu (Modal verbs): 'modal + be + V3/ed'. Sau 'must' là 'be enacted' (phải được ban hành).",
                List.of("enact", "be enacted", "have enacted", "been enacted"),
                1
        );

        addQuestion(
                bank.getId(), SKILL_PASSIVE_ID,
                "Because I didn't have enough time, I had my laptop ________ by a professional technician yesterday.",
                "MEDIUM",
                "Cấu trúc thể sai khiến bị động (Causative Form): 'S + have/get + something + V3/ed' (nhờ/thuê ai làm cái gì) -> 'had my laptop repaired'.",
                List.of("repair", "repairing", "repaired", "to repair"),
                2
        );

        addQuestion(
                bank.getId(), SKILL_PASSIVE_ID,
                "The eminent medical researcher is reported ________ a promising new vaccine after fifteen years of laboratory experiments.",
                "HARD",
                "Bị động khách quan với động từ tường thuật: Khi hành động trong mệnh đề (tìm ra vắc xin) xảy ra trước thời điểm tường thuật (hiện tại 'is reported') -> dùng 'to have + V3/ed' -> 'to have discovered'.",
                List.of("to discover", "to have discovered", "discovering", "to be discovered"),
                1
        );

        // --- 3. SKILL: Conditionals & Inversions ---
        addQuestion(
                bank.getId(), SKILL_CONDITIONALS_ID,
                "If the weather ________ favorable tomorrow morning, our school will hold the annual sports championship.",
                "EASY",
                "Câu điều kiện loại 1 diễn tả sự việc có thể xảy ra ở hiện tại hoặc tương lai: Mệnh đề If chia Hiện tại đơn (S + V(s/es)) -> 'is'.",
                List.of("is", "will be", "was", "would be"),
                0
        );

        addQuestion(
                bank.getId(), SKILL_CONDITIONALS_ID,
                "If I ________ more leisure time, I would participate in community volunteer projects.",
                "MEDIUM",
                "Câu điều kiện loại 2 giả định trái ngược với thực tế ở hiện tại: Mệnh đề If chia Quá khứ đơn (V2/ed, were) -> chọn 'had'.",
                List.of("have", "had", "would have", "had had"),
                1
        );

        addQuestion(
                bank.getId(), SKILL_CONDITIONALS_ID,
                "If she had taken her mentor's advice into account, she ________ such a regrettable mistake in the final report.",
                "MEDIUM",
                "Câu điều kiện loại 3 giả định nuối tiếc trái với quá khứ: Mệnh đề chính có dạng 'S + would/could + have + V3/ed' -> chọn 'would not have made'.",
                List.of("would not make", "will not make", "would not have made", "had not made"),
                2
        );

        addQuestion(
                bank.getId(), SKILL_CONDITIONALS_ID,
                "________ the emergency brakes promptly, the freight train would have collided with the stationary vehicle on the tracks.",
                "HARD",
                "Đảo ngữ câu điều kiện loại 3: Thay vì 'If the engineer had not applied...', ta đảo 'Had + S + not + V3/ed' -> 'Had the engineer not applied'.",
                List.of("Had the engineer not applied", "If the engineer didn't apply", "Were the engineer not applying", "Should the engineer not apply"),
                0
        );

        addQuestion(
                bank.getId(), SKILL_CONDITIONALS_ID,
                "________ you experience any unexpected technical issues during the examination, notify the invigilator immediately.",
                "HARD",
                "Đảo ngữ câu điều kiện loại 1: Thay vì 'If you experience...', ta dùng 'Should + S + V(nguyên mẫu)' -> 'Should you experience'.",
                List.of("Were", "Had", "Should", "Unless"),
                2
        );

        // --- 4. SKILL: Relative Clauses ---
        addQuestion(
                bank.getId(), SKILL_RELATIVES_ID,
                "The dedicated cardiologist ________ successfully operated on my grandmother is highly respected.",
                "EASY",
                "Đại từ quan hệ 'who' thay thế cho danh từ chỉ người ('cardiologist' - bác sĩ tim mạch) và đóng vai trò làm Chủ ngữ của mệnh đề quan hệ.",
                List.of("who", "which", "whom", "whose"),
                0
        );

        addQuestion(
                bank.getId(), SKILL_RELATIVES_ID,
                "The academic conference on AI, ________ was organized in Da Nang last Friday, was a tremendous success.",
                "EASY",
                "Mệnh đề quan hệ không xác định (có dấu phẩy) bổ nghĩa cho danh từ chỉ sự vật ('conference') -> bắt buộc dùng 'which' (tuyệt đối không dùng 'that' sau dấu phẩy).",
                List.of("that", "which", "who", "where"),
                1
        );

        addQuestion(
                bank.getId(), SKILL_RELATIVES_ID,
                "The young scientist ________ invention solved the community's water purification problem was awarded a prestigious scholarship.",
                "MEDIUM",
                "Đại từ quan hệ sở hữu 'whose' đứng trước danh từ 'invention' để chỉ 'phát minh của nhà khoa học trẻ'.",
                List.of("whose", "who", "whom", "which"),
                0
        );

        addQuestion(
                bank.getId(), SKILL_RELATIVES_ID,
                "All high school students ________ in the national mathematics olympiad must register before next Monday.",
                "HARD",
                "Rút gọn mệnh đề quan hệ chủ động: 'All students who participate...' -> rút gọn thành dạng hiện tại phân từ V-ing -> 'participating'.",
                List.of("participating", "participated", "to participate", "who participating"),
                0
        );

        addQuestion(
                bank.getId(), SKILL_RELATIVES_ID,
                "Yuri Gagarin became the first human ________ into outer space in April 1969.",
                "HARD",
                "Rút gọn mệnh đề quan hệ sau cụm từ chỉ thứ tự 'the first / the second / the only' -> bắt buộc rút gọn thành 'to + V(nguyên mẫu)' -> 'to travel'.",
                List.of("traveled", "traveling", "to travel", "who travel"),
                2
        );

        // --- 5. SKILL: Vocabulary & Collocations ---
        addQuestion(
                bank.getId(), SKILL_VOCAB_ID,
                "All candidates are required to ________ their best during the challenging entrance interview.",
                "EASY",
                "Collocation chuẩn: 'do one's best' (cố gắng hết sức). Đi với 'do', không dùng 'make' hay 'take'.",
                List.of("make", "do", "take", "give"),
                1
        );

        addQuestion(
                bank.getId(), SKILL_VOCAB_ID,
                "You need to take all potential risks into ________ before signing this long-term investment contract.",
                "MEDIUM",
                "Collocation thông dụng: 'take something into account / consideration' (tính đến, xem xét kỹ lưỡng điều gì).",
                List.of("account", "mind", "sight", "view"),
                0
        );

        addQuestion(
                bank.getId(), SKILL_VOCAB_ID,
                "Thanks to his persistent dedication, Hoang has made impressive ________ in mastering academic English.",
                "MEDIUM",
                "Collocation cố định: 'make progress' (tiến bộ). Động từ đi kèm là 'make', không dùng 'do' hay 'gain'.",
                List.of("progress", "development", "success", "evolution"),
                0
        );

        addQuestion(
                bank.getId(), SKILL_VOCAB_ID,
                "The dramatic rise of automated production lines has ________ serious employment challenges for unskilled manual laborers.",
                "HARD",
                "Collocation học thuật: 'pose challenges / threats / risks' (đặt ra thách thức / mối đe dọa).",
                List.of("posed", "raised", "made", "provoked"),
                0
        );

        addQuestion(
                bank.getId(), SKILL_VOCAB_ID,
                "In the fast-evolving tech industry, software engineers must continuously upskill to keep ________ with global trends.",
                "HARD",
                "Idiom/Collocation: 'keep pace with' hoặc 'keep up with' (theo kịp, bắt kịp tốc độ phát triển). Ở đây có giới từ 'with' và danh từ 'pace' -> chọn 'pace'.",
                List.of("track", "pace", "step", "touch"),
                1
        );

        // --- 6. SKILL: Reading Comprehension ---
        addQuestion(
                bank.getId(), SKILL_READING_ID,
                "In reading comprehension strategies, what is the core objective of the 'Skimming' technique?",
                "MEDIUM",
                "Kỹ thuật Skimming (đọc lướt nhanh tiêu đề, câu đầu và câu kết) dùng để nắm bắt ý chính (main idea) và bố cục tổng thể của bài đọc mà không cần dịch từng từ.",
                List.of(
                        "To look up every unfamiliar word in an English dictionary",
                        "To quickly grasp the main idea and general overview of the text",
                        "To search exclusively for specific dates, numbers, and proper names",
                        "To critique the author's tone and grammar style"
                ),
                1
        );

        addQuestion(
                bank.getId(), SKILL_READING_ID,
                "When an author transitions a paragraph with 'On the contrary' or 'However', what should the reader immediately anticipate?",
                "MEDIUM",
                "Các liên từ tương phản (However, On the contrary, Yet) báo hiệu thông tin trái ngược hoặc phản biện lại ý kiến đã đưa ra trước đó.",
                List.of(
                        "An identical elaboration of the preceding paragraph",
                        "A contrasting perspective or counter-argument",
                        "A statistical table summarizing previous figures",
                        "A conclusion terminating the entire article"
                ),
                1
        );

        addQuestion(
                bank.getId(), SKILL_READING_ID,
                "Read the sentence: 'Renewable energies such as solar and wind power are becoming increasingly ubiquitous across developed nations.' What does 'ubiquitous' most likely mean?",
                "HARD",
                "Từ 'ubiquitous' mang nghĩa là 'có mặt ở khắp nơi / phổ biến rộng rãi' (present or found everywhere). Ngữ cảnh việc năng lượng mặt trời và gió đang lan rộng khắp các nước phát triển.",
                List.of(
                        "Extremely scarce and hard to locate",
                        "Present, appearing, or found everywhere",
                        "Highly dangerous and hazardous to wildlife",
                        "Economically unviable and obsolete"
                ),
                1
        );

        addQuestion(
                bank.getId(), SKILL_READING_ID,
                "In the sentence: 'Autonomous vehicles will transform urban transit systems because they reduce accidents caused by human error.' What does the pronoun 'they' refer to?",
                "HARD",
                "Đại từ 'they' thay thế cho danh từ số nhiều làm chủ ngữ ở mệnh đề trước: 'Autonomous vehicles' (các phương tiện tự hành).",
                List.of(
                        "Urban transit systems",
                        "Autonomous vehicles",
                        "Human errors",
                        "City drivers"
                ),
                1
        );

        log.info("Successfully seeded English Question Bank with 28 comprehensive questions!");
    }

    public static final UUID MODULE_GRAMMAR_ID = UUID.fromString("22222222-2222-2222-2222-222222222210");
    public static final UUID MODULE_VOCAB_ID = UUID.fromString("22222222-2222-2222-2222-222222222220");

    private void addQuestion(
            UUID bankId, UUID skillId, String content, String difficulty, String explanation,
            List<String> options, int correctIndex
    ) {
        UUID moduleId = (skillId.equals(SKILL_VOCAB_ID) || skillId.equals(SKILL_READING_ID))
                ? MODULE_VOCAB_ID : MODULE_GRAMMAR_ID;

        QuestionEntity question = QuestionEntity.builder()
                .questionBankId(bankId)
                .skillId(skillId)
                .topicId(skillId) // topicId maps to skillId for clean random sampling
                .moduleId(moduleId)
                .content(content)
                .difficulty(difficulty)
                .explanation(explanation)
                .status("ACTIVE")
                .build();

        questionRepository.save(question);

        for (int i = 0; i < options.size(); i++) {
            QuestionOptionEntity option = QuestionOptionEntity.builder()
                    .questionId(question.getId())
                    .optionContent(options.get(i))
                    .isCorrect(i == correctIndex)
                    .displayOrder(i + 1)
                    .build();
            questionOptionRepository.save(option);
        }
    }
}

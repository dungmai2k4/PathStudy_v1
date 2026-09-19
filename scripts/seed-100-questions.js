// scripts/seed-100-questions.js
const API_URL = 'http://localhost:8083/api/v1/questions';

const QUESTION_BANK_ID = '33333333-3333-3333-3333-333333333301';
const SKILL_TENSES_ID = '22222222-2222-2222-2222-222222222201';
const SKILL_PASSIVE_ID = '22222222-2222-2222-2222-222222222202';
const SKILL_CONDITIONALS_ID = '22222222-2222-2222-2222-222222222203';
const SKILL_RELATIVES_ID = '22222222-2222-2222-2222-222222222204';
const SKILL_VOCAB_ID = '22222222-2222-2222-2222-222222222205';
const SKILL_READING_ID = '22222222-2222-2222-2222-222222222206';

const MODULE_GRAMMAR_ID = '22222222-2222-2222-2222-222222222210';
const MODULE_VOCAB_ID = '22222222-2222-2222-2222-222222222220';

const questions = [
  // ==========================================
  // 1. TENSES (20 câu: 7 Easy, 8 Medium, 5 Hard)
  // ==========================================
  {
    skillId: SKILL_TENSES_ID,
    content: "The sun ________ in the east and sets in the west.",
    difficulty: "EASY",
    explanation: "Chân lý, quy luật tự nhiên luôn chia ở thì Hiện tại đơn. 'The sun' số ít nên 'rises'.",
    options: ["rises", "is rising", "rose", "has risen"],
    correctIndex: 0
  },
  {
    skillId: SKILL_TENSES_ID,
    content: "Look! That man ________ to break into the jewelry shop.",
    difficulty: "EASY",
    explanation: "Dấu hiệu nhận biết 'Look!' chỉ hành động đang xảy ra trước mắt -> Hiện tại tiếp diễn (is/am/are + V-ing).",
    options: ["tries", "is trying", "tried", "has tried"],
    correctIndex: 1
  },
  {
    skillId: SKILL_TENSES_ID,
    content: "They ________ in this neighborhood for more than twenty years.",
    difficulty: "EASY",
    explanation: "Dấu hiệu 'for + khoảng thời gian' (for more than twenty years) chỉ hành động kéo dài từ quá khứ đến hiện tại -> Hiện tại hoàn thành.",
    options: ["live", "lived", "have lived", "are living"],
    correctIndex: 2
  },
  {
    skillId: SKILL_TENSES_ID,
    content: "Yesterday afternoon, Lan ________ her bicycle to school when it started raining.",
    difficulty: "EASY",
    explanation: "Hành động đang diễn ra trong quá khứ (was riding) thì có một hành động khác xen ngang (started).",
    options: ["rides", "was riding", "has ridden", "is riding"],
    correctIndex: 1
  },
  {
    skillId: SKILL_TENSES_ID,
    content: "She usually ________ badminton with her friends every Sunday morning.",
    difficulty: "EASY",
    explanation: "Dấu hiệu trạng từ tần suất 'usually' và 'every Sunday' chỉ thói quen -> thì Hiện tại đơn.",
    options: ["play", "plays", "played", "is playing"],
    correctIndex: 1
  },
  {
    skillId: SKILL_TENSES_ID,
    content: "Last summer holiday, our family ________ Da Nang and Hue imperial city.",
    difficulty: "EASY",
    explanation: "Mốc thời gian 'Last summer holiday' thuộc quá khứ đã chấm dứt hoàn toàn -> Quá khứ đơn.",
    options: ["visits", "visited", "has visited", "was visiting"],
    correctIndex: 1
  },
  {
    skillId: SKILL_TENSES_ID,
    content: "My father ________ coffee in the morning; he prefers hot tea.",
    difficulty: "EASY",
    explanation: "Phủ định ở thì Hiện tại đơn với chủ ngữ ngôi thứ ba số ít 'My father' dùng trợ động từ 'doesn't drink'.",
    options: ["don't drink", "doesn't drink", "isn't drinking", "hasn't drunk"],
    correctIndex: 1
  },
  {
    skillId: SKILL_TENSES_ID,
    content: "By next July, professor David ________ at Cambridge University for thirty years.",
    difficulty: "MEDIUM",
    explanation: "Cấu trúc 'By + mốc thời gian tương lai' (By next July) kết hợp 'for 30 years' -> Tương lai hoàn thành: will have + V3/ed.",
    options: ["will teach", "will be teaching", "will have taught", "has taught"],
    correctIndex: 2
  },
  {
    skillId: SKILL_TENSES_ID,
    content: "When we reached the stadium, the concert ________ already.",
    difficulty: "MEDIUM",
    explanation: "Hành động buổi biểu diễn bắt đầu trước khi chúng tôi đến sân vận động -> Quá khứ hoàn thành (had begun).",
    options: ["began", "has begun", "had begun", "was beginning"],
    correctIndex: 2
  },
  {
    skillId: SKILL_TENSES_ID,
    content: "Don't phone me between 8 and 9 tonight because I ________ an important online meeting.",
    difficulty: "MEDIUM",
    explanation: "Hành động sẽ đang diễn ra tại một thời điểm xác định trong tương lai -> Tương lai tiếp diễn (will be + V-ing).",
    options: ["attend", "will attend", "will be attending", "have attended"],
    correctIndex: 2
  },
  {
    skillId: SKILL_TENSES_ID,
    content: "This is the first time I ________ such a breathtaking panoramic landscape.",
    difficulty: "MEDIUM",
    explanation: "Cấu trúc 'This is the first/second time + S + have/has + V3/ed' (Hiện tại hoàn thành).",
    options: ["see", "saw", "have seen", "had seen"],
    correctIndex: 2
  },
  {
    skillId: SKILL_TENSES_ID,
    content: "Hardly ________ home when the heavy storm broke out.",
    difficulty: "MEDIUM",
    explanation: "Cấu trúc đảo ngữ với Hardly: 'Hardly had + S + V3/ed + when + S + V2/ed'.",
    options: ["had he arrived", "he had arrived", "did he arrive", "was he arriving"],
    correctIndex: 0
  },
  {
    skillId: SKILL_TENSES_ID,
    content: "Up to now, the charity organization ________ millions of dollars for flood victims.",
    difficulty: "MEDIUM",
    explanation: "Cụm từ 'Up to now' (cho đến nay) là dấu hiệu điển hình của thì Hiện tại hoàn thành.",
    options: ["raised", "has raised", "was raising", "is raising"],
    correctIndex: 1
  },
  {
    skillId: SKILL_TENSES_ID,
    content: "She looked exhausted because she ________ non-stop all morning.",
    difficulty: "MEDIUM",
    explanation: "Hành động làm việc liên tục cả buổi sáng dẫn đến kết quả trong quá khứ 'looked exhausted' -> Quá khứ hoàn thành tiếp diễn (had been working).",
    options: ["has worked", "had been working", "was working", "worked"],
    correctIndex: 1
  },
  {
    skillId: SKILL_TENSES_ID,
    content: "At this exact time yesterday, we ________ the high-speed bullet train to Tokyo.",
    difficulty: "MEDIUM",
    explanation: "Thời điểm xác định trong quá khứ 'At this exact time yesterday' -> Quá khứ tiếp diễn (were boarding).",
    options: ["boarded", "were boarding", "had boarded", "have boarded"],
    correctIndex: 1
  },
  {
    skillId: SKILL_TENSES_ID,
    content: "No sooner ________ the contract than the economic crisis was officially declared.",
    difficulty: "HARD",
    explanation: "Đảo ngữ: 'No sooner had + S + V3/ed + than + S + V2/ed'.",
    options: ["did they sign", "had they signed", "they had signed", "would they sign"],
    correctIndex: 1
  },
  {
    skillId: SKILL_TENSES_ID,
    content: "By the end of this century, scientists estimate that global temperatures ________ by at least 2 degrees.",
    difficulty: "HARD",
    explanation: "Cấu trúc 'By the end of this century' (mốc tương lai) diễn tả hành động sẽ hoàn tất trước thời điểm đó -> Tương lai hoàn thành (will have risen).",
    options: ["will rise", "are rising", "will have risen", "have risen"],
    correctIndex: 2
  },
  {
    skillId: SKILL_TENSES_ID,
    content: "It is essential that every delegate ________ the orientation session on international security.",
    difficulty: "HARD",
    explanation: "Thức giả định (Subjunctive mood): 'It is essential that + S + (should) V nguyên mẫu' -> 'attend'.",
    options: ["attends", "attended", "attend", "is attending"],
    correctIndex: 2
  },
  {
    skillId: SKILL_TENSES_ID,
    content: "Scarcely ________ into the lecture hall when the professor began his discourse.",
    difficulty: "HARD",
    explanation: "Cấu trúc đảo ngữ: 'Scarcely had + S + V3/ed + when + S + V2/ed'.",
    options: ["had the students stepped", "the students had stepped", "did the students step", "were the students stepping"],
    correctIndex: 0
  },
  {
    skillId: SKILL_TENSES_ID,
    content: "He spoke about the ancient monuments as though he ________ there in person centuries ago.",
    difficulty: "HARD",
    explanation: "'as though' nói về giả định trái ngược với quá khứ (centuries ago) dùng thì Quá khứ hoàn thành 'had been'.",
    options: ["was", "were", "had been", "would be"],
    correctIndex: 2
  },

  // ==========================================
  // 2. PASSIVE VOICE (15 câu: 5 Easy, 6 Medium, 4 Hard)
  // ==========================================
  {
    skillId: SKILL_PASSIVE_ID,
    content: "English ________ as an official language in numerous countries across the globe.",
    difficulty: "EASY",
    explanation: "Bị động ở Hiện tại đơn: S + is/am/are + V3/ed. 'English' là danh từ không đếm được -> 'is spoken'.",
    options: ["is speaking", "is spoken", "speaks", "was spoken"],
    correctIndex: 1
  },
  {
    skillId: SKILL_PASSIVE_ID,
    content: "This historic bridge ________ by French engineers in 1898.",
    difficulty: "EASY",
    explanation: "Bị động ở Quá khứ đơn (mốc 1898): S + was/were + V3/ed -> 'was constructed'.",
    options: ["constructed", "was constructed", "has constructed", "is constructed"],
    correctIndex: 1
  },
  {
    skillId: SKILL_PASSIVE_ID,
    content: "The final exam results ________ on the school bulletin board next Monday.",
    difficulty: "EASY",
    explanation: "Bị động ở Tương lai đơn: will be + V3/ed.",
    options: ["will post", "will be posted", "are posted", "were posted"],
    correctIndex: 1
  },
  {
    skillId: SKILL_PASSIVE_ID,
    content: "All mobile phones must ________ during the examination period.",
    difficulty: "EASY",
    explanation: "Bị động với động từ khuyết thiếu (modal verb): modal + be + V3/ed -> 'must be turned off'.",
    options: ["turn off", "be turned off", "being turned off", "turned off"],
    correctIndex: 1
  },
  {
    skillId: SKILL_PASSIVE_ID,
    content: "A new shopping mall ________ near my house at the present time.",
    difficulty: "EASY",
    explanation: "Bị động ở Hiện tại tiếp diễn: is/am/are + being + V3/ed.",
    options: ["is built", "is being built", "was built", "has built"],
    correctIndex: 1
  },
  {
    skillId: SKILL_PASSIVE_ID,
    content: "The antique vase ________ to be more than five hundred years old.",
    difficulty: "MEDIUM",
    explanation: "Cấu trúc bị động khách quan: 'S + is/are thought/said/believed + to V' -> 'is believed'.",
    options: ["believes", "is believing", "is believed", "has believed"],
    correctIndex: 2
  },
  {
    skillId: SKILL_PASSIVE_ID,
    content: "She remembers ________ to the national botanical gardens by her grandfather when she was six.",
    difficulty: "MEDIUM",
    explanation: "Cấu trúc bị động với remember: 'remember being + V3/ed' (nhớ đã được ai đó làm gì cho).",
    options: ["to take", "taking", "being taken", "to be taken"],
    correctIndex: 2
  },
  {
    skillId: SKILL_PASSIVE_ID,
    content: "He had his personal computer ________ by a professional technician yesterday.",
    difficulty: "MEDIUM",
    explanation: "Cấu trúc truyền khiến (causative form): have something done (V3/ed) -> 'repaired'.",
    options: ["repair", "to repair", "repaired", "repairing"],
    correctIndex: 2
  },
  {
    skillId: SKILL_PASSIVE_ID,
    content: "It is reported that thousands of trees ________ down during the severe typhoon.",
    difficulty: "MEDIUM",
    explanation: "Mệnh đề sau 'It is reported that' chia bị động thì Quá khứ đơn 'were blown'.",
    options: ["blew", "were blown", "have blown", "are blowing"],
    correctIndex: 1
  },
  {
    skillId: SKILL_PASSIVE_ID,
    content: "The thief avoided ________ by disguising himself as a delivery man.",
    difficulty: "MEDIUM",
    explanation: "Cấu trúc 'avoid being + V3/ed' (tránh bị phát hiện/bắt giữ) -> 'being recognized'.",
    options: ["recognizing", "to recognize", "being recognized", "to be recognized"],
    correctIndex: 2
  },
  {
    skillId: SKILL_PASSIVE_ID,
    content: "The proposal is expected ________ by the board of directors before the end of the quarter.",
    difficulty: "MEDIUM",
    explanation: "'is expected to be + V3/ed' chỉ sự việc được mong đợi sẽ được phê chuẩn.",
    options: ["approving", "to approve", "to be approved", "being approved"],
    correctIndex: 2
  },
  {
    skillId: SKILL_PASSIVE_ID,
    content: "The suspect is believed ________ the country on a falsified foreign passport last week.",
    difficulty: "HARD",
    explanation: "Bị động kép: 'S + is believed + to have + V3/ed' khi hành động xảy ra trước thời điểm nói (last week).",
    options: ["to leave", "leaving", "to have left", "having left"],
    correctIndex: 2
  },
  {
    skillId: SKILL_PASSIVE_ID,
    content: "No further action need ________ until all committee members submit their evaluations.",
    difficulty: "HARD",
    explanation: "'need' ở đây là modal verb: 'need be + V3/ed' -> 'need be taken'.",
    options: ["take", "to take", "be taken", "to be taken"],
    correctIndex: 2
  },
  {
    skillId: SKILL_PASSIVE_ID,
    content: "The manuscript was rumored ________ lost in a mysterious fire centuries ago.",
    difficulty: "HARD",
    explanation: "Cấu trúc bị động: 'was rumored to have been + V3/ed' (đã được đồn đại là đã bị thất lạc trong quá khứ).",
    options: ["to be", "to have been", "being", "having been"],
    correctIndex: 1
  },
  {
    skillId: SKILL_PASSIVE_ID,
    content: "Under no circumstances should sensitive corporate data ________ on personal devices.",
    difficulty: "HARD",
    explanation: "Đảo ngữ với cụm từ phủ định 'Under no circumstances' kết hợp bị động: 'should + S + be + V3/ed' -> 'be stored'.",
    options: ["store", "be stored", "being stored", "have stored"],
    correctIndex: 1
  },

  // ==========================================
  // 3. CONDITIONALS & WISHES (15 câu: 5 Easy, 6 Medium, 4 Hard)
  // ==========================================
  {
    skillId: SKILL_CONDITIONALS_ID,
    content: "If the weather ________ fine tomorrow morning, we will organize an outdoor picnic.",
    difficulty: "EASY",
    explanation: "Câu điều kiện loại 1: Mệnh đề If chia Hiện tại đơn (is), mệnh đề chính dùng will + V.",
    options: ["is", "was", "will be", "would be"],
    correctIndex: 0
  },
  {
    skillId: SKILL_CONDITIONALS_ID,
    content: "If I ________ a billionaire, I would establish free modern hospitals for impoverished children.",
    difficulty: "EASY",
    explanation: "Câu điều kiện loại 2: Mệnh đề If dùng were cho mọi ngôi, mệnh đề chính dùng would + V.",
    options: ["am", "were", "will be", "had been"],
    correctIndex: 1
  },
  {
    skillId: SKILL_CONDITIONALS_ID,
    content: "I wish I ________ more leisure time to pursue my passion for painting.",
    difficulty: "EASY",
    explanation: "Câu ước ở hiện tại: 'S + wish + S + V2/ed' -> 'had'.",
    options: ["have", "had", "will have", "would have had"],
    correctIndex: 1
  },
  {
    skillId: SKILL_CONDITIONALS_ID,
    content: "If you heat water to 100 degrees Celsius, it ________ into steam.",
    difficulty: "EASY",
    explanation: "Câu điều kiện loại 0 (quy luật vật lý): If + Hiện tại đơn, Hiện tại đơn -> 'turns'.",
    options: ["turns", "turned", "will turn", "would turn"],
    correctIndex: 0
  },
  {
    skillId: SKILL_CONDITIONALS_ID,
    content: "You will fail the driving test ________ you practice parallel parking diligently.",
    difficulty: "EASY",
    explanation: "'unless' = if not (trừ khi / nếu không). 'Bạn sẽ trượt kỳ thi lái xe trừ khi bạn luyện tập chăm chỉ'.",
    options: ["if", "unless", "provided", "as long as"],
    correctIndex: 1
  },
  {
    skillId: SKILL_CONDITIONALS_ID,
    content: "If she had checked the train schedule beforehand, she ________ the last express train.",
    difficulty: "MEDIUM",
    explanation: "Câu điều kiện loại 3: If + had + V3/ed, S + would have + V3/ed -> 'wouldn't have missed'.",
    options: ["won't miss", "wouldn't miss", "wouldn't have missed", "didn't miss"],
    correctIndex: 2
  },
  {
    skillId: SKILL_CONDITIONALS_ID,
    content: "I wish I ________ that unkind remark to my best friend yesterday.",
    difficulty: "MEDIUM",
    explanation: "Câu ước cho sự việc đã xảy ra trong quá khứ (yesterday): 'wish + S + had (not) + V3/ed' -> 'hadn't made'.",
    options: ["didn't make", "haven't made", "hadn't made", "wouldn't make"],
    correctIndex: 2
  },
  {
    skillId: SKILL_CONDITIONALS_ID,
    content: "If he had taken my advice earlier, he ________ in such a precarious dilemma right now.",
    difficulty: "MEDIUM",
    explanation: "Câu điều kiện trộn (Mixed conditional): Giả thiết quá khứ (had taken) kết hợp kết quả hiện tại ('right now') -> 'wouldn't be'.",
    options: ["won't be", "wouldn't be", "wouldn't have been", "isn't"],
    correctIndex: 1
  },
  {
    skillId: SKILL_CONDITIONALS_ID,
    content: "Provided that you ________ all confidential guidelines, you may access the laboratory.",
    difficulty: "MEDIUM",
    explanation: "'Provided that' tương đương 'If' trong câu điều kiện loại 1 -> mệnh đề phụ chia Hiện tại đơn.",
    options: ["follow", "followed", "will follow", "have followed"],
    correctIndex: 0
  },
  {
    skillId: SKILL_CONDITIONALS_ID,
    content: "Without your timely assistance, we ________ our master thesis on time.",
    difficulty: "MEDIUM",
    explanation: "'Without + N' tương đương mệnh đề If loại 3: 'wouldn't have completed'.",
    options: ["couldn't complete", "wouldn't have completed", "won't complete", "haven't completed"],
    correctIndex: 1
  },
  {
    skillId: SKILL_CONDITIONALS_ID,
    content: "________ any urgent inquiries arise, do not hesitate to contact customer support.",
    difficulty: "MEDIUM",
    explanation: "Đảo ngữ câu điều kiện loại 1: 'Should + S + V nguyên mẫu' -> 'Should any urgent inquiries arise'.",
    options: ["Were", "Had", "Should", "If"],
    correctIndex: 2
  },
  {
    skillId: SKILL_CONDITIONALS_ID,
    content: "________ for his courageous intervention, the young boy would have drowned in the river.",
    difficulty: "HARD",
    explanation: "Đảo ngữ câu điều kiện loại 3 với cụm 'Had it not been for + N' (Nếu không nhờ có...).",
    options: ["Were it not", "Had it not been", "If it were not", "Should it not be"],
    correctIndex: 1
  },
  {
    skillId: SKILL_CONDITIONALS_ID,
    content: "Were she ________ the true nature of his intentions, she would break off the engagement immediately.",
    difficulty: "HARD",
    explanation: "Đảo ngữ câu điều kiện loại 2 với động từ thường: 'Were + S + to V' -> 'Were she to know'.",
    options: ["know", "to know", "known", "knowing"],
    correctIndex: 1
  },
  {
    skillId: SKILL_CONDITIONALS_ID,
    content: "If only our flight ________ canceled, we would be enjoying our holiday on the tropical island now.",
    difficulty: "HARD",
    explanation: "Câu ước / điều kiện trộn: Mệnh đề 'If only' diễn tả nguyên nhân quá khứ (had not been canceled), kết quả hiện tại ('now').",
    options: ["wasn't", "weren't", "hadn't been", "wouldn't be"],
    correctIndex: 2
  },
  {
    skillId: SKILL_CONDITIONALS_ID,
    content: "But for the prompt medical treatment, the injured soldier ________ of severe blood loss.",
    difficulty: "HARD",
    explanation: "'But for + N' tương đương 'If it had not been for...' trong quá khứ -> Mệnh đề chính dùng 'would have died'.",
    options: ["would die", "died", "would have died", "had died"],
    correctIndex: 2
  },

  // ==========================================
  // 4. RELATIVE CLAUSES (15 câu: 5 Easy, 6 Medium, 4 Hard)
  // ==========================================
  {
    skillId: SKILL_RELATIVES_ID,
    content: "The experienced doctor ________ examined my grandfather yesterday was very dedicated.",
    difficulty: "EASY",
    explanation: "Đại từ quan hệ 'who' thay thế cho danh từ chỉ người 'The experienced doctor' đóng vai trò chủ ngữ.",
    options: ["which", "who", "whom", "whose"],
    correctIndex: 1
  },
  {
    skillId: SKILL_RELATIVES_ID,
    content: "The scientific textbook ________ covers quantum physics is on the second shelf.",
    difficulty: "EASY",
    explanation: "Đại từ quan hệ 'which' (hoặc 'that') thay thế cho danh từ chỉ vật 'The scientific textbook'.",
    options: ["who", "whom", "which", "whose"],
    correctIndex: 2
  },
  {
    skillId: SKILL_RELATIVES_ID,
    content: "This is the renowned author ________ latest historical novel won the international prize.",
    difficulty: "EASY",
    explanation: "Đại từ quan hệ sở hữu 'whose' đứng trước danh từ 'latest historical novel'.",
    options: ["who", "whom", "whose", "which"],
    correctIndex: 2
  },
  {
    skillId: SKILL_RELATIVES_ID,
    content: "The coastal town ________ we spent our summer vacation was incredibly scenic.",
    difficulty: "EASY",
    explanation: "Trạng từ quan hệ 'where' thay thế cho cụm trạng từ chỉ nơi chốn (in which).",
    options: ["which", "where", "when", "why"],
    correctIndex: 1
  },
  {
    skillId: SKILL_RELATIVES_ID,
    content: "I still remember the unforgettable day ________ I first entered university.",
    difficulty: "EASY",
    explanation: "Trạng từ quan hệ 'when' thay thế cho mốc thời gian 'the unforgettable day'.",
    options: ["where", "when", "which", "why"],
    correctIndex: 1
  },
  {
    skillId: SKILL_RELATIVES_ID,
    content: "The students ________ by the university were given full academic scholarships.",
    difficulty: "MEDIUM",
    explanation: "Rút gọn mệnh đề quan hệ dạng bị động: 'who were selected' -> rút gọn thành V3/ed 'selected'.",
    options: ["selecting", "selected", "were selected", "who selecting"],
    correctIndex: 1
  },
  {
    skillId: SKILL_RELATIVES_ID,
    content: "Anyone ________ to participate in the marathon must register before Friday noon.",
    difficulty: "MEDIUM",
    explanation: "Rút gọn mệnh đề quan hệ dạng chủ động: 'who wishes' -> 'wishing'.",
    options: ["wished", "wishing", "wishes", "is wishing"],
    correctIndex: 1
  },
  {
    skillId: SKILL_RELATIVES_ID,
    content: "The prestigious company has three branches, all of ________ are located in major metropolises.",
    difficulty: "MEDIUM",
    explanation: "Đại từ quan hệ sau lượng từ 'all of' chỉ vật 'three branches' phải là 'which'.",
    options: ["whom", "which", "that", "them"],
    correctIndex: 1
  },
  {
    skillId: SKILL_RELATIVES_ID,
    content: "The lady with ________ you were conversing at the reception is the university chancellor.",
    difficulty: "MEDIUM",
    explanation: "Sau giới từ 'with' chỉ người, ta bắt buộc dùng đại từ quan hệ 'whom'.",
    options: ["who", "whom", "which", "whose"],
    correctIndex: 1
  },
  {
    skillId: SKILL_RELATIVES_ID,
    content: "Neil Armstrong was the first astronaut ________ on the surface of the moon.",
    difficulty: "MEDIUM",
    explanation: "Rút gọn mệnh đề quan hệ sau từ chỉ thứ tự 'the first/second/last' dùng 'to V' -> 'to set foot'.",
    options: ["setting foot", "to set foot", "set foot", "sets foot"],
    correctIndex: 1
  },
  {
    skillId: SKILL_RELATIVES_ID,
    content: "He passed the entrance examination with stellar grades, ________ delighted his entire family.",
    difficulty: "MEDIUM",
    explanation: "Đại từ quan hệ 'which' đứng sau dấu phẩy thay thế cho cả mệnh đề đứng trước.",
    options: ["that", "which", "what", "who"],
    correctIndex: 1
  },
  {
    skillId: SKILL_RELATIVES_ID,
    content: "The rare botanical specimen, the origin of ________ remains obscure, is kept in a climate-controlled vault.",
    difficulty: "HARD",
    explanation: "Cụm 'the origin of which' chỉ vật thuộc về 'The rare botanical specimen'.",
    options: ["whom", "that", "which", "whose"],
    correctIndex: 2
  },
  {
    skillId: SKILL_RELATIVES_ID,
    content: "There were fifty applicants for the executive position, none of ________ possessed sufficient management experience.",
    difficulty: "HARD",
    explanation: "Lượng từ + of + whom chỉ người: 'none of whom' thay thế cho 'fifty applicants'.",
    options: ["them", "which", "whom", "who"],
    correctIndex: 2
  },
  {
    skillId: SKILL_RELATIVES_ID,
    content: "The complex theory ________ by the Nobel laureate in physics transformed modern astronomy.",
    difficulty: "HARD",
    explanation: "Rút gọn mệnh đề quan hệ dạng bị động: 'which was expounded' -> 'expounded'.",
    options: ["expounded", "expounding", "to expound", "was expounded"],
    correctIndex: 0
  },
  {
    skillId: SKILL_RELATIVES_ID,
    content: "The historic city wall, parts of ________ date back to the 11th century, is being restored.",
    difficulty: "HARD",
    explanation: "Cụm danh từ sở hữu kết hợp đại từ quan hệ: 'parts of which' (các phần của bức tường thành).",
    options: ["whose", "which", "that", "whom"],
    correctIndex: 1
  },

  // ==========================================
  // 5. VOCABULARY & COLLOCATIONS (20 câu: 6 Easy, 8 Medium, 6 Hard)
  // ==========================================
  {
    skillId: SKILL_VOCAB_ID,
    content: "Regular physical exercise is extremely ________ to mental and cardiovascular health.",
    difficulty: "EASY",
    explanation: "Cụm tính từ: 'beneficial to sth' (có lợi, bổ ích cho cái gì).",
    options: ["harmful", "beneficial", "dangerous", "careless"],
    correctIndex: 1
  },
  {
    skillId: SKILL_VOCAB_ID,
    content: "She made a brilliant ________ at the international symposium yesterday.",
    difficulty: "EASY",
    explanation: "Collocation: 'make a presentation' (thuyết trình, trình bày báo cáo).",
    options: ["speech", "presentation", "lecture", "talk"],
    correctIndex: 1
  },
  {
    skillId: SKILL_VOCAB_ID,
    content: "Deforestation causes severe habitat ________ for thousands of endangered animal species.",
    difficulty: "EASY",
    explanation: "Cụm danh từ: 'habitat loss' (mất môi trường sống).",
    options: ["loss", "gain", "finding", "place"],
    correctIndex: 0
  },
  {
    skillId: SKILL_VOCAB_ID,
    content: "Remember to ________ off the electronic devices before leaving the office.",
    difficulty: "EASY",
    explanation: "Phrasal verb: 'switch off' hoặc 'turn off' (tắt thiết bị điện).",
    options: ["take", "switch", "give", "put"],
    correctIndex: 1
  },
  {
    skillId: SKILL_VOCAB_ID,
    content: "He has a great sense of ________; he always makes his classmates laugh.",
    difficulty: "EASY",
    explanation: "Idiom / Collocation: 'sense of humor' (khiếu hài hước).",
    options: ["humor", "direction", "duty", "responsibility"],
    correctIndex: 0
  },
  {
    skillId: SKILL_VOCAB_ID,
    content: "Smoking has a very negative ________ on lung capacity and overall wellness.",
    difficulty: "EASY",
    explanation: "Collocation: 'have an effect/impact on sth' (có tác động tiêu cực đến).",
    options: ["affect", "effect", "effective", "effectively"],
    correctIndex: 1
  },
  {
    skillId: SKILL_VOCAB_ID,
    content: "The government has implemented strict measures to ________ air pollution in urban centers.",
    difficulty: "MEDIUM",
    explanation: "Động từ 'curb' / 'tackle' (kiểm soát, hạn chế sự gia tăng tiêu cực). 'curb pollution'.",
    options: ["enhance", "curb", "promote", "stimulate"],
    correctIndex: 1
  },
  {
    skillId: SKILL_VOCAB_ID,
    content: "After three hours of fierce debate, the delegates finally reached a ________.",
    difficulty: "MEDIUM",
    explanation: "Collocation: 'reach a consensus / compromise' (đạt được sự đồng thuận / thỏa hiệp).",
    options: ["consensus", "conflict", "barrier", "contradiction"],
    correctIndex: 0
  },
  {
    skillId: SKILL_VOCAB_ID,
    content: "She decided to ________ for a prestigious master degree scholarship in the United Kingdom.",
    difficulty: "MEDIUM",
    explanation: "Phrasal verb: 'apply for a scholarship' (nộp hồ sơ ứng tuyển học bổng).",
    options: ["apply", "ask", "call", "look"],
    correctIndex: 0
  },
  {
    skillId: SKILL_VOCAB_ID,
    content: "Due to unforeseen circumstances, the organizing committee had to ________ off the musical festival.",
    difficulty: "MEDIUM",
    explanation: "Phrasal verb: 'call off' (hủy bỏ một sự kiện). 'put off' = hoãn lại.",
    options: ["put", "call", "take", "give"],
    correctIndex: 1
  },
  {
    skillId: SKILL_VOCAB_ID,
    content: "Artificial intelligence is playing an increasingly ________ role in modern healthcare diagnostics.",
    difficulty: "MEDIUM",
    explanation: "Collocation: 'play a vital/pivotal/crucial role in' (đóng vai trò trọng yếu/then chốt).",
    options: ["pivotal", "minor", "trivial", "passive"],
    correctIndex: 0
  },
  {
    skillId: SKILL_VOCAB_ID,
    content: "He has a reputation for being extremely ________; he never changes his mind easily.",
    difficulty: "MEDIUM",
    explanation: "Tính từ 'stubborn' / 'obstinate' (bướng bỉnh, cứng đầu, bảo thủ).",
    options: ["flexible", "stubborn", "adaptable", "open-minded"],
    correctIndex: 1
  },
  {
    skillId: SKILL_VOCAB_ID,
    content: "The young entrepreneur managed to establish a thriving startup against all ________.",
    difficulty: "MEDIUM",
    explanation: "Idiom: 'against all odds' (vượt qua mọi nghịch cảnh, khó khăn trắc trở).",
    options: ["odds", "chances", "risks", "dangers"],
    correctIndex: 0
  },
  {
    skillId: SKILL_VOCAB_ID,
    content: "The new automated software has significantly ________ workplace efficiency.",
    difficulty: "MEDIUM",
    explanation: "Động từ 'boost' / 'enhance' (nâng cao, thúc đẩy năng suất, hiệu quả làm việc).",
    options: ["hindered", "boosted", "delayed", "lowered"],
    correctIndex: 1
  },
  {
    skillId: SKILL_VOCAB_ID,
    content: "The investigative journalist unearthed ________ evidence of high-level administrative corruption.",
    difficulty: "HARD",
    explanation: "Collocation: 'irrefutable/compelling evidence' (chứng cứ không thể chối cãi, hoàn toàn thuyết phục).",
    options: ["irrefutable", "doubtful", "tentative", "negligible"],
    correctIndex: 0
  },
  {
    skillId: SKILL_VOCAB_ID,
    content: "Her cutting-edge research has made an ________ contribution to the treatment of genetic disorders.",
    difficulty: "HARD",
    explanation: "Collocation: 'invaluable/immeasurable contribution' (đóng góp vô giá / cực kỳ to lớn).",
    options: ["invaluable", "worthless", "ineffective", "indifferent"],
    correctIndex: 0
  },
  {
    skillId: SKILL_VOCAB_ID,
    content: "He was on pins and ________ while waiting for the board's decision regarding his promotion.",
    difficulty: "HARD",
    explanation: "Idiom: 'on pins and needles' (bồn chồn, sốt ruột, lo lắng đứng ngồi không yên).",
    options: ["needles", "threads", "stones", "wires"],
    correctIndex: 0
  },
  {
    skillId: SKILL_VOCAB_ID,
    content: "The company's marketing strategy proved to be a white ________, consuming immense capital with zero return.",
    difficulty: "HARD",
    explanation: "Idiom: 'a white elephant' (một thứ tốn kém tiền của duy trì nhưng hoàn toàn vô dụng).",
    options: ["elephant", "horse", "tiger", "swan"],
    correctIndex: 0
  },
  {
    skillId: SKILL_VOCAB_ID,
    content: "The new legislation aims to ________ the systemic disparities between urban and rural school districts.",
    difficulty: "HARD",
    explanation: "Động từ 'bridge the gap/disparities' hoặc 'ameliorate / eradicate' (thu hẹp/cải thiện sự chênh lệch).",
    options: ["bridge", "widen", "aggravate", "prolong"],
    correctIndex: 0
  },
  {
    skillId: SKILL_VOCAB_ID,
    content: "The diplomat handled the delicate bilateral dispute with consummate ________.",
    difficulty: "HARD",
    explanation: "Collocation: 'with consummate tact / skill' (với sự khéo léo, tế nhị tột bậc).",
    options: ["tact", "tactics", "bluntness", "hesitation"],
    correctIndex: 0
  },

  // ==========================================
  // 6. READING & SENTENCE COMPLETION (15 câu: 4 Easy, 6 Medium, 5 Hard)
  // ==========================================
  {
    skillId: SKILL_READING_ID,
    content: "Renewable energy sources such as wind and solar are sustainable, ________ they do not deplete natural resources.",
    difficulty: "EASY",
    explanation: "Liên từ chỉ nguyên nhân: 'because' / 'as' / 'since' (bởi vì năng lượng tái tạo không làm cạn kiệt tài nguyên).",
    options: ["although", "because", "unless", "so that"],
    correctIndex: 1
  },
  {
    skillId: SKILL_READING_ID,
    content: "He studied diligently day and night; ________, he achieved the highest honors in the exam.",
    difficulty: "EASY",
    explanation: "Trạng từ liên kết chỉ kết quả: 'therefore' (do đó, vì vậy).",
    options: ["however", "therefore", "nevertheless", "otherwise"],
    correctIndex: 1
  },
  {
    skillId: SKILL_READING_ID,
    content: "________ the torrential rainstorm, the open-air festival was attended by thousands of spectators.",
    difficulty: "EASY",
    explanation: "'Despite / In spite of + Noun phrase' diễn tả sự nhượng bộ (Mặc cho cơn mưa xối xả).",
    options: ["Despite", "Although", "Because of", "Since"],
    correctIndex: 0
  },
  {
    skillId: SKILL_READING_ID,
    content: "You should carry an umbrella with you in ________ it rains later this afternoon.",
    difficulty: "EASY",
    explanation: "Cụm liên từ: 'in case + S + V' (phòng khi, phòng trường hợp trời mưa).",
    options: ["case", "order", "fact", "view"],
    correctIndex: 0
  },
  {
    skillId: SKILL_READING_ID,
    content: "________ had the keynote speaker stepped onto the stage than the audience erupted into applause.",
    difficulty: "MEDIUM",
    explanation: "Cấu trúc đảo ngữ: 'No sooner had + S + V3/ed + than...'.",
    options: ["Scarcely", "Hardly", "No sooner", "Barely"],
    correctIndex: 2
  },
  {
    skillId: SKILL_READING_ID,
    content: "The team conducted thorough research in order ________ misleading statistical conclusions.",
    difficulty: "MEDIUM",
    explanation: "Cấu trúc chỉ mục đích phủ định: 'in order to avoid + N' hoặc 'in order not to draw'.",
    options: ["to avoid", "avoiding", "avoid", "to avoiding"],
    correctIndex: 0
  },
  {
    skillId: SKILL_READING_ID,
    content: "Neither the school principal nor the faculty members ________ willing to compromise on academic standards.",
    difficulty: "MEDIUM",
    explanation: "Quy tắc hòa hợp chủ ngữ: 'Neither S1 nor S2 + V chia theo S2'. S2 là 'the faculty members' số nhiều -> 'were'.",
    options: ["was", "were", "is", "be"],
    correctIndex: 1
  },
  {
    skillId: SKILL_READING_ID,
    content: "Not only ________ the first prize in the national contest, but he was also awarded a scholarship.",
    difficulty: "MEDIUM",
    explanation: "Đảo ngữ với 'Not only': 'Not only did he win... but he was also...'.",
    options: ["he won", "did he win", "he had won", "was he winning"],
    correctIndex: 1
  },
  {
    skillId: SKILL_READING_ID,
    content: "So intricate ________ that even seasoned cryptographers struggled to decipher its contents.",
    difficulty: "MEDIUM",
    explanation: "Đảo ngữ với 'So': 'So + Adj + be + S + that...' -> 'So intricate was the encoded message that...'.",
    options: ["was the encoded message", "the encoded message was", "did the encoded message", "is the encoded message"],
    correctIndex: 0
  },
  {
    skillId: SKILL_READING_ID,
    content: "The higher the altitude of the mountain trail, ________ the oxygen levels become.",
    difficulty: "MEDIUM",
    explanation: "So sánh kép (Double comparative): 'The + so sánh hơn..., the + so sánh hơn...' -> 'the lower'.",
    options: ["the lowest", "lower", "the lower", "lowest"],
    correctIndex: 2
  },
  {
    skillId: SKILL_READING_ID,
    content: "Much ________ they admired his artistic genius, the patrons could not condone his eccentric behavior.",
    difficulty: "HARD",
    explanation: "Cấu trúc nhượng bộ đặc biệt: 'Much as + S + V' = 'Although + S + V very much' (Dù cho họ rất ngưỡng mộ...).",
    options: ["as", "like", "although", "despite"],
    correctIndex: 0
  },
  {
    skillId: SKILL_READING_ID,
    content: "________ was the intensity of the earthquake that several high-rise structures sustained structural damage.",
    difficulty: "HARD",
    explanation: "Đảo ngữ với 'Such': 'Such + be + Noun + that...' (Trận động đất dữ dội đến mức...).",
    options: ["So", "Such", "How", "Too"],
    correctIndex: 1
  },
  {
    skillId: SKILL_READING_ID,
    content: "Only by implementing comprehensive educational reforms ________ close the persistent achievement gap.",
    difficulty: "HARD",
    explanation: "Đảo ngữ với 'Only by + V-ing': 'Only by... can we + V' -> 'can we hope to close'.",
    options: ["we can hope to", "can we hope to", "we hope can", "hope we can to"],
    correctIndex: 1
  },
  {
    skillId: SKILL_READING_ID,
    content: "Were it not for international humanitarian aid, the famine-stricken region ________ extreme devastation.",
    difficulty: "HARD",
    explanation: "Đảo ngữ điều kiện loại 2 giả định hiện tại / tương lai: 'would suffer'.",
    options: ["will suffer", "would suffer", "would have suffered", "suffered"],
    correctIndex: 1
  },
  {
    skillId: SKILL_READING_ID,
    content: "The CEO was reluctant to commit capital until the feasibility study ________ conclusive proof of profitability.",
    difficulty: "HARD",
    explanation: "Hành động nghiên cứu khả thi hoàn tất trước thời điểm trong quá khứ -> Quá khứ hoàn thành 'had provided'.",
    options: ["provides", "has provided", "had provided", "is providing"],
    correctIndex: 2
  }
];

async function seed() {
  console.log(`Starting seeding ${questions.length} questions into Question Bank ${QUESTION_BANK_ID}...`);
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const isVocab = q.skillId === SKILL_VOCAB_ID || q.skillId === SKILL_READING_ID;
    const moduleId = isVocab ? MODULE_VOCAB_ID : MODULE_GRAMMAR_ID;

    const payload = {
      questionBankId: QUESTION_BANK_ID,
      skillId: q.skillId,
      moduleId: moduleId,
      topicId: q.skillId,
      content: q.content,
      difficulty: q.difficulty,
      explanation: q.explanation,
      displayOrder: i + 29, // continuing from existing 28 questions
      options: q.options.map((optText, optIdx) => ({
        optionContent: optText,
        isCorrect: optIdx === q.correctIndex,
        displayOrder: optIdx + 1
      }))
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const text = await response.text();
        console.error(`[${i + 1}/${questions.length}] Failed: ${response.status} - ${text}`);
        failCount++;
      } else {
        successCount++;
        if (successCount % 10 === 0 || successCount === questions.length) {
          console.log(`Progress: ${successCount}/${questions.length} questions inserted successfully.`);
        }
      }
    } catch (err) {
      console.error(`[${i + 1}/${questions.length}] Error:`, err.message);
      failCount++;
    }
  }

  console.log(`\n========================================`);
  console.log(`Finished Seeding!`);
  console.log(`Successfully added: ${successCount} questions`);
  console.log(`Failed: ${failCount} questions`);
  console.log(`========================================`);
}

seed();

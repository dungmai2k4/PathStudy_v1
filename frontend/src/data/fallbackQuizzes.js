/* ── Fallback Mini-Quiz pools (5 questions per topic for random selection) ── */
export const FALLBACK_LESSON_QUIZZES = {
  present_perfect_form: [
    {
      question: "Cấu trúc câu khẳng định của thì Hiện tại hoàn thành với chủ ngữ số nhiều (I/We/You/They) là:",
      options: ["S + has + V3/ed", "S + have + V3/ed", "S + had + V3/ed", "S + have + V-ing"],
      answer: "S + have + V3/ed",
      explanation: "Chủ ngữ I/We/You/They đi với trợ động từ 'have' + động từ ở dạng quá khứ phân từ (V3/ed)."
    },
    {
      question: "Chọn câu đúng: She ___ in Hanoi since 2020.",
      options: ["lives", "has lived", "had lived", "lived"],
      answer: "has lived",
      explanation: "Diễn tả hành động bắt đầu trong quá khứ và kéo dài đến hiện tại với mốc 'since 2020'."
    },
    {
      question: "Câu phủ định của thì Hiện tại hoàn thành có dạng:",
      options: ["S + don't/doesn't + have + V3/ed", "S + haven't/hasn't + V3/ed", "S + haven't/hasn't + V-inf", "S + didn't + have + V3/ed"],
      answer: "S + haven't/hasn't + V3/ed",
      explanation: "Dạng phủ định thêm 'not' trực tiếp sau have/has: haven't / hasn't + V3/ed."
    },
    {
      question: "Cấu trúc câu hỏi nghi vấn Yes/No của thì Hiện tại hoàn thành là:",
      options: ["Have/Has + S + V3/ed?", "Do/Does + S + have + V3/ed?", "Did + S + have + V3/ed?", "Had + S + V-ing?"],
      answer: "Have/Has + S + V3/ed?",
      explanation: "Đảo trợ động từ Have/Has lên trước chủ ngữ: Have/Has + S + V3/ed?"
    },
    {
      question: "He ___ his passport, so he cannot board the plane now.",
      options: ["has lost", "lost", "had lost", "loses"],
      answer: "has lost",
      explanation: "Hành động làm mất hộ chiếu trong quá khứ để lại kết quả trực tiếp ở hiện tại (không thể lên máy bay)."
    }
  ],
  present_perfect_since_for: [
    {
      question: "Điền vào chỗ trống: I have studied English ___ five years.",
      options: ["since", "for", "in", "at"],
      answer: "for",
      explanation: "'five years' là một khoảng thời gian nên đi với giới từ 'for'."
    },
    {
      question: "Điền vào chỗ trống: She has worked here ___ last September.",
      options: ["for", "since", "during", "from"],
      answer: "since",
      explanation: "'last September' là mốc thời gian cụ thể trong quá khứ nên dùng 'since'."
    },
    {
      question: "Cụm từ nào sau đây đi với 'since'?",
      options: ["two weeks", "a long time", "2018", "ten months"],
      answer: "2018",
      explanation: "'2018' là mốc thời gian xác định nên đi với 'since', các phương án còn lại là khoảng thời gian (dùng 'for')."
    },
    {
      question: "Cụm từ nào sau đây đi với 'for'?",
      options: ["yesterday morning", "three days", "last Christmas", "she arrived"],
      answer: "three days",
      explanation: "'three days' là khoảng thời gian kéo dài, đi kèm giới từ 'for'."
    },
    {
      question: "We haven't seen each other ___ we left high school.",
      options: ["since", "for", "during", "ago"],
      answer: "since",
      explanation: "'we left high school' là một mệnh đề chỉ mốc sự kiện trong quá khứ, dùng 'since + clause'."
    }
  ],
  present_perfect_signals: [
    {
      question: "Vị trí thông thường của 'already' trong câu khẳng định thì Hiện tại hoàn thành là:",
      options: ["Đứng sau have/has và trước V3/ed", "Đứng ở đầu câu", "Đứng sau tân ngữ", "Đứng ở mệnh đề phụ"],
      answer: "Đứng sau have/has và trước V3/ed",
      explanation: "'already' thường đứng giữa trợ động từ have/has và quá khứ phân từ V3/ed."
    },
    {
      question: "Từ 'yet' thường xuất hiện ở đâu trong thì Hiện tại hoàn thành?",
      options: ["Cuối câu phủ định và câu hỏi", "Đầu câu khẳng định", "Giữa trợ động từ và động từ chính", "Sau tính từ"],
      answer: "Cuối câu phủ định và câu hỏi",
      explanation: "'yet' mang nghĩa 'chưa' thường được đặt ở cuối câu phủ định hoặc câu nghi vấn."
    },
    {
      question: "Điền từ thích hợp: Have you ___ been to Singapore?",
      options: ["ever", "yet", "already", "since"],
      answer: "ever",
      explanation: "'Have you ever...?' là cấu trúc chuẩn để hỏi về trải nghiệm từ trước đến nay."
    },
    {
      question: "Từ nào mang nghĩa 'vừa mới' diễn tả hành động vừa hoàn tất cách đây ít phút?",
      options: ["just", "yet", "ever", "ago"],
      answer: "just",
      explanation: "'just' đứng giữa have/has và V3/ed mang nghĩa vừa mới làm xong điều gì."
    },
    {
      question: "I have ___ completed all my assignments and I am ready to rest.",
      options: ["already", "yet", "ever", "never"],
      answer: "already",
      explanation: "'already' diễn tả hành động đã hoàn tất sớm hơn dự kiến trong câu khẳng định."
    }
  ],
  past_perfect_form: [
    {
      question: "Cấu trúc của thì Quá khứ hoàn thành (Past Perfect) là:",
      options: ["S + has + V3/ed", "S + had + V3/ed", "S + was/were + V3/ed", "S + had been + V-ing"],
      answer: "S + had + V3/ed",
      explanation: "Thì Quá khứ hoàn thành dùng trợ động từ 'had' cho tất cả các ngôi + V3/ed."
    },
    {
      question: "Khi họ đến rạp chiếu phim, bộ phim ___ bắt đầu.",
      options: ["has already", "had already", "was already", "already"],
      answer: "had already",
      explanation: "Hành động phim chiếu xảy ra trước hành động đến rạp (quá khứ đơn) nên chia ở Quá khứ hoàn thành."
    },
    {
      question: "Dạng phủ định của thì Quá khứ hoàn thành là:",
      options: ["S + hadn't + V3/ed", "S + didn't had + V3/ed", "S + wasn't + V3/ed", "S + haven't + V3/ed"],
      answer: "S + hadn't + V3/ed",
      explanation: "Thêm 'not' vào sau 'had' thành 'had not' hoặc 'hadn't' + V3/ed."
    },
    {
      question: "Câu nghi vấn đảo ngữ của thì Quá khứ hoàn thành bắt đầu bằng trợ động từ nào?",
      options: ["Had", "Have", "Did", "Was"],
      answer: "Had",
      explanation: "Cấu trúc câu hỏi: Had + S + V3/ed?"
    },
    {
      question: "She told me that she ___ that museum twice before.",
      options: ["had visited", "has visited", "visited", "was visiting"],
      answer: "had visited",
      explanation: "Hành động tham quan xảy ra trước thời điểm kể lại 'told' trong quá khứ."
    }
  ],
  past_perfect_clauses: [
    {
      question: "Trong câu chứa 'Before + Quá khứ đơn', mệnh đề chính thường chia ở thì:",
      options: ["Hiện tại hoàn thành", "Quá khứ hoàn thành", "Tương lai đơn", "Quá khứ tiếp diễn"],
      answer: "Quá khứ hoàn thành",
      explanation: "Hành động xảy ra trước mốc 'Before + S + V2/ed' được chia ở thì Quá khứ hoàn thành."
    },
    {
      question: "After he ___ dinner, he went out with friends.",
      options: ["has finished", "had finished", "finished", "was finishing"],
      answer: "had finished",
      explanation: "'After + S + had V3/ed, S + V2/ed' diễn tả hành động ăn tối xảy ra trước khi đi chơi."
    },
    {
      question: "By the time we arrived, the meeting ___.",
      options: ["had ended", "ended", "has ended", "was ending"],
      answer: "had ended",
      explanation: "'By the time + S + V2/ed, S + had V3/ed' là cấu trúc phối hợp thì kinh điển trong đề thi."
    },
    {
      question: "As soon as the teacher ___ the exam papers, the students began writing.",
      options: ["had handed out", "has handed out", "hands out", "was handing out"],
      answer: "had handed out",
      explanation: "Hành động phát đề xảy ra trước và hoàn tất rồi học sinh mới bắt đầu viết."
    },
    {
      question: "Hardly ___ when the electricity went off.",
      options: ["had he started working", "he had started working", "did he start working", "has he started working"],
      answer: "had he started working",
      explanation: "Cấu trúc đảo ngữ: Hardly + had + S + V3/ed + when + S + V2/ed."
    }
  ],
  past_simple_vs_past_perfect: [
    {
      question: "Hành động xảy ra trước một hành động khác trong quá khứ được chia ở thì nào?",
      options: ["Quá khứ đơn", "Quá khứ hoàn thành", "Hiện tại hoàn thành", "Quá khứ tiếp diễn"],
      answer: "Quá khứ hoàn thành",
      explanation: "Quá khứ hoàn thành diễn tả hành động xảy ra và hoàn tất trước một hành động khác trong quá khứ."
    },
    {
      question: "He was exhausted because he ___ for 10 hours.",
      options: ["had worked", "has worked", "works", "is working"],
      answer: "had worked",
      explanation: "Làm việc 10 tiếng là nguyên nhân xảy ra trước trạng thái kiệt sức 'was exhausted'."
    },
    {
      question: "When I ___ to the party, everyone ___ home.",
      options: ["came / had gone", "had come / went", "came / went", "come / had gone"],
      answer: "came / had gone",
      explanation: "Mọi người về nhà trước khi tôi đến, nên 'came' (quá khứ đơn) và 'had gone' (quá khứ hoàn thành)."
    },
    {
      question: "The grass was yellow because it ___ for weeks.",
      options: ["hadn't rained", "hasn't rained", "didn't rain", "wasn't raining"],
      answer: "hadn't rained",
      explanation: "Việc không mưa diễn ra trước trạng thái cỏ vàng 'was yellow'."
    },
    {
      question: "Tom ___ the door after everyone ___ the building.",
      options: ["locked / had left", "had locked / left", "locked / left", "has locked / left"],
      answer: "locked / had left",
      explanation: "Mọi người rời đi trước (had left), sau đó Tom mới khóa cửa (locked)."
    }
  ],
  present_perfect_vs_past_simple: [
    {
      question: "Câu nào dưới đây đúng ngữ pháp khi có thời gian xác định trong quá khứ?",
      options: ["I have visited Da Nang last year.", "I visited Da Nang last year.", "I had visited Da Nang last year.", "I was visiting Da Nang last year."],
      answer: "I visited Da Nang last year.",
      explanation: "Khi có thời gian xác định 'last year' kết thúc trong quá khứ, bắt buộc dùng Quá khứ đơn."
    },
    {
      question: "She ___ three cups of coffee this morning (bây giờ là buổi sáng lúc 8h).",
      options: ["drank", "has drunk", "had drunk", "drinks"],
      answer: "has drunk",
      explanation: "Khoảng thời gian 'this morning' chưa kết thúc nên hành động dùng Hiện tại hoàn thành."
    },
    {
      question: "Shakespeare ___ many famous plays.",
      options: ["has written", "wrote", "had written", "writes"],
      answer: "wrote",
      explanation: "Shakespeare đã qua đời, hành động không còn liên hệ đến hiện tại nên dùng Quá khứ đơn."
    },
    {
      question: "I ___ my keys! I can't open the door right now.",
      options: ["have lost", "lost", "had lost", "was losing"],
      answer: "have lost",
      explanation: "Hành động mất chìa khóa diễn ra trong quá khứ nhưng để lại hậu quả hiện tại không vào được nhà."
    },
    {
      question: "My brother ___ from university two years ago.",
      options: ["graduated", "has graduated", "had graduated", "graduates"],
      answer: "graduated",
      explanation: "Có trạng từ 'two years ago' chỉ mốc thời gian quá khứ rõ ràng nên dùng Quá khứ đơn."
    }
  ],
  time_expressions: [
    {
      question: "Trạng từ nào sau đây là dấu hiệu ĐẶC TRƯNG của thì Hiện tại hoàn thành?",
      options: ["yesterday", "so far", "two days ago", "in 1999"],
      answer: "so far",
      explanation: "'so far' (cho đến nay) là dấu hiệu của thì Hiện tại hoàn thành; các từ còn lại dùng Quá khứ đơn."
    },
    {
      question: "Điền vào chỗ trống: In 2021, my company ___ its headquarters to Da Nang.",
      options: ["moved", "has moved", "had moved", "was moving"],
      answer: "moved",
      explanation: "'In 2021' là mốc thời gian quá khứ đã kết thúc xác định, dùng Quá khứ đơn."
    },
    {
      question: "Cụm từ nào KHÔNG dùng với thì Hiện tại hoàn thành?",
      options: ["up to now", "recently", "last night", "lately"],
      answer: "last night",
      explanation: "'last night' là thời điểm quá khứ xác định, đi với thì Quá khứ đơn."
    },
    {
      question: "Cụm 'over the past few years' thường đi với thì nào?",
      options: ["Hiện tại hoàn thành", "Quá khứ đơn", "Tương lai đơn", "Quá khứ tiếp diễn"],
      answer: "Hiện tại hoàn thành",
      explanation: "'over the past few years' (trong vài năm qua) diễn tả quá trình kéo dài đến nay, dùng Hiện tại hoàn thành."
    },
    {
      question: "He hasn't written any letters to his parents ___.",
      options: ["recently", "yesterday", "last week", "two months ago"],
      answer: "recently",
      explanation: "'recently' (gần đây) dùng với câu thì Hiện tại hoàn thành."
    }
  ],
  remedial_tenses: [
    {
      question: "Yesterday I ___ a new jacket, but today I ___ that the zipper is broken.",
      options: ["bought / have noticed", "bought / noticed", "have bought / noticed", "had bought / notice"],
      answer: "bought / have noticed",
      explanation: "'Yesterday' dùng quá khứ đơn (bought), 'today' kết quả nhận thấy ở hiện tại dùng Hiện tại hoàn thành (have noticed)."
    },
    {
      question: "By the time the teacher arrived, all students ___ their homework.",
      options: ["completed", "had completed", "have completed", "were completing"],
      answer: "had completed",
      explanation: "Hành động hoàn thành bài tập xảy ra trước khi giáo viên đến (quá khứ hoàn thành)."
    },
    {
      question: "Listen! Someone ___ loudly outside.",
      options: ["shouts", "is shouting", "has shouted", "shouted"],
      answer: "is shouting",
      explanation: "Dấu hiệu mệnh lệnh 'Listen!' diễn tả hành động đang diễn ra tại thời điểm nói (Hiện tại tiếp diễn)."
    },
    {
      question: "While I ___ down the street, I ___ an old friend.",
      options: ["was walking / met", "walked / had met", "had walked / was meeting", "was walking / have met"],
      answer: "was walking / met",
      explanation: "Hành động đang diễn ra (was walking) thì hành động khác chen ngang (met)."
    },
    {
      question: "Up to the present, our team ___ five important milestones.",
      options: ["has achieved", "achieved", "had achieved", "achieves"],
      answer: "has achieved",
      explanation: "'Up to the present' (cho tới nay) là dấu hiệu kinh điển của thì Hiện tại hoàn thành."
    }
  ],
  zero_conditional: [
    {
      question: "Cấu trúc câu điều kiện loại 0 (Zero Conditional) là:",
      options: ["If + S + V (hiện tại đơn), S + will + V-inf", "If + S + V (hiện tại đơn), S + V (hiện tại đơn)", "If + S + V2/ed, S + would + V-inf", "If + S + had V3/ed, S + would have V3/ed"],
      answer: "If + S + V (hiện tại đơn), S + V (hiện tại đơn)",
      explanation: "Câu điều kiện loại 0 diễn tả chân lý, sự thật hiển nhiên: cả 2 mệnh đề đều ở thì Hiện tại đơn."
    },
    {
      question: "If you heat water to 100 degrees Celsius, it ___.",
      options: ["boils", "will boil", "boiled", "would boil"],
      answer: "boils",
      explanation: "Đây là quy luật khoa học hiển nhiên, dùng thì hiện tại đơn ở mệnh đề chính: boils."
    },
    {
      question: "Plants die if they ___ enough water and sunlight.",
      options: ["don't get", "won't get", "didn't get", "haven't got"],
      answer: "don't get",
      explanation: "Điều kiện loại 0 diễn tả sự thật tự nhiên: If + S + don't/doesn't + V-inf."
    },
    {
      question: "If people don't eat or drink, they ___ survive.",
      options: ["cannot", "won't have", "could not have", "didn't"],
      answer: "cannot",
      explanation: "Sự thật hiển nhiên về sinh học trong điều kiện loại 0: dùng hiện tại đơn / can / cannot."
    },
    {
      question: "Ice turns into water if you ___ it in room temperature.",
      options: ["leave", "will leave", "left", "had left"],
      answer: "leave",
      explanation: "Quy luật vật lý tự nhiên: If + S + V(hiện tại đơn)."
    }
  ],
  first_conditional: [
    {
      question: "Cấu trúc mệnh đề chính của câu điều kiện loại 1 là:",
      options: ["S + will/can + V-inf", "S + would + V-inf", "S + would have + V3/ed", "S + V (hiện tại đơn)"],
      answer: "S + will/can + V-inf",
      explanation: "Điều kiện loại 1 diễn tả sự việc có thể xảy ra ở hiện tại hoặc tương lai: If + S + V(s/es), S + will + V-inf."
    },
    {
      question: "If it ___ tomorrow, we will stay at home.",
      options: ["rains", "will rain", "rained", "is raining"],
      answer: "rains",
      explanation: "Mệnh đề If của câu điều kiện loại 1 không dùng will mà dùng thì Hiện tại đơn (rains)."
    },
    {
      question: "Unless you study diligently, you ___ pass the examination.",
      options: ["won't", "will", "would", "wouldn't"],
      answer: "won't",
      explanation: "Unless = If not. 'Trừ khi bạn chăm chỉ, bạn sẽ không vượt qua kỳ thi': dùng won't."
    },
    {
      question: "If we catch the 8 AM train, we ___ arrive in time for the meeting.",
      options: ["will", "would", "would have", "were to"],
      answer: "will",
      explanation: "Sự việc có khả năng cao diễn ra ở tương lai, mệnh đề chính dùng will + V-inf."
    },
    {
      question: "What will happen if they ___ the deadline tomorrow?",
      options: ["miss", "will miss", "missed", "are missing"],
      answer: "miss",
      explanation: "Mệnh đề If chia ở hiện tại đơn (miss)."
    }
  ],
  second_conditional: [
    {
      question: "Cấu trúc của câu điều kiện loại 2 (Second Conditional) là:",
      options: ["If + S + V2/ed (were), S + would/could + V-inf", "If + S + V-s/es, S + will + V-inf", "If + S + had V3/ed, S + would have V3/ed", "If + S + V2/ed, S + will + V-inf"],
      answer: "If + S + V2/ed (were), S + would/could + V-inf",
      explanation: "Câu điều kiện loại 2 diễn tả điều kiện giả định không có thật ở hiện tại."
    },
    {
      question: "If I ___ you, I would accept that scholarship offer immediately.",
      options: ["am", "was", "were", "have been"],
      answer: "were",
      explanation: "Trong câu điều kiện loại 2, to be dùng 'were' cho tất cả các ngôi trong văn phong học thuật chuẩn."
    },
    {
      question: "What ___ if you found a wallet full of money in the street?",
      options: ["would you do", "will you do", "did you do", "would you have done"],
      answer: "would you do",
      explanation: "Mệnh đề If chia ở quá khứ đơn (found), mệnh đề chính dùng 'would + V-inf'."
    },
    {
      question: "If she ___ more free time, she would travel around Southeast Asia.",
      options: ["had", "has", "would have", "had had"],
      answer: "had",
      explanation: "Giả định trái thực tế ở hiện tại, mệnh đề If chia quá khứ đơn (had)."
    },
    {
      question: "If I knew his contact number, I ___ him right now.",
      options: ["would call", "will call", "called", "would have called"],
      answer: "would call",
      explanation: "Mệnh đề chính câu điều kiện loại 2 dùng 'would + V-inf'."
    }
  ],
  academic_collocations: [
    {
      question: "Chọn từ đi cùng để tạo collocation đúng: Scientists must ___ experiments before drawing conclusions.",
      options: ["conduct", "make", "take", "bring"],
      answer: "conduct",
      explanation: "'conduct an experiment/survey' là collocation chuẩn trong tiếng Anh học thuật."
    },
    {
      question: "Smoking can ___ serious damage to your lungs.",
      options: ["do", "cause", "give", "make"],
      answer: "cause",
      explanation: "'cause damage / harm to sth' là kết hợp từ cố định chuẩn."
    },
    {
      question: "She made a valuable ___ to the community project.",
      options: ["contribution", "distribution", "attribute", "tribute"],
      answer: "contribution",
      explanation: "'make a contribution to sth' nghĩa là đóng góp cho cái gì."
    },
    {
      question: "The government needs to ___ measures to reduce environmental pollution.",
      options: ["take", "make", "do", "give"],
      answer: "take",
      explanation: "'take measures / action' là kết hợp từ cố định mang nghĩa thực hiện biện pháp."
    },
    {
      question: "Students should ___ advantage of library resources to improve their studies.",
      options: ["take", "have", "make", "gain"],
      answer: "take",
      explanation: "'take advantage of sth' là thành ngữ chuẩn nghĩa là tận dụng cái gì."
    }
  ],
  word_formation: [
    {
      question: "Chọn dạng từ thích hợp: Regular exercise is ___ for both physical and mental health. (BENEFIT)",
      options: ["benefit", "beneficial", "beneficially", "benefactor"],
      answer: "beneficial",
      explanation: "Sau to be 'is' cần một tính từ: beneficial (có lợi)."
    },
    {
      question: "She answered the interview questions with great ___. (CONFIDENT)",
      options: ["confidential", "confidence", "confidently", "confide"],
      answer: "confidence",
      explanation: "Sau giới từ 'with' cần một danh từ: confidence (sự tự tin)."
    },
    {
      question: "The economic ___ of the city has improved noticeably in the past decade. (DEVELOP)",
      options: ["development", "developer", "developing", "developed"],
      answer: "development",
      explanation: "Cụm danh từ 'The economic development' (sự phát triển kinh tế) đóng vai trò chủ ngữ."
    },
    {
      question: "He is a very ___ worker who always finishes tasks on time. (RELY)",
      options: ["reliable", "reliably", "reliance", "relying"],
      answer: "reliable",
      explanation: "Trước danh từ 'worker' cần tính từ: reliable (đáng tin cậy)."
    },
    {
      question: "Many species face the threat of ___ due to deforestation. (EXTINCT)",
      options: ["extinction", "extinct", "extinctive", "extinguishing"],
      answer: "extinction",
      explanation: "Sau giới từ 'of' cần một danh từ: extinction (sự tuyệt chủng)."
    }
  ],
  phrasal_verbs: [
    {
      question: "Cụm động từ 'give up' có nghĩa là gì?",
      options: ["Từ bỏ", "Tiếp tục", "Trì hoãn", "Ủng hộ"],
      answer: "Từ bỏ",
      explanation: "'give up' đồng nghĩa với abandon / stop doing something (từ bỏ)."
    },
    {
      question: "The football match had to be ___ because of the heavy thunderstorm.",
      options: ["called off", "put on", "taken after", "looked into"],
      answer: "called off",
      explanation: "'call off' nghĩa là hủy bỏ sự kiện (cancel)."
    },
    {
      question: "If you don't know the meaning of this word, ___ it in the dictionary.",
      options: ["look up", "look for", "look after", "look out"],
      answer: "look up",
      explanation: "'look up a word' nghĩa là tra từ trong từ điển."
    },
    {
      question: "They decided to ___ the meeting until next Monday.",
      options: ["put off", "put on", "give in", "bring up"],
      answer: "put off",
      explanation: "'put off' có nghĩa là trì hoãn (postpone/delay)."
    },
    {
      question: "She resembles her mother; she really ___ her.",
      options: ["takes after", "takes off", "takes over", "takes in"],
      answer: "takes after",
      explanation: "'take after somebody' nghĩa là giống ai đó về ngoại hình hoặc tính cách."
    }
  ]
};

// Fisher-Yates shuffle helper
export function shuffleArray(array) {
  if (!array || !Array.isArray(array)) return [];
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function getQuestionPoolForLesson(lesson) {
  const title = (lesson?.title || '').toLowerCase();
  if (title.includes('cấu trúc') && title.includes('hiện tại hoàn thành')) return FALLBACK_LESSON_QUIZZES.present_perfect_form;
  if (title.includes('since') || title.includes('for')) return FALLBACK_LESSON_QUIZZES.present_perfect_since_for;
  if (title.includes('dấu hiệu') || title.includes('already') || title.includes('yet')) return FALLBACK_LESSON_QUIZZES.present_perfect_signals;
  if (title.includes('quá khứ hoàn thành') && (title.includes('khẳng định') || title.includes('cấu trúc') || title.includes('công thức'))) return FALLBACK_LESSON_QUIZZES.past_perfect_form;
  if (title.includes('before') || title.includes('after') || title.includes('by the time')) return FALLBACK_LESSON_QUIZZES.past_perfect_clauses;
  if (title.includes('phân biệt') && title.includes('quá khứ đơn') && title.includes('quá khứ hoàn thành')) return FALLBACK_LESSON_QUIZZES.past_simple_vs_past_perfect;
  if (title.includes('hiện tại hoàn thành') && title.includes('quá khứ đơn')) return FALLBACK_LESSON_QUIZZES.present_perfect_vs_past_simple;
  if (title.includes('thời gian xác định') || title.includes('trạng từ thời gian')) return FALLBACK_LESSON_QUIZZES.time_expressions;
  if (title.includes('ôn tập') || title.includes('remedial') || title.includes('bổ sung') || title.includes('tenses')) return FALLBACK_LESSON_QUIZZES.remedial_tenses;
  if (title.includes('loại 0') || title.includes('zero conditional')) return FALLBACK_LESSON_QUIZZES.zero_conditional;
  if (title.includes('loại 1') || title.includes('first conditional')) return FALLBACK_LESSON_QUIZZES.first_conditional;
  if (title.includes('loại 2') || title.includes('second conditional')) return FALLBACK_LESSON_QUIZZES.second_conditional;
  if (title.includes('collocation') || title.includes('kết hợp từ')) return FALLBACK_LESSON_QUIZZES.academic_collocations;
  if (title.includes('cấu tạo từ') || title.includes('word formation') || title.includes('tiền tố') || title.includes('hậu tố')) return FALLBACK_LESSON_QUIZZES.word_formation;
  if (title.includes('phrasal verb') || title.includes('cụm động từ')) return FALLBACK_LESSON_QUIZZES.phrasal_verbs;

  return [
    {
      question: `Trong tiếng Anh, cấu trúc ngữ pháp và từ vựng của bài "${lesson?.title || 'học'}" cần lưu ý điều gì?`,
      options: [
        "Tuân thủ chính xác quy tắc chia thì và sự hòa hợp giữa chủ ngữ - động từ",
        "Có thể dùng bất kỳ thì nào mà không cần xét ngữ cảnh",
        "Chỉ cần dịch nghĩa theo từng từ đơn lẻ (word-by-word)",
        "Không cần để ý đến dấu hiệu nhận biết thời gian"
      ],
      answer: "Tuân thủ chính xác quy tắc chia thì và sự hòa hợp giữa chủ ngữ - động từ",
      explanation: "Ngữ pháp tiếng Anh luôn đòi hỏi tính chuẩn xác về thì và hòa hợp ngữ pháp dựa trên ngữ cảnh câu."
    },
    {
      question: "Khi làm bài tập trắc nghiệm liên quan đến nội dung bài này, bước đầu tiên quan trọng nhất là:",
      options: [
        "Xác định thì của câu dựa vào trạng từ chỉ thời gian và cấu trúc câu",
        "Chọn ngay phương án dài nhất",
        "Dịch toàn bộ bài trước khi nhìn vào 4 phương án",
        "Bỏ qua các từ nối trong câu"
      ],
      answer: "Xác định thì của câu dựa vào trạng từ chỉ thời gian và cấu trúc câu",
      explanation: "Việc xác định ngữ cảnh và trạng từ thời gian giúp loại trừ ngay các phương án sai."
    },
    {
      question: "Dấu hiệu nào sau đây giúp loại trừ nhanh các phương án sai trong câu kiểm tra ngữ pháp?",
      options: [
        "Sự hòa hợp giữa thì của mệnh đề chính và mệnh đề phụ",
        "Độ dài của từng phương án trắc nghiệm",
        "Thứ tự bảng chữ cái của đáp án A, B, C, D",
        "Các từ không xuất hiện trong từ điển"
      ],
      answer: "Sự hòa hợp giữa thì của mệnh đề chính và mệnh đề phụ",
      explanation: "Quy tắc hòa hợp thì luôn là căn cứ khoa học chính xác nhất để loại trừ đáp án không tương thích."
    }
  ];
}

/* ── Normalizer to handle diverse quiz question schemas (object options vs array options) ── */
export function normalizeQuizQuestion(q) {
  if (!q) return null;
  const questionText = q.question || q.content || '';
  if (!questionText) return null;

  let rawOptions = q.options;
  if (typeof rawOptions === 'string') {
    try {
      rawOptions = JSON.parse(rawOptions);
    } catch (e) {
      rawOptions = [rawOptions];
    }
  }

  let optList = [];
  let answerText = q.answer || '';

  if (Array.isArray(rawOptions)) {
    optList = rawOptions.map(opt => (typeof opt === 'string' ? opt : (opt?.text || String(opt))));
    // If answerText is empty, but correctAnswer is 'A', 'B', 'C', 'D' or numeric index
    if (!answerText && q.correctAnswer !== undefined && q.correctAnswer !== null) {
      const ca = String(q.correctAnswer).trim().toUpperCase();
      const idx = ['A', 'B', 'C', 'D'].indexOf(ca);
      if (idx >= 0 && idx < optList.length) {
        answerText = optList[idx];
      } else if (!isNaN(Number(q.correctAnswer)) && Number(q.correctAnswer) >= 0 && Number(q.correctAnswer) < optList.length) {
        answerText = optList[Number(q.correctAnswer)];
      } else {
        answerText = String(q.correctAnswer);
      }
    }
  } else if (rawOptions && typeof rawOptions === 'object') {
    // Object format: { A: "text", B: "text", C: "text", D: "text" }
    const letters = ['A', 'B', 'C', 'D'];
    const hasLetterKeys = letters.some(k => rawOptions[k] !== undefined);
    if (hasLetterKeys) {
      letters.forEach(k => {
        if (rawOptions[k] !== undefined) {
          const val = typeof rawOptions[k] === 'string' ? rawOptions[k] : (rawOptions[k]?.text || String(rawOptions[k]));
          optList.push(val);
        }
      });
      const ca = String(q.correctAnswer || q.answer || '').trim().toUpperCase();
      if (rawOptions[ca] !== undefined) {
        answerText = typeof rawOptions[ca] === 'string' ? rawOptions[ca] : (rawOptions[ca]?.text || String(rawOptions[ca]));
      }
    } else {
      Object.keys(rawOptions).forEach(k => {
        const val = typeof rawOptions[k] === 'string' ? rawOptions[k] : (rawOptions[k]?.text || String(rawOptions[k]));
        optList.push(val);
      });
      if (q.correctAnswer && rawOptions[q.correctAnswer] !== undefined) {
        answerText = typeof rawOptions[q.correctAnswer] === 'string' ? rawOptions[q.correctAnswer] : (rawOptions[q.correctAnswer]?.text || String(rawOptions[q.correctAnswer]));
      }
    }
  }

  // Fallback: check if rawOptions had objects with isCorrect
  if (!answerText && Array.isArray(rawOptions)) {
    const corrObj = rawOptions.find(o => o && typeof o === 'object' && o.isCorrect);
    if (corrObj) answerText = corrObj.text || '';
  }

  if (!answerText && q.correctAnswer) {
    answerText = String(q.correctAnswer);
  }

  // If all options have "A. ", "B. " prefixes, strip them so UI circle badges aren't duplicate
  const allPrefixed = optList.length > 0 && optList.every(opt => /^[A-Da-d][\.\:\)]\s+/.test(opt));
  if (allPrefixed) {
    optList = optList.map(opt => opt.replace(/^[A-Da-d][\.\:\)]\s+/, '').trim());
    answerText = answerText.replace(/^[A-Da-d][\.\:\)]\s+/, '').trim();
  }

  return {
    ...q,
    question: questionText,
    options: optList,
    answer: answerText,
    explanation: q.explanation || ''
  };
}

/* ── Randomized Quiz Generator: shuffles pool questions & option choices A/B/C/D ── */
export function getRandomQuizForLesson(lesson, miniQuizzes, count = 3) {
  let pool = [];
  if (miniQuizzes && miniQuizzes.length > 0) {
    for (const mq of miniQuizzes) {
      if (mq.questionsJson) {
        try {
          const parsed = JSON.parse(mq.questionsJson);
          if (Array.isArray(parsed) && parsed.length > 0) {
            pool.push(...parsed);
          }
        } catch (e) {}
      }
    }
  }

  // Always supplement with fallback pool to ensure at least 3 randomized questions
  const fallback = getQuestionPoolForLesson(lesson) || [];
  pool.push(...fallback);

  // Normalize all questions to unified schema: { question, options: string[], answer: string, explanation: string }
  const normalizedPool = pool.map(normalizeQuizQuestion).filter(Boolean);

  // Deduplicate by question text
  const seen = new Set();
  const uniquePool = normalizedPool.filter(q => {
    if (!q || !q.question || !Array.isArray(q.options) || q.options.length === 0) return false;
    const key = q.question.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Shuffle question pool and select count questions (default 3)
  const targetCount = Math.min(count, uniquePool.length);
  const selected = shuffleArray(uniquePool).slice(0, targetCount);

  // Shuffle options for each question so correct answer position is randomized
  return selected.map(q => {
    const opts = q.options || [];
    if (!Array.isArray(opts) || opts.length <= 1) {
      return q;
    }
    return {
      ...q,
      options: shuffleArray(opts)
    };
  });
}


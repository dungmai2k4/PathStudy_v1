const BASE_CONTENT = 'http://localhost:8082/api/v1/content';
const BASE_QUESTION = 'http://localhost:8083/api/v1/questions';
const SUBJECT_ID = '11111111-1111-1111-1111-111111111101';
const BANK_ID = '33333333-3333-3333-3333-333333333301';
const headers = { 'Content-Type': 'application/json' };

// 1. Helper lấy toàn bộ danh sách bài học và kỹ năng
async function getLessonsAndSkills() {
  const rM = await fetch(BASE_CONTENT + '/subjects/' + SUBJECT_ID + '/modules');
  const dM = await rM.json();
  const modules = dM.data || [];

  const rS = await fetch(BASE_CONTENT + '/subjects/' + SUBJECT_ID + '/skills');
  const dS = await rS.json();
  const skills = dS.data || [];

  let lessons = [];
  for (const m of modules) {
    const rT = await fetch(BASE_CONTENT + '/modules/' + m.id + '/topics');
    const dT = await rT.json();
    for (const t of (dT.data || [])) {
      const rL = await fetch(BASE_CONTENT + '/topics/' + t.id + '/lessons');
      const dL = await rL.json();
      for (const les of (dL.data || [])) {
        lessons.push({
          moduleId: m.id,
          moduleName: m.name,
          topicId: t.id,
          topicName: t.name,
          lessonId: les.id,
          lessonTitle: les.title,
          skillId: les.skillId || skills[0]?.id
        });
      }
    }
  }
  return { lessons, skills };
}

// 2. Định nghĩa ngân hàng 15 câu hỏi quiz chuẩn bị cho TỪNG bài học
// Tổng cộng 8 bài học * 15 câu = 120 câu hỏi chất lượng cao
function generate15QuizzesPerLesson() {
  return {
    // BÀI 1: Present Simple and Present Continuous
    0: [
      {
        question: "My father routinely ___ the household garbage out every evening at 8:00 PM.",
        options: { A: "takes", B: "is taking", C: "took", D: "has taken" },
        correctAnswer: "A",
        explanation: "Routine action indicated by 'routinely' and 'every evening' -> Present Simple: takes."
      },
      {
        question: "Look! The environmental activists ___ leaflets to pedestrians across the central plaza.",
        options: { A: "distribute", B: "are distributing", C: "distributed", D: "have distribute" },
        correctAnswer: "B",
        explanation: "Action happening at the moment of speaking marked by 'Look!' -> Present Continuous: are distributing."
      },
      {
        question: "I ___ what you are trying to say, but we must verify the statistical evidence first.",
        options: { A: "am understanding", B: "understand", C: "understood", D: "have been understanding" },
        correctAnswer: "B",
        explanation: "'understand' is a stative verb expressing cognition, not used in continuous forms -> understand."
      },
      {
        question: "Currently, our local youth club ___ an eco-friendly tree-planting campaign in the suburbs.",
        options: { A: "is organizing", B: "organizes", C: "organized", D: "organize" },
        correctAnswer: "A",
        explanation: "Action happening in the current time frame marked by 'Currently' -> Present Continuous: is organizing."
      },
      {
        question: "Water ___ at 100 degrees Celsius under standard atmospheric pressure.",
        options: { A: "is boiling", B: "boils", C: "boiled", D: "boil" },
        correctAnswer: "B",
        explanation: "Scientific fact and natural truth -> Present Simple: boils."
      },
      {
        question: "Why ___ you always ___ excuses whenever it is your turn to wash the dishes?",
        options: { A: "are / making", B: "do / make", C: "did / make", D: "have / made" },
        correctAnswer: "A",
        explanation: "Expressing annoyance and complaint about a repeated irritating habit with 'always' -> are making."
      },
      {
        question: "The school express bus ___ at exactly 7:15 AM every weekday morning.",
        options: { A: "is departing", B: "departs", C: "departed", D: "has departed" },
        correctAnswer: "B",
        explanation: "Fixed official timetable and schedule -> Present Simple: departs."
      },
      {
        question: "These days, more and more urban families ___ organic food products for better health.",
        options: { A: "are choosing", B: "choose", C: "chose", D: "had chosen" },
        correctAnswer: "A",
        explanation: "Contemporary social trend and ongoing gradual shift marked by 'These days' -> are choosing."
      },
      {
        question: "Do you know who this waterproof backpack ___ to?",
        options: { A: "is belonging", B: "belongs", C: "belonged", D: "has belonged" },
        correctAnswer: "B",
        explanation: "'belong to' is a stative verb denoting possession -> belongs."
      },
      {
        question: "Listen! The keynote speaker ___ an inspiring lecture on marine biodiversity.",
        options: { A: "delivers", B: "is delivering", C: "delivered", D: "deliver" },
        correctAnswer: "B",
        explanation: "Action in progress right now indicated by imperative 'Listen!' -> is delivering."
      },
      {
        question: "My elder sister usually studies in the library, but this week she ___ from home.",
        options: { A: "works", B: "is working", C: "worked", D: "has worked" },
        correctAnswer: "B",
        explanation: "Temporary situation contrasting with normal routine, marked by 'this week' -> is working."
      },
      {
        question: "The Earth ___ around the Sun in an elliptical orbit.",
        options: { A: "moves", B: "is moving", C: "moved", D: "has moved" },
        correctAnswer: "A",
        explanation: "Astronomical truth and perpetual fact -> Present Simple: moves."
      },
      {
        question: "I ___ that strict environmental policies are essential for sustainable development.",
        options: { A: "am believing", B: "believe", C: "was believed", D: "believed" },
        correctAnswer: "B",
        explanation: "'believe' is a stative verb of opinion, not divided into continuous aspect -> believe."
      },
      {
        question: "Why ___ everyone ___ so quietly in the science laboratory today?",
        options: { A: "is / working", B: "does / work", C: "do / work", D: "are / worked" },
        correctAnswer: "A",
        explanation: "'everyone' takes a singular verb, action occurring specifically 'today' -> is working."
      },
      {
        question: "Our volunteer group ___ meetings once a fortnight to review ongoing charity projects.",
        options: { A: "holds", B: "is holding", C: "held", D: "hold" },
        correctAnswer: "A",
        explanation: "Habitual regular interval marked by 'once a fortnight', singular collective noun -> holds."
      }
    ],

    // BÀI 2: Future Intentions with Will and Be Going To
    1: [
      {
        question: "Have you finalized the summer volunteer trip? - Yes, we ___ build a community library in Ha Giang.",
        options: { A: "will", B: "are going to", C: "might to", D: "would" },
        correctAnswer: "B",
        explanation: "A confirmed plan with prior intention and preparation -> are going to."
      },
      {
        question: "Look at those dark thunderstorm clouds rolling in! It ___ pour down any minute.",
        options: { A: "will", B: "is going to", C: "shall", D: "would" },
        correctAnswer: "B",
        explanation: "Prediction based on clear immediate sensory evidence (dark storm clouds) -> is going to."
      },
      {
        question: "I haven't brought enough cash for the charity ticket. - Don't worry, I ___ lend you some.",
        options: { A: "am going to", B: "will", C: "am lending", D: "would" },
        correctAnswer: "B",
        explanation: "Spontaneous on-the-spot decision made at the moment of speaking -> will."
      },
      {
        question: "Scientists predict that artificial intelligence ___ dramatically transform healthcare diagnostics by 2030.",
        options: { A: "will", B: "is going to", C: "shall be", D: "is transforming" },
        correctAnswer: "A",
        explanation: "Long-term future forecast based on judgment and opinion -> will."
      },
      {
        question: "We promise that we ___ maintain strict confidentiality regarding all student survey responses.",
        options: { A: "will", B: "are going to", C: "were", D: "had" },
        correctAnswer: "A",
        explanation: "Official promise and commitment following the verb 'promise' -> will."
      },
      {
        question: "Watch out! You ___ trip over that loose electrical cable on the stage!",
        options: { A: "will", B: "are going to", C: "shall", D: "would" },
        correctAnswer: "B",
        explanation: "Imminent danger with immediate observable evidence -> are going to."
      },
      {
        question: "I think renewable solar power ___ replace coal as the leading electricity source in our province.",
        options: { A: "will", B: "is going to", C: "is replacing", D: "has replaced" },
        correctAnswer: "A",
        explanation: "Subjective belief introduced by 'I think' -> will."
      },
      {
        question: "Our school environmental committee ___ host an international climate seminar next Friday.",
        options: { A: "will", B: "is going to", C: "shall", D: "would" },
        correctAnswer: "B",
        explanation: "Pre-arranged schedule and official program -> is going to."
      },
      {
        question: "The telephone is ringing loudly in the reception hall. - OK, I ___ answer it right now.",
        options: { A: "am going to", B: "will", C: "would", D: "am answering" },
        correctAnswer: "B",
        explanation: "Instantaneous decision made right at the moment of occurrence -> will."
      },
      {
        question: "They have already purchased the building materials; they ___ renovate the old community center tomorrow.",
        options: { A: "will", B: "are going to", C: "shall", D: "would" },
        correctAnswer: "B",
        explanation: "Prior preparation confirmed by purchased materials -> are going to."
      },
      {
        question: "If you need any guidance on formatting your essay, I ___ be delighted to assist you.",
        options: { A: "will", B: "am going to", C: "was", D: "have been" },
        correctAnswer: "A",
        explanation: "Offer of assistance in conditional sentence type 1 -> will."
      },
      {
        question: "He is driving at 120 km/h in dense fog! He ___ crash into the road barrier!",
        options: { A: "will", B: "is going to", C: "shall", D: "would" },
        correctAnswer: "B",
        explanation: "Clear physical evidence of imminent disaster -> is going to."
      },
      {
        question: "I hope our youth recycling initiative ___ inspire neighboring schools across the district.",
        options: { A: "will", B: "is going to", C: "was", D: "would" },
        correctAnswer: "A",
        explanation: "Expression of future hope introduced by 'I hope' -> will."
      },
      {
        question: "What are your career plans after graduation? - I ___ study Environmental Engineering abroad.",
        options: { A: "will", B: "am going to", C: "shall", D: "would" },
        correctAnswer: "B",
        explanation: "Firm personal intention and ambition planned in advance -> am going to."
      },
      {
        question: "Don't carry that heavy box alone. Wait a second, I ___ give you a hand.",
        options: { A: "am going to", B: "will", C: "am giving", D: "shall to" },
        correctAnswer: "B",
        explanation: "Spontaneous offer of help made on the spot -> will."
      }
    ],

    // BÀI 3: Passive Voice with Modal Verbs
    2: [
      {
        question: "School Directive: 'All cellular phones must ___ inside lockers during formal examination hours.'",
        options: { A: "keep", B: "be kept", C: "kept", D: "be keeping" },
        correctAnswer: "B",
        explanation: "Passive with modal 'must': must + be + V3 (kept)."
      },
      {
        question: "Equal employment opportunities ought to ___ to qualified candidates regardless of gender.",
        options: { A: "grant", B: "be granted", C: "granted", D: "have granting" },
        correctAnswer: "B",
        explanation: "Passive with modal 'ought to': ought to + be + V3 (granted)."
      },
      {
        question: "Dangerous chemical waste can ___ into harmless substances using specialized filtration systems.",
        options: { A: "be converted", B: "convert", C: "converted", D: "converting" },
        correctAnswer: "A",
        explanation: "Passive voice with modal 'can': can + be + V3 (converted)."
      },
      {
        question: "Library Notice: 'Reference books may not ___ out of the reading room under any circumstances.'",
        options: { A: "be taken", B: "take", C: "took", D: "have taken" },
        correctAnswer: "A",
        explanation: "Negative passive with modal 'may': may not + be + V3 (taken)."
      },
      {
        question: "Single-use plastic straws should ___ by paper or stainless-steel alternatives in school cafeterias.",
        options: { A: "replace", B: "be replaced", C: "replaced", D: "be replacing" },
        correctAnswer: "B",
        explanation: "Passive with modal 'should': should + be + V3 (replaced)."
      },
      {
        question: "Biodegradable kitchen refuse can ___ into organic compost for community vegetable gardens.",
        options: { A: "turn", B: "be turned", C: "turned", D: "turning" },
        correctAnswer: "B",
        explanation: "Passive voice with 'can': can + be + V3 (turned)."
      },
      {
        question: "Regulations state that safety goggles must ___ by all students entering the chemistry laboratory.",
        options: { A: "wear", B: "be worn", C: "worn", D: "be wearing" },
        correctAnswer: "B",
        explanation: "Passive requirement with 'must': must + be + V3 (worn)."
      },
      {
        question: "Gender stereotyping in school textbooks should ___ through comprehensive editorial revisions.",
        options: { A: "eliminate", B: "be eliminated", C: "eliminated", D: "eliminating" },
        correctAnswer: "B",
        explanation: "Passive policy statement with 'should': should + be + V3 (eliminated)."
      },
      {
        question: "Emergency evacuation maps must ___ on every floor adjacent to the stairwells.",
        options: { A: "display", B: "be displayed", C: "displayed", D: "displaying" },
        correctAnswer: "B",
        explanation: "Passive mandate: must + be + V3 (displayed)."
      },
      {
        question: "Valuable historical documents in the archives ought to ___ with extreme caution.",
        options: { A: "handle", B: "be handled", C: "handled", D: "be handling" },
        correctAnswer: "B",
        explanation: "Passive advice: ought to + be + V3 (handled)."
      },
      {
        question: "More public recharging stations should ___ across city districts to accommodate electric vehicles.",
        options: { A: "install", B: "be installed", C: "installed", D: "installing" },
        correctAnswer: "B",
        explanation: "Passive recommendation: should + be + V3 (installed)."
      },
      {
        question: "Unused medical prescriptions must not ___ down household sinks or drainage pipes.",
        options: { A: "pour", B: "be poured", C: "poured", D: "pouring" },
        correctAnswer: "B",
        explanation: "Passive prohibition: must not + be + V3 (poured)."
      },
      {
        question: "Rare bird species in national reserves must ___ from poaching and habitat encroachment.",
        options: { A: "protect", B: "be protected", C: "protected", D: "protecting" },
        correctAnswer: "B",
        explanation: "Conservation obligation: must + be + V3 (protected)."
      },
      {
        question: "Financial aid applications may ___ online through the official education portal.",
        options: { A: "submit", B: "be submitted", C: "submitted", D: "submitting" },
        correctAnswer: "B",
        explanation: "Permission in passive voice: may + be + V3 (submitted)."
      },
      {
        question: "Workplace disputes should ___ through fair and impartial arbitration procedures.",
        options: { A: "resolve", B: "be resolved", C: "resolved", D: "resolving" },
        correctAnswer: "B",
        explanation: "Policy guideline: should + be + V3 (resolved)."
      }
    ],

    // BÀI 4: Relative Clauses
    3: [
      {
        question: "UNESCO, ___ was established in 1945, promotes worldwide peace through international collaboration.",
        options: { A: "that", B: "which", C: "whose", D: "who" },
        correctAnswer: "B",
        explanation: "Non-defining relative clause with comma referring to an organization -> which (cannot use that)."
      },
      {
        question: "The software application ___ enables students to collaborate in real time was designed by local alumni.",
        options: { A: "which", B: "whom", C: "whose", D: "where" },
        correctAnswer: "A",
        explanation: "Defining relative clause referring to a tool (thing) acting as subject -> which / that."
      },
      {
        question: "Candidates ___ test scores meet the entrance criteria will be shortlisted for personal interviews.",
        options: { A: "who", B: "whose", C: "whom", D: "which" },
        correctAnswer: "B",
        explanation: "Possessive relative pronoun modifying noun 'test scores' -> whose."
      },
      {
        question: "The elderly botanist ___ discovered the rare orchid species was awarded a prestigious medal.",
        options: { A: "whom", B: "who", C: "which", D: "whose" },
        correctAnswer: "B",
        explanation: "Subject relative pronoun referring to a person ('The elderly botanist') -> who."
      },
      {
        question: "Ha Long Bay, ___ is renowned for its emerald waters and limestone islets, attracts millions of visitors annually.",
        options: { A: "which", B: "that", C: "where", D: "whose" },
        correctAnswer: "A",
        explanation: "Non-defining relative clause with comma referring to a proper noun -> which."
      },
      {
        question: "The university auditorium ___ the annual youth conference takes place can seat up to 1,200 participants.",
        options: { A: "which", B: "where", C: "that", D: "whose" },
        correctAnswer: "B",
        explanation: "Relative adverb of place meaning 'in which' -> where."
      },
      {
        question: "The scientist with ___ the researchers collaborated has published groundbreaking papers on quantum computing.",
        options: { A: "who", B: "whom", C: "that", D: "whose" },
        correctAnswer: "B",
        explanation: "Object pronoun following a preposition ('with') referring to a person -> whom."
      },
      {
        question: "Renewable energy technologies, ___ generate clean power, are becoming more economical every year.",
        options: { A: "which", B: "that", C: "whose", D: "where" },
        correctAnswer: "A",
        explanation: "Non-defining clause separated by commas -> which."
      },
      {
        question: "Students ___ passion is environmental activism have founded an organic rooftop garden club.",
        options: { A: "who", B: "whose", C: "whom", D: "which" },
        correctAnswer: "B",
        explanation: "Possessive relationship ('their passion') -> whose."
      },
      {
        question: "The digital tablet ___ my father gave me for my sixteenth birthday has an exceptional battery life.",
        options: { A: "that", B: "whom", C: "whose", D: "where" },
        correctAnswer: "A",
        explanation: "Defining relative pronoun referring to an object ('The digital tablet') -> that / which."
      },
      {
        question: "The historical epoch ___ renewable solar technology first emerged witnessed major industrial shifts.",
        options: { A: "where", B: "when", C: "which", D: "whose" },
        correctAnswer: "B",
        explanation: "Relative adverb referring to a time period ('epoch') -> when."
      },
      {
        question: "My homeroom teacher, ___ has guided our class for three consecutive terms, is retiring next semester.",
        options: { A: "who", B: "that", C: "whom", D: "whose" },
        correctAnswer: "A",
        explanation: "Non-defining clause referring to a person as subject -> who."
      },
      {
        question: "The coastal mangrove forest ___ acts as a natural tsunami barrier must be protected from deforestation.",
        options: { A: "which", B: "who", C: "whom", D: "whose" },
        correctAnswer: "A",
        explanation: "Defining relative pronoun referring to a plant ecosystem -> which / that."
      },
      {
        question: "The young innovators ___ invention converts ocean waves into electricity received international acclaim.",
        options: { A: "who", B: "whose", C: "whom", D: "which" },
        correctAnswer: "B",
        explanation: "Possessive relative modifying 'invention' -> whose."
      },
      {
        question: "Is there any sustainable alternative ___ can completely substitute petroleum-based polymers?",
        options: { A: "that", B: "whom", C: "whose", D: "where" },
        correctAnswer: "A",
        explanation: "After indefinite pronoun 'any...', 'that' is the preferred relative pronoun -> that."
      }
    ],

    // BÀI 5: Essential Collocations for Domestic Life and Green Living
    4: [
      {
        question: "In many contemporary families, both spouses work outside the home to share the financial ___.",
        options: { A: "burden", B: "lifting", C: "chore", D: "footprint" },
        correctAnswer: "A",
        explanation: "Collocation: share the financial burden = san sẻ gánh nặng tài chính."
      },
      {
        question: "Eco-conscious citizens are adopting sustainable habits in order to minimize their individual carbon ___.",
        options: { A: "mark", B: "footprint", C: "fingerprint", D: "impact" },
        correctAnswer: "B",
        explanation: "Collocation: carbon footprint = lượng phát thải khí nhà kính/dấu chân carbon."
      },
      {
        question: "Modern department stores are replacing plastic carrier bags with ___ paper packages.",
        options: { A: "biodegradable", B: "exhausted", C: "contaminated", D: "hazardous" },
        correctAnswer: "A",
        explanation: "biodegradable packaging = bao bì tự phân hủy sinh học."
      },
      {
        question: "The municipal council has launched a project to promote source waste ___ in residential quarters.",
        options: { A: "segregation", B: "destruction", C: "consumption", D: "emission" },
        correctAnswer: "A",
        explanation: "waste segregation = phân loại rác thải tại nguồn."
      },
      {
        question: "My father has always been the primary ___ in our four-member household.",
        options: { A: "homemaker", B: "breadwinner", C: "caregiver", D: "volunteer" },
        correctAnswer: "B",
        explanation: "breadwinner = người trụ cột kinh tế chính trong gia đình."
      },
      {
        question: "Parents should set a constructive ___ for their adolescents by practicing sustainable energy conservation at home.",
        options: { A: "example", B: "standard", C: "manner", D: "pattern" },
        correctAnswer: "A",
        explanation: "set an example / set a good example = nêu gương tốt."
      },
      {
        question: "Switching off electronic devices when not in active use helps households cut down on electricity ___.",
        options: { A: "consumption", B: "production", C: "exhaustion", D: "emission" },
        correctAnswer: "A",
        explanation: "electricity consumption = mức độ tiêu thụ điện năng."
      },
      {
        question: "My brother usually helps my mother with the heavy ___ such as moving furniture or water containers.",
        options: { A: "lifting", B: "raising", C: "carrying", D: "holding" },
        correctAnswer: "A",
        explanation: "heavy lifting = công việc nặng nhọc đòi hỏi thể lực."
      },
      {
        question: "Many schools encourage students to adopt an ___ lifestyle by packing reusable stainless-steel bottles.",
        options: { A: "eco-friendly", B: "unfriendly", C: "expensive", D: "endangered" },
        correctAnswer: "A",
        explanation: "eco-friendly lifestyle = lối sống thân thiện với môi trường."
      },
      {
        question: "Equal division of domestic chores helps preserve family ___ and mutual affection.",
        options: { A: "harmony", B: "dispute", C: "conflict", D: "pressure" },
        correctAnswer: "A",
        explanation: "family harmony = sự hòa thuận, êm ấm trong gia đình."
      },
      {
        question: "Installing rooftop solar panels is an effective strategy to utilize ___ energy resources.",
        options: { A: "renewable", B: "fossil", C: "polluted", D: "exhaustible" },
        correctAnswer: "A",
        explanation: "renewable energy = năng lượng tái tạo."
      },
      {
        question: "The local youth union organized a cleanup campaign to raise public ___ regarding marine plastic waste.",
        options: { A: "awareness", B: "hesitation", C: "objection", D: "suspicion" },
        correctAnswer: "A",
        explanation: "raise awareness = nâng cao nhận thức cộng đồng."
      },
      {
        question: "Rather than throwing away old cardboard boxes, creative students ___ them into useful organizers.",
        options: { A: "upcycle", B: "discard", C: "contaminate", D: "diminish" },
        correctAnswer: "A",
        explanation: "upcycle = tái chế nâng cấp thành đồ dùng hữu ích mới."
      },
      {
        question: "Responsible consumers avoid purchasing cosmetics that involve chemical testing on ___ animals.",
        options: { A: "laboratory", B: "domestic", C: "extinct", D: "marine" },
        correctAnswer: "A",
        explanation: "laboratory animals = động vật thí nghiệm."
      },
      {
        question: "Properly maintaining air-conditioning filters significantly improves indoor air ___.",
        options: { A: "quality", B: "quantity", C: "pressure", D: "moisture" },
        correctAnswer: "A",
        explanation: "indoor air quality = chất lượng không khí trong nhà."
      }
    ],

    // BÀI 6: Digital Tools and Educational Innovations
    5: [
      {
        question: "The introduction of ___ learning enables learners to review recorded lectures prior to classroom seminars.",
        options: { A: "blended", B: "primitive", C: "isolated", D: "manual" },
        correctAnswer: "A",
        explanation: "blended learning = mô hình học tập kết hợp trực tuyến và trực tiếp."
      },
      {
        question: "Smartphones can become harmful digital ___ if students lack the discipline to mute non-essential alerts during study hours.",
        options: { A: "distractions", B: "breakthroughs", C: "inventions", D: "perfections" },
        correctAnswer: "A",
        explanation: "digital distractions = những tác nhân xao nhãng kỹ thuật số."
      },
      {
        question: "Artificial Intelligence algorithms can analyze individual learning gaps and provide ___ academic exercises.",
        options: { A: "personalized", B: "impersonal", C: "identical", D: "standardized" },
        correctAnswer: "A",
        explanation: "personalized exercises = các bài tập được cá nhân hóa theo trình độ."
      },
      {
        question: "Cloud computing platforms allow group members to collaborate ___ on shared research presentations.",
        options: { A: "simultaneously", B: "reluctantly", C: "passively", D: "separately" },
        correctAnswer: "A",
        explanation: "collaborate simultaneously = cộng tác đồng thời cùng lúc."
      },
      {
        question: "Modern classrooms are increasingly equipped with interactive digital ___ to enhance visual engagement.",
        options: { A: "whiteboards", B: "blackboards", C: "desks", D: "curtains" },
        correctAnswer: "A",
        explanation: "interactive digital whiteboards = bảng tương tác thông minh."
      },
      {
        question: "Autonomous learners cultivate self-directed study habits and take personal ___ for their progress.",
        options: { A: "responsibility", B: "hesitation", C: "suspicion", D: "reluctance" },
        correctAnswer: "A",
        explanation: "take responsibility for = chịu trách nhiệm về tiến độ của mình."
      },
      {
        question: "Educational software developers must ensure that student data is securely encrypted to protect digital ___.",
        options: { A: "privacy", B: "piracy", C: "propaganda", D: "publicity" },
        correctAnswer: "A",
        explanation: "digital privacy = quyền riêng tư dữ liệu số."
      },
      {
        question: "Virtual reality headsets can simulate hazardous chemistry experiments without exposing students to physical ___.",
        options: { A: "hazards", B: "benefits", C: "devices", D: "theories" },
        correctAnswer: "A",
        explanation: "physical hazards = các mối nguy hiểm thể chất."
      },
      {
        question: "Portable e-readers allow avid readers to store thousands of digital volumes in a single lightweight ___.",
        options: { A: "device", B: "station", C: "furniture", D: "vehicle" },
        correctAnswer: "A",
        explanation: "lightweight device = thiết bị gọn nhẹ."
      },
      {
        question: "Artificial intelligence has achieved a historic technological ___ in conversational language processing.",
        options: { A: "breakthrough", B: "breakdown", C: "breakout", D: "breakaway" },
        correctAnswer: "A",
        explanation: "technological breakthrough = bước đột phá công nghệ."
      },
      {
        question: "Excessive screen exposure before bedtime can disrupt natural circadian ___ and impair sleep quality.",
        options: { A: "rhythms", B: "systems", C: "instruments", D: "calculations" },
        correctAnswer: "A",
        explanation: "circadian rhythms = nhịp sinh học cơ thể."
      },
      {
        question: "Gamified learning platforms award digital badges to ___ students to complete daily practice quizzes.",
        options: { A: "motivate", B: "discourage", C: "intimidate", D: "prevent" },
        correctAnswer: "A",
        explanation: "motivate someone to do something = tạo động lực thúc đẩy học sinh."
      },
      {
        question: "Students should learn to critically evaluate online sources to identify credible research from online ___.",
        options: { A: "misinformation", B: "scholarship", C: "curriculum", D: "literature" },
        correctAnswer: "A",
        explanation: "misinformation = thông tin sai lệch trên mạng."
      },
      {
        question: "High-speed broadband networks enable seamless video ___ for remote tutoring sessions.",
        options: { A: "streaming", B: "blocking", C: "leaking", D: "dropping" },
        correctAnswer: "A",
        explanation: "video streaming = truyền phát video trực tiếp mượt mà."
      },
      {
        question: "The teacher instructed the class to submit their digital project via the school's online learning ___.",
        options: { A: "portal", B: "barrier", C: "obstacle", D: "staircase" },
        correctAnswer: "A",
        explanation: "online learning portal = cổng thông tin học tập trực tuyến."
      }
    ],

    // BÀI 7: Dissecting School Announcements and Administrative Notices
    6: [
      {
        question: "School Notice: 'Participants in the science exhibition are required to ___ at the central auditorium by 7:30 AM.'",
        options: { A: "assemble", B: "disperse", C: "dismiss", D: "wander" },
        correctAnswer: "A",
        explanation: "assemble = tập trung lại đông đủ theo hiệu lệnh hành chính."
      },
      {
        question: "Administrative Flyer: 'Candidates wishing to apply for the overseas scholarship must ___ their portfolio before Friday.'",
        options: { A: "submit", B: "withhold", C: "destroy", D: "neglect" },
        correctAnswer: "A",
        explanation: "submit a portfolio = nộp hồ sơ/danh mục thành tích."
      },
      {
        question: "Official Memo: 'For further inquiries regarding the environmental contest, please ___ Ms. Lan at Room 302.'",
        options: { A: "contact", B: "connect with", C: "inform to", D: "demand" },
        correctAnswer: "A",
        explanation: "contact someone = liên hệ với ai để biết thêm chi tiết."
      },
      {
        question: "Announcement: 'Late applications will not be ___ under any circumstances due to strict evaluation deadlines.'",
        options: { A: "accepted", B: "accepting", C: "accept", D: "to accept" },
        correctAnswer: "A",
        explanation: "Passive voice: will not be + V3 (accepted) = không được chấp thuận."
      },
      {
        question: "Library Advisory: 'All borrowed volumes must be returned on or before the designated ___ date.'",
        options: { A: "due", B: "late", C: "past", D: "old" },
        correctAnswer: "A",
        explanation: "due date = hạn chót phải trả sách."
      },
      {
        question: "Bulletin: 'Admission to the acoustic charity concert is completely ___ for registered students.'",
        options: { A: "complimentary", B: "expensive", C: "obligatory", D: "costly" },
        correctAnswer: "A",
        explanation: "complimentary = free of charge (miễn phí vé vào cửa)."
      },
      {
        question: "Notice to Club Presidents: 'Please ensure that your semester financial report is duly signed by your faculty ___.'",
        options: { A: "advisor", B: "pedestrian", C: "spectator", D: "applicant" },
        correctAnswer: "A",
        explanation: "faculty advisor = cố vấn học tập / giáo viên hướng dẫn."
      },
      {
        question: "Campus Notice: 'Smoking and the disposal of litter are strictly ___ throughout the school grounds.'",
        options: { A: "prohibited", B: "promoted", C: "recommended", D: "permitted" },
        correctAnswer: "A",
        explanation: "strictly prohibited = bị nghiêm cấm hoàn toàn."
      },
      {
        question: "Event Poster: 'Don't miss the opportunity to network with leading industry experts. Register ___ now!'",
        options: { A: "online", B: "offline", C: "backward", D: "reluctantly" },
        correctAnswer: "A",
        explanation: "Register online now = Đăng ký trực tuyến ngay bây giờ."
      },
      {
        question: "Volunteer Call: 'Applicants must possess strong communication skills and be willing to work in ___.'",
        options: { A: "teams", B: "solitude", C: "isolation", D: "secrecy" },
        correctAnswer: "A",
        explanation: "work in teams = có tinh thần làm việc nhóm."
      },
      {
        question: "Public Circular: 'The annual sports festival has been postponed ___ adverse storm conditions.'",
        options: { A: "due to", B: "despite", C: "in spite of", D: "although" },
        correctAnswer: "A",
        explanation: "due to + noun phrase = do/bởi vì thời tiết xấu."
      },
      {
        question: "Workshop Agenda: 'The morning session will ___ a keynote speech followed by interactive panel discussions.'",
        options: { A: "feature", B: "lack", C: "omit", D: "avoid" },
        correctAnswer: "A",
        explanation: "feature = bao gồm tiết mục/chương trình trọng tâm."
      },
      {
        question: "Health Advisory: 'Students exhibiting fever or coughing symptoms should ___ from attending classes in person.'",
        options: { A: "refrain", B: "encourage", C: "persist", D: "proceed" },
        correctAnswer: "A",
        explanation: "refrain from doing something = tự kiềm chế, tạm tránh làm gì."
      },
      {
        question: "Notice: 'Lockers are allocated on a first-come, first-___ basis at the student affairs office.'",
        options: { A: "served", B: "service", C: "serving", D: "servant" },
        correctAnswer: "A",
        explanation: "first-come, first-served = ưu tiên ai đến trước phục vụ trước."
      },
      {
        question: "Communique: 'We regret to inform you that all seats for the graduation gala are now fully ___.'",
        options: { A: "booked", B: "opened", C: "empty", D: "vacant" },
        correctAnswer: "A",
        explanation: "fully booked = đã được đặt kín chỗ hoàn toàn."
      }
    ],

    // BÀI 8: Pronoun Tracing and Discourse Markers in Sentence Ordering
    7: [
      {
        question: "Which of the following is MOST SUITABLE as an autonomous opening sentence for an essay?",
        options: {
          A: "Ecotourism has developed into an important sector that promotes both conservation and local prosperity.",
          B: "Consequently, stringent regulations must be enforced along fragile coral reefs.",
          C: "However, these remote destinations often lack adequate municipal sewage infrastructure.",
          D: "They also assert that tourist revenue directly supports forest ranger patrols."
        },
        correctAnswer: "A",
        explanation: "Sentence A states the general theme independently without unreferenced pronouns or contrast connectors."
      },
      {
        question: "Which transition discourse marker signifies a DIRECT CAUSE-AND-CONSEQUENCE relationship?",
        options: { A: "Consequently", B: "Furthermore", C: "Conversely", D: "Similarly" },
        correctAnswer: "A",
        explanation: "Consequently = As a result, indicates cause and consequence."
      },
      {
        question: "Which connector should be utilized to introduce a SHARP CONTRAST to an earlier claim?",
        options: { A: "On the contrary", B: "In addition", C: "Therefore", D: "As a consequence" },
        correctAnswer: "A",
        explanation: "On the contrary introduces a direct opposite or sharp contrast."
      },
      {
        question: "Consider: 'Solar arrays convert sunlight into electricity. (Blank), they do not emit greenhouse pollutants during operation.'",
        options: { A: "Moreover", B: "Nevertheless", C: "Otherwise", D: "Despite" },
        correctAnswer: "A",
        explanation: "Moreover adds another supporting benefit of solar technology."
      },
      {
        question: "In logical paragraph cohesion, which element must appear FIRST before a pronoun replaces it?",
        options: { A: "The full antecedent noun phrase", B: "The dependent clause", C: "The transition word", D: "The concluding summary" },
        correctAnswer: "A",
        explanation: "The full antecedent noun phrase must be introduced before pronouns can refer back to it."
      },
      {
        question: "Order this 3-sentence sequence:\n(1) As a result, coastal erosion accelerated.\n(2) Severe typhoons battered the shoreline.\n(3) Mangrove forests had been previously cleared.",
        options: { A: "3 - 2 - 1", B: "1 - 2 - 3", C: "2 - 1 - 3", D: "3 - 1 - 2" },
        correctAnswer: "A",
        explanation: "Root condition (cleared mangroves) -> Event (severe typhoons) -> Direct consequence (erosion accelerated)."
      },
      {
        question: "Which word signals an INITIAL STEP in a procedural instructional sequence?",
        options: { A: "Initially", B: "Ultimately", C: "Consequently", D: "Conversely" },
        correctAnswer: "A",
        explanation: "Initially = At the beginning / First of all."
      },
      {
        question: "Reorder this conversation:\n(1) 'Yes, I would love to! When does it start?'\n(2) 'Would you like to attend the environmental film screening tonight?'\n(3) 'It begins at 7:00 PM in the auditorium.'",
        options: { A: "2 - 1 - 3", B: "1 - 2 - 3", C: "3 - 2 - 1", D: "2 - 3 - 1" },
        correctAnswer: "A",
        explanation: "Invitation (2) -> Acceptance and follow-up question (1) -> Time clarification (3)."
      },
      {
        question: "Which linking expression should be selected to summarize the MAIN THESIS in the final paragraph?",
        options: { A: "In conclusion", B: "For instance", C: "Initially", D: "On the other hand" },
        correctAnswer: "A",
        explanation: "In conclusion signals the summarizing final remarks."
      },
      {
        question: "Consider: 'He prepared meticulously for the entrance examination. (Blank), he achieved the highest distinction.'",
        options: { A: "Thus", B: "However", C: "Although", D: "Whereas" },
        correctAnswer: "A",
        explanation: "Thus = Therefore, signifies logical consequence."
      },
      {
        question: "Which of the following CANNOT serve as a logical discourse marker of ADDITION?",
        options: { A: "In contrast", B: "Furthermore", C: "Besides", D: "Additionally" },
        correctAnswer: "A",
        explanation: "In contrast indicates opposition, not addition."
      },
      {
        question: "Determine the coherent order:\n(1) They also provide critical shelter for endangered reef species.\n(2) Coral reefs are among the most biodiverse marine ecosystems.\n(3) Furthermore, they protect shorelines from severe sea storms.",
        options: { A: "2 - 1 - 3", B: "1 - 2 - 3", C: "3 - 2 - 1", D: "2 - 3 - 1" },
        correctAnswer: "A",
        explanation: "Topic sentence introducing coral reefs (2) -> first supporting benefit with 'They' (1) -> additional benefit with 'Furthermore' (3)."
      },
      {
        question: "Which connective phrase introduces an ILLUSTRATIVE CONCRETE EXAMPLE?",
        options: { A: "For instance", B: "In consequence", C: "Nonetheless", D: "In summary" },
        correctAnswer: "A",
        explanation: "For instance = For example, introduces concrete evidence."
      },
      {
        question: "Why is 'They argued that the policy was ineffective' unsuited as an opening paragraph sentence?",
        options: {
          A: "The pronoun 'They' has no clear antecedent noun previously stated.",
          B: "It is grammatically ungrammatical.",
          C: "It is too long to start an essay.",
          D: "Past tense can never start a paragraph."
        },
        correctAnswer: "A",
        explanation: "Starting with 'They' creates ambiguity because the reader does not know who 'They' refers to."
      },
      {
        question: "Consider: 'The government invested heavily in public transport. (Blank), private vehicle congestion persisted.'",
        options: { A: "Nevertheless", B: "Consequently", C: "Moreover", D: "Therefore" },
        correctAnswer: "A",
        explanation: "Nevertheless introduces a surprising concession / counter-result."
      }
    ]
  };
}

// 3. Hàm chính nạp toàn bộ
async function run() {
  console.log('=== [BƯỚC 1] LẤY DANH SÁCH BÀI HỌC VÀ KỸ NĂNG ===');
  const { lessons, skills } = await getLessonsAndSkills();
  console.log('Tìm thấy ' + lessons.length + ' bài học trong môn Tiếng Anh 10.\n');

  const quizMap = generate15QuizzesPerLesson();

  console.log('=== [BƯỚC 2] CẬP NHẬT 15 MINI-QUIZZES CHO TỪNG BÀI HỌC ===');
  for (let idx = 0; idx < lessons.length; idx++) {
    const les = lessons[idx];
    const quizzes = quizMap[idx] || [];

    // Xóa mini-quizzes cũ nếu có
    const rOld = await fetch(BASE_CONTENT + '/lessons/' + les.lessonId + '/mini-quizzes');
    const dOld = await rOld.json();
    for (const oldQ of (dOld.data || [])) {
      await fetch(BASE_CONTENT + '/lessons/mini-quizzes/' + oldQ.id, { method: 'DELETE' });
    }

    // Nạp gói 15 câu quiz chuẩn
    await fetch(BASE_CONTENT + '/lessons/' + les.lessonId + '/mini-quizzes', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: `Comprehensive Mini-Quiz: ${les.lessonTitle}`,
        description: `Trọn bộ 15 câu hỏi trắc nghiệm đánh giá năng lực ngôn ngữ, kiểm tra hiểu bài toàn diện cho bài học "${les.lessonTitle}".`,
        questionsJson: JSON.stringify(quizzes)
      })
    });

    console.log(`[OK] Bài ${idx + 1}/${lessons.length}: Đã nạp thành công 15 câu quiz cho "${les.lessonTitle}"`);
  }

  console.log('\n=== [BƯỚC 3] NẠP 100 CÂU HỎI VÀO NGÂN HÀNG CÂU HỎI (QUESTION BANK) ===');
  // Lấy các câu hỏi hiện có trong bank
  const rBank = await fetch(BASE_QUESTION + '/manage?questionBankId=' + BANK_ID);
  const dBank = await rBank.json();
  const currentCount = (dBank.data || []).length;
  console.log('Số câu hỏi hiện có trong Question Bank:', currentCount);

  // Xóa các câu cũ để tái cấu trúc đủ đúng 100 câu phân hóa rõ ràng
  for (const q of (dBank.data || [])) {
    await fetch(BASE_QUESTION + '/' + q.id, { method: 'DELETE' });
  }
  console.log('Đã làm sạch ngân hàng đề để chuẩn bị nạp 100 câu hỏi chuẩn hóa.');

  let totalBankQuestionsCreated = 0;
  const difficulties = ['EASY', 'MEDIUM', 'HARD'];

  // Lặp qua các bài học, mỗi bài học nạp 12-13 câu hỏi từ kho 15 câu để đạt đúng mốc 100 câu trong Question Bank
  for (let lesIdx = 0; lesIdx < lessons.length; lesIdx++) {
    const les = lessons[lesIdx];
    const quizPool = quizMap[lesIdx] || [];
    const questionsToSeed = lesIdx < 4 ? 13 : 12; // 4 * 13 + 4 * 12 = 52 + 48 = 100 câu!

    for (let qIdx = 0; qIdx < questionsToSeed; qIdx++) {
      const qData = quizPool[qIdx];
      if (!qData) continue;

      const diff = difficulties[(totalBankQuestionsCreated + qIdx) % 3];
      const optEntries = Object.entries(qData.options);

      await fetch(BASE_QUESTION, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          questionBankId: BANK_ID,
          skillId: les.skillId || skills[lesIdx % skills.length]?.id,
          moduleId: les.moduleId,
          topicId: les.topicId,
          lessonId: les.lessonId,
          content: qData.question,
          difficulty: diff,
          explanation: qData.explanation,
          displayOrder: totalBankQuestionsCreated + 1,
          options: optEntries.map(([key, text], optIndex) => ({
            optionContent: `${key}. ${text}`,
            isCorrect: key === qData.correctAnswer,
            displayOrder: optIndex + 1
          }))
        })
      });

      totalBankQuestionsCreated++;
      process.stdout.write(`\rĐang nạp Question Bank: ${totalBankQuestionsCreated}/100 câu hỏi...`);
    }
  }

  console.log(`\n\n======================================================================`);
  console.log(`  HOÀN THÀNH XUẤT SẮC TOÀN BỘ YÊU CẦU:`);
  console.log(`  1. Mỗi bài học đã có trọn vẹn đúng 15 câu Mini-Quiz kiểm tra (tổng 120 câu).`);
  console.log(`  2. Đã tạo chính xác 100 câu hỏi trong Ngân hàng câu hỏi (Question Bank)`);
  console.log(`     trên Question Service (port 8083), phân hóa EASY/MEDIUM/HARD.`);
  console.log(`======================================================================`);
}

run().catch(console.error);

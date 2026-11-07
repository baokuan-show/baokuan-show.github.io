/* 爆款提詞器 — 人設草稿工具。文案、公式與程式皆為新寫，不沿用其他提詞工具。 */
(function () {
  const KEY = 'gaoqian_v1';
  const RECOVERY = 'gaoqian_v1_recovery';
  const STEPS = 8;

  const TRAITS = ['直球', '溫和', '先講結論', '先講故事', '帶著笑', '慢一點', '像聊天'];
  const VALUES = ['把話說清楚', '尊重對方節奏', '家人一起決定', '長期信任', '不誇大', '先聽再說'];
  const PROS = ['能把複雜的事收成一句', '觀察入微', '做事有後手', '願意先做給別人看', '穩定出勤', '會接話'];
  const CONS = ['步調偏快', '不太喜歡繞圈', '容易一次講太多', '不愛出鏡', '容易分心', '怕冷場就補話'];
  const CON_NOTE = {
    '步調偏快': '可以拍成「我怎麼把一次講完的習慣改成先問一句」。',
    '不太喜歡繞圈': '適合開頭就給結論，再補一個例子。',
    '容易一次講太多': '一支片只留一個問題，其餘放下一支。',
    '不愛出鏡': '用手上的物件、環境聲和旁白就夠。',
    '容易分心': '用一個固定開場句，把片子收回來。',
    '怕冷場就補話': '留白也是節奏，字幕可以代替多講的那句。'
  };
  const VIDEOS = ['口播', '生活片段', '圖卡講解', '兩人對談'];
  const THEMES = [
    { id: 'well', name: '墨綠', color: '#0C4F45' },
    { id: 'night', name: '深藍', color: '#1B3A4B' },
    { id: 'camp', name: '橄欖綠', color: '#3D4A28' },
    { id: 'paper', name: '咖啡', color: '#5C3B2E' }
  ];
  const VOICE = {
    ENTJ: '先講結論，句子短，適合把一件複雜的事收成一個決定。',
    ENTP: '喜歡拆常見講法，適合用問句開頭，但要收成一個可執行的點。',
    ENFJ: '會帶著人往前，適合先點出對方的處境，再給一步。',
    ENFP: '故事感強，適合從一個畫面進來，記得中段收斂成一件事。',
    ESTJ: '步驟清楚，適合清單和核對，不要堆形容詞。',
    ESTP: '反應快，適合現場片段，少預告、多讓觀眾看到當下。',
    ESFJ: '在意對方感不感受得到，適合對話式，不要變成說教。',
    ESFP: '畫面活，適合生活片段帶一句觀點，不要只剩熱鬧。',
    INTJ: '結構穩，適合先給框架再舉一個例子。',
    INTP: '會追問前提，適合把一個模糊詞講清楚。',
    INFJ: '語氣慢，適合長一點的故事，但開頭仍要進入處境。',
    INFP: '在意價值，適合先講為什麼在意，再講做法。',
    ISTJ: '可靠、具體，適合核對清單和前後步驟。',
    ISTP: '動手派，適合示範一個小動作，少空話。',
    ISFJ: '細心，適合把容易被忽略的細節指出來。',
    ISFP: '感覺準，適合用一個安靜的畫面說話。'
  };

  const QUIZ = [
    q('EI', 'E', 'I', '拍完一支短片，你下一步比較想？', '立刻跟觀眾聊', '先把句子改順再發'),
    q('EI', 'E', 'I', '很多人同時問問題時，你通常？', '越問越有精神', '要先安靜一下再回'),
    q('EI', 'E', 'I', '跟夥伴討論內容時，你多半？', '邊講邊把結論帶出來', '先聽完，稍後再補重點'),
    q('SN', 'S', 'N', '解釋一件事，你習慣？', '用步驟和可以核對的項目', '用一個具體的生活畫面'),
    q('SN', 'S', 'N', '找下一支題材，你多半從？', '這週真實發生的問題', '一個突然冒出來的比喻'),
    q('SN', 'S', 'N', '你希望觀眾帶走？', '一個回家可以做的小檢查', '一種看事情的角度'),
    q('TF', 'T', 'F', '對方說「我有點怕談這個」，你先？', '幫他拆成下一步', '先接住情緒'),
    q('TF', 'T', 'F', '要不要把一句話放進稿子，你在意？', '邏輯站不站得住', '有沒有打到你在意的人'),
    q('TF', 'T', 'F', '看到夥伴的稿太滿，你會？', '指出哪一句會誤導', '先問他想照顧誰，再一起改'),
    q('JP', 'J', 'P', '你的發文節奏比較像？', '這週主題先排好', '遇到值得講的再拍'),
    q('JP', 'J', 'P', '面對這份人設表，你？', '想填完再開始用', '先填能用的，之後再補'),
    q('JP', 'J', 'P', '一支片的結尾你偏好？', '收成一個明確的下一步', '留一點開放，看對方想問什麼')
  ];

  const INSURANCE_GUARD = [
    '不推薦特定商品，也不比較商品名稱。',
    '不承諾報酬、不保證理賠結果、不說買了就一定安心。',
    '不點名、不貶低任何保險公司或同業。',
    '稅務只說明名詞和該準備的資料，不教避稅，也不說這樣做就不用繳。',
    '不留電話號碼，不把個人手機寫進腳本。',
    '提醒觀眾：實際保障以保單條款為準。',
    '行動呼籲用「我們」，例如「歡迎隨時找我們聊聊」。'
  ].join('\n');

  const GENERAL_GUARD = [
    '不寫沒有根據的保證，不用「一定」「永久」「零風險」「百分之百有效」這類說法。',
    '效果、前後差異、收入或學習成果只能當個人經驗，並註明不是每個人都一樣。',
    '遵守平台規則：不誤導、不用恐慌換點擊、不用未授權的他人畫面。',
    '不留電話號碼。',
    '邀約用邀請，不逼人立刻下單或留下個資。'
  ].join('\n');

  const INSURANCE_TOPICS = [
    { id: 'claim', label: '理賠故事', formula: '用一個去識別的情境開頭：當時家人真正卡住的是哪一個問題。中段只講要先弄懂的觀念，例如該準備哪些資料、哪些話聽起來像保證但其實要回到契約。不要演出結果一定如願，也不要比較公司。', advice: '一支片只留一個卡住的問題。人名、醫院、金額能省就省，重點是觀眾能不能對到自己的處境。', cta: '歡迎隨時找我們聊聊，我們陪你把情境對回該看的文件。' },
    { id: 'medical', label: '醫療險觀念', formula: '挑一個常被混在一起的觀念，用生活例子分開講。不推薦方案，不說買了就夠。結尾請觀眾想自己最不清楚的是哪一塊。', advice: '不要用恐懼堆疊疾病名稱。講完一個觀念就停，讓人有餘裕消化。', cta: '歡迎隨時找我們聊聊你最想先搞懂的那一塊。' },
    { id: 'care', label: '長照/退休', formula: '從一個未來的生活畫面開頭，例如誰會需要被陪、一個月的生活怎麼安排。只談準備與對話，不談報酬，也不把長照講成單一答案。', advice: '用生活開銷和照顧人力來問，不要用報酬率收尾。', cta: '歡迎隨時找我們聊聊家裡現在的照顧安排。' },
    { id: 'legacy', label: '傳承與稅務常識', formula: '挑一個名詞，講它會影響誰、家裡要先找出哪些文件。不教避稅，不說這樣做就不用繳。需要判斷時，請觀眾先問合格的稅務或法律專業。', advice: '名詞一次只講一個。不提供節稅步驟，也不把個人經驗說成通則。', cta: '歡迎隨時找我們聊聊你想先弄懂的那個名詞。' },
    { id: 'family', label: '家庭保障檢視', formula: '用家庭角色開頭：誰是經濟來源、誰需要被照顧。中段只留一個缺口問題，不報價、不推薦方案。', advice: '先畫角色，再談缺口。不要在一支片裡把所有家庭成員都講完。', cta: '歡迎隨時找我們聊聊你們家現在最想先看的是誰。' },
    { id: 'money', label: '理財常識', formula: '講一個現金流或預備金的觀念，用家用數字的問法，不推薦標的，不說報酬率，不保證結果。', advice: '數字用來幫助提問，不用來展示績效。不報明牌。', cta: '歡迎隨時找我們聊聊你想先整理的是支出還是預備金。' },
    { id: 'daily', label: '業務日常/團隊帶人', formula: '寫一個帶人時的小決定：你當時怎麼講、後來怎麼調整。不炫耀業績，不貶低同業。結尾問團隊裡的人，這個情況會怎麼處理。', advice: '帶人內容的主角是決定，不是成績單。同業只談做法，不談人名。', cta: '歡迎隨時找我們聊聊你們團隊怎麼處理同樣的情況。' },
    { id: 'recruit', label: '增員', formula: '用一天真實的工作片段，講適合什麼樣的人來了解，不講收入保證，不畫大餅。', advice: '不出現收入數字的承諾。適合誰、不適合誰，兩句都要有。', cta: '歡迎隨時找我們聊聊，先看看這份工作和你的日常合不合。' },
    { id: 'life', label: '生活興趣', formula: '若有生活畫面，用它當開頭，再收回來談為什麼你在意家人預先想過風險。不要把車、露營或寵物拍成商品，也不要硬接到方案。', advice: '興趣負責讓人停下來，主題負責把話收回來。不要為了畫面承諾任何結果。', cta: '歡迎隨時找我們聊聊你自己的日常裡，最想先安排的是什麼。' }
  ];

  const GENERAL_TOPICS = [
    { id: 'beauty', label: '美業', formula: '從一個客人進門前的具體擔心開頭，例如耗時、自然不自然、適不適合自己的日常。中段只講你實際的判斷，不寫永久、零失敗或人人都適合。若有前後差異，註明光線、時間，以及這是單次經驗。', advice: '一次只處理一個擔心。前後畫面要交代條件，不把單次經驗說成普遍效果。', cta: '想看哪一種日常場合，可以留言告訴我們。' },
    { id: 'food', label: '餐飲', formula: '從一個用餐前的具體問題開頭：份量、等待、口味、適不適合某一餐。中段給一個可以自己觀察的點，不寫全台第一或保證再訪。個人偏好就說成這次的感覺。', advice: '用觀察取代最高級形容。一支片只留一道或一個用餐情境。', cta: '想看哪一種吃法，留言告訴我們。' },
    { id: 'house', label: '房產', formula: '從看空間的人會卡住的問題開頭：採光、動線、預算感、適不適合某種生活。中段只講看得到的條件，不替人決定該不該成交，也不說一定增值。', advice: '條件和限制一起講。不替觀眾做買賣決定。', cta: '你最在意的是光線、動線還是生活節奏，可以留言。' },
    { id: 'edu', label: '教育課程', formula: '從一個學不會的具體卡點開頭。中段給一個小練習或判斷方式，不承諾學會、通過或收入。學員故事要匿名，並說明不是每個人進度一樣。', advice: '練習要小到當天做得到。不把個別進度說成課程保證。', cta: '你卡在哪一個步驟，可以留言，我們下一支只拆那一步。' },
    { id: 'fit', label: '健身', formula: '從一個日常動作裡的具體不舒服開頭。中段給一個低門檻的觀念和停止時機，不寫幾天改變，也不寫醫療效果。提醒不適就停。', advice: '講停止時機，比講強度更重要。不羞辱身體。', cta: '想先照顧哪一個日常動作，可以留言告訴我們。' },
    { id: 'shop', label: '電商', formula: '從購買前的具體疑問開頭：尺寸、材質、使用幾天後的差異。中段講你自己用過的範圍，不寫全網最低、保證有效或沒有缺點。至少講一個不適合的情況。', advice: '缺點和適用範圍要出現。價格與庫存若會變，不要說成永遠。', cta: '你想核對的是尺寸、材質還是使用情境，可以留言。' },
    { id: 'studio', label: '設計工作室', formula: '從委託前的具體不清楚開頭：要準備什麼、怎樣算改完、怎樣看草稿。中段講過程和可以討論的範圍，不保證爆紅或一定成交。', advice: '把模糊的期待改成可討論的範圍。不承諾曝光或業績。', cta: '你現在卡在目標、材料還是時程，可以留言。' },
    { id: 'mind', label: '心靈成長', formula: '從一個當下的狀態開頭，先讓人覺得被理解。中段給一個今天做得到的小動作，不把痛苦說成想開就好，也不取代專業協助。若涉及長期低落，建議尋求合格的協助。', advice: '不把複雜的處境收成一句雞湯。需要專業協助時要說出來。', cta: '如果只能做一件很小的事，你會選哪一件，可以留言。' },
    { id: 'lifestyle', label: '生活風格', formula: '用一個你真實在過的片段開頭，講一個選擇背後的理由。不要昇華成所有人都該跟你一樣，也不要把片段變成誇大的人生建議。', advice: '片段要具體，結論要小。不替所有人的生活方式下判斷。', cta: '想多看哪一種日常，可以留言告訴我們。' }
  ];

  const POLISH = [
    '開頭三秒有沒有進入一個具體處境，而不是寒暄。',
    '有沒有用行為和畫面說話，而不是形容詞自誇。',
    '有沒有越界的保證或誇大效果。',
    '邀約是不是邀請，而不是逼單。',
    '這段話像不像這個人設會說的。'
  ];
  const INSURANCE_POLISH = [
    '有沒有推薦特定商品，或暗示理賠、報酬一定發生。',
    '有沒有點名或貶低保險公司。',
    '有沒有把稅務講成避稅做法。',
    '有沒有提醒實際保障以保單條款為準。',
    '行動呼籲有沒有用「我們」，例如「歡迎隨時找我們聊聊」。'
  ];

  function q(axis, a, b, text, aLabel, bLabel) {
    return { axis, a, b, text, aLabel, bLabel };
  }

  function uid() {
    return 'g' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function blankQuiz() {
    return { answers: Array(QUIZ.length).fill(null), index: 0 };
  }

  function blankPersona() {
    return {
      id: uid(),
      industry: '',
      trade: '',
      name: '',
      title: '',
      positioning: '',
      audience: '',
      traits: [],
      values: [],
      niches: [],
      pros: [],
      cons: [],
      scenes: [],
      mbti: '',
      quiz: blankQuiz(),
      videoTypes: [],
      theme: 'well',
      ideas: [],
      progress: { step: 1, furthest: 1 }
    };
  }

  let state = { personas: [], activePersonaId: '' };
  let corruptLock = false;
  let toastTimer = 0;

  function active() {
    let p = state.personas.find((item) => item.id === state.activePersonaId);
    if (!p) {
      p = state.personas[0];
      state.activePersonaId = p.id;
    }
    return p;
  }

  function topicsFor(p) {
    if (p.industry === 'insurance') return INSURANCE_TOPICS;
    if (p.industry === 'general') return GENERAL_TOPICS;
    return [];
  }

  function topicById(p, id) {
    return topicsFor(p).find((item) => item.id === id) || null;
  }

  function clean(value) {
    return String(value ?? '')
      .replace(/09\d{2}[- ]?\d{3}[- ]?\d{3}/g, '〔已省略電話〕')
      .replace(/0\d{1,2}-\d{6,8}/g, '〔已省略電話〕');
  }

  function asString(value) {
    return typeof value === 'string' ? value : '';
  }

  function mustArray(raw, label, index) {
    if (raw === undefined) return [];
    if (!Array.isArray(raw)) throw new Error('第 ' + index + ' 筆人設的「' + label + '」必須是陣列');
    return raw;
  }

  function normalizePersona(raw, index) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      throw new Error('第 ' + index + ' 筆人設不是物件');
    }
    const base = blankPersona();
    const id = typeof raw.id === 'string' && raw.id.trim() ? raw.id.trim() : base.id;
    const industry = raw.industry === 'insurance' || raw.industry === 'general' ? raw.industry : '';
    const strings = ['trade', 'name', 'title', 'positioning', 'audience'];
    strings.forEach((key) => {
      if (raw[key] != null && typeof raw[key] !== 'string') throw new Error('第 ' + index + ' 筆人設的「' + key + '」必須是文字');
    });
    const traits = mustArray(raw.traits, '特質', index).filter((item) => typeof item === 'string');
    const values = mustArray(raw.values, '在意的事', index).filter((item) => typeof item === 'string');
    const niches = mustArray(raw.niches, '主題', index).filter((item) => typeof item === 'string');
    const pros = mustArray(raw.pros, '強項', index).filter((item) => typeof item === 'string');
    const cons = mustArray(raw.cons, '還在練', index).filter((item) => typeof item === 'string');
    const scenes = mustArray(raw.scenes, '生活畫面', index).filter((item) => typeof item === 'string');
    const videoTypes = mustArray(raw.videoTypes, '影片形式', index).filter((item) => typeof item === 'string');
    const ideasRaw = mustArray(raw.ideas, '靈感', index);
    const ideas = ideasRaw.map((idea, ideaIndex) => {
      if (!idea || typeof idea !== 'object' || Array.isArray(idea)) {
        throw new Error('第 ' + index + ' 筆人設的第 ' + (ideaIndex + 1) + ' 則靈感不是物件');
      }
      if (idea.content != null && typeof idea.content !== 'string') throw new Error('靈感內容必須是文字');
      if (idea.sourceType != null && typeof idea.sourceType !== 'string') throw new Error('靈感來源必須是文字');
      if (idea.link != null && typeof idea.link !== 'string') throw new Error('靈感連結必須是文字');
      if (idea.category != null && typeof idea.category !== 'string') throw new Error('靈感主題必須是文字');
      return {
        id: typeof idea.id === 'string' && idea.id ? idea.id : uid(),
        content: asString(idea.content),
        sourceType: asString(idea.sourceType) || '其他',
        link: asString(idea.link),
        category: asString(idea.category),
        createdAt: Number(idea.createdAt) || Date.now()
      };
    });
    const answers = blankQuiz().answers;
    let quizIndex = 0;
    if (raw.quiz != null) {
      if (typeof raw.quiz !== 'object' || Array.isArray(raw.quiz)) throw new Error('第 ' + index + ' 筆人設的測驗狀態不是物件');
      if (raw.quiz.answers != null && !Array.isArray(raw.quiz.answers)) throw new Error('測驗答案必須是陣列');
      (raw.quiz.answers || []).slice(0, QUIZ.length).forEach((letter, i) => {
        if (letter === QUIZ[i].a || letter === QUIZ[i].b) answers[i] = letter;
      });
      quizIndex = Math.max(0, Math.min(QUIZ.length, Number(raw.quiz.index) || 0));
    }
    const mbti = typeof raw.mbti === 'string' && VOICE[raw.mbti] ? raw.mbti : '';
    const theme = THEMES.some((item) => item.id === raw.theme) ? raw.theme : 'well';
    let step = Math.max(1, Math.min(STEPS, Number(raw.progress && raw.progress.step) || 1));
    let furthest = Math.max(step, Math.min(STEPS, Number(raw.progress && raw.progress.furthest) || step));
    return {
      id, industry, theme, mbti, ideas, traits, values, niches, pros, cons, scenes, videoTypes,
      trade: asString(raw.trade),
      name: asString(raw.name),
      title: asString(raw.title),
      positioning: asString(raw.positioning),
      audience: asString(raw.audience),
      quiz: { answers, index: quizIndex },
      progress: { step, furthest }
    };
  }

  function normalizeState(parsed) {
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('檔案最外層必須是物件');
    }
    let list = parsed.personas;
    let single = false;
    if (!Array.isArray(list)) {
      if (parsed.persona && typeof parsed.persona === 'object' && !Array.isArray(parsed.persona)) {
        const one = Object.assign({}, parsed.persona);
        if ((!one.ideas || !one.ideas.length) && Array.isArray(parsed.ideas)) one.ideas = parsed.ideas;
        list = [one];
        single = true;
      } else {
        throw new Error('找不到 personas 陣列。請使用這個工具匯出的備份（含 personas 與 activePersonaId）。');
      }
    }
    if (!list.length) throw new Error('人設清單是空的');
    const personas = list.map((item, i) => normalizePersona(item, i + 1));
    const ids = personas.map((item) => item.id);
    if (new Set(ids).size !== ids.length) throw new Error('有兩筆人設用了同一個 id');
    let activePersonaId = typeof parsed.activePersonaId === 'string' ? parsed.activePersonaId : '';
    if (!personas.some((item) => item.id === activePersonaId)) activePersonaId = personas[0].id;
    return { state: { personas, activePersonaId }, single };
  }

  function serialize() {
    return { kind: 'gaoqian', version: 1, activePersonaId: state.activePersonaId, personas: state.personas };
  }

  function save() {
    if (corruptLock) return;
    localStorage.setItem(KEY, JSON.stringify(serialize()));
  }

  function enterCorrupt(raw) {
    corruptLock = true;
    if (!localStorage.getItem(RECOVERY)) localStorage.setItem(RECOVERY, raw);
    state = { personas: [blankPersona()], activePersonaId: '' };
    state.activePersonaId = state.personas[0].id;
  }

  function load() {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const p = blankPersona();
      state = { personas: [p], activePersonaId: p.id };
      return;
    }
    try {
      state = normalizeState(JSON.parse(raw)).state;
      corruptLock = false;
    } catch (err) {
      enterCorrupt(raw);
    }
  }

  function $(id) { return document.getElementById(id); }

  function toast(message) {
    const el = $('toast');
    el.textContent = message;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 2400);
  }

  function confirmBox(title, body) {
    $('confirmTitle').textContent = title;
    $('confirmBody').textContent = body;
    $('confirm').hidden = false;
    return new Promise((resolve) => {
      const done = (value) => {
        $('confirm').hidden = true;
        $('confirmOk').onclick = null;
        $('confirmCancel').onclick = null;
        resolve(value);
      };
      $('confirmOk').onclick = () => done(true);
      $('confirmCancel').onclick = () => done(false);
    });
  }

  function download(filename, text, type) {
    const blob = new Blob([text], { type: type || 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function safeHref(value) {
    const text = String(value || '').trim();
    if (!text) return '';
    try {
      const url = new URL(text);
      if (url.protocol === 'https:' || url.protocol === 'http:') return url.href;
    } catch (err) { /* 相對路徑或 javascript: 都不做成連結 */ }
    return '';
  }

  function scoreQuiz(answers) {
    const axes = [['EI', 'E', 'I'], ['SN', 'S', 'N'], ['TF', 'T', 'F'], ['JP', 'J', 'P']];
    let type = '';
    for (const [axis, a, b] of axes) {
      const letters = QUIZ.map((item, index) => item.axis === axis ? answers[index] : null).filter(Boolean);
      if (letters.length < 3) return '';
      const countA = letters.filter((letter) => letter === a).length;
      type += countA >= 2 ? a : b;
    }
    return VOICE[type] ? type : '';
  }

  function go(view) {
    document.querySelectorAll('[data-view-panel]').forEach((panel) => {
      panel.hidden = panel.dataset.viewPanel !== view;
    });
    document.querySelectorAll('#navDesktop button, #navMobile button').forEach((button) => {
      const on = button.dataset.view === view;
      button.setAttribute('aria-current', on ? 'page' : 'false');
    });
    if (view === 'persona') render();
    if (view === 'ideas') { renderIdeaCategory(); renderIdeas(); }
    if (view === 'prompts') renderPromptNiche();
    if (view === 'advice') renderAdvice();
    if (view === 'backup') renderRecoveryNote();
    window.scrollTo(0, 0);
  }

  function goStep(n, advance) {
    const p = active();
    const furthest = p.progress.furthest || 1;
    const step = Math.max(1, Math.min(STEPS, n));
    if (!advance && step > furthest) return;
    p.progress.step = step;
    p.progress.furthest = Math.max(furthest, step);
    save();
    paintStep();
    window.scrollTo(0, 0);
  }

  function paintStep() {
    const p = active();
    const step = p.progress.step || 1;
    document.querySelectorAll('.step').forEach((el) => {
      el.hidden = Number(el.dataset.step) !== step;
    });
    $('wizardLabel').textContent = '第 ' + step + ' 步，共 8 步';
    $('wizardPrev').hidden = step === 1;
    $('wizardNext').hidden = step === 8;
    $('wizardNext').textContent = step === 7 ? '看人設卡' : '下一步';
    document.querySelectorAll('#stepJumps button').forEach((button) => {
      const n = Number(button.dataset.step);
      button.disabled = n > (p.progress.furthest || 1);
      button.classList.toggle('is-on', n === step);
      button.classList.toggle('is-done', n < step && n <= (p.progress.furthest || 1));
      button.setAttribute('aria-current', n === step ? 'step' : 'false');
    });
    if (step === 8) renderCard();
    if (step === 4) renderNiches();
  }

  function setIndustry(value) {
    const p = active();
    if (p.industry === value) return;
    p.industry = value;
    p.niches = [];
    if (value !== 'general') p.trade = '';
    save();
    clearPrompt();
    renderSwitcher();
    renderIndustry();
    renderNiches();
    renderCard();
    renderIdeaCategory();
    renderPromptNiche();
  }

  function renderIndustry() {
    const p = active();
    $('indInsurance').setAttribute('aria-pressed', p.industry === 'insurance' ? 'true' : 'false');
    $('indGeneral').setAttribute('aria-pressed', p.industry === 'general' ? 'true' : 'false');
    $('tradeWrap').hidden = p.industry !== 'general';
    $('exampleWrap').hidden = p.industry !== 'insurance';
    $('pTrade').value = p.trade || '';
    $('pPositioning').placeholder = p.industry === 'insurance'
      ? '例如：把家庭保障講清楚的顧問'
      : p.industry === 'general'
        ? '例如：把店裡每天在忙什麼拍給客人看'
        : '你幫誰把什麼事看懂';
    $('nicheLede').textContent = p.industry === 'insurance'
      ? '這些主題會套用保險溝通的公式與合規界線。'
      : p.industry === 'general'
        ? '這些是一般創作者主題，不會套用保險用語。'
        : '選產業之後，這裡會換成對應的主題。';
  }

  function chipButtons(host, options, field) {
    const p = active();
    host.replaceChildren();
    options.forEach((label) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'chip';
      button.textContent = label;
      const on = p[field].includes(label);
      button.setAttribute('aria-pressed', on ? 'true' : 'false');
      button.addEventListener('click', () => {
        const list = active()[field];
        const at = list.indexOf(label);
        if (at >= 0) list.splice(at, 1);
        else list.push(label);
        save();
        chipButtons(host, options, field);
        if (field === 'cons') renderConNotes();
        if (active().progress.step === 8) renderCard();
      });
      host.appendChild(button);
    });
  }

  function renderNiches() {
    const p = active();
    const host = $('nicheChips');
    const empty = $('nicheEmpty');
    const topics = topicsFor(p);
    empty.hidden = topics.length > 0;
    host.replaceChildren();
    topics.forEach((topic) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'chip';
      button.textContent = topic.label;
      const on = p.niches.includes(topic.id);
      button.setAttribute('aria-pressed', on ? 'true' : 'false');
      button.addEventListener('click', () => {
        const list = active().niches;
        const at = list.indexOf(topic.id);
        if (at >= 0) list.splice(at, 1);
        else list.push(topic.id);
        save();
        renderNiches();
        renderPromptNiche();
        if (active().progress.step === 8) renderCard();
      });
      host.appendChild(button);
    });
    renderScenes();
  }

  function renderScenes() {
    const host = $('sceneList');
    host.replaceChildren();
    active().scenes.forEach((scene) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'chip';
      button.setAttribute('aria-pressed', 'true');
      button.textContent = scene + '  移除';
      button.addEventListener('click', () => {
        const p = active();
        p.scenes = p.scenes.filter((item) => item !== scene);
        save();
        renderScenes();
        renderCard();
      });
      host.appendChild(button);
    });
  }

  function renderConNotes() {
    const host = $('conNotes');
    host.replaceChildren();
    active().cons.forEach((item) => {
      const p = document.createElement('p');
      p.className = 'field-note';
      p.textContent = item + ' — ' + (CON_NOTE[item] || '想想這個習慣可以拍成哪一個具體畫面。');
      host.appendChild(p);
    });
  }

  function renderThemes() {
    const host = $('themeChips');
    host.replaceChildren();
    const p = active();
    THEMES.forEach((theme) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'chip';
      button.textContent = theme.name;
      button.setAttribute('aria-pressed', p.theme === theme.id ? 'true' : 'false');
      button.addEventListener('click', () => {
        active().theme = theme.id;
        save();
        renderThemes();
        renderCard();
      });
      host.appendChild(button);
    });
  }

  function renderSwitcher() {
    const host = $('switcher');
    host.replaceChildren();
    state.personas.forEach((p) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'chip';
      const name = p.name.trim() || '未命名';
      const mark = p.industry === 'insurance' ? '保險' : p.industry === 'general' ? '其他' : '未選';
      button.textContent = name + '・' + mark;
      button.setAttribute('aria-pressed', p.id === state.activePersonaId ? 'true' : 'false');
      button.addEventListener('click', () => {
        if (p.id === state.activePersonaId) return;
        state.activePersonaId = p.id;
        save();
        clearPrompt();
        render();
        toast('已切換人設');
      });
      host.appendChild(button);
    });
    const add = document.createElement('button');
    add.type = 'button';
    add.className = 'btn ghost';
    add.id = 'btnAddPersona';
    add.textContent = '新增一份人設';
    add.addEventListener('click', () => {
      const fresh = blankPersona();
      state.personas.push(fresh);
      state.activePersonaId = fresh.id;
      save();
      clearPrompt();
      render();
      toast('已新增一份空白人設');
    });
    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'btn danger';
    del.textContent = '刪除這份人設';
    del.addEventListener('click', async () => {
      const ok = await confirmBox('刪除這份人設？', '這份人設和它的靈感會一起刪掉。');
      if (!ok) return;
      const current = active().id;
      state.personas = state.personas.filter((item) => item.id !== current);
      if (!state.personas.length) state.personas.push(blankPersona());
      state.activePersonaId = state.personas[0].id;
      save();
      clearPrompt();
      render();
      toast('已刪除');
    });
    host.append(add, del);
  }

  function fillBasics() {
    const p = active();
    $('pName').value = p.name;
    $('pTitle').value = p.title || '';
    $('pPositioning').value = p.positioning;
    $('pAudience').value = p.audience;
    $('pTrade').value = p.trade;
    if ([...$('pMbti').options].some((option) => option.value === p.mbti)) $('pMbti').value = p.mbti;
    else $('pMbti').value = '';
  }

  function renderQuiz() {
    const p = active();
    const answers = p.quiz.answers;
    const index = Math.max(0, Math.min(QUIZ.length, p.quiz.index || 0));
    const done = index >= QUIZ.length && scoreQuiz(answers);
    $('quizResult').hidden = !done;
    $('quizRetake').hidden = !done;
    $('quizPrev').disabled = index === 0;
    if (done) {
      const type = scoreQuiz(answers);
      $('quizMeta').textContent = '12 題完成';
      $('quizText').textContent = '';
      $('quizOpts').replaceChildren();
      $('quizResult').replaceChildren();
      const title = document.createElement('p');
      title.style.fontWeight = '800';
      title.textContent = type;
      const desc = document.createElement('p');
      desc.textContent = VOICE[type] || '';
      $('quizResult').append(title, desc);
      return;
    }
    const item = QUIZ[Math.min(index, QUIZ.length - 1)];
    $('quizMeta').textContent = '第 ' + (Math.min(index, QUIZ.length - 1) + 1) + ' 題，共 12 題';
    $('quizText').textContent = item.text;
    $('quizOpts').replaceChildren();
    [ [item.a, item.aLabel], [item.b, item.bLabel] ].forEach(([letter, label]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'quiz-opt btn ghost';
      button.style.display = 'block';
      button.style.width = '100%';
      button.style.marginBottom = '8px';
      button.textContent = label;
      if (answers[index] === letter) button.setAttribute('aria-pressed', 'true');
      button.addEventListener('click', () => {
        const person = active();
        person.quiz.answers[index] = letter;
        if (index < QUIZ.length - 1) person.quiz.index = index + 1;
        else {
          person.quiz.index = QUIZ.length;
          const type = scoreQuiz(person.quiz.answers);
          if (type) person.mbti = type;
        }
        save();
        renderQuiz();
        fillBasics();
        if (person.progress.step === 8) renderCard();
      });
      $('quizOpts').appendChild(button);
    });
  }

  function renderCard() {
    const p = active();
    const theme = THEMES.find((item) => item.id === p.theme) || THEMES[0];
    const host = $('card');
    host.replaceChildren();
    host.className = 'card';
    host.style.borderTopColor = theme.color;
    const top = document.createElement('div');
    top.className = 'card-top';
    const left = document.createElement('div');
    const kicker = document.createElement('p');
    kicker.className = 'kicker';
    kicker.style.color = theme.color;
    const industryLabel = p.industry === 'insurance' ? '保險業務' : p.industry === 'general' ? '其他行業' : '尚未選產業';
    kicker.textContent = industryLabel;
    const name = document.createElement('h3');
    name.id = 'cardName';
    name.textContent = p.name.trim() || '尚未填暱稱';
    const role = document.createElement('p');
    role.id = 'cardTitle';
    role.textContent = p.title.trim();
    if (!p.title.trim()) role.hidden = true;
    const line = document.createElement('p');
    line.textContent = p.positioning.trim() || '尚未填定位';
    left.append(kicker, name, role, line);
    const stamp = document.createElement('div');
    stamp.className = 'stamp';
    stamp.style.borderColor = theme.color;
    stamp.style.color = theme.color;
    stamp.textContent = p.mbti || '----';
    top.append(left, stamp);
    host.appendChild(top);
    const tags = document.createElement('div');
    tags.className = 'tags';
    const bits = [];
    if (p.industry === 'general' && p.trade.trim()) bits.push(p.trade.trim());
    p.niches.forEach((id) => { const topic = topicById(p, id); if (topic) bits.push(topic.label); });
    p.scenes.forEach((scene) => bits.push(scene));
    p.traits.forEach((item) => bits.push(item));
    if (!bits.length) bits.push('還沒有選主題');
    bits.forEach((bit) => {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = bit;
      tags.appendChild(tag);
    });
    host.appendChild(tags);
    const lines = [];
    lines.push('產業：' + industryLabel);
    if (p.trade.trim() && p.industry === 'general') lines.push('我的產業：' + p.trade.trim());
    lines.push('暱稱：' + (p.name.trim() || '（空）'));
    if (p.title.trim()) lines.push('職稱：' + p.title.trim());
    lines.push('定位：' + (p.positioning.trim() || '（空）'));
    if (p.audience.trim()) lines.push('想對話的人：' + p.audience.trim());
    if (p.mbti) lines.push('MBTI：' + p.mbti + '。' + (VOICE[p.mbti] || ''));
    if (p.traits.length) lines.push('說話方式：' + p.traits.join('、'));
    if (p.values.length) lines.push('在意：' + p.values.join('、'));
    if (bits.length) lines.push('主題與畫面：' + bits.join('、'));
    if (p.pros.length) lines.push('強項：' + p.pros.join('、'));
    if (p.cons.length) lines.push('還在練：' + p.cons.join('、'));
    if (p.videoTypes.length) lines.push('形式：' + p.videoTypes.join('、'));
    $('cardText').textContent = lines.join('\n');
  }

  function renderIdeaCategory() {
    const select = $('ideaCategory');
    const current = select.value;
    select.replaceChildren();
    const any = document.createElement('option');
    any.value = '';
    any.textContent = '不限主題';
    select.appendChild(any);
    topicsFor(active()).forEach((topic) => {
      const option = document.createElement('option');
      option.value = topic.id;
      option.textContent = topic.label;
      select.appendChild(option);
    });
    if ([...select.options].some((option) => option.value === current)) select.value = current;
  }

  function renderIdeas() {
    const host = $('ideasList');
    host.replaceChildren();
    const ideas = active().ideas.slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    if (!ideas.length) {
      const p = document.createElement('p');
      p.className = 'lede';
      p.textContent = '還沒有靈感。一句話就夠，不必先寫成稿。';
      host.appendChild(p);
      return;
    }
    ideas.forEach((idea) => {
      const art = document.createElement('article');
      art.className = 'idea';
      const body = document.createElement('div');
      const meta = document.createElement('p');
      meta.className = 'meta';
      const topic = topicById(active(), idea.category);
      meta.textContent = (idea.sourceType || '其他') + (topic ? ' · ' + topic.label : ' · 不限主題');
      const text = document.createElement('p');
      text.textContent = idea.content || '';
      body.append(meta, text);
      const href = safeHref(idea.link || '');
      if (href) {
        const a = document.createElement('a');
        a.href = href;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = href;
        body.appendChild(a);
      } else if ((idea.link || '').trim()) {
        const note = document.createElement('p');
        note.className = 'meta';
        note.textContent = '已略過不安全的連結';
        body.appendChild(note);
      }
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'btn danger';
      del.textContent = '刪除';
      del.addEventListener('click', async () => {
        const ok = await confirmBox('刪除這則靈感？', '刪除後會從這台裝置移除。');
        if (!ok) return;
        const person = active();
        person.ideas = person.ideas.filter((item) => item.id !== idea.id);
        save();
        renderIdeas();
        toast('已刪除');
      });
      art.append(body, del);
      host.appendChild(art);
    });
  }

  function renderPromptNiche() {
    const select = $('promptNiche');
    const note = $('promptNicheNote');
    const current = select.value;
    select.replaceChildren();
    const topics = topicsFor(active()).filter((topic) => active().niches.includes(topic.id));
    if (!active().industry) {
      note.textContent = '請先在人設第 1 步選擇產業。';
    } else if (!topics.length) {
      note.textContent = '請先在人設第 4 步勾選主題。';
    } else {
      note.textContent = active().industry === 'insurance'
        ? '提示詞會帶上保險溝通的合規界線。'
        : '提示詞只使用一般創作者的界線。';
    }
    topics.forEach((topic) => {
      const option = document.createElement('option');
      option.value = topic.id;
      option.textContent = topic.label;
      select.appendChild(option);
    });
    if ([...select.options].some((option) => option.value === current)) select.value = current;
  }

  function personaLines(p) {
    const lines = [];
    const put = (label, value) => {
      const text = clean(value).trim();
      if (text) lines.push(label + '：' + text);
    };
    put('暱稱', p.name);
    put('職稱', p.title);
    put('一句話', p.positioning);
    put('想對話的人', p.audience);
    if (p.industry === 'general') put('我的產業', p.trade);
    if (p.mbti && VOICE[p.mbti]) lines.push('說話傾向：' + p.mbti + '。' + VOICE[p.mbti]);
    if (p.traits.length) lines.push('語氣：' + p.traits.map(clean).join('、'));
    if (p.values.length) lines.push('在意：' + p.values.map(clean).join('、'));
    if (p.pros.length) lines.push('強項：' + p.pros.map(clean).join('、'));
    if (p.cons.length) lines.push('還在練：' + p.cons.map(clean).join('、'));
    if (p.videoTypes.length) lines.push('偏好形式：' + p.videoTypes.join('、'));
    if (p.scenes.length) lines.push('生活畫面：' + p.scenes.map(clean).join('、') + '。畫面只負責讓人停下來。');
    if (!lines.length) lines.push('人設還沒填完。請不要捏造經歷，只先給可執行的結構。');
    return lines.join('\n');
  }

  function ideaBlock(p, nicheId) {
    const rows = (p.ideas || []).filter((idea) => idea && typeof idea.content === 'string' && idea.content.trim());
    const picked = rows.filter((idea) => !idea.category || idea.category === nicheId);
    if (!picked.length) return '';
    return picked.map((idea) => {
      const content = clean(idea.content).trim();
      const source = typeof idea.sourceType === 'string' ? idea.sourceType.trim() : '';
      return source ? '・' + source + '：' + content : '・' + content;
    }).join('\n');
  }

  function clampCount(raw) {
    const text = String(raw ?? '').trim();
    if (!text) return 5;
    const n = Number.parseInt(text, 10);
    if (!Number.isFinite(n)) return 5;
    return Math.min(10, Math.max(1, n));
  }

  function buildPrompt(kind) {
    const p = active();
    if (!p.industry) {
      return { error: '請先在人設第 1 步選擇產業。' };
    }
    const nicheId = $('promptNiche').value;
    const topic = topicById(p, nicheId);
    if (!topic && kind !== 'more') {
      return { error: '請先在人設裡勾選至少一個主題。' };
    }
    const guard = p.industry === 'insurance' ? INSURANCE_GUARD : GENERAL_GUARD;
    const domain = p.industry === 'insurance' ? '【領域】保險業務' : '【領域】其他行業';
    const blocks = [domain, '【合規界線】\n' + guard];
    if (kind === 'more') {
      const n = clampCount($('promptCountC').value);
      $('promptCountC').value = String(n);
      blocks.push('請沿用這個對話裡已經設定的人設與界線，再寫 ' + n + ' 個不同角度。不要重覆同一種開頭。每個角度都要能直接拍，並遵守上面的合規界線。');
      return { text: blocks.join('\n\n') };
    }
    if (kind === 'polish') {
      const extra = p.industry === 'insurance' ? INSURANCE_POLISH : [];
      const checks = POLISH.concat(extra).map((item, i) => (i + 1) + '. ' + item).join('\n');
      blocks.push('【請你檢查我貼在後面的稿】\n' + checks + '\n\n我的稿如下：');
      return { text: blocks.join('\n\n') };
    }
    blocks.push('【這個人】\n' + personaLines(p));
    if (topic) blocks.push('【這次的主題】' + topic.label + '\n' + topic.formula);
    const ideas = ideaBlock(p, nicheId);
    if (ideas) blocks.push('【可以參考的真實句子】\n' + ideas);
    if (kind === 'given') {
      const subject = clean($('promptTopicText').value).trim();
      if (!subject) return { error: '請先寫這次想講的主題。' };
      blocks.push('【指定題目】\n' + subject + '\n\n請依這個人的語氣與上面的界線，寫 1 支可直接念的短影音口白。開頭進入處境，中段只留一件事，結尾用邀請而不是逼單。');
    } else {
      const n = clampCount($('promptCountA').value);
      $('promptCountA').value = String(n);
      blocks.push('請寫 ' + n + ' 個不同角度。每個角度包含：標題、30 到 60 秒口白、為什麼這個開頭站得住。不要每支都用同一種起手式。人設沒寫到的經歷不要捏造。');
    }
    return { text: blocks.join('\n\n') };
  }

  function clearPrompt() {
    $('promptOutput').textContent = '選好上面的方式後，提示詞會出現在這裡。';
    $('promptError').textContent = '';
  }

  async function copyText(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (err) { /* fallback below */ }
    try {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.top = '0';
      area.style.left = '0';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.focus();
      area.select();
      area.setSelectionRange(0, text.length);
      const ok = document.execCommand('copy');
      area.remove();
      return ok;
    } catch (err) {
      return false;
    }
  }

  async function produce(kind) {
    const result = buildPrompt(kind);
    if (result.error) {
      $('promptError').textContent = result.error;
      toast(result.error);
      return;
    }
    $('promptError').textContent = '';
    $('promptOutput').textContent = result.text;
    const ok = await copyText(result.text);
    toast(ok ? '已複製。也可以直接貼給你的 AI 助理' : '沒有自動複製，請直接選取上方文字');
    $('promptOutput').scrollIntoView({ block: 'start' });
  }

  function renderAdvice() {
    const p = active();
    const host = $('adviceBody');
    host.replaceChildren();
    const intro = document.createElement('div');
    intro.className = 'panel';
    const h = document.createElement('h3');
    h.textContent = '名稱與定位';
    intro.appendChild(h);
    const text = (p.name || '') + (p.positioning || '');
    const flags = p.industry === 'insurance'
      ? ['保證理賠', '穩賺', '一定過', '免稅', '避稅', '最強']
      : ['保證有效', '永久', '零風險', '百分之百', '全台第一'];
    flags.forEach((word) => {
      if (text.includes(word)) {
        const item = document.createElement('p');
        item.textContent = '「' + word + '」容易被聽成承諾。改成你實際做過的範圍，或直接刪掉。';
        intro.appendChild(item);
      }
    });
    if (!p.name.trim()) {
      const item = document.createElement('p');
      item.textContent = '還沒有暱稱。用一個別人叫得出口的名字，比只寫職業清楚。';
      intro.appendChild(item);
    }
    if (!p.positioning.trim()) {
      const item = document.createElement('p');
      item.textContent = '還沒有一句話定位。寫你幫誰把什麼事看懂。';
      intro.appendChild(item);
    }
    if (p.niches.length >= 5) {
      const item = document.createElement('p');
      item.textContent = '主題選了 ' + p.niches.length + ' 個。先留下最常拍的兩個，其餘以後再加。';
      intro.appendChild(item);
    }
    if (intro.childElementCount === 1) {
      const item = document.createElement('p');
      item.textContent = '名稱和定位目前沒有看到常見的誇大用語。';
      intro.appendChild(item);
    }
    host.appendChild(intro);
    const topics = topicsFor(p).filter((topic) => p.niches.includes(topic.id));
    if (!p.industry) {
      const empty = document.createElement('p');
      empty.className = 'lede';
      empty.textContent = '先選擇產業，建議才知道要講哪一套界線。';
      host.appendChild(empty);
      return;
    }
    if (!topics.length) {
      const empty = document.createElement('p');
      empty.className = 'lede';
      empty.textContent = '勾了主題之後，這裡會出現該主題的拍法提醒。';
      host.appendChild(empty);
      return;
    }
    topics.forEach((topic) => {
      const panel = document.createElement('div');
      panel.className = 'panel';
      const title = document.createElement('h3');
      title.textContent = topic.label;
      const body = document.createElement('p');
      body.textContent = topic.advice;
      const cta = document.createElement('p');
      cta.textContent = '收尾可以這樣問：' + topic.cta;
      panel.append(title, body, cta);
      host.appendChild(panel);
    });
  }

  function applyShow() {
    const p = active();
    if (p.industry !== 'insurance') return;
    const dirty = p.name || p.title || p.positioning || p.niches.length || p.traits.length || p.scenes.length;
    const run = () => {
      const person = active();
      person.industry = 'insurance';
      person.trade = '';
      person.name = '秀老闆';
      person.title = '藝世錄團隊長';
      person.positioning = '昶勝軍的藝世錄團隊長。把家庭保障講成聽得懂的人話，不畫大餅。';
      person.audience = '三十到四十五歲、同時顧父母和小孩的家庭';
      person.traits = ['直球', '先講結論', '帶著笑'];
      person.values = ['把話說清楚', '家人一起決定', '長期信任'];
      person.niches = ['family', 'claim', 'daily', 'life'];
      person.pros = ['能把複雜的事收成一句', '願意先做給別人看'];
      person.cons = ['步調偏快', '不太喜歡繞圈'];
      person.scenes = ['黑 Volvo V60', '露營', '六隻鸚鵡'];
      person.videoTypes = ['口播', '生活片段'];
      person.theme = 'well';
      person.mbti = 'ENTJ';
      person.quiz = { answers: ['E', 'E', 'E', 'N', 'N', 'N', 'T', 'T', 'T', 'J', 'J', 'J'], index: 12 };
      person.progress = { step: 8, furthest: 8 };
      save();
      clearPrompt();
      render();
      toast('已套用 Show 的保險範例');
    };
    if (!dirty) run();
    else confirmBox('覆蓋這份人設？', '會改成 Show 的保險範例，目前已填的內容會被換掉。').then((ok) => { if (ok) run(); });
  }

  function renderRecoveryNote() {
    $('recoveryNote').hidden = !localStorage.getItem(RECOVERY);
  }

  function showCorrupt(show) {
    $('corrupt').hidden = !show;
  }

  function bind() {
    document.querySelectorAll('#navDesktop button, #navMobile button').forEach((button) => {
      button.addEventListener('click', () => go(button.dataset.view));
    });
    $('indInsurance').addEventListener('click', () => setIndustry('insurance'));
    $('indGeneral').addEventListener('click', () => setIndustry('general'));
    $('btnShowExample').addEventListener('click', applyShow);
    $('pName').addEventListener('input', () => { active().name = $('pName').value; save(); renderSwitcher(); if (active().progress.step === 8) renderCard(); });
    $('pTitle').addEventListener('input', () => { active().title = $('pTitle').value; save(); if (active().progress.step === 8) renderCard(); });
    $('pPositioning').addEventListener('input', () => { active().positioning = $('pPositioning').value; save(); if (active().progress.step === 8) renderCard(); });
    $('pAudience').addEventListener('input', () => { active().audience = $('pAudience').value; save(); if (active().progress.step === 8) renderCard(); });
    $('pTrade').addEventListener('input', () => { active().trade = $('pTrade').value; save(); if (active().progress.step === 8) renderCard(); });
    $('pMbti').addEventListener('change', () => { active().mbti = $('pMbti').value; save(); renderCard(); });
    $('wizardNext').addEventListener('click', () => goStep((active().progress.step || 1) + 1, true));
    $('wizardPrev').addEventListener('click', () => goStep((active().progress.step || 1) - 1, false));
    $('quizPrev').addEventListener('click', () => {
      const p = active();
      p.quiz.index = Math.max(0, (p.quiz.index || 0) - 1);
      save();
      renderQuiz();
    });
    $('quizRetake').addEventListener('click', () => {
      active().quiz = blankQuiz();
      save();
      renderQuiz();
    });
    $('btnAddScene').addEventListener('click', addScene);
    $('sceneInput').addEventListener('keydown', (event) => {
      if (event.key === 'Enter') { event.preventDefault(); addScene(); }
    });
    $('btnAddIdea').addEventListener('click', () => {
      const content = $('ideaContent').value.trim();
      if (!content) { toast('請先寫一句話'); return; }
      active().ideas.push({
        id: uid(),
        content,
        sourceType: $('ideaSource').value,
        link: $('ideaLink').value.trim(),
        category: $('ideaCategory').value,
        createdAt: Date.now()
      });
      save();
      $('ideaContent').value = '';
      $('ideaLink').value = '';
      renderIdeas();
      toast('已加入靈感簿');
    });
    $('btnPromptA').addEventListener('click', () => produce('topics'));
    $('btnPromptB').addEventListener('click', () => produce('given'));
    $('btnPromptC').addEventListener('click', () => produce('more'));
    $('btnPromptD').addEventListener('click', () => produce('polish'));
    $('btnCopyPrompt').addEventListener('click', async () => {
      const text = $('promptOutput').textContent.trim();
      if (!text || text.startsWith('選好上面')) { toast('請先產生提示詞'); return; }
      const ok = await copyText(text);
      toast(ok ? '已複製。也可以直接貼給你的 AI 助理' : '請直接選取上方文字');
    });
    $('btnToPrompts').addEventListener('click', () => go('prompts'));
    $('btnExport').addEventListener('click', () => {
      const day = new Date().toISOString().slice(0, 10);
      download('爆款提詞器備份_' + day + '.json', JSON.stringify(serialize(), null, 2));
      toast('已下載備份');
    });
    $('btnImport').addEventListener('click', () => {
      const file = $('importFile').files && $('importFile').files[0];
      $('importMessage').textContent = '';
      if (!file) { $('importMessage').textContent = '請先選擇備份檔。'; return; }
      const reader = new FileReader();
      reader.onload = async () => {
        let parsed;
        try { parsed = JSON.parse(String(reader.result || '')); }
        catch (err) { $('importMessage').textContent = '這不是合法的 JSON。'; return; }
        let normalized;
        try { normalized = normalizeState(parsed); }
        catch (err) { $('importMessage').textContent = err.message || '格式不正確'; return; }
        const ok = await confirmBox('用這份備份覆蓋？', '這台裝置上現在的人設與靈感會被換掉。');
        if (!ok) return;
        state = normalized.state;
        corruptLock = false;
        save();
        clearPrompt();
        render();
        go('persona');
        toast(normalized.single ? '已依單一人設格式匯入' : '已匯入');
      };
      reader.readAsText(file);
    });
    $('btnResetAll').addEventListener('click', async () => {
      const ok = await confirmBox('清空所有資料？', '這台裝置上的人設與靈感會刪除。');
      if (!ok) return;
      const fresh = blankPersona();
      state = { personas: [fresh], activePersonaId: fresh.id };
      corruptLock = false;
      save();
      clearPrompt();
      render();
      go('persona');
      toast('已清空');
    });
    $('btnCorruptDownload').addEventListener('click', () => {
      download('爆款提詞器損壞原文.json', localStorage.getItem(RECOVERY) || '', 'application/json');
    });
    $('btnCorruptReset').addEventListener('click', () => {
      const fresh = blankPersona();
      state = { personas: [fresh], activePersonaId: fresh.id };
      corruptLock = false;
      save();
      showCorrupt(false);
      render();
      toast('已從空白開始。損壞原文仍可在備份頁下載。');
    });
    $('btnRecoveryDownload').addEventListener('click', () => {
      const raw = localStorage.getItem(RECOVERY);
      if (raw) download('爆款提詞器損壞原文.json', raw, 'application/json');
    });
    $('btnRecoveryClear').addEventListener('click', () => {
      localStorage.removeItem(RECOVERY);
      renderRecoveryNote();
      toast('已清除復原區');
    });
  }

  function addScene() {
    const value = $('sceneInput').value.trim();
    if (!value) return;
    const p = active();
    if (!p.scenes.includes(value)) p.scenes.push(value);
    $('sceneInput').value = '';
    save();
    renderScenes();
    renderCard();
  }

  function render() {
    fillBasics();
    renderSwitcher();
    renderIndustry();
    chipButtons($('traitChips'), TRAITS, 'traits');
    chipButtons($('valueChips'), VALUES, 'values');
    chipButtons($('proChips'), PROS, 'pros');
    chipButtons($('conChips'), CONS, 'cons');
    chipButtons($('videoChips'), VIDEOS, 'videoTypes');
    renderConNotes();
    renderThemes();
    renderNiches();
    renderQuiz();
    renderCard();
    renderIdeaCategory();
    renderIdeas();
    renderPromptNiche();
    renderAdvice();
    paintStep();
    renderRecoveryNote();
  }

  function initJumps() {
    const host = $('stepJumps');
    for (let i = 1; i <= STEPS; i += 1) {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.step = String(i);
      button.textContent = String(i);
      button.setAttribute('aria-label', '第 ' + i + ' 步');
      button.addEventListener('click', () => goStep(i, false));
      host.appendChild(button);
    }
  }

  function initMbti() {
    Object.keys(VOICE).forEach((key) => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = key;
      $('pMbti').appendChild(option);
    });
  }

  load();
  initJumps();
  initMbti();
  bind();
  render();
  go('persona');
  if (corruptLock) showCorrupt(true);
})();

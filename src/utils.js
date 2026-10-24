const SKILL_FAMILIES = [
  { key: 'photography', terms: ['摄影', '拍照', '人像', '光影', '调色', '后期', '布光', 'lightroom', 'photoshop', '相机'] },
  { key: 'music', terms: ['吉他', '弹唱', '乐理', '音乐', '编曲', '混音', 'logic', '和弦'] },
  { key: 'english', terms: ['英语', '口语', '发音', '同传', '雅思', '表达'] },
  { key: 'japanese', terms: ['日语', '五十音'] },
  { key: 'code', terms: ['python', '编程', '代码', '网站', '开发'] },
  { key: 'design', terms: ['figma', '设计', '插画', 'procreate', '原型', '运营', '剪辑', '视频'] },
  { key: 'food', terms: ['甜点', '咖啡', '手冲', '拉花', '做饭', '家常菜', '烘焙'] },
  { key: 'body', terms: ['普拉提', '力量', '瑜伽', '健身', '训练'] },
]

const GENERIC_LEARN = [
  '找到最值得先学的一个小目标，完成第一次上手',
  '掌握最常用的基础动作，做一次 15 分钟小练习',
  '跟着一个真实场景完成作品，发现自己的卡点',
  '独立完成一次小成果，并互相做一次复盘',
]

const GENERIC_TEACH = [
  '了解对方的起点与目标，一起定下 4 次交换的边界',
  '拆解一个最常用的基础方法，现场演示一次',
  '带着对方完成一个真实小任务，只给必要的提示',
  '一起回看成果，留下可以继续练习的清单',
]

const SKILL_TRACKS = {
  摄影后期: {
    themes: ['先看懂，再动手', '肤色与干净的画面', '氛围感的来源', '完成一组作品'],
    learner: [
      '用 10 张照片练习拆解光线、色彩与层次',
      '建立自己的 3 个调色预设，统一一组照片的肤色',
      '从参考图反推调色方向，完成一组有氛围感的照片',
      '独立修完 6 张作品，讲清每一步为什么这样做',
    ],
    teacher: [
      '确认对方想拍什么，挑出 3 张真正喜欢的参考图',
      '演示一套可复用的工作流，不堆叠参数',
      '现场一起调一张照片，让判断发生在操作之前',
      '引导对方独立完成作品，只做提问与最后复盘',
    ],
  },
  摄影: {
    themes: ['看见光线', '把构图变成选择', '完成第一次实拍', '从选片到成片'],
    learner: [
      '用手机或相机记录一天里三种不同的光',
      '练习用前景、留白和视线组织一张照片',
      '完成一次 30 分钟的主题拍摄',
      '选出 3 张照片，讲清每张为什么留下',
    ],
    teacher: [
      '看一组对方的日常照片，找到已经存在的直觉',
      '带对方做一次简单的光位观察',
      '在真实场景里只提醒一件事，不接管拍摄',
      '一起选片，把「好看」拆成具体判断',
    ],
  },
  英语口语: {
    themes: ['找到开口的安全感', '高频场景表达', '把句子连起来', '10 分钟自由表达'],
    learner: [
      '用 3 个问题做一次不被打断的自我介绍',
      '练熟一个真实工作或旅行场景的 8 句话',
      '学习用连接词把零散句子说得更自然',
      '完成一次 10 分钟主题表达并回听录音',
    ],
    teacher: [
      '先聊对方最想用英语完成的真实事情',
      '创造低压力对话，只记录反复出现的问题',
      '做一次发音或节奏的示范，不追求全部纠正',
      '给出一份可以继续练的 10 分钟清单',
    ],
  },
  吉他弹唱: {
    themes: ['第一首歌的骨架', '换和弦不卡顿', '让右手有节奏', '完整弹唱一首歌'],
    learner: [
      '认识 4 个基础和弦，选一首真正想唱的歌',
      '用慢速节拍器练习换和弦，找到最小动作',
      '掌握一个适合这首歌的右手节奏型',
      '从头到尾完整弹唱，并录下第一版',
    ],
    teacher: [
      '看对方唱歌的舒适音区，选一首合适的歌',
      '拆解换和弦的动作，只练最卡的那一下',
      '带着对方把节奏唱出来，再回到手上',
      '一起听录音，找到下一次最值得练的地方',
    ],
  },
  音乐制作: {
    themes: ['搭一个能工作的工程', '和声与节奏', '录音与混音', '完成 60 秒作品'],
    learner: [
      '建立一个干净的 Logic 工程与素材文件夹',
      '用 4 个和弦和一条鼓组搭出 8 小节',
      '录一条人声，学会基础降噪与压缩',
      '完成 60 秒作品，并导出分享给对方',
    ],
    teacher: [
      '了解对方想做的音乐类型与已有工具',
      '示范一次从素材到循环的快速搭建',
      '一起处理一条真实录音，讲清顺序和原因',
      '留出创作空间，只做收尾与导出检查',
    ],
  },
  插画入门: {
    themes: ['允许自己画得不好看', '形状与颜色', '画一张完整的画', '找到自己的视觉语言'],
    learner: [
      '用 5 分钟涂鸦卸下「画得像」的压力',
      '练习用三个形状概括一个日常物件',
      '完成一张有主体、有背景的完整小画',
      '从自己的三张画里找到反复出现的偏好',
    ],
    teacher: [
      '聊一聊对方最近想记录的画面',
      '示范如何从形状开始，而不是从线条开始',
      '陪对方完成一张小画，只给三个提示',
      '一起看画，指出已经形成的个人特质',
    ],
  },
  Python入门: {
    themes: ['第一行代码', '让代码处理真实数据', '做出一个能用的工具', '复盘与继续学习'],
    learner: [
      '跑通第一个脚本，学会读取错误信息',
      '用列表和循环整理一份真实表格',
      '完成一个小工具，例如自动整理文件',
      '为自己的工具写一页使用说明',
    ],
    teacher: [
      '了解对方想用代码解决的真实问题',
      '演示如何把问题拆成三步',
      '一起写一个小工具，只解释出现过的概念',
      '让对方独立改一个功能，留下继续练习的题目',
    ],
  },
  Figma原型: {
    themes: ['从一个真实页面开始', '建立组件与层级', '让原型动起来', '完整走查与交付'],
    learner: [
      '临摹一个熟悉的产品页面结构',
      '用 Auto Layout 整理 3 个核心组件',
      '做一个可点击的 3 屏原型',
      '邀请对方走查，记录 3 条可改进项',
    ],
    teacher: [
      '了解对方想做的产品与现有基础',
      '演示组件思路，不急着讲所有功能',
      '一起完成一个关键交互',
      '从用户视角做一次走查，只选一个重点改进',
    ],
  },
  咖啡手冲: {
    themes: ['理解一杯咖啡', '水粉比与研磨', '稳定地冲一杯', '找到自己的风味偏好'],
    learner: [
      '用同一种豆子喝出两种不同的冲煮结果',
      '学会称豆、控温与一段式注水',
      '独立冲三杯，记录每次变量',
      '盲喝两杯，说出自己更喜欢哪一杯以及为什么',
    ],
    teacher: [
      '了解对方平时喝什么，以及手边有什么器具',
      '演示一段稳定注水，讲清变量',
      '让对方独立操作，只提醒节奏',
      '一起对比风味，留下下一包豆子的练习方向',
    ],
  },
}

function normalize(text = '') {
  return String(text).trim().toLowerCase().replace(/[\s/·,，、]/g, '')
}

function familyFor(skillName = '') {
  const raw = String(skillName).toLowerCase()
  const found = SKILL_FAMILIES.find((family) => family.terms.some((term) => raw.includes(term)))
  return found?.key || normalize(skillName).slice(0, 3)
}

export function areSkillsRelated(a, b) {
  if (!a || !b) return false
  const left = normalize(a)
  const right = normalize(b)
  if (!left || !right) return false
  if (left === right || left.includes(right) || right.includes(left)) return true
  return familyFor(a) === familyFor(b)
}

export function findSkillMatch(skills = [], target = '') {
  if (!target) return null
  let best = null
  for (const skill of skills) {
    const left = normalize(skill.name)
    const right = normalize(target)
    let relation = null
    if (left === right) relation = 'exact'
    else if (left.includes(right) || right.includes(left)) relation = 'close'
    else if (familyFor(skill.name) === familyFor(target)) relation = 'related'
    else if (skill.category && target && familyFor(skill.category) === familyFor(target)) relation = 'adjacent'

    if (!relation) continue
    const rank = { exact: 4, close: 3, related: 2, adjacent: 1 }[relation]
    if (!best || rank > best.rank) best = { skill, relation, rank }
  }
  return best
}

export function getDefaultIntent(user) {
  return {
    learn: user?.learn?.[0]?.name || '',
    teach: user?.teach?.[0]?.name || '',
  }
}

export function scorePerson(person, intent) {
  const learnTarget = intent?.learn?.trim() || ''
  const teachTarget = intent?.teach?.trim() || ''
  const theyTeach = learnTarget ? findSkillMatch(person.teach, learnTarget) : null
  const theyWant = teachTarget ? findSkillMatch(person.learn, teachTarget) : null

  const bothExact = theyTeach?.relation === 'exact' && theyWant?.relation === 'exact'
  const bothMatched = Boolean(theyTeach && theyWant)
  const oneExact = theyTeach?.relation === 'exact' || theyWant?.relation === 'exact'
  const oneMatched = Boolean(theyTeach || theyWant)
  const adjacent = Boolean(
    (person.teach || []).some((skill) => skill.category && learnTarget && familyFor(skill.category) === familyFor(learnTarget)) ||
      (person.learn || []).some((skill) => skill.category && teachTarget && familyFor(skill.category) === familyFor(teachTarget)),
  )

  let score = 52
  if (bothExact) score = 92
  else if (bothMatched) score = 84
  else if (oneExact) score = 76
  else if (oneMatched) score = 68
  else if (adjacent) score = 60

  if (person.city === '上海') score += 2
  if (Number(person.rating) >= 4.9) score += 1
  if (person.verified) score += 1

  score = Math.min(99, score)

  const reasons = []
  if (theyTeach) {
    if (theyTeach.relation === 'exact' || theyTeach.relation === 'close') {
      reasons.push(`TA 能带你入门「${theyTeach.skill.name}」，正好对上你想学的「${learnTarget}」。`)
    } else {
      reasons.push(`你想学的「${learnTarget}」与 TA 教的「${theyTeach.skill.name}」方向相近，可以碰撞出新路线。`)
    }
  }
  if (theyWant) {
    if (theyWant.relation === 'exact' || theyWant.relation === 'close') {
      reasons.push(`TA 正在找「${theyWant.skill.name}」搭子，你刚好能补上这个位置。`)
    } else {
      reasons.push(`TA 想学「${theyWant.skill.name}」，和你的「${teachTarget}」有相通的底层能力。`)
    }
  }
  if (person.city === '上海') reasons.push('同在上海，想线下见面也很方便。')
  if (Number(person.rating) >= 4.8) reasons.push(`${person.rating} 分 · ${person.reviewCount} 条真实交换评价。`)
  if (!reasons.length) reasons.push('虽然技能不是直接互补，但你们的学习方向都很有意思，可以先认识一下。')

  let label = '同好推荐'
  if (bothExact) label = '双向互补'
  else if (bothMatched) label = '方向相近'
  else if (oneExact) label = '技能刚好'
  else if (oneMatched) label = '可以聊聊'

  return {
    score,
    label,
    reasons: reasons.slice(0, 3),
    theyTeach,
    theyWant,
    bothExact,
    bothMatched,
  }
}

export function rankPeople(people, intent) {
  return people
    .map((person) => ({ person, match: scorePerson(person, intent) }))
    .sort((a, b) => {
      if (b.match.score !== a.match.score) return b.match.score - a.match.score
      return Number(b.person.rating) - Number(a.person.rating)
    })
}

export function getSkillThemes(skillName = '', completedWeeks = 0) {
  const track = SKILL_TRACKS[skillName] || SKILL_TRACKS[Object.keys(SKILL_TRACKS).find((key) => areSkillsRelated(key, skillName))]
  return track || null
}

export function buildPlan(theirSkill, mySkill, completedWeeks = 0) {
  const theirTrack = getSkillThemes(theirSkill)
  const myTrack = getSkillThemes(mySkill)
  const themes = ['对齐目标与边界', '完成第一次上手', '一起做出小成果', '复盘并留下下一步']

  return Array.from({ length: 4 }, (_, index) => {
    const week = index + 1
    return {
      week,
      title: theirTrack?.themes?.[index] || themes[index],
      completed: week <= completedWeeks,
      theirTopic: theirTrack?.learner?.[index] || GENERIC_LEARN[index],
      myTopic: myTrack?.teacher?.[index] || GENERIC_TEACH[index],
      practice:
        index === 0
          ? '各留 1 个小作业：下一次见面先用 10 分钟复盘。'
          : index === 3
            ? '把这一周的作品或练习保存下来，作为这次交换的成果纪念。'
            : '每次结束前，互相说一个「下次想试的」和「暂时卡住的」。',
    }
  })
}

export function buildReply(person, text = '') {
  const content = text.trim()
  if (/周末|周六|周日|时间|有空/.test(content)) {
    return person.id === 'u1'
      ? '周六下午我都可以，15:00 开始怎么样？光线正好。'
      : '可以呀，我这边周末比较灵活，你先定一个你舒服的时间。'
  }
  if (/计划|作业|清单|准备/.test(content)) {
    return '收到，我也整理了一份入门清单。第一次不急着学很多，我们先找到你的起点。'
  }
  if (/谢谢|感谢/.test(content)) {
    return '客气啦，互相帮忙而已。期待我们第一次交换。'
  }
  if (/你好|嗨|hello/i.test(content)) {
    return '嗨！很高兴认识你。要不要先说说你最想解决的一个小目标？'
  }
  if (/可以|好的|好呀|没问题/.test(content)) {
    return '好，那就这么说定。我先把第一次的时间记下来，期待见面。'
  }
  return '好呀，我看到啦。我们先从一个小目标开始，第一次交换不用准备太多。'
}

export function uid(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export function unreadTotal(conversations = []) {
  return conversations.reduce((sum, conversation) => sum + (Number(conversation.unread) || 0), 0)
}

export function countSwaps(swaps = [], status) {
  return swaps.filter((swap) => swap.status === status).length
}

export function getInitial(name = '') {
  return String(name).trim().slice(0, 1) || '换'
}

export function skillNames(skills = []) {
  return skills.map((skill) => skill.name)
}

export function isSameSkill(a, b) {
  return normalize(a) === normalize(b)
}

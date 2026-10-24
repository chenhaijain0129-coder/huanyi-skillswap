import { useEffect, useId, useMemo, useState } from 'react'
import {
  ArrowLeftRight,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Globe2,
  MapPin,
  MessageCircle,
  Plus,
  Sparkles,
  Star,
  Wifi,
} from 'lucide-react'
import { SKILL_LIBRARY } from '../data.js'
import { findSkillMatch, scorePerson, uid } from '../utils.js'
import { Avatar, Modal, SectionLabel, StatusBadge, Stars } from './ui.jsx'

const LEVELS = {
  teach: ['入门', '进阶', '专业'],
  learn: ['零基础', '入门', '中级', '进阶'],
}

const FORMATS = ['线上', '线下', '线上 / 线下']

function PersonModal({ open, person, user, intent, swaps, onClose, onRequestSwap, onOpenSwap }) {
  const [theirSkill, setTheirSkill] = useState('')
  const [mySkill, setMySkill] = useState('')
  const [mode, setMode] = useState('线上')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const formId = useId()

  const match = useMemo(() => (person ? scorePerson(person, intent) : null), [person, intent])
  const existingSwap = swaps.find(
    (swap) => swap.personId === person?.id && ['pending', 'active'].includes(swap.status),
  )

  useEffect(() => {
    if (!open || !person) return
    const theirMatch = findSkillMatch(person.teach, intent.learn)
    const myMatch =
      person.learn
        .map((skill) => findSkillMatch(user.teach, skill.name))
        .filter(Boolean)
        .sort((a, b) => b.rank - a.rank)[0] || findSkillMatch(user.teach, intent.teach)
    const defaultTheirSkill = theirMatch?.skill?.name || person.teach[0]?.name || ''
    const defaultMySkill = myMatch?.skill?.name || user.teach[0]?.name || ''
    const commonMode = user.modes.find((item) => person.modes?.includes(item)) || '线上'
    setTheirSkill(defaultTheirSkill)
    setMySkill(defaultMySkill)
    setMode(commonMode)
    setMessage('')
    setError('')
  }, [open, person, intent.learn, intent.teach, user.modes, user.teach])

  if (!person) return null

  const commonModes = user.modes.filter((item) => person.modes?.includes(item))
  const modes = commonModes.length ? commonModes : ['线上']
  const submit = (event) => {
    event.preventDefault()
    if (!theirSkill || !mySkill) {
      setError('先选好你想学的技能和你能分享的技能。')
      return
    }
    if (!mySkill.trim()) {
      setError('你还没有可以交换的技能，先发布一项「我能教」吧。')
      return
    }
    if (existingSwap) {
      setError('你们已经有一条待回复或进行中的交换，先去「我的交换」继续吧。')
      return
    }
    onRequestSwap({
      personId: person.id,
      theirSkill,
      mySkill,
      mode,
      message:
        message.trim() ||
        `你好 ${person.name}！我最近想学「${theirSkill}」，我可以用「${mySkill}」和你交换，时间可以一起商量。`,
    })
  }

  return (
    <Modal open={open} onClose={onClose} label={`${person.name}的个人主页`} size="lg" className="person-dialog">
      <div className="person-modal-grid">
        <div className="person-modal-profile">
          <div className="person-modal-photo-row">
            <div className="person-modal-photo">
              <img src={person.avatar} alt={person.avatarAlt} width="640" height="800" />
              <span className="person-modal-photo-tag">
                <BadgeCheck size={14} aria-hidden="true" />
                {person.verified ? '已认证换艺师' : '换艺伙伴'}
              </span>
            </div>
            <div className="person-modal-title">
              <div className="person-modal-name-row">
                <h2>{person.name}</h2>
                <span className="profile-handle">@{person.handle}</span>
              </div>
              <p className="person-modal-role">{person.role}</p>
              <div className="person-modal-meta">
                <span>
                  <MapPin size={14} aria-hidden="true" />
                  {person.city} · {person.district}
                </span>
                <span>
                  <Star size={14} aria-hidden="true" />
                  {person.rating} · {person.reviewCount} 条评价
                </span>
                <span>
                  <Clock3 size={14} aria-hidden="true" />
                  {person.responseTime}回复
                </span>
              </div>
              <p className="person-modal-bio">{person.bio}</p>
              <div className="person-modal-highlights">
                {person.highlights.map((highlight) => (
                  <span key={highlight}>{highlight}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="person-modal-quote">
            <span aria-hidden="true">“</span>
            <p>{person.quote}</p>
          </div>

          <section className="person-skill-section" aria-labelledby={`${formId}-teach-title`}>
            <div className="person-skill-head">
              <h3 id={`${formId}-teach-title`}>TA 可以教你</h3>
              <span>{person.teach.length} 项</span>
            </div>
            <div className="person-skill-list">
              {person.teach.map((skill) => (
                <div className="person-skill-item" key={skill.name}>
                  <div>
                    <strong>{skill.name}</strong>
                    <span>{skill.category} · {skill.level}</span>
                  </div>
                  <p>{skill.desc}</p>
                  <small>{skill.format}</small>
                </div>
              ))}
            </div>
          </section>

          <section className="person-skill-section" aria-labelledby={`${formId}-learn-title`}>
            <div className="person-skill-head">
              <h3 id={`${formId}-learn-title`}>TA 想学</h3>
              <span>{person.learn.length} 项</span>
            </div>
            <div className="person-want-list">
              {person.learn.map((skill) => (
                <span key={skill.name}>{skill.name}</span>
              ))}
            </div>
          </section>

          <section className="person-reviews" aria-labelledby={`${formId}-reviews-title`}>
            <div className="person-skill-head">
              <h3 id={`${formId}-reviews-title`}>交换过的伙伴说</h3>
              <span>真实评价</span>
            </div>
            {person.reviews.map((review) => (
              <blockquote key={review.name}>
                <Stars rating={review.rating} compact />
                <p>{review.text}</p>
                <cite>— {review.name}</cite>
              </blockquote>
            ))}
          </section>
        </div>

        <aside className="person-modal-offer">
          <div className="offer-head">
            <div>
              <SectionLabel>MAKE A SWAP</SectionLabel>
              <h3>发起一次交换</h3>
            </div>
          </div>

          <p className="offer-subtitle">
            {match.bothMatched
              ? '你们的技能刚好互补，可以各取所需。'
              : '技能方向不完全对称也没关系，先聊聊彼此想学什么。'}{' '}
            <strong>{match.score}% 匹配</strong>
          </p>

          <div className="offer-reasons">
            {match.reasons.slice(0, 2).map((reason) => (
              <span key={reason}>
                <Check size={13} strokeWidth={3} aria-hidden="true" />
                {reason}
              </span>
            ))}
          </div>

          <form className="offer-form" onSubmit={submit}>
            <label className="offer-field">
              <span>我想学</span>
              <span className="offer-select">
                <select value={theirSkill} onChange={(event) => setTheirSkill(event.target.value)} required>
                  {person.teach.map((skill) => (
                    <option value={skill.name} key={skill.name}>
                      {skill.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={15} aria-hidden="true" />
              </span>
            </label>

            <div className="offer-swap-line" aria-hidden="true">
              <ArrowLeftRight size={16} />
            </div>

            <label className="offer-field">
              <span>我能分享</span>
              <span className="offer-select">
                <select value={mySkill} onChange={(event) => setMySkill(event.target.value)} required>
                  {user.teach.map((skill) => (
                    <option value={skill.name} key={skill.name}>
                      {skill.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={15} aria-hidden="true" />
              </span>
            </label>

            <fieldset className="offer-modes">
              <legend>交换方式</legend>
              <div>
                {modes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`mode-option ${mode === item ? 'is-active' : ''}`}
                    aria-pressed={mode === item}
                    onClick={() => setMode(item)}
                  >
                    {item === '线上' ? <Wifi size={14} aria-hidden="true" /> : <MapPin size={14} aria-hidden="true" />}
                    {item}
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="offer-field">
              <span>想对 TA 说</span>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={4}
                placeholder={`你好 ${person.name}，我最近想学「${theirSkill || person.teach[0]?.name}」，我可以用「${mySkill || user.teach[0]?.name}」和你交换…`}
                maxLength={280}
              />
              <small className="offer-counter">{message.length}/280</small>
            </label>

            {existingSwap ? (
              <div className="existing-swap-note" role="status">
                <Clock3 size={16} aria-hidden="true" />
                <p>
                  你们已有一条{existingSwap.status === 'active' ? '进行中的交换' : '待回复的申请'}。
                  <button type="button" className="inline-link" onClick={() => onOpenSwap(existingSwap.id)}>
                    去查看
                    <ArrowRight size={13} aria-hidden="true" />
                  </button>
                </p>
              </div>
            ) : null}

            {error ? (
              <p className="form-error" role="alert">
                {error}
              </p>
            ) : null}

            <button type="submit" className="btn btn--primary btn--block offer-submit" disabled={Boolean(existingSwap)}>
              {existingSwap ? '已有交换在进行中' : '发出交换邀请'}
              {!existingSwap ? <ArrowRight size={17} aria-hidden="true" /> : null}
            </button>
            <p className="offer-fineprint">
              免费交换 · 对方接受后生成 4 周计划 · 你可以随时暂停或结束
            </p>
          </form>

          {person.availability?.length ? (
            <div className="offer-availability">
              <CalendarDays size={15} aria-hidden="true" />
              <span>TA 最近可约：{person.nextAvailable}</span>
            </div>
          ) : null}
        </aside>
      </div>
    </Modal>
  )
}

function PublishModal({ open, initialMode = 'teach', user, onClose, onPublish }) {
  const [mode, setMode] = useState(initialMode)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('音乐')
  const [level, setLevel] = useState('入门')
  const [format, setFormat] = useState('线上')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const formId = useId()

  useEffect(() => {
    if (!open) return
    setMode(initialMode)
    setName('')
    setCategory('音乐')
    setLevel(initialMode === 'teach' ? '进阶' : '入门')
    setFormat('线上')
    setDescription('')
    setError('')
  }, [open, initialMode])

  const handleNameChange = (value) => {
    setName(value)
    const libraryMatch = SKILL_LIBRARY.find((skill) => skill.name === value)
    if (libraryMatch) setCategory(libraryMatch.category)
  }

  const changeMode = (nextMode) => {
    setMode(nextMode)
    setLevel(nextMode === 'teach' ? '进阶' : '入门')
    setError('')
  }

  const submit = (event) => {
    event.preventDefault()
    const cleanName = name.trim()
    if (cleanName.length < 2) {
      setError('技能名称至少需要 2 个字。')
      return
    }
    const duplicate = user[mode].some((skill) => skill.name.toLowerCase() === cleanName.toLowerCase())
    if (duplicate) {
      setError(`「${cleanName}」已经在你「${mode === 'teach' ? '我能教' : '我想学'}」列表里了。`)
      return
    }
    const success = onPublish(mode, {
      id: uid(mode === 'teach' ? 'teach' : 'learn'),
      name: cleanName,
      category,
      level,
      format,
      desc: description.trim(),
    })
    if (success) onClose()
  }

  return (
    <Modal open={open} onClose={onClose} label="发布技能" size="md" className="publish-dialog">
      <div className="modal-heading">
        <SectionLabel>ADD A SKILL</SectionLabel>
        <h2>把「会一点」，变成一次交换。</h2>
        <p>不必等成为专家。清楚说出你能分享什么、想学什么，就已经足够开始。</p>
      </div>

      <div className="publish-tabs" role="tablist" aria-label="发布类型">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'teach'}
          className={mode === 'teach' ? 'is-active' : ''}
          onClick={() => changeMode('teach')}
        >
          <Sparkles size={16} aria-hidden="true" />
          我能教
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'learn'}
          className={mode === 'learn' ? 'is-active publish-tab--learn' : ''}
          onClick={() => changeMode('learn')}
        >
          <Star size={16} aria-hidden="true" />
          我想学
        </button>
      </div>

      <form className="publish-form" onSubmit={submit} role="tabpanel">
        <div className="publish-intro-note">
          <span className="publish-note-icon" aria-hidden="true">
            {mode === 'teach' ? <Sparkles size={17} /> : <Star size={17} />}
          </span>
          <p>
            {mode === 'teach'
              ? '写下你愿意分享的技能，以及你能提供的教学方式。真实、具体的描述更容易遇到合适的交换。'
              : '说出一个具体的小目标，比「想学很多东西」更容易让人找到你。'}
          </p>
        </div>

        <label className="form-field" htmlFor={`${formId}-name`}>
          <span>
            技能名称 <em>*</em>
          </span>
          <input
            id={`${formId}-name`}
            list={`${formId}-suggestions`}
            value={name}
            onChange={(event) => handleNameChange(event.target.value)}
            placeholder={mode === 'teach' ? '例如：吉他弹唱' : '例如：摄影后期'}
            maxLength={24}
            required
            autoFocus
          />
          <datalist id={`${formId}-suggestions`}>
            {SKILL_LIBRARY.map((skill) => (
              <option value={skill.name} key={skill.name} />
            ))}
          </datalist>
          <small>选一个具体、可命名的技能，会更容易被搜到。</small>
        </label>

        <div className="form-row">
          <label className="form-field" htmlFor={`${formId}-category`}>
            <span>所属分类</span>
            <span className="form-select">
              <select id={`${formId}-category`} value={category} onChange={(event) => setCategory(event.target.value)}>
                {['影像', '音乐', '语言', '设计', '编程', '生活', '身心'].map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
              <ChevronDown size={15} aria-hidden="true" />
            </span>
          </label>
          <label className="form-field" htmlFor={`${formId}-level`}>
            <span>当前程度</span>
            <span className="form-select">
              <select id={`${formId}-level`} value={level} onChange={(event) => setLevel(event.target.value)}>
                {LEVELS[mode].map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
              <ChevronDown size={15} aria-hidden="true" />
            </span>
          </label>
        </div>

        <fieldset className="form-field form-fieldset">
          <legend>交换方式</legend>
          <div className="format-options">
            {FORMATS.map((item) => (
              <button
                key={item}
                type="button"
                className={`format-option ${format === item ? 'is-active' : ''}`}
                aria-pressed={format === item}
                onClick={() => setFormat(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="form-field" htmlFor={`${formId}-description`}>
          <span>{mode === 'teach' ? '简单介绍你的经验' : '说说你的学习目标'}</span>
          <textarea
            id={`${formId}-description`}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            maxLength={120}
            placeholder={
              mode === 'teach'
                ? '例如：8 年琴龄，擅长带零基础的人弹会第一首歌，可以布置小作业。'
                : '例如：想用四周建立一套自己的调色流程，周末可以上课。'
            }
          />
          <small className="form-counter">{description.length}/120</small>
        </label>

        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="publish-actions">
          <button type="button" className="btn btn--quiet" onClick={onClose}>
            取消
          </button>
          <button type="submit" className="btn btn--primary">
            发布到我的技能
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </form>
    </Modal>
  )
}

function EditProfileModal({ open, user, onClose, onSave }) {
  const [name, setName] = useState(user.name)
  const [role, setRole] = useState(user.role)
  const [city, setCity] = useState(user.city)
  const [district, setDistrict] = useState(user.district)
  const [bio, setBio] = useState(user.bio)
  const [availability, setAvailability] = useState(user.availability)
  const [modes, setModes] = useState(user.modes)
  const [error, setError] = useState('')
  const formId = useId()
  const slots = ['周一晚', '周二晚', '周三晚', '周四晚', '周五晚', '周六上午', '周六下午', '周日上午', '周日下午']

  useEffect(() => {
    if (!open) return
    setName(user.name)
    setRole(user.role)
    setCity(user.city)
    setDistrict(user.district)
    setBio(user.bio)
    setAvailability(user.availability)
    setModes(user.modes)
    setError('')
  }, [open, user])

  const toggleSlot = (slot) => {
    setAvailability((current) => (current.includes(slot) ? current.filter((item) => item !== slot) : [...current, slot]))
  }

  const toggleMode = (mode) => {
    setModes((current) => (current.includes(mode) ? current.filter((item) => item !== mode) : [...current, mode]))
  }

  const submit = (event) => {
    event.preventDefault()
    if (!name.trim()) {
      setError('请留下你的名字。')
      return
    }
    if (availability.length === 0) {
      setError('至少保留一个可交换的时间段。')
      return
    }
    if (modes.length === 0) {
      setError('至少选择一种交换方式。')
      return
    }
    onSave({
      name: name.trim(),
      role: role.trim() || '技能交换者',
      city: city.trim() || '线上',
      district: district.trim() || '远程',
      bio: bio.trim(),
      availability,
      modes,
    })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} label="编辑个人资料" size="md">
      <div className="modal-heading">
        <SectionLabel>YOUR PROFILE</SectionLabel>
        <h2>让同频的人，更容易找到你。</h2>
        <p>不用把自己包装成专家，具体、真诚的介绍就很好。</p>
      </div>

      <form className="publish-form" onSubmit={submit}>
        <div className="form-row">
          <label className="form-field" htmlFor={`${formId}-name`}>
            <span>名字</span>
            <input id={`${formId}-name`} value={name} onChange={(event) => setName(event.target.value)} required maxLength={20} />
          </label>
          <label className="form-field" htmlFor={`${formId}-role`}>
            <span>身份 / 角色</span>
            <input id={`${formId}-role`} value={role} onChange={(event) => setRole(event.target.value)} maxLength={30} />
          </label>
        </div>
        <div className="form-row">
          <label className="form-field" htmlFor={`${formId}-city`}>
            <span>城市</span>
            <input id={`${formId}-city`} value={city} onChange={(event) => setCity(event.target.value)} maxLength={16} />
          </label>
          <label className="form-field" htmlFor={`${formId}-district`}>
            <span>区域</span>
            <input id={`${formId}-district`} value={district} onChange={(event) => setDistrict(event.target.value)} maxLength={16} />
          </label>
        </div>
        <label className="form-field" htmlFor={`${formId}-bio`}>
          <span>一句话介绍</span>
          <textarea id={`${formId}-bio`} value={bio} onChange={(event) => setBio(event.target.value)} rows={3} maxLength={160} />
          <small className="form-counter">{bio.length}/160</small>
        </label>

        <fieldset className="form-field form-fieldset">
          <legend>可交换时间</legend>
          <div className="chip-options">
            {slots.map((slot) => (
              <button
                key={slot}
                type="button"
                className={`chip-option ${availability.includes(slot) ? 'is-active' : ''}`}
                aria-pressed={availability.includes(slot)}
                onClick={() => toggleSlot(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="form-field form-fieldset">
          <legend>交换方式</legend>
          <div className="chip-options">
            {['线上', '线下'].map((mode) => (
              <button
                key={mode}
                type="button"
                className={`chip-option ${modes.includes(mode) ? 'is-active' : ''}`}
                aria-pressed={modes.includes(mode)}
                onClick={() => toggleMode(mode)}
              >
                {mode}
              </button>
            ))}
          </div>
        </fieldset>

        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="publish-actions">
          <button type="button" className="btn btn--quiet" onClick={onClose}>
            取消
          </button>
          <button type="submit" className="btn btn--primary">
            保存资料
            <Check size={16} aria-hidden="true" />
          </button>
        </div>
      </form>
    </Modal>
  )
}

function SwapModal({
  open,
  swap,
  person,
  user,
  onClose,
  onAccept,
  onDecline,
  onToggleWeek,
  onComplete,
  onRate,
  onOpenChat,
  onCancel,
}) {
  const [confirming, setConfirming] = useState(null)
  const [rating, setRating] = useState(0)

  useEffect(() => {
    if (!open) return
    setConfirming(null)
    setRating(0)
  }, [open, swap?.id])

  if (!swap || !person) return null

  const incoming = swap.direction === 'incoming'
  const isPending = swap.status === 'pending'
  const isActive = swap.status === 'active'
  const isCompleted = swap.status === 'completed'
  const plan = swap.plan || []
  const progress = plan.length ? plan.filter((week) => week.completed).length : swap.progress

  return (
    <Modal open={open} onClose={onClose} label={`与${person.name}的交换详情`} size="lg" className="swap-dialog">
      <div className="swap-modal-head">
        <div>
          <SectionLabel>EXCHANGE DETAIL</SectionLabel>
          <h2>{person.name} 的交换</h2>
          <p>
            {incoming ? 'TA 向你发来了一条交换邀请' : '你发起的交换'} · 创建于 {swap.createdAt}
          </p>
        </div>
        <StatusBadge status={swap.status} direction={swap.direction} />
      </div>

      <div className="swap-modal-grid">
        <div className="swap-modal-main">
          <div className="swap-hero-card">
            <div className="swap-hero-people">
              <div className="swap-hero-person">
                <Avatar person={person} size="lg" />
                <span>
                  <strong>{person.name}</strong>
                  <small>{person.role}</small>
                </span>
              </div>
              <span className="swap-hero-arrow" aria-hidden="true">
                <ArrowLeftRight size={20} />
              </span>
              <div className="swap-hero-person swap-hero-person--me">
                <Avatar person={user} size="lg" />
                <span>
                  <strong>{user.name}</strong>
                  <small>你</small>
                </span>
              </div>
            </div>

            <div className="swap-hero-skills">
              <div>
                <span>你从 TA 学</span>
                <strong>{swap.theirSkill}</strong>
              </div>
              <div>
                <span>你教给 TA</span>
                <strong>{swap.mySkill}</strong>
              </div>
            </div>

            <div className="swap-hero-meta">
              <span>
                <Wifi size={14} aria-hidden="true" />
                {swap.mode}
              </span>
              <span>
                <MapPin size={14} aria-hidden="true" />
                {person.city}
              </span>
              {isActive ? (
                <span>
                  <CalendarDays size={14} aria-hidden="true" />
                  {swap.nextSession || '待约定时间'}
                </span>
              ) : null}
            </div>
          </div>

          <blockquote className="swap-request-quote">
            <span aria-hidden="true">“</span>
            <p>{swap.message}</p>
            <cite>— {incoming ? person.name : '你'}的交换留言</cite>
          </blockquote>

          {isPending ? (
            <div className={`swap-action-panel ${incoming ? 'swap-action-panel--incoming' : ''}`}>
              {incoming ? (
                <>
                  <div className="action-panel-copy">
                    <span className="action-panel-icon" aria-hidden="true">
                      <Sparkles size={18} />
                    </span>
                    <div>
                      <strong>要一起开始吗？</strong>
                      <p>接受后会生成一份 4 周双向交换计划，你们可以一起调整节奏。</p>
                    </div>
                  </div>
                  {confirming === 'decline' ? (
                    <div className="confirm-inline" role="alert">
                      <span>确认婉拒这次交换？</span>
                      <button type="button" className="btn btn--danger btn--small" onClick={() => onDecline(swap.id)}>
                        确认婉拒
                      </button>
                      <button type="button" className="btn btn--quiet btn--small" onClick={() => setConfirming(null)}>
                        再想想
                      </button>
                    </div>
                  ) : (
                    <div className="action-panel-buttons">
                      <button type="button" className="btn btn--quiet" onClick={() => setConfirming('decline')}>
                        婉拒
                      </button>
                      <button type="button" className="btn btn--primary" onClick={() => onAccept(swap.id)}>
                        接受交换
                        <ArrowRight size={16} aria-hidden="true" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="waiting-panel">
                  <span className="waiting-panel-icon" aria-hidden="true">
                    <Clock3 size={19} />
                  </span>
                  <div>
                    <strong>邀请已发出，等待对方回应</strong>
                    <p>对方回复后，你会在这里看到交换计划和下一次约定。</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn--quiet btn--small"
                    onClick={() => (confirming === 'cancel' ? onCancel(swap.id) : setConfirming('cancel'))}
                  >
                    {confirming === 'cancel' ? '确认取消' : '取消邀请'}
                  </button>
                </div>
              )}
            </div>
          ) : null}

          {isActive ? (
            <div className="next-meeting-panel">
              <div className="meeting-icon" aria-hidden="true">
                <CalendarDays size={20} />
              </div>
              <div>
                <span>下一次交换</span>
                <strong>{swap.nextSession || '待约定时间'}</strong>
                <p>提前 10 分钟确认链接或碰面地点，带上最近一次的小作业。</p>
              </div>
              <div className="meeting-actions">
                <button type="button" className="btn btn--quiet btn--small" onClick={() => onOpenChat(swap)}>
                  <MessageCircle size={15} aria-hidden="true" />
                  聊一聊
                </button>
              </div>
            </div>
          ) : null}

          {isCompleted ? (
            <div className="completed-panel">
              <div className="completed-panel-icon" aria-hidden="true">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <strong>这段交换已经完成</strong>
                <p>
                  {swap.completedAt || '刚刚'}完成 · 你们一起走完了 4 次交换
                </p>
              </div>
              <Stars rating={swap.rating || 0} compact />
            </div>
          ) : null}
        </div>

        <aside className="swap-modal-aside">
          <div className="swap-plan-head">
            <div>
              <SectionLabel>SWAP ROADMAP</SectionLabel>
              <h3>4 周交换计划</h3>
            </div>
            {plan.length ? (
              <span className="plan-progress">
                {progress}
                <small>/4</small>
              </span>
            ) : null}
          </div>

          {plan.length ? (
            <>
              <div className="plan-progress-track" aria-hidden="true">
                <span style={{ width: `${(progress / 4) * 100}%` }} />
              </div>
              <ol className="plan-list">
                {plan.map((week) => (
                  <li key={week.week} className={week.completed ? 'is-completed' : ''}>
                    <button
                      type="button"
                      className="plan-check"
                      aria-pressed={week.completed}
                      aria-label={`第 ${week.week} 周：${week.title}，${week.completed ? '已完成' : '未完成'}`}
                      onClick={() => onToggleWeek(swap.id, week.week)}
                      disabled={!isActive}
                    >
                      {week.completed ? <Check size={14} strokeWidth={3} aria-hidden="true" /> : <span />}
                    </button>
                    <div className="plan-week-copy">
                      <div className="plan-week-title">
                        <span>W{String(week.week).padStart(2, '0')}</span>
                        <strong>{week.title}</strong>
                      </div>
                      <p className="plan-topic">
                        <span>我学</span> {week.theirTopic}
                      </p>
                      <p className="plan-topic">
                        <span>我教</span> {week.myTopic}
                      </p>
                      <small>{week.practice}</small>
                    </div>
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <div className="plan-empty">
              <span className="plan-empty-icon" aria-hidden="true">
                {isPending ? <Clock3 size={22} /> : <CheckCircle2 size={22} />}
              </span>
              <p>{isPending ? '接受交换后，会为你们生成一份双向交换计划。' : '这次交换没有留下计划记录。'}</p>
            </div>
          )}

          {isActive ? (
            <div className="plan-footer">
              {confirming === 'complete' ? (
                <div className="confirm-inline confirm-inline--stack" role="alert">
                  <span>确认 4 次交换都完成了吗？</span>
                  <div>
                    <button type="button" className="btn btn--primary btn--small" onClick={() => onComplete(swap.id)}>
                      确认完成
                    </button>
                    <button type="button" className="btn btn--quiet btn--small" onClick={() => setConfirming(null)}>
                      还没
                    </button>
                  </div>
                </div>
              ) : (
                <button type="button" className="btn btn--quiet btn--block" onClick={() => setConfirming('complete')}>
                  <CheckCircle2 size={16} aria-hidden="true" />
                  标记这次交换完成
                </button>
              )}
            </div>
          ) : null}

          {isCompleted ? (
            <div className="rating-panel">
              <h4>{swap.rating ? '你的交换评分' : '给这次交换打个分'}</h4>
              {swap.rating ? (
                <div className="rated-display">
                  <span className="rated-number">{swap.rating}</span>
                  <Stars rating={swap.rating} />
                  <p>谢谢你的认真交换，也谢谢你愿意留下反馈。</p>
                </div>
              ) : (
                <>
                  <div className="rating-stars" role="group" aria-label="选择评分">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        type="button"
                        key={value}
                        className={value <= rating ? 'is-active' : ''}
                        aria-label={`打 ${value} 分`}
                        aria-pressed={value <= rating}
                        onClick={() => setRating(value)}
                      >
                        <Star size={22} aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                  <button type="button" className="btn btn--primary btn--block" disabled={!rating} onClick={() => onRate(swap.id, rating)}>
                    留下评分
                    <Check size={16} aria-hidden="true" />
                  </button>
                </>
              )}
            </div>
          ) : null}

          {swap.conversationId ? (
            <button type="button" className="swap-chat-link" onClick={() => onOpenChat(swap)}>
              <MessageCircle size={16} aria-hidden="true" />
              与 {person.name} 继续聊
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          ) : null}
        </aside>
      </div>
    </Modal>
  )
}

export { PersonModal, PublishModal, EditProfileModal, SwapModal }

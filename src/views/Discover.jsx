import { useEffect, useId, useMemo, useState } from 'react'
import {
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  MapPin,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from 'lucide-react'
import { CATEGORIES, PEOPLE } from '../data.js'
import { rankPeople, skillNames } from '../utils.js'
import {
  Avatar,
  CATEGORY_ICONS,
  MatchForm,
  ScoreRing,
  SectionLabel,
  Stars,
  Switch,
} from '../components/ui.jsx'

function PersonCard({ person, match, index, onOpen }) {
  return (
    <button
      type="button"
      className="person-card reveal-card"
      style={{ '--reveal-delay': `${Math.min(index, 6) * 55}ms` }}
      onClick={() => onOpen(person.id)}
      aria-label={`查看${person.name}的主页，匹配度 ${match.score}%`}
    >
      <span className="person-card-photo">
        <img
          src={person.avatar}
          alt={person.avatarAlt}
          width="640"
          height="800"
          loading={index < 3 ? 'eager' : 'lazy'}
        />
        <span className="person-photo-wash" aria-hidden="true" />
        <span className="person-photo-top">
          {person.verified ? (
            <span className="photo-badge">
              <BadgeCheck size={14} aria-hidden="true" />
              已认证
            </span>
          ) : (
            <span className="photo-badge photo-badge--soft">换艺伙伴</span>
          )}
          <span className="photo-match">
            <ScoreRing score={match.score} />
            <span className="photo-match-copy">
              <strong>{match.label}</strong>
              <small>匹配指数</small>
            </span>
          </span>
        </span>
        <span className="person-photo-bottom">
          <span className="person-name-row">
            <strong>{person.name}</strong>
            <span className="person-role">{person.role}</span>
          </span>
          <span className="person-location">
            <MapPin size={13} aria-hidden="true" />
            {person.city} · {person.distance}
          </span>
        </span>
      </span>

      <span className="person-card-body">
        <span className="exchange-strip">
          <span className="exchange-side">
            <span className="exchange-kicker">TA 能教</span>
            <strong>{person.teach[0]?.name}</strong>
          </span>
          <span className="exchange-swap-icon" aria-hidden="true">
            <ArrowLeftRight size={16} />
          </span>
          <span className="exchange-side exchange-side--right">
            <span className="exchange-kicker">TA 想学</span>
            <strong>{person.learn[0]?.name}</strong>
          </span>
        </span>

        <span className="person-meta-row">
          <Stars rating={person.rating} count={person.reviewCount} compact />
          <span className="meta-divider" aria-hidden="true" />
          <span className="person-availability">
            <CalendarDays size={14} aria-hidden="true" />
            最近可约 {person.nextAvailable}
          </span>
        </span>

        <span className="person-card-foot">
          <span>{match.reasons[0]}</span>
          <span className="card-open-icon" aria-hidden="true">
            <ArrowUpRight size={18} />
          </span>
        </span>
      </span>
    </button>
  )
}

function HeroMatchPanel({ user, person, match, onOpen }) {
  const theirSkill = match.theyTeach?.skill?.name || person.teach[0]?.name
  const mySkill = match.theyWant?.skill?.name || user.teach[0]?.name

  return (
    <div className="hero-stage">
      <div className="hero-panel">
        <div className="hero-panel-head">
          <SectionLabel light>本周最佳配对</SectionLabel>
          <span className="hero-week">VOL. 042</span>
        </div>

        <div className="hero-pair-card">
          <div className="hero-portraits">
            <div className="hero-portrait-block">
              <Avatar person={user} size="hero" />
              <span>你</span>
            </div>
            <span className="hero-exchange" aria-hidden="true">
              <ArrowLeftRight size={20} />
            </span>
            <div className="hero-portrait-block">
              <Avatar person={person} size="hero" />
              <span>{person.name}</span>
            </div>
          </div>

          <div className="hero-score-row">
            <ScoreRing score={match.score} light />
            <div>
              <strong>{match.label}</strong>
              <p>技能刚好互补，时间也对得上</p>
            </div>
          </div>

          <div className="hero-pair-skills">
            <div>
              <span>TA 教你</span>
              <strong>{theirSkill}</strong>
            </div>
            <span aria-hidden="true">
              <ArrowLeftRight size={15} />
            </span>
            <div>
              <span>你教 TA</span>
              <strong>{mySkill}</strong>
            </div>
          </div>

          <div className="hero-quote">
            <span className="quote-mark" aria-hidden="true">
              “
            </span>
            <p>{person.quote}</p>
            <span>
              {person.role} · {person.city}
            </span>
          </div>

          <button type="button" className="hero-profile-link" onClick={() => onOpen(person.id)}>
            看看 {person.name} 的主页
            <ArrowUpRight size={17} aria-hidden="true" />
          </button>
        </div>

        <div className="hero-sticker" aria-hidden="true">
          <span>不收学费</span>
          <strong>只换技能</strong>
        </div>

        <span className="hero-panel-line" aria-hidden="true" />
        <span className="hero-panel-dot" aria-hidden="true" />
      </div>
      <p className="hero-disclaimer">
        <ShieldCheck size={14} aria-hidden="true" />
        匹配依据技能互补度、可约时间与交换口碑，不做竞价排名。
      </p>
    </div>
  )
}

export function Discover({ user, intent, onStartMatch, onOpenPerson, onOpenPublish, onToast }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('全部')
  const [onlyReciprocal, setOnlyReciprocal] = useState(false)
  const [visibleCount, setVisibleCount] = useState(6)
  const searchId = useId()

  const ranked = useMemo(() => rankPeople(PEOPLE, intent), [intent])
  const top = ranked[0]
  const learnOptions = useMemo(() => {
    const values = [
      ...user.learn.map((skill) => skill.name),
      ...PEOPLE.flatMap((person) => person.teach.map((skill) => skill.name)),
    ]
    return [...new Set(values)]
  }, [user.learn])
  const teachOptions = useMemo(() => skillNames(user.teach), [user.teach])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return ranked.filter(({ person, match }) => {
      const searchable = [
        person.name,
        person.role,
        person.city,
        person.bio,
        ...person.teach.map((skill) => `${skill.name} ${skill.category}`),
        ...person.learn.map((skill) => `${skill.name} ${skill.category}`),
      ]
        .join(' ')
        .toLowerCase()
      const inCategory =
        category === '全部' ||
        [...person.teach, ...person.learn].some((skill) => skill.category === category)
      const inSearch = !query || searchable.includes(query)
      const reciprocal = !onlyReciprocal || match.bothMatched
      return inCategory && inSearch && reciprocal
    })
  }, [ranked, category, onlyReciprocal, search])

  useEffect(() => {
    setVisibleCount(6)
  }, [search, category, onlyReciprocal])

  const visible = filtered.slice(0, visibleCount)
  const heroPerson = top.person
  const heroMatch = top.match

  return (
    <>
      <main id="main-content" className="discover-main">
        <section className="hero-section container">
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <span className="live-dot" aria-hidden="true" />
              <span>本周已有 126 次技能交换正在发生</span>
              <span className="eyebrow-rule" aria-hidden="true" />
              <span className="eyebrow-mono">SKILL FOR SKILL</span>
            </div>

            <h1 className="hero-title">
              你会的，
              <br />
              <span className="hero-title-line">
                <span className="hero-title-highlight">正好</span>是 TA 想学的。
              </span>
            </h1>

            <p className="hero-lede">
              不花钱报班，也不独自死磕。把擅长的分享出去，用一次真诚的技能交换，换回一门想学很久的新技能。
            </p>

            <div className="hero-form-shell">
              <div className="hero-form-label">
                <span>
                  <Sparkles size={14} aria-hidden="true" />
                  30 秒找到同频的人
                </span>
                <small>可随时修改</small>
              </div>
              <MatchForm
                intent={intent}
                learnOptions={learnOptions}
                teachOptions={teachOptions}
                onSubmit={onStartMatch}
                submitLabel="开始匹配"
              />
            </div>

            <div className="hero-trust">
              <div className="avatar-stack" aria-label="已有超过 8600 位技能伙伴">
                <Avatar person={user} size="xs" />
                {PEOPLE.slice(0, 3).map((person) => (
                  <Avatar person={person} size="xs" key={person.id} />
                ))}
                <span className="avatar-stack-count">+8.6k</span>
              </div>
              <div className="hero-proof-copy">
                <strong>认真交换，也轻松开始</strong>
                <span>平均 4.9 分 · 86% 的交换完成了 3 次以上</span>
              </div>
              <span className="hero-proof-rule" aria-hidden="true" />
              <div className="hero-mini-stat">
                <strong>2,480</strong>
                <span>次交换已完成</span>
              </div>
            </div>

            <div className="hero-links">
              <button
                type="button"
                className="text-link"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                看看大家怎么换
                <ArrowRight size={16} aria-hidden="true" />
              </button>
              <button type="button" className="text-link text-link--muted" onClick={() => onOpenPublish('teach')}>
                <Plus size={15} aria-hidden="true" />
                先发布一个我能教的
              </button>
            </div>
          </div>

          {top ? (
            <HeroMatchPanel
              user={user}
              person={heroPerson}
              match={heroMatch}
              onOpen={onOpenPerson}
              onToast={onToast}
            />
          ) : null}
        </section>

        <section className="discover-section container" aria-labelledby="discover-title">
          <div className="section-heading-row">
            <div>
              <SectionLabel>PEOPLE TO SWAP WITH</SectionLabel>
              <h2 id="discover-title">今天，和谁交换？</h2>
            </div>
            <label className="search-box" htmlFor={searchId}>
              <Search size={18} aria-hidden="true" />
              <span className="sr-only">搜索技能、名字或城市</span>
              <input
                id={searchId}
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="搜技能、名字或城市"
                autoComplete="off"
              />
              {search ? (
                <button type="button" className="search-clear" onClick={() => setSearch('')} aria-label="清除搜索">
                  <X size={15} aria-hidden="true" />
                </button>
              ) : null}
            </label>
          </div>

          <div className="category-row" role="group" aria-label="按技能分类筛选">
            {CATEGORIES.map((item) => {
              const Icon = CATEGORY_ICONS[item.icon] || Sparkles
              const active = category === item.name
              return (
                <button
                  key={item.name}
                  type="button"
                  className={`category-chip ${active ? 'is-active' : ''}`}
                  aria-pressed={active}
                  onClick={() => setCategory(item.name)}
                >
                  <Icon size={16} aria-hidden="true" />
                  {item.name}
                </button>
              )
            })}
          </div>

          <div className="filter-bar">
            <p className="filter-count" aria-live="polite">
              {filtered.length > 0 ? (
                <>
                  找到 <strong>{filtered.length}</strong> 位可以交换的伙伴
                </>
              ) : (
                '暂时没有找到匹配的伙伴'
              )}
            </p>
            <div className="filter-actions">
              <Switch
                checked={onlyReciprocal}
                onChange={setOnlyReciprocal}
                label="只看双向互补"
                id="reciprocal-switch"
              />
              <span className="filter-hint">按匹配指数排序</span>
            </div>
          </div>

          {visible.length > 0 ? (
            <div className="people-grid">
              {visible.map(({ person, match }, index) => (
                <PersonCard key={person.id} person={person} match={match} index={index} onOpen={onOpenPerson} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-state-icon" aria-hidden="true">
                <Search size={24} />
              </span>
              <h3>这次没有找到刚刚好的组合</h3>
              <p>换一个关键词或分类试试，也可以先发布「我想学」，让同频的人找到你。</p>
              <div className="empty-state-actions">
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => {
                    setSearch('')
                    setCategory('全部')
                    setOnlyReciprocal(false)
                  }}
                >
                  清除筛选
                </button>
                <button type="button" className="btn btn--primary" onClick={() => onOpenPublish('learn')}>
                  发布我想学的
                  <Plus size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {visibleCount < filtered.length ? (
            <div className="load-more-wrap">
              <button type="button" className="btn btn--secondary btn--load" onClick={() => setVisibleCount((count) => count + 6)}>
                再看 {Math.min(6, filtered.length - visibleCount)} 位伙伴
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </section>

        <section className="how-section" id="how-it-works" aria-labelledby="how-title">
          <div className="container how-inner">
            <div className="how-heading">
              <SectionLabel light>HOW IT WORKS</SectionLabel>
              <h2 id="how-title">
                不用先变得很厉害，
                <br />
                才有资格分享。
              </h2>
              <p>
                换艺不售卖课程，也不制造「大师」。你只需要会一点点，愿意把这一点点认真交给另一个人。
              </p>
              <button type="button" className="btn btn--lime" onClick={() => onOpenPublish('teach')}>
                发布我的技能
                <Plus size={17} aria-hidden="true" />
              </button>
            </div>

            <ol className="how-steps">
              <li>
                <span className="step-number">01</span>
                <span className="step-icon" aria-hidden="true">
                  <Plus size={21} />
                </span>
                <h3>列出能教与想学</h3>
                <p>哪怕只是「会弹三首歌」或「想学会冲一杯咖啡」，都可以成为一次交换的起点。</p>
              </li>
              <li>
                <span className="step-number">02</span>
                <span className="step-icon" aria-hidden="true">
                  <Sparkles size={21} />
                </span>
                <h3>遇见刚好互补的人</h3>
                <p>匹配不只看技能关键词，也看可约时间、学习目标和交换口碑。</p>
              </li>
              <li>
                <span className="step-number">03</span>
                <span className="step-icon" aria-hidden="true">
                  <ArrowLeftRight size={21} />
                </span>
                <h3>约一次，认真交换</h3>
                <p>从 4 次小课开始，生成一份双方共同完成的交换计划，边教边学。</p>
              </li>
            </ol>

            <div className="how-footer-note">
              <Star size={15} aria-hidden="true" />
              <span>交换免费。认真、准时和愿意沟通，是这个社区唯一的通行证。</span>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

import { useMemo, useState } from 'react'
import {
  ArrowLeftRight,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  MapPin,
  Plus,
  Sparkles,
  Star,
  Users,
} from 'lucide-react'
import { PEOPLE } from '../data.js'
import { rankPeople, skillNames } from '../utils.js'
import {
  Avatar,
  MatchForm,
  ScoreRing,
  SectionLabel,
  Stars,
  Switch,
} from '../components/ui.jsx'

function MatchCard({ person, match, index, onOpenPerson }) {
  const theirSkill = match.theyTeach?.skill?.name || person.teach[0]?.name
  const mySkill = match.theyWant?.skill?.name || person.learn[0]?.name

  return (
    <article className={`match-card reveal-card ${index === 0 ? 'match-card--top' : ''}`} style={{ '--reveal-delay': `${index * 60}ms` }}>
      <div className="match-card-ribbon">
        <span className="match-index">{String(index + 1).padStart(2, '0')}</span>
        <span className="match-label">
          <Sparkles size={13} aria-hidden="true" />
          {match.label}
        </span>
        <span className="match-score-inline">
          <strong>{match.score}</strong>
          <small>%</small>
          <span>匹配</span>
        </span>
      </div>

      <div className="match-card-head">
        <button type="button" className="person-inline" onClick={() => onOpenPerson(person.id)} aria-label={`查看${person.name}的个人主页`}>
          <Avatar person={person} size="lg" />
          <span className="person-inline-copy">
            <span className="person-inline-name">
              {person.name}
              {person.verified ? <BadgeCheck size={16} className="inline-verified" aria-label="已认证" /> : null}
            </span>
            <span>{person.role}</span>
            <small>
              <MapPin size={12} aria-hidden="true" />
              {person.city} · {person.distance}
            </small>
          </span>
        </button>
        <ScoreRing score={match.score} />
      </div>

      <div className="match-skill-pair">
        <div>
          <span className="match-skill-kicker">TA 能带你</span>
          <strong>{theirSkill}</strong>
          <span className="match-skill-source">来自 TA 的教学技能</span>
        </div>
        <span className="match-pair-icon" aria-hidden="true">
          <ArrowLeftRight size={17} />
        </span>
        <div>
          <span className="match-skill-kicker">你可以分享</span>
          <strong>{mySkill}</strong>
          <span className="match-skill-source">来自你的技能库</span>
        </div>
      </div>

      <ul className="match-reasons">
        {match.reasons.slice(0, 2).map((reason) => (
          <li key={reason}>
            <span aria-hidden="true">
              <Check size={13} strokeWidth={3} />
            </span>
            {reason}
          </li>
        ))}
      </ul>

      <div className="match-card-meta">
        <Stars rating={person.rating} count={person.reviewCount} compact />
        <span>
          <CalendarDays size={14} aria-hidden="true" />
          最近可约 {person.nextAvailable}
        </span>
        <span>
          <Star size={14} aria-hidden="true" />
          {person.swapCount} 次交换
        </span>
      </div>

      <div className="match-card-actions">
        <button type="button" className="btn btn--quiet" onClick={() => onOpenPerson(person.id)}>
          查看资料
        </button>
        <button type="button" className="btn btn--primary" onClick={() => onOpenPerson(person.id)}>
          发起交换
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </article>
  )
}

export function Matches({ user, intent, onStartMatch, onOpenPerson, onOpenPublish }) {
  const [onlyReciprocal, setOnlyReciprocal] = useState(false)
  const ranked = useMemo(() => rankPeople(PEOPLE, intent), [intent])
  const reciprocalCount = ranked.filter(({ match }) => match.bothMatched).length
  const filtered = onlyReciprocal ? ranked.filter(({ match }) => match.bothMatched) : ranked.slice(0, 8)

  const learnOptions = useMemo(() => {
    const values = [
      ...user.learn.map((skill) => skill.name),
      ...PEOPLE.flatMap((person) => person.teach.map((skill) => skill.name)),
    ]
    return [...new Set(values)]
  }, [user.learn])
  const teachOptions = useMemo(() => skillNames(user.teach), [user.teach])

  return (
    <main id="main-content" className="view-shell container">
      <header className="page-heading split-heading">
        <div>
          <SectionLabel>SMART MATCHING</SectionLabel>
          <h1>
            不只看标签，
            <br />
            看你们能不能真的换起来。
          </h1>
          <p className="page-lede">
            换艺会用「技能互补度 × 可约时间 × 交换口碑」重新排序。没有竞价，也没有付费置顶；排在前面的，是更适合一起开始的人。
          </p>
        </div>
        <div className="match-intent-card">
          <div className="match-intent-head">
            <span>这次匹配的条件</span>
            <span className="match-intent-live">
              <span className="live-dot" aria-hidden="true" />
              实时计算
            </span>
          </div>
          <div className="match-intent-pair">
            <div>
              <small>我想学</small>
              <strong>{intent.learn}</strong>
            </div>
            <span aria-hidden="true">
              <ArrowLeftRight size={17} />
            </span>
            <div>
              <small>我能教</small>
              <strong>{intent.teach}</strong>
            </div>
          </div>
          <p>
            <Sparkles size={14} aria-hidden="true" />
            {reciprocalCount} 位伙伴与你是双向互补
          </p>
        </div>
      </header>

      <div className="match-workbench">
        <aside className="match-aside" aria-label="匹配设置">
          <section className="aside-card profile-snapshot">
            <div className="aside-card-head">
              <span className="aside-label">我的交换画像</span>
              <button type="button" className="text-link text-link--small" onClick={() => onOpenPublish('teach')}>
                添加
                <ArrowRight size={14} aria-hidden="true" />
              </button>
            </div>
            <div className="snapshot-person">
              <Avatar person={user} size="lg" ring />
              <div>
                <strong>{user.name}</strong>
                <span>
                  {user.city} · {user.role}
                </span>
                <Stars rating={user.rating} count={user.reviewCount} compact />
              </div>
            </div>
            <div className="snapshot-skills">
              <div>
                <span className="snapshot-skill-label">我能教</span>
                <div className="snapshot-chips">
                  {user.teach.map((skill) => (
                    <span className="mini-chip mini-chip--teach" key={skill.name}>
                      {skill.name}
                    </span>
                  ))}
                  <button type="button" className="mini-add" onClick={() => onOpenPublish('teach')} aria-label="添加我能教的技能">
                    <Plus size={13} aria-hidden="true" />
                  </button>
                </div>
              </div>
              <div>
                <span className="snapshot-skill-label">我想学</span>
                <div className="snapshot-chips">
                  {user.learn.map((skill) => (
                    <span className="mini-chip mini-chip--learn" key={skill.name}>
                      {skill.name}
                    </span>
                  ))}
                  <button type="button" className="mini-add" onClick={() => onOpenPublish('learn')} aria-label="添加我想学的技能">
                    <Plus size={13} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
            <div className="snapshot-availability">
              <CalendarDays size={15} aria-hidden="true" />
              最近可约：{user.availability.join('、')}
            </div>
          </section>

          <section className="aside-card adjust-card">
            <div className="aside-card-head">
              <span className="aside-label">换一组条件</span>
              <span className="aside-hint">即时更新</span>
            </div>
            <MatchForm
              intent={intent}
              learnOptions={learnOptions}
              teachOptions={teachOptions}
              onSubmit={onStartMatch}
              compact
              submitLabel="重新匹配"
            />
          </section>

          <section className="criteria-note">
            <span className="criteria-icon" aria-hidden="true">
              <Users size={18} />
            </span>
            <div>
              <strong>匹配只是开始</strong>
              <p>真正合适的交换，会在你们的第一条消息里慢慢长出来。你可以随时拒绝或暂停。</p>
            </div>
          </section>
        </aside>

        <section className="match-results" aria-labelledby="match-results-title">
          <div className="results-head">
            <div>
              <h2 id="match-results-title">为你排好序的伙伴</h2>
              <p>
                共找到 <strong>{ranked.length}</strong> 位，当前展示 {filtered.length} 位
              </p>
            </div>
            <Switch checked={onlyReciprocal} onChange={setOnlyReciprocal} label="只看双向互补" />
          </div>

          {filtered.length > 0 ? (
            <div className="match-grid">
              {filtered.map(({ person, match }, index) => (
                <MatchCard key={person.id} person={person} match={match} index={index} onOpenPerson={onOpenPerson} />
              ))}
            </div>
          ) : (
            <div className="empty-state empty-state--card">
              <span className="empty-state-icon" aria-hidden="true">
                <Users size={24} />
              </span>
              <h3>这个组合还没有双向互补的人</h3>
              <p>换个技能组合，或者先发布你的技能，让匹配池慢慢长起来。</p>
              <button type="button" className="btn btn--primary" onClick={() => onOpenPublish('teach')}>
                发布我能教的
                <Plus size={16} aria-hidden="true" />
              </button>
            </div>
          )}

          <div className="matching-footnote">
            <Sparkles size={16} aria-hidden="true" />
            <p>
              匹配指数是帮助你做第一轮筛选的参考，不是对方的价值评分。实际交换前，请先聊聊目标、时间和彼此舒服的边界。
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

import { useMemo, useState } from 'react'
import {
  ArrowLeftRight,
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  Clock3,
  MessageCircle,
  Plus,
  Sparkles,
} from 'lucide-react'
import { PEOPLE } from '../data.js'
import { Avatar, ScoreRing, SectionLabel, Stars, StatusBadge } from '../components/ui.jsx'

const TABS = [
  { id: 'all', label: '全部' },
  { id: 'pending', label: '待处理' },
  { id: 'active', label: '进行中' },
  { id: 'completed', label: '已完成' },
]

function SwapCard({ swap, person, user, onOpen }) {
  const incoming = swap.direction === 'incoming'
  const isActive = swap.status === 'active'
  const isPending = swap.status === 'pending'
  const isCompleted = swap.status === 'completed'
  const plan = swap.plan || []

  return (
    <article className={`swap-card ${incoming && isPending ? 'swap-card--attention' : ''} ${isActive ? 'swap-card--active' : ''}`}>
      <div className="swap-card-topline">
        <StatusBadge status={swap.status} direction={swap.direction} />
        <span className="swap-card-date">{swap.createdAt}</span>
      </div>

      <div className="swap-person">
        <Avatar person={person} size="md" />
        <div className="swap-person-copy">
          <h3>
            {person.name}
            {person.verified ? <BadgeCheck size={15} aria-label="已认证" /> : null}
          </h3>
          <p>
            {incoming ? '向你发来交换邀请' : '与你交换技能'} · {swap.mode}
          </p>
        </div>
        {isActive ? <span className="swap-live-pill">正在交换</span> : null}
      </div>

      <div className="swap-pair">
        <div>
          <span>你从 TA 学</span>
          <strong>{swap.theirSkill}</strong>
        </div>
        <span className="swap-pair-arrow" aria-hidden="true">
          <ArrowLeftRight size={16} />
        </span>
        <div>
          <span>你教给 TA</span>
          <strong>{swap.mySkill}</strong>
        </div>
      </div>

      {isActive ? (
        <div className="swap-progress-block">
          <div className="swap-progress-head">
            <span>
              <CheckCircle2 size={15} aria-hidden="true" />
              交换进度 {swap.progress}/4
            </span>
            <strong>{Math.round((swap.progress / 4) * 100)}%</strong>
          </div>
          <div className="progress-track" aria-hidden="true">
            <span style={{ width: `${(swap.progress / 4) * 100}%` }} />
          </div>
          <div className="swap-week-dots" aria-hidden="true">
            {plan.map((week) => (
              <span key={week.week} className={week.completed ? 'is-done' : ''}>
                W{week.week}
              </span>
            ))}
          </div>
          <div className="next-session">
            <CalendarClock size={15} aria-hidden="true" />
            <span>
              下一次：<strong>{swap.nextSession || '待约定时间'}</strong>
            </span>
          </div>
        </div>
      ) : null}

      {isPending ? (
        <div className="swap-message-preview">
          <span className="preview-quote" aria-hidden="true">
            “
          </span>
          <p>{swap.message}</p>
        </div>
      ) : null}

      {isCompleted ? (
        <div className="swap-completed-strip">
          <span>
            <CheckCircle2 size={15} aria-hidden="true" />
            {swap.completedAt || '已完成'}完成
          </span>
          <Stars rating={swap.rating || person.rating} compact />
        </div>
      ) : null}

      <div className="swap-card-footer">
        {isActive ? (
          <button type="button" className="btn btn--primary btn--block" onClick={() => onOpen(swap.id)}>
            进入这次交换
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        ) : isPending ? (
          <>
            <span className="waiting-note">
              <Clock3 size={14} aria-hidden="true" />
              {incoming ? '等待你的回复' : swap.responseBy || '等待对方回复'}
            </span>
            <button type="button" className={`btn ${incoming ? 'btn--primary' : 'btn--quiet'}`} onClick={() => onOpen(swap.id)}>
              {incoming ? '处理邀约' : '查看状态'}
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          </>
        ) : (
          <button type="button" className="btn btn--quiet btn--block" onClick={() => onOpen(swap.id)}>
            查看交换记录
            <ArrowRight size={15} aria-hidden="true" />
          </button>
        )}
      </div>
    </article>
  )
}

export function Swaps({ swaps, user, onOpenSwap, navigate, onOpenPublish }) {
  const [tab, setTab] = useState('all')
  const peopleById = useMemo(() => Object.fromEntries(PEOPLE.map((person) => [person.id, person])), [])

  const counts = useMemo(
    () => ({
      all: swaps.length,
      pending: swaps.filter((swap) => swap.status === 'pending').length,
      active: swaps.filter((swap) => swap.status === 'active').length,
      completed: swaps.filter((swap) => swap.status === 'completed').length,
    }),
    [swaps],
  )

  const filtered = useMemo(() => {
    if (tab === 'all') return swaps
    return swaps.filter((swap) => swap.status === tab)
  }, [swaps, tab])

  const incomingPending = swaps.filter((swap) => swap.status === 'pending' && swap.direction === 'incoming')

  return (
    <main id="main-content" className="view-shell container">
      <header className="page-heading swaps-heading">
        <div>
          <SectionLabel>MY EXCHANGES</SectionLabel>
          <h1>
            每一次交换，
            <br />
            都有一个清楚的小目标。
          </h1>
          <p className="page-lede">
            从一条邀约开始，把时间、目标和节奏说清楚。不用勉强接受，也不用一个人把课程撑完。
          </p>
        </div>
        <div className="swaps-heading-note">
          <span className="swaps-note-icon" aria-hidden="true">
            <Sparkles size={20} />
          </span>
          <p>「好的交换，是两个人都在自己的节奏里往前走一点。」</p>
          <button type="button" className="text-link text-link--small" onClick={() => navigate('discover')}>
            发现更多伙伴
            <ArrowRight size={14} aria-hidden="true" />
          </button>
        </div>
      </header>

      <section className="swap-stats" aria-label="交换概览">
        <button type="button" className={`swap-stat ${tab === 'pending' ? 'is-active' : ''}`} onClick={() => setTab('pending')}>
          <span className="swap-stat-icon swap-stat-icon--lime" aria-hidden="true">
            <Clock3 size={19} />
          </span>
          <span>
            <strong>{counts.pending}</strong>
            <small>待回复</small>
          </span>
          <span className="swap-stat-caption">{incomingPending.length > 0 ? `${incomingPending.length} 条来自对方` : '都处理好了'}</span>
        </button>
        <button type="button" className={`swap-stat ${tab === 'active' ? 'is-active' : ''}`} onClick={() => setTab('active')}>
          <span className="swap-stat-icon swap-stat-icon--green" aria-hidden="true">
            <ArrowLeftRight size={19} />
          </span>
          <span>
            <strong>{counts.active}</strong>
            <small>进行中</small>
          </span>
          <span className="swap-stat-caption">本周有 1 次约定</span>
        </button>
        <button type="button" className={`swap-stat ${tab === 'completed' ? 'is-active' : ''}`} onClick={() => setTab('completed')}>
          <span className="swap-stat-icon swap-stat-icon--coral" aria-hidden="true">
            <CheckCircle2 size={19} />
          </span>
          <span>
            <strong>{counts.completed}</strong>
            <small>已完成</small>
          </span>
          <span className="swap-stat-caption">留下 {counts.completed} 段学习记忆</span>
        </button>
        <div className="swap-quick-action">
          <span>想开启新的交换？</span>
          <div>
            <button type="button" className="btn btn--quiet btn--small" onClick={() => onOpenPublish('learn')}>
              <Plus size={15} aria-hidden="true" />
              发布想学
            </button>
            <button type="button" className="btn btn--primary btn--small" onClick={() => navigate('matches')}>
              看看匹配
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <div className="swap-tabs" role="tablist" aria-label="筛选交换">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={`swap-tab ${tab === item.id ? 'is-active' : ''}`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
            <span>{counts[item.id]}</span>
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="swaps-grid">
          {filtered.map((swap) => {
            const person = peopleById[swap.personId]
            if (!person) return null
            return <SwapCard key={swap.id} swap={swap} person={person} user={user} onOpen={onOpenSwap} />
          })}
        </div>
      ) : (
        <div className="empty-state empty-state--card">
          <span className="empty-state-icon" aria-hidden="true">
            <MessageCircle size={24} />
          </span>
          <h3>{tab === 'pending' ? '没有等待回复的邀约' : tab === 'active' ? '还没有进行中的交换' : '这里还很安静'}</h3>
          <p>
            {tab === 'pending'
              ? '新的交换邀请会出现在这里。也可以主动认识一位刚匹配到的伙伴。'
              : '去发现页找一位同频的人，从一条真诚的交换消息开始。'}
          </p>
          <button type="button" className="btn btn--primary" onClick={() => navigate('discover')}>
            去发现伙伴
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      )}

      <div className="swap-safety-note">
        <span aria-hidden="true">
          <BadgeCheck size={17} />
        </span>
        <p>
          交换前建议先确认：彼此的目标、可用时间、线上或线下，以及是否可以随时暂停。线下面基请选择公共场所。
        </p>
      </div>
    </main>
  )
}

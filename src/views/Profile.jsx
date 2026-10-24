import { useMemo } from 'react'
import {
  ArrowLeftRight,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  Globe2,
  MapPin,
  PenLine,
  Plus,
  Share2,
  Sparkles,
  Star,
  Wifi,
} from 'lucide-react'
import { PEOPLE } from '../data.js'
import { Avatar, SectionLabel, StatusBadge, Stars } from '../components/ui.jsx'

const STATUS_LABEL = {
  pending: '待回复',
  active: '进行中',
  completed: '已完成',
  declined: '已婉拒',
  cancelled: '已取消',
}

export function Profile({ user, swaps, onEditProfile, onOpenPublish, onOpenSwap, onShareProfile, onGoMatches }) {
  const peopleById = useMemo(() => Object.fromEntries(PEOPLE.map((person) => [person.id, person])), [])
  const recentSwaps = swaps.slice(0, 4)
  const completedCount = swaps.filter((swap) => swap.status === 'completed').length
  const activeCount = swaps.filter((swap) => swap.status === 'active').length

  return (
    <main id="main-content" className="view-shell container profile-view">
      <section className="profile-banner" aria-label="个人主页引言">
        <div className="profile-banner-copy">
          <SectionLabel light>MY SWAP PROFILE</SectionLabel>
          <p>“{user.quote}”</p>
        </div>
        <div className="profile-banner-side">
          <span className="profile-open-label">
            <span className="live-dot" aria-hidden="true" />
            OPEN TO SWAP
          </span>
          <button type="button" className="btn btn--lime btn--small" onClick={onShareProfile}>
            <Share2 size={15} aria-hidden="true" />
            分享主页
          </button>
        </div>
        <span className="profile-banner-mark" aria-hidden="true">
          换
        </span>
        <span className="profile-banner-line" aria-hidden="true" />
      </section>

      <section className="profile-identity">
        <div className="profile-avatar-wrap">
          <Avatar person={user} size="profile" ring />
          <span className="profile-avatar-badge" title="已完成身份认证">
            <BadgeCheck size={18} aria-hidden="true" />
            <span className="sr-only">已完成身份认证</span>
          </span>
        </div>
        <div className="profile-identity-copy">
          <div className="profile-name-row">
            <h1>{user.name}</h1>
            <span className="profile-handle">@{user.handle}</span>
          </div>
          <p className="profile-role">
            {user.role}
            <span aria-hidden="true">·</span>
            <MapPin size={14} aria-hidden="true" />
            {user.city} · {user.district}
            <span aria-hidden="true">·</span>
            加入于 {user.joined}
          </p>
          <p className="profile-bio">{user.bio}</p>
          <div className="profile-stats">
            <div>
              <strong>{user.swapCount}</strong>
              <span>次交换</span>
            </div>
            <div>
              <strong>{user.rating}</strong>
              <span>平均评分</span>
            </div>
            <div>
              <strong>{user.responseRate}</strong>
              <span>回复率</span>
            </div>
            <div>
              <strong>{user.responseTime.replace('约 ', '').replace('内', '')}</strong>
              <span>平均回复</span>
            </div>
          </div>
        </div>
        <div className="profile-actions">
          <button type="button" className="btn btn--quiet" onClick={onEditProfile}>
            <PenLine size={16} aria-hidden="true" />
            编辑资料
          </button>
          <button type="button" className="btn btn--primary" onClick={() => onOpenPublish('teach')}>
            <Plus size={16} aria-hidden="true" />
            发布技能
          </button>
        </div>
      </section>

      <div className="profile-layout">
        <div className="profile-main">
          <section className="profile-panel skills-panel" aria-labelledby="my-skills-title">
            <div className="profile-panel-head">
              <div>
                <SectionLabel>SKILL PORTFOLIO</SectionLabel>
                <h2 id="my-skills-title">我的技能组合</h2>
              </div>
              <button type="button" className="text-link text-link--small" onClick={() => onOpenPublish('teach')}>
                <Plus size={14} aria-hidden="true" />
                添加技能
              </button>
            </div>

            <div className="skill-columns">
              <div className="skill-column skill-column--teach">
                <div className="skill-column-head">
                  <span className="skill-column-badge">我能教</span>
                  <span>{user.teach.length} 项技能</span>
                </div>
                {user.teach.map((skill) => (
                  <article className="profile-skill-card" key={skill.id || skill.name}>
                    <div className="profile-skill-top">
                      <strong>{skill.name}</strong>
                      <span className="skill-level">{skill.level}</span>
                    </div>
                    {skill.desc ? <p>{skill.desc}</p> : null}
                    <div className="profile-skill-meta">
                      <span>{skill.category}</span>
                      <span>{skill.format}</span>
                    </div>
                  </article>
                ))}
                <button type="button" className="add-skill-row" onClick={() => onOpenPublish('teach')}>
                  <Plus size={15} aria-hidden="true" />
                  再分享一项技能
                </button>
              </div>

              <div className="skill-column skill-column--learn">
                <div className="skill-column-head">
                  <span className="skill-column-badge skill-column-badge--learn">我想学</span>
                  <span>{user.learn.length} 个目标</span>
                </div>
                {user.learn.map((skill) => (
                  <article className="profile-skill-card" key={skill.id || skill.name}>
                    <div className="profile-skill-top">
                      <strong>{skill.name}</strong>
                      <span className="skill-level skill-level--learn">{skill.level}</span>
                    </div>
                    {skill.desc ? <p>{skill.desc}</p> : null}
                    <div className="profile-skill-meta">
                      <span>{skill.category}</span>
                      <span>{skill.format}</span>
                    </div>
                  </article>
                ))}
                <button type="button" className="add-skill-row add-skill-row--learn" onClick={() => onOpenPublish('learn')}>
                  <Plus size={15} aria-hidden="true" />
                  添加想学的技能
                </button>
              </div>
            </div>

            <div className="skill-swap-hint">
              <span className="skill-hint-icon" aria-hidden="true">
                <Sparkles size={17} />
              </span>
              <p>
                你的技能目前可以和 <strong>{Math.min(9, user.teach.length * 4 + 4)}</strong> 种新技能发起交换。越具体地表达你的目标，越容易遇到同频的人。
              </p>
              <button type="button" className="text-link text-link--small" onClick={onGoMatches}>
                去匹配
                <ArrowRight size={14} aria-hidden="true" />
              </button>
            </div>
          </section>

          <section className="profile-panel" aria-labelledby="exchange-history-title">
            <div className="profile-panel-head">
              <div>
                <SectionLabel>EXCHANGE LOG</SectionLabel>
                <h2 id="exchange-history-title">我的交换记录</h2>
              </div>
              <span className="profile-panel-note">
                {completedCount} 次已完成 · {activeCount} 次进行中
              </span>
            </div>

            <div className="profile-swap-list">
              {recentSwaps.map((swap) => {
                const person = peopleById[swap.personId]
                if (!person) return null
                return (
                  <button type="button" className="profile-swap-row" key={swap.id} onClick={() => onOpenSwap(swap.id)}>
                    <Avatar person={person} size="sm" />
                    <span className="profile-swap-person">
                      <strong>{person.name}</strong>
                      <small>{STATUS_LABEL[swap.status] || swap.status} · {swap.createdAt}</small>
                    </span>
                    <span className="profile-swap-pair">
                      <span>{swap.mySkill}</span>
                      <ArrowLeftRight size={13} aria-hidden="true" />
                      <span>{swap.theirSkill}</span>
                    </span>
                    <ArrowRight size={16} aria-hidden="true" className="profile-swap-arrow" />
                  </button>
                )
              })}
            </div>
          </section>
        </div>

        <aside className="profile-aside" aria-label="个人设置概览">
          <section className="profile-panel profile-side-card">
            <div className="side-card-head">
              <h2>可交换时间</h2>
              <button type="button" className="icon-text-button" onClick={onEditProfile} aria-label="编辑可交换时间">
                <PenLine size={15} aria-hidden="true" />
              </button>
            </div>
            <div className="availability-chips">
              {user.availability.map((slot) => (
                <span key={slot}>
                  <CalendarDays size={14} aria-hidden="true" />
                  {slot}
                </span>
              ))}
            </div>
            <div className="side-detail-row">
              <span>
                <Wifi size={15} aria-hidden="true" />
                交换方式
              </span>
              <strong>{user.modes.join(' / ')}</strong>
            </div>
            <div className="side-detail-row">
              <span>
                <Globe2 size={15} aria-hidden="true" />
                交流语言
              </span>
              <strong>{user.languages.join(' / ')}</strong>
            </div>
          </section>

          <section className="profile-panel profile-side-card profile-stats-card">
            <div className="side-card-head">
              <h2>换艺档案</h2>
              <span className="archive-badge">SINCE {String(user.joined).slice(0, 4)}</span>
            </div>
            <div className="archive-stats">
              <div>
                <strong>{user.swapCount}</strong>
                <span>完成的交换</span>
              </div>
              <div>
                <strong>{user.reviewCount}</strong>
                <span>收到的评价</span>
              </div>
            </div>
            <div className="archive-rating">
              <Stars rating={user.rating} />
              <span>超过 92% 的换艺伙伴</span>
            </div>
            <div className="archive-tags">
              <span>
                <Check size={13} aria-hidden="true" />
                准时守约
              </span>
              <span>
                <Check size={13} aria-hidden="true" />
                耐心拆解
              </span>
              <span>
                <Star size={13} aria-hidden="true" />
                有作业反馈
              </span>
            </div>
          </section>

          <section className="profile-panel profile-review-card">
            <div className="review-head">
              <SectionLabel>KIND WORDS</SectionLabel>
              <span aria-hidden="true">“</span>
            </div>
            <p>{user.reviews[0]?.text || '把你会的一点点，认真交给另一个人。'}</p>
            <div className="review-author">
              <Avatar person={PEOPLE.find((person) => person.name === user.reviews[0]?.name) || PEOPLE[0]} size="xs" />
              <span>
                <strong>{user.reviews[0]?.name || '换艺伙伴'}</strong>
                <small>一起交换过的人</small>
              </span>
              <Stars rating={5} compact />
            </div>
          </section>
        </aside>
      </div>
    </main>
  )
}

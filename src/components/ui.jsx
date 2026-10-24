import { useEffect, useId, useRef, useState } from 'react'
import {
  ArrowLeftRight,
  ArrowRight,
  BadgeCheck,
  Camera,
  Check,
  ChevronDown,
  Code2,
  CookingPot,
  Flower2,
  Languages,
  Music2,
  PenTool,
  Sparkles,
  Star,
  X,
} from 'lucide-react'

export const CATEGORY_ICONS = {
  Sparkles,
  Camera,
  Music2,
  Languages,
  PenTool,
  Code2,
  CookingPot,
  Flower2,
}

export const STATUS_META = {
  pending: { label: '等待回复', className: 'status--pending' },
  active: { label: '进行中', className: 'status--active' },
  completed: { label: '已完成', className: 'status--done' },
  declined: { label: '已婉拒', className: 'status--muted' },
  cancelled: { label: '已取消', className: 'status--muted' },
}

export function Logo({ compact = false }) {
  return (
    <span className={`logo ${compact ? 'logo--compact' : ''}`}>
      <span className="logo-mark" aria-hidden="true">
        <svg viewBox="0 0 44 44" fill="none">
          <rect width="44" height="44" rx="14" fill="currentColor" />
          <path d="M11.5 24.5c0-5.2 3.8-9.5 9-9.5h6.8" stroke="#DDF36B" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M32.5 19.5c0 5.2-3.8 9.5-9 9.5h-6.8" stroke="#F7F3E8" strokeWidth="2.5" strokeLinecap="round" />
          <path d="m24.2 11.7 4 3.3-4 3.3" stroke="#DDF36B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m19.8 32.3-4-3.3 4-3.3" stroke="#F7F3E8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {!compact && (
        <span className="logo-type">
          <strong>换艺</strong>
          <small>SKILL SWAP</small>
        </span>
      )}
    </span>
  )
}

export function Avatar({ person, size = 'md', className = '', ring = false }) {
  if (!person) return null
  return (
    <span className={`avatar avatar--${size} ${ring ? 'avatar--ring' : ''} ${className}`}>
      <img
        src={person.avatar}
        alt={person.avatarAlt || `${person.name}的头像`}
        width="160"
        height="160"
        loading="lazy"
      />
    </span>
  )
}

export function ScoreRing({ score = 0, label = '匹配指数', light = false }) {
  return (
    <span
      className={`score-ring ${light ? 'score-ring--light' : ''}`}
      style={{ '--score-angle': `${Math.min(100, score) * 3.6}deg` }}
      role="img"
      aria-label={`${label} ${score} 分`}
    >
      <span className="score-ring-value">
        {score}
        <small>%</small>
      </span>
    </span>
  )
}

export function StatusBadge({ status = 'pending', direction }) {
  const meta = STATUS_META[status] || STATUS_META.pending
  const directionLabel = direction === 'incoming' ? '收到的邀约' : direction === 'outgoing' ? '发出的邀约' : ''
  return (
    <span className={`status-badge ${meta.className}`}>
      <span className="status-dot" aria-hidden="true" />
      {meta.label}
      {directionLabel ? <span className="status-context">{directionLabel}</span> : null}
    </span>
  )
}

export function SkillPill({ children, tone = 'neutral', small = false }) {
  return <span className={`skill-pill skill-pill--${tone} ${small ? 'skill-pill--sm' : ''}`}>{children}</span>
}

export function Switch({ checked, onChange, label, id }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      className={`switch ${checked ? 'is-on' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className="switch-track" aria-hidden="true">
        <span className="switch-thumb" />
      </span>
      <span className="switch-label">{label}</span>
    </button>
  )
}

export function SectionLabel({ children, light = false }) {
  return (
    <span className={`section-label ${light ? 'section-label--light' : ''}`}>
      <span aria-hidden="true" className="section-label-dot" />
      {children}
    </span>
  )
}

export function Modal({ open, onClose, label, children, size = 'md', className = '' }) {
  const dialogRef = useRef(null)
  const previousOverflow = useRef('')

  useEffect(() => {
    const dialog = dialogRef.current
    if (!open || !dialog) return undefined

    previousOverflow.current = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    if (!dialog.open) dialog.showModal()

    return () => {
      if (dialog.open) dialog.close()
      document.body.style.overflow = previousOverflow.current
    }
  }, [open])

  if (!open) return null

  return (
    <dialog
      ref={dialogRef}
      className={`app-dialog app-dialog--${size} ${className}`}
      aria-label={label}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="dialog-surface">
        <button type="button" className="dialog-close" aria-label="关闭对话框" onClick={onClose}>
          <X size={20} aria-hidden="true" />
        </button>
        {children}
      </div>
    </dialog>
  )
}

export function Toast({ toast }) {
  return (
    <div className="toast-region" role="status" aria-live="polite" aria-atomic="true">
      {toast ? (
        <div className="toast" key={toast.id}>
          <span className="toast-icon" aria-hidden="true">
            <Check size={16} strokeWidth={3} />
          </span>
          <span>{toast.message}</span>
        </div>
      ) : null}
    </div>
  )
}

export function Stars({ rating = 0, count, compact = false }) {
  return (
    <span className={`stars ${compact ? 'stars--compact' : ''}`} aria-label={`评分 ${rating} 分${count ? `，共 ${count} 条评价` : ''}`}>
      <Star size={14} aria-hidden="true" className="star-icon" />
      <strong>{Number(rating).toFixed(1)}</strong>
      {typeof count === 'number' ? <span className="stars-count">({count})</span> : null}
    </span>
  )
}

export function MatchForm({ intent, learnOptions, teachOptions, onSubmit, compact = false, submitLabel = '开始匹配' }) {
  const [learn, setLearn] = useState(intent.learn || '')
  const [teach, setTeach] = useState(intent.teach || '')
  const learnId = useId()
  const teachId = useId()

  useEffect(() => {
    setLearn(intent.learn || '')
    setTeach(intent.teach || '')
  }, [intent.learn, intent.teach])

  return (
    <form
      className={`match-form ${compact ? 'match-form--compact' : ''}`}
      onSubmit={(event) => {
        event.preventDefault()
        if (!learn || !teach) return
        onSubmit({ learn, teach })
      }}
    >
      <div className="match-form-fields">
        <label className="match-field" htmlFor={learnId}>
          <span className="match-field-label">我想学</span>
          <span className="match-select">
            <Sparkles size={17} aria-hidden="true" />
            <select id={learnId} value={learn} onChange={(event) => setLearn(event.target.value)} required>
              <option value="" disabled>
                选一个想学的
              </option>
              {learnOptions.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown size={16} aria-hidden="true" className="select-chevron" />
          </span>
        </label>

        <span className="swap-control" aria-hidden="true">
          <ArrowLeftRight size={18} />
        </span>

        <label className="match-field" htmlFor={teachId}>
          <span className="match-field-label">我能教</span>
          <span className="match-select">
            <Star size={17} aria-hidden="true" />
            <select id={teachId} value={teach} onChange={(event) => setTeach(event.target.value)} required>
              <option value="" disabled>
                选一个能教的
              </option>
              {teachOptions.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown size={16} aria-hidden="true" className="select-chevron" />
          </span>
        </label>
      </div>
      <button className="btn btn--primary match-form-submit" type="submit">
        {submitLabel}
        <ArrowRight size={17} aria-hidden="true" />
      </button>
    </form>
  )
}

export function VerifiedBadge({ small = false }) {
  return (
    <span className={`verified ${small ? 'verified--sm' : ''}`}>
      <BadgeCheck size={small ? 14 : 16} aria-hidden="true" />
      已认证
    </span>
  )
}

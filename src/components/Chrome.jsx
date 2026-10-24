import {
  ArrowLeftRight,
  ArrowUpRight,
  Compass,
  MessageCircle,
  Plus,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { Avatar, Logo } from './ui.jsx'

const MAIN_NAV = [
  { id: 'discover', label: '发现', icon: Compass },
  { id: 'matches', label: '智能匹配', icon: Sparkles },
  { id: 'swaps', label: '我的交换', icon: ArrowLeftRight },
  { id: 'messages', label: '消息', icon: MessageCircle },
]

const MOBILE_NAV = [...MAIN_NAV, { id: 'profile', label: '我的', icon: UserRound }]

export function Header({ view, navigate, user, unread, onPublish }) {
  return (
    <header className="site-header">
      <div className="header-inner container">
        <button className="brand-button" type="button" onClick={() => navigate('discover')} aria-label="换艺 SkillSwap，回到发现页">
          <Logo />
        </button>

        <nav className="main-nav" aria-label="主导航">
          {MAIN_NAV.map((item) => {
            const Icon = item.icon
            const active = view === item.id
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-link ${active ? 'is-active' : ''}`}
                aria-current={active ? 'page' : undefined}
                onClick={() => navigate(item.id)}
              >
                <Icon size={16} aria-hidden="true" />
                {item.label}
                {item.id === 'messages' && unread > 0 ? (
                  <span className="nav-badge" aria-label={`${unread} 条未读消息`}>
                    {unread > 9 ? '9+' : unread}
                  </span>
                ) : null}
              </button>
            )
          })}
        </nav>

        <div className="header-actions">
          <button className="btn btn--primary btn--header" type="button" onClick={onPublish}>
            <Plus size={17} aria-hidden="true" />
            <span>发布技能</span>
          </button>
          <button
            className="user-chip"
            type="button"
            onClick={() => navigate('profile')}
            aria-label={`查看${user.name}的个人主页`}
            aria-current={view === 'profile' ? 'page' : undefined}
          >
            <Avatar person={user} size="sm" ring />
            <span className="user-chip-name">{user.name}</span>
            <ArrowUpRight size={14} aria-hidden="true" className="user-chip-arrow" />
          </button>
        </div>
      </div>
    </header>
  )
}

export function BottomNav({ view, navigate, unread }) {
  return (
    <nav className="bottom-nav" aria-label="移动端主导航">
      {MOBILE_NAV.map((item) => {
        const Icon = item.icon
        const active = view === item.id
        return (
          <button
            key={item.id}
            type="button"
            className={`bottom-nav-link ${active ? 'is-active' : ''}`}
            aria-current={active ? 'page' : undefined}
            onClick={() => navigate(item.id)}
          >
            <span className="bottom-nav-icon">
              <Icon size={20} aria-hidden="true" />
              {item.id === 'messages' && unread > 0 ? <span className="nav-badge nav-badge--mobile">{unread > 9 ? '9+' : unread}</span> : null}
            </span>
            <span>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Logo />
          <p>用你会的，换你想学的。</p>
        </div>
        <div className="footer-copy">
          <p>换艺是一个可交互的产品原型。新增技能、交换与对话会保存在当前浏览器，不影响其他访问者。</p>
          <p className="footer-fineprint">
            示例人像来自{' '}
            <a href="https://unsplash.com" target="_blank" rel="noreferrer">
              Unsplash
            </a>
            。不收取课程费用，交换前请先沟通彼此的时间与边界。
          </p>
        </div>
        <div className="footer-signature" aria-hidden="true">
          <span>SKILL</span>
          <span>FOR</span>
          <span>SKILL</span>
        </div>
      </div>
    </footer>
  )
}

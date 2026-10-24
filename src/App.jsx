import { useEffect, useRef, useState } from 'react'
import { CURRENT_USER, INITIAL_CONVERSATIONS, INITIAL_SWAPS, PEOPLE } from './data.js'
import { buildPlan, buildReply, getDefaultIntent, uid, unreadTotal } from './utils.js'
import { BottomNav, Footer, Header } from './components/Chrome.jsx'
import { EditProfileModal, PersonModal, PublishModal, SwapModal } from './components/Modals.jsx'
import { Toast } from './components/ui.jsx'
import { Discover } from './views/Discover.jsx'
import { Matches } from './views/Matches.jsx'
import { Swaps } from './views/Swaps.jsx'
import { Messages } from './views/Messages.jsx'
import { Profile } from './views/Profile.jsx'

const STORAGE_KEY = 'huanyi-skillswap-state-v1'
const VALID_VIEWS = ['discover', 'matches', 'swaps', 'messages', 'profile']

const clone = (value) => JSON.parse(JSON.stringify(value))

function createSeedState() {
  return {
    user: clone(CURRENT_USER),
    swaps: clone(INITIAL_SWAPS),
    conversations: clone(INITIAL_CONVERSATIONS),
  }
}

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return createSeedState()
    const parsed = JSON.parse(raw)
    if (parsed?.version === 1 && parsed.data?.user && Array.isArray(parsed.data.swaps)) {
      return parsed.data
    }
  } catch (error) {
    // A blocked or stale storage should never block the demo from opening.
  }
  return createSeedState()
}

function readViewFromHash() {
  if (typeof window === 'undefined') return 'discover'
  const raw = window.location.hash.replace(/^#\/?/, '')
  return VALID_VIEWS.includes(raw) ? raw : 'discover'
}

function copyText(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => fallbackCopy(text))
  }
  return Promise.resolve(fallbackCopy(text))
}

function fallbackCopy(text) {
  try {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.left = '-9999px'
    document.body.appendChild(area)
    area.select()
    const success = document.execCommand('copy')
    document.body.removeChild(area)
    return success
  } catch (error) {
    return false
  }
}

export default function App() {
  const [data, setData] = useState(loadState)
  const [view, setView] = useState(readViewFromHash)
  const [intent, setIntent] = useState(() => getDefaultIntent(data.user))
  const [activeConversationId, setActiveConversationId] = useState(() => data.conversations[0]?.id || null)
  const [typingConversationId, setTypingConversationId] = useState(null)
  const [toast, setToast] = useState(null)
  const [activePersonId, setActivePersonId] = useState(null)
  const [activeSwapId, setActiveSwapId] = useState(null)
  const [publishMode, setPublishMode] = useState(null)
  const [editProfileOpen, setEditProfileOpen] = useState(false)

  const toastTimer = useRef(null)
  const replyTimers = useRef([])
  const viewRef = useRef(view)
  const activeConversationRef = useRef(activeConversationId)

  useEffect(() => {
    viewRef.current = view
  }, [view])

  useEffect(() => {
    activeConversationRef.current = activeConversationId
  }, [activeConversationId])

  useEffect(() => {
    const titles = {
      discover: '换艺 SkillSwap · 你会的，正好是 TA 想学的',
      matches: '智能匹配 · 换艺 SkillSwap',
      swaps: '我的交换 · 换艺 SkillSwap',
      messages: '消息 · 换艺 SkillSwap',
      profile: `${data.user.name}的换艺主页 · 换艺 SkillSwap`,
    }
    document.title = titles[view] || titles.discover
  }, [view, data.user.name])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, data }))
    } catch (error) {
      // Local-only persistence is a convenience, not a requirement.
    }
  }, [data])

  useEffect(() => {
    if (!window.location.hash) {
      window.history.replaceState(null, '', '#/discover')
    }
    const handlePop = () => {
      setView(readViewFromHash())
      window.scrollTo(0, 0)
    }
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])

  useEffect(() => {
    if (view !== 'messages' || !activeConversationId) return
    setData((previous) => {
      const target = previous.conversations.find((conversation) => conversation.id === activeConversationId)
      if (!target || !target.unread) return previous
      return {
        ...previous,
        conversations: previous.conversations.map((conversation) =>
          conversation.id === activeConversationId ? { ...conversation, unread: 0 } : conversation,
        ),
      }
    })
  }, [view, activeConversationId])

  useEffect(() => {
    return () => {
      window.clearTimeout(toastTimer.current)
      replyTimers.current.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  const showToast = (message) => {
    setToast({ id: uid('toast'), message })
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 3600)
  }

  const navigate = (nextView) => {
    const target = VALID_VIEWS.includes(nextView) ? nextView : 'discover'
    if (target !== view) {
      window.history.pushState(null, '', `#/${target}`)
      setView(target)
    }
    window.scrollTo(0, 0)
  }

  const closeAllModals = () => {
    setActivePersonId(null)
    setActiveSwapId(null)
    setPublishMode(null)
    setEditProfileOpen(false)
  }

  const openPerson = (personId) => {
    closeAllModals()
    setActivePersonId(personId)
  }

  const openSwap = (swapId) => {
    closeAllModals()
    setActiveSwapId(swapId)
  }

  const openPublish = (mode = 'teach') => {
    closeAllModals()
    setPublishMode(mode)
  }

  const openEditProfile = () => {
    closeAllModals()
    setEditProfileOpen(true)
  }

  const handleStartMatch = (nextIntent) => {
    setIntent(nextIntent)
    navigate('matches')
    showToast(`已按「${nextIntent.learn} × ${nextIntent.teach}」重新匹配`)
  }

  const handlePublish = (mode, skill) => {
    const exists = data.user[mode].some((item) => item.name === skill.name)
    if (exists) return false

    setData((previous) => ({
      ...previous,
      user: {
        ...previous.user,
        [mode]: [...previous.user[mode], skill],
      },
    }))
    setIntent((previous) => ({ ...previous, [mode]: skill.name }))
    showToast(`「${skill.name}」已添加到${mode === 'teach' ? '我能教' : '我想学'}`)
    return true
  }

  const handleSaveProfile = (patch) => {
    setData((previous) => ({ ...previous, user: { ...previous.user, ...patch } }))
    showToast('个人资料已更新')
  }

  const handleRequestSwap = ({ personId, theirSkill, mySkill, mode, message }) => {
    const person = PEOPLE.find((item) => item.id === personId)
    if (!person) return

    const existing = data.swaps.find(
      (swap) => swap.personId === personId && ['pending', 'active'].includes(swap.status),
    )
    if (existing) {
      showToast('你们已经有一条待回复或进行中的交换')
      return
    }

    const existingConversation = data.conversations.find((conversation) => conversation.personId === personId)
    const conversationId = existingConversation?.id || uid('conv')
    const newMessage = {
      id: uid('msg'),
      from: 'me',
      text: message,
      time: '刚刚',
    }
    const newSwap = {
      id: uid('swap'),
      personId,
      status: 'pending',
      direction: 'outgoing',
      theirSkill,
      mySkill,
      mode,
      message,
      createdAt: '刚刚',
      responseBy: '等待对方回复',
      nextSession: null,
      conversationId,
      plan: null,
      progress: 0,
    }

    setData((previous) => {
      let conversations = previous.conversations
      if (existingConversation) {
        const updated = {
          ...existingConversation,
          unread: 0,
          messages: [...existingConversation.messages, newMessage],
        }
        conversations = [updated, ...previous.conversations.filter((conversation) => conversation.id !== conversationId)]
      } else {
        conversations = [
          {
            id: conversationId,
            personId,
            unread: 0,
            messages: [newMessage],
          },
          ...previous.conversations,
        ]
      }
      return {
        ...previous,
        swaps: [newSwap, ...previous.swaps],
        conversations,
      }
    })

    setActiveConversationId(conversationId)
    setActivePersonId(null)
    navigate('swaps')
    showToast(`交换邀请已发给 ${person.name}`)
  }

  const handleAcceptSwap = (swapId) => {
    setData((previous) => ({
      ...previous,
      swaps: previous.swaps.map((swap) => {
        if (swap.id !== swapId) return swap
        const plan = buildPlan(swap.theirSkill, swap.mySkill, 0)
        return {
          ...swap,
          status: 'active',
          acceptedAt: '刚刚',
          nextSession: '待约定时间',
          plan,
          progress: 0,
        }
      }),
    }))
    showToast('交换已接受，4 周计划已生成')
  }

  const handleDeclineSwap = (swapId) => {
    setData((previous) => ({
      ...previous,
      swaps: previous.swaps.map((swap) => (swap.id === swapId ? { ...swap, status: 'declined' } : swap)),
    }))
    setActiveSwapId(null)
    showToast('已婉拒这次交换')
  }

  const handleCancelSwap = (swapId) => {
    setData((previous) => ({
      ...previous,
      swaps: previous.swaps.map((swap) => (swap.id === swapId ? { ...swap, status: 'cancelled' } : swap)),
    }))
    setActiveSwapId(null)
    showToast('这次交换邀请已取消')
  }

  const handleToggleWeek = (swapId, weekNumber) => {
    setData((previous) => ({
      ...previous,
      swaps: previous.swaps.map((swap) => {
        if (swap.id !== swapId || !swap.plan) return swap
        const plan = swap.plan.map((week) =>
          week.week === weekNumber ? { ...week, completed: !week.completed } : week,
        )
        return { ...swap, plan, progress: plan.filter((week) => week.completed).length }
      }),
    }))
  }

  const handleCompleteSwap = (swapId) => {
    setData((previous) => ({
      ...previous,
      swaps: previous.swaps.map((swap) => {
        if (swap.id !== swapId) return swap
        const plan = (swap.plan || []).map((week) => ({ ...week, completed: true }))
        return {
          ...swap,
          status: 'completed',
          completedAt: '今天',
          progress: plan.length || 4,
          plan: plan.length ? plan : swap.plan,
        }
      }),
    }))
    showToast('这段交换完成了，给对方留个评分吧')
  }

  const handleRateSwap = (swapId, rating) => {
    setData((previous) => ({
      ...previous,
      swaps: previous.swaps.map((swap) => (swap.id === swapId ? { ...swap, rating } : swap)),
    }))
    showToast('评分已留下，谢谢你的认真反馈')
  }

  const handleOpenSwapChat = (swap) => {
    const person = PEOPLE.find((item) => item.id === swap.personId)
    if (!person) return
    let conversationId = swap.conversationId
    if (!conversationId || !data.conversations.some((conversation) => conversation.id === conversationId)) {
      conversationId = uid('conv')
      const conversation = {
        id: conversationId,
        personId: swap.personId,
        unread: 0,
        messages: swap.message
          ? [{ id: uid('msg'), from: 'me', text: swap.message, time: swap.createdAt || '刚刚' }]
          : [],
      }
      setData((previous) => ({
        ...previous,
        conversations: [conversation, ...previous.conversations],
        swaps: previous.swaps.map((item) =>
          item.id === swap.id ? { ...item, conversationId } : item,
        ),
      }))
    }
    setActiveSwapId(null)
    setActiveConversationId(conversationId)
    navigate('messages')
  }

  const handleSelectConversation = (conversationId) => {
    setActiveConversationId(conversationId)
  }

  const handleSendMessage = (conversationId, text) => {
    const conversation = data.conversations.find((item) => item.id === conversationId)
    if (!conversation) return
    const person = PEOPLE.find((item) => item.id === conversation.personId)

    const message = {
      id: uid('msg'),
      from: 'me',
      text,
      time: '刚刚',
    }

    setData((previous) => ({
      ...previous,
      conversations: previous.conversations.map((item) =>
        item.id === conversationId
          ? { ...item, unread: 0, messages: [...item.messages, message] }
          : item,
      ),
    }))

    if (!person) return
    setTypingConversationId(conversationId)
    const timer = window.setTimeout(() => {
      const replyText = buildReply(person, text)
      const reply = {
        id: uid('msg'),
        from: 'them',
        text: replyText,
        time: '刚刚',
      }
      const isReading = viewRef.current === 'messages' && activeConversationRef.current === conversationId
      setData((previous) => ({
        ...previous,
        conversations: previous.conversations.map((item) =>
          item.id === conversationId
            ? {
                ...item,
                messages: [...item.messages, reply],
                unread: isReading ? 0 : (item.unread || 0) + 1,
              }
            : item,
        ),
      }))
      setTypingConversationId((current) => (current === conversationId ? null : current))
    }, 1800)
    replyTimers.current.push(timer)
  }

  const handleShareProfile = () => {
    const url = `${window.location.origin}${window.location.pathname}#/profile`
    copyText(url).then((success) => {
      showToast(success ? '个人主页链接已复制' : '复制失败，请手动复制浏览器地址')
    })
  }

  const unread = unreadTotal(data.conversations)
  const activePerson = PEOPLE.find((person) => person.id === activePersonId) || null
  const activeSwap = data.swaps.find((swap) => swap.id === activeSwapId) || null
  const activeSwapPerson = activeSwap ? PEOPLE.find((person) => person.id === activeSwap.personId) : null

  let currentView = null
  if (view === 'discover') {
    currentView = (
      <Discover
        user={data.user}
        intent={intent}
        onStartMatch={handleStartMatch}
        onOpenPerson={openPerson}
        onOpenPublish={openPublish}
        onToast={showToast}
      />
    )
  } else if (view === 'matches') {
    currentView = (
      <Matches
        user={data.user}
        intent={intent}
        onStartMatch={handleStartMatch}
        onOpenPerson={openPerson}
        onOpenPublish={openPublish}
      />
    )
  } else if (view === 'swaps') {
    currentView = (
      <Swaps
        swaps={data.swaps}
        user={data.user}
        onOpenSwap={openSwap}
        navigate={navigate}
        onOpenPublish={openPublish}
      />
    )
  } else if (view === 'messages') {
    currentView = (
      <Messages
        user={data.user}
        conversations={data.conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onSendMessage={handleSendMessage}
        typingConversationId={typingConversationId}
        onOpenPerson={openPerson}
        onOpenSwap={openSwap}
        swaps={data.swaps}
        unread={unread}
      />
    )
  } else {
    currentView = (
      <Profile
        user={data.user}
        swaps={data.swaps}
        onEditProfile={openEditProfile}
        onOpenPublish={openPublish}
        onOpenSwap={openSwap}
        onShareProfile={handleShareProfile}
        onGoMatches={() => navigate('matches')}
      />
    )
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        跳到主要内容
      </a>
      <Header
        view={view}
        navigate={navigate}
        user={data.user}
        unread={unread}
        onPublish={() => openPublish('teach')}
      />
      {currentView}
      <Footer />
      <BottomNav view={view} navigate={navigate} unread={unread} />

      <PersonModal
        open={Boolean(activePerson)}
        person={activePerson}
        user={data.user}
        intent={intent}
        swaps={data.swaps}
        onClose={() => setActivePersonId(null)}
        onRequestSwap={handleRequestSwap}
        onOpenSwap={(swapId) => {
          setActivePersonId(null)
          setActiveSwapId(swapId)
        }}
      />

      <PublishModal
        open={publishMode !== null}
        initialMode={publishMode || 'teach'}
        user={data.user}
        onClose={() => setPublishMode(null)}
        onPublish={handlePublish}
      />

      <EditProfileModal
        open={editProfileOpen}
        user={data.user}
        onClose={() => setEditProfileOpen(false)}
        onSave={handleSaveProfile}
      />

      <SwapModal
        open={Boolean(activeSwap)}
        swap={activeSwap}
        person={activeSwapPerson}
        user={data.user}
        onClose={() => setActiveSwapId(null)}
        onAccept={handleAcceptSwap}
        onDecline={handleDeclineSwap}
        onToggleWeek={handleToggleWeek}
        onComplete={handleCompleteSwap}
        onRate={handleRateSwap}
        onOpenChat={handleOpenSwapChat}
        onCancel={handleCancelSwap}
      />

      <Toast toast={toast} />
    </div>
  )
}

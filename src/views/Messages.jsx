import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarClock,
  CheckCheck,
  MessageCircle,
  Send,
  Sparkles,
} from 'lucide-react'
import { PEOPLE } from '../data.js'
import { Avatar, SectionLabel } from '../components/ui.jsx'

const QUICK_PROMPTS = ['这周什么时候方便？', '我们先定一个小目标吧', '我把练习清单发你']

function ConversationList({ conversations, peopleById, activeConversationId, onSelect, unread }) {
  return (
    <aside className="conversation-panel">
      <div className="conversation-panel-head">
        <div>
          <h2>对话</h2>
          <p>{unread > 0 ? `${unread} 条未读消息` : '消息都看完了'}</p>
        </div>
        <span className="conversation-count">{conversations.length}</span>
      </div>
      <nav className="conversation-list" aria-label="对话列表">
        {conversations.map((conversation) => {
          const person = peopleById[conversation.personId]
          if (!person) return null
          const last = conversation.messages[conversation.messages.length - 1]
          const active = conversation.id === activeConversationId
          return (
            <button
              key={conversation.id}
              type="button"
              className={`conversation-item ${active ? 'is-active' : ''}`}
              onClick={() => onSelect(conversation.id)}
              aria-current={active ? 'true' : undefined}
            >
              <Avatar person={person} size="md" />
              <span className="conversation-copy">
                <span className="conversation-top">
                  <strong>{person.name}</strong>
                  <small>{last?.time?.split(' ').slice(-1)[0] || ''}</small>
                </span>
                <span className="conversation-role">{person.role}</span>
                <span className="conversation-preview">{last?.from === 'me' ? '你：' : ''}{last?.text}</span>
              </span>
              {conversation.unread > 0 ? (
                <span className="conversation-unread" aria-label={`${conversation.unread} 条未读`}>
                  {conversation.unread}
                </span>
              ) : null}
            </button>
          )
        })}
      </nav>
      <div className="conversation-note">
        <MessageCircle size={16} aria-hidden="true" />
        <p>第一次打招呼，可以说说你为什么想学、最近能投入多少时间。</p>
      </div>
    </aside>
  )
}

function ChatPanel({
  conversation,
  person,
  user,
  swaps,
  onBack,
  onSend,
  typing,
  onOpenPerson,
  onOpenSwap,
}) {
  const [draft, setDraft] = useState('')
  const transcriptRef = useRef(null)
  const inputRef = useRef(null)
  const lastMessageCount = conversation?.messages?.length || 0

  useEffect(() => {
    const node = transcriptRef.current
    if (node) node.scrollTop = node.scrollHeight
  }, [conversation?.id, lastMessageCount, typing])

  useEffect(() => {
    setDraft('')
  }, [conversation?.id])

  if (!conversation || !person) {
    return (
      <section className="chat-panel chat-panel--empty" aria-label="对话内容">
        <span className="chat-empty-icon" aria-hidden="true">
          <MessageCircle size={28} />
        </span>
        <h2>选一段对话，继续聊聊</h2>
        <p>把想学的目标说清楚，是交换顺利开始的第一步。</p>
      </section>
    )
  }

  const relatedSwap = swaps.find(
    (swap) => swap.personId === person.id && ['active', 'pending'].includes(swap.status),
  )

  const sendDraft = () => {
    const value = draft.trim()
    if (!value) return
    onSend(conversation.id, value)
    setDraft('')
    inputRef.current?.focus()
  }

  return (
    <section className="chat-panel" aria-label={`与${person.name}的对话`}>
      <header className="chat-head">
        <button type="button" className="chat-back" onClick={onBack} aria-label="返回对话列表">
          <ArrowLeft size={19} aria-hidden="true" />
        </button>
        <button type="button" className="chat-person" onClick={() => onOpenPerson(person.id)} aria-label={`查看${person.name}的个人主页`}>
          <Avatar person={person} size="md" />
          <span>
            <strong>
              {person.name}
              {person.verified ? <BadgeCheck size={15} aria-label="已认证" /> : null}
            </strong>
            <small>{person.role} · {person.city}</small>
          </span>
        </button>
        <div className="chat-head-actions">
          {relatedSwap ? (
            <button type="button" className="chat-swap-chip" onClick={() => onOpenSwap(relatedSwap.id)}>
              <CalendarClock size={14} aria-hidden="true" />
              {relatedSwap.status === 'active' ? `交换中 · ${relatedSwap.progress}/4` : '邀约待回复'}
            </button>
          ) : null}
          <button type="button" className="btn btn--quiet btn--small chat-profile-button" onClick={() => onOpenPerson(person.id)}>
            查看资料
            <ArrowUpRight size={14} aria-hidden="true" />
          </button>
        </div>
      </header>

      {relatedSwap ? (
        <div className="chat-context">
          <span className="chat-context-label">
            <Sparkles size={14} aria-hidden="true" />
            {relatedSwap.status === 'active' ? '正在进行的交换' : '交换邀约'}
          </span>
          <span className="chat-context-pair">
            {relatedSwap.mySkill} <span aria-hidden="true">⇄</span> {relatedSwap.theirSkill}
          </span>
          {relatedSwap.nextSession ? <span className="chat-context-time">{relatedSwap.nextSession}</span> : null}
          <button type="button" className="text-link text-link--small" onClick={() => onOpenSwap(relatedSwap.id)}>
            查看交换
            <ArrowRight size={13} aria-hidden="true" />
          </button>
        </div>
      ) : null}

      <div className="message-transcript" ref={transcriptRef} role="log" aria-live="polite" aria-relevant="additions" aria-label={`与${person.name}的消息记录`}>
        <div className="message-day">
          <span>最近的对话</span>
        </div>
        {conversation.messages.map((message) => {
          const mine = message.from === 'me'
          return (
            <div key={message.id} className={`message-row ${mine ? 'message-row--mine' : ''}`}>
              {!mine ? <Avatar person={person} size="xs" /> : null}
              <div className="message-stack">
                <div className={`message-bubble ${mine ? 'message-bubble--mine' : ''}`}>{message.text}</div>
                <span className="message-time">
                  {mine ? <CheckCheck size={13} aria-label="已发送" /> : null}
                  {message.time}
                </span>
              </div>
            </div>
          )
        })}
        {typing ? (
          <div className="message-row">
            <Avatar person={person} size="xs" />
            <div className="typing-bubble" aria-label={`${person.name}正在输入`}>
              <span />
              <span />
              <span />
            </div>
          </div>
        ) : null}
      </div>

      <div className="chat-composer-wrap">
        <div className="quick-prompts" aria-label="快捷回复">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              className="quick-prompt"
              onClick={() => {
                setDraft(prompt)
                inputRef.current?.focus()
              }}
            >
              {prompt}
            </button>
          ))}
        </div>
        <form
          className="chat-composer"
          onSubmit={(event) => {
            event.preventDefault()
            sendDraft()
          }}
        >
          <label className="sr-only" htmlFor="message-input">
            给{person.name}发消息
          </label>
          <textarea
            id="message-input"
            ref={inputRef}
            rows={1}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                event.preventDefault()
                sendDraft()
              }
            }}
            placeholder={`给${person.name}发消息…`}
            aria-describedby="message-hint"
          />
          <button type="submit" className="chat-send" disabled={!draft.trim()} aria-label="发送消息">
            <Send size={18} aria-hidden="true" />
          </button>
        </form>
        <p className="composer-hint" id="message-hint">
          Enter 发送 · Shift + Enter 换行
          <span className="demo-hint">
            <Sparkles size={12} aria-hidden="true" />
            演示对话
          </span>
        </p>
      </div>
    </section>
  )
}

export function Messages({
  user,
  conversations,
  activeConversationId,
  onSelectConversation,
  onSendMessage,
  typingConversationId,
  onOpenPerson,
  onOpenSwap,
  swaps,
  unread,
}) {
  const peopleById = Object.fromEntries(PEOPLE.map((person) => [person.id, person]))
  const activeConversation = conversations.find((conversation) => conversation.id === activeConversationId) || null
  const [mobileChatOpen, setMobileChatOpen] = useState(Boolean(activeConversation))

  useEffect(() => {
    if (activeConversation) setMobileChatOpen(true)
  }, [activeConversation?.id])

  return (
    <main id="main-content" className="view-shell container messages-view">
      <header className="messages-heading">
        <div>
          <SectionLabel>CONVERSATIONS</SectionLabel>
          <h1>把下一次，约出来。</h1>
        </div>
        <p>一段好的交换，从说清楚「我想学什么」和「我能给什么」开始。</p>
      </header>

      <div className={`messages-shell ${mobileChatOpen ? 'is-chat-open' : ''}`}>
        <ConversationList
          conversations={conversations}
          peopleById={peopleById}
          activeConversationId={activeConversationId}
          onSelect={(id) => {
            onSelectConversation(id)
            setMobileChatOpen(true)
          }}
          unread={unread}
        />
        <ChatPanel
          conversation={activeConversation}
          person={activeConversation ? peopleById[activeConversation.personId] : null}
          user={user}
          swaps={swaps}
          onBack={() => setMobileChatOpen(false)}
          onSend={onSendMessage}
          typing={typingConversationId === activeConversation?.id}
          onOpenPerson={onOpenPerson}
          onOpenSwap={onOpenSwap}
        />
      </div>
    </main>
  )
}

'use client'

import { useState } from 'react'
import AdminGuard from '@/components/AdminGuard'

export default function NotificationsPage() {
  const [target, setTarget] = useState<'all' | 'user'>('all')
  const [username, setUsername] = useState('')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')

  return (
    <AdminGuard>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black text-laqi-text">الإشعارات</h1>
          <p className="text-laqi-muted mt-1">أرسل إشعار لكل المستخدمين أو لمستخدم معين</p>
        </div>

        <div className="glass-card p-8 max-w-2xl space-y-5">
          {/* Target */}
          <div>
            <label className="block text-sm text-laqi-muted mb-2">المستهدف</label>
            <div className="flex bg-laqi-darker rounded-xl p-1">
              <button
                onClick={() => setTarget('all')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  target === 'all' ? 'bg-laqi-neon text-laqi-dark' : 'text-laqi-muted hover:text-laqi-text'
                }`}
              >
                👥 كل المستخدمين
              </button>
              <button
                onClick={() => setTarget('user')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  target === 'user' ? 'bg-laqi-neon text-laqi-dark' : 'text-laqi-muted hover:text-laqi-text'
                }`}
              >
                👤 مستخدم محدد
              </button>
            </div>
          </div>

          {/* Username (if specific user) */}
          {target === 'user' && (
            <div>
              <label className="block text-sm text-laqi-muted mb-1.5">اسم المستخدم</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="@username"
                className="input-dark"
                dir="ltr"
              />
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm text-laqi-muted mb-1.5">عنوان الإشعار</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: تحديث جديد!"
              className="input-dark"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm text-laqi-muted mb-1.5">نص الإشعار</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب نص الإشعار هنا..."
              className="input-dark min-h-28 resize-none"
              rows={4}
            />
          </div>

          <button className="btn-neon w-full py-3 text-base">
            📢 إرسال الإشعار
          </button>
        </div>
      </div>
    </AdminGuard>
  )
}

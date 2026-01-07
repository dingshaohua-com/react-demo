import { Link } from 'react-router'

const pages = [
  { path: '/teacher', name: 'Teacher', desc: '教师页面示例', icon: '👨‍🏫' },
  { path: '/snapdom', name: 'Snapdom', desc: 'DOM 快照工具', icon: '📸' },
  { path: '/html-to-img', name: 'HTML to Image', desc: 'HTML 转图片工具', icon: '🖼️' }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-4">
            React Demo
          </h1>
          <p className="text-slate-400 text-lg">探索各种 React 示例页面</p>
        </header>

        <nav className="grid gap-4">
          {pages.map((page) => (
            <Link
              key={page.path}
              to={page.path}
              className="group relative flex items-center gap-5 p-5 rounded-2xl
                         bg-white/5 backdrop-blur-sm border border-white/10
                         hover:bg-white/10 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/10
                         transition-all duration-300"
            >
              <span className="flex-shrink-0 w-14 h-14 flex items-center justify-center text-3xl 
                               bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-xl
                               group-hover:scale-110 transition-transform duration-300">
                {page.icon}
              </span>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-semibold text-white group-hover:text-violet-300 transition-colors">
                  {page.name}
                </h2>
                <p className="text-slate-400 text-sm mt-1">{page.desc}</p>
              </div>
              <svg
                className="w-5 h-5 text-slate-500 group-hover:text-violet-400 group-hover:translate-x-1 transition-all"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

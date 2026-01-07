import { snapdom } from "@zumer/snapdom";
import { useRef, type Ref } from "react";
import * as htmlToImage from 'html-to-image';
import { toast } from "sonner";
import BoardCanvas from "../components/board-canvas";

export default function ScreenshotLong() {
  const characters = [
    {
      name: '孙悟空',
      title: '齐天大圣',
      avatar: '🐵',
      weapon: '如意金箍棒',
      skills: ['七十二变', '筋斗云', '火眼金睛', '法天象地'],
      desc: '花果山水帘洞美猴王，大闹天宫，后保唐僧西天取经，一路斩妖除魔。',
      color: 'from-amber-500 to-orange-600',
    },
    {
      name: '唐僧',
      title: '金蝉子转世',
      avatar: '🧘',
      weapon: '九环锡杖',
      skills: ['紧箍咒', '慈悲心', '坚定信念', '普度众生'],
      desc: '唐朝高僧，奉唐太宗之命西天取经，虽无法力却有大智慧大毅力。',
      color: 'from-yellow-400 to-amber-500',
    },
    {
      name: '猪八戒',
      title: '天蓬元帅',
      avatar: '🐷',
      weapon: '九齿钉耙',
      skills: ['三十六变', '天罡数', '好吃懒做', '调戏嫦娥'],
      desc: '原为天蓬元帅，因调戏嫦娥被贬下凡，错投猪胎，后拜唐僧为师。',
      color: 'from-pink-500 to-rose-600',
    },
    {
      name: '沙悟净',
      title: '卷帘大将',
      avatar: '🧔',
      weapon: '降妖宝杖',
      skills: ['十八变', '流沙河', '任劳任怨', '忠心耿耿'],
      desc: '原为卷帘大将，因打碎琉璃盏被贬流沙河，后保唐僧西行取经。',
      color: 'from-blue-500 to-indigo-600',
    },
  ];

  const chapters = [
    { num: 1, title: '灵根育孕源流出', desc: '心性修持大道生' },
    { num: 2, title: '悟彻菩提真妙理', desc: '断魔归本合元神' },
    { num: 7, title: '八卦炉中逃大圣', desc: '五行山下定心猿' },
    { num: 13, title: '陷虎穴金星解厄', desc: '双叉岭伯钦留僧' },
    { num: 14, title: '心猿归正六贼无踪', desc: '五行山下收悟空' },
    { num: 27, title: '尸魔三戏唐三藏', desc: '圣僧恨逐美猴王' },
    { num: 59, title: '唐三藏路阻火焰山', desc: '孙行者一调芭蕉扇' },
    { num: 98, title: '猿熟马驯八卦木', desc: '功成行满见真如' },
  ];

  const locations = [
    { name: '花果山', icon: '🏔️', desc: '水帘洞所在，孙悟空出生之地' },
    { name: '天宫', icon: '🏛️', desc: '玉皇大帝居所，被悟空大闹' },
    { name: '五行山', icon: '⛰️', desc: '如来佛祖镇压悟空五百年' },
    { name: '火焰山', icon: '🔥', desc: '需借芭蕉扇方可通过' },
    { name: '流沙河', icon: '🌊', desc: '沙僧被贬之地' },
    { name: '女儿国', icon: '👸', desc: '全是女子的神秘国度' },
    { name: '盘丝洞', icon: '🕸️', desc: '蜘蛛精的老巢' },
    { name: '灵山', icon: '🏯', desc: '如来佛祖所在，取经终点' },
  ];

  const monsters = [
    { name: '白骨精', danger: 95, type: '尸魔' },
    { name: '红孩儿', danger: 88, type: '火系' },
    { name: '牛魔王', danger: 92, type: '妖王' },
    { name: '蜘蛛精', danger: 75, type: '毒系' },
    { name: '黄风怪', danger: 70, type: '风系' },
    { name: '金角大王', danger: 85, type: '宝物流' },
  ];

  const contentRef = useRef<HTMLElement>(null);
  const handleGenerate = async (type: string) => {
    let imgSrc = null;
    const isHtmlToImage = type === 'htmlToImage'
    if (isHtmlToImage) {
      toast.info('htmlToImage工具生成');
      imgSrc = await htmlToImage.toPng(contentRef.current!);
    } else {
      toast.info('snapdom工具生成');
      const img = await snapdom.toPng(contentRef.current!) as HTMLImageElement;
      imgSrc = img.src;
    }

    const link = document.createElement('a');
    link.download = type + '.png';
    link.href = imgSrc;
    link.click();
  }

  return (
    <>

      {contentRef.current &&
        <BoardCanvas
          // containerRef={scrollContainerRef}
          contentRef={contentRef}
          // containerMaxWidth={containerMaxWidth}
          // activeTool={loadingState.isContentLoading ? null : activeTool}
          // selectedStroke={selectedStroke}
          // selectedColor={selectedColor}
          // onStrokeComplete={handleStrokeComplete}
          // onDrawingStart={handleDrawingStart}
          // onStrokesChange={handleStrokesChange}
          // strokes={strokes}
          scale={1}
        // hideEraserIndicator={showSlideToClear}
        // 注意：由于缩放现在通过 fontSize 实现，而不是 transform scale，
        // 所以 BoardCanvas 的 scale 应该固定为 1
        />
      }


      <div className="bg-gradient-to-b from-amber-950 via-red-950 to-slate-900 px-4 py-6 sm:p-8" ref={contentRef as Ref<HTMLDivElement>}>
        {/* 顶部装饰 */}
        <div className="text-center mb-4">
          <span className="text-4xl">☁️</span>
          <span className="text-5xl mx-4">🌅</span>
          <span className="text-4xl">☁️</span>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-6 sm:mt-8 px-4 my-6">
          <button onClick={() => handleGenerate('htmlToImage')} className="btn-primary w-full sm:w-auto">
            ✨ html-to-image 生成
          </button>
          <button onClick={() => handleGenerate('snapdom')} className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
            🎯 snapdom 生成
          </button>
        </div>

        {/* 标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 mb-4 cursor-pointer">
            西 游 记
          </h1>
          <p className="text-xl sm:text-2xl text-amber-200 mb-2">Journey to the West</p>
          <p className="text-amber-100/60 max-w-2xl mx-auto">
            明代吴承恩所著 · 中国古典四大名著之一 · 神魔小说巅峰之作
          </p>
          <div className="flex justify-center gap-4 mt-6 text-3xl">
            <span>📜</span>
            <span>⚔️</span>
            <span>🐉</span>
            <span>☯️</span>
            <span>🙏</span>
          </div>
        </div>

        {/* 主要人物 */}
        <section className="max-w-6xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 text-center mb-8 flex items-center justify-center gap-3">
            <span>👥</span> 取经四人组 <span>👥</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {characters.map((char, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${char.color} rounded-2xl p-5 shadow-xl transform hover:scale-105 transition-all duration-300`}
              >
                <div className="text-center mb-4">
                  <div className="text-6xl mb-2">{char.avatar}</div>
                  <h3 className="text-2xl font-bold text-white">{char.name}</h3>
                  <p className="text-white/80 text-sm">{char.title}</p>
                </div>
                <div className="bg-black/20 rounded-xl p-3 mb-3">
                  <p className="text-white/90 text-sm leading-relaxed">{char.desc}</p>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🗡️</span>
                  <span className="text-white font-medium">{char.weapon}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {char.skills.map((skill, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white/20 rounded text-xs text-white">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 白龙马 */}
        <section className="max-w-4xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-slate-100 to-gray-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-xl">
            <div className="text-8xl">🐴</div>
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">白龙马</h3>
              <p className="text-gray-600 mb-3">
                原为西海龙王三太子敖烈，因纵火烧了殿上明珠，被贬为蛇身。后化作白马，驮负唐僧西行取经。
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                <span className="badge-primary">西海龙王之子</span>
                <span className="badge-success">八部天龙</span>
                <span className="badge-warning">任劳任怨</span>
              </div>
            </div>
          </div>
        </section>

        {/* 经典章回 */}
        <section className="max-w-6xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 text-center mb-8 flex items-center justify-center gap-3">
            <span>📖</span> 经典章回 <span>📖</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {chapters.map((chapter) => (
              <div
                key={chapter.num}
                className="bg-amber-900/40 backdrop-blur border border-amber-600/30 rounded-xl p-4 hover:border-amber-400/50 transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-10 h-10 rounded-full bg-amber-600 flex-center text-white font-bold">
                    {chapter.num}
                  </span>
                  <span className="text-amber-200 font-semibold">{chapter.title}</span>
                </div>
                <p className="text-amber-100/60 text-sm pl-13">{chapter.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 取经路线 */}
        <section className="max-w-6xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 text-center mb-8 flex items-center justify-center gap-3">
            <span>🗺️</span> 取经路线 <span>🗺️</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {locations.map((loc, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-red-900/50 to-amber-900/50 backdrop-blur rounded-xl p-4 border border-red-700/30 text-center hover:border-red-500/50 transition-all"
              >
                <div className="text-4xl mb-2">{loc.icon}</div>
                <h3 className="text-lg font-bold text-amber-300 mb-1">{loc.name}</h3>
                <p className="text-amber-100/60 text-xs">{loc.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center text-amber-200/60 text-sm">
            📍 长安 → 五行山 → 高老庄 → 流沙河 → ... → 灵山 | 共计 <span className="text-amber-400 font-bold">十万八千里</span>
          </div>
        </section>

        {/* 妖怪图鉴 */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 text-center mb-8 flex items-center justify-center gap-3">
            <span>👹</span> 妖怪图鉴 <span>👹</span>
          </h2>
          <div className="space-y-3">
            {monsters.map((monster, index) => (
              <div
                key={index}
                className="bg-black/30 backdrop-blur rounded-xl p-4 border border-red-900/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">👺</span>
                    <span className="text-amber-200 font-bold">{monster.name}</span>
                    <span className="px-2 py-0.5 bg-red-900/50 rounded text-xs text-red-300">
                      {monster.type}
                    </span>
                  </div>
                  <span className="text-amber-400 font-bold">{monster.danger}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 to-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${monster.danger}%` }}
                  />
                </div>
                <p className="text-right text-xs text-amber-100/40 mt-1">危险指数</p>
              </div>
            ))}
          </div>
        </section>

        {/* 经典语录 */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 text-center mb-8 flex items-center justify-center gap-3">
            <span>💬</span> 经典语录 <span>💬</span>
          </h2>
          <div className="space-y-4">
            {[
              { quote: '俺老孙来也！', author: '孙悟空', icon: '🐵' },
              { quote: '大师兄，师父被妖怪抓走了！', author: '猪八戒', icon: '🐷' },
              { quote: '悟空，休得无礼！', author: '唐僧', icon: '🧘' },
              { quote: '大师兄，二师兄，师父被妖怪抓走了！', author: '沙悟净', icon: '🧔' },
              { quote: '皇帝轮流做，明年到我家！', author: '孙悟空', icon: '🐵' },
              { quote: '你是猴子请来的救兵吗？', author: '红孩儿', icon: '👶' },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-amber-900/30 backdrop-blur rounded-xl p-5 border-l-4 border-amber-500"
              >
                <p className="text-xl text-amber-100 mb-3 italic">"{item.quote}"</p>
                <div className="flex items-center gap-2 text-amber-300">
                  <span className="text-2xl">{item.icon}</span>
                  <span>—— {item.author}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 数字统计 */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 text-center mb-8">📊 取经数据</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-amber-600/30 to-yellow-600/30 rounded-xl p-5 text-center border border-amber-500/30">
              <div className="text-3xl sm:text-4xl font-bold text-amber-300 mb-1">14</div>
              <div className="text-amber-100/60 text-sm">年取经路程</div>
            </div>
            <div className="bg-gradient-to-br from-red-600/30 to-orange-600/30 rounded-xl p-5 text-center border border-red-500/30">
              <div className="text-3xl sm:text-4xl font-bold text-red-300 mb-1">81</div>
              <div className="text-red-100/60 text-sm">九九八十一难</div>
            </div>
            <div className="bg-gradient-to-br from-green-600/30 to-emerald-600/30 rounded-xl p-5 text-center border border-green-500/30">
              <div className="text-3xl sm:text-4xl font-bold text-green-300 mb-1">100</div>
              <div className="text-green-100/60 text-sm">回章节</div>
            </div>
            <div className="bg-gradient-to-br from-blue-600/30 to-cyan-600/30 rounded-xl p-5 text-center border border-blue-500/30">
              <div className="text-3xl sm:text-4xl font-bold text-blue-300 mb-1">108000</div>
              <div className="text-blue-100/60 text-sm">里路程</div>
            </div>
          </div>
        </section>

        {/* 底部 */}
        <footer className="text-center py-8 border-t border-amber-800/30">
          <div className="text-4xl mb-4">🙏</div>
          <p className="text-amber-200/60 mb-2">
            "敢问路在何方？路在脚下。"
          </p>
          <p className="text-amber-100/40 text-sm">
            —— 《西游记》主题曲《敢问路在何方》
          </p>
          <div className="mt-6 flex justify-center gap-3 text-2xl">
            <span>☁️</span>
            <span>🐵</span>
            <span>🐷</span>
            <span>🧔</span>
            <span>🧘</span>
            <span>🐴</span>
            <span>☁️</span>
          </div>
        </footer>
      </div>
    </>

  );
}

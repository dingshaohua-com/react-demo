import { snapdom } from "@zumer/snapdom";
import { useRef, type Ref } from "react";
import * as htmlToImage from 'html-to-image';
import { toast } from "sonner";

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
    { num: 18, title: '观音院唐僧脱难', desc: '高老庄大圣除魔' },
    { num: 22, title: '八戒大战流沙河', desc: '木叉奉法收悟净' },
    { num: 27, title: '尸魔三戏唐三藏', desc: '圣僧恨逐美猴王' },
    { num: 40, title: '婴儿戏化禅心乱', desc: '猿马刀归木母空' },
    { num: 59, title: '唐三藏路阻火焰山', desc: '孙行者一调芭蕉扇' },
    { num: 61, title: '猪八戒助力败魔王', desc: '孙行者三调芭蕉扇' },
    { num: 77, title: '群魔欺本性', desc: '一体拜真如' },
    { num: 86, title: '木母助威征怪物', desc: '金公施法灭妖邪' },
    { num: 98, title: '猿熟马驯八卦木', desc: '功成行满见真如' },
    { num: 99, title: '九九数完魔灭尽', desc: '三三行满道归根' },
    { num: 100, title: '径回东土', desc: '五圣成真' },
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
    { name: '白骨精', danger: 95, type: '尸魔', desc: '三次变化迷惑唐僧' },
    { name: '红孩儿', danger: 88, type: '火系', desc: '三昧真火厉害非常' },
    { name: '牛魔王', danger: 92, type: '妖王', desc: '七十二变力大无穷' },
    { name: '蜘蛛精', danger: 75, type: '毒系', desc: '盘丝洞七个蜘蛛精' },
    { name: '黄风怪', danger: 70, type: '风系', desc: '三昧神风吹瞎悟空' },
    { name: '金角大王', danger: 85, type: '宝物流', desc: '太上老君座下童子' },
    { name: '银角大王', danger: 85, type: '宝物流', desc: '紫金葫芦收人厉害' },
    { name: '黄袍怪', danger: 78, type: '星宿', desc: '奎木狼下界为妖' },
    { name: '九头虫', danger: 82, type: '水怪', desc: '偷盗祭赛国舍利子' },
    { name: '六耳猕猴', danger: 98, type: '灵猴', desc: '与悟空不分伯仲' },
    { name: '金翅大鹏', danger: 90, type: '禽类', desc: '如来佛祖舅舅' },
    { name: '铁扇公主', danger: 80, type: '妖王', desc: '芭蕉扇主人' },
  ];

  const treasures = [
    { name: '如意金箍棒', owner: '孙悟空', icon: '🔴', power: '重达一万三千五百斤', desc: '东海龙宫镇海之宝' },
    { name: '九齿钉耙', owner: '猪八戒', icon: '🔱', power: '重五千零四十八斤', desc: '太上老君亲自锤炼' },
    { name: '紫金葫芦', owner: '金角银角', icon: '🏺', power: '叫人装人', desc: '太上老君炼丹葫芦' },
    { name: '芭蕉扇', owner: '铁扇公主', icon: '🪭', power: '一扇灭火，二扇生风，三扇下雨', desc: '天地灵宝' },
    { name: '紧箍咒', owner: '唐僧', icon: '👑', power: '束缚孙悟空', desc: '观音菩萨所赐' },
    { name: '金刚圈', owner: '太上老君', icon: '💍', power: '收取各种兵器', desc: '老君随身法宝' },
  ];

  const immortals = [
    { name: '如来佛祖', title: '西方教主', icon: '🧘‍♂️', power: '佛法无边' },
    { name: '观音菩萨', title: '南海观世音', icon: '🌊', power: '大慈大悲' },
    { name: '太上老君', title: '三清之一', icon: '⚗️', power: '炼丹制药' },
    { name: '玉皇大帝', title: '天庭之主', icon: '👑', power: '统御三界' },
    { name: '二郎神', title: '灌江口真君', icon: '👁️', power: '三只眼' },
    { name: '哪吒', title: '三坛海会大神', icon: '🔥', power: '三头六臂' },
    { name: '托塔李天王', title: '天庭大将', icon: '🗼', power: '玲珑宝塔' },
    { name: '菩提祖师', title: '三星洞主人', icon: '🌟', power: '传授悟空本领' },
  ];

  const countries = [
    { name: '乌鸡国', story: '国王被妖怪害死，妖怪变作国王三年', danger: 75 },
    { name: '车迟国', story: '三位国师虎力大仙、鹿力大仙、羊力大仙', danger: 80 },
    { name: '女儿国', story: '国中无男子，喝子母河水可怀孕', danger: 65 },
    { name: '比丘国', story: '国王被妖怪迷惑，要用小儿心肝做药引', danger: 85 },
    { name: '狮驼国', story: '被三个妖怪占据，青狮、白象、大鹏', danger: 95 },
    { name: '祭赛国', story: '金光寺舍利子被九头虫偷走', danger: 70 },
    { name: '灭法国', story: '国王发愿要杀一万僧人', danger: 88 },
    { name: '天竺国', story: '真公主被妖怪变作月宫玉兔掉包', danger: 78 },
  ];

  const skills = [
    { name: '七十二变', user: '孙悟空', type: '变化', level: '⭐⭐⭐⭐⭐', desc: '可变化万物，唯独尾巴难变' },
    { name: '筋斗云', user: '孙悟空', type: '飞行', level: '⭐⭐⭐⭐⭐', desc: '一个筋斗十万八千里' },
    { name: '火眼金睛', user: '孙悟空', type: '神通', level: '⭐⭐⭐⭐⭐', desc: '能识破妖魔鬼怪真身' },
    { name: '三十六变', user: '猪八戒', type: '变化', level: '⭐⭐⭐⭐', desc: '变化之术，略逊悟空' },
    { name: '天罡三十六变', user: '二郎神', type: '变化', level: '⭐⭐⭐⭐⭐', desc: '与悟空不相上下' },
    { name: '三昧真火', user: '红孩儿', type: '火系', level: '⭐⭐⭐⭐⭐', desc: '连观音都难以扑灭' },
    { name: '定身术', user: '众仙', type: '控制', level: '⭐⭐⭐⭐', desc: '定住对方身形' },
    { name: '分身术', user: '孙悟空', type: '分身', level: '⭐⭐⭐⭐⭐', desc: '拔毫毛变化无数分身' },
  ];

  const difficulties = [
    { num: 1, name: '金蝉遭贬', place: '灵山', result: '转世投胎' },
    { num: 7, name: '被陷虎穴', place: '双叉岭', result: '金星解救' },
    { num: 14, name: '收降悟空', place: '五行山', result: '收为徒弟' },
    { num: 21, name: '高老庄娶亲', place: '高老庄', result: '收八戒为徒' },
    { num: 27, name: '三打白骨精', place: '白虎岭', result: '悟空被逐' },
    { num: 33, name: '宝象国救驾', place: '宝象国', result: '悟空归队' },
    { num: 41, name: '三调芭蕉扇', place: '火焰山', result: '过火焰山' },
    { num: 54, name: '女儿国遇难', place: '女儿国', result: '脱离情网' },
    { num: 61, name: '真假美猴王', place: '花果山', result: '六耳猕猴被打死' },
    { num: 67, name: '七个蜘蛛精', place: '盘丝洞', result: '降伏蜘蛛精' },
    { num: 74, name: '狮驼岭三魔', place: '狮驼国', result: '如来收妖' },
    { num: 81, name: '通天河遇阻', place: '通天河', result: '老鼋驮过河' },
  ];

  const quotes = [
    { quote: '俺老孙来也！', author: '孙悟空', icon: '🐵', context: '经典出场台词' },
    { quote: '大师兄，师父被妖怪抓走了！', author: '猪八戒', icon: '🐷', context: '经典求助台词' },
    { quote: '悟空，休得无礼！', author: '唐僧', icon: '🧘', context: '阻止悟空打妖怪' },
    { quote: '大师兄，二师兄，师父被妖怪抓走了！', author: '沙悟净', icon: '🧔', context: '标志性台词' },
    { quote: '皇帝轮流做，明年到我家！', author: '孙悟空', icon: '🐵', context: '大闹天宫时所说' },
    { quote: '你是猴子请来的救兵吗？', author: '红孩儿', icon: '👶', context: '嘲笑猪八戒' },
    { quote: '贫僧从东土大唐而来，去往西天拜佛求经', author: '唐僧', icon: '🧘', context: '标准自我介绍' },
    { quote: '呔！吃俺老孙一棒！', author: '孙悟空', icon: '🐵', context: '战斗开场白' },
    { quote: '师父，那猴子又欺负我！', author: '猪八戒', icon: '🐷', context: '告状专用' },
    { quote: '大哥说得有理', author: '沙悟净', icon: '🧔', context: '标准附和' },
  ];

  const contentRef = useRef<HTMLElement>(null);
  const handleGenerate = async (type: string) => {
    console.time('方法耗时');
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
    console.timeEnd('方法耗时');

    const link = document.createElement('a');
    link.download = type+'.png';
    link.href = imgSrc;
    link.click();
  }

  return (
    <div className="bg-linear-to-b from-amber-950 via-red-950 to-slate-900 px-4 py-6 sm:p-8" ref={contentRef as Ref<HTMLDivElement>}>
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
        <h1 className="text-4xl sm:text-6xl font-bold text-transparent bg-clip-text bg-linear-to-br from-yellow-400 via-red-500 to-yellow-400 mb-4 cursor-pointer">
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
              className={`bg-linear-to-br ${char.color} rounded-2xl p-5 shadow-xl transform hover:scale-105 transition-all duration-300`}
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
        <div className="bg-linear-to-br from-slate-100 to-gray-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-xl">
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
              className="bg-linear-to-br from-red-900/50 to-amber-900/50 backdrop-blur rounded-xl p-4 border border-red-700/30 text-center hover:border-red-500/50 transition-all"
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
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-200 font-bold">{monster.name}</span>
                      <span className="px-2 py-0.5 bg-red-900/50 rounded text-xs text-red-300">
                        {monster.type}
                      </span>
                    </div>
                    <p className="text-amber-100/60 text-sm mt-1">{monster.desc}</p>
                  </div>
                </div>
                <span className="text-amber-400 font-bold">{monster.danger}%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-br from-red-600 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${monster.danger}%` }}
                />
              </div>
              <p className="text-right text-xs text-amber-100/40 mt-1">危险指数</p>
            </div>
          ))}
        </div>
      </section>

      {/* 神兵法宝 */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 text-center mb-8 flex items-center justify-center gap-3">
          <span>⚔️</span> 神兵法宝 <span>⚔️</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {treasures.map((treasure, index) => (
            <div
              key={index}
              className="bg-linear-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur rounded-2xl p-5 border border-purple-500/30 hover:border-purple-400/50 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{treasure.icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-purple-200">{treasure.name}</h3>
                  <p className="text-purple-300/60 text-sm">{treasure.owner}</p>
                </div>
              </div>
              <div className="bg-black/20 rounded-lg p-3 mb-2">
                <p className="text-purple-100 text-sm mb-1">⚡ {treasure.power}</p>
                <p className="text-purple-200/60 text-xs">{treasure.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 神仙大全 */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 text-center mb-8 flex items-center justify-center gap-3">
          <span>✨</span> 神仙大全 <span>✨</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {immortals.map((immortal, index) => (
            <div
              key={index}
              className="bg-linear-to-br from-cyan-900/40 to-blue-900/40 backdrop-blur rounded-xl p-4 border border-cyan-600/30 hover:border-cyan-400/50 transition-all text-center"
            >
              <div className="text-5xl mb-2">{immortal.icon}</div>
              <h3 className="text-lg font-bold text-cyan-200 mb-1">{immortal.name}</h3>
              <p className="text-cyan-300/60 text-xs mb-2">{immortal.title}</p>
              <div className="bg-black/20 rounded px-2 py-1">
                <p className="text-cyan-100 text-xs">{immortal.power}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 取经国度 */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 text-center mb-8 flex items-center justify-center gap-3">
          <span>🏰</span> 取经国度 <span>🏰</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {countries.map((country, index) => (
            <div
              key={index}
              className="bg-linear-to-br from-orange-900/40 to-red-900/40 backdrop-blur rounded-xl p-5 border border-orange-600/30"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-orange-200">{country.name}</h3>
                <span className="px-3 py-1 bg-red-600/50 rounded-full text-sm text-white">
                  危险度 {country.danger}
                </span>
              </div>
              <p className="text-orange-100/80 text-sm leading-relaxed">{country.story}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 神通技能 */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 text-center mb-8 flex items-center justify-center gap-3">
          <span>⚡</span> 神通技能 <span>⚡</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="bg-linear-to-br from-emerald-900/40 to-teal-900/40 backdrop-blur rounded-xl p-5 border border-emerald-600/30"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-lg font-bold text-emerald-200">{skill.name}</h3>
                  <p className="text-emerald-300/60 text-sm">{skill.user}</p>
                </div>
                <span className="px-2 py-1 bg-emerald-700/50 rounded text-xs text-emerald-200">
                  {skill.type}
                </span>
              </div>
              <div className="mb-2">
                <span className="text-yellow-400">{skill.level}</span>
              </div>
              <p className="text-emerald-100/70 text-sm">{skill.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 九九八十一难（部分） */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 text-center mb-8 flex items-center justify-center gap-3">
          <span>🎯</span> 九九八十一难（精选） <span>🎯</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {difficulties.map((diff, index) => (
            <div
              key={index}
              className="bg-linear-to-br from-slate-800/50 to-gray-800/50 backdrop-blur rounded-xl p-4 border border-slate-600/30"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-sm">
                  {diff.num}
                </span>
                <h3 className="text-lg font-bold text-slate-200">{diff.name}</h3>
              </div>
              <div className="space-y-1 text-sm">
                <p className="text-slate-300">
                  <span className="text-slate-400">地点：</span>{diff.place}
                </p>
                <p className="text-slate-300">
                  <span className="text-slate-400">结果：</span>{diff.result}
                </p>
              </div>
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
          {quotes.map((item, index) => (
            <div
              key={index}
              className="bg-amber-900/30 backdrop-blur rounded-xl p-5 border-l-4 border-amber-500"
            >
              <p className="text-xl text-amber-100 mb-3 italic">"{item.quote}"</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-300">
                  <span className="text-2xl">{item.icon}</span>
                  <span>—— {item.author}</span>
                </div>
                <span className="text-amber-400/60 text-xs">{item.context}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 作品影响 */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 text-center mb-8 flex items-center justify-center gap-3">
          <span>🌟</span> 作品影响 <span>🌟</span>
        </h2>
        <div className="space-y-6">
          <div className="bg-linear-to-br from-purple-900/30 to-pink-900/30 backdrop-blur rounded-2xl p-6 border border-purple-600/30">
            <h3 className="text-xl font-bold text-purple-200 mb-3 flex items-center gap-2">
              <span>📚</span> 文学地位
            </h3>
            <p className="text-purple-100/80 leading-relaxed">
              《西游记》是中国古典四大名著之一，是中国古代第一部浪漫主义章回体长篇神魔小说。全书主要描写了孙悟空出世及大闹天宫后，遇见了唐僧、猪八戒、沙僧和白龙马，西行取经，一路降妖伏魔，经历了九九八十一难，终于到达西天见到如来佛祖，最终五圣成真的故事。
            </p>
          </div>

          <div className="bg-linear-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur rounded-2xl p-6 border border-blue-600/30">
            <h3 className="text-xl font-bold text-blue-200 mb-3 flex items-center gap-2">
              <span>🎬</span> 影视改编
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-black/20 rounded-lg p-3">
                <p className="text-blue-200 font-bold mb-1">1986年央视版电视剧</p>
                <p className="text-blue-100/60 text-sm">六小龄童主演，经典中的经典</p>
              </div>
              <div className="bg-black/20 rounded-lg p-3">
                <p className="text-blue-200 font-bold mb-1">周星驰大话西游系列</p>
                <p className="text-blue-100/60 text-sm">无厘头喜剧的巅峰之作</p>
              </div>
              <div className="bg-black/20 rounded-lg p-3">
                <p className="text-blue-200 font-bold mb-1">西游记动画片</p>
                <p className="text-blue-100/60 text-sm">陪伴无数人的童年记忆</p>
              </div>
              <div className="bg-black/20 rounded-lg p-3">
                <p className="text-blue-200 font-bold mb-1">各种电影改编</p>
                <p className="text-blue-100/60 text-sm">孙悟空题材长盛不衰</p>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-green-900/30 to-emerald-900/30 backdrop-blur rounded-2xl p-6 border border-green-600/30">
            <h3 className="text-xl font-bold text-green-200 mb-3 flex items-center gap-2">
              <span>🌏</span> 国际影响
            </h3>
            <p className="text-green-100/80 leading-relaxed mb-3">
              《西游记》被翻译成多种语言在世界各地传播，对亚洲各国的文学、戏剧、美术等都产生了深远影响。日本动漫《龙珠》就是受到《西游记》的启发创作的。
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-green-700/50 rounded-full text-sm text-green-200">英文版</span>
              <span className="px-3 py-1 bg-green-700/50 rounded-full text-sm text-green-200">日文版</span>
              <span className="px-3 py-1 bg-green-700/50 rounded-full text-sm text-green-200">韩文版</span>
              <span className="px-3 py-1 bg-green-700/50 rounded-full text-sm text-green-200">法文版</span>
              <span className="px-3 py-1 bg-green-700/50 rounded-full text-sm text-green-200">德文版</span>
              <span className="px-3 py-1 bg-green-700/50 rounded-full text-sm text-green-200">俄文版</span>
            </div>
          </div>

          <div className="bg-linear-to-br from-amber-900/30 to-orange-900/30 backdrop-blur rounded-2xl p-6 border border-amber-600/30">
            <h3 className="text-xl font-bold text-amber-200 mb-3 flex items-center gap-2">
              <span>🎮</span> 游戏改编
            </h3>
            <p className="text-amber-100/80 leading-relaxed">
              《西游记》题材被改编成无数游戏作品，包括《梦幻西游》、《大话西游》等经典网游，以及《黑神话：悟空》等3A单机游戏，深受玩家喜爱。
            </p>
          </div>
        </div>
      </section>

      {/* 数字统计 */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 text-center mb-8">📊 取经数据</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-linear-to-br from-amber-600/30 to-yellow-600/30 rounded-xl p-5 text-center border border-amber-500/30">
            <div className="text-3xl sm:text-4xl font-bold text-amber-300 mb-1">14</div>
            <div className="text-amber-100/60 text-sm">年取经路程</div>
          </div>
          <div className="bg-linear-to-br from-red-600/30 to-orange-600/30 rounded-xl p-5 text-center border border-red-500/30">
            <div className="text-3xl sm:text-4xl font-bold text-red-300 mb-1">81</div>
            <div className="text-red-100/60 text-sm">九九八十一难</div>
          </div>
          <div className="bg-linear-to-br from-green-600/30 to-emerald-600/30 rounded-xl p-5 text-center border border-green-500/30">
            <div className="text-3xl sm:text-4xl font-bold text-green-300 mb-1">100</div>
            <div className="text-green-100/60 text-sm">回章节</div>
          </div>
          <div className="bg-linear-to-br from-blue-600/30 to-cyan-600/30 rounded-xl p-5 text-center border border-blue-500/30">
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
  );
}

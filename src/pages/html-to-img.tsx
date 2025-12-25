import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';

export default function HtmlToImg() {
  const ref = useRef<HTMLDivElement>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerateImage = async () => {
    if (!ref.current) return;
    const dataUrl = await toPng(ref.current, { cacheBust: true, pixelRatio: 2 });
    setGeneratedImage(dataUrl);
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.download = 'share-card.png';
    link.href = generatedImage;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <h1 className="text-3xl font-bold text-white text-center mb-8">
        🎨 HTML to Image 生成器
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 justify-center items-start">
        {/* 左侧：HTML 内容卡片 */}
        <div className="flex flex-col items-center">
          <p className="text-gray-300 mb-3 text-sm">📝 原始 HTML 内容</p>
          <div
            ref={ref}
            className="w-[400px] p-6 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl"
          >
            {/* 卡片头部 */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex-center text-3xl">
                🚀
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">React 开发者</h2>
                <p className="text-white/70 text-sm">@react_developer</p>
              </div>
            </div>

            {/* 卡片内容 */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-6">
              <p className="text-white text-lg leading-relaxed">
                "代码改变世界，创意点亮未来。每一行代码都是通往梦想的阶梯。"
              </p>
            </div>

            {/* 统计数据 */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">128</div>
                <div className="text-white/60 text-xs">项目</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">2.4k</div>
                <div className="text-white/60 text-xs">关注者</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">99%</div>
                <div className="text-white/60 text-xs">好评率</div>
              </div>
            </div>

            {/* 标签 */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-white/20 rounded-full text-white text-xs">
                #React
              </span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-white text-xs">
                #TypeScript
              </span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-white text-xs">
                #TailwindCSS
              </span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-white text-xs">
                #Vite
              </span>
            </div>

            {/* 底部 */}
            <div className="flex items-center justify-between pt-4 border-t border-white/20">
              <span className="text-white/50 text-xs">2025.12.26</span>
              <span className="text-white/50 text-xs">Made with ❤️</span>
            </div>
          </div>
        </div>

        {/* 右侧：生成的图片预览 */}
        <div className="flex flex-col items-center">
          <p className="text-gray-300 mb-3 text-sm">🖼️ 生成的图片预览</p>
          <div className="w-[400px] min-h-[300px] rounded-2xl bg-white/5 backdrop-blur border-2 border-dashed border-white/20 flex-center">
            {generatedImage ? (
              <img
                src={generatedImage}
                alt="Generated"
                className="rounded-xl max-w-full"
              />
            ) : (
              <p className="text-white/40 text-center">
                点击下方按钮生成图片
                <br />
                <span className="text-xs">👇</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-center gap-4 mt-8">
        <button onClick={handleGenerateImage} className="btn-primary btn-lg">
          ✨ 生成图片
        </button>
        {generatedImage && (
          <button onClick={handleDownload} className="btn-success btn-lg">
            📥 下载图片
          </button>
        )}
      </div>
    </div>
  );
}

import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { snapdom } from '@zumer/snapdom';

export default function Screenshot() {
  const ref = useRef<HTMLDivElement>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatingMethod, setGeneratingMethod] = useState<'html-to-image' | 'snapdom' | null>(null);

  // 使用 html-to-image 生成
  const handleGenerateWithHtmlToImage = async () => {
    if (!ref.current) return;
    setGeneratingMethod('html-to-image');
    const dataUrl = await toPng(ref.current, { cacheBust: true, pixelRatio: 2 });
    setGeneratedImage(dataUrl);
  };

  // 使用 snapdom 生成
  const handleGenerateWithSnapdom = async () => {
    if (!ref.current) return;
    setGeneratingMethod('snapdom');
    const result = await snapdom.toPng(ref.current) as HTMLImageElement;
    setGeneratedImage(result.src);
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.download = 'share-card.png';
    link.href = generatedImage;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-6 sm:p-8">
      {/* 标题 */}
      <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-6 sm:mb-8">
        🎨 HTML to Image
      </h1>

      {/* 主内容区域 */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 justify-center items-center lg:items-start max-w-6xl mx-auto">
        {/* 左侧：HTML 内容卡片 */}
        <div className="flex flex-col items-center w-full max-w-[400px]">
          <p className="text-gray-300 mb-3 text-sm">📝 原始 HTML 内容</p>
          <div
            ref={ref}
            className="w-full p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl"
          >
            {/* 卡片头部 */}
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur flex-center text-2xl sm:text-3xl shrink-0">
                🚀
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-white truncate">React 开发者</h2>
                <p className="text-white/70 text-xs sm:text-sm">@react_developer</p>
              </div>
            </div>

            {/* 卡片内容 */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
              <p className="text-white text-base sm:text-lg leading-relaxed">
                "代码改变世界，创意点亮未来。每一行代码都是通往梦想的阶梯。"
              </p>
            </div>

            {/* 统计数据 */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-white">128</div>
                <div className="text-white/60 text-[10px] sm:text-xs">项目</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-white">2.4k</div>
                <div className="text-white/60 text-[10px] sm:text-xs">关注者</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-white">99%</div>
                <div className="text-white/60 text-[10px] sm:text-xs">好评率</div>
              </div>
            </div>

            {/* 标签 */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white/20 rounded-full text-white text-[10px] sm:text-xs">
                #React
              </span>
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white/20 rounded-full text-white text-[10px] sm:text-xs">
                #TypeScript
              </span>
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white/20 rounded-full text-white text-[10px] sm:text-xs">
                #TailwindCSS
              </span>
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white/20 rounded-full text-white text-[10px] sm:text-xs">
                #Vite
              </span>
            </div>

            {/* 底部 */}
            <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/20">
              <span className="text-white/50 text-[10px] sm:text-xs">2025.12.26</span>
              <span className="text-white/50 text-[10px] sm:text-xs">Made with ❤️</span>
            </div>
          </div>
        </div>

        {/* 右侧：生成的图片预览 */}
        <div className="flex flex-col items-center w-full max-w-[400px]">
          <p className="text-gray-300 mb-3 text-sm">🖼️ 生成的图片预览</p>
          <div className="w-full min-h-[200px] sm:min-h-[300px] rounded-2xl bg-white/5 backdrop-blur border-2 border-dashed border-white/20 flex-center p-4">
            {generatedImage ? (
              <img
                src={generatedImage}
                alt="Generated"
                className="rounded-xl max-w-full h-auto"
              />
            ) : (
              <p className="text-white/40 text-center text-sm sm:text-base">
                点击下方按钮生成图片
                <br />
                <span className="text-xs">👇</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-6 sm:mt-8 px-4">
        <button onClick={handleGenerateWithHtmlToImage} className="btn-primary w-full sm:w-auto">
          ✨ html-to-image 生成
        </button>
        <button onClick={handleGenerateWithSnapdom} className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
          🎯 snapdom 生成
        </button>
        {generatedImage && (
          <button onClick={handleDownload} className="btn-success w-full sm:w-auto">
            📥 下载图片
          </button>
        )}
      </div>

      {/* 显示当前使用的方法 */}
      {generatingMethod && (
        <p className="text-center text-white/60 text-sm mt-4">
          当前使用: <span className="text-white font-medium">{generatingMethod}</span>
        </p>
      )}
    </div>
  );
}

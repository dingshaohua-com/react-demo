/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from 'sonner';
import * as Comlink from 'comlink';
import { snapdom } from '@zumer/snapdom';
import cloneNode from '../utils/clone-node';
import * as htmlToImage from 'html-to-image';
import ScreenshotLong from './screenshot-long';
import { useRef, useState, type Ref } from 'react';

export default function TwoContentScreenshot() {
  const [rmContent, setRmContent] = useState(false);
  const contentRef = useRef<HTMLElement>(null);
  const handleGenerate = async (type: string) => {
    console.time('方法耗时');
    const htmlNode = cloneNode({ originalContent: contentRef.current, mountBody: true, onCloned: () => {} });
    let imgSrc = null;
    const isHtmlToImage = type === 'htmlToImage';
    if (isHtmlToImage) {
      toast.info('htmlToImage工具生成');
      imgSrc = await htmlToImage.toPng(htmlNode);
    } else {
      toast.info('snapdom工具生成');
      const img = (await snapdom.toPng(htmlNode)) as HTMLImageElement;
      imgSrc = img.src;
    }
    console.timeEnd('方法耗时');

    const link = document.createElement('a');
    link.download = type + '.png';
    link.href = imgSrc;
    link.click();
  };


  return (
    <div className="h-full flex flex-col min-h-0 z-0">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-6 sm:mt-8 px-4 my-6 shrink-0">
        <button onClick={() => handleGenerate('htmlToImage')} className="btn-primary w-full sm:w-auto">
          ✨ html-to-image 生成
        </button>
        <button onClick={() => handleGenerate('snapdom')} className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
          🎯 snapdom 生成
        </button>

        <button onClick={() => setRmContent(true)} className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
          ❌ 删除需截图节点
        </button>
      </div>
      {!rmContent && (
        <div className="flex gap-2 flex-1 min-h-0" ref={contentRef as Ref<HTMLDivElement>}>
          <div className="flex-1 overflow-y-auto">
            <ScreenshotLong />
          </div>
          <div className="flex-1 overflow-y-auto">
            <ScreenshotLong />
          </div>
        </div>
      )}
    </div>
  );
}

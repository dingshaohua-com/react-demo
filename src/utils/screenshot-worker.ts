import * as Comlink from 'comlink';
import { snapdom } from '@zumer/snapdom';
import * as htmlToImage from 'html-to-image';

const api = {
  async captureScreenshot(type, htmlStr) {
    // 1. 在 Worker 中重新创建 DOM
    const container = document.createElement('div');
    container.innerHTML = htmlStr;
    const element = container.firstElementChild as HTMLElement;

    const isHtmlToImage = type === 'htmlToImage';
    let imgSrc;
    if (isHtmlToImage) {
      imgSrc = await htmlToImage.toPng(element);
    } else {
      const img = await snapdom.toPng(element);
      imgSrc = img.src;
    }
    return imgSrc;
  },
};

Comlink.expose(api);




  // const handleGenerate = async (type: string) => {
  //   console.time('方法耗时');
  //   const htmlNode = cloneNode({ originalContent: contentRef.current, mountBody: true, onCloned: () => {} });
  //   let imgSrc = null;
  //   const isHtmlToImage = type === 'htmlToImage';
  //   if (isHtmlToImage) {
  //     toast.info('htmlToImage工具生成');
  //   } else {
  //     toast.info('snapdom工具生成');
  //   }

  //   // 1. 创建 Worker
  //   const worker = new ScreenshotWorker();

  //   // 2. 用 Comlink 包装（现在调用像普通函数一样！）
  //   const api = Comlink.wrap(worker) as any;
  //   // 3. 直接调用 Worker 中的函数
  //   imgSrc = await api.captureScreenshot(type, htmlNode.outerHTML);
  //     // 4. 清理
  //   worker.terminate();
  //   console.log('拿到图片',imgSrc);
    

  //   console.timeEnd('方法耗时');
  //   const link = document.createElement('a');
  //   link.download = type + '.png';
  //   link.href = imgSrc;
  //   link.click();
  // };
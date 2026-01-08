/**
 * 下载助手函数
 * @param blob - 要下载的 Blob 数据
 * @param filename - 下载文件的名称（可选，默认为 'download'）
 * @param extension - 文件扩展名（可选，会自动添加点号）
 * @returns Promise<void>
 */
export default  (
  blob: Blob,
  filename?: string,
  extension?: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // 验证输入
      if (!(blob instanceof Blob)) {
        throw new TypeError('第一个参数必须是 Blob 类型');
      }

      // 生成文件名
      let finalFilename = filename || 'download';
      
      // 添加扩展名（如果需要）
      if (extension) {
        const ext = extension.startsWith('.') ? extension : `.${extension}`;
        // 检查是否已包含该扩展名
        if (!finalFilename.endsWith(ext)) {
          finalFilename += ext;
        }
      }

      // 创建临时 URL
      const url = window.URL.createObjectURL(blob);

      // 创建隐藏的下载链接
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', finalFilename);
      
      // 设置链接样式确保不可见
      link.style.display = 'none';
      
      // 添加到 DOM 并触发点击
      document.body.appendChild(link);
      link.click();
      
      // 清理 DOM
      document.body.removeChild(link);
      
      // 释放 URL 对象
      window.URL.revokeObjectURL(url);
      
      resolve();
    } catch (error) {
      console.error('下载失败:', error);
      reject(error);
    }
  });
};
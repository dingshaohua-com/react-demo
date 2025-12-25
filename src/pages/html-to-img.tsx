export default function HtmlToImg() {
  const handleGenerateImage = () => {
    console.log('生成图片');
  };
  return (
    <div className="html-to-img">
      <div className="html-to-img-content">你好</div>
      <div>
        <button onClick={handleGenerateImage} className="btn-primary">生成图片</button>
      </div>
    </div>
  );
}

type cloneNodeProps = {
  originalContent?: HTMLElement;
  originalId?: string;
  mountBody?: boolean;
  onCloned?: () => void;
};

const defaultProps = { mountBody: false };
export default function cloneNode(props: cloneNodeProps = defaultProps) {
  // 1. 创建新的容器节点
  //   const newContainer = document.createElement('div');
  //   newContainer.className = 'new-container';
  //   newContainer.id = 'cloned-container';

  // 2. 获取要克隆的原始节点
  const originalContent = props.originalId ? document.querySelector(props.originalId) : props.originalContent;

  // 3. 深克隆原始内容
  const clonedContent = originalContent.cloneNode(true);
  props.onCloned();

  // 创建隐藏容器（不占空间、不可见、不影响布局）
  const hiddenContainerClasses = [
    'fixed', // 固定定位
    'pointer-events-none', // 禁用交互
    'z-[-1000]', // 最低层级
  ];
  // 逐个添加类名
  hiddenContainerClasses.forEach((className) => {
    (clonedContent as HTMLElement).classList.add(className);
  });
  (clonedContent as HTMLElement).classList.remove('min-h-0');

  // 4. 将克隆的内容添加到新容器
  //   newContainer.appendChild(clonedContent);

  // 5. 添加到DOM
  if (props.mountBody) {
    document.body.appendChild(clonedContent);
  }

  return clonedContent as HTMLElement;
}

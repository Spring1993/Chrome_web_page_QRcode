# 网页二维码 Chrome 扩展

一个精美的Chrome浏览器扩展,可以为任何网页生成带有网站favicon的二维码,方便用户通过手机快速访问当前页面。

## 功能特点

### 核心功能
1. **智能二维码生成**: 自动为当前网页生成二维码
2. **Favicon集成**: 二维码中心显示网站的favicon图标
3. **网站信息展示**: 显示网站名称和完整URL
4. **一键操作**: 点击扩展图标即可生成二维码

### 设计特色
- 🎨 **苹果风格设计**: 采用Apple设计语言,简洁优雅
- 📱 **响应式布局**: 适配不同屏幕尺寸
- 🌓 **支持深色模式**: 自动适应系统主题(未来版本)
- ⚡ **流畅动画**: 精心设计的过渡效果

## 技术架构

### 使用的技术栈
- **Manifest V3**: 使用最新的Chrome扩展标准
- **QRCode.js**: 高质量二维码生成库
- **纯JavaScript**: 无需额外框架,轻量高效
- **CSS3**: 现代化的样式和动画

### 文件结构
```
Chrome_web_page_QRcode/
├── manifest.json          # 扩展配置文件 (Manifest V3)
├── popup.html            # 弹出窗口界面
├── popup.js              # 二维码生成逻辑
├── popup.css             # 苹果风格样式
├── icons/                # 扩展图标
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── lib/                  # 第三方库
    └── qrcode.min.js
```

## 安装方法

### 开发模式安装
1. 打开Chrome浏览器,访问 `chrome://extensions/`
2. 开启右上角的"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择本项目文件夹

### 使用方法
1. 访问任意网页
2. 点击浏览器工具栏中的"网页二维码"图标
3. 自动生成包含该网页链接的二维码
4. 使用手机扫描二维码即可访问该网页

## 功能说明

### popup.js 主要函数

#### `getCurrentTab()`
- **用途**: 获取当前活动标签页的信息
- **返回值**: Promise<Tab> - 包含URL、标题和favicon的标签页对象
- **使用示例**: 
  ```javascript
  const tab = await getCurrentTab();
  console.log(tab.url); // 当前网页的URL
  ```

#### `generateQRCode(url, favicon)`
- **用途**: 生成带有favicon的二维码
- **参数**: 
  - `url` (string): 要编码的网页URL
  - `favicon` (string): 网站的favicon URL
- **功能**: 
  1. 使用QRCode.js生成二维码
  2. 在canvas上叠加favicon图标
  3. 应用圆角和阴影效果
- **错误处理**: 如果favicon加载失败,显示纯二维码

#### `displayWebsiteInfo(title, url)`
- **用途**: 在界面上显示网站信息
- **参数**:
  - `title` (string): 网站标题
  - `url` (string): 网站URL
- **显示内容**: 
  - 完整的网站标题
  - 格式化的域名(移除协议前缀)

#### `extractDomain(url)`
- **用途**: 从完整URL中提取简洁的域名
- **参数**: `url` (string) - 完整的URL
- **返回值**: string - 格式化后的域名
- **示例**: `https://www.example.com/path` → `example.com`

## 开发说明

### 技术要点
1. **Manifest V3标准**: 使用service_worker代替background pages
2. **权限最小化**: 只请求必要的`activeTab`权限
3. **异步处理**: 使用async/await处理异步操作
4. **错误处理**: 完善的try-catch错误捕获
5. **性能优化**: 
   - 二维码缓存机制
   - 图片预加载
   - Canvas硬件加速

### 样式设计原则
- 使用Apple的SF Pro字体(系统默认)
- 采用12px圆角(苹果标准圆角半径)
- 使用柔和的阴影效果
- 遵循8px网格系统
- 色彩搭配参考iOS设计规范

## 浏览器兼容性
- ✅ Chrome 88+
- ✅ Microsoft Edge 88+
- ✅ 其他基于Chromium的浏览器

## 隐私说明
本扩展:
- ✅ 不收集任何用户数据
- ✅ 不发送任何网络请求
- ✅ 所有操作在本地完成
- ✅ 不使用任何第三方分析服务

## 更新日志

### v1.0.0 (2025-11-10)
- 🎉 初始版本发布
- ✨ 支持生成带favicon的二维码
- 🎨 实现苹果风格的UI设计
- 📱 完美的响应式布局

## 未来规划

### 计划功能
- [ ] 支持深色模式自动切换
- [ ] 二维码样式自定义(颜色、大小)
- [ ] 一键保存二维码图片
- [ ] 批量生成书签二维码
- [ ] 支持短链接服务集成
- [ ] 添加二维码历史记录

### 优化计划
- [ ] 添加单元测试
- [ ] 优化favicon提取算法
- [ ] 支持更多二维码纠错等级
- [ ] 添加键盘快捷键支持

## 贡献指南
欢迎提交Issue和Pull Request!

## 开发者
开发时间: 2025年11月
使用的AI辅助工具: Claude (Cursor AI)

## 许可证
MIT License

---

**享受便捷的网页分享体验!** 📱✨


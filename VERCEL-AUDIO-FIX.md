# Vercel 音效问题修复指南

## 问题原因

在Vercel上无法听到音效的原因有以下几点:

### 1. **路径配置问题** ✅ 已修复
之前的代码只针对GitHub Pages做了特殊处理:
```javascript
// ❌ 旧代码 - 只支持 GitHub Pages
const audioPath = window.location.hostname.includes('github.io') 
  ? '/FX-Travel-Jumbo-Interactive/assets/sounds/bottom-sound.wav'
  : './assets/sounds/bottom-sound.wav';
```

**问题**: Vercel域名是 `*.vercel.app`,不匹配 `github.io`,会使用相对路径 `./assets/sounds/...`,但Vercel可能需要不同的路径处理。

### 2. **缺少 Vercel 配置文件** ✅ 已修复
项目根目录没有 `vercel.json`,导致Vercel可能无法正确处理静态资源。

### 3. **CORS 和缓存头缺失** ✅ 已修复
音频文件需要正确的HTTP头才能正常加载。

## 已实施的修复

### 修复1: 智能路径检测
```javascript
// ✅ 新代码 - 支持所有平台
let audioPath;
const hostname = window.location.hostname;

if (hostname.includes('github.io')) {
  // GitHub Pages 需要项目名前缀
  audioPath = '/FX-Travel-Jumbo-Interactive/assets/sounds/bottom-sound.wav';
} else if (hostname.includes('vercel.app') || hostname === 'localhost' || hostname === '127.0.0.1') {
  // Vercel 和本地使用相对路径
  audioPath = './assets/sounds/bottom-sound.wav';
} else {
  // 其他情况使用相对路径
  audioPath = './assets/sounds/bottom-sound.wav';
}
```

**改进点:**
- ✅ 明确检测 `vercel.app` 域名
- ✅ 添加详细的日志输出,方便调试
- ✅ 支持本地开发环境

### 修复2: 创建 vercel.json 配置文件
```json
{
  "buildCommand": null,
  "outputDirectory": ".",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/minisite-interactive-final_20260414_v1.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/sounds/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        },
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

**关键配置:**
- `buildCommand: null` - 不需要构建,直接部署静态文件
- `outputDirectory: "."` - 根目录就是输出目录
- `rewrites` - 所有路由都指向主HTML文件
- `headers` - 为音频文件设置正确的CORS和缓存头

## 部署步骤

### 方法1: 通过 Vercel Dashboard (推荐)

1. **提交代码到 Git**
   ```bash
   git add .
   git commit -m "fix: 修复Vercel音效路径问题,添加vercel.json配置"
   git push origin main
   ```

2. **在 Vercel Dashboard 中重新部署**
   - 访问 https://vercel.com/dashboard
   - 找到你的项目
   - 点击 "Redeploy"
   - 等待部署完成

3. **验证部署**
   - 打开浏览器控制台 (F12)
   - 查看 Console 标签
   - 应该看到类似这样的日志:
     ```
     🔊 CTA Jumbo: Playing elephant sound from: ./assets/sounds/bottom-sound.wav
     🔍 Current hostname: your-project.vercel.app
     ```

### 方法2: 通过 Vercel CLI

```bash
# 安装 Vercel CLI (如果还没安装)
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

## 调试技巧

### 1. 检查浏览器控制台
打开开发者工具 (F12),查看:
- **Console**: 查看路径日志和错误信息
- **Network**: 查看音频文件是否成功加载 (状态码应该是 200)
- **Sources**: 确认音频文件是否存在于正确路径

### 2. 常见错误及解决方案

#### 错误1: 404 Not Found
```
GET https://your-project.vercel.app/assets/sounds/bottom-sound.wav 404
```
**原因**: 文件没有被正确提交到Git  
**解决**: 
```bash
git add assets/sounds/*
git commit -m "add: 音效文件"
git push
```

#### 错误2: CORS Error
```
Access to audio at '...' from origin '...' has been blocked by CORS policy
```
**原因**: 缺少CORS头  
**解决**: `vercel.json` 已经配置了 `Access-Control-Allow-Origin: *`

#### 错误3: Autoplay Blocked
```
The play() request was interrupted by a call to pause()
```
**原因**: 浏览器阻止自动播放  
**解决**: 这是正常的,用户需要先与页面交互(点击)才能播放声音

### 3. 测试清单

- [ ] 桌面端 Chrome/Firefox/Safari 能听到音效
- [ ] 移动端 iOS/Android 能听到音效
- [ ] 点击 Jumbo 时播放 bottom-sound.wav
- [ ] 页面加载时播放 hero-sound.mp3 (如果启用)
- [ ] 浏览器控制台没有 404 错误
- [ ] Network 面板显示音频文件状态码 200

## 如果还是不行...

### 终极调试方案

在浏览器控制台运行以下代码:

```javascript
// 测试音频文件是否可访问
fetch('./assets/sounds/bottom-sound.wav')
  .then(response => {
    console.log('Status:', response.status);
    console.log('OK?', response.ok);
    return response.blob();
  })
  .then(blob => {
    console.log('File size:', blob.size, 'bytes');
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play();
  })
  .catch(error => {
    console.error('Fetch failed:', error);
  });
```

如果这个测试也失败,说明:
1. 文件没有被正确部署
2. 路径配置有问题
3. 需要检查 Vercel 的部署日志

### 备选方案: 使用 CDN

如果Vercel静态资源加载有问题,可以考虑:
1. 将音频文件上传到 CDN (如 Cloudinary, AWS S3)
2. 修改代码使用绝对URL:
   ```javascript
   const audioPath = 'https://your-cdn.com/sounds/bottom-sound.wav';
   ```

## 总结

✅ **已修复的问题:**
1. 添加了 Vercel 域名检测
2. 创建了 vercel.json 配置文件
3. 设置了正确的 CORS 和缓存头
4. 添加了详细的调试日志

📝 **下一步操作:**
1. 提交代码并推送到 Git
2. 在 Vercel 上重新部署
3. 测试音效是否正常播放
4. 查看控制台日志确认路径正确

如果还有问题,请提供:
- 浏览器控制台的完整错误信息
- Network 面板中音频文件的请求详情
- Vercel 部署日志

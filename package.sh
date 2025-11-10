#!/bin/bash

# 网页二维码扩展 - 打包脚本
# 用于将扩展打包成.zip文件,方便分发和上传到Chrome Web Store

echo "🎁 开始打包 Chrome 扩展..."
echo ""

# 设置打包文件名
PACKAGE_NAME="Chrome_web_page_QRcode_v1.0.0.zip"

# 需要打包的文件
FILES=(
    "manifest.json"
    "popup.html"
    "popup.js"
    "popup.css"
    "icons/"
    "lib/"
)

# 检查必需文件是否存在
echo "📋 检查必需文件..."
MISSING_FILES=0
for file in "${FILES[@]}"; do
    if [ ! -e "$file" ]; then
        echo "❌ 缺少文件: $file"
        MISSING_FILES=1
    else
        echo "✅ $file"
    fi
done

if [ $MISSING_FILES -eq 1 ]; then
    echo ""
    echo "❌ 打包失败: 缺少必需文件"
    exit 1
fi

echo ""
echo "📦 创建压缩包..."

# 删除旧的打包文件(如果存在)
if [ -f "$PACKAGE_NAME" ]; then
    rm "$PACKAGE_NAME"
    echo "🗑️  删除旧的打包文件"
fi

# 创建zip包
zip -r "$PACKAGE_NAME" \
    manifest.json \
    popup.html \
    popup.js \
    popup.css \
    icons/ \
    lib/ \
    -x "*.DS_Store" \
    -x "__MACOSX/*" \
    -x ".git/*" \
    -q

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 打包成功!"
    echo "📦 文件名: $PACKAGE_NAME"
    echo "📊 文件大小: $(du -h "$PACKAGE_NAME" | cut -f1)"
    echo ""
    echo "📤 上传到 Chrome Web Store 的步骤:"
    echo "   1. 访问: https://chrome.google.com/webstore/devconsole"
    echo "   2. 点击 '新增项目'"
    echo "   3. 上传 $PACKAGE_NAME"
    echo "   4. 填写商店详情"
    echo "   5. 提交审核"
    echo ""
    echo "💡 提示: 打包文件已准备就绪,可以分发或上传!"
else
    echo ""
    echo "❌ 打包失败"
    exit 1
fi


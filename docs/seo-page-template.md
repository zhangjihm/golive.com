# Golfive SEO 页面规范（可复用）

## 1) 必填元信息
- `<title>`：主关键词 + 场景词 + 品牌（<= 60 chars）
- `meta description`：包含收益点 + 关键词（<= 155 chars）
- `canonical`：唯一规范URL
- Open Graph：`og:title` / `og:description` / `og:url` / `og:type`

## 2) 标题结构
- 页面只允许 1 个 H1
- H2/H3 按逻辑分层，避免跳级

## 3) 内容质量规则
- 文章字数建议：800-1500
- 首段 120 字内给出结论或收益
- 至少 1 个可执行清单
- 每页 1 个主 CTA（不要分散）

## 4) 图片规范
- 文件名语义化：`short-game-warmup-drill.jpg`
- `alt` 具体描述场景，不堆关键词
- 尺寸建议：
  - 卡片图：800x500
  - Hero：1920x600

## 5) 内链规范
- 每篇文章至少 3 个内链：
  - 1个到技巧页
  - 1个到装备/球场页
  - 1个到订阅或联系页

## 6) 结构化数据（后续增强）
- 列表页：`Blog` / `ItemList`
- 文章页：`Article`

## 7) 发布前检查清单
- [ ] URL 可访问
- [ ] title/description 唯一
- [ ] H1 唯一
- [ ] 图片可加载且有 alt
- [ ] 内链无 404
- [ ] CTA 可点击且流程闭环

# Tempo X Publish Pack

Last updated: 2026-05-14

## Assets

- Demo payment logic: `docs/assets/tempo-home-canvas.png`
- RPC proof console: `docs/assets/tempo-proof-console.png`
- Explorer 404 proof: `docs/assets/tempo-explorer-404.png`
- Full-page app capture: `docs/assets/tempo-stablepay-proof.png`

## Links

- Previous Tempo testnet article: https://x.com/LiuNengBoy/status/2011148842637672459
- Published Tempo developer article: https://x.com/LiuNengBoy/status/2054765398441197691
- Demo: https://stablecoin-payment-builder-plan.vercel.app/
- GitHub: https://github.com/a941249849/stablecoin-payment-builder-plan
- Tempo docs: https://docs.tempo.xyz/

## Publish Text

1 月我写过一篇 Tempo 测试网参与指南，当时更多是从用户/协议层角度去实测：

https://x.com/LiuNengBoy/status/2011148842637672459

那篇文章的重点是：Tempo 和传统 EVM 链最大的差异之一，不是再发一个原生 gas token，而是把稳定币放进手续费和交易体验里。

当时我主要验证了这些东西：

- Tempo Testnet 怎么连接
- faucet 怎么领 pathUSD / AlphaUSD / BetaUSD / ThetaUSD
- 怎么用 viem 跑 Tempo transaction
- feeToken 怎么指定
- 稳定币支付 gas 这件事是否真实存在

这次我换了一个角度。

不是继续写一篇领水教程，也不是复述官方文档，而是从开发者视角问一个更具体的问题：

稳定币支付链，到底能不能支撑一个最小的商户收款 / 发票对账流程？

所以我做了一个小 demo：Tempo StablePay。

Demo：
https://stablecoin-payment-builder-plan.vercel.app/

GitHub：
https://github.com/a941249849/stablecoin-payment-builder-plan

这个 demo 不是普通转账 UI。

普通转账只回答一个问题：

A 地址有没有把钱转给 B 地址？

但支付应用还要回答更多问题：

- 这笔钱对应哪张发票？
- 付款完成后系统能不能自动对账？
- 商户能不能拿到可复核的链上证明？
- 如果 Explorer 没有展示，RPC receipt 能不能作为证据？

所以这次我验证的是一个更接近支付系统的闭环：

invoice -> memo -> transferWithMemo -> RPC receipt -> TransferWithMemo match -> paid

具体流程是：

1. 商户在页面创建本地发票
2. 发票编号被编码成 TIP-20 `bytes32 memo`
3. 付款方用 Tempo Wallet 发送 `transferWithMemo`
4. 应用从 Tempo RPC 拉取 receipt
5. 应用解码并匹配 `TransferWithMemo` 事件
6. 匹配 token、recipient、memo 后，发票状态自动变成 paid
7. 页面生成一份可复制的付款证明

这和普通钱包转账的差别在于：memo 给了这笔稳定币转账一个“业务语义”。

也就是说，链上不是只知道“转了 100 AlphaUSD”，而是可以让应用知道“这 100 AlphaUSD 对应 INV-MP4JBTHK 这张发票”。

这次成功跑通了一笔 Tempo Wallet 交易。

交易 hash：

`0xbaa715f8795f3433292f7ad1ad1d7b41341a99c1e48e47232f4ce1931b6690d6`

RPC receipt 结果：

- status: `0x1`
- block: `17395745`
- block hash: `0x4277d08173ba48f41e78cc3b5e08e33b0a3d7410e847c3626c2b69d06a4198a0`
- token: `AlphaUSD`
- fee token: `AlphaUSD`
- memo: `INV-MP4JBTHK`
- `TransferWithMemo` log index: `6`

从 RPC 角度看，这笔交易是成功的，memo 事件也能被解析和匹配。

但这里踩到了一个很值得记录的问题：

Tempo Explorer 对这笔交易的展示不稳定。

同一个 tx hash：

https://explore.tempo.xyz/tx/0xbaa715f8795f3433292f7ad1ad1d7b41341a99c1e48e47232f4ce1931b6690d6

目前 Explorer 交易页返回 Page Not Found。

也就是说，Explorer 404 不一定等于交易没发生。

至少这次实测里，Tempo RPC receipt 能查到成功交易，但 Explorer 的交易路由 / 索引没有展示出来。

这也是我这次最大的收获之一：

对开发者来说，不能只把 Explorer 当作唯一链上证明源。

尤其是在测试网阶段，一个支付 demo 应该把证明层拆开：

- 钱包是否返回 tx hash
- RPC receipt 是否成功
- block / blockHash 是否存在
- 合约 event 是否能解码
- memo 是否和发票匹配
- Explorer 是否能展示

这些应该分开看。

所以我把 demo 从“发送按钮 + Explorer 链接”改成了一个付款证明台。

它会展示：

- tx hash
- RPC endpoint
- status
- block number
- block hash
- from / to
- 付款代币
- 手续费代币
- memo
- `TransferWithMemo` 是否匹配
- log index
- 对账时间
- Explorer 当前状态

这比单纯贴一个 Explorer 链接更适合支付应用。

因为支付系统真正关心的是：这笔付款能不能被系统识别、归因、入账。

我对 Tempo 这次的判断会比较克制。

优点：

- `transferWithMemo` 对支付场景是有实际意义的
- stablecoin fee 的方向适合支付应用
- Tempo Wallet 路径可以跑通浏览器付款
- docs / SDK / faucet 已经足够支撑一个小型 demo
- 用 memo 做发票对账，比普通转账更接近真实商户支付需求

问题：

- Explorer 索引 / 路由还不稳定
- 普通 EVM 钱包“能连接”不等于“能稳定提交 Tempo stablecoin-fee 交易”
- fee sponsorship 还需要单独验证，不能提前当成已完成能力
- 当前 demo 仍是前端本地发票，没有后端订单系统和数据库
- 如果要走向生产级支付，还需要风控、重试、Webhook、持久化账本和更完整的钱包兼容策略

所以我不会说 Tempo 现在已经是成熟支付基础设施。

但我也不会说它只是叙事。

至少从这次开发者实测看，它已经能支撑一个最小的稳定币支付语义闭环：

发票创建 -> 稳定币付款 -> memo 上链 -> RPC receipt 确认 -> event 自动对账 -> paid

这件事和普通转账不一样。

也是我认为 Tempo 值得继续建设和跟进的原因。

最近 Arc 因为发币预期和市场热度，关注度明显更高。

但我现在反而选择先把 Tempo 这一段补完，是因为我之前已经有测试网实测基础，这次可以直接推进到开发者 demo 和支付语义验证。

下一步我会用同样标准去看 Arc。

不是看谁热度更高，也不是看谁更有发币预期，而是看：

- 能不能构建一个可用支付 demo
- 交易证明是否稳定
- 钱包体验是否顺
- 是否有支付语义
- 对商户和开发者来说，真实摩擦在哪里

Tempo 这篇是开发者二次实测。

Arc 下一篇也按同样方式来做。

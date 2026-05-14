# Tempo StablePay X Long-Form Draft

Last updated: 2026-05-14

## Draft

我之前写过一篇 Tempo 测试网教程，当时更多是从用户视角体验：领水、连接网络、尝试测试币。

这次我换成开发者视角，做了一个很小的 demo：Tempo StablePay。

它不是为了重复官方文档里的转账功能，而是为了验证一个问题：

稳定币支付链，能不能支撑一个最小的商户收款/发票对账流程？

这和普通转账不一样。

普通转账只回答：A 地址有没有把钱转给 B 地址。

支付应用还要回答：这笔钱对应哪张发票？系统能不能自动对账？付款完成后能不能生成可复核的证明？

所以这个 demo 做的是：

1. 创建本地发票
2. 把发票编号编码成 TIP-20 `bytes32 memo`
3. 用 Tempo Wallet 发送 `transferWithMemo`
4. 从 Tempo RPC receipt 读取链上结果
5. 匹配 `TransferWithMemo` 事件
6. 把发票状态自动标记为 paid
7. 生成可复制的链上证明

这次成功跑通了一笔交易。

交易 hash:

`0xbaa715f8795f3433292f7ad1ad1d7b41341a99c1e48e47232f4ce1931b6690d6`

RPC receipt 结果：

- status: `0x1`
- block: `17395745`
- token: `AlphaUSD`
- fee token: `AlphaUSD`
- memo: `INV-MP4JBTHK`
- `TransferWithMemo` log index: `6`

也就是说，从链上 RPC 角度看，这笔交易是成功的，而且 memo 对账也能完成。

这里也踩到了一个很重要的问题：Tempo Explorer 对这类交易的展示并不稳定。

同一个 tx hash，Tempo RPC 能查到 receipt，但 Explorer 的交易页会返回 404，地址搜索也不一定能看到记录。

这不代表交易没发出去，而是 explorer 索引/路由层还没完全跟上。

这个问题对开发者很关键。

因为很多用户会默认把 explorer 当作“链上是否成功”的唯一判断标准。但在 Tempo 当前测试网环境里，至少这次体验显示，RPC receipt 比 explorer 更可靠。

所以我最后把 demo 改成了一个“付款证明台”：

- 交易 hash
- block number
- block hash
- from / to
- 付款代币
- 手续费代币
- memo
- TransferWithMemo 是否匹配
- log index
- 对账时间
- 整份证明可复制

Explorer 链接保留，但只作为辅助入口，不再作为唯一证明。

我对 Tempo 这次的判断比较明确：

优点：

- `transferWithMemo` 对支付场景是有实际意义的
- stablecoin fee 的方向适合支付应用
- Tempo Wallet 路径可以跑通浏览器付款
- SDK 和文档已经足够支持开发者做出小型 demo

问题：

- Explorer 索引不稳定
- 普通 EVM 钱包连接不等于能提交 Tempo stablecoin-fee 交易
- fee sponsorship 还需要单独验证
- 如果要做生产级支付应用，需要后端订单系统、持久化数据库、风控和更完整的钱包兼容策略

所以 Tempo 现在不是“完美可用”，但也不是只停留在叙事。

至少对开发者来说，它已经能做出一个最小的稳定币支付闭环：

invoice -> memo -> transferWithMemo -> RPC receipt -> TransferWithMemo match -> paid

这就是我认为它值得继续跟进的地方。

下一步我会用同样标准去看 Arc。

不是看谁热度高，也不是看谁更有发币预期，而是看：

- 能不能构建支付 demo
- 交易证明是否稳定
- 钱包体验是否顺
- 是否有支付语义
- 对商户/开发者来说实际摩擦在哪里

Tempo 这篇是开发者实测。

Arc 下一篇也会按同样方式来做。

## Publish Notes

Attach:

- GitHub repo link
- Vercel demo link
- payment proof console screenshot
- Explorer 404 screenshot
- RPC receipt proof text

Avoid claiming:

- Tempo explorer is reliable for every tx
- fee sponsorship is already complete in this demo
- MetaMask / OKX are equivalent to Tempo Wallet for send

Recommended headline:

`我重新从开发者视角构建 Tempo：它不是普通转账，而是发票 memo + 自动对账`

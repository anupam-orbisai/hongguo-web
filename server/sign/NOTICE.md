# 签名算法来源与许可（server/sign）

本目录下的 `argus.cjs` / `sm3.cjs` 是红果（番茄小说 App，aid=8662）播放接口所需的
`x-argus` / `x-ladon` 签名实现，属于逆向复刻代码，**不是**上游 GPL 源的一部分。

- 来源：`fqapp` / `N3urda/hongguoTV`（`vendor/hongguo.cjs` 同源实现）
- 许可：GPL-3.0-only（与 `server/vendor/hongguo.cjs` 一致）
- 本地改动：仅调整 `require('./sm3')` → `require('./sm3.cjs')` 以适配 `type: module` 的包，
  算法常量与位运算顺序未改动（改动会直接导致签名失效）。
- 校验：`test/unit/argus.test.js` 的 6 条黄金向量（SM3 三向量、Simon 往返、Ladon 定值、argus 定值）全部通过。

用途：仅向官方播放接口取回**用户本机可播放的清晰度列表**（含 1080P），
服务端解密后按 Range 转发给浏览器，不存储、不再分发。


---

## V5 播放签名（v5.cjs）

`v5.cjs` 是 2026-11 上游切换后的播放接口签名实现（SM3 + HashF13 + CarrierV5，
`x-helios` / `x-medusa` / `x-ss-stub` 请求头，`POST .../multi_video_model/player/v1`）。

- 来源：`N3urda/hongguoTV`（commit 18c37c2）的 `Signer.kt` / `AesV3.kt` / `V5Constants.kt`，
  原始出处 `drpys` commit 22261ad；经 `jackotom/hongguo-drama` 7.5 的 `playback-v5.js` 整理为 Node 实现。
- 许可：GPL-3.0-only（与 `server/vendor/hongguo.cjs` 一致）。
- 本地改动：仅调整 `require('./sm3')` → `require('./sm3.cjs')`；算法常量与位运算顺序未改动。
- 校验：`server/selftest.mjs` 的「V5 播放签名」段（URL/分支 ticket/x-ss-stub 定值 + 形状断言）。

用途：仅向官方播放接口取回用户本机可播放的清晰度列表，服务端解密后按 Range 转发，不存储、不再分发。

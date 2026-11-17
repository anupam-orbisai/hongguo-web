import { fail } from "./errors.mjs";

// 统一超时：超时抛带 code 的 fail，交由 http 层映射状态码（不再各模块各写一份）。
export function withTimeout(promise, ms, message, code = "TIMEOUT") {
  let timer;
  const timeout = new Promise((_resolve, reject) => {
    timer = setTimeout(() => reject(fail(code, message)), ms);
    if (timer && timer.unref) timer.unref();
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

// 标题归一：去掉空白/标点/「短剧」「全集」这类营销后缀，避免同一部剧在不同源写法不同而匹配不上。
export function titleKey(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[\s\u3000·・:：!！?？,，.。、\-—_~～|/\\()（）\[\]【】{}<>《》"'“”‘’#*+]/g, "")
    .replace(/(短剧|全集|全\d+集|已完结|更新至\d+集?|第[一二三四五六七八九十百\d]+季)/g, "");
}

// 二元组 Dice 系数：中文短剧名多为 4–8 字，重合度比编辑距离更抗「多两个字/少一个字」的写法差异。
export function titleScore(a, b) {
  const x = titleKey(a);
  const y = titleKey(b);
  if (!x || !y) return 0;
  if (x === y) return 1;
  if (x.length >= 2 && y.length >= 2 && (x.includes(y) || y.includes(x))) return 0.9;
  if (x.length < 2 || y.length < 2) return 0;
  const grams = (text) => {
    const set = new Set();
    for (let i = 0; i < text.length - 1; i += 1) set.add(text.slice(i, i + 2));
    return set;
  };
  const gx = grams(x);
  const gy = grams(y);
  let hit = 0;
  for (const gram of gx) if (gy.has(gram)) hit += 1;
  return (2 * hit) / (gx.size + gy.size);
}

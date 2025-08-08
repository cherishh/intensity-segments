export class IntensitySegments {
  constructor() {
    // segments: [start, value]，start 严格递增且相邻 value 不相等
    this.segments = [];
  }

  add(from, to, amount) {
    if (from >= to || amount === 0) return;
    this._processRange(from, to, v => v + amount);
  }

  set(from, to, amount) {
    if (from >= to) return;
    this._processRange(from, to, () => amount);
  }

  toString() {
    return JSON.stringify(this.segments);
  }

  // ===== 关键区间处理 =====
  _processRange(from, to, updateFn) {
    // 1) 切齐边界
    this._ensureBreak(from);
    this._ensureBreak(to);

    // 2) 线性扫描 [from, to) 内的断点并更新
    let i = this._indexOfStartEq(from); // 必然存在
    while (i < this.segments.length && this.segments[i][0] < to) {
      this.segments[i][1] = updateFn(this.segments[i][1]);
      i++;
    }

    // 3) 合并相邻同值
    this._compress();
  }

  // ===== 内部工具 =====

  _lowerBound(x) {
    let lo = 0,
      hi = this.segments.length;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (this.segments[mid][0] < x) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }

  _ensureBreak(x) {
    const pos = this._lowerBound(x);
    if (pos < this.segments.length && this.segments[pos][0] === x) return;
    const v = pos > 0 ? this.segments[pos - 1][1] : 0;
    this.segments.splice(pos, 0, [x, v]);
  }

  _indexOfStartEq(x) {
    const pos = this._lowerBound(x);
    return pos < this.segments.length && this.segments[pos][0] === x ? pos : -1;
  }

  _compress() {
    if (this.segments.length <= 1) return;

    // 第一步：合并相邻的相同值段
    const merged = [];
    for (const [s, v] of this.segments) {
      if (merged.length === 0 || merged[merged.length - 1][1] !== v) {
        merged.push([s, v]);
      }
    }

    // 第二步：清理不必要的零值段
    const out = [];
    for (let i = 0; i < merged.length; i++) {
      const [s, v] = merged[i];

      if (v === 0) {
        // 如果是开头的零值段，跳过
        if (i === 0) continue;
        // 只有当零段是最后一个或下一个段不是零时才保留
        if (i === merged.length - 1 || merged[i + 1][1] !== 0) {
          out.push([s, v]);
        }
      } else {
        out.push([s, v]);
      }
    }

    this.segments = out;
  }
}

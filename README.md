# IntensitySegments - 区间强度管理

基于断点表示法的高效区间强度管理数据结构。

## 核心特性

- **高效算法**：O(log n + k) 时间复杂度
- **空间优化**：只存储变化点
- **自动压缩**：智能合并和清理
- **简洁API**：直观的 add/set 操作

## 快速开始

```js
import { IntensitySegments } from './intensity-segments.js';

const segments = new IntensitySegments();

// 区间加法
segments.add(10, 30, 1);  // [[10,1],[30,0]]
segments.add(20, 40, 1);  // [[10,1],[20,2],[30,1],[40,0]]

// 区间赋值
segments.set(15, 35, 5);  // [[10,1],[15,5],[35,1],[40,0]]

console.log(segments.toString());
```

## API 参考

### `add(from, to, amount)`
在区间 `[from, to)` 内增加强度值。

### `set(from, to, amount)`
将区间 `[from, to)` 内强度设为指定值。

### `toString()`
返回断点数组的 JSON 字符串。

## 算法原理

### 断点表示法
使用 `[位置, 强度]` 数组存储强度变化点：

```js
// 时间轴: 0----10----20----30----40
// 强度:   0     1     2     1     0
// 存储:   [[10,1], [20,2], [30,1], [40,0]]
```

### 核心算法
1. **切齐边界** - 确保操作区间端点存在断点
2. **线性扫描** - 只更新受影响的断点
3. **智能压缩** - 合并相同值，清理零值段

## 性能

- **时间复杂度**：O(log n + k)，n 为断点数，k 为受影响断点数
- **空间复杂度**：O(断点数)
- **基准测试**：1000次操作 ~16ms

## 测试

```bash
node test-intensity-segments.js
```

测试包含：
- ✅ 基础功能验证
- ✅ 边界条件处理
- ✅ 复杂场景测试
- ✅ 性能基准测试
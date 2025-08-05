# GDAPresale 合约接口说明文档

## 合约基本信息



*   **合约名称**：GDAPresale

*   \*\* SPDX 许可证 \*\*：MIT

*   **Solidity 版本**：^0.8.20

*   **主要功能**：实现 GDA 代币的预售机制，支持用户购买份额、领取奖励，并提供管理员配置功能及查询接口。

## 核心数据结构

### 1. `DaySalesData`（每日销售数据）



```
struct DaySalesData {

&#x20;   uint256 day;          // 预售天数（从1开始）

&#x20;   uint256 purchased;    // 当天购买的份额总数

&#x20;   uint256 usdtReceived; // 当天收到的 USDT 总金额（带18位小数）

}
```

### 2. `PurchaseRecord`（认购记录）



```
struct PurchaseRecord {

&#x20;   address buyer;       // 购买用户地址

&#x20;   uint256 shares;      // 购买的份额数量

&#x20;   uint256 usdtPaid;    // 支付的 USDT 金额（带18位小数）

&#x20;   uint256 timestamp;   // 购买时间戳（秒）

&#x20;   uint256 day;         // 购买时的预售天数（冗余存储）

}
```

## 核心状态变量（可查询）



| 变量名                | 类型        | 说明                  |
| ------------------ | --------- | ------------------- |
| `owner`            | `address` | 合约管理员地址             |
| `merchant`         | `address` | 商户收款地址（接收 USDT 付款）  |
| `usdt`             | `IERC20`  | USDT 代币合约地址         |
| `gdaToken`         | `IERC20`  | GDA 代币合约地址          |
| `startTime`        | `uint256` | 预售开始时间戳（秒）          |
| `endTime`          | `uint256` | 预售结束时间戳（秒）          |
| `totalShares`      | `uint256` | 预售总份额               |
| `purchasedShares`  | `uint256` | 已购买的总份额             |
| `dailyLimit`       | `uint256` | 单日最大可购买份额           |
| `addressLimit`     | `uint256` | 单个地址最大可购买份额         |
| `rewardMultiplier` | `uint256` | 奖励倍数（计算用户总 GDA 时使用） |
| `dailyReleaseRate` | `uint256` | 每日奖励释放比例（单位：千分比）    |
| `gdaPool`          | `uint256` | GDA 奖励池余额（可领取的总奖励）  |

## 主要功能接口

### 一、预售核心功能

#### 1. 购买份额



```
function buyShares(uint256 shares) external duringPresale
```



*   **功能**：用户在预售期间购买份额，支付 USDT 并获得对应的 GDA 奖励额度。

*   **参数**：`shares` - 购买的份额数量（需 > 0）。

*   **限制**：


    *   仅在预售期间（`startTime <= now <= endTime`）可调用。

    *   单日购买量不超过 `dailyLimit`。

    *   单个地址累计购买量不超过 `addressLimit`。

    *   总购买量不超过 `totalShares`。

*   **流程**：

1.  计算需支付的 USDT 金额（`sharePrice * shares`）。

2.  从用户地址转账 USDT 到 `merchant` 地址。

3.  记录购买数据（更新当日销量、用户累计份额、总 GDA 额度等）。

*   **事件**：`SharesPurchased`（包含购买用户、份额、USDT 金额、预售天数）。

#### 2. 领取奖励



```
function claimRewards() external
```



*   **功能**：用户领取累计的 GDA 奖励（按时间逐步释放）。

*   **限制**：


    *   奖励未被暂停（`pausedRewards[msg.sender] == false`）。

    *   用户有有效的 GDA 额度（`userTotalGDA[msg.sender] > 0`）。

    *   有购买记录（`userFirstPurchaseTime[msg.sender] > 0`）。

    *   距离上次领取有时间流逝（`currentTime > lastClaimTime`）。

    *   可领取奖励 > 0 且奖励池余额充足（`gdaPool >= releasable`）。

*   **计算逻辑**：

    可领取奖励 =（剩余未释放 GDA × 每日释放率 × 流逝分钟数）÷（1000 × 1440）

    （1440 为每天分钟数，1000 为缩放因子）

*   **事件**：`RewardsClaimed`（包含领取用户、奖励金额、流逝分钟数）。

### 二、管理员功能（仅 `owner` 可调用）

#### 1. 转移所有权



```
function transferOwnership(address newOwner) public onlyOwner
```



*   **功能**：将合约管理员权限转移给新地址。

#### 2. 更新基础配置



```
function updateBasicConfig(address \_newAdmin, address \_newMerchant) external onlyOwner
```



*   **功能**：同时更新管理员和商户地址。

#### 3. 更新奖励池



```
function addToGDAPool(uint256 amount) external onlyOwner
```



*   **功能**：向 GDA 奖励池添加额度（需确保合约有足够 GDA 余额）。

#### 4. 提取 GDA 到商户地址



```
function withdrawGDAtoMerchant(uint256 amount) external onlyOwner
```



*   **功能**：从合约提取 GDA 到 `merchant` 地址（优先从奖励池扣除）。

#### 5. 更新奖励参数



```
function updateRewardConfig(uint256 \_multiplier, uint256 \_releaseRate, uint256 \_cycle) external onlyOwner
```



*   **功能**：更新奖励倍数、每日释放率和释放周期。

*   限制：`_multiplier >= 1`，`_releaseRate` 范围为 1\~1000（千分比）。

#### 6. 更新预售参数



```
function updatePresaleConfig(uint256 \_totalTokens, uint256 \_sharePrice, uint256 \_start, uint256 \_end, uint256 \_dailyLimit, uint256 \_addressLimit) external onlyOwner
```



*   **功能**：更新预售总代币量、份额单价、起止时间、单日 / 单地址购买限制。

#### 7. 暂停 / 启用用户奖励



```
function toggleRewardStatus(address user, bool paused) external onlyOwner
```



*   **功能**：暂停或启用指定用户的奖励领取权限。

### 三、查询接口

#### 1. 查询用户可领取奖励



```
function getAvailableRewards(address user) external view returns (uint256)
```



*   **功能**：查询指定用户当前可领取的 GDA 奖励额度。

*   **返回值**：可领取的 GDA 数量（受奖励池余额限制）。

#### 2. 查询用户信息



```
function getUserInfo(address user) external view returns (uint256 userPurchased, uint256 totalGDA, uint256 releasedGDA, uint256 firstPurchaseTime, uint256 lastClaim, bool isPaused)
```



*   **返回值说明**：


    *   `userPurchased`：用户已购买的份额。

    *   `totalGDA`：用户总 GDA 额度。

    *   `releasedGDA`：已领取的 GDA 数量。

    *   `firstPurchaseTime`：首次购买时间戳。

    *   `lastClaim`：上次领取奖励时间戳。

    *   `isPaused`：奖励是否被暂停。

#### 3. 分页查询每日销售数据



```
function getPagedDaySales(uint256 page, uint256 pageSize) external view returns (DaySalesData\[] memory data, uint256 totalPages, uint256 totalDays)
```



*   **功能**：分页查询预售期间每天的销量和 USDT 入金数据。

*   **参数**：`page`（页码，从 1 开始）、`pageSize`（每页数量，1\~100）。

#### 4. 分页查询所有认购记录



```
function getPagedAllPurchases(uint256 page, uint256 pageSize) external view returns (PurchaseRecord\[] memory records, uint256 totalPages, uint256 totalRecords)
```



*   **功能**：分页查询所有用户的认购记录（按时间升序）。

#### 5. 查询预售基本信息



```
function getPresaleInfo() external view returns (uint256 \_totalTokens, uint256 \_sharePrice, address \_gdaToken, address \_usdtToken, uint256 \_startTime, uint256 \_endTime, uint256 \_purchasedShares, uint256 \_remainingShares, uint256 \_dailyLimit, uint256 \_addressLimit)
```



*   **功能**：查询预售核心参数（总代币量、份额单价、起止时间等）。

#### 6. 查询当天剩余可购买份额



```
function getTodayRemainingShares() external view returns (uint256)
```



*   **功能**：返回当前预售日剩余可购买的份额数量。

## 事件说明



| 事件名                      | 说明                 |
| ------------------------ | ------------------ |
| `OwnershipTransferred`   | 管理员地址变更时触发         |
| `SharesPurchased`        | 用户购买份额时触发          |
| `RewardsClaimed`         | 用户领取奖励时触发          |
| `RewardPoolUpdated`      | 奖励池余额更新时触发         |
| `GDAWithdrawnToMerchant` | 管理员提取 GDA 到商户地址时触发 |

## 注意事项



1.  所有涉及代币转账的功能（如 `buyShares`、`claimRewards`）需确保用户已授权合约操作对应代币（USDT 或 GDA）。

2.  查询接口（`view` 函数）仅读取状态，不消耗 Gas，可自由调用。

3.  奖励释放按时间线性计算，未领取的奖励会累计，直到奖励池耗尽或总额度释放完毕。

4.  管理员操作需谨慎，尤其是 `updatePresaleConfig`、`withdrawGDAtoMerchant` 等可能影响用户权益的功能。

> （注：文档部分内容可能由 AI 生成）
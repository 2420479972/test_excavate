# GDAPresale 合约

以下是 `GDAPresale` 合约的接口说明，按功能模块分类，包含核心功能、管理员功能、查询接口及事件说明，便于开发者对接和使用合约。

### **一、合约概述**



*   **合约名称**：`GDAPresale`

*   **核心功能**：GDA 代币预售管理，支持用户购买份额、按日释放奖励，并提供按预售天数的购买数据统计。

*   **核心逻辑**：用户通过 USDT 购买预售份额，获得按比例计算的 GDA 奖励（奖励总量 = 基础量 × 收益倍数），奖励按日释放率逐步解锁；同时记录每天的购买量供查询。

### **二、核心状态变量（可直接读取）**



| 变量名                   | 类型        | 含义说明                                                      |
| --------------------- | --------- | --------------------------------------------------------- |
| `owner`               | `address` | 合约管理员地址（拥有最高权限）                                           |
| `merchant`            | `address` | 商户收款地址（接收用户购买支付的 USDT）                                    |
| `notification`        | `string`  | 系统通知内容（如预售规则、活动说明）                                        |
| `usdt`                | `IERC20`  | USDT 代币接口（18 位小数 ERC20）                                   |
| `gdaToken`            | `IERC20`  | GDA 代币接口（18 位小数 ERC20）                                    |
| `totalTokens`         | `uint256` | 预售 GDA 总数量（18 位小数）                                        |
| `sharePrice`          | `uint256` | 单份预售份额价格（USDT，18 位小数，如 0.15 USDT 表示为`150000000000000000`） |
| `startTime`           | `uint256` | 预售开始时间戳（秒）                                                |
| `endTime`             | `uint256` | 预售结束时间戳（秒）                                                |
| `totalShares`         | `uint256` | 预售总发行份数                                                   |
| `purchasedShares`     | `uint256` | 已购买的总份数                                                   |
| `dailyLimit`          | `uint256` | 每日限购份数（按预售天数，如 “第一天”“第二天” 各自的上限）                          |
| `addressLimit`        | `uint256` | 单个地址限购份数（单地址最多可购买的份额）                                     |
| `dayPurchased`        | `mapping` | 按预售天数统计的购买量（`key=第N天`，`value=当天购买份数`）                     |
| `rewardMultiplier`    | `uint256` | 收益倍数（用户可释放 GDA 总量 = 基础量 × 该倍数）                            |
| `dailyReleaseRate`    | `uint256` | 日释放比例（千分比，如 8 表示 0.8%/ 天）                                 |
| `gdaPool`             | `uint256` | GDA 奖励矿池总量（用于发放用户奖励，需提前转入合约）                              |
| `userPurchasedShares` | `mapping` | 单个用户购买的份数（`key=用户地址`）                                     |
| `userTotalGDA`        | `mapping` | 用户可释放的 GDA 总量（18 位小数，`key=用户地址`）                          |
| `userReleasedGDA`     | `mapping` | 用户已释放的 GDA 量（18 位小数，`key=用户地址`）                           |

### **三、核心功能接口（用户调用）**

#### 1. 购买预售份额



```
function buyShares(uint256 shares) external duringPresale;
```



*   **功能**：用户通过 USDT 购买预售份额，获得对应 GDA 奖励。

*   **参数**：`shares` - 购买的份额数量（需为正数）。

*   **限制**：


    *   仅在预售期间（`startTime ≤ 当前时间 ≤ endTime`）可调用。

    *   需通过三层限购检查：


        *   不超过当日限购（`dayPurchased[当前天] + shares ≤ dailyLimit`）；

        *   不超过地址限购（`userPurchasedShares[msg.sender] + shares ≤ addressLimit`）；

        *   不超过总份额（`purchasedShares + shares ≤ totalShares`）。

*   **流程**：

1.  计算需支付的 USDT 金额（`sharePrice × shares`），从用户账户转账到`merchant`。

2.  计算 GDA 基础量（单份 GDA=500 万 ÷ 单份 USDT 价格），总可释放 GDA = 基础量 ×`rewardMultiplier`。

3.  更新购买记录（全局、每日、用户维度）。

*   **事件**：`SharesPurchased`（记录购买者、份额、USDT 金额、对应预售天数）。

#### 2. 领取 GDA 奖励



```
function claimRewards() external;
```



*   **功能**：用户领取已解锁的 GDA 奖励（按日释放率计算）。

*   **参数**：无。

*   **限制**：


    *   用户奖励未被暂停（`pausedRewards[msg.sender] = false`）。

    *   有可释放的 GDA（`userTotalGDA[msg.sender] > 0`）。

    *   距离上次领取有时间差（`当前时间 > lastClaimTime[msg.sender]`）。

*   **释放量计算**：



```
剩余可释放 = userTotalGDA - userReleasedGDA &#x20;

可释放量 = 剩余可释放 × 日释放率 × 间隔分钟数 ÷ (1000 × 1440) &#x20;

（1440=1天的分钟数，1000=千分比基数）
```



*   **流程**：

1.  计算可释放量，从`gdaPool`中转出对应 GDA 到用户。

2.  更新用户已释放量、矿池余额及上次领取时间。

*   **事件**：`RewardsClaimed`（记录用户、释放量、间隔分钟数）。

### **四、管理员功能接口（仅**`owner`**调用）**

#### 1. 转移合约所有权



```
function transferOwnership(address newOwner) public onlyOwner;
```



*   **功能**：将合约管理员权限转移给新地址。

*   **参数**：`newOwner` - 新管理员地址（非零地址）。

#### 2. 更新基础配置（管理员 + 商户）



```
function updateBasicConfig(address \_newAdmin, address \_newMerchant) external onlyOwner;
```



*   **功能**：同时更新管理员和商户地址。

*   **参数**：


    *   `_newAdmin` - 新管理员地址；

    *   `_newMerchant` - 新商户收款地址。

#### 3. 更新代币地址



```
function setUSDTAddress(address \_newUSDT) external onlyOwner;

function setGDAAddress(address \_newGDA) external onlyOwner;
```



*   **功能**：分别更新 USDT 和 GDA 的代币地址（需为 18 位小数 ERC20）。

#### 4. 更新奖励释放配置



```
function updateRewardConfig(uint256 \_multiplier, uint256 \_releaseRate, uint256 \_cycle) external onlyOwner;
```



*   **功能**：调整奖励倍数、日释放率和释放周期。

*   **参数**：


    *   `_multiplier` - 新收益倍数（≥1）；

    *   `_releaseRate` - 新日释放率（0-1000，千分比）；

    *   `_cycle` - 新释放周期（预留参数）。

#### 5. 向奖励池添加 GDA



```
function addToGDAPool(uint256 amount) external onlyOwner;
```



*   **功能**：向`gdaPool`添加 GDA（用于发放用户奖励）。

*   **参数**：`amount` - 添加的 GDA 数量（18 位小数，需为正数）。

#### 6. 更新预售核心配置



```
function updatePresaleConfig(

&#x20;   uint256 \_totalTokens,

&#x20;   uint256 \_sharePrice,

&#x20;   uint256 \_start,

&#x20;   uint256 \_end,

&#x20;   uint256 \_dailyLimit,

&#x20;   uint256 \_addressLimit

) external onlyOwner;
```



*   **功能**：调整预售的核心参数（总量、价格、时间、限购等）。

*   **参数**：


    *   `_start` - 新开始时间（需晚于当前时间）；

    *   `_end` - 新结束时间（需晚于`_start`）；

    *   其他参数：新总量、新单份价格、新每日限购、新地址限购。

#### 7. 暂停 / 启用用户奖励



```
function toggleRewardStatus(address user, bool paused) external onlyOwner;
```



*   **功能**：切换特定用户的奖励领取状态（暂停 / 启用）。

*   **参数**：


    *   `user` - 目标用户地址；

    *   `paused` - 状态（`true`= 暂停，`false`= 启用）。

#### 8. 提取 GDA 到商户地址



```
function withdrawGDAtoMerchant(uint256 amount) external onlyOwner;
```



*   **功能**：将合约中的 GDA 提取到`merchant`地址。

*   **参数**：`amount` - 提取的 GDA 数量（18 位小数，需为正数，且不超过合约余额）。

### **五、查询接口（公开调用）**

#### 1. 预售天数相关查询



| 接口名                    | 功能说明                           | 参数 / 返回值                                    |
| ---------------------- | ------------------------------ | ------------------------------------------- |
| `getCurrentPresaleDay` | 查询当前是预售的第几天                    | 返回：`uint256`（未开始 = 0，进行中 = 第 N 天，已结束 = 总天数） |
| `getDayPurchased`      | 查询第 N 天的购买份数                   | 参数：`day`（天数，≥1）；返回：`uint256`（当天购买份数）        |
| `getTotalPresaleDays`  | 查询预售总天数（从 startTime 到 endTime） | 返回：`uint256`（不足一天按一天算）                      |

#### 2. 预售基本信息查询



```
function getPresaleInfo() external view returns (

&#x20;   uint256 \_totalTokens,       // 预售GDA总量

&#x20;   uint256 \_sharePrice,        // 单份价格（USDT）

&#x20;   address \_gdaToken,          // GDA代币地址

&#x20;   address \_usdtToken,         // USDT代币地址

&#x20;   uint256 \_startTime,         // 开始时间戳

&#x20;   uint256 \_endTime,           // 结束时间戳

&#x20;   uint256 \_purchasedShares,   // 已购总份数

&#x20;   uint256 \_remainingShares,   // 剩余份数（totalShares - purchasedShares）

&#x20;   uint256 \_dailyLimit,        // 每日限购份数

&#x20;   uint256 \_addressLimit       // 地址限购份数

);
```

#### 3. 用户信息查询



```
function getUserInfo(address user) external view returns (

&#x20;   uint256 userPurchased,      // 用户购买的份数

&#x20;   uint256 totalGDA,           // 总可释放GDA

&#x20;   uint256 releasedGDA,        // 已释放GDA

&#x20;   uint256 firstPurchaseTime,  // 首次购买时间戳

&#x20;   uint256 lastClaim,          // 上次领取时间戳

&#x20;   bool isPaused               // 奖励是否被暂停

);
```

#### 4. 可领取奖励查询



```
function getAvailableRewards(address user) external view returns (uint256);
```



*   **功能**：计算用户当前可领取的 GDA 奖励量（逻辑同`claimRewards`）。

*   **参数**：`user` - 目标用户地址。

#### 5. 当日剩余可购份额查询



```
function getTodayRemainingShares() external view returns (uint256);
```



*   **功能**：查询当前预售日的剩余可购买份数（`dailyLimit - dayPurchased[当前天]`）。

### **六、事件说明**



| 事件名                      | 触发场景        | 参数说明                                                      |
| ------------------------ | ----------- | --------------------------------------------------------- |
| `SharesPurchased`        | 用户购买份额时     | `buyer`（购买者）、`shares`（份额）、`usdtPaid`（USDT 金额）、`day`（预售天数） |
| `RewardsClaimed`         | 用户领取奖励时     | `user`（用户）、`amount`（释放量）、`elapsedMinutes`（间隔分钟数）          |
| `OwnershipTransferred`   | 所有权转移时      | `previousOwner`（原管理员）、`newOwner`（新管理员）                    |
| `AdminConfigUpdated`     | 管理员更新配置时    | `configType`（配置类型，如 "Presale"、"Reward"）                   |
| `RewardPoolUpdated`      | 奖励池更新时      | `newAmount`（更新后的矿池总量）                                     |
| `GDAWithdrawnToMerchant` | 提取 GDA 到商户时 | `merchant`（商户地址）、`amount`（提取量）                            |

### **七、注意事项**



1.  所有代币金额（USDT、GDA）均为 18 位小数，调用时需按实际精度转换（如 1 USDT=10^18）。

2.  预售天数以`startTime`为基准计算（`startTime`当天为第 1 天）。

3.  奖励释放依赖`gdaPool`余额，需确保管理员提前向矿池转入足够 GDA。

4.  限购规则在`buyShares`中强制校验，调用前建议通过查询接口确认剩余额度。

> （注：文档部分内容可能由 AI 生成）
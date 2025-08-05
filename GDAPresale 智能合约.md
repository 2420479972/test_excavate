# GDAPresale 智能合约

以下是 GDAPresale 智能合约的**完整版接口说明**，涵盖核心功能、管理员功能、查询接口及事件说明，按功能模块分类整理：

### 一、基础信息与状态变量



| 状态变量名                 | 类型        | 说明                               | 访问权限        |
| --------------------- | --------- | -------------------------------- | ----------- |
| `owner`               | `address` | 合约拥有者（管理员）地址                     | 公开可读        |
| `merchant`            | `address` | 商户地址（接收 USDT 的地址）                | 公开可读        |
| `notification`        | `string`  | 管理员设置的通知内容                       | 公开可读        |
| `usdt`                | `IERC20`  | USDT 代币合约接口                      | 公开可读        |
| `gdaToken`            | `IERC20`  | GDA 代币合约接口                       | 公开可读        |
| `totalTokens`         | `uint256` | 预售总 GDA 代币量（带 18 位小数）            | 公开可读        |
| `sharePrice`          | `uint256` | 每份份额的 USDT 价格（带 18 位小数）          | 公开可读        |
| `startTime`           | `uint256` | 预售开始时间戳（秒）                       | 公开可读        |
| `endTime`             | `uint256` | 预售结束时间戳（秒）                       | 公开可读        |
| `totalShares`         | `uint256` | 预售总份额数量                          | 公开可读        |
| `purchasedShares`     | `uint256` | 已认购的总份额数量                        | 公开可读        |
| `dailyLimit`          | `uint256` | 单日最大可认购份额限制                      | 公开可读        |
| `addressLimit`        | `uint256` | 单个地址最大可认购份额限制                    | 公开可读        |
| `rewardMultiplier`    | `uint256` | GDA 奖励乘数（认购后总奖励 = 基础量 × 乘数）      | 公开可读        |
| `dailyReleaseRate`    | `uint256` | 每日 GDA 奖励释放比例（‰，0-1000）          | 公开可读        |
| `releaseCycle`        | `uint256` | 奖励释放周期（未实际使用，预留）                 | 公开可读        |
| `gdaPool`             | `uint256` | GDA 奖励池剩余量（可提取的奖励总量）             | 公开可读        |
| `userPurchasedShares` | `mapping` | 单个地址已认购的份额（`address => uint256`） | 公开可读（按地址查询） |
| `totalUSDTReceived`   | `uint256` | 预售总 USDT 入金量（带 18 位小数）           | 公开可读        |

### 二、数据结构定义



| 结构名              | 字段名            | 类型        | 说明                    |
| ---------------- | -------------- | --------- | --------------------- |
| `DaySalesData`   | `day`          | `uint256` | 预售天数（第 N 天）           |
|                  | `purchased`    | `uint256` | 当天认购的份额数量             |
|                  | `usdtReceived` | `uint256` | 当天 USDT 入金量（带 18 位小数） |
| `PurchaseRecord` | `buyer`        | `address` | 认购用户地址                |
|                  | `shares`       | `uint256` | 认购份额数量                |
|                  | `usdtPaid`     | `uint256` | 支付的 USDT 金额（带 18 位小数） |
|                  | `timestamp`    | `uint256` | 认购时间戳（秒）              |
|                  | `day`          | `uint256` | 认购时的预售天数              |

### 三、核心功能接口（用户交互）

#### 1. 认购份额



```
function buyShares(uint256 shares) external duringPresale
```



*   **功能**：用户认购指定数量的份额，支付 USDT 并获得 GDA 奖励资格。

*   **参数**：`shares` - 认购的份额数量（>0）。

*   **限制**：


    *   仅在预售期间（`startTime ≤ 现在 ≤ endTime`）可调用。

    *   单日认购量不超过`dailyLimit`。

    *   单个地址累计认购量不超过`addressLimit`。

    *   总认购量不超过`totalShares`。

*   **流程**：

1.  计算需支付的 USDT 金额（`sharePrice × shares`）。

2.  从用户地址转账 USDT 到`merchant`地址。

3.  更新当天认购数据、总入金量、用户认购记录。

4.  记录认购详情到`allPurchaseRecords`数组。

*   **事件**：触发`SharesPurchased`（含用户地址、份额、USDT 金额、预售天数）。

#### 2. 提取 GDA 奖励



```
function claimRewards() external
```



*   **功能**：用户提取已释放的 GDA 奖励（按时间线性释放）。

*   **限制**：


    *   奖励未被暂停（`pausedRewards[用户] = false`）。

    *   用户有未释放的 GDA 奖励（`userTotalGDA[用户] > userReleasedGDA[用户]`）。

    *   距离上次提取有时间间隔（`现在 > lastClaimTime[用户]`）。

*   **计算逻辑**：

    可提取奖励 =（剩余未释放奖励 × 每日释放比例‰ × 间隔分钟数）÷（1000 × 1440）

    （1440 = 每天分钟数，1000 = 比例基数）

*   **流程**：

1.  计算可提取奖励量。

2.  从`gdaPool`中转账 GDA 到用户地址。

3.  更新用户已释放奖励量和上次提取时间。

*   **事件**：触发`RewardsClaimed`（含用户地址、提取量、间隔分钟数）。

### 四、管理员功能接口（仅`owner`可调用）

#### 1. 转移所有权



```
function transferOwnership(address newOwner) public onlyOwner
```



*   **功能**：将合约所有权转移给新地址。

*   **参数**：`newOwner` - 新拥有者地址（非零地址）。

*   **事件**：触发`OwnershipTransferred`（含旧 / 新拥有者地址）。

#### 2. 更新基础配置



```
function updateBasicConfig(address \_newAdmin, address \_newMerchant) external onlyOwner
```



*   **功能**：同时更新管理员和商户地址。

*   **参数**：`_newAdmin` - 新管理员地址；`_newMerchant` - 新商户地址（均非零地址）。

*   **事件**：触发`AdminConfigUpdated("Basic")`。

#### 3. 修改代币地址



```
function setUSDTAddress(address \_newUSDT) external onlyOwner

function setGDAAddress(address \_newGDA) external onlyOwner
```



*   **功能**：分别修改 USDT 和 GDA 代币的合约地址。

*   **参数**：`_newUSDT`/`_newGDA` - 新代币地址（非零地址）。

*   **事件**：分别触发`USDTAddressUpdated`/`GDAAddressUpdated`。

#### 4. 更新预售配置



```
function updatePresaleConfig(

&#x20;   uint256 \_totalTokens,

&#x20;   uint256 \_sharePrice,

&#x20;   uint256 \_start,

&#x20;   uint256 \_end,

&#x20;   uint256 \_dailyLimit,

&#x20;   uint256 \_addressLimit

) external onlyOwner
```



*   **功能**：批量更新预售核心参数（总代币量、份额价格、时间范围、限额等）。

*   **参数**：


    *   `_start`：新开始时间（需晚于当前时间）；

    *   `_end`：新结束时间（需晚于`_start`）；

    *   其他参数直接覆盖原配置。

*   **事件**：触发`AdminConfigUpdated("Presale")`。

#### 5. 更新奖励配置



```
function updateRewardConfig(

&#x20;   uint256 \_multiplier,

&#x20;   uint256 \_releaseRate,

&#x20;   uint256 \_cycle

) external onlyOwner
```



*   **功能**：更新 GDA 奖励的乘数、每日释放比例和周期。

*   **参数**：


    *   `_multiplier`：奖励乘数（≥1）；

    *   `_releaseRate`：每日释放比例（‰，0 < 比例 ≤ 1000）。

*   **事件**：触发`AdminConfigUpdated("Reward")`。

#### 6. 管理 GDA 奖励池



```
function addToGDAPool(uint256 amount) external onlyOwner
```



*   **功能**：向 GDA 奖励池添加代币（增加可提取的奖励总量）。

*   **参数**：`amount` - 新增的 GDA 数量（带 18 位小数，>0）。

*   **事件**：触发`RewardPoolUpdated`（含更新后的池总量）。

#### 7. 提取 GDA 到商户地址



```
function withdrawGDAtoMerchant(uint256 amount) external onlyOwner
```



*   **功能**：从合约中提取 GDA 代币到`merchant`地址（可用于减少奖励池）。

*   **参数**：`amount` - 提取数量（≤合约中 GDA 余额）。

*   **事件**：触发`GDAWithdrawnToMerchant`（含商户地址和提取量）。

#### 8. 暂停 / 恢复用户奖励



```
function toggleRewardStatus(address user, bool paused) external onlyOwner
```



*   **功能**：暂停或恢复指定用户的奖励提取权限。

*   **参数**：`user` - 目标用户地址；`paused` - `true`（暂停）/`false`（恢复）。

*   **事件**：触发`RewardStatusToggled`（含用户地址和状态）。

#### 9. 更新通知内容



```
function updateNotification(string calldata \_content) external onlyOwner
```



*   **功能**：设置公开可见的通知内容（如预售公告）。

*   **参数**：`_content` - 通知文本。

*   **事件**：触发`AdminConfigUpdated("Notification")`。

### 五、查询接口（公开可读，无需支付 Gas）

#### 1. 总入金与认购记录统计



```
function getTotalInflow() external view returns (uint256 totalUSDT, uint256 totalPurchases)
```



*   **功能**：查询预售总 USDT 入金量和总认购记录数。

*   **返回值**：`totalUSDT`（总入金，带 18 位小数）；`totalPurchases`（总记录数）。

#### 2. 分页查询所有认购记录



```
function getPagedAllPurchases(uint256 page, uint256 pageSize) external view returns (

&#x20;   PurchaseRecord\[] memory records,

&#x20;   uint256 totalPages,

&#x20;   uint256 totalRecords

)
```



*   **功能**：按时间顺序（从早到晚）分页查询所有用户的认购记录。

*   **参数**：`page`（页码，从 1 开始）；`pageSize`（每页记录数，1-100）。

*   **返回值**：


    *   `records`：当前页的认购记录数组（含用户地址、份额、USDT 金额、时间戳等）；

    *   `totalPages`：总页数；`totalRecords`：总记录数。

#### 3. 分页查询每日销售数据



```
function getPagedDaySales(uint256 page, uint256 pageSize) external view returns (

&#x20;   DaySalesData\[] memory data,

&#x20;   uint256 totalPages,

&#x20;   uint256 totalDays

)
```



*   **功能**：按预售天数分页查询每天的认购量和 USDT 入金。

*   **参数**：`page`（页码，从 1 开始）；`pageSize`（每页天数，1-100）。

*   **返回值**：


    *   `data`：当前页的每日数据数组（含天数、认购量、入金量）；

    *   `totalPages`：总页数；`totalDays`：预售总天数。

#### 4. 单个用户信息查询



```
function getUserInfo(address user) external view returns (

&#x20;   uint256 userPurchased,    // 该用户已认购份额

&#x20;   uint256 totalGDA,         // 该用户总GDA奖励（含未释放）

&#x20;   uint256 releasedGDA,      // 该用户已释放GDA奖励

&#x20;   uint256 firstPurchaseTime,// 首次认购时间戳

&#x20;   uint256 lastClaim,        // 上次提取奖励时间戳

&#x20;   bool isPaused             // 奖励是否被暂停

)
```



*   **功能**：查询指定用户的认购和奖励状态。

*   **参数**：`user` - 目标用户地址。

#### 5. 预售基础信息查询



```
function getPresaleInfo() external view returns (

&#x20;   uint256 \_totalTokens,    // 总GDA代币量

&#x20;   uint256 \_sharePrice,     // 每份USDT价格

&#x20;   address \_gdaToken,       // GDA代币地址

&#x20;   address \_usdtToken,      // USDT代币地址

&#x20;   uint256 \_startTime,      // 开始时间戳

&#x20;   uint256 \_endTime,        // 结束时间戳

&#x20;   uint256 \_purchasedShares,// 已认购总份额

&#x20;   uint256 \_remainingShares,// 剩余可认购份额

&#x20;   uint256 \_dailyLimit,     // 单日限额

&#x20;   uint256 \_addressLimit    // 单地址限额

)
```



*   **功能**：获取预售核心参数的汇总信息。

#### 6. 可提取奖励查询



```
function getAvailableRewards(address user) external view returns (uint256)
```



*   **功能**：查询指定用户当前可提取的 GDA 奖励量（带 18 位小数）。

*   **参数**：`user` - 目标用户地址。

#### 7. 当日剩余可认购份额



```
function getTodayRemainingShares() external view returns (uint256)
```



*   **功能**：查询当前预售日剩余的可认购份额（`dailyLimit - 当天已认购量`）。

#### 8. 其他辅助查询



| 函数名                    | 功能              | 参数 / 返回值                          |
| ---------------------- | --------------- | --------------------------------- |
| `getCurrentPresaleDay` | 查询当前是预售第几天      | 返回`uint256`（1 = 第一天）              |
| `getDayPurchased`      | 查询指定天的认购量       | 参数`day`（天数），返回`uint256`           |
| `getDayUSDTReceived`   | 查询指定天的 USDT 入金量 | 参数`day`（天数），返回`uint256`（带 18 位小数） |
| `getTotalPresaleDays`  | 查询预售总天数         | 返回`uint256`                       |

### 六、事件说明



| 事件名                      | 触发场景               | 关键参数（索引字段标`indexed`）                             |
| ------------------------ | ------------------ | ------------------------------------------------ |
| `SharesPurchased`        | 用户成功认购份额时          | `buyer`（`indexed`）、`shares`、`usdtPaid`、`day`     |
| `RewardsClaimed`         | 用户成功提取奖励时          | `user`（`indexed`）、`amount`、`elapsedMinutes`      |
| `OwnershipTransferred`   | 所有权转移时             | `previousOwner`（`indexed`）、`newOwner`（`indexed`） |
| `AdminConfigUpdated`     | 管理员更新配置时           | `configType`（如 "Presale"、"Reward"）               |
| `RewardPoolUpdated`      | 奖励池金额更新时           | `newAmount`（更新后的池总量）                             |
| `RewardStatusToggled`    | 用户奖励状态（暂停 / 恢复）变更时 | `user`（`indexed`）、`paused`                       |
| `GDAWithdrawnToMerchant` | 管理员提取 GDA 到商户时     | `merchant`（`indexed`）、`amount`                   |
| `USDTAddressUpdated`     | USDT 代币地址更新时       | `newUSDT`（`indexed`）                             |
| `GDAAddressUpdated`      | GDA 代币地址更新时        | `newGDA`（`indexed`）                              |

### 七、注意事项



1.  **单位说明**：所有代币相关数值（USDT、GDA）均以 18 位小数存储（如 1 USDT = `1e18`），查询时需除以`1e18`转换为实际数量。

2.  **分页限制**：分页查询函数（如`getPagedAllPurchases`）的`pageSize`最大为 100，避免单次查询消耗过多 Gas。

3.  **权限控制**：管理员函数（`onlyOwner`修饰）仅合约拥有者可调用，普通用户调用会失败。

4.  **时间范围**：`buyShares`仅在预售期间（`startTime`到`endTime`）可调用，逾期无法认购。

通过以上接口，可全面实现预售参与、奖励提取、数据查询及管理员配置管理功能。

> （注：文档部分内容可能由 AI 生成）
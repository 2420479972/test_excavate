# GDAPresale 合约接口文档

## 合约概述

GDAPresale 是基于 Solidity 0.8.20 开发的代币预售合约，支持用户通过 USDT 购买 GDA 代币份额，并按照预设规则释放奖励。合约包含完整的权限管理、预售配置、份额购买、奖励领取及管理员操作功能，核心逻辑包括每日限购、地址限购、按分钟释放奖励等机制。

## 核心状态变量

| 变量名           | 类型    | 可见性 | 描述                           |
| ---------------- | ------- | ------ | ------------------------------ |
| owner            | address | public | 合约所有者（管理员）地址       |
| merchant         | address | public | 商户地址（接收 USDT 资金）     |
| notification     | string  | public | 通知内容                       |
| usdt             | IERC20  | public | 关联的 USDT 代币合约地址       |
| gdaToken         | IERC20  | public | 关联的 GDA 代币合约地址        |
| totalTokens      | uint256 | public | 预售 GDA 代币总量              |
| sharePrice       | uint256 | public | 单份份额价格（USDT，6 位小数） |
| startTime        | uint256 | public | 预售开始时间戳（秒）           |
| endTime          | uint256 | public | 预售结束时间戳（秒）           |
| totalShares      | uint256 | public | 总发行份额数量                 |
| purchasedShares  | uint256 | public | 已购买的总份额数量             |
| dailyLimit       | uint256 | public | 每日限购份额数量               |
| addressLimit     | uint256 | public | 单地址限购份额数量             |
| rewardMultiplier | uint256 | public | 奖励倍数（默认 3 倍）          |
| dailyReleaseRate | uint256 | public | 日释放比例（千分比，默认 8‰）  |
| releaseCycle     | uint256 | public | 释放周期（天，仅记录）         |
| gdaPool          | uint256 | public | GDA 奖励矿池总量               |

## 映射变量

| 变量名                | 类型                        | 可见性 | 描述                                     |
| --------------------- | --------------------------- | ------ | ---------------------------------------- |
| userPurchasedShares   | mapping(address => uint256) | public | 记录用户购买的份额数量                   |
| dailyPurchased        | mapping(uint256 => uint256) | public | 记录每日购买的份额数量（键为日期时间戳） |
| pausedRewards         | mapping(address => bool)    | public | 记录用户奖励领取开关状态                 |
| userFirstPurchaseTime | mapping(address => uint256) | public | 记录用户首次购买时间戳                   |
| userTotalGDA          | mapping(address => uint256) | public | 记录用户可释放的 GDA 总量                |
| userReleasedGDA       | mapping(address => uint256) | public | 记录用户已释放的 GDA 数量                |
| lastClaimTime         | mapping(address => uint256) | public | 记录用户上次领取奖励的时间戳             |

## 事件定义

| 事件名                 | 参数列表                                                   | 描述                            |
| ---------------------- | ---------------------------------------------------------- | ------------------------------- |
| OwnershipTransferred   | previousOwner (address), newOwner (address)                | 合约所有权转移时触发            |
| SharesPurchased        | buyer (address), shares (uint256), usdtPaid (uint256)      | 用户购买份额时触发              |
| RewardsClaimed         | user (address), amount (uint256), elapsedMinutes (uint256) | 用户领取奖励时触发              |
| AdminConfigUpdated     | configType (string)                                        | 管理员更新配置时触发            |
| RewardPoolUpdated      | newAmount (uint256)                                        | 奖励矿池更新时触发              |
| RewardStatusToggled    | user (address), paused (bool)                              | 用户奖励状态切换时触发          |
| GDAWithdrawnToMerchant | merchant (address), amount (uint256)                       | 管理员提取 GDA 到商户地址时触发 |
| USDTAddressUpdated     | newUSDT (address)                                          | USDT 代币地址更新时触发         |
| GDAAddressUpdated      | newGDA (address)                                           | GDA 代币地址更新时触发          |

## 修饰符

| 修饰符名      | 逻辑实现                                                                                    | 描述                   |
| ------------- | ------------------------------------------------------------------------------------------- | ---------------------- |
| onlyOwner     | `require(msg.sender == owner, "Not owner")`                                                 | 限制仅合约所有者可调用 |
| duringPresale | `require(block.timestamp >= startTime && block.timestamp <= endTime, "Presale not active")` | 限制仅预售期间可调用   |

## 构造函数

```
constructor(

&#x20;   address \_usdt,

&#x20;   address \_gda,

&#x20;   address \_admin,

&#x20;   address \_merchant,

&#x20;   uint256 \_startTime

)
```

### 参数说明

| 参数名      | 类型    | 描述                               |
| ----------- | ------- | ---------------------------------- |
| \_usdt      | address | USDT 代币合约地址                  |
| \_gda       | address | GDA 代币合约地址                   |
| \_admin     | address | 初始管理员地址                     |
| \_merchant  | address | 商户地址（接收 USDT）              |
| \_startTime | uint256 | 预售开始时间戳（必须晚于当前时间） |

### 功能说明

- 初始化合约核心参数，包括代币地址、管理员、商户地址及预售时间

- 设置默认配置：奖励倍数 3 倍、日释放比例 8‰、总份额 5000 份、每日限购 500 份

- 触发`OwnershipTransferred`事件确认初始所有权

## 核心功能接口

### 1. 所有权管理

#### transferOwnership

```
function transferOwnership(address newOwner) public onlyOwner
```

- **参数**：`newOwner`（新所有者地址）

- **功能**：转移合约所有权

- **访问控制**：仅当前所有者

- **前置条件**：新地址不为零地址

### 2. 预售核心功能

#### buyShares

```
function buyShares(uint256 shares) external duringPresale
```

- **参数**：`shares`（购买的份额数量）

- **功能**：用户购买预售份额，需支付对应 USDT

- **访问控制**：任意用户（需在预售期间）

- **前置条件**：

  - 份额数量大于 0

  - 不超过当日限购额度

  - 不超过地址限购额度

  - 不超过总发行份额

- **流程**：

1.  验证购买条件及额度限制

2.  从用户地址转账 USDT 到商户地址

3.  计算用户可获得的 GDA 总量（含奖励倍数）

4.  更新用户及全局购买记录

5.  触发`SharesPurchased`事件

#### claimRewards

```
function claimRewards() external
```

- **功能**：用户领取可释放的 GDA 奖励

- **访问控制**：任意用户（需满足领取条件）

- **前置条件**：

  - 奖励未被暂停

  - 用户有可释放的 GDA 余额

  - 存在购买记录

  - 距离上次领取有时间间隔

- **流程**：

1.  计算从上次领取到当前的分钟数

2.  按日释放比例计算可领取数量（`剩余量 × 日释放比例 × 分钟数 ÷ (1000 × 1440)`）

3.  从矿池转账 GDA 到用户地址

4.  更新释放记录及矿池余额

5.  触发`RewardsClaimed`事件

### 3. 管理员功能

#### withdrawGDAtoMerchant

```
function withdrawGDAtoMerchant(uint256 amount) external onlyOwner
```

- **参数**：`amount`（提取的 GDA 数量）

- **功能**：将合约中的 GDA 提取到商户地址

- **访问控制**：仅所有者

- **前置条件**：

  - 提取数量大于 0

  - 商户地址有效

  - 合约中 GDA 余额充足

- **流程**：

1.  验证提取条件及余额

2.  从合约转账 GDA 到商户地址

3.  同步更新矿池记录（若提取矿池内资金）

4.  触发`GDAWithdrawnToMerchant`事件

#### updateBasicConfig

```
function updateBasicConfig(address \_newAdmin, address \_newMerchant) external onlyOwner
```

- **参数**：`_newAdmin`（新管理员地址）、`_newMerchant`（新商户地址）

- **功能**：更新管理员及商户地址

- **访问控制**：仅当前所有者

- **前置条件**：新地址均不为零地址

- **流程**：

1.  转移合约所有权到新管理员

2.  更新商户地址

3.  触发`AdminConfigUpdated`事件

#### setUSDTAddress / setGDAAddress

```
function setUSDTAddress(address \_newUSDT) external onlyOwner

function setGDAAddress(address \_newGDA) external onlyOwner
```

- **参数**：`_newUSDT`/`_newGDA`（新代币地址）

- **功能**：更新 USDT/GDA 代币合约地址

- **访问控制**：仅所有者

- **前置条件**：新地址不为零地址

- **事件**：分别触发`USDTAddressUpdated`/`GDAAddressUpdated`

#### updateRewardConfig

```
function updateRewardConfig(

&#x20;   uint256 \_multiplier,

&#x20;   uint256 \_releaseRate,

&#x20;   uint256 \_cycle

) external onlyOwner
```

- **参数**：

  - `_multiplier`：奖励倍数（≥1）

  - `_releaseRate`：日释放比例（0-1000，千分比）

  - `_cycle`：释放周期（天）

- **功能**：更新奖励释放相关配置

- **访问控制**：仅所有者

- **事件**：触发`AdminConfigUpdated`

#### addToGDAPool

```
function addToGDAPool(uint256 amount) external onlyOwner
```

- **参数**：`amount`（增加的 GDA 数量）

- **功能**：向奖励矿池添加 GDA（注：当前版本无需转账，仅更新矿池记录）

- **访问控制**：仅所有者

- **前置条件**：数量大于 0

- **事件**：触发`RewardPoolUpdated`

#### updatePresaleConfig

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

- **参数**：预售相关配置（总量、单价、时间、限购等）

- **功能**：更新预售核心参数（开始时间仅允许设置为未来时间）

- **访问控制**：仅所有者

- **事件**：触发`AdminConfigUpdated`

#### toggleRewardStatus

```
function toggleRewardStatus(address user, bool paused) external onlyOwner
```

- **参数**：`user`（用户地址）、`paused`（暂停状态）

- **功能**：开关用户的奖励领取功能

- **访问控制**：仅所有者

- **事件**：触发`RewardStatusToggled`

### 4. 查询接口

#### getPresaleInfo

```
function getPresaleInfo() external view returns (

&#x20;   uint256 \_totalTokens,

&#x20;   uint256 \_sharePrice,

&#x20;   address \_gdaToken,

&#x20;   address \_usdtToken,

&#x20;   uint256 \_startTime,

&#x20;   uint256 \_endTime,

&#x20;   uint256 \_purchasedShares,

&#x20;   uint256 \_remainingShares,

&#x20;   uint256 \_dailyLimit,

&#x20;   uint256 \_addressLimit

)
```

- **功能**：查询预售核心信息（含总量、价格、时间、剩余份额等）

- **返回值**：预售相关参数组合

#### getUserInfo

```
function getUserInfo(address user) external view returns (

&#x20;   uint256 userPurchased,

&#x20;   uint256 totalGDA,

&#x20;   uint256 releasedGDA,

&#x20;   uint256 firstPurchaseTime,

&#x20;   uint256 lastClaim,

&#x20;   bool isPaused

)
```

- **参数**：`user`（用户地址）

- **功能**：查询指定用户的购买及奖励状态

- **返回值**：用户购买份额、可释放总量、已释放量等信息

#### getAvailableRewards

```
function getAvailableRewards(address user) external view returns (uint256)
```

- **参数**：`user`（用户地址）

- **功能**：计算用户当前可领取的 GDA 奖励数量

- **返回值**：可领取的 GDA 数量（按分钟计算）

#### getTodayRemainingShares

```
function getTodayRemainingShares() external view returns (uint256)
```

- **功能**：查询当日剩余可购买的份额数量

- **返回值**：当日剩余份额（`dailyLimit - 今日已购`）

## 接口调用流程示例

### 用户购买流程

1.  调用`getPresaleInfo()`确认预售状态及参数

2.  调用`getTodayRemainingShares()`确认当日可购额度

3.  调用`usdt.approve(presaleAddress, 购买金额)`授权 USDT 转账

4.  调用`buyShares(shares)`完成购买（自动扣减 USDT 并记录份额）

### 奖励领取流程

1.  调用`getUserInfo(userAddress)`查看奖励状态

2.  调用`getAvailableRewards(userAddress)`查询可领取数量

3.  调用`claimRewards()`领取奖励（自动转账并更新记录）

### 管理员配置流程

1.  部署合约后，调用`updatePresaleConfig()`设置份额价格、限购等参数

2.  调用`addToGDAPool()`初始化奖励矿池

3.  预售期间通过`toggleRewardStatus()`管理异常用户

4.  预售结束后调用`withdrawGDAtoMerchant()`提取剩余资金

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;



/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `from` to `to` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

/**
 * @dev Interface for the optional metadata functions from the ERC20 standard.
 *
 * _Available since v4.1._
 */
interface IERC20Metadata is IERC20 {
    /**
     * @dev Returns the name of the token.
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the symbol of the token.
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the decimals places of the token.
     */
    function decimals() external view returns (uint8);
}

interface IFACTORY {
    function proofRevenueAddress() external view returns (address);

    function proofRewardPoolAddress() external view returns (address);
}


interface IProofNonReflectionTokenCutter is IERC20, IERC20Metadata {
    struct BaseData {
        string tokenName;
        string tokenSymbol;
        uint256 initialSupply;
        uint256 percentToLP;
        address owner;
        address dev;
        address main;
        address routerAddress;
        address initialProofAdmin;
        uint256 antiSnipeDuration;
    }

    function setBasicData(
        BaseData memory _baseData,
        ProofNonReflectionTokenFees.allFees memory fees
    ) external;

    function changeIsTxLimitExempt(
        address holder,
        bool exempt
    ) external;
}


interface ITeamFinanceLocker {
    function lockToken(
        address _tokenAddress,
        address _withdrawalAddress,
        uint256 _amount,
        uint256 _unlockTime,
        bool _mintNFT,
        address referrer
    ) external payable returns (uint256 _id);
}


interface ITokenCutter {
    function swapTradingStatus() external;

    function setLaunchedAt() external;

    function cancelToken() external;
}


interface IUniswapV2Factory {
    function createPair(address tokenA, address tokenB)
        external
        returns (address pair);
}



interface IUniswapV2Router02 {
    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external;

    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable;

    function factory() external pure returns (address);

    function WETH() external pure returns (address);

    function addLiquidityETH(
        address token,
        uint256 amountTokenDesired,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline
    )
        external
        payable
        returns (
            uint256 amountToken,
            uint256 amountETH,
            uint256 liquidity
        );

    function removeLiquidityETH(
        address token,
        uint256 liquidity,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountToken, uint256 amountETH);
}


abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}


abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
        _transferOwnership(_msgSender());
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(
            newOwner != address(0),
            "Ownable: new owner is the zero address"
        );
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}


library ProofNonReflectionTokenFees {
    struct allFees {
        uint256 mainFee;
        uint256 mainFeeOnSell;
        uint256 lpFee;
        uint256 lpFeeOnSell;
        uint256 devFee;
        uint256 devFeeOnSell;
    }
}



contract ProofNonReflectionTokenCutter is Context, IProofNonReflectionTokenCutter {
    //This token was created with PROOF, and audited by Solidity Finance — https://proofplatform.io/projects
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    uint256 private _totalSupply;

    string private _name;
    string private _symbol;

    address constant DEAD = 0x000000000000000000000000000000000000dEaD;
    address constant ZERO = 0x0000000000000000000000000000000000000000;
    address public proofAdmin;

    bool public restrictWhales = true;

    mapping(address => bool) public isFeeExempt;
    mapping(address => bool) public isTxLimitExempt;
    mapping(address => bool) public isDividendExempt;

    uint256 public launchedAt;
    uint256 public proofFee = 2;

    uint256 public mainFee;
    uint256 public lpFee;
    uint256 public devFee;

    uint256 public mainFeeOnSell;
    uint256 public lpFeeOnSell;
    uint256 public devFeeOnSell;

    uint256 public totalFee;
    uint256 public totalFeeIfSelling;

    IUniswapV2Router02 public router;
    address public pair;
    address public factory;
    address public tokenOwner;
    address payable public devWallet;

    address payable public mainWallet;

    bool inSwapAndLiquify;
    bool public swapAndLiquifyEnabled = true;
    bool public tradingStatus = true;

    mapping(address => bool) public bots;

    uint256 public antiSnipeDuration;
    uint256 public antiSnipeEndTime;

    uint256 public _maxTxAmount;
    uint256 public _walletMax;
    uint256 public swapThreshold;

    constructor() {
        factory = msg.sender;
    }

    modifier lockTheSwap() {
        inSwapAndLiquify = true;
        _;
        inSwapAndLiquify = false;
    }

    modifier onlyProofAdmin() {
        require(proofAdmin == _msgSender(), "Caller is not the proofAdmin");
        _;
    }

    modifier onlyOwner() {
        require(tokenOwner == _msgSender(), "Caller is not the owner");
        _;
    }

    modifier onlyFactory() {
        require(factory == _msgSender(), "Caller is not the factory");
        _;
    }

    function setBasicData(
        BaseData memory _baseData,
        ProofNonReflectionTokenFees.allFees memory fees
    ) external onlyFactory {
        _name = _baseData.tokenName;
        _symbol = _baseData.tokenSymbol;
        _totalSupply = _baseData.initialSupply;

        //Tx & Wallet Limits
        require(_baseData.percentToLP >= 70, "Too low");
        _maxTxAmount = (_baseData.initialSupply * 5) / 1000;
        _walletMax = (_baseData.initialSupply * 1) / 100;
        swapThreshold = (_baseData.initialSupply * 5) / 4000;

        router = IUniswapV2Router02(_baseData.routerAddress);
        pair = IUniswapV2Factory(router.factory()).createPair(
            router.WETH(),
            address(this)
        );

        _allowances[address(this)][address(router)] = type(uint256).max;

        isFeeExempt[address(this)] = true;
        isFeeExempt[factory] = true;
        isFeeExempt[_baseData.owner] = true;

        isTxLimitExempt[_baseData.owner] = true;
        isTxLimitExempt[pair] = true;
        isTxLimitExempt[factory] = true;
        isTxLimitExempt[DEAD] = true;
        isTxLimitExempt[ZERO] = true;

        //Fees
        lpFee = fees.lpFee;
        lpFeeOnSell = fees.lpFeeOnSell;
        devFee = fees.devFee;
        devFeeOnSell = fees.devFeeOnSell;
        mainFee = fees.mainFee;
        mainFeeOnSell = fees.mainFeeOnSell;

        totalFee = devFee + lpFee + mainFee + proofFee;
        totalFeeIfSelling =
            devFeeOnSell +
            lpFeeOnSell +
            mainFeeOnSell +
            proofFee;

        require(totalFee <= 12, "Too high");
        require(totalFeeIfSelling <= 17, "Too high");

        tokenOwner = _baseData.owner;
        devWallet = payable(_baseData.dev);
        mainWallet = payable(_baseData.main);
        proofAdmin = _baseData.initialProofAdmin;

        //Initial supply
        uint256 forLP = (_baseData.initialSupply * _baseData.percentToLP) / 100; //95%
        uint256 forOwner = _baseData.initialSupply - forLP; //5%

        _balances[msg.sender] += forLP;
        _balances[_baseData.owner] += forOwner;

        antiSnipeDuration = _baseData.antiSnipeDuration;

        emit Transfer(address(0), msg.sender, forLP);
        emit Transfer(address(0), _baseData.owner, forOwner);
    }

    //proofAdmin functions

    function updateProofAdmin(
        address newAdmin
    ) external virtual onlyProofAdmin {
        proofAdmin = newAdmin;
    }

    //Factory functions
    function swapTradingStatus() external onlyFactory {
        tradingStatus = !tradingStatus;
    }

    function setLaunchedAt() external onlyFactory {
        require(launchedAt == 0, "launched");
        launchedAt = block.timestamp;
        antiSnipeEndTime = block.timestamp + antiSnipeDuration;
    }

    function cancelToken() external onlyFactory {
        isFeeExempt[address(router)] = true;
        isTxLimitExempt[address(router)] = true;
        isTxLimitExempt[tokenOwner] = true;
        tradingStatus = true;
        restrictWhales = false;
        swapAndLiquifyEnabled = false;
    }

    //Owner functions
    function changeRestrictWhales(bool _enable) external onlyOwner {
        restrictWhales = _enable;
    }

    function changeFees(
        uint256 initialMainFee,
        uint256 initialMainFeeOnSell,
        uint256 initialLpFee,
        uint256 initialLpFeeOnSell,
        uint256 initialDevFee,
        uint256 initialDevFeeOnSell
    ) external onlyOwner {
        mainFee = initialMainFee;
        lpFee = initialLpFee;
        devFee = initialDevFee;

        mainFeeOnSell = initialMainFeeOnSell;
        lpFeeOnSell = initialLpFeeOnSell;
        devFeeOnSell = initialDevFeeOnSell;

        totalFee = devFee + lpFee + proofFee + mainFee;
        totalFeeIfSelling =
            devFeeOnSell +
            lpFeeOnSell +
            proofFee +
            mainFeeOnSell;

        require(totalFee <= 12, "High fee");
        require(totalFeeIfSelling <= 17, "High fee");
    }

    function changeTxLimit(uint256 newLimit) external onlyOwner {
        require(launchedAt != 0, "!launched");
        require(newLimit >= (_totalSupply * 5) / 1000, "Min 0.5%");
        require(newLimit <= (_totalSupply * 3) / 100, "Max 3%");
        _maxTxAmount = newLimit;
    }

    function changeWalletLimit(uint256 newLimit) external onlyOwner {
        require(launchedAt != 0, "!launched");
        require(newLimit >= (_totalSupply * 5) / 1000, "Min 0.5%");
        require(newLimit <= (_totalSupply * 3) / 100, "Max 3%");
        _walletMax = newLimit;
    }

    function changeIsFeeExempt(address holder, bool exempt) external onlyOwner {
        isFeeExempt[holder] = exempt;
    }

    function changeIsTxLimitExempt(
        address holder,
        bool exempt
    ) external onlyOwner {
        isTxLimitExempt[holder] = exempt;
    }

    function reduceProofFee() external onlyOwner {
        require(proofFee == 2, "!already reduced");
        require(launchedAt != 0, "!launched");
        require(block.timestamp >= launchedAt + 72 hours);

        proofFee = 1;
        totalFee = devFee + lpFee + proofFee + mainFee;
        totalFeeIfSelling =
            devFeeOnSell +
            lpFeeOnSell +
            proofFee +
            mainFeeOnSell;
    }

    function adjustProofFee(uint256 _proofFee) external onlyProofAdmin {
        require(launchedAt != 0, "!launched");
        if (block.timestamp >= launchedAt + 72 hours) {
            require(_proofFee <= 1);
            proofFee = _proofFee;
            totalFee = devFee + lpFee + proofFee + mainFee;
            totalFeeIfSelling =
                devFeeOnSell +
                lpFeeOnSell +
                proofFee +
                mainFeeOnSell;
        } else {
            require(_proofFee <= 2);
            proofFee = _proofFee;
            totalFee = devFee + lpFee + proofFee + mainFee;
            totalFeeIfSelling =
                devFeeOnSell +
                lpFeeOnSell +
                proofFee +
                mainFeeOnSell;
        }
    }

    function setDevWallet(address payable newDevWallet) external onlyOwner {
        devWallet = payable(newDevWallet);
    }

    function setMainWallet(address payable newMainWallet) external onlyOwner {
        mainWallet = newMainWallet;
    }

    function setOwnerWallet(address payable newOwnerWallet) external onlyOwner {
        tokenOwner = newOwnerWallet;
    }

    function changeSwapBackSettings(
        bool enableSwapBack,
        uint256 newSwapBackLimit
    ) external onlyOwner {
        swapAndLiquifyEnabled = enableSwapBack;
        swapThreshold = newSwapBackLimit;
    }

    function delBot(address notbot) external {
        address sender = _msgSender();
        require(
            sender == proofAdmin || sender == tokenOwner,
            "Caller doesn't have permission"
        );
        bots[notbot] = false;
    }

    function getCirculatingSupply() external view returns (uint256) {
        return _totalSupply - balanceOf(DEAD) - balanceOf(ZERO);
    }

    /**
     * @dev Returns the name of the token.
     */
    function name() external view virtual override returns (string memory) {
        return _name;
    }

    /**
     * @dev Returns the symbol of the token, usually a shorter version of the
     * name.
     */
    function symbol() external view virtual override returns (string memory) {
        return _symbol;
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     * For example, if `decimals` equals `2`, a balance of `505` tokens should
     * be displayed to a user as `5.05` (`505 / 10 ** 2`).
     *
     * Tokens usually opt for a value of 18, imitating the relationship between
     * Ether and Wei. This is the value {ERC20} uses, unless this function is
     * overridden;
     *
     * NOTE: This information is only used for _display_ purposes: it in
     * no way affects any of the arithmetic of the contract, including
     * {IERC20-balanceOf} and {IERC20-transfer}.
     */
    function decimals() external view virtual override returns (uint8) {
        return 9;
    }

    /**
     * @dev See {IERC20-totalSupply}.
     */
    function totalSupply() external view virtual override returns (uint256) {
        return _totalSupply;
    }

    /**
     * @dev See {IERC20-balanceOf}.
     */
    function balanceOf(
        address account
    ) public view virtual override returns (uint256) {
        return _balances[account];
    }

    /**
     * @dev See {IERC20-transfer}.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - the caller must have a balance of at least `amount`.
     */
    function transfer(
        address to,
        uint256 amount
    ) external virtual override returns (bool) {
        address owner = _msgSender();
        _transfer(owner, to, amount);
        return true;
    }

    /**
     * @dev See {IERC20-allowance}.
     */
    function allowance(
        address owner,
        address spender
    ) public view virtual override returns (uint256) {
        return _allowances[owner][spender];
    }

    /**
     * @dev See {IERC20-approve}.
     *
     * NOTE: If `amount` is the maximum `uint256`, the allowance is not updated on
     * `transferFrom`. This is semantically equivalent to an infinite approval.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function approve(
        address spender,
        uint256 amount
    ) external virtual override returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, amount);
        return true;
    }

    /**
     *
     * @dev See {IERC20-transferFrom}.
     *
     * Emits an {Approval} event indicating the updated allowance. This is not
     * required by the EIP. See the note at the beginning of {ERC20}.
     *
     * NOTE: Does not update the allowance if the current allowance
     * is the maximum `uint256`.
     *
     * Requirements:
     *
     * - `from` and `to` cannot be the zero address.
     * - `from` must have a balance of at least `amount`.
     * - the caller must have allowance for ``from``'s tokens of at least
     * `amount`.
     */

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external virtual override returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }

    /**
     * @dev Atomically increases the allowance granted to `spender` by the caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {IERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function increaseAllowance(
        address spender,
        uint256 addedValue
    ) external virtual returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, _allowances[owner][spender] + addedValue);
        return true;
    }

    /**
     * @dev Atomically decreases the allowance granted to `spender` by the caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {IERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     * - `spender` must have allowance for the caller of at least
     * `subtractedValue`.
     */
    function decreaseAllowance(
        address spender,
        uint256 subtractedValue
    ) external virtual returns (bool) {
        address owner = _msgSender();
        uint256 currentAllowance = _allowances[owner][spender];
        require(
            currentAllowance >= subtractedValue,
            "Decreased allowance below zero"
        );
        unchecked {
            _approve(owner, spender, currentAllowance - subtractedValue);
        }

        return true;
    }

    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal returns (bool) {
        require(tradingStatus, "Closed");
        require(!bots[sender] && !bots[recipient]);
        if (antiSnipeEndTime != 0 && block.timestamp < antiSnipeEndTime) {
            bots[tx.origin] = true;
            if (recipient != tx.origin) {
                revert('antisnipe');
            }
        }
        if (inSwapAndLiquify) {
            return _basicTransfer(sender, recipient, amount);
        }

        if (recipient == pair && restrictWhales) {
            require(
                amount <= _maxTxAmount ||
                    (isTxLimitExempt[sender] && isTxLimitExempt[recipient]),
                "Max TX"
            );
        }

        if (!isTxLimitExempt[recipient] && restrictWhales) {
            require(_balances[recipient] + amount <= _walletMax, "Max Wallet");
        }

        if (
            sender != pair &&
            !inSwapAndLiquify &&
            swapAndLiquifyEnabled &&
            _balances[address(this)] >= swapThreshold
        ) {
            swapBack();
        }

        _balances[sender] = _balances[sender] - amount;
        uint256 finalAmount = amount;

        if (sender == pair || recipient == pair) {
            finalAmount = !isFeeExempt[sender] && !isFeeExempt[recipient]
                ? takeFee(sender, recipient, amount)
                : amount;
        }

        _balances[recipient] = _balances[recipient] + finalAmount;

        emit Transfer(sender, recipient, finalAmount);
        return true;
    }

    function _basicTransfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal returns (bool) {
        _balances[sender] = _balances[sender] - amount;
        _balances[recipient] = _balances[recipient] + amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }

    /** @dev Creates `amount` tokens and assigns them to `account`, increasing
     * the total supply.
     *
     * Emits a {Transfer} event with `from` set to the zero address.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     */

    /**
     * @dev Sets `amount` as the allowance of `spender` over the `owner` s tokens.
     *
     * This internal function is equivalent to `approve`, and can be used to
     * e.g. set automatic allowances for certain subsystems, etc.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - `owner` cannot be the zero address.
     * - `spender` cannot be the zero address.
     */
    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        require(owner != address(0), "Approve from the zero address");
        require(spender != address(0), "Approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    /**
     * @dev Spend `amount` form the allowance of `owner` toward `spender`.
     *
     * Does not update the allowance amount in case of infinite allowance.
     * Revert if not enough allowance is available.
     *
     * Might emit an {Approval} event.
     */
    function _spendAllowance(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        uint256 currentAllowance = allowance(owner, spender);
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "Insufficient allowance");
            unchecked {
                _approve(owner, spender, currentAllowance - amount);
            }
        }
    }

    function takeFee(
        address sender,
        address recipient,
        uint256 amount
    ) internal returns (uint256) {
        uint256 feeApplicable = pair == recipient
            ? totalFeeIfSelling
            : totalFee;
        uint256 feeAmount = (amount * feeApplicable) / 100;

        _balances[address(this)] = _balances[address(this)] + feeAmount;
        emit Transfer(sender, address(this), feeAmount);

        return amount - feeAmount;
    }

    function swapBack() internal lockTheSwap {
        uint256 tokensToLiquify = _balances[address(this)];

        uint256 amountToLiquify;
        uint256 devBalance;
        uint256 proofBalance;
        uint256 amountEthLiquidity;

        // Use sell ratios if buy tax too low
        if (totalFee <= 2) {
            amountToLiquify =
                (tokensToLiquify * lpFeeOnSell) /
                totalFeeIfSelling /
                2;
        } else {
            amountToLiquify = (tokensToLiquify * lpFee) / totalFee / 2;
        }

        uint256 amountToSwap = tokensToLiquify - amountToLiquify;
        if (amountToSwap == 0) return;

        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = router.WETH();

        router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            amountToSwap,
            0,
            path,
            address(this),
            block.timestamp
        );

        uint256 amountETH = address(this).balance;

        // Use sell ratios if buy tax too low
        if (totalFee <= 2) {
            amountEthLiquidity =
                (amountETH * lpFeeOnSell) /
                totalFeeIfSelling /
                2;
        } else {
            amountEthLiquidity = (amountETH * lpFee) / totalFee / 2;
        }

        if (amountToLiquify > 0) {
            router.addLiquidityETH{value: amountEthLiquidity}(
                address(this),
                amountToLiquify,
                0,
                0,
                0x000000000000000000000000000000000000dEaD,
                block.timestamp
            );
        }

        uint256 amountETHafterLP = address(this).balance;

        // Use sell ratios if buy tax too low
        if (totalFee <= 2) {
            devBalance = (amountETHafterLP * devFeeOnSell) / totalFeeIfSelling;
            proofBalance = (amountETHafterLP * proofFee) / totalFeeIfSelling;
        } else {
            devBalance = (amountETHafterLP * devFee) / totalFee;
            proofBalance = (amountETHafterLP * proofFee) / totalFee;
        }

        uint256 amountEthMain = amountETHafterLP - devBalance - proofBalance;

        if (amountETH > 0) {
            if (proofBalance > 0) {
                uint256 revenueSplit = proofBalance / 2;
                (bool sent, ) = payable(IFACTORY(factory).proofRevenueAddress()).call{value: revenueSplit}("");
                require(sent);
                (bool sent1, ) = payable(IFACTORY(factory).proofRewardPoolAddress()).call{value: revenueSplit}("");
                require(sent1);
            }
            if (devBalance > 0) {
                (bool sent, ) = devWallet.call{value: devBalance}("");
                require(sent);
            }
            if (amountEthMain > 0) {
                (bool sent1, ) = mainWallet.call{value: amountEthMain}("");
                require(sent1);
            }
        }
    }

    receive() external payable {}
}

contract ProofNonReflectionTokenFactory is Ownable {
    struct ProofToken {
        bool status;
        address pair;
        address owner;
        uint256 unlockTime;
        uint256 lockId;
    }

    struct TokenParam {
        string tokenName;
        string tokenSymbol;
        uint256 initialSupply;
        uint256 percentToLP;
        uint256 initialMainFee;
        uint256 initialMainFeeOnSell;
        uint256 initialLpFee;
        uint256 initialLpFeeOnSell;
        uint256 initialDevFee;
        uint256 initialDevFeeOnSell;
        uint256 unlockTime;
        address operationsWallet;
        address mainWallet;
        uint256 antiSnipeDuration;
    }

    mapping(address => ProofToken) public validatedPairs;

    address public proofAdmin;
    address public routerAddress;
    address public lockerAddress;
    address payable public revenueAddress;
    address payable public rewardPoolAddress;

    event TokenCreated(address _address);

    constructor(
        address initialRouterAddress,
        address initialLockerAddress,
        address initialRewardPoolAddress,
        address initialRevenueAddress
    ) {
        routerAddress = initialRouterAddress;
        lockerAddress = initialLockerAddress;
        revenueAddress = payable(initialRevenueAddress);
        rewardPoolAddress = payable(initialRewardPoolAddress);
        proofAdmin = msg.sender;
    }

    function createToken(TokenParam memory tokenParam_) external payable {
        require(
            tokenParam_.unlockTime >= block.timestamp + 30 days,
            "unlock under 30 days"
        );
        require(msg.value >= 0.1 ether, "not enough liquidity");
        require(tokenParam_.antiSnipeDuration <= 36, "36 sec anti-snipe max");

        //create token
        ProofNonReflectionTokenFees.allFees
            memory fees = ProofNonReflectionTokenFees.allFees(
                tokenParam_.initialMainFee,
                tokenParam_.initialMainFeeOnSell,
                tokenParam_.initialLpFee,
                tokenParam_.initialLpFeeOnSell,
                tokenParam_.initialDevFee,
                tokenParam_.initialDevFeeOnSell
            );
        ProofNonReflectionTokenCutter newToken = new ProofNonReflectionTokenCutter();

        IProofNonReflectionTokenCutter(address(newToken)).setBasicData(
            IProofNonReflectionTokenCutter.BaseData(
                tokenParam_.tokenName,
                tokenParam_.tokenSymbol,
                tokenParam_.initialSupply,
                tokenParam_.percentToLP,
                msg.sender,
                tokenParam_.operationsWallet,
                tokenParam_.mainWallet,
                routerAddress,
                proofAdmin,
                tokenParam_.antiSnipeDuration
            ),
            fees
        );
        emit TokenCreated(address(newToken));

        //add liquidity
        newToken.approve(routerAddress, type(uint256).max);
        IUniswapV2Router02 router = IUniswapV2Router02(routerAddress);
        router.addLiquidityETH{value: msg.value}(
            address(newToken),
            newToken.balanceOf(address(this)),
            0,
            0,
            address(this),
            block.timestamp
        );

        // disable trading
        newToken.swapTradingStatus();

        validatedPairs[address(newToken)] = ProofToken(
            false,
            newToken.pair(),
            msg.sender,
            tokenParam_.unlockTime,
            0
        );
    }

    function finalizeToken(address tokenAddress) external payable {
        require(validatedPairs[tokenAddress].owner == msg.sender, "!owner");
        require(validatedPairs[tokenAddress].status == false, "validated");

        address _pair = validatedPairs[tokenAddress].pair;
        uint256 _unlockTime = validatedPairs[tokenAddress].unlockTime;
        IERC20(_pair).approve(lockerAddress, type(uint256).max);

        uint256 lpBalance = IERC20(_pair).balanceOf(address(this));

        uint256 _lockId = ITeamFinanceLocker(lockerAddress).lockToken{
            value: msg.value
        }(_pair, msg.sender, lpBalance, _unlockTime, false, 0x0000000000000000000000000000000000000000);
        validatedPairs[tokenAddress].lockId = _lockId;
        
        //enable trading
        ITokenCutter(tokenAddress).swapTradingStatus();
        ITokenCutter(tokenAddress).setLaunchedAt();

        validatedPairs[tokenAddress].status = true;
    }

    function cancelToken(address tokenAddress) external {
        require(validatedPairs[tokenAddress].owner == msg.sender, "!owner");
        require(validatedPairs[tokenAddress].status == false, "validated");

        address _pair = validatedPairs[tokenAddress].pair;
        address _owner = validatedPairs[tokenAddress].owner;

        IUniswapV2Router02 router = IUniswapV2Router02(routerAddress);
        IERC20(_pair).approve(routerAddress, type(uint256).max);
        uint256 _lpBalance = IERC20(_pair).balanceOf(address(this));

        // enable transfer and allow router to exceed tx limit to remove liquidity
        ITokenCutter(tokenAddress).cancelToken();
        router.removeLiquidityETH(
            address(tokenAddress),
            _lpBalance,
            0,
            0,
            _owner,
            block.timestamp
        );

        // disable transfer of token
        ITokenCutter(tokenAddress).swapTradingStatus();

        delete validatedPairs[tokenAddress];
    }

    function setLockerAddress(address newlockerAddress) external onlyOwner {
        lockerAddress = newlockerAddress;
    }

    function setRouterAddress(address newRouterAddress) external onlyOwner {
        routerAddress = payable(newRouterAddress);
    }

    function distributeExcessFunds() external onlyOwner {
        (bool sent, ) = revenueAddress.call{value: address(this).balance / 2}("");
        require(sent, "");
        (bool sent1, ) = rewardPoolAddress.call{value: address(this).balance}("");
        require(sent1, "");
    }

    function proofRevenueAddress() external view returns (address) {
        return revenueAddress;
    }

    function proofRewardPoolAddress() external view returns (address) {
        return rewardPoolAddress;
    }

    function setProofAdmin(address newProofAdmin) external onlyOwner {
        proofAdmin = newProofAdmin;
    }

    function setRevenueAddress(address newRevenueAddress) external onlyOwner {
        revenueAddress = payable(newRevenueAddress);
    }

    function setRewardPoolAddress(
        address newRewardPoolAddress
    ) external onlyOwner {
        rewardPoolAddress = payable(newRewardPoolAddress);
    }

    receive() external payable {}
}
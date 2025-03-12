// src/contract/prove_admin_min_max.js
import { fetchAccount, Mina as Mina2, PublicKey as PublicKey4, UInt32 } from "../node_modules/o1js/dist/node/index.js";

// src/abis/Bridge.js
import { PublicKey as PublicKey3, SmartContract as SmartContract3, State as State3, UInt64, method as method3, state as state3, Struct, Bool, Provable as Provable2, Field as Field2, Signature } from "../node_modules/o1js/dist/node/index.js";
import { FungibleToken } from "../node_modules/mina-fungible-token/target/index.js";

// src/abis/ValidatorManager.js
import { SmartContract as SmartContract2, State as State2, state as state2, Field, Provable, method as method2, PublicKey as PublicKey2 } from "../node_modules/o1js/dist/node/index.js";

// src/abis/Manager.js
import { SmartContract, State, state, PublicKey, method } from "../node_modules/o1js/dist/node/index.js";
var __decorate = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = function(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Manager = class extends SmartContract {
  constructor() {
    super(...arguments);
    this.admin = State();
    this.minter_1 = State();
    this.minter_2 = State();
    this.minter_3 = State();
  }
  async deploy(args) {
    await super.deploy(args);
    this.minter_1.set(args._minter_1);
    this.minter_2.set(args._minter_2);
    this.minter_3.set(args._minter_3);
    this.admin.set(args._admin);
  }
  isAdmin(sender) {
    this.admin.getAndRequireEquals().assertEquals(sender);
  }
  isMinter(sender) {
    const minter1 = this.minter_1.getAndRequireEquals();
    const minter2 = this.minter_2.getAndRequireEquals();
    const minter3 = this.minter_3.getAndRequireEquals();
    const isMinter1 = sender.equals(minter1);
    const isMinter2 = sender.equals(minter2);
    const isMinter3 = sender.equals(minter3);
    isMinter1.or(isMinter2).or(isMinter3).assertTrue("Sender is not a minter");
  }
  async changeAdmin(_admin) {
    this.isAdmin(this.sender.getAndRequireSignature());
    this.admin.set(_admin);
  }
  async changeMinter_1(_minter_1) {
    this.isAdmin(this.sender.getAndRequireSignature());
    this.minter_1.set(_minter_1);
  }
  async changeMinter_2(_minter_2) {
    this.isAdmin(this.sender.getAndRequireSignature());
    this.minter_2.set(_minter_2);
  }
  async changeMinter_3(_minter_3) {
    this.isAdmin(this.sender.getAndRequireSignature());
    this.minter_3.set(_minter_3);
  }
};
__decorate([
  state(PublicKey),
  __metadata("design:type", Object)
], Manager.prototype, "admin", void 0);
__decorate([
  state(PublicKey),
  __metadata("design:type", Object)
], Manager.prototype, "minter_1", void 0);
__decorate([
  state(PublicKey),
  __metadata("design:type", Object)
], Manager.prototype, "minter_2", void 0);
__decorate([
  state(PublicKey),
  __metadata("design:type", Object)
], Manager.prototype, "minter_3", void 0);
__decorate([
  method,
  __metadata("design:type", Function),
  __metadata("design:paramtypes", [PublicKey]),
  __metadata("design:returntype", Promise)
], Manager.prototype, "changeAdmin", null);
__decorate([
  method,
  __metadata("design:type", Function),
  __metadata("design:paramtypes", [PublicKey]),
  __metadata("design:returntype", Promise)
], Manager.prototype, "changeMinter_1", null);
__decorate([
  method,
  __metadata("design:type", Function),
  __metadata("design:paramtypes", [PublicKey]),
  __metadata("design:returntype", Promise)
], Manager.prototype, "changeMinter_2", null);
__decorate([
  method,
  __metadata("design:type", Function),
  __metadata("design:paramtypes", [PublicKey]),
  __metadata("design:returntype", Promise)
], Manager.prototype, "changeMinter_3", null);

// src/abis/ValidatorManager.js
var __decorate2 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata2 = function(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ValidatorManager = class extends SmartContract2 {
  constructor() {
    super(...arguments);
    this.validator1 = State2();
    this.validator2 = State2();
    this.validator3 = State2();
    this.manager = State2();
  }
  async deploy(args) {
    await super.deploy(args);
    this.validator1.set(args._validator1);
    this.validator2.set(args._validator2);
    this.validator3.set(args._validator3);
    this.manager.set(args._manager);
  }
  isValidator(p) {
    return this.getValidatorIndex(p).greaterThan(Field(0));
  }
  getValidatorIndex(p) {
    const isValidator1 = this.compareValidators(p, this.validator1.getAndRequireEquals());
    const isValidator2 = this.compareValidators(p, this.validator2.getAndRequireEquals());
    const isValidator3 = this.compareValidators(p, this.validator3.getAndRequireEquals());
    return Provable.if(isValidator1, Field(1), Provable.if(isValidator2, Field(2), Provable.if(isValidator3, Field(3), Field(0))));
  }
  compareValidators(p1, p2) {
    return p1.equals(p2);
  }
  async changeValidator(validator1, validator2, validator3) {
    const managerZkapp = new Manager(this.manager.getAndRequireEquals());
    managerZkapp.isAdmin(this.sender.getAndRequireSignature());
    this.validator1.set(validator1);
    this.validator2.set(validator2);
    this.validator3.set(validator3);
  }
};
__decorate2([
  state2(PublicKey2),
  __metadata2("design:type", Object)
], ValidatorManager.prototype, "validator1", void 0);
__decorate2([
  state2(PublicKey2),
  __metadata2("design:type", Object)
], ValidatorManager.prototype, "validator2", void 0);
__decorate2([
  state2(PublicKey2),
  __metadata2("design:type", Object)
], ValidatorManager.prototype, "validator3", void 0);
__decorate2([
  state2(PublicKey2),
  __metadata2("design:type", Object)
], ValidatorManager.prototype, "manager", void 0);
__decorate2([
  method2,
  __metadata2("design:type", Function),
  __metadata2("design:paramtypes", [
    PublicKey2,
    PublicKey2,
    PublicKey2
  ]),
  __metadata2("design:returntype", Promise)
], ValidatorManager.prototype, "changeValidator", null);

// src/abis/Bridge.js
var __decorate3 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata3 = function(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UnlockEvent = class extends Struct({
  receiver: PublicKey3,
  tokenAddress: PublicKey3,
  amount: UInt64,
  id: UInt64
}) {
  constructor(receiver, tokenAddress, amount, id) {
    super({ receiver, tokenAddress, amount, id });
  }
};
var LockEvent = class extends Struct({
  locker: PublicKey3,
  receipt: Field2,
  amount: UInt64,
  tokenAddress: PublicKey3
}) {
  constructor(locker, receipt, amount, tokenAddress) {
    super({ locker, receipt, amount, tokenAddress });
  }
};
var Bridge = class extends SmartContract3 {
  constructor() {
    super(...arguments);
    this.minAmount = State3();
    this.maxAmount = State3();
    this.threshold = State3();
    this.validatorManager = State3();
    this.manager = State3();
    this.events = { "Unlock": UnlockEvent, "Lock": LockEvent };
  }
  async deploy(args) {
    await super.deploy(args);
    this.minAmount.set(args.minAmount);
    this.maxAmount.set(args.maxAmount);
    this.validatorManager.set(args.validatorPub);
    this.threshold.set(args.threshold);
    this.manager.set(args.manager);
  }
  async setAmountLimits(newMinAmount, newMaxAmount) {
    const managerZkapp = new Manager(this.manager.getAndRequireEquals());
    managerZkapp.isAdmin(this.sender.getAndRequireSignature());
    this.minAmount.set(newMinAmount);
    this.maxAmount.set(newMaxAmount);
    newMinAmount.assertLessThanOrEqual(newMaxAmount);
  }
  async changeManager(newManager) {
    const managerZkapp = new Manager(this.manager.getAndRequireEquals());
    managerZkapp.isAdmin(this.sender.getAndRequireSignature());
    this.manager.set(newManager);
  }
  async changeValidatorManager(validatorManager) {
    const managerZkapp = new Manager(this.manager.getAndRequireEquals());
    managerZkapp.isAdmin(this.sender.getAndRequireSignature());
    this.validatorManager.set(validatorManager);
  }
  async lock(amount, address, tokenAddr) {
    const minAmount = this.minAmount.getAndRequireEquals();
    const maxAmount = this.maxAmount.getAndRequireEquals();
    amount.assertGreaterThanOrEqual(minAmount, "Amount is less than minimum allowed");
    amount.assertLessThanOrEqual(maxAmount, "Amount exceeds maximum allowed");
    const token = new FungibleToken(tokenAddr);
    await token.burn(this.sender.getAndRequireSignature(), amount);
    this.emitEvent("Lock", new LockEvent(this.sender.getAndRequireSignature(), address, amount, tokenAddr));
  }
  // @method async unlock(
  //   amount: UInt64,
  //   receiver: PublicKey,
  //   id: UInt64,
  //   tokenAddr: PublicKey,
  //   useSig1: Bool,
  //   validator1: PublicKey,
  //   sig1: Signature,
  //   useSig2: Bool,
  //   validator2: PublicKey,
  //   sig2: Signature,
  //   useSig3: Bool,
  //   validator3: PublicKey,
  //   sig3: Signature,
  // ) {
  //   const managerZkapp = new Manager(this.manager.getAndRequireEquals());
  //   managerZkapp.isMinter(this.sender.getAndRequireSignature());
  //   const msg = [
  //     ...receiver.toFields(),
  //     ...amount.toFields(),
  //     ...tokenAddr.toFields(),
  //   ]
  //   this.validateValidator(
  //     useSig1,
  //     validator1,
  //     useSig2,
  //     validator2,
  //     useSig3,
  //     validator3,
  //   );
  //   this.validateSig(msg, sig1, validator1, useSig1);
  //   this.validateSig(msg, sig2, validator2, useSig2);
  //   this.validateSig(msg, sig3, validator3, useSig3);
  //   const token = new FungibleToken(tokenAddr)
  //   await token.mint(receiver, amount)
  //   this.emitEvent("Unlock", new UnlockEvent(receiver, tokenAddr, amount, id));
  // }
  async unlock(amount, receiver, id, tokenAddr, useSig1, validator1, sig1, useSig2, validator2, sig2, useSig3, validator3, sig3) {
    const managerZkapp = new Manager(this.manager.getAndRequireEquals());
    managerZkapp.isMinter(this.sender.getAndRequireSignature());
    const msg = [
      ...receiver.toFields(),
      ...amount.toFields(),
      ...tokenAddr.toFields()
    ];
    await this.validateValidator(useSig1, validator1, useSig2, validator2, useSig3, validator3);
    await this.validateSig(msg, sig1, validator1, useSig1);
    await this.validateSig(msg, sig2, validator2, useSig2);
    await this.validateSig(msg, sig3, validator3, useSig3);
    const token = new FungibleToken(tokenAddr);
    await token.mint(receiver, amount);
    this.emitEvent("Unlock", new UnlockEvent(receiver, tokenAddr, amount, id));
  }
  async validateValidator(useSig1, validator1, useSig2, validator2, useSig3, validator3) {
    let count = UInt64.from(0);
    const validatorManager = new ValidatorManager(this.validatorManager.getAndRequireEquals());
    count = Provable2.if(useSig1, count.add(1), count);
    count = Provable2.if(useSig2, count.add(1), count);
    count = Provable2.if(useSig3, count.add(1), count);
    count.assertGreaterThanOrEqual(this.threshold.getAndRequireEquals(), "Not reached threshold");
    const index1 = await validatorManager.getValidatorIndex(validator1);
    const index2 = await validatorManager.getValidatorIndex(validator2);
    const index3 = await validatorManager.getValidatorIndex(validator3);
    const isValid1 = Provable2.if(useSig1, index1.equals(Field2(1)), Bool(true));
    const isValid2 = Provable2.if(useSig2, index2.equals(Field2(2)), Bool(true));
    const isValid3 = Provable2.if(useSig3, index3.equals(Field2(3)), Bool(true));
    isValid1.assertTrue("Validator1 has incorrect index");
    isValid2.assertTrue("Validator2 has incorrect index");
    isValid3.assertTrue("Validator3 has incorrect index");
  }
  async validateSig(msg, signature, validator, useSig) {
    let isValidSig = signature.verify(validator, msg);
    const isValid = Provable2.if(useSig, isValidSig, Bool(true));
    isValid.assertTrue("Invalid signature");
  }
  async verifyMsg(publicKey, msg, sig) {
    const isOk = await sig.verify(publicKey, msg);
    Provable2.log("isOk", isOk.toString());
  }
};
__decorate3([
  state3(UInt64),
  __metadata3("design:type", Object)
], Bridge.prototype, "minAmount", void 0);
__decorate3([
  state3(UInt64),
  __metadata3("design:type", Object)
], Bridge.prototype, "maxAmount", void 0);
__decorate3([
  state3(UInt64),
  __metadata3("design:type", Object)
], Bridge.prototype, "threshold", void 0);
__decorate3([
  state3(PublicKey3),
  __metadata3("design:type", Object)
], Bridge.prototype, "validatorManager", void 0);
__decorate3([
  state3(PublicKey3),
  __metadata3("design:type", Object)
], Bridge.prototype, "manager", void 0);
__decorate3([
  method3,
  __metadata3("design:type", Function),
  __metadata3("design:paramtypes", [UInt64, UInt64]),
  __metadata3("design:returntype", Promise)
], Bridge.prototype, "setAmountLimits", null);
__decorate3([
  method3,
  __metadata3("design:type", Function),
  __metadata3("design:paramtypes", [PublicKey3]),
  __metadata3("design:returntype", Promise)
], Bridge.prototype, "changeManager", null);
__decorate3([
  method3,
  __metadata3("design:type", Function),
  __metadata3("design:paramtypes", [PublicKey3]),
  __metadata3("design:returntype", Promise)
], Bridge.prototype, "changeValidatorManager", null);
__decorate3([
  method3,
  __metadata3("design:type", Function),
  __metadata3("design:paramtypes", [UInt64, Field2, PublicKey3]),
  __metadata3("design:returntype", Promise)
], Bridge.prototype, "lock", null);
__decorate3([
  method3,
  __metadata3("design:type", Function),
  __metadata3("design:paramtypes", [
    UInt64,
    PublicKey3,
    UInt64,
    PublicKey3,
    Bool,
    PublicKey3,
    Signature,
    Bool,
    PublicKey3,
    Signature,
    Bool,
    PublicKey3,
    Signature
  ]),
  __metadata3("design:returntype", Promise)
], Bridge.prototype, "unlock", null);

// src/contract/prove_admin_min_max.js
import assert2 from "assert";

// src/contract/base.js
import { config } from "../node_modules/dotenv/lib/main.js";

// src/contract/cache.js
import assert from "assert";
import { readFile } from "fs/promises";
var TOKEN_CACHE_FILE_NAMES = [
  "lagrange-basis-fp-1024",
  "lagrange-basis-fp-2048",
  "lagrange-basis-fp-4096",
  "lagrange-basis-fp-8192",
  "lagrange-basis-fp-16384",
  "lagrange-basis-fp-65536",
  "srs-fp-65536",
  "srs-fq-32768",
  "step-vk-fungibletoken-approvebase",
  "step-vk-fungibletoken-burn",
  "step-vk-fungibletoken-getbalanceof",
  "step-vk-fungibletoken-getdecimals",
  "step-vk-fungibletoken-initialize",
  "step-vk-fungibletoken-mint",
  "step-vk-fungibletoken-pause",
  "step-vk-fungibletoken-resume",
  "step-vk-fungibletoken-setadmin",
  "step-vk-fungibletoken-transfer",
  "step-vk-fungibletoken-updateverificationkey",
  "step-vk-fungibletokenadmin-canchangeadmin",
  "step-vk-fungibletokenadmin-canchangeverificationkey",
  "step-vk-fungibletokenadmin-canmint",
  "step-vk-fungibletokenadmin-canpause",
  "step-vk-fungibletokenadmin-canresume",
  "step-vk-fungibletokenadmin-updateverificationkey",
  "wrap-vk-fungibletoken",
  "wrap-vk-fungibletokenadmin"
];
var BRIDGE_CACHE_FILE_NAME = [
  "lagrange-basis-fp-1024",
  "lagrange-basis-fp-2048",
  "lagrange-basis-fp-4096",
  "lagrange-basis-fp-8192",
  "lagrange-basis-fp-16384",
  "lagrange-basis-fp-65536",
  "srs-fp-65536",
  "srs-fq-32768",
  "step-vk-bridge-changemanager",
  "step-vk-bridge-changevalidatormanager",
  "step-vk-bridge-lock",
  "step-vk-bridge-setamountlimits",
  "step-vk-bridge-unlock",
  "step-vk-manager-changeadmin",
  "step-vk-manager-changeminter_1",
  "step-vk-manager-changeminter_2",
  "step-vk-manager-changeminter_3",
  "step-vk-validatormanager-changevalidator",
  "wrap-vk-bridge",
  "wrap-vk-manager",
  "wrap-vk-validatormanager"
];
var mapTypeToCache = {
  "token": TOKEN_CACHE_FILE_NAMES,
  "bridge": BRIDGE_CACHE_FILE_NAME
};
function fetchFiles(type) {
  const listFiles = mapTypeToCache[type];
  assert(listFiles, "invalid cache");
  return Promise.all(
    listFiles.map((file) => {
      return Promise.all([
        readFile(`${process.cwd()}/cache/${file}.header`).then((res) => res.toString()),
        readFile(`${process.cwd()}/cache/${file}`).then((res) => res.toString())
      ]).then(([header, data]) => ({ file, header, data }));
    })
  ).then(
    (cacheList) => cacheList.reduce((acc, { file, header, data }) => {
      acc[file] = { file, header, data };
      return acc;
    }, {})
  );
}
function fileSystem(files) {
  return {
    read({ persistentId, uniqueId, dataType }) {
      if (!files[persistentId]) {
        return void 0;
      }
      if (dataType === "string") {
        return new TextEncoder().encode(files[persistentId].data);
      }
      return void 0;
    },
    write() {
    },
    canWrite: true
  };
}

// src/contract/base.js
import { Mina } from "../node_modules/o1js/dist/node/index.js";
import { FungibleToken as FungibleToken2 } from "../node_modules/mina-fungible-token/target/index.js";
config();
var MinaScBuilder = class {
  constructor() {
    const network = Mina.Network({
      mina: "https://api.minascan.io/node/mainnet/v1/graphql",
      archive: "https://api.minascan.io/archive/mainnet/v1/graphql/",
      networkId: "mainnet"
    });
    Mina.setActiveInstance(network);
  }
  async compileBridgeContract() {
    console.log("compiling bridge");
    await Bridge.compile({
      cache: fileSystem(fetchFiles("bridge"))
    });
    console.log("compiling bridge done");
  }
  async compileTokenContract() {
    console.log("compiling token");
    await FungibleToken2.compile({
      cache: fileSystem(fetchFiles("token"))
    });
    console.log("compiling token done");
  }
};

// src/contract/prove_admin_min_max.js
var MinaAdminMinMaxBuilder = class extends MinaScBuilder {
  constructor({
    address,
    min,
    max
  }) {
    super();
    const _bridgePubKey = process.env["MINA_BRIGDE_PUBLIC_ADDRESS"];
    console.log("bridge contract", _bridgePubKey);
    this.bridgePubKey = PublicKey4.fromBase58(_bridgePubKey);
    assert2(typeof min === "number" && min > 0, "min invalid");
    assert2(typeof max === "number" && max > 0 && max > min, "max invalid");
    this.payload = {
      address,
      min,
      max
    };
    console.log("payload", this.payload);
  }
  async build() {
    await this.compileBridgeContract();
    const pubKeysToFetch = [this.bridgePubKey, PublicKey4.fromBase58(this.payload.address)];
    await Promise.all(pubKeysToFetch.map((e) => fetchAccount({ publicKey: e })));
    const zkApp = new Bridge(this.bridgePubKey);
    const tx = await Mina2.transaction(
      {
        sender: PublicKey4.fromBase58(this.payload.address),
        fee: Number(0.1) * 1e9
      },
      async () => {
        await zkApp.setAmountLimits(new UInt32(this.payload.min), new UInt32(this.payload.max));
      }
    );
    console.log("proving");
    await tx.prove();
    console.log("proving done");
    return tx.toJSON();
  }
};

// src/shared/response-format.js
var responseFormat = (data, success = true, message = "ok") => ({ data, success, message });

// src/sign-admin-set-config.js
var sign_admin_set_config = async (payload) => {
  try {
    const data = await new MinaAdminMinMaxBuilder(payload).build();
    return responseFormat(data);
  } catch (error) {
    console.log(error);
    return responseFormat(null, false, error.message);
  }
};
export {
  sign_admin_set_config
};
